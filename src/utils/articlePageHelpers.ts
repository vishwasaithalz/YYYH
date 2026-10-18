import { Article, ToolDirectoryItem } from '../types';
import { toolsDirectoryData } from '../data/toolsDirectoryData';

/**
 * Get matching open-source and free tools related to an article's technical scope.
 */
export const getRelatedToolsForArticle = (article: Article, limit = 3): ToolDirectoryItem[] => {
  // 1. First priority: Tools that directly reference this article's review slug
  const directMatches = toolsDirectoryData.filter(t => t.reviewArticleSlug === article.slug);
  if (directMatches.length >= limit) {
    return directMatches.slice(0, limit);
  }

  // 2. Second priority: Match by category & keywords
  const categoryKeywords: Record<string, string[]> = {
    'Cybersecurity': ['Security Tools', 'Privacy Tools', 'Linux Applications'],
    'Autonomous Systems & Productivity': ['Automated Tools', 'Developer Tools', 'Productivity Applications'],
    'Blueprint': ['Linux Applications', 'Self-Hosted Applications', 'Privacy Tools'],
    'Tools & Apps': ['Developer Tools', 'Open-Source Tools', 'Free Software', 'Browser Extensions']
  };

  const allowedCategories = categoryKeywords[article.category] || ['Open-Source Tools'];

  const categoryMatches = toolsDirectoryData.filter(t => 
    !directMatches.some(dm => dm.id === t.id) &&
    (allowedCategories.includes(t.category) ||
     article.tags.some(tag => 
       t.name.toLowerCase().includes(tag.toLowerCase()) || 
       t.description.toLowerCase().includes(tag.toLowerCase())
     ))
  );

  const combined = [...directMatches, ...categoryMatches];
  return combined.slice(0, limit);
};

/**
 * Generate key engineering takeaways from an article's structured sections.
 */
export const getKeyTakeawaysForArticle = (article: Article): string[] => {
  const takeaways: string[] = [];

  // Extract from callouts if present
  article.sections.forEach(sec => {
    if (sec.callout && sec.callout.text) {
      takeaways.push(`${sec.callout.title}: ${sec.callout.text}`);
    }
  });

  // Extract from first subsection/section headings
  if (takeaways.length < 3) {
    article.sections.forEach(sec => {
      if (sec.body && sec.body[0] && takeaways.length < 4) {
        // Clean summary point from section
        takeaways.push(`${sec.heading} ${sec.body[0].slice(0, 140)}...`);
      }
    });
  }

  // Standard fallback guarantee
  if (takeaways.length === 0) {
    takeaways.push(
      'Enforce defense-in-depth: Never rely on single-point security perimeters.',
      'Prioritize open-source, verifiable tooling over opaque closed-source alternatives.',
      'Maintain continuous system auditing, automated patching, and immutable backups.'
    );
  }

  return takeaways.slice(0, 4);
};
