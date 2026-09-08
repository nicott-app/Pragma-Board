import React, { useState } from 'react';
import { useProjectStore } from '../../../application/store/useProjectStore';
import { useUIStore } from '../../../application/store/useUIStore';
import { useAuthStore } from '../../../application/store/useAuthStore';
import { GeneralSettingsTab } from './settings/GeneralSettingsTab';
import { ColumnsSettingsTab } from './settings/ColumnsSettingsTab';
import { MembersSettingsTab } from './settings/MembersSettingsTab';
import { SprintsSettingsTab } from './settings/SprintsSettingsTab';
import { IntegrationsSettingsTab } from './settings/IntegrationsSettingsTab';
import { PreferencesSettingsTab } from './settings/PreferencesSettingsTab';
import { DangerZoneSettingsTab } from './settings/DangerZoneSettingsTab';

export const SettingsModal: React.FC = () => {
  const activeProject = useProjectStore((s) => s.activeProject);
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);
  const currentUser = useAuthStore((s) => s.currentUser);
  const [activeTab, setActiveTab] = useState<
    'general' | 'columns' | 'members' | 'sprints' | 'integrations' | 'preferences' | 'danger'
  >('general');

  if (!activeProject || !currentUser) return null;
  const isSuperAdmin = currentUser.email?.toLowerCase() === 'ntercerotuda@gmail.com';
  const isAdmin =
    isSuperAdmin ||
    activeProject.roles?.[currentUser.uid] === 'admin' ||
    activeProject.ownerUid === currentUser.uid;

  return (
    <>
      <style>{`
        .sidebar-link {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 0.875rem 1.25rem;
          background: transparent;
          border: none;
          text-align: left;
          color: var(--tx-secondary);
          font-size: 0.95rem;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          gap: 0.75rem;
        }
        .sidebar-link:hover {
          background: var(--bg-s3);
          color: var(--tx-primary);
        }
        .sidebar-link.active {
          background: var(--ac-bg);
          color: var(--ac);
          border-right: 3px solid var(--ac);
          font-weight: 500;
        }
        .sidebar-icon {
          font-size: 1.1rem;
        }
      `}</style>
      <div className="overlay active" style={{ zIndex: 100 }}>
        <div
          className="modal"
          style={{
            width: 'min(1000px, 96vw)',
            height: 'min(800px, 90vh)',
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1.5rem',
              borderBottom: '1px solid var(--bd-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--tx-primary)', margin: 0 }}>
                Configuración del Proyecto
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--tx-secondary)', margin: 0 }}>
                Gestión avanzada de {activeProject.name}
              </p>
            </div>
            <button
              className="modal-close"
              onClick={() => setSettingsOpen(false)}
              style={{ position: 'relative' }}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Sidebar Tabs */}
            <div
              style={{
                width: '220px',
                borderRight: '1px solid var(--bd-subtle)',
                background: 'var(--bg-s2)',
                padding: '1rem 0',
                flexShrink: 0,
                overflowY: 'auto',
              }}
            >
              <button
                className={`sidebar-link ${activeTab === 'general' ? 'active' : ''}`}
                onClick={() => setActiveTab('general')}
              >
                <span className="sidebar-icon">⚙️</span>
                General
              </button>
              <button
                className={`sidebar-link ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                <span className="sidebar-icon">⚙️</span>
                Mis Preferencias
              </button>
              {isAdmin && (
                <>
                  <button
                    className={`sidebar-link ${activeTab === 'columns' ? 'active' : ''}`}
                    onClick={() => setActiveTab('columns')}
                  >
                    <span className="sidebar-icon">📊</span>
                    Flujo de Trabajo (Columnas)
                  </button>
                  <button
                    className={`sidebar-link ${activeTab === 'sprints' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sprints')}
                  >
                    <span className="sidebar-icon">🏃</span>
                    Sprints / Iteraciones
                  </button>
                  <button
                    className={`sidebar-link ${activeTab === 'members' ? 'active' : ''}`}
                    onClick={() => setActiveTab('members')}
                  >
                    <span className="sidebar-icon">👥</span>
                    Equipo y Roles
                  </button>
                  <button
                    className={`sidebar-link ${activeTab === 'integrations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('integrations')}
                  >
                    <span className="sidebar-icon">🔌</span>
                    Integraciones
                  </button>
                  <button
                    className={`sidebar-link ${activeTab === 'danger' ? 'active' : ''}`}
                    onClick={() => setActiveTab('danger')}
                    style={{ color: 'var(--error)' }}
                  >
                    <span className="sidebar-icon">⚠️</span>
                    Zona de Peligro
                  </button>
                </>
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
              {activeTab === 'general' && <GeneralSettingsTab isAdmin={isAdmin} />}
              {activeTab === 'columns' && <ColumnsSettingsTab isAdmin={isAdmin} />}
              {activeTab === 'members' && <MembersSettingsTab isAdmin={isAdmin} />}
              {activeTab === 'sprints' && <SprintsSettingsTab isAdmin={isAdmin} />}
              {activeTab === 'integrations' && <IntegrationsSettingsTab isAdmin={isAdmin} />}
              {activeTab === 'preferences' && <PreferencesSettingsTab />}
              {activeTab === 'danger' && <DangerZoneSettingsTab isAdmin={isAdmin} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
