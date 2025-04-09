
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/state/useAuthStore";

export interface Job {
  id: string;
  title: string;
  location: string;
  employment_type: string;
  department: string | null;
  created_at: string;
}

export const useJobsQuery = () => {
  const { orgId } = useAuthStore();

  return useQuery({
    queryKey: ["jobs", orgId],
    queryFn: async (): Promise<Job[]> => {
      if (!orgId) {
        throw new Error("No organization ID found");
      }

      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, location, employment_type, department, created_at')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching jobs:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!orgId,
  });
};
