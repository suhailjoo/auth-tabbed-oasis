
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
      // Use a simple approach with no complex typing to avoid deep type instantiation
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
        // Use any to avoid type inference issues completely
        const jobResults = data as any[];
        
        for (const item of jobResults) {
          if (item.job_type === "role_fit_score" && item.result) {
            // Handle role fit score results
            const fitScore = item.result.fit_score !== undefined 
              ? String(item.result.fit_score) 
              : "N/A";
            
            const verdict = typeof item.result.verdict === 'string' 
              ? item.result.verdict 
              : "";
              
            const justification = typeof item.result.justification === 'string' 
              ? item.result.justification 
              : "";
            
            results.roleFitScore = { fit_score: fitScore, verdict, justification };
          } 
          else if (item.job_type === "auto_tag_candidate" && item.result) {
            // Handle auto tags results
            let tagsList: string[] = [];
            
            if (item.result.tags && Array.isArray(item.result.tags)) {
              tagsList = item.result.tags.map(tag => String(tag));
            }
            
            results.autoTags = { tags: tagsList };
          } 
          else if (item.job_type === "post_interview_summary" && item.result) {
            // Handle interview summary results
            const summary = typeof item.result.summary === 'string' 
              ? item.result.summary 
              : "";
              
            results.interviewSummary = { summary };
          }
        }
      }

      return results;
    },
  });
}
