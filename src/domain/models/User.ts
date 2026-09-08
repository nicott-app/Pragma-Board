export type Role = 'super-admin' | 'admin' | 'collaborator';

export interface UserPreferences {
  autoAssign?: boolean;
  requireBlockerReason?: boolean;
  strictWip?: boolean;
  hideDoneColumn?: boolean;
  hideEstimations?: boolean;
  theme?: 'light' | 'dark' | 'system';
  compactMode?: boolean;
  soundNotifications?: boolean;
  defaultFilterToMe?: boolean;
  showPowerBIEstimator?: boolean;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  role: Role;
  color?: string;
  avatarUrl?: string;
  preferences?: UserPreferences;
  isApproved?: boolean;
}

export interface TeamMember {
  id: string; // usually matches User.uid
  name: string;
  color: string;
}
