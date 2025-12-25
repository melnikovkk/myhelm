-- Create waitlist_signups table for collecting pre-launch signups
CREATE TABLE public.waitlist_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  prompt TEXT,
  mode TEXT CHECK (mode IN ('new', 'digitize')),
  language TEXT CHECK (language IN ('en', 'ru')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public signup form)
CREATE POLICY "Anyone can submit to waitlist"
ON public.waitlist_signups
FOR INSERT
WITH CHECK (true);

-- Only allow reading for authenticated admins (we'll add admin logic later if needed)
-- For now, no one can read the data via API (admin reads via Cloud UI)
CREATE POLICY "No public read access"
ON public.waitlist_signups
FOR SELECT
USING (false);

-- Create index for faster email lookups
CREATE INDEX idx_waitlist_email ON public.waitlist_signups(email);