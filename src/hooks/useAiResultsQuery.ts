
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/state/useAuthStore";

interface RoleFitScore {
  fit_score: number | string;
  verdict: string;
  justification: string;
}

interface AutoTags {
  tags: string[];
}

interface InterviewSummary {
  summary: string;
}

export interface AiResults {
  roleFitScore: RoleFitScore | null;
  autoTags: AutoTags | null;
  interviewSummary: InterviewSummary | null;
}

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

      // Transform the data into a more usable format with proper typing
      const results: AiResults = {
        roleFitScore: null,
        autoTags: null,
        interviewSummary: null,
      };

      // Process each result based on job_type
      data.forEach(item => {
        if (item.job_type === "role_fit_score" && item.result) {
          // Use type assertion without circular references
          results.roleFitScore = item.result as any as RoleFitScore;
        } else if (item.job_type === "auto_tag_candidate" && item.result) {
          results.autoTags = item.result as any as AutoTags;
        } else if (item.job_type === "post_interview_summary" && item.result) {
          results.interviewSummary = item.result as any as InterviewSummary;
        }
      });

      return results;
    },
  });
}
