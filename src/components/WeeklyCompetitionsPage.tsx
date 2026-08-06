import React, { useState, useEffect } from "react";
import { Zap, Trophy, Clock, Award, Flame, Gift } from "lucide-react";
import { Winner } from "../types";
import { useLanguage } from "../i18n/LanguageContext";

interface WeeklyCompetitionsPageProps {
  winners: Winner[];
  onVoteNow: () => void;
  onJoinClick: () => void;
}

export const WeeklyCompetitionsPage: React.FC<WeeklyCompetitionsPageProps> = ({
  winners,
  onVoteNow,
  onJoinClick,
}) => {
  const { t } = useLanguage();

  const [timeLeft, setTimeLeft] = useState({
    days: 18,
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen text-slate-100 bg-[#050505] pb-24">
      {/* Header */}
      <div className="bg-[#080808] border-b border-white/10 py-8 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF003C]/20 border border-[#FF003C]/40 text-[#FF003C] text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-[#FF003C]" />
            {t("nav.monthly", "Aylık Mücadele")}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            {t("monthly.title", "Month #8: Spider-Verse Cyber Showdown")}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
            {t("monthly.subtitle", "Her ay yeni yarışma dönemi başlar. Hayranlar oy kullanır, en çok oy alan yarışmacı aylık $1.000 büyük ödülü kazanır!")}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Countdown Clock Box */}
        <div className="bg-gradient-to-r from-[#FF003C]/20 via-[#9D00FF]/20 to-[#080808] rounded-3xl p-8 border border-[#FF003C]/40 shadow-[0_0_50px_rgba(255,0,60,0.25)] text-center space-y-6">
          <div className="flex items-center justify-center gap-2 text-[#FF003C] font-mono text-xs font-bold uppercase tracking-widest">
            <Clock className="w-4 h-4 text-[#FF003C] animate-spin" />
            {t("monthly.countdown_tag", "AYLIK BİTİŞE KALAN SÜRE:")}
          </div>

          <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto font-mono">
            <div className="bg-[#050505] border border-white/10 p-3 sm:p-4 rounded-2xl">
              <div className="text-3xl sm:text-4xl font-black text-white">{timeLeft.days}</div>
              <div className="text-[10px] text-gray-400 uppercase font-semibold mt-1">{t("monthly.days", "Gün")}</div>
            </div>
            <div className="bg-[#050505] border border-white/10 p-3 sm:p-4 rounded-2xl">
              <div className="text-3xl sm:text-4xl font-black text-white">{timeLeft.hours}</div>
              <div className="text-[10px] text-gray-400 uppercase font-semibold mt-1">{t("monthly.hours", "Saat")}</div>
            </div>
            <div className="bg-[#050505] border border-white/10 p-3 sm:p-4 rounded-2xl">
              <div className="text-3xl sm:text-4xl font-black text-white">{timeLeft.minutes}</div>
              <div className="text-[10px] text-gray-400 uppercase font-semibold mt-1">{t("monthly.minutes", "Dakika")}</div>
            </div>
            <div className="bg-[#050505] border border-white/10 p-3 sm:p-4 rounded-2xl">
              <div className="text-3xl sm:text-4xl font-black text-[#FF003C]">{timeLeft.seconds}</div>
              <div className="text-[10px] text-[#FF003C] uppercase font-semibold mt-1">{t("monthly.seconds", "Saniye")}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onVoteNow}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF003C] to-[#9D00FF] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,0,60,0.5)] hover:scale-105 transition-all cursor-pointer"
            >
              {t("hero.btn_vote", "Şimdi Oy Ver")}
            </button>
            <button
              onClick={onJoinClick}
              className="px-8 py-3.5 rounded-xl bg-[#080808] text-[#00D1FF] border border-[#00D1FF]/40 text-xs font-bold uppercase hover:bg-[#0c0c0c] transition-colors cursor-pointer"
            >
              {t("hero.btn_join", "Yarışmaya Katıl")}
            </button>
          </div>
        </div>

        {/* Prize Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0c0c0c] p-6 rounded-3xl border border-amber-500/40 space-y-3 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white uppercase">1. Aylık Birincilik Ödülü</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              $1.000 Nakit Para Ödülü + Özel Spider-Queen Tacı + 1 Ay Boyunca Anasayfa Vitrin Özelliği.
            </p>
          </div>

          <div className="bg-[#0c0c0c] p-6 rounded-3xl border border-purple-500/40 space-y-3 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/40">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white uppercase">2. ve 3. Sıra Ödülleri</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              $250 Kostüm Malzemesi Hediye Çeki + Onaylı Rozet + Şöhretler Müzesi Kalıcı Profil Kaydı.
            </p>
          </div>

          <div className="bg-[#0c0c0c] p-6 rounded-3xl border border-[#00D1FF]/40 space-y-3 shadow-[0_0_20px_rgba(0,209,255,0.15)]">
            <div className="w-10 h-10 rounded-xl bg-[#00D1FF]/20 text-[#00D1FF] flex items-center justify-center border border-[#00D1FF]/40">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white uppercase">İlk 10 Derece</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Sezon Sonu Büyük Şampiyonasına Doğrudan Katılım Hakkı.
            </p>
          </div>
        </div>

        {/* Past Winners Archive */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-white uppercase flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            {t("leaderboard.hall_of_fame", "Şöhretler Müzesi")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {winners.map((winner) => (
              <div
                key={winner.id}
                className="bg-[#0c0c0c] rounded-3xl overflow-hidden border border-white/10 hover:border-amber-500/50 transition-all space-y-3 p-4"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#050505]">
                  <img
                    src={winner.cosplayPhotoUrl}
                    alt={winner.displayName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#080808]/80 px-2.5 py-1 rounded-full text-xs font-mono font-bold text-amber-300 border border-amber-500/40">
                    Month #{winner.weekNumber} Winner
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">{winner.displayName}</h4>
                  <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                    <span>{winner.country}</span>
                    <span className="font-bold text-[#FF003C]">{winner.totalVotes.toLocaleString()} Votes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
