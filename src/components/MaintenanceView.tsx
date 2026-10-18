import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Terminal, 
  Mail, 
  Clock, 
  CheckCircle2, 
  Radio, 
  ArrowLeft,
  Key,
  Cpu,
  RefreshCw
} from 'lucide-react';

interface MaintenanceViewProps {
  onBypass: () => void;
  onGoHome: () => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  onBypass,
  onGoHome
}) => {
  const [passphrase, setPassphrase] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 18, seconds: 42 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBypassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase.trim().toLowerCase() === 'yyyh-preview' || passphrase.trim().toLowerCase() === 'psychkarma' || passphrase.trim().toLowerCase() === 'admin') {
      onBypass();
    } else {
      setErrorMsg('Invalid authorization key. Contact lab at vishwasaithal@proton.me');
      setTimeout(() => setErrorMsg(''), 3500);
    }
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Cyber Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-amber-500" />

      <div className="w-full max-w-2xl bg-[#090d16] border border-emerald-900/60 rounded-2xl p-6 sm:p-10 shadow-2xl relative z-10 space-y-8">
        
        {/* Top Status */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>DEFENSE HARDENING PROTOCOL ACTIVE</span>
            </span>
          </div>

          <button
            onClick={onGoHome}
            className="text-xs font-mono text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Site</span>
          </button>
        </div>

        {/* Brand & Headline */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-mono">
            <Radio className="w-3 h-3 text-emerald-400 animate-spin" />
            <span>Under Scheduled Construction &amp; Zero-Trust Hardening</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
            YinYangYo<span className="text-emerald-400">Hackers</span> Secure Node
          </h1>

          <p className="text-slate-300 font-sans text-sm sm:text-base leading-relaxed">
            The laboratory is currently executing a planned cryptographic migration, autonomous systems kernel patch, and high-security infrastructure upgrade. Normal public access will be restored shortly.
          </p>
        </div>

        {/* Live Countdown & Node Metrics */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-[#050811] border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">HOURS</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#050811] border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">MINUTES</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#050811] border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">SECONDS</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Diagnostic Status Matrix */}
        <div className="p-4 rounded-xl bg-[#050811] border border-slate-800 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Autonomous Systems Cluster (Ollama / DeepSeek)</span>
            </span>
            <span className="text-emerald-400">ONLINE (127.0.0.1)</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>SSL / TLS 1.3 Encryption Matrix</span>
            </span>
            <span className="text-emerald-400">256-BIT ENFORCED</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Zero-Trust Bastion Sysctl Hardening</span>
            </span>
            <span className="text-amber-400">RE-INDEXING CHUNKS</span>
          </div>
        </div>

        {/* Email Notification Form */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-slate-300 block font-semibold">
            GET NOTIFIED UPON DEPLOYMENT COMPLETION:
          </label>
          {subscribed ? (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Receipt logged. You will receive an encrypted dispatch alert when live.</span>
            </div>
          ) : (
            <form onSubmit={handleNotifySubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@organization.internal"
                  required
                  className="w-full bg-[#050811] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-mono font-bold text-xs transition-colors shrink-0"
              >
                Notify Me
              </button>
            </form>
          )}
        </div>

        {/* Engineer / Authorized Bypass Input */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Key className="w-3 h-3 text-cyan-400" />
              <span>Authorized Security Researcher Passphrase:</span>
            </span>
            <span className="text-slate-500">Hint: <code className="text-cyan-400 font-bold">yyyh-preview</code></span>
          </div>

          <form onSubmit={handleBypassSubmit} className="flex gap-2">
            <input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter authorization key..."
              className="flex-1 bg-[#050811] border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 hover:text-cyan-300 text-slate-300 font-mono font-bold text-xs transition-colors shrink-0"
            >
              Verify Key
            </button>
          </form>

          {errorMsg && (
            <p className="text-[11px] font-mono text-red-400">{errorMsg}</p>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-2 text-center text-xs font-mono text-slate-500">
          Founded in 2013 by Vishwas Aithal &bull; <a href="mailto:vishwasaithal@proton.me" className="text-slate-400 hover:text-emerald-400">vishwasaithal@proton.me</a>
        </div>
      </div>
    </div>
  );
};
