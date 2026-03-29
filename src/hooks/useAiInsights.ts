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
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const insightKey = insights.map((i) => `${i.id}-${i.value}`).join("|");

  const fetchNarratives = useCallback(async (subset?: DynamicInsight[]) => {
    const target = subset || insights;
    if (target.length === 0) return;

    const ids = new Set(target.map((i) => i.metric));

    if (subset) {
      setLoadingIds((prev) => new Set([...prev, ...ids]));
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("ai-insights", {
        body: {
          insights: target.map((ins) => ({
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
        setNarratives((prev) => ({ ...prev, ...map }));
      }
    } catch (e) {
      console.error("AI insights fetch error:", e);
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      if (subset) {
        setLoadingIds((prev) => {
          const next = new Set(prev);
          ids.forEach((id) => next.delete(id));
          return next;
        });
      } else {
        setIsLoading(false);
      }
    }
  }, [insightKey]);

  const regenerate = useCallback(
    (metric: string) => {
      const insight = insights.find((i) => i.metric === metric);
      if (insight) fetchNarratives([insight]);
    },
    [insights, fetchNarratives]
  );

  useEffect(() => {
    fetchNarratives();
  }, [fetchNarratives]);

  return { narratives, isLoading, loadingIds, error, refetch: () => fetchNarratives(), regenerate };
}
