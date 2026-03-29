/** Windsor.ai Marketing Common Data Model row */
export interface WindsorDataRow {
  date: string;
  source: string;
  clicks: number;
  spend: number;
  sessions: number;
  conversions: number;
  revenue: number;
}

/** Aggregated summary derived from Windsor data, used by AI and insight cards */
export interface WindsorSummary {
  totalSpend: number;
  totalRevenue: number;
  totalClicks: number;
  totalSessions: number;
  totalConversions: number;
  roas: number;
  topSource: string;
  rows: WindsorDataRow[];
}

export function summarizeWindsorData(rows: WindsorDataRow[]): WindsorSummary {
  const totalSpend = rows.reduce((s, r) => s + (r.spend || 0), 0);
  const totalRevenue = rows.reduce((s, r) => s + (r.revenue || 0), 0);
  const totalClicks = rows.reduce((s, r) => s + (r.clicks || 0), 0);
  const totalSessions = rows.reduce((s, r) => s + (r.sessions || 0), 0);
  const totalConversions = rows.reduce((s, r) => s + (r.conversions || 0), 0);

  // Find top source by revenue
  const bySource: Record<string, number> = {};
  for (const r of rows) {
    bySource[r.source] = (bySource[r.source] || 0) + (r.revenue || 0);
  }
  const topSource = Object.entries(bySource).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

  return {
    totalSpend,
    totalRevenue,
    totalClicks,
    totalSessions,
    totalConversions,
    roas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
    topSource,
    rows,
  };
}
