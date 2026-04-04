
-- 1. Replace the UPDATE policy to restrict which columns users can modify
-- Drop existing permissive update policy
DROP POLICY IF EXISTS "Users can update own connections" ON public.user_connections;

-- Create a new restricted update policy that prevents direct token/key overwrites
-- Users can only update status, metadata, and method columns
CREATE POLICY "Users can update own connections"
ON public.user_connections
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Revoke direct column-level UPDATE on sensitive columns from authenticated users
REVOKE UPDATE (access_token, refresh_token, api_key, token_expires_at) ON public.user_connections FROM authenticated;
REVOKE UPDATE (access_token, refresh_token, api_key, token_expires_at) ON public.user_connections FROM anon;

-- 2. Revoke anon access to the safe view (only authenticated users should see it)
REVOKE SELECT ON public.user_connections_safe FROM anon;
