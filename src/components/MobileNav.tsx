import React from "react";
import { Sparkles, Flame, Trophy, Zap, Upload, User } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();

  const navs = [
    { id: "landing", label: t("nav.home", "Anasayfa"), icon: Sparkles },
    { id: "feed", label: t("nav.feed", "Akış"), icon: Flame },
    { id: "leaderboard", label: t("nav.leaderboard", "Liderlik"), icon: Trophy },
    { id: "competitions", label: t("nav.monthly", "Aylık"), icon: Zap },
    { id: "upload", label: t("nav.upload", "Gönder"), icon: Upload },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#080808]/95 backdrop-blur-lg border-t border-white/10 lg:hidden px-2 py-2">
      <div className="flex items-center justify-around">
        {navs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "text-[#FF003C] scale-105"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl ${
                  isActive
                    ? "bg-[#FF003C]/20 border border-[#FF003C]/50 shadow-[0_0_10px_rgba(255,0,60,0.4)]"
                    : "bg-transparent"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
