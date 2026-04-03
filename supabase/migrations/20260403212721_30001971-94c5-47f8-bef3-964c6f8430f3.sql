
-- Fix the view to use SECURITY INVOKER so RLS of the querying user applies
DROP VIEW IF EXISTS public.user_connections_safe;

CREATE VIEW public.user_connections_safe
WITH (security_invoker = on) AS
  SELECT id, user_id, provider, status, method, metadata, created_at, updated_at
  FROM public.user_connections;

GRANT SELECT ON public.user_connections_safe TO authenticated;
GRANT SELECT ON public.user_connections_safe TO anon;
