import { LoggerService } from '../../infrastructure/services/LoggerService';
import { useState, useEffect } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useAuthStore } from '../store/useAuthStore';
import { useDataStore } from '../store/useDataStore';
import { FirebaseTicketRepository } from '../../infrastructure/firebase/FirebaseTicketRepository';
import { GeminiService } from '../../infrastructure/ai/GeminiService';
import { TicketPriority, TicketType } from '../../domain/models/Ticket';
import { useToastStore } from '../store/useToastStore';

export interface BulkCategory {
  id: string;
  name: string;
  type: TicketType;
  priority: TicketPriority;
  estimatedHours: number | '';
  assigneeId: string;
  subtasks: string;
  acceptanceCriteria: string;
  isValidation: boolean;
}

const ticketRepo = new FirebaseTicketRepository();

/**
 * Detects if the user wrote in first person (Spanish patterns).
 * Used to auto-assign the ticket to the current user.
 */
const detectFirstPerson = (text: string): boolean => {
  const lower = text.toLowerCase();
  const patterns = [
    /\byo\b/, /\bestoy\b/, /\bvoy a\b/, /\bhe \b/, /\bnecesito\b/,
    /\bquiero\b/, /\btengo que\b/, /\bme han pedido\b/, /\bestamos\b/,
    /\bhemos\b/, /\bvamos a\b/, /\bmi tarea\b/, /\bme toca\b/,
    /\bme encargo\b/, /\bme han asignado\b/, /\bvoy a hacer\b/,
    /\bestoy haciendo\b/, /\bestoy trabajando\b/, /\bhe estado\b/
  ];
  return patterns.some(p => p.test(lower));
};

/**
 * Resolves the target column id based on the AI-detected time tense.
 * 'present' -> In-Progress column (or 2nd column)
 * 'future'  -> First column (Backlog)
 */
const resolveTargetStatus = (timeTense: string | undefined, columns: any[]): string => {
  if (!columns || columns.length === 0) return 'backlog';
  if (timeTense === 'present') {
    const inProgress = columns.find(c =>
      c.id.toLowerCase().includes('progress') ||
      c.id.toLowerCase().includes('progreso') ||
      c.label?.toLowerCase().includes('progreso') ||
      c.label?.toLowerCase().includes('progress') ||
      c.label?.toLowerCase().includes('en curso')
    );
    return inProgress?.id || columns[1]?.id || columns[0]?.id || 'in-progress';
  }
  return columns[0]?.id || 'backlog';
};

