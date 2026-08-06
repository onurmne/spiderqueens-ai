import React, { useState } from "react";
import { Database, Copy, Check, Server, Key, Link as LinkIcon, ShieldCheck, Terminal } from "lucide-react";
import {
  isSupabaseConfigured,
  getSupabaseCredentials,
  setSupabaseCredentialsInStorage,
} from "../supabase/client";

export const DatabaseSchemaView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const creds = getSupabaseCredentials();
  const [url, setUrl] = useState(creds.url);
  const [key, setKey] = useState(creds.key);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const sqlSchemaCode = `-- ================================================================
-- SpiderQueens Supabase PostgreSQL Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard)
-- ================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
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

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public users viewable" ON public.users FOR SELECT USING (true);
CREATE POLICY "User edit profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- 2. COMPETITIONS TABLE
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
CREATE POLICY "Competitions viewable" ON public.competitions FOR SELECT USING (true);

-- 3. CONTESTANTS TABLE
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

CREATE INDEX idx_contestants_status_votes ON public.contestants(status, vote_count DESC);
ALTER TABLE public.contestants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved viewable" ON public.contestants FOR SELECT USING (status = 'approved');

-- 4. VOTES TABLE
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  contestant_id UUID NOT NULL REFERENCES public.contestants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, contestant_id)
);

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cast vote" ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. SUPER_VOTES TABLE
CREATE TABLE IF NOT EXISTS public.super_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  contestant_id UUID NOT NULL REFERENCES public.contestants(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.super_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super votes viewable" ON public.super_votes FOR SELECT USING (true);

-- 6. WINNERS TABLE
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
CREATE POLICY "Winners viewable" ON public.winners FOR SELECT USING (true);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlSchemaCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setSupabaseCredentialsInStorage(url, key);
    setSaveMessage("Credentials saved! Refresh page to initialize Supabase client.");
    setTimeout(() => setSaveMessage(null), 4000);
  };

  return (
    <div className="min-h-screen text-slate-100 bg-slate-950 pb-24">
      {/* Page Title */}
      <div className="bg-slate-900/60 border-b border-slate-800 py-8 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold uppercase">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            SUPABASE POSTGRESQL ARCHITECTURE
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Database Schema & Credentials
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            SpiderQueens uses standard PostgreSQL database structure with RLS security policies, storage buckets for cosplay photos, and n8n webhook triggers.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Connection Status Box */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-2xl ${
                  isSupabaseConfigured
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isSupabaseConfigured
                    ? "Supabase Live Connection Active"
                    : "Local Storage Fallback Engine Running"}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {isSupabaseConfigured
                    ? "Connected to remote PostgreSQL instance"
                    : "Running seamless offline/demo storage engine until Supabase URL is set."}
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                isSupabaseConfigured
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                  : "bg-amber-950 text-amber-300 border border-amber-500/40"
              }`}
            >
              {isSupabaseConfigured ? "● ONLINE" : "● DEMO ENGINE"}
            </span>
          </div>

          {/* Connect Credentials Form */}
          <form onSubmit={handleSaveCredentials} className="pt-4 border-t border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              Connect Your Supabase Credentials (Optional)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">VITE_SUPABASE_URL</label>
                <input
                  type="text"
                  placeholder="https://xyz.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 font-mono focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">VITE_SUPABASE_ANON_KEY</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOi..."
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 font-mono focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              Save Credentials
            </button>

            {saveMessage && (
              <p className="text-xs font-mono text-emerald-400 mt-1">{saveMessage}</p>
            )}
          </form>
        </div>

        {/* SQL Schema Copy Box */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl space-y-0">
          <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
              <Terminal className="w-4 h-4" />
              <span>/src/database/schema.sql (Copy to Supabase SQL Editor)</span>
            </div>

            <button
              onClick={handleCopy}
              className="px-4 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SQL Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy SQL Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-6 bg-slate-950 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[500px]">
            {sqlSchemaCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
