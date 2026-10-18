import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Search, 
  Bookmark, 
  ShieldAlert, 
  Radio, 
  Cpu, 
  HelpCircle, 
  Package, 
  BookOpen, 
  X,
  RefreshCw,
  Rss,
  Sparkles,
  Users,
  Lock,
  Server,
  Wrench,
  Map,
  Info,
  Flag,
  Globe,
  ChevronDown,
  ArrowRight,
  Menu,
  ShieldCheck,
  Laptop,
  FileCode,
  Download,
  Compass
} from 'lucide-react';
import { PrimaryCategory, ThemeMode, ActiveSiteView, Article } from '../types';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../utils/i18n';
import { SOVEREIGN_AI_NAV_ITEMS as SOVEREIGN_AI_PAGES, TOOL_PAGES_META as TOOL_PAGES } from '../data/routeMetaData';

const SOVEREIGN_EMOJI_MAP: Record<string, { emoji: string; badge: string; color: string; gradient: string }> = {
  '/sovereign-ai': { emoji: '🧠', badge: 'Model Custody', color: 'text-cyan-300', gradient: 'from-cyan-950 via-slate-900 to-cyan-900/40 border-cyan-500/40' },
  '/private-local-ai': { emoji: '🏠', badge: 'Local Compute', color: 'text-blue-300', gradient: 'from-blue-950 via-slate-900 to-indigo-900/40 border-blue-500/40' },
  '/air-gapped-ai': { emoji: '🔌', badge: 'Air-Gapped', color: 'text-emerald-300', gradient: 'from-emerald-950 via-slate-900 to-teal-900/40 border-emerald-500/40' },
  '/ollama-security': { emoji: '🦙', badge: 'Ollama Guard', color: 'text-amber-300', gradient: 'from-amber-950 via-slate-900 to-orange-900/40 border-amber-500/40' },
  '/vllm-security': { emoji: '⚡', badge: 'vLLM Cluster', color: 'text-purple-300', gradient: 'from-purple-950 via-slate-900 to-pink-900/40 border-purple-500/40' },
  '/local-llm-security': { emoji: '🛡️', badge: 'Sandbox & RCE', color: 'text-rose-300', gradient: 'from-rose-950 via-slate-900 to-red-950 border-rose-500/40' },
  '/sovereign-ai-infrastructure': { emoji: '🖲️', badge: 'GPU Topology', color: 'text-teal-300', gradient: 'from-teal-950 via-slate-900 to-cyan-950 border-teal-500/40' },
  '/ai-data-privacy': { emoji: '👁️‍🗨️', badge: 'Zero-Telemetry', color: 'text-sky-300', gradient: 'from-sky-950 via-slate-900 to-blue-950 border-sky-500/40' },
  '/ai-security': { emoji: '🎯', badge: 'Red-Teaming', color: 'text-red-300', gradient: 'from-red-950 via-slate-900 to-rose-950 border-red-500/40' }
};

