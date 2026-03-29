import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="hero-dark relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        background: "radial-gradient(ellipse at 50% 0%, hsl(230 65% 56%), transparent 70%)"
      }} />

      <div className="container relative z-10 px-6 pt-20 pb-14 sm:pt-24 sm:pb-18 max-w-5xl mx-auto text-center">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 text-xs font-sans mb-8" style={{ color: "hsl(var(--hero-muted))" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Now in public beta — free to use
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.1] mb-6 font-sans">
            Stop guessing.
            <br />
            <span style={{ color: "hsl(var(--hero-muted))" }}>Start knowing.</span>
          </h1>

          <p className="text-base sm:text-lg leading-relaxed max-w-lg mx-auto mb-10 font-sans" style={{ color: "hsl(var(--hero-muted))" }}>
            DataBrief connects your marketing and sales tools, then tells you
            what happened, why it happened, and what to do next — in plain English.
          </p>

          <div className="flex items-center justify-center gap-4 mb-6 font-sans">
            <Button size="lg" className="text-sm px-8 h-11 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link to="/auth">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <span className="text-xs" style={{ color: "hsl(var(--hero-muted))" }}>
              No credit card required
            </span>
          </div>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          className="relative mt-10 sm:mt-14 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl" style={{ background: "hsl(220 18% 11%)" }}>
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(0 72% 51%)" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(45 90% 55%)" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(140 60% 45%)" }} />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded text-[11px] border border-white/5 font-sans" style={{ color: "hsl(var(--hero-muted))", background: "hsl(220 20% 8%)" }}>
                  app.databrief.io
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5 font-sans">
                  <div className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-accent">D</span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "hsl(var(--hero-fg))" }}>My Store</span>
                </div>
                <div className="flex items-center gap-2 font-sans">
                  <span className="text-[11px] px-2.5 py-1 rounded border border-white/8" style={{ color: "hsl(var(--hero-muted))" }}>Last 30 days</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                {[
                  { label: "Visitors", value: "24.8K", change: "+12.4%", up: true },
                  { label: "Revenue", value: "$18,240", change: "+8.2%", up: true },
                  { label: "Conversion", value: "3.2%", change: "+0.4%", up: true },
                  { label: "Bounce Rate", value: "38%", change: "-2.1%", up: true },
                ].map((m, i) => (
                  <div key={i} className="p-3 rounded-lg border border-white/5 font-sans" style={{ background: "hsl(220 20% 8%)" }}>
                    <p className="text-[10px] mb-1" style={{ color: "hsl(var(--hero-muted))" }}>{m.label}</p>
                    <p className="text-lg font-bold" style={{ color: "hsl(var(--hero-fg))" }}>{m.value}</p>
                    <p className={`text-[10px] font-medium ${m.up ? "text-emerald-400" : "text-red-400"}`}>
                      {m.change}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-white/5 p-4 mb-5" style={{ background: "hsl(220 20% 8%)" }}>
                <div className="flex items-center justify-between mb-3 font-sans">
                  <span className="text-xs font-medium" style={{ color: "hsl(var(--hero-fg))" }}>Traffic & Revenue</span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[10px]" style={{ color: "hsl(var(--hero-muted))" }}>
                      <span className="w-2 h-2 rounded-full bg-accent" /> Revenue
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px]" style={{ color: "hsl(var(--hero-muted))" }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: "hsl(170 50% 50%)" }} /> Visitors
                    </span>
                  </div>
                </div>
                <svg className="w-full" viewBox="0 0 600 120" fill="none">
                  <defs>
                    <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(170 50% 50%)" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="hsl(170 50% 50%)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 30, 60, 90, 120].map((y) => (
                    <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="white" strokeOpacity="0.04" />
                  ))}
                  <path d="M0,90 C40,85 80,70 120,65 C160,60 200,75 260,50 C320,25 370,35 420,28 C470,20 520,40 560,30 C580,25 600,20 600,18 L600,120 L0,120Z" fill="url(#areaFill)" />
                  <path d="M0,90 C40,85 80,70 120,65 C160,60 200,75 260,50 C320,25 370,35 420,28 C470,20 520,40 560,30 C580,25 600,20 600,18" stroke="hsl(170 50% 50%)" strokeWidth="2" strokeLinecap="round" />
                  {[40, 110, 180, 250, 320, 390, 460, 530].map((x, i) => {
                    const h = [28, 42, 35, 55, 38, 48, 58, 44][i];
                    return <rect key={i} x={x} y={120 - h} width="20" rx="3" height={h} fill="hsl(230 65% 56%)" opacity="0.75" />;
                  })}
                </svg>
              </div>

              <div className="rounded-lg border border-accent/20 p-3.5 flex items-start gap-3 font-sans" style={{ background: "hsl(230 65% 56% / 0.08)" }}>
                <span className="text-sm mt-0.5">💡</span>
                <div>
                  <p className="text-[11px] font-semibold text-accent mb-0.5">AI Insight</p>
                  <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--hero-muted))" }}>
                    Instagram drove 40% of new visitors this week with 2.3× higher revenue per visitor. Consider increasing spend on that channel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Integration logos */}
        <motion.div
          className="mt-10 font-sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-[11px] uppercase tracking-[0.15em] mb-5" style={{ color: "hsl(var(--hero-muted))" }}>
            Works with
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10" style={{ color: "hsl(var(--hero-muted))" }}>
            {["Google Analytics", "Shopify", "Stripe", "Meta Ads", "TikTok", "HubSpot"].map((name) => (
              <span key={name} className="text-sm font-medium opacity-50 hover:opacity-80 transition-opacity cursor-default">
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
