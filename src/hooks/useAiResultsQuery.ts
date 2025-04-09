
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
      // Use any type for response to avoid deep type inference
      const { data, error } = await supabase
        .from("workflow_jobs")
        .select("job_type, result")
        .eq("org_id", orgId)
        .in("job_type", ["role_fit_score", "auto_tag_candidate", "post_interview_summary"])
        .eq("payload->candidate_id", candidateId)
        .returns<SimpleWorkflowJob[]>();
      
      if (error) {
        throw error;
      }

      // Initialize results with null values
      const results: AiResults = {
        roleFitScore: null,
        autoTags: null,
        interviewSummary: null,
      };

      // Safely process the data with explicit typing
      if (data) {
        data.forEach(item => {
          if (item.job_type === "role_fit_score" && item.result) {
            results.roleFitScore = {
              fit_score: item.result.fit_score ?? "N/A",
              verdict: String(item.result.verdict || ""),
              justification: String(item.result.justification || "")
            };
          } 
          else if (item.job_type === "auto_tag_candidate" && item.result) {
            // Handle tags array safely
            const tags: string[] = [];
            if (item.result.tags && Array.isArray(item.result.tags)) {
              item.result.tags.forEach(tag => {
                if (tag) tags.push(String(tag));
              });
            }
            results.autoTags = { tags };
          } 
          else if (item.job_type === "post_interview_summary" && item.result) {
            results.interviewSummary = {
              summary: String(item.result.summary || "")
            };
          }
        });
      }

      return results;
    },
  });
}
