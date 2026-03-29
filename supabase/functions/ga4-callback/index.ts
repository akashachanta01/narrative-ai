import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error) {
      const redirectUri = state ? decodeURIComponent(state) : "/connections";
      return Response.redirect(`${redirectUri}?ga4_error=${encodeURIComponent(error)}`, 302);
    }

    if (!code) {
      return new Response("Missing authorization code", { status: 400 });
    }

    const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID")!;
    const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET")!;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const callbackUrl = `${supabaseUrl}/functions/v1/ga4-callback`;

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: callbackUrl,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error("Token exchange error:", tokenData);
      const redirectUri = state ? decodeURIComponent(state) : "/connections";
      return Response.redirect(`${redirectUri}?ga4_error=token_exchange_failed`, 302);
    }

    // Get user email from Google to find the Supabase user
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userInfo = await userInfoRes.json();
    await userInfoRes.text().catch(() => {});

    // Find user by email in Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // List users and find by email
    const { data: usersData } = await supabase.auth.admin.listUsers();
    const matchedUser = usersData?.users?.find((u) => u.email === userInfo.email);

    if (!matchedUser) {
      const redirectUri = state ? decodeURIComponent(state) : "/connections";
      return Response.redirect(`${redirectUri}?ga4_error=user_not_found`, 302);
    }

    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();

    // Store connection using service role
    const { error: upsertError } = await supabase
      .from("user_connections")
      .upsert(
        {
          user_id: matchedUser.id,
          provider: "ga4",
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || null,
          token_expires_at: expiresAt,
          api_key: "oauth",
          status: "active",
        },
        { onConflict: "user_id,provider" }
      );

    if (upsertError) {
      console.error("Upsert error:", upsertError);
    }

    const redirectUri = state ? decodeURIComponent(state) : "/connections";
    return Response.redirect(`${redirectUri}?ga4_connected=true`, 302);
  } catch (e) {
    console.error("ga4-callback error:", e);
    return new Response("Internal server error", { status: 500 });
  }
});
