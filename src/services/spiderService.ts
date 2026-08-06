import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase Yapılandırması (Ortam değişkenlerinden veya doğrudan tanımlardan alınabilir)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase: SupabaseClient | null = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: 'admin' | 'user';
  avatarUrl: string;
  superVoteBalance: number;
  country: string;
  createdAt: string;
}

export interface Contestant {
  id: string;
  name: string;
  username: string;
  imageUrl: string;
  votes: number;
  country: string;
  instagramUrl?: string;
  bio?: string;
}

export interface RewardPoolStatus {
  month: string;
  totalSuperVotesThisMonth: number;
  thresholdRequired: number;
  isUnlocked: boolean;
  prizeAmount: number;
  statusMessage: string;
}

// Basit UUID üreteci (Tarayıcı ve Node ortamı uyumlu)
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class SpiderService {
  public currentUser: UserProfile | null = null;
  public contestants: Contestant[] = [];
  
  private readonly MONTHLY_PRIZE_USD = 1000;
  private readonly MIN_SUPER_VOTE_THRESHOLD = 1000;

  constructor() {
    this.loadUserLocal();
  }

  private loadUserLocal() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('spider_current_user');
        if (saved) {
          this.currentUser = JSON.parse(saved);
        }
      } catch (err) {
        console.error("Local user load error:", err);
      }
    }
  }

  private saveUser() {
    if (typeof window !== 'undefined' && this.currentUser) {
      localStorage.setItem('spider_current_user', JSON.stringify(this.currentUser));
    }
  }

  /**
   * Kullanıcı kayıt veya giriş metodu (E-posta mükerrer kontrolü ile)
   */
  public async registerOrLoginUser(data: {
    displayName: string;
    username: string;
    email: string;
    country?: string;
    avatarUrl?: string;
  }): Promise<UserProfile> {
    const cleanedEmail = data.email.trim().toLowerCase();
    const cleanedUsername = data.username.replace(/^@/, "").trim();

    // 1. Supabase aktifse veritabanında aynı e-posta ile kayıtlı kullanıcı var mı kontrol et
    if (isSupabaseConfigured && supabase && cleanedEmail) {
      try {
        const { data: existingDbUsers, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", cleanedEmail)
          .limit(1);

        if (!error && existingDbUsers && existingDbUsers.length > 0) {
          const dbUser = existingDbUsers[0];
          this.currentUser = {
            id: dbUser.id,
            email: dbUser.email,
            username: dbUser.username,
            displayName: dbUser.display_name,
            role: dbUser.role || "user",
            avatarUrl: dbUser.avatar_url || data.avatarUrl,
            superVoteBalance: dbUser.super_vote_balance ?? 10,
            country: dbUser.country || data.country || "TR",
            createdAt: dbUser.created_at,
          };
          this.saveUser();
          return this.currentUser;
        }
      } catch (err) {
        console.warn("⚠️ [Supabase Duplicate Email Check Error]:", err);
      }
    }

    // 2. Eğer daha önce kayıt olunmamışsa yeni kullanıcı oluştur
    const newUser: UserProfile = {
      id: generateUUID(),
      email: cleanedEmail,
      username: cleanedUsername,
      displayName: data.displayName,
      role: "user",
      avatarUrl:
        data.avatarUrl ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      superVoteBalance: 10,
      country: data.country || "TR",
      createdAt: new Date().toISOString(),
    };

    this.currentUser = newUser;
    this.saveUser();
    await this.syncUserToSupabase(newUser);
    return this.currentUser;
  }

  private async syncUserToSupabase(user: UserProfile) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from("users").upsert({
        id: user.id,
        email: user.email,
        username: user.username,
        display_name: user.displayName,
        role: user.role,
        avatar_url: user.avatarUrl,
        super_vote_balance: user.superVoteBalance,
        country: user.country,
        created_at: user.createdAt,
      });
    } catch (err) {
      console.error("Sync user to Supabase error:", err);
    }
  }

  /**
   * Aylık 1000$ ödül havuzunun ve eşik durumunun kontrolü
   */
  public async checkMonthlyRewardStatus(): Promise<RewardPoolStatus> {
    const currentMonthStr = new Date().toISOString().slice(0, 7); // Örn: "2026-06"
    let totalVotes = 0;

    if (isSupabaseConfigured && supabase) {
      try {
        const { count, error } = await supabase
          .from("transactions")
          .select("*", { count: "exact", head: true })
          .gte("created_at", `${currentMonthStr}-01T00:00:00.000Z`);

        if (!error && count !== null) {
          totalVotes = count;
        }
      } catch (err) {
        console.warn("⚠️ [Reward Status Check Error]:", err);
      }
    }

    const isUnlocked = totalVotes >= this.MIN_SUPER_VOTE_THRESHOLD;

    return {
      month: currentMonthStr,
      totalSuperVotesThisMonth: totalVotes,
      thresholdRequired: this.MIN_SUPER_VOTE_THRESHOLD,
      isUnlocked,
      prizeAmount: isUnlocked ? this.MONTHLY_PRIZE_USD : 0,
      statusMessage: isUnlocked 
        ? `Tebrikler! ${this.MONTHLY_PRIZE_USD}$ büyük ödül bu ay için aktifleşti.` 
        : `Ödül havuzu aktifleşmesi için ${this.MIN_SUPER_VOTE_THRESHOLD - totalVotes} Super Vote daha gerekiyor (Devreder).`
    };
  }

  public logout() {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('spider_current_user');
    }
  }
}

export const spiderService = new SpiderService();
