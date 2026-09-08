import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from './FirebaseConfig';
import { ProjectRepository } from '../../domain/repositories/ProjectRepository';
import { Project } from '../../domain/models/Project';

export class FirebaseProjectRepository implements ProjectRepository {
  private getCollectionRef() {
    return collection(db, 'projects');
  }

  async getProjects(userEmail: string, userUid: string): Promise<Project[]> {
    const isSuperAdmin = userEmail.toLowerCase() === 'ntercerotuda@gmail.com';
    const colRef = this.getCollectionRef();
    
    if (isSuperAdmin) {
      const snap = await getDocs(colRef);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    }
    
    const qPublic = query(colRef, where('visibility', '==', 'public'));
    const qOwner = query(colRef, where('ownerUid', '==', userUid));
    const qAllowed = query(colRef, where('allowedEmails', 'array-contains', userEmail));
    
    const [snapPublic, snapOwner, snapAllowed] = await Promise.all([
      getDocs(qPublic).catch(() => ({ docs: [] })),
      getDocs(qOwner).catch(() => ({ docs: [] })),
      getDocs(qAllowed).catch(() => ({ docs: [] }))
    ]);
    
    const projectsMap = new Map<string, Project>();
    
    const addDocs = (docs: any[]) => {
      docs.forEach(doc => {
        if (!projectsMap.has(doc.id)) {
          projectsMap.set(doc.id, { id: doc.id, ...doc.data() } as Project);
        }
      });
    };
    
    addDocs(snapPublic.docs || []);
    addDocs(snapOwner.docs || []);
    addDocs(snapAllowed.docs || []);
    
    return Array.from(projectsMap.values());
  }

  async getProjectById(projectId: string): Promise<Project | null> {
    const docRef = doc(this.getCollectionRef(), projectId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as Project;
  }

  async createProject(projectData: Omit<Project, 'id' | 'updatedAt'>): Promise<string> {
    // Generates a canonical ID from the name as per original logic
    const projId = projectData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'default';
    const docRef = doc(this.getCollectionRef(), projId);
    
    await setDoc(docRef, {
      ...projectData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    return projId;
  }

  async updateProject(projectId: string, data: Partial<Project>): Promise<void> {
    const docRef = doc(this.getCollectionRef(), projectId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }

  async deleteProject(projectId: string): Promise<void> {
    const docRef = doc(this.getCollectionRef(), projectId);
    await deleteDoc(docRef);
  }
}
