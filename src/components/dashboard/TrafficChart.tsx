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
  const rows = data.rows;

  // Aggregate by date
  const byDate: Record<string, { sessions: number; revenue: number }> = {};
  for (const r of rows) {
    if (!byDate[r.date]) byDate[r.date] = { sessions: 0, revenue: 0 };
    byDate[r.date].sessions += r.sessions || 0;
    byDate[r.date].revenue += r.revenue || 0;
  }

  const chartData = Object.keys(byDate)
    .sort()
    .map((date) => ({
      date: new Date(date).toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      sessions: byDate[date].sessions,
      revenue: byDate[date].revenue,
    }));

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-5">
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
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${v}`}
              width={45}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: 12,
                color: "hsl(var(--foreground))",
              }}
              labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: 4 }}
            />
            <Bar
              yAxisId="left"
              dataKey="sessions"
              fill="hsl(20 80% 65%)"
              radius={[3, 3, 0, 0]}
              barSize={chartData.length > 14 ? 12 : 20}
              name="Sessions"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="hsl(200 80% 65%)"
              strokeWidth={2}
              dot={false}
              name="Revenue"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-5 mt-3 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(20 80% 65%)" }} />
          <span className="text-[11px] text-muted-foreground">Sessions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 rounded" style={{ backgroundColor: "hsl(200 80% 65%)" }} />
          <span className="text-[11px] text-muted-foreground">Revenue</span>
        </div>
      </div>
    </div>
  );
}
