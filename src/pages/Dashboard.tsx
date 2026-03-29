import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWindsorData } from "@/hooks/useWindsorData";
import { Button } from "@/components/ui/button";
import { InsightCardComponent } from "@/components/dashboard/InsightCard";
import { EmptyStateConnect } from "@/components/dashboard/EmptyStateConnect";
import { ChatSidebar } from "@/components/dashboard/ChatSidebar";
import { generateInsights } from "@/lib/generateInsights";
import type { DynamicInsight } from "@/lib/generateInsights";
import { LogOut, Settings, Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: windsorData, isLoading: windsorLoading } = useWindsorData();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasData = windsorData !== null && windsorData !== undefined;
  const insights: DynamicInsight[] = hasData ? generateInsights(windsorData) : [];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {hasData ? "Your top insights this week" : "Connect a data source to get started"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/connections")}>
              <Settings className="h-4 w-4 mr-2" />
              Connections
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </header>

        {/* Content area */}
        {windsorLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : hasData && insights.length > 0 ? (
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto space-y-5">
              {insights.map((insight) => (
                <InsightCardComponent key={insight.id} insight={insight} />
              ))}
            </div>
          </main>
        ) : (
          <EmptyStateConnect />
        )}
      </div>

      {/* Chat sidebar */}
      <ChatSidebar />
    </div>
  );
}
