import { LoggerService } from '../services/LoggerService';
import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { db } from './FirebaseConfig';
import { Vacation } from '../../domain/models/Vacation';

export class FirebaseVacationRepository {
  
  public subscribeToVacations(projectId: string, onUpdate: (vacations: Vacation[]) => void): () => void {
    const q = query(collection(db, `projects/${projectId}/vacations`));
    
    return onSnapshot(q, (snapshot) => {
      const vacations: Vacation[] = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Vacation));
      onUpdate(vacations);
    }, (error) => {
      LoggerService.error("Error subscribing to vacations:", error);
    });
  }

  public async getVacations(projectId: string): Promise<Vacation[]> {
    const q = query(collection(db, `projects/${projectId}/vacations`));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Vacation));
  }

  public async addVacation(projectId: string, vacation: Vacation): Promise<void> {
    const docRef = doc(db, `projects/${projectId}/vacations`, vacation.id);
    await setDoc(docRef, vacation);
  }

  public async updateVacation(projectId: string, vacationId: string, data: Partial<Vacation>): Promise<void> {
    const docRef = doc(db, `projects/${projectId}/vacations`, vacationId);
    await updateDoc(docRef, data);
  }

  public async deleteVacation(projectId: string, vacationId: string): Promise<void> {
    const docRef = doc(db, `projects/${projectId}/vacations`, vacationId);
    await deleteDoc(docRef);
  }
}
