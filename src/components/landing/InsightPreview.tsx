import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Connect",
    description: "Link your marketing and sales tools with one-click integrations. GA4, Shopify, Meta Ads, Stripe, and more.",
  },
  {
    number: "02",
    title: "Ask",
    description: "Type a question in plain English — like \"Why did my revenue drop last week?\" — and get a real answer.",
  },
  {
    number: "03",
    title: "Act",
    description: "Every insight includes a recommended next step. No more guessing what to do with the data.",
  },
];

const InsightPreview = () => {
  return (
    <section className="py-24 bg-secondary/40">
      <div className="container px-6 max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
            From raw data to clear decisions
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Three steps. No learning curve. No technical setup.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="relative"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
            >
              <div className="p-6 rounded-xl bg-card border border-border space-y-4 h-full">
                <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              {/* Arrow connector */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-5 -translate-y-1/2 z-10">
                  <ArrowRight className="w-4 h-4 text-muted-foreground/40" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InsightPreview;
