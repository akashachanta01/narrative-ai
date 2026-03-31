import { useMemo, useState } from "react";
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
  ReferenceLine,
} from "recharts";
import { Button } from "@/components/ui/button";
import { BarChart3, DollarSign } from "lucide-react";

type ViewMode = "sessions" | "revenue";

interface Props {
  data: WindsorSummary;
}

export function TrafficChart({ data }: Props) {
  const hasRevenue = data.totalRevenue > 0;
  const [view, setView] = useState<ViewMode>("sessions");

  const { chartData, baseline, hasConversions } = useMemo(() => {
    const rows = data.rows;
    const byDate: Record<string, { sessions: number; revenue: number; conversions: number }> = {};
    for (const r of rows) {
      if (!byDate[r.date]) byDate[r.date] = { sessions: 0, revenue: 0, conversions: 0 };
      byDate[r.date].sessions += r.sessions || 0;
      byDate[r.date].revenue += r.revenue || 0;
      byDate[r.date].conversions += r.conversions || 0;
    }

    const sorted = Object.keys(byDate).sort();
    const hasConv = data.totalConversions > 0;

    // Compute baseline: average of first half of dates (proxy for "previous period")
    const midpoint = Math.max(1, Math.floor(sorted.length / 2));
    const prevSlice = sorted.slice(0, midpoint);

    const baselineSessions =
      prevSlice.reduce((sum, d) => sum + byDate[d].sessions, 0) / prevSlice.length || 0;
    const baselineRevenue =
      prevSlice.reduce((sum, d) => sum + byDate[d].revenue, 0) / prevSlice.length || 0;

    const chartData = sorted.map((date) => ({
      date: new Date(date).toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      sessions: byDate[date].sessions,
      revenue: byDate[date].revenue,
      conversions: byDate[date].conversions,
    }));

    return {
      chartData,
      baseline: { sessions: Math.round(baselineSessions), revenue: Math.round(baselineRevenue * 100) / 100 },
      hasConversions: hasConv,
    };
  }, [data]);

  const isRevView = view === "revenue" && hasRevenue;
  const primaryKey = isRevView ? "revenue" : "sessions";
  const baselineValue = isRevView ? baseline.revenue : baseline.sessions;

  const title = isRevView ? "Estimated Revenue" : "Daily Traffic";
  const subtitle = isRevView
    ? "Revenue trend with prior-period baseline"
    : "Sessions over time with prior-period baseline";

  const secondaryKey = isRevView ? "sessions" : hasRevenue ? "revenue" : hasConversions ? "conversions" : null;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-5">
      <div className="mb-3 px-1 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-[11px] text-muted-foreground">{subtitle}</p>
        </div>
        {hasRevenue && (
          <div className="flex items-center rounded-lg border border-border/60 bg-muted/40 p-0.5">
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2.5 text-[11px] font-medium gap-1.5 rounded-md transition-all ${
                view === "sessions"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setView("sessions")}
            >
              <BarChart3 className="w-3 h-3" />
              Sessions
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2.5 text-[11px] font-medium gap-1.5 rounded-md transition-all ${
                view === "revenue"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setView("revenue")}
            >
              <DollarSign className="w-3 h-3" />
              Revenue
            </Button>
          </div>
        )}
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
              width={45}
              tickFormatter={(v: number) => (isRevView ? `$${v}` : v.toString())}
            />
            {secondaryKey && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) =>
                  secondaryKey === "revenue" ? `$${v}` : v.toString()
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
                if (name === "Revenue" || name === "Est. Revenue") return [`$${value.toLocaleString()}`, name];
                return [value.toLocaleString(), name];
              }}
            />

            {/* Baseline reference line */}
            <ReferenceLine
              yAxisId="left"
              y={baselineValue}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="6 4"
              strokeOpacity={0.6}
              label={{
                value: `Baseline: ${isRevView ? `$${baselineValue.toLocaleString()}` : baselineValue.toLocaleString()}`,
                position: "insideTopRight",
                fill: "hsl(var(--muted-foreground))",
                fontSize: 10,
                fontWeight: 500,
              }}
            />

            {/* Primary metric as bars */}
            <Bar
              yAxisId="left"
              dataKey={primaryKey}
              fill={isRevView ? "hsl(142 70% 50%)" : "hsl(var(--primary))"}
              fillOpacity={0.7}
              radius={[3, 3, 0, 0]}
              barSize={chartData.length > 14 ? 12 : 20}
              name={isRevView ? "Est. Revenue" : "Sessions"}
            />

            {/* Secondary metric as line */}
            {secondaryKey === "revenue" && (
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
            {secondaryKey === "sessions" && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="sessions"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                name="Sessions"
              />
            )}
            {secondaryKey === "conversions" && (
              <Line
                yAxisId="right"
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

      {/* Legend */}
      <div className="flex items-center gap-5 mt-3 px-1">
        <div className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: isRevView ? "hsl(142 70% 50%)" : "hsl(var(--primary))", opacity: 0.7 }}
          />
          <span className="text-[11px] text-muted-foreground">{isRevView ? "Est. Revenue" : "Sessions"}</span>
        </div>
        {secondaryKey && (
          <div className="flex items-center gap-1.5">
            <div
              className="w-6 h-0.5 rounded"
              style={{
                backgroundColor:
                  secondaryKey === "revenue"
                    ? "hsl(142 70% 50%)"
                    : secondaryKey === "sessions"
                      ? "hsl(var(--primary))"
                      : "hsl(45 90% 55%)",
              }}
            />
            <span className="text-[11px] text-muted-foreground capitalize">{secondaryKey}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-0 border-t-2 border-dashed border-muted-foreground/60" />
          <span className="text-[11px] text-muted-foreground">Baseline</span>
        </div>
      </div>
    </div>
  );
}
