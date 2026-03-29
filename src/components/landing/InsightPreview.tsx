import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, AlertCircle, ArrowUpRight } from "lucide-react";

interface InsightCardProps {
  icon: React.ReactNode;
  metric: string;
  value: string;
  change: string;
  isPositive: boolean;
  narrative: string;
  recommendation: string;
  delay: number;
}

const InsightCard = ({ icon, metric, value, change, isPositive, narrative, recommendation, delay }: InsightCardProps) => (
  <motion.div
    className="glass-card p-6 space-y-4"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-accent-foreground">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{metric}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
        </div>
      </div>
      <span className={`text-sm font-medium flex items-center gap-1 ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
        {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        {change}
      </span>
    </div>
    <div className="space-y-2 pt-2 border-t border-border">
      <p className="text-sm text-foreground leading-relaxed">{narrative}</p>
      <p className="text-sm text-primary font-medium flex items-center gap-1">
        <ArrowUpRight className="w-3.5 h-3.5" />
        {recommendation}
      </p>
    </div>
  </motion.div>
);

const InsightPreview = () => {
  const insights = [
    {
      icon: <AlertCircle className="w-5 h-5" />,
      metric: "Checkout Dropoff",
      value: "34%",
      change: "+8% this week",
      isPositive: false,
      narrative: "Checkout abandonment spiked after Tuesday's payment page update. Mobile users are 3x more likely to drop off at the shipping step.",
      recommendation: "Simplify the mobile shipping form to a single step.",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      metric: "Organic Traffic",
      value: "12.4K",
      change: "+23% vs last month",
      isPositive: true,
      narrative: "Your blog post on 'sustainable packaging' is driving 40% of new organic visitors. Google ranks it #3 for the target keyword.",
      recommendation: "Create 2 more posts in this topic cluster to capture related searches.",
    },
    {
      icon: <TrendingDown className="w-5 h-5" />,
      metric: "Instagram ROAS",
      value: "1.2x",
      change: "-0.8x vs goal",
      isPositive: false,
      narrative: "Instagram ad spend increased 50% but conversions stayed flat. The 'Summer Collection' creative has a 0.3% CTR — well below the 1.2% benchmark.",
      recommendation: "Pause the underperforming creative and A/B test UGC-style imagery.",
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="container px-6 max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Insights, not dashboards
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Three cards. Three actions. That's all you need to start your day.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {insights.map((insight, i) => (
            <InsightCard key={i} {...insight} delay={i * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InsightPreview;
