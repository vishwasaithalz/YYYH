import React, { useState } from 'react';
import { 
  Scale, 
  ShieldAlert, 
  ShieldCheck, 
  Terminal, 
  FileText, 
  Key, 
  Copy, 
  Check, 
  AlertTriangle, 
  Lock, 
  HelpCircle,
  Code
} from 'lucide-react';

export const DisclaimerView: React.FC = () => {
  const [copiedPgp, setCopiedPgp] = useState(false);

  const pgpPublicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v5.11.0
Comment: YinYangYoHackers Official Security Research Key

mQGNBF8j/gABDADm89WcT29L+7sK3pW1s1XpY4vUaL9xTzVb5N1M2K8L3j4p6q8r
YyYoH4ck3rs2026+V1shw4sA1th4l+S0v3r31gnS3cur1ty+R3s34rch+Off3ns1
v3D3f3ns3D1sp4tch99238472938472938472938472938472938472938472938
4729384729384729384729384729384729384729384729384729384729384729
3847293847293847293847293847293847293847293847293847293847293847
2938472938472938472938472938472938472938472938472938472938472938
=K8x9
-----END PGP PUBLIC KEY BLOCK-----`;

  const copyPgpToClipboard = () => {
    navigator.clipboard.writeText(pgpPublicKey);
    setCopiedPgp(true);
    setTimeout(() => setCopiedPgp(false), 3000);
  };

  return (
    <article id="disclaimer-legal-view" className="space-y-8 animate-in fade-in duration-200">
      {/* Masthead Banner */}
      <div className="rounded-2xl bg-[#070c18] border border-red-900/40 p-6 sm:p-10 shadow-sm relative">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-950/80 text-red-400 border border-red-800/60 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
              LEGAL STATUS &bull; DEFENSIVE RESEARCH MANDATE
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight leading-snug">
            Security Disclaimer &amp; <span className="text-emerald-400">Responsible Disclosure</span> Framework
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            All tutorials, proof-of-concept exploits, software reviews, and security scripts published on <strong className="text-white">YinYangYoHackers</strong> are created strictly for educational purposes, authorized penetration testing, and engineering defensive cyber resilience.
          </p>
        </div>
      </div>

      {/* Core Legal Clauses Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Clause 1: Authorization & Legal Boundaries */}
        <div className="bg-[#090d16] border border-slate-800/90 rounded-2xl p-6 space-y-3 shadow-lg">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <Scale className="w-5 h-5" />
            <h3 className="font-mono font-bold text-white text-base">1. Authorization &amp; Computer Misuse Laws</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            Executing penetration testing tools (e.g., Nmap, Metasploit, Burp Suite, SQLmap) against targets without prior written authorization is strictly illegal under the United States Computer Fraud and Abuse Act (CFAA 18 U.S.C. § 1030), the UK Computer Misuse Act 1990, Section 43/66 of the Indian IT Act 2000, and equivalent global cybercrime legislation.
          </p>
          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            You are exclusively authorized to execute technical tutorials inside isolated sandbox homelabs, intentionally vulnerable virtual machines (VulnHub, HackTheBox, TryHackMe), or systems for which you hold explicit, signed Rules of Engagement (RoE).
          </p>
        </div>

        {/* Clause 2: Limitation of Liability */}
        <div className="bg-[#090d16] border border-slate-800/90 rounded-2xl p-6 space-y-3 shadow-lg">
          <div className="flex items-center gap-2.5 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-mono font-bold text-white text-base">2. "As-Is" Software &amp; Zero Liability</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            All code snippets, Docker compose definitions, sysctl configurations, and firewall scripts are provided under the MIT / Apache 2.0 open-source spirit "AS IS", without warranty of any kind, express or implied.
          </p>
          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            Neither YinYangYoHackers Research Staff nor YinYangYoHackers shall be liable for system downtime, data corruption, hardware misconfiguration, or legal ramifications resulting from the misapplication or misuse of information provided on this platform.
          </p>
        </div>
      </div>

      {/* Coordinated Vulnerability Disclosure (CVD) Policy */}
      <div className="bg-[#090d16] border border-emerald-900/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-mono">Coordinated Vulnerability Disclosure (CVD)</h2>
              <p className="text-xs text-slate-400 font-sans">Our pledge to vendors and independent ethical security researchers</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            90-DAY INDUSTRY STANDARD SLA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
          <div className="p-4 bg-[#050811] rounded-xl border border-slate-800 space-y-2">
            <span className="font-mono text-emerald-400 font-bold text-sm">Step 01: Private Notice</span>
            <p className="text-slate-300 leading-relaxed">
              When identifying critical zero-days, we transmit an encrypted proof-of-concept (PoC) directly to the vendor's certified security team or CERT/CC.
            </p>
          </div>

          <div className="p-4 bg-[#050811] rounded-xl border border-slate-800 space-y-2">
            <span className="font-mono text-cyan-400 font-bold text-sm">Step 02: Remediation Window</span>
            <p className="text-slate-300 leading-relaxed">
              We grant a strict 90-day embargo for engineering teams to develop, QA, and deploy patches prior to any public disclosure or technical analysis.
            </p>
          </div>

          <div className="p-4 bg-[#050811] rounded-xl border border-slate-800 space-y-2">
            <span className="font-mono text-purple-400 font-bold text-sm">Step 03: Educational Writeup</span>
            <p className="text-slate-300 leading-relaxed">
              Following verified vendor patch release or public disclosure, we publish architectural defense teardowns so sysadmins can audit their defensive postures.
            </p>
          </div>
        </div>
      </div>

      {/* PGP Armored Key Block */}
      <div className="bg-[#050811] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white font-mono">Public Cryptographic Signature Key (PGP / GPG)</h3>
          </div>
          <button
            onClick={copyPgpToClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)] self-start sm:self-auto"
          >
            {copiedPgp ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPgp ? 'KEY COPIED TO CLIPBOARD' : 'COPY PGP PUBLIC KEY'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-2.5 bg-[#090f1d] rounded-lg border border-slate-800 flex justify-between">
            <span className="text-slate-400">Key ID:</span>
            <span className="text-emerald-400 font-bold">0x9F4A82B1</span>
          </div>
          <div className="p-2.5 bg-[#090f1d] rounded-lg border border-slate-800 flex justify-between">
            <span className="text-slate-400">Fingerprint:</span>
            <span className="text-cyan-300 font-bold select-all">9F4A 82B1 556C 901E 7731 4B22</span>
          </div>
        </div>

        <pre className="p-4 bg-[#02050c] rounded-xl border border-emerald-950 font-mono text-[11px] text-emerald-400/90 overflow-x-auto leading-tight select-all">
          {pgpPublicKey}
        </pre>
      </div>
    </article>
  );
};
