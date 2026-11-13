import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Tag, 
  ArrowRight, 
  ExternalLink, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Network, 
  Lock 
} from 'lucide-react';
import { cybersecurityGlossary, GlossaryEntry } from '../data/glossaryData';
import { allArticles } from '../data/articlesData';
import { Article } from '../types';

interface GlossaryViewProps {
  onSelectArticle?: (article: Article) => void;
  onNavigateView?: (view: string, path?: string) => void;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({
  onSelectArticle,
  onNavigateView
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Definitions' },
    { id: 'Defensive', label: 'Defensive Engineering' },
    { id: 'Offensive', label: 'Offensive Testing' },
    { id: 'Sovereign AI', label: 'Sovereign AI & ML' },
    { id: 'Networking', label: 'Networking & Infrastructure' },
    { id: 'Cryptography', label: 'Cryptography' }
  ];

  const filteredEntries = useMemo(() => {
    return cybersecurityGlossary.filter(entry => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        entry.term.toLowerCase().includes(q) ||
        entry.definition.toLowerCase().includes(q) ||
        entry.technicalContext.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (selectedCategory !== 'all' && entry.category !== selectedCategory) return false;
      return true;
    });
  }, [searchQuery, selectedCategory]);

  const handleOpenArticle = (slug: string) => {
    const article = allArticles.find(a => a.slug === slug);
    if (article && onSelectArticle) {
      onSelectArticle(article);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (onNavigateView) {
      onNavigateView('articles', `/articles/${slug}`);
    } else {
      window.location.href = `/${slug}`;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Editorial Header */}
      <div className="bg-[#070b16] border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-4xl space-y-4 relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-emerald-400 font-bold uppercase tracking-wider">
              Authoritative Reference
            </span>
            <span>&bull;</span>
            <span>Cybersecurity Terminology Index</span>
            <span>&bull;</span>
            <span className="text-slate-300">2026 Edition</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
            Cybersecurity &amp; Sovereign AI Technical Glossary
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Precise engineering definitions, adversarial context, and defensive mitigation standards for core networking, memory protection, penetration testing, and machine learning security concepts.
          </p>

          {/* Search Box */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search definitions (e.g. eBPF, Zero-Trust, ASLR, Air-Gap)..."
                className="w-full bg-[#050914] border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm font-mono text-slate-200 outline-none transition-colors"
              />
            </div>

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-slate-900 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-mono transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-300 font-bold shadow-sm'
                : 'bg-[#060b18] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
        <span>Showing {filteredEntries.length} verified cybersecurity definitions</span>
        <span className="text-slate-500">Cross-Referenced with Research Blueprints</span>
      </div>

      {/* Glossary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEntries.map((entry) => (
          <div
            key={entry.term}
            className="p-5 sm:p-6 rounded-2xl bg-[#050813] border border-slate-800/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                <span className="text-base font-bold font-mono text-white">
                  {entry.term}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-700 text-cyan-300">
                  {entry.category}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                {entry.definition}
              </p>

              <div className="p-3 rounded-xl bg-[#080d1a] border border-slate-800/60 text-xs font-sans text-slate-300 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                  Technical Context &amp; Mitigation:
                </div>
                <p className="leading-relaxed">
                  {entry.technicalContext}
                </p>
              </div>
            </div>

            {/* Read Linked Blueprint Button */}
            {entry.relatedArticleSlug && (
              <div className="pt-2 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => handleOpenArticle(entry.relatedArticleSlug!)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 text-xs font-mono font-semibold transition-colors flex items-center justify-between cursor-pointer border border-slate-800"
                >
                  <span>Explore Technical Blueprint</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
