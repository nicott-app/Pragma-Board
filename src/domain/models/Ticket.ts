export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketType = 'tarea' | 'bug' | 'desarrollo' | 'mejora' | 'incidencia' | 'analisis' | 'entregable';

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string; // ISO 8601
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TimeLog {
  id: string;
  authorId: string;
  authorName: string;
  hours: number;
  description: string;
  createdAt: string; // ISO 8601
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedBy: string;
  createdAt: string; // ISO 8601
}

export interface HistoryEvent {
  id: string;
  action: string;
  actorId: string;
  actorName: string;
  timestamp: string; // ISO 8601
  details?: string;
}

export interface Ticket {
  id: string;
  code?: string; // Legacy format DA-026
  title: string;
  description: string;
  type: TicketType;
  priority: TicketPriority;
  status: string; // references BoardColumn.id
  assignees: string[]; // array of User uids
  estimatedHours?: number | null; // Replaced storyPoints
  sprintId?: string | null;
  tags: string[];
  acceptanceCriteria: string[];
  subtasks?: Subtask[];
  comments: Comment[];
  isBlocked?: boolean;
  blockerReason?: string | null;
  timeLogs?: TimeLog[];
  attachments?: Attachment[];
  history?: HistoryEvent[];
  archived?: boolean;
  isAI?: boolean;
  dueDate?: string | null; // ISO 8601
  doneAt?: string; // ISO 8601
  createdAt: string;
  updatedAt: string;
  order?: number;
}
