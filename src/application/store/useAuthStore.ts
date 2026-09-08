import { create } from 'zustand';
import { User, UserPreferences } from '../../domain/models/User';

export interface AuthStore {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  updateCurrentUserPreferences: (prefs: UserPreferences) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  updateCurrentUserPreferences: (prefs) => set((state) => {
    if (!state.currentUser) return state;
    return {
      currentUser: {
        ...state.currentUser,
        preferences: {
          ...(state.currentUser.preferences || {}),
          ...prefs
        }
      }
    };
  }),
}));
