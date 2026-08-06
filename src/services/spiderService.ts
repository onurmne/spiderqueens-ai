import {
  UserProfile,
  Contestant,
  Vote,
  SuperVote,
  Competition,
  Winner,
  UploadFormData,
  N8nWebhookConfig,
} from "../types";
import { supabase, isSupabaseConfigured } from "../supabase/client";

// Helper function to generate RFC4122 compliant v4 UUIDs for PostgreSQL compatibility
export function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Convert legacy/string IDs to a valid RFC4122 UUID string
export function toValidUUID(id: string): string {
  if (!id) return "00000000-0000-4000-a000-000000000000";
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) {
    return id;
  }
  // Convert custom string like "cont-1", "cont-5", "guest-visitor-1" to fixed valid UUIDs
  if (id === "cont-1") return "10000000-0000-4000-a000-000000000001";
  if (id === "cont-2") return "10000000-0000-4000-a000-000000000002";
  if (id === "cont-3") return "10000000-0000-4000-a000-000000000003";
  if (id === "cont-4") return "10000000-0000-4000-a000-000000000004";
  if (id === "cont-5") return "10000000-0000-4000-a000-000000000005";
  if (id === "cont-6") return "10000000-0000-4000-a000-000000000006";
  if (id === "guest-visitor-1") return "00000000-0000-4000-a000-000000000000";
  if (id === "comp-month-8") return "22222222-2222-4222-a222-000000000001";

  // Generic fallback converting non-UUID string to deterministic UUID
  let hexStr = "";
  for (let i = 0; i < id.length; i++) {
    hexStr += id.charCodeAt(i).toString(16);
  }
  while (hexStr.length < 32) {
    hexStr += "0";
  }
  hexStr = hexStr.substring(0, 32);
  return `${hexStr.substring(0, 8)}-${hexStr.substring(8, 12)}-4${hexStr.substring(13, 16)}-a${hexStr.substring(17, 20)}-${hexStr.substring(20, 32)}`;
}

// Import generated visual assets
import heroGwenPic from "../assets/images/hero_spiderqueen_cosplay_1785866609591.jpg";
import gwenCardPic from "../assets/images/gwen_cosplay_card_1785866623877.jpg";
import silkCardPic from "../assets/images/silk_cosplay_card_1785866637691.jpg";
import venomCardPic from "../assets/images/venom_cosplay_card_1785866653231.jpg";

// Default Initial Seed Competition (Monthly)
export const CURRENT_COMPETITION: Competition = {
  id: "22222222-2222-4222-a222-000000000001",
  title: "Month #8: Spider-Verse Cyber Showdown",
  description: "Global monthly battle for the ultimate Spider-Queen title. Top voted contestant wins $1,000 cash, featured profile spotlight, and custom Spider Crown!",
  startDate: new Date(Date.now() - 12 * 86400000).toISOString(),
  endDate: new Date(Date.now() + 18 * 86400000).toISOString(),
  status: "active",
  prizePool: "$1,000 Cash + Featured Spotlight + Spider Crown",
  weekNumber: 8,
};

