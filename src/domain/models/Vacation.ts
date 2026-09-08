export interface Vacation {
  id: string;
  memberId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  notes?: string;
  type: 'vacation' | 'leave';
  validated: boolean;
  createdAt: string;
}
