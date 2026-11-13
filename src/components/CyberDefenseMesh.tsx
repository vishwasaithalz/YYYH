import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Shield, 
  Activity, 
  Radio, 
  Grid, 
  Zap, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Cpu, 
  Lock, 
  Terminal, 
  Crosshair,
  Server,
  Network
} from 'lucide-react';

export type MeshMode = 'mesh' | 'radar' | 'hex';

interface DefenseNode {
  id: string;
  name: string;
  shortCode: string;
  category: string;
  x: number; // 0..1 normalized
  y: number; // 0..1 normalized
  vx: number;
  vy: number;
  radius: number;
  color: string;
  metrics: {
    status: string;
    protocol: string;
    latency: string;
    throughput: string;
    threatScore: string;
  };
}

interface Packet {
  sourceIdx: number;
  targetIdx: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
}

interface RadarBlip {
  angle: number;
  distance: number; // 0..1
  label: string;
  severity: 'low' | 'medium' | 'high';
  detectedTime: number;
}

export const CyberDefenseMesh: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [mode, setMode] = useState<MeshMode>('mesh');
  const [activeNode, setActiveNode] = useState<DefenseNode | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [simulationState, setSimulationState] = useState<'idle' | 'probing' | 'neutralized'>('idle');
  const [stats, setStats] = useState({
    eventsPerSec: 1420,
    packetsFiltered: 84920,
    meshIntegrity: '100.0%'
  });

  // Audio Context ref for optional sound synth
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSynthTone = useCallback((freq: number, duration: number, type: OscillatorType = 'sine') => {
    if (!audioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext unavailable or blocked
    }
  }, [audioEnabled]);

  // Topology Nodes
  const nodesRef = useRef<DefenseNode[]>([
    {
      id: 'ingress-waf',
      name: 'Edge Ingress WAF',
      shortCode: 'WAF-01',
      category: 'Perimeter Defense',
      x: 0.15,
      y: 0.35,
      vx: 0.0002,
      vy: 0.0001,
      radius: 18,
      color: '#10b981', // emerald
      metrics: {
        status: 'ENFORCED',
        protocol: 'eBPF / XDP',
        latency: '0.12ms',
        throughput: '14.2 Gbps',
        threatScore: '0.00'
      }
    },
    {
      id: 'zero-trust',
      name: 'Zero-Trust Bastion',
      shortCode: 'ZTB-02',
      category: 'Identity & Access',
      x: 0.40,
      y: 0.22,
      vx: -0.0001,
      vy: 0.0002,
      radius: 20,
      color: '#06b6d4', // cyan
      metrics: {
        status: 'VERIFIED',
        protocol: 'mTLS / SPIFFE',
        latency: '0.45ms',
        throughput: '8.4 Gbps',
        threatScore: '0.00'
      }
    },
    {
      id: 'kernel-shield',
      name: 'Kernel Sysctl Shield',
      shortCode: 'KRN-03',
      category: 'Host Hardening',
      x: 0.38,
      y: 0.65,
      vx: 0.00015,
      vy: -0.0001,
      radius: 17,
      color: '#3b82f6', // blue
      metrics: {
        status: 'ACTIVE',
        protocol: 'ASLR / KASLR',
        latency: '0.04ms',
        throughput: 'Direct Ring0',
        threatScore: '0.00'
      }
    },
    {
      id: 'sovereign-ai',
      name: 'Sovereign AI Enclave',
      shortCode: 'SOV-04',
      category: 'Air-Gapped LLM',
      x: 0.68,
      y: 0.28,
      vx: -0.0002,
      vy: -0.00015,
      radius: 22,
      color: '#a855f7', // purple
      metrics: {
        status: 'ISOLATED',
        protocol: 'Local Ollama / vLLM',
        latency: '1.20ms',
        throughput: '94 tok/s',
        threatScore: '0.00'
      }
    },
    {
      id: 'wireguard-mesh',
      name: 'WireGuard Mesh Bus',
      shortCode: 'WGM-05',
      category: 'Encrypted Transport',
      x: 0.64,
      y: 0.72,
      vx: 0.0001,
      vy: 0.0001,
      radius: 18,
      color: '#10b981', // emerald
      metrics: {
        status: 'SYNCED',
        protocol: 'Noise_IK / ChaCha20',
        latency: '0.88ms',
        throughput: '6.1 Gbps',
        threatScore: '0.00'
      }
    },
    {
      id: 'crypto-monitor',
      name: 'Cryptographic Ledger',
      shortCode: 'LED-06',
      category: 'Integrity Verification',
      x: 0.86,
      y: 0.48,
      vx: -0.00015,
      vy: 0.0002,
      radius: 19,
      color: '#f59e0b', // amber
      metrics: {
        status: 'SEALED',
        protocol: 'RFC 1321 MD5 / SHA-256',
        latency: '0.08ms',
        throughput: '120k checks/s',
        threatScore: '0.00'
      }
    }
  ]);

  // Topology Edges (Index tuples)
  const edgesRef = useRef<[number, number][]>([
    [0, 1], // Ingress -> Zero Trust
    [0, 2], // Ingress -> Kernel
    [1, 3], // Zero Trust -> Sovereign AI
    [1, 4], // Zero Trust -> WireGuard
    [2, 4], // Kernel -> WireGuard
    [3, 5], // Sovereign AI -> Crypto Ledger
    [4, 5], // WireGuard -> Crypto Ledger
    [1, 2]  // Bastion -> Kernel Cross-check
  ]);

  // Packets in flight
  const packetsRef = useRef<Packet[]>([]);

  // Mouse interaction state
  const mouseRef = useRef<{ x: number; y: number; active: boolean; hoveredNodeIdx: number | null }>({
    x: 0,
    y: 0,
    active: false,
    hoveredNodeIdx: null
  });

  // Radar sweep state
  const radarRef = useRef<{
    angle: number;
    blips: RadarBlip[];
    pings: { x: number; y: number; radius: number; alpha: number }[];
  }>({
    angle: 0,
    blips: [
      { angle: 0.8, distance: 0.45, label: 'SYN-FLOOD MITIGATED', severity: 'high', detectedTime: Date.now() },
      { angle: 2.1, distance: 0.65, label: 'AUTHORIZED PORT PROBE', severity: 'low', detectedTime: Date.now() },
      { angle: 3.8, distance: 0.30, label: 'TOR EXIT NODE BLOCKED', severity: 'medium', detectedTime: Date.now() },
      { angle: 5.2, distance: 0.78, label: 'SSH KEY ROTATION OK', severity: 'low', detectedTime: Date.now() }
    ],
    pings: []
  });

  // Shockwave defense animations
  const shockwavesRef = useRef<{ x: number; y: number; radius: number; maxRadius: number; color: string; alpha: number }[]>([]);

  // Initialize Packets
  useEffect(() => {
    const packets: Packet[] = [];
    edgesRef.current.forEach(([src, tgt]) => {
      packets.push({
        sourceIdx: src,
        targetIdx: tgt,
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.006,
        color: '#10b981',
        size: 3
      });
      // Reverse direction packet
      packets.push({
        sourceIdx: tgt,
        targetIdx: src,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.005,
        color: '#06b6d4',
        size: 2.5
      });
    });
    packetsRef.current = packets;
  }, []);

  // Periodic stats jitter
  useEffect(() => {
    const interval = window.setInterval(() => {
      setStats(prev => ({
        eventsPerSec: 1350 + Math.floor(Math.random() * 180),
        packetsFiltered: prev.packetsFiltered + Math.floor(Math.random() * 12),
        meshIntegrity: '100.0%'
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Threat Simulation Trigger
  const triggerSimulation = () => {
    if (simulationState === 'probing') return;
    setSimulationState('probing');
    playSynthTone(320, 0.15, 'sawtooth');

    // Spawn red adversary probe packet from Ingress WAF
    const probePacket: Packet = {
      sourceIdx: 0,
      targetIdx: 1,
      progress: 0,
      speed: 0.015,
      color: '#f43f5e', // red
      size: 5
    };
    packetsRef.current.push(probePacket);

    // After 1s, trigger defense neutralization pulse
    window.setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const node = nodesRef.current[1]; // Zero Trust Bastion
        shockwavesRef.current.push({
          x: node.x * canvas.width,
          y: node.y * canvas.height,
          radius: 10,
          maxRadius: 180,
          color: '#10b981',
          alpha: 1
        });
      }
      playSynthTone(880, 0.25, 'sine');
      setSimulationState('neutralized');
      
      window.setTimeout(() => {
        setSimulationState('idle');
      }, 2500);
    }, 1000);
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Resize Handler
    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Visibility Observer to pause loop when offscreen
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

    const render = () => {
      if (!isVisible || document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect ? rect.width : canvas.width;
      const height = rect ? rect.height : canvas.height;

      // Dark cyber background clear
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Micro grid dots
      ctx.fillStyle = 'rgba(30, 41, 59, 0.5)';
      const gridSize = 32;
      for (let x = 16; x < width; x += gridSize) {
        for (let y = 16; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ==========================================
      // MODE 1: NEURAL DEFENSE TOPOLOGY MESH
      // ==========================================
      if (mode === 'mesh') {
        const nodes = nodesRef.current;
        const edges = edgesRef.current;

        // Update node drift slightly
        if (!prefersReducedMotion) {
          nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            if (node.x < 0.1 || node.x > 0.9) node.vx *= -1;
            if (node.y < 0.15 || node.y > 0.85) node.vy *= -1;
          });
        }

        // Draw Edges
        edges.forEach(([srcIdx, tgtIdx]) => {
          const src = nodes[srcIdx];
          const tgt = nodes[tgtIdx];
          const x1 = src.x * width;
          const y1 = src.y * height;
          const x2 = tgt.x * width;
          const y2 = tgt.y * height;

          const grad = ctx.createLinearGradient(x1, y1, x2, y2);
          grad.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
          grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.25)');
          grad.addColorStop(1, 'rgba(16, 185, 129, 0.15)');

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Data flow dashes
          ctx.beginPath();
          ctx.setLineDash([4, 12]);
          ctx.lineDashOffset = prefersReducedMotion ? 0 : -Date.now() * 0.02;
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.setLineDash([]);
        });

        // Interactive mouse connection line
        if (mouseRef.current.active) {
          const mx = mouseRef.current.x;
          const my = mouseRef.current.y;

          nodes.forEach((node) => {
            const nx = node.x * width;
            const ny = node.y * height;
            const dist = Math.hypot(mx - nx, my - ny);

            if (dist < 150) {
              const alpha = (1 - dist / 150) * 0.6;
              ctx.beginPath();
              ctx.moveTo(mx, my);
              ctx.lineTo(nx, ny);
              ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });

          // Draw cursor pointer aura
          ctx.beginPath();
          ctx.arc(mx, my, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#10b981';
          ctx.fill();
        }

        // Draw and update Packets
        if (!prefersReducedMotion) {
          for (let i = packetsRef.current.length - 1; i >= 0; i--) {
            const p = packetsRef.current[i];
            p.progress += p.speed;

            if (p.progress >= 1) {
              p.progress = 0;
              // Remove temporary red simulation packets
              if (p.color === '#f43f5e') {
                packetsRef.current.splice(i, 1);
                continue;
              }
            }

            const src = nodes[p.sourceIdx];
            const tgt = nodes[p.targetIdx];
            const px = (src.x + (tgt.x - src.x) * p.progress) * width;
            const py = (src.y + (tgt.y - src.y) * p.progress) * height;

            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }

        // Draw Shockwaves
        for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
          const sw = shockwavesRef.current[i];
          sw.radius += 3;
          sw.alpha = Math.max(0, 1 - sw.radius / sw.maxRadius);

          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(16, 185, 129, ${sw.alpha * 0.8})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          if (sw.radius >= sw.maxRadius) {
            shockwavesRef.current.splice(i, 1);
          }
        }

        // Draw Nodes
        let currentHoveredIdx: number | null = null;
        nodes.forEach((node, idx) => {
          const nx = node.x * width;
          const ny = node.y * height;
          const isHovered = mouseRef.current.active && 
            Math.hypot(mouseRef.current.x - nx, mouseRef.current.y - ny) < node.radius + 12;

          if (isHovered) {
            currentHoveredIdx = idx;
          }

          // Outer halo pulse
          const pulse = Math.sin(Date.now() * 0.003 + idx) * 4;
          const haloRadius = node.radius + (isHovered ? 14 : 6) + pulse;

          ctx.beginPath();
          ctx.arc(nx, ny, haloRadius, 0, Math.PI * 2);
          ctx.fillStyle = isHovered ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.05)';
          ctx.fill();

          // Node body
          ctx.beginPath();
          ctx.arc(nx, ny, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = isHovered ? '#091e1d' : '#07101e';
          ctx.fill();

          // Node border ring
          ctx.lineWidth = isHovered ? 2.5 : 1.5;
          ctx.strokeStyle = isHovered ? '#10b981' : node.color;
          ctx.stroke();

          // Inner core dot
          ctx.beginPath();
          ctx.arc(nx, ny, 4, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.fill();

          // Node label text
          ctx.font = '11px ui-monospace, monospace';
          ctx.fillStyle = isHovered ? '#34d399' : '#94a3b8';
          ctx.textAlign = 'center';
          ctx.fillText(node.shortCode, nx, ny + node.radius + 14);

          // Sub-label category
          ctx.font = '9px system-ui, sans-serif';
          ctx.fillStyle = '#64748b';
          ctx.fillText(node.category, nx, ny + node.radius + 25);
        });

        if (currentHoveredIdx !== mouseRef.current.hoveredNodeIdx) {
          mouseRef.current.hoveredNodeIdx = currentHoveredIdx;
          if (currentHoveredIdx !== null) {
            setActiveNode(nodes[currentHoveredIdx]);
            playSynthTone(440 + currentHoveredIdx * 60, 0.05, 'sine');
          } else {
            setActiveNode(null);
          }
        }
      }

      // ==========================================
      // MODE 2: RADAR SWEEP PERIMETER
      // ==========================================
      else if (mode === 'radar') {
        const cx = width / 2;
        const cy = height / 2;
        const maxR = Math.min(width, height) * 0.42;

        // Concentric Range Rings
        const rings = [0.25, 0.5, 0.75, 1.0];
        rings.forEach((rRatio, idx) => {
          const r = maxR * rRatio;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Distance labels
          ctx.font = '9px ui-monospace, monospace';
          ctx.fillStyle = 'rgba(52, 211, 153, 0.6)';
          ctx.fillText(`${(idx + 1) * 25}km`, cx + 6, cy - r + 12);
        });

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(cx - maxR, cy);
        ctx.lineTo(cx + maxR, cy);
        ctx.moveTo(cx, cy - maxR);
        ctx.lineTo(cx, cy + maxR);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.setLineDash([3, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Update Sweep Angle
        if (!prefersReducedMotion) {
          radarRef.current.angle += 0.025;
          if (radarRef.current.angle > Math.PI * 2) {
            radarRef.current.angle -= Math.PI * 2;
          }
        }
        const currentAngle = radarRef.current.angle;

        // Draw Sweep Beam Sector
        const sweepSpan = 0.5; // radians
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0.02)');

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxR, currentAngle - sweepSpan, currentAngle);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Sweep leading line
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(currentAngle) * maxR, cy + Math.sin(currentAngle) * maxR);
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Radar Blips
        radarRef.current.blips.forEach(blip => {
          const bx = cx + Math.cos(blip.angle) * (blip.distance * maxR);
          const by = cy + Math.sin(blip.angle) * (blip.distance * maxR);

          // Calculate angular distance to current beam
          let diff = (currentAngle - blip.angle) % (Math.PI * 2);
          if (diff < 0) diff += Math.PI * 2;

          const brightness = Math.max(0.15, 1 - diff / (Math.PI * 1.5));
          const color = blip.severity === 'high' ? `rgba(244, 63, 94, ${brightness})` :
                        blip.severity === 'medium' ? `rgba(245, 158, 11, ${brightness})` :
                        `rgba(52, 211, 153, ${brightness})`;

          ctx.beginPath();
          ctx.arc(bx, by, 5, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();

          ctx.font = '10px ui-monospace, monospace';
          ctx.fillStyle = color;
          ctx.fillText(blip.label, bx + 8, by - 6);
        });

        // Click Ripple Pings
        for (let i = radarRef.current.pings.length - 1; i >= 0; i--) {
          const ping = radarRef.current.pings[i];
          ping.radius += 2.5;
          ping.alpha -= 0.02;

          ctx.beginPath();
          ctx.arc(ping.x, ping.y, ping.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(6, 182, 212, ${Math.max(0, ping.alpha)})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          if (ping.alpha <= 0) {
            radarRef.current.pings.splice(i, 1);
          }
        }
      }

      // ==========================================
      // MODE 3: HEX MATRIX FIELD
      // ==========================================
      else if (mode === 'hex') {
        const hexSize = 28;
        const hexHeight = Math.sqrt(3) * hexSize;
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;

        const hexBytes = ['7F', '45', '4C', '46', '02', '01', '01', '00', '10', 'E9', 'FF', 'AA', '00', '5A', 'C3', '90'];

        for (let row = 0; row < height / (hexHeight * 0.75) + 1; row++) {
          for (let col = 0; col < width / (hexSize * 1.5) + 1; col++) {
            const hx = col * hexSize * 1.5;
            const hy = row * hexHeight + ((col % 2) * (hexHeight / 2));

            const dist = mouseRef.current.active ? Math.hypot(mx - hx, my - hy) : 300;
            const proximity = Math.max(0, 1 - dist / 180);

            ctx.beginPath();
            for (let a = 0; a < 6; a++) {
              const angle = (a * Math.PI) / 3;
              const vx = hx + (hexSize - 4) * Math.cos(angle);
              const vy = hy + (hexSize - 4) * Math.sin(angle);
              if (a === 0) ctx.moveTo(vx, vy);
              else ctx.lineTo(vx, vy);
            }
            ctx.closePath();

            ctx.strokeStyle = proximity > 0 
              ? `rgba(16, 185, 129, ${0.15 + proximity * 0.7})` 
              : 'rgba(30, 41, 59, 0.3)';
            ctx.lineWidth = proximity > 0 ? 1.5 : 1;
            ctx.stroke();

            if (proximity > 0.3) {
              ctx.fillStyle = `rgba(6, 182, 212, ${proximity * 0.25})`;
              ctx.fill();

              // Hex byte text
              const byteIdx = (row * 7 + col * 13) % hexBytes.length;
              ctx.font = '9px ui-monospace, monospace';
              ctx.fillStyle = `rgba(52, 211, 153, ${proximity})`;
              ctx.textAlign = 'center';
              ctx.fillText(`0x${hexBytes[byteIdx]}`, hx, hy + 3);
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [mode, audioEnabled]);

  // Pointer event handlers
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.active = true;
  };

  const handlePointerLeave = () => {
    mouseRef.current.active = false;
    mouseRef.current.hoveredNodeIdx = null;
    setActiveNode(null);
  };

  const handleCanvasClick = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === 'radar') {
      radarRef.current.pings.push({ x, y, radius: 4, alpha: 1 });
      playSynthTone(580, 0.1, 'triangle');
    } else if (mode === 'mesh') {
      shockwavesRef.current.push({
        x,
        y,
        radius: 6,
        maxRadius: 120,
        color: '#06b6d4',
        alpha: 0.9
      });
      playSynthTone(640, 0.08, 'sine');
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden bg-[#030712] border border-slate-800 shadow-2xl transition-all"
    >
      {/* Top Interactive HUD Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#060b18]/90 border-b border-slate-800/80 backdrop-blur-sm z-20 relative">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
              Autonomous Mesh Defense
            </span>
          </div>

          <span className="hidden sm:inline-block text-slate-700">|</span>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#091122] p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => { setMode('mesh'); playSynthTone(500, 0.04); }}
              className={`px-2.5 py-1 text-xs font-mono rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                mode === 'mesh' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Topology</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('radar'); playSynthTone(560, 0.04); }}
              className={`px-2.5 py-1 text-xs font-mono rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                mode === 'radar' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Perimeter Radar</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('hex'); playSynthTone(620, 0.04); }}
              className={`px-2.5 py-1 text-xs font-mono rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                mode === 'hex' ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Hex Matrix</span>
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {mode === 'mesh' && (
            <button
              type="button"
              onClick={triggerSimulation}
              disabled={simulationState === 'probing'}
              className="px-3 py-1.5 min-h-[36px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span>{simulationState === 'probing' ? 'Neutralizing Probe...' : 'Simulate Threat Audit'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-1.5 min-w-[36px] min-h-[36px] rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition-colors cursor-pointer"
            title={audioEnabled ? 'Mute Audio Synth' : 'Enable Cyber Audio Feedback'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] cursor-crosshair">
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onClick={handleCanvasClick}
          className="w-full h-full block"
        />

        {/* Live Node Telemetry Card Overlay on Hover */}
        {activeNode && (
          <div className="absolute bottom-4 left-4 max-w-xs p-3.5 rounded-xl bg-[#070e1c]/95 border border-emerald-500/40 shadow-2xl backdrop-blur-md pointer-events-none z-30 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
              <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                {activeNode.name}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                {activeNode.metrics.status}
              </span>
            </div>

            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Protocol:</span>
                <span className="text-slate-200">{activeNode.metrics.protocol}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Internal Latency:</span>
                <span className="text-emerald-300">{activeNode.metrics.latency}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Enclave Throughput:</span>
                <span className="text-cyan-300">{activeNode.metrics.throughput}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Adversarial Risk:</span>
                <span className="text-slate-300">{activeNode.metrics.threatScore}</span>
              </div>
            </div>
          </div>
        )}

        {/* Telemetry Corner Stats */}
        <div className="absolute top-3 right-3 hidden sm:flex flex-col gap-1 text-[10px] font-mono text-slate-400 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 pointer-events-none">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">EVENT_VELOCITY:</span>
            <span className="text-emerald-400 font-bold">{stats.eventsPerSec} / sec</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">PACKETS_FILTERED:</span>
            <span className="text-cyan-400 font-bold">{stats.packetsFiltered.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-500">MESH_INTEGRITY:</span>
            <span className="text-slate-200 font-bold">{stats.meshIntegrity}</span>
          </div>
        </div>

        {/* Interaction Hint */}
        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500 bg-slate-950/70 px-2 py-1 rounded border border-slate-800/60 pointer-events-none">
          {mode === 'mesh' && 'Hover nodes for telemetry • Click to emit defense pulse'}
          {mode === 'radar' && 'Click radar to deploy sonar ping'}
          {mode === 'hex' && 'Move cursor to energize binary sensors'}
        </div>
      </div>
    </div>
  );
};
