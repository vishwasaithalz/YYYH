import React, { useState, useId, useMemo } from 'react';
import { 
  parseSemanticLinksInParagraph, 
  InjectedTextSegment 
} from '../utils/semanticLinkEngine';
import { allArticles } from '../data/articlesData';
import { Article } from '../types';
import { ExternalLink, BookOpen, ChevronRight, ShieldCheck } from 'lucide-react';

interface SemanticArticleTextProps {
  text: string;
  currentArticleId: string;
  currentArticleSlug: string;
  alreadyLinkedSlugs: Set<string>;
  maxLinks?: number;
  onSelectArticle?: (article: Article) => void;
  className?: string;
}

function parseHtmlLinksToSegments(htmlText: string): InjectedTextSegment[] {
  const segments: InjectedTextSegment[] = [];
  const linkRegex = /<a\s+[^>]*href=["']\/([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(htmlText)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: htmlText.substring(lastIndex, match.index)
      });
    }

    const slug = match[1];
    const rawContent = match[2];
    const cleanContent = rawContent.replace(/<[^>]+>/g, '');
    const targetArticle = allArticles.find(a => a.slug === slug);

    segments.push({
      type: 'link',
      content: cleanContent,
      target: {
        articleId: targetArticle ? targetArticle.id : slug,
        slug,
        title: targetArticle ? targetArticle.title : cleanContent,
        category: targetArticle ? targetArticle.category : 'Related Blueprint',
        readTime: targetArticle ? targetArticle.readTime : undefined
      }
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < htmlText.length) {
    segments.push({
      type: 'text',
      content: htmlText.substring(lastIndex)
    });
  }

  return segments;
}

export const SemanticArticleText: React.FC<SemanticArticleTextProps> = ({
  text,
  currentArticleId,
  currentArticleSlug,
  alreadyLinkedSlugs,
  maxLinks = 1,
  onSelectArticle,
  className = ''
}) => {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const tooltipIdPrefix = useId();

  const segments: InjectedTextSegment[] = useMemo(() => {
    if (text.includes('<a ') && text.includes('</a>')) {
      return parseHtmlLinksToSegments(text);
    }
    return parseSemanticLinksInParagraph(
      text,
      currentArticleId,
      currentArticleSlug,
      alreadyLinkedSlugs,
      maxLinks
    );
  }, [text, currentArticleId, currentArticleSlug, alreadyLinkedSlugs, maxLinks]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    const targetArticle = allArticles.find(a => a.slug === slug);
    if (targetArticle && onSelectArticle) {
      onSelectArticle(targetArticle);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      window.location.href = `/${slug}`;
    }
  };

  return (
    <span className={className}>
      {segments.map((seg, idx) => {
        if (seg.type === 'text' || !seg.target) {
          return <React.Fragment key={idx}>{seg.content}</React.Fragment>;
        }

        const target = seg.target;
        const isHovered = hoveredSlug === target.slug;
        const targetHref = `/${target.slug}`;
        const tooltipId = `${tooltipIdPrefix}-tooltip-${idx}`;

        return (
          <span 
            key={idx} 
            className="relative inline-block"
            onMouseEnter={() => setHoveredSlug(target.slug)}
            onMouseLeave={() => setHoveredSlug(null)}
          >
            <a
              href={targetHref}
              onClick={(e) => handleClick(e, target.slug)}
              className="text-cyan-400 hover:text-emerald-300 font-medium underline underline-offset-4 decoration-cyan-500/50 hover:decoration-emerald-400 transition-colors cursor-pointer inline-flex items-center gap-0.5 group"
              aria-describedby={isHovered ? tooltipId : undefined}
              title={`Read related research: ${target.title}`}
            >
              <span>{seg.content}</span>
              <ChevronRight className="w-3 h-3 text-cyan-400/70 inline group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Interactive Micro Hover Preview Card */}
            {isHovered && (
              <span
                id={tooltipId}
                role="tooltip"
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 rounded-xl bg-[#070e1c] border border-cyan-500/50 text-slate-200 text-xs shadow-2xl z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150 block font-sans text-left"
              >
                <span className="flex items-center justify-between gap-1 text-[10px] font-mono text-cyan-300 border-b border-slate-800 pb-1.5 mb-1.5">
                  <span className="flex items-center gap-1 font-bold uppercase truncate">
                    <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{target.category}</span>
                  </span>
                  {target.readTime && (
                    <span className="text-slate-400 shrink-0 flex items-center gap-1">
                      <BookOpen className="w-2.5 h-2.5" />
                      <span>{target.readTime}</span>
                    </span>
                  )}
                </span>

                <span className="font-bold text-white block text-xs leading-snug line-clamp-2">
                  {target.title}
                </span>

                <span className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-emerald-400 font-medium">
                  <span>Open Related Blueprint</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
};
