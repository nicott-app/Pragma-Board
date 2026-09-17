import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from './FirebaseConfig';
import { ProjectRepository } from '../../domain/repositories/ProjectRepository';
import { Project, BoardColumn } from '../../domain/models/Project';

/**
 * Assigns semantic roles to columns that were created before the `role`
 * field was introduced, so all downstream consumers can rely on it being
 * present without requiring a Firestore migration.
 *
 * Rules (only applied when `role` is absent):
 *   index 0          → 'backlog'
 *   index (last)     → 'done'
 *   everything else  → 'active'
 */
function inferColumnRoles(columns: BoardColumn[]): BoardColumn[] {
  if (!columns || columns.length === 0) return columns;
  return columns.map((col, idx) => {
    if (col.role) return col; // already has an explicit role — respect it
    if (idx === 0) return { ...col, role: 'backlog' as const };
    if (idx === columns.length - 1) return { ...col, role: 'done' as const };
    return { ...col, role: 'active' as const };
  });
}


export class FirebaseProjectRepository implements ProjectRepository {
  private getCollectionRef() {
    return collection(db, 'projects');
  }

  async getProjects(userEmail: string, userUid: string): Promise<Project[]> {
    const isSuperAdmin = userEmail.toLowerCase() === 'ntercerotuda@gmail.com';
    const colRef = this.getCollectionRef();
    
    if (isSuperAdmin) {
      const snap = await getDocs(colRef);
      return snap.docs.map(doc => {
        const p = { id: doc.id, ...doc.data() } as Project;
        return { ...p, columns: inferColumnRoles(p.columns || []) };
      });
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
          const p = { id: doc.id, ...doc.data() } as Project;
          projectsMap.set(doc.id, { ...p, columns: inferColumnRoles(p.columns || []) });
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
    const p = { id: snapshot.id, ...snapshot.data() } as Project;
    return { ...p, columns: inferColumnRoles(p.columns || []) };
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
