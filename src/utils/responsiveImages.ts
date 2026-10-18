/**
 * Responsive Image Utility for YinYangYoHackers
 * Optimizes image delivery, responsive viewport scaling, and exact natural aspect ratios.
 * Prevents Cumulative Layout Shift (CLS), distorted images, and oversized assets.
 */

export interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: '16/9' | '1/1' | '4/3' | 'auto';
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Normalizes and generates a responsive image URL for Unsplash CDN with exact integer aspect ratio dimensions.
 * Injects target width, matching target height, explicit modern format (WebP or AVIF), and quality parameters.
 */
export function getOptimizedImageUrl(
  url: string,
  targetWidth: number,
  quality = 80,
  format: 'webp' | 'avif' | 'auto' = 'webp',
  targetHeight?: number
): string {
  if (!url) return '';

  // Snap 16:9 widths to multiples of 16 so width/height are exact integers with 1.7778 ratio
  const isSquare = targetHeight !== undefined && targetHeight === targetWidth;
  const resolvedWidth = isSquare
    ? targetWidth
    : targetHeight !== undefined
      ? targetWidth
      : Math.max(16, Math.round(targetWidth / 16) * 16);
  const resolvedHeight = isSquare
    ? targetWidth
    : targetHeight !== undefined
      ? targetHeight
      : (resolvedWidth * 9) / 16;

  // If it's an Unsplash image, optimize with explicit w & h dimensions, metadata stripping (cs=strip), and WebP/AVIF modern format
  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('w', resolvedWidth.toString());
      parsed.searchParams.set('h', resolvedHeight.toString());
      parsed.searchParams.set('auto', 'format');
      if (format !== 'auto') {
        parsed.searchParams.set('fm', format);
      }
      parsed.searchParams.set('fit', 'crop');
      parsed.searchParams.set('q', quality.toString());
      parsed.searchParams.set('cs', 'strip');
      return parsed.toString();
    } catch {
      // Fallback regex replacement if URL constructor fails
      const base = url.split('?')[0];
      return `${base}?w=${resolvedWidth}&h=${resolvedHeight}&auto=format&fm=${format}&fit=crop&q=${quality}&cs=strip`;
    }
  }

  return url;
}

/**
 * Generates an exact 1:1 square image URL so display dimensions match natural 1:1 aspect ratio.
 */
export function getOptimizedSquareImageUrl(
  url: string,
  size: number,
  quality = 80,
  format: 'webp' | 'avif' | 'auto' = 'webp'
): string {
  return getOptimizedImageUrl(url, size, quality, format, size);
}

/**
 * Generates a full srcSet attribute for modern responsive displays (mobile, tablet, desktop, 2x HiDPI).
 * All widths are snapped to exact aspect ratio multiples so natural dimensions match display dimensions.
 */
export function getResponsiveSrcSet(
  url: string,
  widths: number[] = [320, 480, 640, 800, 1280],
  format: 'webp' | 'avif' | 'auto' = 'webp',
  aspectRatio: '16/9' | '1/1' | '4/3' = '16/9'
): string {
  if (!url || !url.includes('images.unsplash.com')) {
    return '';
  }

  return widths
    .map(rawW => {
      if (aspectRatio === '1/1') {
        return `${getOptimizedImageUrl(url, rawW, 80, format, rawW)} ${rawW}w`;
      }
      if (aspectRatio === '4/3') {
        const w = Math.max(4, Math.round(rawW / 4) * 4);
        const h = (w * 3) / 4;
        return `${getOptimizedImageUrl(url, w, 80, format, h)} ${w}w`;
      }
      const w = Math.max(16, Math.round(rawW / 16) * 16);
      const h = (w * 9) / 16;
      return `${getOptimizedImageUrl(url, w, 80, format, h)} ${w}w`;
    })
    .join(', ');
}

/**
 * Standard sizes attribute for grid cards (1 col mobile, 2 col tablet, 3 col desktop)
 */
export const CARD_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 420px';

/**
 * Standard sizes attribute for featured hero article card
 */
export const FEATURED_HERO_SIZES = '(max-width: 1024px) 100vw, 550px';

/**
 * Standard sizes attribute for modal reading view hero image
 */
export const MODAL_HERO_SIZES = '(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 840px';
