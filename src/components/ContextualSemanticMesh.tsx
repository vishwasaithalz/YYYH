import React, { useMemo } from 'react';
import { Article } from '../types';
import { getContextualSemanticGraph } from '../utils/semanticLinkEngine';
import { Network, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';

interface ContextualSemanticMeshProps {
  article: Article;
  onSelectArticle?: (article: Article) => void;
}

export const ContextualSemanticMesh: React.FC<ContextualSemanticMeshProps> = ({
  article,
  onSelectArticle
}) => {
  const relations = useMemo(() => {
    return getContextualSemanticGraph(article, 4);
  }, [article]);

  if (relations.length === 0) {
    return null;
  }

  const handleSelect = (e: React.MouseEvent, relArticle: Article) => {
    e.preventDefault();
    if (onSelectArticle) {
      onSelectArticle(relArticle);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      window.location.href = `/${relArticle.slug}`;
    }
  };

  return (
    <section 
      aria-labelledby="semantic-mesh-heading"
      className="p-5 sm:p-6 rounded-2xl bg-[#050a16] border border-cyan-900/60 space-y-4 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-cyan-400" />
          <h3 
            id="semantic-mesh-heading"
            className="text-xs font-mono font-bold text-white uppercase tracking-wider"
          >
            Automated Semantic Research Graph
          </h3>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 font-medium">
          Contextual Crawl Cluster &bull; High Semantic Affinity
        </span>
      </div>

      <p className="text-xs text-slate-300 font-sans leading-relaxed">
        Our automated internal crawler discovered strong architectural correlations between this guide and the following verified security blueprints:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {relations.map((rel) => {
          const relArticle = rel.article;
          const href = `/${relArticle.slug}`;

          return (
            <a
              key={relArticle.id}
              href={href}
              onClick={(e) => handleSelect(e, relArticle)}
              className="p-3.5 rounded-xl bg-[#070e1e] border border-slate-800 hover:border-cyan-500/70 transition-all group flex flex-col justify-between space-y-2 cursor-pointer shadow-sm hover:bg-[#091326]"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-cyan-400 font-bold uppercase truncate max-w-[150px]">
                    {relArticle.category}
                  </span>
                  <span className="text-emerald-400 font-bold">
                    {rel.relevanceScore}% Match
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold font-sans text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {relArticle.title}
                </h4>

                {/* Matched semantic anchor keywords */}
                {rel.matchedKeywords.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono text-slate-400">
                    <span className="text-slate-500">Correlated on:</span>
                    {rel.matchedKeywords.map((kw, kIdx) => (
                      <span key={kIdx} className="text-slate-300 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400 group-hover:text-cyan-300 transition-colors">
                <span>{rel.reason}</span>
                <div className="flex items-center gap-1 text-emerald-400 font-medium">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};
