import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";

const stats = [
  { value: "500+", label: "teams" },
  { value: "50M+", label: "insights generated" },
  { value: "100+", label: "integrations" },
];

const integrations = ["Google Analytics", "Shopify", "Stripe", "Meta Ads", "TikTok", "HubSpot"];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dot grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
        </svg>
        {/* Gradient orbs */}
        <div
          className="absolute -top-60 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-[0.09]"
          style={{ background: "radial-gradient(ellipse, hsl(230 65% 56%), transparent 65%)" }}
        />
        <div
          className="absolute top-1/2 -left-60 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, hsl(170 55% 50%), transparent 65%)" }}
        />
        <div
          className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, hsl(280 60% 60%), transparent 65%)" }}
        />
      </div>

      <div className="container relative z-10 px-6 pt-20 pb-14 sm:pt-28 sm:pb-20 max-w-6xl mx-auto">
        {/* Center text block */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold mb-8 text-accent tracking-wide font-sans">
              <Sparkles className="w-3 h-3" />
              Now in public beta — free to use
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-tight leading-[1.05] mb-6 font-sans text-foreground">
              Stop guessing.
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, hsl(230 65% 65%) 0%, hsl(170 60% 50%) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Start knowing.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl leading-relaxed max-w-xl mx-auto mb-10 font-sans text-muted-foreground">
              DataBrief connects your marketing and sales tools, then tells you what happened,
              why it happened, and what to do next — in plain English.
            </p>

            {/* Social proof stats */}
            <div className="flex items-center justify-center gap-10 sm:gap-16 mb-10 font-sans">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">{value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-16 font-sans">
              <Button
                size="lg"
                className="w-full sm:w-auto text-sm px-8 h-12 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/25 transition-all hover:shadow-accent/40 hover:scale-[1.02]"
                asChild
              >
                <Link to="/auth">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <a
                href="#how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-1.5"
              >
                See how it works
                <ChevronDown className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Dashboard mockup */}
        <motion.div
          className="relative max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.2 }}
        >
          {/* Glow behind mockup */}
          <div
            className="absolute inset-x-24 -top-8 h-32 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ background: "linear-gradient(135deg, hsl(230 65% 56%), hsl(170 55% 50%))" }}
          />

          <div
            className="relative rounded-2xl overflow-hidden border shadow-2xl shadow-black/30"
            style={{ background: "hsl(220 25% 9%)", borderColor: "hsl(220 15% 17%)" }}
          >
            {/* Browser chrome */}
            <div
              className="flex items-center gap-3 px-4 py-3 border-b"
              style={{ borderColor: "hsl(220 15% 16%)", background: "hsl(220 25% 8%)" }}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: "hsl(0 72% 60%)" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "hsl(45 90% 55%)" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "hsl(140 60% 50%)" }} />
              </div>
              <div className="flex-1 flex justify-center">
                <div
                  className="px-6 py-1.5 rounded-lg text-[11px] border font-mono"
                  style={{
                    color: "hsl(220 10% 55%)",
                    background: "hsl(220 22% 7%)",
                    borderColor: "hsl(220 15% 16%)",
                  }}
                >
                  app.databrief.io/dashboard
                </div>
              </div>
              <div className="flex items-center gap-1.5 opacity-0 sm:opacity-100">
                <div className="w-3 h-3 rounded-full" style={{ background: "hsl(220 15% 20%)" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "hsl(220 15% 20%)" }} />
              </div>
            </div>

            {/* App layout */}
            <div className="flex" style={{ minHeight: "420px" }}>
              {/* Sidebar */}
              <div
                className="hidden sm:flex w-52 shrink-0 border-r flex-col gap-0.5 p-3"
                style={{ borderColor: "hsl(220 15% 16%)", background: "hsl(220 22% 8%)" }}
              >
                {/* Brand */}
                <div className="flex items-center gap-2 px-2 py-2 mb-3">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center"
                    style={{ background: "hsl(230 65% 56%)" }}
                  >
                    <span className="text-[10px] font-bold text-white">D</span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "hsl(220 14% 92%)" }}>
                    DataBrief
                  </span>
                </div>
                {/* Nav */}
                {[
                  { label: "Overview", active: true },
                  { label: "Traffic", active: false },
                  { label: "Revenue", active: false },
                  { label: "Campaigns", active: false },
                  { label: "AI Insights", active: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium"
                    style={{
                      background: item.active ? "hsl(230 65% 56% / 0.15)" : "transparent",
                      color: item.active ? "hsl(230 65% 72%)" : "hsl(220 10% 52%)",
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: item.active ? "hsl(230 65% 62%)" : "transparent",
                      }}
                    />
                    {item.label}
                  </div>
                ))}
                <div className="flex-1" />
                {/* User */}
                <div className="flex items-center gap-2 px-2 py-2 mt-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: "hsl(230 65% 56% / 0.2)", color: "hsl(230 65% 72%)" }}
                  >
                    SC
                  </div>
                  <div>
                    <div className="text-[11px] font-medium" style={{ color: "hsl(220 14% 80%)" }}>
                      Sarah Chen
                    </div>
                    <div className="text-[10px]" style={{ color: "hsl(220 10% 44%)" }}>
                      Growth Lead
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 overflow-hidden p-4 sm:p-5 flex flex-col gap-4">
                {/* Topbar */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold" style={{ color: "hsl(220 14% 92%)" }}>
                      Overview
                    </h2>
                    <p className="text-[11px]" style={{ color: "hsl(220 10% 48%)" }}>
                      Last 30 days · Updated 2 min ago
                    </p>
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-lg border text-[11px]"
                    style={{ borderColor: "hsl(220 15% 18%)", color: "hsl(220 10% 55%)" }}
                  >
                    Last 30 days ↓
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: "Visitors", value: "24.8K", change: "+12.4%", up: true },
                    { label: "Revenue", value: "$18,240", change: "+8.2%", up: true },
                    { label: "Conversion", value: "3.2%", change: "+0.4%", up: true },
                    { label: "Bounce Rate", value: "38%", change: "-2.1%", up: true },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="p-3 rounded-xl border"
                      style={{ background: "hsl(220 20% 8%)", borderColor: "hsl(220 15% 17%)" }}
                    >
                      <p className="text-[10px] mb-1.5" style={{ color: "hsl(220 10% 50%)" }}>
                        {m.label}
                      </p>
                      <p className="text-base sm:text-lg font-bold" style={{ color: "hsl(220 14% 94%)" }}>
                        {m.value}
                      </p>
                      <p className="text-[10px] font-medium text-emerald-400 mt-0.5">{m.change}</p>
                    </div>
                  ))}
                </div>

                {/* Chart + AI panel */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 min-h-0">
                  {/* Chart */}
                  <div
                    className="sm:col-span-2 rounded-xl border p-3 flex flex-col"
                    style={{ background: "hsl(220 20% 8%)", borderColor: "hsl(220 15% 17%)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium" style={{ color: "hsl(220 14% 80%)" }}>
                        Traffic & Revenue
                      </span>
                      <div className="flex items-center gap-3">
                        {[
                          { color: "hsl(230 65% 60%)", label: "Visitors" },
                          { color: "hsl(142 70% 50%)", label: "Revenue" },
                        ].map((l) => (
                          <span
                            key={l.label}
                            className="flex items-center gap-1 text-[10px]"
                            style={{ color: "hsl(220 10% 50%)" }}
                          >
                            <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                            {l.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <svg className="flex-1 w-full" viewBox="0 0 400 90" preserveAspectRatio="none" style={{ minHeight: 80 }}>
                      <defs>
                        <linearGradient id="hAreaFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(230 65% 56%)" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="hsl(230 65% 56%)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {[22, 44, 66].map((y) => (
                        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="white" strokeOpacity="0.04" />
                      ))}
                      <path
                        d="M0,65 C25,60 50,52 75,48 C100,44 125,58 160,38 C195,18 220,32 250,24 C280,16 310,34 340,22 C365,12 385,20 400,14 L400,90 L0,90Z"
                        fill="url(#hAreaFill)"
                      />
                      <path
                        d="M0,65 C25,60 50,52 75,48 C100,44 125,58 160,38 C195,18 220,32 250,24 C280,16 310,34 340,22 C365,12 385,20 400,14"
                        stroke="hsl(230 65% 60%)"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                      />
                      {[12, 60, 110, 160, 210, 258, 308, 356].map((x, i) => {
                        const h = [18, 28, 22, 38, 26, 32, 44, 30][i];
                        return (
                          <rect
                            key={i}
                            x={x}
                            y={90 - h}
                            width="14"
                            height={h}
                            fill="hsl(142 70% 50%)"
                            opacity="0.65"
                            rx="2"
                          />
                        );
                      })}
                    </svg>
                  </div>

                  {/* AI Insight panel */}
                  <div
                    className="rounded-xl border p-3 flex flex-col"
                    style={{
                      background: "hsl(230 65% 56% / 0.07)",
                      borderColor: "hsl(230 65% 56% / 0.22)",
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-3">
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center"
                        style={{ background: "hsl(230 65% 56% / 0.2)" }}
                      >
                        <Sparkles className="w-2.5 h-2.5" style={{ color: "hsl(230 65% 70%)" }} />
                      </div>
                      <span className="text-[11px] font-semibold" style={{ color: "hsl(230 65% 70%)" }}>
                        AI Insights
                      </span>
                    </div>
                    <div className="space-y-2 flex-1">
                      {[
                        "Instagram drove 40% of new visitors with 2.3× higher revenue per visit.",
                        "Bounce rate dropped 2.1% after landing page update on Mar 15.",
                        "Email campaigns show strongest ROAS at 4.1× — consider increasing budget.",
                      ].map((text, i) => (
                        <div
                          key={i}
                          className="p-2 rounded-lg text-[10px] leading-relaxed"
                          style={{ background: "hsl(220 22% 10%)", color: "hsl(220 10% 60%)" }}
                        >
                          {text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Integration logos */}
        <motion.div
          className="mt-12 font-sans text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
        >
          <p className="text-[11px] uppercase tracking-[0.15em] mb-6 text-muted-foreground">
            Works with
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {integrations.map((name) => (
              <span
                key={name}
                className="text-sm font-medium text-foreground opacity-40 hover:opacity-75 transition-opacity cursor-default select-none"
              >
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
