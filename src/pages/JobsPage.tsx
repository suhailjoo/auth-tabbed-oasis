
const JobsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
        <p className="text-muted-foreground">
          Manage your job listings and openings
        </p>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="font-semibold text-lg">No Jobs Yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first job posting to get started.
        </p>
      </div>
    </div>
  );
};

export default JobsPage;
