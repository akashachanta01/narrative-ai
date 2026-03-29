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
import { LogOut, Settings, Loader2, Sparkles, RefreshCw, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: windsorData, isLoading: windsorLoading, refetch } = useWindsorData();

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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground tracking-tight">Narrative</span>
            </div>

            {/* Date range controls */}
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                <ChevronLeft className="w-3 h-3" />
              </Button>
              <span className="text-xs font-medium text-foreground px-2">Last 7 days</span>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                <ChevronRight className="w-3 h-3" />
              </Button>
              <span className="text-xs text-muted-foreground border border-border rounded px-2 py-0.5 ml-1">Daily</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground ml-1"
                onClick={() => refetch?.()}
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => document.documentElement.classList.toggle("dark")}
            >
              <Sun className="h-4 w-4 hidden dark:block" />
              <Moon className="h-4 w-4 block dark:hidden" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={() => navigate("/connections")}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={signOut}>
              <LogOut className="h-4 w-4" />
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
            {/* Stats ribbon */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <StatsRibbon data={windsorData} />
            </motion.div>

            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="px-4 sm:px-6 pb-4"
            >
              <TrafficChart data={windsorData} />
            </motion.div>

            {/* Tables */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="px-4 sm:px-6 pb-8"
            >
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