export const useSmartCreate = (onClose: () => void) => {
  const activeProject = useProjectStore(s => s.activeProject);
  const geminiApiKey = useSettingsStore(s => s.geminiApiKey);
  const currentUser = useAuthStore(s => s.currentUser);
  const tickets = useDataStore(s => s.tickets);
  const addToast = useToastStore(s => s.addToast);

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [mode, setMode] = useState<'ai' | 'manual' | 'bulk'>('ai');
  
  // Bulk Generation State
  const [bulkReports, setBulkReports] = useState('');
  const [bulkDesc, setBulkDesc] = useState('');
  const [bulkCategories, setBulkCategories] = useState<BulkCategory[]>([
    {
      id: crypto.randomUUID(),
      name: 'Desarrollo',
      type: 'desarrollo',
      priority: 'medium',
      estimatedHours: 8,
      assigneeId: '',
      subtasks: '1. Tarea 1\n2. Tarea 2',
      acceptanceCriteria: '',
      isValidation: false
    },
    {
      id: crypto.randomUUID(),
      name: 'QA',
      type: 'tarea',
      priority: 'medium',
      estimatedHours: 2,
      assigneeId: '',
      subtasks: '1. Prueba 1\n2. Prueba 2',
      acceptanceCriteria: 'Criterio 1\nCriterio 2',
      isValidation: true
    }
  ]);
  const [isGeneratingBulk, setIsGeneratingBulk] = useState(false);
  const [aiAssignee, setAiAssignee] = useState<string>('');
  const [aiEstimatedHours, setAiEstimatedHours] = useState<number | ''>('');
  const [aiWarnings, setAiWarnings] = useState<string[]>([]);
  
  const [dynamicExamples, setDynamicExamples] = useState<{label: string, prompt: string}[]>([]);
  const [loadingExamples, setLoadingExamples] = useState(false);

  useEffect(() => {
    if (mode === 'ai' && activeProject) {
      const cacheKey = `smart_examples_${activeProject.id}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
            setDynamicExamples(parsed.examples);
            return;
          }
        } catch (e) {
          // ignore
        }
      }
      
      if (tickets.length >= 5) {
        generateDynamicExamples();
      }
    }
  }, [mode, activeProject?.id]);

  const generateDynamicExamples = async () => {
    const effectiveApiKey = import.meta.env.VITE_GEMINI_API_KEY || activeProject?.geminiApiKey || geminiApiKey;
    if (!effectiveApiKey || !activeProject) return;
    
    setLoadingExamples(true);
    try {
      const examples = await GeminiService.generateDynamicExamples(tickets, effectiveApiKey);
      if (examples && examples.length > 0) {
        setDynamicExamples(examples);
        localStorage.setItem(`smart_examples_${activeProject.id}`, JSON.stringify({
          timestamp: Date.now(),
          examples
        }));
      }
    } catch (e) {
      LoggerService.error(e);
    } finally {
      setLoadingExamples(false);
    }
  };

  // Manual Form State
  const [manualTitle, setManualTitle] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualType, setManualType] = useState<TicketType>('tarea');
  const [manualPriority, setManualPriority] = useState<TicketPriority>('medium');
  const [manualestimatedHours, setManualestimatedHours] = useState<number | ''>('');
  const [manualAssignee, setManualAssignee] = useState<string>('');
  const [manualSprintId, setManualSprintId] = useState<string>(activeProject?.currentSprintId || '');

  const handleGenerate = async () => {
    const effectiveApiKey = import.meta.env.VITE_GEMINI_API_KEY || activeProject?.geminiApiKey || geminiApiKey;

    if (!prompt.trim() || !effectiveApiKey) {
      if (!effectiveApiKey) addToast('error', 'API Key no configurada.', 'Falta Configuración');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const generated = await GeminiService.generateTicketJSON(prompt, effectiveApiKey);
      
      let foundUid = '';
      const warnings: string[] = [];
      if (generated.assigneeName) {
        const query = generated.assigneeName.toLowerCase();
        const member = activeProject?.members.find(m => m.name.toLowerCase().includes(query));
        if (member) {
          foundUid = member.id;
        } else {
          warnings.push(`No se encontró al usuario "${generated.assigneeName}". Selecciónalo manualmente.`);
        }
      }

      // Auto-assign to current user if written in first person and no assignee detected
      if (!foundUid && detectFirstPerson(prompt) && currentUser) {
        foundUid = currentUser.uid;
      }

      setAiAssignee(foundUid);

      const hours = generated.estimatedHours ? Number(generated.estimatedHours) : '';
      if (hours === '' || isNaN(hours as number)) {
        setAiEstimatedHours('');
        warnings.push('Falta la estimación de horas. Por favor, añádela antes de guardar.');
      } else {
        setAiEstimatedHours(hours as number);
      }

      setAiWarnings(warnings);
      setResult(generated);
    } catch (err: any) {
      LoggerService.error('Gemini error:', err);
      addToast('error', err.message || 'Error de la IA al generar el ticket.', 'Error IA');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!result || !activeProject) return;
    
    if (aiEstimatedHours === '') {
      addToast('error', 'Debes introducir una estimación de horas.', 'Faltan datos');
      return;
    }

    setLoading(true);
    try {
      const targetStatus = resolveTargetStatus(result.timeTense, activeProject.columns);
      await ticketRepo.createTicket(activeProject.id, {
        title: result.title,
        description: result.description,
        type: result.type,
        priority: result.priority,
        status: targetStatus,
        assignees: aiAssignee ? [aiAssignee] : [],
        tags: result.tags || [],
        acceptanceCriteria: result.acceptanceCriteria || [],
        subtasks: result.subtasks ? result.subtasks.map((st: string) => ({ id: crypto.randomUUID(), title: st, completed: false })) : [],
        estimatedHours: Number(aiEstimatedHours),
        sprintId: result.sprintId || null,
        comments: [],
        dueDate: result.dueDate || null,
        isBlocked: result.isBlocked === true || result.isBlocked === 'true',
        blockerReason: result.blockerReason || null,
        isAI: true,
        history: [{ id: crypto.randomUUID(), action: 'created via AI', actorId: currentUser?.uid || 'system', actorName: currentUser?.email || 'Sistema', timestamp: new Date().toISOString() }]
      });
      addToast('success', 'Ticket creado correctamente mediante IA.', 'Ticket Creado');
      onClose();
    } catch (err: any) {
      LoggerService.error('Failed to create ticket', err);
      const msg = err?.message || err?.code || JSON.stringify(err);
      addToast('error', `Error al guardar el ticket: ${msg}`, 'Error de Base de Datos');
    } finally {
      setLoading(false);
    }
  };

  
  const handleBulkCreateTickets = async (onConfirmRequest: (reportsCount: number, ticketsCount: number) => Promise<boolean>) => {
    if (!activeProject) return;
    
    const reportNames = bulkReports.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    if (reportNames.length === 0) {
      addToast('info', 'Debes introducir al menos el nombre de un ticket.', 'Aviso');
      return;
    }
    
    if (bulkCategories.length === 0) {
      addToast('info', 'Debes añadir al menos una categoría de generación.', 'Aviso');
      return;
    }

    const totalTickets = reportNames.length * bulkCategories.length;
    const confirmed = await onConfirmRequest(reportNames.length, totalTickets);
    if (!confirmed) return;

    setIsGeneratingBulk(true);
    let successCount = 0;

    try {
      for (const reportName of reportNames) {
        for (const cat of bulkCategories) {
          const parsedSubtasks = cat.subtasks.split('\n').map(s => s.trim()).filter(s => s.length > 0).map(s => ({ id: crypto.randomUUID(), title: s.replace(/^[0-9]+[\.\-]\s*/, ''), completed: false }));
          const parsedAC = cat.acceptanceCriteria.split('\n').map(s => s.trim()).filter(s => s.length > 0);

          let finalDesc = bulkDesc.trim();
          if (finalDesc) finalDesc += '\n\n';
          finalDesc += `Ticket autogenerado en bloque (Categoría: ${cat.name}).`;

          await ticketRepo.createTicket(activeProject.id, {
            title: `${cat.name}: ${reportName}`,
            description: finalDesc,
            type: cat.type,
            priority: cat.priority,
            estimatedHours: cat.estimatedHours === '' ? null : Number(cat.estimatedHours),
            status: activeProject.columns[0]?.id || 'backlog',
            assignees: cat.assigneeId ? [cat.assigneeId] : [],
            tags: ['bulk'],
            acceptanceCriteria: parsedAC,
            subtasks: parsedSubtasks,
            comments: [],
            history: [],
            isBlocked: cat.isValidation,
            blockerReason: cat.isValidation ? `Esperando fase previa de ${reportName}` : null
          });
          successCount++;
        }
      }
      addToast('success', `Se han generado ${successCount} tickets correctamente.`, 'Éxito');
      onClose();
    } catch (err: any) {
      addToast('error', `Error en la generación: ${err.message}`, 'Error');
    } finally {
      setIsGeneratingBulk(false);
    }
  };

  const handleManualCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !manualTitle.trim()) return;
    setLoading(true);
    try {
      const defaultStatus = activeProject.columns[0]?.id || 'backlog';
      await ticketRepo.createTicket(activeProject.id, {
        title: manualTitle.trim(),
        description: manualDesc.trim(),
        type: manualType,
        priority: manualPriority,
        status: defaultStatus,
        assignees: manualAssignee ? [manualAssignee] : [],
        tags: [],
        acceptanceCriteria: [],
        subtasks: [],
        estimatedHours: manualestimatedHours === '' ? null : Number(manualestimatedHours),
        sprintId: manualSprintId || null,
        comments: [],
        isAI: false,
        history: [{ id: crypto.randomUUID(), action: 'created manually', actorId: currentUser?.uid || 'system', actorName: currentUser?.email || 'Sistema', timestamp: new Date().toISOString() }]
      });
      addToast('success', 'Ticket creado correctamente.', 'Ticket Creado');
      onClose();
    } catch (err: any) {
      LoggerService.error('Failed to create ticket', err);
      const msg = err?.message || err?.code || JSON.stringify(err);
      addToast('error', `Error al crear el ticket: ${msg}`, 'Error de Creación');
    } finally {
      setLoading(false);
    }
  };

  return {
    activeProject,
    prompt, setPrompt,
    mode, setMode,
    result, setResult,
    loading, setLoading,
    manualTitle, setManualTitle,
    manualDesc, setManualDesc,
    manualType, setManualType,
    manualPriority, setManualPriority,
    manualestimatedHours, setManualestimatedHours,
    manualAssignee, setManualAssignee,
    manualSprintId, setManualSprintId,
    bulkReports, setBulkReports,
    bulkDesc, setBulkDesc,
    bulkCategories, setBulkCategories,
    isGeneratingBulk,
    aiAssignee, setAiAssignee,
    aiEstimatedHours, setAiEstimatedHours,
    aiWarnings,
    dynamicExamples, loadingExamples, generateDynamicExamples,
    handleGenerate, handleConfirm, handleManualCreate, handleBulkCreateTickets
  };
};
