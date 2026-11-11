import React from 'react';
import { ShieldCheck, Lock, EyeOff, Database, Globe, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyViewProps {
  onBackToArticles?: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onBackToArticles }) => {
  return (
    <article id="privacy-policy-view" className="space-y-8 animate-in fade-in duration-200 max-w-4xl mx-auto">
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
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            TRANSPARENCY &amp; PRIVACY NOTICE
          </span>
          <span className="text-xs font-mono text-slate-500">Effective: March 2026</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight leading-snug">
          Privacy Policy
        </h1>

        <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed mt-3">
          At <strong className="text-white">YinYangYoHackers</strong> (founded in 2013 by Vishwas Aithal), we believe digital sovereignty and privacy are non-negotiable human rights. We design our technical publications and browser tools with a zero-knowledge, local-first architecture.
        </p>
      </div>

      {/* Key Guarantees Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
            <EyeOff className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white font-mono">Zero Invasive Tracking</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            We do not deploy fingerprinting scripts, third-party advertising cookies, or behavioral profiling trackers.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
            <Database className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white font-mono">Client-Side Tools</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            All browser tools (hash identifier, subnet calculator, password entropy) execute 100% locally in your browser sandbox.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white font-mono">No Data Monetization</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            We do not sell, rent, license, or trade your personal data, email addresses, or research queries to data brokers.
          </p>
        </div>
      </div>

      {/* Structured Sections */}
      <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-sans">
        <section className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <span>1. Information We Collect and Process</span>
          </h2>
          <p>
            You can browse YinYangYoHackers without registering for an account. We only collect information under the following limited circumstances:
          </p>
          <ul className="space-y-2 list-disc list-inside text-slate-300">
            <li>
              <strong className="text-white">Newsletter Subscriptions:</strong> When you voluntarily subscribe, we store your email address solely to deliver research publications. You can unsubscribe with a single click at any time.
            </li>
            <li>
              <strong className="text-white">Direct Inquiries:</strong> When you contact our research lab via email or contact forms, we process your message and email to respond to your technical inquiry.
            </li>
            <li>
              <strong className="text-white">Local Browser State:</strong> Bookmarks, reading history, and theme preferences are stored strictly in your browser's <code className="text-emerald-400 font-mono text-xs">localStorage</code> and never transmitted to our servers.
            </li>
            <li>
              <strong className="text-white">Server Access Logs:</strong> Like standard web infrastructure, temporary anonymized IP addresses and request paths may be processed for DDoS mitigation and infrastructure security, retained for a maximum of 14 days.
            </li>
          </ul>
        </section>

        <section className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <span>2. Cookie &amp; Storage Policy</span>
          </h2>
          <p>
            YinYangYoHackers does not use cross-site tracking cookies or third-party behavioral profiling. We use essential local storage to remember your reading preferences (dark theme, saved articles) and session security settings. If you explicitly choose Accept All in our cookie preferences, Vercel Speed Insights may receive page and browser performance measurements. This optional measurement remains off for visitors with no new analytics choice, or who select Essential Only. You may change your choice using the privacy preferences control or clear your browser storage.
          </p>
        </section>

        <section className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <span>3. GDPR &amp; CCPA Compliance Rights</span>
          </h2>
          <p>
            Regardless of your physical location, we afford all visitors the full suite of modern privacy rights:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Right to Access:</strong> Request a copy of any personal data associated with your email.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Right to Erasure:</strong> Request immediate and permanent deletion of your email from our subscription lists.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Right to Portability:</strong> Export your data in machine-readable JSON format.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Do Not Sell:</strong> We never sell personal information under CCPA or any international standard.</span>
            </div>
          </div>
        </section>

        <section className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <span>4. Security &amp; Cryptographic Standards</span>
          </h2>
          <p>
            All communications between your browser and our platform are encrypted in transit via modern Transport Layer Security (TLS 1.3) with HSTS enabled. Security research submissions can be encrypted using our official PGP key published on our Security &amp; Responsible Disclosure page.
          </p>
        </section>

        <section className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <span>5. Contact &amp; Data Protection Officer</span>
          </h2>
          <p>
            For any privacy requests, data deletion inquiries, or regulatory verification, contact our founder and lead researcher directly:
          </p>
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs space-y-1">
            <div><strong className="text-white">Author &amp; Lead Researcher:</strong> Vishwas Aithal</div>
            <div><strong className="text-white">Direct Email:</strong> vishwasaithal@proton.me</div>
            <div><strong className="text-white">Publication:</strong> YinYangYoHackers (Founded 2013)</div>
            <div><strong className="text-white">Location:</strong> Decentralized Global Network &bull; Zero-Log Sovereign Nodes</div>
          </div>
        </section>
      </div>
    </article>
  );
};
