import { useState } from "react";
import type { WindsorSummary } from "@/lib/windsorTypes";

interface Props {
  data: WindsorSummary;
}

type Tab = "source" | "date";

export function SourceTable({ data }: Props) {
  const [tab, setTab] = useState<Tab>("source");
  const rows = data.rows;

  // By source
  const bySource: Record<string, { sessions: number; clicks: number; spend: number; revenue: number }> = {};
  for (const r of rows) {
    if (!bySource[r.source]) bySource[r.source] = { sessions: 0, clicks: 0, spend: 0, revenue: 0 };
    bySource[r.source].sessions += r.sessions || 0;
    bySource[r.source].clicks += r.clicks || 0;
    bySource[r.source].spend += r.spend || 0;
    bySource[r.source].revenue += r.revenue || 0;
  }
  const sourceRows = Object.entries(bySource)
    .map(([name, v]) => ({ name: formatName(name), ...v }))
    .sort((a, b) => b.sessions - a.sessions);

  const maxSessions = sourceRows[0]?.sessions || 1;

  // By date
  const byDate: Record<string, { sessions: number; clicks: number; spend: number; revenue: number }> = {};
  for (const r of rows) {
    if (!byDate[r.date]) byDate[r.date] = { sessions: 0, clicks: 0, spend: 0, revenue: 0 };
    byDate[r.date].sessions += r.sessions || 0;
    byDate[r.date].clicks += r.clicks || 0;
    byDate[r.date].spend += r.spend || 0;
    byDate[r.date].revenue += r.revenue || 0;
  }
  const dateRows = Object.entries(byDate)
    .map(([date, v]) => ({
      name: new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      ...v,
    }))
    .sort((a, b) => b.sessions - a.sessions);

  const maxDateSessions = dateRows[0]?.sessions || 1;

  const activeRows = tab === "source" ? sourceRows : dateRows;
  const activeMax = tab === "source" ? maxSessions : maxDateSessions;

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border/40">
        <button
          onClick={() => setTab("source")}
          className={`px-4 py-3 text-xs font-medium transition-colors ${
            tab === "source"
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Source
        </button>
        <button
          onClick={() => setTab("date")}
          className={`px-4 py-3 text-xs font-medium transition-colors ${
            tab === "date"
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          By Day
        </button>
        <div className="flex-1" />
        <span className="text-[11px] text-muted-foreground pr-4">Sessions ↕</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border/30">
        {activeRows.map((row, i) => (
          <div key={row.name} className="flex items-center gap-3 px-4 py-2.5 group hover:bg-muted/30 transition-colors">
            <span className="text-xs text-muted-foreground w-5 text-right shrink-0">{i + 1}</span>
            <div className="flex-1 min-w-0 flex items-center gap-3">
              <span className="text-sm text-foreground truncate">{row.name}</span>
              {/* Bar */}
              <div className="flex-1 h-4 rounded overflow-hidden bg-muted/30">
                <div
                  className="h-full rounded bg-primary/20"
                  style={{ width: `${(row.sessions / activeMax) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-medium text-foreground tabular-nums shrink-0">
              {row.sessions >= 1000 ? `${(row.sessions / 1000).toFixed(1)}k` : row.sessions}
            </span>
          </div>
        ))}
        {activeRows.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">No data available</div>
        )}
      </div>
    </div>
  );
}

function formatName(source: string): string {
  if (source === "(direct)") return "Direct / None";
  if (source === "(not set)") return "Unknown";
  return source.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
