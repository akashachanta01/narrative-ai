import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const TestimonialsSection = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container px-6 max-w-4xl mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold mb-6 text-accent tracking-wide font-sans">
            <Sparkles className="w-3 h-3" />
            Early access
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground font-sans">
            Be among the first to try DataBrief
          </h2>
          <p className="text-base text-muted-foreground font-sans max-w-lg mx-auto mb-8">
            We're building DataBrief in the open with early users. Connect your data, get AI-powered insights, and help shape the product.
          </p>

          <div className="grid gap-5 md:grid-cols-3 text-left">
            {[
              { emoji: "⚡", title: "Instant setup", desc: "Enter your Windsor.ai API key and see your first AI brief in under 2 minutes." },
              { emoji: "🎯", title: "Real insights", desc: "No generic dashboards — every insight is generated from your actual marketing data." },
              { emoji: "🆓", title: "Free during early access", desc: "Full access to all features while we're in early access. No credit card required." },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-2xl border border-border/50 bg-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="text-2xl mb-3">{item.emoji}</div>
                <h3 className="text-base font-semibold text-foreground mb-2 font-sans">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-sans">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
