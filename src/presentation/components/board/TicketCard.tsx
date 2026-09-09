import React, { useMemo } from 'react';
import { Ticket } from '../../../domain/models/Ticket';
import { Draggable } from '@hello-pangea/dnd';

import { useUIStore } from '../../../application/store/useUIStore';
import { useProjectStore } from '../../../application/store/useProjectStore';
import { useDataStore } from '../../../application/store/useDataStore';
import { useAuthStore } from '../../../application/store/useAuthStore';
import { useDialogStore } from '../../../application/store/useDialogStore';
import { FirebaseTicketRepository } from '../../../infrastructure/firebase/FirebaseTicketRepository';

const ticketRepo = new FirebaseTicketRepository();

interface TicketCardProps {
  ticket: Ticket;
  index: number;
  laneId: string;
}

export const TicketCard: React.FC<TicketCardProps> = React.memo(
  ({ ticket, index, laneId }) => {
    // Use granular selectors to avoid unnecessary re-renders
    const setOpenTicketId = useUIStore((s) => s.setOpenTicketId);
    const activeProjectId = useProjectStore((s) => s.activeProjectId);
    const members = useProjectStore((s) => s.activeProject?.members ?? []);
    const getMember = (uid: string) => members.find((m) => m.id === uid);

    // Only count notes for this specific ticket
    const ticketNotesCount = useDataStore(
      (s) => s.unreviewedNotes?.filter((n) => n.linkedTicketId === ticket.id).length || 0
    );

    const hideEstimations = useAuthStore((s) => s.currentUser?.preferences?.hideEstimations);
    const compactMode = useAuthStore((s) => s.currentUser?.preferences?.compactMode);

    // Memoize heavy calculations
    const isStale = useMemo(() => {
      const now = new Date();

      const toDate = (val: any) => {
        if (!val) return null;
        if (typeof val.toDate === 'function') return val.toDate();
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
      };

      let lastUpdateDate = toDate(ticket.updatedAt) || toDate(ticket.createdAt) || new Date();

      if (ticket.history && ticket.history.length > 0) {
        const historyDate = toDate(ticket.history[ticket.history.length - 1].timestamp);
        if (historyDate && historyDate > lastUpdateDate) {
          lastUpdateDate = historyDate;
        }
      }

      const diffHours = (now.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60);
      return diffHours >= 24;
    }, [ticket.history, ticket.createdAt, ticket.updatedAt]);

    const cardClasses = ['ticket-card'];
    if (ticket.isBlocked) cardClasses.push('blocked');
    if (ticket.status === 'in-review') cardClasses.push('in-review');
    if (isStale) cardClasses.push('stale');

    const typeIcons: Record<string, string> = {
      tarea: '✅',
      bug: '🐛',
      desarrollo: '💻',
      mejora: '🔄',
      incidencia: '🚨',
      analisis: '🔍',
      entregable: '📦',
    };

    const typeIcon = typeIcons[ticket.type] || '✅';
    const typeClass = `badge type-${ticket.type || 'tarea'}`;
    const priorityClass = `priority-dot ${ticket.priority || 'medium'}`;

    const subtasksTotal = ticket.subtasks?.length || 0;
    const subtasksDone = ticket.subtasks?.filter((s) => s.completed).length || 0;

    return (
      <Draggable draggableId={`${ticket.id}::${laneId}`} index={index}>
        {(provided, snapshot) => (
          <div
            className={`${cardClasses.join(' ')} ${snapshot.isDragging ? 'dragging' : ''}`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setOpenTicketId(ticket.id)}
            data-id={ticket.id}
            style={{
              ...provided.draggableProps.style,
              ...(ticket.isBlocked
                ? {
                    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                    border: '2px solid #ef4444',
                    boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)',
                  }
                : {}),
            }}
          >
            <div
              className="card-header"
              style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
            >
              <div style={{ display: 'flex', gap: '0.375rem', flex: 1, overflow: 'hidden' }}>
                <span className="card-id">{ticket.code || `#${ticket.id.substring(0, 5)}`}</span>
                <span className="card-title">{ticket.title}</span>
              </div>
              <button
                className="delete-card-btn"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (
                    await useDialogStore.getState().showConfirm('Confirmar', '¿Borrar tarjeta?')
                  ) {
                    if (activeProjectId) ticketRepo.deleteTicket(activeProjectId, ticket.id);
                  }
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--tx-muted)',
                  cursor: 'pointer',
                  padding: '0 0.2rem',
                  opacity: 0.5,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--error)';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--tx-muted)';
                  e.currentTarget.style.opacity = '0.5';
                }}
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            {!compactMode && (
              <div className="card-badges">
                <span className={typeClass} title={ticket.type}>
                  {typeIcon} {ticket.type}
                </span>
                <span className={priorityClass} title={`Prioridad ${ticket.priority}`}></span>

                {!hideEstimations &&
                  ticket.estimatedHours !== null &&
                  ticket.estimatedHours !== undefined && (
                    <span className="badge" style={{ background: 'var(--bg-s3)' }}>
                      ⌛ {ticket.estimatedHours} h
                    </span>
                  )}

                {!hideEstimations &&
                  (ticket.estimatedHours === null || ticket.estimatedHours === undefined) && (
                    <span
                      className="badge"
                      style={{
                        background: '#fef08a',
                        color: '#854d0e',
                        border: '1px solid #fde68a',
                      }}
                      title="Falta estimación de horas"
                    >
                      ⚠️ Sin estimar
                    </span>
                  )}

                {ticket.dueDate && (
                  <span className="badge" style={{ background: 'var(--bg-s3)' }}>
                    📅 {new Date(ticket.dueDate).toLocaleDateString()}
                  </span>
                )}

                {isStale && (
                  <span
                    className="badge badge-warning"
                    title="Sin actualizaciones en las últimas 24 horas"
                  >
                    💤 Sin avance
                  </span>
                )}

                {ticket.rice_score && (
                  <span className="badge" style={{ background: '#e0e7ff', color: '#3730a3', border: '1px solid #c7d2fe' }} title={`RICE: ${ticket.rice_score.rationale}`}>
                    🍚 RICE: {ticket.rice_score.total_score}
                  </span>
                )}
                {ticket.wsjf_score && (
                  <span className="badge" style={{ background: '#fce7f3', color: '#9d174d', border: '1px solid #fbcfe8' }} title={`WSJF: ${ticket.wsjf_score.rationale}`}>
                    ⚖️ WSJF: {ticket.wsjf_score.total_score}
                  </span>
                )}
                {ticket.moscow_score && (
                  <span className="badge" style={{ 
                    background: ticket.moscow_score.category === 'Must have' ? '#fee2e2' : ticket.moscow_score.category === 'Should have' ? '#fef3c7' : '#f3f4f6', 
                    color: ticket.moscow_score.category === 'Must have' ? '#991b1b' : ticket.moscow_score.category === 'Should have' ? '#92400e' : '#4b5563', 
                    border: '1px solid #e5e7eb' 
                  }} title={ticket.moscow_score.rationale}>
                    🎯 {ticket.moscow_score.category}
                  </span>
                )}
                {ticket.value_complexity_score && (
                  <span className="badge" style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }} title={ticket.value_complexity_score.rationale}>
                    📊 V/C: {ticket.value_complexity_score.quadrant}
                  </span>
                )}
                {ticket.kano_score && (
                  <span className="badge" style={{ background: '#fae8ff', color: '#86198f', border: '1px solid #f5d0fe' }} title={ticket.kano_score.rationale}>
                    😊 Kano: {ticket.kano_score.category}
                  </span>
                )}

                {ticketNotesCount > 0 && (
                  <span
                    className="badge"
                    style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}
                    title="Notas pendientes de revisar"
                  >
                    📓 {ticketNotesCount}
                  </span>
                )}
              </div>
            )}

            <div className="card-footer">
              {!compactMode &&
                ticket.tags &&
                ticket.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}

              {subtasksTotal > 0 && (
                <span
                  className="card-subtask-badge"
                  title={`Subtareas: ${subtasksDone} de ${subtasksTotal} completadas`}
                >
                  ☑ {subtasksDone}/{subtasksTotal}
                </span>
              )}

              {!compactMode && ticket.isBlocked && (
                <span className="blocked-badge" title={ticket.blockerReason || 'Bloqueado'}>
                  🛑 Bloqueado
                </span>
              )}

              {!compactMode && ticket.comments && ticket.comments.length > 0 && (
                <span className="card-comment-count">💬 {ticket.comments.length}</span>
              )}

              {!compactMode && ticket.isAI && <span className="ai-badge">✨ IA</span>}

              {ticket.assignees && ticket.assignees.length > 0 && (
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '2px' }}>
                  {ticket.assignees.map((uid) => {
                    const member = getMember(uid);
                    return (
                      <div
                        key={uid}
                        className="avatar avatar-sm"
                        title={member?.name || uid}
                        style={{ background: member?.color || '#555', fontSize: '0.65rem' }}
                      >
                        {(member?.name || uid).substring(0, 2).toUpperCase()}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.ticket === nextProps.ticket &&
      prevProps.index === nextProps.index &&
      prevProps.laneId === nextProps.laneId
    );
  }
);
