import { motion } from "framer-motion";
import { MessageSquareText, Link2, Zap } from "lucide-react";

const features = [
  {
    icon: <MessageSquareText className="w-6 h-6" />,
    title: "Conversational Analytics",
    description: "Ask 'Why did my traffic drop?' and get a plain-English answer with data-backed reasoning — no SQL required.",
  },
  {
    icon: <Link2 className="w-6 h-6" />,
    title: "One-Click Connections",
    description: "Connect GA4, Shopify, Meta Ads, and more through our data bridge. Your metrics, normalized and ready in seconds.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Proactive Insights",
    description: "Don't wait to ask. NarrativeMetrics surfaces anomalies and opportunities the moment they happen.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container px-6 max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Your data, your language
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Built for business owners who want answers, not charts.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="glass-card p-8 text-center space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
