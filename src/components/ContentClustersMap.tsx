import React, { useState } from 'react';
import { 
  Layers, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  HelpCircle, 
  Package, 
  ExternalLink,
  BookOpen,
  Search,
  Network,
  Share2,
  FileCode2,
  CheckCircle2,
  Lock,
  Compass
} from 'lucide-react';
import { ContentCluster, PrimaryCategory, Article } from '../types';
import { contentClustersData } from '../data/toolsDirectoryData';
import { allArticles, getArticleBySlug } from '../data/articlesData';

interface ContentClustersMapProps {
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (category: PrimaryCategory) => void;
}

export const ContentClustersMap: React.FC<ContentClustersMapProps> = ({
  onSelectArticle,
  onSelectCategory
}) => {
  const [selectedClusterId, setSelectedClusterId] = useState<string>(contentClustersData[0].id);

  const activeCluster = contentClustersData.find(c => c.id === selectedClusterId) || contentClustersData[0];
  const pillarArticle = getArticleBySlug(activeCluster.pillarArticleSlug);
  const supportingArticles = activeCluster.supportingArticleSlugs
    .map(slug => getArticleBySlug(slug))
    .filter((a): a is Article => Boolean(a));

  return (
    <section id="content-clusters-view" className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-[#090d16] border border-cyan-800/40 rounded-2xl p-6 sm:p-8 relative shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
            <Network className="w-3.5 h-3.5" />
            <span>TOPICAL AUTHORITY &amp; CONTENT CLUSTER ARCHITECTURE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-sans tracking-tight">
            Knowledge Graph &amp; Topic Pillars
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Explore our structured pillar-and-cluster publication architecture. Every technical guide is engineered to solve a specific engineering problem while connecting bidirectionally to foundational security pillars and open-source tools.
          </p>
        </div>
      </div>

      {/* Cluster Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {contentClustersData.map(cluster => {
          const isSelected = cluster.id === selectedClusterId;
          return (
            <button
              key={cluster.id}
              onClick={() => setSelectedClusterId(cluster.id)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#0f172a] border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500'
                  : 'bg-[#090d16] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {cluster.category}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                </div>
                <h3 className={`text-sm font-bold font-sans ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                  {cluster.name}
                </h3>
              </div>

              <p className="text-[11px] font-mono text-slate-500 mt-3 flex items-center justify-between">
                <span>{cluster.supportingArticleSlugs.length + 1} Guides</span>
                <span className="text-cyan-400 flex items-center gap-0.5">Explore &rarr;</span>
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Cluster Deep-Dive Visual Board */}
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                Active Pillar: {activeCluster.category}
              </span>
              <button
                onClick={() => onSelectCategory(activeCluster.category)}
                className="text-xs text-slate-400 hover:text-cyan-300 underline font-mono"
              >
                View Category Feed &rarr;
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans">
              {activeCluster.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-3xl">
              {activeCluster.description}
            </p>
          </div>

          <div className="bg-[#050811] p-3 rounded-xl border border-slate-800/80 text-xs font-mono text-slate-400 space-y-1 shrink-0">
            <p className="text-[10px] text-slate-500 uppercase">Target Search Intent</p>
            <p className="text-emerald-400 font-semibold">100% Practical Engineering</p>
          </div>
        </div>

        {/* 1. Core Pillar Guide Card */}
        {pillarArticle && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Foundation Pillar Research (Hub)</span>
            </div>

            <a 
              href={`/${pillarArticle.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectArticle(pillarArticle);
              }}
              className="block p-5 sm:p-6 rounded-xl bg-gradient-to-br from-[#0c1a2e] to-[#090d16] border border-cyan-500/40 hover:border-cyan-400 cursor-pointer transition-colors shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono text-cyan-300 font-semibold bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800/40 self-start">
                  Primary Hub Article
                </span>
                <span className="text-xs font-mono text-slate-400">{pillarArticle.readTime} • {pillarArticle.views.toLocaleString()} reads</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors font-sans mb-2">
                {pillarArticle.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mb-4 font-sans leading-relaxed">
                {pillarArticle.summary}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs font-mono">
                <span className="text-emerald-400">Target Keyword: "{pillarArticle.seo.primaryKeyword}"</span>
                <span className="flex items-center gap-1 text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
                  Read Pillar Guide &rarr;
                </span>
              </div>
            </a>
          </div>
        )}

        {/* 2. Connected Cluster Spokes */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Connected Spoke Tutorials ({supportingArticles.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportingArticles.map((art, idx) => (
              <a
                key={art.id}
                href={`/${art.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectArticle(art);
                }}
                className="p-4 rounded-xl bg-[#050811] border border-slate-800 hover:border-cyan-500/60 cursor-pointer transition-colors hover:bg-slate-900/60 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Node #{idx + 1}</span>
                    <span className="text-slate-300">{art.readTime}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors font-sans line-clamp-2">
                    {art.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 font-sans">
                    {art.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-[11px] font-mono">
                  <span className="text-slate-400 truncate max-w-[180px]">#{art.tags[0]}</span>
                  <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold">
                    Open Spoke &rarr;
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 3. Complete Research Archive Matrix (All 59 Sitemap Articles) */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Complete Research &amp; Historical Archive Nodes ({allArticles.length} Indexed Guides)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {allArticles.map((art) => (
              <a
                key={art.id}
                href={`/${art.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectArticle(art);
                }}
                className="p-2.5 rounded-lg bg-[#050811] border border-slate-800/80 hover:border-emerald-500/50 text-xs font-sans text-slate-200 hover:text-emerald-300 transition-colors truncate flex items-center justify-between gap-2"
                title={art.title}
              >
                <span className="truncate">{art.title}</span>
                <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Target Keywords Table & SEO Link Network */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target Organic Search Queries Covered</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {activeCluster.targetKeywords.map(kw => (
              <span 
                key={kw} 
                className="text-xs font-mono px-3 py-1 rounded-md bg-[#050811] border border-slate-800 text-slate-300 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
