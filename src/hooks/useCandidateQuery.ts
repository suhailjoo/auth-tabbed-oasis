
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/state/useAuthStore";
import { Tables } from "@/integrations/supabase/types";

export type Candidate = Tables<"candidates"> & {
  notes: string | null;
  job_title?: string | null;
};

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

      return data as Candidate;
    },
  });
}
