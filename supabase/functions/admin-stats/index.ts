import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_EMAIL = "achantaa9@gmail.com";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Verify the caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify user with anon client
    const anonClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await anonClient.auth.getUser();
    if (userError || !user || user.email !== ADMIN_EMAIL) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role to query admin data
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Get all users
    const { data: usersData } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
    const users = usersData?.users || [];

    // Get all connections
    const { data: connections } = await adminClient.from("user_connections").select("*");

    // Build stats
    const now = new Date();
    const days30ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const days7ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get page views (last 30 days)
    const { data: pageViews } = await adminClient
      .from("page_views")
      .select("*")
      .gte("created_at", days30ago.toISOString());

    // Signups by day (last 30 days)
    const signupsByDay: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      signupsByDay[d.toISOString().slice(0, 10)] = 0;
    }
    for (const u of users) {
      const day = new Date(u.created_at).toISOString().slice(0, 10);
      if (signupsByDay[day] !== undefined) signupsByDay[day]++;
    }

    // Connections by day (last 30 days)
    const connectionsByDay: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      connectionsByDay[d.toISOString().slice(0, 10)] = 0;
    }
    for (const c of (connections || [])) {
      const day = new Date(c.created_at).toISOString().slice(0, 10);
      if (connectionsByDay[day] !== undefined) connectionsByDay[day]++;
    }

    // Provider breakdown
    const providerCounts: Record<string, number> = {};
    for (const u of users) {
      const p = u.app_metadata?.provider || "email";
      providerCounts[p] = (providerCounts[p] || 0) + 1;
    }

    // Connection provider breakdown
    const connProviderCounts: Record<string, number> = {};
    for (const c of (connections || [])) {
      connProviderCounts[c.provider] = (connProviderCounts[c.provider] || 0) + 1;
    }

    // Page views by day
    const pageViewsByDay: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      pageViewsByDay[d.toISOString().slice(0, 10)] = 0;
    }
    for (const pv of (pageViews || [])) {
      const day = new Date(pv.created_at).toISOString().slice(0, 10);
      if (pageViewsByDay[day] !== undefined) pageViewsByDay[day]++;
    }

    // Top pages
    const pageCounts: Record<string, number> = {};
    for (const pv of (pageViews || [])) {
      pageCounts[pv.path] = (pageCounts[pv.path] || 0) + 1;
    }

    // Recent users
    const recentUsers = users
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
      .map((u) => ({
        email: u.email,
        provider: u.app_metadata?.provider || "email",
        createdAt: u.created_at,
        lastSignIn: u.last_sign_in_at,
      }));

    const stats = {
      totalUsers: users.length,
      signupsLast7d: users.filter((u) => new Date(u.created_at) >= days7ago).length,
      signupsLast30d: users.filter((u) => new Date(u.created_at) >= days30ago).length,
      totalConnections: connections?.length || 0,
      usersWithConnections: new Set(connections?.map((c) => c.user_id)).size,
      signupsByDay: Object.entries(signupsByDay).map(([date, count]) => ({ date, count })),
      connectionsByDay: Object.entries(connectionsByDay).map(([date, count]) => ({ date, count })),
      providerCounts,
      connProviderCounts,
      recentUsers,
      totalPageViews: pageViews?.length || 0,
      pageViewsLast7d: (pageViews || []).filter((pv) => new Date(pv.created_at) >= days7ago).length,
      pageViewsByDay: Object.entries(pageViewsByDay).map(([date, count]) => ({ date, count })),
      topPages: Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 10),
    };

    return new Response(JSON.stringify(stats), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-stats error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
