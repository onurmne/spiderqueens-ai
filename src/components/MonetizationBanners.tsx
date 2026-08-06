import React from "react";
import { Sparkles, ExternalLink, ShieldCheck, Zap, Award } from "lucide-react";
import { SponsoredBrand } from "../types";
import { useLanguage } from "../i18n/LanguageContext";

export const SPONSORED_BRANDS: SponsoredBrand[] = [
  {
    id: "brand-1",
    name: "SpiderLens Optics",
    logoUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=150&q=80",
    tagline: "Custom LED Cyber Eyes & Lenses",
    offerText: "Use code QUEENS15 for 15% OFF Spider-Gwen Lenses",
    linkUrl: "https://example.com/spider-lenses",
  },
  {
    id: "brand-2",
    name: "Insomniac Suit Lab",
    logoUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=150&q=80",
    tagline: "Custom Stitched Lycra & Symbiote Latex",
    offerText: "Official Sponsor of Week #28 Cash Prize Pool",
    linkUrl: "https://example.com/insomniac-suits",
  },
];

export const MonetizationBanners: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#080808]/80 border-y border-white/10 py-6 my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {t("monetization.sponsored_brands", "SPONSORLU COSPLAY MARKALARI & ORTAKLAR")}
          </span>
          <span className="text-gray-500 uppercase">
            {t("monetization.ad_placeholder", "REKLAM ALANI")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SPONSORED_BRANDS.map((brand) => (
            <div
              key={brand.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition-colors flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-amber-500/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{brand.name}</h4>
                  <p className="text-xs text-slate-400">{brand.tagline}</p>
                  <span className="text-[10px] text-amber-300 font-mono font-bold mt-0.5 block">
                    {brand.offerText}
                  </span>
                </div>
              </div>

              <a
                href={brand.linkUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
