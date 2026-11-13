import { Article } from '../types';
import { allArticles } from '../data/articlesData';

export interface KeywordLinkMapping {
  keyword: string;
  slug: string;
  title: string;
  weight: number;
}

export interface ContentProcessorOptions {
  currentArticleSlug?: string;
  maxLinksPerBlock?: number;
  allArticlesList?: Article[];
  alreadyLinkedSlugs?: Set<string>;
}

/**
 * Core keyword registry with authoritative cornerstone cybersecurity blueprints.
 * Supports exact terms, hyphenated variations (e.g., 'Zero-Trust'), and technical phrases.
 */
const BASE_KEYWORD_MAP: Array<{ keywords: string[]; slug: string; title: string }> = [
  {
    keywords: ['Zero-Trust', 'Zero Trust', 'Zero-Trust Architecture', 'Zero Trust Architecture', 'Zero Trust Network'],
    slug: 'zero-trust-network-architecture-blueprint',
    title: 'Zero Trust Network Architecture Blueprint'
  },
  {
    keywords: ['Penetration Testing', 'Penetration Test', 'Pentesting', 'Penetration Testing Methodology'],
    slug: 'how-penetration-testing-methodology-works',
    title: 'Penetration Testing Methodology & Execution Phases'
  },
  {
    keywords: ['Ethical Hacking', 'Ethical Hacker', 'White-Hat', 'Ethical Hacking Roadmap'],
    slug: 'ethical-hacking-the-complete-beginners-guide',
    title: 'Ethical Hacking Roadmap & Curriculum'
  },
  {
    keywords: ['Local LLM', 'Local LLMs', 'Sovereign AI', 'Ollama', 'Local Inference', 'Air-Gapped LLM'],
    slug: 'sovereign-ai-local-compute-playbook-2026',
    title: 'Sovereign AI & Local Compute Playbook'
  },
  {
    keywords: ['Linux Hardening', 'Kernel Hardening', 'Kernel sysctl', 'sysctl security', 'Linux Kernel Hardening'],
    slug: 'linux-kernel-hardening-sysctl-security-blueprint',
    title: 'Linux Kernel Hardening & Sysctl Blueprint'
  },
  {
    keywords: ['Wireshark', 'Packet Analysis', 'Network Forensics', 'pcap inspection'],
    slug: 'wireshark-network-forensics-and-packet-analysis',
    title: 'Wireshark Network Forensics & Analysis Blueprint'
  },
  {
    keywords: ['Prompt Injection', 'Prompt Injection Defense', 'Adversarial ML', 'Model Extraction'],
    slug: 'ai-model-extraction-and-prompt-injection-defense',
    title: 'AI Model Extraction & Prompt Injection Defense'
  },
  {
    keywords: ['Docker Container', 'Container Hardening', 'Rootless Docker', 'Docker Security'],
    slug: 'docker-container-security-hardening',
    title: 'Docker Container Security & Hardening Guide'
  },
  {
    keywords: ['Google Dorks', 'Google Dorking', 'Google Hacking', 'Search Operators'],
    slug: 'google-dorks-explained-100-search-operators-for-ethical-security-research',
    title: 'Google Dorks for Ethical Security Research'
  },
  {
    keywords: ['Subnetting', 'Subnet Calculator', 'CIDR', 'CIDR Subnetting', 'RFC 1918'],
    slug: 'cidr-subnet-calculator-guide',
    title: 'Subnetting & CIDR Calculation Blueprint'
  },
  {
    keywords: ['Active Directory', 'Kerberoasting', 'Pass the Hash', 'AD Exploitation'],
    slug: 'active-directory-penetration-testing-guide',
    title: 'Active Directory Penetration Testing Guide'
  },
  {
    keywords: ['Hacking Lab', 'Virtual Lab', 'Legal Hacking Lab', 'Lab Environment'],
    slug: 'how-to-build-a-legal-hacking-lab',
    title: 'How to Build an Isolated Legal Hacking Lab'
  }
];

let cachedMappings: KeywordLinkMapping[] | null = null;

/**
 * Builds and caches an inverted keyword-to-article index from both base registry
 * and dynamic SEO keywords across all available articles.
 */
export function getKeywordLinkMappings(articles: Article[] = allArticles): KeywordLinkMapping[] {
  if (cachedMappings && articles === allArticles) {
    return cachedMappings;
  }

  const map = new Map<string, KeywordLinkMapping>();

  // 1. Ingest base curated registry (highest priority)
  BASE_KEYWORD_MAP.forEach(({ keywords, slug, title }) => {
    const article = articles.find(a => a.slug === slug);
    const resolvedTitle = article ? article.title : title;
    keywords.forEach(kw => {
      const lower = kw.toLowerCase();
      map.set(lower, {
        keyword: kw,
        slug,
        title: resolvedTitle,
        weight: 100 + kw.length
      });
    });
  });

  // 2. Dynamically ingest SEO primary and secondary keywords from articles
  articles.forEach(article => {
    if (article.seo?.primaryKeyword) {
      const pk = article.seo.primaryKeyword.trim();
      if (pk.length >= 4 && !map.has(pk.toLowerCase())) {
        map.set(pk.toLowerCase(), {
          keyword: pk,
          slug: article.slug,
          title: article.title,
          weight: 85 + pk.length
        });
      }
    }

    if (article.seo?.secondaryKeywords) {
      article.seo.secondaryKeywords.forEach(sk => {
        const trimmed = sk.trim();
        if (trimmed.length >= 5 && !map.has(trimmed.toLowerCase())) {
          map.set(trimmed.toLowerCase(), {
            keyword: trimmed,
            slug: article.slug,
            title: article.title,
            weight: 75 + trimmed.length
          });
        }
      });
    }
  });

  // Sort descending by keyword length to ensure longer phrases match first
  cachedMappings = Array.from(map.values()).sort((a, b) => b.keyword.length - a.keyword.length);
  return cachedMappings;
}

