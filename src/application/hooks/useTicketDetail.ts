import { LoggerService } from '../../infrastructure/services/LoggerService';
import { useState, useEffect } from 'react';
import {
  Ticket,
  Subtask,
  TimeLog,
  Comment,
  Attachment,
  HistoryEvent,
} from '../../domain/models/Ticket';
import { Note } from '../../domain/models/Note';
import { FirebaseTicketRepository } from '../../infrastructure/firebase/FirebaseTicketRepository';
import { FirebaseNotesRepository } from '../../infrastructure/firebase/FirebaseNotesRepository';
import { FirebaseStorageService } from '../../infrastructure/firebase/FirebaseStorageService';
import { TeamsNotificationService } from '../../infrastructure/notifications/TeamsNotificationService';
import { useDialogStore } from '../store/useDialogStore';
import { useAuthStore } from '../store/useAuthStore';
import { useProjectStore } from '../store/useProjectStore';
import { useDataStore } from '../store/useDataStore';
import { useUIStore } from '../store/useUIStore';
import { getProjectPermissionLevel } from '../permissions/projectPermissions';
import { SoundService } from '../../infrastructure/services/SoundService';

const ticketRepo = new FirebaseTicketRepository();
const notesRepo = new FirebaseNotesRepository();

export const useTicketDetail = (ticketId: string, onClose: () => void) => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const activeProject = useProjectStore((s) => s.activeProject);
  const tickets = useDataStore((s) => s.tickets);
  const unreviewedNotes = useDataStore((s) => s.unreviewedNotes);
  const vacations = useDataStore((s) => s.vacations);
  const setNotesOpen = useUIStore((s) => s.setNotesOpen);

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [pendingBlockStatus, setPendingBlockStatus] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [linkedNotes, setLinkedNotes] = useState<Note[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);

  useEffect(() => {
    if (!activeProject || !ticketId) return;
    let isMounted = true;
    const loadNotes = async () => {
      setIsLoadingNotes(true);
      try {
        const fetchedNotes = await notesRepo.getNotesByTicketId(activeProject.id, ticketId);
        fetchedNotes.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        if (isMounted) setLinkedNotes(fetchedNotes);
      } catch (err) {
        LoggerService.error('Error cargando notas', err);
      } finally {
        if (isMounted) setIsLoadingNotes(false);
      }
    };
    loadNotes();
    return () => {
      isMounted = false;
    };
  }, [activeProject?.id, ticketId]);

  useEffect(() => {
    const found = tickets.find((t) => t.id === ticketId);
    if (found) setTicket(found);
  }, [ticketId, tickets]);

  const permissions =
    activeProject && currentUser ? getProjectPermissionLevel(activeProject, currentUser) : null;
  const canEditTicket = permissions?.edit_tickets || false;

  const getMemberName = (uid: string) => {
    const member = activeProject?.members.find((m) => m.id === uid);
    return member?.name || uid;
  };

  const notifyIfNotAssigned = (actionDesc: string) => {
    if (
      activeProject?.teamsWebhookUrl &&
      ticket?.assignees &&
      ticket.assignees.length > 0 &&
      currentUser &&
      !ticket.assignees.includes(currentUser.uid)
    ) {
      TeamsNotificationService.notifyInteraction(
        activeProject.teamsWebhookUrl,
        ticket,
        currentUser,
        actionDesc
      );
    }
  };

  const handleUpdate = async (field: string, value: any) => {
    if (!canEditTicket || !activeProject || !currentUser || !ticket) {
      await useDialogStore
        .getState()
        .showAlert('Permiso denegado', 'No tienes permisos para modificar este ticket.');
      return;
    }
    try {
      if (value === undefined) value = null;

      const TRACKED_FIELDS: Partial<Record<keyof Ticket, (v: any, old: any) => string | null>> = {
        status: (v, old) => {
          const colNew = activeProject.columns.find((c) => c.id === v);
          const colOld = activeProject.columns.find((c) => c.id === old);
          return colOld && colNew
            ? `Estado cambiado de "${colOld.label}" a "${colNew.label}"`
            : null;
        },
        priority: (v, old) => {
          const labels: Record<string, string> = {
            low: 'Baja',
            medium: 'Media',
            high: 'Alta',
            critical: 'Crítica',
          };
          return `Prioridad cambiada de "${labels[old] || old}" a "${labels[v] || v}"`;
        },
        assignees: (v: string[]) => {
          const names = (v || [])
            .map((id) => activeProject.members.find((m) => m.id === id)?.name || id)
            .join(', ');
          return names ? `Asignado a: ${names}` : 'Sin asignados';
        },
        isBlocked: (v) => (v ? 'Ticket marcado como BLOQUEADO' : 'Ticket desbloqueado'),
        estimatedHours: (v) =>
          v != null ? `Estimación actualizada a ${v} horas` : 'Estimación eliminada',
        dueDate: (v) =>
          v ? `Fecha límite: ${new Date(v).toLocaleDateString('es-ES')}` : 'Fecha límite eliminada',
        title: () => 'Título actualizado',
      };

      const trackerFn = TRACKED_FIELDS[field as keyof Ticket];
      if (trackerFn) {
        const description = trackerFn(value, (ticket as any)[field]);
        if (description) {
          const event: HistoryEvent = {
            id: crypto.randomUUID(),
            action: description,
            actorId: currentUser.uid,
            actorName: getMemberName(currentUser.uid),
            timestamp: new Date().toISOString(),
          };
          const updatedHistory = [...(ticket.history || []), event];
          ticketRepo
            .updateTicket(activeProject.id, ticket.id, { history: updatedHistory })
            .catch(console.error);
          setTicket((prev) => (prev ? { ...prev, history: updatedHistory } : null));
        }
      }

      const updatedData = { [field]: value };
      setTicket((prev) => (prev ? { ...prev, ...updatedData } : null));
      await ticketRepo.updateTicket(activeProject.id, ticket.id, updatedData);

      if (field === 'status') {
        const isDoneColumn = value === activeProject.columns[activeProject.columns.length - 1]?.id;
        if (
          isDoneColumn &&
          currentUser.preferences?.soundNotifications &&
          (ticket as any)[field] !== value
        ) {
          SoundService.playSuccessSound();
        }

        if (
          (value === 'in-review' || String(value).includes('revisión')) &&
          activeProject.teamsWebhookUrl
        ) {
          TeamsNotificationService.notifyReview(
            activeProject.teamsWebhookUrl,
            { ...ticket, ...updatedData },
            currentUser
          );
        }
      }
    } catch (err: unknown) {
      LoggerService.error('Failed to update ticket', err);
      await useDialogStore
        .getState()
        .showAlert(
          'Error',
          'Error guardando en base de datos: ' + ((err as Error).message || String(err))
        );
    }
  };

  const handleReviewNote = async (noteId: string, currentReviewed: boolean) => {
    if (!activeProject) return;
    try {
      await notesRepo.updateNote(activeProject.id, noteId, { reviewed: !currentReviewed });
      setLinkedNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, reviewed: !currentReviewed } : n))
      );
    } catch (e) {
      await useDialogStore.getState().showAlert('Error', 'Error al actualizar la nota');
    }
  };

  const handleAddSubtask = (title: string) => {
    if (!ticket) return;
    const subtask: Subtask = { id: crypto.randomUUID(), title, completed: false };
    handleUpdate('subtasks', [...(ticket.subtasks || []), subtask]);
    notifyIfNotAssigned('Añadió una subtarea');
  };

  const handleToggleSubtask = (id: string, completed: boolean) => {
    if (!ticket) return;
    const updated = (ticket.subtasks || []).map((s) => (s.id === id ? { ...s, completed } : s));
    const allDone = updated.length > 0 && updated.every((s) => s.completed);
    if (allDone && ticket.status !== 'in-review' && ticket.status !== 'done') {
      handleUpdate('subtasks', updated);
      handleUpdate('status', 'in-review');
      return;
    }
    handleUpdate('subtasks', updated);
    notifyIfNotAssigned(completed ? 'Completó una subtarea' : 'Desmarcó una subtarea');
  };

  const handleDeleteSubtask = (id: string) => {
    if (!ticket) return;
    handleUpdate(
      'subtasks',
      (ticket.subtasks || []).filter((s) => s.id !== id)
    );
  };

  const handleReorderSubtasks = (fromIdx: number, toIdx: number) => {
    if (!ticket) return;
    const subs = [...(ticket.subtasks || [])];
    const [moved] = subs.splice(fromIdx, 1);
    subs.splice(toIdx, 0, moved);
    handleUpdate('subtasks', subs);
  };

  const handleAddTimeLog = (hours: number, description: string) => {
    if (!ticket || !currentUser) return;
    const log: TimeLog = {
      id: crypto.randomUUID(),
      authorId: currentUser.uid,
      authorName: getMemberName(currentUser.uid),
      hours,
      description,
      createdAt: new Date().toISOString(),
    };
    handleUpdate('timeLogs', [...(ticket.timeLogs || []), log]);
    notifyIfNotAssigned('Registró tiempo de trabajo');
  };

  const handleDeleteTimeLog = (id: string) => {
    if (!ticket) return;
    handleUpdate(
      'timeLogs',
      (ticket.timeLogs || []).filter((l) => l.id !== id)
    );
  };

  const handleAddComment = (text: string) => {
    if (!ticket || !currentUser) return;
    const comment: Comment = {
      id: crypto.randomUUID(),
      authorId: currentUser.uid,
      authorName: getMemberName(currentUser.uid),
      text,
      createdAt: new Date().toISOString(),
    };
    handleUpdate('comments', [...(ticket.comments || []), comment]);
    notifyIfNotAssigned('Añadió un comentario');
  };

  const handleDeleteComment = (id: string) => {
    if (!ticket) return;
    handleUpdate(
      'comments',
      (ticket.comments || []).filter((c) => c.id !== id)
    );
  };

  const handleUploadFile = async (file: File) => {
    if (!ticket || !activeProject || !currentUser) return;
    setUploadError(null);
    setUploadProgress(0);
    try {
      const attachment: Attachment = await FirebaseStorageService.uploadAttachment(
        activeProject.id,
        ticket.id,
        file,
        currentUser.uid,
        (pct) => setUploadProgress(pct)
      );
      const updatedAttachments = [...(ticket.attachments || []), attachment];
      await handleUpdate('attachments', updatedAttachments);

      const event: HistoryEvent = {
        id: crypto.randomUUID(),
        action: `Adjunto añadido: ${file.name}`,
        actorId: currentUser.uid,
        actorName: getMemberName(currentUser.uid),
        timestamp: new Date().toISOString(),
      };
      const updatedHistory = [...(ticket.history || []), event];
      ticketRepo
        .updateTicket(activeProject.id, ticket.id, { history: updatedHistory })
        .catch(console.error);
      setTicket((prev) => (prev ? { ...prev, history: updatedHistory } : null));
      notifyIfNotAssigned(`Añadió un archivo adjunto: ${file.name}`);
    } catch (err: unknown) {
      setUploadError('La subida de archivos no está disponible actualmente');
    } finally {
      setUploadProgress(null);
    }
  };

  const handleDeleteAttachment = async (att: Attachment) => {
    if (!ticket || !activeProject) return;
    if (
      !(await useDialogStore
        .getState()
        .showConfirm('Confirmar', `¿Eliminar el adjunto "${att.name}"?`))
    )
      return;
    try {
      await FirebaseStorageService.deleteAttachment(activeProject.id, ticket.id, att.id, att.name);
      await handleUpdate(
        'attachments',
        (ticket.attachments || []).filter((a) => a.id !== att.id)
      );
    } catch (err: unknown) {
      await useDialogStore
        .getState()
        .showAlert(
          'Error',
          'Error al eliminar el adjunto: ' + ((err as Error).message || String(err))
        );
    }
  };

  const handleDeleteTicket = async () => {
    if (!ticket || !activeProject) return;
    if (
      !(await useDialogStore
        .getState()
        .showConfirm('Confirmar', '¿Seguro que quieres eliminar este ticket?'))
    )
      return;
    try {
      await ticketRepo.deleteTicket(activeProject.id, ticket.id);
      onClose();
    } catch (err) {
      LoggerService.error(err);
      await useDialogStore.getState().showAlert('Error', 'Error al eliminar');
    }
  };

  const handleDuplicateTicket = async () => {
    if (!ticket || !activeProject) return;
    if (!(await useDialogStore.getState().showConfirm('Confirmar', '¿Duplicar este ticket?')))
      return;
    try {
      const {
        id,
        comments,
        timeLogs,
        createdAt,
        updatedAt,
        code,
        isBlocked,
        blockerReason,
        ...rest
      } = ticket as any;
      await ticketRepo.createTicket(activeProject.id, {
        ...rest,
        title: `${ticket.title} (Copia)`,
        comments: [],
        timeLogs: [],
        createdAt: new Date().toISOString(),
      });
      await useDialogStore
        .getState()
        .showAlert('Éxito', 'Ticket duplicado. Aparecerá en el tablero.');
      onClose();
    } catch (err) {
      LoggerService.error(err);
      await useDialogStore.getState().showAlert('Error', 'Error al duplicar');
    }
  };

  const handleConfirmBlock = async (reason: string) => {
    if (!ticket || !activeProject || !currentUser || !pendingBlockStatus) return;
    const statusToSet = pendingBlockStatus;
    setPendingBlockStatus(null);
    await handleUpdate('status', statusToSet);
    await handleUpdate('isBlocked', true);
    await handleUpdate('blockerReason', reason);
    if (activeProject.teamsWebhookUrl) {
      TeamsNotificationService.notifyBlocked(
        activeProject.teamsWebhookUrl,
        { ...ticket, status: statusToSet, isBlocked: true, blockerReason: reason },
        reason,
        currentUser
      );
    }
  };

  const isMemberOnVacation = (memberId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return vacations?.some(
      (v) => v.memberId === memberId && v.validated && v.startDate <= today && v.endDate >= today
    );
  };

  const formatDate = (dateVal: any) => {
    if (!dateVal) return '';
    try {
      if (dateVal.toDate) return dateVal.toDate().toLocaleDateString();
      const d = new Date(dateVal);
      return isNaN(d.getTime()) ? '' : d.toLocaleDateString();
    } catch {
      return '';
    }
  };

  return {
    ticket,
    activeProject,
    currentUser,
    unreviewedNotes,
    linkedNotes,
    isLoadingNotes,
    uploadProgress,
    uploadError,
    pendingBlockStatus,
    setPendingBlockStatus,
    handleUpdate,
    handleAddSubtask,
    handleToggleSubtask,
    handleDeleteSubtask,
    handleReorderSubtasks,
    handleAddTimeLog,
    handleDeleteTimeLog,
    handleAddComment,
    handleDeleteComment,
    handleUploadFile,
    handleDeleteAttachment,
    handleDeleteTicket,
    handleDuplicateTicket,
    handleReviewNote,
    handleConfirmBlock,
    isMemberOnVacation,
    formatDate,
    getMemberName,
    notifyIfNotAssigned,
    canEditTicket,
    setNotesOpen,
  };
};
