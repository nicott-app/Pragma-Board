import React from 'react';
import { Ticket } from '../../../../domain/models/Ticket';

interface TicketHeaderProps {
  ticket: Ticket;
  handleUpdate: (field: keyof Ticket, value: any) => void;
  formatDate: (dateVal: string | Date | number) => string;
}

const priorityLabels: Record<string, string> = { low: 'BAJA', medium: 'MEDIA', high: 'ALTA', critical: 'CRÍTICA' };

export const TicketHeader: React.FC<TicketHeaderProps> = ({ ticket, handleUpdate, formatDate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ padding: '4px 12px', borderRadius: '16px', background: '#ffffff', color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #d1d5db' }}>
          {ticket.code || ticket.id.substring(0, 8)}
        </span>
        <span style={{ padding: '4px 12px', borderRadius: '16px', background: '#f3e8ff', color: '#a855f7', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '0.875rem' }}>📄</span> {ticket.type.toUpperCase()}
        </span>
        <span style={{ padding: '4px 12px', borderRadius: '16px', background: ticket.priority === 'critical' ? '#fee2e2' : ticket.priority === 'high' ? '#ffedd5' : '#f3f4f6', color: ticket.priority === 'critical' ? '#ef4444' : ticket.priority === 'high' ? '#f97316' : '#6b7280', fontSize: '0.75rem', fontWeight: 600 }}>
          {priorityLabels[ticket.priority] || ticket.priority.toUpperCase()}
        </span>
        {ticket.isAI && (
          <span style={{ padding: '4px 12px', borderRadius: '16px', background: '#f3e8ff', color: '#a855f7', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.875rem' }}>✨</span> IA
          </span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <input 
          type="text" 
          value={ticket.title} 
          onChange={e => handleUpdate('title', e.target.value)}
          style={{ fontSize: '1.5rem', fontWeight: 600, border: 'none', background: 'transparent', color: '#111827', flex: 1, outline: 'none' }}
        />
        <span style={{ fontSize: '0.75rem', color: '#9ca3af', whiteSpace: 'nowrap', marginLeft: '1rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
          Creado el {formatDate(ticket.createdAt)}
        </span>
      </div>
    </div>
  );
};
