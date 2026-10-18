import React, { useState, useEffect, useRef } from 'react';
import { 
  DollarSign, 
  Code2, 
  ExternalLink, 
  Check, 
  Settings2,
  Sparkles,
  Shield,
  Cpu,
  Terminal,
  Zap,
  X
} from 'lucide-react';

export type AdPlacement = 
  | 'header-leaderboard' 
  | 'sidebar-rectangle' 
  | 'sidebar' 
  | 'feed-top' 
  | 'feed-middle' 
  | 'article-inline' 
  | 'article-bottom';

export interface HackerBannerAdProps {
  placement: AdPlacement;
  slotId?: string;
  className?: string;
  adClient?: string; // e.g. "ca-pub-XXXXXXXXXXXXXXXX"
  adSlot?: string;   // e.g. "1234567890"
  sponsorKey?: 'cloud-sec' | 'ollama-box' | 'hackthebox' | 'vault-key' | 'vpn-privacy';
}

// Built-in curated cybersecurity & autonomous systems sponsors that look great and maintain high CTR
const SPONSOR_PRESETS = {
  'cloud-sec': {
    title: 'Sovereign Cloud & VPS Infrastructure',
    tagline: 'High-performance KVM Linux instances with NVMe SSDs & DDoS scrubbing.',
    cta: 'Deploy Node',
    sponsor: 'HostCyber / Verified Sponsor',
    url: 'https://github.com',
    icon: Cpu,
    accent: 'text-cyan-400 border-cyan-800/40 bg-cyan-950/30'
  },
  'ollama-box': {
    title: 'Local Compute Workstation Rigs 2026',
    tagline: 'Run DeepSeek-R1 & Llama-3 locally with 64GB Unified Memory & Zero Telemetry.',
    cta: 'Explore Specs',
    sponsor: 'SiliconAI / Certified Partner',
    url: 'https://github.com',
    icon: Sparkles,
    accent: 'text-emerald-400 border-emerald-800/40 bg-emerald-950/30'
  },
  'hackthebox': {
    title: 'Pro Offensive Security Labs & Range',
    tagline: 'Live red team security practice boxes, Active Directory escalation & CTFs.',
    cta: 'Start Hacking',
    sponsor: 'OffSec Labs / Community',
    url: 'https://github.com',
    icon: Terminal,
    accent: 'text-amber-400 border-amber-800/40 bg-amber-950/30'
  },
  'vault-key': {
    title: 'Zero-Trust Airgapped Security Vault',
    tagline: 'Store SSH keys, GPG signatures & credentials offline with biometric verification.',
    cta: 'View Security Vault',
    sponsor: 'VaultSec / Security Labs',
    url: 'https://github.com',
    icon: Shield,
    accent: 'text-purple-400 border-purple-800/40 bg-purple-950/30'
  },
  'vpn-privacy': {
    title: 'WireGuard Post-Quantum Encrypted VPN',
    tagline: 'Zero logs, audited open-source multi-hop encryption for security researchers.',
    cta: 'Get Secure',
    sponsor: 'CipherTunnel / Privacy Net',
    url: 'https://github.com',
    icon: Zap,
    accent: 'text-teal-400 border-teal-800/40 bg-teal-950/30'
  }
};

