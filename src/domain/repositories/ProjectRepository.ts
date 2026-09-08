import { Project } from '../models/Project';

export interface ProjectRepository {
  getProjects(userEmail: string, userUid: string): Promise<Project[]>;
  getProjectById(projectId: string): Promise<Project | null>;
  createProject(project: Omit<Project, 'id' | 'updatedAt'>): Promise<string>;
  updateProject(projectId: string, data: Partial<Project>): Promise<void>;
  deleteProject(projectId: string): Promise<void>;
}
