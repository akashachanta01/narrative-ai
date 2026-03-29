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
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { provider } = await req.json();
    if (!provider) {
      return new Response(JSON.stringify({ error: "Missing provider" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the user's connection for this provider
    const { data: conn, error: connError } = await supabase
      .from("user_connections")
      .select("*")
      .eq("user_id", user.id)
      .eq("provider", provider)
      .single();

    if (connError || !conn) {
      return new Response(JSON.stringify({ healthy: false, reason: "No connection found" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let healthy = false;
    let reason = "Unknown provider";

    if (provider === "windsor") {
      // Test Windsor API key by making a simple request
      try {
        const res = await fetch(
          `https://connectors.windsor.ai/all?api_key=${conn.api_key}&date_preset=last_7d&fields=source,spend&_limit=1`
        );
        healthy = res.ok;
        reason = res.ok ? "API key is valid" : `API returned ${res.status}`;
      } catch (e) {
        reason = "Failed to reach Windsor API";
      }
    } else if (provider === "ga4") {
      // Test GA4 by checking if we can refresh the token
      try {
        if (!conn.refresh_token) {
          reason = "No refresh token stored";
        } else {
          const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID")!;
          const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET")!;

          const res = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: GOOGLE_CLIENT_ID,
              client_secret: GOOGLE_CLIENT_SECRET,
              refresh_token: conn.refresh_token,
              grant_type: "refresh_token",
            }),
          });

          const data = await res.json();
          healthy = res.ok;
          reason = res.ok ? "OAuth token is valid" : `Token refresh failed: ${data.error || "unknown"}`;
        }
      } catch (e) {
        reason = "Failed to validate GA4 credentials";
      }
    }

    // Update connection status based on health
    const newStatus = healthy ? "active" : "error";
    if (conn.status !== newStatus) {
      await supabase
        .from("user_connections")
        .update({ status: newStatus })
        .eq("id", conn.id);
    }

    return new Response(JSON.stringify({ healthy, reason, provider }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
