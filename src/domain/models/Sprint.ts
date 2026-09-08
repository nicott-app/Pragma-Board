export interface Sprint {
  id: string;
  name: string;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  goal?: string;
  active: boolean; // Legacy
  status?: 'planning' | 'active' | 'completed';
  capacityHours?: number;
  retrospective?: string;
}
