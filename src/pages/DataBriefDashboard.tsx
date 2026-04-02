import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/* ─── Types ─── */
interface BriefVerdict {
  headline: string;
  body: string;
}

interface BriefAlert {
  type: "critical" | "warning" | "opportunity";
  badge: string;
  title: string;
  description: string;
  action: string;
}

interface BriefKPI {
  label: string;
  value: string;
  context: string;
  status: "up" | "down" | "neutral";
}

interface SourceData {
  name: string;
  revenue: number;
  spend: number;
  clicks: number;
  sessions: number;
  conversions: number;
}

interface DateData {
  date: string;
  revenue: number;
  sessions: number;
  conversions: number;
}

interface DashboardSummary {
  totalSpend: number;
  totalRevenue: number;
  totalClicks: number;
  totalSessions: number;
  totalConversions: number;
  roas: number;
  conversionRate: number;
  avgOrderValue: number;
  bySource: SourceData[];
  byDate: DateData[];
}

interface DashboardBrief {
  verdict: BriefVerdict;
  alerts: BriefAlert[];
  kpis: BriefKPI[];
  sourceBreakdown: string;
}

interface DashboardResponse {
  brief: DashboardBrief | null;
  connectedSources: string[];
  summary?: DashboardSummary;
  message?: string;
}

/* ─── Design tokens ─── */
const T = {
  bg: "#0A0D12",
  surface: "#111520",
  surfaceDeep: "#0E1A16",
  borderDefault: "rgba(255,255,255,0.06)",
  borderSubtle: "rgba(255,255,255,0.04)",
  textPrimary: "#E8EAF0",
  textSecondary: "#6B7280",
  textMuted: "#444444",
  teal: "#00D4AA",
  red: "#FF6B6B",
  amber: "#F5A623",
  blue: "#60A5FA",
  font: "system-ui, sans-serif",
} as const;

const ALERT_COLORS = {
  critical: { bg: "#160A0A", border: "rgba(255,77,77,0.17)", badge: T.red },
  warning: { bg: "#15110A", border: "rgba(245,166,35,0.17)", badge: T.amber },
  opportunity: { bg: "#0D1520", border: "rgba(59,130,246,0.17)", badge: T.blue },
};

const PULSE_CSS = `@keyframes dbPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`;

