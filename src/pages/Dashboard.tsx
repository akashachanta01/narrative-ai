import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWindsorData } from "@/hooks/useWindsorData";
import { Button } from "@/components/ui/button";
import { InsightCardComponent } from "@/components/dashboard/InsightCard";
import { EmptyStateConnect } from "@/components/dashboard/EmptyStateConnect";
import { ChatSidebar } from "@/components/dashboard/ChatSidebar";
import { generateInsights } from "@/lib/generateInsights";
import type { DynamicInsight } from "@/lib/generateInsights";
import { LogOut, Settings, Loader2, Sparkles, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function getDateString(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

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
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Preparing your insights…</p>
        </div>
      </div>
    );
  }

  const hasData = windsorData !== null && windsorData !== undefined;
  const insights: DynamicInsight[] = hasData ? generateInsights(windsorData) : [];
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar — minimal, clean */}
        <header className="px-8 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold text-foreground tracking-tight">Narrative</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => navigate("/connections")}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Content area */}
        {windsorLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Fetching your latest data…</p>
            </div>
          </div>
        ) : hasData && insights.length > 0 ? (
          <main className="flex-1 overflow-y-auto">
            {/* Hero greeting */}
            <div className="px-8 pt-6 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl"
              >
                <p className="text-sm text-muted-foreground mb-1">{getDateString()}</p>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">
                  {getGreeting()}, {firstName}
                </h1>
                <p className="text-base text-muted-foreground mt-2 leading-relaxed">
                  Here's what's happening with your data this week.
                </p>
              </motion.div>

              {/* Quick stats ribbon */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-6 flex gap-4 flex-wrap"
              >
                {insights.slice(0, 3).map((insight, i) => (
                  <div
                    key={insight.id + "-stat"}
                    className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border/60 shadow-sm"
                  >
                    <div className={`w-8 h-8 rounded-xl bg-accent flex items-center justify-center`}>
                      <insight.icon className={`w-4 h-4 ${insight.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{insight.metric}</p>
                      <p className="text-lg font-bold text-foreground leading-tight">{insight.value}</p>
                    </div>
                    <span
                      className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                        insight.changeType === "up"
                          ? "bg-green-500/10 text-green-600"
                          : insight.changeType === "down"
                            ? "bg-red-500/10 text-red-600"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {insight.change}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Divider */}
            <div className="px-8">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Insights</h2>
                <div className="flex-1 h-px bg-border" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
                  onClick={() => refetch?.()}
                >
                  <RefreshCw className="w-3 h-3" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Insight cards */}
            <div className="px-8 pb-10">
              <div className="max-w-3xl space-y-5">
                {insights.map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
                  >
                    <InsightCardComponent insight={insight} />
                  </motion.div>
                ))}
              </div>
            </div>
          </main>
        ) : (
          <EmptyStateConnect />
        )}
      </div>

      {/* Chat sidebar */}
      <ChatSidebar />
    </div>
  );
}
