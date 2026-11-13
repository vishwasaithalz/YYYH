import { Article } from '../types';

export interface CyberVisual {
  code: string;
  categoryTag: string;
  themeColor: string;
  themeBg: string;
  themeBorder: string;
  themeText: string;
  gradient: string;
  svgDataUri: string;
  metricLabel: string;
}

const THEME_PALETTES = [
  {
    name: 'emerald',
    primary: '#10b981',
    bg: 'rgba(6, 78, 59, 0.4)',
    border: 'rgba(16, 185, 129, 0.4)',
    text: 'text-emerald-400',
    gradient: 'from-emerald-950 via-[#06141a] to-[#040813]',
    hex: '#10b981'
  },
  {
    name: 'cyan',
    primary: '#06b6d4',
    bg: 'rgba(8, 51, 68, 0.4)',
    border: 'rgba(6, 182, 212, 0.4)',
    text: 'text-cyan-400',
    gradient: 'from-cyan-950 via-[#071321] to-[#040813]',
    hex: '#06b6d4'
  },
  {
    name: 'crimson',
    primary: '#ef4444',
    bg: 'rgba(69, 10, 10, 0.4)',
    border: 'rgba(239, 68, 68, 0.4)',
    text: 'text-red-400',
    gradient: 'from-red-950 via-[#1a080c] to-[#040813]',
    hex: '#ef4444'
  },
  {
    name: 'amber',
    primary: '#f59e0b',
    bg: 'rgba(69, 26, 3, 0.4)',
    border: 'rgba(245, 158, 11, 0.4)',
    text: 'text-amber-400',
    gradient: 'from-amber-950 via-[#181105] to-[#040813]',
    hex: '#f59e0b'
  },
  {
    name: 'purple',
    primary: '#a855f7',
    bg: 'rgba(59, 7, 100, 0.4)',
    border: 'rgba(168, 85, 247, 0.4)',
    text: 'text-purple-400',
    gradient: 'from-purple-950 via-[#14081f] to-[#040813]',
    hex: '#a855f7'
  },
  {
    name: 'teal',
    primary: '#14b8a6',
    bg: 'rgba(19, 78, 74, 0.4)',
    border: 'rgba(20, 184, 166, 0.4)',
    text: 'text-teal-400',
    gradient: 'from-teal-950 via-[#081816] to-[#040813]',
    hex: '#14b8a6'
  }
];

function generateHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Returns a unique, distinct, ultra fast loading vector cyber graphic for an article.
 * Loads instantly in 0ms with zero network requests.
 */
