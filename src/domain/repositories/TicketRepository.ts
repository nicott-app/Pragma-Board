import { Ticket } from '../models/Ticket';

export interface TicketRepository {
  getTickets(projectId: string): Promise<Ticket[]>;
  getTicketById(projectId: string, ticketId: string): Promise<Ticket | null>;
  createTicket(projectId: string, ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>;
  updateTicket(projectId: string, ticketId: string, data: Partial<Ticket>): Promise<void>;
  deleteTicket(projectId: string, ticketId: string): Promise<void>;
  subscribeToTickets(projectId: string, onUpdate: (tickets: Ticket[]) => void): () => void;
}
