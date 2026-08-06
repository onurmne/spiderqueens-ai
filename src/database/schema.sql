-- ================================================================
-- SpiderQueens Database Schema for Supabase PostgreSQL
-- Competition Platform for Female Cosplay Creators
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------
-- 1. USERS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'contestant', 'admin')),
  avatar_url TEXT DEFAULT '',
  super_vote_balance INTEGER DEFAULT 10,
  country TEXT DEFAULT 'USA',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- User Policies
CREATE POLICY "Public users are viewable by everyone" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);


-- ----------------------------------------------------------------
-- 2. COMPETITIONS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.competitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'upcoming')),
  prize_pool TEXT DEFAULT '$1,000 Cash + Featured Spotlight',
  week_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Competitions viewable by everyone" ON public.competitions
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage competitions" ON public.competitions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );


-- ----------------------------------------------------------------
-- 3. CONTESTANTS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contestants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  username TEXT NOT NULL,
  instagram_url TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'USA',
  country_code TEXT DEFAULT 'US',
  profile_photo_url TEXT NOT NULL,
  cosplay_photo_url TEXT NOT NULL,
  category TEXT DEFAULT 'Spider-Gwen',
  bio TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  vote_count INTEGER DEFAULT 0,
  super_vote_count INTEGER DEFAULT 0,
  competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast feed & leaderboard queries
CREATE INDEX IF NOT EXISTS idx_contestants_status_votes ON public.contestants(status, vote_count DESC);
CREATE INDEX IF NOT EXISTS idx_contestants_competition ON public.contestants(competition_id);

ALTER TABLE public.contestants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved contestants are viewable by everyone" ON public.contestants
  FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Authenticated users can create contestant submission" ON public.contestants
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Contestants can update their pending submission" ON public.contestants
  FOR UPDATE USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));


-- ----------------------------------------------------------------
-- 4. VOTES TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  contestant_id UUID NOT NULL REFERENCES public.contestants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, contestant_id)
);

CREATE INDEX IF NOT EXISTS idx_votes_user_contestant ON public.votes(user_id, contestant_id);

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Votes viewable by authenticated users" ON public.votes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can cast votes" ON public.votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ----------------------------------------------------------------
-- 5. SUPER_VOTES TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.super_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  contestant_id UUID NOT NULL REFERENCES public.contestants(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.super_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super votes viewable by everyone" ON public.super_votes
  FOR SELECT USING (true);

CREATE POLICY "Users can cast super votes" ON public.super_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ----------------------------------------------------------------
-- 6. WINNERS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.winners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  competition_title TEXT NOT NULL,
  contestant_id UUID NOT NULL REFERENCES public.contestants(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  country TEXT NOT NULL,
  cosplay_photo_url TEXT NOT NULL,
  total_votes INTEGER NOT NULL,
  week_number INTEGER NOT NULL,
  crowned_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Winners viewable by everyone" ON public.winners
  FOR SELECT USING (true);


-- ----------------------------------------------------------------
-- 7. SUPABASE STORAGE BUCKET POLICIES (for cosplay images)
-- ----------------------------------------------------------------
-- Insert bucket definition (Run in Supabase Dashboard):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('cosplays', 'cosplays', true);

-- Storage security policies:
-- CREATE POLICY "Cosplay photos are publicly accessible" ON storage.objects
--   FOR SELECT USING (bucket_id = 'cosplays');
-- CREATE POLICY "Authenticated users can upload cosplay photos" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'cosplays' AND auth.role() = 'authenticated');


-- ----------------------------------------------------------------
-- 8. AUTOMATION & TRIGGER FOR n8n WEBHOOKS
-- ----------------------------------------------------------------
-- Function to trigger HTTP Webhook to n8n upon new contestant upload:
CREATE OR REPLACE FUNCTION notify_n8n_on_upload()
RETURNS TRIGGER AS $$
BEGIN
  -- Requires pg_net extension on Supabase
  -- PERFORM net.http_post(
  --   url := 'https://your-n8n-instance.com/webhook/spiderqueens-upload',
  --   headers := '{"Content-Type": "application/json"}'::jsonb,
  --   body := jsonb_build_object(
  --     'event', 'CONTESTANT_UPLOAD_CREATED',
  --     'contestant_id', NEW.id,
  --     'display_name', NEW.display_name,
  --     'username', NEW.username,
  --     'instagram_url', NEW.instagram_url,
  --     'country', NEW.country,
  --     'cosplay_photo_url', NEW.cosplay_photo_url,
  --     'created_at', NEW.created_at
  --   )
  -- );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger definition:
-- CREATE TRIGGER on_contestant_submitted
-- AFTER INSERT ON public.contestants
-- FOR EACH ROW EXECUTE FUNCTION notify_n8n_on_upload();
