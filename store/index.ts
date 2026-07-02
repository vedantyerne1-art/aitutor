import { create } from 'zustand';

interface AppState {
  // Preloader
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Cursor
  cursorLabel: string;
  cursorVariant: 'default' | 'hover' | 'text' | 'drag' | 'view' | 'open';
  setCursorLabel: (label: string) => void;
  setCursorVariant: (variant: AppState['cursorVariant']) => void;

  // Chat
  isChatOpen: boolean;
  toggleChat: () => void;
  chatUnread: number;
  setChatUnread: (n: number) => void;

  // Command Palette
  isCommandOpen: boolean;
  toggleCommand: () => void;

  // Active section (for nav highlight)
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: true,
  setIsLoading: (v) => set({ isLoading: v }),

  theme: 'dark',
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('light', next === 'light');
      return { theme: next };
    }),

  cursorLabel: '',
  cursorVariant: 'default',
  setCursorLabel: (label) => set({ cursorLabel: label }),
  setCursorVariant: (variant) => set({ cursorVariant: variant }),

  isChatOpen: false,
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  chatUnread: 0,
  setChatUnread: (n) => set({ chatUnread: n }),

  isCommandOpen: false,
  toggleCommand: () => set((state) => ({ isCommandOpen: !state.isCommandOpen })),

  activeSection: 'hero',
  setActiveSection: (section) => set({ activeSection: section }),
}));
