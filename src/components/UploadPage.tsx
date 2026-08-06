import React, { useState } from "react";
import { Upload, Camera, CheckCircle2, Instagram, Globe, Sparkles, Image as ImageIcon } from "lucide-react";
import { CosplayCategory, UploadFormData } from "../types";
import { spiderService } from "../services/spiderService";
import { WORLD_COUNTRIES } from "../data/countries";
import { useLanguage } from "../i18n/LanguageContext";
import heroGwenPic from "../assets/images/hero_spiderqueen_cosplay_1785866609591.jpg";

interface UploadPageProps {
  onSuccess: () => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({ onSuccess }) => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState<UploadFormData>({
    displayName: "",
    username: "",
    instagramUrl: "",
    country: "Turkey",
    countryCode: "TR",
    category: "Spider-Gwen",
    bio: "",
    profilePhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    cosplayPhotoUrl: heroGwenPic,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<"idle" | "success">("idle");

  const categories: CosplayCategory[] = [
    "Spider-Gwen",
    "Silk",
    "Spider-Woman",
    "Venomized",
    "Spider-Girl",
    "Original Spider-Queen",
  ];

  // Sample preset images for quick testing
  const sampleCosplayPresets = [
    { label: "Spider-Gwen Synth", url: heroGwenPic },
    { label: "Cindy Moon Silk", url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80" },
    { label: "Venomized Gwenom", url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80" },
    { label: "Spider-Woman Suit", url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80" },
  ];

  const handleCountryChange = (countryName: string) => {
    const matched = WORLD_COUNTRIES.find((c) => c.name === countryName);
    setFormData((prev) => ({
      ...prev,
      country: countryName,
      countryCode: matched ? matched.code : "US",
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, cosplayPhotoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.displayName || !formData.username || !formData.cosplayPhotoUrl) {
      alert("Lütfen sahne adınızı, kullanıcı adınızı doldurun ve bir cosplay fotoğrafı yükleyin.");
      return;
    }

    setIsSubmitting(true);
    try {
      await spiderService.submitContestant(formData);
      setSubmittedStatus("success");
      setTimeout(() => {
        onSuccess();
      }, 2500);
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-white bg-[#050505] pb-24">
      {/* Header Banner */}
      <div className="bg-[#080808] border-b border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF003C]/10 border border-[#FF003C]/40 text-[#FF003C] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FF003C]" />
            {t("upload.tag", "YARIŞMACI BAŞVURU PORTALI")}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            {t("upload.title", "Cosplay Fotoğrafını Gönder")}
          </h1>
          <p className="text-sm text-gray-400 max-w-2xl mt-1">
            {t("upload.subtitle", "Aylık Spider Queens Mücadelesine katıl. Yüklediğin fotoğraflar moderasyon onayından sonra yayınlanır!")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {submittedStatus === "success" ? (
          <div className="max-w-xl mx-auto p-8 rounded-3xl bg-[#0c0c0c] border border-[#FF003C]/40 text-center space-y-4 shadow-[0_0_50px_rgba(255,0,60,0.3)] animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-white uppercase">
              {t("upload.success_title", "Başvuru Alındı!")}
            </h2>

            <p className="text-sm text-gray-300">
              {t("upload.success_desc", "Cosplay başvurunuz sisteme kaydedildi. Yönetici onayından sonra oylama akışında görünecektir.")}
            </p>

            <div className="pt-4 text-xs font-mono text-[#00D1FF] animate-pulse">
              Yarışma akışına yönlendiriliyorsunuz...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
              {/* Section 1: Creator Details */}
              <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-[#FF003C] font-mono uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#FF003C]" />
                  {t("upload.section_1", "1. Sanatçı Bilgileri")}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-300">
                      {t("upload.display_name", "Sahne / Ekran Adı *")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Alexis 'Gwenom' Ray"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050505] border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF003C]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-300">
                      {t("upload.username", "Cosplayer Kullanıcı Adı *")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: gwenom_synth"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050505] border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF003C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-rose-400" />
                      {t("upload.instagram", "Instagram Profil Bağlantısı *")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="https://instagram.com/kullaniciadi"
                      value={formData.instagramUrl}
                      onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050505] border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF003C]"
                    />
                  </div>

                  {/* Comprehensive World Countries Dropdown */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-300">
                      {t("upload.country", "Temsil Edilen Ülke *")}
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050505] border border-white/10 text-xs text-gray-200 focus:outline-none focus:border-[#FF003C] cursor-pointer"
                    >
                      {WORLD_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name} className="bg-[#0c0c0c] text-white">
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Cosplay Suit & Image Upload */}
              <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-[#00D1FF] font-mono uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#00D1FF]" />
                  {t("upload.section_2", "2. Cosplay Kostümü & Fotoğraf")}
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">
                    {t("upload.category", "Spider-Man Variyasyonu *")}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          formData.category === cat
                            ? "bg-[#FF003C]/20 border-[#FF003C] text-[#FF003C] shadow-[0_0_10px_rgba(255,0,60,0.3)]"
                            : "bg-[#050505] border-white/10 text-gray-400 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">
                    {t("upload.bio", "Kostüm Detayları & Açıklama")}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={t("upload.bio_ph", "Kostümünüzün yapılış sürecini, kullanılan malzemeleri veya detayları yazın...")}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#050505] border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF003C]"
                  />
                </div>

                {/* Upload Image Drop Zone */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
                    <span>{t("upload.image_upload", "Yüksek Çözünürlüklü Fotoğraf Yükle *")}</span>
                    <span className="text-[10px] text-gray-500 font-mono">PNG, JPG, WEBP (Maks 10MB)</span>
                  </label>

                  <div className="relative border-2 border-dashed border-white/20 hover:border-[#FF003C] rounded-2xl p-6 text-center bg-[#050505] transition-colors group cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="space-y-2 pointer-events-none">
                      <div className="w-12 h-12 rounded-2xl bg-[#FF003C]/10 text-[#FF003C] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-semibold text-gray-300">
                        {t("upload.drag_drop", "Dosya Seçmek İçin Tıklayın veya Sürükleyin")}
                      </p>
                    </div>
                  </div>

                  {/* Sample Preset Photos for Quick Testing */}
                  <div className="pt-2">
                    <p className="text-[11px] text-gray-400 mb-2">
                      {t("upload.presets", "Veya hızlı test için hazır fotoğraf seçin:")}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {sampleCosplayPresets.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setFormData({ ...formData, cosplayPhotoUrl: preset.url })}
                          className={`p-2 rounded-xl bg-[#050505] border text-[10px] font-semibold text-left truncate transition-all cursor-pointer ${
                            formData.cosplayPhotoUrl === preset.url
                              ? "border-[#00D1FF] text-[#00D1FF]"
                              : "border-white/10 text-gray-400 hover:text-white"
                          }`}
                        >
                          📷 {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF003C] via-[#9D00FF] to-[#00D1FF] text-white font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(255,0,60,0.5)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
              >
                <Sparkles className="w-4 h-4" />
                {isSubmitting ? "Gönderiliyor..." : t("upload.submit_btn", "Başvuruyu Gönder")}
              </button>
            </form>

            {/* Live Preview Card Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="sticky top-24">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FF003C] uppercase mb-2">
                  <ImageIcon className="w-4 h-4" />
                  {t("upload.preview_title", "CANLI KART ÖNİZLEMESİ")}
                </div>

                <div className="bg-[#0c0c0c] rounded-3xl p-4 border border-[#FF003C]/40 shadow-[0_0_30px_rgba(255,0,60,0.2)] space-y-4">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#050505]">
                    <img
                      src={formData.cosplayPhotoUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-[#080808]/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#FF003C] border border-[#FF003C]/40 uppercase">
                      {formData.category}
                    </div>
                    <div className="absolute top-3 right-3 bg-[#080808]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-mono font-bold text-[#00D1FF] border border-[#00D1FF]/40">
                      {formData.country}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-white">
                      {formData.displayName || "Sahne Adınız"}
                    </h4>
                    <p className="text-xs text-gray-400 font-mono">
                      @{formData.username ? formData.username.replace(/^@/, "") : "kullaniciadi"}
                    </p>
                    <p className="text-xs text-gray-300 italic line-clamp-2">
                      "{formData.bio || "Kostüm açıklamanız burada görünecektir..."}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
