
import React from "react";
import { useParams } from "react-router-dom";
import ResumeUploadModal from "@/components/candidates/ResumeUploadModal";
import { useCandidatesQuery, Candidate } from "@/hooks/useCandidatesQuery";
import { useJobQuery } from "@/hooks/useJobQuery";
import StageColumn from "@/components/candidates/StageColumn";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Briefcase, MapPin, Clock } from "lucide-react";
import { formatDistance } from "date-fns";

const JobPipelinePage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { data: candidates, isLoading: isCandidatesLoading } = useCandidatesQuery(jobId || "");
  const { data: job, isLoading: isJobLoading } = useJobQuery(jobId || "");

  // Define all possible stages in the correct order
  const stages = ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"];

  // Group candidates by stage
  const groupedCandidates: Record<string, Candidate[]> = {};
  
  stages.forEach(stage => {
    const normalizedStage = stage.toLowerCase();
    groupedCandidates[normalizedStage] = candidates?.filter(
      candidate => candidate.stage.toLowerCase() === normalizedStage
    ) || [];
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-accent/30 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            {isJobLoading ? (
              <Skeleton className="h-8 w-64" />
            ) : (
              job?.title || "Job Pipeline"
            )}
          </h1>
          {job && (
            <div className="space-y-1 mt-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1 text-secondary" />
                <span>{job.location}</span>
                <span className="mx-2">•</span>
                <Briefcase className="h-4 w-4 mr-1 text-secondary" />
                <span>{job.employment_type}</span>
                {job.department && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{job.department}</span>
                  </>
                )}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>Created {formatDistance(new Date(job.created_at), new Date(), { addSuffix: true })}</span>
              </div>
            </div>
          )}
        </div>
        <div>
          <ResumeUploadModal />
        </div>
      </div>
      
      {isCandidatesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 h-[calc(100vh-240px)]">
          {stages.map((stage) => (
            <Skeleton key={stage} className="h-full rounded-md" />
          ))}
        </div>
      ) : candidates && candidates.length > 0 ? (
        <ScrollArea className="w-full pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5 h-[calc(100vh-240px)] min-w-[900px]">
            {stages.map((stage) => (
              <StageColumn
                key={stage}
                title={stage}
                candidates={groupedCandidates[stage.toLowerCase()]}
                count={groupedCandidates[stage.toLowerCase()].length}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="rounded-md border bg-white p-8 text-center space-y-4 shadow-sm">
          <div className="bg-primary/5 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
            <FileText className="h-10 w-10 text-primary/60" />
          </div>
          <h3 className="text-lg font-medium">No candidates found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Click "Add Candidate" to upload resumes and start building your pipeline.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobPipelinePage;
