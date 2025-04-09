
import { useAuthStore } from '@/state/useAuthStore';

const DashboardPage = () => {
  const { user, orgId } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your organization dashboard
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="font-semibold text-lg">Account Information</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Organization ID:</span>
              <span className="font-medium">{orgId}</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="font-semibold text-lg">Getting Started</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account is ready. Start by creating a job posting or adding candidate profiles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
