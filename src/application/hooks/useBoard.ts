import { LoggerService } from '../../infrastructure/services/LoggerService';
import { useState, useMemo } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { useAuthStore } from '../store/useAuthStore';
import { useProjectStore } from '../store/useProjectStore';
import { useDataStore } from '../store/useDataStore';
import { useUIStore } from '../store/useUIStore';
import { useDialogStore } from '../store/useDialogStore';
import { FirebaseTicketRepository } from '../../infrastructure/firebase/FirebaseTicketRepository';
import { FirebaseProjectRepository } from '../../infrastructure/firebase/FirebaseProjectRepository';
import { TeamsNotificationService } from '../../infrastructure/notifications/TeamsNotificationService';
import { buildBoardMoveResult } from '../services/boardService';
import { useFilteredTickets } from '../../presentation/hooks/useFilteredTickets';
import { getProjectPermissionLevel } from '../permissions/projectPermissions';
import { SoundService } from '../../infrastructure/services/SoundService';

const ticketRepo = new FirebaseTicketRepository();
const projectRepo = new FirebaseProjectRepository();

const captureException = (msg: string, err: any, ctx?: any) => {
  LoggerService.error(msg, err, ctx);
};

export const useBoard = () => {
  const currentUser = useAuthStore(s => s.currentUser);
  const activeProject = useProjectStore(s => s.activeProject);
  const setActiveProject = useProjectStore(s => s.setActiveProject);
  const tickets = useDataStore(s => s.tickets);
  const setTickets = useDataStore(s => s.setTickets);
  const groupBy = useUIStore(s => s.groupBy);
  const filteredTickets = useFilteredTickets();

  const [pendingBlock, setPendingBlock] = useState<{ ticketId: string, status: string } | null>(null);
  const [collapsedCols, setCollapsedCols] = useState<Record<string, boolean>>({});

  const toggleColumnCollapse = (colId: string) => {
    setCollapsedCols(prev => ({ ...prev, [colId]: !prev[colId] }));
  };

  const permissions = activeProject && currentUser ? getProjectPermissionLevel(activeProject, currentUser) : null;
  const isAdmin = permissions?.manage_project || false;

  const visibleColumns = useMemo(() => {
    if (!activeProject) return [];
    
    // Deduplicate columns by id to prevent fatal react-beautiful-dnd loops
    const uniqueCols = Array.from(new Map(activeProject.columns.map(c => [c.id, c])).values());
    
    if (!currentUser?.preferences?.hideDoneColumn) return uniqueCols;
    const doneColId = uniqueCols.find(c => c.id === 'done')?.id || uniqueCols[uniqueCols.length - 1]?.id;
    return uniqueCols.filter(c => c.id !== doneColId);
  }, [activeProject, currentUser?.preferences?.hideDoneColumn]);

  const handleAddColumn = async () => {
    if (!isAdmin || !activeProject) return;
    const name = await useDialogStore.getState().showPrompt('Nueva Columna', 'Introduce el nombre de la nueva columna (podrás modificar sus límites WIP o emoji desde los Ajustes del Proyecto):');
    if (!name || !name.trim()) return;
    
    const newId = `col-${Date.now()}`;
    const newCols = [...activeProject.columns, { id: newId, label: name.trim(), emoji: '📝', wip: null }];
    
    setActiveProject({ ...activeProject, columns: newCols });
    try {
      await projectRepo.updateProject(activeProject.id, { columns: newCols });
    } catch (err: unknown) {
      captureException('Failed to create column', err, { projectId: activeProject.id, userId: currentUser?.uid });
      useDialogStore.getState().showAlert('Error', 'No se pudo crear la columna: ' + ((err as Error).message || String(err)));
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination || !activeProject) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (type === 'column') {
      const draggedColId = visibleColumns[source.index].id;
      const destColId = visibleColumns[destination.index].id;
      
      const newCols = Array.from(activeProject.columns);
      const srcIdx = newCols.findIndex(c => c.id === draggedColId);
      const [removed] = newCols.splice(srcIdx, 1);
      
      const destIdx = newCols.findIndex(c => c.id === destColId);
      newCols.splice(destIdx, 0, removed);
      
      setActiveProject({ ...activeProject, columns: newCols });
      try {
        await projectRepo.updateProject(activeProject.id, { columns: newCols });
      } catch (err: unknown) {
        captureException('Failed to update columns order', err, { projectId: activeProject.id, userId: currentUser?.uid });
        await useDialogStore.getState().showAlert('Error', 'Error al guardar el orden de las columnas: ' + ((err as Error).message || String(err)));
      }
      return;
    }
    const realDraggableId = draggableId.includes('::') ? draggableId.split('::')[0] : draggableId;
    
    const move = buildBoardMoveResult({
      activeProject,
      tickets,
      currentUserId: currentUser?.uid,
      groupBy: 'none',
      currentUserPreferences: currentUser?.preferences,
      sourceDroppableId: source.droppableId,
      destinationDroppableId: destination.droppableId,
      destinationIndex: destination.index,
      draggableId: realDraggableId,
    });

    if (!move) {
      console.warn('buildBoardMoveResult returned null. Drag was ignored.', {
        realDraggableId,
        sourceDroppableId: source.droppableId,
        destinationDroppableId: destination.droppableId
      });
      return;
    }

    if (move.kind === 'wip-limit') {
      useDialogStore.getState().showAlert('WIP Limit Excedido', `La columna "${move.destColumn.label}" ya ha alcanzado su límite de ${move.destColumn.wip} tareas. (Límites estrictos activados en tus preferencias)`);
      return;
    }

    if (move.kind === 'blocked-transition') {
      setPendingBlock({ ticketId: realDraggableId, status: move.targetStatus });
      return;
    }

    setTickets(move.updatedTickets);

    try {
      const writes: Promise<void>[] = [];

      writes.push(ticketRepo.updateTicket(activeProject.id, realDraggableId, { 
        status: move.newStatus,
        assignees: move.newAssignees,
        order: move.newOrder,
        ...(move.shouldUnblock ? { isBlocked: false, blockerReason: '' } : {})
      }));

      if (move.orderUpdates) {
        move.orderUpdates.forEach((order, ticketId) => {
          if (ticketId !== realDraggableId) {
            writes.push(ticketRepo.updateTicket(activeProject.id, ticketId, { order }));
          }
        });
      }

      await Promise.all(writes);
      
      const destColId = move.newStatus;
      let srcColId = source.droppableId;
      if (srcColId.includes('::')) srcColId = srcColId.split('::')[1];

      const isDoneColumn = destColId === activeProject.columns[activeProject.columns.length - 1]?.id;
      if (isDoneColumn && currentUser?.preferences?.soundNotifications && srcColId !== destColId) {
        SoundService.playSuccessSound();
      }

      if (move.movedTicket && activeProject.teamsWebhookUrl && currentUser && (move.newStatus.includes('review') || move.newStatus.includes('revisión'))) {
        TeamsNotificationService.notifyReview(activeProject.teamsWebhookUrl, { ...move.movedTicket, status: move.newStatus }, currentUser);
      }
    } catch (err: unknown) {
      captureException('Failed to update ticket status', err, { projectId: activeProject.id, userId: currentUser?.uid, ticketId: realDraggableId });
      setTickets(tickets);
      useDialogStore.getState().showAlert('Error', 'Error al guardar el cambio de estado: ' + ((err as Error).message || String(err)));
    }
  };

  const handleConfirmBlock = async (reason: string) => {
    if (!pendingBlock || !activeProject || !currentUser) return;
    const { ticketId, status } = pendingBlock;
    setPendingBlock(null);
    
    const updatedTickets = tickets.map(t => 
      t.id === ticketId ? { ...t, status, isBlocked: true, blockerReason: reason } : t
    );
    setTickets(updatedTickets);

    try {
      await ticketRepo.updateTicket(activeProject.id, ticketId, { status, isBlocked: true, blockerReason: reason });
      const t = tickets.find(x => x.id === ticketId);
      if (t && activeProject.teamsWebhookUrl) {
        TeamsNotificationService.notifyBlocked(activeProject.teamsWebhookUrl, { ...t, status, isBlocked: true, blockerReason: reason }, reason, currentUser);
      }
    } catch (err: unknown) {
      captureException('Failed to block ticket', err, { projectId: activeProject.id, userId: currentUser?.uid, ticketId });
      setTickets(tickets);
      useDialogStore.getState().showAlert('Error', 'Error al bloquear la tarea: ' + ((err as Error).message || String(err)));
    }
  };

  const handleCancelBlock = () => {
    setPendingBlock(null);
  };

  let swimlanes = [{ id: 'none', label: 'Tablero Principal' }];
  
  if (activeProject && groupBy === 'assignee') {
    const uniqueAssignees = Array.from(new Set(filteredTickets.flatMap(t => t.assignees || []).filter(id => Boolean(id) && id !== 'unassigned')));
    swimlanes = [
      ...uniqueAssignees.map(id => {
        const member = activeProject.members.find(m => m.id === id);
        return { id, label: member ? member.name : id };
      }),
      { id: 'unassigned', label: 'Sin Asignar' }
    ];
  } else if (groupBy === 'priority') {
    swimlanes = [
      { id: 'critical', label: 'Crítica' },
      { id: 'high', label: 'Alta' },
      { id: 'medium', label: 'Media' },
      { id: 'low', label: 'Baja' }
    ];
  } else if (groupBy === 'type') {
    swimlanes = [
      { id: 'desarrollo', label: 'Desarrollo' },
      { id: 'incidencia', label: 'Incidencia' },
      { id: 'analisis', label: 'Análisis' },
      { id: 'entregable', label: 'Entregable' },
      { id: 'tarea', label: 'Tarea' },
      { id: 'bug', label: 'Bug' },
      { id: 'mejora', label: 'Mejora' }
    ];
  }

  return {
    activeProject,
    permissions,
    isAdmin,
    visibleColumns,
    collapsedCols,
    toggleColumnCollapse,
    handleAddColumn,
    onDragEnd,
    pendingBlock,
    handleConfirmBlock,
    handleCancelBlock,
    swimlanes,
    filteredTickets,
    groupBy
  };
};