/**
 * Helper to escape characters for dynamic RegExp construction.
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 'related-content-injector' utility function:
 * Scans article body text for key cybersecurity keywords (e.g., 'Zero-Trust',
 * 'Penetration Testing', 'Local LLM') and automatically injects internal hyperlinks
 * to existing articles within the `allArticles` index.
 *
 * @param bodyText The raw string or paragraph of article text.
 * @param options Configuration options including current slug, max links, and article pool.
 * @returns Processed text with injected semantic anchor tags.
 */
export function relatedContentInjector(
  bodyText: string,
  options: ContentProcessorOptions = {}
): string {
  if (!bodyText || typeof bodyText !== 'string') {
    return bodyText || '';
  }

  const {
    currentArticleSlug,
    maxLinksPerBlock = 1,
    allArticlesList = allArticles,
    alreadyLinkedSlugs = new Set<string>()
  } = options;

  // Don't inject if max links reached
  if (maxLinksPerBlock <= 0) {
    return bodyText;
  }

  // If text is code or already an anchor tag, return early
  if (bodyText.trim().startsWith('<pre') || bodyText.trim().startsWith('```')) {
    return bodyText;
  }

  const mappings = getKeywordLinkMappings(allArticlesList);
  let linksAdded = 0;
  let processed = bodyText;

  for (const item of mappings) {
    // Avoid self-linking to current article
    if (currentArticleSlug && item.slug === currentArticleSlug) {
      continue;
    }

    // Avoid linking to the same article multiple times within this processing cycle
    if (alreadyLinkedSlugs.has(item.slug)) {
      continue;
    }

    // Construct regex with word boundaries.
    // Handles hyphens like 'Zero-Trust' or spaces like 'Zero Trust'.
    const escaped = escapeRegExp(item.keyword);
    const pattern = new RegExp(`(?<![<\\/\\w])\\b(${escaped})\\b(?![^<]*>)(?![\\w-])`, 'i');

    const match = pattern.exec(processed);
    if (match && match.index !== undefined) {
      const matchedWord = match[0];
      const linkTag = `<a href="/${item.slug}" class="related-content-link text-cyan-400 hover:text-emerald-300 underline underline-offset-4 decoration-cyan-500/50 hover:decoration-emerald-400 font-medium transition-colors cursor-pointer" title="Read technical research: ${item.title}" data-slug="${item.slug}">${matchedWord}</a>`;

      // Replace only the first occurrence
      processed = processed.slice(0, match.index) + linkTag + processed.slice(match.index + matchedWord.length);

      alreadyLinkedSlugs.add(item.slug);
      linksAdded++;

      if (linksAdded >= maxLinksPerBlock) {
        break;
      }
    }
  }

  return processed;
}

/**
 * Convenient alias function for relatedContentInjector.
 */
export const injectRelatedContent = (
  text: string,
  currentSlug?: string,
  articles?: Article[]
): string => {
  return relatedContentInjector(text, {
    currentArticleSlug: currentSlug,
    allArticlesList: articles
  });
};

/**
 * Processes an entire Article data structure, running the relatedContentInjector
 * across its intro paragraphs, section bodies, and subsection paragraphs.
 *
 * @param article The source article object to process.
 * @param allArticlesList The full index of existing articles.
 * @returns A freshly hydrated Article clone with hyperlinked text.
 */
export function processArticleContent(
  article: Article,
  allArticlesList: Article[] = allArticles
): Article {
  if (!article) return article;

  const alreadyLinkedSlugs = new Set<string>();
  const currentSlug = article.slug;

  // 1. Process intro paragraphs
  const processedIntro = (article.intro || []).map(p =>
    relatedContentInjector(p, {
      currentArticleSlug: currentSlug,
      maxLinksPerBlock: 1,
      allArticlesList,
      alreadyLinkedSlugs
    })
  );

  // 2. Process sections and subsections
  const processedSections = (article.sections || []).map(section => {
    const processedBody = (section.body || []).map(p =>
      relatedContentInjector(p, {
        currentArticleSlug: currentSlug,
        maxLinksPerBlock: 1,
        allArticlesList,
        alreadyLinkedSlugs
      })
    );

    const processedSubsections = section.subsections
      ? section.subsections.map(sub => ({
          ...sub,
          body: (sub.body || []).map(p =>
            relatedContentInjector(p, {
              currentArticleSlug: currentSlug,
              maxLinksPerBlock: 1,
              allArticlesList,
              alreadyLinkedSlugs
            })
          )
        }))
      : undefined;

    return {
      ...section,
      body: processedBody,
      subsections: processedSubsections
    };
  });

  return {
    ...article,
    intro: processedIntro,
    sections: processedSections
  };
}

/**
 * Helper to scan and extract all recognized cybersecurity keywords from any text block.
 */
export function extractKeywordsFromArticle(
  text: string,
  articles: Article[] = allArticles
): string[] {
  if (!text) return [];
  const mappings = getKeywordLinkMappings(articles);
  const found: string[] = [];

  for (const item of mappings) {
    const escaped = escapeRegExp(item.keyword);
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(text)) {
      found.push(item.keyword);
    }
  }

  return Array.from(new Set(found));
}
