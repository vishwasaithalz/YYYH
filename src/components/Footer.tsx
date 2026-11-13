import React from 'react';
import { 
  ArrowUp,
  ShieldCheck,
  Scale,
  Mail,
  Terminal,
  BookOpen,
  Keyboard,
  Cpu,
  Lock,
  Server,
  Package,
  Send,
  Globe,
  Compass,
  Laptop
} from 'lucide-react';
import { ActiveSiteView, PrimaryCategory } from '../types';

interface FooterProps {
  onSelectView: (view: ActiveSiteView, path?: string) => void;
  onSelectCategory?: (category: PrimaryCategory | 'All') => void;
  onOpenTerminal?: () => void;
  onOpenRss?: () => void;
  onOpenShortcuts?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectView,
  onSelectCategory,
  onOpenTerminal,
  onOpenRss,
  onOpenShortcuts
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="site-footer" itemScope itemType="https://schema.org/WPFooter" className="w-full bg-[#050811] border-t border-slate-800 text-slate-300 mt-12">
      <div className="max-w-7xl lg:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Brand, Founder & Channels */}
          <div className="space-y-3.5">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onSelectView('blog', '/');
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center border border-emerald-500/40 text-emerald-400 font-bold font-mono">
                ☯
              </div>
              <span className="text-xl font-bold text-white font-mono" itemProp="name">
                YinYangYo<span className="text-emerald-400">Hackers</span>
              </span>
            </a>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Founded in 2013. Dedicated to independent cybersecurity research, ethical hacking education, zero trust infrastructure, and sovereign autonomous computing systems.
            </p>

