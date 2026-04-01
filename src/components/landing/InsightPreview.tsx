import { motion } from "framer-motion";
import { PlugZap, MessageSquare, Lightbulb } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: PlugZap,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/15",
    title: "Connect your tools",
    description:
      "One-click integrations with GA4, Shopify, Meta Ads, Stripe, and more. No engineering required.",
    accentColor: "hsl(217 91% 60%)",
  },
  {
    number: "02",
    icon: MessageSquare,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/15",
    title: "Ask anything",
    description:
      '"Why did revenue drop last Tuesday?" Type it like you\'d ask a colleague. Get a real, sourced answer.',
    accentColor: "hsl(263 70% 60%)",
  },
  {
    number: "03",
    icon: Lightbulb,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/15",
    title: "Act on insights",
    description:
      "Every insight includes a concrete recommendation. No more staring at charts wondering what to do.",
    accentColor: "hsl(43 96% 56%)",
  },
];

const InsightPreview = () => {
  return (
    <section className="py-16 sm:py-24" id="how-it-works">
      <div className="container px-6 max-w-5xl mx-auto">
        <motion.div
          className="mb-14 max-w-xl mx-auto text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold text-accent mb-3 tracking-[0.15em] uppercase font-sans">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground font-sans">
            Three steps to clarity
          </h2>
          <p className="text-base text-muted-foreground font-sans">
            No learning curve. No SQL. No consultants.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-[52px] left-[calc(16.666%+28px)] right-[calc(16.666%+28px)] h-px bg-gradient-to-r from-border via-border/60 to-border z-0" />

          <div className="grid gap-8 md:grid-cols-3 relative z-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.12 }}
                >
                  {/* Icon circle */}
                  <div className="relative mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${step.iconBg} ring-1 ring-border/40 shadow-sm`}
                    >
                      <Icon className={`w-6 h-6 ${step.iconColor}`} />
                    </div>
                    {/* Step number badge */}
                    <div
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: step.accentColor }}
                    >
                      {i + 1}
                    </div>
                  </div>

                  {/* Step number label */}
                  <span className="inline-block text-xs font-bold tracking-[0.15em] uppercase mb-3 font-sans"
                    style={{ color: step.accentColor }}>
                    Step {step.number}
                  </span>

                  <h3 className="text-lg font-semibold text-foreground mb-2 font-sans">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto font-sans">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom callout */}
        <motion.div
          className="mt-16 rounded-2xl border border-border/50 bg-card p-8 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-2xl mb-3">💬</div>
          <blockquote className="text-base sm:text-lg text-foreground font-medium mb-3 font-sans leading-relaxed">
            "Why did my revenue drop on Tuesday?"
          </blockquote>
          <div
            className="inline-flex items-start gap-3 rounded-xl border px-4 py-3 text-left max-w-md mx-auto"
            style={{
              background: "hsl(230 65% 56% / 0.07)",
              borderColor: "hsl(230 65% 56% / 0.2)",
            }}
          >
            <span className="text-accent mt-0.5 shrink-0">✨</span>
            <p className="text-sm text-muted-foreground leading-relaxed font-sans">
              Revenue dropped 18% on Tuesday due to a broken checkout form affecting mobile users.
              Meta Ads traffic was up 22% that day, meaning you paid for visitors who couldn't convert.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InsightPreview;
