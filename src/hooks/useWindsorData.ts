import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { WindsorDataRow, WindsorSummary } from "@/lib/windsorTypes";
import { summarizeWindsorData } from "@/lib/windsorTypes";

interface WindsorResult {
  data: WindsorDataRow[];
}

export function useWindsorData() {
  return useQuery<WindsorSummary | null>({
    queryKey: ["windsor-data"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/windsor-data`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const json = await res.json();

      if (json.error === "no_connection" || !json.data || json.data.length === 0) {
        return null;
      }

      if (json.error) throw new Error(json.message || json.error);

      return summarizeWindsorData(json.data as WindsorDataRow[]);
    },
    staleTime: 5 * 60 * 1000, // 5 min
    retry: 1,
  });
}
