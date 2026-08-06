-- ================================================================
-- SpiderQueens Database Schema for Supabase PostgreSQL
-- Competition Platform for Female Cosplay Creators
-- ================================================================

-- OPTIONAL RESET (Uncomment if recreating clean schema):
-- DROP TABLE IF EXISTS public.winners CASCADE;
-- DROP TABLE IF EXISTS public.super_votes CASCADE;
-- DROP TABLE IF EXISTS public.votes CASCADE;
-- DROP TABLE IF EXISTS public.contestants CASCADE;
-- DROP TABLE IF EXISTS public.competitions CASCADE;
-- DROP TABLE IF EXISTS public.users CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------
-- 1. USERS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT,
  username TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  avatar_url TEXT DEFAULT '',
  super_vote_balance INTEGER DEFAULT 10,
  country TEXT DEFAULT 'TR',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- User Policies
DROP POLICY IF EXISTS "Public users viewable" ON public.users;
DROP POLICY IF EXISTS "Public users insert" ON public.users;
DROP POLICY IF EXISTS "Public users update" ON public.users;

CREATE POLICY "Public users viewable" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public users insert" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public users update" ON public.users FOR UPDATE USING (true);


-- ----------------------------------------------------------------
-- 2. COMPETITIONS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.competitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  prize_pool TEXT DEFAULT '$1,000 Cash + Featured Spotlight',
  week_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Competitions viewable" ON public.competitions;
DROP POLICY IF EXISTS "Competitions manageable" ON public.competitions;

CREATE POLICY "Competitions viewable" ON public.competitions FOR SELECT USING (true);
CREATE POLICY "Competitions manageable" ON public.competitions FOR ALL USING (true);


-- ----------------------------------------------------------------
-- 3. CONTESTANTS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contestants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  display_name TEXT NOT NULL,
  username TEXT NOT NULL,
  instagram_url TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Turkey',
  country_code TEXT DEFAULT 'TR',
  profile_photo_url TEXT NOT NULL,
  cosplay_photo_url TEXT NOT NULL,
  category TEXT DEFAULT 'Spider-Gwen',
  bio TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  vote_count INTEGER DEFAULT 0,
  super_vote_count INTEGER DEFAULT 0,
  competition_id UUID,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast feed & leaderboard queries
CREATE INDEX IF NOT EXISTS idx_contestants_status_votes ON public.contestants(status, vote_count DESC);
CREATE INDEX IF NOT EXISTS idx_contestants_competition ON public.contestants(competition_id);

ALTER TABLE public.contestants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Contestants viewable" ON public.contestants;
DROP POLICY IF EXISTS "Public create contestant" ON public.contestants;
DROP POLICY IF EXISTS "Public update contestants" ON public.contestants;
DROP POLICY IF EXISTS "Public delete contestants" ON public.contestants;

CREATE POLICY "Contestants viewable" ON public.contestants FOR SELECT USING (true);
CREATE POLICY "Public create contestant" ON public.contestants FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update contestants" ON public.contestants FOR UPDATE USING (true);
CREATE POLICY "Public delete contestants" ON public.contestants FOR DELETE USING (true);


-- ----------------------------------------------------------------
-- 4. VOTES TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  contestant_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_votes_user_contestant ON public.votes(user_id, contestant_id);

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Votes viewable" ON public.votes;
DROP POLICY IF EXISTS "Public cast vote" ON public.votes;

CREATE POLICY "Votes viewable" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Public cast vote" ON public.votes FOR INSERT WITH CHECK (true);


-- ----------------------------------------------------------------
-- 5. SUPER_VOTES TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.super_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  contestant_id UUID NOT NULL,
  amount INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.super_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super votes viewable" ON public.super_votes;
DROP POLICY IF EXISTS "Public cast super vote" ON public.super_votes;

CREATE POLICY "Super votes viewable" ON public.super_votes FOR SELECT USING (true);
CREATE POLICY "Public cast super vote" ON public.super_votes FOR INSERT WITH CHECK (true);


-- ----------------------------------------------------------------
-- 6. WINNERS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.winners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL,
  competition_title TEXT NOT NULL,
  contestant_id UUID NOT NULL,
  display_name TEXT NOT NULL,
  country TEXT NOT NULL,
  cosplay_photo_url TEXT NOT NULL,
  total_votes INTEGER NOT NULL,
  week_number INTEGER NOT NULL,
  crowned_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Winners viewable" ON public.winners;
DROP POLICY IF EXISTS "Winners insert" ON public.winners;

CREATE POLICY "Winners viewable" ON public.winners FOR SELECT USING (true);
CREATE POLICY "Winners insert" ON public.winners FOR INSERT WITH CHECK (true);



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
