import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function jsonRes(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return jsonRes({ error: "Missing authorization" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return jsonRes({ error: "Unauthorized" }, 401);

    // Get user connections
    const { data: connections } = await supabase
      .from("user_connections")
      .select("provider, api_key, method, status, metadata")
      .eq("user_id", user.id);

    const activeConnections = (connections || []).filter(
      (c: any) => c.status === "active" || c.status === "connected"
    );
    const connectedSources = activeConnections.map((c: any) => c.provider);

    if (connectedSources.length === 0) {
      return jsonRes({ brief: null, connectedSources: [], message: "No sources connected" });
    }

    // Fetch Windsor data
    const windsorConn = activeConnections.find((c: any) => c.method === "windsor" && c.api_key);
    let windsorData: any[] = [];

    if (windsorConn?.api_key) {
      const url = new URL(req.url);
      const days = parseInt(url.searchParams.get("days") || "7", 10);
      const presetMap: Record<number, string> = { 7: "last_7d", 30: "last_30d", 90: "last_90d" };
      const datePreset = presetMap[days] || "last_7d";

      const params = new URLSearchParams({
        api_key: windsorConn.api_key,
        fields: "date,source,clicks,spend,sessions,conversions,revenue",
        date_preset: datePreset,
      });

      try {
        const windsorRes = await fetch(`https://connectors.windsor.ai/all?${params.toString()}`);
        if (windsorRes.ok) {
          const json = await windsorRes.json();
          windsorData = json.data || [];
        }
      } catch (e) {
        console.error("Windsor fetch error:", e);
      }
    }

    // Aggregate data
    const totals = windsorData.reduce(
      (acc, r) => ({
        spend: acc.spend + (Number(r.spend) || 0),
        revenue: acc.revenue + (Number(r.revenue) || 0),
        clicks: acc.clicks + (Number(r.clicks) || 0),
        sessions: acc.sessions + (Number(r.sessions) || 0),
        conversions: acc.conversions + (Number(r.conversions) || 0),
      }),
      { spend: 0, revenue: 0, clicks: 0, sessions: 0, conversions: 0 }
    );

    const roas = totals.spend > 0 ? totals.revenue / totals.spend : 0;

    const bySource: Record<string, { revenue: number; spend: number; clicks: number; sessions: number; conversions: number }> = {};
    for (const r of windsorData) {
      const src = r.source || "unknown";
      if (!bySource[src]) bySource[src] = { revenue: 0, spend: 0, clicks: 0, sessions: 0, conversions: 0 };
      bySource[src].revenue += Number(r.revenue) || 0;
      bySource[src].spend += Number(r.spend) || 0;
      bySource[src].clicks += Number(r.clicks) || 0;
      bySource[src].sessions += Number(r.sessions) || 0;
      bySource[src].conversions += Number(r.conversions) || 0;
    }

    const byDate: Record<string, { revenue: number; sessions: number; conversions: number }> = {};
    for (const r of windsorData) {
      const d = r.date || "unknown";
      if (!byDate[d]) byDate[d] = { revenue: 0, sessions: 0, conversions: 0 };
      byDate[d].revenue += Number(r.revenue) || 0;
      byDate[d].sessions += Number(r.sessions) || 0;
      byDate[d].conversions += Number(r.conversions) || 0;
    }

    const round2 = (n: number) => Math.round(n * 100) / 100;
    const summary = {
      totalSpend: round2(totals.spend),
      totalRevenue: round2(totals.revenue),
      totalClicks: totals.clicks,
      totalSessions: totals.sessions,
      totalConversions: totals.conversions,
      roas: round2(roas),
      conversionRate: totals.sessions > 0 ? round2((totals.conversions / totals.sessions) * 100) : 0,
      avgOrderValue: totals.conversions > 0 ? round2(totals.revenue / totals.conversions) : 0,
      bySource: Object.entries(bySource)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue),
      byDate: Object.entries(byDate)
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    };

    if (windsorData.length === 0) {
      return jsonRes({
        brief: null, connectedSources, summary,
        message: "Connected but no data returned from Windsor. Make sure your Windsor.ai account has data sources configured.",
      });
    }

    // AI brief generation
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return jsonRes({ brief: null, connectedSources, summary, message: "Data loaded but AI is not configured" });
    }

    // Build source-aware prompt
    const hasGA4 = connectedSources.includes("ga4");
    const hasShopify = connectedSources.includes("shopify");
    const hasStripe = connectedSources.includes("stripe");

    const sourceContext = [
      hasGA4 && "Google Analytics 4 (traffic, sessions, user behavior, acquisition channels)",
      hasShopify && "Shopify (orders, revenue, products, e-commerce conversions)",
      hasStripe && "Stripe (payments, subscriptions, MRR, failed charges)",
    ].filter(Boolean).join("; ");

    const systemPrompt = `You are DataBrief AI, a ruthlessly ROI-focused marketing analyst. You analyze real marketing data and produce actionable insights.

The user has these data sources connected: ${sourceContext}.

CRITICAL RULES:
- ONLY reference data sources that are actually connected. If only GA4 is connected, do NOT mention Shopify orders, Stripe payments, or e-commerce metrics that aren't in the data.
- If GA4 is connected: focus on traffic analysis, session quality, acquisition channels, user engagement, and conversion tracking.
- If Shopify is connected: focus on orders, revenue, AOV, top products, cart abandonment, and e-commerce performance.
- If Stripe is connected: focus on payment volume, subscription health, churn, MRR, and failed payments.
- When multiple sources are connected, cross-reference them (e.g., GA4 traffic → Shopify conversions → Stripe revenue).
- Be specific with numbers from the data provided. Never invent data.
- Use "you/your" to address the user directly. Be concise and direct.
- If data shows issues, call them out clearly.
- Always end recommendations with specific, measurable actions.
- In sourceInsights, ONLY include entries for connected sources.`;

    const userPrompt = `Here is the user's marketing data:

Connected sources: ${connectedSources.join(", ")}

Summary:
- Total Revenue: $${summary.totalRevenue.toLocaleString()}
- Total Spend: $${summary.totalSpend.toLocaleString()}
- ROAS: ${summary.roas}x
- Total Sessions: ${summary.totalSessions.toLocaleString()}
- Total Clicks: ${summary.totalClicks.toLocaleString()}
- Total Conversions: ${summary.totalConversions}
- Conversion Rate: ${summary.conversionRate}%
- Avg Order Value: $${summary.avgOrderValue}

By Source:
${summary.bySource.map(s => `- ${s.name}: Revenue $${s.revenue.toFixed(2)}, Spend $${s.spend.toFixed(2)}, Sessions ${s.sessions}, Conversions ${s.conversions}`).join("\n")}

Daily Trend:
${summary.byDate.map(d => `- ${d.date}: Revenue $${d.revenue.toFixed(2)}, Sessions ${d.sessions}, Conversions ${d.conversions}`).join("\n")}

Generate a dashboard brief with source-specific insights. Only include sourceInsights for connected sources: ${connectedSources.join(", ")}.`;

    // Build sourceInsights schema items based on connected sources
    const sourceInsightItems: any = {
      type: "object",
      properties: {
        source: { type: "string", enum: connectedSources, description: "The connected source this insight is for" },
        headline: { type: "string", description: "One sentence summary for this source" },
        metrics: {
          type: "array",
          items: {
            type: "object",
            properties: {
              label: { type: "string" },
              value: { type: "string" },
              status: { type: "string", enum: ["up", "down", "neutral"] },
            },
            required: ["label", "value", "status"],
            additionalProperties: false,
          },
          description: "3-5 key metrics specific to this source",
        },
        recommendation: { type: "string", description: "One actionable recommendation for this source" },
      },
      required: ["source", "headline", "metrics", "recommendation"],
      additionalProperties: false,
    };

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_brief",
            description: "Generate a dashboard brief with source-specific insights",
            parameters: {
              type: "object",
              properties: {
                verdict: {
                  type: "object",
                  properties: {
                    headline: { type: "string", description: "One bold sentence summarizing the most important finding." },
                    body: { type: "string", description: "2-3 sentences with context and recommended action." },
                  },
                  required: ["headline", "body"],
                  additionalProperties: false,
                },
                alerts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: { type: "string", enum: ["critical", "warning", "opportunity"] },
                      badge: { type: "string" },
                      title: { type: "string" },
                      description: { type: "string" },
                      action: { type: "string" },
                      relatedSource: { type: "string", description: "Which connected source this alert relates to" },
                    },
                    required: ["type", "badge", "title", "description", "action", "relatedSource"],
                    additionalProperties: false,
                  },
                },
                kpis: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      label: { type: "string" },
                      value: { type: "string" },
                      context: { type: "string" },
                      status: { type: "string", enum: ["up", "down", "neutral"] },
                      source: { type: "string", description: "Which connected source this KPI comes from" },
                    },
                    required: ["label", "value", "context", "status", "source"],
                    additionalProperties: false,
                  },
                },
                sourceInsights: {
                  type: "array",
                  items: sourceInsightItems,
                  description: `Source-specific insight sections. ONLY include for: ${connectedSources.join(", ")}`,
                },
                sourceBreakdown: { type: "string" },
              },
              required: ["verdict", "alerts", "kpis", "sourceInsights", "sourceBreakdown"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "generate_brief" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) return jsonRes({ error: "Rate limit exceeded. Please try again shortly." }, 429);
      if (aiResponse.status === 402) return jsonRes({ error: "AI credits exhausted." }, 402);
      console.error("AI error:", aiResponse.status, await aiResponse.text());
      return jsonRes({ brief: null, connectedSources, summary, message: "Data loaded but AI generation failed" });
    }

    const aiResult = await aiResponse.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    let brief = null;

    if (toolCall?.function?.arguments) {
      try {
        brief = JSON.parse(toolCall.function.arguments);
      } catch {
        console.error("Failed to parse AI tool call arguments");
      }
    }

    return jsonRes({ brief, connectedSources, summary });
  } catch (e) {
    console.error("dashboard-brief error:", e);
    return jsonRes({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
