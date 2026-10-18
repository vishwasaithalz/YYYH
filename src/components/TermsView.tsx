import React from 'react';
import { Scale, AlertTriangle, ShieldCheck, FileCheck, ArrowLeft, Terminal, Ban, HelpCircle } from 'lucide-react';

interface TermsViewProps {
  onBackToArticles?: () => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ onBackToArticles }) => {
  return (
    <article id="terms-of-use-view" className="space-y-8 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Navigation Breadcrumb */}
      {onBackToArticles && (
        <button
          onClick={onBackToArticles}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles &amp; Research</span>
        </button>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" />
            TERMS &amp; ACCEPTABLE USE
          </span>
          <span className="text-xs font-mono text-slate-500">Last Updated: March 2026</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight leading-snug">
          Terms of Use &amp; Acceptable Use Policy
        </h1>

        <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed mt-3">
          Please read these terms carefully before accessing or utilizing the tutorials, code snippets, interactive security tools, and blueprints published on <strong className="text-white">YinYangYoHackers</strong>.
        </p>
      </div>

      {/* Mandatory Notice Box */}
      <div className="p-6 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 space-y-3">
        <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>MANDATORY AUTHORIZED TESTING DIRECTIVE</span>
        </div>
        <p className="text-xs sm:text-sm text-red-200/90 leading-relaxed font-sans">
          All technical articles, security tool demonstrations, exploit proofs-of-concept, network commands, and configuration scripts provided on this website are published exclusively for <strong>authorized educational research, professional defensive auditing, and systems security hardening</strong>. 
          Executing offensive tests, network scans, or exploitation scripts against systems without prior, explicit, written authorization from the system owner is strictly prohibited and constitutes a serious criminal violation under international cybercrime legislation.
        </p>
      </div>

      {/* Structured Sections */}
      <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
        <section className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <span>1. Acceptance of Terms</span>
          </h2>
          <p>
            By accessing or browsing YinYangYoHackers (founded in 2013 by Vishwas Aithal), you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, do not use this website or its code samples.
          </p>
        </section>

        <section className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <span>2. Strict Acceptable Use &amp; Prohibited Conduct</span>
          </h2>
          <p>You agree that you will not use any content, tool, script, or architecture blueprint from YinYangYoHackers to:</p>
          <div className="space-y-2 pt-1 text-slate-300">
            <div className="flex items-start gap-2">
              <Ban className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>Probe, scan, or test the vulnerability of any system, network, or server without explicit written authorization (Rules of Engagement).</span>
            </div>
            <div className="flex items-start gap-2">
              <Ban className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>Deploy unauthorized denial-of-service (DoS/DDoS) payloads, credential stuffing attacks, or automated brute-force attacks against third-party endpoints.</span>
            </div>
            <div className="flex items-start gap-2">
              <Ban className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>Distribute malware, ransomware, botnet command-and-control agents, or deceptive phishing collateral.</span>
            </div>
            <div className="flex items-start gap-2">
              <Ban className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>Violate the Computer Fraud and Abuse Act (CFAA), the UK Computer Misuse Act, the Indian Information Technology Act 2000, or equivalent global cyber statutes.</span>
            </div>
          </div>
        </section>

        <section className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <span>3. Intellectual Property &amp; Open-Source Code</span>
          </h2>
          <p>
            Original editorial articles, diagrams, and written analysis are the intellectual property of Vishwas Aithal and YinYangYoHackers. You may quote excerpts with clear attribution and a canonical backlink to the original article.
          </p>
          <p>
            Defensive code snippets and scripts published on this site are distributed under open-source permissive guidelines (such as MIT or Apache 2.0 where indicated) for community research and non-malicious defensive implementations.
          </p>
        </section>

        <section className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <span>4. Disclaimer of Warranties &amp; Limitation of Liability</span>
          </h2>
          <p>
            All content, security tools, and blueprints are provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any kind, whether express or implied. YinYangYoHackers and its authors disclaim all warranties, including but not limited to merchantability, fitness for a particular security posture, and non-infringement.
          </p>
          <p>
            Under no circumstances shall YinYangYoHackers, its founder, or contributors be held liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use, misuse, or inability to use the information and tools provided on this website.
          </p>
        </section>

        <section className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <span>5. Contact &amp; Legal Inquiries</span>
          </h2>
          <p>
            For legal notices, DMCA takedown requests, or inquiries regarding these terms, contact our editorial office:
          </p>
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs space-y-1">
            <div><strong className="text-white">Founder &amp; Publisher:</strong> Vishwas Aithal</div>
            <div><strong className="text-white">Email:</strong> vishwasaithal@proton.me</div>
            <div><strong className="text-white">Website:</strong> yinyangyohackers.com</div>
          </div>
        </section>
      </div>
    </article>
  );
};
