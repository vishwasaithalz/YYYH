import React from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  BookOpen, 
  Cpu, 
  Lock, 
  Layers, 
  ArrowRight, 
  Calculator, 
  KeyRound, 
  Globe, 
  Sliders, 
  ChevronRight,
  Shield,
  FileCode,
  Sparkles,
  Server,
  Network
} from 'lucide-react';
import { HackerStreamCanvas } from './HackerStreamCanvas';

interface HeroBannerProps {
  onExploreArticles?: () => void;
  onSelectCategory?: (category: any) => void;
  onNavigatePillar?: (view: any) => void;
  onOpenTools?: (toolSlug?: string) => void;
  onOpenRoadmap?: () => void;
  onNavigateView?: (view: string, path?: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  onExploreArticles, 
  onSelectCategory,
  onNavigatePillar,
  onOpenTools,
  onOpenRoadmap,
  onNavigateView
}) => {
  const scrollToLearningPath = () => {
    const el = document.getElementById('beginner-learning-path-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onOpenRoadmap) {
      onOpenRoadmap();
    }
  };

  const coreCategories = [
    {
      id: 'cybersecurity',
      title: 'Cybersecurity & Defensive Security',
      description: 'Zero trust architecture, endpoint hardening, firewall policies, and defense in depth.',
      tag: 'Cyber Security',
      icon: Shield
    },
    {
      id: 'ethical-hacking',
      title: 'Ethical Hacking & Authorized Testing',
      description: 'Reconnaissance methodology, network penetration testing, and legal vulnerability audits.',
      tag: 'Cyber Security',
      icon: Terminal
    },
    {
      id: 'ai-security',
      title: 'AI Security & Adversarial ML',
      description: 'Prompt injection defense, model extraction mitigation, and secure pipeline boundaries.',
      tag: 'Autonomous Systems Hub',
      icon: Cpu
    },
    {
      id: 'sovereign-ai',
      title: 'Sovereign AI, Local Inference & Privacy',
      description: 'Local LLM execution with Ollama, air-gapped enclaves, and zero-telemetry workflows.',
      tag: 'Autonomous Systems Hub',
      icon: Lock
    },
    {
      id: 'security-tools',
      title: 'Open-Source Security Tools',
      description: 'In-browser diagnostic suites, CIDR subnet calculators, cryptographic hash analyzers, and ciphers.',
      tag: 'Security Tools',
      icon: Sliders
    },
    {
      id: 'linux-hardening',
      title: 'Linux, Networking & Infrastructure',
      description: 'Kernel sysctl parameters, WireGuard mesh networks, SSH bastion isolation, and eBPF observability.',
      tag: 'Cyber Security',
      icon: Server
    },
    {
      id: 'tutorials-blueprints',
      title: 'Tutorials, Research & Practical Blueprints',
      description: 'Reproducible walkthroughs, step-by-step security labs, and production-ready configs.',
      tag: 'Cyber Security',
      icon: BookOpen
    }
  ];

  const featuredTools = [
    {
      slug: 'cidr-calculator',
      name: 'Subnet & CIDR Calculator',
      description: 'Calculate usable IPv4/IPv6 host ranges, broadcast addresses, and RFC 1918 allocations.',
      icon: Calculator,
      tag: 'Networking'
    },
    {
      slug: 'http-security-headers',
      name: 'HTTP Security Headers Inspector',
      description: 'Probe live CSP, HSTS, X-Frame-Options, and generate hardened Nginx and Apache rules.',
      icon: ShieldCheck,
      tag: 'Web Security'
    },
    {
      slug: 'ssl-checker',
      name: 'SSL/TLS Architecture Inspector',
      description: 'Live TLS 1.3 handshake verification, peer certificate expiry, and cipher suite auditing.',
      icon: Globe,
      tag: 'Cryptography'
    },
    {
      slug: 'password-entropy',
      name: 'Password Entropy Estimator',
      description: 'Offline Shannon entropy computation and NIST SP 800-63B password strength validation.',
      icon: KeyRound,
      tag: 'Authentication'
    }
  ];

  const beginnerSteps = [
    {
      step: '01',
      title: 'Foundations of Networking & Systems',
      description: 'Master IPv4/IPv6 subnetting, the TCP/UDP three-way handshake, routing tables, and Linux POSIX file permissions.',
      recommendedLink: 'Understanding Subnetting & CIDR Calculation',
      toolSlug: 'cidr-calculator'
    },
    {
      step: '02',
      title: 'Host & Infrastructure Hardening',
      description: 'Configure immutable sysctl network stack limits, enforce public key SSH authentication, and lock down UFW/iptables firewalls.',
      recommendedLink: 'Linux Kernel Bastion Hardening Guide',
      category: 'Cyber Security'
    },
    {
      step: '03',
      title: 'Authorized Testing & Network Auditing',
      description: 'Learn ethical reconnaissance techniques, packet inspection with Wireshark, active port discovery, and safe lab environments.',
      recommendedLink: 'Wireshark Network Forensics & Capture Blueprint',
      category: 'Cyber Security'
    },
    {
      step: '04',
      title: 'Sovereign AI & Private Computing',
      description: 'Deploy local language models on private hardware using Ollama, run air-gapped inference, and isolate neural weights.',
      recommendedLink: 'Sovereign AI Knowledge Hub & Setup Guide',
      view: 'sovereign-hub'
    }
  ];

  return (
    <section className="space-y-10 mb-8" aria-labelledby="hero-main-heading">
      {/* Editorial Portal Masthead */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#080d1a] to-[#040711] border border-slate-800 p-6 sm:p-10 shadow-2xl">
        {/* Subtle Hacker-Stream canvas animation background */}
        <HackerStreamCanvas opacity={0.22} />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Brand Kicker with unboxed typographic metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-emerald-400 font-bold tracking-wider">YINYANGYOHACKERS</span>
            <span aria-hidden="true" className="text-slate-600">&bull;</span>
            <span>AUTONOMOUS CYBERSECURITY RESEARCH</span>
            <span aria-hidden="true" className="text-slate-600">&bull;</span>
            <span className="text-slate-300">EST. 2013</span>
          </div>

          {/* Primary Editorial H1 */}
          <h1 
            id="hero-main-heading" 
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white font-mono tracking-tight leading-tight sm:leading-tight"
          >
            Defensive Security Blueprints, Sovereign AI &amp; Open-Source Tools
          </h1>

          {/* Mission & Purpose */}
          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed max-w-3xl">
            YinYangYoHackers delivers tested defensive architectures, authorized penetration testing methodologies, 
            Linux infrastructure hardening, and privacy-first sovereign AI pipelines. Built for security researchers, 
            DevOps engineers, systems administrators, and computer science students seeking verified, reproducible blueprints.
          </p>

          {/* Core Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenTools && onOpenTools()}
              className="px-5 py-3 min-h-[44px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Sliders className="w-4 h-4" />
              <span>Explore Security Tools</span>
            </button>

            <button
              type="button"
              onClick={scrollToLearningPath}
              className="px-5 py-3 min-h-[44px] bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 rounded-xl font-mono text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Beginner Learning Path</span>
            </button>

            <button
              type="button"
              onClick={onExploreArticles}
              className="px-5 py-3 min-h-[44px] bg-transparent hover:bg-slate-900/60 text-slate-300 hover:text-white border border-slate-800 rounded-xl font-mono text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Latest Research</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Three Pillars Overview */}
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans text-slate-400">
            <div className="space-y-1">
              <span className="font-mono font-bold text-emerald-400 block">Yin &bull; Defensive Hardening</span>
              <span>Zero-trust bastion host architecture, kernel sysctl parameters, and firewall isolation.</span>
            </div>
            <div className="space-y-1">
              <span className="font-mono font-bold text-rose-400 block">Yang &bull; Offensive Testing</span>
              <span>Authorized security audits, vulnerability assessment, network mapping, and CTF challenges.</span>
            </div>
            <div className="space-y-1">
              <span className="font-mono font-bold text-cyan-400 block">Yo &bull; Sovereign Systems</span>
              <span>Local on-premise AI models, open-source diagnostic utilities, and telemetry-free computing.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Working Security Tools */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
              <span className="text-emerald-400">&gt;</span>
              <span>Featured Security Tools</span>
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Production diagnostic utilities executing in-browser or with verified server inspection.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenTools && onOpenTools()}
            className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View All Tools</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.slug}
                onClick={() => onOpenTools && onOpenTools(tool.slug)}
                className="p-4 sm:p-5 rounded-xl bg-[#070b16] border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">{tool.tag}</span>
                  </div>
                  <h3 className="text-sm font-bold font-mono text-white group-hover:text-emerald-300 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-emerald-400 font-medium">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7 Core Research Categories */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
            <span className="text-emerald-400">&gt;</span>
            <span>Core Research Categories</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Organized knowledge domains covering defensive engineering, authorized testing, and sovereign computing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {coreCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  if (cat.id === 'sovereign-ai' && onNavigatePillar) {
                    onNavigatePillar('sovereign-hub');
                  } else if (cat.id === 'security-tools' && onOpenTools) {
                    onOpenTools();
                  } else if (onSelectCategory) {
                    onSelectCategory(cat.tag);
                    if (onExploreArticles) onExploreArticles();
                  }
                }}
                className="text-left p-4 rounded-xl bg-[#050811] border border-slate-800 hover:border-slate-700 hover:bg-[#070b16] transition-all cursor-pointer group space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-slate-900 text-emerald-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold font-mono text-white group-hover:text-emerald-300 transition-colors">
                      {cat.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 font-sans line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-2 text-[11px] font-mono text-slate-500 flex items-center gap-1 group-hover:text-emerald-400 transition-colors">
                  <span>Explore research</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Beginner Security Learning Path */}
      <div id="beginner-learning-path-section" className="rounded-2xl bg-[#060a14] border border-slate-800 p-6 sm:p-8 space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400">STRUCTURED CURRICULUM</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold font-mono text-white mt-1">
              Beginner Cybersecurity Learning Path
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans mt-0.5">
              A four-stage progression from core networking fundamentals to defensive bastions and sovereign computing.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenRoadmap}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono transition-colors self-start sm:self-auto cursor-pointer"
          >
            Full Roadmap
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {beginnerSteps.map((step) => (
            <div
              key={step.step}
              className="p-4 sm:p-5 rounded-xl bg-[#03060d] border border-slate-800/90 space-y-2.5 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-emerald-400">
                  STAGE {step.step}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Self-Paced</span>
              </div>
              <h3 className="text-sm font-bold font-mono text-white">
                {step.title}
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {step.description}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (step.toolSlug && onOpenTools) {
                      onOpenTools(step.toolSlug);
                    } else if (step.view && onNavigatePillar) {
                      onNavigatePillar(step.view);
                    } else if (step.category && onSelectCategory) {
                      onSelectCategory(step.category);
                      if (onExploreArticles) onExploreArticles();
                    }
                  }}
                  className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <span>Recommended: {step.recommendedLink}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
