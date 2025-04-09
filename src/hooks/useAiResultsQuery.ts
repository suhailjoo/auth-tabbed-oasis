
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
          // Safe type handling with explicit type casting
          const rawResult = item.result as Record<string, unknown>;
          results.roleFitScore = {
            fit_score: rawResult.fit_score !== undefined ? rawResult.fit_score as string | number : "N/A",
            verdict: typeof rawResult.verdict === 'string' ? rawResult.verdict : "",
            justification: typeof rawResult.justification === 'string' ? rawResult.justification : ""
          };
        } else if (item.job_type === "auto_tag_candidate" && item.result) {
          const rawResult = item.result as Record<string, unknown>;
          results.autoTags = {
            tags: Array.isArray(rawResult.tags) ? rawResult.tags as string[] : []
          };
        } else if (item.job_type === "post_interview_summary" && item.result) {
          const rawResult = item.result as Record<string, unknown>;
          results.interviewSummary = {
            summary: typeof rawResult.summary === 'string' ? rawResult.summary : ""
          };
        }
      }

      return results;
    },
  });
}
