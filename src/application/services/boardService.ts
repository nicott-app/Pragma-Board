import { Ticket } from '../../domain/models/Ticket';


export const buildBoardMoveResult = ({
  activeProject,
  tickets,
  currentUserId,

  currentUserPreferences,
  sourceDroppableId,
  destinationDroppableId,
  destinationIndex,
  draggableId,
}: any) => {
  const movedTicket = tickets.find((t: Ticket) => t.id === draggableId);
  if (!movedTicket) return null;

  let destColId = destinationDroppableId;
  if (destColId.includes('::')) destColId = destColId.split('::')[1];

  let srcColId = sourceDroppableId;
  if (srcColId.includes('::')) srcColId = srcColId.split('::')[1];

  const destColumn = activeProject.columns.find((c: any) => c.id === destColId);
  if (!destColumn) return null;



  // Auto-assign
  const newAssignees = [...(movedTicket.assignees || [])];
  const isFirstColumn = destColumn.id === activeProject.columns[0]?.id;
  if (
    currentUserPreferences?.autoAssign && 
    currentUserId && 
    newAssignees.length === 0 && 
    !isFirstColumn
  ) {
    newAssignees.push(currentUserId);
  }

  // WIP Limit
  if (currentUserPreferences?.strictWip && destColumn.wip) {
    const ticketsInDest = tickets.filter((t: Ticket) => t.status === destColumn.id);
    if (ticketsInDest.length >= destColumn.wip) {
      return { kind: 'wip-limit', destColumn };
    }
  }

  // Blocked Transition
  if (destColumn.isBlocker || destColumn.label.toLowerCase().includes('bloqueado')) {
    return { kind: 'blocked-transition', targetStatus: destColumn.id };
  }

  // Calculate new orders
  const getSortKey = (t: Ticket) => t.order !== undefined && t.order !== null ? t.order : Number.MAX_SAFE_INTEGER;
  const otherTickets = tickets.filter((t: Ticket) => t.status === destColumn.id && t.id !== draggableId).sort((a: Ticket, b: Ticket) => getSortKey(a) - getSortKey(b));
  let orderUpdates = new Map<string, number>();
  
  // Insert ticket and reassign orders 10, 20, 30...
  const reordered = [...otherTickets];
  reordered.splice(destinationIndex, 0, { id: draggableId, order: 0 } as any);
  reordered.forEach((ut, index) => {
    orderUpdates.set(ut.id, (index + 1) * 10);
  }); 
  
  const updatedTickets = tickets.map((t: Ticket) => {
    if (t.id === draggableId) {
      return { ...t, status: destColumn.id, assignees: newAssignees, order: destinationIndex * 1024 };
    }
    return t;
  });



  return {
    kind: 'success',
    movedTicket,
    newStatus: destColumn.id,
    newAssignees,
    newOrder: destinationIndex * 1024,
    shouldUnblock: destColumn.id !== srcColId && movedTicket.isBlocked,
    updatedTickets,
    orderUpdates
  };
};
