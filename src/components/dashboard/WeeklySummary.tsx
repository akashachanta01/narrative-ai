import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronRight, RefreshCw, TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateInsights, type DynamicInsight } from "@/lib/generateInsights";
import type { WindsorSummary } from "@/lib/windsorTypes";

interface WeeklySummaryProps {
  data: WindsorSummary;
}

function getWeekLabel(): string {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

function getWeekSeed(): string {
  const now = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((now.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNum}`;
}

const ChangeIcon = ({ type }: { type: "up" | "down" | "neutral" }) => {
  if (type === "up") return <TrendingUp className="w-3.5 h-3.5 text-green-500" />;
  if (type === "down") return <TrendingDown className="w-3.5 h-3.5 text-red-400" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
};

export function WeeklySummary({ data }: WeeklySummaryProps) {
  const [expanded, setExpanded] = useState(false);
  const [seed, setSeed] = useState(getWeekSeed);

  const insights = useMemo(() => {
    // Re-derive when seed changes (regenerate)
    void seed;
    return generateInsights(data);
  }, [data, seed]);

  const topInsights = expanded ? insights : insights.slice(0, 2);

  if (!insights.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl p-5 relative overflow-hidden"
    >
      {/* Decorative glow */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Weekly Summary</h3>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {getWeekLabel()}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => setSeed(`${getWeekSeed()}-${Date.now()}`)}
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Insight bullets */}
      <div className="space-y-3 relative z-10">
        <AnimatePresence mode="popLayout">
          {topInsights.map((insight, i) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              className="flex gap-3 items-start"
            >
              <div className="mt-0.5 shrink-0 w-6 h-6 rounded-md bg-muted/50 flex items-center justify-center">
                <ChangeIcon type={insight.changeType} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-foreground">{insight.metric}</span>
                  <span className={`text-[11px] font-mono ${
                    insight.changeType === "up"
                      ? "text-green-500"
                      : insight.changeType === "down"
                        ? "text-red-400"
                        : "text-muted-foreground"
                  }`}>
                    {insight.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {insight.narrative}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Expand / collapse */}
      {insights.length > 2 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors relative z-10"
        >
          {expanded ? "Show less" : `Show all ${insights.length} insights`}
          <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
        </button>
      )}
    </motion.div>
  );
}
