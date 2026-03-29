import type { WindsorSummary } from "@/lib/windsorTypes";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  data: WindsorSummary;
}

interface StatItem {
  label: string;
  value: string;
  change: number | null;
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

  const stats: StatItem[] = [
    { label: "Sessions", value: data.totalSessions.toLocaleString(), change: pctChange("sessions") },
    { label: "Revenue", value: `$${data.totalRevenue.toLocaleString()}`, change: pctChange("revenue") },
    { label: "Conv. rate", value: `${convRate.toFixed(2)}%`, change: null },
    { label: "Rev/session", value: `$${revenuePerSession.toFixed(2)}`, change: null },
    { label: "Clicks", value: data.totalClicks.toLocaleString(), change: pctChange("clicks") },
    { label: "Spend", value: `$${data.totalSpend.toLocaleString()}`, change: pctChange("spend") },
    { label: "ROAS", value: data.roas > 0 ? `${data.roas.toFixed(1)}x` : "—", change: null },
  ];

  return (
    <div className="px-4 sm:px-6 py-4 overflow-x-auto">
      <div className="flex gap-6 sm:gap-8 min-w-max">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-0.5">
            <span className="text-[11px] text-muted-foreground font-medium">{stat.label}</span>
            <span className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-tight">
              {stat.value}
            </span>
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
        ))}
      </div>
    </div>
  );
}
