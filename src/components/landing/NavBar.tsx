import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-lg bg-background/80">
      <div className="container px-6 max-w-6xl mx-auto flex items-center justify-between h-16">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BarChart3 className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">NarrativeMetrics</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">Log in</Button>
          <Button variant="hero" size="sm" className="rounded-lg">Start Free Trial</Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
