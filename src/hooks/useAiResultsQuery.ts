
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

export function useAiResultsQuery(candidateId: string) {
  const { orgId } = useAuthStore();

  return useQuery({
    queryKey: ["aiResults", candidateId],
    enabled: !!candidateId && !!orgId,
    queryFn: async () => {
      // Fetch records from workflow_jobs table with minimal type information
      // Using `any` in the type assertion to avoid excessive type instantiation
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

      // Process each result based on job_type
      if (data) {
        // Use any[] type to avoid deep type instantiation
        const jobResults = data as any[];
        
        for (const item of jobResults) {
          if (item.job_type === "role_fit_score" && item.result) {
            // Explicitly create a properly typed object for role fit score
            results.roleFitScore = {
              fit_score: item.result.fit_score !== undefined 
                ? String(item.result.fit_score) 
                : "N/A",
              verdict: typeof item.result.verdict === 'string' 
                ? item.result.verdict 
                : "",
              justification: typeof item.result.justification === 'string' 
                ? item.result.justification 
                : ""
            };
          } else if (item.job_type === "auto_tag_candidate" && item.result) {
            // For tags array, handle different potential formats safely
            let tagsList: string[] = [];
            
            if (Array.isArray(item.result.tags)) {
              tagsList = item.result.tags.map((tag: any) => String(tag));
            }
            
            results.autoTags = { tags: tagsList };
          } else if (item.job_type === "post_interview_summary" && item.result) {
            // Explicitly create a properly typed object for interview summary
            results.interviewSummary = {
              summary: typeof item.result.summary === 'string' 
                ? item.result.summary 
                : ""
            };
          }
        }
      }

      return results;
    },
  });
}
