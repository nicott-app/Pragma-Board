import React, { useState } from 'react';
import { useAuthStore } from '../../../../application/store/useAuthStore';
import { useToastStore } from '../../../../application/store/useToastStore';
import { FirebaseAuthService } from '../../../../infrastructure/firebase/FirebaseAuthService';

export const PreferencesSettingsTab: React.FC = () => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser);
  const addToast = useToastStore((s) => s.addToast);
  const authService = new FirebaseAuthService();

  const [defaultFilterToMe, setDefaultFilterToMe] = useState(
    currentUser?.preferences?.defaultFilterToMe ?? true
  );
  const [showPowerBIEstimator, setShowPowerBIEstimator] = useState(
    currentUser?.preferences?.showPowerBIEstimator ?? true
  );
  const [isDeleting, setIsDeleting] = useState(false);

  if (!currentUser) return null;

  const handleSavePreferences = async () => {
    try {
      await authService.updateUserPreferences(currentUser.uid, {
        defaultFilterToMe,
        showPowerBIEstimator,
      });
      setCurrentUser({
        ...currentUser,
        preferences: {
          ...currentUser.preferences,
          defaultFilterToMe,
          showPowerBIEstimator,
        },
      });
      addToast('success', 'Preferencias guardadas correctamente.', 'Éxito');
    } catch (e: any) {
      addToast('error', 'Error al guardar preferencias: ' + e.message, 'Error');
    }
  };

  const handleDeleteAccount = async () => {
    const { useDialogStore } = await import('../../../../application/store/useDialogStore');
    const confirm1 = await useDialogStore.getState().showConfirm(
      '⚠️ ELIMINAR CUENTA',
      'Estás a punto de ELIMINAR tu cuenta de forma PERMANENTE.\n\nEsto borrará tu perfil, configuración y acceso a todos los proyectos.\n¿Estás seguro de que quieres continuar?'
    );
    if (!confirm1) return;

    const confirm2 = await useDialogStore.getState().showPrompt(
      'Confirmación Final',
      'Para confirmar la eliminación, escribe "ELIMINAR" en mayúsculas:'
    );
    if (confirm2 !== 'ELIMINAR') {
      addToast('info', 'Eliminación cancelada.', 'Aviso');
      return;
    }

    setIsDeleting(true);
    try {
      await authService.deleteCurrentUser();
      // Si se borra con éxito, authService internamente llama a signOut, por lo que currentUser será null y la app volverá a la pantalla de Login automáticamente.
    } catch (e: any) {
      setIsDeleting(false);
      if (e.code === 'auth/requires-recent-login') {
        addToast(
          'error',
          'Por seguridad, debes cerrar sesión y volver a entrar antes de eliminar tu cuenta.',
          'Requiere Autenticación Reciente'
        );
      } else {
        addToast('error', 'Error al eliminar la cuenta: ' + e.message, 'Error Crítico');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px' }}>
      <div>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--tx-primary)', margin: '0 0 1rem 0' }}>
          Tus Preferencias Globales
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={defaultFilterToMe}
              onChange={(e) => setDefaultFilterToMe(e.target.checked)}
              style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--ac)' }}
            />
            <div>
              <div style={{ color: 'var(--tx-primary)', fontWeight: 500 }}>Filtrar tickets asignados a mí por defecto</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--tx-secondary)' }}>Al entrar a un proyecto, aplica automáticamente el filtro para ver solo tus tareas.</div>
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showPowerBIEstimator}
              onChange={(e) => setShowPowerBIEstimator(e.target.checked)}
              style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--ac)' }}
            />
            <div>
              <div style={{ color: 'var(--tx-primary)', fontWeight: 500 }}>Mostrar icono de Estimador Power BI</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--tx-secondary)' }}>Muestra u oculta el acceso directo al Estimador PB en la barra superior.</div>
            </div>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={handleSavePreferences}>
            Guardar Preferencias
          </button>
          
          <button 
            type="button" 
            onClick={() => {
              import('../../../../application/store/useUIStore').then(({ useUIStore }) => {
                useUIStore.getState().setPrivacyOpen(true);
              });
            }}
            style={{ background: 'none', border: 'none', color: 'var(--ac)', cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'underline' }}
          >
            Ver Política de Privacidad
          </button>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--bd-subtle)', paddingTop: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--error)', margin: '0 0 1rem 0' }}>
          Derecho al Olvido (GDPR)
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--tx-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
          En cumplimiento con el RGPD, puedes solicitar la eliminación permanente de tu cuenta y datos personales. 
          Al hacer esto perderás acceso a todos los proyectos en los que participas. Los tickets y comentarios que 
          hayas creado permanecerán en los proyectos (por integridad referencial) pero tu usuario dejará de existir.
        </p>
        <button 
          className="btn" 
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          style={{ 
            background: 'var(--error)', 
            color: 'white', 
            border: 'none', 
            opacity: isDeleting ? 0.7 : 1,
            cursor: isDeleting ? 'not-allowed' : 'pointer' 
          }}
        >
          {isDeleting ? 'Eliminando cuenta...' : '🗑️ Eliminar mi cuenta permanentemente'}
        </button>
      </div>
    </div>
  );
};
