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
 * and can reach the Supabase backend.
 */
export async function testSupabaseConnection(): Promise<boolean> {
  if (!isSupabaseConfigured) {
    console.error("❌ Supabase Connection Failed");
    console.error(
      "Error Details: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables."
    );
    return false;
  }

  try {
    // Test API connectivity to Supabase
    const { error } = await supabase.from("_connection_test").select("*").limit(0);

    // If fetch failed due to invalid domain or network offline
    if (
      error &&
      (error.message?.includes("fetch") ||
        error.message?.includes("NetworkError") ||
        error.message?.includes("Failed to parse URL"))
    ) {
      console.error("❌ Supabase Connection Failed");
      console.error("Error Details:", error.message || error);
      return false;
    }

    console.log("✅ Supabase Connected");
    return true;
  } catch (err: any) {
    console.error("❌ Supabase Connection Failed");
    console.error("Error Details:", err?.message || String(err));
    return false;
  }
}

// Automatically test connection on application startup
testSupabaseConnection();

// Bağlantı ve tablo testi
export async function testSupabaseConnection() {
    console.log("🔍 Supabase bağlantı testi başlatılıyor...");
    const tables = ['profiles', 'competitions', 'contestants', 'votes'];
    
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.error(`❌ [${table}] tablosu hatası:`, error.message);
        } else {
            console.log(`✅ [${table}] tablosu başarılı! Kayıt sayısı:`, data.length);
        }
    }
}

// Otomatik tetikle
testSupabaseConnection();