const CURATED_SECURITY_TOOLS = [
  {
    path: '/tools/cidr-calculator',
    slug: 'cidr-calculator',
    title: 'CIDR Subnet Calculator',
    desc: 'IPv4 & IPv6 network ranges, usable addresses, mask bits & subnetting.',
    emoji: '🌐',
    badge: 'Networking',
    gradient: 'from-blue-950 via-slate-900 to-indigo-950 border-blue-500/40'
  },
  {
    path: '/tools/hash-analyzer',
    slug: 'hash-analyzer',
    title: 'Cryptographic Hash Analyzer',
    desc: 'Instant SHA-256, SHA-512, MD5 checksum calculation & identification.',
    emoji: '🧬',
    badge: 'Cryptography',
    gradient: 'from-emerald-950 via-slate-900 to-teal-950 border-emerald-500/40'
  },
  {
    path: '/tools/password-entropy',
    slug: 'password-entropy',
    title: 'Password Entropy Calculator',
    desc: 'Shannon entropy bit rating & brute-force cluster crack time estimation.',
    emoji: '🔐',
    badge: 'Authentication',
    gradient: 'from-amber-950 via-slate-900 to-orange-950 border-amber-500/40'
  },
  {
    path: '/tools/http-security-headers',
    slug: 'http-security-headers',
    title: 'HTTP Security Headers Inspector',
    desc: 'Audit & generate hardened HSTS, CSP, X-Frame-Options & CORS rules.',
    emoji: '🛡️',
    badge: 'Web Hardening',
    gradient: 'from-purple-950 via-slate-900 to-indigo-950 border-purple-500/40'
  },
  {
    path: '/tools/ssl-checker',
    slug: 'ssl-checker',
    title: 'SSL/TLS Certificate Inspector',
    desc: 'Inspect TLS 1.3 protocol, cipher suites, cert expiry & OpenSSL CLI.',
    emoji: '🔒',
    badge: 'SSL / TLS',
    gradient: 'from-cyan-950 via-slate-900 to-blue-950 border-cyan-500/40'
  },
  {
    path: '/tools',
    slug: 'cyber-encoder',
    title: 'CyberChef Payload Encoder',
    desc: 'Base64, Hex, URL, Binary, ROT13 & multi-stage payload analysis.',
    emoji: '⚡',
    badge: 'Encoding',
    gradient: 'from-yellow-950 via-slate-900 to-amber-950 border-yellow-500/40'
  },
  {
    path: '/tools',
    slug: 'ai-jailbreak-sandbox',
    title: 'Prompt Injection Sandbox',
    desc: 'Adversarial jailbreak testing, LLM defense & input filter audits.',
    emoji: '🤖',
    badge: 'Model Sec',
    gradient: 'from-rose-950 via-slate-900 to-pink-950 border-rose-500/40'
  },
  {
    path: '/tools',
    slug: 'ip-lookup',
    title: 'IP Geolocation & ASN Map',
    desc: 'Autonomous System Number (ASN), ISP telemetry & geolocation map.',
    emoji: '🌍',
    badge: 'Reconnaissance',
    gradient: 'from-emerald-950 via-slate-900 to-cyan-950 border-emerald-500/40'
  }
];

