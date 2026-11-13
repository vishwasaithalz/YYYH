import { Article } from '../types';
import { allArticles } from '../data/articlesData';

export interface SemanticKeywordTarget {
  keyword: string;
  normalizedKeyword: string;
  articleId: string;
  slug: string;
  title: string;
  category: string;
  readTime?: string;
  weight: number;
}

export interface InjectedTextSegment {
  type: 'text' | 'link';
  content: string;
  target?: {
    articleId: string;
    slug: string;
    title: string;
    category: string;
    readTime?: string;
  };
}

export interface ContextualSemanticRelation {
  article: Article;
  matchedKeywords: string[];
  relevanceScore: number;
  reason: string;
}

/**
 * Curated high-relevance domain synonyms and concepts mapped to cornerstone slugs.
 * Ensures natural technical phrasing connects to authoritative blueprints.
 */
const CURATED_SEMANTIC_SYNONYMS: Record<string, string[]> = {
  'ethical-hacking-the-complete-beginners-guide': [
    'ethical hacking',
    'penetration testing roadmap',
    'white hat offensive auditing',
    'reconnaissance methodology',
    'security testing roadmap'
  ],
  'how-penetration-testing-methodology-works': [
    'penetration testing methodology',
    'PTES phases',
    'vulnerability assessment',
    'adversary simulation',
    'authorized penetration testing'
  ],
  'zero-trust-network-architecture-blueprint': [
    'Zero Trust architecture',
    'Zero Trust network',
    'mTLS gateway',
    'micro-segmentation',
    'least privilege perimeter'
  ],
  'linux-kernel-hardening-sysctl-security-blueprint': [
    'Linux kernel hardening',
    'kernel sysctl parameters',
    'SYN flood defense',
    'ASLR protection',
    'sysctl security'
  ],
  'wireshark-network-forensics-and-packet-analysis': [
    'Wireshark packet analysis',
    'packet inspection',
    'pcap capture',
    'TCP handshake analysis',
    'network traffic forensics'
  ],
  'sovereign-ai-local-compute-playbook-2026': [
    'sovereign AI',
    'local LLM inference',
    'Ollama deployment',
    'private AI enclave',
    'air-gapped compute'
  ],
  'ai-model-extraction-and-prompt-injection-defense': [
    'prompt injection defense',
    'adversarial machine learning',
    'model extraction mitigation',
    'LLM security boundaries',
    'jailbreak mitigation'
  ],
  'docker-container-security-hardening': [
    'Docker container security',
    'container hardening',
    'rootless Docker',
    'seccomp profile',
    'cgroups isolation'
  ],
  'google-dorks-explained-100-search-operators-for-ethical-security-research': [
    'Google Dorks',
    'advanced Google search operators',
    'OSINT reconnaissance',
    'passive reconnaissance',
    'Google hacking database'
  ],
  'best-open-source-cybersecurity-tools': [
    'open-source security tools',
    'free cybersecurity tools',
    'open-source auditing suite',
    'defensive toolset'
  ],
  'cidr-subnet-calculator-guide': [
    'CIDR subnetting',
    'subnet calculation',
    'CIDR notation',
    'usable host range',
    'RFC 1918 allocations'
  ],
  'active-directory-penetration-testing-guide': [
    'Active Directory penetration testing',
    'Kerberoasting attack',
    'Pass the Hash',
    'domain escalation',
    'BloodHound graph'
  ],
  'how-to-build-a-legal-hacking-lab': [
    'virtual hacking lab',
    'isolated lab environment',
    'virtual penetration testing lab',
    'safe research sandbox'
  ]
};

// Words too generic or short to link automatically without noise
const STOP_KEYWORDS = new Set([
  'and', 'the', 'for', 'with', 'that', 'this', 'from', 'guide', 'tutorial',
  'complete', 'overview', 'simple', 'basic', 'online', 'free', 'test',
  'system', 'tool', 'tools', 'code', 'data', 'security', 'cyber', 'network',
  'hack', 'linux', 'best', 'step', 'part', 'analysis', 'method', 'methods'
]);

