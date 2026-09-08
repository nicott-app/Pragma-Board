import React from 'react';
import { useDialogStore } from '../../../../application/store/useDialogStore';

interface TicketAcceptanceCriteriaProps {
  criteria: string[];
  handleUpdate: (field: string, value: any) => void;
  headerStyle: React.CSSProperties;
}

export const TicketAcceptanceCriteria: React.FC<TicketAcceptanceCriteriaProps> = ({ criteria, handleUpdate, headerStyle }) => {
  const handleDeleteCriterion = (idx: number) => {
    const updated = [...(criteria || [])];
    updated.splice(idx, 1);
    handleUpdate('acceptanceCriteria', updated);
  };

  const handleAddCriterion = async () => {
    const val = await useDialogStore.getState().showPrompt('Nuevo Criterio', 'Nuevo criterio de aceptación:');
    if (val && val.trim()) {
      handleUpdate('acceptanceCriteria', [...(criteria || []), val.trim()]);
    }
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: '12px' }}>
      <h3 style={headerStyle}>
        <span style={{ color: '#22c55e', fontSize: '1rem' }}>☑</span> CRITERIOS DE ACEPTACIÓN
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {(criteria || []).map((crit, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f0fdf4', padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
            <span style={{ color: '#9ca3af' }}>✓</span>
            <span style={{ flex: 1, fontSize: '0.875rem', color: '#4b5563' }}>{crit}</span>
            <button onClick={() => handleDeleteCriterion(idx)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px', fontSize: '1rem' }}>✕</button>
          </div>
        ))}
        <div style={{ marginTop: '0.5rem' }}>
          <button onClick={handleAddCriterion} style={{ background: '#ffffff', border: '1px dashed #d1d5db', color: '#6b7280', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.875rem', cursor: 'pointer' }}>+ Añadir criterio</button>
        </div>
      </div>
    </div>
  );
};
