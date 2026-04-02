import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function refreshAccessToken(refreshToken: string): Promise<{ access_token: string; expires_in: number }> {
  const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID")!;
  const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET")!;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Token refresh failed: ${JSON.stringify(data)}`);
  return data;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get GA4 connection
    const { data: connection } = await userClient
      .from("user_connections")
      .select("access_token, refresh_token, token_expires_at")
      .eq("user_id", user.id)
      .eq("provider", "ga4")
      .eq("status", "active")
      .single();

    if (!connection?.access_token) {
      return new Response(JSON.stringify({ error: "no_connection", message: "GA4 is not connected" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let accessToken = connection.access_token;

    // Refresh token if expired
    if (connection.token_expires_at && new Date(connection.token_expires_at) <= new Date()) {
      if (!connection.refresh_token) {
        return new Response(JSON.stringify({ error: "token_expired", message: "GA4 token expired, please reconnect" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const refreshed = await refreshAccessToken(connection.refresh_token);
      accessToken = refreshed.access_token;
      const newExpiry = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();

      // Update token using service role
      const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      await adminClient
        .from("user_connections")
        .update({ access_token: accessToken, token_expires_at: newExpiry })
        .eq("user_id", user.id)
        .eq("provider", "ga4");
    }

    // First, get the user's GA4 properties
    const accountsRes = await fetch(
      "https://analyticsadmin.googleapis.com/v1beta/accountSummaries",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!accountsRes.ok) {
      const errText = await accountsRes.text();
      console.error("GA4 accounts error:", accountsRes.status, errText);
      return new Response(JSON.stringify({ error: "ga4_api_error", message: "Failed to fetch GA4 accounts" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const accountsData = await accountsRes.json();
    const propertySummaries = accountsData.accountSummaries?.flatMap(
      (a: any) => a.propertySummaries || []
    ) || [];

    if (propertySummaries.length === 0) {
      return new Response(JSON.stringify({ data: [], message: "No GA4 properties found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use the first property
    const propertyId = propertySummaries[0].property.replace("properties/", "");

    // Parse days from query string
    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get("days") || "7", 10);

    // Fetch report data
    const reportRes = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
          dimensions: [{ name: "date" }, { name: "sessionDefaultChannelGroup" }],
          metrics: [
            { name: "sessions" },
            { name: "conversions" },
            { name: "totalRevenue" },
            { name: "activeUsers" },
          ],
        }),
      }
    );

    if (!reportRes.ok) {
      const errText = await reportRes.text();
      console.error("GA4 report error:", reportRes.status, errText);
      return new Response(JSON.stringify({ error: "ga4_report_error", message: "Failed to fetch GA4 report" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const reportData = await reportRes.json();

    // Transform into our common data model
    // GA4 returns dates in YYYYMMDD format — convert to YYYY-MM-DD for downstream parsing
    const rows = (reportData.rows || []).map((row: any) => ({
      date: row.dimensionValues[0].value.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"),
      source: row.dimensionValues[1].value,
      sessions: parseInt(row.metricValues[0].value) || 0,
      conversions: parseInt(row.metricValues[1].value) || 0,
      revenue: parseFloat(row.metricValues[2].value) || 0,
      clicks: parseInt(row.metricValues[3].value) || 0,
      spend: 0,
    }));

    return new Response(JSON.stringify({ data: rows, property: propertySummaries[0].displayName }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ga4-data error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