/**
 * Builds the inverted index of keywords to target articles.
 * Cached in memory for near-zero runtime latency.
 */
let cachedKeywordIndex: SemanticKeywordTarget[] | null = null;

export function getSemanticKeywordIndex(): SemanticKeywordTarget[] {
  if (cachedKeywordIndex) {
    return cachedKeywordIndex;
  }

  const indexMap = new Map<string, SemanticKeywordTarget>();

  const registerTarget = (
    rawKeyword: string, 
    article: Article, 
    weight: number
  ) => {
    const trimmed = rawKeyword.trim();
    const lower = trimmed.toLowerCase();

    // Skip short or stop words
    if (trimmed.length < 4 || STOP_KEYWORDS.has(lower) || lower.split(' ').length > 6) {
      return;
    }

    // Keep highest weighted target if collision occurs
    const existing = indexMap.get(lower);
    if (!existing || existing.weight < weight) {
      indexMap.set(lower, {
        keyword: trimmed,
        normalizedKeyword: lower,
        articleId: article.id,
        slug: article.slug,
        title: article.title,
        category: article.category,
        readTime: article.readTime,
        weight
      });
    }
  };

  allArticles.forEach(article => {
    // 1. Curated synonyms (Highest precision: weight 100)
    const synonyms = CURATED_SEMANTIC_SYNONYMS[article.slug];
    if (synonyms) {
      synonyms.forEach(syn => registerTarget(syn, article, 100));
    }

    // 2. SEO Primary Keyword (Weight 90)
    if (article.seo?.primaryKeyword) {
      registerTarget(article.seo.primaryKeyword, article, 90);
    }

    // 3. SEO Secondary Keywords (Weight 80)
    if (article.seo?.secondaryKeywords) {
      article.seo.secondaryKeywords.forEach(sec => registerTarget(sec, article, 80));
    }

    // 4. Specific Tags (Weight 70)
    if (article.tags) {
      article.tags.forEach(tag => {
        if (!STOP_KEYWORDS.has(tag.toLowerCase())) {
          registerTarget(tag, article, 70);
        }
      });
    }

    // 5. Significant Title phrases (Weight 60)
    if (article.h1 && article.h1.length > 10 && article.h1.length < 40) {
      registerTarget(article.h1, article, 60);
    }
  });

  // Sort descending by length first (longest match priority), then by weight
  cachedKeywordIndex = Array.from(indexMap.values()).sort((a, b) => {
    if (b.normalizedKeyword.length !== a.normalizedKeyword.length) {
      return b.normalizedKeyword.length - a.normalizedKeyword.length;
    }
    return b.weight - a.weight;
  });

  return cachedKeywordIndex;
}

/**
 * Parses a paragraph of article text and injects semantic links to related articles.
 * Enforces editorial constraints:
 * - Never self links
 * - Maximum links per paragraph (default 1 to prevent link clutter and spam)
 * - Only links to an article slug that has not yet been linked in this context
 */
