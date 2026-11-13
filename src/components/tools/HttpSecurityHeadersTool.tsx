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
  AlertCircle,
  Globe,
  RefreshCw,
  XCircle
} from 'lucide-react';

interface HeaderCheckResult {
  header: string;
  present: boolean;
  value: string | null;
  grade: number;
  maxGrade: number;
  status: 'pass' | 'fail';
  recommendation: string;
}

interface AuditApiResponse {
  url: string;
  hostname: string;
  resolvedIp: string;
  statusCode: number;
  totalScore: number;
  letterGrade: string;
  checks: HeaderCheckResult[];
  rawHeaders: Record<string, string | undefined>;
  inspectedAt: string;
}

export const HttpSecurityHeadersTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'audit' | 'generator'>('audit');
  
  // Live Audit State
  const [auditUrl, setAuditUrl] = useState('https://yinyangyohackers.com');
  const [loading, setLoading] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [auditData, setAuditData] = useState<AuditApiResponse | null>(null);

  // Generator State
  const [targetServer, setTargetServer] = useState<'nginx' | 'apache' | 'caddy' | 'express' | 'cloudflare'>('nginx');
  const [copied, setCopied] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Header options state for generator
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

  const copyToClipboard = (text: string, isSnippet = false) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (isSnippet) {
        setCopiedSnippet(true);
        setTimeout(() => setCopiedSnippet(false), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleRunAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!auditUrl.trim()) {
      setAuditError('Please enter a target URL (e.g. https://example.com).');
      return;
    }

    setLoading(true);
    setAuditError(null);

    try {
      const resp = await fetch(`/api/inspect-headers?url=${encodeURIComponent(auditUrl.trim())}`);
      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || `HTTP ${resp.status}: Header inspection failed`);
      }

      setAuditData(data);
    } catch (err: any) {
      setAuditError(err.message || 'Failed to inspect headers. Ensure the domain is public and reachable.');
      setAuditData(null);
    } finally {
      setLoading(false);
    }
  };

  // Build Headers Object for Generator
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
        importance: 'Restricts untrusted browser device APIs',
        grade: 10
      });
    }

    return headers;
  }, [hstsEnabled, hstsSubdomains, hstsPreload, hstsMaxAge, cspPreset, xFrameOptions, xContentTypeOptions, referrerPolicy, permissionsPolicy]);

  const generatorScore = useMemo(() => {
    return generatedHeaders.reduce((sum, h) => sum + h.grade, 0);
  }, [generatedHeaders]);

  // Formatted Server Snippet
  const serverSnippet = useMemo(() => {
    if (targetServer === 'nginx') {
      return `# Nginx Hardened HTTP Security Headers
# Place inside server {} or location / {} block

add_header Strict-Transport-Security "${hstsEnabled ? `max-age=${hstsMaxAge}${hstsSubdomains ? '; includeSubDomains' : ''}${hstsPreload ? '; preload' : ''}` : ''}" always;
add_header X-Frame-Options "${xFrameOptions}" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "${referrerPolicy}" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Content-Security-Policy "${generatedHeaders.find(h => h.name === 'Content-Security-Policy')?.value || ''}" always;
${coopCorp ? 'add_header Cross-Origin-Opener-Policy "same-origin" always;\nadd_header Cross-Origin-Resource-Policy "same-origin" always;' : ''}`;
    }

    if (targetServer === 'apache') {
      return `# Apache .htaccess / httpd.conf Security Headers
<IfModule mod_headers.c>
  Header always set Strict-Transport-Security "${hstsEnabled ? `max-age=${hstsMaxAge}${hstsSubdomains ? '; includeSubDomains' : ''}${hstsPreload ? '; preload' : ''}` : ''}"
  Header always set X-Frame-Options "${xFrameOptions}"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "${referrerPolicy}"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  Header always set Content-Security-Policy "${generatedHeaders.find(h => h.name === 'Content-Security-Policy')?.value || ''}"
</IfModule>`;
    }

    if (targetServer === 'caddy') {
      return `# Caddyfile Security Headers
example.com {
    header {
        Strict-Transport-Security "${hstsEnabled ? `max-age=${hstsMaxAge}${hstsSubdomains ? '; includeSubDomains' : ''}${hstsPreload ? '; preload' : ''}` : ''}"
        X-Frame-Options "${xFrameOptions}"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "${referrerPolicy}"
        Permissions-Policy "camera=(), microphone=(), geolocation=()"
        Content-Security-Policy "${generatedHeaders.find(h => h.name === 'Content-Security-Policy')?.value || ''}"
    }
}`;
    }

    if (targetServer === 'express') {
      return `// Express.js Middleware (using helmet or native headers)
const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', '${hstsEnabled ? `max-age=${hstsMaxAge}${hstsSubdomains ? '; includeSubDomains' : ''}${hstsPreload ? '; preload' : ''}` : ''}');
  res.setHeader('X-Frame-Options', '${xFrameOptions}');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', '${referrerPolicy}');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', "${generatedHeaders.find(h => h.name === 'Content-Security-Policy')?.value || ''}");
  next();
});`;
    }

    return `# Cloudflare Transform Rules (HTTP Response Headers)
Strict-Transport-Security: "${hstsEnabled ? `max-age=${hstsMaxAge}${hstsSubdomains ? '; includeSubDomains' : ''}${hstsPreload ? '; preload' : ''}` : ''}"
X-Frame-Options: "${xFrameOptions}"
X-Content-Type-Options: "nosniff"
Referrer-Policy: "${referrerPolicy}"
Permissions-Policy: "camera=(), microphone=(), geolocation=()"`;
  }, [targetServer, hstsEnabled, hstsMaxAge, hstsSubdomains, hstsPreload, xFrameOptions, referrerPolicy, generatedHeaders, coopCorp]);

  return (
    <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl text-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-cyan-400">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
              HTTP Security Headers Inspector &amp; Generator
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Live header verification with automated scoring and hardened web server deployment rules
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Site Audit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'generator'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Config Generator
          </button>
        </div>
      </div>

      {/* Mode 1: Live Site Audit */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <form onSubmit={handleRunAudit} className="space-y-3">
            <label className="block text-xs font-mono font-medium text-slate-300">
              Target URL to Inspect (HTTP/HTTPS)
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={auditUrl}
                  onChange={(e) => setAuditUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-[#050811] border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-sm font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
                />
                <Globe className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 min-h-[44px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Auditing Headers...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Run Header Audit</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Audit Error */}
          {auditError && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs font-mono flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-rose-200">Header Inspection Error</div>
                <p className="mt-0.5 text-slate-300">{auditError}</p>
              </div>
            </div>
          )}

          {!auditData && !loading && !auditError && (
            <div className="p-8 text-center bg-[#070b16] border border-slate-800/80 rounded-xl space-y-3">
              <Layers className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300 font-mono">Live HTTP Header Audit Engine</h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Performs a secure HTTP HEAD probe to evaluate Content-Security-Policy, HSTS, X-Frame-Options, Referrer-Policy, and Permissions-Policy with verified grades.
              </p>
              <button
                type="button"
                onClick={() => handleRunAudit()}
                className="mt-2 text-xs font-mono px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition cursor-pointer"
              >
                Audit {auditUrl}
              </button>
            </div>
          )}

          {auditData && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Score & Grade Overview */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-[#050811] border border-slate-800 rounded-xl">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-xs font-mono text-slate-400">Inspected Target:</div>
                  <div className="text-sm sm:text-base font-bold font-mono text-white truncate max-w-md">
                    {auditData.url}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    HTTP Status: <span className="text-emerald-400 font-bold">{auditData.statusCode}</span> &bull; IP: {auditData.resolvedIp}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[11px] font-mono text-slate-400">Security Score</div>
                    <div className="text-2xl font-bold font-mono text-emerald-400">
                      {auditData.totalScore} / 100
                    </div>
                  </div>
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-mono font-black border ${
                    auditData.letterGrade.startsWith('A')
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-600'
                      : auditData.letterGrade === 'B'
                        ? 'bg-cyan-950 text-cyan-400 border-cyan-600'
                        : 'bg-rose-950 text-rose-400 border-rose-600'
                  }`}>
                    {auditData.letterGrade}
                  </div>
                </div>
              </div>

              {/* Checks Breakdown */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Individual Header Verification &amp; Recommendations</span>
                </div>

                <div className="space-y-2.5">
                  {auditData.checks.map((c) => (
                    <div
                      key={c.header}
                      className={`p-3.5 rounded-xl border font-mono text-xs space-y-1.5 ${
                        c.present
                          ? 'bg-[#050811] border-emerald-900/40 text-slate-200'
                          : 'bg-[#0a0505] border-rose-950/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold">
                          {c.present ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          )}
                          <span className={c.present ? 'text-white' : 'text-rose-300'}>
                            {c.header}
                          </span>
                        </div>
                        <span className={`text-[11px] px-2 py-0.5 rounded ${
                          c.present ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {c.grade} / {c.maxGrade} pts
                        </span>
                      </div>

                      {c.value ? (
                        <div className="p-2 rounded bg-black/60 border border-slate-800 text-[11px] text-cyan-300 overflow-x-auto select-all">
                          {c.value}
                        </div>
                      ) : (
                        <p className="text-[11px] text-rose-400/90 font-sans">
                          Header missing. {c.recommendation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Config Generator */}
      {activeTab === 'generator' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Preset Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* HSTS Box */}
            <div className="bg-[#050811] border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  HSTS (Strict-Transport-Security)
                </span>
                <input
                  type="checkbox"
                  checked={hstsEnabled}
                  onChange={(e) => setHstsEnabled(e.target.checked)}
                  className="accent-emerald-400 cursor-pointer w-4 h-4"
                />
              </div>
              <div className="text-xs font-mono text-slate-400 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    disabled={!hstsEnabled}
                    checked={hstsSubdomains}
                    onChange={(e) => setHstsSubdomains(e.target.checked)}
                    className="accent-emerald-400 cursor-pointer"
                  />
                  <span>includeSubDomains</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    disabled={!hstsEnabled}
                    checked={hstsPreload}
                    onChange={(e) => setHstsPreload(e.target.checked)}
                    className="accent-emerald-400 cursor-pointer"
                  />
                  <span>HSTS Preload List Submission</span>
                </div>
              </div>
            </div>

            {/* CSP Box */}
            <div className="bg-[#050811] border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Content Security Policy (CSP)
              </span>
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400">Strictness Preset:</label>
                <select
                  value={cspPreset}
                  onChange={(e) => setCspPreset(e.target.value as any)}
                  className="w-full bg-[#02050c] border border-slate-700 rounded-lg p-2 text-xs font-mono text-cyan-300"
                >
                  <option value="strict">Strict (Zero inline scripts, no untrusted CDNs)</option>
                  <option value="balanced">Balanced (Allows standard Google Fonts &amp; CDNs)</option>
                  <option value="relaxed">Relaxed (Permissive https sources)</option>
                </select>
              </div>
            </div>

            {/* Framing & MIME */}
            <div className="bg-[#050811] border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Clickjacking &amp; MIME Protection
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">X-Frame-Options</label>
                  <select
                    value={xFrameOptions}
                    onChange={(e) => setXFrameOptions(e.target.value as any)}
                    className="w-full bg-[#02050c] border border-slate-700 rounded-lg p-2 text-xs font-mono text-cyan-300"
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
                      className="accent-emerald-400"
                    />
                    <span>nosniff</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Privacy & Cross-Origin */}
            <div className="bg-[#050811] border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Hardware Privacy &amp; Spectre Isolation
              </span>
              <div className="text-xs font-mono text-slate-400 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissionsPolicy}
                    onChange={(e) => setPermissionsPolicy(e.target.checked)}
                    className="accent-emerald-400"
                  />
                  <span>Permissions-Policy (Block Camera, Mic, Geo, USB)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={coopCorp}
                    onChange={(e) => setCoopCorp(e.target.checked)}
                    className="accent-emerald-400"
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
                <span>Hardened Server Configuration Export</span>
              </div>

              {/* Server Platform selector */}
              <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
                {(['nginx', 'apache', 'caddy', 'express', 'cloudflare'] as const).map(srv => (
                  <button
                    key={srv}
                    type="button"
                    onClick={() => setTargetServer(srv)}
                    className={`px-2.5 py-1 text-xs font-mono rounded capitalize transition cursor-pointer ${
                      targetServer === srv
                        ? 'bg-emerald-950 text-emerald-300 font-semibold border border-emerald-700/60'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {srv}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <pre className="w-full bg-[#02050c] border border-slate-800 rounded-xl p-4 text-xs font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap">
                {serverSnippet}
              </pre>
              <button
                type="button"
                onClick={() => copyToClipboard(serverSnippet, true)}
                className="absolute top-3 right-3 text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedSnippet ? (
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
      )}

      {/* Footer info */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px] font-mono text-slate-500">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>
          Educational security evaluation utility. Probes public HTTP response headers non-invasively with strict SSRF defense. Does not constitute a regulatory compliance certification.
        </span>
      </div>
    </div>
  );
};
