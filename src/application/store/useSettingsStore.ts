import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsStore {
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  geminiModel: string;
  setGeminiModel: (model: string) => void;
  webhookSecret: string;
  setWebhookSecret: (secret: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      geminiApiKey: '',
      setGeminiApiKey: (key) => set({ geminiApiKey: key }),
      geminiModel: 'gemini-1.5-pro',
      setGeminiModel: (model) => set({ geminiModel: model }),
      webhookSecret: '',
      setWebhookSecret: (secret) => set({ webhookSecret: secret }),
    }),
    {
      name: 'smartboard-settings-store',
      partialize: (state) => ({
        geminiApiKey: state.geminiApiKey,
        geminiModel: state.geminiModel,
        webhookSecret: state.webhookSecret
      })
    }
  )
);
