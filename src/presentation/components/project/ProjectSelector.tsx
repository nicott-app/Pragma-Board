import { LoggerService } from '../../../infrastructure/services/LoggerService';
import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../../application/store/useAuthStore';
import { useProjectStore } from '../../../application/store/useProjectStore';
import { useUIStore } from '../../../application/store/useUIStore';
import { FirebaseProjectRepository } from '../../../infrastructure/firebase/FirebaseProjectRepository';
import { Project } from '../../../domain/models/Project';

const projectRepo = new FirebaseProjectRepository();

export const ProjectSelector: React.FC = () => {
  const currentUser = useAuthStore(s => s.currentUser);
  const activeProject = useProjectStore(s => s.activeProject);
  const setActiveProject = useProjectStore(s => s.setActiveProject);
  const setNewProjectOpen = useUIStore(s => s.setNewProjectOpen);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) return;
    
    const fetchProjects = async () => {
      try {
        const userProjects = await projectRepo.getProjects(currentUser.email, currentUser.uid);
        setProjects(userProjects);
      } catch (err) {
        LoggerService.error("Error fetching projects", err);
      }
    };
    
    fetchProjects();
    // ONLY depend on currentUser.uid to avoid re-triggering on every activeProject reference change
  }, [currentUser?.uid]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (project: Project) => {
    setActiveProject(project);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        className="project-selector"
        aria-label="Cambiar proyecto"
        title="Cambiar proyecto"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: isOpen ? 'var(--bg-s3)' : '' }}
      >
        <span className="project-name">
          {activeProject?.name || 'Seleccionar Proyecto'}
        </span>
        <svg
          className="pd-chevron"
          width="12"
          height="12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          background: 'var(--bg-s2)',
          border: '1px solid var(--bd-default)',
          borderRadius: 'var(--r-md)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          minWidth: '220px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          padding: '0.25rem 0',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--tx-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Tus Proyectos
          </div>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {projects.length === 0 ? (
              <div style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--tx-secondary)' }}>
                No hay proyectos.
              </div>
            ) : (
              projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.5rem 1rem',
                    background: activeProject?.id === p.id ? 'var(--bg-s3)' : 'transparent',
                    border: 'none',
                    color: 'var(--tx-primary)',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                  {activeProject?.id === p.id && <span style={{ color: 'var(--ac)' }}>✓</span>}
                </button>
              ))
            )}
          </div>
          
          <div style={{ borderTop: '1px solid var(--bd-subtle)', margin: '0.25rem 0' }}></div>
          
          <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--tx-secondary)',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              setIsOpen(false);
              setNewProjectOpen(true);
            }}
          >
            <span>+</span> Nuevo Proyecto
          </button>
        </div>
      )}
    </div>
  );
};
