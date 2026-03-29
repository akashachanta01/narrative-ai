import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlugZap } from "lucide-react";

export function EmptyStateConnect() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-accent mx-auto flex items-center justify-center">
          <PlugZap className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Connect Your Data</h2>
          <p className="text-muted-foreground leading-relaxed">
            Link your marketing platforms through Windsor.ai to unlock AI-powered narrative insights about your business.
          </p>
        </div>
        <Button variant="hero" size="lg" onClick={() => navigate("/connections")}>
          <PlugZap className="w-5 h-5 mr-2" />
          Go to Connection Hub
        </Button>
      </div>
    </div>
  );
}
