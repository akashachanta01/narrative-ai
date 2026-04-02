import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
      return new Response(JSON.stringify({
        brief: null,
        connectedSources: [],
        message: "No sources connected",
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Fetch Windsor data if any connection has a Windsor key
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

    // Summarize data
    const totalSpend = windsorData.reduce((s: number, r: any) => s + (Number(r.spend) || 0), 0);
    const totalRevenue = windsorData.reduce((s: number, r: any) => s + (Number(r.revenue) || 0), 0);
    const totalClicks = windsorData.reduce((s: number, r: any) => s + (Number(r.clicks) || 0), 0);
    const totalSessions = windsorData.reduce((s: number, r: any) => s + (Number(r.sessions) || 0), 0);
    const totalConversions = windsorData.reduce((s: number, r: any) => s + (Number(r.conversions) || 0), 0);
    const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

    // By source breakdown
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

    // By date for trend
    const byDate: Record<string, { revenue: number; sessions: number; conversions: number }> = {};
    for (const r of windsorData) {
      const d = r.date || "unknown";
      if (!byDate[d]) byDate[d] = { revenue: 0, sessions: 0, conversions: 0 };
      byDate[d].revenue += Number(r.revenue) || 0;
      byDate[d].sessions += Number(r.sessions) || 0;
      byDate[d].conversions += Number(r.conversions) || 0;
    }

    const summary = {
      totalSpend: Math.round(totalSpend * 100) / 100,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalClicks,
      totalSessions,
      totalConversions,
      roas: Math.round(roas * 100) / 100,
      conversionRate: totalSessions > 0 ? Math.round((totalConversions / totalSessions) * 10000) / 100 : 0,
      avgOrderValue: totalConversions > 0 ? Math.round((totalRevenue / totalConversions) * 100) / 100 : 0,
      bySource: Object.entries(bySource)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue),
      byDate: Object.entries(byDate)
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    };

    // If no actual data from Windsor, return summary without AI
    if (windsorData.length === 0) {
      return new Response(JSON.stringify({
        brief: null,
        connectedSources,
        summary,
        message: "Connected but no data returned from Windsor. Make sure your Windsor.ai account has data sources configured.",
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Call AI to generate the brief
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      // Return data without AI brief
      return new Response(JSON.stringify({
        brief: null,
        connectedSources,
        summary,
        message: "Data loaded but AI is not configured",
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const systemPrompt = `You are DataBrief AI, a ruthlessly ROI-focused marketing analyst. You analyze real marketing data and produce actionable insights.

Rules:
- Be specific with numbers from the data provided. Never invent data.
- Use "you/your" to address the user directly.
- Be concise and direct. No fluff.
- If data shows issues (declining metrics, low ROAS channels), call them out clearly.
- Always end recommendations with specific, measurable actions.`;

    const userPrompt = `Here is the user's marketing data for the last period:

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

Generate a complete dashboard brief with verdict, alerts, and KPI analysis.`;

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
            description: "Generate a complete dashboard brief from marketing data",
            parameters: {
              type: "object",
              properties: {
                verdict: {
                  type: "object",
                  properties: {
                    headline: { type: "string", description: "One bold sentence summarizing the most important finding. Use specific numbers." },
                    body: { type: "string", description: "2-3 sentences explaining the context and what to do about it." },
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
                      badge: { type: "string", description: "Short badge text like ACT TODAY, THIS WEEK, OPPORTUNITY" },
                      title: { type: "string" },
                      description: { type: "string" },
                      action: { type: "string", description: "Specific step the user should take" },
                    },
                    required: ["type", "badge", "title", "description", "action"],
                    additionalProperties: false,
                  },
                  description: "1-4 prioritized alerts based on data patterns",
                },
                kpis: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      label: { type: "string" },
                      value: { type: "string" },
                      context: { type: "string", description: "Brief context like '+12% vs last week' or 'Below target'" },
                      status: { type: "string", enum: ["up", "down", "neutral"] },
                    },
                    required: ["label", "value", "context", "status"],
                    additionalProperties: false,
                  },
                  description: "4-6 key metrics to highlight",
                },
                sourceBreakdown: {
                  type: "string",
                  description: "A brief 2-3 sentence analysis of traffic/revenue by source",
                },
              },
              required: ["verdict", "alerts", "kpis", "sourceBreakdown"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "generate_brief" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI error:", aiResponse.status, await aiResponse.text());
      // Return data without AI
      return new Response(JSON.stringify({
        brief: null,
        connectedSources,
        summary,
        message: "Data loaded but AI generation failed",
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
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

    return new Response(JSON.stringify({
      brief,
      connectedSources,
      summary,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (e) {
    console.error("dashboard-brief error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
