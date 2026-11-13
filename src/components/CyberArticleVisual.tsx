import React, { useState, useRef, useCallback } from 'react';
import { 
  Shield, 
  Terminal, 
  Cpu, 
  Lock, 
  Activity, 
  Zap, 
  Radio, 
  Flame, 
  Layers, 
  Server,
  Binary,
  Compass,
  Sparkles
} from 'lucide-react';

interface CyberArticleVisualProps {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  className?: string;
  aspectRatio?: 'video' | 'wide' | 'square';
  showBadge?: boolean;
}

// 6 distinct high-tech cyber colorways
const COLORWAYS = [
  {
    name: 'emerald',
    primary: '#10b981',
    primaryRgb: '16, 185, 129',
    accent: '#34d399',
    gradient: 'from-[#041a14] via-[#06241c] to-[#030d0a]',
    border: 'border-emerald-500/40',
    badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60',
    icon: Shield
  },
  {
    name: 'cyan',
    primary: '#06b6d4',
    primaryRgb: '6, 182, 212',
    accent: '#38bdf8',
    gradient: 'from-[#041724] via-[#052136] to-[#020d14]',
    border: 'border-cyan-500/40',
    badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/60',
    icon: Terminal
  },
  {
    name: 'crimson',
    primary: '#ef4444',
    primaryRgb: '239, 68, 68',
    accent: '#f87171',
    gradient: 'from-[#22070a] via-[#33090e] to-[#120204]',
    border: 'border-red-500/40',
    badge: 'bg-red-950/80 text-red-300 border-red-500/60',
    icon: Flame
  },
  {
    name: 'amber',
    primary: '#f59e0b',
    primaryRgb: '245, 158, 11',
    accent: '#fbbf24',
    gradient: 'from-[#211403] via-[#331c05] to-[#120b02]',
    border: 'border-amber-500/40',
    badge: 'bg-amber-950/80 text-amber-300 border-amber-500/60',
    icon: Zap
  },
  {
    name: 'purple',
    primary: '#a855f7',
    primaryRgb: '168, 85, 247',
    accent: '#c084fc',
    gradient: 'from-[#1b0629] via-[#2a0940] to-[#0d0214]',
    border: 'border-purple-500/40',
    badge: 'bg-purple-950/80 text-purple-300 border-purple-500/60',
    icon: Cpu
  },
  {
    name: 'teal',
    primary: '#14b8a6',
    primaryRgb: '20, 184, 166',
    accent: '#2dd4bf',
    gradient: 'from-[#041a18] via-[#062925] to-[#020e0d]',
    border: 'border-teal-500/40',
    badge: 'bg-teal-950/80 text-teal-300 border-teal-500/60',
    icon: Lock
  }
];

function stringHash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

