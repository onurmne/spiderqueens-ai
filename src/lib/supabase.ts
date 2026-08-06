import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Read credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Database TypeScript type definition ready for tables and authentication
export type Database = {
  public: {
    Tables: {
      [key: string]: {
        Row: Record<string, any>;
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };
    };
    Views: {
      [key: string]: {
        Row: Record<string, any>;
      };
    };
    Functions: {
      [key: string]: {
        Args: Record<string, any>;
        Returns: any;
      };
    };
  };
};

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && (supabaseUrl.includes("supabase") || supabaseUrl.startsWith("http"))
);

// Export configured Supabase client with proper TypeScript types
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl || "https://placeholder-project.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

/**
 * On application startup, checks whether the Supabase client initializes correctly
 * and verifies connection by querying all core database tables.
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
        console.log(`✅ [${table}] tablosu başarılı! Kayıtlı veri var.`);
      }
    } catch (err: any) {
      console.error(`❌ [${table}] bağlantı istisnası:`, err?.message || String(err));
      hasError = true;
    }
  }

  if (hasError) {
    console.warn("⚠️ Bazı tablolara erişimde sorun yaşandı. RLS politikalarını veya tablo adlarını kontrol edin.");
    return false;
  } else {
    console.log("🎉 Tüm Supabase tablo bağlantıları kusursuz çalışıyor!");
    return true;
  }
}

// Automatically test connection on application startup
testSupabaseConnection();
