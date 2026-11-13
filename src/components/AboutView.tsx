import React from 'react';
import { 
  ShieldCheck, 
  Shield,
  Terminal, 
  BookOpen, 
  Award, 
  Scale, 
  Cpu, 
  Layers, 
  CheckCircle, 
  Lock, 
  Globe, 
  Code,
  Flame,
  Radio
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <article id="about-us-hacker-view" itemScope itemType="https://schema.org/AboutPage" className="space-y-8 animate-in fade-in duration-200">
      {/* Masthead Banner */}
      <div className="rounded-2xl bg-[#070c18] border border-emerald-900/40 p-6 sm:p-10 shadow-sm relative">
        <div className="relative z-10 max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                YINYANGYOHACKERS &bull; AUTONOMOUS CYBERSECURITY LAB (EST. 2013)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-850 text-slate-300 border border-slate-700">
                Pillars: <strong className="text-emerald-400">Yin (Defense) &bull; Yang (Offense) &bull; Yo (Sovereignty)</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight leading-snug">
              About YinYangYoHackers: Defense, Offense &amp; Autonomous Systems
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              Founded in 2013 by <strong className="text-white font-semibold">Vishwas Aithal</strong>, <strong className="text-emerald-400 font-mono">YinYangYoHackers</strong> fuses three core computational pillars: <span className="text-emerald-400 font-mono">Yin</span> (defensive zero trust hardening), <span className="text-rose-400 font-mono">Yang</span> (adversarial red teaming and penetration testing), and <span className="text-cyan-400 font-mono">Yo</span> (autonomous sovereign systems and open source computing freedom). We deliver battle tested Cybersecurity Research, private on premise compute pipelines, and audited OpenSource Tools.
            </p>
        </div>
      </div>

      {/* Author & Creator Dossier */}
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative group shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=256&h=256&auto=format&fit=crop&q=80&fm=webp&cs=strip" 
              alt="Vishwas Aithal, Founder & Lead Security Researcher" 
              width={128}
              height={128}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/author_avatar.webp'; }}
              className="w-32 h-32 rounded-2xl border-2 border-emerald-500 object-cover aspect-square shadow-[0_0_25px_rgba(16,185,129,0.3)] group-hover:border-cyan-400 transition-colors" 
            />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black px-2 py-0.5 rounded-full font-mono text-[10px] font-bold flex items-center gap-1 shadow-md">
              <ShieldCheck className="w-3 h-3 stroke-[3]" />
              <span>EST. 2013</span>
            </div>
          </div>

          <div className="space-y-3 text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-mono flex items-center justify-center md:justify-start gap-2">
                  <span>Vishwas Aithal</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                    Founder &amp; Lead Researcher
                  </span>
                </h2>
                <p className="text-xs font-mono text-emerald-400">
                  Cybersecurity Research &bull; Systems Architecture &bull; Technical Author
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono self-center md:self-auto">
                13+ Years Writing &amp; Research
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
              Vishwas Aithal established YinYangYoHackers in 2013 as an independent cybersecurity research and systems engineering project. Focusing on hands-on defensive engineering, penetration testing methodology, Linux kernel hardening, and sovereign computing workloads, the publication produces comprehensive, reproducible technical documentation designed to bridge theory and production-grade security practice.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 pt-2 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-200">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Defensive &amp; Offensive Security</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5 text-slate-200">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Open-Source Hardening</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5 text-slate-200">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Practical Technical Guides</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* The Yin-Yang-Yo Philosophical Triad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Yin: Defensive Mastery */}
        <div className="bg-[#090d16] border border-emerald-900/40 rounded-2xl p-6 space-y-3 shadow-lg relative overflow-hidden">
          <div className="text-2xl font-bold font-mono text-emerald-400 flex items-center gap-2">
            <span>01. YIN</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">Defensive</span>
          </div>
          <h3 className="font-bold text-white text-base sm:text-lg">Immutable Defense &amp; Hardening</h3>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
            Engineering resilient infrastructure through Linux kernel sysctl tunables, UFW rate-limiting firewalls, zero-trust container sandboxes, and immutable encrypted backups.
          </p>
        </div>

        {/* Yang: Offensive Rigor */}
        <div className="bg-[#090d16] border border-red-900/40 rounded-2xl p-6 space-y-3 shadow-lg relative overflow-hidden">
          <div className="text-2xl font-bold font-mono text-red-400 flex items-center gap-2">
            <span>02. YANG</span>
            <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">Offensive</span>
          </div>
          <h3 className="font-bold text-white text-base sm:text-lg">Offensive Penetration Testing</h3>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
            Mastering active reconnaissance, port dissection, Wireshark packet decryption, and adversarial attack vectors to discover zero-days before malicious black-hats do.
          </p>
        </div>

        {/* Yo: Sovereign Digital Autonomy */}
        <div className="bg-[#090d16] border border-cyan-900/40 rounded-2xl p-6 space-y-3 shadow-lg relative overflow-hidden">
          <div className="text-2xl font-bold font-mono text-cyan-400 flex items-center gap-2">
            <span>03. YO</span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">Sovereignty</span>
          </div>
          <h3 className="font-bold text-white text-base sm:text-lg">Sovereign Systems &amp; Privacy</h3>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
            Unshackling from surveillance capitalism: running local models via Ollama, private retrieval pipelines, Bitwarden password vaults, and self-hosted open-source software.
          </p>
        </div>
      </div>

      {/* Historical Milestones (2013 to 2026) */}
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
        <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <span>The Evolution: 2013 to 2026 Timeline</span>
        </h3>

        <div className="space-y-4 font-sans text-xs sm:text-sm border-l-2 border-slate-800 pl-4 sm:pl-6 ml-2">
          {/* 2013 */}
          <div className="relative">
            <div className="absolute -left-[23px] sm:-left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#090d16]" />
            <span className="font-mono text-xs font-bold text-emerald-400 block">2013 &bull; Genesis of YinYangYoHackers</span>
            <p className="text-slate-300 mt-1">
              Started in 2013 as an experimental security research blog publishing batch file diagnostics, operating system tweaks, Wi-Fi security experiments, and early open-source utilities.
            </p>
          </div>

          {/* 2018 */}
          <div className="relative">
            <div className="absolute -left-[23px] sm:-left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-cyan-500 border-2 border-[#090d16]" />
            <span className="font-mono text-xs font-bold text-cyan-400 block">2018 &bull; Offensive Security &amp; Global Courses</span>
            <p className="text-slate-300 mt-1">
              Expanded into professional penetration testing, CEH certification syllabi, ethical hacking video courses, and responsible disclosure coordination.
            </p>
          </div>

          {/* 2026 */}
          <div className="relative">
            <div className="absolute -left-[23px] sm:-left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-[#090d16]" />
            <span className="font-mono text-xs font-bold text-purple-400 block">2026 &bull; Revamped for Autonomous Systems &amp; Modern Cyber</span>
            <p className="text-slate-300 mt-1">
              Complete platform overhaul: high-performance technical research on local model execution (Ollama, DeepSeek, Llama 3), eBPF Linux security, zero-trust infrastructure, and privacy tooling.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
