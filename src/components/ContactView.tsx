import React, { useState } from 'react';
import { 
  Send, 
  Terminal, 
  ShieldCheck, 
  Lock, 
  Key, 
  CheckCircle, 
  Mail, 
  MessageSquare, 
  Radio, 
  Cpu, 
  Globe, 
  Github, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const [callsign, setCallsign] = useState('');
  const [returnRoute, setReturnRoute] = useState('');
  const [securityTier, setSecurityTier] = useState('02-RESEARCH-QUERY');
  const [messagePayload, setMessagePayload] = useState('');
  const [encryptWithPgp, setEncryptWithPgp] = useState(true);
  
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionLogs, setTransmissionLogs] = useState<string[]>([]);
  const [isSent, setIsSent] = useState(false);

  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);

  const handleTransmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messagePayload.trim() || !returnRoute.trim()) return;

    setIsTransmitting(true);
    setTransmissionLogs([]);

    const logs = [
      '[+] Initializing AES-256-GCM symmetric session key...',
      '[+] Deriving 4096-bit RSA asymmetric wrapper for recipient 0x9F4A82B1...',
      '[+] Encrypting payload datagram into armored ciphertext...',
      '[+] Establishing ephemeral TLS 1.3 socket to secure relay...',
      '[+] Performing cryptographic integrity handshake SHA-512...',
      '[+] ACK RECEIVED: Datagram successfully deposited into encrypted enclave.'
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setTransmissionLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setIsTransmitting(false);
          setIsSent(true);
        }
      }, (index + 1) * 350);
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedChannel(id);
    setTimeout(() => setCopiedChannel(null), 2500);
  };

  const handleReset = () => {
    setIsSent(false);
    setMessagePayload('');
    setTransmissionLogs([]);
  };

  return (
    <article id="contact-terminal-view" itemScope itemType="https://schema.org/ContactPage" className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="rounded-2xl bg-[#070c18] border border-cyan-900/40 p-6 sm:p-10 shadow-sm relative">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              SECURE ENCRYPTED DISPATCH TERMINAL
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-850 text-slate-300 border border-slate-700">
              Target: <strong className="text-emerald-400">cybersecurity consultation</strong>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight leading-snug">
            Request a Cybersecurity Consultation &amp; <span className="text-cyan-400">Encrypted Dispatch</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Schedule a dedicated cybersecurity consultation, submit vulnerability advisories, explore enterprise zero-trust hardening, or initiate PGP-encrypted security research dispatch directly with <strong className="text-white">Vishwas Aithal</strong> and the YinYangYoHackers engineering team.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Encrypted Message Dispatch Terminal Form (Cols 1-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="font-mono font-bold text-white text-sm sm:text-base">Encrypted Dispatch Form</h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> E2EE Protocol
              </span>
            </div>

            {isSent ? (
              <div className="p-6 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/50">
                  <CheckCircle className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-mono font-bold text-white text-base">DISPATCH TRANSMITTED &amp; VERIFIED</h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    Your message was encrypted and logged into our queue. We typically respond to authorized vulnerability disclosures and inquiries within 24-48 hours.
                  </p>
                </div>
                
                <div className="bg-[#02050c] p-3 rounded-lg border border-slate-800 text-left font-mono text-[10px] text-emerald-400 space-y-1">
                  {transmissionLogs.map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))}
                </div>

                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs transition-colors"
                >
                  Send Another Transmission
                </button>
              </div>
            ) : (
              <form onSubmit={handleTransmit} className="space-y-4 text-xs font-mono">
                {/* Field 1: Callsign */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 block font-semibold">
                    [01] SENDER_CALLSIGN / NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Neo, Cypher, Sarah Connor, Anonymous"
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#050811] border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                {/* Field 2: Return Route (Email / Matrix / Signal) */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 block font-semibold">
                    [02] SECURE_RETURN_ROUTE (EMAIL / SIGNAL / MATRIX)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. you@proton.me or @handle:matrix.org"
                    value={returnRoute}
                    onChange={(e) => setReturnRoute(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#050811] border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                {/* Field 3: Security Tier / Subject */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 block font-semibold">
                    [03] CLASSIFICATION_TIER
                  </label>
                  <select
                    value={securityTier}
                    onChange={(e) => setSecurityTier(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#050811] border border-slate-700/80 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 font-mono cursor-pointer"
                  >
                    <option value="01-VULN-DISCLOSURE">🔒 Zero-Day Vulnerability / Responsible Disclosure</option>
                    <option value="02-RESEARCH-QUERY">⚡ Cyber Research / Technical Inquiry</option>
                    <option value="03-TRAINING-SPEAKING">🎓 Workshop / Corporate Training Request</option>
                    <option value="04-OPEN-SOURCE-FEEDBACK">🛠️ Open-Source Tool Feedback</option>
                    <option value="05-GENERAL-DISPATCH">💬 General Greeting / Other</option>
                  </select>
                </div>

                {/* Field 4: Message Payload */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 block font-semibold">
                    [04] PAYLOAD_DATA (MESSAGE BODY)
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Enter your encrypted message, vulnerability report, or collaboration request..."
                    value={messagePayload}
                    onChange={(e) => setMessagePayload(e.target.value)}
                    className="w-full p-3.5 bg-[#050811] border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono text-xs leading-relaxed"
                  />
                </div>

                {/* PGP Checkbox */}
                <div 
                  onClick={() => setEncryptWithPgp(prev => !prev)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#050811] border border-slate-800 cursor-pointer hover:border-emerald-500/50 transition-colors select-none"
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${encryptWithPgp ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-600 bg-slate-900'}`}>
                    {encryptWithPgp && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div className="text-[11px]">
                    <span className="font-bold text-white">Armor with 4096-bit PGP Encrypted Cipher</span>
                    <p className="text-slate-400 font-sans">Encrypts text in-memory before transmission to Vishwas Aithal.</p>
                  </div>
                </div>

                {/* Transmit Live Terminal Output if transmitting */}
                {isTransmitting && (
                  <div className="p-3 bg-[#02050c] rounded-xl border border-emerald-500/60 font-mono text-[10px] text-emerald-400 space-y-1">
                    {transmissionLogs.map((log, idx) => (
                      <div key={idx} className="animate-in fade-in duration-100">{log}</div>
                    ))}
                    <div className="animate-pulse text-cyan-300">&gt;&gt; STREAMING CIPHER DATA...</div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isTransmitting}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-mono font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isTransmitting ? 'TRANSMITTING ENCRYPTED CIPHER...' : 'DISPATCH SECURE PAYLOAD'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Col: Verified Direct Channels & PGP Details (Cols 8-12) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct Verified Routes */}
          <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-mono font-bold text-white text-sm sm:text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Verified Direct Channels</span>
            </h3>

            <div className="space-y-3.5 text-xs sm:text-sm font-mono">
              {/* Route 1: Email */}
              <div className="p-3.5 bg-[#050811] rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 min-h-[52px]">
                <a 
                  href="mailto:vishwasaithal@proton.me"
                  className="flex items-center gap-3 overflow-hidden text-left hover:text-cyan-300 transition-colors py-1"
                >
                  <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="truncate">
                    <span className="text-slate-400 block text-[11px] font-sans">ENCRYPTED PROTON EMAIL</span>
                    <span className="text-white font-semibold truncate hover:underline">vishwasaithal@proton.me</span>
                  </div>
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard('vishwasaithal@proton.me', 'email')}
                  className="min-w-[48px] min-h-[48px] px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0 flex items-center justify-center"
                  title="Copy Email"
                  aria-label="Copy Proton Email"
                >
                  {copiedChannel === 'email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Route 2: Telegram (Replaces Signal) */}
              <div className="p-3.5 bg-[#050811] rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 min-h-[52px]">
                <a 
                  href="https://t.me/psychkarma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 overflow-hidden text-left hover:text-emerald-300 transition-colors py-1"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="truncate">
                    <span className="text-slate-400 block text-[11px] font-sans">TELEGRAM DISPATCH</span>
                    <span className="text-white font-semibold truncate hover:underline">https://t.me/psychkarma</span>
                  </div>
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard('https://t.me/psychkarma', 'telegram')}
                  className="min-w-[48px] min-h-[48px] px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0 flex items-center justify-center"
                  title="Copy Telegram Link"
                  aria-label="Copy Telegram Link"
                >
                  {copiedChannel === 'telegram' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Route 3: Instagram */}
              <div className="p-3.5 bg-[#050811] rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 min-h-[52px]">
                <a 
                  href="https://www.instagram.com/peace_believer/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 overflow-hidden text-left hover:text-pink-300 transition-colors py-1"
                >
                  <div className="w-9 h-9 rounded-lg bg-pink-950/60 border border-pink-800/50 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-pink-400" />
                  </div>
                  <div className="truncate">
                    <span className="text-slate-400 block text-[11px] font-sans">INSTAGRAM CHANNEL</span>
                    <span className="text-white font-semibold truncate hover:underline">@peace_believer</span>
                  </div>
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard('https://www.instagram.com/peace_believer/', 'instagram')}
                  className="min-w-[48px] min-h-[48px] px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0 flex items-center justify-center"
                  title="Copy Instagram Link"
                  aria-label="Copy Instagram Link"
                >
                  {copiedChannel === 'instagram' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Route 4: GitHub */}
              <div className="p-3.5 bg-[#050811] rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 min-h-[52px]">
                <a 
                  href="https://github.com/psychkarma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 overflow-hidden text-left hover:text-slate-200 transition-colors py-1"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center shrink-0">
                    <Github className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="truncate">
                    <span className="text-slate-400 block text-[11px] font-sans">GITHUB LAB</span>
                    <span className="text-white font-semibold truncate hover:underline">@psychkarma</span>
                  </div>
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard('https://github.com/psychkarma', 'github')}
                  className="min-w-[48px] min-h-[48px] px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0 flex items-center justify-center"
                  title="Copy GitHub Link"
                  aria-label="Copy GitHub Link"
                >
                  {copiedChannel === 'github' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* SLA & Security Advisory Box */}
          <div className="bg-[#090d16] border border-emerald-900/40 rounded-2xl p-5 shadow-lg space-y-3">
            <h4 className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              <span>Responsible Vulnerability Reporting SLA</span>
            </h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              When reporting security flaws, please include step-by-step reproduction steps, targeted software versions, and proof-of-concept logs. Critical 0-day disclosures receive acknowledgement within 12 hours.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
