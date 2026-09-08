import React, { useState, useEffect } from 'react';
import { useDialogStore } from '../../../application/store/useDialogStore';

export const GlobalDialogs: React.FC = () => {
  const currentDialog = useDialogStore(s => s.currentDialog);
  const closeDialog = useDialogStore(s => s.closeDialog);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (currentDialog?.type === 'prompt') {
      setInputValue(currentDialog.defaultValue || '');
    }
  }, [currentDialog]);

  if (!currentDialog) return null;

  const handleConfirm = () => {
    if (currentDialog.type === 'prompt') {
      closeDialog(inputValue);
    } else {
      closeDialog(true);
    }
  };

  const handleCancel = () => {
    if (currentDialog.type === 'prompt') {
      closeDialog(null);
    } else {
      closeDialog(false);
    }
  };

  const isAlert = currentDialog.type === 'alert';

  return (
    <div className="overlay active" style={{ zIndex: 9999 }}>
      <div className="modal" style={{ width: 'min(400px, 90vw)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'scaleUp 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
        
        <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--tx-primary)' }}>
          {currentDialog.title}
        </h3>
        
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--tx-secondary)', whiteSpace: 'pre-wrap' }}>
          {currentDialog.message}
        </p>

        {currentDialog.type === 'prompt' && (
          currentDialog.isMultiline ? (
            <textarea 
              className="form-input" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && handleConfirm()}
              rows={4}
              style={{ resize: 'vertical' }}
              autoFocus
            />
          ) : (
            <input 
              type="text"
              className="form-input" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
              autoFocus
            />
          )
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--tx-tertiary)' }}>
            {currentDialog.type === 'prompt' && currentDialog.isMultiline && "Usa Ctrl+Enter para confirmar"}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {!isAlert && (
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
            )}
            <button className="btn btn-primary" onClick={handleConfirm} autoFocus={isAlert}>
              {isAlert ? 'Aceptar' : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
