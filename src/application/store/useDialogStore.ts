import { create } from 'zustand';

export type DialogType = 'alert' | 'confirm' | 'prompt';

export interface DialogOptions {
  type: DialogType;
  title: string;
  message: string;
  defaultValue?: string;
  isMultiline?: boolean;
  resolve: (value: any) => void;
}

interface DialogState {
  currentDialog: DialogOptions | null;
  showAlert: (title: string, message: string) => Promise<void>;
  showConfirm: (title: string, message: string) => Promise<boolean>;
  showPrompt: (title: string, message: string, defaultValue?: string, isMultiline?: boolean) => Promise<string | null>;
  closeDialog: (value?: any) => void;
}

export const useDialogStore = create<DialogState>((set, get) => ({
  currentDialog: null,

  showAlert: (title, message) => {
    return new Promise((resolve) => {
      set({ currentDialog: { type: 'alert', title, message, resolve: () => resolve() } });
    });
  },

  showConfirm: (title, message) => {
    return new Promise((resolve) => {
      set({ currentDialog: { type: 'confirm', title, message, resolve } });
    });
  },

  showPrompt: (title, message, defaultValue = '', isMultiline = false) => {
    return new Promise((resolve) => {
      set({ currentDialog: { type: 'prompt', title, message, defaultValue, isMultiline, resolve } });
    });
  },

  closeDialog: (value) => {
    const { currentDialog } = get();
    if (currentDialog) {
      currentDialog.resolve(value);
      set({ currentDialog: null });
    }
  }
}));
