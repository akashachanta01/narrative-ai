import { BarChart3 } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container px-6 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <BarChart3 className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium">NarrativeMetrics</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2026 NarrativeMetrics. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
