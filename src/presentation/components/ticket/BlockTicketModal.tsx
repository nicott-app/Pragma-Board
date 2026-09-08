import React, { useState } from 'react';

interface BlockTicketModalProps {
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export const BlockTicketModal: React.FC<BlockTicketModalProps> = ({ onConfirm, onCancel }) => {
  const [reason, setReason] = useState('');

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', width: '400px', maxWidth: '90vw', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', color: '#111827' }}>
          <span style={{ fontSize: '1.5rem' }}>🛑</span> Motivo de bloqueo
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem' }}>
          Por favor, especifica por qué esta tarea está bloqueada. Esto ayudará al equipo a entender el problema.
        </p>
        <textarea
          autoFocus
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Escribe el motivo del bloqueo..."
          style={{ width: '100%', minHeight: '100px', resize: 'vertical', border: '1px solid #d1d5db', borderRadius: '8px', padding: '0.75rem', fontSize: '0.875rem', color: '#374151', outline: 'none', marginBottom: '1.5rem' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onCancel} style={{ padding: '0.5rem 1rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
          <button onClick={() => onConfirm(reason)} disabled={!reason.trim()} style={{ padding: '0.5rem 1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600, cursor: reason.trim() ? 'pointer' : 'not-allowed', opacity: reason.trim() ? 1 : 0.5 }}>Bloquear Ticket</button>
        </div>
      </div>
    </div>
  );
};