interface HeaderProps {
  currentCategory: PrimaryCategory | 'All';
  onSelectCategory: (category: PrimaryCategory | 'All') => void;
  activeView: ActiveSiteView;
  onSelectView: (view: ActiveSiteView, path?: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  theme?: ThemeMode;
  onToggleTheme?: (theme: ThemeMode) => void;
  bookmarksCount: number;
  onOpenBookmarks: () => void;
  articles?: Article[];
  onSelectArticle?: (article: Article) => void;
  onOpenTerminal: () => void;
  isTerminalOpen?: boolean;
  onOpenRss?: () => void;
  onOpenBloggerTheme?: () => void;
  language?: SupportedLanguage;
  onSelectLanguage?: (lang: SupportedLanguage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  activeView,
  onSelectView,
  searchQuery,
  onSearchChange,
  bookmarksCount,
  onOpenBookmarks,
  onOpenTerminal,
  isTerminalOpen = false,
  onOpenRss,
  onOpenBloggerTheme,
  language = 'en',
  onSelectLanguage
}) => {
  const [utcTime, setUtcTime] = useState<string>(() => {
    return new Date().toUTCString().slice(17, 25) + ' UTC';
  });
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isSovereignMenuOpen, setIsSovereignMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const sovereignMenuRef = useRef<HTMLDivElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown menus on Escape or click outside
  useEffect(() => {
    const handleCloseOnEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSovereignMenuOpen(false);
        setIsToolsMenuOpen(false);
        setIsMobileNavOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (sovereignMenuRef.current && !sovereignMenuRef.current.contains(target)) {
        setIsSovereignMenuOpen(false);
      }
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(target)) {
        setIsToolsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleCloseOnEsc);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleCloseOnEsc);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const bulletins = [
    'Zero-Trust • Active Directory Kerberoasting TGS Hashes Mitigations Deployed',
    'Zero-Trust Bastion: Immutable Linux kernel sysctl defense blueprint released',
    'Network Defense: Wireshark packet inspection and TLS 1.3 posture verified',
    'Wireless Recon: Caido proxy & SDR radio frequency analysis laboratory ready'
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const tickerTimer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % bulletins.length);
    }, 5000);
    return () => clearInterval(tickerTimer);
  }, [bulletins.length]);

  return (
    <header id="site-main-header" itemScope itemType="https://schema.org/WPHeader" className="w-full border-b border-emerald-900/40 bg-[#090d16] sticky top-0 z-40">
      {/* Accessible Skip Navigation Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-emerald-400 focus:text-slate-950 focus:rounded-lg focus:shadow-2xl focus:outline-none font-mono text-xs font-bold transition-all"
      >
        Skip to main content
      </a>

      {/* Top Advisory & Status Bar */}
      <div id="top-security-bar" className="w-full bg-[#050811] border-b border-slate-800/80 px-3 sm:px-6 lg:px-8 py-2 text-xs text-slate-300">
        <div className="max-w-7xl lg:max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex items-center gap-1 px-2 py-1 rounded bg-red-950/90 text-red-300 border border-red-700/60 font-mono font-semibold text-[11px] tracking-wider shrink-0">
              <Radio className="w-3.5 h-3.5 text-red-400" />
              LIVE ADVISORY
            </span>
            <span className="text-slate-200 font-mono text-xs truncate max-w-[240px] sm:max-w-[380px] md:max-w-[580px]">
              {bulletins[tickerIndex]}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 ml-auto font-mono text-xs">
            {/* RSS Feed Trigger */}
            {onOpenRss && (
              <button
                onClick={onOpenRss}
                title="RSS 2.0 Feed & Syndication (Press 'r')"
                className="flex items-center justify-center gap-1.5 px-3 py-2 min-h-[44px] rounded-md bg-orange-950/60 hover:bg-orange-900/80 text-orange-200 border border-orange-700/60 transition-colors cursor-pointer"
              >
                <Rss className="w-3.5 h-3.5 text-orange-300" />
                <span>RSS</span>
              </button>
            )}

            <span className="hidden xl:inline-flex items-center gap-1.5 text-emerald-300 bg-emerald-950/60 px-2.5 py-2 min-h-[44px] rounded-md border border-emerald-800/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              ZERO-TRUST
            </span>
            
            <span className="text-slate-300 hidden 2xl:inline min-w-[75px]">{utcTime}</span>
            
            {/* Quick Bookmarks Button */}
            <button 
              id="header-bookmarks-btn"
              onClick={onOpenBookmarks}
              className="flex items-center justify-center gap-1.5 px-3 py-2 min-h-[44px] rounded-md bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-amber-300 transition-colors border border-slate-700 cursor-pointer"
              title="Saved Bookmarked Articles (Press 'b')"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Saved ({bookmarksCount})</span>
            </button>

            {/* Multilingual Language Switcher */}
            {onSelectLanguage && (
              <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-2 min-h-[44px] rounded-md border border-slate-700 text-slate-200">
                <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <select
                  value={language}
                  onChange={(e) => onSelectLanguage(e.target.value as SupportedLanguage)}
                  aria-label="Select Interface Language"
                  className="bg-transparent py-0.5 text-slate-100 hover:text-white font-mono text-xs focus:outline-none cursor-pointer"
                  title="Select Interface Language"
                >
                  {SUPPORTED_LANGUAGES.map(l => (
                    <option key={l.code} value={l.code} className="bg-[#090d16] text-white">
                      {l.code.toUpperCase()} • {l.nativeLabel}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Logo & Search Bar */}
      <div className="max-w-7xl lg:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Tagline */}
        <a 
          href="/"
          onClick={(e) => { e.preventDefault(); onSelectView('blog', '/'); onSelectCategory('All'); }}
          className="flex items-center gap-3 cursor-pointer group select-none min-h-[48px]"
        >
          <div className="relative w-11 h-11 rounded-full flex items-center justify-center p-0.5 bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0">
            <div className="w-full h-full rounded-full bg-[#090d16] flex items-center justify-center relative overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-9 h-9 transition-transform duration-700 group-hover:rotate-180">
                <circle cx="50" cy="50" r="48" fill="#0b0f19" stroke="#10b981" strokeWidth="3" />
                <path d="M 50,2 A 48,48 0 0,1 50,98 A 24,24 0 0,1 50,50 A 24,24 0 0,0 50,2" fill="#10b981" />
                <circle cx="50" cy="26" r="6" fill="#0b0f19" />
                <circle cx="50" cy="74" r="6" fill="#10b981" />
              </svg>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono flex items-center">
                <span className="text-emerald-400">Yin</span>
                <span className="text-white">Yang</span>
                <span className="text-cyan-400">Yo</span>
                <span className="ml-1 text-slate-200 font-sans font-bold">Hackers</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                v2026
              </span>
            </div>
            <p className="text-xs text-slate-200 font-sans tracking-wide">
              Autonomous Cybersecurity Research &bull; Sovereign Local Infrastructure &bull; Defensive Architecture
            </p>
          </div>
        </a>

        {/* Live Search & Terminal Button Next to Search Bar */}
        <div className="w-full md:w-auto flex items-center gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="global-search-input"
              type="text"
              aria-label="Search research posts"
              placeholder="Search posts (Press '/' to focus)..."
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                onSearchChange(val);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const q = searchQuery.trim().toLowerCase();
                  if (q === 'terminal' || q === 'cli' || q === 'help' || q === 'clear') {
                    onOpenTerminal();
                  }
                }
              }}
              className="w-full pl-9 pr-12 py-2 min-h-[40px] bg-[#050811] border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-colors shadow-inner"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery ? (
                <button 
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search query"
                  className="p-1.5 min-w-[36px] min-h-[36px] inline-flex items-center justify-center text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 mr-1 text-[11px] font-mono text-slate-300 bg-slate-900 border border-slate-700 rounded">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Terminal Button Right Next to Search Bar */}
          <button
            id="header-search-terminal-btn"
            onClick={onOpenTerminal}
            className={`px-3.5 py-2 min-h-[40px] rounded-lg border font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0 select-none cursor-pointer ${
              isTerminalOpen
                ? 'bg-emerald-400 border-emerald-300 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                : 'bg-[#050811] hover:bg-emerald-950/80 border-slate-700 hover:border-emerald-500 text-emerald-300 hover:text-emerald-200 shadow-sm'
            }`}
            title="Open Interactive Hacker Terminal (Press 't')"
          >
            <Terminal className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Terminal</span>
          </button>

          {/* Mobile Navigation Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(prev => !prev)}
            className="p-2.5 min-w-[48px] min-h-[48px] rounded-lg bg-[#050811] hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 text-slate-200 hover:text-emerald-400 lg:hidden cursor-pointer transition-colors flex items-center justify-center"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileNavOpen}
          >
            {isMobileNavOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Primary Category Navigation Bar */}
      <nav id="site-navigation-menu" aria-label="Main Navigation" className="w-full bg-[#050811]/95 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 relative z-30 hidden lg:block">
        <div className="max-w-7xl lg:max-w-[1360px] mx-auto flex items-center justify-between gap-3 py-2 text-xs font-medium overflow-visible">
          <div className="flex items-center gap-3 flex-wrap">
            {/* 1. All Articles (Home) */}
            <a
              id="nav-all-articles"
              href="/"
              onClick={(e) => { e.preventDefault(); onSelectView('blog', '/'); onSelectCategory('All'); }}
              className={`px-3.5 py-2.5 min-h-[44px] rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer font-medium ${
                activeView === 'blog' && currentCategory === 'All'
                  ? 'bg-emerald-400 text-slate-950 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'text-slate-200 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>All Articles</span>
            </a>

            {/* 2. Cyber Security */}
            <a
              id="nav-cyber-security"
              href="/cybersecurity"
              onClick={(e) => { e.preventDefault(); onSelectView('blog', '/'); onSelectCategory('Cyber Security'); }}
              className={`px-3.5 py-2.5 min-h-[44px] rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer font-medium ${
                activeView === 'blog' && (currentCategory === 'Cyber Security' || currentCategory === 'Cybersecurity')
                  ? 'bg-red-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                  : 'text-slate-200 hover:text-red-300 hover:bg-slate-800/70'
              }`}
            >
              <ShieldAlert className={`w-4 h-4 ${activeView === 'blog' && (currentCategory === 'Cyber Security' || currentCategory === 'Cybersecurity') ? 'text-slate-950' : 'text-red-400'}`} />
              <span>Cyber Security</span>
            </a>

            {/* 3. Autonomous Systems & Tools Centralized Navigation Menu */}
            <div className="relative" ref={sovereignMenuRef}>
              <button
                id="nav-sovereign-ai-menu-btn"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectView('blog');
                  onSelectCategory('Autonomous Systems Hub');
                  setIsSovereignMenuOpen(prev => !prev);
                  setIsToolsMenuOpen(false);
                }}
                className={`px-3.5 py-2.5 min-h-[44px] rounded-md whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer font-medium select-none ${
                  (activeView === 'blog' && (currentCategory === 'Autonomous Systems Hub' || (currentCategory as string) === 'Autonomous Systems Hub')) || activeView === 'sovereign-hub' || activeView === 'sovereign-ai'
                    ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_14px_rgba(6,182,212,0.5)]'
                    : isSovereignMenuOpen
                      ? 'bg-cyan-950 text-cyan-200 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'text-cyan-200 hover:text-white hover:bg-cyan-950/70 border border-cyan-800/70 hover:border-cyan-500/60'
                }`}
                aria-expanded={isSovereignMenuOpen}
                title="Autonomous Tools, Sovereign Systems & Deep-Dive Guides"
              >
                <span className="text-base select-none leading-none mr-0.5" role="img" aria-label="Autonomous Tools">🤖</span>
                <span className="font-semibold">Autonomous Tools</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-700/60 hidden xl:inline-block tracking-wider">
                  HUB
                </span>
                <span className="p-0.5 rounded inline-flex items-center justify-center transition-colors">
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSovereignMenuOpen ? 'rotate-180 text-cyan-300' : 'text-slate-400'}`} />
                </span>
              </button>

              {/* Centralized Autonomous Tools Dropdown Menu */}
              {isSovereignMenuOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-[340px] max-w-[calc(100vw-1.5rem)] sm:w-[620px] bg-[#080d19]/95 border border-cyan-500/50 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.15)] z-50 p-4 space-y-3.5 animate-fadeIn backdrop-blur-2xl ring-1 ring-cyan-500/20"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-cyan-950/90 border border-cyan-500/40 flex items-center justify-center text-lg shadow-[0_0_12px_rgba(6,182,212,0.25)] select-none">
                        🤖
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                            Autonomous Systems &amp; Tools
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold tracking-wider">
                            9 BLUEPRINTS
                          </span>
                        </div>
                        <p className="text-[10px] text-cyan-300/80 font-sans mt-0.5">
                          Self-hosted private compute, air-gapped models &amp; defensive sandboxes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href="/sovereign-hub"
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectView('sovereign-hub', '/sovereign-hub');
                          setIsSovereignMenuOpen(false);
                        }}
                        className="text-xs font-mono text-cyan-300 hover:text-cyan-100 flex items-center gap-1 font-semibold cursor-pointer py-2 px-3 rounded-lg hover:bg-cyan-950/60 border border-cyan-800/50 transition-colors"
                      >
                        <span>Master Hub</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setIsSovereignMenuOpen(false)}
                        className="text-slate-400 hover:text-white p-2 inline-flex items-center justify-center rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                        title="Close menu"
                        aria-label="Close Autonomous Systems menu"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[390px] overflow-y-auto scrollbar-thin pr-1">
                    {SOVEREIGN_AI_PAGES.map((page) => {
                      const meta = SOVEREIGN_EMOJI_MAP[page.path] || { emoji: '🤖', badge: page.searchIntent, color: 'text-cyan-300', gradient: 'from-cyan-950 via-slate-900 to-slate-950 border-cyan-500/30' };
                      const isActive = activeView === page.viewKey;
                      return (
                        <a
                          key={page.path}
                          href={page.path}
                          onClick={(e) => {
                            e.preventDefault();
                            onSelectView(page.viewKey as ActiveSiteView, page.path);
                            setIsSovereignMenuOpen(false);
                          }}
                          className={`group p-2.5 min-h-[56px] rounded-xl border transition-all duration-150 flex items-start gap-2.5 cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-900 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50'
                              : 'bg-[#0b101c]/90 hover:bg-[#11192b] border-slate-800/80 hover:border-cyan-500/50 text-slate-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.5)]'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${meta.gradient} border flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 group-hover:border-cyan-400 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.35)] transition-all text-base select-none mt-0.5`}>
                            {meta.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-mono font-bold text-white group-hover:text-cyan-300 truncate">
                                {page.title}
                              </span>
                              <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border border-cyan-800/80 shrink-0 ${meta.color} bg-slate-950/80`}>
                                {meta.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-sans line-clamp-1 group-hover:text-slate-200 mt-0.5">
                              {page.tagline}
                            </p>
                            <div className="text-[10px] font-mono text-cyan-400/80 mt-1 flex items-center justify-between">
                              <span className="truncate">{page.path}</span>
                              <ArrowRight className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0 ml-1" />
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Security Tools Centralized Menu */}
            <div className="relative" ref={toolsMenuRef}>
              <button
                id="nav-tools-menu-btn"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectView('blog');
                  onSelectCategory('Security Tools');
                  setIsToolsMenuOpen(prev => !prev);
                  setIsSovereignMenuOpen(false);
                }}
                className={`px-3.5 py-2.5 min-h-[44px] rounded-md whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer font-medium select-none ${
                  (activeView === 'blog' && currentCategory === 'Security Tools') || activeView === 'tools'
                    ? 'bg-emerald-400 text-slate-950 font-bold shadow-[0_0_14px_rgba(16,185,129,0.5)]'
                    : isToolsMenuOpen
                      ? 'bg-emerald-950 text-emerald-200 border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'text-slate-200 hover:text-emerald-300 hover:bg-slate-800/70 border border-slate-700/60 hover:border-emerald-500/60'
                }`}
                aria-expanded={isToolsMenuOpen}
                title="Security Tools Articles & Interactive Suite"
              >
                <span className="text-base select-none leading-none mr-0.5" role="img" aria-label="Security Tools">🛠️</span>
                <span className="font-semibold">Security Tools</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 hidden xl:inline-block tracking-wider">
                  SUITE
                </span>
                <span className="p-0.5 rounded inline-flex items-center justify-center transition-colors">
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isToolsMenuOpen ? 'rotate-180 text-emerald-300' : 'text-slate-400'}`} />
                </span>
              </button>

              {/* Tools Dropdown */}
              {isToolsMenuOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-[340px] max-w-[calc(100vw-1.5rem)] sm:w-[620px] bg-[#080d19]/95 border border-emerald-500/50 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(16,185,129,0.15)] z-50 p-4 space-y-3.5 animate-fadeIn backdrop-blur-2xl ring-1 ring-emerald-500/20"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-950/90 border border-emerald-500/40 flex items-center justify-center text-lg shadow-[0_0_12px_rgba(16,185,129,0.25)] select-none">
                        🛠️
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                            Security Tools Suite
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold tracking-wider">
                            ZERO TELEMETRY
                          </span>
                        </div>
                        <p className="text-[10px] text-emerald-300/80 font-sans mt-0.5">
                          Browser-native cryptanalysis, network diagnostics &amp; header inspectors
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href="/tools"
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectView('tools', '/tools');
                          setIsToolsMenuOpen(false);
                        }}
                        className="text-xs font-mono text-emerald-300 hover:text-emerald-100 flex items-center gap-1 font-semibold cursor-pointer py-2 px-3 rounded-lg hover:bg-emerald-950/60 border border-emerald-800/50 transition-colors"
                      >
                        <span>Open Suite</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setIsToolsMenuOpen(false)}
                        className="text-slate-400 hover:text-white p-2 inline-flex items-center justify-center rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                        title="Close menu"
                        aria-label="Close Security Tools menu"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[390px] overflow-y-auto scrollbar-thin pr-1">
                    {CURATED_SECURITY_TOOLS.map((tool) => (
                      <a
                        key={tool.slug}
                        href={tool.path}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectView('tools', tool.path);
                          setIsToolsMenuOpen(false);
                        }}
                        className="group p-2.5 min-h-[56px] rounded-xl border transition-all duration-150 flex items-start gap-2.5 cursor-pointer bg-[#0b101c]/90 hover:bg-[#11192b] border-slate-800/80 hover:border-emerald-500/50 text-slate-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                      >
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${tool.gradient} border flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 group-hover:border-emerald-400 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.35)] transition-all text-base select-none mt-0.5`}>
                          {tool.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-mono font-bold text-white group-hover:text-emerald-300 truncate">
                              {tool.title}
                            </span>
                            <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border border-emerald-800/80 text-emerald-300 bg-emerald-950/80 shrink-0">
                              {tool.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-sans line-clamp-1 group-hover:text-slate-200 mt-0.5">
                            {tool.desc}
                          </p>
                          <div className="text-[10px] font-mono text-emerald-400/80 mt-1 flex items-center justify-between">
                            <span className="truncate">{tool.path}</span>
                            <ArrowRight className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0 ml-1" />
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 5. Interactive Cheat Sheets */}
            <a
              id="nav-interactive-cheatsheets"
              href="/cheatsheets"
              onClick={(e) => {
                e.preventDefault();
                onSelectView('cheatsheets', '/cheatsheets');
                setIsSovereignMenuOpen(false);
                setIsToolsMenuOpen(false);
              }}
              className={`px-3.5 py-2.5 min-h-[44px] rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer font-medium select-none ${
                activeView === 'cheatsheets'
                  ? 'bg-emerald-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'text-slate-200 hover:text-emerald-300 hover:bg-slate-800/70'
              }`}
              title="Interactive Ethical Hacking & Sysadmin Cheat Sheets"
            >
              <FileCode className={`w-4 h-4 ${activeView === 'cheatsheets' ? 'text-slate-950' : 'text-emerald-400'}`} />
              <span>Interactive Cheat Sheets</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer (Displays when isMobileNavOpen is true) */}
      {isMobileNavOpen && (
        <nav 
          aria-label="Mobile Navigation Menu"
          className="lg:hidden w-full bg-[#070b14] border-t border-slate-800 px-4 py-4 space-y-4 animate-fadeIn shadow-2xl max-h-[85vh] overflow-y-auto"
        >
          {/* Quick search inside mobile menu */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search research archives..."
              className="w-full bg-[#050811] border border-slate-700 rounded-lg pl-9 pr-12 py-2.5 min-h-[48px] text-xs font-mono text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                aria-label="Clear mobile search query"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2.5 min-w-[48px] min-h-[48px] inline-flex items-center justify-center text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono font-medium">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); onSelectView('blog', '/'); onSelectCategory('All'); setIsMobileNavOpen(false); }}
              className="p-3 min-h-[48px] rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500 text-left flex items-center gap-2 text-slate-100 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>All Articles</span>
            </a>
            <a
              href="/cybersecurity"
              onClick={(e) => { e.preventDefault(); onSelectView('blog', '/'); onSelectCategory('Cyber Security'); setIsMobileNavOpen(false); }}
              className="p-3 min-h-[48px] rounded-lg bg-slate-900 border border-slate-800 hover:border-red-500 text-left flex items-center gap-2 text-slate-100 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>Cyber Security</span>
            </a>
            <a
              href="/sovereign-hub"
              onClick={(e) => { e.preventDefault(); onSelectView('blog', '/'); onSelectCategory('Autonomous Systems Hub'); setIsMobileNavOpen(false); }}
              className="p-3 min-h-[48px] rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500 text-left flex items-center gap-2 text-cyan-200 cursor-pointer"
            >
              <span className="text-base select-none leading-none" role="img" aria-label="Autonomous Tools">🤖</span>
              <span>Autonomous Tools</span>
            </a>
            <a
              href="/tools"
              onClick={(e) => { e.preventDefault(); onSelectView('blog', '/'); onSelectCategory('Security Tools'); setIsMobileNavOpen(false); }}
              className="p-3 min-h-[48px] rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500 text-left flex items-center gap-2 text-emerald-300 cursor-pointer"
            >
              <span className="text-base select-none leading-none" role="img" aria-label="Security Tools">🛠️</span>
              <span>Security Tools</span>
            </a>
            <a
              href="/cheatsheets"
              onClick={(e) => { e.preventDefault(); onSelectView('cheatsheets', '/cheatsheets'); setIsMobileNavOpen(false); }}
              className="p-3 min-h-[48px] rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500 text-left flex items-center gap-2 text-slate-100 cursor-pointer col-span-2"
            >
              <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Interactive Cheat Sheets</span>
            </a>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3 text-xs font-mono">
            <button
              onClick={() => { onOpenTerminal(); setIsMobileNavOpen(false); }}
              className="px-4 py-2.5 min-h-[48px] rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 flex items-center gap-1.5"
            >
              <Terminal className="w-4 h-4" />
              <span>Web Terminal</span>
            </button>
            <button
              onClick={() => { onOpenBookmarks(); setIsMobileNavOpen(false); }}
              className="px-4 py-2.5 min-h-[48px] rounded-lg bg-slate-900 border border-slate-700 text-amber-300 flex items-center gap-1.5"
            >
              <Bookmark className="w-4 h-4" />
              <span>Bookmarks ({bookmarksCount})</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};
