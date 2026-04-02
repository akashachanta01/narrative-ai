import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/* ─── Connector config ─── */
const CONNECTORS = [
  { id: "ga4", name: "GA4", full: "Google Analytics 4", mvp: true },
  { id: "shopify", name: "Shopify", full: "Shopify", mvp: true },
  { id: "stripe", name: "Stripe", full: "Stripe", mvp: true },
  { id: "meta", name: "Meta Ads", full: "Meta Ads", mvp: false },
  { id: "klaviyo", name: "Klaviyo", full: "Klaviyo", mvp: false },
  { id: "qb", name: "QuickBooks", full: "QuickBooks", mvp: false },
] as const;

type ConnectorId = (typeof CONNECTORS)[number]["id"];

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

/* ─── Verdict data ─── */
type VerdictKey =
  | "ga4+shopify+stripe+meta"
  | "ga4+shopify+stripe+klaviyo"
  | "ga4+shopify+stripe"
  | "ga4+shopify"
  | "ga4+stripe"
  | "shopify+stripe"
  | "ga4"
  | "shopify"
  | "stripe"
  | "none";

const VERDICTS: Record<VerdictKey, { head: string; body: string }> = {
  "ga4+shopify+stripe+meta": {
    head: 'Revenue up <strong>+12%</strong>, Meta ads at <strong>4.2x ROAS</strong> — but a <em>conversion drop</em> is actively costing ~$940/week.',
    body: "Your paid traffic is performing. The conversion drop is isolated to mobile checkout, not ad quality. Fix checkout first, then scale Instagram.",
  },
  "ga4+shopify+stripe+klaviyo": {
    head: 'Revenue up <strong>+12%</strong>, email drove <strong>31%</strong> of it — but a <em>conversion problem</em> is costing ~$940/week.',
    body: "Email is your highest revenue-per-session channel at $3.51. Fix mobile checkout first, then build a cart abandonment sequence.",
  },
  "ga4+shopify+stripe": {
    head: 'Revenue up <strong>+12%</strong> — but a <em>silent conversion problem</em> is actively costing ~$940/week. Fix that first.',
    body: "Traffic is up. People are landing. They're just not buying — it's a mobile checkout issue on iOS, not a product problem.",
  },
  "ga4+shopify": {
    head: 'Conversion rate is <strong>2.3%</strong>, down <em>22%</em> this week. You can see the full traffic-to-sale funnel.',
    body: "The drop happens at checkout on mobile — 290 started checkout, only 63 completed. Connect Stripe to put a dollar value on this.",
  },
  "ga4+stripe": {
    head: 'Revenue is <strong>$4,820</strong> and traffic is up <strong>18%</strong> — but you can\'t see which products are driving it.',
    body: "Instagram is your best revenue-per-session channel at $2.15. Add Shopify to close the loop on products.",
  },
  "shopify+stripe": {
    head: '<strong>$4,820</strong> across 63 orders — solid week. But you\'re flying blind on where buyers come from.',
    body: "The commercial picture is clear. Connect GA4 to understand which channel drives your best customers.",
  },
  ga4: {
    head: 'You have <strong>2,840 sessions</strong>, up <strong>+18%</strong>. But you have no idea what that traffic is worth.',
    body: "Traffic alone is a vanity metric. Connect Shopify to see what sells, or Stripe to see revenue.",
  },
  shopify: {
    head: '<strong>63 orders</strong> this week, avg $76. You know what\'s selling — but not where buyers come from.',
    body: "Product data is clear. Connect GA4 to see which channel drives your best customers.",
  },
  stripe: {
    head: '<strong>$4,820</strong> in revenue. Money is moving — but you can\'t see what\'s driving it.',
    body: "Payments are visible. Connect Shopify to see which products, or GA4 to see which channels.",
  },
  none: {
    head: "Connect your first source to get started.",
    body: "Start with GA4, Shopify, or Stripe. Each source alone unlocks insights. Together they give you the full picture.",
  },
};

function getVerdictKey(h: (id: ConnectorId) => boolean): VerdictKey {
  const G = h("ga4"), SH = h("shopify"), ST = h("stripe"), M = h("meta"), K = h("klaviyo");
  if (G && SH && ST && M) return "ga4+shopify+stripe+meta";
  if (G && SH && ST && K) return "ga4+shopify+stripe+klaviyo";
  if (G && SH && ST) return "ga4+shopify+stripe";
  if (G && SH) return "ga4+shopify";
  if (G && ST) return "ga4+stripe";
  if (SH && ST) return "shopify+stripe";
  if (G) return "ga4";
  if (SH) return "shopify";
  if (ST) return "stripe";
  return "none";
}

