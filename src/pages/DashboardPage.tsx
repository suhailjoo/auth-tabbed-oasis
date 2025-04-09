
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/state/useAuthStore';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const DashboardPage = () => {
  const { user, orgId, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !orgId) {
      navigate('/auth');
    }
  }, [user, orgId, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearAuth();
    navigate('/auth');
  };

  if (!user || !orgId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-white to-primary/10 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-roboto font-bold text-gray-800">
            hatch<span className="text-primary">.</span>
          </h1>
          <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Welcome to your Dashboard</h2>
          <p className="text-gray-600 mb-2">Logged in as: {user.email}</p>
          <p className="text-gray-600">Organization ID: {orgId}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