            {/* Verified Channels */}
            <div className="pt-2">
              <span className="text-xs font-mono text-slate-300 block mb-2.5 font-semibold">VERIFIED CHANNELS</span>
              <div className="flex items-center flex-wrap gap-3">
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectView('contact', '/contact');
                  }}
                  className="w-11 h-11 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/60 hover:bg-cyan-950/40 text-slate-200 hover:text-cyan-300 transition-colors flex items-center justify-center cursor-pointer"
                  title="Secure Lab Dispatch"
                  aria-label="Secure Lab Dispatch"
                >
                  <Mail className="w-4 h-4 text-cyan-400" />
                </a>
                <a
                  href="/disclaimer"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectView('disclaimer', '/disclaimer');
                  }}
                  className="w-11 h-11 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500/60 hover:bg-emerald-950/40 text-slate-200 hover:text-emerald-300 transition-colors flex items-center justify-center cursor-pointer"
                  title="PGP Key &amp; Responsible Disclosure"
                  aria-label="PGP Key and Disclosure"
                >
                  <Lock className="w-4 h-4 text-emerald-400" />
                </a>
                <a
                  href="/rss.xml"
                  onClick={(e) => {
                    if (onOpenRss) {
                      e.preventDefault();
                      onOpenRss();
                    }
                  }}
                  className="w-11 h-11 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500/60 hover:bg-amber-950/40 text-slate-200 hover:text-amber-300 transition-colors flex items-center justify-center cursor-pointer"
                  title="RSS 2.0 Advisory Feed"
                  aria-label="RSS Feed"
                >
                  <Globe className="w-4 h-4 text-amber-400" />
                </a>
                {onOpenTerminal && (
                  <button
                    type="button"
                    onClick={onOpenTerminal}
                    className="w-11 h-11 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500/60 hover:bg-emerald-950/40 text-slate-200 hover:text-emerald-300 transition-colors flex items-center justify-center cursor-pointer"
                    title="Interactive Web Terminal"
                    aria-label="Terminal"
                  >
                    <Terminal className="w-4 h-4 text-emerald-400" />
                  </button>
                )}
              </div>

              <div className="mt-3 pt-2">
                <button
                  id="footer-privacy-permissions-trigger"
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('open-privacy-consent'));
                  }}
                  className="inline-flex items-center gap-1.5 py-2 min-h-[44px] text-xs font-mono text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Privacy &amp; Storage Preferences</span>
                </button>
              </div>
            </div>
          </div>

          {/* Col 2: Editorial Pillars */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Editorial Pillars</span>
            </h3>
            <ul className="space-y-1 text-xs font-sans text-slate-200">
              <li>
                <a 
                  href="/ethical-hacking"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectView('ethical-hacking', '/ethical-hacking');
                  }}
                  className="hover:text-red-300 transition-colors text-left flex items-center gap-2 py-1.5 min-h-[44px] cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Ethical Hacking &amp; Red Teaming</span>
                </a>
              </li>
              <li>
                <a 
                  href="/penetration-testing"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectView('penetration-testing', '/penetration-testing');
                  }}
                  className="hover:text-red-300 transition-colors text-left flex items-center gap-2 py-1.5 min-h-[44px] cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Penetration Testing Methodology</span>
                </a>
              </li>
              <li>
                <a 
                  href="/cybersecurity"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectView('cybersecurity', '/cybersecurity');
                  }}
                  className="hover:text-emerald-300 transition-colors text-left flex items-center gap-2 py-1.5 min-h-[44px] cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Cybersecurity &amp; Zero Trust Defense</span>
                </a>
              </li>
              <li>
                <a 
                  href="/security-research"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectView('security-research', '/security-research');
                  }}
                  className="hover:text-emerald-300 transition-colors text-left flex items-center gap-2 py-1.5 min-h-[44px] cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Security Research &amp; Advisories</span>
                </a>
              </li>
              <li>
                <a 
                  href="/services"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectView('services', '/services');
                  }}
                  className="hover:text-emerald-300 transition-colors text-left flex items-center gap-2 py-1.5 min-h-[44px] cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Technical Advisory &amp; Scope</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Research, Hubs & Tools */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Research &amp; Tools</span>
            </h3>
            <ul className="space-y-1 text-xs font-sans text-slate-200">
              <li>
                <a 
                  href="/roadmap"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectView('roadmap', '/roadmap');
                  }}
                  className="hover:text-emerald-300 transition-colors text-left flex items-center gap-2 py-1.5 min-h-[44px] cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Editorial Content Roadmap &amp; Blueprint Matrix</span>
                </a>
              </li>
              <li>
                <a 
                  href="/clusters"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectView('clusters', '/clusters');
                  }}
                  className="hover:text-cyan-300 transition-colors text-left flex items-center gap-2 py-1.5 min-h-[44px] cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Topic Clusters &amp; Knowledge Map</span>
                </a>
              </li>
              <li>
                <a 
                  href="/tools"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectView('tools', '/tools');
                  }}
                  className="hover:text-cyan-300 transition-colors text-left flex items-center gap-2 py-1.5 min-h-[44px] cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Client-Side Security Suite</span>
                </a>
              </li>
              <li>
                <a 
                  href="/ctf"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectView('ctf', '/ctf');
                  }}
                  className="hover:text-amber-300 transition-colors text-left flex items-center gap-2 py-1.5 min-h-[44px] cursor-pointer"
                >
                  <Keyboard className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Interactive CTF Challenge Arena</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Legal Directives */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-red-400" />
              <span>Legal &amp; Trust</span>
            </h3>
            <ul className="space-y-1 text-xs font-sans text-slate-200">
              <li>
                <a 
                  href="/privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectView('privacy', '/privacy');
                  }}
                  className="hover:text-emerald-300 transition-colors text-left flex items-center gap-2 py-1.5 min-h-[44px] cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Privacy Policy (GDPR / CCPA)</span>
                </a>
              </li>
              <li>
                <a 
                  href="/terms"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectView('terms', '/terms');
                  }}
                  className="hover:text-amber-300 transition-colors text-left flex items-center gap-2 py-1.5 min-h-[44px] cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Terms of Use &amp; Acceptable Use</span>
                </a>
              </li>
              <li>
                <a 
                  href="/disclaimer"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectView('disclaimer', '/disclaimer');
                  }}
                  className="hover:text-red-300 transition-colors text-left flex items-center gap-2 py-1.5 min-h-[44px] cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Responsible Disclosure &amp; PGP</span>
                </a>
              </li>
              <li>
                <a 
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectView('about', '/about');
                  }}
                  className="hover:text-white transition-colors text-left flex items-center gap-2 py-1.5 min-h-[44px] cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span>About Us &amp; Research Mission</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-300">
          <p>© 2013 to 2026 YinYangYoHackers. Independent Cybersecurity Research Laboratory. Educational and Authorized Defensive Use Only.</p>

          <div className="flex items-center flex-wrap gap-3">
            <a
              href="/privacy"
              onClick={(e) => { e.preventDefault(); onSelectView('privacy', '/privacy'); }}
              className="hover:text-white transition-colors py-2 px-2 min-h-[44px] inline-flex items-center cursor-pointer"
            >
              Privacy
            </a>
            <span>•</span>
            <a
              href="/terms"
              onClick={(e) => { e.preventDefault(); onSelectView('terms', '/terms'); }}
              className="hover:text-white transition-colors py-2 px-2 min-h-[44px] inline-flex items-center cursor-pointer"
            >
              Terms
            </a>
            <span>•</span>
            <a
              href="/disclaimer"
              onClick={(e) => { e.preventDefault(); onSelectView('disclaimer', '/disclaimer'); }}
              className="hover:text-white transition-colors py-2 px-2 min-h-[44px] inline-flex items-center cursor-pointer"
            >
              Disclosure
            </a>
            <span>•</span>
            <a
              href="/sitemap.xml"
              className="hover:text-emerald-300 transition-colors py-2 px-2 min-h-[44px] inline-flex items-center cursor-pointer"
            >
              XML Sitemap
            </a>
            <span>•</span>
            <button 
              onClick={scrollToTop}
              className="hover:text-emerald-300 transition-colors flex items-center gap-1 ml-2 text-slate-200 min-h-[44px] py-2 px-2.5 cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
