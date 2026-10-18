import cyberImg from '../assets/images/cyber_defense_matrix_1788361050164.webp';
import aiImg from '../assets/images/sovereign_ai_cluster_1788361072249.webp';
import blueprintImg from '../assets/images/linux_blueprint_server_1788361086091.webp';
import toolsImg from '../assets/images/hacker_hardware_tools_1788361100351.webp';
import redTeamImg from '../assets/images/red_team_recon_1788361402720.webp';
import cryptoImg from '../assets/images/crypto_forensics_1788361418455.webp';
import ollamaImg from '../assets/images/ollama_local_ai_1788693773323.webp';
import { Article, PrimaryCategory } from '../types';

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
 * If the article already specifies a valid coverImage, it is used. Otherwise,
 * it returns a category-matched custom cyber asset.
 */
export function getArticleCoverImage(article: Article): { src: string; alt: string } {
  if (article?.slug === 'how-to-run-ai-locally-with-ollama' || article?.id === 'ai-1') {
    return {
      src: ollamaImg,
      alt: 'Local Compute inference with Ollama, neural network weights offloading to GPU VRAM and terminal interface'
    };
  }

  if (article?.coverImage?.src && article.coverImage.src.trim() !== '') {
    return {
      src: article.coverImage.src,
      alt: article.coverImage.alt || article.title
    };
  }

  const category = article?.category || 'Cybersecurity';
  const categoryPool = HACKER_CATEGORY_COVERS[category] || HACKER_COVERS;
  
  // Consistent deterministic selection based on article id/title
  const hashKey = (article?.id || article?.title || 'yyyh').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selectedSrc = categoryPool[hashKey % categoryPool.length] || cyberImg;

  return {
    src: selectedSrc,
    alt: `${article?.title || 'Security Research'} Cover`
  };
}

/**
 * Returns a fast-loading local 640x360 WebP cover image (~24-34 KB) for feed cards
 * to eliminate external third-party CDN latency and reduce image download time.
 */
export function getArticleCardCoverImage(article: Article): { src: string; alt: string } {
  if (article?.slug === 'how-to-run-ai-locally-with-ollama' || article?.id === 'ai-1') {
    return {
      src: ollamaImg,
      alt: 'Local Compute inference with Ollama, neural network weights offloading to GPU VRAM and terminal interface'
    };
  }

  const category = article?.category || 'Cybersecurity';
  const categoryPool = HACKER_CATEGORY_COVERS[category] || HACKER_COVERS;
  const hashKey = (article?.id || article?.slug || article?.title || 'yyyh')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selectedSrc = categoryPool[hashKey % categoryPool.length] || cyberImg;

  return {
    src: selectedSrc,
    alt: article?.coverImage?.alt || `${article?.title || 'Security Research'} Cover`
  };
}
