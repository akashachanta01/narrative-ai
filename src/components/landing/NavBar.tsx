import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import databriefLogo from "@/assets/databrief-logo.png";

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-lg bg-[hsl(210_11%_15%/0.9)]">
      <div className="container px-6 max-w-6xl mx-auto flex items-center justify-between h-14">
        <div className="flex items-center gap-2.5">
          <img src={databriefLogo} alt="DataBrief" className="w-6 h-6" />
          <span className="text-base font-semibold tracking-tight text-white font-sans">DataBrief</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/50 font-sans">
          <a href="#how-it-works" className="hover:text-white/90 transition-colors">How It Works</a>
          <a href="#features" className="hover:text-white/90 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white/90 transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-3 font-sans">
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/5" asChild>
            <Link to="/auth">Log in</Link>
          </Button>
          <Button size="sm" className="rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 text-xs" asChild>
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
