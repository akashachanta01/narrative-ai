
-- 1. page_views: Enable RLS, default deny (service role bypasses)
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- 2. Revoke direct SELECT on user_connections base table from client roles
-- This prevents clients from reading sensitive columns (api_key, tokens)
-- The safe view (owned by postgres) still works via security_invoker
REVOKE SELECT ON public.user_connections FROM anon;
REVOKE SELECT ON public.user_connections FROM authenticated;

-- 3. Ensure safe view is only accessible to authenticated users
GRANT SELECT ON public.user_connections_safe TO authenticated;
REVOKE SELECT ON public.user_connections_safe FROM anon;
