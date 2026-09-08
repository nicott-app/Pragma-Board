import { LoggerService } from '../services/LoggerService';
import { Ticket } from '../../domain/models/Ticket';
import { useDialogStore } from '../../application/store/useDialogStore';

export class TeamsNotificationService {
  /**
   * Send a message to a Microsoft Teams Incoming Webhook
   */
  static async sendNotification(webhookUrl: string, payload: any): Promise<boolean> {
    if (!webhookUrl) return false;

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${await response.text()}`);
      }
      return true;
    } catch (error: unknown) {
      LoggerService.error('Failed to send Teams notification', error);
      await useDialogStore.getState().showAlert(
        'Error de Notificación Teams',
        `No se pudo enviar la notificación a Teams.\n\n` +
        `Si tu Webhook de Teams rechaza la conexión, es probable que se deba a restricciones de CORS del navegador. ` +
        `Asegúrate de que la URL es correcta.\n\nDetalle: ${(error as Error).message || String(error)}`
      );
      return false;
    }
  }

  static async notifyBlocked(webhookUrl: string, ticket: Ticket, blockReason: string, user: any) {
    const payload = {
      "type": "message",
      "attachments": [
        {
          "contentType": "application/vnd.microsoft.card.adaptive",
          "content": {
            "type": "AdaptiveCard",
            "body": [
              {
                "type": "TextBlock",
                "size": "Medium",
                "weight": "Bolder",
                "text": `⚠️ TICKET BLOQUEADO: ${ticket.code || ticket.id}`,
                "color": "Attention"
              },
              {
                "type": "TextBlock",
                "text": `El ticket **${ticket.title}** ha sido bloqueado.`,
                "wrap": true
              },
              {
                "type": "FactSet",
                "facts": [
                  {
                    "title": "Motivo:",
                    "value": blockReason || "No especificado"
                  },
                  {
                    "title": "Usuario:",
                    "value": user?.name || user?.displayName || user?.email || "Usuario desconocido"
                  }
                ]
              }
            ],
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.2"
          }
        }
      ]
    };
    return this.sendNotification(webhookUrl, payload);
  }

  static async notifyReview(webhookUrl: string, ticket: Ticket, user: any) {
    const payload = {
      "type": "message",
      "attachments": [
        {
          "contentType": "application/vnd.microsoft.card.adaptive",
          "content": {
            "type": "AdaptiveCard",
            "body": [
              {
                "type": "TextBlock",
                "size": "Medium",
                "weight": "Bolder",
                "text": `🔍 TICKET EN REVISIÓN: ${ticket.code || ticket.id}`,
                "color": "Accent"
              },
              {
                "type": "TextBlock",
                "text": `El ticket **${ticket.title}** está listo para QA/Revisión.`,
                "wrap": true
              },
              {
                "type": "FactSet",
                "facts": [
                  {
                    "title": "Movido por:",
                    "value": user?.name || user?.displayName || user?.email || "Usuario desconocido"
                  }
                ]
              }
            ],
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.2"
          }
        }
      ]
    };
    return this.sendNotification(webhookUrl, payload);
  }

  static async notifyInteraction(webhookUrl: string, ticket: Ticket, user: any, actionDesc: string) {
    const payload = {
      "type": "message",
      "attachments": [
        {
          "contentType": "application/vnd.microsoft.card.adaptive",
          "content": {
            "type": "AdaptiveCard",
            "body": [
              {
                "type": "TextBlock",
                "size": "Medium",
                "weight": "Bolder",
                "text": `📝 INTERACCIÓN EN TICKET: ${ticket.code || ticket.id}`,
                "color": "Default"
              },
              {
                "type": "TextBlock",
                "text": `El usuario **${user?.name || user?.displayName || user?.email || "Desconocido"}** interactuó con tu ticket **${ticket.title}**.`,
                "wrap": true
              },
              {
                "type": "FactSet",
                "facts": [
                  {
                    "title": "Acción:",
                    "value": actionDesc
                  }
                ]
              }
            ],
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.2"
          }
        }
      ]
    };
    return this.sendNotification(webhookUrl, payload);
  }
}
