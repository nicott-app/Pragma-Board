import React from 'react';
import { useAuthStore } from '../../../application/store/useAuthStore';
import { useUIStore } from '../../../application/store/useUIStore';
import { useProjectStore } from '../../../application/store/useProjectStore';
import { ProjectSelector } from '../project/ProjectSelector';
import { FirebaseAuthService } from '../../../infrastructure/firebase/FirebaseAuthService';

export const Topbar: React.FC = () => {
  const currentUser = useAuthStore((s) => s.currentUser);

  const filterSearchQuery = useUIStore((s) => s.filterSearchQuery);
  const setFilterSearchQuery = useUIStore((s) => s.setFilterSearchQuery);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const currentView = useUIStore((s) => s.currentView);
  const setCurrentView = useUIStore((s) => s.setCurrentView);
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);
  const setMetricsOpen = useUIStore((s) => s.setMetricsOpen);
  const setEstimatorOpen = useUIStore((s) => s.setEstimatorOpen);
  const setDailyOpen = useUIStore((s) => s.setDailyOpen);
  const setVacationsOpen = useUIStore((s) => s.setVacationsOpen);
  const setNotesOpen = useUIStore((s) => s.setNotesOpen);
  const setUsersAdminOpen = useUIStore((s) => s.setUsersAdminOpen);

  return (
    <header id="topbar" role="banner">
      <div className="logo" aria-label="Sprinto inicio" style={{ gap: '0.6rem' }}>
        <img src="/sprinto-logo.svg" alt="Sprinto Logo" width="36" height="36" style={{ borderRadius: '6px', objectFit: 'contain' }} />
        <span style={{ fontSize: '1.25rem' }}>Sprinto</span>
      </div>

      <div className="topbar-sep" aria-hidden="true"></div>

      <ProjectSelector />

      <div className="topbar-search-wrap" id="topbar-search-wrap">
        <svg
          className="search-icon"
          width="14"
          height="14"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
          style={{ color: 'var(--tx-muted)', flexShrink: 0 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z"
          />
        </svg>
        <input
          id="topbar-search"
          type="search"
          placeholder="Buscar tickets..."
          aria-label="Buscar tickets"
          autoComplete="off"
          spellCheck="false"
          value={filterSearchQuery}
          onChange={(e) => setFilterSearchQuery(e.target.value)}
          style={{ outline: 'none' }}
        />
      </div>

      <div
        className="view-toggle"
        role="group"
        aria-label="Vista del tablero"
        style={{
          marginLeft: '1rem',
          display: 'flex',
          background: 'var(--bg-s2)',
          borderRadius: 'var(--r-md)',
          padding: '0.25rem',
          gap: '0.15rem',
        }}
      >
        <button
          className={`view-btn ${currentView === 'board' ? 'active' : ''}`}
          onClick={() => setCurrentView('board')}
          aria-label="Vista Kanban"
          title="Vista Kanban"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <rect x="4" y="4" width="4" height="16" rx="1" />
            <rect x="10" y="4" width="4" height="12" rx="1" />
            <rect x="16" y="4" width="4" height="8" rx="1" />
          </svg>
        </button>
        <button
          className={`view-btn ${currentView === 'list' ? 'active' : ''}`}
          onClick={() => setCurrentView('list')}
          aria-label="Vista lista"
          title="Vista lista (ordenada por columnas)"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="8" y1="6" x2="21" y2="6" strokeLinecap="round" />
            <line x1="8" y1="12" x2="21" y2="12" strokeLinecap="round" />
            <line x1="8" y1="18" x2="21" y2="18" strokeLinecap="round" />
            <circle cx="4" cy="6" r="1.5" />
            <circle cx="4" cy="12" r="1.5" />
            <circle cx="4" cy="18" r="1.5" />
          </svg>
        </button>
        <button
          className={`view-btn ${currentView === 'roadmap' ? 'active' : ''}`}
          onClick={() => setCurrentView('roadmap')}
          aria-label="Cronograma Gantt"
          title="Vista Cronograma (Gantt)"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <rect x="3" y="5" width="14" height="4" rx="1" strokeLinecap="round" />
            <rect x="7" y="15" width="14" height="4" rx="1" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="topbar-actions" style={{ marginLeft: 'auto' }}>
        <button
          className="btn btn-secondary btn-sm"
          aria-label="Mis Notas"
          onClick={() => setNotesOpen(true)}
          title="Mis Notas"
        >
          📝
        </button>
        <button
          className="btn btn-secondary btn-sm"
          aria-label="Vacaciones"
          onClick={() => setVacationsOpen(true)}
          title="Vacaciones y Bajas"
        >
          🌴
        </button>
        <button
          className="btn btn-secondary btn-sm"
          aria-label="Daily Standup"
          onClick={() => setDailyOpen(true)}
          title="Daily Standup"
        >
          ☕
        </button>
        {currentUser?.preferences?.showPowerBIEstimator !== false && (
          <button
            className="btn btn-secondary btn-sm"
            aria-label="Estimador PowerBI"
            onClick={() => setEstimatorOpen(true)}
            title="Estimador PowerBI"
          >
            📊
          </button>
        )}
        <button
          className="btn btn-secondary btn-sm"
          aria-label="Abrir Panel"
          onClick={() => setMetricsOpen(true)}
          title="Dashboard de Métricas"
        >
          📈
        </button>
        <button
          className="btn-icon"
          aria-label="Configuración"
          onClick={() => setSettingsOpen(true)}
        >
          ⚙️
        </button>
        <button
          className="theme-toggle"
          aria-label="Cambiar tema"
          role="switch"
          onClick={toggleTheme}
        >
          <div className="theme-toggle-knob" aria-hidden="true">
            🌙
          </div>
        </button>

        {currentUser && (
          <div
            className="user-profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginLeft: '0.5rem',
              paddingLeft: '1rem',
              borderLeft: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: currentUser.color || '#4f46e5',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                flexShrink: 0,
              }}
              title={currentUser.name}
            >
              {currentUser.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {(currentUser.role === 'super-admin' ||
              useProjectStore.getState().activeProject?.ownerUid === currentUser.uid ||
              useProjectStore.getState().activeProject?.roles?.[currentUser.uid] === 'admin') && (
              <button
                className="btn btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setUsersAdminOpen(true);
                }}
                style={{
                  border: '1px solid var(--accent)',
                  background: 'transparent',
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  padding: '0.35rem 0.6rem',
                  borderRadius: 'var(--r-sm)',
                }}
                title="Gestión de Usuarios"
              >
                👥 Usuarios
              </button>
            )}
            <button
              className="btn btn-sm"
              onClick={async () => {
                if (window.confirm('¿Seguro que quieres cerrar sesión?')) {
                  await new FirebaseAuthService().logout();
                }
              }}
              style={{
                border: '1px solid var(--error)',
                background: 'var(--error)',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.35rem 0.6rem',
                borderRadius: 'var(--r-sm)',
              }}
              title="Cerrar sesión"
            >
              <span style={{ fontWeight: 600 }}>Salir</span>
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

