import React, { useState } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  Lock, 
  Server, 
  HardDrive, 
  Terminal, 
  EyeOff, 
  ShieldAlert, 
  ArrowRight, 
  Boxes, 
  Network, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  FileText,
  Activity,
  Zap
} from 'lucide-react';
import { ActiveSiteView } from '../types';

interface SovereignAiHubViewProps {
  onNavigate: (view: ActiveSiteView, path?: string) => void;
}

export const SOVEREIGN_AI_PAGES = [
  {
    path: '/sovereign-ai',
    viewKey: 'sovereign-ai',
    title: 'Sovereign Compute & Model Custody',
    searchIntent: 'Sovereign compute',
    tagline: 'Private on-premise compute and model custody without third-party cloud lock-in.',
    icon: 'Cpu',
    tier: 'Core Sovereignty',
    highlights: ['Zero telemetry', 'Model weight custody', 'Air-gapped deployment', 'Infrastructure custody']
  },
  {
    path: '/private-local-ai',
    viewKey: 'private-local-ai',
    title: 'Private Local Inference Nodes',
    searchIntent: 'Private local compute',
    tagline: 'Run foundation models 100% locally with Ollama, vLLM, and Open WebUI.',
    icon: 'Server',
    tier: 'Core Sovereignty',
    highlights: ['Zero external network egress', 'Self-hosted RAG', 'Quantized VRAM optimization', 'Localhost binding']
  },
  {
    path: '/air-gapped-ai',
    viewKey: 'air-gapped-ai',
    title: 'Air-Gapped Systems & Isolation',
    searchIntent: 'Air-gapped compute',
    tagline: 'Physically isolated nodes, unidirectional optical data diodes, and SCIF-grade models.',
    icon: 'Lock',
    tier: 'Core Sovereignty',
    highlights: ['Physical RF & interface cutoff', 'Optical data diode', 'Cryptographic weight signing', 'RAM-only sandboxes']
  },
  {
    path: '/ollama-security',
    viewKey: 'ollama-security',
    title: 'Secure Ollama Deployment',
    searchIntent: 'Secure Ollama deployment',
    tagline: 'Hardening enterprise Ollama daemons, systemd sandboxing, and TLS reverse proxies.',
    icon: 'Terminal',
    tier: 'Runtime Security',
    highlights: ['OLLAMA_HOST 0.0.0.0 fix', 'mTLS client certs', 'Modelfile static analysis', 'systemd cgroups isolation']
  },
  {
    path: '/vllm-security',
    viewKey: 'vllm-security',
    title: 'Private vLLM Infrastructure',
    searchIntent: 'Private vLLM infrastructure',
    tagline: 'High-throughput cluster security, distributed tensor parallelism, and PagedAttention guards.',
    icon: 'Activity',
    tier: 'Runtime Security',
    highlights: ['Distributed worker mTLS', 'KV-cache DoS mitigation', 'Token rate-limiting', 'Safetensors enforcement']
  },
  {
    path: '/local-llm-security',
    viewKey: 'local-llm-security',
    title: 'Local Model Security & Sandboxing',
    searchIntent: 'Local model security',
    tagline: 'Neutralizing PyTorch pickle RCE exploits, context injection, and agent tool execution.',
    icon: 'ShieldCheck',
    tier: 'Runtime Security',
    highlights: ['Pickle deserialization defense', 'gVisor tool sandboxes', 'RAG context sanitizers', 'Model weights audit']
  },
  {
    path: '/sovereign-ai-infrastructure',
    viewKey: 'sovereign-ai-infrastructure',
    title: 'Sovereign Compute Architecture & GPU Topology',
    searchIntent: 'Sovereign architecture',
    tagline: 'Multi-GPU PCIe Gen 5 lane topologies, NVLink interconnects, and local NVMe vector vaults.',
    icon: 'HardDrive',
    tier: 'Architecture & Infrastructure',
    highlights: ['PCIe 5.0 x16 allocation', 'NVLink P2P bandwidth', 'High-speed local vector stores', 'PDU & thermal engineering']
  },
  {
    path: '/ai-data-privacy',
    viewKey: 'ai-data-privacy',
    title: 'Data Privacy & PII Sanitization',
    searchIntent: 'Data privacy',
    tagline: 'Pre-inference PII scrubbing, zero data retention pipelines, and GDPR/HIPAA compliance.',
    icon: 'EyeOff',
    tier: 'Privacy & Governance',
    highlights: ['Automated PII redaction', 'Zero persistent logs', 'Differential privacy', 'Local compliance audit trail']
  },
  {
    path: '/ai-security',
    viewKey: 'ai-security',
    title: 'Enterprise Model Cybersecurity & Defense',
    searchIntent: 'Model cybersecurity',
    tagline: 'Adversarial red-teaming, prompt injection firewalls, and OWASP model defense guidelines.',
    icon: 'ShieldAlert',
    tier: 'Privacy & Governance',
    highlights: ['Prompt injection firewalls', 'Adversarial jailbreak testing', 'Agent permission guardrails', 'Model inversion defense']
  }
];

