
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/state/useAuthStore";
import { toast } from "@/hooks/use-toast";

export type UpdateCandidateStageParams = {
  candidateId: string;
  jobId: string;
  newStage: "applied" | "screening" | "interview" | "offer" | "hired" | "rejected";
};

export function useUpdateCandidateStageMutation() {
  const queryClient = useQueryClient();
  const { orgId } = useAuthStore();

  return useMutation({
    mutationFn: async ({ candidateId, jobId, newStage }: UpdateCandidateStageParams) => {
      if (!orgId) {
        throw new Error("No organization ID found");
      }

      const { data, error } = await supabase
        .from('candidates')
        .update({ stage: newStage })
        .eq('id', candidateId)
        .eq('job_id', jobId)
        .eq('org_id', orgId);

      if (error) {
        console.error("Error updating candidate stage:", error);
        throw error;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["candidates", variables.jobId, orgId] });
      
      // Show success toast
      const stageDisplay = variables.newStage.charAt(0).toUpperCase() + variables.newStage.slice(1);
      toast({
        title: "Stage Updated",
        description: `Candidate moved to ${stageDisplay}`,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Could not update candidate stage. Please try again.",
        variant: "destructive",
      });
      console.error("Mutation error:", error);
    },
  });
}
