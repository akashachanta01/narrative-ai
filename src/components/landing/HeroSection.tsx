import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, MessageSquare, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 hero-glow" />

      <div className="container relative z-10 px-6 py-20 sm:py-28 max-w-5xl mx-auto">
        {/* Social proof badge */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-card text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="text-amber-500">★</span> Trusted by 500+ businesses
            </span>
            <span className="w-px h-4 bg-border" />
            <span>No credit card required</span>
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12] mb-6 text-center text-foreground"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          Your data, explained in
          <br />
          <span className="gradient-text">plain English</span>
        </motion.h1>

        <motion.p
          className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Connect your tools, ask a question, get a clear answer.
          DataBrief turns complex analytics into actionable insights
          your whole team can understand.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center mb-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
        >
          <Button size="lg" className="text-base px-8 h-12 rounded-lg" asChild>
            <Link to="/auth">
              Try It Free
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="text-base px-8 h-12 rounded-lg">
            Book a Demo
          </Button>
        </motion.div>

        <motion.p
          className="text-sm text-muted-foreground text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Free-forever plan available · Setup in 2 minutes
        </motion.p>

        {/* Product preview mockup */}
        <motion.div
          className="relative max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-background text-xs text-muted-foreground border border-border">
                  app.databrief.io/dashboard
                </div>
              </div>
            </div>

            {/* Fake dashboard content */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Good morning, Sarah</p>
                  <p className="text-sm font-semibold text-foreground">Here's what happened overnight</p>
                </div>
                <div className="text-xs px-3 py-1 rounded-full bg-accent text-accent-foreground font-medium">
                  3 new insights
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Sessions", value: "12.4K", change: "+18%", positive: true, icon: BarChart3 },
                  { label: "Conversions", value: "342", change: "+7%", positive: true, icon: Zap },
                  { label: "Bounce Rate", value: "34%", change: "+3%", positive: false, icon: MessageSquare },
                ].map((stat, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <div className="flex items-center gap-1.5 mb-2">
                      <stat.icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                    <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                    <span className={`text-xs font-medium ${stat.positive ? "text-emerald-600" : "text-red-500"}`}>
                      {stat.change}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                <p className="text-xs font-medium text-primary mb-1">💡 Insight</p>
                <p className="text-sm text-foreground leading-relaxed">
                  Your blog post "10 Tips for Better Email Open Rates" drove 40% of new sessions this week.
                  Consider creating a follow-up piece to capture related search traffic.
                </p>
              </div>
            </div>
          </div>

          {/* Decorative glow behind the card */}
          <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
