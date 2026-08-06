import { createClient } from "@supabase/supabase-js";
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

// Use raw untyped/clean client to avoid build minification errors (jn is not a function)
export const supabase = url && key ? createClient(url, key) : libSupabase;

export const setSupabaseCredentialsInStorage = (newUrl: string, newKey: string) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("sq_supabase_url", newUrl);
    localStorage.setItem("sq_supabase_key", newKey);
  }
};

/**
 * On application startup, checks whether the Supabase client initializes correctly
 * and verifies connection by querying core database tables.
 */
export async function testSupabaseConnection(): Promise<boolean> {
  if (!isSupabaseConfigured) {
    console.error("❌ Supabase Connection Failed");
    console.error(
      "Error Details: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables."
    );
    return false;
  }

  console.log("🔍 Supabase bağlantı ve tablo testi başlatılıyor...");
  const tables = ['profiles', 'competitions', 'contestants', 'votes', 'super_votes', 'winners'];
  let hasError = false;

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      
      if (error) {
        console.error(`❌ [${table}] tablosu hatası:`, error.message);
        hasError = true;
      } else {
        console.log(`✅ [${table}] tablosu başarılı! Kayıtlı veri var.`, data?.length ?? 0);
      }
    } catch (err: any) {
      console.error(`❌ [${table}] bağlantı istisnası:`, err?.message || String(err));
      hasError = true;
    }
  }

  if (hasError) {
    console.warn("⚠️ Bazı tablolara erişimde sorun yaşandı. RLS politikalarını kontrol edin.");
    return false;
  } else {
    console.log("🎉 Tüm Supabase tablo bağlantıları kusursuz çalışıyor!");
    return true;
  }
}
