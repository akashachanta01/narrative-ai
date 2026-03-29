import { useState, useEffect, useCallback } from "react";
import type { DynamicInsight } from "@/lib/generateInsights";
import { supabase } from "@/integrations/supabase/client";

interface AiNarrative {
  id: string;
  narrative: string;
}

export function useAiInsights(insights: DynamicInsight[]) {
  const [narratives, setNarratives] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a stable key from insight ids
  const insightKey = insights.map((i) => `${i.id}-${i.value}`).join("|");

  const fetchNarratives = useCallback(async () => {
    if (insights.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("ai-insights", {
        body: {
          insights: insights.map((ins) => ({
            metric: ins.metric,
            value: ins.value,
            change: ins.change,
            changeType: ins.changeType,
            narrative: ins.narrative,
            source: ins.source,
          })),
        },
      });

      if (fnError) {
        console.error("AI insights error:", fnError);
        setError("Failed to generate AI insights");
        return;
      }

      if (data?.narratives) {
        const map: Record<string, string> = {};
        for (const n of data.narratives as AiNarrative[]) {
          map[n.id] = n.narrative;
        }
        setNarratives(map);
      }
    } catch (e) {
      console.error("AI insights fetch error:", e);
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [insightKey]);

  useEffect(() => {
    fetchNarratives();
  }, [fetchNarratives]);

  return { narratives, isLoading, error, refetch: fetchNarratives };
}
