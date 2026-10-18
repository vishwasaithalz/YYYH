import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Copy, 
  Check, 
  Server, 
  Code, 
  Terminal, 
  Layers, 
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const HttpSecurityHeadersTool: React.FC = () => {
  const [targetServer, setTargetServer] = useState<'nginx' | 'apache' | 'caddy' | 'express' | 'cloudflare'>('nginx');
  const [copied, setCopied] = useState(false);

  // Header options state
  const [hstsEnabled, setHstsEnabled] = useState(true);
  const [hstsSubdomains, setHstsSubdomains] = useState(true);
  const [hstsPreload, setHstsPreload] = useState(true);
  const [hstsMaxAge, setHstsMaxAge] = useState(63072000); // 2 years

  const [cspPreset, setCspPreset] = useState<'strict' | 'balanced' | 'relaxed'>('strict');
  const [xFrameOptions, setXFrameOptions] = useState<'DENY' | 'SAMEORIGIN'>('DENY');
  const [xContentTypeOptions, setXContentTypeOptions] = useState(true);
  const [referrerPolicy, setReferrerPolicy] = useState('strict-origin-when-cross-origin');
  const [permissionsPolicy, setPermissionsPolicy] = useState(true);
  const [coopCorp, setCoopCorp] = useState(true);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Build Headers Object
  const generatedHeaders = useMemo(() => {
    const headers: { name: string; value: string; importance: string; grade: number }[] = [];

    // 1. HSTS
    if (hstsEnabled) {
      let val = `max-age=${hstsMaxAge}`;
      if (hstsSubdomains) val += '; includeSubDomains';
      if (hstsPreload) val += '; preload';
      headers.push({
        name: 'Strict-Transport-Security',
        value: val,
        importance: 'Mandatory for SSL/TLS enforcement',
        grade: 25
      });
    }

    // 2. CSP
    let cspVal = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';";
    if (cspPreset === 'balanced') {
      cspVal = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; object-src 'none'; frame-ancestors 'self';";
    } else if (cspPreset === 'relaxed') {
      cspVal = "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; object-src 'none';";
    }
    headers.push({
      name: 'Content-Security-Policy',
      value: cspVal,
      importance: 'Mitigates Cross-Site Scripting (XSS) and data injection',
      grade: 30
    });

    // 3. X-Frame-Options
    headers.push({
      name: 'X-Frame-Options',
      value: xFrameOptions,
      importance: 'Prevents Clickjacking attacks by forbidding iframe embedding',
      grade: 15
    });

    // 4. X-Content-Type-Options
    if (xContentTypeOptions) {
      headers.push({
        name: 'X-Content-Type-Options',
        value: 'nosniff',
        importance: 'Prevents MIME-sniffing drive-by downloads',
        grade: 10
      });
    }

    // 5. Referrer-Policy
    headers.push({
      name: 'Referrer-Policy',
      value: referrerPolicy,
      importance: 'Protects user privacy by trimming referrer telemetry',
      grade: 10
    });

    // 6. Permissions-Policy
    if (permissionsPolicy) {
      headers.push({
        name: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
        importance: 'Restricts sensitive hardware browser APIs',
        grade: 5
      });
    }

    // 7. COOP / CORP
    if (coopCorp) {
      headers.push({
        name: 'Cross-Origin-Opener-Policy',
        value: 'same-origin',
        importance: 'Isolates browsing context to defend against Spectre-style attacks',
        grade: 2.5
      });
      headers.push({
        name: 'Cross-Origin-Resource-Policy',
        value: 'same-origin',
        importance: 'Prevents unauthorized cross-origin reading of static assets',
        grade: 2.5
      });
    }

    // Total Score
    const totalScore = headers.reduce((acc, h) => acc + h.grade, 0);
    let gradeLabel = 'A+';
    let gradeColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (totalScore < 60) {
      gradeLabel = 'C';
      gradeColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    } else if (totalScore < 85) {
      gradeLabel = 'B';
      gradeColor = 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    } else if (totalScore < 95) {
      gradeLabel = 'A';
      gradeColor = 'text-teal-400 border-teal-500/30 bg-teal-500/10';
    }

    return { headers, totalScore, gradeLabel, gradeColor };
  }, [hstsEnabled, hstsSubdomains, hstsPreload, hstsMaxAge, cspPreset, xFrameOptions, xContentTypeOptions, referrerPolicy, permissionsPolicy, coopCorp]);

  // Code generator snippet for selected server
  const serverSnippet = useMemo(() => {
    const list = generatedHeaders.headers;

    switch (targetServer) {
      case 'nginx':
        return `# Add inside server { ... } or location / { ... } block in nginx.conf
${list.map(h => `add_header ${h.name} "${h.value}" always;`).join('\n')}`;

      case 'apache':
        return `# Add inside <VirtualHost *:443> or .htaccess in Apache
<IfModule mod_headers.c>
${list.map(h => `  Header always set ${h.name} "${h.value}"`).join('\n')}
</IfModule>`;

      case 'caddy':
        return `# Add inside your Caddyfile site block
example.com {
    header {
${list.map(h => `        ${h.name} "${h.value}"`).join('\n')}
    }
}`;

      case 'express':
        return `// Using Express.js & Helmet or custom middleware
const express = require('express');
const app = express();

app.use((req, res, next) => {
${list.map(h => `  res.setHeader('${h.name}', '${h.value}');`).join('\n')}
  next();
});`;

      case 'cloudflare':
        return `// Cloudflare Workers Security Header Middleware
export default {
  async fetch(request, env) {
    const response = await fetch(request);
    const newHeaders = new Headers(response.headers);
${list.map(h => `    newHeaders.set('${h.name}', '${h.value}');`).join('\n')}
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
};`;

      default:
        return '';
    }
  }, [generatedHeaders, targetServer]);

  return (
    <div className="bg-[#0b101d] border border-cyan-500/20 rounded-xl p-5 sm:p-7 shadow-2xl text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
              HTTP Security Headers Engine
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                OWASP Secure Headers
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Configure, evaluate and export battle-tested defense-in-depth web server headers
            </p>
          </div>
        </div>

        {/* Live Score Badge */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-lg p-2.5 px-3.5">
          <div className="text-xs font-mono text-slate-400">Security Rating:</div>
          <span className={`text-sm font-mono font-bold px-2.5 py-0.5 rounded border ${generatedHeaders.gradeColor}`}>
            Grade {generatedHeaders.gradeLabel} ({generatedHeaders.totalScore}%)
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Configuration Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* HSTS Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                HSTS (Strict-Transport-Security)
              </span>
              <input
                type="checkbox"
                checked={hstsEnabled}
                onChange={(e) => setHstsEnabled(e.target.checked)}
                className="accent-cyan-400 cursor-pointer"
              />
            </div>
            <div className="text-xs font-mono text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  disabled={!hstsEnabled}
                  checked={hstsSubdomains}
                  onChange={(e) => setHstsSubdomains(e.target.checked)}
                  className="accent-cyan-400 cursor-pointer"
                />
                <span>Include Subdomains (includeSubDomains)</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  disabled={!hstsEnabled}
                  checked={hstsPreload}
                  onChange={(e) => setHstsPreload(e.target.checked)}
                  className="accent-cyan-400 cursor-pointer"
                />
                <span>HSTS Preload List (Chrome/Firefox/Safari)</span>
              </div>
            </div>
          </div>

          {/* CSP Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Content Security Policy (CSP)
              </span>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400">Policy Strictness Preset:</label>
              <select
                value={cspPreset}
                onChange={(e) => setCspPreset(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-xs font-mono text-cyan-300"
              >
                <option value="strict">Strict (Zero inline scripts, no untrusted CDNs)</option>
                <option value="balanced">Balanced (Allows standard Google Fonts & CDNs)</option>
                <option value="relaxed">Relaxed (Permissive https sources)</option>
              </select>
            </div>
          </div>

          {/* Framing & Sniffing */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              Frame & MIME Protection
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">X-Frame-Options</label>
                <select
                  value={xFrameOptions}
                  onChange={(e) => setXFrameOptions(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-xs font-mono text-cyan-300"
                >
                  <option value="DENY">DENY (Clickjacking safe)</option>
                  <option value="SAMEORIGIN">SAMEORIGIN</option>
                </select>
              </div>
              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 cursor-pointer pb-2">
                  <input
                    type="checkbox"
                    checked={xContentTypeOptions}
                    onChange={(e) => setXContentTypeOptions(e.target.checked)}
                    className="accent-cyan-400"
                  />
                  <span>nosniff</span>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy & Cross-Origin Isolation */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              Privacy & Hardware Isolation
            </div>
            <div className="text-xs font-mono text-slate-400 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissionsPolicy}
                  onChange={(e) => setPermissionsPolicy(e.target.checked)}
                  className="accent-cyan-400"
                />
                <span>Permissions-Policy (Block Camera, Mic, Geo, USB)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={coopCorp}
                  onChange={(e) => setCoopCorp(e.target.checked)}
                  className="accent-cyan-400"
                />
                <span>COOP / CORP (Cross-Origin Spectre Isolation)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Server Snippet Generator */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Server Configuration Export
            </div>

            {/* Server Platform selector */}
            <div className="flex items-center p-1 bg-slate-900 border border-slate-700/60 rounded-lg overflow-x-auto">
              {(['nginx', 'apache', 'caddy', 'express', 'cloudflare'] as const).map(srv => (
                <button
                  key={srv}
                  onClick={() => setTargetServer(srv)}
                  className={`px-2.5 py-1 text-xs font-mono rounded capitalize transition ${
                    targetServer === srv
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {srv}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <pre className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap">
              {serverSnippet}
            </pre>
            <button
              onClick={() => copyToClipboard(serverSnippet)}
              className="absolute top-3 right-3 text-xs font-mono px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 flex items-center gap-1.5 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Config</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
