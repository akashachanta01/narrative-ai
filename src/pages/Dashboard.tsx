import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWindsorData } from "@/hooks/useWindsorData";
import { Button } from "@/components/ui/button";
import { EmptyStateConnect } from "@/components/dashboard/EmptyStateConnect";
import { ChatSidebar } from "@/components/dashboard/ChatSidebar";
import { StatsRibbon } from "@/components/dashboard/StatsRibbon";
import { TrafficChart } from "@/components/dashboard/TrafficChart";
import { SourceTable } from "@/components/dashboard/SourceTable";
import { InsightCards } from "@/components/dashboard/InsightCards";
import { WeeklySummary } from "@/components/dashboard/WeeklySummary";
import { LogOut, Settings, Loader2, Sparkles, Sun, Moon, ChevronDown, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DATE_RANGES = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
] as const;

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [days, setDays] = useState(7);
  const { data: windsorData, isLoading: windsorLoading, refetch } = useWindsorData(days);

  const activeRange = DATE_RANGES.find((r) => r.days === days) || DATE_RANGES[0];

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground">Preparing your insights…</p>
        </div>
      </div>
    );
  }

  const hasData = windsorData !== null && windsorData !== undefined;

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground tracking-tight">Narrative</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Date range pill */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 text-xs gap-2 px-4 font-mono tracking-wide">
                  <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                  {activeRange.label}
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {DATE_RANGES.map((range) => (
                  <DropdownMenuItem
                    key={range.days}
                    onClick={() => setDays(range.days)}
                    className={days === range.days ? "bg-accent" : ""}
                  >
                    {range.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => navigate("/connections")}
            >
              <Settings className="h-4 w-4" />
            </Button>

            <Button
              variant="default"
              size="sm"
              className="h-9 px-4 text-xs font-semibold tracking-wider uppercase"
              onClick={() => refetch?.()}
              disabled={windsorLoading}
            >
              {windsorLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Refresh"}
            </Button>
          </div>
        </header>

        {/* Content */}
        {windsorLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Fetching your latest data…</p>
            </div>
          </div>
        ) : hasData ? (
          <main className="flex-1 overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <StatsRibbon data={windsorData} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="px-4 sm:px-6 pb-4">
              <InsightCards data={windsorData} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="px-4 sm:px-6 pb-4">
              <TrafficChart data={windsorData} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="px-4 sm:px-6 pb-8">
              <SourceTable data={windsorData} />
            </motion.div>
          </main>
        ) : (
          <EmptyStateConnect />
        )}
      </div>

      <ChatSidebar />
    </div>
  );
}