/* ─── Alert data ─── */
interface Alert {
  type: "crit" | "warn" | "info";
  badge: string;
  title: string;
  desc: string;
  step: string;
  condition: (h: (id: ConnectorId) => boolean) => boolean;
}

const ALERTS: Alert[] = [
  {
    type: "crit",
    badge: "ACT TODAY",
    title: "Mobile checkout broken for iOS users",
    desc: "Conversion fell 2.9%→2.3%. 73% of traffic is mobile. 3 carts abandoned at payment on iPhone Safari.",
    step: "Shopify Admin → Online Store → Themes → Preview on iPhone → test checkout with a $1 test product.",
    condition: (h) => h("ga4") && h("shopify"),
  },
  {
    type: "warn",
    badge: "THIS WEEK",
    title: "Linen Tote Bag sells out in ~4 days",
    desc: "4 units left. Selling ~1/day. Lead time 7–10 days — out of stock before restock arrives.",
    step: 'Reorder today, or enable "Continue selling when out of stock" with an honest delivery estimate.',
    condition: (h) => h("shopify"),
  },
  {
    type: "warn",
    badge: "HEADS UP",
    title: "Mobile bounce rate spiked to 61%",
    desc: "Desktop bounce is 28%, mobile is 61%. Something changed this week — slow load or broken element.",
    step: "Test your site on an actual iPhone. Check Google Search Console for mobile usability errors.",
    condition: (h) => h("ga4") && !h("shopify") && !h("stripe"),
  },
  {
    type: "warn",
    badge: "HEADS UP",
    title: "3 refunds this week — up from 0",
    desc: "$228 in refunds across 3 orders. Worth investigating before it becomes a pattern.",
    step: "Stripe Dashboard → Payments → Refunds → check which products are being returned and why.",
    condition: (h) => h("stripe") && !h("ga4") && !h("shopify"),
  },
  {
    type: "info",
    badge: "OPPORTUNITY",
    title: "Top Meta ad hitting daily budget cap",
    desc: '"Linen Collection – Instagram" has 4.2x ROAS but runs out of budget by 2pm. Estimated $320 in missed sales daily.',
    step: "Increase daily budget $50→$80 on this ad set only. Monitor CPA for 3 days before scaling further.",
    condition: (h) => h("meta"),
  },
  {
    type: "info",
    badge: "OPPORTUNITY",
    title: "Cart abandonment emails not configured",
    desc: "14 abandoned carts worth ~$680. A Klaviyo recovery flow recovers 15–25% automatically.",
    step: 'Klaviyo → Flows → Create from template → "Abandoned Cart" → publish in 10 minutes.',
    condition: (h) => h("klaviyo"),
  },
];

const ALERT_COLORS = {
  crit: { bg: "#160A0A", border: "rgba(255,77,77,0.17)", badge: T.red },
  warn: { bg: "#15110A", border: "rgba(245,166,35,0.17)", badge: T.amber },
  info: { bg: "#0D1520", border: "rgba(59,130,246,0.17)", badge: T.blue },
};

/* ─── KPI tile data ─── */
interface Tile {
  label: string;
  value: string;
  context: string;
  status: "up" | "dn" | "na";
}

