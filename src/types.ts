export type PrimaryCategory = 
  | 'Cyber Security'
  | 'Autonomous Systems Hub'
  | 'Autonomous Systems Hub'
  | 'Security Tools'
  | 'Cybersecurity'
  | 'Autonomous Systems & Productivity'
  | 'Autonomous Systems & Productivity'
  | 'Blueprint'
  | 'Tools & Apps';

export type Category = 'All' | PrimaryCategory;

export type ThemeMode = 
  | 'obsidian-stealth' 
  | 'crimson-hacker' 
  | 'midnight-blue' 
  | 'matrix-green' 
  | 'terminal-amber' 
  | 'light';

export type SearchIntent = 'Informational' | 'Commercial Investigation' | 'Practical / Blueprint' | 'Navigational / Reference';

export interface SeoMetadata {
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  keywords?: string[];
  searchIntent?: SearchIntent;
  suggestedTitle?: string;
  metaTitle?: string;
  canonicalUrl?: string;
  ogImage?: string;
  metaDescription: string;
  contentCluster?: string;
  internalLinkTargets?: string[];
  freshnessRequirement?: string;
  targetWordCount?: number;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: 2 | 3;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ComparisonTable {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface ToolReference {
  name: string;
  category: string;
  license: string;
  githubUrl?: string;
  websiteUrl: string;
  description: string;
  commandSnippet?: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  role?: string;
  badge?: string;
  date: string;
  content: string;
  likes: number;
  likedByMe?: boolean;
  replies?: Comment[];
}

export interface ArticleSection {
  heading: string;
  id: string;
  level?: 2 | 3;
  body: string[];
  subsections?: {
    heading: string;
    id: string;
    body: string[];
  }[];
  codeBlock?: {
    language: string;
    code: string;
    filename?: string;
  };
  table?: ComparisonTable;
  callout?: {
    type: 'warning' | 'info' | 'tip' | 'danger';
    title: string;
    text: string;
  };
  toolRecommendations?: ToolReference[];
}

export interface Article {
  id: string;
  slug: string;
  title: string; // Target 40-60 characters SEO Title
  h1: string; // Exactly one H1
  subtitle: string;
  category: PrimaryCategory;
  subcategory: string;
  tags: string[];
  date: string;
  updatedDate?: string;
  readTime: string;
  wordCount?: number;
  views: number;
  featured?: boolean;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  summary: string;
  coverImage: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  seo: SeoMetadata;
  intro: string[];
  sections: ArticleSection[];
  faqs?: FaqItem[];
  relatedArticleSlugs: string[];
  comments: Comment[];
  rawHtml?: string;
  isBloggerPost?: boolean;
  originalBloggerUrl?: string;
}

export type ToolDirectoryCategory = 
  | 'Open-Source Tools' 
  | 'Free Software' 
  | 'Privacy Tools' 
  | 'Security Tools' 
  | 'Automated Tools'
  | 'Autonomous Tools' 
  | 'Developer Tools' 
  | 'Productivity Applications' 
  | 'Linux Applications' 
  | 'Browser Extensions' 
  | 'Self-Hosted Applications';

export interface ToolDirectoryItem {
  id: string;
  name: string;
  category: ToolDirectoryCategory;
  tagline: string;
  description: string;
  license: string;
  platforms: string[];
  githubUrl?: string;
  websiteUrl: string;
  stars?: string;
  installCommand?: string;
  pricing: '100% Free & Open Source' | 'Free Community' | 'Self-Hosted Free';
  featured?: boolean;
  reviewArticleSlug?: string;
}

export interface PortInfo {
  port: number;
  protocol: 'TCP' | 'UDP' | 'TCP/UDP';
  service: string;
  description: string;
  vulnerabilities: string;
  reconCommand: string;
  hardening: string;
}

export interface CTFChallenge {
  id: string;
  title: string;
  category: 'Web' | 'Cryptography' | 'Forensics' | 'Binary' | 'Network';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  description: string;
  scenario: string;
  clue: string;
  hints: string[];
  flag: string;
}

export interface ContentCluster {
  id: string;
  name: string;
  category: PrimaryCategory;
  description: string;
  pillarArticleSlug: string;
  supportingArticleSlugs: string[];
  targetKeywords: string[];
  iconName?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ArticleReactions {
  mindBlown: number;
  appliedInProd: number;
  superUseful: number;
  bookmarked: number;
}

export type ActiveSiteView = 
  | 'blog' 
  | 'clusters' 
  | 'tools' 
  | 'about'
  | 'disclaimer'
  | 'privacy'
  | 'terms'
  | 'contact'
  | 'cheatsheets'
  | 'ctf'
  | 'roadmap'
  | 'technology'
  | 'cybersecurity'
  | 'ethical-hacking'
  | 'penetration-testing'
  | 'ai-security'
  | 'sovereign-ai'
  | 'private-local-ai'
  | 'air-gapped-ai'
  | 'ollama-security'
  | 'vllm-security'
  | 'local-llm-security'
  | 'sovereign-ai-infrastructure'
  | 'ai-data-privacy'
  | 'sovereign-hub'
  | 'security-research'
  | 'maintenance'
  | '404';

export interface RoadmapArticle {
  id: string;
  title: string;
  primaryKeyword: string;
  searchIntent: SearchIntent;
  url: string;
  category: 'Ethical Hacking' | 'Cybersecurity' | 'Machine Defense' | 'Model Security' | 'Systems Defense' | 'Technology';
  pillarRelationship: string;
  internalLinkTargets: string[];
  suggestedCta: string;
  description: string;
}
