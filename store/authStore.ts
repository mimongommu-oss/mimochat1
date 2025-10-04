
import { create } from 'zustand';
import { useChatStore } from './chatStore';
import { useUIStore } from './uiStore';

type AuthPage = 'login' | 'signup';

interface AuthState {
  isAuthenticated: boolean;
  authPage: AuthPage;
  login: () => void;
  logout: () => void;
  setAuthPage: (page: AuthPage) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  authPage: 'login',
  login: () => set({ isAuthenticated: true }),
  logout: () => {
    // Reset all other stores to their initial state on logout
    useChatStore.getState().reset();
    useUIStore.getState().reset();
    set({ isAuthenticated: false, authPage: 'login' });
  },
  setAuthPage: (page) => set({ authPage: page }),
}));

// Re-export with a named export to avoid issues with circular dependencies if needed
export { useAuthStore };
