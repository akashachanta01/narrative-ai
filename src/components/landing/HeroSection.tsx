import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
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
              <span className="text-primary">★</span> Trusted by 500+ businesses
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
          className="flex justify-center mb-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
        >
          <Button size="lg" className="text-base px-10 h-12 rounded-lg" asChild>
            <Link to="/auth">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
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

        {/* Rich dashboard preview — inspired by DataFast */}
        <motion.div
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <div className="rounded-xl border border-border bg-card shadow-xl overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/40">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-background text-xs text-muted-foreground border border-border">
                  app.databrief.io/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard toolbar */}
            <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">D</span>
                </div>
                <span className="text-sm font-semibold text-foreground">My Store</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground px-3 py-1.5 rounded-md border border-border bg-background">Last 30 days</span>
                <span className="text-xs text-muted-foreground px-3 py-1.5 rounded-md border border-border bg-background">Daily</span>
              </div>
            </div>

            {/* Metrics ribbon */}
            <div className="px-6 py-4 grid grid-cols-3 sm:grid-cols-6 gap-4 border-b border-border/30">
              {[
                { label: "Visitors", value: "24.8K", change: "+12.4%", up: true },
                { label: "Revenue", value: "$18,240", change: "+8.2%", up: true },
                { label: "Conv. Rate", value: "3.2%", change: "+0.4%", up: true },
                { label: "Rev/Visitor", value: "$0.74", change: "-5.1%", up: false },
                { label: "Bounce Rate", value: "38%", change: "-2.1%", up: true },
                { label: "Avg. Session", value: "4m 12s", change: "+18%", up: true },
              ].map((m, i) => (
                <div key={i} className="text-center sm:text-left">
                  <p className="text-[10px] text-muted-foreground mb-0.5">{m.label}</p>
                  <p className="text-sm sm:text-base font-bold text-foreground leading-tight">{m.value}</p>
                  <p className={`text-[10px] font-medium ${m.up ? "text-emerald-500" : "text-destructive"}`}>
                    {m.change} {m.up ? "↑" : "↓"}
                  </p>
                </div>
              ))}
            </div>

            {/* Chart area */}
            <div className="px-6 py-5">
              <div className="h-36 sm:h-44 relative">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-muted-foreground pr-2">
                  <span>800</span>
                  <span>600</span>
                  <span>400</span>
                  <span>200</span>
                  <span>0</span>
                </div>
                {/* Grid lines */}
                <div className="ml-6 h-full flex flex-col justify-between">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-t border-border/40 w-full" />
                  ))}
                </div>
                {/* Line chart SVG */}
                <svg className="absolute inset-0 ml-6" viewBox="0 0 600 160" preserveAspectRatio="none" fill="none">
                  <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(220 65% 48%)" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="hsl(220 65% 48%)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <path
                    d="M0,120 C30,110 60,95 100,80 C140,65 170,90 220,60 C270,30 310,45 360,35 C410,25 440,55 480,40 C520,25 560,15 600,20 L600,160 L0,160Z"
                    fill="url(#chartFill)"
                  />
                  {/* Line */}
                  <path
                    d="M0,120 C30,110 60,95 100,80 C140,65 170,90 220,60 C270,30 310,45 360,35 C410,25 440,55 480,40 C520,25 560,15 600,20"
                    stroke="hsl(220 65% 48%)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Revenue bars */}
                  {[50, 130, 200, 280, 350, 420, 490, 560].map((x, i) => {
                    const heights = [30, 55, 40, 70, 45, 60, 75, 50];
                    return (
                      <rect
                        key={i}
                        x={x - 8}
                        y={160 - heights[i]}
                        width="16"
                        rx="3"
                        height={heights[i]}
                        fill="hsl(25 90% 55%)"
                        opacity="0.7"
                      />
                    );
                  })}
                </svg>
              </div>
              {/* X-axis labels */}
              <div className="ml-6 flex justify-between mt-2 text-[9px] text-muted-foreground">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>

            {/* AI Insight bar at bottom */}
            <div className="px-6 pb-5">
              <div className="p-3.5 rounded-lg border border-primary/20 bg-primary/5 flex items-start gap-3">
                <span className="text-base mt-0.5">💡</span>
                <div>
                  <p className="text-xs font-semibold text-primary mb-0.5">AI Insight</p>
                  <p className="text-xs text-foreground leading-relaxed">
                    Your Instagram campaign drove 40% of new visitors this week. Revenue per visitor from that channel is 2.3× higher than average — consider increasing ad spend there.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative glow */}
          <div className="absolute -inset-6 -z-10 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
