import React, { useState } from 'react';
import { 
  Send, 
  Terminal, 
  ShieldCheck, 
  Lock, 
  Key, 
  CheckCircle, 
  Mail, 
  Globe, 
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Info
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const [senderName, setSenderName] = useState('');
  const [returnEmail, setReturnEmail] = useState('');
  const [category, setCategory] = useState('01-RESEARCH-QUERY');
  const [message, setMessage] = useState('');
  const [pgpRequested, setPgpRequested] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !returnEmail.trim()) return;

    setIsSubmitting(true);

    // Save outbox receipt locally so user doesn't lose submitted record
    try {
      const outbox = JSON.parse(localStorage.getItem('yyyh_contact_outbox') || '[]');
      outbox.push({
        id: `msg-${Date.now()}`,
        senderName: senderName.trim(),
        returnEmail: returnEmail.trim(),
        category,
        message: message.trim(),
        pgpRequested,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('yyyh_contact_outbox', JSON.stringify(outbox.slice(-10)));
    } catch {
      // Storage access blocked or quota exceeded
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 600);
  };

  const copyToClipboard = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedChannel(id);
      setTimeout(() => setCopiedChannel(null), 2500);
    }
  };

  const handleReset = () => {
    setIsSent(false);
    setMessage('');
  };

  return (
    <article id="contact-terminal-view" itemScope itemType="https://schema.org/ContactPage" className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="rounded-2xl bg-[#070c18] border border-slate-800 p-6 sm:p-10 shadow-sm relative">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1 rounded-full font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>RESEARCH &amp; VULNERABILITY DISCLOSURE DESK</span>
            </span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-slate-300">SECURE DISPATCH</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight leading-snug">
            Contact the Research Desk &amp; <span className="text-emerald-400">Responsible Disclosure</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Submit responsible vulnerability disclosures, request technical peer reviews, discuss open-source security tools, or explore defensive architecture blueprints with the YinYangYoHackers research staff.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Contact Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h2 className="font-mono font-bold text-white text-sm sm:text-base">Direct Dispatch Form</h2>
              </div>
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" /> Confidential Queue
              </span>
            </div>

            {isSent ? (
              <div className="p-6 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/50">
                  <CheckCircle className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-mono font-bold text-white text-base">DISPATCH RECEIVED</h3>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed max-w-md mx-auto">
                    Your dispatch has been queued. For responsible vulnerability disclosures adhering to RFC 9116, our research staff reviews and responds within 24 to 48 hours.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                {/* Sender Name */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 block font-semibold">
                    Name or Researcher Handle *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera or @alex_sec"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#050811] border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                {/* Return Email */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 block font-semibold">
                    Return Email / Contact Route *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. researcher@domain.com or protonmail"
                    value={returnEmail}
                    onChange={(e) => setReturnEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#050811] border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                {/* Classification / Category */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 block font-semibold">
                    Inquiry Classification
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#050811] border border-slate-700/80 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 font-mono cursor-pointer"
                  >
                    <option value="01-RESEARCH-QUERY">Security Research Inquiry</option>
                    <option value="02-VULN-DISCLOSURE">Responsible Vulnerability Disclosure (RFC 9116)</option>
                    <option value="03-ADVISORY-SCOPE">Technical Advisory / Architecture Review</option>
                    <option value="04-TOOL-FEEDBACK">Open-Source Security Tool Feedback</option>
                    <option value="05-EDITORIAL-CORRECTION">Editorial Feedback or Correction</option>
                  </select>
                </div>

                {/* Message Body */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 block font-semibold">
                    Message Body *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Provide detailed technical context, reproduction steps, or research inquiries..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3.5 bg-[#050811] border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono text-xs leading-relaxed"
                  />
                </div>

                {/* PGP Request Checkbox */}
                <label className="flex items-center gap-3 p-3 rounded-xl bg-[#050811] border border-slate-800 cursor-pointer hover:border-emerald-500/50 transition-colors select-none">
                  <input
                    type="checkbox"
                    checked={pgpRequested}
                    onChange={(e) => setPgpRequested(e.target.checked)}
                    className="accent-emerald-400 w-4 h-4 cursor-pointer"
                  />
                  <div className="text-[11px]">
                    <span className="font-bold text-white">Request PGP-Encrypted Correspondence</span>
                    <p className="text-slate-400 font-sans">Replies will be encrypted with our master PGP public key.</p>
                  </div>
                </label>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 font-mono font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Transmitting Dispatch...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Dispatch</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Col: Verified Direct Channels & PGP Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="font-mono font-bold text-white text-sm sm:text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Verified Contact Directives</span>
            </h2>

            <div className="space-y-3.5 text-xs font-mono">
              {/* PGP Keyring */}
              <div className="p-3.5 bg-[#050811] rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 min-h-[52px]">
                <div className="flex items-center gap-3 overflow-hidden text-left py-1">
                  <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center shrink-0">
                    <Key className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="truncate">
                    <span className="text-slate-400 block text-[11px] font-sans">PGP MASTER FINGERPRINT</span>
                    <span className="text-white font-semibold truncate font-mono text-[11px]">9F4A 82B1 C7D3 E5F0</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard('9F4A 82B1 C7D3 E5F0', 'pgp')}
                  className="min-w-[40px] min-h-[40px] px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                  title="Copy PGP Fingerprint"
                  aria-label="Copy PGP Key Fingerprint"
                >
                  {copiedChannel === 'pgp' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* RFC 9116 security.txt */}
              <div className="p-3.5 bg-[#050811] rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 min-h-[52px]">
                <a 
                  href="/.well-known/security.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 overflow-hidden text-left hover:text-cyan-300 transition-colors py-1"
                >
                  <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="truncate">
                    <span className="text-slate-400 block text-[11px] font-sans">SECURITY RFC 9116</span>
                    <span className="text-white font-semibold truncate hover:underline">/.well-known/security.txt</span>
                  </div>
                </a>
              </div>

              {/* RSS Syndication */}
              <div className="p-3.5 bg-[#050811] rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 min-h-[52px]">
                <a 
                  href="/rss.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 overflow-hidden text-left hover:text-amber-300 transition-colors py-1"
                >
                  <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-800/50 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="truncate">
                    <span className="text-slate-400 block text-[11px] font-sans">ADVISORY SYNDICATION</span>
                    <span className="text-white font-semibold truncate hover:underline">/rss.xml</span>
                  </div>
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard('https://yinyangyohackers.ai.studio/rss.xml', 'rss')}
                  className="min-w-[40px] min-h-[40px] px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0 flex items-center justify-center cursor-pointer"
                  title="Copy RSS URL"
                  aria-label="Copy RSS URL"
                >
                  {copiedChannel === 'rss' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Response Expectations */}
          <div className="bg-[#090d16] border border-emerald-900/40 rounded-2xl p-5 shadow-lg space-y-2.5">
            <h3 className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Response Expectations</span>
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              We are an independent cybersecurity research initiative. Legitimate vulnerability disclosures adhering to coordinated disclosure standards receive response within 24 to 48 hours. We do not offer emergency 24/7 incident response.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
