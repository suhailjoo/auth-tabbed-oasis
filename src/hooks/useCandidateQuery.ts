
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/state/useAuthStore";

export function useCandidateQuery(candidateId: string) {
  const { orgId } = useAuthStore();

  return useQuery({
    queryKey: ["candidate", candidateId],
    enabled: !!candidateId && !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("id", candidateId)
        .eq("org_id", orgId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
  });
}