export const SovereignAiHubView: React.FC<SovereignAiHubViewProps> = ({ onNavigate }) => {
  const [selectedTier, setSelectedTier] = useState<string>('All');

  const tiers = ['All', 'Core Sovereignty', 'Runtime Security', 'Architecture & Infrastructure', 'Privacy & Governance'];

  const filteredPages = selectedTier === 'All'
    ? SOVEREIGN_AI_PAGES
    : SOVEREIGN_AI_PAGES.filter(p => p.tier === selectedTier);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0e1628] to-[#080d18] border border-cyan-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Autonomous Systems Knowledge Hub
            </span>
            <span className="text-xs font-mono text-slate-400">
              9 Authoritative Blueprints • Zero Cloud Dependency
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-mono text-white tracking-tight leading-tight">
            Sovereign Computing Engineering &amp; Local Defense Stack
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-mono leading-relaxed">
            Architect, deploy, and harden enterprise-grade autonomous compute running 100% on your own infrastructure. Reclaim model weights custody, eliminate third-party API exposure, and defend autonomous pipelines against prompt injection, memory leaks, and telemetry exfiltration.
          </p>
        </div>
      </div>

      {/* 2. Tier Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-cyan-400" /> Filter:
        </span>
        {tiers.map(t => (
          <button
            key={t}
            onClick={() => setSelectedTier(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
              selectedTier === t
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t} {t === 'All' ? `(${SOVEREIGN_AI_PAGES.length})` : ''}
          </button>
        ))}
      </div>

      {/* 3. 9 Sovereign Systems Knowledge Hub Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPages.map((page) => (
          <a
            key={page.path}
            href={page.path}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(page.viewKey as ActiveSiteView, page.path);
            }}
            className="group flex flex-col justify-between p-6 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900/60 transition-colors shadow-lg hover:shadow-cyan-950/20 cursor-pointer"
          >
            <div className="space-y-3">
              {/* Header Badge & Search Intent */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                  {page.tier}
                </span>
                <span className="text-[10px] font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Intent: {page.searchIntent}
                </span>
              </div>

              {/* Title & Path */}
              <div>
                <h2 className="text-base sm:text-lg font-bold font-mono text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                  <span>{page.title}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </h2>
                <div className="text-[11px] font-mono text-cyan-400 mt-0.5">
                  {page.path}
                </div>
              </div>

              {/* Tagline */}
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {page.tagline}
              </p>

              {/* Highlights */}
              <div className="pt-2 border-t border-slate-900 space-y-1">
                {page.highlights.map((h, i) => (
                  <div key={i} className="text-[11px] font-mono text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-cyan-400 group-hover:text-cyan-300 font-semibold">
              <span>Read Architecture Guide</span>
              <span className="text-[10px] font-normal text-slate-400">→</span>
            </div>
          </a>
        ))}
      </div>

      {/* 4. Cross-link to Standalone Security Tools */}
      <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold font-mono text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Interactive Security Tools &amp; Calculators</span>
          </h3>
          <p className="text-xs font-mono text-slate-300">
            Use standalone indexable tools: CIDR Subnet Calculator, Hash Analyzer, Password Entropy, HTTP Security Headers &amp; SSL Inspector.
          </p>
        </div>
        <a
          href="/tools"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('tools', '/tools');
          }}
          className="px-4 py-2.5 min-h-[44px] rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <span>Explore Security Tools</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
