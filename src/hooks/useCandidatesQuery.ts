
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/state/useAuthStore";

export interface Candidate {
  id: string;
  name: string;
  resume_url: string;
  stage: "applied" | "screening" | "interview" | "offer" | "hired" | "rejected";
  created_at: string;
  job_id: string;
}

export const useCandidatesQuery = (jobId: string) => {
  const { orgId } = useAuthStore();

  return useQuery({
    queryKey: ["candidates", jobId, orgId],
    queryFn: async (): Promise<Candidate[]> => {
      if (!orgId || !jobId) {
        throw new Error("No organization ID or job ID found");
      }

      const { data, error } = await supabase
        .from('candidates')
        .select('id, name, resume_url, stage, created_at, job_id')
        .eq('org_id', orgId)
        .eq('job_id', jobId);

      if (error) {
        console.error("Error fetching candidates:", error);
        throw error;
      }

      // Validate that each stage value is one of the allowed values
      // and cast the data to the Candidate type
      const candidates = data?.map(candidate => {
        // Ensure stage is one of the valid enum values
        const validStages = ["applied", "screening", "interview", "offer", "hired", "rejected"];
        const stage = validStages.includes(candidate.stage) 
          ? candidate.stage as Candidate["stage"] 
          : "applied"; // Default to "applied" if the stage is invalid
        
        return {
          ...candidate,
          stage
        } as Candidate;
      }) || [];

      return candidates;
    },
    enabled: !!orgId && !!jobId,
  });
};
