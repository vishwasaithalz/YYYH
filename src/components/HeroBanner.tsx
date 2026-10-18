import React from 'react';
import { Shield, Cpu, Terminal, BookOpen, Compass, ArrowRight, ArrowDown, Lock, Server } from 'lucide-react';

interface HeroBannerProps {
  onExploreArticles?: () => void;
  onSelectCategory?: (category: any) => void;
  onNavigatePillar?: (view: any) => void;
  onOpenTools?: () => void;
  onOpenRoadmap?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  onExploreArticles, 
  onSelectCategory,
  onNavigatePillar,
  onOpenTools,
  onOpenRoadmap
}) => {
  return (
    <section 
      id="site-hero-banner" 
      aria-labelledby="hero-title"
      itemScope
      itemType="https://schema.org/WebSite"
      className="rounded-xl bg-gradient-to-b from-[#0a0f1d] via-[#070c18] to-[#060913] border border-slate-800 p-5 sm:p-6 lg:p-7 mb-6 relative shadow-lg overflow-hidden"
    >
      <span itemProp="name" className="sr-only">YinYangYoHackers</span>
      <link itemProp="url" href="https://yinyangyohackers.com" />

      <div className="max-w-5xl space-y-4 relative z-10">
        {/* Established Badge */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-medium">
            <span>☯</span>
            <span>FOUNDED IN 2013 &bull; INDEPENDENT CYBERSECURITY LAB</span>
          </div>
          <span className="text-xs font-mono text-slate-300 hidden sm:inline">&bull; Open-Source &bull; Autonomous Research</span>
        </div>

        {/* Primary SEO-Focused H1 */}
        <h1 
          id="hero-title" 
          itemProp="headline" 
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug font-mono"
        >
          YinYangYoHackers &mdash; Technical Cybersecurity &amp; Adversarial Research Laboratory
        </h1>
        
        {/* Core Value Proposition */}
        <p 
          itemProp="description" 
          className="text-base sm:text-lg text-slate-200 font-sans leading-relaxed max-w-4xl"
        >
          Founded in 2013 by <strong className="text-white font-semibold" itemProp="author">Vishwas Aithal</strong>, YinYangYoHackers provides battle-tested penetration testing guides, zero-trust infrastructure hardening blueprints, cryptographic defense protocols, and open-source security toolchains for engineers and security practitioners worldwide.
        </p>

        {/* YMYL Compliance & Ethical Research Disclosure */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-900/60 flex items-start gap-2.5 text-xs font-mono text-slate-300 max-w-4xl">
          <span className="text-amber-400 font-bold shrink-0">🛡️ YMYL DISCLAIMER:</span>
          <span>
            Strictly for authorized educational research, defensive infrastructure audits, and lab testing. All operations require prior written consent from target owners.
          </span>
        </div>

        {/* Primary Action CTAs - Grouped with equal spacing, clean organization, and WCAG touch targets */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-3.5 pt-1">
          <a
            href="#articles-directory-section"
            onClick={(e) => {
              if (onExploreArticles) {
                e.preventDefault();
                onExploreArticles();
              }
            }}
            className="px-4 py-2.5 min-h-[44px] rounded-lg bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 text-slate-950 font-bold font-mono text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Research Articles</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </a>

          <a
            href="/cybersecurity"
            onClick={(e) => {
              if (onSelectCategory) {
                e.preventDefault();
                onSelectCategory('Cyber Security');
              }
            }}
            className="px-4 py-2.5 min-h-[44px] rounded-lg bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-200 hover:text-white font-bold font-mono text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Cyber Security Hub</span>
          </a>

          <a
            href="/tools"
            onClick={(e) => {
              if (onOpenTools) {
                e.preventDefault();
                onOpenTools();
              }
            }}
            className="px-4 py-2.5 min-h-[44px] rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 hover:text-white font-bold font-mono text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Security Tools</span>
          </a>

          <a
            href="/roadmap"
            onClick={(e) => {
              if (onOpenRoadmap) {
                e.preventDefault();
                onOpenRoadmap();
              }
            }}
            className="px-4 py-2.5 min-h-[44px] rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-emerald-300 font-bold font-mono text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Editorial Road Map</span>
          </a>
        </div>

        {/* Informational Topic Highlights */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm font-mono text-slate-300">
            <span className="text-slate-100 font-semibold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Specializations:
            </span>
            <span>Zero-Trust Infrastructure</span>
            <span>&bull;</span>
            <span>Active Directory Auditing</span>
            <span>&bull;</span>
            <span>Adversarial Red Teaming</span>
            <span>&bull;</span>
            <span>Linux Kernel Hardening</span>
            <span>&bull;</span>
            <span>Cryptographic Toolchains</span>
          </div>
        </div>
      </div>
    </section>
  );
};