function getTiles(h: (id: ConnectorId) => boolean): Tile[] {
  const G = h("ga4"), SH = h("shopify"), ST = h("stripe"), M = h("meta"), K = h("klaviyo"), QB = h("qb");

  let tiles: Tile[] = [];

  if (G && SH && ST) {
    tiles = [
      { label: "Revenue", value: "$4,820", context: "Best week in 6 weeks", status: "up" },
      { label: "Orders", value: "63", context: "+8 vs last week", status: "up" },
      { label: "Conv. rate", value: "2.3%", context: "-22% — needs fix", status: "dn" },
      { label: "Avg order", value: "$76", context: "Flat — no change", status: "na" },
    ];
    if (M) tiles[3] = { label: "Ad ROAS", value: "4.2x", context: "Above 3x target", status: "up" };
    if (K) tiles.push({ label: "Email rev.", value: "$1,490", context: "31% of total", status: "up" });
    if (QB) tiles.push({ label: "Net profit", value: "$1,230", context: "Margin: 25.5%", status: "up" });
  } else if (G && SH) {
    tiles = [
      { label: "Sessions", value: "2,840", context: "+18%", status: "up" },
      { label: "Orders", value: "63", context: "+8 vs last week", status: "up" },
      { label: "Conv. rate", value: "2.3%", context: "-22% — needs fix", status: "dn" },
      { label: "Checkout drop", value: "78%", context: "Mobile iOS issue", status: "dn" },
    ];
  } else if (G && ST) {
    tiles = [
      { label: "Revenue", value: "$4,820", context: "Best week in 6 weeks", status: "up" },
      { label: "Sessions", value: "2,840", context: "+18%", status: "up" },
      { label: "Rev/1k sessions", value: "$1,697", context: "Instagram: $2.15", status: "up" },
      { label: "Top channel", value: "Instagram", context: "Highest $/session", status: "na" },
    ];
  } else if (SH && ST) {
    tiles = [
      { label: "Revenue", value: "$4,820", context: "Best week in 6 weeks", status: "up" },
      { label: "Orders", value: "63", context: "+8 vs last week", status: "up" },
      { label: "Avg order", value: "$76", context: "Flat — no change", status: "na" },
      { label: "Refunds", value: "$228", context: "3 this week — watch", status: "dn" },
    ];
  } else if (G) {
    tiles = [
      { label: "Sessions", value: "2,840", context: "+18% vs last week", status: "up" },
      { label: "Bounce rate", value: "42%", context: "Mobile 61% — needs fix", status: "dn" },
      { label: "Avg duration", value: "2m 14s", context: "+8% engagement", status: "up" },
      { label: "Top source", value: "Instagram", context: "36% of sessions", status: "na" },
    ];
  } else if (SH) {
    tiles = [
      { label: "Orders", value: "63", context: "+8 vs last week", status: "up" },
      { label: "Avg order", value: "$76", context: "Flat vs last week", status: "na" },
      { label: "Top product", value: "Linen Tote", context: "16 orders", status: "up" },
      { label: "Stock risk", value: "1 item", context: "Linen Tote: 4 left", status: "dn" },
    ];
  } else if (ST) {
    tiles = [
      { label: "Revenue", value: "$4,820", context: "Best week in 6 weeks", status: "up" },
      { label: "Transactions", value: "63", context: "+8 vs last week", status: "up" },
      { label: "Avg transaction", value: "$76", context: "Stable", status: "na" },
      { label: "Refunds", value: "$228", context: "3 this week — watch", status: "dn" },
    ];
  }

  return tiles;
}

/* ─── Pulsing dot keyframes (injected once) ─── */
const PULSE_CSS = `
@keyframes dbPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
`;

