import React, { useState, useMemo } from 'react';
import { 
  KeyRound, 
  RefreshCw, 
  Copy, 
  Check, 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  HelpCircle,
  Hash,
  Activity
} from 'lucide-react';

export const PasswordAnalyzerTool: React.FC = () => {
  // Mode: 'generator' or 'custom'
  const [mode, setMode] = useState<'generator' | 'custom'>('generator');
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  // Generator settings
  const [passLength, setPassLength] = useState(18);
  const [incUpper, setIncUpper] = useState(true);
  const [incLower, setIncLower] = useState(true);
  const [incNumbers, setIncNumbers] = useState(true);
  const [incSymbols, setIncSymbols] = useState(true);
  const [noAmbiguous, setNoAmbiguous] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Custom typed password
  const [customPassword, setCustomPassword] = useState('');

  // Active password to analyze
  const activePassword = mode === 'generator' ? generatedPassword : customPassword;

  // Generate cryptographically secure password
  const generatePassword = () => {
    let chars = '';
    if (incLower) chars += noAmbiguous ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    if (incUpper) chars += noAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (incNumbers) chars += noAmbiguous ? '23456789' : '0123456789';
    if (incSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

    let pass = '';
    const array = new Uint32Array(passLength);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < passLength; i++) {
      pass += chars[array[i] % chars.length];
    }
    setGeneratedPassword(pass);
  };

  // Generate on mount and when options change
  React.useEffect(() => {
    generatePassword();
  }, [passLength, incUpper, incLower, incNumbers, incSymbols, noAmbiguous]);

  // Copy handler
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Comprehensive Password Analysis & Cracking Time Calculator
  const analysis = useMemo(() => {
    const pwd = activePassword;
    const len = pwd.length;

    if (len === 0) {
      return {
        entropyBits: 0,
        poolSize: 0,
        score: 0,
        strengthLabel: 'Empty',
        strengthColor: 'text-slate-500',
        bgStrengthColor: 'bg-slate-800',
        onlineCrackTime: 'Instant',
        gpuCrackTime: 'Instant',
        supercomputerCrackTime: 'Instant',
        slowHashCrackTime: 'Instant',
        hasLower: false,
        hasUpper: false,
        hasNumbers: false,
        hasSymbols: false,
        isCommonWord: false,
        hasSequential: false,
        hasRepeated: false,
        warnings: ['Enter or generate a password to begin cracking simulation.']
      };
    }

    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSymbols = /[^a-zA-Z0-9]/.test(pwd);

    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNumbers) poolSize += 10;
    if (hasSymbols) poolSize += 33;

    // Shannon Entropy: H = L * log2(poolSize)
    const entropyBits = poolSize > 0 ? Math.round(len * Math.log2(poolSize)) : 0;

    // Common weak dictionary keywords
    const lowerPwd = pwd.toLowerCase();
    const commonPatterns = [
      'password', '123456', '12345678', 'qwerty', 'admin', 'welcome', 'login', 
      'secret', 'iloveyou', 'dragon', 'monkey', 'master', 'football', 'letmein',
      'shadow', 'hacker', 'princess', 'solo', 'pass123', 'root'
    ];
    const isCommonWord = commonPatterns.some(pat => lowerPwd.includes(pat));

    // Sequential check (e.g. 1234, abcd, 9876)
    const hasSequential = /(?:012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(pwd);

    // Repeated character check (e.g. aaa, 111, !!!)
    const hasRepeated = /(.)\1{2,}/.test(pwd);

    // Total combinations: poolSize^len
    // Online attacks: ~100 attempts / sec (rate-limited / lockout)
    // Offline Fast GPU (Hashcat 8x RTX 4090 ~ 100 GH/s = 10^11 attempts / sec for MD5/NTLM)
    // Supercomputer / State Actor: 100 TH/s = 10^14 attempts / sec
    // Slow Hash (Argon2 / bcrypt ~ 1,000 attempts / sec)
    const formatTime = (seconds: number): string => {
      if (seconds < 0.001) return 'Instant (< 1 ms)';
      if (seconds < 1) return '< 1 second';
      if (seconds < 60) return `${Math.round(seconds)} seconds`;
      if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
      if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
      if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
      if (seconds < 31536000 * 100) return `${Math.round(seconds / 31536000)} years`;
      if (seconds < 31536000 * 1000000) return `${(seconds / (31536000 * 1000)).toFixed(1)}k years`;
      if (seconds < 31536000 * 1000000000) return `${(seconds / (31536000 * 1000000)).toFixed(1)}M years`;
      return 'Centuries+ (Practically Unbreakable)';
    };

    // Calculate approximate seconds
    // Average attempts = (poolSize^len) / 2
    let combinations = Math.pow(poolSize, Math.min(len, 40));
    if (isCommonWord) combinations = combinations * 0.01;
    if (hasSequential) combinations = combinations * 0.1;
    if (hasRepeated) combinations = combinations * 0.2;

    const avgTries = combinations / 2;

    const onlineSeconds = avgTries / 100;
    const gpuSeconds = avgTries / 100000000000; // 100 GH/s
    const supercomputerSeconds = avgTries / 100000000000000; // 100 TH/s
    const slowHashSeconds = avgTries / 1000; // 1k/s

    // Calculate 0-100 Score
    let score = 0;
    if (len >= 8) score += 15;
    if (len >= 12) score += 20;
    if (len >= 16) score += 15;
    if (len >= 20) score += 10;
    if (hasLower) score += 10;
    if (hasUpper) score += 10;
    if (hasNumbers) score += 10;
    if (hasSymbols) score += 10;

    if (isCommonWord) score -= 40;
    if (hasSequential) score -= 15;
    if (hasRepeated) score -= 10;
    if (score < 5 && len > 0) score = 5;
    if (score > 100) score = 100;

    let strengthLabel = 'Very Weak';
    let strengthColor = 'text-red-400';
    let bgStrengthColor = 'bg-red-500';

    if (score >= 85) {
      strengthLabel = 'Hardened Cryptographic';
      strengthColor = 'text-cyan-400';
      bgStrengthColor = 'bg-cyan-500';
    } else if (score >= 70) {
      strengthLabel = 'Strong';
      strengthColor = 'text-emerald-400';
      bgStrengthColor = 'bg-emerald-500';
    } else if (score >= 45) {
      strengthLabel = 'Moderate';
      strengthColor = 'text-amber-400';
      bgStrengthColor = 'bg-amber-500';
    } else if (score >= 25) {
      strengthLabel = 'Weak';
      strengthColor = 'text-orange-400';
      bgStrengthColor = 'bg-orange-500';
    }

    const warnings: string[] = [];
    if (len < 12) warnings.push('Length is under 12 characters vulnerable to high-speed offline GPU clusters.');
    if (!hasSymbols) warnings.push('Missing special symbols (!@#$%^&*) reduces search complexity.');
    if (!hasNumbers) warnings.push('Missing numeric digits.');
    if (!hasUpper) warnings.push('Missing uppercase letters.');
    if (isCommonWord) warnings.push('Contains recognizable dictionary words susceptible to dictionary & rule attacks (rockyou.txt).');
    if (hasSequential) warnings.push('Contains sequential patterns (e.g. "123" or "abc").');
    if (hasRepeated) warnings.push('Contains repeated character sequences.');

    return {
      entropyBits,
      poolSize,
      score,
      strengthLabel,
      strengthColor,
      bgStrengthColor,
      onlineCrackTime: formatTime(onlineSeconds),
      gpuCrackTime: formatTime(gpuSeconds),
      supercomputerCrackTime: formatTime(supercomputerSeconds),
      slowHashCrackTime: formatTime(slowHashSeconds),
      hasLower,
      hasUpper,
      hasNumbers,
      hasSymbols,
      isCommonWord,
      hasSequential,
      hasRepeated,
      warnings
    };
  }, [activePassword]);

  return (
    <div id="password-analyzer-suite" className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white font-mono flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-emerald-400" />
            <span>Password Generator &amp; Crack Time Analyzer</span>
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Generate CS-PRNG passwords or type any custom password to simulate offline GPU brute-force crack times.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-[#050811] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode('generator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              mode === 'generator'
                ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Generate Password
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              mode === 'custom'
                ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Type / Test Password
          </button>
        </div>
      </div>

      {/* Main Interactive Input Display */}
      {mode === 'generator' ? (
        <div className="space-y-4">
          <div className="relative bg-[#050811] border border-slate-700/80 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-mono text-base sm:text-xl text-emerald-300 font-bold tracking-wider break-all select-all">
              {generatedPassword}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={generatePassword}
                title="Regenerate password"
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleCopy(generatedPassword)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Password'}</span>
              </button>
            </div>
          </div>

          {/* Generator Controls */}
          <div className="space-y-4 pt-1">
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                <span>Password Length: <strong className="text-emerald-400">{passLength} characters</strong></span>
                <span className="text-slate-500">Range: 8 to 64</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={passLength}
                onChange={(e) => setPassLength(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <label className="flex items-center gap-2 bg-[#050811] p-3 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={incUpper}
                  onChange={(e) => setIncUpper(e.target.checked)}
                  className="accent-emerald-500 w-4 h-4 rounded"
                />
                <span className="text-slate-200">Uppercase (A-Z)</span>
              </label>

              <label className="flex items-center gap-2 bg-[#050811] p-3 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={incLower}
                  onChange={(e) => setIncLower(e.target.checked)}
                  className="accent-emerald-500 w-4 h-4 rounded"
                />
                <span className="text-slate-200">Lowercase (a-z)</span>
              </label>

              <label className="flex items-center gap-2 bg-[#050811] p-3 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={incNumbers}
                  onChange={(e) => setIncNumbers(e.target.checked)}
                  className="accent-emerald-500 w-4 h-4 rounded"
                />
                <span className="text-slate-200">Numbers (0-9)</span>
              </label>

              <label className="flex items-center gap-2 bg-[#050811] p-3 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={incSymbols}
                  onChange={(e) => setIncSymbols(e.target.checked)}
                  className="accent-emerald-500 w-4 h-4 rounded"
                />
                <span className="text-slate-200">Symbols (!@#$)</span>
              </label>
            </div>
          </div>
        </div>
      ) : (
        /* Custom Input Testing Mode */
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Type Password to Test Cracking Time:</span>
              </label>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Hide Input' : 'Show Input'}</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
                placeholder="Type any password (e.g. CorrectHorseBatteryStaple!2026)..."
                className="w-full px-4 py-3.5 bg-[#050811] border border-slate-700/90 rounded-xl text-base text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono tracking-wider transition-all"
              />
              {customPassword && (
                <button
                  onClick={() => setCustomPassword('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick preset examples */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-mono text-slate-500">Quick Test Presets:</span>
            {[
              { name: 'Weak ("password123")', val: 'password123' },
              { name: 'Common ("admin@2024")', val: 'admin@2024' },
              { name: 'Passphrase ("correct-horse-battery")', val: 'correct-horse-battery-staple-99' },
              { name: 'Complex 16-Char', val: 'xK9#mQ2$vL8@zP5!' }
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => setCustomPassword(p.val)}
                className="px-2.5 py-1 rounded bg-[#050811] hover:bg-slate-800 text-[11px] font-mono text-slate-300 border border-slate-800 transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Strength & Entropy Progress Bar */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Strength Score:</span>
            <span className={`font-bold ${analysis.strengthColor}`}>{analysis.score}/100 ({analysis.strengthLabel})</span>
          </div>
          <div className="text-slate-400">
            Entropy: <strong className="text-emerald-400">~{analysis.entropyBits} bits</strong> (Pool: {analysis.poolSize} chars)
          </div>
        </div>

        <div className="w-full h-3 bg-[#050811] rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${analysis.bgStrengthColor}`}
            style={{ width: `${analysis.score}%` }}
          />
        </div>
      </div>

      {/* Cracking Simulation Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Fast GPU Rig */}
        <div className="bg-[#050811] p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-orange-400" />
            <span>Fast GPU Rig (Hashcat)</span>
          </div>
          <p className="text-base font-bold text-white font-mono break-words">{analysis.gpuCrackTime}</p>
          <span className="text-[10px] text-slate-500 font-mono block">8x RTX 4090 (~100 GH/s NTLM)</span>
        </div>

        {/* 2. Online Throttled */}
        <div className="bg-[#050811] p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Online Web Login Attack</span>
          </div>
          <p className="text-base font-bold text-cyan-300 font-mono break-words">{analysis.onlineCrackTime}</p>
          <span className="text-[10px] text-slate-500 font-mono block">~100 guesses/sec (Rate limited)</span>
        </div>

        {/* 3. Slow Hash */}
        <div className="bg-[#050811] p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hardened Hash (Argon2id)</span>
          </div>
          <p className="text-base font-bold text-emerald-300 font-mono break-words">{analysis.slowHashCrackTime}</p>
          <span className="text-[10px] text-slate-500 font-mono block">~1,000 hashes/sec (Memory-hard)</span>
        </div>

        {/* 4. Supercomputer */}
        <div className="bg-[#050811] p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>Supercomputer Cluster</span>
          </div>
          <p className="text-base font-bold text-purple-300 font-mono break-words">{analysis.supercomputerCrackTime}</p>
          <span className="text-[10px] text-slate-500 font-mono block">100 Trillion hashes/sec</span>
        </div>
      </div>

      {/* Composition & Warning Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Character Composition Badges */}
        <div className="bg-[#050811] p-4 rounded-xl border border-slate-800 space-y-3">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Character Set Composition
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className={`flex items-center gap-1.5 p-2 rounded border ${analysis.hasLower ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50' : 'bg-slate-900/50 text-slate-500 border-slate-800'}`}>
              {analysis.hasLower ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5" />}
              <span>Lowercase (a-z)</span>
            </div>
            <div className={`flex items-center gap-1.5 p-2 rounded border ${analysis.hasUpper ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50' : 'bg-slate-900/50 text-slate-500 border-slate-800'}`}>
              {analysis.hasUpper ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5" />}
              <span>Uppercase (A-Z)</span>
            </div>
            <div className={`flex items-center gap-1.5 p-2 rounded border ${analysis.hasNumbers ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50' : 'bg-slate-900/50 text-slate-500 border-slate-800'}`}>
              {analysis.hasNumbers ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5" />}
              <span>Numbers (0-9)</span>
            </div>
            <div className={`flex items-center gap-1.5 p-2 rounded border ${analysis.hasSymbols ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50' : 'bg-slate-900/50 text-slate-500 border-slate-800'}`}>
              {analysis.hasSymbols ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5" />}
              <span>Symbols (!@#$)</span>
            </div>
          </div>
        </div>

        {/* Security Audit Findings */}
        <div className="bg-[#050811] p-4 rounded-xl border border-slate-800 space-y-2">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Security Audit &amp; Warnings</span>
            <span className={`text-[10px] px-2 py-0.5 rounded ${analysis.warnings.length === 0 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
              {analysis.warnings.length} {analysis.warnings.length === 1 ? 'Notice' : 'Notices'}
            </span>
          </h4>

          {analysis.warnings.length === 0 ? (
            <div className="p-3 rounded bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Excellent cryptographic strength! No known dictionary patterns or structural weaknesses detected.</span>
            </div>
          ) : (
            <ul className="space-y-1.5 text-xs text-slate-400 font-sans max-h-32 overflow-y-auto pr-1">
              {analysis.warnings.map((warn, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-amber-300/90 font-mono text-[11px]">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>{warn}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
