import { motion } from "framer-motion";
import { Link2, MessageSquareText, Zap, BarChart3, Bell, Shield } from "lucide-react";

const features = [
  {
    icon: <Link2 className="w-5 h-5" />,
    title: "Connect in one click",
    description: "GA4, Shopify, Meta Ads, Stripe — link your tools and see unified data in seconds. No code, no consultants.",
  },
  {
    icon: <MessageSquareText className="w-5 h-5" />,
    title: "Ask questions, get answers",
    description: "Type 'Why did my revenue drop?' and get a clear, data-backed explanation — not another chart to decode.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Instant action items",
    description: "Every insight comes with a concrete next step. Know exactly what to do and why it matters.",
  },
  {
    icon: <Bell className="w-5 h-5" />,
    title: "Proactive alerts",
    description: "Don't wait to discover problems. DataBrief flags anomalies and opportunities the moment they appear.",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Metrics that matter",
    description: "Stop drowning in data. See only the KPIs that move your business — sessions, revenue, ROAS, and more.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Enterprise-grade security",
    description: "Your data stays yours. SOC 2 compliant infrastructure with end-to-end encryption and granular access controls.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24">
      <div className="container px-6 max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
            Everything you need to understand your data
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Built for business owners who want answers, not a degree in analytics.
          </p>
        </motion.div>

        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-accent-foreground">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
