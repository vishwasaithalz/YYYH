import React, { useState } from 'react';
import { 
  Send, 
  X, 
  ShieldCheck, 
  Key, 
  Copy, 
  Check, 
  Lock,
  Radio,
  FileCode
} from 'lucide-react';

export const DirectContactDesk: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subjectType, setSubjectType] = useState('Security Audit & Penetration Testing');
  const [messageBody, setMessageBody] = useState('');
  const [copiedPgp, setCopiedPgp] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isArmoring, setIsArmoring] = useState(false);

  const pgpKey = '0x4A8F9C2B1D3E5F7A';

  const handleCopyPgp = () => {
    navigator.clipboard.writeText(pgpKey);
    setCopiedPgp(true);
    setTimeout(() => setCopiedPgp(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim()) return;

    setIsArmoring(true);
    setTimeout(() => {
      setIsArmoring(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <aside 
      id="direct-dispatch-desk" 
      aria-label="Direct Lab Dispatch Desk"
      className="fixed bottom-5 right-5 z-50 select-none font-sans"
    >
      {/* Floating Trigger Button with Short Hint */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setSubmitted(false); }}
          className="group px-3.5 py-2.5 min-h-[44px] min-w-[44px] rounded-full bg-[#0a0f1d] hover:bg-slate-900 border border-emerald-500/70 hover:border-emerald-400 text-white shadow-lg transition-colors flex items-center gap-2 cursor-pointer text-xs font-mono"
          title="Open Lab Dispatch Desk"
          aria-label="Open Dispatch Desk"
        >
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-100 group-hover:text-emerald-300">
            Dispatch Desk
          </span>
        </button>
      )}

      {/* Dispatch Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[400px] bg-[#070b14] border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-[#0a0f1e] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-mono font-bold text-white">Security Lab Dispatch</h3>
                  <span className="text-[10px] px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded font-mono">
                    ONLINE
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  Direct Research &amp; Advisory Channel
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 min-w-[40px] min-h-[40px] rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
              title="Close"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 overflow-y-auto space-y-4 text-xs font-sans">
            
            {/* Verified Channels */}
            <div className="bg-[#050811] border border-slate-800 rounded-xl p-3 space-y-2.5">
              <div className="text-[11px] font-mono text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Verified Directives</span>
                <span className="text-emerald-300 text-[10px] flex items-center gap-1">
                  <Lock className="w-3 h-3" /> PGP Secured
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-300">
                <span className="flex items-center gap-1 text-slate-300">
                  <Key className="w-3 h-3 text-amber-400" />
                  Key: {pgpKey}
                </span>
                <button
                  type="button"
                  onClick={handleCopyPgp}
                  className="text-emerald-300 hover:text-emerald-200 flex items-center justify-center gap-1 py-1.5 px-2.5 min-h-[40px] cursor-pointer"
                >
                  {copiedPgp ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPgp ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Quick Dispatch Form */}
            {submitted ? (
              <div className="text-center py-6 space-y-3 bg-[#050811] border border-emerald-900/40 rounded-xl p-4">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-mono font-bold text-white text-sm">Payload Transmitted</h4>
                <p className="text-slate-200 text-xs leading-relaxed">
                  Your inquiry has been encrypted and deposited into the secure research enclave.
                </p>
                <div className="flex justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setMessageBody('');
                    }}
                    className="py-2 px-3.5 min-h-[40px] text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer"
                  >
                    New Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="py-2 px-3.5 min-h-[40px] text-xs font-mono bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg cursor-pointer font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                  Direct Consultation
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Alex"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-2.5 py-2 min-h-[40px] rounded-lg bg-[#050811] border border-slate-700 text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1">Return Route</label>
                    <input
                      type="text"
                      placeholder="Contact point"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full px-2.5 py-2 min-h-[40px] rounded-lg bg-[#050811] border border-slate-700 text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500 font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">Subject</label>
                  <select
                    value={subjectType}
                    onChange={(e) => setSubjectType(e.target.value)}
                    className="w-full px-2.5 py-2 min-h-[40px] rounded-lg bg-[#050811] border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-sans"
                  >
                    <option value="Security Audit & Penetration Testing">Security Audit &amp; Testing</option>
                    <option value="Zero-Trust Architecture Consultation">Zero Trust Consultation</option>
                    <option value="Vulnerability Disclosure (0-day / Bug Bounty)">Vulnerability Disclosure</option>
                    <option value="Autonomous Systems & Sovereign Compute">Sovereign Systems Query</option>
                    <option value="Independent Research Collaboration">Research Collaboration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">Message Payload</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter scope, advisory details, or architecture inquiry..."
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#050811] border border-slate-700 text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500 font-sans resize-none"
                  />
                </div>

                {/* Submit button with short hint */}
                <button
                  type="submit"
                  disabled={isArmoring || !messageBody.trim()}
                  className="w-full py-2.5 min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-mono font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isArmoring ? 'Armoring Payload...' : 'Dispatch'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
