import { LoggerService } from './infrastructure/services/LoggerService';
import { useEffect, useState } from 'react';
import { Layout } from './presentation/components/layout/Layout';
import { Board } from './presentation/components/board/Board';
import { ListView } from './presentation/components/board/ListView';
import { GanttView } from './presentation/components/board/GanttView';
import { useAuthStore } from './application/store/useAuthStore';
import { useUIStore } from './application/store/useUIStore';
import { useProjectStore } from './application/store/useProjectStore';
import { useDataStore } from './application/store/useDataStore';
import { FirebaseAuthService } from './infrastructure/firebase/FirebaseAuthService';
import { LoginModal } from './presentation/components/auth/LoginModal';
import { PendingApprovalScreen } from './presentation/components/auth/PendingApprovalScreen';
import { CookieBanner } from './presentation/components/layout/CookieBanner';
import { Suspense, lazy } from 'react';

const PrivacyPolicyModal = lazy(() =>
  import('./presentation/components/layout/PrivacyPolicyModal').then((m) => ({
    default: m.PrivacyPolicyModal,
  }))
);

// Lazy loaded modals for code splitting
const SmartCreateModal = lazy(() =>
  import('./presentation/components/ticket/SmartCreateModal').then((m) => ({
    default: m.SmartCreateModal,
  }))
);
const TicketDetailModal = lazy(() =>
  import('./presentation/components/ticket/TicketDetailModal').then((m) => ({
    default: m.TicketDetailModal,
  }))
);
const SettingsModal = lazy(() =>
  import('./presentation/components/project/SettingsModal').then((m) => ({
    default: m.SettingsModal,
  }))
);
const NewProjectModal = lazy(() =>
  import('./presentation/components/project/NewProjectModal').then((m) => ({
    default: m.NewProjectModal,
  }))
);
const ImportExportModal = lazy(() =>
  import('./presentation/components/project/ImportExportModal').then((m) => ({
    default: m.ImportExportModal,
  }))
);
const MetricsModal = lazy(() =>
  import('./presentation/components/project/MetricsModal').then((m) => ({
    default: m.MetricsModal,
  }))
);
const PowerBIEstimatorModal = lazy(() =>
  import('./presentation/components/project/PowerBIEstimatorModal').then((m) => ({
    default: m.PowerBIEstimatorModal,
  }))
);
const DailyDrawer = lazy(() =>
  import('./presentation/components/project/DailyDrawer').then((m) => ({ default: m.DailyDrawer }))
);
const VacationsModal = lazy(() =>
  import('./presentation/components/project/VacationsModal').then((m) => ({
    default: m.VacationsModal,
  }))
);
const NotesFloatingWindow = lazy(() =>
  import('./presentation/components/project/NotesFloatingWindow').then((m) => ({
    default: m.NotesFloatingWindow,
  }))
);
const UsersAdminModal = lazy(() =>
  import('./presentation/components/project/UsersAdminModal').then((m) => ({
    default: m.UsersAdminModal,
  }))
);
const PbipDocumentationModal = lazy(() =>
  import('./presentation/components/project/PbipDocumentationModal').then((m) => ({
    default: m.PbipDocumentationModal,
  }))
);
import { FirebaseTicketRepository } from './infrastructure/firebase/FirebaseTicketRepository';
import { FirebaseProjectRepository } from './infrastructure/firebase/FirebaseProjectRepository';
import { FirebaseNotesRepository } from './infrastructure/firebase/FirebaseNotesRepository';
import { FirebaseVacationRepository } from './infrastructure/firebase/FirebaseVacationRepository';
import { ToastContainer } from './presentation/components/layout/ToastContainer';
import { SoundService } from './infrastructure/services/SoundService';

const authService = new FirebaseAuthService();
const ticketRepo = new FirebaseTicketRepository();
const projectRepo = new FirebaseProjectRepository();
const notesRepo = new FirebaseNotesRepository();
const vacationRepo = new FirebaseVacationRepository();

