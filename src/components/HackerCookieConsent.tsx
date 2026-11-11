import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Check, X } from 'lucide-react';

export const HackerCookieConsent: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return false;
      const consent = localStorage.getItem('yyyh_privacy_consent_v1');
      return !consent;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // Allow opening anytime from footer "VERIFIED CHANNELS" section
    const handleOpenConsent = () => setIsOpen(true);
    window.addEventListener('open-privacy-consent', handleOpenConsent);
    return () => window.removeEventListener('open-privacy-consent', handleOpenConsent);
  }, []);

  const handleAccept = (type: 'all' | 'essential') => {
    try {
      localStorage.setItem('yyyh_privacy_consent_v1', JSON.stringify({
        type,
        timestamp: new Date().toISOString(),
        zeroTracking: type === 'essential'
      }));
      localStorage.setItem('yyyh_usage_analytics_v1', type === 'all' ? 'enabled' : 'disabled');
      window.dispatchEvent(new Event('yyyh-privacy-updated'));
    } catch {
      // Storage unavailable in strict private modes
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <aside
      id="privacy-permission-popup"
      aria-label="Privacy and Cookie Permissions"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50"
    >
      <div className="rounded-xl bg-[#090d16] border border-emerald-500/60 p-4 shadow-2xl font-sans text-slate-200">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/90 border border-emerald-500/50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-white text-xs sm:text-sm">
                Cookie &amp; Storage Permissions
              </h3>
              <span className="text-[11px] font-mono text-emerald-400">Local preferences + optional site metrics</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-slate-300 hover:text-white p-2.5 min-w-[48px] min-h-[48px] rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center"
            title="Dismiss permission prompt"
            aria-label="Dismiss permission prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed mb-3">
          Essential storage keeps bookmarks and theme preferences on this device. Choosing Accept All also enables optional Vercel Speed Insights and Web Analytics page/performance measurement. Essential Only disables both optional measurement services. No advertising pixels or behavioral profiling are added.
        </p>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleAccept('all')}
            className="flex-1 min-h-[48px] py-2.5 px-4 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-mono font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Accept All</span>
          </button>
          <button
            type="button"
            onClick={() => handleAccept('essential')}
            className="min-h-[48px] min-w-[48px] py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-mono text-xs transition-colors cursor-pointer"
          >
            Essential Only
          </button>
        </div>
      </div>
    </aside>
  );
};
