import React from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Lock, 
  Server, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Mail, 
  Scale, 
  HelpCircle,
  FileCheck,
  Layers
} from 'lucide-react';

interface ServicesViewProps {
  onBackToArticles: () => void;
  onNavigateContact: () => void;
  onNavigateDisclaimer: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  onBackToArticles,
  onNavigateContact,
  onNavigateDisclaimer
}) => {
  return (
    <article className="space-y-8 animate-in fade-in duration-200" itemScope itemType="https://schema.org/Service">
      {/* Masthead Banner */}
      <div className="rounded-2xl bg-[#080d1a] border border-slate-800 p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SECURITY ARCHITECTURE &amp; RESEARCH ADVISORY</span>
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="text-slate-300">EDUCATIONAL SEPARATION NOTICE</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight leading-tight">
            Technical Advisory Scope, Prerequisites &amp; Limitations
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            YinYangYoHackers operates primarily as an open-source cybersecurity research and educational initiative. 
            While all tutorials, tools, and technical blueprints are 100% free and publicly accessible, this document 
            delineates the precise boundaries, prerequisites, and realistic availability for technical architectural reviews.
          </p>
        </div>
      </div>

      {/* Distinction: Educational vs. Advisory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-[#050811] border border-emerald-900/40 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold font-mono text-white">
              Public Educational Content (Free)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            All written articles, CTF walkthroughs, cheat sheets, and in-browser calculators (CIDR, hashes, entropy, security headers) 
            are provided freely to the global security community under open editorial principles.
          </p>
          <ul className="text-xs font-mono text-slate-400 space-y-1.5 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Zero paywalls, gated content, or forced registrations</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Client-side tools execute offline in browser memory</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Reproducible commands tested on Debian, Ubuntu &amp; Arch</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-xl bg-[#050811] border border-cyan-900/40 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold font-mono text-white">
              Specialized Architecture Advisory
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            Direct peer reviews of infrastructure hardening plans, air-gapped machine learning deployments, 
            and zero-trust boundary audits for technical teams and academic labs.
          </p>
          <ul className="text-xs font-mono text-slate-400 space-y-1.5 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Zero-trust network segmentation and bastion review</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Sovereign on-premise LLM isolation validation</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Advisory limited to verifiable technical owners</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Scope Matrix */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#070b16] border border-slate-800 space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
            <span className="text-emerald-400">&gt;</span>
            <span>Advisory Scope &amp; Offerings</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-0.5">
            Specific areas where independent technical evaluation and architecture hardening is conducted.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-[#03060d] border border-slate-800 space-y-2.5">
            <div className="p-2 w-fit rounded-lg bg-slate-900 text-emerald-400">
              <Server className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold font-mono text-white">Linux &amp; Bastion Hardening</h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Review of sysctl parameters, SSH public key policies, non-root daemon isolation, and WireGuard mesh overlay networks.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#03060d] border border-slate-800 space-y-2.5">
            <div className="p-2 w-fit rounded-lg bg-slate-900 text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold font-mono text-white">Sovereign AI Enclaves</h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Architectural review of on-premise Ollama and vLLM clusters, model weight signature verification, and zero-telemetry enforcement.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#03060d] border border-slate-800 space-y-2.5">
            <div className="p-2 w-fit rounded-lg bg-slate-900 text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold font-mono text-white">Web &amp; Transport Armor</h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Audit of Content-Security-Policy directives, HSTS preload compliance, TLS 1.3 cipher suites, and CORS/CORP isolation.
            </p>
          </div>
        </div>
      </div>

      {/* Prerequisites & Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prerequisites */}
        <div className="p-6 rounded-xl bg-[#050811] border border-slate-800 space-y-3">
          <h2 className="text-sm sm:text-base font-bold font-mono text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Prerequisites for Engagement</span>
          </h2>
          <ul className="text-xs sm:text-sm text-slate-300 space-y-2.5 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-mono font-bold mt-0.5">1.</span>
              <span><strong>Verified Asset Ownership:</strong> Documented proof of root or domain ownership for any tested environment.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-mono font-bold mt-0.5">2.</span>
              <span><strong>Isolated Lab or Staging:</strong> Architectural reviews are conducted in staging environments prior to production rollout.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-mono font-bold mt-0.5">3.</span>
              <span><strong>Signed Authorization:</strong> Strict mutual agreement adhering to legal and responsible disclosure boundaries.</span>
            </li>
          </ul>
        </div>

        {/* Limitations */}
        <div className="p-6 rounded-xl bg-[#050811] border border-slate-800 space-y-3">
          <h2 className="text-sm sm:text-base font-bold font-mono text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Explicit Limitations &amp; Exclusions</span>
          </h2>
          <ul className="text-xs sm:text-sm text-slate-300 space-y-2.5 font-sans">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-mono font-bold mt-0.5">&times;</span>
              <span><strong>No Emergency Incident Response:</strong> We do not operate a 24/7 emergency breach response hotline or active ransomware retainer.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-mono font-bold mt-0.5">&times;</span>
              <span><strong>No Regulatory Certifications:</strong> We provide technical security assessments, not formal ISO 27001, SOC 2, or PCI-DSS audit seals.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-mono font-bold mt-0.5">&times;</span>
              <span><strong>No Third-Party Exploitation:</strong> Requests to evaluate third-party systems without direct authorization are rejected unconditionally.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Availability & Inquiries */}
      <div className="p-6 rounded-xl bg-[#080d19] border border-cyan-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm sm:text-base font-bold font-mono text-white">
            Advisory Availability &amp; Inquiries
          </h3>
          <p className="text-xs text-slate-300 font-sans max-w-xl">
            Availability is limited as an independent research collective. Requests are reviewed on technical merit and alignment with defensive and open-source principles.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onNavigateContact}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Research Desk</span>
          </button>
          <button
            type="button"
            onClick={onBackToArticles}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono text-xs rounded-xl transition cursor-pointer"
          >
            Back to Articles
          </button>
        </div>
      </div>
    </article>
  );
};