export const CyberArticleVisual: React.FC<CyberArticleVisualProps> = ({
  id,
  title,
  category,
  subcategory,
  className = '',
  aspectRatio = 'video',
  showBadge = true
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, isHovered: false });

  const hash = React.useMemo(() => stringHash(`${id}:${title}:${category}`), [id, title, category]);
  
  // Pick deterministic theme based on hash
  const colorway = COLORWAYS[hash % COLORWAYS.length];
  const IconComponent = colorway.icon;
  
  // Deterministic cyber code
  const codeNumber = (hash % 899) + 100;
  const prefix = category.includes('Cyber') ? 'SEC' : category.includes('Autonomous') || category.includes('Model') ? 'AI' : 'LAB';
  const cyberCode = `${prefix}.${codeNumber}`;
  
  // Pick pattern topology (0 to 5)
  const patternType = hash % 6;
  
  // SVG coordinates and shapes based on patternType
  const primaryColor = colorway.primary;
  const accentColor = colorway.accent;

  const aspectClass = 
    aspectRatio === 'video' ? 'aspect-[16/9]' :
    aspectRatio === 'wide' ? 'aspect-[21/9]' : 'aspect-square';

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    // Calculate tilt: -8 to +8 degrees
    setTilt({
      x: (x - 0.5) * 12,
      y: (0.5 - y) * 12,
      isHovered: true
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, isHovered: false });
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tilt.isHovered 
          ? `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale3d(1.02, 1.02, 1.02)` 
          : 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: tilt.isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out'
      }}
      className={`relative w-full ${aspectClass} overflow-hidden bg-gradient-to-br ${colorway.gradient} border-b border-slate-800/80 flex items-center justify-center select-none group/visual cursor-pointer ${className}`}
      aria-hidden="true"
    >
      {/* Dynamic Cyber Grid */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none transition-opacity duration-300 group-hover/visual:opacity-40"
        style={{
          backgroundImage: `linear-gradient(rgba(${colorway.primaryRgb}, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(${colorway.primaryRgb}, 0.25) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Reactive Interactive Glow Tracking Cursor */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: tilt.isHovered
            ? `radial-gradient(circle at ${(tilt.x / 12 + 0.5) * 100}% ${(0.5 - tilt.y / 12) * 100}%, rgba(${colorway.primaryRgb}, 0.35) 0%, transparent 60%)`
            : `radial-gradient(circle at 50% 50%, rgba(${colorway.primaryRgb}, 0.2) 0%, transparent 70%)`
        }}
      />

      {/* Futuristic Scanline Sweep Effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover/visual:opacity-100 transition-opacity duration-500 overflow-hidden"
      >
        <div 
          className="w-full h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-y-full group-hover/visual:translate-y-[400%] transition-transform duration-1000 ease-in-out"
        />
      </div>

      {/* Decorative Procedural Vector Artwork */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none opacity-70 group-hover/visual:opacity-95 group-hover/visual:scale-105 transition-all duration-500 ease-out" 
        viewBox="0 0 400 225" 
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.1" />
          </linearGradient>
          <pattern id={`hex-${id}`} width="30" height="52" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
            <path 
              d="M15 0 L30 8.66 L30 26 L15 34.66 L0 26 L0 8.66 Z M15 34.66 L30 43.32 L30 60.64 L15 69.3 L0 60.64 L0 43.32 Z" 
              fill="none" 
              stroke={primaryColor} 
              strokeWidth="0.5" 
              strokeOpacity="0.25" 
            />
          </pattern>
        </defs>

        {/* Pattern 0: Hexagonal Matrix & Attack Path */}
        {patternType === 0 && (
          <g>
            <rect width="400" height="225" fill={`url(#hex-${id})`} />
            <circle cx="200" cy="112" r="70" fill="none" stroke={primaryColor} strokeWidth="1" strokeDasharray="6,4" />
            <circle cx="200" cy="112" r="45" fill="none" stroke={accentColor} strokeWidth="1.5" />
            <circle cx="200" cy="112" r="20" fill={`rgba(${colorway.primaryRgb}, 0.25)`} stroke={primaryColor} strokeWidth="2" />
            
            {/* Traversal lines */}
            <path d="M 60 40 L 140 80 L 200 112 L 260 80 L 340 40" stroke={primaryColor} strokeWidth="1.5" fill="none" strokeDasharray="3,3" />
            <path d="M 60 185 L 140 144 L 200 112 L 260 144 L 340 185" stroke={accentColor} strokeWidth="1.5" fill="none" />
            
            <circle cx="140" cy="80" r="4" fill={primaryColor} />
            <circle cx="260" cy="80" r="4" fill={accentColor} />
            <circle cx="140" cy="144" r="4" fill={primaryColor} />
            <circle cx="260" cy="144" r="4" fill={accentColor} />
          </g>
        )}

        {/* Pattern 1: Concentric Perimeter Shield */}
        {patternType === 1 && (
          <g>
            <circle cx="200" cy="112" r="85" fill="none" stroke={primaryColor} strokeWidth="1" strokeOpacity="0.4" />
            <circle cx="200" cy="112" r="65" fill="none" stroke={accentColor} strokeWidth="2" strokeDasharray="12,6" />
            <circle cx="200" cy="112" r="42" fill="none" stroke={primaryColor} strokeWidth="1.5" />
            
            {/* Radar Crosshairs */}
            <line x1="70" y1="112" x2="330" y2="112" stroke={primaryColor} strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4,4" />
            <line x1="200" y1="20" x2="200" y2="205" stroke={primaryColor} strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4,4" />
            
            {/* Corner Bracket Reticles */}
            <path d="M 120 50 L 100 50 L 100 70" stroke={accentColor} strokeWidth="2" fill="none" />
            <path d="M 280 50 L 300 50 L 300 70" stroke={accentColor} strokeWidth="2" fill="none" />
            <path d="M 120 175 L 100 175 L 100 155" stroke={accentColor} strokeWidth="2" fill="none" />
            <path d="M 280 175 L 300 175 L 300 155" stroke={accentColor} strokeWidth="2" fill="none" />
          </g>
        )}

        {/* Pattern 2: Neural Synapse Network */}
        {patternType === 2 && (
          <g>
            <path d="M 80 70 Q 140 40, 200 80 T 320 60" fill="none" stroke={primaryColor} strokeWidth="2" />
            <path d="M 80 150 Q 150 190, 200 140 T 320 160" fill="none" stroke={accentColor} strokeWidth="2" strokeDasharray="8,4" />
            <path d="M 120 110 L 280 110" fill="none" stroke={primaryColor} strokeWidth="1.5" />
            <line x1="140" y1="55" x2="200" y2="140" stroke={accentColor} strokeWidth="1" strokeOpacity="0.6" />
            <line x1="200" y1="80" x2="260" y2="155" stroke={primaryColor} strokeWidth="1" strokeOpacity="0.6" />

            <circle cx="80" cy="70" r="5" fill={primaryColor} />
            <circle cx="200" cy="80" r="7" fill={accentColor} />
            <circle cx="320" cy="60" r="5" fill={primaryColor} />
            <circle cx="80" cy="150" r="5" fill={accentColor} />
            <circle cx="200" cy="140" r="7" fill={primaryColor} />
            <circle cx="320" cy="160" r="5" fill={accentColor} />
          </g>
        )}

        {/* Pattern 3: Cryptographic Cipher Block Rings */}
        {patternType === 3 && (
          <g>
            <rect x="140" y="55" width="120" height="115" rx="16" fill={`rgba(${colorway.primaryRgb}, 0.15)`} stroke={primaryColor} strokeWidth="1.5" />
            <circle cx="200" cy="112" r="32" fill="none" stroke={accentColor} strokeWidth="2" strokeDasharray="8,4" />
            <circle cx="200" cy="112" r="14" fill={primaryColor} />
            
            {/* Bus Lines */}
            <path d="M 40 112 L 140 112 M 260 112 L 360 112" stroke={primaryColor} strokeWidth="2" />
            <path d="M 200 15 L 200 55 M 200 170 L 200 210" stroke={accentColor} strokeWidth="2" />
            
            <circle cx="70" cy="112" r="4" fill={accentColor} />
            <circle cx="330" cy="112" r="4" fill={primaryColor} />
          </g>
        )}

        {/* Pattern 4: Packet Forensics Oscilloscope */}
        {patternType === 4 && (
          <g>
            <path 
              d="M 20 112 L 80 112 L 100 60 L 120 160 L 140 85 L 160 135 L 180 112 L 230 112 L 250 45 L 270 180 L 290 80 L 310 135 L 330 112 L 380 112" 
              fill="none" 
              stroke={primaryColor} 
              strokeWidth="2.5" 
              strokeLinejoin="round"
            />
            <path 
              d="M 20 112 L 80 112 L 100 75 L 120 145 L 140 95 L 160 125 L 180 112 L 230 112 L 250 65 L 270 160 L 290 95 L 310 125 L 330 112 L 380 112" 
              fill="none" 
              stroke={accentColor} 
              strokeWidth="1.5" 
              strokeOpacity="0.5"
              strokeDasharray="4,4"
              strokeLinejoin="round"
            />
          </g>
        )}

        {/* Pattern 5: Linux Kernel Privilege Ring Isolator */}
        {patternType === 5 && (
          <g>
            <circle cx="200" cy="112" r="88" fill="none" stroke={primaryColor} strokeWidth="1" strokeDasharray="16,8" />
            <circle cx="200" cy="112" r="64" fill="none" stroke={accentColor} strokeWidth="1.5" />
            <circle cx="200" cy="112" r="40" fill="none" stroke={primaryColor} strokeWidth="2" strokeDasharray="4,4" />
            <circle cx="200" cy="112" r="18" fill={`rgba(${colorway.primaryRgb}, 0.3)`} stroke={accentColor} strokeWidth="2" />
            
            {/* Cardinal ticks */}
            <line x1="200" y1="15" x2="200" y2="35" stroke={accentColor} strokeWidth="2" />
            <line x1="200" y1="190" x2="200" y2="210" stroke={accentColor} strokeWidth="2" />
            <line x1="100" y1="112" x2="120" y2="112" stroke={primaryColor} strokeWidth="2" />
            <line x1="280" y1="112" x2="300" y2="112" stroke={primaryColor} strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* Centerpiece Cyber Hologram Icon */}
      <div className="relative z-10 flex flex-col items-center justify-center p-3 text-center">
        <div 
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-2xl relative backdrop-blur-md group-hover/visual:scale-110 transition-transform duration-300"
          style={{
            backgroundColor: `rgba(${colorway.primaryRgb}, 0.18)`,
            border: `1.5px solid rgba(${colorway.primaryRgb}, 0.65)`,
            boxShadow: `0 0 35px rgba(${colorway.primaryRgb}, 0.4)`
          }}
        >
          <IconComponent 
            className="w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-300"
            style={{ color: primaryColor }}
          />
          {/* Corner Ticks */}
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2" style={{ borderColor: accentColor }} />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2" style={{ borderColor: accentColor }} />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2" style={{ borderColor: accentColor }} />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2" style={{ borderColor: accentColor }} />
        </div>

        {/* Classification Title Overlay */}
        <div className="mt-2.5 space-y-0.5">
          <div 
            className="text-[11px] font-mono font-bold tracking-widest uppercase text-shadow-sm"
            style={{ color: accentColor }}
          >
            {category}
          </div>
          {subcategory && (
            <div className="text-[10px] font-mono text-slate-300 opacity-80">
              {subcategory}
            </div>
          )}
        </div>
      </div>

      {/* Top Left: Category Badge */}
      {showBadge && (
        <div className="absolute top-2.5 left-2.5 z-20">
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border backdrop-blur-sm shadow-sm ${colorway.badge}`}>
            {category}
          </span>
        </div>
      )}

      {/* Top Right: Deterministic Cyber Code Stamp */}
      <div className="absolute top-2.5 right-2.5 z-20">
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#03060f]/90 border border-slate-700/80 text-slate-300 backdrop-blur-md shadow-sm">
          {cyberCode}
        </span>
      </div>

      {/* Bottom Scanline Glow Accent */}
      <div 
        className="absolute bottom-0 inset-x-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`
        }}
      />
    </div>
  );
};
