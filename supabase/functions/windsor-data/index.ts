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
    // Authenticate user
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

    // Get Windsor API key from user_connections
    const { data: connection } = await supabase
      .from("user_connections")
      .select("api_key")
      .eq("user_id", user.id)
      .eq("provider", "windsor")
      .eq("status", "active")
      .single();

    if (!connection?.api_key) {
      return new Response(JSON.stringify({ error: "no_connection", message: "Windsor.ai is not connected" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch Marketing Common Data Model from Windsor.ai
    const params = new URLSearchParams({
      api_key: connection.api_key,
      fields: "date,source,clicks,spend,sessions,conversions,revenue",
      date_preset: "last_7d",
    });

    const windsorRes = await fetch(`https://connectors.windsor.ai/all?${params.toString()}`);

    if (!windsorRes.ok) {
      const errorText = await windsorRes.text();
      console.error("Windsor API error:", windsorRes.status, errorText);
      return new Response(JSON.stringify({ error: "windsor_api_error", message: "Failed to fetch data from Windsor.ai" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const windsorData = await windsorRes.json();

    return new Response(JSON.stringify({ data: windsorData.data || [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("windsor-data error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
