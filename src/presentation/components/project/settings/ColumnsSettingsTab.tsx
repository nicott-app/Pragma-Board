import { LoggerService } from '../../../../infrastructure/services/LoggerService';
import React, { useState } from 'react';
import { useProjectStore } from '../../../../application/store/useProjectStore';
import { useDataStore } from '../../../../application/store/useDataStore';
import { useDialogStore } from '../../../../application/store/useDialogStore';
import { FirebaseProjectRepository } from '../../../../infrastructure/firebase/FirebaseProjectRepository';
import { BoardColumn } from '../../../../domain/models/Project';

const projectRepo = new FirebaseProjectRepository();

interface Props {
  isAdmin: boolean;
}

export const ColumnsSettingsTab: React.FC<Props> = ({ isAdmin }) => {
  const activeProject = useProjectStore(s => s.activeProject);
  const setActiveProject = useProjectStore(s => s.setActiveProject);
  const tickets = useDataStore(s => s.tickets);
  const [columns, setColumns] = useState<BoardColumn[]>(activeProject?.columns || []);

  if (!activeProject) return null;

  const handleSaveColumns = async () => {
    if (!isAdmin) {
      await useDialogStore.getState().showAlert('Aviso', "Solo los administradores pueden cambiar los ajustes.");
      return;
    }
    try {
      await projectRepo.updateProject(activeProject.id, { columns });
      setActiveProject({
        ...activeProject,
        columns
      });
      await useDialogStore.getState().showAlert('Éxito', "Columnas guardadas.");
    } catch (e: unknown) {
      LoggerService.error(e);
      await useDialogStore.getState().showAlert('Error', "Error guardando columnas: " + ((e as Error).message || String(e)));
    }
  };

  const updateColumnWip = (index: number, wip: string) => {
    const newCols = [...columns];
    newCols[index].wip = wip ? parseInt(wip) : null;
    setColumns(newCols);
  };

  const updateColumnField = (index: number, field: 'label' | 'emoji', value: string) => {
    const newCols = [...columns];
    newCols[index] = { ...newCols[index], [field]: value };
    setColumns(newCols);
  };

  const moveColumn = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === columns.length - 1) return;
    
    const newCols = [...columns];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newCols[index];
    newCols[index] = newCols[swapIndex];
    newCols[swapIndex] = temp;
    setColumns(newCols);
  };

  const deleteColumn = async (index: number) => {
    if (!isAdmin) return;
    const colToDelete = columns[index];
    
    // Check if tickets are using this column
    const hasTickets = tickets.some(t => t.status === colToDelete.id);
    if (hasTickets) {
      await useDialogStore.getState().showAlert(
        'Acción Bloqueada', 
        `No puedes eliminar la columna "${colToDelete.label}" porque contiene tickets asignados a ella.\n\n` +
        `Por favor, mueve todas las tareas a otras columnas en el tablero antes de eliminarla.`
      );
      return;
    }

    const confirm = await useDialogStore.getState().showConfirm(
      'Eliminar Columna',
      `¿Estás seguro de que deseas eliminar la columna "${colToDelete.label}"?`
    );
    
    if (confirm) {
      const newCols = columns.filter((_, i) => i !== index);
      setColumns(newCols);
    }
  };

  const addColumn = () => {
    const newId = `col-${Date.now()}`;
    const newCols = [...columns, { id: newId, label: 'Nueva Columna', emoji: '📝', wip: null }];
    setColumns(newCols);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Flujo de Trabajo (Columnas)</h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--tx-secondary)' }}>Configura los límites WIP (Work In Progress) de las columnas.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {columns.map((c, idx) => (
          <div key={c.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--bg-s2)', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--bd-subtle)' }}>
            <input 
              className="form-input" 
              value={c.emoji} 
              onChange={(e) => updateColumnField(idx, 'emoji', e.target.value)}
              disabled={!isAdmin}
              title="Emoji"
              style={{ width: '40px', textAlign: 'center', padding: '0.5rem 0' }} 
            />
            <input 
              className="form-input" 
              value={c.label} 
              onChange={(e) => updateColumnField(idx, 'label', e.target.value)}
              disabled={!isAdmin}
              placeholder="Nombre de columna"
              style={{ flex: 1 }} 
            />
            <div className="d-flex align-center gap-05">
              <span style={{ fontSize: '0.75rem', color: 'var(--tx-muted)' }}>WIP Limit</span>
              <input 
                className="form-input" 
                placeholder="∞" 
                type="number" 
                value={c.wip || ''} 
                onChange={(e) => updateColumnWip(idx, e.target.value)}
                disabled={!isAdmin}
                style={{ width: '70px', textAlign: 'center' }} 
              />
            </div>
            {isAdmin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: '0.5rem' }}>
                <button onClick={() => moveColumn(idx, 'up')} disabled={idx === 0} style={{ padding: '0.25rem', background: 'transparent', border: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.3 : 1 }}>⬆️</button>
                <button onClick={() => moveColumn(idx, 'down')} disabled={idx === columns.length - 1} style={{ padding: '0.25rem', background: 'transparent', border: 'none', cursor: idx === columns.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === columns.length - 1 ? 0.3 : 1 }}>⬇️</button>
                <button onClick={() => deleteColumn(idx)} style={{ padding: '0.25rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'red' }} title="Eliminar Columna">🗑️</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isAdmin && (
        <button 
          onClick={addColumn} 
          style={{ background: 'transparent', border: '1px dashed var(--bd-strong)', color: 'var(--tx-secondary)', padding: '0.75rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
        >
          <span>➕</span> Añadir Nueva Columna
        </button>
      )}

      <div className="mt-1">
        <button className="btn btn-primary" onClick={handleSaveColumns}>Guardar Columnas</button>
      </div>
    </div>
  );
};
