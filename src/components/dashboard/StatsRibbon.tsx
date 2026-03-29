import type { WindsorSummary } from "@/lib/windsorTypes";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  data: WindsorSummary;
}

interface StatItem {
  label: string;
  value: string;
  suffix: string;
  rawValue: number;
  change: number | null;
  priority: number;
}

export function StatsRibbon({ data }: Props) {
  const rows = data.rows;

  // Split into two halves for trend
  const byDate: Record<string, { sessions: number; clicks: number; spend: number; conversions: number; revenue: number }> = {};
  for (const r of rows) {
    if (!byDate[r.date]) byDate[r.date] = { sessions: 0, clicks: 0, spend: 0, conversions: 0, revenue: 0 };
    byDate[r.date].sessions += r.sessions || 0;
    byDate[r.date].clicks += r.clicks || 0;
    byDate[r.date].spend += r.spend || 0;
    byDate[r.date].conversions += r.conversions || 0;
    byDate[r.date].revenue += r.revenue || 0;
  }
  const dates = Object.keys(byDate).sort();
  const mid = Math.ceil(dates.length / 2);
  const first = dates.slice(0, mid);
  const second = dates.slice(mid);

  function sumField(ds: string[], field: keyof typeof byDate[string]) {
    return ds.reduce((s, d) => s + byDate[d][field], 0);
  }
  function pctChange(field: keyof typeof byDate[string]) {
    const a = sumField(first, field);
    const b = sumField(second, field);
    return a > 0 ? Math.round(((b - a) / a) * 100) : null;
  }

  const convRate = data.totalSessions > 0 ? ((data.totalConversions / data.totalSessions) * 100) : 0;
  const revenuePerSession = data.totalSessions > 0 ? (data.totalRevenue / data.totalSessions) : 0;
  const uniqueSources = new Set(rows.map((r) => r.source)).size;

  // Build all possible stats with priorities
  const allStats: StatItem[] = [
    { label: "VISITORS", value: data.totalSessions.toLocaleString(), suffix: "UV", rawValue: data.totalSessions, change: pctChange("sessions"), priority: 0 },
    { label: "REVENUE", value: `$${data.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, suffix: "", rawValue: data.totalRevenue, change: pctChange("revenue"), priority: 1 },
    { label: "CONVERSION", value: `${convRate.toFixed(2)}%`, suffix: "AVG", rawValue: convRate, change: pctChange("conversions"), priority: 2 },
    { label: "CLICKS", value: data.totalClicks.toLocaleString(), suffix: "", rawValue: data.totalClicks, change: pctChange("clicks"), priority: 4 },
    { label: "SPEND", value: `$${data.totalSpend.toLocaleString()}`, suffix: "", rawValue: data.totalSpend, change: pctChange("spend"), priority: 5 },
    { label: "ROAS", value: `${data.roas.toFixed(1)}x`, suffix: "", rawValue: data.roas, change: null, priority: 6 },
    { label: "REV/SESSION", value: `$${revenuePerSession.toFixed(2)}`, suffix: "", rawValue: revenuePerSession, change: null, priority: 7 },
    { label: "SOURCES", value: uniqueSources.toString(), suffix: "", rawValue: uniqueSources, change: null, priority: 8 },
    { label: "DAYS TRACKED", value: dates.length.toString(), suffix: "", rawValue: dates.length, change: null, priority: 9 },
  ];

  // Filter: only show stats with meaningful (non-zero) data
  // Sessions is always shown; derived stats (conv rate, ROAS, rev/session) require their base to be > 0
  const visibleStats = allStats.filter((s) => {
    if (s.label === "Sessions") return true; // always show
    if (s.label === "Conv. rate") return data.totalConversions > 0;
    if (s.label === "ROAS") return data.totalSpend > 0 && data.totalRevenue > 0;
    if (s.label === "Rev/session") return data.totalRevenue > 0;
    if (s.label === "Sources" || s.label === "Days tracked") return true; // fallback stats
    return s.rawValue > 0;
  });

  // Sort by priority, take top 6
  const stats = visibleStats.sort((a, b) => a.priority - b.priority).slice(0, 6);

  return (
    <div className="px-4 sm:px-6 py-4 overflow-x-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-flow-col lg:auto-cols-fr gap-3 sm:gap-4 min-w-0">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border/60 bg-card px-5 py-4 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-semibold tracking-[0.12em] uppercase">{stat.label}</span>
              {stat.change !== null && (
                <span
                  className={`text-[11px] font-medium flex items-center gap-0.5 ${
                    stat.change > 0 ? "text-green-500" : stat.change < 0 ? "text-red-400" : "text-muted-foreground"
                  }`}
                >
                  {stat.change > 0 ? <TrendingUp className="w-3 h-3" /> : stat.change < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                  {stat.change > 0 ? "+" : ""}{stat.change}%
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-tight">
                {stat.value}
              </span>
              {stat.suffix && (
                <span className="text-xs text-muted-foreground font-medium tracking-wide">{stat.suffix}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