/* ─── Main component ─── */
export default function DataBriefDashboard() {
  const [active, setActive] = useState<Record<ConnectorId, boolean>>({
    ga4: true,
    shopify: true,
    stripe: true,
    meta: false,
    klaviyo: false,
    qb: false,
  });

  const [toast, setToast] = useState<string | null>(null);

  const h = useCallback((id: ConnectorId) => active[id], [active]);
  const G = h("ga4"), SH = h("shopify"), ST = h("stripe"), M = h("meta"), K = h("klaviyo"), QB = h("qb");

  const anyActive = Object.values(active).some(Boolean);
  const activeSources = CONNECTORS.filter((c) => active[c.id]);

  /* Toast auto-hide */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (msg: string) => setToast(msg);

  const toggle = (id: ConnectorId) => {
    const next = !active[id];
    setActive((p) => ({ ...p, [id]: next }));
    const c = CONNECTORS.find((x) => x.id === id)!;
    showToast(next ? `✓ ${c.full} connected` : `${c.full} disconnected`);
  };

  const connectOne = (id: ConnectorId) => {
    if (active[id]) return;
    setActive((p) => ({ ...p, [id]: true }));
    const c = CONNECTORS.find((x) => x.id === id)!;
    showToast(`✓ ${c.full} connected — new insights unlocked`);
  };

  const connectAll = () => {
    const next: Record<string, boolean> = {};
    CONNECTORS.forEach((c) => (next[c.id] = true));
    setActive(next as Record<ConnectorId, boolean>);
    showToast("✓ All sources connected");
  };

  /* Verdict */
  const verdictKey = getVerdictKey(h);
  const verdict = VERDICTS[verdictKey];

  /* Alerts */
  const activeAlerts = ALERTS.filter((a) => a.condition(h));

  /* Tiles */
  const tiles = getTiles(h);
  const tileCols = Math.min(tiles.length, 4);

  /* Sections */
  const sections = useMemo(() => getSections(h, connectOne), [active]);

  return (
    <>
      <style>{PULSE_CSS}</style>
      <div
        style={{
          background: T.bg,
          color: T.textPrimary,
          fontFamily: T.font,
          minHeight: "100vh",
          maxWidth: "100%",
          margin: 0,
          padding: "0 24px 40px",
        }}
      >
        {/* ─ Top bar ─ */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: T.teal,
                animation: "dbPulse 2s ease-in-out infinite",
              }}
            />
            <span style={{ fontSize: 12, color: T.teal }}>DataBrief AI · your analytics analyst</span>
          </div>
          <span
            style={{
              fontSize: 11,
              color: T.textSecondary,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${T.borderSubtle}`,
              borderRadius: 20,
              padding: "4px 12px",
            }}
          >
            Synced 47 min ago
          </span>
        </div>

        {/* ─ Greeting ─ */}
        <div style={{ marginBottom: 6 }}>
          <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>
            Good morning, <span style={{ color: T.teal }}>Akash</span>.
          </h1>
          <p style={{ fontSize: 12, color: T.textSecondary, margin: "4px 0 0" }}>
            Monday, March 30 ·{" "}
            {anyActive
              ? `Analyzing ${activeSources.map((s) => s.name).join(", ")}`
              : "Connect a source to begin"}
          </p>
        </div>

        {/* ─ Toast ─ */}
        {toast && (
          <div
            style={{
              background: "#1A2F25",
              border: `1px solid rgba(0,212,170,0.25)`,
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: 12,
              color: T.teal,
              margin: "10px 0",
            }}
          >
            {toast}
          </div>
        )}

        {/* ─ Source pills ─ */}
        <div style={{ margin: "14px 0 0" }}>
          <span style={{ fontSize: 11, textTransform: "uppercase", color: T.textSecondary, letterSpacing: 0.5 }}>
            Sources — click to toggle
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {CONNECTORS.map((c) => {
              const on = active[c.id];
              return (
                <button
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: `1px solid ${on ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)"}`,
                    background: on ? "rgba(255,255,255,0.06)" : "transparent",
                    color: on ? T.textPrimary : "#555",
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: T.font,
                    transition: "all 0.15s",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: on ? T.teal : "#333",
                    }}
                  />
                  {c.name}
                </button>
              );
            })}
          </div>
          <div style={{ borderBottom: `1px solid ${T.borderDefault}`, margin: "14px 0" }} />
        </div>

        {/* ─ AI Verdict ─ */}
        <div
          style={{
            background: T.surfaceDeep,
            border: "1px solid rgba(0,212,170,0.13)",
            borderRadius: 12,
            padding: "16px 18px",
            marginBottom: 16,
          }}
        >
          <p
            style={{ fontSize: 15, fontWeight: 500, color: "#fff", lineHeight: 1.6, margin: 0 }}
            dangerouslySetInnerHTML={{
              __html: verdict.head
                .replace(/<strong>/g, `<strong style="color:${T.teal}">`)
                .replace(/<em>/g, `<em style="color:${T.red};font-style:normal">`),
            }}
          />
          <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.6, margin: "8px 0 10px" }}>
            {verdict.body}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {activeSources.map((s) => (
              <span
                key={s.id}
                style={{
                  fontSize: 10,
                  color: T.textSecondary,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${T.borderSubtle}`,
                  borderRadius: 10,
                  padding: "2px 8px",
                }}
              >
                {s.name}
              </span>
            ))}
            {anyActive && (
              <span
                style={{
                  fontSize: 10,
                  color: T.textMuted,
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${T.borderSubtle}`,
                  borderRadius: 10,
                  padding: "2px 8px",
                }}
              >
                Mar 23–30
              </span>
            )}
          </div>
        </div>

        {/* ─ Alerts ─ */}
        {activeAlerts.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: T.textSecondary, marginBottom: 8 }}>
              What needs your attention
            </p>
            {activeAlerts.map((a, i) => {
              const c = ALERT_COLORS[a.type];
              return (
                <div
                  key={i}
                  style={{
                    background: c.bg,
                    border: `1px solid ${c.border}`,
                    borderRadius: 10,
                    padding: "12px 14px",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      textTransform: "uppercase",
                      color: c.badge,
                      fontWeight: 600,
                      letterSpacing: 0.5,
                    }}
                  >
                    {a.badge}
                  </span>
                  <p style={{ fontSize: 13, color: "#fff", fontWeight: 500, margin: "4px 0 2px" }}>{a.title}</p>
                  <p style={{ fontSize: 12, color: T.textSecondary, margin: "0 0 8px", lineHeight: 1.5 }}>
                    {a.desc}
                  </p>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${T.borderSubtle}`,
                      borderRadius: 6,
                      padding: "8px 10px",
                      fontSize: 12,
                      color: "#9CA3AF",
                      lineHeight: 1.5,
                    }}
                  >
                    {a.step}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─ KPI Tiles ─ */}
        {tiles.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: T.textSecondary, marginBottom: 8 }}>The numbers</p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${tileCols}, 1fr)`,
                gap: 8,
              }}
            >
              {tiles.map((t, i) => (
                <div
                  key={i}
                  style={{
                    background: T.surface,
                    border: `1px solid ${T.borderSubtle}`,
                    borderRadius: 10,
                    padding: 14,
                  }}
                >
                  <span style={{ fontSize: 11, color: "#555" }}>{t.label}</span>
                  <p style={{ fontSize: 20, fontWeight: 500, margin: "4px 0 2px" }}>{t.value}</p>
                  <span
                    style={{
                      fontSize: 11,
                      color: t.status === "up" ? T.teal : t.status === "dn" ? T.red : T.textMuted,
                    }}
                  >
                    {t.context}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─ Dynamic sections ─ */}
        {anyActive ? (
          sections.map((s, i) => (
            <div key={i}>{s}</div>
          ))
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
            }}
          >
            <div style={{ fontSize: 48, opacity: 0.15, marginBottom: 12 }}>📊</div>
            <p style={{ fontSize: 14, color: "#555" }}>No sources connected</p>
            <p style={{ fontSize: 13, color: "#333" }}>
              Click any source above to see what DataBrief can tell you
            </p>
          </div>
        )}

        {/* ─ Footer ─ */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 20,
            paddingTop: 14,
            borderTop: `1px solid ${T.borderDefault}`,
          }}
        >
          <span style={{ fontSize: 12, color: "#333" }}>Next brief Monday, April 6</span>
          <button
            onClick={connectAll}
            style={{
              fontSize: 12,
              color: T.textSecondary,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${T.borderSubtle}`,
              borderRadius: 6,
              padding: "6px 14px",
              cursor: "pointer",
              fontFamily: T.font,
            }}
          >
            Connect all →
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   Section builders
   ═══════════════════════════════════════════════ */

function getSections(
  h: (id: ConnectorId) => boolean,
  connectOne: (id: ConnectorId) => void
): JSX.Element[] {
  const G = h("ga4"), SH = h("shopify"), ST = h("stripe"), M = h("meta"), K = h("klaviyo"), QB = h("qb");

  const sections: JSX.Element[] = [];

  const push = (el: JSX.Element) => sections.push(el);

  /* Decide order */
  if (G && SH && ST) {
    push(<FunnelSection key="funnel" />);
    push(<TrafficSection key="traffic" klaviyo={K} />);
    push(<ProductSection key="products" hasStripe={ST} hasMeta={M} />);
    push(<RevenueBreakdownSection key="revbreak" />);
    if (M) push(<MetaSection key="meta" active />);
    else push(<LockedCard key="meta-lock" id="meta" icon="📢" title="Connect Meta Ads to see ad ROI" body="Spending on ads but flying blind. See which campaigns drive revenue and which to cut." cta="Connect Meta Ads →" onConnect={connectOne} />);
    if (K) push(<EmailSection key="email" active />);
    else push(<LockedCard key="email-lock" id="klaviyo" icon="✉️" title="Connect Klaviyo to see email revenue" body="Email drives 20–40% of e-commerce revenue. Right now that attribution is invisible." cta="Connect Klaviyo →" onConnect={connectOne} />);
    if (QB) push(<ProfitSection key="profit" active />);
    else push(<LockedCard key="qb-lock" id="qb" icon="📒" title="Connect QuickBooks to see real profit" body="Revenue looks good. After COGS, shipping, and ad spend — what actually remains?" cta="Connect QuickBooks →" onConnect={connectOne} />);
  } else if (G && SH) {
    push(<FunnelSection key="funnel" />);
    push(<TrafficSection key="traffic" klaviyo={K} />);
    push(<DeviceSection key="device" />);
    push(<ProductSection key="products" hasStripe={false} hasMeta={M} />);
    push(<LockedCard key="stripe-lock" id="stripe" icon="💳" title="Connect Stripe to see revenue" body="You can see orders — but not the money. Add Stripe to see revenue per channel." cta="Connect Stripe →" onConnect={connectOne} />);
  } else if (G && ST) {
    push(<RevBySourceSection key="revsource" />);
    push(<TrafficSection key="traffic" klaviyo={K} />);
    push(<DeviceSection key="device" />);
    push(<RevenueBreakdownSection key="revbreak" />);
    push(<LockedCard key="shopify-lock" id="shopify" icon="🛍️" title="Connect Shopify to see products" body="You know which channels drive revenue — but not which products. Add Shopify." cta="Connect Shopify →" onConnect={connectOne} />);
  } else if (SH && ST) {
    push(<ProductSection key="products" hasStripe={true} hasMeta={M} />);
    push(<RevenueBreakdownSection key="revbreak" />);
    push(<LockedCard key="ga4-lock" id="ga4" icon="📈" title="Connect GA4 to see traffic sources" body="You know what sells — but not where buyers come from. Add GA4." cta="Connect GA4 →" onConnect={connectOne} />);
    if (M) push(<MetaSection key="meta" active />);
    if (K) push(<EmailSection key="email" active />);
    if (QB) push(<ProfitSection key="profit" active />);
  } else if (G) {
    push(<TrafficSection key="traffic" klaviyo={K} />);
    push(<DeviceSection key="device" />);
    push(<TopPagesSection key="pages" />);
    push(<LockedCard key="shopify-lock" id="shopify" icon="🛍️" title="Connect Shopify to see products" body="Traffic data alone is a vanity metric. See what sells." cta="Connect Shopify →" onConnect={connectOne} />);
    push(<LockedCard key="stripe-lock" id="stripe" icon="💳" title="Connect Stripe to see revenue" body="See the dollar value of your traffic." cta="Connect Stripe →" onConnect={connectOne} />);
  } else if (SH) {
    push(<ProductSection key="products" hasStripe={false} hasMeta={M} />);
    push(<LockedCard key="ga4-lock" id="ga4" icon="📈" title="Connect GA4 to see traffic" body="You know what sells — but not why." cta="Connect GA4 →" onConnect={connectOne} />);
    push(<LockedCard key="stripe-lock" id="stripe" icon="💳" title="Connect Stripe to see revenue" body="Add Stripe to see gross vs net revenue." cta="Connect Stripe →" onConnect={connectOne} />);
  } else if (ST) {
    push(<RevenueBreakdownSection key="revbreak" />);
    push(<LockedCard key="shopify-lock" id="shopify" icon="🛍️" title="Connect Shopify to see products" body="See which products drive revenue." cta="Connect Shopify →" onConnect={connectOne} />);
    push(<LockedCard key="ga4-lock" id="ga4" icon="📈" title="Connect GA4 to see traffic" body="See which channels bring your best customers." cta="Connect GA4 →" onConnect={connectOne} />);
  }

  return sections;
}

/* ─── Shared styles ─── */
const cardStyle: React.CSSProperties = {
  background: T.surface,
  border: `1px solid ${T.borderSubtle}`,
  borderRadius: 10,
  padding: 16,
  marginBottom: 12,
};

function SectionTitle({ title, tags }: { title: string; tags: string[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: "#888" }}>{title}</span>
      {tags.map((t) => (
        <span
          key={t}
          style={{
            fontSize: 11,
            color: "#333",
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${T.borderSubtle}`,
            borderRadius: 10,
            padding: "2px 8px",
          }}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function BarRow({
  label,
  pct,
  value,
  color = T.teal,
}: {
  label: string;
  pct: number;
  value: string;
  color?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
      <span style={{ fontSize: 12, color: T.textSecondary, width: 140, flexShrink: 0 }}>{label}</span>
      <div style={{ width: 80, height: 4, background: "rgba(255,255,255,0.03)", borderRadius: 3, flexShrink: 0 }}>
        <div style={{ width: `${pct}%`, height: 4, background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 12, color: T.textSecondary, width: 60, textAlign: "right", flexShrink: 0 }}>
        {value}
      </span>
    </div>
  );
}

function DataRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${T.borderSubtle}` }}>
      <span style={{ fontSize: 12, color: T.textSecondary }}>{label}</span>
      <span style={{ fontSize: 12, color: color || T.textPrimary }}>{value}</span>
    </div>
  );
}

/* ─── Section components ─── */

function TrafficSection({ klaviyo }: { klaviyo: boolean }) {
  return (
    <div style={cardStyle}>
      <SectionTitle title="Traffic sources" tags={["GA4"]} />
      <BarRow label="Instagram (paid)" pct={72} value="1,012" />
      <BarRow label="Organic search" pct={45} value="630" />
      <BarRow label="Direct" pct={28} value="398" />
      <BarRow label="Email" pct={klaviyo ? 22 : 8} value={klaviyo ? "312" : "114"} />
    </div>
  );
}

function DeviceSection() {
  return (
    <div style={cardStyle}>
      <SectionTitle title="Device breakdown" tags={["GA4"]} />
      <BarRow label="Mobile" pct={73} value="73%" color={T.red} />
      <BarRow label="Desktop" pct={22} value="22%" />
      <BarRow label="Tablet" pct={5} value="5%" color={T.textMuted} />
      <p style={{ fontSize: 11, color: T.textSecondary, marginTop: 4, marginBottom: 0 }}>
        Mobile bounce 61% vs desktop 28% — strong signal of a mobile experience issue
      </p>
    </div>
  );
}

function TopPagesSection() {
  return (
    <div style={cardStyle}>
      <SectionTitle title="Top pages by sessions" tags={["GA4"]} />
      <DataRow label="/products/linen-tote-bag" value="842" />
      <DataRow label="/collections/summer" value="610" />
      <DataRow label="/ (home)" value="580" />
      <DataRow label="/products/ceramic-mug-set" value="340" />
    </div>
  );
}

function FunnelSection() {
  return (
    <div style={cardStyle}>
      <SectionTitle title="Conversion funnel" tags={["GA4 + Shopify"]} />
      <BarRow label="Sessions" pct={100} value="2,840" />
      <BarRow label="Product views" pct={62} value="1,760" />
      <BarRow label="Add to cart" pct={18} value="510" />
      <BarRow label="Checkout started" pct={10} value="290" />
      <BarRow label="Orders completed" pct={7} value="63" color={T.teal} />
      <p style={{ fontSize: 11, color: T.textSecondary, marginTop: 4, marginBottom: 0 }}>
        78% drop from checkout started → completed. Mobile iOS is the culprit.
      </p>
    </div>
  );
}

function RevBySourceSection() {
  return (
    <div style={cardStyle}>
      <SectionTitle title="Revenue by traffic source" tags={["GA4 + Stripe"]} />
      <DataRow label="Instagram (paid)" value="$2,180 · $2.15/session" color={T.teal} />
      <DataRow label="Organic search" value="$1,420 · $2.25/session" color={T.teal} />
      <DataRow label="Direct" value="$820 · $2.06/session" />
      <DataRow label="Email" value="$400 · $3.51/session" />
    </div>
  );
}

function ProductSection({ hasStripe, hasMeta }: { hasStripe: boolean; hasMeta: boolean }) {
  const products = [
    {
      rank: 1,
      name: "Linen Tote Bag",
      why: hasMeta ? "Instagram ad drove 68% of sales" : "Top seller — 4 units left",
      value: hasStripe ? "$1,240" : "16 orders",
      delta: "+34%",
      deltaColor: T.teal,
    },
    {
      rank: 2,
      name: "Ceramic Mug Set",
      why: "Returning customers, no paid traffic",
      value: hasStripe ? "$860" : "11 orders",
      delta: "+18%",
      deltaColor: T.teal,
    },
    {
      rank: 3,
      name: "Wool Throw Blanket",
      why: "No promotion vs last week",
      value: hasStripe ? "$320" : "4 orders",
      delta: "-41%",
      deltaColor: T.red,
    },
  ];

  return (
    <div style={cardStyle}>
      <SectionTitle title="Product performance" tags={["Shopify"]} />
      {products.map((p) => (
        <div
          key={p.rank}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            padding: "8px 0",
            borderBottom: `1px solid ${T.borderSubtle}`,
          }}
        >
          <span style={{ fontSize: 14, color: T.textMuted, fontWeight: 500, width: 18 }}>{p.rank}</span>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, color: T.textPrimary, fontWeight: 500 }}>{p.name}</span>
            <br />
            <span style={{ fontSize: 11, color: T.textSecondary }}>{p.why}</span>
          </div>
          <span style={{ fontSize: 13, color: T.textPrimary, fontWeight: 500 }}>{p.value}</span>
          <span
            style={{
              fontSize: 11,
              color: p.deltaColor,
              background: p.deltaColor === T.teal ? "rgba(0,212,170,0.08)" : "rgba(255,107,107,0.08)",
              borderRadius: 4,
              padding: "2px 6px",
            }}
          >
            {p.delta}
          </span>
        </div>
      ))}
    </div>
  );
}

function RevenueBreakdownSection() {
  return (
    <div style={cardStyle}>
      <SectionTitle title="Revenue breakdown" tags={["Stripe"]} />
      <DataRow label="Gross revenue" value="$4,820" />
      <DataRow label="Refunds" value="-$228 (3 orders)" color={T.red} />
      <DataRow label="Net revenue" value="$4,592" color={T.teal} />
      <DataRow label="Avg transaction" value="$76.50" />
    </div>
  );
}

function MetaSection({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div style={cardStyle}>
      <SectionTitle title="Meta Ads performance" tags={["Meta Ads"]} />
      <DataRow label="Linen Collection – Instagram" value="4.2x ROAS · $840" color={T.teal} />
      <DataRow label="Retargeting – All visitors" value="3.1x ROAS · $310" color={T.teal} />
      <DataRow label="Lookalike – Email list" value="1.4x ROAS · pause?" color={T.red} />
    </div>
  );
}

function EmailSection({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div style={cardStyle}>
      <SectionTitle title="Email performance" tags={["Klaviyo"]} />
      <DataRow label="Welcome series" value="$480 · 4 orders" color={T.teal} />
      <DataRow label="Weekly newsletter" value="$620 · 8 orders" color={T.teal} />
      <DataRow label="Abandoned cart" value="Not set up — $680 at risk" color={T.textMuted} />
      <DataRow label="Open rate" value="38.4%" />
    </div>
  );
}

function ProfitSection({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div style={cardStyle}>
      <SectionTitle title="Profit & cash flow" tags={["QuickBooks"]} />
      <DataRow label="Gross revenue" value="$4,820" />
      <DataRow label="COGS + shipping" value="-$2,140" color={T.red} />
      <DataRow label="Ad spend" value="-$350" color={T.red} />
      <DataRow label="Net profit" value="$1,230 (25.5%)" color={T.teal} />
    </div>
  );
}

function LockedCard({
  id,
  icon,
  title,
  body,
  cta,
  onConnect,
}: {
  id: ConnectorId;
  icon: string;
  title: string;
  body: string;
  cta: string;
  onConnect: (id: ConnectorId) => void;
}) {
  return (
    <div
      style={{
        background: "#0D0F14",
        border: "1px dashed rgba(255,255,255,0.06)",
        borderRadius: 10,
        padding: "20px 16px",
        textAlign: "center",
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 32, opacity: 0.3, marginBottom: 8 }}>{icon}</div>
      <p style={{ fontSize: 13, fontWeight: 500, color: "#555", margin: "0 0 4px" }}>{title}</p>
      <p style={{ fontSize: 12, color: "#3A3F4B", lineHeight: 1.5, margin: "0 0 12px" }}>{body}</p>
      <button
        onClick={() => onConnect(id)}
        style={{
          fontSize: 12,
          color: T.teal,
          background: "rgba(0,212,170,0.06)",
          border: "1px solid rgba(0,212,170,0.2)",
          padding: "6px 16px",
          borderRadius: 6,
          cursor: "pointer",
          fontFamily: T.font,
        }}
      >
        {cta}
      </button>
    </div>
  );
}
