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

export interface RICEScore {
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
  total_score: number;
  rationale: string;
}

export interface WSJFScore {
  user_business_value: number;
  time_criticality: number;
  risk_reduction_opportunity: number;
  job_size: number;
  total_score: number;
  rationale: string;
}

export interface MoSCoWScore {
  category: 'Must have' | 'Should have' | 'Could have' | "Won't have" | string;
  rationale: string;
}

export interface ValueComplexityScore {
  value: number;
  complexity: number;
  quadrant: 'Quick Win' | 'Major Project' | 'Fill In' | 'Time Waster' | string;
  rationale: string;
}

export interface KanoScore {
  category: 'Basic' | 'Performance' | 'Excitement' | string;
  rationale: string;
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
  rice_score?: RICEScore;
  wsjf_score?: WSJFScore;
  moscow_score?: MoSCoWScore;
  value_complexity_score?: ValueComplexityScore;
  kano_score?: KanoScore;
  order?: number;
}
