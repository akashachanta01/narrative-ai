import { useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import type { WindsorSummary } from "@/lib/windsorTypes";
import { generateInsights, type DynamicInsight } from "@/lib/generateInsights";
import { Sparkline } from "./Sparkline";

interface Props {
  data: WindsorSummary;
}

export function InsightCards({ data }: Props) {
  const insights = useMemo(() => generateInsights(data).slice(0, 3), [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
}

function InsightCard({ insight }: { insight: DynamicInsight }) {
  const Icon = insight.icon;
  const ChangeIcon =
    insight.changeType === "up" ? TrendingUp : insight.changeType === "down" ? TrendingDown : Minus;

  return (
    <div className="group relative rounded-2xl p-5 space-y-3 cursor-default transition-all duration-300 hover:shadow-lg hover:shadow-[hsl(var(--glass-shadow))] backdrop-blur-xl bg-[hsl(var(--glass-bg))] border border-[hsl(var(--glass-border))] hover:border-primary/20">
      {/* Glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-primary/[0.04] to-transparent" />

      <div className="relative space-y-3">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent/80 backdrop-blur-sm flex items-center justify-center ring-1 ring-border/30">
              <Icon className={`w-4 h-4 ${insight.iconColor}`} />
            </div>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.1em]">
              {insight.metric}
            </span>
          </div>
          <div
            className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm ${
              insight.changeType === "up"
                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                : insight.changeType === "down"
                  ? "bg-red-500/10 text-red-600 dark:text-red-400"
                  : "bg-muted/60 text-muted-foreground"
            }`}
          >
            <ChangeIcon className="w-3 h-3" />
            {insight.change}
          </div>
        </div>

        {/* Value + sparkline */}
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold text-foreground tracking-tight">{insight.value}</span>
          {insight.sparkline.length > 1 && (
            <Sparkline data={insight.sparkline} width={72} height={28} />
          )}
        </div>

        {/* Narrative */}
        <p className="text-sm leading-relaxed text-foreground/70 line-clamp-2">{insight.narrative}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-semibold text-muted-foreground bg-muted/60 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-wider">
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
