import { Article, PrimaryCategory } from '../types';
import { cybersecurityArticles } from './articles/cybersecurityArticles';
import { aiProductivityArticles } from './articles/aiProductivityArticles';
import { howtoArticles } from './articles/howtoArticles';
import { toolsAppsArticles } from './articles/toolsAppsArticles';
import { bloggerArticles } from './articles/bloggerArticles';

export function normalizeCategory(cat: string, slug?: string): PrimaryCategory {
  if (cat === 'Cyber Security' || cat === 'Autonomous Systems Hub' || cat === 'Security Tools') {
    return cat;
  }
  if (cat === 'Sovereign Systems Hub') {
    return 'Autonomous Systems Hub';
  }
  if (
    cat === 'Autonomous Systems & Productivity' && 
    slug && (slug.includes('ai') || slug.includes('ollama') || slug.includes('rag') || slug.includes('agents') || slug.includes('obsidian'))
  ) {
    return 'Autonomous Systems Hub';
  }
  if (cat === 'Tools & Apps') {
    return 'Security Tools';
  }
  const cyberSlugs = [
    'top-rated-anonymous-proxy-server-list',
    'top-10-android-apps-that-turns-your-phone-into-a-hacking-device',
    'trick-to-hide-the-files-behind-the-images',
    'how-to-change-ip-address-in-every-10-seconds',
    'how-to-get-ip-address-of-another-computer-remotely',
    'trick-to-find-the-serial-key-of-any-software-using-google',
    'google-dorks-explained-100-search-operators-for-ethical-security-research',
    '50-android-secret-codes-you-should-know',
    'trick-to-hide-filesfolders-without-any-softwares',
    'top-3-tricks-to-open-blocked-sites-at-collegesoffices',
    '25-nokia-secret-codes-you-should-know',
    'password-cracking-using-usb-device',
    'introduction-to-hacking-what-hacking-is-how-it-works-and-how-to-learn-it',
    'how-online-surveys-function-legitimate-methods-to-access-content-without-violating-rules',
    'top-5-reasons-for-pc-crash-avoid-this-'
  ];
  if (slug && cyberSlugs.includes(slug)) {
    return 'Cyber Security';
  }
  if (cat === 'Cybersecurity' || cat === 'Blueprint') {
    return 'Cyber Security';
  }
  return 'Security Tools';
}

const rawArticles: Article[] = [
  ...cybersecurityArticles,
  ...aiProductivityArticles,
  ...howtoArticles,
  ...toolsAppsArticles,
  ...bloggerArticles,
];

export const allArticles: Article[] = rawArticles.map(a => ({
  ...a,
  category: normalizeCategory(a.category, a.slug)
}));

// Helper search and filter utility
export const getArticleBySlug = (slug: string): Article | undefined => {
  const direct = allArticles.find(a => a.slug === slug);
  if (direct) return direct;
  if (slug === 'ethical-hacking-for-beginners-guide' || slug === 'ethical-hacking-the-complete-beginners-guide') {
    return allArticles.find(a => a.id === 'cyber-1');
  }
  return undefined;
};

export const getArticlesByCategory = (category: string): Article[] => {
  return allArticles.filter(a => a.category === category);
};

export const getRelatedArticles = (article: Article, limit = 3): Article[] => {
  if (article.relatedArticleSlugs && article.relatedArticleSlugs.length > 0) {
    const related = article.relatedArticleSlugs
      .map(slug => allArticles.find(a => a.slug === slug))
      .filter((a): a is Article => Boolean(a));
    if (related.length >= limit) return related.slice(0, limit);
  }
  
  // Fallback to matching category & tags
  return allArticles
    .filter(a => a.id !== article.id && (a.category === article.category || a.tags.some(t => article.tags.includes(t))))
    .slice(0, limit);
};

export const getFeaturedArticles = (): Article[] => {
  return allArticles.filter(a => a.featured);
};
