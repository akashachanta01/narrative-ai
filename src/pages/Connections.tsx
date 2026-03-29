import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ExternalLink, CheckCircle2, Loader2, LogOut, KeyRound, ArrowLeft } from "lucide-react";

const WINDSOR_OAUTH_URL = "https://onboard.windsor.ai/";

interface Connection {
  id: string;
  provider: string;
  status: string;
  created_at: string;
}

export default function Connections() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [saving, setSaving] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [manualKey, setManualKey] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const refreshConnections = () => {
    if (!user) return;
    supabase
      .from("user_connections")
      .select("id, provider, status, created_at")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setConnections(data);
      });
  };

  useEffect(() => {
    refreshConnections();
  }, [user]);

  // Handle redirect with API key from Windsor
  useEffect(() => {
    const apiKey = searchParams.get("api_key") || searchParams.get("token");
    if (!apiKey || !user) return;
    saveApiKey(apiKey);
    setSearchParams({});
  }, [searchParams, user, setSearchParams]);

  const saveApiKey = async (apiKey: string) => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("user_connections")
      .upsert(
        { user_id: user.id, provider: "windsor", api_key: apiKey, status: "active" },
        { onConflict: "user_id,provider" }
      );
    setSaving(false);
    if (error) {
      toast({ title: "Error saving connection", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Connected!", description: "Windsor.ai is now linked to your account." });
      setShowKeyInput(false);
      setManualKey("");
      refreshConnections();
    }
  };

  const windsorConnected = connections.some((c) => c.provider === "windsor");

  const handleConnectWindsor = () => {
    // Open Windsor in a new tab to avoid iframe issues
    const redirectUrl = `${window.location.origin}/connections`;
    window.open(`${WINDSOR_OAUTH_URL}?redirect_uri=${encodeURIComponent(redirectUrl)}`, "_blank");
    // Show manual key input as fallback
    setShowKeyInput(true);
  };

  const handleSaveManualKey = () => {
    const key = manualKey.trim();
    if (!key) return;
    saveApiKey(key);
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
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Connection Hub</h1>
        </div>
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
            <div key={integration.name} className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
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

              {/* Manual API key input for Windsor */}
              {integration.name === "Windsor.ai" && showKeyInput && !windsorConnected && (
                <div className="border-t border-border pt-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Windsor.ai opened in a new tab. After completing setup, paste your API key below:
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={manualKey}
                        onChange={(e) => setManualKey(e.target.value)}
                        placeholder="Paste your Windsor.ai API key"
                        className="pl-10"
                      />
                    </div>
                    <Button
                      variant="hero"
                      onClick={handleSaveManualKey}
                      disabled={!manualKey.trim() || saving}
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Find your API key at{" "}
                    <a
                      href="https://onboard.windsor.ai/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2"
                    >
                      onboard.windsor.ai
                    </a>
                    {" "}→ Account Settings → API Keys.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
