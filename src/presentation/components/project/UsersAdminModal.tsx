import React, { useEffect, useState, useRef } from 'react';
import { useModalA11y } from '../../../application/hooks/useModalA11y';
import { useUIStore } from '../../../application/store/useUIStore';
import { useToastStore } from '../../../application/store/useToastStore';
import { useDialogStore } from '../../../application/store/useDialogStore';
import { useAuthStore } from '../../../application/store/useAuthStore';
import { useProjectStore } from '../../../application/store/useProjectStore';
import { FirebaseUserRepository } from '../../../infrastructure/firebase/FirebaseUserRepository';
import { User } from '../../../domain/models/User';

const userRepo = new FirebaseUserRepository();

export const UsersAdminModal: React.FC = () => {
  const setUsersAdminOpen = useUIStore((s) => s.setUsersAdminOpen);
  const addToast = useToastStore((s) => s.addToast);
  const modalRef = useRef<HTMLDivElement>(null);

  useModalA11y(true, () => setUsersAdminOpen(false), modalRef);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await userRepo.getAllUsers();

      const currentUser = useAuthStore.getState().currentUser;
      const activeProject = useProjectStore.getState().activeProject;

      if (currentUser?.role === 'super-admin') {
        setUsers(allUsers);
      } else if (activeProject) {
        // Project Admins only see users of their active project
        const projectUsers = allUsers.filter(
          (u) =>
            activeProject.allowedEmails?.includes(u.email) ||
            activeProject.members?.some((m) => m.id === u.uid)
        );
        setUsers(projectUsers);
      } else {
        setUsers([]);
      }
    } catch (e) {
      addToast('error', 'Error al cargar usuarios', 'Error');
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (uid: string, currentStatus: boolean) => {
    try {
      await userRepo.updateUserApproval(uid, !currentStatus);
      setUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, isApproved: !currentStatus } : u))
      );
      addToast('success', 'Estado del usuario actualizado', 'Éxito');
    } catch (e: any) {
      addToast('error', `Error al actualizar usuario: ${e.message || 'Desconocido'}`, 'Error');
    }
  };

  const changeRole = async (uid: string, newRole: string) => {
    try {
      await userRepo.updateUserRole(uid, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, role: newRole as User['role'] } : u))
      );
      addToast('success', 'Rol de usuario actualizado', 'Éxito');
    } catch (e: any) {
      addToast('error', `Error al actualizar rol: ${e.message || 'Desconocido'}`, 'Error');
    }
  };

  const deleteUser = async (uid: string, userName: string) => {
    const confirm = await useDialogStore
      .getState()
      .showConfirm(
        'Eliminar usuario',
        `¿Estás seguro de que deseas eliminar permanentemente a "${userName}" de la base de datos? Esto impedirá su acceso a la plataforma de forma definitiva.`
      );
    if (!confirm) return;

    try {
      await userRepo.deleteUser(uid);
      setUsers((prev) => prev.filter((u) => u.uid !== uid));
      addToast('success', 'Usuario eliminado correctamente', 'Éxito');
    } catch (e: any) {
      addToast('error', `Error al eliminar usuario: ${e.message || 'Desconocido'}`, 'Error');
    }
  };

  return (
    <div className="overlay active" style={{ zIndex: 1000 }}>
      <div
        className="modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        style={{
          width: 'min(800px,96vw)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--bd-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            flexShrink: 0,
            alignItems: 'center',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--tx-primary)', margin: 0 }}>
              Gestión de Usuarios
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--tx-secondary)', margin: 0 }}>
              Administra los roles y el acceso a la plataforma
            </p>
          </div>
          <button
            className="modal-close"
            onClick={() => setUsersAdminOpen(false)}
            style={{ position: 'relative', top: 0, right: 0 }}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando usuarios...</div>
          ) : users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--tx-secondary)' }}>
              No hay usuarios registrados
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {users.map((u) => (
                <div
                  key={u.uid}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'var(--bg-s2)',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: u.color,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--tx-primary)' }}>{u.name}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--tx-secondary)' }}>
                        {u.email}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        background: u.isApproved
                          ? 'rgba(34, 197, 94, 0.1)'
                          : 'rgba(239, 68, 68, 0.1)',
                        color: u.isApproved ? '#22c55e' : '#ef4444',
                        fontWeight: 600,
                      }}
                    >
                      {u.isApproved ? 'Aprobado' : 'Pendiente'}
                    </div>

                    <select
                      className="input"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', width: 'auto' }}
                      value={u.role}
                      onChange={(e) => changeRole(u.uid, e.target.value)}
                      disabled={u.role === 'super-admin'}
                    >
                      <option value="collaborator">Colaborador</option>
                      <option value="admin">Administrador</option>
                      {(u.role === 'super-admin' ||
                        useAuthStore.getState().currentUser?.role === 'super-admin') && (
                        <option value="super-admin">Super Admin</option>
                      )}
                    </select>

                    {u.role !== 'super-admin' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className={`btn btn-sm ${u.isApproved ? 'btn-secondary' : 'btn-primary'}`}
                          onClick={() => toggleApproval(u.uid, !!u.isApproved)}
                          style={{ width: '100px' }}
                        >
                          {u.isApproved ? 'Revocar' : 'Aprobar'}
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => deleteUser(u.uid, u.name)}
                          style={{ padding: '0.25rem 0.5rem', color: '#ef4444' }}
                          title="Eliminar usuario"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