export const HackerBannerAd: React.FC<HackerBannerAdProps> = ({
  placement,
  slotId,
  className = '',
  adClient = 'ca-pub-XXXXXXXXXXXXXX',
  adSlot = '1234567890',
  sponsorKey
}) => {
  const [isVisible] = useState(true);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [adMode, setAdMode] = useState<'sponsor' | 'adsense' | 'custom'>(() => {
    try {
      return (localStorage.getItem(`yyyh_ad_mode_${placement}`) as any) || 'sponsor';
    } catch {
      return 'sponsor';
    }
  });

  const [customAdCode, setCustomAdCode] = useState<string>(() => {
    try {
      return localStorage.getItem(`yyyh_ad_code_${placement}`) || '';
    } catch {
      return '';
    }
  });

  const [selectedAdClient, setSelectedAdClient] = useState<string>(() => {
    try {
      return localStorage.getItem('yyyh_adsense_client') || adClient;
    } catch {
      return adClient;
    }
  });

  const [selectedAdSlot, setSelectedAdSlot] = useState<string>(() => {
    try {
      return localStorage.getItem(`yyyh_adsense_slot_${placement}`) || adSlot;
    } catch {
      return adSlot;
    }
  });

  const adContainerRef = useRef<HTMLDivElement>(null);
  const defaultSlotId = slotId || `yyyh-ad-${placement}`;

  // Execute AdSense push if adsense mode is active
  useEffect(() => {
    if (isVisible && adMode === 'adsense' && typeof window !== 'undefined') {
      try {
        const win = window as any;
        if (win.adsbygoogle && Array.isArray(win.adsbygoogle)) {
          win.adsbygoogle.push({});
        }
      } catch (err) {
        console.debug('AdSense script initialization notice:', err);
      }
    }
  }, [isVisible, adMode]);

  // Dimensions formatted with ultra-compact, non-intrusive minimal heights
  const getContainerStyles = () => {
    switch (placement) {
      case 'header-leaderboard':
        return 'w-full max-w-[728px] min-h-[46px]';
      case 'sidebar-rectangle':
      case 'sidebar':
        return 'w-full max-w-full min-h-[48px]';
      case 'feed-top':
      case 'feed-middle':
      case 'in-feed-native':
        return 'w-full max-w-[728px] min-h-[48px]';
      case 'article-inline':
        return 'w-full max-w-[728px] min-h-[48px]';
      case 'article-bottom':
      case 'footer-sticky':
        return 'w-full max-w-[728px] min-h-[48px]';
      default:
        return 'w-full max-w-[728px] min-h-[48px]';
    }
  };

  // Determine fallback sponsor
  const resolvedSponsorKey = sponsorKey || (
    placement === 'header-leaderboard' ? 'cloud-sec' :
    placement === 'sidebar-rectangle' || placement === 'sidebar' ? 'hackthebox' :
    placement === 'feed-middle' ? 'ollama-box' :
    placement === 'article-inline' ? 'vault-key' : 'vpn-privacy'
  );
  const sponsor = SPONSOR_PRESETS[resolvedSponsorKey] || SPONSOR_PRESETS['cloud-sec'];
  const SponsorIcon = sponsor.icon;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(`yyyh_ad_mode_${placement}`, adMode);
      localStorage.setItem(`yyyh_ad_code_${placement}`, customAdCode);
      localStorage.setItem('yyyh_adsense_client', selectedAdClient);
      localStorage.setItem(`yyyh_adsense_slot_${placement}`, selectedAdSlot);
      setShowConfigModal(false);
    } catch {
      // ignore
    }
  };

  return (
    <div 
      ref={adContainerRef}
      id={defaultSlotId}
      data-ad-placement={placement}
      data-ad-mode={adMode}
      className={`mx-auto my-1.5 relative overflow-hidden ${getContainerStyles()} ${className}`}
    >
      <div className="w-full h-full">
        {adMode === 'adsense' ? (
          /* Google AdSense High-Performance Native Responsive Tag */
          <div className="w-full h-full bg-[#050811] border border-slate-800/90 rounded-xl p-2 flex flex-col items-center justify-center relative group">
            <span className="absolute top-1 right-2 text-[10px] font-mono text-slate-300 uppercase tracking-wider pointer-events-none">
              Ad • Google AdSense
            </span>
            <ins
              className="adsbygoogle block w-full h-full"
              data-ad-client={selectedAdClient}
              data-ad-slot={selectedAdSlot}
              data-ad-format={placement.includes('sidebar') ? 'rectangle' : 'auto'}
              data-full-width-responsive="true"
            />
            <button
              onClick={() => setShowConfigModal(true)}
              className="absolute bottom-1 right-2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Slot Settings
            </button>
          </div>
        ) : adMode === 'custom' && customAdCode ? (
          /* Custom Injected Ad Code */
          <div 
            className="w-full h-full bg-[#050811] border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden relative group"
          >
            <div 
              className="w-full h-full flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: customAdCode }} 
            />
            <button
              onClick={() => setShowConfigModal(true)}
              className="absolute top-1 right-2 text-[10px] font-mono text-slate-200 hover:text-white bg-black/80 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Edit Tag
            </button>
          </div>
        ) : (
          /* Native Hacker-Themed High-CTR Sponsor Ad (Zero UI Disruption) */
          <div className={`w-full h-full rounded-xl bg-gradient-to-r from-[#070c18] via-[#091122] to-[#060a14] border ${sponsor.accent} p-2 flex flex-col justify-between relative group shadow-sm hover:border-emerald-500/60 transition-colors`}>
            
            {/* Ad Header Label */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-700">
                  SPONSOR
                </span>
                <span className="text-[10px] font-mono text-slate-400 truncate">
                  {sponsor.sponsor}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowConfigModal(true)}
                  title="Configure Google AdSense or Ad Network Script"
                  className="p-1 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-[10px] font-mono flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Settings2 className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Main Content Layout (Responsive for Leaderboard vs Sidebar) */}
            {placement === 'sidebar-rectangle' || placement === 'sidebar' ? (
              /* Sleek, Compact Sidebar Banner Layout */
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <SponsorIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <h4 className="text-xs font-bold text-white font-sans truncate group-hover:text-emerald-300 transition-colors">
                      {sponsor.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans truncate mt-0.5">
                    {sponsor.tagline}
                  </p>
                </div>

                <a
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="px-2.5 py-1 rounded bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-mono text-[11px] font-bold inline-flex items-center gap-1 shrink-0 transition-colors shadow-sm"
                >
                  <span>{sponsor.cta}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            ) : (
              /* Horizontal Leaderboard / Feed Layout */
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 shrink-0 hidden sm:flex">
                    <SponsorIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white font-sans truncate group-hover:text-emerald-300 transition-colors">
                      {sponsor.title}
                    </h4>
                    <p className="text-xs text-slate-200 font-sans truncate">
                      {sponsor.tagline}
                    </p>
                  </div>
                </div>

                <a
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="px-4 py-3 min-h-[48px] min-w-[48px] rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-mono text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-sm"
                >
                  <span>{sponsor.cta}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Ad Setup & Monetization Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#090d16] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Monetization &amp; AdSlot Settings: {placement}</span>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-2.5 min-w-[48px] min-h-[48px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-300 text-xs font-sans leading-relaxed">
              Choose your ad serving method. Supports <strong className="text-emerald-400">Google AdSense</strong> with zero Cumulative Layout Shift, <strong className="text-slate-200">Native Cyber Sponsors</strong>, or <strong className="text-slate-200">Custom Ad Scripts</strong> (PropellerAds, Adsterra, Infolinks).
            </p>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-slate-200 font-semibold">Serving Mode:</label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAdMode('sponsor')}
                    className={`p-2.5 min-h-[48px] rounded-lg border text-center font-semibold transition-colors ${
                      adMode === 'sponsor'
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Native Cyber Sponsor
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdMode('adsense')}
                    className={`p-2.5 min-h-[48px] rounded-lg border text-center font-semibold transition-colors ${
                      adMode === 'adsense'
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Google AdSense
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdMode('custom')}
                    className={`p-2.5 min-h-[48px] rounded-lg border text-center font-semibold transition-colors ${
                      adMode === 'custom'
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Custom Ad Tag / HTML
                  </button>
                </div>
              </div>

              {adMode === 'adsense' && (
                <div className="space-y-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      AdSense Publisher ID (data-ad-client):
                    </label>
                    <input
                      type="text"
                      value={selectedAdClient}
                      onChange={(e) => setSelectedAdClient(e.target.value)}
                      placeholder="ca-pub-1234567890123456"
                      className="w-full bg-[#050811] border border-slate-700 rounded p-2.5 min-h-[48px] text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Ad Slot ID (data-ad-slot):
                    </label>
                    <input
                      type="text"
                      value={selectedAdSlot}
                      onChange={(e) => setSelectedAdSlot(e.target.value)}
                      placeholder="9876543210"
                      className="w-full bg-[#050811] border border-slate-700 rounded p-2.5 min-h-[48px] text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {adMode === 'custom' && (
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">
                    HTML / JavaScript Ad Code:
                  </label>
                  <textarea
                    rows={4}
                    value={customAdCode}
                    onChange={(e) => setCustomAdCode(e.target.value)}
                    placeholder={`<!-- Paste your ad snippet here -->\n<div class="ad-container"></div>`}
                    className="w-full bg-[#050811] border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAdMode('sponsor');
                    setCustomAdCode('');
                    localStorage.removeItem(`yyyh_ad_mode_${placement}`);
                    localStorage.removeItem(`yyyh_ad_code_${placement}`);
                    setShowConfigModal(false);
                  }}
                  className="px-4 py-2.5 min-h-[48px] rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                >
                  Reset Defaults
                </button>

                <button
                  type="submit"
                  className="px-4 py-2.5 min-h-[48px] rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold transition-colors flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
