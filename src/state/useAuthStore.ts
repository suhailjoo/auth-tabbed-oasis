
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';

type AuthState = {
  user: User | null;
  orgId: string | null;
  setAuth: (user: User | null, orgId: string | null) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      orgId: null,
      setAuth: (user, orgId) => set({ user, orgId }),
      clearAuth: () => set({ user: null, orgId: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
