import React, { useState } from "react";
import { X, Sparkles, UserCheck, ShieldCheck, Mail, User, Globe, Zap, Image, CheckCircle2 } from "lucide-react";
import { spiderService } from "../services/spiderService";
import { UserProfile } from "../types";
import { useLanguage } from "../i18n/LanguageContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  message?: string;
}

const PRESET_AVATARS = [
  { id: "1", label: "Spider-Queen Classic", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
  { id: "2", label: "Cyber Gwen", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80" },
  { id: "3", label: "Neon Silk", url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80" },
  { id: "4", label: "Symbiote Queen", url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80" },
  { id: "5", label: "Multiverse Hero", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  message,
}) => {
  const { t } = useLanguage();

  // Form states
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("TR");
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0].url);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!displayName.trim()) {
      setError(t("auth.err_name", "Lütfen ad soyad veya rumuz giriniz."));
      return;
    }
    if (!username.trim()) {
      setError(t("auth.err_username", "Lütfen kullanıcı adı giriniz."));
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError(t("auth.err_email", "Geçerli bir e-posta adresi giriniz."));
      return;
    }

    setLoading(true);
    try {
      const newUser = await spiderService.registerOrLoginUser({
        displayName: displayName.trim(),
        username: username.trim(),
        email: email.trim(),
        country,
        avatarUrl: selectedAvatar,
      });

      setLoading(false);
      onSuccess(newUser);
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Kayıt sırasında hata oluştu.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0c0c0c] border border-[#FF003C]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(255,0,60,0.25)] space-y-6 text-white max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-[#FF003C]/20 via-[#9D00FF]/20 to-[#00D1FF]/20 border border-[#FF003C]/30 text-rose-400 shadow-[0_0_20px_rgba(255,0,60,0.3)]">
            <UserCheck className="w-8 h-8 text-[#FF003C]" />
          </div>

          <h2 className="text-2xl font-black text-white tracking-wide uppercase italic">
            ÜYE OL & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF003C] to-[#9D00FF]">OY KULLAN</span>
          </h2>

          <p className="text-xs text-gray-300 font-medium">
            {message || "Yarışmacılara oy vermek, süper oy jetonu satın almak ve cosplay yüklemek için hemen ücretsiz üye olun!"}
          </p>

          {/* Welcome Bonus Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mt-2">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400 animate-bounce" />
            <span>🎉 Üyelik Hediyesi: 10 Süper Oy Jetonu & Günlük Ücretsiz Oy!</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Ad Soyad / Ekran Adı *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Örn: Onur Yılmaz"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl pl-10 pr-3 py-2 text-xs text-white focus:border-[#FF003C] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Kullanıcı Adı *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-gray-400 font-mono">@</span>
                <input
                  type="text"
                  placeholder="spider_fan_34"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:border-[#FF003C] focus:outline-none font-mono"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                E-posta Adresi * (Supabase Profil Kaydı İçin)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="ornek@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl pl-10 pr-3 py-2 text-xs text-white focus:border-[#FF003C] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Ülke</label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#141414] border border-white/10 rounded-xl pl-10 pr-3 py-2 text-xs text-white focus:border-[#FF003C] focus:outline-none cursor-pointer"
                >
                  <option value="TR">Turkey 🇹🇷</option>
                  <option value="US">United States 🇺🇸</option>
                  <option value="DE">Germany 🇩🇪</option>
                  <option value="GB">United Kingdom 🇬🇧</option>
                  <option value="JP">Japan 🇯🇵</option>
                  <option value="BR">Brazil 🇧🇷</option>
                </select>
              </div>
            </div>

            {/* Preset Avatar Picker */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2">
                Profil Avatarı Seç
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {PRESET_AVATARS.map((av) => (
                  <button
                    type="button"
                    key={av.id}
                    onClick={() => setSelectedAvatar(av.url)}
                    className={`relative flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedAvatar === av.url
                        ? "border-[#FF003C] ring-2 ring-[#FF003C]/50 scale-105"
                        : "border-white/20 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                    {selectedAvatar === av.url && (
                      <div className="absolute inset-0 bg-[#FF003C]/30 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF003C] via-[#9D00FF] to-[#00D1FF] text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(255,0,60,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? "Supabase'e Kaydediliyor..." : "🕷️ Hesabımı Oluştur & Oy Kullan"}
            </button>
          </form>

        {/* Footer Note */}
        <p className="text-[10px] text-gray-500 text-center font-mono">
          Kayıt olan tüm kullanıcı profilleri ve kullanılan oylar anında Supabase veritabanına işlenmektedir.
        </p>
      </div>
    </div>
  );
};
