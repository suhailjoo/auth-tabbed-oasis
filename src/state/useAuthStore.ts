
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AuthState = {
  user: User | null;
  orgId: string | null;
  isLoading: boolean;
  setAuth: (user: User | null, orgId: string | null) => void;
  clearAuth: () => void;
  setIsLoading: (isLoading: boolean) => void;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      orgId: null,
      isLoading: false,
      setAuth: (user, orgId) => set({ user, orgId }),
      clearAuth: () => set({ user: null, orgId: null }),
      setIsLoading: (isLoading) => set({ isLoading }),
      hydrate: async () => {
        try {
          set({ isLoading: true });
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            // Fetch user's organization
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('org_id')
              .eq('user_id', session.user.id)
              .single();

            if (userError) throw userError;
            
            if (userData) {
              set({ user: session.user, orgId: userData.org_id });
            } else {
              set({ user: null, orgId: null });
            }
          } else {
            set({ user: null, orgId: null });
          }
        } catch (error) {
          console.error('Error hydrating auth state:', error);
          set({ user: null, orgId: null });
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
