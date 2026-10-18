import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  X, 
  ShieldCheck, 
  Key, 
  ExternalLink, 
  Copy, 
  Check, 
  MessageSquare,
  Lock
} from 'lucide-react';

export const DirectContactDesk: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subjectType, setSubjectType] = useState('Security Audit & Penetration Testing');
  const [messageBody, setMessageBody] = useState('');
  const [copiedPgp, setCopiedPgp] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const pgpKey = '0x4A8F9C2B1D3E5F7A';

  const handleCopyPgp = () => {
    navigator.clipboard.writeText(pgpKey);
    setCopiedPgp(true);
    setTimeout(() => setCopiedPgp(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim()) return;

    const subject = encodeURIComponent(`[YinYangYo Lab Inquiry] ${subjectType} from ${senderName || 'Researcher'}`);
    const body = encodeURIComponent(
      `Name: ${senderName || 'Anonymous'}\n` +
      `Email: ${senderEmail || 'Not specified'}\n` +
      `Topic: ${subjectType}\n\n` +
      `Message:\n${messageBody}\n\n` +
      `---\nSent via YinYangYoHackers Direct Dispatch Desk`
    );

    // Launch direct mailto to founder Vishwas Aithal
    window.location.href = `mailto:vishwasaithal@proton.me?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <aside 
      id="direct-dispatch-desk" 
      aria-label="Direct Lab Dispatch Desk"
      className="fixed bottom-5 right-5 z-50 select-none font-sans"
    >
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setSubmitted(false); }}
          className="group px-4 py-3 min-h-[48px] min-w-[48px] rounded-full bg-[#0a0f1d] hover:bg-slate-900 border border-emerald-500/70 hover:border-emerald-400 text-white shadow-lg transition-colors flex items-center gap-2.5 cursor-pointer text-xs font-mono"
          title="Direct Dispatch: Contact Lab Lead Vishwas Aithal"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-100 group-hover:text-emerald-300">
            Contact Lab Lead
          </span>
        </button>
      )}

      {/* Dispatch Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[400px] bg-[#070b14] border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-[#0a0f1e] px-4 py-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-mono font-bold text-white">Vishwas Aithal</h3>
                  <span className="text-[10px] px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded font-mono">
                    Lead Researcher
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  Direct Cybersecurity Research Dispatch
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2.5 min-w-[48px] min-h-[48px] rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
              title="Close dispatch window"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 overflow-y-auto space-y-4 text-xs font-sans">
            
            {/* Quick Human Channels */}
            <div className="bg-[#050811] border border-slate-800 rounded-xl p-3 space-y-2.5">
              <div className="text-[11px] font-mono text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Verified Channels</span>
                <span className="text-emerald-300 text-[10px] flex items-center gap-1">
                  <Lock className="w-3 h-3" /> PGP Secured
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                <a
                  href="mailto:vishwasaithal@proton.me"
                  className="px-2.5 py-2.5 min-h-[48px] rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">vishwasaithal@proton.me</span>
                </a>

                <a
                  href="https://t.me/psychkarma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-2.5 min-h-[48px] rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Telegram: @psychkarma</span>
                </a>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-300">
                <span className="flex items-center gap-1 text-slate-300">
                  <Key className="w-3 h-3 text-amber-400" />
                  PGP: {pgpKey}
                </span>
                <button
                  type="button"
                  onClick={handleCopyPgp}
                  className="text-emerald-300 hover:text-emerald-200 flex items-center justify-center gap-1 py-2.5 px-3 min-h-[48px] min-w-[48px] cursor-pointer"
                >
                  {copiedPgp ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPgp ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Quick Dispatch Form */}
            {submitted ? (
              <div className="text-center py-6 space-y-2 bg-[#050811] border border-emerald-900/40 rounded-xl p-4">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-mono font-bold text-white text-sm">Dispatch Prepared</h4>
                <p className="text-slate-200 text-xs leading-relaxed">
                  Your message was drafted for Vishwas Aithal. If your mail client did not automatically launch, please email directly to:
                </p>
                <p className="font-mono text-emerald-300 font-bold text-xs select-all">
                  vishwasaithal@proton.me
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 py-2.5 px-3 min-h-[48px] text-xs font-mono text-slate-300 hover:text-white underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                  Direct Inquiries &amp; Consultations
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Alex"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-2.5 py-2.5 min-h-[48px] rounded-lg bg-[#050811] border border-slate-700 text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1">Your Email</label>
                    <input
                      type="email"
                      placeholder="alex@domain.com"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full px-2.5 py-2.5 min-h-[48px] rounded-lg bg-[#050811] border border-slate-700 text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500 font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">Inquiry Type</label>
                  <select
                    value={subjectType}
                    onChange={(e) => setSubjectType(e.target.value)}
                    className="w-full px-2.5 py-2.5 min-h-[48px] rounded-lg bg-[#050811] border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 font-sans"
                  >
                    <option value="Security Audit & Penetration Testing">Security Audit &amp; Penetration Testing</option>
                    <option value="Sovereign Systems Infrastructure Hardening">Sovereign Systems Infrastructure Hardening</option>
                    <option value="Linux Server & Kernel Bastion Consulting">Linux Server &amp; Kernel Bastion Consulting</option>
                    <option value="Vulnerability Disclosure / Bug Bounty">Vulnerability Disclosure / Bug Bounty</option>
                    <option value="General Technical Question">General Technical Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">Your Message</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your inquiry, project scope, or technical question..."
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    required
                    className="w-full px-2.5 py-2 rounded-lg bg-[#050811] border border-slate-700 text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500 font-sans resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 min-h-[48px] rounded-xl bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Direct Dispatch</span>
                </button>
              </form>
            )}

          </div>

          {/* Footer note */}
          <div className="bg-[#050811] px-4 py-2.5 border-t border-slate-800/80 text-[11px] font-mono text-slate-300 flex items-center justify-between">
            <span>Direct human lab correspondence</span>
            <span className="text-emerald-400 font-semibold">100% Confidential</span>
          </div>

        </div>
      )}
    </aside>
  );
};
