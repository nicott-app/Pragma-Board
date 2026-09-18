import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from './useProjectStore';

describe('useProjectStore', () => {
  beforeEach(() => {
    // Reset state before each test
    useProjectStore.setState({
      activeProject: null,
      projects: [],
      loading: false,
    });
  });

  it('should initialize with null activeProject and empty projects', () => {
    const state = useProjectStore.getState();
    expect(state.activeProject).toBeNull();
    expect(state.projects).toEqual([]);
    expect(state.loading).toBeFalsy();
  });

  it('should set active project', () => {
    const mockProject = {
      id: 'proj_1',
      name: 'Test Project',
      ownerUid: 'user_1',
      members: [],
      columns: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    useProjectStore.getState().setActiveProject(mockProject as any);
    
    const state = useProjectStore.getState();
    expect(state.activeProject).toEqual(mockProject);
  });
});
