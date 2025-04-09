
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/state/useAuthStore";

export interface RoleFitScore {
  fit_score: number | string;
  verdict: string;
  justification: string;
}

export interface AutoTags {
  tags: string[];
}

export interface InterviewSummary {
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
      // Simplify the query to avoid deep type instantiation
      const { data, error } = await supabase
        .from("workflow_jobs")
        .select("job_type, result")
        .eq("org_id", orgId)
        .in("job_type", ["role_fit_score", "auto_tag_candidate", "post_interview_summary"])
        .eq("payload->candidate_id", candidateId);

      if (error) {
        throw error;
      }

      // Initialize results with null values
      const results: AiResults = {
        roleFitScore: null,
        autoTags: null,
        interviewSummary: null,
      };

      // Process each result based on job_type with explicit construction
      for (const item of data) {
        if (item.job_type === "role_fit_score" && item.result) {
          // Safe type handling
          const result = item.result as any;
          results.roleFitScore = {
            fit_score: typeof result.fit_score !== 'undefined' ? result.fit_score : "N/A",
            verdict: typeof result.verdict === 'string' ? result.verdict : "",
            justification: typeof result.justification === 'string' ? result.justification : ""
          };
        } else if (item.job_type === "auto_tag_candidate" && item.result) {
          const result = item.result as any;
          results.autoTags = {
            tags: Array.isArray(result.tags) ? result.tags : []
          };
        } else if (item.job_type === "post_interview_summary" && item.result) {
          const result = item.result as any;
          results.interviewSummary = {
            summary: typeof result.summary === 'string' ? result.summary : ""
          };
        }
      }

      return results;
    },
  });
}
