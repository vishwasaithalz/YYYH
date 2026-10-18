import { Article } from '../types';

/**
 * Strips HTML tags and trims whitespace to extract raw text from HTML content
 */
export function extractRawText(htmlContent: string): string {
  if (!htmlContent) return '';
  return htmlContent
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates total word count for an article based on its full body, intro, sections, and summary
 */
export function calculateArticleWordCount(article: Article): number {
  if (!article) return 0;

  let allText = '';

  // 1. Title, subtitle, and intro paragraphs
  if (article.title) allText += ' ' + article.title;
  if (article.subtitle) allText += ' ' + article.subtitle;
  if (article.summary) allText += ' ' + article.summary;

  if (article.intro && Array.isArray(article.intro)) {
    allText += ' ' + article.intro.join(' ');
  }

  // 2. Add sections content, subsections, code blocks, callouts, and recommendations
  if (article.sections && article.sections.length > 0) {
    for (const section of article.sections) {
      if (section.heading) allText += ' ' + section.heading;
      if (section.body && Array.isArray(section.body)) {
        allText += ' ' + section.body.join(' ');
      }
      if (section.subsections && Array.isArray(section.subsections)) {
        for (const sub of section.subsections) {
          if (sub.heading) allText += ' ' + sub.heading;
          if (sub.body && Array.isArray(sub.body)) {
            allText += ' ' + sub.body.join(' ');
          }
        }
      }
      if (section.codeBlock?.code) {
        // Count code words/tokens
        allText += ' ' + section.codeBlock.code;
      }
      if (section.callout?.text) {
        allText += ' ' + section.callout.text;
      }
      if (section.table?.rows) {
        for (const row of section.table.rows) {
          allText += ' ' + row.join(' ');
        }
      }
    }
  } else if (article.rawHtml) {
    // Fallback if no structured sections exist
    allText += ' ' + extractRawText(article.rawHtml);
  }

  // 4. FAQs
  if (article.faqs && Array.isArray(article.faqs)) {
    for (const faq of article.faqs) {
      allText += ' ' + faq.question + ' ' + faq.answer;
    }
  }

  // Split by whitespace and filter empty tokens
  const words = allText.trim().split(/\s+/).filter(Boolean);
  return Math.max(words.length, 1);
}

export interface ReadingTimeResult {
  minutes: number;
  text: string;
  wordCount: number;
}

/**
 * Calculates estimated reading time assuming standard 200 words per minute (WPM).
 * Returns minutes, formatted string, and total word count.
 */
export function calculateReadingTime(
  article: Article,
  wordsPerMinute: number = 200
): ReadingTimeResult {
  if (
    article &&
    typeof article.wordCount === 'number' &&
    article.wordCount > 0 &&
    (!article.sections || article.sections.length === 0)
  ) {
    const minutes = Math.max(1, Math.ceil(article.wordCount / wordsPerMinute));
    return {
      minutes,
      text: article.readTime || `${minutes} min read`,
      wordCount: article.wordCount
    };
  }

  const wordCount = calculateArticleWordCount(article);
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  
  return {
    minutes,
    text: `${minutes} min read`,
    wordCount
  };
}
