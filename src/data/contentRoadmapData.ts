import { RoadmapArticle } from '../types';
import { allArticles } from './articlesData';

// Generate roadmap articles dynamically from existing published articles in allArticles
// This guarantees that 100% of titles exist on the site and all links resolve accurately.
export const contentRoadmapArticles: RoadmapArticle[] = allArticles.map((a) => {
  let mappedCategory: 'Ethical Hacking' | 'Cybersecurity' | 'Model Security' | 'Technology' = 'Cybersecurity';
  const cat = a.category.toLowerCase();
  const sub = (a.subcategory || '').toLowerCase();
  const slug = a.slug.toLowerCase();

  if (cat.includes('ai') || slug.includes('ai') || slug.includes('ollama') || slug.includes('rag') || slug.includes('llm') || slug.includes('deepseek')) {
    mappedCategory = 'Model Security';
  } else if (sub.includes('ethical hacking') || slug.includes('hacking') || slug.includes('penetration') || slug.includes('reconnaissance') || slug.includes('wireshark') || slug.includes('proxy') || slug.includes('steganography') || slug.includes('dork')) {
    mappedCategory = 'Ethical Hacking';
  } else if (cat.includes('tools') || sub.includes('tools') || slug.includes('tool') || slug.includes('apps') || slug.includes('usb') || slug.includes('backup') || slug.includes('docker') || slug.includes('firefox')) {
    mappedCategory = 'Technology';
  } else {
    mappedCategory = 'Cybersecurity';
  }

  const rawLinks = a.seo?.internalLinkTargets || [];
  const validLinks = rawLinks
    .map(link => {
      const clean = link.replace(/^\/articles\//, '').replace(/^\//, '');
      return `/${clean}`;
    })
    .filter(link => {
      const slugToCheck = link.replace(/^\//, '');
      return allArticles.some(art => art.slug === slugToCheck) || link === '/tools' || link === '/cheatsheets' || link === '/cybersecurity';
    });

  return {
    id: `road-${a.id}`,
    title: a.title,
    primaryKeyword: a.seo?.primaryKeyword || a.title,
    searchIntent: (a.seo?.searchIntent as any) || 'Informational',
    url: `/${a.slug}`,
    category: mappedCategory,
    pillarRelationship: a.seo?.contentCluster || a.subcategory || a.category,
    internalLinkTargets: validLinks.length > 0 ? validLinks : ['/cybersecurity', '/tools'],
    suggestedCta: a.seo?.suggestedTitle ? `Read ${a.seo.suggestedTitle}` : 'Access Full Research Guide',
    description: a.summary
  };
});
