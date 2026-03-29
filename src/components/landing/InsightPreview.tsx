import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Connect your tools",
    description: "One-click integrations with GA4, Shopify, Meta Ads, Stripe, and more. No engineering required.",
  },
  {
    number: "02",
    title: "Ask anything",
    description: "\"Why did revenue drop last Tuesday?\" Type it like you'd ask a colleague. Get a real, sourced answer.",
  },
  {
    number: "03",
    title: "Act on insights",
    description: "Every insight includes a concrete recommendation. No more staring at charts wondering what to do.",
  },
];

const InsightPreview = () => {
  return (
    <section className="py-24 sm:py-28">
      <div className="container px-6 max-w-5xl mx-auto">
        <motion.div
          className="mb-16 max-w-xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold text-accent mb-3 tracking-[0.15em] uppercase font-sans">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground font-sans">
            Three steps to clarity
          </h2>
          <p className="text-base text-muted-foreground font-sans">
            No learning curve. No SQL. No consultants.
          </p>
        </motion.div>

        <div className="space-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="flex gap-6 sm:gap-10 py-8 border-t border-border group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <span className="text-3xl sm:text-4xl font-bold text-border group-hover:text-accent transition-colors font-sans shrink-0">
                {step.number}
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 font-sans">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md font-sans">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InsightPreview;
