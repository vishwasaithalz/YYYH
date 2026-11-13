import { Comment } from '../types';

/**
 * Empty mapping: no artificial or synthetic seed comments.
 */
export const articleSeedComments: Record<string, Comment[]> = {};

/**
 * Returns authentic user-submitted comments stored in persistent client storage.
 * Strictly filters out any synthetic or legacy fake comments.
 */
export function getInitialCommentsForArticle(slug: string, existingComments?: Comment[]): Comment[] {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem(`yyyh_real_comments_${slug}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((c: Comment) => c && typeof c.id === 'string' && !c.id.startsWith('comm-'));
        }
      }
    } catch {
      // Ignore parse error
    }
  }

  if (existingComments && Array.isArray(existingComments)) {
    return existingComments.filter((c: Comment) => c && typeof c.id === 'string' && !c.id.startsWith('comm-'));
  }

  return [];
}

/**
 * Persists real user comments to local storage
 */
export function saveRealCommentsForArticle(slug: string, comments: Comment[]): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const realOnly = comments.filter((c: Comment) => c && typeof c.id === 'string' && !c.id.startsWith('comm-'));
      window.localStorage.setItem(`yyyh_real_comments_${slug}`, JSON.stringify(realOnly));
    } catch {
      // Ignore storage error
    }
  }
}
