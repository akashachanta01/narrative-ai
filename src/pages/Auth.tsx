import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";
import databriefLogo from "@/assets/databrief-logo.png";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });

    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else if (!isLogin) {
      toast({ title: "Check your email", description: "We sent you a confirmation link." });
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
        extraParams: {
          prompt: "consent",
          access_type: "offline",
        },
      });
      if (result?.error) {
        toast({ title: "Error", description: String(result.error), variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Google sign-in failed", variant: "destructive" });
    }
    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding (hidden on mobile) */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] shrink-0 p-10 relative overflow-hidden"
        style={{ background: "hsl(220 25% 9%)" }}
      >
        {/* Background orb */}
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(230 65% 56%), transparent 65%)" }}
        />
        <div
          className="absolute -bottom-40 -right-20 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(170 55% 50%), transparent 65%)" }}
        />

        {/* Logo */}
        <div className="flex items-center gap-2.5 relative z-10">
          <img src={databriefLogo} alt="DataBrief" className="w-8 h-8" />
          <span className="text-base font-semibold tracking-tight" style={{ color: "hsl(220 14% 92%)" }}>
            DataBrief
          </span>
        </div>

        {/* Center quote */}
        <div className="relative z-10 space-y-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium"
            style={{
              borderColor: "hsl(230 65% 56% / 0.3)",
              background: "hsl(230 65% 56% / 0.1)",
              color: "hsl(230 65% 72%)",
            }}
          >
            <Sparkles className="w-3 h-3" />
            AI-powered marketing insights
          </div>

          <h2 className="text-3xl font-bold leading-snug" style={{ color: "hsl(220 14% 92%)" }}>
            Your data tells a story.
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, hsl(230 65% 65%), hsl(170 60% 50%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              We help you read it.
            </span>
          </h2>

          <p className="text-sm leading-relaxed" style={{ color: "hsl(220 10% 55%)" }}>
            DataBrief connects your marketing and sales tools, then explains exactly
            what's happening and what to do next — no analysts required.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "500+ teams", sub: "using DataBrief" },
              { label: "50M+ insights", sub: "generated" },
              { label: "4.9/5 rating", sub: "avg. score" },
            ].map(({ label, sub }) => (
              <div
                key={label}
                className="px-3 py-2 rounded-xl border text-xs"
                style={{
                  borderColor: "hsl(220 15% 20%)",
                  background: "hsl(220 20% 12%)",
                  color: "hsl(220 14% 80%)",
                }}
              >
                <div className="font-semibold" style={{ color: "hsl(220 14% 92%)" }}>
                  {label}
                </div>
                <div style={{ color: "hsl(220 10% 52%)" }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom testimonial */}
        <div
          className="relative z-10 p-4 rounded-xl border"
          style={{
            borderColor: "hsl(220 15% 20%)",
            background: "hsl(220 20% 12%)",
          }}
        >
          <p className="text-sm italic mb-3" style={{ color: "hsl(220 10% 65%)" }}>
            "DataBrief replaced three tools for us. We finally understand what's driving
            revenue without needing a data analyst."
          </p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-[10px] font-bold text-white">
              SC
            </div>
            <div>
              <div className="text-xs font-medium" style={{ color: "hsl(220 14% 80%)" }}>
                Sarah Chen
              </div>
              <div className="text-[10px]" style={{ color: "hsl(220 10% 48%)" }}>
                Head of Growth · Luminary
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <img src={databriefLogo} alt="DataBrief" className="w-8 h-8" />
          <span className="text-base font-semibold tracking-tight text-foreground font-sans">
            DataBrief
          </span>
        </div>

        <div className="w-full max-w-sm space-y-6">
          {/* Heading */}
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-foreground font-sans">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-muted-foreground font-sans">
              {isLogin
                ? "Sign in to access your dashboard"
                : "Start getting data insights today"}
            </p>
          </div>

          {/* Google sign-in */}
          <Button
            variant="outline"
            className="w-full h-11 text-sm font-medium font-sans"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground font-sans tracking-wider">
                or
              </span>
            </div>
          </div>

          {/* Email / password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium font-sans">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium font-sans">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 font-semibold font-sans"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {loading ? "Loading…" : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-muted-foreground font-sans">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent font-semibold hover:underline underline-offset-2"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>

          {/* Back to home */}
          <p className="text-center text-xs text-muted-foreground font-sans">
            <Link to="/" className="hover:text-foreground transition-colors">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
