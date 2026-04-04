
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  referrer text,
  user_agent text,
  country text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- No RLS needed - we'll insert via edge function with service role
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
