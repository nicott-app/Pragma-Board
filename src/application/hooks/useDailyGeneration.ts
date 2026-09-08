import { LoggerService } from '../../infrastructure/services/LoggerService';
import { useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useToastStore } from '../store/useToastStore';
import { Ticket } from '../../domain/models/Ticket';
import { GeminiService } from '../../infrastructure/ai/GeminiService';
import { getFunctions, httpsCallable } from 'firebase/functions';

export const useDailyGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string>('');
  
  const activeProject = useProjectStore(s => s.activeProject);
  const geminiApiKey = useSettingsStore(s => s.geminiApiKey);
  const geminiModel = useSettingsStore(s => s.geminiModel);
  const addToast = useToastStore(s => s.addToast);

  const getMemberName = (uid: string) => {
    return activeProject?.members.find(m => m.id === uid)?.name || uid;
  };

  const formatDoneTicket = (t: Ticket) => {
    const devStart = t.history?.find(h => h.action.toLowerCase().includes('in-progress') || h.action.toLowerCase().includes('desarrollo'))?.timestamp || t.createdAt;
    const devStartStr = devStart ? new Date(devStart).toLocaleDateString('es-ES') : 'N/A';
    const loggedHours = (t.timeLogs || []).reduce((sum, log) => sum + (log.hours || 0), 0);
    const assigneeName = t.assignees && t.assignees.length > 0 ? getMemberName(t.assignees[0]) : 'Sin asignar';
    const displayId = t.code || t.id.substring(0, 6).toUpperCase();
    
    let details = `  • [${displayId}] "${t.title}" (Asignado: ${assigneeName})\n`;
    details += `    - En desarrollo desde: ${devStartStr}\n`;
    details += `    - Horas empleadas: ${loggedHours}h\n`;
    
    if (t.comments && t.comments.length > 0) {
      details += `    - Comentarios al cerrar: ${t.comments.slice(-2).map(c => `"${c.text}"`).join(' | ')}\n`;
    }
    return details;
  };

  const formatWipTicket = (t: Ticket) => {
    const devStart = t.history?.find(h => h.action.toLowerCase().includes('in-progress') || h.action.toLowerCase().includes('desarrollo'))?.timestamp || t.createdAt;
    const devStartStr = devStart ? new Date(devStart).toLocaleDateString('es-ES') : 'N/A';
    const dueDateStr = t.dueDate ? new Date(t.dueDate).toLocaleDateString('es-ES') : 'Sin fecha prevista';
    const loggedHours = (t.timeLogs || []).reduce((sum, log) => sum + (log.hours || 0), 0);
    const completionPercent = t.estimatedHours ? Math.round((loggedHours / t.estimatedHours) * 100) : null;
    const assigneeName = t.assignees && t.assignees.length > 0 ? getMemberName(t.assignees[0]) : 'Sin asignar';
    const displayId = t.code || t.id.substring(0, 6).toUpperCase();

    const statusChanges = t.history?.filter(h => h.action === 'moved') || [];
    const lastMove = statusChanges.length > 0 ? statusChanges[statusChanges.length - 1] : null;

    let details = `  • [${displayId}] "${t.title}" (Asignado: ${assigneeName})\n`;
    
    if (lastMove && lastMove.details) {
      details += `    - Último cambio de estado: ${new Date(lastMove.timestamp).toLocaleDateString('es-ES')} (${lastMove.details})\n`;
    }
    
    details += `    - Comenzado el: ${devStartStr}\n`;
    details += `    - Fecha prevista de finalización: ${dueDateStr}\n`;
    details += `    - Progreso: ${loggedHours}h de ${t.estimatedHours || 0}h estimadas`;
    if (completionPercent !== null) {
      details += ` (porcentaje de consecución: ${completionPercent}%)\n`;
    } else {
      details += ` (sin estimación de SP)\n`;
    }
    
    if (t.comments && t.comments.length > 0) {
      details += `    - Últimos comentarios: ${t.comments.slice(-3).map(c => `[${c.authorName}]: "${c.text}"`).join(' | ')}\n`;
    }
    return details;
  };

  const formatBlockedTicket = (t: Ticket) => {
    const blockedSince = t.history?.find(h => h.action.toLowerCase().includes('blocked') || h.action.toLowerCase().includes('bloqueado'))?.timestamp || t.updatedAt || t.createdAt;
    const blockedSinceStr = blockedSince ? new Date(blockedSince).toLocaleDateString('es-ES') : 'N/A';
    const assigneeName = t.assignees && t.assignees.length > 0 ? getMemberName(t.assignees[0]) : 'Sin asignar';
    const displayId = t.code || t.id.substring(0, 6).toUpperCase();

    let details = `  • [${displayId}] "${t.title}" (Asignado: ${assigneeName})\n`;
    details += `    - Bloqueado desde el: ${blockedSinceStr}\n`;
    details += `    - Motivo del bloqueo: ${t.blockerReason || 'No especificado'}\n`;
    
    if (t.comments && t.comments.length > 0) {
      details += `    - Comentarios recientes: ${t.comments.slice(-3).map(c => `[${c.authorName}]: "${c.text}"`).join(' | ')}\n`;
    }
    return details;
  };

  const generateDaily = async (periodHours: number, done: Ticket[], inProgress: Ticket[], blocked: Ticket[]) => {
    if (!activeProject) return;
    
    setIsGenerating(true);
    setSummary('Generando resumen con IA...');
    
    const effectiveApiKey = import.meta.env.VITE_GEMINI_API_KEY || activeProject.geminiApiKey || geminiApiKey;
    
    if (effectiveApiKey) {
      try {
        const dateStr = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        
        const doneText = done.length ? done.map(formatDoneTicket).join('\n') : 'Ninguno';
        const wipText = inProgress.length ? inProgress.map(formatWipTicket).join('\n') : 'Ninguno';
        const blockedText = blocked.length ? blocked.map(formatBlockedTicket).join('\n') : 'Ninguno';

        const prompt = `Eres un Scrum Master y Project Manager experto en comunicación ágil y concisa.
Genera un resumen ejecutivo de la daily standup de hoy en español para el proyecto "${activeProject.name}".
Fecha de hoy: ${dateStr}

REGLAS IMPORTANTES:
1. Haz un resumen elaborado pero fácil de leer. No te limites a copiar y pegar, sino que redacta de forma fluida y natural aportando valor, pero manteniéndolo lo suficientemente breve como para leerse rápido en Slack/Teams.
2. Céntrate estrictamente en la información real proporcionada. Extrae jugo a los comentarios recientes, movimientos entre columnas y cambios de estado para dar contexto de en qué punto exacto están las cosas.
3. Para cada tarea completada, resume la labor realizada (basándote en los comentarios o título), horas empleadas, y menciona en qué otra(s) tarea(s) está trabajando ahora el desarrollador.
4. Para cada tarea en progreso, menciona el estado de avance, desde dónde y cuándo se movió la tarjeta, e incorpora un resumen conciso de los últimos comentarios para dar contexto del progreso actual.
5. Para cada tarea bloqueada, explica claramente por qué está bloqueada y resume si hay alguna discusión reciente en los comentarios para solucionarlo.
6. Utiliza SIEMPRE los identificadores de ticket cortos proporcionados (ej. [DA-026] o [3F1A2B]).

Aquí tienes los datos reales del proyecto de las últimas ${periodHours} horas:

TICKETS COMPLETADOS EN LAS ÚLTIMAS ${periodHours} HORAS:
${doneText}

TICKETS EN PROGRESO AHORA:
${wipText}

TICKETS BLOQUEADOS / IMPEDIMENTOS:
${blockedText}

Genera el resumen estructurado en español usando el siguiente formato:

✅ **Progreso (Últimas ${periodHours}h)**
- [Lista concisa de logros con detalles de asignación, fechas de desarrollo, horas consumidas y tareas siguientes del desarrollador asignado]

🔄 **Trabajo en Curso y Novedades**
- [Lista concisa de lo que está en progreso ahora con fechas de inicio, fechas previstas de entrega, progreso en horas/SP con su % y comentarios recientes relevantes]

⚠️ **Impedimentos y Bloqueos**
- [Lista de tickets bloqueados indicando su ID, título, responsable, fecha desde cuándo está bloqueado, motivo y comentarios desde el bloqueo]

Escribe en formato markdown limpio y directo.`;

        const result = await GeminiService.callAPI(prompt, effectiveApiKey, geminiModel);
        setSummary(result || 'Sin resultados');
        addToast('success', 'Resumen Daily generado con éxito', 'IA Completada');
      } catch (err: unknown) {
        LoggerService.error(err);
        setSummary(`Error: ${(err as Error).message}`);
        addToast('error', (err as Error).message || 'Fallo conectando con Gemini', 'Error de IA');
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Fallback to Cloud Function if no local API Key
    try {
      const { app } = await import('../../infrastructure/firebase/FirebaseConfig');
      const functions = getFunctions(app);
      const generateDailyStandup = httpsCallable(functions, 'generateDailyStandup');
      
      const allTickets = [
        ...done.map(t => ({ id: t.id, title: t.title, status: 'Completado', assignees: t.assignees })),
        ...inProgress.map(t => ({ id: t.id, title: t.title, status: 'En Progreso', assignees: t.assignees })),
        ...blocked.map(t => ({ id: t.id, title: t.title, status: 'Impedido', assignees: t.assignees, blockerReason: t.blockerReason }))
      ];

      const payload = {
        tickets: allTickets,
        promptContext: "Resume el estado del Daily Standup basado en estos tickets."
      };

      const result = await generateDailyStandup(payload);
      setSummary((result.data as any).summary || 'Sin resultados');
      addToast('success', 'Resumen Daily generado vía Cloud Functions', 'IA Completada');
    } catch (err: unknown) {
      LoggerService.error("Cloud function error:", err);
      setSummary(`Error del servidor: ${(err as Error).message || 'Error interno. Revisa que la función esté desplegada y tenga API key.'}`);
      addToast('error', (err as Error).message || 'Fallo conectando con Cloud Functions', 'Error del Servidor');
    } finally {
      setIsGenerating(false);
    }
  };

  return { summary, isGenerating, generateDaily };
};
