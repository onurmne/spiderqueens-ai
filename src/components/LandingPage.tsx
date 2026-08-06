import React from "react";
import {
  Flame,
  Trophy,
  Zap,
  Globe,
  Upload,
  ShieldCheck,
  Award,
  Users,
  Instagram,
  Heart,
  Sparkles,
} from "lucide-react";
import { Contestant } from "../types";
import { useLanguage } from "../i18n/LanguageContext";
import heroBanner from "../assets/images/hero_spiderqueen_cosplay_1785866609591.jpg";

interface LandingPageProps {
  onJoinCompetition: () => void;
  onVoteNow: () => void;
  onViewLeaderboard: () => void;
  featuredContestants: Contestant[];
  onOpenSuperVoteModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onJoinCompetition,
  onVoteNow,
  onViewLeaderboard,
  featuredContestants,
  onOpenSuperVoteModal,
}) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen text-white bg-[#050505] pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-b border-white/10">
        {/* Neon Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF003C]/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-[#00D1FF]/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#9D00FF]/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF003C]/10 border border-[#FF003C]/40 text-[#FF003C] text-xs font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(255,0,60,0.3)]">
                <Sparkles className="w-3.5 h-3.5 text-[#FF003C]" />
                {t("hero.platform_tag", "GLOBAL SPIDER-VERSE COSPLAY PLATFORM")}
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase leading-none text-white">
                {t("hero.title_1", "THE WORLD'S BIGGEST")}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF003C] via-[#9D00FF] to-[#00D1FF] drop-shadow-[0_0_20px_rgba(255,0,60,0.4)]">
                  {t("hero.title_2", "COSPLAY QUEEN")}
                </span>{" "}
                {t("hero.title_3", "COMPETITION")}
              </h1>

              <p className="text-base sm:text-lg text-gray-300 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {t("hero.subtitle", "Empowering female Spider-Man inspired cosplayers worldwide. Upload your Spider-Gwen, Silk, Spider-Woman & Venomized creations, gain global fan voting, and claim monthly cash prizes!")}
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onJoinCompetition}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF003C] via-[#9D00FF] to-[#00D1FF] bg-[length:200%_auto] hover:bg-right text-white font-bold text-sm tracking-wide uppercase shadow-[0_0_25px_rgba(255,0,60,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
                >
                  <Upload className="w-4 h-4" />
                  {t("hero.btn_join", "Yarışmaya Katıl")}
                </button>

                <button
                  onClick={onVoteNow}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#080808] border border-[#00D1FF]/40 hover:border-[#00D1FF] text-[#00D1FF] font-bold text-sm tracking-wide uppercase shadow-[0_0_15px_rgba(0,209,255,0.2)] hover:bg-[#0c0c0c] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-[#00D1FF] animate-pulse" />
                  {t("hero.btn_vote", "Şimdi Oy Ver")}
                </button>
              </div>

              {/* Key Highlights Pills */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-400 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{t("hero.badge_verification", "Anında Fotoğraf Doğrulama")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{t("hero.badge_monthly_prize", "Aylık $1.000 Ödül Havuzu")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#FF003C]" />
                  <span>{t("hero.badge_super_votes", "Süper Oy Destek Sistemi")}</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#FF003C]/40 bg-[#0c0c0c] p-2 shadow-[0_0_35px_rgba(255,0,60,0.25)] group">
                <img
                  src={heroBanner}
                  alt="SpiderQueens Hero Cosplay"
                  className="w-full h-[420px] object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent rounded-xl" />

                {/* Overlaid Card Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#080808]/90 backdrop-blur-md p-4 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#FF003C] uppercase tracking-wider">
                        {t("hero.featured_tag", "AYIN ÖNE ÇIKAN KRALİÇESİ")}
                      </span>
                      <h3 className="text-base font-bold text-white">Alexis 'Gwenom' Ray</h3>
                      <p className="text-xs text-gray-400 font-mono">United States 🇺🇸 • Spider-Gwen</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-[#FF003C] font-mono">4,890</div>
                      <div className="text-[10px] text-gray-400 uppercase">{t("hero.live_votes", "Canlı Oy")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="bg-[#080808] border-b border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-[#0c0c0c] border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF003C] to-[#9D00FF] font-mono">
                184,200+
              </div>
              <div className="text-xs text-gray-400 uppercase font-semibold mt-1">
                {t("stats.total_votes", "Toplam Kullanılan Oy")}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#0c0c0c] border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#9D00FF] to-[#00D1FF] font-mono">
                120+
              </div>
              <div className="text-xs text-gray-400 uppercase font-semibold mt-1">
                {t("stats.countries", "Temsil Edilen Ülke")}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#0c0c0c] border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00D1FF] to-emerald-400 font-mono">
                $10,000+
              </div>
              <div className="text-xs text-gray-400 uppercase font-semibold mt-1">
                {t("stats.prizes", "Dağıtılan Ödül")}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#0c0c0c] border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-[#FF003C] font-mono">
                420+
              </div>
              <div className="text-xs text-gray-400 uppercase font-semibold mt-1">
                {t("stats.creators", "Cosplay Sanatçısı")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Contestants Preview */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs text-[#FF003C] font-mono uppercase font-bold tracking-widest">
              {t("landing.active_tag", "AKTİF YARIŞMACILAR")}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase mt-1">
              {t("landing.top_trending", "Öne Çıkan Spider Kraliçeleri")}
            </h2>
          </div>
          <button
            onClick={onVoteNow}
            className="flex items-center gap-2 text-xs font-bold text-[#FF003C] hover:text-[#FF003C]/80 underline underline-offset-4 cursor-pointer"
          >
            {t("landing.view_full_feed", "Tüm Akışı Gör")} ({featuredContestants.length}+) →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredContestants.slice(0, 4).map((contestant) => (
            <div
              key={contestant.id}
              className="group bg-[#0c0c0c] rounded-2xl overflow-hidden border border-white/10 hover:border-[#FF003C]/60 transition-all hover:shadow-[0_0_25px_rgba(255,0,60,0.25)] flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#050505]">
                <img
                  src={contestant.cosplayPhotoUrl}
                  alt={contestant.displayName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#080808]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#FF003C] border border-[#FF003C]/40 uppercase">
                  {contestant.category}
                </div>
                <div className="absolute top-3 right-3 bg-[#080808]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-mono font-bold text-[#00D1FF] border border-[#00D1FF]/40">
                  {contestant.country}
                </div>
              </div>

              <div className="p-4 space-y-3 bg-[#0c0c0c]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#FF003C] transition-colors">
                      {contestant.displayName}
                    </h4>
                    <p className="text-xs text-gray-400 font-mono">@{contestant.username}</p>
                  </div>
                  <a
                    href={contestant.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-[#141414] text-gray-300 hover:text-[#FF003C] hover:bg-white/10 transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="text-xs text-gray-400 font-mono">
                    <span className="font-bold text-[#FF003C] text-sm">{contestant.voteCount}</span> Votes
                  </div>
                  <button
                    onClick={onVoteNow}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF003C] to-[#9D00FF] text-white text-xs font-bold hover:scale-105 transition-transform cursor-pointer shadow-[0_0_10px_rgba(255,0,60,0.3)]"
                  >
                    {t("feed.vote_btn", "Oy Ver")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-[#080808] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono text-[#00D1FF] uppercase font-bold tracking-widest">
              {t("mechanics.tag", "PLATFORM ÇALIŞMA PRENSİBİ")}
            </span>
            <h2 className="text-3xl font-black text-white uppercase mt-1">
              {t("mechanics.title", "SpiderQueens Nasıl Çalışır?")}
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              {t("mechanics.subtitle", "Yarışmacı gelişimi, gerçek hayran etkileşimi ve güvenli doğrulama için tasarlanmış 4 adımlı sistem.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-white/10 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF003C]/20 text-[#FF003C] flex items-center justify-center font-bold text-lg font-mono border border-[#FF003C]/30">
                01
              </div>
              <h3 className="text-base font-bold text-white">{t("mechanics.step1_title", "Cosplay Yükle")}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {t("mechanics.step1_desc", "Profilinizi oluşturun, Instagram hesabınızı bağlayın ve yüksek çözünürlüklü Spider-Man cosplay fotoğraflarınızı yükleyin.")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-white/10 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#9D00FF]/20 text-[#9D00FF] flex items-center justify-center font-bold text-lg font-mono border border-[#9D00FF]/30">
                02
              </div>
              <h3 className="text-base font-bold text-white">{t("mechanics.step2_title", "Fotoğraf Doğrulama")}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {t("mechanics.step2_desc", "Gönderilen fotoğraflar liderlik tablosuna eklenmeden önce hızlı moderasyon kontrolünden geçer.")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-white/10 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#00D1FF]/20 text-[#00D1FF] flex items-center justify-center font-bold text-lg font-mono border border-[#00D1FF]/30">
                03
              </div>
              <h3 className="text-base font-bold text-white">{t("mechanics.step3_title", "Küresel Oylama")}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {t("mechanics.step3_desc", "Hayranlar standart oy kullanabilir veya Süper Oy (+10 destek) ile favorilerini zirveye taşıyabilir.")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-white/10 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg font-mono border border-amber-500/30">
                04
              </div>
              <h3 className="text-base font-bold text-white">{t("mechanics.step4_title", "Aylık Para Ödülü")}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {t("mechanics.step4_desc", "Her ayın birincisi $1.000 nakit ödül, Şöhretler Müzesi tacı ve sosyal medya öne çıkarma kazanır.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="py-16 max-w-5xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#FF003C]/20 via-[#9D00FF]/20 to-[#080808] border border-[#FF003C]/40 shadow-[0_0_50px_rgba(255,0,60,0.25)] space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            {t("landing.cta_title", "Örümcek Tacına Sahip Olmaya Hazır Mısın?")}
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto">
            {t("landing.cta_desc", "Binlerce sanatçı ve hayrana katılın. Cosplay'inizi bugün gönderin veya bir sonraki Spider Queen için oy verin!")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onJoinCompetition}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF003C] to-[#9D00FF] text-white font-bold text-sm uppercase shadow-[0_0_20px_rgba(255,0,60,0.5)] hover:scale-105 transition-all cursor-pointer"
            >
              {t("hero.btn_join", "Yarışmaya Katıl")}
            </button>
            <button
              onClick={onViewLeaderboard}
              className="px-8 py-3.5 rounded-xl bg-[#080808] text-[#00D1FF] font-bold text-sm uppercase border border-[#00D1FF]/40 hover:bg-[#0c0c0c] transition-colors cursor-pointer"
            >
              {t("nav.leaderboard", "Liderlik Tablosu")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