// Initial Seed Winners Archive
export const SEED_WINNERS: Winner[] = [
  {
    id: "40000000-0000-4000-a000-000000000007",
    competitionId: "22222222-2222-4222-a222-000000000007",
    competitionTitle: "Month #7: Neon Web Masters",
    contestantId: "10000000-0000-4000-a000-000000000002",
    displayName: "Elena Vance",
    country: "Germany",
    cosplayPhotoUrl: silkCardPic,
    totalVotes: 14820,
    weekNumber: 7,
    crownedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "40000000-0000-4000-a000-000000000006",
    competitionId: "22222222-2222-4222-a222-000000000006",
    competitionTitle: "Month #6: Symbiote Invasion",
    contestantId: "10000000-0000-4000-a000-000000000003",
    displayName: "Sakura Kishi",
    country: "Japan",
    cosplayPhotoUrl: venomCardPic,
    totalVotes: 18450,
    weekNumber: 6,
    crownedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: "40000000-0000-4000-a000-000000000005",
    competitionId: "22222222-2222-4222-a222-000000000005",
    competitionTitle: "Month #5: Multiverse Queens",
    contestantId: "10000000-0000-4000-a000-000000000004",
    displayName: "Sophia Martinez",
    country: "Mexico",
    cosplayPhotoUrl: gwenCardPic,
    totalVotes: 12990,
    weekNumber: 5,
    crownedAt: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
];

// Initial Seed Approved Contestants
export const INITIAL_CONTESTANTS: Contestant[] = [
  {
    id: "10000000-0000-4000-a000-000000000001",
    userId: "30000000-0000-4000-a000-000000000001",
    displayName: "Alexis 'Gwenom' Ray",
    username: "gwenom_synth",
    instagramUrl: "https://instagram.com/gwenom_synth",
    country: "United States",
    countryCode: "US",
    profilePhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    cosplayPhotoUrl: heroGwenPic,
    category: "Spider-Gwen",
    bio: "Cyberpunk Spider-Gwen suit crafted with 3D printed neon web shooters & carbon fiber armor panels.",
    status: "approved",
    voteCount: 4890,
    superVoteCount: 140,
    competitionId: "22222222-2222-4222-a222-000000000001",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    isFeatured: true,
  },
  {
    id: "10000000-0000-4000-a000-000000000002",
    userId: "30000000-0000-4000-a000-000000000002",
    displayName: "Mei Lin 'Silk' Tanaka",
    username: "silk_weaver_cos",
    instagramUrl: "https://instagram.com/silk_weaver_cos",
    country: "Japan",
    countryCode: "JP",
    profilePhotoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    cosplayPhotoUrl: silkCardPic,
    category: "Silk",
    bio: "Cindy Moon Silk cosplay with hand-stitched silk web mask & LED glowing eyes.",
    status: "approved",
    voteCount: 4210,
    superVoteCount: 110,
    competitionId: "22222222-2222-4222-a222-000000000001",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    isFeatured: true,
  },
  {
    id: "10000000-0000-4000-a000-000000000003",
    userId: "30000000-0000-4000-a000-000000000003",
    displayName: "Chloe De La Cruz",
    username: "venomous_queen",
    instagramUrl: "https://instagram.com/venomous_queen",
    country: "Spain",
    countryCode: "ES",
    profilePhotoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
    cosplayPhotoUrl: venomCardPic,
    category: "Venomized",
    bio: "Symbiote Queen Gwenom suit with UV reactive purple web tendrils.",
    status: "approved",
    voteCount: 3840,
    superVoteCount: 95,
    competitionId: "22222222-2222-4222-a222-000000000001",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    isFeatured: false,
  },
  {
    id: "10000000-0000-4000-a000-000000000004",
    userId: "30000000-0000-4000-a000-000000000004",
    displayName: "Sienna Miller",
    username: "sienna_spidergwen",
    instagramUrl: "https://instagram.com/sienna_spidergwen",
    country: "United Kingdom",
    countryCode: "GB",
    profilePhotoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    cosplayPhotoUrl: gwenCardPic,
    category: "Spider-Gwen",
    bio: "Classic Spider-Gwen hood & suit captured during sunset photoshoot in London.",
    status: "approved",
    voteCount: 3120,
    superVoteCount: 60,
    competitionId: "22222222-2222-4222-a222-000000000001",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    isFeatured: false,
  },
  {
    id: "10000000-0000-4000-a000-000000000005",
    userId: "30000000-0000-4000-a000-000000000005",
    displayName: "Camila Rossi",
    username: "camila_spiderwoman",
    instagramUrl: "https://instagram.com/camila_spiderwoman",
    country: "Brazil",
    countryCode: "BR",
    profilePhotoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
    cosplayPhotoUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
    category: "Spider-Woman",
    bio: "Jessica Drew Spider-Woman with functional web wings & metallic red accents.",
    status: "approved",
    voteCount: 2950,
    superVoteCount: 50,
    competitionId: "22222222-2222-4222-a222-000000000001",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    isFeatured: false,
  },
  {
    id: "10000000-0000-4000-a000-000000000006",
    userId: "30000000-0000-4000-a000-000000000006",
    displayName: "Aria Thorne",
    username: "aria_noir_spider",
    instagramUrl: "https://instagram.com/aria_noir_spider",
    country: "Canada",
    countryCode: "CA",
    profilePhotoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    cosplayPhotoUrl: heroGwenPic,
    category: "Original Spider-Queen",
    bio: "Spider-Noir Queen variant featuring velvet leather trench coat and brass goggles.",
    status: "pending",
    voteCount: 0,
    superVoteCount: 0,
    competitionId: "22222222-2222-4222-a222-000000000001",
    createdAt: new Date().toISOString(),
    isFeatured: false,
  },
];

// Initial Seed Current User (Guest Visitor by default)
export const DEFAULT_USER: UserProfile = {
  id: "00000000-0000-4000-a000-000000000000",
  email: "",
  username: "ziyaretci",
  displayName: "Ziyaretçi",
  role: "user",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
  superVoteBalance: 0,
  country: "TR",
  createdAt: new Date().toISOString(),
};

// Local Store Helper keys
const STORAGE_KEYS = {
  CONTESTANTS: "sq_contestants_v2",
  VOTES: "sq_votes_v2",
  SUPER_VOTES: "sq_super_votes_v2",
  USER: "sq_current_user_v3",
  N8N: "sq_n8n_config_v2",
  WINNERS: "sq_winners_v2",
};

class SpiderService {
  private contestants: Contestant[] = [];
  private votes: Vote[] = [];
  private superVotes: SuperVote[] = [];
  private currentUser: UserProfile = DEFAULT_USER;
  private n8nConfig: N8nWebhookConfig = {
    webhookUrl: "/api/n8n/webhook",
    enabled: true,
    telegramNotify: true,
    autoApprove: false,
  };
  private winners: Winner[] = SEED_WINNERS;

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    if (typeof localStorage === "undefined") return;

    // Load Contestants
    const storedContestants = localStorage.getItem(STORAGE_KEYS.CONTESTANTS);
    if (storedContestants) {
      try {
        this.contestants = JSON.parse(storedContestants);
      } catch {
        this.contestants = INITIAL_CONTESTANTS;
      }
    } else {
      this.contestants = INITIAL_CONTESTANTS;
      this.saveContestants();
    }

    // Load Votes
    const storedVotes = localStorage.getItem(STORAGE_KEYS.VOTES);
    if (storedVotes) {
      try {
        this.votes = JSON.parse(storedVotes);
      } catch {
        this.votes = [];
      }
    }

    // Load Super Votes
    const storedSuperVotes = localStorage.getItem(STORAGE_KEYS.SUPER_VOTES);
    if (storedSuperVotes) {
      try {
        this.superVotes = JSON.parse(storedSuperVotes);
      } catch {
        this.superVotes = [];
      }
    }

    // Clean legacy stored user keys if any exist
    try {
      localStorage.removeItem("sq_current_user_v1");
      localStorage.removeItem("sq_current_user_v2");
      localStorage.removeItem("sq_current_user");
    } catch {
      // Ignore storage cleanup errors
    }

    // Load User
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (
          !parsed ||
          parsed.id === "user-demo-1" ||
          parsed.username === "spider_fanatic" ||
          parsed.displayName === "Spider Fanatic"
        ) {
          this.currentUser = { ...DEFAULT_USER };
          this.saveUser();
        } else {
          this.currentUser = parsed;
        }
      } catch {
        this.currentUser = { ...DEFAULT_USER };
        this.saveUser();
      }
    } else {
      this.currentUser = { ...DEFAULT_USER };
      this.saveUser();
    }
  }

  private saveContestants() {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.CONTESTANTS, JSON.stringify(this.contestants));
    }
  }

  private saveVotes() {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(this.votes));
    }
  }

  private saveSuperVotes() {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.SUPER_VOTES, JSON.stringify(this.superVotes));
    }
  }

  private saveUser() {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.currentUser));
    }
  }

  public saveN8nConfig(config: N8nWebhookConfig) {
    this.n8nConfig = config;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.N8N, JSON.stringify(config));
    }
  }

  public getN8nConfig(): N8nWebhookConfig {
    return this.n8nConfig;
  }

  public getCurrentUser(): UserProfile {
    return { ...this.currentUser };
  }

  public setUserRole(role: "user" | "contestant" | "admin") {
    this.currentUser = { ...this.currentUser, role };
    this.saveUser();
  }

  public addSuperVoteTokens(amount: number) {
    this.currentUser = {
      ...this.currentUser,
      superVoteBalance: this.currentUser.superVoteBalance + amount,
    };
    this.saveUser();
    return this.currentUser.superVoteBalance;
  }

  // Get Approved Contestants (Returns fresh clones for React reactivity)
  public getApprovedContestants(): Contestant[] {
    return this.contestants
      .filter((c) => c.status === "approved")
      .map((c) => ({ ...c }))
      .sort((a, b) => b.voteCount - a.voteCount);
  }

  // Get All Contestants for Admin Moderation
  public getAllContestants(): Contestant[] {
    return this.contestants
      .map((c) => ({ ...c }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Check if User already voted TODAY for this contestant (1 Vote per day constraint)
  public hasUserVotedToday(contestantId: string, userId: string = this.currentUser.id): boolean {
    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    return this.votes.some(
      (v) => v.userId === userId && v.contestantId === contestantId && v.createdAt.startsWith(todayStr)
    );
  }

  // Alias for backward compatibility
  public hasUserVoted(contestantId: string, userId: string = this.currentUser.id): boolean {
    return this.hasUserVotedToday(contestantId, userId);
  }

  // Helper to ensure current user is upserted in Supabase users table
  private async syncUserToSupabase() {
    if (!isSupabaseConfigured || !this.currentUser) return;
    try {
      const validUserId = toValidUUID(this.currentUser.id);
      const userPayload = {
        id: validUserId,
        email: this.currentUser.email || `${this.currentUser.username || 'user'}@spiderqueens.app`,
        username: this.currentUser.username || "user_" + validUserId.substring(0, 6),
        display_name: this.currentUser.displayName || "Ziyaretçi",
        role: this.currentUser.role || "user",
        avatar_url: this.currentUser.avatarUrl || "",
        super_vote_balance: this.currentUser.superVoteBalance || 0,
        country: this.currentUser.country || "TR",
      };
      await supabase.from("users").upsert([userPayload], { onConflict: "id" });
    } catch (err) {
      // Catch silently if users table is omitted or restricted
    }
  }

  // Load latest data directly from Supabase tables
  public async loadInitialDataFromSupabase() {
    if (!isSupabaseConfigured) return;

    try {
      console.log("🔍 [Supabase Sync] Veritabanından veriler senkronize ediliyor...");

      await this.syncUserToSupabase();

      // Fetch votes from Supabase
      const { data: dbVotes, error: votesErr } = await supabase.from("votes").select("*");
      if (!votesErr && dbVotes) {
        const parsedVotes: Vote[] = dbVotes.map((v: any) => ({
          id: v.id,
          userId: v.user_id,
          contestantId: v.contestant_id,
          createdAt: v.created_at,
        }));
        this.votes = parsedVotes;
        this.saveVotes();
        console.log(`✅ [Supabase Sync] ${parsedVotes.length} adet oy Supabase veritabanından çekildi.`);
      }

      // Fetch super_votes from Supabase
      const { data: dbSuperVotes, error: superVotesErr } = await supabase.from("super_votes").select("*");
      if (!superVotesErr && dbSuperVotes) {
        const parsedSuperVotes: SuperVote[] = dbSuperVotes.map((sv: any) => ({
          id: sv.id,
          userId: sv.user_id,
          contestantId: sv.contestant_id,
          amount: sv.amount || 10,
          createdAt: sv.created_at,
        }));
        this.superVotes = parsedSuperVotes;
        this.saveSuperVotes();
        console.log(`✅ [Supabase Sync] ${parsedSuperVotes.length} adet süper oy Supabase veritabanından çekildi.`);
      }

      // Fetch contestants from Supabase
      const { data: dbContestants, error: contestantsErr } = await supabase.from("contestants").select("*");
      if (!contestantsErr && dbContestants && dbContestants.length > 0) {
        const parsedContestants: Contestant[] = dbContestants.map((c: any) => ({
          id: c.id,
          userId: c.user_id,
          displayName: c.display_name,
          username: c.username,
          instagramUrl: c.instagram_url,
          country: c.country,
          countryCode: c.country_code || "TR",
          profilePhotoUrl: c.profile_photo_url,
          cosplayPhotoUrl: c.cosplay_photo_url,
          category: c.category,
          bio: c.bio,
          status: c.status,
          rejectionReason: c.rejection_reason,
          voteCount: c.vote_count || 0,
          superVoteCount: c.super_vote_count || 0,
          competitionId: c.competition_id || CURRENT_COMPETITION.id,
          createdAt: c.created_at,
          isFeatured: c.is_featured,
        }));
        this.contestants = parsedContestants;
        this.saveContestants();
        console.log(`✅ [Supabase Sync] ${parsedContestants.length} adet yarışmacı Supabase veritabanından çekildi.`);
      } else if (!contestantsErr && dbContestants && dbContestants.length === 0) {
        console.log("🌱 [Supabase Sync] Veritabanı boş. Başlangıç kullanıcıları ve yarışmacıları Supabase'e yükleniyor...");

        // First seed users so foreign key references match
        const seedUsers = INITIAL_CONTESTANTS.map((c) => ({
          id: toValidUUID(c.userId),
          email: `${c.username}@spiderqueens.app`,
          username: c.username,
          display_name: c.displayName,
          role: "contestant",
          avatar_url: c.profilePhotoUrl,
          super_vote_balance: 10,
          country: c.country,
        }));

        try {
          await supabase.from("users").upsert(seedUsers, { onConflict: "id" });
        } catch {
          // ignore
        }

        const seedPayloads = INITIAL_CONTESTANTS.map((c) => ({
          id: toValidUUID(c.id),
          user_id: toValidUUID(c.userId),
          display_name: c.displayName,
          username: c.username,
          instagram_url: c.instagramUrl,
          country: c.country,
          country_code: c.countryCode,
          profile_photo_url: c.profilePhotoUrl,
          cosplay_photo_url: c.cosplayPhotoUrl,
          category: c.category,
          bio: c.bio,
          status: c.status,
          vote_count: c.voteCount,
          super_vote_count: c.superVoteCount,
          competition_id: toValidUUID(c.competitionId),
          is_featured: c.isFeatured || false,
          created_at: c.createdAt,
        }));

        const { error: seedErr } = await supabase.from("contestants").insert(seedPayloads);
        if (!seedErr) {
          console.log("✅ [Supabase Sync] Başlangıç yarışmacıları Supabase'e kaydedildi!");
        } else {
          console.warn("⚠️ [Supabase Sync Contestants Hata]:", seedErr.message);
        }
      }
    } catch (err) {
      console.warn("⚠️ [Supabase Sync Hata]:", err);
    }
  }

  // Cast Standard Vote (Max 1 vote per contestant per day)
  public async castVote(contestantId: string): Promise<{ success: boolean; message: string; newVoteCount: number }> {
    const userId = this.currentUser.id;

    if (this.hasUserVotedToday(contestantId, userId)) {
      return {
        success: false,
        message: "Bugün bu Kraliçe için zaten oy kullandınız! Günde 1 defa ücretsiz oy kullanabilirsiniz. Dilerseniz Süper Oy ile destekleyebilirsiniz.",
        newVoteCount: this.getContestantById(contestantId)?.voteCount || 0,
      };
    }

    const newVote: Vote = {
      id: generateUUID(),
      userId,
      contestantId,
      createdAt: new Date().toISOString(),
    };

    this.votes.push(newVote);
    this.saveVotes();

    const contestant = this.contestants.find((c) => c.id === contestantId);
    if (contestant) {
      contestant.voteCount += 1;
      this.saveContestants();
    }

    // --- SUPABASE REALTIME PERSISTENCE ---
    if (isSupabaseConfigured) {
      try {
        await this.syncUserToSupabase();

        const validContestantId = toValidUUID(contestantId);
        const validUserId = toValidUUID(userId);

        const votePayload = {
          id: newVote.id,
          user_id: validUserId,
          contestant_id: validContestantId,
          created_at: newVote.createdAt,
        };

        const { error: voteErr } = await supabase.from("votes").insert([votePayload]);
        if (voteErr) {
          console.warn("⚠️ [Supabase Votes Hata]:", voteErr.message);
        } else {
          console.log("🎉 [Supabase] OY BAŞARIYLA 'votes' TABLOSUNA KAYDEDİLDİ!", votePayload);
        }

        if (contestant) {
          const { error: contErr } = await supabase
            .from("contestants")
            .update({ vote_count: contestant.voteCount })
            .eq("id", validContestantId);

          if (contErr) {
            console.warn("⚠️ [Supabase Contestants Hata]:", contErr.message);
            // Fallback try with raw contestantId
            await supabase
              .from("contestants")
              .update({ vote_count: contestant.voteCount })
              .eq("id", contestantId);
          } else {
            console.log(`🎉 [Supabase] Contestants tablosunda ${contestant.displayName} oy sayısı güncellendi: ${contestant.voteCount}`);
          }
        }
      } catch (err) {
        console.warn("⚠️ [Supabase Sync Error]:", err);
      }
    }

    return {
      success: true,
      message: "🕷️ Oyunuz başarıyla kaydedildi! Bugün bu Kraliçe için 1 oyunuzu kullandınız.",
      newVoteCount: contestant ? contestant.voteCount : 0,
    };
  }

  // Cast Super Vote (10 Votes)
  public async castSuperVote(contestantId: string, amount: number = 10): Promise<{ success: boolean; message: string; newVoteCount: number }> {
    if (this.currentUser.superVoteBalance < 1) {
      return {
        success: false,
        message: `Süper Oy jetonunuz bulunmuyor! Lütfen mağazadan jeton satın alın.`,
        newVoteCount: this.getContestantById(contestantId)?.voteCount || 0,
      };
    }

    this.currentUser.superVoteBalance -= 1;
    this.saveUser();

    const newSuperVote: SuperVote = {
      id: generateUUID(),
      userId: this.currentUser.id,
      contestantId,
      amount,
      createdAt: new Date().toISOString(),
    };
    this.superVotes.push(newSuperVote);
    this.saveSuperVotes();

    const contestant = this.contestants.find((c) => c.id === contestantId);
    if (contestant) {
      contestant.voteCount += amount;
      contestant.superVoteCount += 1;
      this.saveContestants();
    }

    // --- SUPABASE REALTIME PERSISTENCE ---
    if (isSupabaseConfigured) {
      try {
        await this.syncUserToSupabase();

        const validContestantId = toValidUUID(contestantId);
        const validUserId = toValidUUID(this.currentUser.id);

        const superVotePayload = {
          id: newSuperVote.id,
          user_id: validUserId,
          contestant_id: validContestantId,
          amount,
          created_at: newSuperVote.createdAt,
        };

        const { error: svErr } = await supabase.from("super_votes").insert([superVotePayload]);
        if (svErr) {
          console.warn("⚠️ [Supabase SuperVotes Hata]:", svErr.message);
        } else {
          console.log("🎉 [Supabase] SÜPER OY BAŞARIYLA 'super_votes' TABLOSUNA KAYDEDİLDİ!", superVotePayload);
        }

        if (contestant) {
          const { error: contErr } = await supabase
            .from("contestants")
            .update({
              vote_count: contestant.voteCount,
              super_vote_count: contestant.superVoteCount,
            })
            .eq("id", validContestantId);

          if (contErr) {
            console.warn("⚠️ [Supabase Contestants Hata]:", contErr.message);
          } else {
            console.log(`🎉 [Supabase] Contestants tablosunda ${contestant.displayName} süper oy sayısı güncellendi!`);
          }
        }
      } catch (err) {
        console.warn("⚠️ [Supabase Sync Error]:", err);
      }
    }

    return {
      success: true,
      message: `⚡ SÜPER OY GÖNDERİLDİ! ${contestant?.displayName || "Kraliçe"} için +${amount} Oy Eklendi!`,
      newVoteCount: contestant ? contestant.voteCount : 0,
    };
  }

  // Submit New Cosplay Upload
  public async submitContestant(formData: UploadFormData): Promise<{ contestant: Contestant; n8nTriggered: boolean }> {
    const isAutoApprove = this.n8nConfig.autoApprove;
    const newContestant: Contestant = {
      id: generateUUID(),
      userId: toValidUUID(this.currentUser.id),
      displayName: formData.displayName,
      username: formData.username.replace(/^@/, ""),
      instagramUrl: formData.instagramUrl.startsWith("http")
        ? formData.instagramUrl
        : `https://instagram.com/${formData.instagramUrl.replace(/^@/, "")}`,
      country: formData.country,
      countryCode: formData.countryCode || "TR",
      profilePhotoUrl: formData.profilePhotoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      cosplayPhotoUrl: formData.cosplayPhotoUrl,
      category: formData.category,
      bio: formData.bio,
      status: isAutoApprove ? "approved" : "pending",
      voteCount: 0,
      superVoteCount: 0,
      competitionId: CURRENT_COMPETITION.id,
      createdAt: new Date().toISOString(),
    };

    this.contestants.unshift(newContestant);
    this.saveContestants();

    if (this.currentUser.role === "user") {
      this.setUserRole("contestant");
    }

    // --- SUPABASE REALTIME PERSISTENCE ---
    if (isSupabaseConfigured) {
      try {
        await this.syncUserToSupabase();

        const contestantPayload = {
          id: newContestant.id,
          user_id: toValidUUID(newContestant.userId),
          display_name: newContestant.displayName,
          username: newContestant.username,
          instagram_url: newContestant.instagramUrl,
          country: newContestant.country,
          country_code: newContestant.countryCode,
          profile_photo_url: newContestant.profilePhotoUrl,
          cosplay_photo_url: newContestant.cosplayPhotoUrl,
          category: newContestant.category,
          bio: newContestant.bio,
          status: newContestant.status,
          vote_count: 0,
          super_vote_count: 0,
          competition_id: toValidUUID(newContestant.competitionId),
          created_at: newContestant.createdAt,
        };

        const { error: contErr } = await supabase.from("contestants").insert([contestantPayload]);
        if (contErr) {
          console.warn("⚠️ [Supabase Contestant Insert Hata]:", contErr.message);
        } else {
          console.log("🎉 [Supabase] YENİ YARIŞMACI 'contestants' TABLOSUNA KAYDEDİLDİ!", contestantPayload);
        }
      } catch (err) {
        console.warn("⚠️ [Supabase Sync Error]:", err);
      }
    }

    return { contestant: newContestant, n8nTriggered: true };
  }

  // Admin Approve Submission
  public async approveContestant(id: string): Promise<Contestant | undefined> {
    const contestant = this.contestants.find((c) => c.id === id);
    if (contestant) {
      contestant.status = "approved";
      this.saveContestants();

      if (isSupabaseConfigured) {
        await supabase.from("contestants").update({ status: "approved" }).eq("id", toValidUUID(id));
      }
    }
    return contestant;
  }

  // Admin Reject Submission
  public async rejectContestant(id: string, reason: string): Promise<Contestant | undefined> {
    const contestant = this.contestants.find((c) => c.id === id);
    if (contestant) {
      contestant.status = "rejected";
      contestant.rejectionReason = reason;
      this.saveContestants();

      if (isSupabaseConfigured) {
        await supabase.from("contestants").update({ status: "rejected", rejection_reason: reason }).eq("id", toValidUUID(id));
      }
    }
    return contestant;
  }

  // Admin Delete Content
  public async deleteContestant(id: string) {
    this.contestants = this.contestants.filter((c) => c.id !== id);
    this.saveContestants();

    if (isSupabaseConfigured) {
      await supabase.from("contestants").delete().eq("id", toValidUUID(id));
    }
  }

  // Admin Crown Winner
  public crownWeeklyWinner(contestantId: string): Winner | undefined {
    const contestant = this.getContestantById(contestantId);
    if (!contestant) return undefined;

    const newWinner: Winner = {
      id: generateUUID(),
      competitionId: CURRENT_COMPETITION.id,
      competitionTitle: CURRENT_COMPETITION.title,
      contestantId: contestant.id,
      displayName: contestant.displayName,
      country: contestant.country,
      cosplayPhotoUrl: contestant.cosplayPhotoUrl,
      totalVotes: contestant.voteCount,
      weekNumber: CURRENT_COMPETITION.weekNumber,
      crownedAt: new Date().toISOString(),
    };

    this.winners.unshift(newWinner);

    if (isSupabaseConfigured) {
      supabase.from("winners").insert([{
        id: newWinner.id,
        competition_id: newWinner.competitionId,
        competition_title: newWinner.competitionTitle,
        contestant_id: newWinner.contestantId,
        display_name: newWinner.displayName,
        country: newWinner.country,
        cosplay_photo_url: newWinner.cosplayPhotoUrl,
        total_votes: newWinner.totalVotes,
        week_number: newWinner.weekNumber,
        crowned_at: newWinner.crownedAt,
      }]).then();
    }

    return newWinner;
  }

  public getWinners(): Winner[] {
    return [...this.winners];
  }

  public getContestantById(id: string): Contestant | undefined {
    const contestant = this.contestants.find((c) => c.id === id);
    return contestant ? { ...contestant } : undefined;
  }

  public resetDemoData() {
    this.contestants = INITIAL_CONTESTANTS;
    this.votes = [];
    this.superVotes = [];
    this.currentUser = DEFAULT_USER;
    this.saveContestants();
    this.saveVotes();
    this.saveSuperVotes();
    this.saveUser();
  }
}

export const spiderService = new SpiderService();
