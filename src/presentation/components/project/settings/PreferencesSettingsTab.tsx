import React from 'react';
import { useAuthStore } from '../../../../application/store/useAuthStore';
import { FirebaseAuthService } from '../../../../infrastructure/firebase/FirebaseAuthService';

export const PreferencesSettingsTab: React.FC = () => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const updateCurrentUserPreferences = useAuthStore((s) => s.updateCurrentUserPreferences);

  if (!currentUser) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Mis Preferencias</h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--tx-secondary)' }}>
        Estos ajustes solo afectan a tu usuario en este dispositivo.
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: 'var(--bg-s2)',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid var(--bd-subtle)',
        }}
      >
        <label
          style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}
        >
          <input
            type="checkbox"
            checked={currentUser.preferences?.autoAssign ?? false}
            onChange={async (e) => {
              const val = e.target.checked;
              updateCurrentUserPreferences({ autoAssign: val });
              new FirebaseAuthService().updateUserPreferences(currentUser.uid, {
                ...currentUser.preferences,
                autoAssign: val,
              });
            }}
            style={{ marginTop: '0.25rem' }}
          />
          <div className="d-flex flex-col">
            <span style={{ fontWeight: 600, color: 'var(--tx-primary)' }}>
              Auto-asignación inteligente
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--tx-muted)' }}>
              Asignarte automáticamente los tickets "Sin asignar" cuando los mueves a una columna en
              progreso.
            </span>
          </div>
        </label>

        <label
          style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}
        >
          <input
            type="checkbox"
            checked={currentUser.preferences?.hideDoneColumn ?? false}
            onChange={async (e) => {
              const val = e.target.checked;
              updateCurrentUserPreferences({ hideDoneColumn: val });
              new FirebaseAuthService().updateUserPreferences(currentUser.uid, {
                ...currentUser.preferences,
                hideDoneColumn: val,
              });
            }}
            style={{ marginTop: '0.25rem' }}
          />
          <div className="d-flex flex-col">
            <span style={{ fontWeight: 600, color: 'var(--tx-primary)' }}>
              Ocultar columna "Hecho"
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--tx-muted)' }}>
              Ocultar visualmente la columna de tareas completadas en el tablero principal.
            </span>
          </div>
        </label>

        <label
          style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}
        >
          <input
            type="checkbox"
            checked={currentUser.preferences?.strictWip ?? false}
            onChange={async (e) => {
              const val = e.target.checked;
              updateCurrentUserPreferences({ strictWip: val });
              new FirebaseAuthService().updateUserPreferences(currentUser.uid, {
                ...currentUser.preferences,
                strictWip: val,
              });
            }}
            style={{ marginTop: '0.25rem' }}
          />
          <div className="d-flex flex-col">
            <span style={{ fontWeight: 600, color: 'var(--tx-primary)' }}>
              Límites WIP estrictos
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--tx-muted)' }}>
              Bloquear visualmente columnas que superen su límite de Work In Progress.
            </span>
          </div>
        </label>

        <label
          style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}
        >
          <input
            type="checkbox"
            checked={currentUser.preferences?.compactMode ?? false}
            onChange={async (e) => {
              const val = e.target.checked;
              updateCurrentUserPreferences({ compactMode: val });
              new FirebaseAuthService().updateUserPreferences(currentUser.uid, {
                ...currentUser.preferences,
                compactMode: val,
              });
            }}
            style={{ marginTop: '0.25rem' }}
          />
          <div className="d-flex flex-col">
            <span style={{ fontWeight: 600, color: 'var(--tx-primary)' }}>Modo Compacto</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--tx-muted)' }}>
              Ocultar etiquetas y descripciones en el tablero para ver más información de un
              vistazo.
            </span>
          </div>
        </label>

        <label
          style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}
        >
          <input
            type="checkbox"
            checked={currentUser.preferences?.soundNotifications ?? false}
            onChange={async (e) => {
              const val = e.target.checked;
              updateCurrentUserPreferences({ soundNotifications: val });
              new FirebaseAuthService().updateUserPreferences(currentUser.uid, {
                ...currentUser.preferences,
                soundNotifications: val,
              });
            }}
            style={{ marginTop: '0.25rem' }}
          />
          <div className="d-flex flex-col">
            <span style={{ fontWeight: 600, color: 'var(--tx-primary)' }}>
              Notificaciones de Sonido
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--tx-muted)' }}>
              Reproducir un pequeño sonido al completar una tarea o recibir notificaciones.
            </span>
          </div>
        </label>

        <label
          style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}
        >
          <input
            type="checkbox"
            checked={currentUser.preferences?.defaultFilterToMe ?? false}
            onChange={async (e) => {
              const val = e.target.checked;
              updateCurrentUserPreferences({ defaultFilterToMe: val });
              new FirebaseAuthService().updateUserPreferences(currentUser.uid, {
                ...currentUser.preferences,
                defaultFilterToMe: val,
              });
            }}
            style={{ marginTop: '0.25rem' }}
          />
          <div className="d-flex flex-col">
            <span style={{ fontWeight: 600, color: 'var(--tx-primary)' }}>
              Filtro personal por defecto
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--tx-muted)' }}>
              Al entrar al proyecto, filtrar automáticamente el tablero para mostrar solo tus
              tareas.
            </span>
          </div>
        </label>

        <label
          style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}
        >
          <input
            type="checkbox"
            checked={currentUser.preferences?.showPowerBIEstimator ?? true}
            onChange={async (e) => {
              const val = e.target.checked;
              updateCurrentUserPreferences({ showPowerBIEstimator: val });
              new FirebaseAuthService().updateUserPreferences(currentUser.uid, {
                ...currentUser.preferences,
                showPowerBIEstimator: val,
              });
            }}
            style={{ marginTop: '0.25rem' }}
          />
          <div className="d-flex flex-col">
            <span style={{ fontWeight: 600, color: 'var(--tx-primary)' }}>
              Mostrar Herramientas PowerBI
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--tx-muted)' }}>
              Muestra u oculta el Estimador PowerBI y el Documentador en la barra superior.
            </span>
          </div>
        </label>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--bd-subtle)',
          }}
        >
          <div className="d-flex flex-col">
            <span style={{ fontWeight: 600, color: 'var(--tx-primary)' }}>Tema Visual</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--tx-muted)' }}>
              Selecciona la paleta de colores de la interfaz.
            </span>
          </div>
          <select
            className="form-select"
            style={{ width: '150px' }}
            value={currentUser.preferences?.theme || 'system'}
            onChange={async (e) => {
              const val = e.target.value as any;
              updateCurrentUserPreferences({ theme: val });
              new FirebaseAuthService().updateUserPreferences(currentUser.uid, {
                ...currentUser.preferences,
                theme: val,
              });
            }}
          >
            <option value="system">Sistema</option>
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
          </select>
        </div>
      </div>
    </div>
  );
};
