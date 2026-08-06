import React, { useState } from "react";
import {
  Sparkles,
  Trophy,
  Upload,
  Flame,
  User,
  ShieldAlert,
  Menu,
  X,
  Zap,
  Globe,
  Lock,
} from "lucide-react";
import { UserProfile, UserRole } from "../types";
import { useLanguage } from "../i18n/LanguageContext";
import { SupportedLanguage } from "../i18n/translations";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  onOpenSuperVoteModal: () => void;
  onOpenAdminLoginModal: () => void;
  onOpenAuthModal?: () => void;
  superVoteBalance: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenSuperVoteModal,
  onOpenAdminLoginModal,
  onOpenAuthModal,
  superVoteBalance,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, languages, t } = useLanguage();

  const navItems = [
    { id: "landing", label: t("nav.home", "Anasayfa"), icon: Sparkles },
    { id: "feed", label: t("nav.feed", "Yarışma Akışı"), icon: Flame },
    { id: "leaderboard", label: t("nav.leaderboard", "Liderlik Tablosu"), icon: Trophy },
    { id: "competitions", label: t("nav.monthly", "Aylık Mücadele"), icon: Zap },
    { id: "upload", label: t("nav.upload", "Cosplay Gönder"), icon: Upload },
  ];

  if (currentUser.role === "admin") {
    navItems.push({ id: "admin", label: t("nav.admin", "Yönetici Paneli"), icon: ShieldAlert });
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 shadow-[0_4px_25px_rgba(255,0,60,0.15)]">
      {/* Top Banner: Monthly Competition Live */}
      <div className="bg-gradient-to-r from-[#FF003C]/20 via-[#9D00FF]/20 to-[#00D1FF]/20 text-gray-200 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-white/10">
        <span className="flex h-2 w-2 rounded-full bg-[#FF003C] animate-ping" />
        <span className="font-bold text-[#FF003C]">{t("header.monthly_live", "AYLIK YARIŞMA CANLI")}:</span>
        <span>Spider-Verse Cyber Showdown • {t("header.prize_title", "$1,000 Cash Prize")}</span>
        <button
          onClick={() => setActiveTab("competitions")}
          className="ml-2 text-[10px] bg-[#FF003C]/20 hover:bg-[#FF003C]/40 text-rose-200 font-bold px-2 py-0.5 rounded border border-[#FF003C]/40 transition-colors cursor-pointer"
        >
          {t("nav.monthly", "Aylık Mücadele")} →
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab("landing")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF003C] via-[#9D00FF] to-[#00D1FF] p-[2px] shadow-[0_0_15px_rgba(255,0,60,0.5)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#080808] rounded-[10px] flex items-center justify-center">
                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF003C] via-[#9D00FF] to-[#00D1FF]">
                  🕷️
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-wider text-white uppercase italic">
                  SPIDER<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF003C] via-[#9D00FF] to-[#00D1FF]">QUEENS</span>
                </span>
                <span className="text-[10px] font-bold bg-[#FF003C]/20 text-[#FF003C] px-1.5 py-0.5 rounded border border-[#FF003C]/30 uppercase tracking-widest">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono tracking-tight hidden sm:block">
                GLOBAL COSPLAY COMPETITION
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#080808] p-1 rounded-xl border border-white/10">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#FF003C] to-[#9D00FF] text-white shadow-[0_0_12px_rgba(255,0,60,0.4)]"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#FF003C]"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Multi-Language Selector Dropdown */}
            <div className="relative flex items-center bg-[#080808] border border-white/10 rounded-xl px-2 py-1 text-xs">
              <Globe className="w-3.5 h-3.5 text-[#00D1FF] mr-1.5" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-gray-200 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#0c0c0c] text-white">
                    {l.flag} {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Super Vote Token Counter */}
            <button
              onClick={onOpenSuperVoteModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-[#9D00FF]/20 border border-amber-500/40 text-amber-300 hover:border-amber-400 hover:scale-105 transition-all text-xs font-bold cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.2)]"
              title="Super Vote Tokens"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse fill-amber-400" />
              <span className="text-white font-mono">{superVoteBalance}</span>
              <span className="hidden sm:inline text-[10px] text-amber-200 uppercase">
                {t("header.super_votes", "SÜPER OY")}
              </span>
            </button>

            {/* Admin Mode Button (Only visible when user is admin) */}
            {currentUser.role === "admin" && (
              <button
                onClick={() => setActiveTab("admin")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF003C]/20 border border-[#FF003C] text-[#FF003C] text-xs font-bold cursor-pointer hover:bg-[#FF003C]/30 transition-all"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t("header.admin_logged", "Yönetici Modu")}</span>
              </button>
            )}

            {/* Profile / Auth Button */}
            {currentUser.username === "ziyaretci" || !currentUser.email ? (
              <button
                onClick={() => onOpenAuthModal && onOpenAuthModal()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF003C] to-[#9D00FF] text-white text-xs font-bold hover:scale-105 transition-all shadow-[0_0_12px_rgba(255,0,60,0.4)] cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Üye Ol / Giriş Yap</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border transition-all cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-[#FF003C]/20 border-[#FF003C] text-rose-300"
                    : "bg-[#080808] border-white/10 text-gray-300 hover:border-white/20 hover:text-white"
                }`}
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  className="w-6 h-6 rounded-full object-cover ring-2 ring-[#FF003C]/40"
                  referrerPolicy="no-referrer"
                />
                <span className="hidden sm:inline text-xs font-semibold">{currentUser.displayName}</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#080808] border-b border-[#FF003C]/30 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#FF003C] to-[#9D00FF] text-white"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 text-[#FF003C]" />
                {item.label}
              </button>
            );
          })}

        </div>
      )}
    </header>
  );
};
