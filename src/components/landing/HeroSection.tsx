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

        {/* Integration logos */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-6">Integrates with your favorite tools</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-60">
            {[
              { name: "Google Analytics", icon: (
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                  <path d="M22.84 2.998v18.004c0 .554-.449 1.003-1.003 1.003h-2.007a1.003 1.003 0 01-1.003-1.003V2.998c0-.554.449-1.003 1.003-1.003h2.007c.554 0 1.003.449 1.003 1.003zM14.508 8.998v12.004c0 .554-.449 1.003-1.003 1.003h-2.007a1.003 1.003 0 01-1.003-1.003V8.998c0-.554.449-1.003 1.003-1.003h2.007c.554 0 1.003.449 1.003 1.003zM6.168 15v6.002c0 .554-.449 1.003-1.003 1.003H3.158a1.003 1.003 0 01-1.003-1.003V15c0-.554.449-1.003 1.003-1.003h2.007c.554 0 1.003.449 1.003 1.003z"/>
                </svg>
              )},
              { name: "Shopify", icon: (
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                  <path d="M15.337 3.654c-.04-.024-.08-.036-.12-.036-.04 0-.16.016-.16.016s-1.08 1.08-1.2 1.2c-.04.04-.06.08-.08.12l-.36-.72c-.52-1-1.28-1.52-2.2-1.52h-.08c-.04-.04-.08-.08-.12-.08C10.377 2.214 9.617 2 8.977 2c-2.68.04-5.32 2.04-6.04 5.2-.72 3.12.36 4.72 1.08 5.52l.04.04c-.04.08-.08.16-.08.28-.2.76-.56 2.16-.56 2.16s-.04.16.08.24c.12.08.24.04.24.04l1.72-.44s.08-.04.12-.08l.44 8.52s.04.32.36.32h2.92c.28 0 .36-.24.36-.24l1.04-5.28c.04.04.12.04.16.04h.04c1 0 1.8-.52 2.28-1.48.04-.04.04-.08.08-.12l.6 2.28s.04.08.08.12l2 .56s.16.04.2-.08l1.92-6.4c.48-.4 1.28-1.12 1.56-2.16.4-1.44.04-2.68-.84-3.24zM9.297 4.134c.04 0 .08 0 .12.04.68.04 1.12.36 1.44 1 .24.44.36.88.44 1.24-1 .24-2.08.52-3.08.8.48-1.56 1.24-2.68 2.04-3.04.04-.04.04-.04.04-.04zm-1.56 4.76c.36-.08.76-.2 1.16-.28-.04.44-.16.92-.36 1.48-.52 1.24-1.28 1.68-1.68 1.72-.56-.04-.88-.72-.76-1.68.08-.68.36-1.24.64-1.24zm1.12 7.76c-.16 0-.24-.04-.24-.04l-.04-.04c.16-.6.56-2 .64-2.4.08.04.2.08.32.08.6 0 1.24-.44 1.72-1.2-.08.52-.2 1.08-.36 1.56-.28.92-.88 2.04-2.04 2.04z"/>
                </svg>
              )},
              { name: "Stripe", icon: (
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                </svg>
              )},
              { name: "Meta Ads", icon: (
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                  <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 008.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
                </svg>
              )},
              { name: "TikTok", icon: (
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48v-7.15a8.16 8.16 0 005.58 2.2V11.3a4.85 4.85 0 01-3.77-1.85V6.69h3.77z"/>
                </svg>
              )},
              { name: "HubSpot", icon: (
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
                  <path d="M17.4 8.4V5.7a2.1 2.1 0 001.2-1.9A2.1 2.1 0 0016.5 1.7a2.1 2.1 0 00-2.1 2.1c0 .8.5 1.5 1.2 1.9v2.7a5.4 5.4 0 00-2.8 1.4L6 5.1a2.4 2.4 0 00.1-.6A2.3 2.3 0 003.8 2.2 2.3 2.3 0 001.5 4.5a2.3 2.3 0 002.3 2.3c.5 0 .9-.1 1.3-.4l6.7 4.7a5.4 5.4 0 000 5.8l-2 2a2 2 0 00-.6-.1 2.1 2.1 0 100 4.2 2.1 2.1 0 002.1-2.1c0-.2 0-.4-.1-.6l2-2a5.4 5.4 0 10 4.1-9.9zM16.5 17a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/>
                </svg>
              )},
            ].map((tool, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                {tool.icon}
                <span className="text-[10px] font-medium">{tool.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
