ALTER TABLE public.user_connections 
ADD COLUMN IF NOT EXISTS refresh_token text,
ADD COLUMN IF NOT EXISTS access_token text,
ADD COLUMN IF NOT EXISTS token_expires_at timestamp with time zone;