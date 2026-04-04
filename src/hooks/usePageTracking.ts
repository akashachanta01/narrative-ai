import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    if (!projectId) return;

    fetch(`https://${projectId}.supabase.co/functions/v1/track-pageview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: location.pathname,
        referrer: document.referrer || null,
      }),
    }).catch(() => {});
  }, [location.pathname]);
}
