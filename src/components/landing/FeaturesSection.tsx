import { motion } from "framer-motion";
import { Link2, Sparkles, Zap, BarChart3, Bell, Layers } from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Windsor.ai integration",
    description: "Connect GA4, Shopify, and Stripe through Windsor.ai with a single API key. All your marketing data in one place.",
    gradient: "from-blue-500/20 to-blue-500/5",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    borderHover: "hover:border-blue-500/30",
  },
  {
    icon: Sparkles,
    title: "AI-powered briefs",
    description: "Get a daily AI verdict on your marketing performance — what's working, what's not, and exactly what to do about it.",
    gradient: "from-violet-500/20 to-violet-500/5",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    borderHover: "hover:border-violet-500/30",
  },
  {
    icon: Zap,
    title: "Actionable recommendations",
    description: "Every alert and insight includes a concrete next step. Know what to do and why it matters.",
    gradient: "from-amber-500/20 to-amber-500/5",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
    borderHover: "hover:border-amber-500/30",
  },
  {
    icon: Bell,
    title: "Smart alerts",
    description: "DataBrief flags critical drops, warnings, and opportunities the moment they appear in your data.",
    gradient: "from-pink-500/20 to-pink-500/5",
    iconBg: "bg-pink-500/15",
    iconColor: "text-pink-400",
    borderHover: "hover:border-pink-500/30",
  },
  {
    icon: BarChart3,
    title: "KPIs that matter",
    description: "Sessions, revenue, ROAS, conversion rate — the metrics that move your business, surfaced automatically.",
    gradient: "from-emerald-500/20 to-emerald-500/5",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    borderHover: "hover:border-emerald-500/30",
  },
  {
    icon: Layers,
    title: "Source-aware insights",
    description: "Dashboard dynamically adapts based on your connected sources — GA4-only or multi-platform, it adjusts automatically.",
    gradient: "from-cyan-500/20 to-cyan-500/5",
    iconBg: "bg-cyan-500/15",
    iconColor: "text-cyan-400",
    borderHover: "hover:border-cyan-500/30",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-secondary/40">
      <div className="container px-6 max-w-6xl mx-auto">
        <motion.div
          className="mb-14 max-w-xl mx-auto text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold text-accent mb-3 tracking-[0.15em] uppercase font-sans">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground font-sans">
            Built for people who run businesses,
            <br className="hidden sm:block" /> not SQL queries
          </h2>
          <p className="text-base text-muted-foreground font-sans">
            Everything you need to go from raw data to confident decisions.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                className={`relative group rounded-2xl border border-border/50 bg-card p-6 space-y-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${feature.borderHover}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                />

                <div className="relative">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${feature.iconBg} ring-1 ring-border/30 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                  </div>
                </div>

                <div className="relative space-y-2">
                  <h3 className="text-base font-semibold text-foreground font-sans">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
