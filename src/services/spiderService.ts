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

// Import generated visual assets
import heroGwenPic from "../assets/images/hero_spiderqueen_cosplay_1785866609591.jpg";
import gwenCardPic from "../assets/images/gwen_cosplay_card_1785866623877.jpg";
import silkCardPic from "../assets/images/silk_cosplay_card_1785866637691.jpg";
import venomCardPic from "../assets/images/venom_cosplay_card_1785866653231.jpg";

// Standalone UUID format validation helper to prevent minification scope loss
const isValidUUID = (id: string): boolean => {
  if (!id || typeof id !== "string") return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Default Initial Seed Competition (Monthly)
export const CURRENT_COMPETITION: Competition = {
  id: "comp-month-8",
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
    id: "win-7",
    competitionId: "comp-month-7",
    competitionTitle: "Month #7: Neon Web Masters",
    contestantId: "c-archive-1",
    displayName: "Elena Vance",
    country: "Germany",
    cosplayPhotoUrl: silkCardPic,
    totalVotes: 14820,
    weekNumber: 7,
    crownedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "win-6",
    competitionId: "comp-month-6",
    competitionTitle: "Month #6: Symbiote Invasion",
    contestantId: "c-archive-2",
    displayName: "Sakura Kishi",
    country: "Japan",
    cosplayPhotoUrl: venomCardPic,
    totalVotes: 18450,
    weekNumber: 6,
    crownedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: "win-5",
    competitionId: "comp-month-5",
    competitionTitle: "Month #5: Multiverse Queens",
    contestantId: "c-archive-3",
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
    id: "cont-1",
    userId: "u-gwen",
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
    competitionId: "comp-month-8",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    isFeatured: true,
  },
  {
    id: "cont-2",
    userId: "u-silk",
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
    competitionId: "comp-month-8",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    isFeatured: true,
  },
  {
    id: "cont-3",
    userId: "u-venom",
    displayName: "Chloe De La Cruz",
    username: "venomous_queen",
    instagramUrl: "https://instagram.com/venomous_queen",
    country: "Spain",
    countryCode: "ES",
    profilePhotoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
    cosplayPhotoUrl: venomCardPic,
    category: "Symbioted",
    bio: "Symbiote Queen Gwenom suit with UV reactive purple web tendrils.",
    status: "approved",
    voteCount: 3840,
    superVoteCount: 95,
    competitionId: "comp-month-8",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    isFeatured: false,
  },
  {
    id: "cont-4",
    userId: "u-gwen-classic",
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
    competitionId: "comp-month-8",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    isFeatured: false,
  },
  {
    id: "cont-5",
    userId: "u-spiderwoman",
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
    competitionId: "comp-month-8",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    isFeatured: false,
  },
  {
    id: "cont-6",
    userId: "u-pending-demo",
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
    competitionId: "comp-month-8",
    createdAt: new Date().toISOString(),
    isFeatured: false,
  },
];

// Initial Seed Current User
export const DEFAULT_USER: UserProfile = {
  id: "user-demo-1",
  email: "cosplayer@spiderqueens.app",
  username: "spider_fanatic",
  displayName: "Spider Fanatic",
  role: "user",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
  superVoteBalance: 25,
  country: "United States",
  createdAt: new Date().toISOString(),
};

