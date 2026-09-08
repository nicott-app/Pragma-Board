import React, { useState, useRef } from 'react';
import { Project } from '../../../../domain/models/Project';
import { Ticket, Attachment } from '../../../../domain/models/Ticket';
import { Note } from '../../../../domain/models/Note';
import { FirebaseStorageService } from '../../../../infrastructure/firebase/FirebaseStorageService';

interface TicketTabsProps {
  ticket: Ticket;
  activeProject: Project;
  currentUser: { uid: string; displayName?: string | null; email?: string | null };
  linkedNotes: Note[];
  isLoadingNotes: boolean;
  unreviewedNotes: Note[];
  getMemberName: (uid: string) => string;
  onAddComment: (text: string) => void;
  onDeleteComment: (id: string) => void;
  onUploadAttachment: (file: File) => void;
  onDeleteAttachment: (att: Attachment) => void;
  uploadProgress: number | null;
  uploadError: string | null;
  onReviewNote: (noteId: string, currentReviewed: boolean) => void;
  onOpenNotes: () => void;
}

export const TicketTabs: React.FC<TicketTabsProps> = ({
  ticket,
  activeProject,
  currentUser,
  linkedNotes,
  isLoadingNotes,
  unreviewedNotes,
  getMemberName,
  onAddComment,
  onDeleteComment,
  onUploadAttachment,
  onDeleteAttachment,
  uploadProgress,
  uploadError,
  onReviewNote,
  onOpenNotes,
}) => {
  const [activeTab, setActiveTab] = useState<'comments' | 'attachments' | 'history' | 'notes'>(
    'comments'
  );

  // Comments and Mentions
  const [newComment, setNewComment] = useState('');
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionPos, setMentionPos] = useState({ top: 0, left: 0 });
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // Attachments Drag & Drop
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleCommentInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNewComment(val);
    const caret = e.target.selectionStart || 0;
    const before = val.slice(0, caret);
    const atIdx = before.lastIndexOf('@');
    if (atIdx >= 0 && (atIdx === 0 || /\\s/.test(before[atIdx - 1]))) {
      const q = before.slice(atIdx + 1);
      if (!/\\s/.test(q)) {
        setMentionQuery(q);
        const rect = e.target.getBoundingClientRect();
        setMentionPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
        return;
      }
    }
    setMentionQuery(null);
  };

  const handleInsertMention = (memberName: string) => {
    const val = newComment;
    const caret = commentInputRef.current?.selectionStart || 0;
    const before = val.slice(0, caret);
    const atIdx = before.lastIndexOf('@');
    const newVal = val.slice(0, atIdx) + '@' + memberName + ' ' + val.slice(caret);
    setNewComment(newVal);
    setMentionQuery(null);
    commentInputRef.current?.focus();
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment.trim());
    setNewComment('');
    setMentionQuery(null);
  };

  const mentionMatches =
    mentionQuery !== null
      ? (activeProject.members || []).filter((m: { id: string; name: string }) =>
          m.name.toLowerCase().includes(mentionQuery.toLowerCase())
        )
      : [];

  const sortedComments = [...(ticket.comments || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      {/* Bottom Tabs Header */}
      <div
        style={{
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          gap: '1.5rem',
          marginTop: '1rem',
        }}
      >
        {[
          { id: 'comments', label: `💬 Comentarios (${ticket.comments?.length || 0})` },
          { id: 'attachments', label: `📎 Adjuntos (${ticket.attachments?.length || 0})` },
          { id: 'history', label: `📜 Historial (${ticket.history?.length || 0})` },
          {
            id: 'notes',
            label: `📓 Notas (${unreviewedNotes?.filter((n) => n.linkedTicketId === ticket?.id).length || 0})`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.75rem 0',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: activeTab === tab.id ? '#6366f1' : '#6b7280',
              borderBottom: activeTab === tab.id ? '2px solid #6366f1' : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ paddingBottom: '2rem', marginTop: '1.5rem' }}>
        {activeTab === 'comments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
              <textarea
                ref={commentInputRef}
                value={newComment}
                onChange={handleCommentInput}
                onKeyDown={(e) => {
                  if (mentionQuery !== null && mentionMatches.length > 0 && e.key === 'Escape') {
                    setMentionQuery(null);
                    e.preventDefault();
                  } else if (e.key === 'Enter' && e.ctrlKey) {
                    handleSendComment();
                  }
                }}
                style={{
                  flex: 1,
                  minHeight: '60px',
                  resize: 'vertical',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
                placeholder="Escribe un comentario... (Ctrl+Enter para enviar, @ para mencionar)"
              />
              <button
                onClick={handleSendComment}
                style={{
                  background: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  padding: '0 1.2rem',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  alignSelf: 'flex-end',
                  height: '40px',
                }}
              >
                Enviar
              </button>

              {/* @mention dropdown */}
              {mentionQuery !== null && mentionMatches.length > 0 && (
                <div
                  style={{
                    position: 'fixed',
                    top: mentionPos.top + 4,
                    left: mentionPos.left,
                    zIndex: 9999,
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    minWidth: '180px',
                    overflow: 'hidden',
                  }}
                >
                  {mentionMatches.map((m: { id: string; name: string }) => (
                    <button
                      key={m.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleInsertMention(m.name);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        color: '#111827',
                        textAlign: 'left',
                      }}
                    >
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#e0e7ff',
                          color: '#4f46e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '0.7rem',
                          flexShrink: 0,
                        }}
                      >
                        {m.name.charAt(0).toUpperCase()}
                      </span>
                      {m.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              {sortedComments.length === 0 ? (
                <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Sin comentarios todavía.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {sortedComments.map((c) => (
                    <div
                      key={c.id}
                      style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: '#e0e7ff',
                          color: '#4f46e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '0.875rem',
                          flexShrink: 0,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        }}
                      >
                        {getMemberName(c.authorId).charAt(0).toUpperCase()}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          background: '#f0f9ff',
                          padding: '0.35rem 0.6rem',
                          borderRadius: '6px',
                          border: '1px solid #bae6fd',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '0.75rem',
                            alignItems: 'center',
                          }}
                        >
                          <div className="d-flex align-center gap-05">
                            <strong style={{ fontSize: '0.875rem', color: '#111827' }}>
                              {getMemberName(c.authorId)}
                            </strong>
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                              {new Date(c.createdAt).toLocaleString()}
                            </span>
                          </div>
                          {(c.authorId === currentUser.uid ||
                            activeProject.roles?.[currentUser.uid] === 'admin') && (
                            <button
                              onClick={() => onDeleteComment(c.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#d1d5db',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                padding: '4px',
                                lineHeight: 1,
                              }}
                              title="Eliminar"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: '0.875rem',
                            whiteSpace: 'pre-wrap',
                            color: '#4b5563',
                            lineHeight: '1.5',
                          }}
                        >
                          {c.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {(ticket.history || []).length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Sin historial todavía.</p>
            ) : (
              [...(ticket.history || [])].reverse().map((h, i, arr) => {
                const actorName = h.actorName || h.actorId || 'Usuario';
                const timestamp = h.timestamp
                  ? new Date(h.timestamp).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '';
                return (
                  <div
                    key={h.id || i}
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      paddingBottom: '1rem',
                      position: 'relative',
                    }}
                  >
                    {i < arr.length - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '14px',
                          top: '28px',
                          bottom: 0,
                          width: '2px',
                          background: '#e5e7eb',
                        }}
                      />
                    )}
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: '#e0e7ff',
                        color: '#4f46e5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.7rem',
                        flexShrink: 0,
                        zIndex: 1,
                      }}
                    >
                      {actorName.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, paddingTop: '4px' }}>
                      <div style={{ fontSize: '0.8125rem', color: '#374151' }}>
                        <strong style={{ color: '#111827' }}>{actorName}</strong> {h.action || ''}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                        {timestamp}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'attachments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUploadAttachment(f);
                e.target.value = '';
              }}
            />
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                const f = e.dataTransfer.files[0];
                if (f) onUploadAttachment(f);
              }}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragOver ? '#6366f1' : '#d1d5db'}`,
                background: isDragOver ? '#f0f9ff' : '#fafafa',
                borderRadius: '10px',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📤</div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                Arrastra un fichero aquí o{' '}
                <strong style={{ color: '#6366f1' }}>haz clic para seleccionar</strong>
              </p>
              <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
                PDF, Word, Excel, imágenes, ZIP...
              </p>
            </div>

            {uploadProgress !== null && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                  }}
                >
                  <span>Subiendo fichero...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div
                  style={{
                    background: '#e5e7eb',
                    borderRadius: '99px',
                    height: '6px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      background: '#6366f1',
                      height: '100%',
                      width: `${uploadProgress}%`,
                      transition: 'width 0.2s',
                      borderRadius: '99px',
                    }}
                  />
                </div>
              </div>
            )}

            {uploadError && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{uploadError}</p>}

            {(ticket.attachments || []).length === 0 && uploadProgress === null ? (
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', textAlign: 'center' }}>
                Sin adjuntos todavía.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(ticket.attachments || []).map((att) => (
                  <div
                    key={att.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      background: '#f0f9ff',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid #bae6fd',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>
                      {FirebaseStorageService.getFileIcon(att.name)}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#111827',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {att.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        {FirebaseStorageService.formatBytes(att.size)} ·{' '}
                        {new Date(att.createdAt).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: '#e0e7ff',
                        color: '#4f46e5',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textDecoration: 'none',
                        flexShrink: 0,
                      }}
                    >
                      ↓ Descargar
                    </a>
                    <button
                      onClick={() => onDeleteAttachment(att)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        padding: '4px',
                        flexShrink: 0,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="d-flex justify-between align-center">
              <p style={{ color: 'var(--tx-secondary)', fontSize: '0.875rem', margin: 0 }}>
                Notas del Cuaderno (Daily) vinculadas a este ticket.
              </p>
              <button
                onClick={onOpenNotes}
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Abrir Cuaderno
              </button>
            </div>

            {isLoadingNotes ? (
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', textAlign: 'center' }}>
                Cargando notas...
              </p>
            ) : linkedNotes.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', textAlign: 'center' }}>
                No hay notas vinculadas.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {linkedNotes.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      background: '#f9fafb',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      display: 'flex',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>
                          {n.authorName || 'Usuario'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {n.sessionDate || new Date(n.createdAt).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <div
                        style={{
                          margin: 0,
                          fontSize: '0.875rem',
                          color: '#4b5563',
                          whiteSpace: 'pre-wrap',
                        }}
                        dangerouslySetInnerHTML={{ __html: n.content }}
                      />
                    </div>
                    <div style={{ flexShrink: 0, display: 'flex', alignItems: 'flex-start' }}>
                      <button
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          background: n.reviewed ? '#f3f4f6' : '#6366f1',
                          color: n.reviewed ? '#4b5563' : '#ffffff',
                          border: n.reviewed ? '1px solid #d1d5db' : 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                        onClick={() => onReviewNote(n.id, n.reviewed || false)}
                      >
                        {n.reviewed ? '✓ Revisada' : 'Marcar revisada'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
