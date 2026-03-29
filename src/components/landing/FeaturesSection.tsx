import { motion } from "framer-motion";
import { Link2, MessageSquareText, Zap, BarChart3, Bell, Shield } from "lucide-react";

const features = [
  {
    icon: <Link2 className="w-5 h-5" />,
    title: "One-click connections",
    description: "GA4, Shopify, Meta Ads, Stripe — link your tools and see unified data in seconds.",
  },
  {
    icon: <MessageSquareText className="w-5 h-5" />,
    title: "Natural language queries",
    description: "Ask 'Why did my revenue drop?' and get a clear, sourced answer — not another chart.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Actionable recommendations",
    description: "Every insight includes a concrete next step. Know what to do and why it matters.",
  },
  {
    icon: <Bell className="w-5 h-5" />,
    title: "Proactive anomaly alerts",
    description: "DataBrief flags problems and opportunities the moment they appear — before you notice.",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "KPIs that matter",
    description: "Cut through the noise. See sessions, revenue, ROAS, and the metrics that move your business.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Enterprise-grade security",
    description: "SOC 2 compliant, end-to-end encryption, and granular access controls. Your data stays yours.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 sm:py-28 bg-secondary/50">
      <div className="container px-6 max-w-5xl mx-auto">
        <motion.div
          className="mb-16 max-w-xl mx-auto text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold text-accent mb-3 tracking-[0.15em] uppercase font-sans">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground font-sans">
            Built for people who run businesses, not SQL queries
          </h2>
        </motion.div>

        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="space-y-3 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-foreground font-sans">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
