import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";

const integrations = ["Google Analytics", "Shopify", "Stripe"];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
        </svg>
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
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold mb-8 text-accent tracking-wide font-sans">
              <Sparkles className="w-3 h-3" />
              Now in early access — free to use
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
              DataBrief connects your marketing and sales tools via Windsor.ai, then delivers
              AI-powered insights — what happened, why, and what to do next.
            </p>

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

        {/* Dashboard mockup — matches real DataBrief AI dashboard */}
        <motion.div
          className="relative max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.2 }}
        >
          <div
            className="absolute inset-x-24 -top-8 h-32 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ background: "linear-gradient(135deg, hsl(230 65% 56%), hsl(170 55% 50%))" }}
          />

          <div
            className="relative rounded-2xl overflow-hidden border shadow-2xl shadow-black/30"
            style={{ background: "#0A0D12", borderColor: "hsl(220 15% 17%)" }}
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

            {/* Dashboard content */}
            <div className="p-4 sm:p-6 space-y-4" style={{ minHeight: "420px" }}>
              {/* Top bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#00D4AA" }} />
                  <span className="text-[11px]" style={{ color: "#00D4AA" }}>DataBrief AI · your analytics analyst</span>
                </div>
                <div className="flex gap-1">
                  {["7d", "30d", "90d"].map((label, i) => (
                    <div
                      key={label}
                      className="text-[10px] px-2 py-1 rounded"
                      style={{
                        background: i === 0 ? "rgba(0,212,170,0.12)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${i === 0 ? "rgba(0,212,170,0.3)" : "rgba(255,255,255,0.04)"}`,
                        color: i === 0 ? "#00D4AA" : "#6B7280",
                        fontWeight: i === 0 ? 600 : 400,
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Greeting */}
              <div>
                <p className="text-[16px] font-medium" style={{ color: "#E8EAF0" }}>
                  Good morning, <span style={{ color: "#00D4AA" }}>Sarah</span>.
                </p>
                <p className="text-[11px]" style={{ color: "#6B7280" }}>Wednesday, April 2</p>
              </div>

              {/* Source pills */}
              <div className="flex gap-1.5">
                <span className="text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1" style={{ color: "#F5A623", background: "rgba(245,166,35,0.07)", border: "1px solid rgba(245,166,35,0.2)" }}>
                  📊 Google Analytics
                </span>
                <span className="text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1" style={{ color: "#00D4AA", background: "rgba(0,212,170,0.07)", border: "1px solid rgba(0,212,170,0.2)" }}>
                  🛒 Shopify
                </span>
              </div>

              {/* AI Verdict */}
              <div className="rounded-xl p-3.5" style={{ background: "#0E1A16", border: "1px solid rgba(0,212,170,0.13)" }}>
                <p className="text-[13px] font-medium leading-relaxed" style={{ color: "#fff" }}>
                  Your Google organic traffic is up 23% — but Shopify conversion rate dropped to 1.8%, costing you ~$2,400 in missed revenue.
                </p>
                <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: "#6B7280" }}>
                  Focus on checkout optimization. Mobile bounce rate spiked 15% after last week's theme update.
                </p>
              </div>

              {/* Alerts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="rounded-lg p-3" style={{ background: "#160A0A", border: "1px solid rgba(255,77,77,0.17)" }}>
                  <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#FF6B6B" }}>⚠ CRITICAL</span>
                  <p className="text-[12px] font-medium mt-1" style={{ color: "#fff" }}>Checkout conversion dropped 34%</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#6B7280" }}>Mobile users abandoning at shipping step</p>
                </div>
                <div className="rounded-lg p-3" style={{ background: "#0D1520", border: "1px solid rgba(59,130,246,0.17)" }}>
                  <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#60A5FA" }}>🔵 OPPORTUNITY</span>
                  <p className="text-[12px] font-medium mt-1" style={{ color: "#fff" }}>Email ROAS at 4.1× — best channel</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#6B7280" }}>Consider increasing email campaign budget 20%</p>
                </div>
              </div>

              {/* KPI tiles */}
              <div>
                <p className="text-[11px] font-medium mb-2" style={{ color: "#6B7280" }}>The numbers</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: "Sessions", value: "12,847", ctx: "↑ 23% vs prior", up: true },
                    { label: "Revenue", value: "$8,420", ctx: "↓ 6% vs prior", up: false },
                    { label: "ROAS", value: "3.2×", ctx: "Above target", up: true },
                    { label: "Conv. Rate", value: "1.8%", ctx: "↓ needs attention", up: false },
                  ].map((kpi) => (
                    <div key={kpi.label} className="rounded-lg p-2.5" style={{ background: "#111520", border: "1px solid rgba(255,255,255,0.04)" }}>
                      <span className="text-[9px]" style={{ color: "#555" }}>{kpi.label}</span>
                      <p className="text-[16px] font-medium mt-0.5" style={{ color: "#E8EAF0" }}>{kpi.value}</p>
                      <span className="text-[9px]" style={{ color: kpi.up ? "#00D4AA" : "#FF6B6B" }}>{kpi.ctx}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source breakdown bars */}
              <div className="rounded-lg p-3" style={{ background: "#111520", border: "1px solid rgba(255,255,255,0.04)" }}>
                <p className="text-[11px] font-medium mb-2" style={{ color: "#888" }}>Traffic by source</p>
                {[
                  { name: "google / organic", pct: 100, sessions: "5,230" },
                  { name: "direct / none", pct: 62, sessions: "3,240" },
                  { name: "email / campaign", pct: 38, sessions: "1,990" },
                  { name: "social / instagram", pct: 22, sessions: "1,150" },
                ].map((src) => (
                  <div key={src.name} className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] w-28 truncate" style={{ color: "#6B7280" }}>{src.name}</span>
                    <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div className="h-1 rounded-full" style={{ width: `${src.pct}%`, background: "#00D4AA" }} />
                    </div>
                    <span className="text-[10px] w-12 text-right" style={{ color: "#6B7280" }}>{src.sessions}</span>
                  </div>
                ))}
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
            Connects via Windsor.ai to
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