export function getArticleCyberVisual(article: Article): CyberVisual {
  const seed = (article.slug || article.id || article.title || 'yyyh').toLowerCase();
  const hash = generateHash(seed);
  const palette = THEME_PALETTES[hash % THEME_PALETTES.length];

  const patternType = hash % 5;
  const numCode = (hash % 899) + 100;
  const prefix = article.category.includes('Cyber') ? 'SEC' : article.category.includes('Autonomous') ? 'AI' : 'TOOL';
  const code = `${prefix} ${numCode}`;

  // Unique procedural geometric SVG paths based on hash
  let patternPaths = '';
  const c = palette.hex;

  if (patternType === 0) {
    // Network mesh topology
    patternPaths = `
      <g stroke="${c}" stroke-width="1" stroke-opacity="0.3">
        <line x1="40" y1="50" x2="160" y2="120" />
        <line x1="160" y1="120" x2="300" y2="70" />
        <line x1="300" y1="70" x2="450" y2="140" />
        <line x1="450" y1="140" x2="580" y2="60" />
        <line x1="160" y1="120" x2="220" y2="240" />
        <line x1="300" y1="70" x2="360" y2="220" />
        <line x1="220" y1="240" x2="360" y2="220" />
        <line x1="360" y1="220" x2="520" y2="250" />
      </g>
      <circle cx="40" cy="50" r="4" fill="${c}" />
      <circle cx="160" cy="120" r="5" fill="${c}" />
      <circle cx="300" cy="70" r="6" fill="${c}" />
      <circle cx="450" cy="140" r="5" fill="${c}" />
      <circle cx="580" cy="60" r="4" fill="${c}" />
      <circle cx="220" cy="240" r="5" fill="${c}" />
      <circle cx="360" cy="220" r="6" fill="${c}" />
      <circle cx="520" cy="250" r="5" fill="${c}" />
      <circle cx="300" cy="70" r="14" stroke="${c}" stroke-width="1.5" stroke-dasharray="3 3" fill="none" opacity="0.6" />
      <circle cx="360" cy="220" r="18" stroke="${c}" stroke-width="1.5" stroke-dasharray="4 4" fill="none" opacity="0.6" />
    `;
  } else if (patternType === 1) {
    // Cyber radar & circular coordinate reticle
    patternPaths = `
      <g stroke="${c}" stroke-width="1" fill="none" opacity="0.4">
        <circle cx="320" cy="160" r="40" />
        <circle cx="320" cy="160" r="90" stroke-dasharray="6 4" />
        <circle cx="320" cy="160" r="140" />
        <line x1="140" y1="160" x2="500" y2="160" />
        <line x1="320" y1="20" x2="320" y2="300" />
        <line x1="320" y1="160" x2="440" y2="60" stroke-width="2" opacity="0.8" />
      </g>
      <circle cx="440" cy="60" r="6" fill="${c}" />
      <circle cx="250" cy="100" r="4" fill="${c}" opacity="0.8" />
      <circle cx="390" cy="210" r="5" fill="${c}" opacity="0.9" />
    `;
  } else if (patternType === 2) {
    // Hexagonal cryptographic cell matrix
    patternPaths = `
      <g stroke="${c}" stroke-width="1.5" fill="none" opacity="0.35">
        <polygon points="120,80 150,60 180,80 180,120 150,140 120,120" />
        <polygon points="180,120 210,100 240,120 240,160 210,180 180,160" />
        <polygon points="240,80 270,60 300,80 300,120 270,140 240,120" />
        <polygon points="300,120 330,100 360,120 360,160 330,180 300,160" fill="rgba(16,185,129,0.1)" />
        <polygon points="360,80 390,60 420,80 420,120 390,140 360,120" />
        <polygon points="420,120 450,100 480,120 480,160 450,180 420,160" />
        <polygon points="300,200 330,180 360,200 360,240 330,260 300,240" />
      </g>
      <circle cx="330" cy="140" r="4" fill="${c}" />
      <circle cx="210" cy="140" r="4" fill="${c}" opacity="0.6" />
      <circle cx="450" cy="140" r="4" fill="${c}" opacity="0.6" />
    `;
  } else if (patternType === 3) {
    // Microcircuit trace & bus architecture
    patternPaths = `
      <g stroke="${c}" stroke-width="1.5" fill="none" opacity="0.45">
        <path d="M 60,80 L 180,80 L 220,120 L 380,120 L 420,80 L 580,80" />
        <path d="M 100,140 L 200,140 L 250,190 L 350,190 L 400,140 L 540,140" />
        <path d="M 140,240 L 240,240 L 280,200 L 440,200 L 480,240 L 560,240" />
        <rect x="270" y="90" width="80" height="60" rx="6" stroke="${c}" stroke-width="2" fill="rgba(6,182,212,0.1)" />
      </g>
      <circle cx="60" cy="80" r="4" fill="${c}" />
      <circle cx="580" cy="80" r="4" fill="${c}" />
      <circle cx="100" cy="140" r="4" fill="${c}" />
      <circle cx="540" cy="140" r="4" fill="${c}" />
      <circle cx="140" cy="240" r="4" fill="${c}" />
      <circle cx="560" cy="240" r="4" fill="${c}" />
    `;
  } else {
    // Cryptographic data stream & frequency spectrum
    patternPaths = `
      <g stroke="${c}" stroke-width="2" opacity="0.4" fill="none">
        <path d="M 40,160 Q 120,60 200,160 T 360,160 T 520,160 T 620,160" />
        <path d="M 40,160 Q 120,240 200,160 T 360,160 T 520,160 T 620,160" stroke-dasharray="6 4" opacity="0.5" />
      </g>
      <g fill="${c}" opacity="0.8">
        <rect x="180" y="110" width="8" height="100" rx="3" />
        <rect x="220" y="80" width="8" height="160" rx="3" />
        <rect x="260" y="130" width="8" height="60" rx="3" />
        <rect x="300" y="60" width="8" height="200" rx="3" />
        <rect x="340" y="100" width="8" height="120" rx="3" />
        <rect x="380" y="140" width="8" height="40" rx="3" />
        <rect x="420" y="90" width="8" height="140" rx="3" />
      </g>
    `;
  }

  const rawSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320" width="640" height="320">
      <defs>
        <radialGradient id="grad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="${palette.hex}" stop-opacity="0.25" />
          <stop offset="60%" stop-color="#050914" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#02040a" stop-opacity="1" />
        </radialGradient>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1" />
        </pattern>
      </defs>
      
      <!-- Dark Cyber Matrix Background -->
      <rect width="640" height="320" fill="#03060f" />
      <rect width="640" height="320" fill="url(#grad)" />
      <rect width="640" height="320" fill="url(#grid)" />
      
      <!-- Tech HUD Corner Framing -->
      <g stroke="${c}" stroke-width="2" fill="none" opacity="0.6">
        <path d="M 20,40 L 20,20 L 40,20" />
        <path d="M 620,40 L 620,20 L 600,20" />
        <path d="M 20,280 L 20,300 L 40,300" />
        <path d="M 620,280 L 620,300 L 600,300" />
      </g>
      
      <!-- Procedural Architecture Topology -->
      ${patternPaths}
      
      <!-- Top Cyber Metadata Bar -->
      <text x="32" y="38" fill="${c}" font-family="monospace" font-size="12" font-weight="bold" letter-spacing="2">
        // PROTOCOL: ${code}
      </text>
      <text x="608" y="38" fill="rgba(255,255,255,0.5)" font-family="monospace" font-size="10" text-anchor="end" letter-spacing="1">
        SHA256: ${seed.slice(0, 8).toUpperCase()}
      </text>
      
      <!-- Bottom HUD Status -->
      <line x1="30" y1="280" x2="610" y2="280" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
      <text x="32" y="298" fill="rgba(255,255,255,0.6)" font-family="monospace" font-size="10" letter-spacing="1">
        STATUS: ENCRYPTED IN-MEMORY
      </text>
      <text x="608" y="298" fill="${c}" font-family="monospace" font-size="10" font-weight="bold" text-anchor="end" letter-spacing="1">
        VERIFIED BLUEPRINT
      </text>
    </svg>
  `.trim().replace(/\s+/g, ' ');

  const svgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(rawSvg)}`;

  return {
    code,
    categoryTag: article.category,
    themeColor: palette.primary,
    themeBg: palette.bg,
    themeBorder: palette.border,
    themeText: palette.text,
    gradient: palette.gradient,
    svgDataUri,
    metricLabel: `${(hash % 90 + 10)}% ENTROPY`
  };
}
