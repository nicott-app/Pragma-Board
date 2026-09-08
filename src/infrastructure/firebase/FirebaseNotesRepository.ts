import { LoggerService } from '../services/LoggerService';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from './FirebaseConfig';
import { Note } from '../../domain/models/Note';

export class FirebaseNotesRepository {
  private getCollectionRef(projectId: string) {
    return collection(db, 'projects', projectId, 'notes');
  }

  async getNotes(projectId: string, userId: string): Promise<Note[]> {
    const q = query(
      this.getCollectionRef(projectId), 
      where('authorId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Note));
  }

  async getNotesByTicketId(projectId: string, ticketId: string): Promise<Note[]> {
    const q = query(
      this.getCollectionRef(projectId), 
      where('linkedTicketId', '==', ticketId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Note));
  }

  subscribeToUnreviewedNotes(projectId: string, callback: (notes: Note[]) => void): () => void {
    const q = query(
      this.getCollectionRef(projectId),
      where('reviewed', '==', false)
    );
    return onSnapshot(q, (snapshot) => {
      const notes = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Note));
      callback(notes);
    }, (error) => {
      LoggerService.error("Error in subscribeToUnreviewedNotes:", error);
    });
  }

  async addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(this.getCollectionRef(note.projectId), {
      ...note,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  async updateNote(projectId: string, id: string, data: Partial<Note>): Promise<void> {
    const docRef = doc(this.getCollectionRef(projectId), id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  }

  async deleteNote(projectId: string, id: string): Promise<void> {
    const docRef = doc(this.getCollectionRef(projectId), id);
    await deleteDoc(docRef);
  }
}