export function parseSemanticLinksInParagraph(
  text: string,
  currentArticleId: string,
  currentArticleSlug: string,
  alreadyLinkedSlugs: Set<string>,
  maxLinks = 1
): InjectedTextSegment[] {
  if (!text || maxLinks <= 0) {
    return [{ type: 'text', content: text }];
  }

  const keywordIndex = getSemanticKeywordIndex();
  let linksInjected = 0;

  // Find candidate matches in the paragraph
  interface MatchCandidate {
    start: number;
    end: number;
    originalText: string;
    target: SemanticKeywordTarget;
  }

  const matches: MatchCandidate[] = [];

  for (const target of keywordIndex) {
    // Avoid self-linking
    if (target.articleId === currentArticleId || target.slug === currentArticleSlug) {
      continue;
    }

    // Avoid linking same destination article multiple times in this article
    if (alreadyLinkedSlugs.has(target.slug)) {
      continue;
    }

    // Escape regex special characters in keyword
    const escaped = target.normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b(${escaped})\\b`, 'i');
    const match = regex.exec(text);

    if (match && match.index !== undefined) {
      const start = match.index;
      const end = start + match[0].length;

      // Check overlap with existing chosen matches
      const overlaps = matches.some(m => 
        (start >= m.start && start < m.end) || 
        (end > m.start && end <= m.end) ||
        (start <= m.start && end >= m.end)
      );

      if (!overlaps) {
        matches.push({
          start,
          end,
          originalText: match[0],
          target
        });

        // Track slug so subsequent searches in this article don't duplicate
        alreadyLinkedSlugs.add(target.slug);
        linksInjected++;

        if (linksInjected >= maxLinks) {
          break;
        }
      }
    }
  }

  if (matches.length === 0) {
    return [{ type: 'text', content: text }];
  }

  // Sort matches by start index to assemble segments
  matches.sort((a, b) => a.start - b.start);

  const segments: InjectedTextSegment[] = [];
  let currentIndex = 0;

  for (const m of matches) {
    // Text before link
    if (m.start > currentIndex) {
      segments.push({
        type: 'text',
        content: text.slice(currentIndex, m.start)
      });
    }

    // Injected Semantic Link
    segments.push({
      type: 'link',
      content: m.originalText,
      target: {
        articleId: m.target.articleId,
        slug: m.target.slug,
        title: m.target.title,
        category: m.target.category,
        readTime: m.target.readTime
      }
    });

    currentIndex = m.end;
  }

  // Remaining tail text
  if (currentIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.slice(currentIndex)
    });
  }

  return segments;
}

/**
 * Scans the full article body to discover the strongest semantic cross-references
 * across the entire YinYangYoHackers research library.
 */
export function getContextualSemanticGraph(
  article: Article,
  limit = 4
): ContextualSemanticRelation[] {
  // Aggregate all article text
  const textBlobs: string[] = [
    article.title,
    article.subtitle || '',
    ...article.intro,
    ...article.sections.flatMap(s => [
      s.heading,
      ...s.body,
      ...(s.subsections ? s.subsections.flatMap(sub => [sub.heading, ...sub.body]) : [])
    ])
  ];
  const combinedText = textBlobs.join(' ').toLowerCase();

  const keywordIndex = getSemanticKeywordIndex();
  const articleScoreMap = new Map<string, {
    article: Article;
    matchedKeywords: Set<string>;
    score: number;
    primaryReason: string;
  }>();

  for (const target of keywordIndex) {
    if (target.articleId === article.id || target.slug === article.slug) {
      continue;
    }

    const keyword = target.normalizedKeyword;
    // Fast substring check before regex
    if (combinedText.includes(keyword)) {
      const targetArticle = allArticles.find(a => a.id === target.articleId);
      if (!targetArticle) continue;

      const existing = articleScoreMap.get(target.articleId);
      const isDirectCluster = article.seo?.contentCluster && targetArticle.seo?.contentCluster === article.seo.contentCluster;
      const isInternalTarget = article.seo?.internalLinkTargets?.includes(target.slug);

      const addedScore = target.weight + (isDirectCluster ? 40 : 0) + (isInternalTarget ? 60 : 0);
      const reason = isInternalTarget 
        ? 'Direct Research Target' 
        : isDirectCluster 
        ? 'Shared Topic Cluster' 
        : 'Semantic Term Correlation';

      if (existing) {
        existing.matchedKeywords.add(target.keyword);
        existing.score += addedScore;
      } else {
        articleScoreMap.set(target.articleId, {
          article: targetArticle,
          matchedKeywords: new Set([target.keyword]),
          score: addedScore,
          primaryReason: reason
        });
      }
    }
  }

  // Convert to sorted array
  const relations: ContextualSemanticRelation[] = Array.from(articleScoreMap.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(entry => ({
      article: entry.article,
      matchedKeywords: Array.from(entry.matchedKeywords).slice(0, 3),
      relevanceScore: Math.min(99, Math.round(50 + entry.score / 6)),
      reason: entry.primaryReason
    }));

  return relations;
}