// Local Store Helper keys (fallback storage)
const STORAGE_KEYS = {
  CONTESTANTS: "sq_contestants_v2",
  VOTES: "sq_votes_v2",
  SUPER_VOTES: "sq_super_votes_v2",
  USER: "sq_current_user_v2",
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

  private async loadInitialData() {
    if (typeof localStorage === "undefined") return;

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

    const storedVotes = localStorage.getItem(STORAGE_KEYS.VOTES);
    if (storedVotes) {
      try {
        this.votes = JSON.parse(storedVotes);
      } catch {
        this.votes = [];
      }
    }

    const storedSuperVotes = localStorage.getItem(STORAGE_KEYS.SUPER_VOTES);
    if (storedSuperVotes) {
      try {
        this.superVotes = JSON.parse(storedSuperVotes);
      } catch {
        this.superVotes = [];
      }
    }

    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
      } catch {
        this.currentUser = DEFAULT_USER;
      }
    }

    // Try fetching live data from Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const { data: remoteContestants, error } = await supabase.from('contestants').select('*');
        if (!error && remoteContestants && remoteContestants.length > 0) {
          this.contestants = remoteContestants.map((c: any) => ({
            id: c.id,
            userId: c.profile_id,
            displayName: c.display_name,
            username: c.username,
            instagramUrl: c.instagram_url,
            country: c.country,
            countryCode: c.country_code,
            profilePhotoUrl: c.profile_photo_url,
            cosplayPhotoUrl: c.cosplay_photo_url,
            category: c.category,
            bio: c.bio,
            status: c.status,
            rejectionReason: c.rejection_reason,
            voteCount: c.vote_count ?? 0,
            superVoteCount: c.super_vote_count ?? 0,
            competitionId: c.competition_id,
            createdAt: c.created_at,
            isFeatured: c.is_featured ?? false,
          }));
        }
      } catch (err) {
        console.warn("Supabase fetch fallback to local state:", err);
      }
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

  public getApprovedContestants(): Contestant[] {
    return this.contestants
      .filter((c) => c.status === "approved")
      .map((c) => ({ ...c }))
      .sort((a, b) => b.voteCount - a.voteCount);
  }

  public getAllContestants(): Contestant[] {
    return this.contestants
      .map((c) => ({ ...c }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public hasUserVotedToday(contestantId: string, userId: string = this.currentUser.id): boolean {
    const todayStr = new Date().toISOString().split("T")[0];
    return this.votes.some(
      (v) => v.userId === userId && v.contestantId === contestantId && v.createdAt.startsWith(todayStr)
    );
  }

  public hasUserVoted(contestantId: string, userId: string = this.currentUser.id): boolean {
    return this.hasUserVotedToday(contestantId, userId);
  }

  private async ensureSupabaseProfile(userId: string) {
    if (!isSupabaseConfigured || !isValidUUID(userId)) return;
    try {
      const { data } = await supabase.from('profiles').select('id').eq('id', userId).limit(1);
      if (!data || data.length === 0) {
        await supabase.from('profiles').insert({
          id: userId,
          email: this.currentUser.email,
          username: this.currentUser.username,
          display_name: this.currentUser.displayName,
          role: this.currentUser.role,
          avatar_url: this.currentUser.avatarUrl,
          country: this.currentUser.country,
        });
      }
    } catch (e) {
      console.warn("Profile check/create warning:", e);
    }
  }

  public async castVote(contestantId: string): Promise<{ success: boolean; message: string; newVoteCount: number }> {
    const userId = this.currentUser.id;

    if (this.hasUserVotedToday(contestantId, userId)) {
      return {
        success: false,
        message: "Bugün bu Kraliçe için zaten oy kullandınız! Günde 1 defa ücretsiz oy kullanabilirsiniz.",
        newVoteCount: this.getContestantById(contestantId)?.voteCount || 0,
      };
    }

    const newVote: Vote = {
      id: `v-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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

      if (isSupabaseConfigured && isValidUUID(userId) && isValidUUID(contestantId)) {
        try {
          await this.ensureSupabaseProfile(userId);

          const { error: voteErr } = await supabase.from('votes').insert({
            profile_id: userId,
            contestant_id: contestantId,
          });
          if (voteErr) console.error("Supabase vote insert error:", voteErr.message);

          const { error: updateErr } = await supabase.from('contestants').update({ 
            vote_count: contestant.voteCount 
          }).eq('id', contestantId);
          if (updateErr) console.error("Supabase contestant vote update error:", updateErr.message);
        } catch (err) {
          console.error("Supabase vote sync exception:", err);
        }
      }
    }

    return {
      success: true,
      message: "🕷️ Oyunuz başarıyla kaydedildi!",
      newVoteCount: contestant ? contestant.voteCount : 0,
    };
  }

  public async castSuperVote(contestantId: string, amount: number = 10): Promise<{ success: boolean; message: string; newVoteCount: number }> {
    if (this.currentUser.superVoteBalance < amount) {
      return {
        success: false,
        message: `Yetersiz Süper Oy token'ı! Kalan: ${this.currentUser.superVoteBalance}`,
        newVoteCount: this.getContestantById(contestantId)?.voteCount || 0,
      };
    }

    this.currentUser.superVoteBalance -= amount;
    this.saveUser();

    const newSuperVote: SuperVote = {
      id: `sv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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

      if (isSupabaseConfigured && isValidUUID(this.currentUser.id) && isValidUUID(contestantId)) {
        try {
          await this.ensureSupabaseProfile(this.currentUser.id);

          const { error: svErr } = await supabase.from('super_votes').insert({
            profile_id: this.currentUser.id,
            contestant_id: contestantId,
            amount,
          });
          if (svErr) console.error("Supabase super_vote insert error:", svErr.message);

          const { error: updateErr } = await supabase.from('contestants').update({ 
            vote_count: contestant.voteCount,
            super_vote_count: contestant.superVoteCount 
          }).eq('id', contestantId);
          if (updateErr) console.error("Supabase contestant super_vote update error:", updateErr.message);
        } catch (err) {
          console.error("Supabase super_vote sync exception:", err);
        }
      }
    }

    return {
      success: true,
      message: `⚡ SÜPER OY KULLANILDI! +${amount} Oy eklendi!`,
      newVoteCount: contestant ? contestant.voteCount : 0,
    };
  }

  public async submitContestant(formData: UploadFormData): Promise<{ contestant: Contestant; n8nTriggered: boolean }> {
    const isAutoApprove = this.n8nConfig.autoApprove;
    const newContestant: Contestant = {
      id: `cont-${Date.now()}`,
      userId: this.currentUser.id,
      displayName: formData.displayName,
      username: formData.username.replace(/^@/, ""),
      instagramUrl: formData.instagramUrl.startsWith("http")
        ? formData.instagramUrl
        : `https://instagram.com/${formData.instagramUrl.replace(/^@/, "")}`,
      country: formData.country,
      countryCode: formData.countryCode || "US",
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

    if (isSupabaseConfigured && isValidUUID(newContestant.userId)) {
      try {
        await this.ensureSupabaseProfile(newContestant.userId);

        const { error } = await supabase.from('contestants').insert({
          profile_id: newContestant.userId,
          competition_id: newContestant.competitionId,
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
        });

        if (error) {
          console.error("Supabase insert contestant error:", error.message);
        }
      } catch (err) {
        console.warn("Supabase insert contestant exception:", err);
      }
    }

    return { contestant: newContestant, n8nTriggered: true };
  }

  public async approveContestant(id: string): Promise<Contestant | undefined> {
    const contestant = this.contestants.find((c) => c.id === id);
    if (contestant) {
      contestant.status = "approved";
      this.saveContestants();

      if (isSupabaseConfigured && isValidUUID(id)) {
        await supabase.from('contestants').update({ status: 'approved' }).eq('id', id).catch(() => {});
      }
    }
    return contestant;
  }

  public async rejectContestant(id: string, reason: string): Promise<Contestant | undefined> {
    const contestant = this.contestants.find((c) => c.id === id);
    if (contestant) {
      contestant.status = "rejected";
      contestant.rejectionReason = reason;
      this.saveContestants();

      if (isSupabaseConfigured && isValidUUID(id)) {
        await supabase.from('contestants').update({ status: 'rejected', rejection_reason: reason }).eq('id', id).catch(() => {});
      }
    }
    return contestant;
  }

  public async deleteContestant(id: string) {
    this.contestants = this.contestants.filter((c) => c.id !== id);
    this.saveContestants();

    if (isSupabaseConfigured && isValidUUID(id)) {
      await supabase.from('contestants').delete().eq('id', id).catch(() => {});
    }
  }

  public crownWeeklyWinner(contestantId: string): Winner | undefined {
    const contestant = this.getContestantById(contestantId);
    if (!contestant) return undefined;

    const newWinner: Winner = {
      id: `winner-${Date.now()}`,
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
