import { Project } from '../../domain/models/Project';
import { User } from '../../domain/models/User';

export interface ProjectPermissions {
  view_project: boolean;
  edit_tickets: boolean;
  delete_tickets: boolean;
  manage_project: boolean;
  manage_columns: boolean;
}

export const getProjectPermissionLevel = (project: Project, user: User | null): ProjectPermissions => {
  // Default fallback for unauthenticated users
  if (!user || !project) {
    return {
      view_project: project?.visibility === 'public',
      edit_tickets: false,
      delete_tickets: false,
      manage_project: false,
      manage_columns: false
    };
  }

  const isSuperAdmin = user.role === 'super-admin';
  const isOwner = project.ownerUid === user.uid;
  const projectRole = project.roles?.[user.uid];

  const isAdmin = isSuperAdmin || isOwner || projectRole === 'admin';
  
  const isMember = project.members?.some(m => m.id === user.uid) || !!projectRole || isOwner;

  // Administrators have full control
  if (isAdmin) {
    return {
      view_project: true,
      edit_tickets: true,
      delete_tickets: true,
      manage_project: true,
      manage_columns: true
    };
  }

  // Members can view and edit tickets, but not delete them or manage the board
  if (isMember) {
    return {
      view_project: true,
      edit_tickets: true,
      delete_tickets: false,
      manage_project: false,
      manage_columns: false
    };
  }

  // Non-members can only view if the project is public
  if (project.visibility === 'public') {
    return {
      view_project: true,
      edit_tickets: false,
      delete_tickets: false,
      manage_project: false,
      manage_columns: false
    };
  }

  // Private project and not a member
  return {
    view_project: false,
    edit_tickets: false,
    delete_tickets: false,
    manage_project: false,
    manage_columns: false
  };
};
