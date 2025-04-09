
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

// Define a simple result type to avoid deep type inference
type WorkflowJobResult = {
  job_type: string;
  result: any;
}

export function useAiResultsQuery(candidateId: string) {
  const { orgId } = useAuthStore();

  return useQuery({
    queryKey: ["aiResults", candidateId],
    enabled: !!candidateId && !!orgId,
    queryFn: async () => {
      // Use explicit any type to avoid TypeScript's deep type checking
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

      // Safely process the data with explicit typing
      if (data) {
        // Cast to simple array type to avoid inference issues
        const items = data as WorkflowJobResult[];
        
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          
          if (item.job_type === "role_fit_score" && item.result) {
            results.roleFitScore = {
              fit_score: item.result.fit_score != null ? item.result.fit_score : "N/A",
              verdict: typeof item.result.verdict === 'string' ? item.result.verdict : "",
              justification: typeof item.result.justification === 'string' ? item.result.justification : ""
            };
          } 
          else if (item.job_type === "auto_tag_candidate" && item.result) {
            // Handle tags with explicit type safety
            const tagsList: string[] = [];
            
            if (item.result.tags && Array.isArray(item.result.tags)) {
              for (let j = 0; j < item.result.tags.length; j++) {
                tagsList.push(String(item.result.tags[j]));
              }
            }
            
            results.autoTags = { tags: tagsList };
          } 
          else if (item.job_type === "post_interview_summary" && item.result) {
            results.interviewSummary = {
              summary: typeof item.result.summary === 'string' ? item.result.summary : ""
            };
          }
        }
      }

      return results;
    },
  });
}
