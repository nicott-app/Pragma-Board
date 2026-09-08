export interface Note {
  id: string;
  authorId: string;
  projectId: string;
  content: string;
  linkedTicketId?: string;
  reviewed?: boolean;
  sessionDate?: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
}
