import { TrendingUp, TrendingDown, Globe, Eye, BarChart3, Zap } from "lucide-react";
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
}

export function generateInsights(summary: WindsorSummary): DynamicInsight[] {
  const insights: DynamicInsight[] = [];
  const rows = summary.rows;

  // Group by date for trend analysis
  const byDate: Record<string, number> = {};
  for (const r of rows) {
    byDate[r.date] = (byDate[r.date] || 0) + (r.sessions || 0);
  }
  const dates = Object.keys(byDate).sort();

  // Split into two halves for comparison
  const mid = Math.ceil(dates.length / 2);
  const firstHalf = dates.slice(0, mid);
  const secondHalf = dates.slice(mid);
  const firstSessions = firstHalf.reduce((s, d) => s + byDate[d], 0);
  const secondSessions = secondHalf.reduce((s, d) => s + byDate[d], 0);
  const sessionChange = firstSessions > 0
    ? Math.round(((secondSessions - firstSessions) / firstSessions) * 100)
    : 0;

  // 1. Total Sessions insight
  insights.push({
    id: "sessions",
    icon: Eye,
    iconColor: "text-primary",
    metric: "Total Sessions",
    value: summary.totalSessions.toLocaleString(),
    change: `${sessionChange >= 0 ? "+" : ""}${sessionChange}% trend`,
    changeType: sessionChange > 0 ? "up" : sessionChange < 0 ? "down" : "neutral",
    narrative: `You had ${summary.totalSessions.toLocaleString()} sessions over the last 7 days. ${
      sessionChange > 0
        ? `Traffic is trending up ${sessionChange}% in the second half of the week — momentum is building.`
        : sessionChange < 0
          ? `Traffic dipped ${Math.abs(sessionChange)}% in the latter half of the week. Check if any campaigns were paused or content slowed down.`
          : "Traffic has been steady throughout the week."
    }`,
    source: "Google Analytics",
  });

  // 2. Top Source insight
  const bySource: Record<string, number> = {};
  for (const r of rows) {
    bySource[r.source] = (bySource[r.source] || 0) + (r.sessions || 0);
  }
  const sortedSources = Object.entries(bySource).sort((a, b) => b[1] - a[1]);
  const topSource = sortedSources[0];
  const topSourcePct = summary.totalSessions > 0
    ? Math.round((topSource[1] / summary.totalSessions) * 100)
    : 0;

  insights.push({
    id: "top-source",
    icon: Globe,
    iconColor: "text-blue-500",
    metric: "Top Traffic Source",
    value: formatSourceName(topSource[0]),
    change: `${topSourcePct}% of traffic`,
    changeType: "neutral",
    narrative: `"${formatSourceName(topSource[0])}" drove ${topSource[1]} sessions (${topSourcePct}% of total). ${
      sortedSources.length > 1
        ? `Runner-up is "${formatSourceName(sortedSources[1][0])}" with ${sortedSources[1][1]} sessions. ${
            topSourcePct > 50
              ? "You're heavily reliant on one source — consider diversifying."
              : "Good distribution across sources."
          }`
        : ""
    }`,
    source: "Google Analytics",
  });

  // 3. Source diversity / emerging source
  if (sortedSources.length > 2) {
    const emerging = sortedSources.find(([name]) => 
      name.includes("chatgpt") || name.includes("bing") || name.includes("social")
    );
    if (emerging) {
      insights.push({
        id: "emerging",
        icon: Zap,
        iconColor: "text-amber-500",
        metric: "Emerging Source",
        value: formatSourceName(emerging[0]),
        change: `${emerging[1]} sessions`,
        changeType: "up",
        narrative: `"${formatSourceName(emerging[0])}" is an emerging traffic source with ${emerging[1]} sessions this week. AI-driven search and alternative engines are becoming meaningful referrers — make sure your content is optimized for these platforms.`,
        source: "Google Analytics",
      });
    }
  }

  // 4. Daily peak
  const peakDay = dates.reduce((best, d) => byDate[d] > byDate[best] ? d : best, dates[0]);
  const peakSessions = byDate[peakDay];
  const avgDaily = Math.round(summary.totalSessions / dates.length);

  insights.push({
    id: "peak-day",
    icon: BarChart3,
    iconColor: "text-green-500",
    metric: "Peak Day",
    value: new Date(peakDay).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    change: `${peakSessions} sessions`,
    changeType: "up",
    narrative: `Your busiest day was ${new Date(peakDay).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} with ${peakSessions} sessions — ${Math.round((peakSessions / avgDaily - 1) * 100)}% above your daily average of ${avgDaily}. Consider scheduling your most important content or promotions on this day of the week.`,
    source: "Google Analytics",
  });

  return insights;
}

function formatSourceName(source: string): string {
  if (source === "(direct)") return "Direct";
  if (source === "(not set)") return "Unknown";
  return source
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
