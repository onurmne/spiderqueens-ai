import React, { useState } from "react";
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Trash2,
  Trophy,
  RefreshCw,
  LogOut,
  Check,
} from "lucide-react";
import { Contestant } from "../types";
import { spiderService } from "../services/spiderService";
import { useLanguage } from "../i18n/LanguageContext";

interface AdminDashboardProps {
  allContestants: Contestant[];
  onRefreshData: () => void;
  onCrownWinner: (contestantId: string) => void;
  onLogoutAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  allContestants,
  onRefreshData,
  onCrownWinner,
  onLogoutAdmin,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [rejectReasonMap, setRejectReasonMap] = useState<Record<string, string>>({});

  const pendingContestants = allContestants.filter((c) => c.status === "pending");
  const approvedContestants = allContestants.filter((c) => c.status === "approved");

  const handleApprove = (id: string) => {
    spiderService.approveContestant(id);
    onRefreshData();
  };

  const handleReject = (id: string) => {
    const reason = rejectReasonMap[id] || "Does not meet Spider-Man cosplay guidelines";
    spiderService.rejectContestant(id, reason);
    onRefreshData();
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu yarışmacı kaydını kalıcı olarak silmek istediğinizden emin misiniz?")) {
      spiderService.deleteContestant(id);
      onRefreshData();
    }
  };

  return (
    <div className="min-h-screen text-slate-100 bg-[#050505] pb-24">
      {/* Header */}
      <div className="bg-[#080808] border-b border-[#FF003C]/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF003C]/20 border border-[#FF003C]/40 text-[#FF003C] text-xs font-mono font-bold uppercase">
              <ShieldAlert className="w-3.5 h-3.5 text-[#FF003C]" />
              {t("admin.title", "Yönetici Kontrol Paneli")}
            </div>
            <h1 className="text-3xl font-black text-white uppercase mt-1">
              SpiderQueens Moderasyon Merkezi
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefreshData}
              className="px-3.5 py-2 rounded-xl bg-[#0c0c0c] border border-white/10 hover:border-white/20 text-gray-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Yenile
            </button>

            {/* Logout Admin Button */}
            <button
              onClick={onLogoutAdmin}
              className="px-4 py-2 rounded-xl bg-[#FF003C]/20 text-[#FF003C] border border-[#FF003C]/40 text-xs font-bold hover:bg-[#FF003C]/30 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t("admin.logout", "Yöneticiden Çıkış Yap")}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "pending"
                ? "bg-[#FF003C] text-white shadow-[0_0_15px_rgba(255,0,60,0.4)]"
                : "bg-[#0c0c0c] text-gray-400 hover:text-white border border-white/10"
            }`}
          >
            <span>{t("admin.pending", "Onay Bekleyenler")}</span>
            <span className="px-2 py-0.5 rounded-full bg-[#050505] text-[10px] font-mono font-bold text-[#FF003C]">
              {pendingContestants.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("approved")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "approved"
                ? "bg-[#9D00FF] text-white shadow-[0_0_15px_rgba(157,0,255,0.4)]"
                : "bg-[#0c0c0c] text-gray-400 hover:text-white border border-white/10"
            }`}
          >
            <span>{t("admin.approved", "Onaylanan Yarışmacılar")}</span>
            <span className="px-2 py-0.5 rounded-full bg-[#050505] text-[10px] font-mono font-bold text-purple-300">
              {approvedContestants.length}
            </span>
          </button>
        </div>

        {/* Pending Approvals Tab */}
        {activeTab === "pending" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white uppercase">
              {t("admin.pending", "Onay Bekleyen Fotoğraflar")} ({pendingContestants.length})
            </h3>

            {pendingContestants.length === 0 ? (
              <div className="p-12 text-center bg-[#0c0c0c] rounded-3xl border border-white/10 text-gray-400 text-xs">
                Onay bekleyen başvuru bulunmamaktadır. Tüm fotoğraflar incelendi!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingContestants.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#0c0c0c] rounded-3xl p-6 border border-[#FF003C]/40 space-y-4 shadow-[0_0_20px_rgba(255,0,60,0.15)]"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.cosplayPhotoUrl}
                        alt={item.displayName}
                        className="w-32 h-40 object-cover rounded-2xl bg-[#050505] border border-white/10"
                        referrerPolicy="no-referrer"
                      />

                      <div className="space-y-2 flex-1">
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                          {item.category} • {item.country}
                        </span>

                        <h4 className="text-base font-bold text-white">{item.displayName}</h4>
                        <p className="text-xs text-gray-400 font-mono">@{item.username}</p>
                        <p className="text-xs text-gray-300 line-clamp-3 italic">"{item.bio}"</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {t("admin.approve", "Fotoğrafı Onayla")}
                      </button>

                      <button
                        onClick={() => handleReject(item.id)}
                        className="flex-1 py-3 rounded-xl bg-[#141414] hover:bg-rose-950 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        {t("admin.reject", "Reddet")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Approved Contestants Tab */}
        {activeTab === "approved" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white uppercase">
              {t("admin.approved", "Onaylanan ve Yayında Olan Yarışmacılar")} ({approvedContestants.length})
            </h3>

            <div className="bg-[#0c0c0c] rounded-3xl border border-white/10 overflow-hidden">
              <div className="divide-y divide-white/10">
                {approvedContestants.map((c) => (
                  <div key={c.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={c.cosplayPhotoUrl}
                        alt={c.displayName}
                        className="w-12 h-12 rounded-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">{c.displayName}</h4>
                        <div className="text-xs text-gray-400 font-mono">
                          @{c.username} • {c.country} • Toplam Oy: {c.voteCount}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onCrownWinner(c.id);
                          alert(`🏆 ${c.displayName} Ayın Şampiyonu İlan Edildi!`);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        {t("admin.crown", "Aylık Şampiyon İlan Et")}
                      </button>

                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-2 rounded-xl bg-[#141414] text-rose-400 hover:bg-rose-950 cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
