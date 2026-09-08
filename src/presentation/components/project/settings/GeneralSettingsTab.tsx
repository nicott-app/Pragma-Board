import { LoggerService } from '../../../../infrastructure/services/LoggerService';
import React, { useState } from 'react';
import { useProjectStore } from '../../../../application/store/useProjectStore';
import { useUIStore } from '../../../../application/store/useUIStore';
import { useToastStore } from '../../../../application/store/useToastStore';
import { FirebaseProjectRepository } from '../../../../infrastructure/firebase/FirebaseProjectRepository';
import { ProjectVisibility } from '../../../../domain/models/Project';

const projectRepo = new FirebaseProjectRepository();

interface Props {
  isAdmin: boolean;
}

export const GeneralSettingsTab: React.FC<Props> = ({ isAdmin }) => {
  const activeProject = useProjectStore(s => s.activeProject);
  const setActiveProject = useProjectStore(s => s.setActiveProject);
  const setSettingsOpen = useUIStore(s => s.setSettingsOpen);
  const setImportExportOpen = useUIStore(s => s.setImportExportOpen);

  const [projectName, setProjectName] = useState(activeProject?.name || '');
  const [visibility, setVisibility] = useState<ProjectVisibility>(activeProject?.visibility || 'private');
  const [allowedEmails, setAllowedEmails] = useState(activeProject?.allowedEmails?.join(', ') || '');
  const [ticketPrefix, setTicketPrefix] = useState(activeProject?.ticketPrefix || '');

  if (!activeProject) return null;

  const handleSaveGeneral = async () => {
    if (!isAdmin) {
      useToastStore.getState().addToast('error', 'Solo los administradores pueden cambiar los ajustes.', 'Permiso denegado');
      return;
    }
    try {
      const parsedEmails = allowedEmails.split(',').map(e => e.trim()).filter(Boolean);
      await projectRepo.updateProject(activeProject.id, { 
        name: projectName,
        visibility,
        allowedEmails: parsedEmails,
        ticketPrefix
      });
      // Update local store instantly
      setActiveProject({
        ...activeProject,
        name: projectName,
        visibility,
        allowedEmails: parsedEmails,
        ticketPrefix
      });
      useToastStore.getState().addToast('success', 'Ajustes generales guardados.', 'Éxito');
    } catch (e: unknown) {
      LoggerService.error(e);
      useToastStore.getState().addToast('error', (e as Error).message || String(e), 'Error guardando ajustes');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Ajustes Básicos</h3>
      
      <div className="form-group">
        <label className="form-label">Nombre del Proyecto</label>
        <input 
          className="form-input" 
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          disabled={!isAdmin}
        />
        <div className="form-group" style={{ flex: 1, marginTop: '1rem' }}>
          <label className="form-label">Prefijo de Tickets (Opcional)</label>
          <input 
            type="text" 
            className="form-input" 
            value={ticketPrefix} 
            onChange={e => setTicketPrefix(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))} 
            placeholder="Ej: PRJ, TICK, APP"
            maxLength={6}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Visibilidad</label>
        <select 
          className="form-select" 
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as ProjectVisibility)}
          disabled={!isAdmin}
        >
          <option value="private">Privado (Solo correos permitidos)</option>
          <option value="public">Público (Todos)</option>
        </select>
      </div>

      {visibility === 'private' && (
        <div className="form-group">
          <label className="form-label">Correos Permitidos (Separados por coma)</label>
          <textarea 
            className="form-input" 
            style={{ minHeight: '80px', resize: 'vertical' }}
            value={allowedEmails}
            onChange={(e) => setAllowedEmails(e.target.value)}
            disabled={!isAdmin}
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button className="btn btn-primary" onClick={handleSaveGeneral} disabled={!isAdmin}>Guardar Ajustes Generales</button>
        <button className="btn btn-secondary" onClick={() => {
          setSettingsOpen(false);
          setImportExportOpen(true);
        }}>
          Importar / Exportar Datos
        </button>
      </div>
    </div>
  );
};
