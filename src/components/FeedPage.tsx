import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Grid,
  Tv,
  Flame,
  Globe,
  Instagram,
  Heart,
  Zap,
  CheckCircle,
  X,
  Share2,
} from "lucide-react";
import { Contestant, CosplayCategory } from "../types";
import { ContestantCard } from "./ContestantCard";
import { useLanguage } from "../i18n/LanguageContext";

interface FeedPageProps {
  contestants: Contestant[];
  hasVotedMap: Record<string, boolean>;
  onVote: (contestantId: string) => void;
  onSuperVote: (contestantId: string) => void;
  onJoinClick: () => void;
}

export const FeedPage: React.FC<FeedPageProps> = ({
  contestants,
  hasVotedMap,
  onVote,
  onSuperVote,
  onJoinClick,
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"votes" | "latest">("votes");
  const [viewMode, setViewMode] = useState<"grid" | "reels">("grid");
  const [inspectedContestant, setInspectedContestant] = useState<Contestant | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories: string[] = [
    "All",
    "Spider-Gwen",
    "Silk",
    "Spider-Woman",
    "Venomized",
    "Original Spider-Queen",
  ];

  const countries = useMemo(() => {
    const set = new Set(contestants.map((c) => c.country));
    return ["All", ...Array.from(set)];
  }, [contestants]);

  const filteredContestants = useMemo(() => {
    return contestants
      .filter((c) => {
        const matchesSearch =
          c.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.country.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === "All" || c.category === selectedCategory;

        const matchesCountry =
          selectedCountry === "All" || c.country === selectedCountry;

        return matchesSearch && matchesCategory && matchesCountry;
      })
      .sort((a, b) => {
        if (sortBy === "votes") return b.voteCount - a.voteCount;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [contestants, searchTerm, selectedCategory, selectedCountry, sortBy]);

  const handleVoteWithToast = (id: string) => {
    onVote(id);
    const contestant = contestants.find((c) => c.id === id);
    if (contestant) {
      setToastMessage(`🕷️ Vote cast for ${contestant.displayName}!`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen text-white bg-[#050505] pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#FF003C] text-white font-bold text-xs px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(255,0,60,0.6)] flex items-center gap-2 animate-bounce">
          <Heart className="w-4 h-4 fill-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Feed Page Header & Controls */}
      <div className="bg-[#080808] border-b border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-[#FF003C] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                {t("feed.tag", "28. HAFTA YARIŞMA AKIŞI")}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-0.5">
                {t("feed.title", "Spider Queen'ine Oy Ver")}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Switcher */}
              <div className="flex bg-[#050505] p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-[#FF003C] text-white shadow-[0_0_10px_rgba(255,0,60,0.4)]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("feed.grid_view", "Izgara")}</span>
                </button>
                <button
                  onClick={() => setViewMode("reels")}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewMode === "reels"
                      ? "bg-[#FF003C] text-white shadow-[0_0_10px_rgba(255,0,60,0.4)]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Tv className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("feed.stories_view", "Hikayeler")}</span>
                </button>
              </div>

              <button
                onClick={onJoinClick}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF003C] to-[#9D00FF] text-white text-xs font-bold hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,0,60,0.4)] cursor-pointer"
              >
                {t("feed.join_btn", "+ Yarışmaya Katıl")}
              </button>
            </div>
          </div>

          {/* Search Bar & Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t("feed.search_ph", "İsim, kullanıcı adı veya ülkeye göre ara...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0c0c0c] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF003C]/60 transition-colors"
              />
            </div>

            {/* Country Selector */}
            <div className="sm:col-span-3">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0c0c0c] border border-white/10 text-xs text-gray-300 focus:outline-none focus:border-[#FF003C]/60 transition-colors cursor-pointer"
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country === "All" ? t("feed.all_countries", "🌍 Tüm Ülkeler") : country}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="sm:col-span-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "votes" | "latest")}
                className="w-full px-3 py-2 rounded-xl bg-[#0c0c0c] border border-white/10 text-xs text-gray-300 focus:outline-none focus:border-[#FF003C]/60 transition-colors cursor-pointer"
              >
                <option value="votes">{t("feed.sort_votes", "🔥 En Çok Oy Alanlar")}</option>
                <option value="latest">{t("feed.sort_latest", "✨ En Yeni Yüklenenler")}</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === category
                    ? "bg-[#FF003C]/20 text-[#FF003C] border border-[#FF003C]/60 shadow-[0_0_10px_rgba(255,0,60,0.25)]"
                    : "bg-[#0c0c0c] text-gray-400 border border-white/10 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredContestants.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4">
            <Flame className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Queens Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No approved contestants matched your search criteria. Try clearing search filters or submit your own cosplay!
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedCountry("All");
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* Standard Responsive Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContestants.map((contestant, index) => (
              <ContestantCard
                key={contestant.id}
                contestant={contestant}
                rank={index + 1}
                hasVoted={Boolean(hasVotedMap[contestant.id])}
                onVote={handleVoteWithToast}
                onSuperVote={onSuperVote}
                onOpenDetails={setInspectedContestant}
              />
            ))}
          </div>
        ) : (
          /* TikTok / Reels Full Card View */
          <div className="max-w-md mx-auto space-y-8">
            {filteredContestants.map((contestant, index) => (
              <div
                key={contestant.id}
                className="relative aspect-[9/16] rounded-3xl overflow-hidden border border-[#FF003C]/40 bg-[#0c0c0c] shadow-[0_0_40px_rgba(255,0,60,0.3)] flex flex-col justify-end p-6"
              >
                <img
                  src={contestant.cosplayPhotoUrl}
                  alt={contestant.displayName}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

                {/* Top Overlay Badge */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                  <span className="bg-[#080808]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#FF003C] border border-[#FF003C]/40">
                    Rank #{index + 1} • {contestant.category}
                  </span>
                  <span className="bg-[#080808]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-mono font-bold text-[#00D1FF]">
                    {contestant.country}
                  </span>
                </div>

                {/* Bottom Story Controls */}
                <div className="relative z-10 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-white">{contestant.displayName}</h3>
                    <p className="text-xs font-mono text-gray-300">@{contestant.username}</p>
                    <p className="text-xs text-gray-300 line-clamp-2 mt-1 italic">
                      "{contestant.bio}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <div className="text-[10px] text-gray-400 font-mono">LIVE VOTES</div>
                      <div className="text-xl font-black text-[#FF003C] font-mono">
                        {contestant.voteCount.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSuperVote(contestant.id)}
                        className="p-3 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:scale-110 transition-transform cursor-pointer"
                        title="Super Vote (+10)"
                      >
                        <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
                      </button>

                      <button
                        onClick={() => handleVoteWithToast(contestant.id)}
                        disabled={Boolean(hasVotedMap[contestant.id])}
                        className={`px-6 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${
                          hasVotedMap[contestant.id]
                            ? "bg-[#141414] text-gray-500"
                            : "bg-gradient-to-r from-[#FF003C] to-[#9D00FF] text-white shadow-[0_0_20px_rgba(255,0,60,0.6)]"
                        }`}
                      >
                        <Heart className="w-4 h-4 fill-white" />
                        {hasVotedMap[contestant.id] ? "Voted" : "Vote Queen"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contestant Inspect Modal */}
      {inspectedContestant && (
        <div className="fixed inset-0 z-50 bg-[#050505]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-[#FF003C]/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 relative shadow-[0_0_50px_rgba(255,0,60,0.4)]">
            <button
              onClick={() => setInspectedContestant(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#141414] text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#050505] border border-white/10">
                <img
                  src={inspectedContestant.cosplayPhotoUrl}
                  alt={inspectedContestant.displayName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#FF003C] font-bold uppercase tracking-widest">
                    {inspectedContestant.category} • {inspectedContestant.country}
                  </span>
                  <h3 className="text-2xl font-black text-white">{inspectedContestant.displayName}</h3>
                  <p className="text-xs font-mono text-gray-400">@{inspectedContestant.username}</p>
                </div>

                <div className="p-3 bg-[#050505] rounded-xl border border-white/10">
                  <div className="text-[10px] text-gray-500 uppercase font-mono">Cosplayer Bio & Suit Specs</div>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    {inspectedContestant.bio || "No biography provided by contestant."}
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#050505] rounded-xl border border-white/10">
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase font-mono">Total Verified Votes</div>
                    <div className="text-xl font-black text-[#FF003C] font-mono">
                      {inspectedContestant.voteCount.toLocaleString()}
                    </div>
                  </div>
                  <a
                    href={inspectedContestant.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-[#141414] hover:bg-white/10 text-rose-300 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram Profile
                  </a>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      onSuperVote(inspectedContestant.id);
                      setInspectedContestant(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/50 text-xs font-bold hover:bg-amber-500/30 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-amber-400" />
                    Super Vote (+10)
                  </button>

                  <button
                    onClick={() => {
                      handleVoteWithToast(inspectedContestant.id);
                      setInspectedContestant(null);
                    }}
                    disabled={Boolean(hasVotedMap[inspectedContestant.id])}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      hasVotedMap[inspectedContestant.id]
                        ? "bg-[#141414] text-gray-500"
                        : "bg-gradient-to-r from-[#FF003C] to-[#9D00FF] text-white shadow-[0_0_15px_rgba(255,0,60,0.5)]"
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    {hasVotedMap[inspectedContestant.id] ? "Already Voted" : "Vote Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
