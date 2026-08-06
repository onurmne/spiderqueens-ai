import React, { useState } from "react";
import { ShieldAlert, KeyRound, X, CheckCircle2, Lock } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin passwords
    if (password.trim() === "admin123" || password.trim().toLowerCase() === "admin") {
      setErrorMsg(null);
      setPassword("");
      onSuccess();
    } else {
      setErrorMsg("Hatılı şifre! (Varsayılan şifre: admin123)");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0c0c0c] border border-[#FF003C]/50 rounded-3xl max-w-md w-full p-6 space-y-6 relative shadow-[0_0_50px_rgba(255,0,60,0.3)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#141414] text-gray-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#FF003C]/20 border border-[#FF003C]/40 text-[#FF003C] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,0,60,0.3)]">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            {t("admin.login_title", "Yönetici Girişi")}
          </h2>
          <p className="text-xs text-gray-400">
            SpiderQueens Yönetici Paneline erişmek için özel şifrenizi giriniz.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#FF003C]" />
              {t("admin.password_label", "Yönetici Şifresi")}
            </label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF003C]"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-[#FF003C]/20 border border-[#FF003C]/40 rounded-xl text-xs text-[#FF003C] font-semibold text-center">
              {errorMsg}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF003C] to-[#9D00FF] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,0,60,0.5)] hover:scale-[1.02] transition-transform cursor-pointer"
            >
              {t("admin.login_btn", "Giriş Yap")}
            </button>
          </div>

          <div className="text-[11px] text-gray-500 text-center font-mono pt-1">
            🔑 Test şifresi: <span className="text-gray-300 font-bold">admin123</span>
          </div>
        </form>
      </div>
    </div>
  );
};
