import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import Connections from "./pages/Connections.tsx";
import WindsorSetup from "./pages/WindsorSetup.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import DataBriefDashboard from "./pages/DataBriefDashboard.tsx";
import AdminAnalytics from "./pages/AdminAnalytics.tsx";
import UseCasePage from "./pages/UseCasePage.tsx";
import MetricPage from "./pages/MetricPage.tsx";
import ComparisonPage from "./pages/ComparisonPage.tsx";
import NotFound from "./pages/NotFound.tsx";
const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/connections/windsor" element={<WindsorSetup />} />
            <Route path="/dashboard" element={<DataBriefDashboard />} />
            <Route path="/admin" element={<AdminAnalytics />} />
            <Route path="/for/:slug" element={<UseCasePage />} />
            <Route path="/learn/:slug" element={<MetricPage />} />
            <Route path="/compare/:slug" element={<ComparisonPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
);

export default App;
