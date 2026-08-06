import React from "react";
import { User, Shield, Zap, Flame, Upload, Globe, CheckCircle, Clock, XCircle } from "lucide-react";
import { UserProfile, Contestant } from "../types";
import { useLanguage } from "../i18n/LanguageContext";

interface ProfilePageProps {
  user: UserProfile;
  userContestantSubmissions: Contestant[];
  onOpenSuperVoteModal: () => void;
  onNavigateUpload: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  userContestantSubmissions,
  onOpenSuperVoteModal,
  onNavigateUpload,
}) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen text-white bg-[#050505] pb-24">
      {/* Header */}
      <div className="bg-[#080808] border-b border-white/10 py-8">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-[#FF003C]/50 shadow-xl"
              referrerPolicy="no-referrer"
            />

            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{user.displayName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase bg-[#FF003C]/20 text-[#FF003C] border border-[#FF003C]/40">
                  {user.role}
                </span>
              </div>

              <p className="text-xs text-gray-400 font-mono">
                @{user.username} • {user.email} • {user.country}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                <button
                  onClick={onOpenSuperVoteModal}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-amber-500/30"
                >
                  <Zap className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{user.superVoteBalance} {t("header.super_votes", "Süper Oy")}</span>
                </button>

                <button
                  onClick={onNavigateUpload}
                  className="px-3 py-1.5 rounded-xl bg-[#FF003C] hover:bg-[#FF003C]/80 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{t("profile.submit_new", "Yeni Cosplay Gönder")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Submitted Cosplays Status Tracker */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white uppercase flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#FF003C]" />
            {t("profile.submissions_title", "Cosplay Başvurularım & Durum")} ({userContestantSubmissions.length})
          </h2>

          {userContestantSubmissions.length === 0 ? (
            <div className="p-8 text-center bg-[#0c0c0c] rounded-3xl border border-white/10 space-y-3">
              <p className="text-xs text-gray-400">{t("profile.no_submissions", "Henüz bir cosplay başvurusu yapmadınız.")}</p>
              <button
                onClick={onNavigateUpload}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF003C] to-[#9D00FF] text-white text-xs font-bold cursor-pointer"
              >
                {t("profile.submit_first", "İlk Cosplay Gönderini Yap")}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userContestantSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-[#0c0c0c] rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={sub.cosplayPhotoUrl}
                      alt={sub.displayName}
                      className="w-16 h-20 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />

                    <div>
                      <h4 className="text-sm font-bold text-white">{sub.displayName}</h4>
                      <p className="text-xs text-gray-400 font-mono">
                        {sub.category} • {sub.country}
                      </p>
                      <p className="text-xs text-[#FF003C] font-mono font-bold mt-1">
                        {t("profile.votes_received", "Alınan Oy:")} {sub.voteCount}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {sub.status === "approved" ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {t("profile.status_approved", "ONAYLANDI")}
                      </span>
                    ) : sub.status === "rejected" ? (
                      <span className="px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-500/40 text-xs font-bold font-mono flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        {t("profile.status_rejected", "REDDEDİLDİ")}
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono flex items-center gap-1 animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        {t("profile.status_pending", "ONAY BEKLİYOR")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
