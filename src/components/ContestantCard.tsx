import React, { useState } from "react";
import { Heart, Zap, Instagram, Globe, Sparkles, CheckCircle, Info } from "lucide-react";
import { Contestant } from "../types";
import { useLanguage } from "../i18n/LanguageContext";

interface ContestantCardProps {
  contestant: Contestant;
  rank?: number;
  hasVoted: boolean;
  onVote: (contestantId: string) => void;
  onSuperVote: (contestantId: string) => void;
  onOpenDetails: (contestant: Contestant) => void;
}

export const ContestantCard: React.FC<ContestantCardProps> = ({
  contestant,
  rank,
  hasVoted,
  onVote,
  onSuperVote,
  onOpenDetails,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const { t } = useLanguage();

  const handleVoteClick = () => {
    setIsAnimating(true);
    onVote(contestant.id);
    setTimeout(() => setIsAnimating(false), 800);
  };

  return (
    <div className="group relative bg-[#0c0c0c] rounded-2xl overflow-hidden border border-white/10 hover:border-[#FF003C]/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,0,60,0.3)] flex flex-col justify-between">
      {/* Top Media Area */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#050505] cursor-pointer" onClick={() => onOpenDetails(contestant)}>
        <img
          src={contestant.cosplayPhotoUrl}
          alt={contestant.displayName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/10 to-[#050505]/30 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 bg-[#080808]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#FF003C] border border-[#FF003C]/40 uppercase tracking-wider">
          {contestant.category}
        </div>

        {/* Rank Badge if specified */}
        {rank !== undefined && (
          <div className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-[#080808]/90 border border-amber-500/50 text-amber-300 font-mono font-black text-xs shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            #{rank}
          </div>
        )}

        {/* Hover Inspect Hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#050505]/40 backdrop-blur-[2px]">
          <span className="px-3 py-1.5 rounded-xl bg-[#0a0a0a]/90 text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#00D1FF]" />
            Inspect Cosplay
          </span>
        </div>
      </div>

      {/* Card Info & Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-[#FF003C] transition-colors line-clamp-1">
              {contestant.displayName}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono mt-0.5">
              <span>@{contestant.username}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-gray-300">
                <Globe className="w-3 h-3 text-[#00D1FF]" />
                {contestant.country}
              </span>
            </div>
          </div>

          <a
            href={contestant.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-[#141414] text-gray-400 hover:text-[#FF003C] hover:bg-white/10 transition-colors flex-shrink-0"
            title="Open Instagram Profile"
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>

        {/* Bio excerpt */}
        {contestant.bio && (
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed italic font-sans">
            "{contestant.bio}"
          </p>
        )}

        {/* Votes Counter & Action Buttons */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">
              TOTAL VOTES
            </div>
            <div className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF003C] to-[#9D00FF] font-mono flex items-center gap-1">
              <span>{contestant.voteCount.toLocaleString()}</span>
              {contestant.superVoteCount > 0 && (
                <span className="text-[10px] font-normal text-amber-400 bg-amber-950/60 px-1 rounded border border-amber-500/30">
                  +{contestant.superVoteCount * 10} SV
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Super Vote (+10) Button */}
            <button
              onClick={() => onSuperVote(contestant.id)}
              className="px-2.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all hover:scale-105 flex items-center gap-1 cursor-pointer"
              title="Super Vote (+10 Votes Boost)"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-mono">+10</span>
            </button>

            {/* Standard Vote Button */}
            <button
              onClick={handleVoteClick}
              disabled={hasVoted}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer relative overflow-hidden ${
                hasVoted
                  ? "bg-[#141414] text-gray-500 border border-white/10 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#FF003C] to-[#9D00FF] hover:from-[#FF003C]/90 hover:to-[#9D00FF]/90 text-white shadow-[0_0_15px_rgba(255,0,60,0.4)] hover:scale-105"
              } ${isAnimating ? "animate-bounce" : ""}`}
            >
              {hasVoted ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t("feed.voted_btn", "Oy Kullanıldı")}</span>
                </>
              ) : (
                <>
                  <Heart className={`w-3.5 h-3.5 ${isAnimating ? "fill-white animate-ping" : "fill-white/80"}`} />
                  <span>{t("feed.vote_btn", "Oy Ver")}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
