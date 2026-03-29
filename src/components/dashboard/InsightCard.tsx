import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { InsightCard } from "@/lib/mockInsights";

export function InsightCardComponent({ insight }: { insight: InsightCard }) {
  const Icon = insight.icon;
  const ChangeIcon =
    insight.changeType === "up" ? TrendingUp : insight.changeType === "down" ? TrendingDown : Minus;

  return (
    <div className="glass-card p-6 space-y-4 hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <Icon className={`w-5 h-5 ${insight.iconColor}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{insight.metric}</p>
            <p className="text-2xl font-bold text-foreground">{insight.value}</p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
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
      <p className="text-sm leading-relaxed text-foreground/80">{insight.narrative}</p>

      {/* Source */}
      <div className="pt-2 border-t border-border">
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          {insight.source}
        </span>
      </div>
    </div>
  );
}
