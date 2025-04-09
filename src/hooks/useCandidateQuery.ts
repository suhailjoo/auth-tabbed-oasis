
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/state/useAuthStore";

export type Candidate = {
  id: string;
  name: string | null;
  resume_url: string | null;
  notes: string | null;
  job_id: string | null;
  stage: string | null;
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
        .select("id, name, resume_url, notes, job_id, stage")
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
