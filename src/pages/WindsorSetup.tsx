import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  Layers,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

const STEPS = [
  {
    number: 1,
    title: "Create your free Windsor.ai account",
    description:
      "Windsor.ai is a tool that pulls all your marketing data (Google Ads, Facebook, Shopify, etc.) into one place. You'll need a free account to get started.",
    action: "open_windsor",
    actionLabel: "Open Windsor.ai",
    tips: [
      'Click the button below — it opens Windsor.ai in a new tab.',
      'Sign up with your email or Google account.',
      "It's free to start — no credit card needed.",
    ],
  },
  {
    number: 2,
    title: "Connect your marketing platforms",
    description:
      "Once you're in Windsor.ai, you'll connect the platforms you use for marketing — like Google Ads, Facebook Ads, Shopify, or Google Analytics.",
    tips: [
      'After signing up, Windsor will ask you to "Add a data source."',
      "Pick the platforms you use (e.g., Google Ads, Facebook Ads, Shopify).",
      "Follow the prompts to authorize each one — usually just clicking \"Allow\" or signing in.",
      "You can always add more sources later.",
    ],
  },
  {
    number: 3,
    title: "Find your API key",
    description:
      "Your API key is like a password that lets our app securely read your Windsor.ai data. Here's exactly where to find it:",
    tips: [
      'In Windsor.ai, click on your profile icon (top-right corner).',
      'Select "Account Settings" from the dropdown.',
      'Look for the "API Keys" section.',
      "Copy the key — it looks like a long string of letters and numbers.",
    ],
  },
  {
    number: 4,
    title: "Paste your API key here",
    description:
      "Almost done! Paste the API key you just copied and we'll connect everything for you automatically.",
    action: "paste_key",
    tips: [
      "Paste the key in the box below and click Save.",
      "We'll verify the key works right away.",
      "Your data will start appearing on your dashboard within seconds.",
    ],
  },
];

export default function WindsorSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const step = STEPS[currentStep];

  const handleOpenWindsor = () => {
    window.open("https://onboard.windsor.ai/", "_blank");
  };

  const handleCopyRedirect = () => {
    navigator.clipboard.writeText(window.location.origin + "/connections");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveKey = async () => {
    if (!user || !apiKey.trim()) return;
    setSaving(true);
    const { error } = await supabase
      .from("user_connections")
      .upsert(
        { user_id: user.id, provider: "windsor", api_key: apiKey.trim(), status: "active" },
        { onConflict: "user_id,provider" }
      );
    setSaving(false);
    if (error) {
      toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "🎉 You're connected!", description: "Windsor.ai data is now flowing into your dashboard." });
      navigate("/connections");
    }
  };

  const canGoNext = currentStep < STEPS.length - 1;
  const canGoPrev = currentStep > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border/50 px-4 sm:px-6 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/connections")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-violet-500" />
          <h1 className="text-sm font-semibold text-foreground">Connect Windsor.ai</h1>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Step {currentStep + 1} of {STEPS.length}</span>
            <span>{Math.round(((currentStep + 1) / STEPS.length) * 100)}% complete</span>
          </div>
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step number badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
            {step.number}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{step.title}</h2>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>

        {/* Tips */}
        <div className="space-y-3">
          {step.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 group">
              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-[11px] font-semibold text-muted-foreground shrink-0 mt-0.5">
                {String.fromCharCode(65 + i)}
              </div>
              <p className="text-sm text-foreground leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>

        {/* Action area */}
        {step.action === "open_windsor" && (
          <div className="space-y-3 pt-2">
            <Button
              onClick={handleOpenWindsor}
              className="w-full h-12 text-sm font-semibold gap-2"
              variant="default"
            >
              <ExternalLink className="h-4 w-4" />
              Open Windsor.ai (opens in new tab)
            </Button>
            <p className="text-[11px] text-muted-foreground text-center">
              Come back to this page after signing up — we'll walk you through the rest.
            </p>
          </div>
        )}

        {step.action === "paste_key" && (
          <div className="space-y-4 pt-2">
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your Windsor.ai API key here"
                className="pl-10 h-12 text-sm"
              />
            </div>
            <Button
              onClick={handleSaveKey}
              disabled={!apiKey.trim() || saving}
              className="w-full h-12 text-sm font-semibold gap-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {saving ? "Connecting…" : "Save & Connect"}
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border/40">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep((s) => s - 1)}
            disabled={!canGoPrev}
            className="text-xs text-muted-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Previous
          </Button>
          {canGoNext && (
            <Button
              variant="default"
              size="sm"
              onClick={() => setCurrentStep((s) => s + 1)}
              className="text-xs"
            >
              Next step
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          )}
        </div>

        {/* Help note */}
        <div className="rounded-xl border border-border/40 bg-accent/30 p-4 space-y-1">
          <p className="text-xs font-medium text-foreground">Need help?</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            If you get stuck at any step, don't worry! You can always come back to this page and pick up where you left off. Your progress won't be lost.
          </p>
        </div>
      </main>
    </div>
  );
}
