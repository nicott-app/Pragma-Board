import { create } from 'zustand';
import { Ticket } from '../../domain/models/Ticket';
import { Note } from '../../domain/models/Note';
import { Vacation } from '../../domain/models/Vacation';

export interface DataStore {
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
  unreviewedNotes: Note[];
  setUnreviewedNotes: (notes: Note[]) => void;
  vacations: Vacation[];
  setVacations: (vacations: Vacation[]) => void;
}

export const useDataStore = create<DataStore>((set) => ({
  tickets: [],
  setTickets: (tickets) => set({ tickets }),
  
  unreviewedNotes: [],
  setUnreviewedNotes: (notes) => set({ unreviewedNotes: notes }),

  vacations: [],
  setVacations: (vacations) => set({ vacations }),
}));
