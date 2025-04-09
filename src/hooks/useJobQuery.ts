
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/state/useAuthStore";
import { Job } from "./useJobsQuery";

export const useJobQuery = (jobId: string) => {
  const { orgId } = useAuthStore();

  return useQuery({
    queryKey: ["job", jobId, orgId],
    queryFn: async (): Promise<Job | null> => {
      if (!orgId || !jobId) {
        throw new Error("No organization ID or job ID found");
      }

      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, location, employment_type, department, created_at')
        .eq('org_id', orgId)
        .eq('id', jobId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found
          return null;
        }
        console.error("Error fetching job:", error);
        throw error;
      }

      return data;
    },
    enabled: !!orgId && !!jobId,
  });
};