/* ─── Main ─── */
export default function DataBriefDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrief = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data: fnData, error: fnError } = await supabase.functions.invoke("dashboard-brief", {
        body: {},
      });
      if (fnError) throw fnError;
      setData(fnData as DashboardResponse);
    } catch (e: any) {
      console.error("Dashboard brief error:", e);
      setError(e?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }
    fetchBrief();
  }, [user, authLoading, navigate, fetchBrief]);

  if (authLoading || loading) {
    return (
      <div style={{ background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.teal, margin: "0 auto 12px", animation: "dbPulse 1.5s ease-in-out infinite" }} />
          <style>{PULSE_CSS}</style>
          <div style={{ color: T.textSecondary, fontSize: 13, fontFamily: T.font }}>Analyzing your data…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.font }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 48, opacity: 0.15, marginBottom: 12 }}>⚠️</div>
          <p style={{ fontSize: 14, color: T.red, marginBottom: 8 }}>{error}</p>
          <button onClick={fetchBrief} style={{ fontSize: 12, color: T.teal, background: "rgba(0,212,170,0.08)", border: `1px solid rgba(0,212,170,0.2)`, borderRadius: 6, padding: "8px 20px", cursor: "pointer", fontFamily: T.font }}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  const noSources = !data || data.connectedSources.length === 0;
  const brief = data?.brief;
  const summary = data?.summary;

  if (noSources) {
    return (
      <div style={{ background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.font }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 48, opacity: 0.15, marginBottom: 12 }}>📊</div>
          <p style={{ fontSize: 16, color: T.textPrimary, fontWeight: 500, marginBottom: 4 }}>No sources connected</p>
          <p style={{ fontSize: 13, color: T.textSecondary, marginBottom: 16 }}>Connect your marketing platforms via Windsor.ai to see your AI-powered brief.</p>
          <button onClick={() => navigate("/connections")} style={{ fontSize: 13, color: T.teal, background: "rgba(0,212,170,0.08)", border: `1px solid rgba(0,212,170,0.2)`, borderRadius: 8, padding: "10px 24px", cursor: "pointer", fontFamily: T.font }}>
            Go to Connections →
          </button>
        </div>
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <>
      <style>{PULSE_CSS}</style>
      <div style={{ background: T.bg, color: T.textPrimary, fontFamily: T.font, minHeight: "100vh", maxWidth: "100%", margin: 0, padding: "0 24px 40px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.teal, animation: "dbPulse 2s ease-in-out infinite" }} />
            <span style={{ fontSize: 12, color: T.teal }}>DataBrief AI · your analytics analyst</span>
          </div>
          <span style={{ fontSize: 11, color: T.textSecondary, background: "rgba(255,255,255,0.03)", border: `1px solid ${T.borderSubtle}`, borderRadius: 20, padding: "4px 12px" }}>
            Just now
          </span>
        </div>

        {/* Greeting */}
        <div style={{ marginBottom: 6 }}>
          <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>
            {greeting}, <span style={{ color: T.teal }}>{userName}</span>.
          </h1>
          <p style={{ fontSize: 12, color: T.textSecondary, margin: "4px 0 0" }}>
            {dateStr} · Analyzing {data!.connectedSources.join(", ")}
          </p>
        </div>

        {/* Message if data but no AI brief */}
        {data?.message && !brief && (
          <div style={{ background: "#15110A", border: "1px solid rgba(245,166,35,0.17)", borderRadius: 10, padding: "12px 14px", margin: "14px 0" }}>
            <span style={{ fontSize: 10, textTransform: "uppercase", color: T.amber, fontWeight: 600, letterSpacing: 0.5 }}>NOTE</span>
            <p style={{ fontSize: 13, color: T.textPrimary, margin: "4px 0 0" }}>{data.message}</p>
          </div>
        )}

        {/* AI Verdict */}
        {brief?.verdict && (
          <div style={{ background: T.surfaceDeep, border: "1px solid rgba(0,212,170,0.13)", borderRadius: 12, padding: "16px 18px", margin: "14px 0 16px" }}>
            <p style={{ fontSize: 15, fontWeight: 500, color: "#fff", lineHeight: 1.6, margin: 0 }}>
              {brief.verdict.headline}
            </p>
            <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.6, margin: "8px 0 10px" }}>
              {brief.verdict.body}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {data!.connectedSources.map(s => (
                <span key={s} style={{ fontSize: 10, color: T.textSecondary, background: "rgba(255,255,255,0.04)", border: `1px solid ${T.borderSubtle}`, borderRadius: 10, padding: "2px 8px" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Alerts */}
        {brief?.alerts && brief.alerts.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: T.textSecondary, marginBottom: 8 }}>What needs your attention</p>
            {brief.alerts.map((a, i) => {
              const c = ALERT_COLORS[a.type] || ALERT_COLORS.warning;
              return (
                <div key={i} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
                  <span style={{ fontSize: 10, textTransform: "uppercase", color: c.badge, fontWeight: 600, letterSpacing: 0.5 }}>{a.badge}</span>
                  <p style={{ fontSize: 13, color: "#fff", fontWeight: 500, margin: "4px 0 2px" }}>{a.title}</p>
                  <p style={{ fontSize: 12, color: T.textSecondary, margin: "0 0 8px", lineHeight: 1.5 }}>{a.description}</p>
                  <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${T.borderSubtle}`, borderRadius: 6, padding: "8px 10px", fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>
                    {a.action}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* KPI Tiles */}
        {brief?.kpis && brief.kpis.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: T.textSecondary, marginBottom: 8 }}>The numbers</p>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(brief.kpis.length, 4)}, 1fr)`, gap: 8 }}>
              {brief.kpis.map((kpi, i) => (
                <div key={i} style={{ background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 10, padding: 14 }}>
                  <span style={{ fontSize: 11, color: "#555" }}>{kpi.label}</span>
                  <p style={{ fontSize: 20, fontWeight: 500, margin: "4px 0 2px" }}>{kpi.value}</p>
                  <span style={{ fontSize: 11, color: kpi.status === "up" ? T.teal : kpi.status === "down" ? T.red : T.textMuted }}>
                    {kpi.context}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Raw data sections when we have summary */}
        {summary && summary.bySource.length > 0 && (
          <>
            {/* Source breakdown */}
            <div style={{ background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 10, padding: 16, marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#888", marginBottom: 12 }}>Revenue by source</p>
              {brief?.sourceBreakdown && (
                <p style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.6, marginBottom: 12 }}>{brief.sourceBreakdown}</p>
              )}
              {summary.bySource.slice(0, 8).map((src) => {
                const maxRev = summary.bySource[0]?.revenue || 1;
                const pct = Math.round((src.revenue / maxRev) * 100);
                return (
                  <div key={src.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: T.textSecondary, width: 160, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{src.name}</span>
                    <div style={{ width: 80, height: 4, background: "rgba(255,255,255,0.03)", borderRadius: 3, flexShrink: 0 }}>
                      <div style={{ width: `${pct}%`, height: 4, background: T.teal, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 12, color: T.textSecondary, width: 80, textAlign: "right", flexShrink: 0 }}>
                      ${src.revenue.toFixed(0)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Summary stats */}
            <div style={{ background: T.surface, border: `1px solid ${T.borderSubtle}`, borderRadius: 10, padding: 16, marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#888", marginBottom: 12 }}>Data summary</p>
              <DataRow label="Total Revenue" value={`$${summary.totalRevenue.toLocaleString()}`} color={T.teal} />
              <DataRow label="Total Spend" value={`$${summary.totalSpend.toLocaleString()}`} />
              <DataRow label="ROAS" value={`${summary.roas}x`} color={summary.roas >= 3 ? T.teal : summary.roas >= 1 ? T.amber : T.red} />
              <DataRow label="Sessions" value={summary.totalSessions.toLocaleString()} />
              <DataRow label="Conversions" value={summary.totalConversions.toLocaleString()} />
              <DataRow label="Conversion Rate" value={`${summary.conversionRate}%`} color={summary.conversionRate >= 3 ? T.teal : T.textPrimary} />
              <DataRow label="Avg Order Value" value={`$${summary.avgOrderValue.toFixed(2)}`} />
            </div>
          </>
        )}

        {/* No data fallback with summary */}
        {(!summary || summary.bySource.length === 0) && !brief && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 48, opacity: 0.15, marginBottom: 12 }}>📊</div>
            <p style={{ fontSize: 14, color: "#555" }}>
              Your sources are connected but no data is available yet.
            </p>
            <p style={{ fontSize: 13, color: "#333", marginBottom: 16 }}>
              Make sure your Windsor.ai account has data sources configured and synced.
            </p>
            <button onClick={() => navigate("/connections")} style={{ fontSize: 12, color: T.teal, background: "rgba(0,212,170,0.06)", border: `1px solid rgba(0,212,170,0.2)`, borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontFamily: T.font }}>
              Manage connections →
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, paddingTop: 14, borderTop: `1px solid ${T.borderDefault}` }}>
          <button onClick={fetchBrief} style={{ fontSize: 12, color: T.textSecondary, background: "rgba(255,255,255,0.03)", border: `1px solid ${T.borderSubtle}`, borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontFamily: T.font }}>
            ↻ Refresh brief
          </button>
          <button onClick={() => navigate("/connections")} style={{ fontSize: 12, color: T.textSecondary, background: "rgba(255,255,255,0.03)", border: `1px solid ${T.borderSubtle}`, borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontFamily: T.font }}>
            Manage connections →
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Shared components ─── */
function DataRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
      <span style={{ fontSize: 12, color: "#6B7280" }}>{label}</span>
      <span style={{ fontSize: 12, color: color || "#E8EAF0" }}>{value}</span>
    </div>
  );
}
