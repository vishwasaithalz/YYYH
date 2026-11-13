import cyberImg from '../assets/images/cyber_defense_matrix_1788361050164.webp';
import aiImg from '../assets/images/sovereign_ai_cluster_1788361072249.webp';
import blueprintImg from '../assets/images/linux_blueprint_server_1788361086091.webp';
import toolsImg from '../assets/images/hacker_hardware_tools_1788361100351.webp';
import redTeamImg from '../assets/images/red_team_recon_1788361402720.webp';
import cryptoImg from '../assets/images/crypto_forensics_1788361418455.webp';
import ollamaImg from '../assets/images/ollama_local_ai_1788693773323.webp';
import { Article, PrimaryCategory } from '../types';
import { getArticleCyberVisual } from './cyberArtworks';

export const HACKER_COVERS = [
  cyberImg,
  aiImg,
  blueprintImg,
  toolsImg,
  redTeamImg,
  cryptoImg,
  ollamaImg
];

export const HACKER_CATEGORY_COVERS: Record<PrimaryCategory, string[]> = {
  'Cyber Security': [cyberImg, redTeamImg, cryptoImg],
  'Autonomous Systems Hub': [ollamaImg, aiImg, cryptoImg],
  'Autonomous Systems & Productivity': [ollamaImg, aiImg, cryptoImg],
  'Security Tools': [toolsImg, redTeamImg, blueprintImg],
  'Cybersecurity': [cyberImg, redTeamImg, cryptoImg],
  'Blueprint': [blueprintImg, cyberImg, toolsImg],
  'Tools & Apps': [toolsImg, redTeamImg, blueprintImg]
};

/**
 * Returns a high-resolution, unique hacker-themed cover image URL for an article.
 * Generates an instant, distinct vector cyber graphic for zero-latency loading.
 */
export function getArticleCoverImage(article: Article): { src: string; alt: string } {
  if (article?.coverImage?.src && article.coverImage.src.trim() !== '') {
    return {
      src: article.coverImage.src,
      alt: article.coverImage.alt || article.title
    };
  }

  return {
    src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    alt: article?.title || 'Security Research'
  };
}

/**
 * Returns the photographic cover image for feed cards with clean fallback.
 */
export function getArticleCardCoverImage(article: Article): { src: string; alt: string } {
  if (article?.coverImage?.src && article.coverImage.src.trim() !== '') {
    return {
      src: article.coverImage.src,
      alt: article.coverImage.alt || `${article.title} Cover`
    };
  }

  return {
    src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    alt: article?.coverImage?.alt || `${article?.title || 'Security Research'} Cover`
  };
}
