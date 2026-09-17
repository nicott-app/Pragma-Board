import { TeamMember } from './User';
import { Sprint } from './Sprint';

export interface BoardColumn {
  id: string;
  label: string;
  wip: number | null;
  emoji: string;
  isBlocker?: boolean;
  /**
   * Semantic role of this column, used by features like the Daily Standup
   * to classify tickets regardless of column order or label.
   *
   *  'backlog' – tickets not yet started (hidden from Daily active sections)
   *  'active'  – tickets currently being worked on (each column gets its own Daily section)
   *  'done'    – tickets completed (shown in Daily filtered by recency)
   *
   * When absent, the role is inferred automatically:
   *   first column → 'backlog', last column → 'done', rest → 'active'.
   */
  role?: 'backlog' | 'active' | 'done';
}


export type ProjectVisibility = 'public' | 'private';

export interface CustomFilter {
  id: string;
  name: string;
  filter: Record<string, any>;
}

export interface Webhook {
  id: string;
  url: string;
  active: boolean;
  events: string[];
}

export interface Project {
  id: string;
  name: string;
  columns: BoardColumn[];
  members: TeamMember[];
  sprints: Sprint[];
  currentSprintId: string | null;
  visibility: ProjectVisibility;
  ownerUid: string | null;
  allowedEmails: string[];
  roles: Record<string, string>; // uid -> role
  customFilters: CustomFilter[];
  webhooks: Webhook[];
  teamsWebhookUrl?: string;
  geminiApiKey?: string;
  ticketPrefix?: string | null;
  vacationDaysPerYear?: number;
  powerbiEstimatorEnabled?: boolean;
  updatedAt?: string; // ISO or Firebase Timestamp representation depending on infra mapping
}
