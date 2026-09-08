import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './FirebaseConfig';
import { User } from '../../domain/models/User';

export class FirebaseUserRepository {
  async getAllUsers(): Promise<User[]> {
    const col = collection(db, 'users');
    const snapshot = await getDocs(col);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        name: data.name || '',
        email: data.email || '',
        role: data.role || 'collaborator',
        color: data.color || '#4f46e5',
        preferences: data.preferences || {},
        isApproved: data.isApproved === undefined ? true : data.isApproved // Legacy users are approved by default
      } as User;
    });
  }

  async updateUserApproval(uid: string, isApproved: boolean): Promise<void> {
    const ref = doc(db, 'users', uid);
    await setDoc(ref, { isApproved }, { merge: true });
  }

  async updateUserRole(uid: string, role: string): Promise<void> {
    const ref = doc(db, 'users', uid);
    await setDoc(ref, { role }, { merge: true });
  }

  async deleteUser(uid: string): Promise<void> {
    const ref = doc(db, 'users', uid);
    await deleteDoc(ref);
  }
}
