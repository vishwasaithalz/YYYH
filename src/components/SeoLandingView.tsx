import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Activity, 
  Flame, 
  Crosshair, 
  Key, 
  Globe, 
  FileCode, 
  Code, 
  Cloud, 
  Server, 
  Award, 
  BrainCircuit, 
  Database, 
  Lock, 
  ShieldAlert, 
  Cpu, 
  HardDrive, 
  Gauge, 
  Code2, 
  Search, 
  Microchip, 
  FileCheck, 
  Boxes,
  Copy, 
  Check, 
  ChevronDown, 
  ChevronRight, 
  ArrowRight, 
  BookOpen, 
  Compass, 
  Sparkles,
  ExternalLink,
  Shield,
  Calendar,
  Clock,
  UserCheck
} from 'lucide-react';
import { SEO_LANDING_PAGES, SeoLandingPageData } from '../data/seoLandingPagesData';
import { Article, ActiveSiteView } from '../types';
import { allArticles } from '../data/articlesData';

interface SeoLandingViewProps {
  pageData?: SeoLandingPageData;
  viewKey?: string;
  onNavigate: (view: ActiveSiteView, path?: string) => void;
  onSelectArticle: (article: Article) => void;
}

// Icon mapping helper
const renderIcon = (iconName: string, className = "w-5 h-5") => {
  switch (iconName) {
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'Terminal': return <Terminal className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'Flame': return <Flame className={className} />;
    case 'Crosshair': return <Crosshair className={className} />;
    case 'Key': return <Key className={className} />;
    case 'Globe': return <Globe className={className} />;
    case 'FileCode': return <FileCode className={className} />;
    case 'Code': return <Code className={className} />;
    case 'Cloud': return <Cloud className={className} />;
    case 'Server': return <Server className={className} />;
    case 'Award': return <Award className={className} />;
    case 'BrainCircuit': return <BrainCircuit className={className} />;
    case 'Database': return <Database className={className} />;
    case 'Lock': return <Lock className={className} />;
    case 'ShieldAlert': return <ShieldAlert className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    case 'HardDrive': return <HardDrive className={className} />;
    case 'Gauge': return <Gauge className={className} />;
    case 'Code2': return <Code2 className={className} />;
    case 'Search': return <Search className={className} />;
    case 'Microchip': return <Microchip className={className} />;
    case 'FileCheck': return <FileCheck className={className} />;
    case 'Boxes': return <Boxes className={className} />;
    default: return <Shield className={className} />;
  }
};

