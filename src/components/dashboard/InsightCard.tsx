import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import type { InsightCard } from "@/lib/mockInsights";
import type { DynamicInsight } from "@/lib/generateInsights";

type InsightProps = InsightCard | DynamicInsight;

export function InsightCardComponent({ insight }: { insight: InsightProps }) {
  const Icon = insight.icon;
  const ChangeIcon =
    insight.changeType === "up" ? TrendingUp : insight.changeType === "down" ? TrendingDown : Minus;

  return (
    <div className="group relative rounded-2xl border border-border/60 bg-card p-6 space-y-4 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-default">
      {/* Subtle gradient accent on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-primary/[0.02] to-transparent" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center ring-1 ring-border/40">
              <Icon className={`w-5 h-5 ${insight.iconColor}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{insight.metric}</p>
              <p className="text-2xl font-bold text-foreground tracking-tight">{insight.value}</p>
            </div>
          </div>
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
              insight.changeType === "up"
                ? "bg-green-500/10 text-green-600"
                : insight.changeType === "down"
                  ? "bg-red-500/10 text-red-600"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            <ChangeIcon className="w-3 h-3" />
            {insight.change}
          </div>
        </div>

        {/* Narrative */}
        <p className="text-sm leading-relaxed text-foreground/75 mt-4">{insight.narrative}</p>

        {/* Footer */}
        <div className="pt-4 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full uppercase tracking-wider">
            {insight.source}
          </span>
          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            Explore <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
