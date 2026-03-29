import { useMemo } from "react";
import type { WindsorSummary } from "@/lib/windsorTypes";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  data: WindsorSummary;
}

interface StatItem {
  label: string;
  value: string;
  subtitle: string;
  change: number | null;
  priority: number;
  show: boolean;
}

export function StatsRibbon({ data }: Props) {
  const stats = useMemo(() => {
    const rows = data.rows;
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

    const hasRevenue = data.totalRevenue > 0;
    const hasSpend = data.totalSpend > 0;
    const hasConversions = data.totalConversions > 0;
    const hasClicks = data.totalClicks > 0;

    const convRate = data.totalSessions > 0 ? (data.totalConversions / data.totalSessions) * 100 : 0;
    const avgDaily = dates.length > 0 ? Math.round(data.totalSessions / dates.length) : 0;
    const uniqueSources = new Set(rows.map((r) => r.source)).size;

    // Find top source by sessions
    const bySource: Record<string, number> = {};
    for (const r of rows) bySource[r.source] = (bySource[r.source] || 0) + (r.sessions || 0);
    const topSourceEntry = Object.entries(bySource).sort((a, b) => b[1] - a[1])[0];
    const topSourceName = topSourceEntry ? formatName(topSourceEntry[0]) : "—";
    const topSourceShare = topSourceEntry && data.totalSessions > 0
      ? Math.round((topSourceEntry[1] / data.totalSessions) * 100)
      : 0;

    const allStats: StatItem[] = [
      // Revenue-first when available
      {
        label: "TOTAL REVENUE",
        value: `$${data.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
        subtitle: hasSpend ? `${data.roas.toFixed(1)}x return on spend` : "from all sources",
        change: pctChange("revenue"),
        priority: 0,
        show: hasRevenue,
      },
      {
        label: "TOTAL VISITORS",
        value: data.totalSessions.toLocaleString(),
        subtitle: `~${avgDaily}/day across ${uniqueSources} sources`,
        change: pctChange("sessions"),
        priority: hasRevenue ? 2 : 0,
        show: true,
      },
      {
        label: "CONVERSIONS",
        value: data.totalConversions.toLocaleString(),
        subtitle: `${convRate.toFixed(1)}% of visitors convert`,
        change: pctChange("conversions"),
        priority: 1,
        show: hasConversions,
      },
      {
        label: "AD SPEND",
        value: `$${data.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
        subtitle: data.roas >= 1 ? `Profitable at ${data.roas.toFixed(1)}x ROAS` : `Below breakeven (${data.roas.toFixed(1)}x)`,
        change: pctChange("spend"),
        priority: 3,
        show: hasSpend,
      },
      {
        label: "TOTAL CLICKS",
        value: data.totalClicks.toLocaleString(),
        subtitle: hasSpend ? `$${(data.totalSpend / (data.totalClicks || 1)).toFixed(2)} avg CPC` : "from paid + organic",
        change: pctChange("clicks"),
        priority: 4,
        show: hasClicks,
      },
      {
        label: "TOP SOURCE",
        value: topSourceName,
        subtitle: `${topSourceShare}% of all traffic`,
        change: null,
        priority: hasRevenue ? 5 : 1,
        show: true,
      },
      {
        label: "ACTIVE SOURCES",
        value: uniqueSources.toString(),
        subtitle: `${dates.length} days tracked`,
        change: null,
        priority: 6,
        show: true,
      },
    ];

    return allStats
      .filter((s) => s.show)
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 5);
  }, [data]);

  return (
    <div className="px-4 sm:px-6 py-4 overflow-x-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-flow-col lg:auto-cols-fr gap-3 sm:gap-4 min-w-0">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border/60 bg-card px-5 py-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-semibold tracking-[0.1em] uppercase">
                {stat.label}
              </span>
              {stat.change !== null && (
                <span
                  className={`text-[11px] font-medium flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${
                    stat.change > 0
                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                      : stat.change < 0
                        ? "bg-red-500/10 text-red-500 dark:text-red-400"
                        : "bg-muted/60 text-muted-foreground"
                  }`}
                >
                  {stat.change > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : stat.change < 0 ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <Minus className="w-3 h-3" />
                  )}
                  {stat.change > 0 ? "+" : ""}
                  {stat.change}%
                </span>
              )}
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-tight">
              {stat.value}
            </span>
            <span className="text-[11px] text-muted-foreground leading-snug">{stat.subtitle}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatName(source: string): string {
  if (source === "(direct)") return "Direct";
  if (source === "(not set)") return "Unknown";
  return source.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
