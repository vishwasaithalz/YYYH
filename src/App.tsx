/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ArticleCard, ArticleCardSkeleton } from './components/ArticleCard';
import { HeroBanner } from './components/HeroBanner';
import { SEO_LANDING_META as SEO_LANDING_PAGES, TOOL_PAGES_META as TOOL_PAGES } from './data/routeMetaData';
import { BreadcrumbNav } from './components/BreadcrumbNav';
import { HackerCookieConsent } from './components/HackerCookieConsent';
import { HackerBannerAd } from './components/HackerBannerAd';
import { Footer } from './components/Footer';
import { DirectContactDesk } from './components/DirectContactDesk';
import { SupportedLanguage } from './utils/i18n';
import { articlesIndex as allArticles } from './data/articlesIndexData';
import { getInitialCommentsForArticle, saveRealCommentsForArticle } from './data/seedComments';
import { Article, PrimaryCategory, ThemeMode, Comment, ActiveSiteView } from './types';
import { useDynamicMeta } from './hooks/useDynamicMeta';
import { 
  Grid, 
  List, 
  Bookmark, 
  X, 
  ShieldAlert,
  ChevronDown,
  Compass
} from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

// Code-split secondary modals and views to reduce initial critical JS download size and request chains
const ArticleModal = React.lazy(() => import('./components/ArticleModal').then(m => ({ default: m.ArticleModal })));
const AboutView = React.lazy(() => import('./components/AboutView').then(m => ({ default: m.AboutView })));
const DisclaimerView = React.lazy(() => import('./components/DisclaimerView').then(m => ({ default: m.DisclaimerView })));
const ContactView = React.lazy(() => import('./components/ContactView').then(m => ({ default: m.ContactView })));
const NotFoundView = React.lazy(() => import('./components/NotFoundView').then(m => ({ default: m.NotFoundView })));
const ToolsSuite = React.lazy(() => import('./components/ToolsSuite').then(m => ({ default: m.ToolsSuite })));
const CtfArena = React.lazy(() => import('./components/CtfArena').then(m => ({ default: m.CtfArena })));
const ContentClustersMap = React.lazy(() => import('./components/ContentClustersMap').then(m => ({ default: m.ContentClustersMap })));
const SeoLandingView = React.lazy(() => import('./components/SeoLandingView').then(m => ({ default: m.SeoLandingView })));
const SovereignAiHubView = React.lazy(() => import('./components/SovereignAiHubView').then(m => ({ default: m.SovereignAiHubView })));
const StandaloneToolView = React.lazy(() => import('./components/StandaloneToolView').then(m => ({ default: m.StandaloneToolView })));
const PrivacyPolicyView = React.lazy(() => import('./components/PrivacyPolicyView').then(m => ({ default: m.PrivacyPolicyView })));
const TermsView = React.lazy(() => import('./components/TermsView').then(m => ({ default: m.TermsView })));
const ContentRoadmapView = React.lazy(() => import('./components/ContentRoadmapView').then(m => ({ default: m.ContentRoadmapView })));
const CheatsheetsView = React.lazy(() => import('./components/CheatsheetsView').then(m => ({ default: m.CheatsheetsView })));
const TerminalWindow = React.lazy(() => import('./components/TerminalWindow').then(m => ({ default: m.TerminalWindow })));
const RssModal = React.lazy(() => import('./components/RssModal').then(m => ({ default: m.RssModal })));
const SeoInspectorModal = React.lazy(() => import('./components/SeoInspectorModal').then(m => ({ default: m.SeoInspectorModal })));
const MaintenanceView = React.lazy(() => import('./components/MaintenanceView').then(m => ({ default: m.MaintenanceView })));

