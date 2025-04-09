
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/state/useAuthStore";
import { toast } from "sonner";

export function useUpdateCandidateNotesMutation() {
  const { orgId } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ candidateId, notes }: { candidateId: string; notes: string }) => {
      // Create a properly typed update object
      const updateData = { notes };
      
      const { data, error } = await supabase
        .from("candidates")
        .update(updateData)
        .eq("id", candidateId)
        .eq("org_id", orgId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (_, variables) => {
      toast.success("Notes updated successfully");
      queryClient.invalidateQueries({ queryKey: ["candidate", variables.candidateId] });
    },
    onError: (error) => {
      toast.error(`Error updating notes: ${error.message}`);
    },
  });
}
