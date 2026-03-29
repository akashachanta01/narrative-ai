import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  ExternalLink,
  CheckCircle2,
  Loader2,
  LogOut,
  KeyRound,
  ArrowLeft,
  BarChart3,
  Layers,
  ShoppingBag,
  Megaphone,
  Search as SearchIcon,
  Video,
  Mail,
  Users,
  Clock,
  Circle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const WINDSOR_OAUTH_URL = "https://onboard.windsor.ai/";
const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;

interface Connection {
  id: string;
  provider: string;
  status: string;
  created_at: string;
  updated_at: string;
}

type ConnectionStatus = "connected" | "error" | "syncing" | "disconnected" | "coming_soon";

interface Integration {
  name: string;
  provider: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  category: string;
  status: ConnectionStatus;
  lastSync: string | null;
  onConnect: () => void;
  comingSoon?: boolean;
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
      .select("id, provider, status, created_at, updated_at")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setConnections(data as Connection[]);
      });
  };

  useEffect(() => {
    refreshConnections();
  }, [user]);

  useEffect(() => {
    const apiKey = searchParams.get("api_key") || searchParams.get("token");
    if (!apiKey || !user) return;
    saveApiKey(apiKey);
    setSearchParams({});
  }, [searchParams, user, setSearchParams]);

  useEffect(() => {
    const ga4Connected = searchParams.get("ga4_connected");
    const ga4Error = searchParams.get("ga4_error");
    if (ga4Connected === "true") {
      toast({ title: "Connected!", description: "Google Analytics 4 is now linked to your account." });
      setSearchParams({});
      refreshConnections();
    } else if (ga4Error) {
      toast({ title: "GA4 connection failed", description: ga4Error, variant: "destructive" });
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

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

  const getConnection = (provider: string) => connections.find((c) => c.provider === provider);
  const windsorConn = getConnection("windsor");
  const ga4Conn = getConnection("ga4");

  const getStatus = (conn?: Connection): ConnectionStatus => {
    if (!conn) return "disconnected";
    if (conn.status === "active") return "connected";
    if (conn.status === "error") return "error";
    return "connected";
  };

  const handleConnectWindsor = () => {
    const redirectUrl = `${window.location.origin}/connections`;
    window.open(`${WINDSOR_OAUTH_URL}?redirect_uri=${encodeURIComponent(redirectUrl)}`, "_blank");
    setShowKeyInput(true);
  };

  const handleConnectGA4 = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch(
        `https://${PROJECT_ID}.supabase.co/functions/v1/ga4-auth`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ redirect_uri: `${window.location.origin}/connections` }),
        }
      );
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        toast({ title: "Error", description: json.error || "Failed to start GA4 auth", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to connect to GA4", variant: "destructive" });
    }
  };

  const handleSaveManualKey = () => {
    const key = manualKey.trim();
    if (!key) return;
    saveApiKey(key);
  };

  const comingSoonHandler = (name: string) => () =>
    toast({ title: "Coming soon", description: `${name} integration is on the roadmap.` });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const integrations: Integration[] = [
    {
      name: "Google Analytics 4",
      provider: "ga4",
      description: "Website traffic, conversions, and audience data via OAuth.",
      icon: BarChart3,
      iconColor: "text-orange-500",
      category: "Analytics",
      status: getStatus(ga4Conn),
      lastSync: ga4Conn?.updated_at || null,
      onConnect: handleConnectGA4,
    },
    {
      name: "Windsor.ai",
      provider: "windsor",
      description: "Unified API for 100+ marketing sources.",
      icon: Layers,
      iconColor: "text-violet-500",
      category: "Aggregator",
      status: getStatus(windsorConn),
      lastSync: windsorConn?.updated_at || null,
      onConnect: handleConnectWindsor,
    },
    {
      name: "Shopify",
      provider: "shopify",
      description: "Orders, revenue, products, and customer data.",
      icon: ShoppingBag,
      iconColor: "text-green-500",
      category: "E-commerce",
      status: "coming_soon",
      lastSync: null,
      onConnect: comingSoonHandler("Shopify"),
      comingSoon: true,
    },
    {
      name: "Meta Ads",
      provider: "meta",
      description: "Facebook & Instagram ad spend, impressions, and ROAS.",
      icon: Megaphone,
      iconColor: "text-blue-500",
      category: "Paid Ads",
      status: "coming_soon",
      lastSync: null,
      onConnect: comingSoonHandler("Meta Ads"),
      comingSoon: true,
    },
    {
      name: "Google Ads",
      provider: "google_ads",
      description: "Campaign performance, spend, and keyword data.",
      icon: SearchIcon,
      iconColor: "text-yellow-500",
      category: "Paid Ads",
      status: "coming_soon",
      lastSync: null,
      onConnect: comingSoonHandler("Google Ads"),
      comingSoon: true,
    },
    {
      name: "TikTok Ads",
      provider: "tiktok",
      description: "Ad performance, video views, and conversions.",
      icon: Video,
      iconColor: "text-pink-500",
      category: "Paid Ads",
      status: "coming_soon",
      lastSync: null,
      onConnect: comingSoonHandler("TikTok Ads"),
      comingSoon: true,
    },
    {
      name: "Klaviyo",
      provider: "klaviyo",
      description: "Email open rates, click rates, and revenue attribution.",
      icon: Mail,
      iconColor: "text-emerald-500",
      category: "Email",
      status: "coming_soon",
      lastSync: null,
      onConnect: comingSoonHandler("Klaviyo"),
      comingSoon: true,
    },
    {
      name: "HubSpot",
      provider: "hubspot",
      description: "CRM pipeline and marketing campaign performance.",
      icon: Users,
      iconColor: "text-orange-400",
      category: "CRM",
      status: "coming_soon",
      lastSync: null,
      onConnect: comingSoonHandler("HubSpot"),
      comingSoon: true,
    },
  ];

  const connectedCount = integrations.filter((i) => i.status === "connected").length;
  const categories = [...new Set(integrations.map((i) => i.category))];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border/50 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-sm font-semibold text-foreground tracking-tight">Connection Hub</h1>
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={signOut}>
          <LogOut className="h-3.5 w-3.5 mr-1.5" />
          Sign out
        </Button>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Connect your data</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Link your marketing platforms to generate AI-powered insights.
          </p>
          {/* Status summary */}
          <div className="flex items-center gap-4 pt-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">
                {connectedCount} connected
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              <span className="text-xs text-muted-foreground">
                {integrations.length - connectedCount} available
              </span>
            </div>
          </div>
        </div>

        {saving && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm font-medium text-primary">Saving your connection…</span>
          </div>
        )}

        {/* Grouped integrations */}
        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat} className="space-y-3">
              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.12em] px-1">
                {cat}
              </h3>
              <div className="space-y-2">
                {integrations
                  .filter((i) => i.category === cat)
                  .map((integration) => (
                    <IntegrationCard
                      key={integration.provider}
                      integration={integration}
                      showKeyInput={integration.provider === "windsor" && showKeyInput && integration.status !== "connected"}
                      manualKey={manualKey}
                      setManualKey={setManualKey}
                      onSaveKey={handleSaveManualKey}
                      saving={saving}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

/* ─── Status Indicator ─── */
function StatusBadge({ status }: { status: ConnectionStatus }) {
  const config: Record<ConnectionStatus, { icon: LucideIcon; label: string; dotClass: string; textClass: string; bgClass: string }> = {
    connected: {
      icon: CheckCircle2,
      label: "Connected",
      dotClass: "bg-green-500",
      textClass: "text-green-600 dark:text-green-400",
      bgClass: "bg-green-500/10",
    },
    syncing: {
      icon: RefreshCw,
      label: "Syncing…",
      dotClass: "bg-blue-500 animate-pulse",
      textClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-500/10",
    },
    error: {
      icon: AlertCircle,
      label: "Error",
      dotClass: "bg-red-500",
      textClass: "text-red-600 dark:text-red-400",
      bgClass: "bg-red-500/10",
    },
    disconnected: {
      icon: Circle,
      label: "Not connected",
      dotClass: "bg-muted-foreground/30",
      textClass: "text-muted-foreground",
      bgClass: "bg-muted/50",
    },
    coming_soon: {
      icon: Clock,
      label: "Coming soon",
      dotClass: "bg-muted-foreground/20",
      textClass: "text-muted-foreground",
      bgClass: "bg-muted/50",
    },
  };

  const c = config[status];
  const Icon = c.icon;

  return (
    <div className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full ${c.bgClass} ${c.textClass}`}>
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dotClass}`} />
      {c.label}
    </div>
  );
}

/* ─── Integration Card ─── */
function IntegrationCard({
  integration,
  showKeyInput,
  manualKey,
  setManualKey,
  onSaveKey,
  saving,
}: {
  integration: Integration;
  showKeyInput: boolean;
  manualKey: string;
  setManualKey: (v: string) => void;
  onSaveKey: () => void;
  saving: boolean;
}) {
  const Icon = integration.icon;
  const isActive = integration.status === "connected";
  const isComingSoon = integration.comingSoon;

  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 space-y-3 transition-all duration-200 ${
        isActive
          ? "border-green-500/20 bg-green-500/[0.03]"
          : isComingSoon
            ? "border-border/40 bg-card/50 opacity-70"
            : "border-border/60 bg-card hover:border-primary/20 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: icon + info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isActive ? "bg-green-500/10" : "bg-accent/80"
          }`}>
            <Icon className={`w-5 h-5 ${isActive ? "text-green-500" : integration.iconColor}`} />
          </div>
          <div className="min-w-0 space-y-1">
            <h4 className="text-sm font-semibold text-foreground truncate">{integration.name}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{integration.description}</p>
            {/* Last sync timestamp */}
            {integration.lastSync && isActive && (
              <div className="flex items-center gap-1 pt-0.5">
                <Clock className="w-3 h-3 text-muted-foreground/60" />
                <span className="text-[10px] text-muted-foreground/60">
                  Last synced {formatDistanceToNow(new Date(integration.lastSync), { addSuffix: true })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: status + action */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={integration.status} />
          {!isActive && !isComingSoon && (
            <Button
              variant="default"
              size="sm"
              className="h-7 px-3 text-[11px] font-semibold"
              onClick={integration.onConnect}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Connect
            </Button>
          )}
          {isActive && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground"
              onClick={integration.onConnect}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reconnect
            </Button>
          )}
        </div>
      </div>

      {/* Windsor manual key input */}
      {showKeyInput && (
        <div className="border-t border-border/40 pt-3 space-y-3">
          <p className="text-xs text-muted-foreground">
            Windsor.ai opened in a new tab. After completing setup, paste your API key below:
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={manualKey}
                onChange={(e) => setManualKey(e.target.value)}
                placeholder="Paste your Windsor.ai API key"
                className="pl-9 h-8 text-xs"
              />
            </div>
            <Button
              variant="default"
              size="sm"
              className="h-8 px-4 text-xs"
              onClick={onSaveKey}
              disabled={!manualKey.trim() || saving}
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground">
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
  );
}