export const SeoLandingView: React.FC<SeoLandingViewProps> = ({
  pageData: propPageData,
  viewKey,
  onNavigate,
  onSelectArticle
}) => {
  const pageData = propPageData || (viewKey ? SEO_LANDING_PAGES[viewKey] : undefined) || SEO_LANDING_PAGES['cybersecurity'];
  const [copiedCli, setCopiedCli] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [activeMethodologyTab, setActiveMethodologyTab] = useState<number>(0);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pageData.cliVerification.code);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const toggleFaq = (index: number) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  // Find curated articles
  const relatedArticles = pageData.relatedArticleSlugs
    .map(slug => allArticles.find(a => a.slug === slug || a.id === slug))
    .filter((a): a is Article => Boolean(a));

  const pillarColorClass = pageData.pillar.includes('Yin') 
    ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40'
    : pageData.pillar.includes('Yang')
    ? 'text-rose-400 border-rose-500/40 bg-rose-950/40'
    : pageData.pillar.includes('Yo')
    ? 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40'
    : 'text-amber-400 border-amber-500/40 bg-amber-950/40';

  return (
    <article 
      className="max-w-7xl lg:max-w-[1360px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12 animate-fadeIn"
      itemScope 
      itemType="https://schema.org/WebPage"
    >
      {/* Breadcrumb Navigation with Microdata & Crawlable Anchors */}
      <nav 
        id="seo-breadcrumb-nav"
        aria-label="Breadcrumbs"
        className="flex items-center gap-2 text-xs font-mono text-slate-400 overflow-x-auto pb-1"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <span 
          itemProp="itemListElement" 
          itemScope 
          itemType="https://schema.org/ListItem"
        >
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); onNavigate('blog', '/'); }}
            itemProp="item"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1 min-h-[48px] sm:min-h-0 py-2 sm:py-0"
          >
            <span itemProp="name">Home</span>
          </a>
          <span itemProp="position" className="hidden">1</span>
        </span>

        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

        <span 
          itemProp="itemListElement" 
          itemScope 
          itemType="https://schema.org/ListItem"
        >
          {pageData.pillar.includes('Yo') ? (
            <a
              href="/sovereign-hub"
              onClick={(e) => { e.preventDefault(); onNavigate('sovereign-hub', '/sovereign-hub'); }}
              itemProp="item"
              className="hover:text-cyan-400 text-cyan-300 font-semibold transition-colors flex items-center gap-1 min-h-[48px] sm:min-h-0 py-2 sm:py-0 cursor-pointer"
            >
              <span itemProp="name">Autonomous Systems Hub</span>
            </a>
          ) : (
            <span className="text-slate-500">
              {pageData.searchIntent.includes('Service') || pageData.searchIntent.includes('Compliance') ? 'Services' : 'Research'}
            </span>
          )}
          <span itemProp="position" className="hidden">2</span>
        </span>

        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

        <span 
          itemProp="itemListElement" 
          itemScope 
          itemType="https://schema.org/ListItem"
          className="text-emerald-400 font-semibold truncate"
        >
          <a 
            href={pageData.path}
            onClick={(e) => e.preventDefault()}
            itemProp="item"
            className="text-emerald-400 cursor-default"
          >
            <span itemProp="name">{pageData.primaryKeyword}</span>
          </a>
          <span itemProp="position" className="hidden">3</span>
        </span>
      </nav>

      {/* Hero Section */}
      <header className="space-y-5 bg-[#090d16] border border-slate-800/80 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Primary Pillar Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border uppercase tracking-wider ${pillarColorClass}`}>
            {pageData.pillar}
          </span>

          {/* Dominant Search Intent Badge */}
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-800/90 text-slate-300 border border-slate-700 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-200">Search Intent:</span>
            <span>{pageData.searchIntent}</span>
          </span>

          {/* Target Keyword Badge */}
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
            Keyword: <strong className="underline decoration-emerald-500">{pageData.primaryKeyword}</strong>
          </span>
        </div>

        {/* Exactly One H1 with Primary Keyword */}
        <h1 
          itemProp="headline" 
          className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white font-mono tracking-tight leading-tight"
        >
          {pageData.h1}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-4xl">
          {pageData.subtitle}
        </p>

        {/* Search Intent Rationale Box */}
        <div className="bg-[#050811] border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-emerald-400 font-bold block mb-0.5">Dominant Search Purpose:</span>
            {pageData.intentDescription}
          </div>
        </div>

        {/* CTA Actions */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <a
            href="/contact"
            onClick={(e) => { e.preventDefault(); onNavigate('contact', '/contact'); }}
            className="min-h-[48px] px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2"
          >
            <span>Explore Learning Resources</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#technical-specifications"
            className="min-h-[48px] px-5 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-mono text-sm transition-all flex items-center gap-2"
          >
            <span>View Architecture Matrix</span>
            <ChevronDown className="w-4 h-4" />
          </a>
        </div>
      </header>

      <aside className="rounded-xl border border-amber-700/50 bg-amber-950/20 p-4 text-sm text-amber-100" role="note" aria-label="Educational scope notice">
        <strong className="block mb-1">Educational project notice</strong>
        YinYangYoHackers is an independent learning and publishing project. Material on this page is educational guidance and illustrative examples, not a claim of client engagements, completed security audits, professional certifications, or a security consulting service. Test only systems you own or are explicitly authorised to assess. Verify commands and configuration changes in a disposable lab before use.
      </aside>

      {/* Comprehensive Architectural Overview */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-mono flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <span>Strategic Framework &amp; Tactical Foundations</span>
        </h2>
        
        <div className="bg-[#090d16] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
          {pageData.overview.map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Core Deliverables Matrix */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Boxes className="w-6 h-6 text-cyan-400" />
            <span>Learning Topics & Practical Resources</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Engineered for {pageData.primaryKeyword}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pageData.keyDeliverables.map((del, idx) => (
            <div 
              key={idx}
              className="bg-[#090d16] border border-slate-800/80 hover:border-emerald-500/50 rounded-2xl p-5 sm:p-6 transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-900/60 text-emerald-400 group-hover:text-emerald-300 group-hover:scale-105 transition-all">
                  {renderIcon(del.icon, "w-5 h-5")}
                </div>
                {del.metric && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                    {del.metric}
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white font-mono group-hover:text-emerald-400 transition-colors">
                {del.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                {del.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Step-by-Step Methodology Timeline */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-mono flex items-center gap-2">
          <Terminal className="w-6 h-6 text-emerald-400" />
          <span>Engagement Methodology &amp; Execution Pipeline</span>
        </h2>

        {/* Phase selector tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {pageData.methodologySteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveMethodologyTab(idx)}
              className={`min-h-[48px] px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                activeMethodologyTab === idx
                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-[#090d16] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{step.phase}</span>
              <span className="opacity-80">({step.name.split(' ')[0]})</span>
            </button>
          ))}
        </div>

        {/* Active Phase Details Card */}
        <div className="bg-[#090d16] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-mono text-xs font-bold">
              {pageData.methodologySteps[activeMethodologyTab].phase}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white font-mono">
              {pageData.methodologySteps[activeMethodologyTab].name}
            </h3>
          </div>

          <p className="text-sm sm:text-base text-slate-200 font-sans font-medium">
            {pageData.methodologySteps[activeMethodologyTab].summary}
          </p>

          <p className="text-xs sm:text-sm text-slate-400 font-mono leading-relaxed bg-[#050811] p-4 rounded-xl border border-slate-800/80">
            {pageData.methodologySteps[activeMethodologyTab].details}
          </p>
        </div>
      </section>

      {/* Technical Specifications & Toolchain Matrix */}
      <section id="technical-specifications" className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-mono flex items-center gap-2">
          <Server className="w-6 h-6 text-purple-400" />
          <span>Technical Standards, Toolchains &amp; Compliance Matrix</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pageData.technicalSpecifications.map((spec, idx) => (
            <div 
              key={idx}
              className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 space-y-4"
            >
              <h3 className="text-base font-bold text-white font-mono text-emerald-400">
                {spec.category}
              </h3>

              <div className="space-y-3">
                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                    Governing Standards &amp; Frameworks
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {spec.standards.map((st, sIdx) => (
                      <span 
                        key={sIdx}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800/80 text-slate-300 border border-slate-700"
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                    Deployment Toolchains &amp; Utilities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {spec.toolchains.map((tool, tIdx) => (
                      <span 
                        key={tIdx}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-emerald-950/50 text-emerald-300 border border-emerald-800/50"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive CLI Verification Snippet */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Terminal className="w-6 h-6 text-emerald-400" />
            <span>Interactive Terminal Baseline &amp; Verification Snippet</span>
          </h2>
          <button
            onClick={handleCopyCode}
            className="min-h-[48px] px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Copy command code to clipboard"
          >
            {copiedCli ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCli ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="bg-[#050811] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              {pageData.cliVerification.title}
            </span>
            <span className="text-[11px] font-mono text-slate-500">bash / terminal</span>
          </div>

          <pre className="text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto p-3 bg-black/40 rounded-xl border border-slate-800/50 leading-relaxed">
            <code>{pageData.cliVerification.code}</code>
          </pre>

          <p className="text-xs font-mono text-slate-400 leading-relaxed pt-1">
            {pageData.cliVerification.explanation}
          </p>
        </div>
      </section>

      {/* Curated Authoritative Research Articles */}
      {relatedArticles.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-mono flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <span>Related Deep-Dive Research &amp; Field Blueprints</span>
            </h2>
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); onNavigate('blog', '/'); }}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 min-h-[48px] sm:min-h-0 py-2 sm:py-0"
            >
              <span>Explore All Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedArticles.map((art) => (
              <a 
                key={art.id}
                href={`/${art.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectArticle(art);
                }}
                className="bg-[#090d16] border border-slate-800 hover:border-emerald-500/60 rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between transition-all"
              >
                {art.coverImage && (
                  <div className="aspect-[16/9] w-full overflow-hidden relative bg-[#050811]">
                    <img 
                      src={art.coverImage.src.includes('images.unsplash.com') ? art.coverImage.src.replace(/w=\d+/, 'w=400').replace(/(&h=\d+)?/, '&h=225') : art.coverImage.src}
                      alt={art.coverImage.alt || art.title}
                      width={400}
                      height={225}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/cyber_defense_matrix.webp'; }}
                      className="w-full h-full object-cover aspect-[16/9] group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                      {art.category}
                    </span>
                  </div>
                )}

                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-white font-mono group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {art.readTime}
                    </span>
                    <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Read Guide &gt;
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Frequently Asked Questions with FAQPage Schema Alignment */}
      <section 
        className="space-y-4"
        itemScope 
        itemType="https://schema.org/FAQPage"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-white font-mono flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-amber-400" />
          <span>Frequently Asked Questions &amp; Technical Clarifications</span>
        </h2>

        <div className="space-y-3">
          {pageData.faqs.map((faq, idx) => {
            const isExpanded = expandedFaqIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-[#090d16] border border-slate-800/80 rounded-2xl overflow-hidden transition-all"
                itemScope 
                itemProp="mainEntity" 
                itemType="https://schema.org/Question"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-mono font-bold text-sm sm:text-base text-white hover:text-emerald-400 transition-colors min-h-[48px]"
                  aria-expanded={isExpanded}
                >
                  <span itemProp="name">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-emerald-400 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {isExpanded && (
                  <div 
                    className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed border-t border-slate-800/50"
                    itemScope 
                    itemProp="acceptedAnswer" 
                    itemType="https://schema.org/Answer"
                  >
                    <div itemProp="text">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* High-Impact Engagement Call to Action */}
      <section className="bg-gradient-to-br from-emerald-950/60 via-[#090d16] to-[#050811] border border-emerald-800/50 rounded-2xl p-6 sm:p-10 space-y-6 text-center relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-2">
            <UserCheck className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            {pageData.ctaHeadline}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            {pageData.ctaSubtext}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href="/contact"
            onClick={(e) => { e.preventDefault(); onNavigate('contact', '/contact'); }}
            className="min-h-[48px] px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-2"
          >
            <span>Book Security Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="mailto:vishwasaithal@proton.me"
            className="min-h-[48px] px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-mono text-sm transition-all flex items-center gap-2"
            title="Encrypted PGP dispatch via Proton Mail"
          >
            <span>Encrypted Email (vishwasaithal@proton.me)</span>
            <ExternalLink className="w-4 h-4 text-cyan-400" />
          </a>
        </div>
      </section>

      {/* Crawlable Navigation Bar linking all Dedicated SEO Landing Pages & Standalone Tools */}
      <footer className="border-t border-slate-800/80 pt-8 pb-4 space-y-4">
        <div className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Explore All Dedicated Security &amp; Autonomous Systems Practice Areas</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <a
            href="/sovereign-hub"
            onClick={(e) => { e.preventDefault(); onNavigate('sovereign-hub', '/sovereign-hub'); }}
            className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/60 hover:border-cyan-400 text-cyan-300 hover:text-white transition-colors min-h-[48px] flex items-center font-bold"
          >
            ★ /sovereign-hub
          </a>
          <a
            href="/sovereign-ai"
            onClick={(e) => { e.preventDefault(); onNavigate('sovereign-ai', '/sovereign-ai'); }}
            className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 transition-colors min-h-[48px] flex items-center"
          >
            /sovereign-ai
          </a>
          <a
            href="/private-local-ai"
            onClick={(e) => { e.preventDefault(); onNavigate('private-local-ai', '/private-local-ai'); }}
            className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 transition-colors min-h-[48px] flex items-center"
          >
            /private-local-ai
          </a>
          <a
            href="/air-gapped-ai"
            onClick={(e) => { e.preventDefault(); onNavigate('air-gapped-ai', '/air-gapped-ai'); }}
            className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 transition-colors min-h-[48px] flex items-center"
          >
            /air-gapped-ai
          </a>
          <a
            href="/ollama-security"
            onClick={(e) => { e.preventDefault(); onNavigate('ollama-security', '/ollama-security'); }}
            className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 transition-colors min-h-[48px] flex items-center"
          >
            /ollama-security
          </a>
          <a
            href="/vllm-security"
            onClick={(e) => { e.preventDefault(); onNavigate('vllm-security', '/vllm-security'); }}
            className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 transition-colors min-h-[48px] flex items-center"
          >
            /vllm-security
          </a>
          <a
            href="/local-llm-security"
            onClick={(e) => { e.preventDefault(); onNavigate('local-llm-security', '/local-llm-security'); }}
            className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 transition-colors min-h-[48px] flex items-center"
          >
            /local-llm-security
          </a>
          <a
            href="/sovereign-ai-infrastructure"
            onClick={(e) => { e.preventDefault(); onNavigate('sovereign-ai-infrastructure', '/sovereign-ai-infrastructure'); }}
            className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 transition-colors min-h-[48px] flex items-center"
          >
            /sovereign-ai-infrastructure
          </a>
          <a
            href="/ai-data-privacy"
            onClick={(e) => { e.preventDefault(); onNavigate('ai-data-privacy', '/ai-data-privacy'); }}
            className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 transition-colors min-h-[48px] flex items-center"
          >
            /ai-data-privacy
          </a>
          <a
            href="/ai-security"
            onClick={(e) => { e.preventDefault(); onNavigate('ai-security', '/ai-security'); }}
            className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 transition-colors min-h-[48px] flex items-center"
          >
            /ai-security
          </a>
          <a
            href="/cybersecurity"
            onClick={(e) => { e.preventDefault(); onNavigate('cybersecurity', '/cybersecurity'); }}
            className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 transition-colors min-h-[48px] flex items-center"
          >
            /cybersecurity
          </a>
          <a
            href="/ethical-hacking"
            onClick={(e) => { e.preventDefault(); onNavigate('ethical-hacking', '/ethical-hacking'); }}
            className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 transition-colors min-h-[48px] flex items-center"
          >
            /ethical-hacking
          </a>
          <a
            href="/penetration-testing"
            onClick={(e) => { e.preventDefault(); onNavigate('penetration-testing', '/penetration-testing'); }}
            className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 transition-colors min-h-[48px] flex items-center"
          >
            /penetration-testing
          </a>
          <a
            href="/security-research"
            onClick={(e) => { e.preventDefault(); onNavigate('security-research', '/security-research'); }}
            className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 transition-colors min-h-[48px] flex items-center"
          >
            /security-research
          </a>
          <a
            href="/technology"
            onClick={(e) => { e.preventDefault(); onNavigate('technology', '/technology'); }}
            className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 transition-colors min-h-[48px] flex items-center"
          >
            /technology
          </a>
          <a
            href="/tools"
            onClick={(e) => { e.preventDefault(); onNavigate('tools', '/tools'); }}
            className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 hover:border-emerald-400 text-emerald-300 hover:text-white transition-colors min-h-[48px] flex items-center font-bold"
          >
            ★ /tools (Tools Suite)
          </a>
        </div>
      </footer>
    </article>
  );
};
