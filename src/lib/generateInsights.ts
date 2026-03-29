import { TrendingUp, TrendingDown, Globe, Eye, BarChart3, Zap, DollarSign, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { WindsorSummary, WindsorDataRow } from "@/lib/windsorTypes";

export interface DynamicInsight {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  metric: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
  narrative: string;
  source: string;
  sparkline: number[];
}

export function generateInsights(summary: WindsorSummary): DynamicInsight[] {
  const insights: DynamicInsight[] = [];
  const rows = summary.rows;
  if (!rows.length) return insights;

  const dates = [...new Set(rows.map((r) => r.date))].sort();
  const mid = Math.ceil(dates.length / 2);
  const firstHalf = dates.slice(0, mid);
  const secondHalf = dates.slice(mid);

  // Helpers
  function dailyFor(field: keyof WindsorDataRow, filterFn?: (r: WindsorDataRow) => boolean) {
    return dates.map((d) =>
      rows.filter((r) => r.date === d && (!filterFn || filterFn(r))).reduce((s, r) => s + (Number(r[field]) || 0), 0)
    );
  }
  function halfSum(half: string[], field: keyof WindsorDataRow) {
    return rows.filter((r) => half.includes(r.date)).reduce((s, r) => s + (Number(r[field]) || 0), 0);
  }
  function pctChange(field: keyof WindsorDataRow) {
    const a = halfSum(firstHalf, field);
    const b = halfSum(secondHalf, field);
    return a > 0 ? Math.round(((b - a) / a) * 100) : 0;
  }

  // Source-level aggregation
  const bySource: Record<string, { sessions: number; clicks: number; spend: number; revenue: number; conversions: number }> = {};
  for (const r of rows) {
    if (!bySource[r.source]) bySource[r.source] = { sessions: 0, clicks: 0, spend: 0, revenue: 0, conversions: 0 };
    bySource[r.source].sessions += r.sessions || 0;
    bySource[r.source].clicks += r.clicks || 0;
    bySource[r.source].spend += r.spend || 0;
    bySource[r.source].revenue += r.revenue || 0;
    bySource[r.source].conversions += r.conversions || 0;
  }
  const sources = Object.entries(bySource).map(([name, v]) => ({
    name,
    displayName: formatSourceName(name),
    ...v,
    convRate: v.sessions > 0 ? (v.conversions / v.sessions) * 100 : 0,
    roas: v.spend > 0 ? v.revenue / v.spend : 0,
    revenueShare: summary.totalRevenue > 0 ? (v.revenue / summary.totalRevenue) * 100 : 0,
  }));

  const hasRevenue = summary.totalRevenue > 0;
  const hasConversions = summary.totalConversions > 0;
  const hasSpend = summary.totalSpend > 0;

  // ─── 1. BIGGEST REVENUE DRIVER ───
  if (hasRevenue) {
    const topRev = [...sources].sort((a, b) => b.revenue - a.revenue)[0];
    const revChange = pctChange("revenue");
    insights.push({
      id: "revenue-driver",
      icon: DollarSign,
      iconColor: "text-green-500",
      metric: "Top Revenue Source",
      value: `$${topRev.revenue.toLocaleString()}`,
      change: `${revChange >= 0 ? "+" : ""}${revChange}%`,
      changeType: revChange > 0 ? "up" : revChange < 0 ? "down" : "neutral",
      narrative: `${topRev.displayName} is your #1 revenue driver, bringing in $${topRev.revenue.toLocaleString()} (${topRev.revenueShare.toFixed(0)}% of total revenue). ${
        topRev.roas >= 3
          ? `With a ${topRev.roas.toFixed(1)}x ROAS, this channel is highly profitable — scale your budget here.`
          : topRev.roas >= 1
            ? `ROAS is ${topRev.roas.toFixed(1)}x which is healthy, but there's room to optimize creative and targeting.`
            : topRev.spend > 0
              ? `However, ROAS is only ${topRev.roas.toFixed(1)}x — you're spending more than you're earning on this channel.`
              : `This is organic revenue with no ad spend — a strong foundation to protect.`
      }`,
      source: topRev.displayName,
      sparkline: dailyFor("revenue", (r) => r.source === topRev.name),
    });
  }

  // ─── 2. BEST CONVERSION OPPORTUNITY ───
  // Find high-traffic source with below-average conversion rate
  if (hasConversions) {
    const avgConvRate = summary.totalSessions > 0 ? (summary.totalConversions / summary.totalSessions) * 100 : 0;
    const opportunities = sources
      .filter((s) => s.sessions > summary.totalSessions * 0.1 && s.convRate < avgConvRate && s.convRate > 0)
      .sort((a, b) => b.sessions - a.sessions);

    if (opportunities.length > 0) {
      const opp = opportunities[0];
      const potentialConversions = Math.round(opp.sessions * (avgConvRate / 100)) - opp.conversions;
      const potentialRevenue = summary.totalConversions > 0
        ? Math.round(potentialConversions * (summary.totalRevenue / summary.totalConversions))
        : 0;

      insights.push({
        id: "conv-opportunity",
        icon: Target,
        iconColor: "text-amber-500",
        metric: "Conversion Opportunity",
        value: `${opp.displayName}`,
        change: `${opp.convRate.toFixed(1)}% conv rate`,
        changeType: "down",
        narrative: `${opp.displayName} sends ${opp.sessions.toLocaleString()} sessions but converts at only ${opp.convRate.toFixed(1)}% — below your ${avgConvRate.toFixed(1)}% average. ${
          potentialRevenue > 0
            ? `Bringing it to average could unlock ~${potentialConversions} more conversions ($${potentialRevenue.toLocaleString()} in revenue).`
            : `Bringing it to average could unlock ~${potentialConversions} more conversions — check your landing pages for this traffic.`
        }`,
        source: opp.displayName,
        sparkline: dailyFor("conversions", (r) => r.source === opp.name),
      });
    }
  }

  // ─── 3. HIGHEST CONVERTING SOURCE (hidden gem) ───
  if (hasConversions) {
    const bestConv = [...sources].filter((s) => s.conversions > 0).sort((a, b) => b.convRate - a.convRate)[0];
    if (bestConv) {
      const sessionChange = pctChange("sessions");
      insights.push({
        id: "best-converter",
        icon: TrendingUp,
        iconColor: "text-primary",
        metric: "Best Converter",
        value: `${bestConv.convRate.toFixed(1)}%`,
        change: `${bestConv.conversions} conversions`,
        changeType: "up",
        narrative: `${bestConv.displayName} has your highest conversion rate at ${bestConv.convRate.toFixed(1)}% with ${bestConv.conversions} conversions from ${bestConv.sessions.toLocaleString()} sessions. ${
          bestConv.sessions < summary.totalSessions * 0.2
            ? `It's underutilized — sending more traffic here could significantly boost your overall conversions.`
            : `This is already a core channel. Focus on maintaining this quality while scaling volume.`
        }`,
        source: bestConv.displayName,
        sparkline: dailyFor("sessions", (r) => r.source === bestConv.name),
      });
    }
  }

  // ─── FALLBACKS when no conversion/revenue data ───
  if (!hasRevenue && !hasConversions) {
    // Traffic trend
    const sessionChange = pctChange("sessions");
    insights.push({
      id: "sessions",
      icon: Eye,
      iconColor: "text-primary",
      metric: "Traffic Trend",
      value: summary.totalSessions.toLocaleString(),
      change: `${sessionChange >= 0 ? "+" : ""}${sessionChange}%`,
      changeType: sessionChange > 0 ? "up" : sessionChange < 0 ? "down" : "neutral",
      narrative: `You had ${summary.totalSessions.toLocaleString()} sessions this period. ${
        sessionChange > 5
          ? `Traffic is growing ${sessionChange}% — your content or campaigns are gaining traction.`
          : sessionChange < -5
            ? `Traffic dropped ${Math.abs(sessionChange)}% — check if campaigns paused or rankings shifted.`
            : `Traffic is stable. Focus on improving conversion paths to turn visitors into customers.`
      }`,
      source: "Google Analytics",
      sparkline: dailyFor("sessions"),
    });

    // Top source
    const topSource = [...sources].sort((a, b) => b.sessions - a.sessions)[0];
    if (topSource) {
      const share = summary.totalSessions > 0 ? (topSource.sessions / summary.totalSessions) * 100 : 0;
      insights.push({
        id: "top-source",
        icon: Globe,
        iconColor: "text-blue-500",
        metric: "Top Source",
        value: topSource.displayName,
        change: `${share.toFixed(0)}% of traffic`,
        changeType: "neutral",
        narrative: `${topSource.displayName} drives ${share.toFixed(0)}% of all sessions (${topSource.sessions.toLocaleString()}). ${
          share > 60
            ? `Heavy reliance on one source is risky — diversify to protect against algorithm changes.`
            : `Good traffic distribution — no single source dominates, which reduces risk.`
        }`,
        source: topSource.displayName,
        sparkline: dailyFor("sessions", (r) => r.source === topSource.name),
      });
    }

    // Peak day
    const byDate: Record<string, number> = {};
    for (const r of rows) byDate[r.date] = (byDate[r.date] || 0) + (r.sessions || 0);
    const peakDay = dates.reduce((best, d) => (byDate[d] > byDate[best] ? d : best), dates[0]);
    const avgDaily = Math.round(summary.totalSessions / dates.length);
    insights.push({
      id: "peak-day",
      icon: BarChart3,
      iconColor: "text-green-500",
      metric: "Peak Day",
      value: new Date(peakDay).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      change: `${byDate[peakDay]} sessions`,
      changeType: "up",
      narrative: `${new Date(peakDay).toLocaleDateString("en-US", { weekday: "long" })} was your peak with ${byDate[peakDay]} sessions, ${Math.round((byDate[peakDay] / avgDaily - 1) * 100)}% above your daily average. Schedule your best content and promotions on this day.`,
      source: "Google Analytics",
      sparkline: dailyFor("sessions"),
    });
  }

  // ─── 4. SPEND EFFICIENCY (if spend data exists) ───
  if (hasSpend && hasRevenue && insights.length < 4) {
    const worstRoas = [...sources].filter((s) => s.spend > 0).sort((a, b) => a.roas - b.roas)[0];
    if (worstRoas && worstRoas.roas < 2) {
      insights.push({
        id: "spend-waste",
        icon: Zap,
        iconColor: "text-red-400",
        metric: "Spend Alert",
        value: `${worstRoas.roas.toFixed(1)}x ROAS`,
        change: `$${worstRoas.spend.toLocaleString()} spent`,
        changeType: "down",
        narrative: `${worstRoas.displayName} has the lowest return at ${worstRoas.roas.toFixed(1)}x ROAS — you spent $${worstRoas.spend.toLocaleString()} but only earned $${worstRoas.revenue.toLocaleString()}. ${
          worstRoas.roas < 1
            ? `You're losing money here. Pause or restructure this campaign immediately.`
            : `Returns are thin. Tighten targeting or reallocate this budget to your top performer.`
        }`,
        source: worstRoas.displayName,
        sparkline: dailyFor("spend", (r) => r.source === worstRoas.name),
      });
    }
  }

  return insights;
}

function formatSourceName(source: string): string {
  if (source === "(direct)") return "Direct";
  if (source === "(not set)") return "Unknown";
  return source
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
