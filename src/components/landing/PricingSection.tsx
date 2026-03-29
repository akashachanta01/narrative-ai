import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For solo founders getting started",
    features: [
      "1 data source",
      "5 insights per day",
      "7-day data history",
      "Community support",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$79",
    period: "/month",
    description: "For growing teams that need answers",
    features: [
      "Unlimited data sources",
      "Unlimited insights",
      "90-day data history",
      "Daily anomaly alerts",
      "Priority support",
      "Team sharing",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
];

const PricingSection = () => {
  return (
    <section className="py-14 sm:py-18 bg-secondary/50">
      <div className="container px-6 max-w-4xl mx-auto">
        <motion.div
          className="mb-10 max-w-xl mx-auto text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold text-accent mb-3 tracking-[0.15em] uppercase font-sans">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground font-sans">
            Simple, honest pricing
          </h2>
          <p className="text-base text-muted-foreground font-sans">
            Start free. Upgrade when you're ready. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              className={`rounded-xl border p-8 space-y-6 ${
                plan.highlighted
                  ? "border-accent bg-card shadow-md relative"
                  : "border-border bg-card"
              }`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium font-sans">
                  Most popular
                </div>
              )}

              <div>
                <p className="text-sm font-semibold text-foreground mb-1 font-sans">{plan.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground font-sans">{plan.price}</span>
                  <span className="text-muted-foreground text-sm font-sans">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-sans">{plan.description}</p>
              </div>

              <div className="space-y-3">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-2.5 text-sm font-sans">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                variant={plan.highlighted ? "default" : "outline"}
                size="lg"
                className={`w-full h-11 rounded-lg text-sm font-sans ${plan.highlighted ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}`}
                asChild
              >
                <Link to="/auth">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8 font-sans">
          14-day free trial on Growth · No credit card required
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
