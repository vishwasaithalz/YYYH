import React, { useState, useMemo } from 'react';
import { 
  KeyRound, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Copy, 
  Check, 
  ShieldCheck, 
  ShieldAlert, 
  Cpu, 
  Server, 
  AlertTriangle,
  Zap,
  Info
} from 'lucide-react';

export const PasswordEntropyTool: React.FC = () => {
  const [password, setPassword] = useState('S0v3r3!gn_N3tw0rk#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate high-entropy passphrase or complex string
  const handleGenerate = (type: 'passphrase' | 'complex') => {
    if (type === 'passphrase') {
      const words = [
        'sovereign', 'bastion', 'crypt', 'neural', 'kernel', 'entropy', 'cipher',
        'diode', 'airgap', 'enclave', 'matrix', 'tensor', 'quantum', 'firewall',
        'subzero', 'vortex', 'sentinel', 'protocol', 'zenith', 'obsidian', 'stealth'
      ];
      const chosen = [];
      for (let i = 0; i < 4; i++) {
        const randIdx = Math.floor(Math.random() * words.length);
        chosen.push(words[randIdx]);
      }
      const num = Math.floor(10 + Math.random() * 90);
      setPassword(`${chosen.join('-')}-${num}!`);
    } else {
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
      let res = '';
      const array = new Uint32Array(20);
      crypto.getRandomValues(array);
      for (let i = 0; i < 20; i++) {
        res += charset[array[i] % charset.length];
      }
      setPassword(res);
    }
  };

  // Calculations
  const analysis = useMemo(() => {
    const pwd = password;
    const len = pwd.length;

    let pool = 0;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasDigits = /[0-9]/.test(pwd);
    const hasSymbols = /[^a-zA-Z0-9]/.test(pwd);

    if (hasLower) pool += 26;
    if (hasUpper) pool += 26;
    if (hasDigits) pool += 10;
    if (hasSymbols) pool += 33;

    if (pool === 0 || len === 0) {
      return {
        entropyBits: 0,
        poolSize: 0,
        combinations: '0',
        strengthLabel: 'Empty',
        strengthColor: 'text-slate-500',
        hasLower,
        hasUpper,
        hasDigits,
        hasSymbols,
        crackTimes: {
          online: 'Instant',
          singleGpu: 'Instant',
          gpuCluster: 'Instant',
          nationState: 'Instant'
        },
        nistChecks: {
          lengthOk: false,
          noSequences: true,
          noRepetitions: true
        }
      };
    }

    // Shannon Entropy: E = L * log2(R)
    const entropyBits = Math.round(len * Math.log2(pool));

    // Combinations: pool^len
    const combinationsBig = BigInt(pool) ** BigInt(Math.min(len, 60));
    const combinationsStr = len > 25 ? `~10^${Math.round(len * Math.log10(pool))}` : combinationsBig.toLocaleString();

    // Crack time estimations (seconds)
    // Avg guesses to crack = 0.5 * pool^len
    const totalGuesses = Math.pow(pool, Math.min(len, 35));

    const formatTime = (seconds: number) => {
      if (seconds < 1) return 'Instant (< 1 second)';
      if (seconds < 60) return `${Math.round(seconds)} seconds`;
      if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
      if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
      if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
      const years = seconds / 31536000;
      if (years < 100) return `${Math.round(years)} years`;
      if (years < 1000000) return `${Math.round(years).toLocaleString()} years`;
      if (years < 1e9) return `${(years / 1e6).toFixed(1)} million years`;
      if (years < 1e12) return `${(years / 1e9).toFixed(1)} billion years`;
      return 'Trillions of years (Centuries+)';
    };

    // Online rate limit: 100 guesses/sec
    const onlineSec = (0.5 * totalGuesses) / 100;
    // Single RTX 4090 (fast MD5/NTLM: 10^10 / sec, SHA-256: 2x10^9 / sec)
    const singleGpuSec = (0.5 * totalGuesses) / 1e10;
    // 8x RTX 4090 GPU Cluster (10^11 / sec)
    const gpuClusterSec = (0.5 * totalGuesses) / 1e11;
    // Nation-State supercomputer (10^14 / sec)
    const nationStateSec = (0.5 * totalGuesses) / 1e14;

    // Strength tier
    let strengthLabel = 'Very Weak';
    let strengthColor = 'text-red-400 border-red-500/30 bg-red-500/10';
    if (entropyBits >= 128) {
      strengthLabel = 'Quantum-Resistant / Military Grade';
      strengthColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    } else if (entropyBits >= 80) {
      strengthLabel = 'Very Strong';
      strengthColor = 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    } else if (entropyBits >= 60) {
      strengthLabel = 'Strong';
      strengthColor = 'text-teal-400 border-teal-500/30 bg-teal-500/10';
    } else if (entropyBits >= 40) {
      strengthLabel = 'Moderate';
      strengthColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    }

    // NIST SP 800-63B checks
    const hasRepetition = /(.)\1{2,}/.test(pwd);
    const hasSequence = /(012|123|234|345|456|567|678|789|abc|bcd|cde|def|qwe|asd)/i.test(pwd);

    return {
      entropyBits,
      poolSize: pool,
      combinations: combinationsStr,
      strengthLabel,
      strengthColor,
      hasLower,
      hasUpper,
      hasDigits,
      hasSymbols,
      crackTimes: {
        online: formatTime(onlineSec),
        singleGpu: formatTime(singleGpuSec),
        gpuCluster: formatTime(gpuClusterSec),
        nationState: formatTime(nationStateSec)
      },
      nistChecks: {
        lengthOk: len >= 12,
        noSequences: !hasSequence,
        noRepetitions: !hasRepetition
      }
    };
  }, [password]);

  return (
    <div className="bg-[#0b101d] border border-cyan-500/20 rounded-xl p-5 sm:p-7 shadow-2xl text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
              Shannon Password Entropy Engine
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                NIST SP 800-63B
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Live mathematical entropy calculation, pool space sizing & multi-adversary cracking benchmarks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleGenerate('passphrase')}
            className="text-xs font-mono px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Diceware
          </button>
          <button
            onClick={() => handleGenerate('complex')}
            className="text-xs font-mono px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Zap className="w-3.5 h-3.5" /> Complex
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Password Input with eye toggle & copy */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">Target Passphrase or Secret</span>
            <span className="text-slate-500">{password.length} characters</span>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type or generate a password to inspect..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-3.5 pr-20 py-3 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 text-slate-400 hover:text-slate-200 transition"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard(password)}
                className="p-1.5 text-slate-400 hover:text-cyan-400 transition"
                title="Copy password"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Shannon Entropy</div>
            <div className="text-xl font-mono font-bold text-cyan-300 mt-1">
              {analysis.entropyBits} <span className="text-xs font-normal text-slate-400">bits</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Character Pool ($R$)</div>
            <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
              {analysis.poolSize} <span className="text-xs font-normal text-slate-400">symbols</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Search Space ($R^L$)</div>
            <div className="text-sm font-mono font-bold text-amber-300 mt-1 truncate" title={analysis.combinations}>
              {analysis.combinations}
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Security Tier</div>
            <div className="mt-1">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border inline-block ${analysis.strengthColor}`}>
                {analysis.strengthLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Real-World Adversary Cracking Times */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            Adversary Brute-Force Time Benchmarks (Average 50% Probability)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 font-mono text-xs space-y-1">
              <div className="text-slate-400 flex items-center justify-between">
                <span>Web Login Rate-Limit</span>
                <span className="text-[10px] text-slate-500">100/sec</span>
              </div>
              <div className="text-sm font-bold text-cyan-300">
                {analysis.crackTimes.online}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 font-mono text-xs space-y-1">
              <div className="text-slate-400 flex items-center justify-between">
                <span>1x RTX 4090 Offline</span>
                <span className="text-[10px] text-slate-500">10¹⁰/sec</span>
              </div>
              <div className="text-sm font-bold text-emerald-400">
                {analysis.crackTimes.singleGpu}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 font-mono text-xs space-y-1">
              <div className="text-slate-400 flex items-center justify-between">
                <span>8x RTX 4090 Cluster</span>
                <span className="text-[10px] text-slate-500">10¹¹/sec</span>
              </div>
              <div className="text-sm font-bold text-amber-300">
                {analysis.crackTimes.gpuCluster}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 font-mono text-xs space-y-1">
              <div className="text-slate-400 flex items-center justify-between">
                <span>Nation-State Cluster</span>
                <span className="text-[10px] text-slate-500">10¹⁴/sec</span>
              </div>
              <div className="text-sm font-bold text-indigo-300">
                {analysis.crackTimes.nationState}
              </div>
            </div>
          </div>
        </div>

        {/* Character Set Composition & NIST Checks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Character Subsets */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 font-mono text-xs space-y-2">
            <div className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
              Character Pool Subsets
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div className={`flex items-center gap-2 ${analysis.hasLower ? 'text-emerald-400' : 'text-slate-600'}`}>
                <span>{analysis.hasLower ? '✓' : '✗'}</span> Lowercase (a-z, 26)
              </div>
              <div className={`flex items-center gap-2 ${analysis.hasUpper ? 'text-emerald-400' : 'text-slate-600'}`}>
                <span>{analysis.hasUpper ? '✓' : '✗'}</span> Uppercase (A-Z, 26)
              </div>
              <div className={`flex items-center gap-2 ${analysis.hasDigits ? 'text-emerald-400' : 'text-slate-600'}`}>
                <span>{analysis.hasDigits ? '✓' : '✗'}</span> Numbers (0-9, 10)
              </div>
              <div className={`flex items-center gap-2 ${analysis.hasSymbols ? 'text-emerald-400' : 'text-slate-600'}`}>
                <span>{analysis.hasSymbols ? '✓' : '✗'}</span> Symbols (!@#$, 33)
              </div>
            </div>
          </div>

          {/* NIST SP 800-63B Rules */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 font-mono text-xs space-y-2">
            <div className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
              NIST SP 800-63B Verification
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div className={`flex items-center gap-2 ${analysis.nistChecks.lengthOk ? 'text-emerald-400' : 'text-red-400'}`}>
                <span>{analysis.nistChecks.lengthOk ? '✓' : '✗'}</span> Minimum 12 characters length ({password.length}/12)
              </div>
              <div className={`flex items-center gap-2 ${analysis.nistChecks.noSequences ? 'text-emerald-400' : 'text-amber-400'}`}>
                <span>{analysis.nistChecks.noSequences ? '✓' : '⚠'}</span> Free from sequential patterns (e.g. 123, abc, qwe)
              </div>
              <div className={`flex items-center gap-2 ${analysis.nistChecks.noRepetitions ? 'text-emerald-400' : 'text-amber-400'}`}>
                <span>{analysis.nistChecks.noRepetitions ? '✓' : '⚠'}</span> Free from 3+ repetitive characters (e.g. aaa)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
