import { LoggerService } from '../../../infrastructure/services/LoggerService';
import React, { useState } from 'react';
import { useAuthStore } from '../../../application/store/useAuthStore';
import { useUIStore } from '../../../application/store/useUIStore';
import { useProjectStore } from '../../../application/store/useProjectStore';
import { FirebaseProjectRepository } from '../../../infrastructure/firebase/FirebaseProjectRepository';
import { Project, BoardColumn, ProjectVisibility } from '../../../domain/models/Project';

const projectRepo = new FirebaseProjectRepository();

const DEFAULT_COLUMNS: BoardColumn[] = [
  { id: 'backlog', label: 'Backlog', wip: null, emoji: '📝' },
  { id: 'todo', label: 'Por hacer', wip: null, emoji: '🎯' },
  { id: 'in-progress', label: 'En progreso', wip: 3, emoji: '⏳' },
  { id: 'blocked', label: 'Bloqueado', wip: null, emoji: '⛔', isBlocker: true },
  { id: 'in-review', label: 'En revisión', wip: null, emoji: '👀' },
  { id: 'done', label: 'Hecho', wip: null, emoji: '✅' },
];

export const NewProjectModal: React.FC = () => {
  const currentUser = useAuthStore(s => s.currentUser);
  const setNewProjectOpen = useUIStore(s => s.setNewProjectOpen);
  const setActiveProject = useProjectStore(s => s.setActiveProject);
  const [name, setName] = useState('');
  const [ticketPrefix, setTicketPrefix] = useState('');
  const [visibility, setVisibility] = useState<ProjectVisibility>('private');
  const [allowedEmails, setAllowedEmails] = useState('');
  const [columns, setColumns] = useState<BoardColumn[]>(DEFAULT_COLUMNS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser) return null;

  const handleCreate = async () => {
    if (!name.trim()) return alert('El nombre es obligatorio');
    setIsSubmitting(true);

    try {
      const parsedEmails = allowedEmails
        .split(',')
        .map(e => e.trim())
        .filter(e => e.length > 0);
      
      if (!parsedEmails.includes(currentUser.email!)) {
        parsedEmails.push(currentUser.email!);
      }

      const newProjectData: Omit<Project, 'id' | 'updatedAt'> = {
        name: name.trim(),
        ticketPrefix: ticketPrefix.trim() || null,
        columns: columns,
        members: [{ id: currentUser.uid, name: currentUser.name || currentUser.email || 'Yo', color: '#7c6fff' }],
        sprints: [],
        currentSprintId: null,
        visibility,
        ownerUid: currentUser.uid,
        allowedEmails: parsedEmails,
        roles: { [currentUser.uid]: 'admin' },
        customFilters: [],
        webhooks: [],
      };

      const projectId = await projectRepo.createProject(newProjectData);
      const createdProject = await projectRepo.getProjectById(projectId);
      
      if (createdProject) {
        setActiveProject(createdProject);
      }
      setNewProjectOpen(false);
    } catch (err) {
      LoggerService.error(err);
      alert('Error creando proyecto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateColumnWip = (index: number, wip: string) => {
    const newCols = [...columns];
    newCols[index].wip = wip ? parseInt(wip) : null;
    setColumns(newCols);
  };

  return (
    <div className="overlay active" style={{ zIndex: 100 }}>
      <div className="modal" style={{ width: 'min(600px, 96vw)', padding: '0', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--bd-subtle)', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--tx-primary)', margin: 0 }}>Nuevo Proyecto</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--tx-secondary)', margin: 0 }}>Crea un nuevo tablero Kanban</p>
          </div>
          <button className="modal-close" onClick={() => setNewProjectOpen(false)} style={{ position: 'relative' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: '60vh', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Nombre del Proyecto</label>
              <input 
                className="form-input" 
                placeholder="Ej. Mi Proyecto Increíble"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Prefijo (Opcional)</label>
              <input 
                className="form-input" 
                placeholder="Ej. PRJ"
                value={ticketPrefix}
                maxLength={6}
                onChange={(e) => setTicketPrefix(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Visibilidad</label>
            <select 
              className="form-select" 
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as ProjectVisibility)}
            >
              <option value="private">Privado (Solo invitados)</option>
              <option value="public">Público (Cualquier usuario de la empresa)</option>
            </select>
          </div>

          {visibility === 'private' && (
            <div className="form-group">
              <label className="form-label">Correos permitidos (separados por coma)</label>
              <input 
                className="form-input" 
                placeholder="juan@empresa.com, ana@empresa.com"
                value={allowedEmails}
                onChange={(e) => setAllowedEmails(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="form-label">Columnas (Flujo de trabajo)</label>
            <p style={{ fontSize: '0.75rem', color: 'var(--tx-muted)', marginBottom: '0.5rem' }}>Configura los límites de Trabajo en Progreso (WIP).</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {columns.map((col, idx) => (
                <div key={col.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--bg-s2)', padding: '0.5rem', borderRadius: '4px' }}>
                  <span style={{ fontSize: '1.25rem' }}>{col.emoji}</span>
                  <input className="form-input" value={col.label} readOnly style={{ flex: 1 }} />
                  <input 
                    className="form-input" 
                    placeholder="WIP" 
                    type="number" 
                    min="1"
                    value={col.wip || ''} 
                    onChange={(e) => updateColumnWip(idx, e.target.value)}
                    style={{ width: '80px' }} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--bd-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', background: 'var(--bg-s2)' }}>
          <button className="btn btn-secondary" onClick={() => setNewProjectOpen(false)}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleCreate} disabled={isSubmitting || !name.trim()}>
            {isSubmitting ? 'Creando...' : 'Crear Proyecto'}
          </button>
        </div>

      </div>
    </div>
  );
};
