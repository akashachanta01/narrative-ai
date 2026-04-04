import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AppNavBar from "@/components/AppNavBar";
import { Loader2, Users, Plug, TrendingUp, Clock, Eye, Globe } from "lucide-react";

interface AdminStats {
  totalUsers: number;
  signupsLast7d: number;
  signupsLast30d: number;
  totalConnections: number;
  usersWithConnections: number;
  signupsByDay: { date: string; count: number }[];
  connectionsByDay: { date: string; count: number }[];
  providerCounts: Record<string, number>;
  connProviderCounts: Record<string, number>;
  recentUsers: { email: string; provider: string; createdAt: string; lastSignIn: string }[];
  totalPageViews: number;
  pageViewsLast7d: number;
  pageViewsByDay: { date: string; count: number }[];
  topPages: [string, number][];
}

export default function AdminAnalytics() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }

    const fetchStats = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");

        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/admin-stats`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
          }
        );

        if (res.status === 403) { navigate("/dashboard"); return; }
        if (!res.ok) throw new Error("Failed to load stats");

        setStats(await res.json());
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavBar />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavBar />
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const maxSignups = Math.max(...stats.signupsByDay.map((d) => d.count), 1);
  const maxConns = Math.max(...stats.connectionsByDay.map((d) => d.count), 1);
  const maxPageViews = Math.max(...stats.pageViewsByDay.map((d) => d.count), 1);
  const conversionRate = stats.totalUsers > 0
    ? Math.round((stats.usersWithConnections / stats.totalUsers) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <AppNavBar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Admin Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of user signups, connections, and activity.</p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KpiCard icon={<Eye className="h-4 w-4" />} label="Page Views (30d)" value={stats.totalPageViews} />
          <KpiCard icon={<Globe className="h-4 w-4" />} label="Page Views (7d)" value={stats.pageViewsLast7d} />
          <KpiCard icon={<Users className="h-4 w-4" />} label="Total Users" value={stats.totalUsers} />
          <KpiCard icon={<TrendingUp className="h-4 w-4" />} label="Signups (7d)" value={stats.signupsLast7d} />
          <KpiCard icon={<Plug className="h-4 w-4" />} label="Connections" value={stats.totalConnections} />
          <KpiCard icon={<TrendingUp className="h-4 w-4" />} label="Conversion" value={`${conversionRate}%`} subtitle="users with ≥1 connection" />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <BarChart title="Signups (last 30 days)" data={stats.signupsByDay} max={maxSignups} color="bg-accent" />
          <BarChart title="Connections (last 30 days)" data={stats.connectionsByDay} max={maxConns} color="bg-primary" />
        </div>

        {/* Breakdowns */}
        <div className="grid md:grid-cols-2 gap-6">
          <Breakdown title="Auth Providers" data={stats.providerCounts} />
          <Breakdown title="Connected Sources" data={stats.connProviderCounts} />
        </div>

        {/* Recent users */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Recent Signups
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground text-xs border-b border-border">
                  <th className="pb-2 pr-4">Email</th>
                  <th className="pb-2 pr-4">Provider</th>
                  <th className="pb-2 pr-4">Signed Up</th>
                  <th className="pb-2">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map((u, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-2.5 pr-4 text-foreground font-medium">{u.email}</td>
                    <td className="py-2.5 pr-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                        {u.provider}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-2.5 text-muted-foreground">
                      {u.lastSignIn ? new Date(u.lastSignIn).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function KpiCard({ icon, label, value, subtitle }: { icon: React.ReactNode; label: string; value: string | number; subtitle?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">{icon}<span className="text-xs">{label}</span></div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {subtitle && <p className="text-[10px] text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}

function BarChart({ title, data, max, color }: { title: string; data: { date: string; count: number }[]; max: number; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      <div className="flex items-end gap-[2px] h-28">
        {data.map((d) => {
          const pct = max > 0 ? (d.count / max) * 100 : 0;
          return (
            <div key={d.date} className="flex-1 flex flex-col items-center group relative">
              <div className={`w-full rounded-t ${color} transition-all`} style={{ height: `${Math.max(pct, 2)}%`, minHeight: d.count > 0 ? 4 : 1, opacity: d.count > 0 ? 1 : 0.15 }} />
              <div className="absolute -top-6 hidden group-hover:block text-[10px] text-foreground bg-popover border border-border rounded px-1.5 py-0.5 whitespace-nowrap z-10">
                {d.date.slice(5)}: {d.count}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-[9px] text-muted-foreground">
        <span>{data[0]?.date.slice(5)}</span>
        <span>{data[data.length - 1]?.date.slice(5)}</span>
      </div>
    </div>
  );
}

function Breakdown({ title, data }: { title: string; data: Record<string, number> }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, [, v]) => s + v, 0) || 1;
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
        <p className="text-xs text-muted-foreground">No data yet</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      <div className="space-y-2">
        {entries.map(([name, count]) => (
          <div key={name}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-foreground font-medium capitalize">{name}</span>
              <span className="text-muted-foreground">{count} ({Math.round((count / total) * 100)}%)</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: `${(count / total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
