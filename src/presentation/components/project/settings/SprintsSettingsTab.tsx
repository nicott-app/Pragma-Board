import React, { useState } from 'react';
import { useProjectStore } from '../../../../application/store/useProjectStore';
import { useDataStore } from '../../../../application/store/useDataStore';
import { useDialogStore } from '../../../../application/store/useDialogStore';
import { FirebaseProjectRepository } from '../../../../infrastructure/firebase/FirebaseProjectRepository';

const projectRepo = new FirebaseProjectRepository();

interface Props {
  isAdmin: boolean;
}

export const SprintsSettingsTab: React.FC<Props> = ({ isAdmin }) => {
  const activeProject = useProjectStore(s => s.activeProject);
  const setActiveProject = useProjectStore(s => s.setActiveProject);
  const tickets = useDataStore(s => s.tickets);
  
  const [sprintName, setSprintName] = useState('');
  const [sprintStart, setSprintStart] = useState('');
  const [sprintEnd, setSprintEnd] = useState('');
  const [sprintGoal, setSprintGoal] = useState('');
  const [sprintStatus, setSprintStatus] = useState<'planning' | 'active' | 'completed'>('planning');
  const [sprintCapacity, setSprintCapacity] = useState<number>(0);
  const [sprintRetrospective, setSprintRetrospective] = useState('');
  const [isSprintFormOpen, setIsSprintFormOpen] = useState(false);
  const [editingSprintId, setEditingSprintId] = useState<string | null>(null);

  if (!activeProject) return null;

  const handleSaveSprint = async () => {
    if (!isAdmin) return;
    if (!sprintName || !sprintStart || !sprintEnd) {
      await useDialogStore.getState().showAlert('Aviso', "Rellena los campos obligatorios (nombre y fechas)");
      return;
    }
    
    let newSprints = [...activeProject.sprints];
    if (editingSprintId) {
      newSprints = newSprints.map(s => s.id === editingSprintId ? { ...s, name: sprintName, startDate: sprintStart, endDate: sprintEnd, goal: sprintGoal, status: sprintStatus, capacityHours: sprintCapacity, retrospective: sprintRetrospective } : s);
    } else {
      newSprints.push({
        id: `sprint-${Date.now()}`,
        name: sprintName,
        startDate: sprintStart,
        endDate: sprintEnd,
        goal: sprintGoal,
        active: false,
        status: sprintStatus,
        capacityHours: sprintCapacity,
        retrospective: sprintRetrospective
      });
    }

    try {
      await projectRepo.updateProject(activeProject.id, { sprints: newSprints });
      setActiveProject({ ...activeProject, sprints: newSprints });
      setIsSprintFormOpen(false);
      setEditingSprintId(null);
      setSprintName('');
      setSprintStart('');
      setSprintEnd('');
      setSprintGoal('');
      setSprintStatus('planning');
      setSprintCapacity(0);
      setSprintRetrospective('');
    } catch (e) {
      await useDialogStore.getState().showAlert('Error', "Error guardando sprint");
    }
  };

  const handleDeleteSprint = async (sprintId: string) => {
    if (!isAdmin) return;
    
    const ticketsInSprint = tickets.filter(t => t.sprintId === sprintId);
    
    const doneColumnId = activeProject.columns[activeProject.columns.length - 1]?.id || 'done';
    const pendingTickets = ticketsInSprint.filter(t => 
      !t.status.toLowerCase().includes('review') && 
      !t.status.toLowerCase().includes('revisión') && 
      t.status !== doneColumnId
    );
    
    if (pendingTickets.length > 0) {
      await useDialogStore.getState().showAlert(
        'Acción Bloqueada', 
        `No puedes eliminar este sprint porque contiene ${pendingTickets.length} tareas pendientes (que no están en revisión ni finalizadas).\n\nDebes completarlas o moverlas a otro sprint primero.`
      );
      return;
    }

    if (!(await useDialogStore.getState().showConfirm('Confirmar', "¿Seguro que quieres eliminar este sprint?"))) return;
    
    const newSprints = activeProject.sprints.filter(s => s.id !== sprintId);
    const newCurrent = activeProject.currentSprintId === sprintId ? null : activeProject.currentSprintId;
    
    try {
      await projectRepo.updateProject(activeProject.id, { sprints: newSprints, currentSprintId: newCurrent });
      setActiveProject({ ...activeProject, sprints: newSprints, currentSprintId: newCurrent });
    } catch (e) {
      await useDialogStore.getState().showAlert('Error', "Error eliminando sprint");
    }
  };

  const handleActivateSprint = async (sprintId: string) => {
    if (!isAdmin) return;
    const newCurrent = activeProject.currentSprintId === sprintId ? null : sprintId;
    try {
      await projectRepo.updateProject(activeProject.id, { currentSprintId: newCurrent });
      setActiveProject({ ...activeProject, currentSprintId: newCurrent });
    } catch (e) {
      await useDialogStore.getState().showAlert('Error', "Error activando sprint");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Gestión de Sprints</h3>
      <div className="d-flex justify-between align-center">
        <p style={{ fontSize: '0.875rem', color: 'var(--tx-secondary)', margin: 0 }}>Los Sprints te permiten agrupar tareas por iteraciones.</p>
        <button 
          className="btn btn-secondary" 
          disabled={!isAdmin} 
          onClick={() => {
            setEditingSprintId(null);
            setSprintName('');
            setSprintStart('');
            setSprintEnd('');
            setSprintGoal('');
            setSprintStatus('planning');
            setSprintCapacity(0);
            setSprintRetrospective('');
            setIsSprintFormOpen(true);
          }}
        >
          + Nuevo Sprint
        </button>
      </div>
      
      {isSprintFormOpen && (
        <div style={{ background: 'var(--bg-s2)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--bd-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Nombre del Sprint</label>
            <input className="form-input" value={sprintName} onChange={e => setSprintName(e.target.value)} placeholder="Ej: Sprint 1" />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Fecha Inicio</label>
              <input type="date" className="form-input" value={sprintStart} onChange={e => setSprintStart(e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Fecha Fin</label>
              <input type="date" className="form-input" value={sprintEnd} onChange={e => setSprintEnd(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Objetivo del Sprint (Opcional)</label>
            <input className="form-input" value={sprintGoal} onChange={e => setSprintGoal(e.target.value)} placeholder="Ej: Finalizar el rediseño del frontend" />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Estado</label>
              <select className="form-select" value={sprintStatus} onChange={e => setSprintStatus(e.target.value as any)}>
                <option value="planning">Planificación</option>
                <option value="active">Activo</option>
                <option value="completed">Completado</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Capacidad (Horas totales)</label>
              <input type="number" className="form-input" value={sprintCapacity || ''} onChange={e => setSprintCapacity(Number(e.target.value))} placeholder="Ej: 80" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notas de Retrospectiva</label>
            <textarea className="form-input" style={{ minHeight: '80px', resize: 'vertical' }} value={sprintRetrospective} onChange={e => setSprintRetrospective(e.target.value)} placeholder="¿Qué fue bien? ¿Qué se puede mejorar? (Rellenar al cerrar el sprint)" />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button className="btn btn-link" onClick={() => setIsSprintFormOpen(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSaveSprint}>Guardar Sprint</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
        {activeProject.sprints.length === 0 ? (
          <p style={{ color: 'var(--tx-muted)', fontStyle: 'italic' }}>No hay sprints configurados.</p>
        ) : (
          activeProject.sprints.map(s => (
            <div key={s.id} style={{ padding: '1rem', background: 'var(--bg-s2)', borderRadius: '4px', border: '1px solid var(--bd-subtle)' }}>
              <div className="d-flex justify-between align-center">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <strong>{s.name}</strong>
                  {activeProject.currentSprintId === s.id && <span style={{ padding: '2px 8px', background: 'var(--ac)', color: '#fff', borderRadius: '12px', fontSize: '0.75rem' }}>Activo</span>}
                </div>
                {isAdmin && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-link" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => handleActivateSprint(s.id)}>
                      {activeProject.currentSprintId === s.id ? 'Desactivar' : 'Activar'}
                    </button>
                    <button className="btn btn-link" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => {
                      setEditingSprintId(s.id);
                      setSprintName(s.name);
                      setSprintStart(s.startDate);
                      setSprintEnd(s.endDate);
                      setSprintGoal(s.goal || '');
                      setSprintStatus(s.status || 'planning');
                      setSprintCapacity(s.capacityHours || 0);
                      setSprintRetrospective(s.retrospective || '');
                      setIsSprintFormOpen(true);
                    }}>Editar</button>
                    <button className="btn btn-link" style={{ color: 'var(--error)', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => handleDeleteSprint(s.id)}>Eliminar</button>
                  </div>
                )}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--tx-secondary)', marginTop: '0.25rem' }}>
                {s.startDate} al {s.endDate}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
