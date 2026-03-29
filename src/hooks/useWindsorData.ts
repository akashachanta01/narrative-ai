import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { WindsorDataRow, WindsorSummary } from "@/lib/windsorTypes";
import { summarizeWindsorData } from "@/lib/windsorTypes";

export function useWindsorData(days: number = 7) {
  return useQuery<WindsorSummary | null>({
    queryKey: ["marketing-data", days],
    refetchOnMount: false,
    queryKey: ["marketing-data", days],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const headers = {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      };

      // Try Windsor first
      const windsorRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/windsor-data?days=${days}`,
        { headers }
      );
      const windsorJson = await windsorRes.json();

      if (windsorJson.data && windsorJson.data.length > 0) {
        return summarizeWindsorData(windsorJson.data as WindsorDataRow[]);
      }

      // Try GA4
      const ga4Res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/ga4-data?days=${days}`,
        { headers }
      );
      const ga4Json = await ga4Res.json();

      if (ga4Json.data && ga4Json.data.length > 0) {
        return summarizeWindsorData(ga4Json.data as WindsorDataRow[]);
      }

      return null;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
