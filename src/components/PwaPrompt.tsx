import React, { useState, useEffect } from "react";
import { Smartphone, Download, X, Check } from "lucide-react";

export const PwaPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Show prompt after 3 seconds for mobile experience simulation
    const timer = setTimeout(() => {
      if (!localStorage.getItem("sq_pwa_dismissed")) {
        setShowPrompt(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleInstall = () => {
    setInstalled(true);
    setTimeout(() => {
      setShowPrompt(false);
      localStorage.setItem("sq_pwa_dismissed", "true");
    }, 2000);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("sq_pwa_dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 bg-slate-900/95 backdrop-blur-md border border-rose-500/50 p-4 rounded-2xl shadow-[0_0_30px_rgba(255,0,85,0.3)] space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-600 to-purple-600 text-white shadow-md">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase">Install SpiderQueens App</h4>
            <p className="text-[11px] text-slate-300">Add to Home Screen for fast mobile voting & instant push notifications.</p>
          </div>
        </div>

        <button onClick={handleDismiss} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={handleInstall}
        className="w-full py-2 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 text-white font-bold text-xs hover:scale-[1.02] transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
      >
        {installed ? (
          <>
            <Check className="w-4 h-4 text-emerald-300" />
            <span>App Installed on Home Screen!</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Add PWA to Home Screen</span>
          </>
        )}
      </button>
    </div>
  );
};
