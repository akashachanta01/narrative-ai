import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { insights } = await req.json();

    if (!insights || !Array.isArray(insights) || insights.length === 0) {
      return new Response(
        JSON.stringify({ error: "insights array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build a compact data summary for the AI
    const insightSummaries = insights.map((ins: any) => ({
      metric: ins.metric,
      value: ins.value,
      change: ins.change,
      changeType: ins.changeType,
      narrative: ins.narrative,
      source: ins.source,
    }));

    const systemPrompt = `You are a ruthlessly ROI-focused Performance Marketing Strategist. Your only goal is to maximize revenue per dollar spent.

Rules:
- In exactly two plain-English sentences, explain the most important trend or anomaly and quantify its dollar or percentage impact on revenue. Always reference actual numbers from the data.
- Cross-reference insights: if a "Spend Alert" card shows a channel with low ROAS (< 3×) or declining efficiency, compare it against the "Top Revenue Source" card. Identify the highest-performing channel and recommend reallocating the exact dollar amount or percentage of wasted spend to that channel.
- NO jargon. NO buzzwords. Use "you/your" to address the user directly.
- End with exactly one specific, metric-driven action the user should take. The action MUST include a concrete number: a dollar amount to reallocate, a percentage to shift, a target ROAS to hit, or a revenue goal to reach. Never give vague advice like "optimize" or "improve"—always specify the measurable outcome.
- Format the action on a new line starting with "→ ".
- Examples of good actions: "→ Shift $1,200/mo from Facebook (1.8× ROAS) to Google (6.2× ROAS) to add ~$4,400 in monthly revenue." or "→ Cut TikTok spend by 30% and reinvest into email campaigns targeting a 5× ROAS."

For each insight card provided, rewrite the narrative following these rules.`;

    const userPrompt = `Here are ${insightSummaries.length} insight cards from the user's analytics dashboard. Rewrite each narrative:\n${JSON.stringify(insightSummaries, null, 2)}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
        tools: [
          {
            type: "function",
            function: {
              name: "return_narratives",
              description: "Return rewritten narrative summaries for insight cards",
              parameters: {
                type: "object",
                properties: {
                  narratives: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "The metric name" },
                        explanation: { type: "string", description: "2-sentence explanation of the trend and its revenue impact" },
                        action: { type: "string", description: "One specific actionable next step, e.g. 'Increase TikTok budget by 10%'" },
                      },
                      required: ["id", "explanation", "action"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["narratives"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_narratives" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings > Workspace > Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate AI insights" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await response.json();

    // Extract tool call result
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      // Merge explanation + action into a single narrative with → separator
      const narratives = (parsed.narratives || []).map((n: any) => ({
        id: n.id,
        narrative: n.action ? `${n.explanation} → ${n.action}` : n.explanation || n.narrative || "",
      }));
      return new Response(
        JSON.stringify({ narratives }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback: try to parse content directly
    const content = result.choices?.[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content);
      return new Response(
        JSON.stringify({ narratives: Array.isArray(parsed) ? parsed : parsed.narratives }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unexpected AI response format" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("ai-insights error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
