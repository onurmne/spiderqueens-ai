import { supabase as libSupabase, isSupabaseConfigured as libIsConfigured } from "../lib/supabase";

// Retrieve Supabase config from environment or runtime localStorage settings
export const getSupabaseCredentials = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || "";
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

  const customUrl = typeof localStorage !== "undefined" ? localStorage.getItem("sq_supabase_url") || "" : "";
  const customKey = typeof localStorage !== "undefined" ? localStorage.getItem("sq_supabase_key") || "" : "";

  return {
    url: customUrl || envUrl,
    key: customKey || envKey,
  };
};

const { url, key } = getSupabaseCredentials();

export const isSupabaseConfigured = Boolean((url && key && url.includes("supabase")) || libIsConfigured);

export const supabase = libSupabase;

export const setSupabaseCredentialsInStorage = (newUrl: string, newKey: string) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("sq_supabase_url", newUrl);
    localStorage.setItem("sq_supabase_key", newKey);
  }
};

