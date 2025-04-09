
import { useNavigate } from "react-router-dom";
import { ArrowRight, Briefcase } from "lucide-react";
import { useJobsQuery } from "@/hooks/useJobsQuery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const JobsPage = () => {
  const navigate = useNavigate();
  const { data: jobs, isLoading, error } = useJobsQuery();

  // Helper to format employment type for display
  const formatEmploymentType = (type: string) => {
    const types = {
      "remote": "Remote",
      "hybrid": "Hybrid",
      "in-office": "In-Office"
    };
    return types[type as keyof typeof types] || type;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
            <p className="text-muted-foreground">
              Manage your job listings and openings
            </p>
          </div>
          <Button>Loading...</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="pb-3">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
            <p className="text-muted-foreground">
              Manage your job listings and openings
            </p>
          </div>
          <Button asChild>
            <button onClick={() => navigate("/jobs/create")} className="flex items-center gap-2">
              Create Job
            </button>
          </Button>
        </div>
        
        <Card className="bg-destructive/10 border-destructive/30">
          <CardHeader>
            <CardTitle>Error Loading Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There was an error loading your jobs. Please try again later.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Check if no jobs exist
  if (jobs && jobs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
            <p className="text-muted-foreground">
              Manage your job listings and openings
            </p>
          </div>
          <Button asChild>
            <button onClick={() => navigate("/jobs/create")} className="flex items-center gap-2">
              Create Job
            </button>
          </Button>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold text-lg">No jobs yet. Ready to post your first one?</h3>
          <p className="mt-2 text-sm text-muted-foreground mb-6">
            Create your first job posting to get started with recruiting.
          </p>
          <Button onClick={() => navigate("/jobs/create")}>
            Create Your First Job
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">
            Manage your job listings and openings
          </p>
        </div>
        <Button asChild>
          <button onClick={() => navigate("/jobs/create")} className="flex items-center gap-2">
            Create Job
          </button>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs?.map((job) => (
          <Card key={job.id} className="shadow-sm hover:shadow transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-primary">{job.title}</CardTitle>
              {job.department && (
                <CardDescription>{job.department}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="pb-3 space-y-1 text-sm">
              <div className="flex items-start">
                <span className="font-medium w-24">Location:</span> 
                <span>{job.location}</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium w-24">Type:</span> 
                <span>{formatEmploymentType(job.employment_type)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate(`/jobs/${job.id}/pipeline`)}
              >
                View Pipeline
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
