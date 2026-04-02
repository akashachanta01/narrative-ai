import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Eye,
  EyeOff,
  ExternalLink,
  KeyRound,
  Layers,
  Loader2,
  LogOut,
  ShoppingBag,
  Trash2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";



/* ─── Types ─── */
type CardState = "idle" | "windsor" | "saving" | "connected" | "error";

interface ConnectionRow {
  id: string;
  provider: string;
  status: string;
  method: string | null;
  api_key: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

interface SourceConfig {
  id: string;
  name: string;
  icon: typeof BarChart3;
  iconColor: string;
  description: string;
}

const SOURCES: SourceConfig[] = [
  { id: "ga4", name: "Google Analytics 4", icon: BarChart3, iconColor: "text-orange-500", description: "Website traffic, conversions, and audience insights." },
  { id: "shopify", name: "Shopify", icon: ShoppingBag, iconColor: "text-green-500", description: "Orders, products, revenue, and customer data." },
  { id: "stripe", name: "Stripe", icon: CreditCard, iconColor: "text-indigo-500", description: "Payments, revenue, subscriptions, and refunds." },
];

const COMING_SOON = ["Meta Ads", "Klaviyo", "QuickBooks", "TikTok Ads"];

/* ─── Main Page ─── */
export default function Connections() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rows, setRows] = useState<ConnectionRow[]>([]);
  const [loadingRows, setLoadingRows] = useState(true);
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const fetchRows = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("user_connections")
      .select("*")
      .eq("user_id", user.id);
    if (data) setRows(data as unknown as ConnectionRow[]);
    setLoadingRows(false);
  }, [user]);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  // Handle GA4 OAuth callback
  useEffect(() => {
    const ga4Connected = searchParams.get("ga4_connected");
    const ga4Error = searchParams.get("ga4_error");
    if (ga4Connected === "true") {
      toast({ title: "Google Analytics connected!", description: "Data will appear on your dashboard." });
      setSearchParams({});
      fetchRows();
    } else if (ga4Error) {
      toast({ title: "GA4 connection failed", description: ga4Error, variant: "destructive" });
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, fetchRows]);

  const getRow = (source: string) => rows.find(r => r.provider === source);
  const getWindsorKey = () => {
    const windsorRow = rows.find(r => r.method === "windsor" && r.api_key);
    return windsorRow?.api_key || "";
  };

  const resolveState = (source: string): CardState => {
    if (cardStates[source]) return cardStates[source];
    const row = getRow(source);
    if (row && (row.status === "active" || row.status === "connected")) return "connected";
    if (row && row.status === "error") return "error";
    return "idle";
  };

  const setState = (source: string, state: CardState) =>
    setCardStates(prev => ({ ...prev, [source]: state }));

  const setError = (source: string, msg: string) =>
    setErrors(prev => ({ ...prev, [source]: msg }));

  const handleDisconnect = async (source: string) => {
    if (!user) return;
    await supabase.from("user_connections").delete().eq("user_id", user.id).eq("provider", source);
    setCardStates(prev => ({ ...prev, [source]: "idle" }));
    setErrors(prev => { const n = { ...prev }; delete n[source]; return n; });
    toast({ title: "Disconnected", description: `${SOURCES.find(s => s.id === source)?.name} removed.` });
    fetchRows();
  };

  const handleUpsert = async (
    source: string,
    method: string,
    apiKey: string,
    metadata: Record<string, unknown>
  ) => {
    if (!user) return false;
    setState(source, "saving");
    const { error } = await supabase.from("user_connections").upsert(
      {
        user_id: user.id,
        provider: source,
        api_key: apiKey || "",
        method,
        status: "active",
        metadata: metadata as any,
      } as any,
      { onConflict: "user_id,provider" }
    );
    if (error) {
      setState(source, "error");
      setError(source, error.message);
      return false;
    }
    setState(source, "connected");
    fetchRows();
    return true;
  };


  const allConnected = SOURCES.every(s => resolveState(s.id) === "connected");

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-sm font-semibold text-foreground tracking-tight">Connections</h1>
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={signOut}>
          <LogOut className="h-3.5 w-3.5 mr-1.5" />
          Sign out
        </Button>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        {/* All connected banner */}
        {allConnected && (
          <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                All sources connected — you're ready to go
              </span>
            </div>
            <Button size="sm" className="h-7 text-xs" onClick={() => navigate("/dashboard")}>
              Go to dashboard <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Connect your data</h2>
          <p className="text-sm text-muted-foreground">
            Link your sources to generate AI-powered insights via Windsor.ai.
          </p>
        </div>

        {/* Source cards */}
        <div className="space-y-3">
          {loadingRows ? (
            SOURCES.map(s => (
              <div key={s.id} className="rounded-xl border border-border/60 bg-card p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-7 w-20 rounded-md" />
                </div>
              </div>
            ))
          ) : (
            SOURCES.map(s => (
              <SourceCard
                key={s.id}
                source={s}
                state={resolveState(s.id)}
                row={getRow(s.id)}
                existingWindsorKey={getWindsorKey()}
                errorMsg={errors[s.id]}
                onSetState={(st) => setState(s.id, st)}
                onDisconnect={() => handleDisconnect(s.id)}
                onUpsert={(method, key, meta) => handleUpsert(s.id, method, key, meta)}
                onGA4OAuth={handleGA4OAuth}
              />
            ))
          )}
        </div>

        {/* Coming soon */}
        <div className="space-y-3 pt-4">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            More connectors coming soon
          </p>
          <div className="flex flex-wrap gap-2">
            {COMING_SOON.map(name => (
              <span key={name} className="text-xs text-muted-foreground/60 bg-muted/40 border border-border/30 px-3 py-1.5 rounded-full">
                {name}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─── Source Card ─── */
function SourceCard({
  source,
  state,
  row,
  existingWindsorKey,
  errorMsg,
  onSetState,
  onDisconnect,
  onUpsert,
  onGA4OAuth,
}: {
  source: SourceConfig;
  state: CardState;
  row?: ConnectionRow;
  existingWindsorKey: string;
  errorMsg?: string;
  onSetState: (s: CardState) => void;
  onDisconnect: () => void;
  onUpsert: (method: string, key: string, meta: Record<string, unknown>) => Promise<boolean>;
  onGA4OAuth: () => void;
}) {
  const Icon = source.icon;
  const isConnected = state === "connected";

  return (
    <div className={`rounded-xl border p-4 sm:p-5 transition-all duration-200 ${
      isConnected
        ? "border-green-500/20 bg-green-500/[0.03]"
        : state === "error"
          ? "border-red-500/20 bg-red-500/[0.02]"
          : "border-border/60 bg-card"
    }`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isConnected ? "bg-green-500/10" : "bg-accent/80"
          }`}>
            <Icon className={`w-5 h-5 ${isConnected ? "text-green-500" : source.iconColor}`} />
          </div>
          <div className="min-w-0 space-y-0.5">
            <h4 className="text-sm font-semibold text-foreground">{source.name}</h4>
            <p className="text-xs text-muted-foreground">{source.description}</p>
            {isConnected && row && (
              <p className="text-[10px] text-muted-foreground/60 pt-0.5">
                Connected via {row.method === "windsor" ? "Windsor.ai" : "direct"} · {new Date(row.updated_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isConnected && (
            <>
              <span className="flex items-center gap-1 text-[11px] font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Connected
              </span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px] text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove {source.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will stop it showing in your dashboard. You can reconnect at any time.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDisconnect} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Disconnect
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          {state === "idle" && (
          <Button variant="default" size="sm" className="h-7 px-3 text-[11px] font-semibold" onClick={() => onSetState("windsor")}>
              Connect
            </Button>
          )}
          {state === "saving" && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
            </div>
          )}
        </div>
      </div>

      {/* Error state */}
      {state === "error" && errorMsg && (
        <div className="mt-3 rounded-lg bg-red-500/5 border border-red-500/15 p-3 space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-600 dark:text-red-400">{errorMsg}</p>
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => onSetState("windsor")}>
            <RefreshCw className="h-3 w-3 mr-1" /> Retry
          </Button>
        </div>
      )}


      {/* Windsor form */}
      {state === "windsor" && (
        <WindsorForm
          sourceName={source.name}
          sourceId={source.id}
          existingKey={existingWindsorKey}
          onSave={async (key) => {
            const ok = await onUpsert("windsor", key, {});
            if (ok) toast({ title: `${source.name} connected via Windsor!`, description: "Data is now flowing." });
          }}
        onCancel={() => onSetState("idle")}
          onError={(msg) => { onSetState("error"); }}
        />
      )}
    </div>
  );
}

/* ─── GA4 Direct Form ─── */
function GA4DirectForm({ onSave, onCancel }: { onSave: (id: string) => void; onCancel: () => void }) {
  const [propertyId, setPropertyId] = useState("");
  return (
    <div className="mt-4 border-t border-border/40 pt-4 space-y-3">
      <p className="text-xs font-medium text-foreground">Enter your GA4 Property ID</p>
      <Input
        value={propertyId}
        onChange={e => setPropertyId(e.target.value)}
        placeholder="G-XXXXXXXXXX or 123456789"
        className="h-9 text-xs"
      />
      <p className="text-[10px] text-muted-foreground">GA4 → Admin → Property Settings → Property ID</p>
      <div className="flex gap-2">
        <Button size="sm" className="h-8 text-xs" onClick={() => onSave(propertyId.trim())} disabled={!propertyId.trim()}>
          <CheckCircle2 className="h-3 w-3 mr-1" /> Save
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

/* ─── Shopify Direct Form ─── */
function ShopifyDirectForm({ onSave, onCancel }: { onSave: (domain: string, token: string) => void; onCancel: () => void }) {
  const [domain, setDomain] = useState("");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="mt-4 border-t border-border/40 pt-4 space-y-3">
      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground">Store URL</label>
        <Input value={domain} onChange={e => setDomain(e.target.value)} placeholder="yourstore.myshopify.com" className="h-9 text-xs" />
        <p className="text-[10px] text-muted-foreground">Just the subdomain — no https://</p>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground">Admin API access token</label>
        <div className="relative">
          <Input
            type={showToken ? "text" : "password"}
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="shpat_xxxxxxxxxxxx"
            className="h-9 text-xs pr-9"
          />
          <button onClick={() => setShowToken(!showToken)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showToken ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <button onClick={() => setShowHelp(!showHelp)} className="text-[11px] text-primary flex items-center gap-1">
        How to get your access token {showHelp ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {showHelp && (
        <ol className="text-[11px] text-muted-foreground space-y-1.5 pl-4 list-decimal">
          <li>Shopify Admin → Settings → Apps and sales channels</li>
          <li>Click "Develop apps" → "Create an app"</li>
          <li>Name it "DataBrief" → Configure Admin API scopes</li>
          <li>Enable: <span className="font-mono text-[10px]">read_orders, read_products, read_inventory, read_customers</span></li>
          <li>Click "Install app" → copy the access token</li>
        </ol>
      )}

      <div className="flex gap-2">
        <Button size="sm" className="h-8 text-xs" onClick={() => onSave(domain.trim(), token.trim())} disabled={!domain.trim() || !token.trim()}>
          <CheckCircle2 className="h-3 w-3 mr-1" /> Save
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

/* ─── Stripe Direct Form ─── */
function StripeDirectForm({ onSave, onCancel }: { onSave: (key: string) => void; onCancel: () => void }) {
  const [key, setKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="mt-4 border-t border-border/40 pt-4 space-y-3">
      <div className="rounded-lg bg-amber-500/5 border border-amber-500/15 p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-600 dark:text-amber-400">
            Use a restricted key — never your secret key. This gives DataBrief read-only access only.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-foreground">Restricted API key</label>
        <div className="relative">
          <Input
            type={showKey ? "text" : "password"}
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="rk_live_xxxxxxxxxxxx"
            className="h-9 text-xs pr-9"
          />
          <button onClick={() => setShowKey(!showKey)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <button onClick={() => setShowHelp(!showHelp)} className="text-[11px] text-primary flex items-center gap-1">
        How to create a restricted key {showHelp ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {showHelp && (
        <ol className="text-[11px] text-muted-foreground space-y-1.5 pl-4 list-decimal">
          <li>Stripe Dashboard → Developers → API keys</li>
          <li>Click "Create restricted key"</li>
          <li>Name it "DataBrief read-only"</li>
          <li>Enable READ permissions for: Balance, Charges, Customers, Refunds</li>
          <li>Click "Create key" and copy it here</li>
        </ol>
      )}

      <div className="flex gap-2">
        <Button size="sm" className="h-8 text-xs" onClick={() => onSave(key.trim())} disabled={!key.trim()}>
          <CheckCircle2 className="h-3 w-3 mr-1" /> Save
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

/* ─── Windsor Form ─── */
function WindsorForm({
  sourceName,
  sourceId,
  existingKey,
  onSave,
  onCancel,
  onError,
}: {
  sourceName: string;
  sourceId: string;
  existingKey: string;
  onSave: (key: string) => void;
  onCancel: () => void;
  onError: (msg: string) => void;
}) {
  const [key, setKey] = useState(existingKey);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const hasExisting = !!existingKey;

  const maskedKey = existingKey ? `••••${existingKey.slice(-4)}` : "";

  const handleTest = async () => {
    const trimmed = key.trim();
    if (!trimmed) return;
    setTesting(true);
    try {
      const { error } = await supabase.functions.invoke("windsor-data", {
        body: { source: sourceId, apiKey: trimmed },
      });

      if (error) throw error;

      onSave(trimmed);
    } catch {
      onError(`Could not connect ${sourceName} via Windsor. Check your API key.`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="mt-4 border-t border-border/40 pt-4 space-y-3">
      <div className="flex items-center gap-1.5">
        <Layers className="h-3 w-3 text-violet-500" />
        <p className="text-xs font-medium text-foreground">Windsor.ai API key</p>
      </div>

      {hasExisting && (
        <p className="text-[10px] text-green-600 dark:text-green-400">Using your saved Windsor key ({maskedKey})</p>
      )}

      <div className="relative">
        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          type={showKey ? "text" : "password"}
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="Paste your Windsor.ai API key"
          className="h-9 text-xs pl-9 pr-9"
        />
        <button onClick={() => setShowKey(!showKey)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
      </div>

      <p className="text-[10px] text-muted-foreground">
        Get your key at{" "}
        <a href="https://onboard.windsor.ai/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
          windsor.ai
        </a>{" "}
        → Account Settings → API Keys
      </p>

      <div className="flex gap-2">
        <Button size="sm" className="h-8 text-xs" onClick={handleTest} disabled={!key.trim() || testing}>
          {testing ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <CheckCircle2 className="h-3 w-3 mr-1" />}
          {hasExisting ? "Confirm & save" : "Test & save"}
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
