import React from 'react';
import { 
  Clock, 
  Eye, 
  ArrowRight, 
  Sparkles, 
  MessageSquare 
} from 'lucide-react';
import { Article } from '../types';
import { calculateReadingTime } from '../utils/readingTime';
import { getArticleCoverImage, getArticleCardCoverImage, HACKER_COVERS } from '../utils/hackerImages';
import { getOptimizedImageUrl, getOptimizedSquareImageUrl, getResponsiveSrcSet, CARD_SIZES, FEATURED_HERO_SIZES } from '../utils/responsiveImages';

export interface ArticleCardSkeletonProps {
  featured?: boolean;
  layout?: 'grid' | 'stream';
}

export const ArticleCardSkeleton: React.FC<ArticleCardSkeletonProps> = ({
  featured = false,
  layout = 'grid'
}) => {
  if (featured) {
    return (
      <div 
        role="status"
        aria-label="Loading featured article..."
        className="bg-[#090d16] border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm animate-pulse relative"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-5 relative aspect-[16/9] lg:aspect-auto lg:h-full min-h-[260px] bg-slate-800/50" />
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="h-5 w-28 bg-slate-800 rounded-md" />
              <div className="h-8 w-5/6 bg-slate-800/90 rounded-md" />
              <div className="h-8 w-2/3 bg-slate-800/90 rounded-md" />
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full bg-slate-800/50 rounded" />
                <div className="h-4 w-11/12 bg-slate-800/50 rounded" />
              </div>
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 bg-slate-800/60 rounded-md" />
                <div className="h-6 w-20 bg-slate-800/60 rounded-md" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800/80" />
                <div className="h-3.5 w-24 bg-slate-800/70 rounded" />
              </div>
              <div className="h-4 w-28 bg-slate-800/60 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'stream') {
    return (
      <div 
        role="status"
        aria-label="Loading article..."
        className="p-4 rounded-xl bg-[#090d16] border border-slate-800/80 animate-pulse flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="space-y-2.5 flex-1 w-full">
          <div className="flex items-center gap-2">
            <div className="h-4 w-20 bg-slate-800 rounded" />
            <div className="h-3 w-16 bg-slate-800/60 rounded" />
          </div>
          <div className="h-5 w-3/4 bg-slate-800/90 rounded" />
          <div className="h-3.5 w-1/2 bg-slate-800/50 rounded" />
        </div>
        <div className="h-8 w-24 bg-slate-800/60 rounded-lg shrink-0" />
      </div>
    );
  }

  return (
    <div 
      role="status"
      aria-label="Loading article..."
      className="bg-[#090d16] border border-slate-800/80 rounded-xl overflow-hidden animate-pulse shadow-sm flex flex-col justify-between"
    >
      <div>
        <div className="aspect-[16/9] w-full bg-slate-800/40 relative border-b border-slate-800/60">
          <div className="absolute top-2.5 left-2.5 h-4 w-20 bg-slate-800 rounded" />
        </div>
        <div className="p-4 space-y-3">
          <div className="h-5 w-11/12 bg-slate-800/90 rounded" />
          <div className="h-5 w-3/4 bg-slate-800/90 rounded" />
          <div className="space-y-1.5 pt-1">
            <div className="h-3.5 w-full bg-slate-800/50 rounded" />
            <div className="h-3.5 w-4/5 bg-slate-800/50 rounded" />
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 flex items-center justify-between">
        <div className="h-3 w-24 bg-slate-800/50 rounded" />
        <div className="h-3 w-12 bg-slate-800/60 rounded" />
      </div>
    </div>
  );
};

interface ArticleCardProps {
  article?: Article;
  onSelect?: (article: Article) => void;
  onSelectTag?: (tag: string, e: React.MouseEvent) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (articleId: string, e: React.MouseEvent) => void;
  featured?: boolean;
  layout?: 'grid' | 'stream';
  loading?: boolean;
  priority?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelect = (_art: Article) => {},
  onSelectTag,
  featured = false,
  layout = 'grid',
  loading = false,
  priority = false
}) => {
  if (loading || !article) {
    return <ArticleCardSkeleton featured={featured} layout={layout} />;
  }

  const readingEstimate = React.useMemo(() => {
    return calculateReadingTime(article);
  }, [article]);

  const coverImage = React.useMemo(() => {
    return getArticleCardCoverImage(article);
  }, [article]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(article);
    }
  };

  // 1. Featured Layout
  if (featured) {
    const isCdn = coverImage.src.includes('images.unsplash.com');
    const avifSrcSet = isCdn ? getResponsiveSrcSet(coverImage.src, [480, 640, 800, 1024], 'avif') : '';
    const webpSrcSet = isCdn ? getResponsiveSrcSet(coverImage.src, [480, 640, 800, 1024], 'webp') : '';
    const optimizedHeroSrc = getOptimizedImageUrl(coverImage.src, 640, 72, 'webp', 360);

    return (
      <article
        id={`featured-article-${article.id}`}
        itemScope
        itemType="https://schema.org/TechArticle"
        role="button"
        tabIndex={0}
        onClick={() => onSelect(article)}
        onKeyDown={handleKeyDown}
        aria-label={`Open article: ${article.title}`}
        className="group cursor-pointer bg-[#090d16] border border-emerald-800/60 hover:border-emerald-400 focus:border-emerald-400 focus:outline-none rounded-2xl overflow-hidden transition-colors duration-200 shadow-lg relative"
      >
        <link itemProp="url" href={`https://yinyangyohackers.com/${article.slug}`} />
        <link itemProp="image" href={coverImage.src} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative z-10 items-center">
          <div className="lg:col-span-5 relative aspect-[16/9] w-full overflow-hidden bg-[#03060f]">
            <picture className="w-full h-full block">
              {isCdn && avifSrcSet && (
                <source type="image/avif" srcSet={avifSrcSet} sizes={FEATURED_HERO_SIZES} />
              )}
              {isCdn && webpSrcSet && (
                <source type="image/webp" srcSet={webpSrcSet} sizes={FEATURED_HERO_SIZES} />
              )}
              <img 
                src={optimizedHeroSrc}
                srcSet={webpSrcSet || undefined}
                sizes={FEATURED_HERO_SIZES}
                alt={coverImage.alt}
                width={640}
                height={360}
                referrerPolicy="no-referrer"
                fetchPriority="high"
                decoding="async"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = HACKER_COVERS[0]; }}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 aspect-[16/9]"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-[#090d16]/40 to-[#090d16]" />
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/60 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                FEATURED RESEARCH
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="px-2.5 py-0.5 rounded text-xs font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-800/60">
                  {article.category}
                </span>
                {article.subcategory && (
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono text-slate-300 bg-slate-900 border border-slate-700">
                    {article.subcategory}
                  </span>
                )}
              </div>

              <h3 itemProp="headline" className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white group-hover:text-emerald-300 transition-colors leading-tight mb-3 font-sans">
                <a
                  href={`/${article.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSelect(article);
                  }}
                  className="hover:underline focus:outline-none"
                >
                  {article.title}
                </a>
              </h3>

              <p itemProp="description" className="text-slate-200 text-sm sm:text-base leading-relaxed mb-5 line-clamp-3 font-sans">
                {article.summary}
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                {article.tags.map(tag => (
                  <button 
                    key={tag} 
                    type="button"
                    onClick={(e) => {
                      if (onSelectTag) {
                        e.stopPropagation();
                        onSelectTag(tag, e);
                      }
                    }}
                    className="text-xs px-3 py-2 min-h-[44px] inline-flex items-center rounded-lg font-mono bg-slate-900 text-slate-200 border border-slate-700 hover:text-emerald-300 hover:border-emerald-500/60 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-xs text-slate-300 font-sans">
              <div className="flex items-center gap-3" itemProp="author" itemScope itemType="https://schema.org/Person">
                <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-300 font-mono font-bold text-xs shrink-0">
                  VA
                </div>
                <div>
                  <p className="font-semibold text-slate-100" itemProp="name">{article.author.name}</p>
                  <time itemProp="datePublished" dateTime={article.date} className="text-[11px] text-slate-300 font-mono">{article.date}</time>
                </div>
              </div>

              <div className="flex items-center gap-4 font-mono text-[11px]">
                <span className="flex items-center gap-1 text-slate-200" title={`~${readingEstimate.wordCount.toLocaleString()} words`}>
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  {readingEstimate.text}
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Eye className="w-3.5 h-3.5" />
                  {article.views.toLocaleString()}
                </span>
                <span className="flex items-center gap-1 text-cyan-300">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  {article.comments?.length || 0}
                </span>

                <a
                  href={`/${article.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSelect(article);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 font-bold group-hover:translate-x-1 transition-all"
                >
                  <span>Open Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // 2. Stream Layout
  if (layout === 'stream') {
    const isCdn = coverImage.src.includes('images.unsplash.com');
    const avifSrcSet = isCdn ? getResponsiveSrcSet(coverImage.src, [320, 480], 'avif') : '';
    const webpSrcSet = isCdn ? getResponsiveSrcSet(coverImage.src, [320, 480], 'webp') : '';
    const optimizedStreamSrc = getOptimizedImageUrl(coverImage.src, 320, 72, 'webp', 180);

    return (
      <article
        id={`article-stream-${article.id}`}
        itemScope
        itemType="https://schema.org/TechArticle"
        role="button"
        tabIndex={0}
        onClick={() => onSelect(article)}
        onKeyDown={handleKeyDown}
        aria-label={`Open article: ${article.title}`}
        className="group cursor-pointer bg-[#090d16] border border-slate-800/80 hover:border-emerald-400 focus:border-emerald-400 focus:outline-none rounded-xl p-4 transition-colors duration-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
      >
        <link itemProp="url" href={typeof window !== 'undefined' && window.location.origin ? `${window.location.origin}/${article.slug}` : `https://yinyangyohackers.com/${article.slug}`} />
        <link itemProp="image" href={coverImage.src} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 min-w-0">
          <div className="w-full sm:w-44 aspect-[16/9] bg-[#040711] rounded-lg overflow-hidden shrink-0 border border-slate-800/80 relative">
            <picture className="w-full h-full block">
              {isCdn && avifSrcSet && (
                <source type="image/avif" srcSet={avifSrcSet} sizes="(max-width: 640px) 100vw, 176px" />
              )}
              {isCdn && webpSrcSet && (
                <source type="image/webp" srcSet={webpSrcSet} sizes="(max-width: 640px) 100vw, 176px" />
              )}
              <img
                src={optimizedStreamSrc}
                srcSet={webpSrcSet || undefined}
                sizes="(max-width: 640px) 100vw, 176px"
                alt={coverImage.alt}
                width={320}
                height={180}
                loading={priority ? 'eager' : 'lazy'}
                fetchPriority={priority ? 'high' : 'auto'}
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = HACKER_COVERS[0]; }}
                className="w-full h-full object-cover object-center aspect-[16/9] group-hover:scale-105 transition-transform duration-300"
              />
            </picture>
          </div>

          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono">
              <span className="text-emerald-400 font-bold">{article.category}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">{article.date}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">{readingEstimate.text}</span>
            </div>

            <h3 itemProp="headline" className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1 font-sans">
              <a
                href={`/${article.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelect(article);
                }}
                className="hover:underline focus:outline-none"
              >
                {article.title}
              </a>
            </h3>

            <p itemProp="description" className="text-sm text-slate-300 line-clamp-2 font-sans leading-relaxed">
              {article.summary}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {article.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs px-2.5 py-0.5 rounded bg-slate-900 text-slate-300 font-mono border border-slate-700">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="shrink-0 pt-2 sm:pt-0 self-end sm:self-center">
          <a
            href={`/${article.slug}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(article);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-lg bg-slate-900 group-hover:bg-emerald-400 group-hover:text-slate-950 text-emerald-300 text-xs font-mono font-bold transition-colors border border-slate-700 group-hover:border-emerald-400"
          >
            <span>Open Article</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </article>
    );
  }

  // 3. Standard Grid Card
  const isCdn = coverImage.src.includes('images.unsplash.com');
  const avifSrcSet = isCdn ? getResponsiveSrcSet(coverImage.src, [320, 480], 'avif') : '';
  const webpSrcSet = isCdn ? getResponsiveSrcSet(coverImage.src, [320, 480], 'webp') : '';
  const optimizedCardSrc = getOptimizedImageUrl(coverImage.src, 640, 72, 'webp', 360);

  return (
    <article
      id={`article-card-${article.id}`}
      itemScope
      itemType="https://schema.org/TechArticle"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(article)}
      onKeyDown={handleKeyDown}
      aria-label={`Open article: ${article.title}`}
      className="group cursor-pointer bg-[#090d16] border border-slate-800/80 hover:border-emerald-400 focus:border-emerald-400 focus:outline-none rounded-xl overflow-hidden transition-colors duration-200 shadow-sm flex flex-col justify-between"
    >
      <link itemProp="url" href={typeof window !== 'undefined' && window.location.origin ? `${window.location.origin}/${article.slug}` : `https://yinyangyohackers.com/${article.slug}`} />
      <link itemProp="image" href={coverImage.src} />

      <div>
        <div className="relative aspect-[16/9] w-full bg-[#040711] overflow-hidden border-b border-slate-800/80">
          <picture className="w-full h-full block">
            {isCdn && avifSrcSet && (
              <source type="image/avif" srcSet={avifSrcSet} sizes={CARD_SIZES} />
            )}
            {isCdn && webpSrcSet && (
              <source type="image/webp" srcSet={webpSrcSet} sizes={CARD_SIZES} />
            )}
            <img 
              src={optimizedCardSrc} 
              srcSet={webpSrcSet || undefined}
              sizes={CARD_SIZES}
              alt={coverImage.alt}
              width={640}
              height={360}
              referrerPolicy="no-referrer"
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
              decoding="async"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = HACKER_COVERS[0]; }}
              className="w-full h-full object-cover object-center aspect-[16/9] group-hover:scale-105 transition-transform duration-300"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-black/20 pointer-events-none" />
          
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700">
              {article.category}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <h3 itemProp="headline" className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug mb-2 line-clamp-2 font-sans">
            <a
              href={`/${article.slug}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect(article);
              }}
              className="hover:underline focus:outline-none"
            >
              {article.title}
            </a>
          </h3>

          <p itemProp="description" className="text-sm text-slate-300 leading-relaxed mb-3.5 line-clamp-2 font-sans">
            {article.summary}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {article.tags.slice(0, 3).map(tag => (
              <button 
                key={tag} 
                type="button"
                onClick={(e) => {
                  if (onSelectTag) {
                    e.stopPropagation();
                    onSelectTag(tag, e);
                  }
                }}
                className="text-xs px-3 py-1.5 min-h-[44px] inline-flex items-center rounded-lg bg-slate-900 text-slate-300 font-mono border border-slate-700 hover:text-emerald-300 hover:border-emerald-500/60 cursor-pointer transition-colors"
              >
                #{tag}
              </button>
            ))}
            {article.tags.length > 3 && (
              <span className="text-xs px-2.5 py-1.5 min-h-[44px] rounded-lg bg-slate-900 text-slate-300 font-mono border border-slate-800 inline-flex items-center">
                +{article.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 font-mono">
        <div className="flex items-center gap-2">
          <time itemProp="datePublished" dateTime={article.date}>{article.date}</time>
          <span>•</span>
          <span className="flex items-center gap-1 text-slate-200" title={`${readingEstimate.wordCount.toLocaleString()} words`}>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            {readingEstimate.text}
          </span>
        </div>

        <a
          href={`/${article.slug}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect(article);
          }}
          className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 group-hover:text-emerald-200 font-sans font-semibold transition-colors"
        >
          <span>Open Article</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </article>
  );
};
