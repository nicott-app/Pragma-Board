import { LoggerService } from '../../../../infrastructure/services/LoggerService';
import React, { useState } from 'react';
import { useProjectStore } from '../../../../application/store/useProjectStore';
import { useAuthStore } from '../../../../application/store/useAuthStore';
import { useToastStore } from '../../../../application/store/useToastStore';
import { FirebaseProjectRepository } from '../../../../infrastructure/firebase/FirebaseProjectRepository';
import { encryptApiKey, decryptApiKey } from '../../../../lib/cryptoUtils';

const projectRepo = new FirebaseProjectRepository();

interface Props {
  isAdmin: boolean;
}

export const IntegrationsSettingsTab: React.FC<Props> = ({ isAdmin }) => {
  const activeProject = useProjectStore((s) => s.activeProject);
  const setActiveProject = useProjectStore((s) => s.setActiveProject);

  const [teamsWebhookUrl, setTeamsWebhookUrl] = useState(activeProject?.teamsWebhookUrl || '');
  const [geminiApiKey, setGeminiApiKey] = useState(() => 
    activeProject?.geminiApiKey ? decryptApiKey(activeProject.geminiApiKey, activeProject.ownerUid || '') : ''
  );
  const [testingWebhook, setTestingWebhook] = useState(false);

  if (!activeProject) return null;

  const handleSaveIntegrations = async () => {
    if (!isAdmin) {
      useToastStore
        .getState()
        .addToast(
          'error',
          'Solo los administradores pueden cambiar los ajustes.',
          'Permiso denegado'
        );
      return;
    }
    try {
      const encryptedKey = encryptApiKey(geminiApiKey, activeProject.ownerUid || '');
      
      await projectRepo.updateProject(activeProject.id, {
        teamsWebhookUrl,
        geminiApiKey: encryptedKey,
      });
      setActiveProject({
        ...activeProject,
        teamsWebhookUrl,
        geminiApiKey: encryptedKey,
      });
      useToastStore
        .getState()
        .addToast('success', 'Integraciones guardadas correctamente.', 'Éxito');
    } catch (e: unknown) {
      LoggerService.error(e);
      useToastStore
        .getState()
        .addToast('error', (e as Error).message || String(e), 'Error guardando integraciones');
    }
  };

  const handleRecoverKeys = async () => {
    try {
      const currentUser = useAuthStore.getState().currentUser;
      if (!currentUser) return;
      const allProjects = await projectRepo.getProjects(currentUser.email, currentUser.uid);
      const projWithKeys = allProjects.find(
        (p) => p.id !== activeProject.id && (p.geminiApiKey || p.teamsWebhookUrl)
      );

      if (projWithKeys) {
        if (projWithKeys.teamsWebhookUrl) setTeamsWebhookUrl(projWithKeys.teamsWebhookUrl);
        if (projWithKeys.geminiApiKey) setGeminiApiKey(decryptApiKey(projWithKeys.geminiApiKey, projWithKeys.ownerUid || ''));
        useToastStore
          .getState()
          .addToast('success', 'Claves recuperadas del proyecto: ' + projWithKeys.name, 'Éxito');
      } else {
        useToastStore
          .getState()
          .addToast('info', 'No se han encontrado claves en tus otros proyectos.', 'Aviso');
      }
    } catch (e) {
      useToastStore.getState().addToast('error', 'Error al buscar en otros proyectos', 'Error');
    }
  };

  const handleTestWebhook = async () => {
    if (!teamsWebhookUrl) {
      useToastStore
        .getState()
        .addToast('info', 'Introduce primero la URL del Webhook de Teams.', 'Aviso');
      return;
    }
    setTestingWebhook(true);
    try {
      const payload = {
        type: 'message',
        attachments: [
          {
            contentType: 'application/vnd.microsoft.card.adaptive',
            content: {
              type: 'AdaptiveCard',
              version: '1.2',
              $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
              body: [
                {
                  type: 'TextBlock',
                  size: 'Medium',
                  weight: 'Bolder',
                  text: '✅ Prueba de notificación desde Smartboard',
                },
                {
                  type: 'TextBlock',
                  text: 'Si ves este mensaje, las notificaciones de Teams están correctamente configuradas.',
                  wrap: true,
                },
              ],
            },
          },
        ],
      };

      const response = await fetch(teamsWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      if (response.ok) {
        useToastStore.getState().addToast('success', 'Notificación enviada a Teams', 'Éxito');
      } else {
        useToastStore
          .getState()
          .addToast('error', `Error HTTP ${response.status}: ${responseText}`, 'Error del Webhook');
      }
    } catch (err: unknown) {
      useToastStore
        .getState()
        .addToast('error', (err as Error).message || String(err), 'Error de Red');
    } finally {
      setTestingWebhook(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Integraciones</h3>
        <button
          className="btn btn-secondary"
          onClick={handleRecoverKeys}
          title="Copiar del último proyecto"
        >
          🪄 Autocompletar claves
        </button>
      </div>

      <div className="form-group">
        <label
          className="form-label"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          Microsoft Teams (Webhook URL)
        </label>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--tx-secondary)',
            marginTop: '-0.5rem',
            marginBottom: '0.5rem',
          }}
        >
          Pega aquí la URL del "Incoming Webhook" de tu canal de Teams. Funciona a través de un
          proxy CORS. Si tienes dudas, usa el botón de prueba.
        </p>
        <input
          type="text"
          className="form-input"
          value={teamsWebhookUrl}
          onChange={(e) => setTeamsWebhookUrl(e.target.value)}
          placeholder="https://TU_EMPRESA.webhook.office.com/webhookb2/..."
        />
      </div>

      <div className="form-group" style={{ marginTop: '0.5rem' }}>
        <label
          className="form-label"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          Google Gemini / Groq Llama (API Key)
        </label>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--tx-secondary)',
            marginTop: '-0.5rem',
            marginBottom: '0.5rem',
          }}
        >
          Consigue tu clave gratis en{' '}
          <a
            href="https://aistudio.google.com/"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--ac)' }}
          >
            Google AI Studio
          </a>
          . Si Google no ofrece capa gratuita en tu país, puedes usar una clave gratuita de{' '}
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--ac)' }}
          >
            Groq (Llama 3)
          </a>
          . Al pegarla aquí, la app la guardará de forma cifrada (AES-256).
        </p>
        <input
          type="password"
          className="form-input"
          value={geminiApiKey}
          onChange={(e) => setGeminiApiKey(e.target.value)}
          placeholder="AIzaSy... o gsk_..."
        />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <button
          className="btn btn-primary"
          onClick={handleSaveIntegrations}
          style={{ alignSelf: 'flex-start' }}
          disabled={!isAdmin}
        >
          Guardar Integraciones
        </button>
        <button
          className="btn btn-secondary"
          disabled={!teamsWebhookUrl || testingWebhook}
          style={{ alignSelf: 'flex-start' }}
          onClick={handleTestWebhook}
        >
          {testingWebhook ? '⏳ Enviando...' : '🧪 Probar Notificación'}
        </button>
      </div>

      <div
        style={{
          background: 'var(--bg-s2)',
          border: '1px solid var(--bd-subtle)',
          borderRadius: '8px',
          padding: '1rem',
          fontSize: '0.8rem',
          color: 'var(--tx-secondary)',
        }}
      >
        <strong style={{ display: 'block', marginBottom: '0.5rem' }}>
          Cómo configurar el Webhook con Power Automate (Recomendado):
        </strong>
        <ol style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: '1.8' }}>
          <li>
            Abre Microsoft Power Automate y crea un nuevo flujo "Instantáneo" o "Automatizado".
          </li>
          <li>
            Como disparador (Trigger) selecciona:{' '}
            <strong>Cuando se recibe una solicitud HTTP</strong>.
          </li>
          <li>
            Como acción añade: <strong>Publicar mensaje en un chat o canal (Teams)</strong>.
          </li>
          <li>Copia la URL HTTP generada en el primer paso y pégala arriba.</li>
          <li>
            Guarda y usa el botón <strong>Probar Notificación</strong> para verificar.
          </li>
        </ol>
      </div>
    </div>
  );
};
