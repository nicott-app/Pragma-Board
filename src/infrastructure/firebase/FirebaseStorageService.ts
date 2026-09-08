import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './FirebaseConfig';
import { Attachment } from '../../domain/models/Ticket';

export class FirebaseStorageService {
  /**
   * Upload a file to Firebase Storage and return its Attachment metadata.
   * @param projectId  The project ID (used to organize files)
   * @param ticketId   The ticket ID (used to organize files)
   * @param file       The File object to upload
   * @param uploaderUid  UID of the user uploading
   * @param onProgress Optional progress callback (0–100)
   */
  static async uploadAttachment(
    projectId: string,
    ticketId: string,
    file: File,
    uploaderUid: string,
    onProgress?: (pct: number) => void
  ): Promise<Attachment> {
    const fileId = crypto.randomUUID();
    const extension = file.name.split('.').pop() || '';
    const storagePath = `projects/${projectId}/tickets/${ticketId}/${fileId}.${extension}`;
    const storageRef = ref(storage, storagePath);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress?.(pct);
        },
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          const attachment: Attachment = {
            id: fileId,
            name: file.name,
            url,
            size: file.size,
            uploadedBy: uploaderUid,
            createdAt: new Date().toISOString(),
          };
          resolve(attachment);
        }
      );
    });
  }

  /**
   * Delete a file from Firebase Storage by its download URL.
   */
  static async deleteAttachment(
    projectId: string,
    ticketId: string,
    attachmentId: string,
    fileName: string
  ): Promise<void> {
    const extension = fileName.split('.').pop() || '';
    const storagePath = `projects/${projectId}/tickets/${ticketId}/${attachmentId}.${extension}`;
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  }

  /**
   * Format bytes to a human-readable string.
   */
  static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  /**
   * Get a file icon based on the file extension.
   */
  static getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const icons: Record<string, string> = {
      pdf: '📄',
      doc: '📝', docx: '📝',
      xls: '📊', xlsx: '📊',
      ppt: '📋', pptx: '📋',
      png: '🖼️', jpg: '🖼️', jpeg: '🖼️', gif: '🖼️', svg: '🖼️', webp: '🖼️',
      zip: '📦', rar: '📦', '7z': '📦',
      txt: '📃',
      csv: '📊',
      mp4: '🎬', mov: '🎬', avi: '🎬',
      mp3: '🎵', wav: '🎵',
    };
    return icons[ext] || '📎';
  }
}
