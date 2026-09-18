import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UIStore {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isFirebaseReady: boolean;
  setFirebaseReady: (ready: boolean) => void;
  openTicketId: string | null;
  setOpenTicketId: (id: string | null) => void;
  currentView: 'board' | 'list' | 'roadmap';
  setCurrentView: (view: 'board' | 'list' | 'roadmap') => void;
  groupBy: 'none' | 'assignee' | 'priority' | 'type';
  setGroupBy: (groupBy: 'none' | 'assignee' | 'priority' | 'type') => void;
  
  isSettingsOpen: boolean;
  setSettingsOpen: (isOpen: boolean) => void;
  isNewProjectOpen: boolean;
  setNewProjectOpen: (isOpen: boolean) => void;
  isImportExportOpen: boolean;
  setImportExportOpen: (isOpen: boolean) => void;
  isMetricsOpen: boolean;
  setMetricsOpen: (isOpen: boolean) => void;
  isEstimatorOpen: boolean;
  setEstimatorOpen: (isOpen: boolean) => void;
  isDailyOpen: boolean;
  setDailyOpen: (isOpen: boolean) => void;
  isVacationsOpen: boolean;
  setVacationsOpen: (isOpen: boolean) => void;
  isNotesOpen: boolean;
  setNotesOpen: (isOpen: boolean) => void;
  isUsersAdminOpen: boolean;
  setUsersAdminOpen: (isOpen: boolean) => void;
  isPbipDocOpen: boolean;
  setPbipDocOpen: (isOpen: boolean) => void;
  isPrivacyOpen: boolean;
  setPrivacyOpen: (isOpen: boolean) => void;
  isOnboardingOpen: boolean;
  setOnboardingOpen: (isOpen: boolean) => void;
  
  filterSearchQuery: string;
  setFilterSearchQuery: (query: string) => void;
  filters: {
    priority: string[];
    type: string[];
    assignedTo: string[];
    quickFilters: string[]; 
  };
  setFilters: (filters: UIStore['filters']) => void;
  showFiltersPanel: boolean;
  setShowFiltersPanel: (show: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      
      isFirebaseReady: false,
      setFirebaseReady: (ready) => set({ isFirebaseReady: ready }),

      openTicketId: null,
      setOpenTicketId: (id) => set({ openTicketId: id }),

      currentView: 'board',
      setCurrentView: (view) => set({ currentView: view }),
      
      groupBy: 'none',
      setGroupBy: (groupBy) => set({ groupBy }),

      isSettingsOpen: false,
      setSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
      
      isNewProjectOpen: false,
      setNewProjectOpen: (isOpen) => set({ isNewProjectOpen: isOpen }),
      
      isImportExportOpen: false,
      setImportExportOpen: (isOpen) => set({ isImportExportOpen: isOpen }),
      
      isMetricsOpen: false,
      setMetricsOpen: (isOpen) => set({ isMetricsOpen: isOpen }),
      
      isEstimatorOpen: false,
      setEstimatorOpen: (isOpen) => set({ isEstimatorOpen: isOpen }),
      
      isDailyOpen: false,
      setDailyOpen: (isOpen) => set({ isDailyOpen: isOpen }),
      
      isVacationsOpen: false,
      setVacationsOpen: (isOpen) => set({ isVacationsOpen: isOpen }),
      
      isNotesOpen: false,
      setNotesOpen: (isOpen) => set({ isNotesOpen: isOpen }),
      isUsersAdminOpen: false,
      setUsersAdminOpen: (isOpen) => set({ isUsersAdminOpen: isOpen }),
      isPbipDocOpen: false,
      setPbipDocOpen: (isOpen) => set({ isPbipDocOpen: isOpen }),
      isPrivacyOpen: false,
      setPrivacyOpen: (isOpen) => set({ isPrivacyOpen: isOpen }),
      isOnboardingOpen: false,
      setOnboardingOpen: (isOpen) => set({ isOnboardingOpen: isOpen }),

      filterSearchQuery: '',
      setFilterSearchQuery: (query) => set({ filterSearchQuery: query }),
      
      filters: { priority: [], type: [], assignedTo: [], quickFilters: [] },
      setFilters: (filters) => set({ filters }),
      
      showFiltersPanel: false,
      setShowFiltersPanel: (show) => set({ showFiltersPanel: show }),
    }),
    {
      name: 'smartboard-ui-store',
      partialize: (state) => ({
        theme: state.theme,
        currentView: state.currentView,
        groupBy: state.groupBy,
        filters: state.filters
      })
    }
  )
);
