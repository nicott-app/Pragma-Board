import React, { useState } from 'react';
import { useProjectStore } from '../../../../application/store/useProjectStore';
import { useUIStore } from '../../../../application/store/useUIStore';
import { FirebaseProjectRepository } from '../../../../infrastructure/firebase/FirebaseProjectRepository';
import { useDialogStore } from '../../../../application/store/useDialogStore';
import { LoggerService } from '../../../../infrastructure/services/LoggerService';

const projectRepo = new FirebaseProjectRepository();

interface DangerZoneSettingsTabProps {
  isAdmin: boolean;
}

export const DangerZoneSettingsTab: React.FC<DangerZoneSettingsTabProps> = ({ isAdmin }) => {
  const activeProject = useProjectStore((s) => s.activeProject);
  const setActiveProject = useProjectStore((s) => s.setActiveProject);
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);
  const showAlert = useDialogStore((s) => s.showAlert);
  const showPrompt = useDialogStore((s) => s.showPrompt);

  const [isDeleting, setIsDeleting] = useState(false);

  if (!isAdmin) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--error)', fontWeight: 600 }}>
          No tienes permisos para acceder a esta sección.
        </p>
      </div>
    );
  }

  const handleDeleteProject = async () => {
    if (!activeProject) return;

    const confirmName = await showPrompt(
      'Eliminar Proyecto',
      `Esta acción es irreversible y eliminará el proyecto y toda su configuración de forma permanente. Para confirmar, escribe el nombre del proyecto (${activeProject.name}):`
    );

    if (confirmName === null) return;

    if (confirmName !== activeProject.name) {
      await showAlert(
        'Error',
        'El nombre introducido no coincide. El proyecto no ha sido eliminado.'
      );
      return;
    }

    try {
      setIsDeleting(true);
      await projectRepo.deleteProject(activeProject.id);
      setActiveProject(null);
      setSettingsOpen(false);
    } catch (error: any) {
      LoggerService.error('Failed to delete project', error);
      await showAlert('Error', 'Hubo un error al eliminar el proyecto: ' + error.message);
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--error)', margin: '0 0 0.5rem 0' }}>
          Zona de Peligro
        </h3>
        <p style={{ color: 'var(--tx-secondary)', fontSize: '0.875rem', margin: 0 }}>
          Las acciones aquí son destructivas y no se pueden deshacer.
        </p>
      </div>

      <div
        style={{
          border: '1px solid var(--error)',
          borderRadius: '8px',
          padding: '1.5rem',
          background: 'rgba(239, 68, 68, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        <div>
          <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--tx-primary)', fontSize: '1rem' }}>
            Eliminar este proyecto
          </h4>
          <p style={{ margin: 0, color: 'var(--tx-secondary)', fontSize: '0.875rem' }}>
            Una vez que elimines un proyecto, no hay vuelta atrás. Por favor, asegúrate.
          </p>
        </div>
        <button
          className="btn btn-primary"
          style={{ background: 'var(--error)', borderColor: 'var(--error)', whiteSpace: 'nowrap' }}
          onClick={handleDeleteProject}
          disabled={isDeleting}
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar Proyecto'}
        </button>
      </div>
    </div>
  );
};