function App() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser);
  const setFirebaseReady = useUIStore((s) => s.setFirebaseReady);
  const openTicketId = useUIStore((s) => s.openTicketId);
  const setOpenTicketId = useUIStore((s) => s.setOpenTicketId);
  const currentView = useUIStore((s) => s.currentView);
  const isSettingsOpen = useUIStore((s) => s.isSettingsOpen);
  const isNewProjectOpen = useUIStore((s) => s.isNewProjectOpen);
  const isImportExportOpen = useUIStore((s) => s.isImportExportOpen);
  const isMetricsOpen = useUIStore((s) => s.isMetricsOpen);
  const isEstimatorOpen = useUIStore((s) => s.isEstimatorOpen);
  const isDailyOpen = useUIStore((s) => s.isDailyOpen);
  const isVacationsOpen = useUIStore((s) => s.isVacationsOpen);
  const isNotesOpen = useUIStore((s) => s.isNotesOpen);
  const isUsersAdminOpen = useUIStore((s) => s.isUsersAdminOpen);
  const isPbipDocOpen = useUIStore((s) => s.isPbipDocOpen);
  const isPrivacyOpen = useUIStore((s) => s.isPrivacyOpen);
  const uiTheme = useUIStore((s) => s.theme);
  const activeProject = useProjectStore((s) => s.activeProject);
  const setActiveProject = useProjectStore((s) => s.setActiveProject);
  const setTickets = useDataStore((s) => s.setTickets);
  const setUnreviewedNotes = useDataStore((s) => s.setUnreviewedNotes);
  const setVacations = useDataStore((s) => s.setVacations);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loadingApp, setLoadingApp] = useState(true);

  useEffect(() => {
    SoundService.init();
  }, []);

  useEffect(() => {
    let activeTheme = uiTheme;
    if (activeTheme === ('system' as any)) {
      activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [uiTheme]);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setFirebaseReady(true);
    });
    return () => unsubscribe();
  }, [setCurrentUser, setFirebaseReady]);

  useEffect(() => {
    if (!currentUser) return;
    const initProject = async () => {
      try {
        const projects = await projectRepo.getProjects(currentUser.email, currentUser.uid);
        if (projects.length > 0) {
          const storedId = useProjectStore.getState().activeProjectId;
          const target = projects.find((p) => p.id === storedId) || projects[0];
          setActiveProject(target);
        }
      } catch (err) {
        LoggerService.error('Failed to load projects', err);
      }
    };
    if (!activeProject) {
      initProject();
    }
    // Use currentUser.uid (primitive) and activeProject?.id (primitive) to avoid object reference churn
  }, [currentUser?.uid, activeProject?.id]);

  useEffect(() => {
    if (activeProject && currentUser?.preferences?.defaultFilterToMe) {
      const currentFilters = useUIStore.getState().filters;
      // Only apply if it's strictly empty, to not override manual user filters
      if (currentFilters.assignedTo.length === 0) {
        useUIStore.getState().setFilters({ ...currentFilters, assignedTo: [currentUser.uid] });
      }
    }
  }, [activeProject?.id, currentUser?.uid, currentUser?.preferences?.defaultFilterToMe]);

  useEffect(() => {
    if (!activeProject) {
      setLoadingApp(false);
      return;
    }
    setLoadingApp(true);
    const unsubscribeTickets = ticketRepo.subscribeToTickets(activeProject.id, (fetchedTickets) => {
      setTickets(fetchedTickets);
      setLoadingApp(false);
    });
    const unsubscribeNotes = notesRepo.subscribeToUnreviewedNotes(
      activeProject.id,
      (unreviewedNotes) => {
        setUnreviewedNotes(unreviewedNotes);
      }
    );
    const unsubscribeVacations = vacationRepo.subscribeToVacations(
      activeProject.id,
      (vacations) => {
        setVacations(vacations);
      }
    );
    return () => {
      unsubscribeTickets();
      unsubscribeNotes();
      unsubscribeVacations();
    };
  }, [activeProject?.id]);

  return (
    <Layout>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {!currentUser ? (
          <LoginModal />
        ) : currentUser.isApproved === false ? (
          <PendingApprovalScreen />
        ) : !activeProject ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>No hay proyecto activo o no tienes acceso.</h2>
          </div>
        ) : loadingApp ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              flexDirection: 'column',
            }}
          >
            <div className="spinner spinner-lg"></div>
            <p style={{ marginTop: '1rem', color: 'var(--tx-secondary)' }}>
              Cargando datos del proyecto...
            </p>
          </div>
        ) : (
          <>
            <main
              className="content"
              role="main"
              aria-label="Contenido principal"
              style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
              {currentView === 'board' && <Board />}
              {currentView === 'list' && <ListView />}
              {currentView === 'roadmap' && <GanttView />}
            </main>

            <button
              id="fab-smart-create"
              aria-label="Crear ticket"
              title="Crear nuevo ticket"
              onClick={() => setShowCreateModal(true)}
            >
              <span className="fab-icon" aria-hidden="true">
                ✨
              </span>
              <span className="fab-label">Nuevo ticket</span>
            </button>
            <Suspense fallback={null}>
              {isNewProjectOpen && <NewProjectModal />}
              {showCreateModal && <SmartCreateModal onClose={() => setShowCreateModal(false)} />}
              {openTicketId && (
                <TicketDetailModal ticketId={openTicketId} onClose={() => setOpenTicketId(null)} />
              )}
              {isSettingsOpen && <SettingsModal />}
              {isImportExportOpen && <ImportExportModal />}
              {isMetricsOpen && <MetricsModal />}
              {isEstimatorOpen && <PowerBIEstimatorModal />}
              {isDailyOpen && <DailyDrawer />}
              {isUsersAdminOpen && <UsersAdminModal />}
              {isVacationsOpen && <VacationsModal />}
              {isNotesOpen && <NotesFloatingWindow />}
              {isPbipDocOpen && <PbipDocumentationModal />}
              {isPrivacyOpen && <PrivacyPolicyModal />}
            </Suspense>
          </>
        )}
        <ToastContainer />
        <CookieBanner />
      </div>
    </Layout>
  );
}

export default App;
