
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/state/useAuthStore";

// Define simple interfaces for our AI results
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

// Simple direct type for workflow job results
interface SimpleWorkflowJob {
  job_type: string;
  result: Record<string, any> | null;
}

export function useAiResultsQuery(candidateId: string) {
  const { orgId } = useAuthStore();

  return useQuery({
    queryKey: ["aiResults", candidateId],
    enabled: !!candidateId && !!orgId,
    queryFn: async () => {
      // Using explicit type casting instead of .returns<> to avoid deep inference
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

      // Process the data with explicit type handling and casting
      if (data && Array.isArray(data)) {
        const typedData = data as SimpleWorkflowJob[];
        
        for (const item of typedData) {
          switch (item.job_type) {
            case "role_fit_score":
              if (item.result) {
                results.roleFitScore = {
                  fit_score: item.result.fit_score ?? "N/A",
                  verdict: String(item.result.verdict || ""),
                  justification: String(item.result.justification || "")
                };
              }
              break;
            case "auto_tag_candidate":
              if (item.result) {
                const tags: string[] = Array.isArray(item.result.tags) 
                  ? item.result.tags.map((tag: any) => String(tag || ""))
                  : [];
                results.autoTags = { tags };
              }
              break;
            case "post_interview_summary":
              if (item.result) {
                results.interviewSummary = {
                  summary: String(item.result.summary || "")
                };
              }
              break;
          }
        }
      }

      return results;
    },
  });
}
