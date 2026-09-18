import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './FirebaseConfig';
import { User } from '../../domain/models/User';

export class FirebaseAuthService {
  async login(email: string, pass: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return this.mapFirebaseUserToDomain(cred.user);
  }

  async register(name: string, email: string, pass: string): Promise<User> {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    await cred.user.reload();
    const user = await this.mapFirebaseUserToDomain(auth.currentUser || cred.user);
    
    // Explicitly set isApproved to false for new registrations
    user.isApproved = false;
    
    // Save to Firestore as per original logic
    await this.saveUserProfile(user);
    
    return user;
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  async deleteCurrentUser(): Promise<void> {
    const user = auth.currentUser;
    if (user) {
      // Import deleteUser dynamically to avoid changing top-level imports heavily if not needed,
      // but actually we can just use deleteUser from firebase/auth.
      const { deleteUser } = await import('firebase/auth');
      await deleteUser(user);
    } else {
      throw new Error('No hay usuario autenticado');
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const user = await this.mapFirebaseUserToDomain(fbUser);
        await this.saveUserProfile(user);
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  private async mapFirebaseUserToDomain(fbUser: FirebaseUser): Promise<User> {
    const isSuperAdmin = fbUser.email?.toLowerCase() === 'ntercerotuda@gmail.com';
    
    // Original color hashing logic
    const colors = [
      '#4f46e5', '#0284c7', '#0891b2', '#0d9488', '#059669', '#16a34a',
      '#ca8a04', '#ea580c', '#e11d48', '#be185d', '#7c3aed', '#db2777'
    ];

    // Fetch existing preferences
    const ref = doc(db, 'users', fbUser.uid);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};

    const name = data.name || fbUser.displayName || fbUser.email?.split('@')[0] || 'Usuario';
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = colors[Math.abs(hash) % colors.length];

    return {
      uid: fbUser.uid,
      email: fbUser.email || '',
      name,
      role: isSuperAdmin ? 'super-admin' : 'collaborator',
      color: data.color || color,
      preferences: data.preferences || {},
      isApproved: data.isApproved === undefined ? true : data.isApproved
    };
  }

  async updateUserPreferences(uid: string, preferences: any): Promise<void> {
    const ref = doc(db, 'users', uid);
    await setDoc(ref, { preferences }, { merge: true });
  }

  private async saveUserProfile(user: User): Promise<void> {
    const ref = doc(db, 'users', user.uid);
    await setDoc(ref, {
      uid: user.uid,
      name: user.name,
      email: user.email,
      color: user.color,
      isApproved: user.isApproved,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }
}
