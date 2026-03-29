import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Search, X } from "lucide-react";
import type { WindsorSummary } from "@/lib/windsorTypes";

interface Props {
  data: WindsorSummary;
}

type Tab = "source" | "date";
type SortKey = "sessions" | "clicks" | "spend" | "revenue" | "convRate" | "roas" | "cpc";

interface AggRow {
  name: string;
  sessions: number;
  clicks: number;
  spend: number;
  revenue: number;
  conversions: number;
}

interface EnrichedRow extends AggRow {
  convRate: number;
  roas: number;
  cpc: number;
  sessionShare: number;
  tag: { label: string; color: string } | null;
}

export function SourceTable({ data }: Props) {
  const [tab, setTab] = useState<Tab>("source");
  const [sortKey, setSortKey] = useState<SortKey>("sessions");
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState("");

  const rows = data.rows;

  // Detect which metrics have meaningful data
  const hasRevenue = data.totalRevenue > 0;
  const hasSpend = data.totalSpend > 0;
  const hasConversions = data.totalConversions > 0;
  const hasClicks = data.totalClicks > 0;

  // Aggregate by source
  const sourceRows = useMemo(() => {
    const map: Record<string, Omit<AggRow, "name">> = {};
    for (const r of rows) {
      if (!map[r.source]) map[r.source] = { sessions: 0, clicks: 0, spend: 0, revenue: 0, conversions: 0 };
      map[r.source].sessions += r.sessions || 0;
      map[r.source].clicks += r.clicks || 0;
      map[r.source].spend += r.spend || 0;
      map[r.source].revenue += r.revenue || 0;
      map[r.source].conversions += r.conversions || 0;
    }
    return Object.entries(map).map(([name, v]) => ({ name: formatName(name), ...v }));
  }, [rows]);

  // Aggregate by date
  const dateRows = useMemo(() => {
    const map: Record<string, Omit<AggRow, "name">> = {};
    for (const r of rows) {
      if (!map[r.date]) map[r.date] = { sessions: 0, clicks: 0, spend: 0, revenue: 0, conversions: 0 };
      map[r.date].sessions += r.sessions || 0;
      map[r.date].clicks += r.clicks || 0;
      map[r.date].spend += r.spend || 0;
      map[r.date].revenue += r.revenue || 0;
      map[r.date].conversions += r.conversions || 0;
    }
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({
        name: new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        ...v,
      }));
  }, [rows]);

  const baseRows = tab === "source" ? sourceRows : dateRows;
  const totalSessions = data.totalSessions || 1;

  // Compute averages for tagging
  const avgConvRate = data.totalSessions > 0 ? (data.totalConversions / data.totalSessions) * 100 : 0;
  const avgRoas = data.totalSpend > 0 ? data.totalRevenue / data.totalSpend : 0;

  // Enrich with derived metrics + contextual tags
  const enriched: EnrichedRow[] = useMemo(
    () =>
      baseRows.map((r) => {
        const convRate = r.sessions > 0 ? (r.conversions / r.sessions) * 100 : 0;
        const roas = r.spend > 0 ? r.revenue / r.spend : 0;
        const cpc = r.clicks > 0 ? r.spend / r.clicks : 0;
        const sessionShare = (r.sessions / totalSessions) * 100;

        // Determine contextual tag
        let tag: EnrichedRow["tag"] = null;
        if (tab === "source") {
          if (hasRevenue && r.revenue > 0 && r.revenue === Math.max(...baseRows.map((x) => x.revenue))) {
            tag = { label: "💰 Revenue Leader", color: "bg-green-500/10 text-green-600 dark:text-green-400" };
          } else if (hasConversions && convRate > 0 && convRate < avgConvRate * 0.7 && r.sessions > totalSessions * 0.1) {
            tag = { label: "🎯 Conv. Opportunity", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" };
          } else if (hasSpend && roas > 0 && roas < 1) {
            tag = { label: "⚠️ Unprofitable", color: "bg-red-500/10 text-red-500 dark:text-red-400" };
          } else if (hasConversions && convRate > avgConvRate * 1.5 && r.conversions > 0) {
            tag = { label: "⭐ High Converter", color: "bg-primary/10 text-primary" };
          } else if (hasSpend && hasRevenue && roas >= 3) {
            tag = { label: "🚀 Efficient", color: "bg-green-500/10 text-green-600 dark:text-green-400" };
          }
        }

        return { ...r, convRate, roas, cpc, sessionShare, tag };
      }),
    [baseRows, totalSessions, tab, avgConvRate, hasRevenue, hasConversions, hasSpend]
  );

  // Filter by search
  const filtered = useMemo(() => {
    if (!search.trim()) return enriched;
    const q = search.toLowerCase();
    return enriched.filter((r) => r.name.toLowerCase().includes(q));
  }, [enriched, search]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      return sortAsc ? av - bv : bv - av;
    });
  }, [filtered, sortKey, sortAsc]);

  const maxSessions = Math.max(...sorted.map((r) => r.sessions), 1);

  // Build dynamic columns based on available data
  type Column = { key: SortKey; label: string; format: (v: EnrichedRow) => string };
  const columns: Column[] = [
    { key: "sessions", label: "Sessions", format: (r) => fmtNum(r.sessions) },
  ];
  if (hasClicks) columns.push({ key: "clicks", label: "Clicks", format: (r) => fmtNum(r.clicks) });
  if (hasSpend) columns.push({ key: "spend", label: "Spend", format: (r) => fmtCurrency(r.spend) });
  if (hasRevenue) columns.push({ key: "revenue", label: "Revenue", format: (r) => fmtCurrency(r.revenue) });
  if (hasConversions) columns.push({ key: "convRate", label: "Conv %", format: (r) => `${r.convRate.toFixed(1)}%` });
  if (hasSpend && hasRevenue) columns.push({ key: "roas", label: "ROAS", format: (r) => `${r.roas.toFixed(1)}x` });
  if (hasSpend && hasClicks) columns.push({ key: "cpc", label: "CPC", format: (r) => fmtCurrency(r.cpc) });

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  }

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
          By Source
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
        {tab === "source" && (
          <div className="relative flex items-center mr-3">
            <Search className="absolute left-2 w-3 h-3 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Filter sources…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-7 w-36 pl-7 pr-7 text-xs rounded-md border border-border/60 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
        <span className="text-[11px] text-muted-foreground pr-4">
          {sorted.length} {tab === "source" ? "sources" : "days"}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5 w-8">#</th>
              <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-2.5">
                {tab === "source" ? "Source" : "Date"}
              </th>
              <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-2.5 w-24">
                Share
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-right text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2.5 cursor-pointer hover:text-foreground transition-colors select-none whitespace-nowrap"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label} {sortKey === col.key ? (sortAsc ? "↑" : "↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {sorted.map((row, i) => (
              <tr key={row.name} className="group hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5 text-xs text-muted-foreground tabular-nums">{i + 1}</td>
                <td className="px-2 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate max-w-[160px]">{row.name}</span>
                    {row.tag && (
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0 ${row.tag.color}`}>
                        {row.tag.label}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-2 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full overflow-hidden bg-muted/40">
                      <div
                        className="h-full rounded-full bg-primary/30"
                        style={{ width: `${(row.sessions / maxSessions) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground tabular-nums w-9 text-right shrink-0">
                      {row.sessionShare.toFixed(0)}%
                    </span>
                  </div>
                </td>
                {columns.map((col) => {
                  const isHighlight =
                    (col.key === "roas" && row.roas >= 3) ||
                    (col.key === "convRate" && row.convRate >= 5);
                  const isWarning =
                    (col.key === "roas" && row.roas > 0 && row.roas < 1) ||
                    (col.key === "cpc" && row.cpc > 5);
                  return (
                    <td
                      key={col.key}
                      className={`text-right px-3 py-2.5 tabular-nums text-sm whitespace-nowrap ${
                        isHighlight
                          ? "text-green-600 dark:text-green-400 font-semibold"
                          : isWarning
                            ? "text-red-500 dark:text-red-400 font-medium"
                            : "text-foreground"
                      }`}
                    >
                      {col.format(row)}
                    </td>
                  );
                })}
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={3 + columns.length} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary row */}
      {sorted.length > 0 && (
        <div className="border-t border-border/40 px-4 py-2.5 flex items-center gap-4 bg-muted/10">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Totals</span>
          <div className="flex-1" />
          {columns.map((col) => {
            const total = sorted.reduce((s, r) => s + r[col.key], 0);
            let display: string;
            if (col.key === "convRate") display = `${(data.totalConversions / data.totalSessions * 100).toFixed(1)}%`;
            else if (col.key === "roas") display = `${(data.totalRevenue / (data.totalSpend || 1)).toFixed(1)}x`;
            else if (col.key === "cpc") display = fmtCurrency(data.totalSpend / (data.totalClicks || 1));
            else if (col.key === "spend" || col.key === "revenue") display = fmtCurrency(total);
            else display = fmtNum(total);
            return (
              <span key={col.key} className="text-xs font-semibold text-foreground tabular-nums min-w-[60px] text-right">
                {display}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatName(source: string): string {
  if (source === "(direct)") return "Direct / None";
  if (source === "(not set)") return "Unknown";
  return source.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
}

function fmtCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n.toFixed(2)}`;
}
