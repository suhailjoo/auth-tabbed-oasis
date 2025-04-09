
const CandidatesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
        <p className="text-muted-foreground">
          Review and manage candidate applications
        </p>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="font-semibold text-lg">No Candidates Yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Add candidates or wait for applications to start coming in.
        </p>
      </div>
    </div>
  );
};

export default CandidatesPage;
