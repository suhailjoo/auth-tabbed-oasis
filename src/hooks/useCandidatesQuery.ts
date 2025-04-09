
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

      return data || [];
    },
    enabled: !!orgId && !!jobId,
  });
};
