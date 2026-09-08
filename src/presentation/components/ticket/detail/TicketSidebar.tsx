import React from 'react';
import { Project } from '../../../../domain/models/Project';
import { Ticket } from '../../../../domain/models/Ticket';

interface TicketSidebarProps {
  ticket: Ticket;
  activeProject: Project;
  currentUser: { uid: string, displayName?: string | null, email?: string | null };
  isMemberOnVacation: (uid: string) => boolean;
  totalHoursLogged: number;
  estimatedHours: number;
  timePercent: number;
  unassignedMembers: any[];
  handleUpdate: (field: keyof Ticket, value: any) => void;
  handleAddAssignee: (uid: string) => void;
  handleRemoveAssignee: (uid: string) => void;
  handleDuplicateTicket: () => void;
  handleDeleteTicket: () => void;
  setPendingBlockStatus: (status: string | null) => void;
  notifyBlocked?: (reason: string) => void;
}

export const TicketSidebar: React.FC<TicketSidebarProps> = ({
  ticket,
  activeProject,
  isMemberOnVacation,
  totalHoursLogged,
  estimatedHours,
  timePercent,
  unassignedMembers,
  handleUpdate,
  handleAddAssignee,
  handleRemoveAssignee,
  handleDuplicateTicket,
  handleDeleteTicket,
  setPendingBlockStatus,
  notifyBlocked
}) => {
  const [newTag, setNewTag] = React.useState('');

  return (
    <div style={{ width: '320px', background: '#f9fafb', borderLeft: '1px solid #e5e7eb', padding: '1.5rem', paddingTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
      
      <div>
        <h4 style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem', fontWeight: 600 }}>ESTADO</h4>
        <select 
          value={ticket.status} 
          onChange={e => {
            const newStatus = e.target.value;
            const isBlockedCol = (c: { id: string; label: string }) =>
              c.id === 'blocked' ||
              c.label.toLowerCase().includes('bloquead') ||
              c.label.toLowerCase().includes('block');
            const blockedColumn = activeProject.columns.find(isBlockedCol);
            
            if (blockedColumn && newStatus === blockedColumn.id && ticket.status !== newStatus) {
              setPendingBlockStatus(newStatus);
            } else {
              if (ticket.isBlocked && newStatus !== blockedColumn?.id) {
                handleUpdate('isBlocked', false);
                handleUpdate('blockerReason', '');
              }
              handleUpdate('status', newStatus);
            }
          }} 
          style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.875rem', color: '#374151', background: '#fff' }}
        >
          {activeProject.columns.map((col: { id: string, label: string, emoji?: string }) => (
            <option key={col.id} value={col.id}>{col.emoji} {col.label}</option>
          ))}
        </select>
      </div>

      <div>
        <h4 style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem', fontWeight: 600 }}>PRIORIDAD</h4>
        <select value={ticket.priority} onChange={e => handleUpdate('priority', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.875rem', color: '#374151', background: '#fff' }}>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
          <option value="critical">Crítica</option>
        </select>
      </div>

      <div>
        <h4 style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem', fontWeight: 600 }}>TIPO</h4>
        <select value={ticket.type} onChange={e => handleUpdate('type', e.target.value as any)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.875rem', color: '#374151', background: '#fff' }}>
          <option value="entregable">Entregable</option>
          <option value="tarea">Tarea</option>
          <option value="bug">Bug</option>
          <option value="desarrollo">Desarrollo</option>
          <option value="mejora">Mejora</option>
          <option value="incidencia">Incidencia</option>
          <option value="analisis">Análisis</option>
        </select>
      </div>

      <div>
        <h4 style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem', fontWeight: 600 }}>ESTIMACIÓN (HORAS)</h4>
        <input type="number" min="0" value={ticket.estimatedHours || ''} onChange={e => handleUpdate('estimatedHours', e.target.value ? Number(e.target.value) : undefined)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.875rem', color: '#374151', background: '#fff' }} placeholder="Horas..." />
      </div>

      <div>
        <h4 style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem', fontWeight: 600 }}>TIEMPO IMPUTADO</h4>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>{totalHoursLogged} h de {estimatedHours} h estimadas</div>
        <div style={{ width: '100%', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${timePercent}%`, height: '100%', background: timePercent > 100 ? '#ef4444' : '#10b981' }}></div>
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem', fontWeight: 600 }}>RESPONSABLES</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
          {(ticket.assignees || []).map(uid => {
            const member = activeProject.members.find((m: { id: string, name: string }) => m.id === uid);
            return (
              <span key={uid} title={isMemberOnVacation(uid) ? "Actualmente de vacaciones" : ""} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: '#e0f2fe', color: '#0369a1', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600 }}>
                {member?.name || uid.substring(0, 6)} {isMemberOnVacation(uid) ? '🌴' : ''}
                <button onClick={() => handleRemoveAssignee(uid)} style={{ background: 'none', border: 'none', color: '#0369a1', cursor: 'pointer', padding: 0, marginLeft: '4px', fontSize: '1rem', lineHeight: 1 }}>✕</button>
              </span>
            );
          })}
        </div>
        <select onChange={e => { handleAddAssignee(e.target.value); e.target.value = ''; }} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.875rem', color: '#374151', background: '#fff' }}>
          <option value="">Añadir...</option>
          {unassignedMembers.map(m => (
            <option key={m.id} value={m.id}>{m.name} {isMemberOnVacation(m.id) ? '🌴' : ''}</option>
          ))}
        </select>
      </div>

      <div>
        <h4 style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem', fontWeight: 600 }}>FECHA FIN</h4>
        <input type="date" value={ticket.dueDate?.split('T')[0] || ''} onChange={e => handleUpdate('dueDate', e.target.value ? new Date(e.target.value).toISOString() : undefined)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.875rem', color: '#374151' }} />
      </div>

      <div>
        <h4 style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem', fontWeight: 600 }}>ETIQUETAS</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
          {(ticket.tags || []).map(tag => (
            <span key={tag} style={{ padding: '4px 10px', background: '#f3f4f6', borderRadius: '16px', fontSize: '0.75rem', color: '#4b5563', border: '1px solid #e5e7eb' }}>
              {tag} <button onClick={() => handleUpdate('tags', ticket.tags.filter(t => t !== tag))} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '4px', color: '#9ca3af' }}>✕</button>
            </span>
          ))}
        </div>
        <input type="text" value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newTag.trim()) { handleUpdate('tags', [...(ticket.tags || []), newTag.trim()]); setNewTag(''); } }} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.875rem', color: '#374151' }} placeholder="Añadir etiqueta..." />
      </div>

      {activeProject.sprints && activeProject.sprints.length > 0 && (
        <div>
          <h4 style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem', fontWeight: 600 }}>SPRINT</h4>
          <select value={ticket.sprintId || ''} onChange={e => handleUpdate('sprintId', e.target.value || null)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontSize: '0.875rem', color: '#374151', background: '#fff' }}>
            <option value="">Sin sprint</option>
            {activeProject.sprints.map((s: { id: string, name: string, active?: boolean }) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      <div style={{ background: ticket.isBlocked ? '#fef2f2' : 'transparent', padding: '1rem', borderRadius: '8px', border: ticket.isBlocked ? '1px solid #ef4444' : '1px solid #e5e7eb' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: ticket.isBlocked ? '#ef4444' : '#4b5563', fontWeight: ticket.isBlocked ? 600 : 'normal', fontSize: '0.875rem' }}>
          <input type="checkbox" checked={!!ticket.isBlocked} onChange={e => {
            const blocked = e.target.checked;
            handleUpdate('isBlocked', blocked);
            if (!blocked) handleUpdate('blockerReason', '');
            if (blocked && notifyBlocked) {
              notifyBlocked(ticket.blockerReason || 'Sin motivo');
            }
          }} className="cursor-pointer" />
          🚫 BLOQUEADO
        </label>
        {ticket.isBlocked && (
          <>
            <input type="text" placeholder="Motivo del bloqueo..." value={ticket.blockerReason || ''} onChange={e => handleUpdate('blockerReason', e.target.value)} style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ef4444', outline: 'none', fontSize: '0.875rem' }} />
            <input type="text" placeholder="Bloqueado por (ej. DA-001)..." value={(ticket as any).blockedBy || ''} onChange={e => handleUpdate('blockedBy' as any, e.target.value)} style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem', borderRadius: '6px', border: '1px dashed #fca5a5', outline: 'none', fontSize: '0.875rem', color: '#ef4444' }} />
          </>
        )}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button onClick={handleDuplicateTicket} style={{ width: '100%', background: '#f3f4f6', border: '1px solid #d1d5db', color: '#374151', padding: '0.6rem', borderRadius: '24px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>📄 Duplicar tarjeta</button>
        <button onClick={handleDeleteTicket} style={{ width: '100%', background: '#fef2f2', border: '1px solid #fca5a5', color: '#ef4444', padding: '0.6rem', borderRadius: '24px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>🗑️ Eliminar ticket</button>
      </div>

    </div>
  );
};
