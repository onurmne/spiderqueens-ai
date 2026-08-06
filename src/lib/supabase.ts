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
  console.log("🔍 [Supabase] Bağlantı kontrolü yapılıyor...");

  if (!isSupabaseConfigured) {
    console.warn("⚠️ [Supabase] VITE_SUPABASE_URL veya VITE_SUPABASE_ANON_KEY çevre değişkenleri tanımsız. Uygulama yerel modda (LocalStorage) çalışıyor.");
    return false;
  }

  try {
    const { error } = await supabase.from("contestants").select("id").limit(1);

    if (
      error &&
      (error.message?.includes("fetch") ||
        error.message?.includes("NetworkError") ||
        error.message?.includes("Failed to parse URL"))
    ) {
      console.error("❌ Supabase Connection Failed - Sunucuya Erişilemedi:");
      console.error("Hata Detayı:", error.message || error);
      return false;
    }

    console.log("✅ Supabase Connected - Supabase Veritabanı Bağlantısı Başarılı!");
    return true;
  } catch (err: any) {
    console.error("❌ Supabase Connection Failed - Bağlantı Hatası:", err?.message || String(err));
    return false;
  }
}

// Automatically test connection on application startup
testSupabaseConnection();
