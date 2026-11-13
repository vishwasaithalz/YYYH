import React, { useEffect, useRef } from 'react';

interface HackerStreamCanvasProps {
  className?: string;
  opacity?: number;
}

export const HackerStreamCanvas: React.FC<HackerStreamCanvasProps> = ({
  className = '',
  opacity = 0.22
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Characters: Binary, Hexadecimal, and Security primitives
    const chars = '010101010123456789ABCDEF!#%&*<>{}[]:/\\~';
    const fontSize = 13;
    let columns = 0;
    let drops: number[] = [];
    let speeds: number[] = [];
    let charAlphas: number[] = [];

    const initGrid = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      columns = Math.floor(rect.width / fontSize);
      drops = [];
      speeds = [];
      charAlphas = [];

      for (let i = 0; i < columns; i++) {
        // Random initial vertical position staggered across canvas
        drops[i] = Math.random() * -50;
        // Subtle, slow falling speed (0.35 to 0.85)
        speeds[i] = 0.35 + Math.random() * 0.5;
        // Individual column base brightness
        charAlphas[i] = 0.4 + Math.random() * 0.6;
      }
    };

    initGrid();
    window.addEventListener('resize', initGrid);

    // Track intersection to pause when scrolled out of view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const mouseMoveHandler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };

    const mouseLeaveHandler = () => {
      mouseRef.current.active = false;
    };

    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener('mousemove', mouseMoveHandler);
      containerEl.addEventListener('mouseleave', mouseLeaveHandler);
    }

    let lastDrawTime = 0;
    const fpsInterval = 1000 / 30; // Smooth 30 FPS for serene subtle rain without CPU spike

    const render = (currentTime: number) => {
      if (!isVisible || document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const elapsed = currentTime - lastDrawTime;
      if (elapsed < fpsInterval && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      lastDrawTime = currentTime - (elapsed % fpsInterval);

      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect ? rect.width : canvas.width;
      const height = rect ? rect.height : canvas.height;

      // Semi-transparent fade layer to create character trails
      ctx.fillStyle = 'rgba(6, 11, 22, 0.18)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseActive = mouseRef.current.active;

      for (let i = 0; i < columns; i++) {
        // Pick random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Check proximity to cursor for interactive reactive glow
        let proximityBoost = 0;
        if (mouseActive) {
          const dist = Math.hypot(mx - x, my - y);
          if (dist < 120) {
            proximityBoost = (1 - dist / 120) * 0.6;
          }
        }

        // Calculate final faint neon-green alpha
        const baseAlpha = opacity * charAlphas[i];
        const finalAlpha = Math.min(0.9, baseAlpha + proximityBoost);

        // Leading head character gets slight phosphor highlight
        const isHead = Math.random() > 0.88;
        if (isHead) {
          ctx.fillStyle = `rgba(167, 243, 208, ${Math.min(1, finalAlpha * 1.8)})`; // emerald-200
        } else {
          ctx.fillStyle = `rgba(16, 185, 129, ${finalAlpha})`; // emerald-500
        }

        // Only draw when on canvas
        if (y > -fontSize && y < height + fontSize) {
          ctx.fillText(char, x, y);
        }

        // Advance vertical drop
        if (!prefersReducedMotion) {
          drops[i] += speeds[i];

          // Reset drop to top with slight randomization
          if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
            speeds[i] = 0.35 + Math.random() * 0.5;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // If prefers-reduced-motion is enabled, render a single static subtle backdrop
    if (prefersReducedMotion) {
      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect ? rect.width : canvas.width;
      const height = rect ? rect.height : canvas.height;
      ctx.fillStyle = '#060b16';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px ui-monospace, monospace`;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < Math.floor(height / (fontSize * 2)); j++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(char, i * fontSize, j * fontSize * 2);
        }
      }
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', initGrid);
      observer.disconnect();
      if (containerEl) {
        containerEl.removeEventListener('mousemove', mouseMoveHandler);
        containerEl.removeEventListener('mouseleave', mouseLeaveHandler);
      }
    };
  }, [opacity]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
      {/* Subtle bottom and top gradient masks to keep text contrast crisp */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#040711] via-transparent to-[#080d1a]/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#040711]/60 via-transparent to-[#040711]/60" />
    </div>
  );
};
