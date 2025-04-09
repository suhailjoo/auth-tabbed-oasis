
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/state/useAuthStore";

export function useAiResultsQuery(candidateId: string) {
  const { orgId } = useAuthStore();

  return useQuery({
    queryKey: ["aiResults", candidateId],
    enabled: !!candidateId && !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workflow_jobs")
        .select("*")
        .eq("org_id", orgId)
        .in("job_type", ["role_fit_score", "auto_tag_candidate", "post_interview_summary"])
        .eq("payload->candidate_id", candidateId);

      if (error) {
        throw error;
      }

      // Transform the data into a more usable format
      const results = {
        roleFitScore: data.find(item => item.job_type === "role_fit_score")?.result || null,
        autoTags: data.find(item => item.job_type === "auto_tag_candidate")?.result || null,
        interviewSummary: data.find(item => item.job_type === "post_interview_summary")?.result || null,
      };

      return results;
    },
  });
}
