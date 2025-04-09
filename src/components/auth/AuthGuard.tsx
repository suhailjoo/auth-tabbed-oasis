
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/state/useAuthStore';
import { supabase } from '@/integrations/supabase/client';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, orgId, isLoading, setIsLoading, hydrate } = useAuthStore();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(true);
      
      try {
        // If we don't have user data in store, try to hydrate it
        if (!user || !orgId) {
          await hydrate();
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [user, orgId, hydrate]);

  // Show nothing while we're checking authentication
  if (isChecking || isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user || !orgId) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected route
  return <>{children}</>;
};

export default AuthGuard;
