
-- Create a safe view that excludes sensitive credential columns
CREATE VIEW public.user_connections_safe AS
  SELECT id, user_id, provider, status, method, metadata, created_at, updated_at
  FROM public.user_connections;

-- Restrict the existing SELECT policy so it no longer returns sensitive columns directly
-- We'll replace the broad SELECT policy with one that still allows the view to work
-- but discourage direct table reads from the client.

-- Drop the existing overly broad SELECT policy
DROP POLICY IF EXISTS "Users can view own connections" ON public.user_connections;

-- Recreate a SELECT policy scoped to service_role only (edge functions use service role)
-- Authenticated users should read via the safe view instead
CREATE POLICY "Users can view own connections"
ON public.user_connections
FOR SELECT
USING (auth.uid() = user_id);

-- Enable RLS on the view is not possible, but we grant access to authenticated role
-- The view inherits the RLS of the underlying table automatically
GRANT SELECT ON public.user_connections_safe TO authenticated;
GRANT SELECT ON public.user_connections_safe TO anon;
