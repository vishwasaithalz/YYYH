import React, { useState } from 'react';
import { 
  Terminal, 
  AlertTriangle, 
  Home, 
  Wrench, 
  ShieldCheck, 
  Search, 
  RotateCcw,
  ExternalLink,
  ChevronRight,
  WifiOff
} from 'lucide-react';
import { Article, ActiveSiteView } from '../types';

interface NotFoundViewProps {
  onNavigateHome: () => void;
  onNavigateView: (view: ActiveSiteView) => void;
  onSelectArticle: (article: Article) => void;
  suggestedArticles: Article[];
  missingPath?: string;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  onNavigateHome,
  onNavigateView,
  onSelectArticle,
  suggestedArticles,
  missingPath
}) => {
  const [query, setQuery] = useState('');
  const [terminalPingResult, setTerminalPingResult] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  const displayTarget = missingPath || (typeof window !== 'undefined' ? (window.location.pathname !== '/' ? window.location.pathname : window.location.hash) || '/unknown-packet' : '/unknown-packet');

  const runDiagnosticPing = () => {
    setIsPinging(true);
    setTerminalPingResult(null);
    setTimeout(() => {
      setTerminalPingResult(
        `[DIAGNOSTIC TRACEROUTE COMPLETE]\n` +
        `Target: ${displayTarget}\n` +
        `Hop 1: 192.168.1.1 (Gateway) [0.42ms]\n` +
        `Hop 2: 10.240.0.1 (ISP BGP Border) [4.11ms]\n` +
        `Hop 3: 172.16.88.14 (Zero-Trust Bastion) [12.05ms]\n` +
        `Hop 4: 0xDEADBEEF -> HOST UNREACHABLE (HTTP 404: RESOURCE_DEFUNCT)\n` +
        `Recommendation: Flush DNS cache or route to base perimeter.`
      );
      setIsPinging(false);
    }, 600);
  };

  const filteredSuggestions = query.trim()
    ? suggestedArticles.filter(a => 
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.tags.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
        a.summary.toLowerCase().includes(query.toLowerCase())
      )
    : suggestedArticles.slice(0, 3);

  return (
    <article id="hacker-404-error-view" className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Glitch CRT Masthead Banner */}
      <div className="relative rounded-2xl bg-[#060911] border border-red-500/40 p-6 sm:p-10 shadow-sm">
        {/* Scanline Background Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-950/80 text-red-400 border border-red-800/60">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>HTTP 404 // MEMORY_SEGMENT_FAULT</span>
            </div>
            <span className="text-xs font-mono text-slate-500">
              ERR_CODE: 0x404_PACKET_DROPPED
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 tracking-tight">
              404: NODE UNROUTABLE
            </h1>
            <p className="text-slate-300 text-sm sm:text-base font-mono max-w-2xl">
              The targeted route <code className="px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-900/60 font-bold">{displayTarget}</code> does not exist on the YinYangYoHackers perimeter mesh or has been purged during counter-reconnaissance.
            </p>
          </div>

          {/* Interactive Diagnostic Terminal */}
          <div className="mt-6 rounded-xl bg-black/80 border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-3">
            <div className="flex items-center justify-between text-slate-500 border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-red-400" />
                <h2 className="text-xs font-mono font-bold text-slate-300">diagnostic_traceroute.sh</h2>
              </div>
              <button
                onClick={runDiagnosticPing}
                disabled={isPinging}
                className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <RotateCcw className={`w-3 h-3 ${isPinging ? 'animate-spin' : ''}`} />
                <span>{isPinging ? 'Tracing...' : 'Run Diagnostics'}</span>
              </button>
            </div>

            {terminalPingResult ? (
              <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed text-[11px] font-mono text-emerald-400/90 animate-in fade-in">
                {terminalPingResult}
              </pre>
            ) : (
              <div className="text-slate-500 text-[11px] flex items-center gap-2">
                <span className="text-red-400">&gt;</span>
                <span>Subsystem offline for targeted node. Click "Run Diagnostics" to trace packet hops.</span>
              </div>
            )}
          </div>

          {/* Core Navigation Recovery Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Return to Base Terminal</span>
            </button>

            <button
              onClick={() => onNavigateView('tools')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-medium transition-colors cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>Cyber Tools Suite</span>
            </button>

            <button
              onClick={() => onNavigateView('clusters')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-medium transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Topic Clusters Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Helpful Information, Troubleshooting & Direct Site Directory Links */}
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Helpful Links, Troubleshooting &amp; Quick Navigation Directory</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
            Why did this happen? The URL may have been mistyped, the research dossier was consolidated into an updated blueprint, or an external link is outdated. Use the verified directory below to jump directly to our core sections:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          {/* Column 1: Core Research Hubs */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2.5">
            <h3 className="text-sm font-bold text-emerald-400">Core Research Pillars</h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="/" onClick={(e) => { e.preventDefault(); onNavigateHome(); }} className="hover:text-emerald-400 flex items-center justify-between py-0.5">
                  <span>Home &amp; All Research Articles</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                </a>
              </li>
              <li>
                <a href="/cybersecurity" onClick={(e) => { e.preventDefault(); onNavigateView('cybersecurity'); }} className="hover:text-emerald-400 flex items-center justify-between py-0.5">
                  <span>Cyber Security &amp; Zero-Trust</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                </a>
              </li>
              <li>
                <a href="/ethical-hacking" onClick={(e) => { e.preventDefault(); onNavigateView('ethical-hacking'); }} className="hover:text-emerald-400 flex items-center justify-between py-0.5">
                  <span>Ethical Hacking &amp; Red Teaming</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                </a>
              </li>
              <li>
                <a href="/penetration-testing" onClick={(e) => { e.preventDefault(); onNavigateView('penetration-testing'); }} className="hover:text-emerald-400 flex items-center justify-between py-0.5">
                  <span>Penetration Testing Blueprints</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                </a>
              </li>
              <li>
                <a href="/sovereign-hub" onClick={(e) => { e.preventDefault(); onNavigateView('sovereign-hub'); }} className="hover:text-cyan-400 flex items-center justify-between py-0.5">
                  <span>Autonomous Systems Master Hub</span>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Interactive Security Tools & Labs */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2.5">
            <h3 className="text-sm font-bold text-cyan-400">Interactive Security Tools</h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="/tools" onClick={(e) => { e.preventDefault(); onNavigateView('tools'); }} className="hover:text-cyan-400 flex items-center justify-between py-0.5">
                  <span>Browser Security Tools Suite</span>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" />
                </a>
              </li>
              <li>
                <a href="/cheatsheets" onClick={(e) => { e.preventDefault(); onNavigateView('cheatsheets'); }} className="hover:text-cyan-400 flex items-center justify-between py-0.5">
                  <span>Interactive CLI Cheatsheets</span>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" />
                </a>
              </li>
              <li>
                <a href="/ctf" onClick={(e) => { e.preventDefault(); onNavigateView('ctf'); }} className="hover:text-cyan-400 flex items-center justify-between py-0.5">
                  <span>Capture The Flag (CTF) Arena</span>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" />
                </a>
              </li>
              <li>
                <a href="/clusters" onClick={(e) => { e.preventDefault(); onNavigateView('clusters'); }} className="hover:text-cyan-400 flex items-center justify-between py-0.5">
                  <span>Semantic Topic Clusters Map</span>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Site Index, Support & Feeds */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2.5">
            <h3 className="text-sm font-bold text-amber-400">Support, Index &amp; Feeds</h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="/about" onClick={(e) => { e.preventDefault(); onNavigateView('about'); }} className="hover:text-amber-400 flex items-center justify-between py-0.5">
                  <span>About YinYangYoHackers Lab</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                </a>
              </li>
              <li>
                <a href="/roadmap" onClick={(e) => { e.preventDefault(); onNavigateView('roadmap'); }} className="hover:text-amber-400 flex items-center justify-between py-0.5">
                  <span>2026 Research Content Roadmap</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                </a>
              </li>
              <li>
                <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigateView('contact'); }} className="hover:text-amber-400 flex items-center justify-between py-0.5">
                  <span>Report Broken Link / Contact</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                </a>
              </li>
              <li>
                <a href="/sitemap.xml" className="hover:text-amber-400 flex items-center justify-between py-0.5">
                  <span>Complete XML Sitemap</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                </a>
              </li>
              <li>
                <a href="/rss.xml" className="hover:text-amber-400 flex items-center justify-between py-0.5">
                  <span>RSS 2.0 Syndication Feed</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Search and Recovery Suggestion Grid */}
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              <span>Active Cybersecurity, Ethical Hacking &amp; Systems Archives</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Locate active penetration testing tutorials, sysadmin blueprints, local model setups, and security tools.
            </p>
          </div>

          {/* In-page recovery search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Wireshark, Ollama, Nmap..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Suggested Articles */}
        <div className="space-y-3">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            {query.trim() ? `Search Results (${filteredSuggestions.length})` : 'Recommended Blueprints & Research'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredSuggestions.map((art) => {
              const baseSrc = art.coverImage?.src || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=480&h=270&auto=format&fit=crop&q=80';
              const cleanSrc = baseSrc.includes('images.unsplash.com')
                ? baseSrc.replace(/w=\d+/, 'w=480').replace(/&h=\d+/, '') + '&h=270'
                : baseSrc;
              const avifSrc = cleanSrc.includes('images.unsplash.com') ? `${cleanSrc}&fm=avif` : cleanSrc;
              const webpSrc = cleanSrc.includes('images.unsplash.com') ? `${cleanSrc}&fm=webp` : cleanSrc;

              return (
                <a
                  key={art.id}
                  href={`/${art.slug}`}
                  aria-label={`Read recommended article: ${art.title}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectArticle(art);
                  }}
                  className="group p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Properly sized, un-distorted 16:9 thumbnail */}
                    <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-black/50 border border-slate-800 mb-3 relative">
                      <picture>
                        <source type="image/avif" srcSet={avifSrc} />
                        <source type="image/webp" srcSet={webpSrc} />
                        <img
                          src={webpSrc}
                          alt={art.coverImage?.alt || art.title}
                          width={480}
                          height={270}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/cyber_defense_matrix.webp'; }}
                          className="w-full h-full object-cover object-center aspect-[16/9] group-hover:scale-105 transition-transform duration-300"
                        />
                      </picture>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 mb-2">
                      <span>{art.category}</span>
                      <span>{art.readTime}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 mb-2 font-sans">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 font-sans">
                      {art.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 group-hover:text-emerald-400 mt-3 pt-2 border-t border-slate-800/80">
                    <span className="truncate mr-1 font-medium text-slate-400 group-hover:text-emerald-300">
                      Explore {art.category} analysis
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform text-emerald-400" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
};
