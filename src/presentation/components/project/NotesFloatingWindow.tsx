import { LoggerService } from '../../../infrastructure/services/LoggerService';
import React, { useState, useEffect } from 'react';
import { useProjectStore } from '../../../application/store/useProjectStore';
import { useAuthStore } from '../../../application/store/useAuthStore';
import { useUIStore } from '../../../application/store/useUIStore';
import { useDataStore } from '../../../application/store/useDataStore';
import { useDialogStore } from '../../../application/store/useDialogStore';
import { FirebaseNotesRepository } from '../../../infrastructure/firebase/FirebaseNotesRepository';
import { Note } from '../../../domain/models/Note';
import { TeamsNotificationService } from '../../../infrastructure/notifications/TeamsNotificationService';
import { RichTextEditor } from '../shared/RichTextEditor';

const notesRepo = new FirebaseNotesRepository();

export const NotesFloatingWindow: React.FC = () => {
  const activeProject = useProjectStore((s) => s.activeProject);
  const currentUser = useAuthStore((s) => s.currentUser);
  const setNotesOpen = useUIStore((s) => s.setNotesOpen);
  const setOpenTicketId = useUIStore((s) => s.setOpenTicketId);
  const tickets = useDataStore((s) => s.tickets);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newNoteContent, setNewNoteContent] = useState('');
  const [linkedTicketId, setLinkedTicketId] = useState('');
  const [showReviewed, setShowReviewed] = useState(false);

  // Drag logic state
  const [pos, setPos] = useState({ x: window.innerWidth - 450 - 20, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const fetchNotes = async () => {
    if (!activeProject || !currentUser) return;
    setIsLoading(true);
    try {
      const data = await notesRepo.getNotes(activeProject.id, currentUser.uid);
      data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setNotes(data);
    } catch (err) {
      LoggerService.error('Error fetching notes', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [activeProject?.id, currentUser?.uid]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setPos({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  if (!activeProject || !currentUser) return null;

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) return;

    // Detect #TICKET-ID in text if not set in select
    let resolvedTicketId = linkedTicketId || undefined;
    if (!resolvedTicketId) {
      const match = newNoteContent.match(/#([A-Za-z0-9_-]{3,15})/);
      if (match) {
        const candidate = match[1].toUpperCase();
        const matchingTicket = tickets.find((t) => t.id === candidate || t.code === candidate);
        if (matchingTicket) resolvedTicketId = matchingTicket.id;
      }
    }

    const today = new Date().toISOString().split('T')[0];
    const memberName =
      activeProject.members.find((m) => m.id === currentUser.uid)?.name || currentUser.name || 'Yo';

    try {
      const noteData = {
        projectId: activeProject.id,
        authorId: currentUser.uid,
        authorName: memberName,
        content: newNoteContent.trim(),
        linkedTicketId: resolvedTicketId,
        reviewed: false,
        sessionDate: today,
      };

      const noteId = await notesRepo.addNote(noteData);

      const newNote: Note = {
        id: noteId,
        ...noteData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setNotes([newNote, ...notes]);
      setNewNoteContent('');
      setLinkedTicketId('');

      if (resolvedTicketId && activeProject.teamsWebhookUrl) {
        const matchingTicket = tickets.find((t) => t.id === resolvedTicketId);
        if (
          matchingTicket &&
          matchingTicket.assignees &&
          matchingTicket.assignees.length > 0 &&
          !matchingTicket.assignees.includes(currentUser.uid)
        ) {
          TeamsNotificationService.notifyInteraction(
            activeProject.teamsWebhookUrl,
            matchingTicket,
            currentUser,
            'Se ha añadido una nota en tu ticket'
          );
        }
      }
    } catch (e) {
      LoggerService.error(e);
      await useDialogStore.getState().showAlert('Error', 'Error agregando nota');
    }
  };

  const handleToggleReviewed = async (id: string, currentVal: boolean) => {
    try {
      await notesRepo.updateNote(activeProject.id, id, { reviewed: !currentVal });
      setNotes(notes.map((n) => (n.id === id ? { ...n, reviewed: !currentVal } : n)));
    } catch (e) {
      LoggerService.error(e);
      await useDialogStore.getState().showAlert('Error', 'Error actualizando nota');
    }
  };

  const handleDelete = async (id: string) => {
    if (!(await useDialogStore.getState().showConfirm('Confirmar', '¿Eliminar nota?'))) return;
    try {
      await notesRepo.deleteNote(activeProject.id, id);
      setNotes(notes.filter((n) => n.id !== id));
    } catch (e) {
      LoggerService.error(e);
      await useDialogStore.getState().showAlert('Error', 'Error eliminando nota');
    }
  };

  // Group by sessionDate
  const visibleNotes = showReviewed ? notes : notes.filter((n) => !n.reviewed);
  const groups: Record<string, Note[]> = {};
  visibleNotes.forEach((note) => {
    const date = note.sessionDate || 'Sin fecha';
    if (!groups[date]) groups[date] = [];
    groups[date].push(note);
  });

  const sortedDates = Object.keys(groups).sort((a, b) => {
    if (a === 'Sin fecha') return 1;
    if (b === 'Sin fecha') return -1;
    return b.localeCompare(a);
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const formatSessionDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'Sin fecha') return dateStr;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
  };

  const dateLabel = (dateStr: string) => {
    if (dateStr === todayStr) return '📅 Hoy — ' + formatSessionDate(dateStr);
    if (dateStr === yesterdayStr) return '📅 Ayer — ' + formatSessionDate(dateStr);
    return '📅 ' + formatSessionDate(dateStr);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: Math.max(0, pos.y),
        left: Math.max(0, pos.x),
        width: 'min(450px, 90vw)',
        height: 'min(650px, 90vh)',
        background: 'var(--bg-s1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9999,
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--bd-subtle)',
      }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          padding: '1rem',
          borderBottom: '1px solid var(--bd-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-s2)',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem' }}>📓</span>
          <div>
            <h2 style={{ fontSize: '1rem', color: 'var(--tx-primary)', margin: 0 }}>
              Cuaderno de Notas
            </h2>
          </div>
        </div>
        <button
          onClick={() => setNotesOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--tx-muted)',
            cursor: 'pointer',
            fontSize: '1.2rem',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Cerrar notas"
        >
          ✕
        </button>
      </div>

      <div
        style={{
          padding: '1rem',
          borderBottom: '1px solid var(--bd-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          background: 'var(--bg-s2)',
        }}
      >
        <RichTextEditor
          value={newNoteContent}
          onChange={setNewNoteContent}
          placeholder="Escribe una nota... (usa la barra para formato)"
          minHeight="100px"
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select
            className="form-select"
            style={{ flex: 1, fontSize: '0.875rem' }}
            value={linkedTicketId}
            onChange={(e) => setLinkedTicketId(e.target.value)}
          >
            <option value="">(Vincular ticket...)</option>
            {tickets
              .filter((t) => t.status !== 'done')
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.code || `#${t.id.substring(0, 5)}`} - {t.title.substring(0, 30)}...
                </option>
              ))}
          </select>
          <button
            className="btn btn-primary"
            onClick={handleAddNote}
            disabled={!newNoteContent.trim()}
          >
            Guardar
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
          <label
            style={{
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              color: 'var(--tx-secondary)',
            }}
          >
            <input
              type="checkbox"
              checked={showReviewed}
              onChange={(e) => setShowReviewed(e.target.checked)}
            />
            Mostrar notas revisadas
          </label>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {isLoading ? (
          <p>Cargando notas...</p>
        ) : notes.length === 0 ? (
          <p style={{ color: 'var(--tx-muted)', textAlign: 'center', marginTop: '2rem' }}>
            No tienes notas. Escribe algo arriba.
          </p>
        ) : (
          sortedDates.map((dateStr) => {
            const dayNotes = groups[dateStr];
            const pendingCount = dayNotes.filter((n) => !n.reviewed).length;
            return (
              <div
                key={dateStr}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--bd-subtle)',
                    paddingBottom: '0.25rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--tx-secondary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {dateLabel(dateStr)}
                  </span>
                  {pendingCount > 0 && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        background: '#a855f7',
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        fontWeight: 600,
                      }}
                    >
                      {pendingCount} pendiente{pendingCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {dayNotes.map((n) => {
                    const isReviewed = !!n.reviewed;
                    return (
                      <div
                        key={n.id}
                        style={{
                          background: isReviewed ? 'var(--bg-s3)' : '#f0f9ff',
                          padding: '1rem',
                          borderRadius: 'var(--r-md)',
                          border: isReviewed ? '1px solid var(--bd-subtle)' : '1px solid #bae6fd',
                          position: 'relative',
                          opacity: isReviewed ? 0.8 : 1,
                          transition: 'all 0.2s',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '0.5rem',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              flexWrap: 'wrap',
                            }}
                          >
                            {n.linkedTicketId ? (
                              (() => {
                                const t = tickets.find(
                                  (ticket) =>
                                    ticket.id === n.linkedTicketId ||
                                    ticket.code === n.linkedTicketId
                                );
                                const displayId =
                                  t?.code ||
                                  (n.linkedTicketId.length <= 10
                                    ? n.linkedTicketId
                                    : `#${n.linkedTicketId.substring(0, 5)}`);
                                return (
                                  <button
                                    className="btn btn-link"
                                    style={{ padding: 0, fontSize: '0.75rem', fontWeight: 600 }}
                                    onClick={() => {
                                      setOpenTicketId(t ? t.id : n.linkedTicketId!);
                                      setNotesOpen(false);
                                    }}
                                  >
                                    🔗 {displayId}
                                  </button>
                                );
                              })()
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: 'var(--tx-muted)' }}>
                                Sin vincular
                              </span>
                            )}
                            <span
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--tx-secondary)',
                                fontWeight: 600,
                              }}
                            >
                              {n.authorName || 'Yo'}
                            </span>
                          </div>
                          <div className="d-flex align-center gap-05">
                            <button
                              onClick={() => handleToggleReviewed(n.id, isReviewed)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: isReviewed ? '#10b981' : 'var(--tx-muted)',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '2px',
                              }}
                              title={isReviewed ? 'Marcar como pendiente' : 'Marcar como revisada'}
                            >
                              {isReviewed ? '✓ Revisada' : '☐ Marcar'}
                            </button>
                            <button
                              onClick={() => handleDelete(n.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--tx-muted)',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                padding: '2px',
                              }}
                              title="Eliminar nota"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: '0.875rem',
                            color: isReviewed ? 'var(--tx-muted)' : 'var(--tx-primary)',
                            whiteSpace: 'pre-wrap',
                          }}
                          dangerouslySetInnerHTML={{ __html: n.content }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
