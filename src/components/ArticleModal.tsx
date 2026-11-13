import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, 
  Clock, 
  Eye, 
  Bookmark, 
  Share2, 
  Copy, 
  Check, 
  ThumbsUp, 
  MessageSquare, 
  ArrowLeft, 
  ShieldAlert, 
  Info, 
  AlertTriangle, 
  Lightbulb, 
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Send,
  User,
  ExternalLink,
  Layers,
  HelpCircle,
  ArrowRight,
  Download,
  Flame,
  ShieldCheck,
  Zap,
  Twitter,
  Linkedin,
  Facebook,
  Compass,
  ArrowUp,
  Terminal,
  Shield,
  BookOpen,
  Wrench,
  Globe,
  Tag,
  Link2,
  Sparkles,
  FileCode
} from 'lucide-react';
import { Article, Comment, TableOfContentsItem } from '../types';
import { allArticles, getRelatedArticles } from '../data/articlesData';
import { usePageViewCount } from '../hooks/usePageViewCount';
import { getRelatedToolsForArticle, getKeyTakeawaysForArticle } from '../utils/articlePageHelpers';
import { calculateReadingTime } from '../utils/readingTime';
import { getArticleCoverImage, HACKER_COVERS } from '../utils/hackerImages';
import { getOptimizedImageUrl, getOptimizedSquareImageUrl, getResponsiveSrcSet, MODAL_HERO_SIZES } from '../utils/responsiveImages';
import { CommentsSection } from './CommentsSection';
import { SemanticArticleText } from './SemanticArticleText';
import { ContextualSemanticMesh } from './ContextualSemanticMesh';
import { processArticleContent } from '../utils/contentProcessor';

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string, e: React.MouseEvent) => void;
  onAddComment?: (articleId: string, commentData: Omit<Comment, 'id' | 'date'>) => void;
  onAddReply?: (articleId: string, parentCommentId: string, replyData: Omit<Comment, 'id' | 'date'>) => void;
  onToggleCommentLike?: (articleId: string, commentId: string, isReply?: boolean, parentId?: string) => void;
  onSelectRelatedArticle?: (article: Article) => void;
  onSelectCategory?: (category: string) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article: rawArticle,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onAddComment,
  onAddReply,
  onToggleCommentLike,
  onSelectRelatedArticle,
  onSelectCategory
}) => {
  // Hydrate lightweight index article with full body sections and FAQs from allArticles
  const baseArticle = useMemo(() => {
    if (rawArticle.sections && rawArticle.sections.length > 0) return rawArticle;
    const full = allArticles.find(a => a.id === rawArticle.id || a.slug === rawArticle.slug);
    return full ? { ...full, views: rawArticle.views, comments: rawArticle.comments } : rawArticle;
  }, [rawArticle]);

  // Automatically scan for key cybersecurity keywords and inject internal hyperlinks before rendering
  const article = useMemo(() => {
    return processArticleContent(baseArticle, allArticles);
  }, [baseArticle]);

  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState<'markdown' | 'bibtex' | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);
  const [isShareDrawerOpen, setIsShareDrawerOpen] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [isInContentTocOpen, setIsInContentTocOpen] = useState(true);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 1. Real Page-View Count Engine with Anti-Inflation Safeguard
  const { 
    views: pageViews, 
    isCountedThisSession, 
    providerLabel,
    hasIncremented 
  } = usePageViewCount({
    articleId: article.id,
    baselineViews: article.views,
    engagementDelayMs: 3000,
    cooldownMinutes: 30
  });

  // Calculate dynamic reading statistics & word count
  const readingStats = useMemo(() => calculateReadingTime(article), [article]);

  // 2. Reader reaction counters
  const [reactions, setReactions] = useState({
    mindBlown: 48,
    appliedInProd: 34,
    superUseful: 95,
    saved: 61
  });
  const [userReacted, setUserReacted] = useState<Record<string, boolean>>({});

  // 3. Related Tools & Key Takeaways
  const relatedTools = useMemo(() => getRelatedToolsForArticle(article, 3), [article]);
  const keyTakeaways = useMemo(() => getKeyTakeawaysForArticle(article), [article]);
  const relatedArticlesList = useMemo(() => getRelatedArticles(article, 3), [article]);
  const alreadyLinkedSlugs = useMemo(() => new Set<string>(), [article.id]);

  // Resolve internal cross-reference links for SEO topic clusters and deep linking
  const internalCrossReferences = useMemo(() => {
    if (!article.seo?.internalLinkTargets || article.seo.internalLinkTargets.length === 0) {
      return [];
    }
    return article.seo.internalLinkTargets
      .map(targetSlug => allArticles.find(a => a.slug === targetSlug))
      .filter((a): a is Article => Boolean(a) && a.id !== article.id);
  }, [article]);

  // 5. Dynamic Table of Contents generation from H2 and H3 headings
  const tableOfContents = useMemo<TableOfContentsItem[]>(() => {
    const items: TableOfContentsItem[] = [];

    article.sections.forEach(sec => {
      items.push({
        id: sec.id,
        title: sec.heading,
        level: 2
      });

      if (sec.subsections) {
        sec.subsections.forEach(sub => {
          items.push({
            id: sub.id,
            title: sub.heading,
            level: 3
          });
        });
      }
    });

    if (article.faqs && article.faqs.length > 0) {
      items.push({
        id: 'faq-section',
        title: 'Frequently Asked Questions',
        level: 2
      });
    }

    items.push(
      { id: 'key-takeaways', title: 'Key Takeaways', level: 2 },
      { id: 'related-articles', title: 'Related Articles', level: 2 },
      { id: 'community-discussion', title: 'Discussion & Reviews', level: 2 }
    );

    return items;
  }, [article]);

  // 6. Scroll Spy & Active Position Tracking (Zero Forced Reflows via IntersectionObserver & rAF)
  useEffect(() => {
    let ticking = false;
    const handleWindowScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setShowScrollTop(scrollY > 400);
          // Estimate progress smoothly without triggering synchronous layout reflow on every pixel
          const approxMaxScroll = Math.max(1200, (tableOfContents.length || 8) * 380);
          const progress = Math.min(100, Math.max(0, (scrollY / approxMaxScroll) * 100));
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    handleWindowScroll();

    // Use IntersectionObserver instead of getBoundingClientRect() in scroll loop to eliminate forced reflows
    const allIds = tableOfContents.map(item => item.id);
    if (allIds.length > 0 && !activeHeadingId) {
      setActiveHeadingId(allIds[0]);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            setActiveHeadingId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
      observer.disconnect();
    };
  }, [tableOfContents]);

  // Smooth scroll to section heading using native CSS scroll-margin without reading getBoundingClientRect after DOM mutation
  const scrollToHeading = (id: string) => {
    setIsMobileTocOpen(false);
    window.requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const copyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeKey(key);
    setTimeout(() => setCopiedCodeKey(null), 2000);
  };

  const handleShareLink = (utmSource = '') => {
    const base = typeof window !== 'undefined' 
      ? `${window.location.origin}/articles/${article.slug}` 
      : `https://yinyangyohackers.com/articles/${article.slug}`;
    const url = utmSource ? `${base}?utm_source=${utmSource}&utm_medium=social_share` : base;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReaction = (type: 'mindBlown' | 'appliedInProd' | 'superUseful' | 'saved') => {
    if (userReacted[type]) return;
    setReactions(prev => ({ ...prev, [type]: prev[type] + 1 }));
    setUserReacted(prev => ({ ...prev, [type]: true }));
  };

  const handleDownloadMarkdown = () => {
    const mdContent = `---
title: "${article.title}"
date: "${article.date}"
category: "${article.category}"
author: "${article.author.name}"
tags: [${article.tags.map(t => `"${t}"`).join(', ')}]
source: "https://yinyangyohackers.com/articles/${article.slug}"
---

# ${article.h1}

> ${article.subtitle}

${article.intro.join('\n\n')}

${article.sections.map(s => `## ${s.heading}\n\n${s.body.join('\n\n')}${s.codeBlock ? `\n\n\`\`\`${s.codeBlock.language}\n${s.codeBlock.code}\n\`\`\`` : ''}`).join('\n\n')}

---
*Exported from YinYangYoHackers Publication*
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndices(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const articleUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/articles/${article.slug}` 
    : `https://yinyangyohackers.com/articles/${article.slug}`;

  const handleCopyMarkdownCitation = () => {
    const pubYear = article.date.split('-')[0] || '2025';
    const citation = `${article.author?.name || 'YinYangYoHackers Research Staff'}. "${article.title}". *YinYangYoHackers Autonomous Research*, ${pubYear}. [Online]. Available: ${articleUrl}`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation('markdown');
    setTimeout(() => setCopiedCitation(null), 2500);
  };

  const handleCopyBibtexCitation = () => {
    const citeKey = `yyh_${article.slug.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const pubYear = article.date.split('-')[0] || '2025';
    const bibtex = `@article{${citeKey},
  author    = {${article.author?.name || 'YinYangYoHackers Research Staff'}},
  title     = {${article.title}},
  journal   = {YinYangYoHackers Cybersecurity Research},
  year      = {${pubYear}},
  url       = {${articleUrl}},
  note      = {Accessed: ${new Date().toISOString().split('T')[0]}}
}`;
    navigator.clipboard.writeText(bibtex);
    setCopiedCitation('bibtex');
    setTimeout(() => setCopiedCitation(null), 2500);
  };

  // Structured Data (Schema.org JSON-LD with Rich Result FAQ & TechArticle Graph)
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "headline": article.title,
        "alternativeHeadline": article.h1,
        "description": article.seo?.metaDescription || article.summary,
        "image": article.coverImage?.src,
        "author": {
          "@type": "Person",
          "name": article.author.name,
          "jobTitle": article.author.role
        },
        "publisher": {
          "@type": "Organization",
          "name": "YinYangYoHackers",
          "url": "https://yinyangyohackers.com"
        },
        "datePublished": article.date,
        "dateModified": article.updatedDate || article.date,
        "wordCount": readingStats.wordCount,
        "timeRequired": `PT${readingStats.minutes}M`,
        "keywords": article.tags.join(", ")
      },
      ...(article.faqs && article.faqs.length > 0 ? [{
        "@type": "FAQPage",
        "mainEntity": article.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }] : [])
    ]
  };

  return (
    <div className="w-full relative">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      {/* Global Fixed Reading Progress Bar (Top of Screen) */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-900">
        <div 
          className="h-full bg-emerald-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sticky Top Reader Action Bar */}
      <div className="sticky top-0 z-40 bg-[#060a14] border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shadow-sm">
        {/* Left: Back Action & Compact Title */}
        <div className="flex items-center gap-2 min-w-0">
          <button 
            id="article-reader-back-btn"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-800/60 hover:border-emerald-500 font-mono text-xs font-bold shrink-0 transition-all duration-200"
            title="Return to Articles Feed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Breadcrumb snippet */}
          <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-slate-400 truncate">
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400 font-semibold">{article.category}</span>
            <span className="text-slate-600">/</span>
            <span className="truncate text-slate-300 max-w-xs">{article.title}</span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1 text-cyan-300 shrink-0" title={`Calculated from ${readingStats.wordCount.toLocaleString()} words in article body`}>
              <BookOpen className="w-3 h-3 text-cyan-400" />
              <span>{readingStats.text}</span>
            </span>
          </div>
        </div>

        {/* Right: Actions (TOC Toggle, SEO Audit, Markdown, Font, Bookmark, Share, Close) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile TOC Pill Trigger */}
          <button
            id="mobile-toc-toggle-btn"
            onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 text-xs font-mono font-medium hover:bg-slate-800 cursor-pointer"
            title="Open Table of Contents"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-xs">TOC ({tableOfContents.length})</span>
          </button>

          {/* Markdown Download */}
          <button
            onClick={handleDownloadMarkdown}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 text-xs font-mono font-semibold transition-colors cursor-pointer"
            title="Download Article as Markdown Note"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Download</span>
          </button>

          {/* Font Size Toggle */}
          <div className="hidden sm:inline-flex items-center gap-1 bg-slate-900 px-2 py-1 min-h-[44px] rounded-lg border border-slate-800 text-xs font-mono">
            <button 
              onClick={() => setFontSize('normal')}
              className={`px-2.5 py-1.5 min-h-[36px] min-w-[36px] rounded inline-flex items-center justify-center text-xs font-bold transition-colors cursor-pointer ${fontSize === 'normal' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Standard Font Size"
            >
              A
            </button>
            <button 
              onClick={() => setFontSize('large')}
              className={`px-2.5 py-1.5 min-h-[36px] min-w-[36px] rounded inline-flex items-center justify-center text-xs font-bold transition-colors cursor-pointer ${fontSize === 'large' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Large Font Size"
            >
              A+
            </button>
          </div>

          {/* Jump to Community Comments */}
          <button
            onClick={() => {
              const el = document.getElementById('community-discussion');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-2 min-h-[44px] rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-xs font-mono inline-flex items-center gap-1.5 transition-all cursor-pointer"
            title="Jump to Community Discussion & Reviews"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>{article.comments?.length || 0}</span>
          </button>

          {/* Bookmark Button */}
          <button
            id="article-bookmark-toggle-btn"
            onClick={(e) => onToggleBookmark(article.id, e)}
            className={`px-3 py-2 min-h-[44px] min-w-[44px] rounded-lg border text-xs font-mono inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isBookmarked 
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-400' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isBookmarked ? "Article Saved to Bookmarks" : "Save Article"}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            <span className="hidden xl:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>

          {/* Share Trigger */}
          <button
            id="article-share-toggle-btn"
            onClick={() => setIsShareDrawerOpen(!isShareDrawerOpen)}
            className={`px-3 py-2 min-h-[44px] min-w-[44px] rounded-lg border transition-all text-xs font-mono inline-flex items-center justify-center gap-1.5 cursor-pointer ${
              isShareDrawerOpen ? 'bg-cyan-950 border-cyan-600 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Share Article"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden xl:inline">Share</span>
          </button>

          {/* Close Article */}
          <button
            id="article-close-btn"
            onClick={onClose}
            className="p-2.5 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg bg-slate-900 hover:bg-red-950/70 text-slate-300 hover:text-red-400 border border-slate-800 transition-colors cursor-pointer"
            title="Close article"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Social Share Expandable Top Drawer */}
      {isShareDrawerOpen && (
        <div className="bg-[#050811] border-b border-slate-800 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-semibold">Share technical research:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Copy Direct Link */}
            <button
              onClick={() => handleShareLink('direct_copy')}
              className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 flex items-center gap-1.5 font-semibold transition-colors shadow-sm"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            {/* X / Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(articleUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#1da1f2]/20 hover:bg-[#1da1f2]/30 text-[#1da1f2] border border-[#1da1f2]/40 flex items-center gap-1.5 transition-colors font-medium"
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>X (Twitter)</span>
            </a>

            {/* Telegram */}
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#0088cc]/20 hover:bg-[#0088cc]/30 text-[#0088cc] border border-[#0088cc]/40 flex items-center gap-1.5 font-medium transition-colors"
              title="Share on Telegram"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram</span>
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#1877f2]/20 hover:bg-[#1877f2]/30 text-[#1877f2] border border-[#1877f2]/40 flex items-center gap-1.5 font-medium transition-colors"
              title="Share on Facebook"
            >
              <Facebook className="w-3.5 h-3.5" />
              <span>Facebook</span>
            </a>

            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#0077b5]/20 hover:bg-[#0077b5]/30 text-[#0077b5] border border-[#0077b5]/40 flex items-center gap-1.5 transition-colors font-medium"
              title="Share on LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>

            {/* Reddit */}
            <a
              href={`https://www.reddit.com/submit?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#ff4500]/20 hover:bg-[#ff4500]/30 text-[#ff4500] border border-[#ff4500]/40 flex items-center gap-1.5 font-medium transition-colors"
              title="Share on Reddit"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Reddit</span>
            </a>
          </div>
        </div>
      )}

      {/* Mobile Collapsible TOC Drawer */}
      {isMobileTocOpen && (
        <div className="lg:hidden bg-[#070c18] border-b border-slate-800 p-4 shadow-2xl animate-in slide-in-from-top duration-200 max-h-80 overflow-y-auto font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
            <span className="font-bold text-cyan-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Table of Contents
            </span>
            <button 
              onClick={() => setIsMobileTocOpen(false)}
              className="text-slate-400 hover:text-white p-2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded cursor-pointer"
              aria-label="Close table of contents"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <ul className="space-y-1.5">
            {tableOfContents.map((item, idx) => (
              <li key={`${item.id}-${idx}`} className={item.level === 3 ? 'pl-4' : ''}>
                <button
                  onClick={() => scrollToHeading(item.id)}
                  className={`text-left w-full truncate py-2 px-2 min-h-[44px] transition-colors flex items-center gap-2 rounded hover:bg-slate-900 cursor-pointer ${
                    activeHeadingId === item.id 
                      ? 'text-emerald-400 font-bold bg-slate-900/60' 
                      : 'text-slate-300 hover:text-cyan-300'
                  }`}
                >
                  <span className="text-[10px] text-slate-500 font-mono">
                    {item.level === 2 ? `${idx + 1}.` : ': '}
                  </span>
                  <span className="truncate">{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Grid: Reading Article Body (Left/Center) + Desktop Sticky Unobtrusive Sidebar (Right) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* ARTICLE MAIN READING COLUMN (Strict Layout: 15. Article Page Design)      */}
        {/* ========================================================================= */}
        <article 
          id="article-reading-container"
          itemScope
          itemType="https://schema.org/TechArticle"
          className="lg:col-span-8 bg-[#080d1a] border border-slate-800/90 rounded-2xl p-6 sm:p-10 space-y-8 relative"
        >
          <link itemProp="url" href={`https://yinyangyohackers.com/${article.slug}`} />
          <span itemProp="inLanguage" className="hidden">en-US</span>

          {/* 1. BREADCRUMBS */}
          <nav aria-label="Breadcrumb" className="relative z-10 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
            <button 
              onClick={onClose}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-400 font-medium"
            >
              <span>Home</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <button 
              onClick={() => {
                if (onSelectCategory) onSelectCategory(article.category);
                onClose();
              }}
              className="hover:text-emerald-400 transition-colors text-slate-300 font-medium"
            >
              {article.category}
            </button>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-400 truncate max-w-[200px] sm:max-w-none">{article.subcategory}</span>
          </nav>

          {/* 2. CATEGORY PILL */}
          <div className="relative z-10 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>{article.category}</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-900 text-cyan-300 border border-slate-800">
              {article.subcategory}
            </span>
          </div>

          {/* 3. H1 ARTICLE TITLE (Strictly the only H1 on the page) */}
          <div className="relative z-10 space-y-3">
            <h1 itemProp="headline" className="text-2xl sm:text-4xl lg:text-[2.6rem] font-black text-white tracking-tight leading-[1.2] font-sans">
              {article.h1}
            </h1>

            {/* 4. SHORT INTRODUCTION */}
            <p itemProp="description" className="text-slate-300 text-base sm:text-lg leading-relaxed font-sans font-normal border-l-2 border-emerald-500/80 pl-4 py-1">
              {article.subtitle}
            </p>
          </div>

          {/* 5. AUTHOR | PUBLISHED | UPDATED | READING TIME | VIEWS */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            {/* Author Profile */}
            <div className="flex items-center gap-3" itemProp="author" itemScope itemType="https://schema.org/Person">
              <img 
                src={getOptimizedSquareImageUrl(article.author.avatar, 88)} 
                alt={article.author.name}
                width={44}
                height={44}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                itemProp="image"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = HACKER_COVERS[0]; }}
                className="w-11 h-11 rounded-full border-2 border-emerald-500 object-cover shadow-sm aspect-square" 
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white font-sans" itemProp="name">{article.author.name}</span>
                  <span 
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-sm"
                    title="Verified Security Researcher & Subject Matter Expert"
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Verified Expert</span>
                  </span>
                </div>
                <div className="text-xs text-emerald-400 font-mono" itemProp="jobTitle">
                  {article.author.role}
                </div>
              </div>
            </div>

            {/* Metadata Bar (Published | Updated | Reading Time | Views) */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono text-slate-400 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 shadow-sm">
              {/* Published */}
              <span className="flex items-center gap-1.5" title={`Published on ${article.date}`}>
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <time itemProp="datePublished" dateTime={article.date}>Pub: {article.date}</time>
              </span>

              {/* Updated */}
              {article.updatedDate && (
                <>
                  <span className="text-slate-700 hidden sm:inline">•</span>
                  <span className="text-teal-300 hidden sm:inline" title={`Updated on ${article.updatedDate}`}>
                    <time itemProp="dateModified" dateTime={article.updatedDate}>Upd: {article.updatedDate}</time>
                  </span>
                </>
              )}

              {/* Dynamic Reading Time & Word Count */}
              <span className="text-slate-700">•</span>
              <span 
                className="inline-flex items-center gap-1.5 text-cyan-300 font-semibold bg-cyan-950/50 px-2.5 py-0.5 rounded-md border border-cyan-800/50 cursor-help hover:border-cyan-500/60 transition-colors"
                title={`Estimated reading time calculated from ${readingStats.wordCount.toLocaleString()} words in body content (~${readingStats.minutes} min read at 200 WPM)`}
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span itemProp="timeRequired" content={`PT${readingStats.minutes}M`}>{readingStats.text}</span>
                <span className="text-slate-400 font-normal">({readingStats.wordCount.toLocaleString()} words)</span>
              </span>

              {article.originalBloggerUrl && (
                <>
                  <span className="text-slate-700">•</span>
                  <a
                    href={article.originalBloggerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 transition-colors underline decoration-teal-500/40"
                    title="View original post on yinyangyohackers.blogspot.com"
                  >
                    <span>Blogger Archive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              )}

              {/* Verified Page-View Count */}
              <span className="text-slate-700">•</span>
              <div 
                className="inline-flex items-center gap-1.5 text-emerald-300 font-bold bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-800/60 shadow-sm"
                title={`${providerLabel} Deduplicated session view counter with rate-limiting safeguard`}
              >
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>{pageViews.toLocaleString()} views</span>
                {hasIncremented && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
            </div>
          </div>

          {/* YMYL Legal & Ethical Security Research Disclaimer Banner */}
          <aside 
            role="note" 
            aria-label="YMYL Security Research Disclaimer"
            className="relative z-10 p-3.5 sm:p-4 rounded-xl bg-amber-950/40 border border-amber-600/50 text-amber-200 text-xs font-mono leading-relaxed flex items-start gap-3 shadow-md"
          >
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <strong className="text-amber-300 font-bold uppercase tracking-wider block">
                YMYL Legal &amp; Ethical Security Disclaimer:
              </strong>
              <p className="text-amber-200/90 font-sans text-xs sm:text-sm">
                All cybersecurity techniques, code examples, penetration testing commands, and architectural blueprints published on YinYangYoHackers are provided strictly for authorized educational research, defensive security audits, and isolated laboratory verification. Attempting unauthorized penetration testing, port scanning, or vulnerability exploitation against computer systems or networks without explicit prior written authorization from the system owner is strictly illegal under cyber laws (including the CFAA and international cybercrime legislation). The author and publisher assume zero liability for unlawful application or misuse.
              </p>
            </div>
          </aside>

          {/* 6. HERO COVER IMAGE */}
          {article.coverImage?.src && (
            <figure className="relative z-10 rounded-2xl overflow-hidden border border-slate-800 bg-[#040711] shadow-2xl">
              <img
                src={article.coverImage.src}
                alt={article.coverImage.alt || article.title}
                width={article.coverImage.width || 1200}
                height={article.coverImage.height || 675}
                loading="eager"
                className="w-full h-auto aspect-video object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80';
                }}
              />
              <figcaption className="p-2.5 bg-[#070b16] border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="truncate">{article.coverImage.alt || article.title}</span>
                <span className="text-emerald-400 font-semibold shrink-0 ml-2">Verified Security Blueprint</span>
              </figcaption>
            </figure>
          )}

          {/* ======================================================================= */}
          {/* 7. ARTICLE CONTENT (Lead Intro + Table of Contents + H2/H3 Sections)   */}
          {/* ======================================================================= */}
          <div className={`space-y-8 font-sans ${fontSize === 'large' ? 'text-lg sm:text-xl leading-relaxed' : 'text-base sm:text-lg leading-relaxed'}`}>
            
            {/* Lead Intro Paragraphs */}
            <div className="space-y-4 text-slate-200 font-sans">
              {article.intro.map((para, idx) => (
                <p key={idx} className="first-of-type:text-xl sm:first-of-type:text-2xl first-of-type:font-medium first-of-type:text-slate-100 leading-relaxed">
                  <SemanticArticleText
                    text={para}
                    currentArticleId={article.id}
                    currentArticleSlug={article.slug}
                    alreadyLinkedSlugs={alreadyLinkedSlugs}
                    maxLinks={1}
                    onSelectArticle={onSelectRelatedArticle}
                  />
                </p>
              ))}
            </div>

            {/* IN-CONTENT TABLE OF CONTENTS (Section 16: Table of Contents) */}
            <div className="my-8 rounded-2xl bg-[#050914] border border-slate-800/90 shadow-xl overflow-hidden">
              <div 
                onClick={() => setIsInContentTocOpen(!isInContentTocOpen)}
                className="bg-[#090f20] px-5 py-3.5 border-b border-slate-800/90 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5 font-mono text-xs font-bold text-white uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Table of Contents</span>
                  <span className="text-slate-500 text-[11px]">({tableOfContents.length} Sections)</span>
                </div>
                <button 
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-xs font-mono"
                  aria-label="Toggle Table of Contents"
                >
                  <span className="text-[11px]">{isInContentTocOpen ? 'Collapse' : 'Expand'}</span>
                  {isInContentTocOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>

              {isInContentTocOpen && (
                <div className="p-5 sm:p-6 bg-[#040812]">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm sm:text-base font-sans">
                    {tableOfContents.map((item, idx) => (
                      <li key={`${item.id}-${idx}`} className={`flex items-start gap-2 ${item.level === 3 ? 'pl-4 border-l border-slate-800' : ''}`}>
                        <span className="text-emerald-400 font-mono text-xs font-bold shrink-0 mt-0.5">
                          {item.level === 2 ? `${idx + 1}.` : ': '}
                        </span>
                        <button
                          onClick={() => scrollToHeading(item.id)}
                          className="text-left text-slate-300 hover:text-cyan-300 hover:underline transition-colors font-medium"
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* CORE H2 & H3 SECTIONS FLOW */}
            <div itemProp="articleBody" className="space-y-10">
              {article.sections.map((section, sIdx) => (
                <section key={`${section.id}-${sIdx}`} id={section.id} className="space-y-4 pt-6 border-t border-slate-800/80 scroll-mt-24">
                  {/* Semantic H2 Heading */}
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white font-sans flex items-center gap-2.5 group">
                    <span className="text-emerald-400 font-mono text-lg sm:text-xl font-bold">#</span>
                    <span>{section.heading}</span>
                  </h2>

                  {/* Section Paragraphs */}
                  <div className={`space-y-4 text-slate-200 leading-relaxed font-sans ${fontSize === 'large' ? 'text-lg sm:text-xl' : 'text-base sm:text-[18px]'}`}>
                    {section.body.map((p, pIdx) => (
                      <p key={pIdx}>
                        <SemanticArticleText
                          text={p}
                          currentArticleId={article.id}
                          currentArticleSlug={article.slug}
                          alreadyLinkedSlugs={alreadyLinkedSlugs}
                          maxLinks={1}
                          onSelectArticle={onSelectRelatedArticle}
                        />
                      </p>
                    ))}
                  </div>

                  {/* Optional Nested H3 Subsections */}
                  {section.subsections && section.subsections.map((sub) => (
                    <div key={sub.id} id={sub.id} className="pl-4 sm:pl-6 border-l-2 border-cyan-700/60 space-y-3 my-6 scroll-mt-24">
                      {/* Semantic H3 Heading */}
                      <h3 className="text-lg sm:text-xl font-bold text-slate-100 font-sans flex items-center gap-2">
                        <span className="text-cyan-400 font-mono text-sm">##</span>
                        <span>{sub.heading}</span>
                      </h3>
                      <div className={`space-y-3 text-slate-200 leading-relaxed font-sans ${fontSize === 'large' ? 'text-base sm:text-lg' : 'text-base sm:text-[17px]'}`}>
                        {sub.body.map((subP, subIdx) => (
                          <p key={subIdx}>
                            <SemanticArticleText
                              text={subP}
                              currentArticleId={article.id}
                              currentArticleSlug={article.slug}
                              alreadyLinkedSlugs={alreadyLinkedSlugs}
                              maxLinks={1}
                              onSelectArticle={onSelectRelatedArticle}
                            />
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Optional Callout Box */}
                  {section.callout && (
                    <div className={`p-4 sm:p-5 rounded-xl border flex items-start gap-3.5 my-5 ${
                      section.callout.type === 'danger' ? 'bg-red-950/30 border-red-800/60 text-red-200' :
                      section.callout.type === 'warning' ? 'bg-amber-950/30 border-amber-800/60 text-amber-200' :
                      section.callout.type === 'tip' ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200' :
                      'bg-cyan-950/30 border-cyan-800/60 text-cyan-200'
                    }`}>
                      {section.callout.type === 'danger' && <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
                      {section.callout.type === 'warning' && <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
                      {section.callout.type === 'tip' && <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                      {section.callout.type === 'info' && <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />}

                      <div className="space-y-1 text-sm sm:text-base">
                        <div className="font-bold font-mono uppercase tracking-wider">{section.callout.title}</div>
                        <p className="leading-relaxed opacity-95">{section.callout.text}</p>
                      </div>
                    </div>
                  )}

                  {/* Optional Comparison Table */}
                  {section.table && (
                    <div className="overflow-x-auto my-6 border border-slate-800 rounded-xl bg-[#050811] shadow-lg">
                      {section.table.caption && (
                        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-300 font-semibold flex items-center justify-between">
                          <span>{section.table.caption}</span>
                          <span className="text-[10px] text-emerald-400 uppercase">Verified Spec</span>
                        </div>
                      )}
                      <table className="w-full text-left text-xs sm:text-sm font-mono">
                        <thead className="bg-[#0a1122] text-cyan-300 border-b border-slate-800">
                          <tr>
                            {section.table.headers.map((h, hIdx) => (
                              <th key={hIdx} className="px-4 py-3 font-bold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {section.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-900/50 transition-colors">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="px-4 py-3 text-slate-300 font-sans">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Optional Syntax-Highlighted Code Block */}
                  {section.codeBlock && (
                    <div className="rounded-xl overflow-hidden border border-slate-800 my-5 bg-[#040711] shadow-xl">
                      <div className="bg-[#090f1f] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                          <span className="text-slate-300 ml-2 font-bold flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                            {section.codeBlock.filename || section.codeBlock.language}
                          </span>
                        </div>
                        <button
                          onClick={() => copyCode(section.codeBlock!.code, section.id)}
                          className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors font-medium px-2 py-1 rounded bg-slate-900 hover:bg-slate-800"
                        >
                          {copiedCodeKey === section.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCodeKey === section.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="p-4 sm:p-5 text-xs sm:text-sm font-mono text-emerald-300 overflow-x-auto leading-relaxed bg-[#02050c]">
                        <code>{section.codeBlock.code}</code>
                      </pre>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Optional FAQs Section */}
            {article.faqs && article.faqs.length > 0 && (
              <section id="faq-section" itemScope itemType="https://schema.org/FAQPage" className="space-y-4 pt-8 border-t border-slate-800 scroll-mt-24">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-sans flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  <span>Frequently Asked Questions</span>
                </h2>
                <div className="space-y-2.5">
                  {article.faqs.map((faq, idx) => (
                    <div key={idx} itemScope itemProp="mainEntity" itemType="https://schema.org/Question" className="border border-slate-800 rounded-xl bg-[#050811] overflow-hidden">
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full p-4 text-left font-semibold text-xs sm:text-sm text-slate-200 hover:text-white flex items-center justify-between gap-2 transition-colors font-sans"
                      >
                        <span itemProp="name">{faq.question}</span>
                        {openFaqIndices.includes(idx) ? <ChevronDown className="w-4 h-4 text-emerald-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />}
                      </button>
                      {openFaqIndices.includes(idx) && (
                        <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer" className="p-4 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans border-t border-slate-800/40">
                          <div itemProp="text">{faq.answer}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reader Feedback Reactions Bar */}
            <div className="p-5 bg-[#050811] border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="text-xs font-mono font-bold text-slate-300 uppercase">Reader Feedback &amp; Reactions</div>
                <p className="text-[11px] text-slate-500 font-sans">Let the author know how this blueprint helped your security workflow.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleReaction('mindBlown')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
                    userReacted['mindBlown'] ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🔥 Mind Blown</span>
                  <span className="font-bold">{reactions.mindBlown}</span>
                </button>

                <button
                  onClick={() => handleReaction('appliedInProd')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
                    userReacted['appliedInProd'] ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🛡️ Applied in Prod</span>
                  <span className="font-bold">{reactions.appliedInProd}</span>
                </button>

                <button
                  onClick={() => handleReaction('superUseful')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
                    userReacted['superUseful'] ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>💡 Super Useful</span>
                  <span className="font-bold">{reactions.superUseful}</span>
                </button>
              </div>
            </div>

            {/* =================================================================== */}
            {/* 8. KEY TAKEAWAYS (Strict Order)                                     */}
            {/* =================================================================== */}
            <section id="key-takeaways" className="p-6 sm:p-7 rounded-2xl bg-[#06121c] border border-cyan-800/80 space-y-4 shadow-sm scroll-mt-24">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Key Engineering &amp; Defensive Takeaways</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white font-sans">
                Key Engineering Takeaways
              </h2>

              <ul className="space-y-3 pt-1 text-xs sm:text-sm font-sans text-slate-200">
                {keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-600/70 text-cyan-300 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* =================================================================== */}
            {/* 8.5 CITE & SYNDICATE TECHNICAL RESEARCH (Organic Growth Engine)     */}
            {/* =================================================================== */}
            <section className="p-5 sm:p-6 rounded-2xl bg-[#050b16] border border-slate-800 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Cite &amp; Syndicate Research
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Open Attribution &bull; Canonical DOI Reference
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Referencing this technical blueprint in an academic paper, threat advisory, or engineering documentation? 
                Use the verified citation templates below to provide canonical attribution.
              </p>

              {/* Citations Copy Row */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleCopyMarkdownCitation}
                  className="px-3.5 py-2 min-h-[38px] rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 hover:text-emerald-200 border border-emerald-800/60 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {copiedCitation === 'markdown' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCitation === 'markdown' ? 'Markdown Citation Copied' : 'Copy Markdown Citation'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyBibtexCitation}
                  className="px-3.5 py-2 min-h-[38px] rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-cyan-800/60 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {copiedCitation === 'bibtex' ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Terminal className="w-3.5 h-3.5" />}
                  <span>{copiedCitation === 'bibtex' ? 'BibTeX Entry Copied' : 'Copy BibTeX Entry'}</span>
                </button>
              </div>

              {/* Technical Community Syndication */}
              <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <span className="text-slate-400">Syndicate to Security Communities:</span>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`https://news.ycombinator.com/submitlink?u=${encodeURIComponent(articleUrl)}&t=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#ff6600]/15 hover:bg-[#ff6600]/25 text-[#ff6600] border border-[#ff6600]/40 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Hacker News</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <a
                    href={`https://www.reddit.com/r/netsec/submit?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#ff4500]/15 hover:bg-[#ff4500]/25 text-[#ff4500] border border-[#ff4500]/40 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>/r/netsec</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(articleUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#1da1f2]/15 hover:bg-[#1da1f2]/25 text-[#1da1f2] border border-[#1da1f2]/40 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Twitter className="w-3 h-3" />
                    <span>X</span>
                  </a>
                </div>
              </div>
            </section>

            {/* =================================================================== */}
            {/* 8.8 AUTOMATED SEMANTIC TOPIC GRAPH (Crawl & Cluster Acceleration)   */}
            {/* =================================================================== */}
            <ContextualSemanticMesh
              article={article}
              onSelectArticle={onSelectRelatedArticle}
            />

            {/* =================================================================== */}
            {/* 9. RELATED ARTICLES & INTERNAL LINKS (Strict Order)                 */}
            {/* =================================================================== */}
            <section id="related-articles" className="space-y-5 pt-6 border-t border-slate-800 scroll-mt-24">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-sans flex items-center gap-2">
                  <Compass className="w-5 h-5 text-cyan-400" />
                  <span>Connected Articles in this Topic Cluster</span>
                </h2>
                <span className="text-xs font-mono text-slate-500">Internal Research Network</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {relatedArticlesList.map(rel => {
                  const relCover = getArticleCoverImage(rel);
                  const relReadingStats = calculateReadingTime(rel);
                  const isCdn = relCover.src.includes('images.unsplash.com');
                  const avifSrcSet = isCdn ? getResponsiveSrcSet(relCover.src, [320, 480, 640], 'avif') : '';
                  const webpSrcSet = isCdn ? getResponsiveSrcSet(relCover.src, [320, 480, 640], 'webp') : '';
                  const relOptimizedSrc = getOptimizedImageUrl(relCover.src, 480, 80, 'webp', 270);
                  const relHref = `/${rel.slug}`;

                  return (
                    <a 
                      key={rel.id}
                      href={relHref}
                      aria-label={`Read related analysis: ${rel.title}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (onSelectRelatedArticle) onSelectRelatedArticle(rel);
                        window.scrollTo({ top: 0, behavior: 'instant' });
                      }}
                      className="p-3.5 rounded-xl bg-[#050811] border border-slate-800 hover:border-emerald-500/70 cursor-pointer transition-all hover:bg-slate-900/60 flex flex-col justify-between group shadow-md"
                    >
                      <div>
                        {/* 16:9 Thumbnail with Modern Picture Formats & Responsive Sizing */}
                        <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden mb-3 bg-[#03060f] border border-slate-800/80">
                          <picture className="w-full h-full block">
                            {isCdn && avifSrcSet && (
                              <source type="image/avif" srcSet={avifSrcSet} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px" />
                            )}
                            {isCdn && webpSrcSet && (
                              <source type="image/webp" srcSet={webpSrcSet} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px" />
                            )}
                            <img
                              src={relOptimizedSrc}
                              srcSet={webpSrcSet || undefined}
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                              alt={relCover.alt}
                              width={480}
                              height={270}
                              loading="lazy"
                              decoding="async"
                              referrerPolicy="no-referrer"
                              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = HACKER_COVERS[0]; }}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 aspect-[16/9]"
                            />
                          </picture>
                        </div>

                        <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">{rel.category}</span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-2 mt-1">
                          {rel.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                          {rel.summary}
                        </p>
                      </div>

                      <div className="pt-3 flex items-center justify-between text-[11px] font-mono text-slate-500 group-hover:text-cyan-300 transition-colors">
                        <span className="inline-flex items-center gap-1" title={`${relReadingStats.wordCount.toLocaleString()} words`}>
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>{relReadingStats.text}</span>
                        </span>
                        <span className="flex items-center gap-1 font-bold">
                          Read Guide &rarr;
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Direct Internal Knowledge Links & Cross-References */}
              {internalCrossReferences.length > 0 && (
                <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-emerald-900/40 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                    <Link2 className="w-4 h-4" />
                    <span>Direct Knowledge Cross-References (Internal Links)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {internalCrossReferences.map(cross => (
                      <a
                        key={cross.id}
                        href={`/${cross.slug}`}
                        aria-label={`Explore cross-reference: ${cross.title}`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onSelectRelatedArticle) onSelectRelatedArticle(cross);
                          window.scrollTo({ top: 0, behavior: 'instant' });
                        }}
                        className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 transition-all flex items-center justify-between group"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono text-cyan-400 block">{cross.category}</span>
                          <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors line-clamp-1">
                            {cross.title}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Author Extended Profile Box */}
            <div className="bg-[#050811] border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <img 
                src={getOptimizedSquareImageUrl(article.author.avatar, 128)} 
                alt={article.author.name}
                width={64}
                height={64}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = HACKER_COVERS[0]; }}
                className="w-16 h-16 rounded-full border-2 border-emerald-500 object-cover shrink-0 shadow-md aspect-square" 
              />
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="font-bold text-white text-base">{article.author.name}</span>
                  <span 
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-sm"
                    title="Verified Security Researcher & Subject Matter Expert"
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Verified Expert</span>
                  </span>
                </div>
                <div className="text-xs text-emerald-400 font-mono">{article.author.role}</div>
                <p className="text-xs text-slate-400 leading-relaxed pt-1 font-sans">
                  {article.author.bio || 'Cybersecurity instructor, CEH, and founder of YinYangYoHackers teaching offensive security, local sovereign systems, and defensive engineering.'}
                </p>
              </div>
            </div>

            {/* =================================================================== */}
            {/* 11. COMMUNITY DISCUSSION & PEER REVIEWS                           */}
            {/* =================================================================== */}
            <section id="community-discussion" className="scroll-mt-24">
              <CommentsSection
                articleId={article.id}
                articleTitle={article.title}
                comments={article.comments || []}
                onAddComment={(commentData) => onAddComment?.(article.id, commentData)}
                onAddReply={(parentCommentId, replyData) => onAddReply?.(article.id, parentCommentId, replyData)}
                onToggleLike={(commentId, isReply, parentId) => onToggleCommentLike?.(article.id, commentId, isReply, parentId)}
              />
            </section>

            {/* =================================================================== */}
            {/* 12. SOCIAL SHARING & VIRAL CARD EXPORT                             */}
            {/* =================================================================== */}
            <section id="social-sharing-footer" className="p-6 rounded-2xl bg-gradient-to-r from-[#070d1a] to-[#040810] border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">Found this research valuable?</h3>
                  <p className="text-xs text-slate-400 font-sans">Share with your security team or engineering peers.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Copy Direct Link */}
                  <button
                    onClick={() => handleShareLink('footer_copy')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>

                  {/* Copy CLI curl Command */}
                  <button
                    onClick={() => {
                      const cmd = `curl -s https://yinyangyohackers.com/article/${article.slug}`;
                      navigator.clipboard.writeText(cmd);
                      setCopiedCurl(true);
                      setTimeout(() => setCopiedCurl(false), 2000);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs flex items-center gap-1.5 transition-all"
                    title="Copy CLI curl command for terminal readers"
                  >
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{copiedCurl ? 'cURL Copied!' : 'cURL'}</span>
                  </button>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(articleUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#1da1f2]/20 hover:bg-[#1da1f2]/30 text-[#1da1f2] border border-[#1da1f2]/40 transition-colors"
                    title="Share on X / Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>

                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#0088cc]/20 hover:bg-[#0088cc]/30 text-[#0088cc] border border-[#0088cc]/40 transition-colors"
                    title="Share on Telegram"
                  >
                    <Send className="w-4 h-4" />
                  </a>

                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#1877f2]/20 hover:bg-[#1877f2]/30 text-[#1877f2] border border-[#1877f2]/40 transition-colors"
                    title="Share on Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>

                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#0077b5]/20 hover:bg-[#0077b5]/30 text-[#0077b5] border border-[#0077b5]/40 transition-colors"
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>

                  <a
                    href={`https://www.reddit.com/submit?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#ff4500]/20 hover:bg-[#ff4500]/30 text-[#ff4500] border border-[#ff4500]/40 transition-colors"
                    title="Share on Reddit"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </section>

          </div>
        </article>

        {/* ========================================================================= */}
        {/* DESKTOP STICKY UNOBTRUSIVE NAVIGATION SIDEBAR (Right Column)              */}
        {/* ========================================================================= */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-20 space-y-5">
          {/* 1. Article Navigation & Live Scroll Spy Card */}
          <div className="bg-[#080d1a] border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-300">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Article Navigation</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                {Math.round(scrollProgress)}% read • {readingStats.text}
              </span>
            </div>

            {/* Mini Progress Bar */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-150"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>

            {/* Scroll Spy Table of Contents Jump Links */}
            <div className="max-h-[380px] overflow-y-auto pr-1 space-y-1 text-xs font-mono scrollbar-thin scrollbar-thumb-slate-800">
              {tableOfContents.map((item, idx) => (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => scrollToHeading(item.id)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all flex items-center gap-2 truncate ${
                    activeHeadingId === item.id 
                      ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-bold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  } ${item.level === 3 ? 'pl-5 text-[11px]' : ''}`}
                >
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {item.level === 2 ? `${idx + 1}.` : ': '}
                  </span>
                  <span className="truncate">{item.title}</span>
                </button>
              ))}
            </div>

            {/* Quick Jumps */}
            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => scrollToHeading('key-takeaways')}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 text-center font-medium transition-colors"
              >
                Key Takeaways
              </button>
              <button
                onClick={() => scrollToHeading('related-articles')}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-800 text-center font-medium transition-colors"
              >
                Related Posts
              </button>
            </div>
          </div>

          {/* 2. Verified Page View & System Verification Card */}
          <div className="bg-[#080d1a] border border-slate-800/90 rounded-2xl p-4 shadow-xl space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-slate-300">Analytics Engine</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">VERIFIED</span>
            </div>
            
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Views:</span>
                <span className="text-emerald-300 font-bold text-sm">{pageViews.toLocaleString()}</span>
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                {providerLabel}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
              <span>Anti-Spam Deduplicated</span>
              <span>Zero PII Tracked</span>
            </div>
          </div>

          {/* 3. Back to Top Button */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-700/60 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          )}
        </aside>

      </div>
    </div>
  );
};
