import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project } from '../../domain/models/Project';

export interface ProjectStore {
  activeProject: Project | null;
  activeProjectId: string | null;
  setActiveProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      activeProject: null,
      activeProjectId: null,
      setActiveProject: (project) => set({ 
        activeProject: project ? { ...project, members: project.members || [], columns: project.columns || [] } : null, 
        activeProjectId: project?.id || null 
      }),
    }),
    {
      name: 'smartboard-project-store',
      partialize: (state) => ({ 
        activeProjectId: state.activeProjectId,
      })
    }
  )
);
