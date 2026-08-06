import React, { useState } from "react";
import { Trophy, Crown, Flame, Award, Globe, Instagram, Zap, Heart, ArrowUp } from "lucide-react";
import { Contestant, Winner } from "../types";
import { useLanguage } from "../i18n/LanguageContext";

interface LeaderboardPageProps {
  contestants: Contestant[];
  winners: Winner[];
  onVote: (id: string) => void;
  onSuperVote: (id: string) => void;
  hasVotedMap: Record<string, boolean>;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  contestants,
  winners,
  onVote,
  onSuperVote,
  hasVotedMap,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"current" | "archive">("current");

  // Filter approved contestants sorted by total votes descending
  const sortedContestants = [...contestants]
    .filter((c) => c.status === "approved")
    .sort((a, b) => b.voteCount - a.voteCount);

  const top1 = sortedContestants[0];
  const top2 = sortedContestants[1];
  const top3 = sortedContestants[2];

  const restRanked = sortedContestants.slice(3);

  return (
    <div className="min-h-screen text-white bg-[#050505] pb-24">
      {/* Header Banner */}
      <div className="bg-[#080808] border-b border-white/10 py-8 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            {t("leaderboard.tag", "KÜRESEL SPIDER-QUEEN SIRALAMASI")}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            {t("leaderboard.title", "Liderlik Tablosu & Şöhretler Müzesi")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto font-sans">
            {t("leaderboard.subtitle", "28. Hafta canlı sıralaması. Her standart oy ve Süper Oy kullanımı ile anında güncellenir!")}
          </p>

          {/* Tab Filter Pills */}
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab("current")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "current"
                  ? "bg-[#FF003C] text-white shadow-[0_0_15px_rgba(255,0,60,0.4)]"
                  : "bg-[#0c0c0c] text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {t("leaderboard.tab_current", "🔥 28. Hafta Canlı Sıralaması")}
            </button>
            <button
              onClick={() => setActiveTab("archive")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "archive"
                  ? "bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                  : "bg-[#0c0c0c] text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {t("leaderboard.tab_archive", "👑 Geçmiş Kazananlar Arşivi")}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {activeTab === "current" ? (
          <>
            {/* Top 3 Podium Showcase */}
            {sortedContestants.length >= 3 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-8">
                {/* 🥈 #2 Silver Medalist */}
                {top2 && (
                  <div className="order-2 md:order-1 bg-[#0c0c0c] rounded-3xl p-6 border border-white/20 flex flex-col items-center text-center relative shadow-[0_0_30px_rgba(255,255,255,0.05)] space-y-4">
                    <div className="absolute -top-5 px-3 py-1 bg-[#141414] border border-gray-400 text-gray-200 font-mono font-black text-xs rounded-full uppercase flex items-center gap-1">
                      🥈 {t("leaderboard.rank_2", "2. SIRA")}
                    </div>

                    <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-gray-400 to-gray-200 shadow-lg mt-2">
                      <img
                        src={top2.cosplayPhotoUrl}
                        alt={top2.displayName}
                        className="w-full h-full rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">{top2.displayName}</h3>
                      <p className="text-xs text-gray-400 font-mono">
                        {top2.country} • {top2.category}
                      </p>
                    </div>

                    <div className="w-full bg-[#050505] p-3 rounded-2xl border border-white/10 font-mono">
                      <div className="text-[10px] text-gray-400 uppercase">{t("leaderboard.total_votes", "Toplam Oy")}</div>
                      <div className="text-xl font-black text-gray-200">
                        {top2.voteCount.toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => onVote(top2.id)}
                      disabled={Boolean(hasVotedMap[top2.id])}
                      className="w-full py-2.5 rounded-xl bg-[#141414] hover:bg-white/10 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-[#FF003C] text-[#FF003C]" />
                      {hasVotedMap[top2.id] ? t("leaderboard.voted", "Oy Verildi") : t("leaderboard.vote_queen", "Kraliçeye Oy Ver")}
                    </button>
                  </div>
                )}

                {/* 🥇 #1 Gold Champion */}
                {top1 && (
                  <div className="order-1 md:order-2 bg-[#0c0c0c] rounded-3xl p-8 border-2 border-amber-500/80 flex flex-col items-center text-center relative shadow-[0_0_50px_rgba(245,158,11,0.35)] space-y-5 transform md:-translate-y-4">
                    <div className="absolute -top-6 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs rounded-full uppercase flex items-center gap-1.5 shadow-lg">
                      <Crown className="w-4 h-4 fill-black" />
                      🥇 {t("leaderboard.rank_1", "LİDER #1")}
                    </div>

                    <div className="relative w-36 h-36 rounded-full p-1.5 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.6)] mt-2">
                      <img
                        src={top1.cosplayPhotoUrl}
                        alt={top1.displayName}
                        className="w-full h-full rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-white">{top1.displayName}</h3>
                      <p className="text-xs text-amber-300 font-mono font-semibold">
                        {top1.country} • {top1.category}
                      </p>
                    </div>

                    <div className="w-full bg-[#050505] p-4 rounded-2xl border border-amber-500/30 font-mono">
                      <div className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                        {t("leaderboard.leader_votes", "LİDER OYLARI")}
                      </div>
                      <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-100">
                        {top1.voteCount.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full">
                      <button
                        onClick={() => onSuperVote(top1.id)}
                        className="p-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30 transition-all cursor-pointer"
                        title="Super Vote (+10)"
                      >
                        <Zap className="w-4 h-4 fill-amber-400" />
                      </button>

                      <button
                        onClick={() => onVote(top1.id)}
                        disabled={Boolean(hasVotedMap[top1.id])}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF003C] to-[#9D00FF] hover:from-[#FF003C]/90 hover:to-[#9D00FF]/90 text-white text-xs font-bold shadow-[0_0_20px_rgba(255,0,60,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Heart className="w-4 h-4 fill-white" />
                        {hasVotedMap[top1.id] ? t("leaderboard.voted", "Oy Verildi") : t("leaderboard.vote_champion", "Lidere Oy Ver")}
                      </button>
                    </div>
                  </div>
                )}

                {/* 🥉 #3 Bronze Medalist */}
                {top3 && (
                  <div className="order-3 bg-[#0c0c0c] rounded-3xl p-6 border border-amber-800/50 flex flex-col items-center text-center relative shadow-[0_0_30px_rgba(180,83,9,0.15)] space-y-4">
                    <div className="absolute -top-5 px-3 py-1 bg-amber-950 border border-amber-700 text-amber-400 font-mono font-black text-xs rounded-full uppercase flex items-center gap-1">
                      🥉 {t("leaderboard.rank_3", "3. SIRA")}
                    </div>

                    <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-amber-700 to-amber-500 shadow-lg mt-2">
                      <img
                        src={top3.cosplayPhotoUrl}
                        alt={top3.displayName}
                        className="w-full h-full rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">{top3.displayName}</h3>
                      <p className="text-xs text-gray-400 font-mono">
                        {top3.country} • {top3.category}
                      </p>
                    </div>

                    <div className="w-full bg-[#050505] p-3 rounded-2xl border border-white/10 font-mono">
                      <div className="text-[10px] text-gray-400 uppercase">{t("leaderboard.total_votes", "Toplam Oy")}</div>
                      <div className="text-xl font-black text-amber-200">
                        {top3.voteCount.toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => onVote(top3.id)}
                      disabled={Boolean(hasVotedMap[top3.id])}
                      className="w-full py-2.5 rounded-xl bg-[#141414] hover:bg-white/10 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-[#FF003C] text-[#FF003C]" />
                      {hasVotedMap[top3.id] ? t("leaderboard.voted", "Oy Verildi") : t("leaderboard.vote_queen", "Kraliçeye Oy Ver")}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Ranks 4 to 10+ Table */}
            <div className="bg-[#0c0c0c] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#FF003C]" />
                  {t("leaderboard.full_rankings", "Tüm Yarışmacı Sıralaması")} (#4 - #{sortedContestants.length})
                </h3>
                <span className="text-xs font-mono text-gray-400">Week #28</span>
              </div>

              <div className="divide-y divide-white/10">
                {restRanked.map((contestant, idx) => {
                  const rankNumber = idx + 4;
                  return (
                    <div
                      key={contestant.id}
                      className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-8 text-center font-mono font-black text-sm text-gray-400">
                          #{rankNumber}
                        </span>

                        <img
                          src={contestant.cosplayPhotoUrl}
                          alt={contestant.displayName}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10"
                          referrerPolicy="no-referrer"
                        />

                        <div>
                          <h4 className="text-sm font-bold text-white">{contestant.displayName}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                            <span>@{contestant.username}</span>
                            <span>•</span>
                            <span>{contestant.country}</span>
                            <span>•</span>
                            <span className="text-[#FF003C]">{contestant.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-base font-black text-white font-mono">
                            {contestant.voteCount.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-gray-400 uppercase">{t("leaderboard.votes", "Oy")}</div>
                        </div>

                        <button
                          onClick={() => onVote(contestant.id)}
                          disabled={Boolean(hasVotedMap[contestant.id])}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            hasVotedMap[contestant.id]
                              ? "bg-[#141414] text-gray-500"
                              : "bg-[#FF003C] hover:bg-[#FF003C]/80 text-white"
                          }`}
                        >
                          <Heart className="w-3.5 h-3.5 fill-white" />
                          <span>{hasVotedMap[contestant.id] ? t("leaderboard.voted", "Oy Verildi") : t("leaderboard.vote", "Oy Ver")}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* Past Weekly Winners Archive */
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white uppercase flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-400" />
              {t("leaderboard.archive_title", "SpiderQueens Şöhretler Müzesi Arşivi")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {winners.map((winner) => (
                <div
                  key={winner.id}
                  className="bg-[#0c0c0c] rounded-3xl p-6 border border-amber-500/40 space-y-4 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold uppercase">{winner.competitionTitle}</span>
                    <span className="text-gray-400">Week #{winner.weekNumber}</span>
                  </div>

                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#050505]">
                    <img
                      src={winner.cosplayPhotoUrl}
                      alt={winner.displayName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="space-y-1 text-center">
                    <h3 className="text-lg font-bold text-white">{winner.displayName}</h3>
                    <p className="text-xs text-gray-400 font-mono">
                      {winner.country} • {winner.totalVotes.toLocaleString()} {t("leaderboard.winning_votes", "Kazandıran Oy")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