export default function App() {
  // Articles state initialized with lightweight index metadata (full article bodies lazy-loaded on demand)
  const [articles, setArticles] = useState<Article[]>(() => {
    return allArticles.map(a => ({
      ...a,
      comments: getInitialCommentsForArticle(a.slug, a.comments)
    }));
  });

  // Navigation & View States
  const [currentCategory, setCurrentCategory] = useState<PrimaryCategory | 'All'>('All');
  const [activeView, setActiveView] = useState<ActiveSiteView>('blog');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isRssOpen, setIsRssOpen] = useState<boolean>(false);
  const [isBloggerModalOpen, setIsBloggerModalOpen] = useState<boolean>(false);
  const [isSeoInspectorOpen, setIsSeoInspectorOpen] = useState<boolean>(false);
  const [seoInspectorArticle, setSeoInspectorArticle] = useState<Article | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'stream'>('grid');
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [activeToolSlug, setActiveToolSlug] = useState<string | null>(null);

  // Dynamically update document title, meta tags, OpenGraph, and Schema.org JSON-LD based on selected article, category, active view & active tool
  useDynamicMeta(selectedArticle, currentCategory, activeView, { activeToolSlug });

  // Listeners for global maintenance preview & language toggling
  useEffect(() => {
    const handleOpenMaintenance = () => {
      setActiveView('maintenance');
      setSelectedArticle(null);
    };
    const handleToggleLanguage = () => {
      const langs: SupportedLanguage[] = ['en', 'es', 'de', 'fr', 'ja', 'hi'];
      setLanguage(prev => {
        const nextIdx = (langs.indexOf(prev) + 1) % langs.length;
        return langs[nextIdx];
      });
    };

    window.addEventListener('open-maintenance-view', handleOpenMaintenance);
    window.addEventListener('toggle-language', handleToggleLanguage);
    return () => {
      window.removeEventListener('open-maintenance-view', handleOpenMaintenance);
      window.removeEventListener('toggle-language', handleToggleLanguage);
    };
  }, []);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('yyyh_bookmarks_v2');
      return saved ? JSON.parse(saved) : ['cyber-1', 'ai-1', 'how-1', 'tool-1'];
    } catch {
      return ['cyber-1', 'ai-1', 'how-1', 'tool-1'];
    }
  });

  // Theme: Obsidian Stealth (Default), Crimson Hacker, Midnight Blue
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('yyyh_theme') as ThemeMode;
      if (saved === 'obsidian-stealth' || saved === 'crimson-hacker' || saved === 'midnight-blue' || saved === 'light') {
        return saved;
      }
      return 'obsidian-stealth';
    } catch {
      return 'obsidian-stealth';
    }
  });

  // Initial loading state false by default for instant First & Largest Contentful Paint (sub-2.5s)
  const [isLoading, setIsLoading] = useState(false);

  // Global Keyboard Shortcuts Hook
  // '/' -> Focus search input
  // 'Esc' -> Close active reader, modals, or drawers
  // 'b' -> Toggle bookmarks drawer
  // 't' -> Toggle interactive terminal
  // 'r' -> Open RSS syndication modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. ESC should ALWAYS close open modals and active reader regardless of focus
      if (e.key === 'Escape') {
        if (isSeoInspectorOpen) {
          setIsSeoInspectorOpen(false);
          return;
        }
        if (isRssOpen) {
          setIsRssOpen(false);
          return;
        }
        if (isBookmarksOpen) {
          setIsBookmarksOpen(false);
          return;
        }
        if (isTerminalOpen) {
          setIsTerminalOpen(false);
          return;
        }
        if (selectedArticle) {
          setSelectedArticle(null);
          return;
        }
        // If in an input, blur it
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        return;
      }

      // 2. Check if currently typing in an editable field
      const target = e.target as HTMLElement | null;
      const isInputFocused = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      );

      // If user is actively typing in a form or search box, do not intercept regular letter keys
      if (isInputFocused) {
        return;
      }

      // 3. Focus search on '/' or 'Ctrl+K' / 'Cmd+K'
      if (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input') as HTMLInputElement | null;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
        return;
      }

      // 4. Toggle Bookmarks on 'b' / 'B'
      if (e.key.toLowerCase() === 'b' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsBookmarksOpen(prev => !prev);
        return;
      }

      // 5. Toggle Terminal on 't' / 'T'
      if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
        return;
      }

      // 6. Open RSS Feed modal on 'r' / 'R'
      if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsRssOpen(prev => !prev);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSeoInspectorOpen, isRssOpen, isBookmarksOpen, isTerminalOpen, selectedArticle]);

  // Listener for custom 'open-seo-inspector' event
  useEffect(() => {
    const handleOpenSeo = (e: any) => {
      setSeoInspectorArticle(e?.detail?.article || selectedArticle || null);
      setIsSeoInspectorOpen(true);
    };
    window.addEventListener('open-seo-inspector', handleOpenSeo);
    return () => window.removeEventListener('open-seo-inspector', handleOpenSeo);
  }, [selectedArticle]);

  // Save bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('yyyh_bookmarks_v2', JSON.stringify(bookmarks));
    } catch {
      // ignore
    }
  }, [bookmarks]);

  // Save & apply theme
  useEffect(() => {
    try {
      localStorage.setItem('yyyh_theme', theme);
    } catch {
      // ignore
    }
    const root = document.documentElement;
    root.classList.remove('theme-obsidian-stealth', 'theme-crimson-hacker', 'theme-midnight-blue', 'theme-cyber-dark', 'theme-matrix-green', 'theme-terminal-amber', 'theme-light-ops');
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  // Toggle Bookmark
  const handleToggleBookmark = useCallback((articleId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarks(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  }, []);

  // Filter & Search Logic
  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      // 1. Category Filter
      if (currentCategory !== 'All') {
        const normCurrent = (currentCategory === 'Cybersecurity' || currentCategory === 'Blueprint')
          ? 'Cyber Security'
          : (currentCategory === 'Autonomous Systems & Productivity' || currentCategory === 'Autonomous Systems Hub')
            ? 'Autonomous Systems Hub'
            : (currentCategory === 'Tools & Apps')
              ? 'Security Tools'
              : currentCategory;
        const normArt = (art.category === 'Cybersecurity' || art.category === 'Blueprint')
          ? 'Cyber Security'
          : (art.category === 'Autonomous Systems & Productivity' || art.category === 'Autonomous Systems Hub')
            ? 'Autonomous Systems Hub'
            : (art.category === 'Tools & Apps')
              ? 'Security Tools'
              : art.category;
        if (normArt !== normCurrent) {
          return false;
        }
      }

      // 2. Search Query Filter
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchTitle = art.title.toLowerCase().includes(q);
      const matchSummary = art.summary.toLowerCase().includes(q);
      const matchTags = art.tags.some(t => t.toLowerCase().includes(q));
      const matchAuthor = art.author.name.toLowerCase().includes(q);

      return matchTitle || matchSummary || matchTags || matchAuthor;
    });
  }, [articles, currentCategory, searchQuery]);

  // Reset pagination when category or search changes
  useEffect(() => {
    setVisibleCount(8);
  }, [currentCategory, searchQuery, activeView]);

  // Navigation handler supporting clean descriptive URLs
  const handleNavigate = useCallback((view: ActiveSiteView, path?: string) => {
    if (path && (path.startsWith('/tools/') || path.startsWith('tools/'))) {
      const slug = path.replace(/^\/?tools\//, '');
      if (TOOL_PAGES[slug]) {
        setActiveToolSlug(slug);
        setActiveView('tools');
        setSelectedArticle(null);
        try {
          if (window.location.pathname !== path) {
            window.history.pushState({ tool: slug }, '', path);
          }
        } catch {
          // ignore
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    setActiveToolSlug(null);
    setActiveView(view);
    setSelectedArticle(null);
    const targetPath = path || (view === 'blog' ? '/' : `/${view}`);
    try {
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ view }, '', targetPath);
      }
    } catch {
      // In restricted iframes where pushState is sandboxed, state is managed cleanly in memory
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Tag click filter handler
  const handleSelectTag = useCallback((tag: string) => {
    setSearchQuery(tag);
    setCurrentCategory('All');
    if (activeView !== 'blog') {
      setActiveView('blog');
    }
    setSelectedArticle(null);
    const el = document.getElementById('articles-directory-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeView]);

  // Deep-linking, Clean Descriptive URL router with 404 handler
  useEffect(() => {
    const handleRoute = () => {
      let routeKey = '';

      // 1. Check URL query parameters first (e.g. ?tool=cidr-calculator, ?view=sovereign-hub, ?p=/tools/hash-analyzer)
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const queryTool = searchParams.get('tool') || searchParams.get('toolSlug');
        if (queryTool) {
          const cleanTool = queryTool.replace(/^\/?tools\//, '').trim().toLowerCase();
          if (TOOL_PAGES[cleanTool]) {
            setActiveToolSlug(cleanTool);
            setActiveView('tools');
            setSelectedArticle(null);
            return;
          }
        }

        const queryView = searchParams.get('view') || searchParams.get('page') || searchParams.get('route') || searchParams.get('p') || searchParams.get('path');
        if (queryView) {
          routeKey = queryView.replace(/^\/+|\/+$/g, '').trim().toLowerCase();
        }
      } catch {
        // ignore
      }

      // 2. If no query route, check clean pathname and hash
      if (!routeKey) {
        const rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
        const rawHash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
        routeKey = rawPath || rawHash;
      }

      if (!routeKey) {
        // Root homepage
        setActiveView('blog');
        setActiveToolSlug(null);
        setSelectedArticle(null);
        return;
      }

      // 3. Standalone Indexable Tools Routing
      if (routeKey.startsWith('tools/') || routeKey.startsWith('/tools/')) {
        const toolSlug = routeKey.replace(/^\/?tools\//, '');
        if (TOOL_PAGES[toolSlug]) {
          setActiveToolSlug(toolSlug);
          setActiveView('tools');
          setSelectedArticle(null);
          return;
        }
      }
      if (TOOL_PAGES[routeKey]) {
        setActiveToolSlug(routeKey);
        setActiveView('tools');
        setSelectedArticle(null);
        return;
      }

      // 4. Autonomous Systems Knowledge Hub Master View
      if (routeKey === 'sovereign-hub' || routeKey === 'sovereign-ai-hub' || routeKey === 'view=sovereign-hub') {
        setActiveToolSlug(null);
        setActiveView('sovereign-hub');
        setSelectedArticle(null);
        return;
      }

      // 5. Dedicated SEO Landing Pages (Including 9 Autonomous Systems & Cyber Areas)
      const cleanRouteKey = routeKey.replace(/^view=/, '');
      if (SEO_LANDING_PAGES[cleanRouteKey as keyof typeof SEO_LANDING_PAGES]) {
        setActiveToolSlug(null);
        setActiveView(cleanRouteKey as ActiveSiteView);
        setSelectedArticle(null);
        return;
      }

      // Standard App Views
      if (routeKey === 'privacy' || routeKey === 'view=privacy' || routeKey === 'privacy-policy') {
        setActiveView('privacy');
        setSelectedArticle(null);
        return;
      }
      if (routeKey === 'terms' || routeKey === 'view=terms' || routeKey === 'terms-of-use') {
        setActiveView('terms');
        setSelectedArticle(null);
        return;
      }
      if (routeKey === 'roadmap' || routeKey === 'view=roadmap' || routeKey === 'content-roadmap') {
        setActiveView('roadmap');
        setSelectedArticle(null);
        return;
      }
      if (routeKey === 'cheatsheets' || routeKey === 'view=cheatsheets' || routeKey === 'cheatsheet') {
        setActiveView('cheatsheets');
        setSelectedArticle(null);
        return;
      }
      if (routeKey === '404' || routeKey === 'view=404' || routeKey === 'not-found') {
        setActiveView('404');
        setSelectedArticle(null);
        return;
      }
      if (routeKey === 'tools' || routeKey === 'view=tools') {
        setActiveView('tools');
        setSelectedArticle(null);
        return;
      }
      if (routeKey === 'clusters' || routeKey === 'view=clusters') {
        setActiveView('clusters');
        setSelectedArticle(null);
        return;
      }
      if (routeKey === 'ctf' || routeKey === 'view=ctf') {
        setActiveView('ctf');
        setSelectedArticle(null);
        return;
      }
      if (routeKey === 'about' || routeKey === 'view=about') {
        setActiveView('about');
        setSelectedArticle(null);
        return;
      }
      if (routeKey === 'disclaimer' || routeKey === 'view=disclaimer') {
        setActiveView('disclaimer');
        setSelectedArticle(null);
        return;
      }
      if (routeKey === 'contact' || routeKey === 'view=contact') {
        setActiveView('contact');
        setSelectedArticle(null);
        return;
      }

      // Category paths
      if (routeKey === 'blueprint' || routeKey === 'category/blueprint') {
        setCurrentCategory('Blueprint');
        setActiveView('blog');
        setSelectedArticle(null);
        return;
      }
      if (routeKey === 'tools-apps' || routeKey === 'category/tools-apps') {
        setCurrentCategory('Tools & Apps');
        setActiveView('blog');
        setSelectedArticle(null);
        return;
      }
      if (routeKey === 'category/cybersecurity') {
        setCurrentCategory('Cybersecurity');
        setActiveView('blog');
        setSelectedArticle(null);
        return;
      }
      if (routeKey === 'category/trending-ai' || routeKey === 'category/ai') {
        setCurrentCategory('Autonomous Systems & Productivity');
        setActiveView('blog');
        setSelectedArticle(null);
        return;
      }
      if (routeKey.startsWith('category=')) {
        const cat = decodeURIComponent(routeKey.replace('category=', ''));
        if (cat) {
          setCurrentCategory(cat as any);
          setActiveView('blog');
          setSelectedArticle(null);
          return;
        }
      }

      // Normalized article slug matching (supports /slug, /articles/slug, /article/slug)
      const cleanSlug = routeKey.replace(/^(articles?|post)\//, '');
      const matched = articles.find(a => 
        a.slug.toLowerCase() === cleanSlug || 
        a.id.toLowerCase() === cleanSlug ||
        a.slug.toLowerCase() === routeKey
      );

      if (matched) {
        setSelectedArticle(matched);
        setActiveView('blog');
      } else {
        // Unrecognized route -> 404 Hacker View
        setActiveView('404');
        setSelectedArticle(null);
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    window.addEventListener('hashchange', handleRoute);
    return () => {
      window.removeEventListener('popstate', handleRoute);
      window.removeEventListener('hashchange', handleRoute);
    };
  }, [articles]);

  // Add Comment Handler
  const handleAddComment = (articleId: string, commentData: Omit<Comment, 'id' | 'date'>) => {
    const newComment: Comment = {
      ...commentData,
      id: `c-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      likedByMe: false,
      replies: []
    };

    setArticles(prev => prev.map(art => {
      if (art.id === articleId) {
        const updated = [...(art.comments || []), newComment];
        saveRealCommentsForArticle(art.slug, updated);
        return {
          ...art,
          comments: updated
        };
      }
      return art;
    }));

    if (selectedArticle && selectedArticle.id === articleId) {
      setSelectedArticle(prev => {
        if (!prev) return null;
        const updated = [...(prev.comments || []), newComment];
        saveRealCommentsForArticle(prev.slug, updated);
        return {
          ...prev,
          comments: updated
        };
      });
    }
  };

  // Add Reply to Comment Handler
  const handleAddReply = (articleId: string, parentCommentId: string, replyData: Omit<Comment, 'id' | 'date'>) => {
    const newReply: Comment = {
      ...replyData,
      id: `rep-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      likedByMe: false
    };

    setArticles(prev => prev.map(art => {
      if (art.id === articleId) {
        const updated = (art.comments || []).map(c => {
          if (c.id === parentCommentId) {
            return {
              ...c,
              replies: [...(c.replies || []), newReply]
            };
          }
          return c;
        });
        saveRealCommentsForArticle(art.slug, updated);
        return {
          ...art,
          comments: updated
        };
      }
      return art;
    }));

    if (selectedArticle && selectedArticle.id === articleId) {
      setSelectedArticle(prev => {
        if (!prev) return null;
        const updated = (prev.comments || []).map(c => {
          if (c.id === parentCommentId) {
            return {
              ...c,
              replies: [...(c.replies || []), newReply]
            };
          }
          return c;
        });
        saveRealCommentsForArticle(prev.slug, updated);
        return {
          ...prev,
          comments: updated
        };
      });
    }
  };

  // Toggle Comment Like Handler
  const handleToggleCommentLike = (articleId: string, commentId: string, isReply?: boolean, parentId?: string) => {
    setArticles(prev => prev.map(art => {
      if (art.id === articleId) {
        const updated = (art.comments || []).map(c => {
          if (isReply && parentId && c.id === parentId) {
            return {
              ...c,
              replies: (c.replies || []).map(r => {
                if (r.id === commentId) {
                  const liked = !!r.likedByMe;
                  return {
                    ...r,
                    likes: liked ? Math.max(0, r.likes - 1) : r.likes + 1,
                    likedByMe: !liked
                  };
                }
                return r;
              })
            };
          } else if (c.id === commentId) {
            const liked = !!c.likedByMe;
            return {
              ...c,
              likes: liked ? Math.max(0, c.likes - 1) : c.likes + 1,
              likedByMe: !liked
            };
          }
          return c;
        });
        saveRealCommentsForArticle(art.slug, updated);
        return {
          ...art,
          comments: updated
        };
      }
      return art;
    }));

    if (selectedArticle && selectedArticle.id === articleId) {
      setSelectedArticle(prev => {
        if (!prev) return null;
        const updated = (prev.comments || []).map(c => {
          if (isReply && parentId && c.id === parentId) {
            return {
              ...c,
              replies: (c.replies || []).map(r => {
                if (r.id === commentId) {
                  const liked = !!r.likedByMe;
                  return {
                    ...r,
                    likes: liked ? Math.max(0, r.likes - 1) : r.likes + 1,
                    likedByMe: !liked
                  };
                }
                return r;
              })
            };
          } else if (c.id === commentId) {
            const liked = !!c.likedByMe;
            return {
              ...c,
              likes: liked ? Math.max(0, c.likes - 1) : c.likes + 1,
              likedByMe: !liked
            };
          }
          return c;
        });
        saveRealCommentsForArticle(prev.slug, updated);
        return {
          ...prev,
          comments: updated
        };
      });
    }
  };

  // View count increment & descriptive URL sync
  const handleSelectArticle = useCallback((article: Article) => {
    setArticles(prev => prev.map(a => 
      a.id === article.id ? { ...a, views: a.views + 1 } : a
    ));
    setSelectedArticle({ ...article, views: article.views + 1 });
    try {
      if (window.location.pathname !== `/${article.slug}`) {
        window.history.pushState({ articleSlug: article.slug }, '', `/${article.slug}`);
      }
    } catch {
      // In sandboxed environments, keep clean in-memory state
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const paginatedArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  // Breadcrumb items calculation for SEO and navigation accessibility
  const breadcrumbItems = useMemo(() => {
    const homeItem = { 
      label: 'Home', 
      onClick: () => { handleNavigate('blog', '/'); setCurrentCategory('All'); } 
    };

    if (selectedArticle) {
      return [
        homeItem,
        { 
          label: selectedArticle.category, 
          onClick: () => { 
            setSelectedArticle(null); 
            setCurrentCategory(selectedArticle.category as any); 
            handleNavigate('blog', '/');
          } 
        },
        { label: selectedArticle.title, active: true }
      ];
    }

    if (activeToolSlug && TOOL_PAGES[activeToolSlug]) {
      return [
        homeItem,
        { label: 'Security Tools Suite', onClick: () => handleNavigate('tools') },
        { label: TOOL_PAGES[activeToolSlug].h1.replace('Free ', '').split('&')[0].trim(), active: true }
      ];
    }

    if (activeView === 'sovereign-hub') {
      return [
        homeItem,
        { label: 'Autonomous Systems Hub', active: true }
      ];
    }

    if (SEO_LANDING_PAGES[activeView as keyof typeof SEO_LANDING_PAGES]) {
      return [
        homeItem,
        { label: 'Autonomous Systems Hub', onClick: () => handleNavigate('sovereign-hub') },
        { label: SEO_LANDING_PAGES[activeView as keyof typeof SEO_LANDING_PAGES].title.split('|')[0].trim(), active: true }
      ];
    }

    if (activeView === 'tools') {
      return [
        homeItem,
        { label: 'Security Tools Suite', active: true }
      ];
    }

    if (activeView === 'ctf') {
      return [
        homeItem,
        { label: 'CTF Challenge Arena Lab', active: true }
      ];
    }

    if (activeView === 'roadmap') {
      return [
        homeItem,
        { label: 'Editorial Research Roadmap', active: true }
      ];
    }

    if (activeView === 'cheatsheets') {
      return [
        homeItem,
        { label: 'Interactive Pentesting Cheatsheets', active: true }
      ];
    }

    if (activeView === 'about') {
      return [
        homeItem,
        { label: 'About YinYangYoHackers & Dossier', active: true }
      ];
    }

    if (activeView === 'privacy') {
      return [homeItem, { label: 'Privacy Policy', active: true }];
    }
    if (activeView === 'terms') {
      return [homeItem, { label: 'Terms of Service', active: true }];
    }
    if (activeView === 'disclaimer') {
      return [homeItem, { label: 'Responsible Disclosure & Disclaimer', active: true }];
    }
    if (activeView === 'contact') {
      return [homeItem, { label: 'Contact Lab', active: true }];
    }

    if (currentCategory !== 'All') {
      return [
        homeItem,
        { label: `${currentCategory} Archives`, active: true }
      ];
    }

    return [
      homeItem,
      { label: 'Technical Cybersecurity & Autonomous Systems Intelligence Hub', active: true }
    ];
  }, [selectedArticle, activeToolSlug, activeView, currentCategory, handleNavigate]);

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* 1. Header Navigation Bar */}
      <Header
        currentCategory={currentCategory}
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          handleNavigate('blog', '/');
        }}
        activeView={activeView}
        onSelectView={(view, path) => {
          handleNavigate(view, path);
          if (view !== 'blog') setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        theme={theme}
        onToggleTheme={setTheme}
        bookmarksCount={bookmarks.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        articles={articles}
        onSelectArticle={handleSelectArticle}
        onOpenTerminal={() => setIsTerminalOpen(prev => !prev)}
        isTerminalOpen={isTerminalOpen}
        onOpenRss={() => setIsRssOpen(true)}
        language={language}
        onSelectLanguage={setLanguage}
      />

      {/* 2. Main Content Wrapper */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl lg:max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 focus:outline-none">
        {/* Breadcrumb Navigation on All Pages */}
        <BreadcrumbNav 
          items={breadcrumbItems} 
          className="mb-4"
        />

        {/* Selected Article Modal View */}
        <Suspense fallback={<div className="min-h-[60vh] bg-[#090d16] border border-slate-800 rounded-2xl p-8 animate-pulse" />}>
        {selectedArticle ? (
          <ArticleModal
            article={selectedArticle}
            onClose={() => {
              setSelectedArticle(null);
              handleNavigate('blog', '/');
            }}
            onToggleBookmark={handleToggleBookmark}
            isBookmarked={bookmarks.includes(selectedArticle.id)}
            onAddComment={handleAddComment}
            onAddReply={handleAddReply}
            onToggleCommentLike={handleToggleCommentLike}
            allArticles={articles}
            onSelectRelatedArticle={handleSelectArticle}
            onSelectArticle={handleSelectArticle}
            onSelectCategory={(cat) => {
              setSelectedArticle(null);
              setCurrentCategory(cat);
              handleNavigate('blog', '/');
            }}
          />
        ) : activeView === 'maintenance' ? (
          <MaintenanceView
            onBypass={() => handleNavigate('blog', '/')}
            onGoHome={() => handleNavigate('blog', '/')}
          />
        ) : activeView === '404' ? (
          <NotFoundView 
            onNavigateHome={() => {
              handleNavigate('blog', '/');
              setCurrentCategory('All');
            }}
            onNavigateView={(view) => {
              handleNavigate(view);
            }}
            onSelectArticle={handleSelectArticle}
            suggestedArticles={articles.slice(0, 4)}
            missingPath={typeof window !== 'undefined' ? (window.location.pathname !== '/' ? window.location.pathname : window.location.hash) : undefined}
          />
        ) : activeToolSlug && TOOL_PAGES[activeToolSlug] ? (
          <StandaloneToolView 
            toolSlug={activeToolSlug}
            onNavigate={(view, path) => handleNavigate(view, path)}
          />
        ) : activeView === 'sovereign-hub' ? (
          <SovereignAiHubView 
            onNavigate={(view, path) => handleNavigate(view, path)}
          />
        ) : activeView === 'tools' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => handleNavigate('blog', '/')}
                className="text-xs font-mono text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 py-2 px-3 min-h-[48px] cursor-pointer"
              >
                &larr; Back to Security Feed
              </button>
            </div>
            <ToolsSuite onNavigate={(view, path) => handleNavigate(view, path)} />
          </div>
        ) : activeView === 'clusters' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => handleNavigate('blog', '/')}
                className="text-xs font-mono text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 py-2 px-3 min-h-[48px] cursor-pointer"
              >
                &larr; Back to Security Feed
              </button>
            </div>
            <ContentClustersMap 
              onSelectArticle={handleSelectArticle}
              onSelectCategory={(cat) => {
                setCurrentCategory(cat);
                handleNavigate('blog', '/');
              }}
            />
          </div>
        ) : activeView === 'ctf' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => handleNavigate('blog', '/')}
                className="text-xs font-mono text-amber-300 hover:text-amber-200 flex items-center gap-1.5 py-2 px-3 min-h-[48px] cursor-pointer"
              >
                &larr; Back to Security Feed
              </button>
            </div>
            <CtfArena />
          </div>
        ) : activeView === 'about' ? (
          <AboutView 
            onBack={() => handleNavigate('blog', '/')} 
            onSelectCategory={(cat) => {
              setCurrentCategory(cat);
              handleNavigate('blog', '/');
            }}
          />
        ) : activeView === 'disclaimer' ? (
          <DisclaimerView onBack={() => handleNavigate('blog', '/')} />
        ) : activeView === 'contact' ? (
          <ContactView onBack={() => handleNavigate('blog', '/')} />
        ) : activeView === 'privacy' ? (
          <PrivacyPolicyView onBackToArticles={() => handleNavigate('blog', '/')} />
        ) : activeView === 'terms' ? (
          <TermsView onBackToArticles={() => handleNavigate('blog', '/')} />
        ) : activeView === 'roadmap' ? (
          <ContentRoadmapView 
            articles={articles}
            onSelectArticle={handleSelectArticle}
            onNavigateView={(view) => handleNavigate(view)}
            onBackToArticles={() => handleNavigate('blog', '/')}
            onSelectArticleUrl={(slug) => {
              const cleanSlug = slug.replace(/^\/articles\//, '').replace(/^\//, '');
              const matched = articles.find(a => 
                a.slug === cleanSlug || 
                a.slug === slug || 
                a.id === cleanSlug || 
                a.id === slug ||
                a.slug.includes(cleanSlug) ||
                cleanSlug.includes(a.slug)
              );
              if (matched) {
                handleSelectArticle(matched);
              } else {
                handleNavigate('blog', `/${cleanSlug}`);
              }
            }}
          />
        ) : activeView === 'cheatsheets' ? (
          <CheatsheetsView
            onBackToArticles={() => handleNavigate('blog', '/')}
            onNavigateTools={() => handleNavigate('tools')}
            onSelectArticleUrl={(slug) => {
              const cleanSlug = slug.replace(/^\/articles\//, '').replace(/^\//, '');
              const matched = articles.find(a => 
                a.slug === cleanSlug || 
                a.slug === slug || 
                a.id === cleanSlug || 
                a.id === slug ||
                a.slug.includes(cleanSlug) ||
                cleanSlug.includes(a.slug)
              );
              if (matched) {
                handleSelectArticle(matched);
              } else {
                handleNavigate('blog', `/${cleanSlug}`);
              }
            }}
          />
        ) : SEO_LANDING_PAGES[activeView as keyof typeof SEO_LANDING_PAGES] ? (
          <SeoLandingView
            viewKey={activeView}
            onNavigate={(view, path) => handleNavigate(view, path)}
            onSelectArticle={handleSelectArticle}
          />
        ) : (
          /* Standard Editorial Publication Grid Layout */
          <>
            {/* Hero Banner (Only on front page when no search) */}
            {currentCategory === 'All' && !searchQuery && (
              <HeroBanner 
                onExploreArticles={() => {
                  const el = document.getElementById('articles-directory-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                onSelectCategory={(cat) => {
                  setCurrentCategory(cat);
                  handleNavigate('blog', '/');
                }}
                onNavigatePillar={(view) => handleNavigate(view)}
                onOpenTools={() => handleNavigate('tools')}
                onOpenRoadmap={() => handleNavigate('roadmap')}
              />
            )}

            {/* Grid vs Sidebar Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Articles Directory */}
              <section id="articles-directory-section" className="lg:col-span-8 space-y-6">
                
                {/* Control bar: Category Title, Quick Filters & Layout Mode */}
                <div className="p-4 sm:p-5 bg-[#090d16] border border-slate-800 rounded-xl space-y-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      {currentCategory === 'All' && !searchQuery ? (
                        <h2 className="text-xl sm:text-2xl font-bold text-white font-mono flex items-center gap-2">
                          <span className="text-emerald-400">&gt;</span>
                          <span>Security Research &amp; Engineering Blueprints</span>
                        </h2>
                      ) : (
                        <h2 className="text-xl sm:text-2xl font-bold text-white font-mono flex items-center gap-2">
                          <span className="text-emerald-400">&gt;</span>
                          <span>
                            {searchQuery ? `Search Results for "${searchQuery}"` : `${currentCategory} Archives`}
                          </span>
                        </h2>
                      )}
                      <p className="text-xs sm:text-sm text-slate-300 font-mono mt-1">
                        Showing {filteredArticles.length} peer-reviewed research publications
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* View Switcher: Grid vs Compact Stream */}
                      <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 gap-1.5">
                        <button
                          onClick={() => setLayoutMode('grid')}
                          aria-label="Grid Layout"
                          className={`p-2 min-w-[36px] min-h-[36px] rounded-md text-xs transition-colors cursor-pointer flex items-center justify-center ${layoutMode === 'grid' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60' : 'text-slate-300 hover:text-white'}`}
                          title="Grid Layout"
                        >
                          <Grid className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setLayoutMode('stream')}
                          aria-label="Compact Stream View"
                          className={`p-2 min-w-[36px] min-h-[36px] rounded-md text-xs transition-colors cursor-pointer flex items-center justify-center ${layoutMode === 'stream' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60' : 'text-slate-300 hover:text-white'}`}
                          title="Compact Stream View"
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Clear Filter / Category badge */}
                      {currentCategory !== 'All' && (
                        <button
                          onClick={() => setCurrentCategory('All')}
                          className="text-xs sm:text-sm px-3 py-1.5 min-h-[36px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 font-mono cursor-pointer"
                        >
                          <span>Clear ({currentCategory})</span>
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Clean Category Filter Tabs */}
                  <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 scrollbar-none pt-2.5 border-t border-slate-800/80">
                    {[
                      { label: 'All Articles', value: 'All' },
                      { label: 'Cyber Security', value: 'Cyber Security' },
                      { label: 'Autonomous Systems', value: 'Autonomous Systems Hub' },
                      { label: 'Security Tools', value: 'Security Tools' },
                    ].map((c) => {
                      const isSelected = currentCategory === c.value ||
                        (c.value === 'Cyber Security' && (currentCategory === 'Cybersecurity' || currentCategory === 'Blueprint')) ||
                        (c.value === 'Autonomous Systems Hub' && currentCategory === 'Autonomous Systems Hub') ||
                        (c.value === 'Security Tools' && currentCategory === 'Tools & Apps');
                      const count = c.value === 'All' 
                        ? articles.length 
                        : articles.filter(a => {
                            const norm = (a.category === 'Cybersecurity' || a.category === 'Blueprint')
                              ? 'Cyber Security'
                              : (a.category === 'Autonomous Systems & Productivity' || a.category === 'Autonomous Systems Hub')
                                ? 'Autonomous Systems Hub'
                                : (a.category === 'Tools & Apps')
                                  ? 'Security Tools'
                                  : a.category;
                            return norm === c.value;
                          }).length;
                      return (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setCurrentCategory(c.value as any)}
                          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 min-h-[44px] rounded-lg text-xs sm:text-sm font-mono font-medium whitespace-nowrap transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-400 text-slate-950 font-bold'
                              : 'bg-slate-900 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700'
                          }`}
                        >
                          {c.label} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Empty State */}
                {filteredArticles.length === 0 && (
                  <div className="text-center py-16 bg-[#090d16] border border-slate-800/80 rounded-2xl p-8 space-y-4">
                    <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto" />
                    <h3 className="text-lg font-bold text-slate-200 font-mono">No matching security research found</h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      No documents matched your query &quot;{searchQuery}&quot;. Try querying Pentesting, DeepSeek, Wireshark, or local LLMs.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setCurrentCategory('All');
                      }}
                      className="px-4 py-3 min-h-[48px] bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 rounded-lg font-mono text-xs transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}

                {/* Articles Rendering (Grid or Stream) */}
                <div className={layoutMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-6' : 'space-y-4'}>
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                      <ArticleCardSkeleton 
                        key={`skeleton-${idx}`} 
                        layout={layoutMode} 
                      />
                    ))
                  ) : (
                    paginatedArticles.map((article, idx) => (
                      <React.Fragment key={article.id}>
                        <ArticleCard
                          article={article}
                          onSelect={handleSelectArticle}
                          onToggleBookmark={handleToggleBookmark}
                          onSelectTag={handleSelectTag}
                          isBookmarked={bookmarks.includes(article.id)}
                          layout={layoutMode}
                          priority={idx < 2}
                        />
                        {/* Mid-Feed In-Article Native Sponsor Card at index 3 */}
                        {idx === 3 && (
                          <div className={layoutMode === 'grid' ? 'sm:col-span-2' : ''}>
                            <HackerBannerAd 
                              placement="in-feed-native" 
                              sponsorKey="cyber-vpn" 
                            />
                          </div>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </div>

                {/* Pagination / Load More */}
                {hasMore && (
                  <div className="pt-4 flex justify-center">
                    <button
                      id="load-more-articles-btn"
                      onClick={() => setVisibleCount(prev => prev + 6)}
                      className="px-6 py-3 min-h-[48px] bg-[#090d16] hover:bg-slate-900 text-emerald-300 hover:text-emerald-200 border border-emerald-700 hover:border-emerald-500 rounded-xl font-mono text-xs sm:text-sm font-bold transition-colors shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                      <ChevronDown className="w-4 h-4" />
                      <span>Load More Security Intelligence ({filteredArticles.length - visibleCount} remaining)</span>
                    </button>
                  </div>
                )}
              </section>

              {/* Right Column: High-Value Sidebar Intelligence */}
              <section id="sidebar-intelligence-section" className="lg:col-span-4">
                <Sidebar
                  articles={articles}
                  currentCategory={currentCategory}
                  onSelectArticle={handleSelectArticle}
                  onSelectCategory={(cat) => {
                    setCurrentCategory(cat);
                    handleNavigate('blog', '/');
                  }}
                  onSelectArticleDirect={handleSelectArticle}
                  onSelectView={(view, path) => {
                    handleNavigate(view, path);
                  }}
                  onSelectTag={handleSelectTag}
                />
              </section>

            </div>
          </>
        )}
        </Suspense>
      </main>

      {/* 3. Footer */}
      <Footer 
        onSelectView={(view, path) => {
          handleNavigate(view, path);
          if (view === 'blog') {
            setCurrentCategory('All');
          }
        }}
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          handleNavigate('blog', '/');
        }}
        onSelectArticle={handleSelectArticle}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenRss={() => setIsRssOpen(true)}
      />

      {/* 4. Interactive Hacker Cookie & Privacy Cipher Popup */}
      <HackerCookieConsent />

      {/* 5. Terminal CLI Floating/Docked Window */}
      {isTerminalOpen && (
        <Suspense fallback={null}>
          <TerminalWindow
            isOpen={isTerminalOpen}
            onClose={() => setIsTerminalOpen(false)}
            articles={articles}
            currentCategory={currentCategory}
            onSelectCategory={(cat) => {
              setCurrentCategory(cat);
              setActiveView('blog');
              setSelectedArticle(null);
            }}
            onSelectArticle={(art) => {
              setSelectedArticle(art);
              setIsTerminalOpen(false);
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            onSelectView={(view) => {
              setActiveView(view);
              setSelectedArticle(null);
              setIsTerminalOpen(false);
            }}
            onSearchChange={setSearchQuery}
            onToggleTheme={setTheme}
          />
        </Suspense>
      )}

      {/* 6. Bookmarks Drawer */}
      {isBookmarksOpen && (
        <div 
          id="bookmarks-drawer"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex justify-end p-2 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setIsBookmarksOpen(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#090d16] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 flex flex-col justify-between max-h-[90vh]"
          >
            <div className="space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <h3 className="text-base font-bold text-white font-mono">Saved Articles ({bookmarks.length})</h3>
                </div>
                <button 
                  onClick={() => setIsBookmarksOpen(false)}
                  className="p-2 min-w-[48px] min-h-[48px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {bookmarks.length === 0 ? (
                <p className="text-xs font-mono text-slate-300 py-8 text-center">No saved articles yet. Press &apos;b&apos; to toggle.</p>
              ) : (
                <div className="space-y-3">
                  {articles.filter(a => bookmarks.includes(a.id)).map(art => (
                    <div 
                      key={art.id}
                      onClick={() => {
                        setSelectedArticle(art);
                        setIsBookmarksOpen(false);
                        window.scrollTo({ top: 0, behavior: 'instant' });
                      }}
                      className="p-3.5 bg-[#050811] border border-slate-800 hover:border-emerald-500/60 rounded-xl cursor-pointer transition-all space-y-1 group"
                    >
                      <span className="text-[11px] font-mono text-emerald-400">{art.category}</span>
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">{art.title}</h4>
                      <p className="text-xs text-slate-300 line-clamp-2">{art.summary}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsBookmarksOpen(false)}
              className="w-full py-2.5 min-h-[48px] bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono font-semibold rounded-lg transition-colors"
            >
              Close (Esc)
            </button>
          </div>
        </div>
      )}

      {/* 7. RSS Syndication Modal */}
      {isRssOpen && (
        <Suspense fallback={null}>
          <RssModal
            isOpen={isRssOpen}
            onClose={() => setIsRssOpen(false)}
            articles={articles}
          />
        </Suspense>
      )}

      {/* 8. Full-Spectrum SEO Audit & Backlink Command Center */}
      {isSeoInspectorOpen && (
        <Suspense fallback={null}>
          <SeoInspectorModal
            article={seoInspectorArticle}
            onClose={() => setIsSeoInspectorOpen(false)}
          />
        </Suspense>
      )}

      {/* 9. Direct Founder Inquiries & Research Dispatch Desk */}
      <DirectContactDesk />

      {/* 10. Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}
