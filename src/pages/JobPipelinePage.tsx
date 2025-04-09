
import React from "react";
import { useParams } from "react-router-dom";
import ResumeUploadModal from "@/components/candidates/ResumeUploadModal";

const JobPipelinePage = () => {
  const { jobId } = useParams<{ jobId: string }>();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Job Pipeline</h1>
        <ResumeUploadModal />
      </div>
      
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">
          Job ID: {jobId}
        </p>
        <p className="text-muted-foreground mt-2">
          Pipeline content will be implemented soon.
        </p>
      </div>
    </div>
  );
};

export default JobPipelinePage;
