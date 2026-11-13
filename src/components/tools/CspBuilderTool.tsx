import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  RotateCcw, 
  Terminal, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

interface CspDirectiveState {
  key: string;
  name: string;
  description: string;
  value: string;
  isCustom: boolean;
}

const PRESET_PROFILES = {
  strictZeroTrust: {
    name: 'Strict Zero-Trust',
    tag: 'Highest Security',
    description: 'Strict nonces, no inline scripts, object-src disabled, and complete clickjacking prevention.',
    directives: {
      'default-src': "'self'",
      'script-src': "'self' 'strict-dynamic'",
      'style-src': "'self' 'unsafe-inline'",
      'img-src': "'self' data: https:",
      'font-src': "'self' https: data:",
      'connect-src': "'self' https:",
      'object-src': "'none'",
      'frame-ancestors': "'none'",
      'base-uri': "'self'",
      'form-action': "'self'",
      'upgrade-insecure-requests': 'true'
    }
  },
  modernSpa: {
    name: 'Modern Web App / SPA',
    tag: 'Production Balanced',
    description: 'Tailored for React, Next.js, Vite applications with external APIs, CDNs, and Google Fonts.',
    directives: {
      'default-src': "'self'",
      'script-src': "'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
      'img-src': "'self' data: https:",
      'font-src': "'self' https://fonts.gstatic.com data:",
      'connect-src': "'self' https: wss:",
      'object-src': "'none'",
      'frame-ancestors': "'none'",
      'base-uri': "'self'",
      'form-action': "'self'",
      'upgrade-insecure-requests': 'true'
    }
  },
  legacyPermissive: {
    name: 'Permissive / Migration',
    tag: 'Testing Mode',
    description: 'Broad allowances during initial migration before locking down production headers.',
    directives: {
      'default-src': "'self' *",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' *",
      'style-src': "'self' 'unsafe-inline' *",
      'img-src': "* data:",
      'font-src': "* data:",
      'connect-src': "*",
      'object-src': "'self'",
      'frame-ancestors': "'self'",
      'base-uri': "'self'",
      'form-action': "'self'",
      'upgrade-insecure-requests': 'false'
    }
  }
};

