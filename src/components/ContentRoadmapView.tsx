import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Search, 
  Filter, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  Lock, 
  Cpu, 
  Server, 
  ArrowRight, 
  Check, 
  Copy, 
  Tag, 
  BookOpen,
  ArrowLeft,
  X,
  FileText,
  Link as LinkIcon,
  CheckCircle2,
  Terminal,
  Download
} from 'lucide-react';
import { contentRoadmapArticles } from '../data/contentRoadmapData';
import { RoadmapArticle, Article, ActiveSiteView } from '../types';

interface ContentRoadmapViewProps {
  articles?: Article[];
  onSelectArticle?: (article: Article) => void;
  onSelectArticleUrl?: (url: string) => void;
  onBackToArticles?: () => void;
  onNavigateView?: (view: ActiveSiteView) => void;
}

export const ContentRoadmapView: React.FC<ContentRoadmapViewProps> = ({
  articles = [],
  onSelectArticle,
  onSelectArticleUrl,
  onBackToArticles,
  onNavigateView
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIntent, setSelectedIntent] = useState<string>('All');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [selectedRoadmapItem, setSelectedRoadmapItem] = useState<RoadmapArticle | null>(null);

  const categories = ['All', 'Ethical Hacking', 'Cybersecurity', 'Model Security', 'Technology'];
  const intents = ['All', 'Informational', 'Practical / Blueprint', 'Commercial Investigation'];

  const ethicalCount = useMemo(() => contentRoadmapArticles.filter(a => a.category === 'Ethical Hacking').length, []);
  const cyberCount = useMemo(() => contentRoadmapArticles.filter(a => a.category === 'Cybersecurity').length, []);
  const aiCount = useMemo(() => contentRoadmapArticles.filter(a => a.category === 'Model Security').length, []);
  const techCount = useMemo(() => contentRoadmapArticles.filter(a => a.category === 'Technology').length, []);
  const totalCount = contentRoadmapArticles.length;

  const filteredArticles = useMemo(() => {
    return contentRoadmapArticles.filter(art => {
      const matchesSearch = 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.primaryKeyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.pillarRelationship.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
      const matchesIntent = selectedIntent === 'All' || art.searchIntent === selectedIntent;

      return matchesSearch && matchesCat && matchesIntent;
    });
  }, [searchQuery, selectedCategory, selectedIntent]);

  const copyUrlToClipboard = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://yinyangyohackers.com${url}`);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'Ethical Hacking':
        return 'bg-red-950/60 text-red-400 border-red-800/40';
      case 'Cybersecurity':
        return 'bg-blue-950/60 text-blue-400 border-blue-800/40';
      case 'Model Security':
        return 'bg-purple-950/60 text-purple-400 border-purple-800/40';
      case 'Technology':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Ethical Hacking':
        return <Lock className="w-3.5 h-3.5" />;
      case 'Cybersecurity':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'Model Security':
        return <Cpu className="w-3.5 h-3.5" />;
      case 'Technology':
        return <Server className="w-3.5 h-3.5" />;
      default:
        return <BookOpen className="w-3.5 h-3.5" />;
    }
  };

  const findMatchingArticle = (roadmapItem: RoadmapArticle): Article | undefined => {
    const cleanSlug = roadmapItem.url.replace(/^\/articles\//, '').replace(/^\//, '');
    return articles.find(a => 
      a.slug === cleanSlug || 
      a.slug === roadmapItem.url || 
      a.id === cleanSlug ||
      a.title.toLowerCase() === roadmapItem.title.toLowerCase() ||
      a.slug.includes(cleanSlug) ||
      cleanSlug.includes(a.slug)
    );
  };

  const handleCardClick = (article: RoadmapArticle) => {
    const matched = findMatchingArticle(article);
    if (matched && onSelectArticle) {
      onSelectArticle(matched);
    } else if (onSelectArticleUrl) {
      onSelectArticleUrl(article.url);
    } else {
      setSelectedRoadmapItem(article);
    }
  };

  const handleInternalLinkClick = (linkTarget: string) => {
    setSelectedRoadmapItem(null);
    if (linkTarget === '/tools' && onNavigateView) {
      onNavigateView('tools');
      return;
    }
    const cleanSlug = linkTarget.replace(/^\/articles\//, '').replace(/^\//, '');
    const matched = articles.find(a => a.slug === cleanSlug || a.id === cleanSlug);
    if (matched && onSelectArticle) {
      onSelectArticle(matched);
    } else if (onSelectArticleUrl) {
      onSelectArticleUrl(linkTarget);
    }
  };

  return (
    <div id="content-roadmap-view" className="space-y-8 animate-in fade-in duration-200">
      {/* Navigation Breadcrumb */}
      {onBackToArticles && (
        <button
          onClick={onBackToArticles}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer min-h-[44px] px-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles &amp; Research</span>
        </button>
      )}

      {/* Header Masthead */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Compass className="w-3.5 h-3.5" />
            <span>EDITORIAL ARCHITECTURE &bull; {totalCount}-ARTICLE RESEARCH BLUEPRINT</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-mono tracking-tight leading-snug">
            Strategic Content Roadmap &amp; Topic Clusters
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Our comprehensive {totalCount}-article editorial publication roadmap covering <strong className="text-white">Ethical Hacking</strong>, <strong className="text-white">Cybersecurity</strong>, <strong className="text-white">Model Security</strong>, and <strong className="text-white">Open-Source Technology</strong>. Designed around pillar-and-cluster SEO architecture with targeted search intents, cross-linking nodes, and actionable engineering outcomes. Every title maps directly to published, battle-tested research.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2 text-xs font-mono">
            <div className="p-3.5 rounded-lg bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
              <div className="text-slate-400">Ethical Hacking</div>
              <div className="text-base font-bold text-white mt-1">{ethicalCount} Guides</div>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
              <div className="text-slate-400">Cybersecurity</div>
              <div className="text-base font-bold text-white mt-1">{cyberCount} Guides</div>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
              <div className="text-slate-400">Model Security</div>
              <div className="text-base font-bold text-white mt-1">{aiCount} Guides</div>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
              <div className="text-slate-400">Technology</div>
              <div className="text-base font-bold text-white mt-1">{techCount} Guides</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, keyword, or pillar..."
              className="w-full pl-10 pr-4 py-2.5 min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2.5 min-h-[44px] inline-flex items-center rounded-lg border font-mono text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-400 text-slate-950 font-bold border-emerald-400 shadow-sm'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-slate-300 pt-3 border-t border-slate-800/80">
          <span className="flex items-center gap-1 text-slate-400 font-semibold">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Search Intent:</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {intents.map((intent) => (
              <button
                key={intent}
                onClick={() => setSelectedIntent(intent)}
                className={`px-3 py-2 min-h-[44px] inline-flex items-center rounded-lg text-xs transition-colors cursor-pointer border ${
                  selectedIntent === intent
                    ? 'bg-slate-700 text-white font-semibold border-slate-600'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {intent}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Roadmap Articles with Equal Spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredArticles.map((article, idx) => (
          <div
            key={article.id}
            id={`roadmap-item-${article.id}`}
            onClick={() => handleCardClick(article)}
            className="p-5 sm:p-6 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-emerald-500/60 transition-all hover:bg-slate-900 flex flex-col justify-between group cursor-pointer shadow-sm space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium border flex items-center gap-1.5 ${getCategoryBadgeColor(article.category)}`}>
                  {getCategoryIcon(article.category)}
                  <span>{article.category}</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  #{String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-white font-mono group-hover:text-emerald-400 transition-colors leading-snug">
                {article.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed font-sans line-clamp-2">
                {article.description}
              </p>

              <div className="mt-4 pt-3.5 border-t border-slate-800/80 space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400 gap-2">
                  <span className="text-slate-400 shrink-0">Primary Keyword:</span>
                  <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/40 text-[11px] truncate">
                    {article.primaryKeyword}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400 gap-2">
                  <span className="text-slate-400 shrink-0">Pillar Role:</span>
                  <span className="text-slate-300 text-[11px] text-right truncate max-w-[220px]">
                    {article.pillarRelationship}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400 gap-2">
                  <span className="text-slate-400 shrink-0">Search Intent:</span>
                  <span className="text-slate-300 text-[11px]">
                    {article.searchIntent}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-3">
              <div className="text-[11px] font-mono text-slate-400 truncate max-w-[200px] sm:max-w-[260px]">
                {article.url}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => copyUrlToClipboard(article.url, e)}
                  title="Copy Canonical URL"
                  className="p-2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                >
                  {copiedUrl === article.url ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <div className="text-xs font-mono text-emerald-400 font-bold px-3 py-2 min-h-[44px] inline-flex items-center gap-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 transition-colors">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Roadmap Blueprint Detail Modal */}
      {selectedRoadmapItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setSelectedRoadmapItem(null)}
        >
          <div 
            className="bg-[#090d16] border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedRoadmapItem(null)}
              className="absolute top-5 right-5 p-2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              title="Close Blueprint"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium border flex items-center gap-1.5 ${getCategoryBadgeColor(selectedRoadmapItem.category)}`}>
                  {getCategoryIcon(selectedRoadmapItem.category)}
                  <span>{selectedRoadmapItem.category}</span>
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedRoadmapItem.searchIntent}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white font-mono leading-snug">
                {selectedRoadmapItem.title}
              </h3>

              <p className="text-sm text-slate-300 mt-3 leading-relaxed font-sans">
                {selectedRoadmapItem.description}
              </p>
            </div>

            {/* Architectural Details */}
            <div className="space-y-3 bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 text-xs font-mono">
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <span className="text-slate-400">Pillar Node:</span>
                <span className="text-slate-200 font-semibold">{selectedRoadmapItem.pillarRelationship}</span>
              </div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <span className="text-slate-400">Primary Keyword:</span>
                <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/40">
                  {selectedRoadmapItem.primaryKeyword}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <span className="text-slate-400">Suggested Action / CTA:</span>
                <span className="text-amber-400">{selectedRoadmapItem.suggestedCta}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400">Canonical Path:</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 truncate max-w-[240px]">{selectedRoadmapItem.url}</span>
                  <button
                    type="button"
                    onClick={(e) => copyUrlToClipboard(selectedRoadmapItem.url, e)}
                    className="p-1.5 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    title="Copy URL"
                  >
                    {copiedUrl === selectedRoadmapItem.url ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Internal Link Nodes */}
            {selectedRoadmapItem.internalLinkTargets && selectedRoadmapItem.internalLinkTargets.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cross-Linked Blueprint Nodes &amp; Tools</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRoadmapItem.internalLinkTargets.map((linkTarget) => (
                    <button
                      key={linkTarget}
                      type="button"
                      onClick={() => handleInternalLinkClick(linkTarget)}
                      className="text-xs font-mono px-3.5 py-2 min-h-[44px] rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-200 hover:text-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{linkTarget.replace('/articles/', '').replace('/', '')}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedRoadmapItem(null)}
                className="px-4 py-2.5 min-h-[44px] rounded-xl bg-slate-800 text-slate-200 hover:text-white font-mono text-xs transition-colors cursor-pointer"
              >
                Close Window
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const art = findMatchingArticle(selectedRoadmapItem);
                    setSelectedRoadmapItem(null);
                    if (art && onSelectArticle) {
                      onSelectArticle(art);
                    } else if (onSelectArticleUrl) {
                      onSelectArticleUrl(selectedRoadmapItem.url);
                    }
                  }}
                  className="px-5 py-2.5 min-h-[44px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950 cursor-pointer"
                >
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
