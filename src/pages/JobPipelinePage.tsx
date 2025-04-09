
import React from "react";
import { useParams } from "react-router-dom";
import ResumeUploadModal from "@/components/candidates/ResumeUploadModal";
import { useCandidatesQuery, Candidate } from "@/hooks/useCandidatesQuery";
import { useJobQuery } from "@/hooks/useJobQuery";
import StageColumn from "@/components/candidates/StageColumn";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isJobLoading ? (
              <Skeleton className="h-8 w-64" />
            ) : (
              job?.title || "Job Pipeline"
            )}
          </h1>
          {job && (
            <p className="text-sm text-muted-foreground mt-1">
              {job.location} • {job.employment_type}
              {job.department && ` • ${job.department}`}
            </p>
          )}
        </div>
        <ResumeUploadModal />
      </div>
      
      {isCandidatesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 h-[calc(100vh-200px)]">
          {stages.map((stage) => (
            <Skeleton key={stage} className="h-full" />
          ))}
        </div>
      ) : candidates && candidates.length > 0 ? (
        <ScrollArea className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 h-[calc(100vh-200px)] min-w-[900px]">
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
        <div className="rounded-md border p-8 text-center space-y-4">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground/60" />
          <p className="text-muted-foreground">
            No candidates found for this job.
          </p>
          <p className="text-muted-foreground text-sm">
            Click "Add Candidate" to upload resumes and start building your pipeline.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobPipelinePage;