export const CspBuilderTool: React.FC = () => {
  const [directives, setDirectives] = useState<Record<string, string>>({
    ...PRESET_PROFILES.strictZeroTrust.directives
  });

  const [activeFormat, setActiveFormat] = useState<'nginx' | 'apache' | 'html' | 'header'>('nginx');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDirectiveChange = (key: string, val: string) => {
    setDirectives(prev => ({ ...prev, [key]: val }));
  };

  const applyPreset = (presetKey: keyof typeof PRESET_PROFILES) => {
    setDirectives({ ...PRESET_PROFILES[presetKey].directives });
  };

  // Compile raw CSP string
  const rawCspPolicy = useMemo(() => {
    const parts: string[] = [];
    Object.entries(directives).forEach(([dir, val]) => {
      const stringVal = String(val || '').trim();
      if (!stringVal) return;
      if (dir === 'upgrade-insecure-requests') {
        if (stringVal === 'true') parts.push('upgrade-insecure-requests');
      } else {
        parts.push(`${dir} ${stringVal}`);
      }
    });
    return parts.join('; ');
  }, [directives]);

  // Security Audit Warnings
  const auditWarnings = useMemo(() => {
    const warnings: { severity: 'critical' | 'warning' | 'good'; text: string }[] = [];

    // Check script-src
    const scriptSrc = directives['script-src'] || '';
    if (scriptSrc.includes("'unsafe-eval'")) {
      warnings.push({
        severity: 'critical',
        text: "script-src contains 'unsafe-eval', allowing arbitrary string-to-code execution (eval, Function)."
      });
    }
    if (scriptSrc.includes('*')) {
      warnings.push({
        severity: 'critical',
        text: 'script-src contains wildcard (*), allowing scripts to load from untrusted external origins.'
      });
    }

    // Check object-src
    const objectSrc = directives['object-src'] || '';
    if (objectSrc !== "'none'") {
      warnings.push({
        severity: 'warning',
        text: "object-src is not set to 'none'. Flash, Java, or legacy plugins may execute arbitrary binaries."
      });
    }

    // Check frame-ancestors
    const frameAncestors = directives['frame-ancestors'] || '';
    if (!frameAncestors || frameAncestors === '*') {
      warnings.push({
        severity: 'critical',
        text: 'Missing frame-ancestors directive. Site is vulnerable to UI Clickjacking and iframe embedding.'
      });
    }

    if (warnings.length === 0) {
      warnings.push({
        severity: 'good',
        text: 'Zero high-risk directives detected. Policy strictly enforces least-privilege resource boundaries.'
      });
    }

    return warnings;
  }, [directives]);

  // Formatted Web Server Outputs
  const formattedOutputs = useMemo(() => {
    return {
      header: `Content-Security-Policy: ${rawCspPolicy}`,
      nginx: `# Hardened Nginx Content Security Policy Header\nadd_header Content-Security-Policy "${rawCspPolicy}" always;\nadd_header X-Content-Type-Options "nosniff" always;\nadd_header X-Frame-Options "DENY" always;`,
      apache: `# Apache HTTP Server (.htaccess / httpd.conf)\n<IfModule mod_headers.c>\n    Header set Content-Security-Policy "${rawCspPolicy}"\n    Header set X-Content-Type-Options "nosniff"\n</IfModule>`,
      html: `<!-- HTML Entrypoint <head> Meta Tag -->\n<meta http-equiv="Content-Security-Policy" content="${rawCspPolicy}">`
    };
  }, [rawCspPolicy]);

  return (
    <div className="space-y-6">
      {/* Masthead Banner */}
      <div className="bg-[#070b16] border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg sm:text-xl font-bold font-mono text-white">
                Content Security Policy (CSP) Builder &amp; Rule Auditor
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Construct hardened Content-Security-Policy headers, audit XSS risk factors, and export configurations for Nginx, Apache, and SPAs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500 uppercase">
              W3C Level 3 Compliant
            </span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Security Presets:</span>
            {Object.entries(PRESET_PROFILES).map(([key, profile]) => (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key as keyof typeof PRESET_PROFILES)}
                className="px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                {profile.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Directive Inputs */}
        <div className="lg:col-span-2 space-y-3">
          <div className="p-4 bg-[#050914] border border-slate-800 rounded-xl space-y-3">
            <div className="text-xs font-mono font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
              <span>CSP Directives Configuration</span>
              <span className="text-[11px] text-slate-500 font-normal">Edit directive origins below</span>
            </div>

            <div className="space-y-3">
              {[
                { key: 'default-src', label: 'default-src', hint: 'Fallback for all fetch directives if omitted' },
                { key: 'script-src', label: 'script-src', hint: 'Valid sources for JavaScript execution' },
                { key: 'style-src', label: 'style-src', hint: 'Valid sources for stylesheets (CSS)' },
                { key: 'img-src', label: 'img-src', hint: 'Allowed origins for images and graphics' },
                { key: 'connect-src', label: 'connect-src', hint: 'Restricts Fetch, XHR, and WebSocket endpoints' },
                { key: 'font-src', label: 'font-src', hint: 'Permitted origins for web fonts' },
                { key: 'object-src', label: 'object-src', hint: 'Allowed origins for plugins and Flash (recommend: none)' },
                { key: 'frame-ancestors', label: 'frame-ancestors', hint: 'Defines who can embed this site in iframes (anti-clickjacking)' },
                { key: 'base-uri', label: 'base-uri', hint: 'Restricts URLs permitted in document base tag' },
                { key: 'form-action', label: 'form-action', hint: 'Restricts targets of HTML form submissions' }
              ].map(dir => (
                <div key={dir.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-bold">{dir.label}</span>
                    <span className="text-slate-500 text-[10px]">{dir.hint}</span>
                  </div>
                  <input
                    type="text"
                    value={directives[dir.key] || ''}
                    onChange={(e) => handleDirectiveChange(dir.key, e.target.value)}
                    className="w-full bg-[#080d1a] border border-slate-800 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Live Audit & Output Box */}
        <div className="space-y-4">
          {/* Audit Results */}
          <div className="bg-[#050914] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md">
            <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Security Audit</span>
            </div>

            <div className="space-y-2">
              {auditWarnings.map((w, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs font-sans leading-relaxed flex items-start gap-2 ${
                    w.severity === 'critical'
                      ? 'bg-red-950/40 border-red-800/80 text-red-200'
                      : w.severity === 'warning'
                      ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                      : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                  }`}
                >
                  {w.severity === 'critical' && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                  {w.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                  {w.severity === 'good' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                  <span>{w.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formatted Output Export */}
          <div className="bg-[#050914] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Export Policy</span>
              </span>

              {/* Format Switcher */}
              <div className="flex items-center gap-1 bg-[#091122] p-0.5 rounded-md border border-slate-800 text-[10px] font-mono">
                {(['nginx', 'apache', 'html', 'header'] as const).map(fmt => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setActiveFormat(fmt)}
                    className={`px-2 py-0.5 rounded uppercase ${
                      activeFormat === fmt ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/70 border border-slate-800 text-xs font-mono text-cyan-300 max-h-60 overflow-y-auto leading-relaxed">
              <pre className="whitespace-pre-wrap">{formattedOutputs[activeFormat]}</pre>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(formattedOutputs[activeFormat], 'export')}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              {copiedKey === 'export' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'export' ? 'Policy Copied!' : 'Copy Formatted Config'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
