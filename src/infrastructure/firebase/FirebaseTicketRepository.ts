import { LoggerService } from '../services/LoggerService';
import { collection, doc, getDoc, getDocs, addDoc, setDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, limit, runTransaction } from 'firebase/firestore';
import { db } from './FirebaseConfig';
import { TicketRepository } from '../../domain/repositories/TicketRepository';
import { Ticket } from '../../domain/models/Ticket';
import { TicketSchema } from '../../domain/schemas/TicketSchema';

/**
 * Returns a numeric sort key for a ticket.
 * - Tickets with a clean `order` field (written by the current reorder logic, i.e., multiples of 10000
 *   or values set via drag) sort by that field ascending.
 * - All other tickets (no order, or legacy garbage values) sort by createdAt descending as fallback.
 * The trick: we always normalise to a single comparable number where SMALLER = appears first.
 */
export function getTicketSortKey(t: Ticket): number {
  // If the ticket has a valid order field set by our drag logic, use it.
  // We identify "valid" as: the field exists and was set intentionally.
  // Because legacy values range from 1000 to -10000 and our new values
  // are large negative timestamps, we just use the value as-is — but we need
  // a coherent fallback for tickets without an order.
  if (t.order !== undefined && t.order !== null) {
    return t.order;
  }
  // If no order is defined, put them at the end of the list.
  return Number.MAX_SAFE_INTEGER;
}

export function sortTicketsByOrder(tickets: Ticket[]): void {
  tickets.sort((a, b) => getTicketSortKey(a) - getTicketSortKey(b));
}

/**
 * Recomputes order values for ALL tickets in a given column after a drag operation.
 * Assigns each ticket a clean index: 0, 10000, 20000, 30000...
 * Returns a map of { ticketId -> newOrder } for the tickets whose order changed.
 */
export function computeColumnOrders(
  columnTickets: Ticket[], // already in the desired visual order (after splice)
): Map<string, number> {
  const updates = new Map<string, number>();
  columnTickets.forEach((t, i) => {
    const desired = i * 10000;
    // Only update if the value is changing (avoids unnecessary writes)
    if (t.order !== desired) {
      updates.set(t.id, desired);
    }
  });
  return updates;
}


export class FirebaseTicketRepository implements TicketRepository {
  private getCollectionRef(projectId: string) {
    return collection(db, 'projects', projectId, 'tickets');
  }

  async getTickets(projectId: string): Promise<Ticket[]> {
    const q = query(this.getCollectionRef(projectId), orderBy('createdAt', 'desc'), limit(500));
    const snapshot = await getDocs(q);
    const tickets = snapshot.docs.map(doc => {
      const data = doc.data();
      const raw = { ...data, id: doc.id, code: data.code || data.id };
      const parsed = TicketSchema.safeParse(raw);
      if (!parsed.success) {
        console.warn(`Ticket validation failed for ${doc.id}:`, parsed.error);
        return raw as unknown as Ticket;
      }
      return parsed.data as unknown as Ticket;
    });
    sortTicketsByOrder(tickets);
    return tickets;
  }

  async getTicketById(projectId: string, ticketId: string): Promise<Ticket | null> {
    const docRef = doc(this.getCollectionRef(projectId), ticketId);
    const snapshot = await getDoc(docRef);
    const data = snapshot.data();
    if (!data) return null;
    const raw = { ...data, id: snapshot.id, code: data.code || data.id };
    const parsed = TicketSchema.safeParse(raw);
    return (parsed.success ? parsed.data : raw) as unknown as Ticket;
  }

  async createTicket(projectId: string, ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    let code = ticketData.code;
    
    // Auto-generate sequence code if missing
    if (!code) {
      try {
        const projDoc = await getDoc(doc(db, 'projects', projectId));
        const projData = projDoc.exists() ? projDoc.data() : { name: 'SB' };
        const projName = projData.name || 'SB';
        const prefix = projData.ticketPrefix || projName.substring(0, 2).toUpperCase().replace(/[^A-Z]/g, 'X');
        
        const counterRef = doc(db, 'projects', projectId, 'counters', 'tickets');
        const next = await runTransaction(db, async (transaction) => {
          const counterDoc = await transaction.get(counterRef);
          let newCount = 1;
          if (counterDoc.exists()) {
            newCount = (counterDoc.data().count || 0) + 1;
          }
          transaction.set(counterRef, { count: newCount }, { merge: true });
          return newCount;
        });
        
        code = `${prefix}-${String(next).padStart(3, '0')}`;
      } catch (e) {
        console.warn('Failed to generate ticket code', e);
        code = `TKT-${Math.floor(Math.random()*1000)}`;
      }
    }

    const docRef = await addDoc(this.getCollectionRef(projectId), {
      ...ticketData,
      code,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  async updateTicket(projectId: string, ticketId: string, data: Partial<Ticket>): Promise<void> {
    const docRef = doc(this.getCollectionRef(projectId), ticketId);
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  async deleteTicket(projectId: string, ticketId: string): Promise<void> {
    const docRef = doc(this.getCollectionRef(projectId), ticketId);
    await deleteDoc(docRef);
  }

  subscribeToTickets(projectId: string, onUpdate: (tickets: Ticket[]) => void): () => void {
    const q = query(this.getCollectionRef(projectId), orderBy('createdAt', 'desc'), limit(500));
    return onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map(doc => {
        const data = doc.data();
        return { ...data, id: doc.id, code: data.code || data.id } as Ticket;
      });
      sortTicketsByOrder(tickets);
      onUpdate(tickets);
    }, (error) => {
      LoggerService.error('[FirebaseTicketRepository] Subscription error:', error);
    });
  }
}
