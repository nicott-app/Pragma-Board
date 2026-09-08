import React, { useState } from 'react';
import { useProjectStore } from '../../../../application/store/useProjectStore';
import { useAuthStore } from '../../../../application/store/useAuthStore';
import { useDialogStore } from '../../../../application/store/useDialogStore';
import { FirebaseProjectRepository } from '../../../../infrastructure/firebase/FirebaseProjectRepository';

const projectRepo = new FirebaseProjectRepository();

interface Props {
  isAdmin: boolean;
}

export const MembersSettingsTab: React.FC<Props> = ({ isAdmin }) => {
  const activeProject = useProjectStore((s) => s.activeProject);
  const setActiveProject = useProjectStore((s) => s.setActiveProject);
  const currentUser = useAuthStore((s) => s.currentUser);
  const [inviteEmail, setInviteEmail] = useState('');

  if (!activeProject || !currentUser) return null;

  const handleInvite = async () => {
    if (!isAdmin) return;
    if (!inviteEmail || !inviteEmail.includes('@')) {
      await useDialogStore.getState().showAlert('Aviso', 'Correo inválido');
      return;
    }

    const email = inviteEmail.trim().toLowerCase();
    const currentEmails = activeProject.allowedEmails || [];
    if (currentEmails.includes(email)) {
      await useDialogStore.getState().showAlert('Aviso', 'Ya está en la lista de permitidos');
      return;
    }

    const newAllowed = [...currentEmails, email];
    try {
      await projectRepo.updateProject(activeProject.id, { allowedEmails: newAllowed });
      setActiveProject({ ...activeProject, allowedEmails: newAllowed });

      setInviteEmail('');
      await useDialogStore
        .getState()
        .showAlert('Éxito', 'Correo añadido. El usuario podrá acceder al iniciar sesión.');
    } catch (e) {
      await useDialogStore.getState().showAlert('Error', 'Error invitando');
    }
  };

  const handleRoleChange = async (memberUid: string, newRole: string) => {
    if (!isAdmin) return;

    // Si se intenta quitar el rol de admin a alguien (o a sí mismo)
    if (newRole === 'member') {
      const currentAdmins = activeProject.members.filter(
        (m) => activeProject.roles?.[m.id] === 'admin' || m.id === activeProject.ownerUid
      );

      const isCurrentlyAdmin =
        activeProject.roles?.[memberUid] === 'admin' || memberUid === activeProject.ownerUid;

      if (isCurrentlyAdmin && currentAdmins.length <= 1) {
        await useDialogStore
          .getState()
          .showAlert('Aviso', 'Debe haber SIEMPRE, al menos, un administrador en el proyecto.');
        return;
      }
    }

    const newRoles = { ...(activeProject.roles || {}) };
    let newOwnerUid = activeProject.ownerUid;

    if (newRole === 'member') {
      delete newRoles[memberUid];
      if (memberUid === activeProject.ownerUid) {
        newOwnerUid = null;
      }
    } else {
      newRoles[memberUid] = newRole;
    }

    try {
      await projectRepo.updateProject(activeProject.id, { roles: newRoles, ownerUid: newOwnerUid });
      setActiveProject({ ...activeProject, roles: newRoles, ownerUid: newOwnerUid });
      await useDialogStore.getState().showAlert('Éxito', 'Rol cambiado correctamente.');
    } catch (e) {
      await useDialogStore.getState().showAlert('Error', 'Error cambiando rol');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Equipo y Roles</h3>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          className="form-input"
          placeholder="correo del nuevo miembro..."
          style={{ flex: 1 }}
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
        />
        <button className="btn btn-secondary" disabled={!isAdmin} onClick={handleInvite}>
          Invitar
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--bd-strong)', textAlign: 'left' }}>
            <th style={{ padding: '0.5rem' }}>Nombre</th>
            <th style={{ padding: '0.5rem' }}>Rol</th>
            <th style={{ padding: '0.5rem' }}>Color</th>
          </tr>
        </thead>
        <tbody>
          {activeProject.members.map((m) => (
            <tr key={m.id} style={{ borderBottom: '1px solid var(--bd-subtle)' }}>
              <td
                style={{
                  padding: '0.75rem 0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: m.color,
                    display: 'inline-block',
                  }}
                ></span>
                {m.name} {m.id === currentUser.uid ? '(Tú)' : ''}
              </td>
              <td style={{ padding: '0.75rem 0.5rem' }}>
                <select
                  className="form-select"
                  style={{
                    padding: '0.25rem',
                    fontSize: '0.875rem',
                    border: '1px solid var(--bd-subtle)',
                    background: 'var(--bg-s1)',
                    borderRadius: '4px',
                  }}
                  value={
                    activeProject.roles?.[m.id] === 'admin' || activeProject.ownerUid === m.id
                      ? 'admin'
                      : 'member'
                  }
                  onChange={(e) => handleRoleChange(m.id, e.target.value)}
                  disabled={!isAdmin}
                >
                  <option value="member">Miembro</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td style={{ padding: '0.75rem 0.5rem' }}>
                <input
                  type="color"
                  value={m.color}
                  disabled
                  style={{
                    border: 'none',
                    background: 'none',
                    padding: 0,
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
