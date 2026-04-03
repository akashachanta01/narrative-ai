import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const PricingSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-secondary/40">
      <div className="container px-6 max-w-3xl mx-auto">
        <motion.div
          className="mb-14 max-w-xl mx-auto text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold text-accent mb-3 tracking-[0.15em] uppercase font-sans">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground font-sans">
            Free during early access
          </h2>
          <p className="text-base text-muted-foreground font-sans">
            Get full access while we're building. Paid plans coming soon.
          </p>
        </motion.div>

        <motion.div
          className="relative rounded-2xl border border-accent/60 bg-card shadow-xl shadow-accent/10 p-8 space-y-6 max-w-md mx-auto"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <div
            className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
            style={{ background: "linear-gradient(90deg, transparent, hsl(230 65% 56%), transparent)" }}
          />
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold font-sans shadow-sm">
            <Sparkles className="w-3 h-3" />
            Early Access
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 font-sans">
              Full Access
            </p>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-4xl font-bold text-foreground font-sans">$0</span>
              <span className="text-muted-foreground text-sm font-sans">during early access</span>
            </div>
            <p className="text-sm text-muted-foreground font-sans">Everything included, no limits.</p>
          </div>

          <div className="space-y-3">
            {[
              "Connect GA4, Shopify & Stripe via Windsor.ai",
              "AI-generated daily briefs",
              "Smart alerts & recommendations",
              "7, 30, and 90-day date ranges",
              "Source-specific insights",
              "Unlimited refreshes",
            ].map((feature, j) => (
              <div key={j} className="flex items-center gap-3 text-sm font-sans">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-accent/15">
                  <Check className="w-3 h-3 text-accent" />
                </div>
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>

          <Button
            size="lg"
            className="w-full h-11 rounded-xl text-sm font-semibold font-sans bg-accent text-accent-foreground hover:bg-accent/90 shadow-md shadow-accent/20 hover:shadow-accent/40"
            asChild
          >
            <Link to="/auth">Get Started Free</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
