import { useMemo } from "react";
import type { WindsorSummary } from "@/lib/windsorTypes";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface Props {
  data: WindsorSummary;
}

export function TrafficChart({ data }: Props) {
  const { chartData, hasRevenue, hasConversions, title, subtitle } = useMemo(() => {
    const rows = data.rows;
    const byDate: Record<string, { sessions: number; revenue: number; conversions: number }> = {};
    for (const r of rows) {
      if (!byDate[r.date]) byDate[r.date] = { sessions: 0, revenue: 0, conversions: 0 };
      byDate[r.date].sessions += r.sessions || 0;
      byDate[r.date].revenue += r.revenue || 0;
      byDate[r.date].conversions += r.conversions || 0;
    }

    const sorted = Object.keys(byDate).sort();
    const hasRev = data.totalRevenue > 0;
    const hasConv = data.totalConversions > 0;

    const chartData = sorted.map((date) => ({
      date: new Date(date).toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      sessions: byDate[date].sessions,
      revenue: byDate[date].revenue,
      conversions: byDate[date].conversions,
    }));

    // Dynamic title based on data
    let title = "Daily Traffic";
    let subtitle = "Sessions over time";
    if (hasRev) {
      title = "Traffic & Revenue";
      subtitle = "See how visitor volume correlates with revenue";
    } else if (hasConv) {
      title = "Traffic & Conversions";
      subtitle = "See which days drive the most conversions";
    }

    return { chartData, hasRevenue: hasRev, hasConversions: hasConv, title, subtitle };
  }, [data]);

  const secondaryMetric = hasRevenue ? "revenue" : hasConversions ? "conversions" : null;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-5">
      <div className="mb-3 px-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
      <div className="h-[280px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            {secondaryMetric && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) =>
                  hasRevenue ? `$${v}` : v.toString()
                }
                width={45}
              />
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: 12,
                color: "hsl(var(--foreground))",
              }}
              labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: 4 }}
              formatter={(value: number, name: string) => {
                if (name === "Revenue") return [`$${value.toLocaleString()}`, name];
                return [value.toLocaleString(), name];
              }}
            />
            <Bar
              yAxisId="left"
              dataKey="sessions"
              fill="hsl(var(--primary))"
              fillOpacity={0.7}
              radius={[3, 3, 0, 0]}
              barSize={chartData.length > 14 ? 12 : 20}
              name="Sessions"
            />
            {hasRevenue && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="hsl(142 70% 50%)"
                strokeWidth={2}
                dot={false}
                name="Revenue"
              />
            )}
            {!hasRevenue && hasConversions && (
              <Line
                yAxisId={secondaryMetric ? "right" : "left"}
                type="monotone"
                dataKey="conversions"
                stroke="hsl(45 90% 55%)"
                strokeWidth={2}
                dot={{ r: 3, fill: "hsl(45 90% 55%)" }}
                name="Conversions"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-5 mt-3 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary/70" />
          <span className="text-[11px] text-muted-foreground">Sessions</span>
        </div>
        {hasRevenue && (
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 rounded" style={{ backgroundColor: "hsl(142 70% 50%)" }} />
            <span className="text-[11px] text-muted-foreground">Revenue</span>
          </div>
        )}
        {!hasRevenue && hasConversions && (
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 rounded" style={{ backgroundColor: "hsl(45 90% 55%)" }} />
            <span className="text-[11px] text-muted-foreground">Conversions</span>
          </div>
        )}
      </div>
    </div>
  );
}
