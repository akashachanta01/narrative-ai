import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const features = [
  "Unlimited narrative insights",
  "GA4 + Shopify + Meta Ads",
  "Conversational chat interface",
  "Daily anomaly alerts",
  "10 Premium Insight credits/mo",
  "Priority support",
];

const PricingSection = () => {
  return (
    <section className="py-24">
      <div className="container px-6 max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            One plan. Everything included. Cancel anytime.
          </p>
        </motion.div>

        <motion.div
          className="glass-card p-10 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/60" />
          <p className="text-sm font-medium text-primary mb-2">Growth Plan</p>
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-5xl font-bold tracking-tight">$79</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <p className="text-muted-foreground mb-8">14-day free trial · No credit card required</p>

          <div className="grid sm:grid-cols-2 gap-3 text-left max-w-md mx-auto mb-10">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <Button variant="hero" size="lg" className="text-base px-10 py-6 rounded-xl">
            Start Free Trial
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
