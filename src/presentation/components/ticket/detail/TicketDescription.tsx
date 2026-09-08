import React from 'react';

interface TicketDescriptionProps {
  description: string;
  handleUpdate: (field: string, value: any) => void;
  headerStyle: React.CSSProperties;
}

export const TicketDescription: React.FC<TicketDescriptionProps> = ({ description, handleUpdate, headerStyle }) => {
  return (
    <div style={{ background: '#ffffff', borderRadius: '12px' }}>
      <h3 style={headerStyle}>
        <span style={{ fontSize: '1rem' }}>📝</span> DESCRIPCIÓN
      </h3>
      <textarea
        value={description || ''}
        onChange={(e) => handleUpdate('description', e.target.value)}
        style={{ width: '100%', minHeight: '100px', resize: 'vertical', border: '1px solid #f3f4f6', borderRadius: '8px', padding: '1rem', fontSize: '0.875rem', color: '#374151', outline: 'none', background: '#fafafa', transition: 'border-color 0.2s', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)' }}
        onFocus={e => e.target.style.borderColor = '#d1d5db'}
        onBlur={e => e.target.style.borderColor = '#f3f4f6'}
        placeholder="Añade una descripción más detallada..."
      />
    </div>
  );
};
