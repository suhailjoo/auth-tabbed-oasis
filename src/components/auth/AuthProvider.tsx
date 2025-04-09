
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/state/useAuthStore';
import { toast } from '@/hooks/use-toast';

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, orgId, setAuth, clearAuth, hydrate } = useAuthStore();
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    // Hydrate auth state on mount
    hydrate();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            // Don't fetch again if we already have the user with same ID
            if (user?.id === session.user.id && orgId) {
              return;
            }

            // Fetch user's organization
            try {
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('org_id, name')
                .eq('user_id', session.user.id)
                .single();

              if (userError) throw userError;
              
              if (userData) {
                setAuth(session.user, userData.org_id);
              } else {
                console.error('User exists but no profile found');
                clearAuth();
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
              clearAuth();
            }
          }
        } else if (event === 'SIGNED_OUT') {
          clearAuth();
          navigate('/auth');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
};

export default AuthProvider;
