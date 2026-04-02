ALTER TABLE public.user_connections 
  ADD COLUMN IF NOT EXISTS method text DEFAULT 'direct',
  ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb,
  ALTER COLUMN api_key DROP NOT NULL,
  ALTER COLUMN api_key SET DEFAULT '';