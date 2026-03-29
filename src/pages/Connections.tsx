import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ExternalLink, CheckCircle2, Loader2, LogOut } from "lucide-react";

const WINDSOR_OAUTH_URL = "https://onboard.windsor.ai/";

interface Connection {
  id: string;
  provider: string;
  status: string;
  created_at: string;
}

type ManualKeyState = "idle" | "input" | "saving";

export default function Connections() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  // Fetch existing connections
  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_connections")
      .select("id, provider, status, created_at")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setConnections(data);
      });
  }, [user]);

  // Handle redirect with API key from Windsor
  useEffect(() => {
    const apiKey = searchParams.get("api_key") || searchParams.get("token");
    if (!apiKey || !user) return;

    setSaving(true);
    // Clear query params
    setSearchParams({});

    supabase
      .from("user_connections")
      .upsert(
        { user_id: user.id, provider: "windsor", api_key: apiKey, status: "active" },
        { onConflict: "user_id,provider" }
      )
      .then(({ error }) => {
        setSaving(false);
        if (error) {
          toast({ title: "Error saving connection", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Connected!", description: "Windsor.ai is now linked to your account." });
          // Refresh connections
          supabase
            .from("user_connections")
            .select("id, provider, status, created_at")
            .eq("user_id", user.id)
            .then(({ data }) => {
              if (data) setConnections(data);
            });
        }
      });
  }, [searchParams, user, setSearchParams]);

  const windsorConnected = connections.some((c) => c.provider === "windsor");

  const handleConnectWindsor = () => {
    // Redirect to Windsor OAuth with a callback to this page
    const redirectUrl = `${window.location.origin}/connections`;
    window.location.href = `${WINDSOR_OAUTH_URL}?redirect_uri=${encodeURIComponent(redirectUrl)}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const integrations = [
    {
      name: "Windsor.ai",
      description: "Connect GA4, Shopify, and 100+ marketing sources through Windsor's unified API.",
      connected: windsorConnected,
      onConnect: handleConnectWindsor,
    },
    {
      name: "Google Analytics 4",
      description: "Pull website traffic, conversions, and audience data directly.",
      connected: false,
      onConnect: () => toast({ title: "Coming soon", description: "GA4 direct integration is on the roadmap." }),
      comingSoon: true,
    },
    {
      name: "Shopify",
      description: "Sync orders, revenue, and customer data from your store.",
      connected: false,
      onConnect: () => toast({ title: "Coming soon", description: "Shopify integration is on the roadmap." }),
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Connection Hub</h1>
        <Button variant="ghost" size="sm" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Connect your data</h2>
          <p className="text-muted-foreground">
            Link your marketing platforms so NarrativeMetrics can generate insights.
          </p>
        </div>

        {saving && (
          <div className="glass-card p-4 flex items-center gap-3 text-primary">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Saving your connection…</span>
          </div>
        )}

        <div className="space-y-4">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="glass-card p-6 flex items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{integration.name}</h3>
                  {integration.comingSoon && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      Coming soon
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{integration.description}</p>
              </div>

              {integration.connected ? (
                <div className="flex items-center gap-2 text-primary shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Connected</span>
                </div>
              ) : (
                <Button
                  variant={integration.comingSoon ? "outline" : "hero"}
                  size="sm"
                  onClick={integration.onConnect}
                  disabled={integration.comingSoon}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Connect
                </Button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
