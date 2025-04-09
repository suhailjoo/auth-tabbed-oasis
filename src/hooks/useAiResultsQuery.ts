
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
      // Bypass TypeScript's typing completely by using a simple type annotation
      const response = await supabase
        .from("workflow_jobs")
        .select("job_type, result")
        .eq("org_id", orgId)
        .in("job_type", ["role_fit_score", "auto_tag_candidate", "post_interview_summary"])
        .eq("payload->candidate_id", candidateId);
      
      if (response.error) {
        throw response.error;
      }

      // Initialize results with null values
      const results: AiResults = {
        roleFitScore: null,
        autoTags: null,
        interviewSummary: null,
      };

      // Process each result based on job_type using a basic for loop
      // with explicit type handling to avoid inference issues
      if (response.data) {
        for (let i = 0; i < response.data.length; i++) {
          const item = response.data[i];
          const jobType = item.job_type as string;
          const result = item.result as Record<string, any>;
          
          if (jobType === "role_fit_score" && result) {
            // Handle role fit score results
            results.roleFitScore = {
              fit_score: result.fit_score != null ? String(result.fit_score) : "N/A",
              verdict: typeof result.verdict === 'string' ? result.verdict : "",
              justification: typeof result.justification === 'string' ? result.justification : ""
            };
          } 
          else if (jobType === "auto_tag_candidate" && result) {
            // Handle auto tags results
            const tagsList: string[] = [];
            
            if (result.tags && Array.isArray(result.tags)) {
              for (let j = 0; j < result.tags.length; j++) {
                tagsList.push(String(result.tags[j]));
              }
            }
            
            results.autoTags = { tags: tagsList };
          } 
          else if (jobType === "post_interview_summary" && result) {
            // Handle interview summary results
            results.interviewSummary = {
              summary: typeof result.summary === 'string' ? result.summary : ""
            };
          }
        }
      }

      return results;
    },
  });
}
