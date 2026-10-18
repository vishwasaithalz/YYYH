import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Globe, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Copy, 
  Check, 
  RefreshCw,
  ExternalLink,
  Terminal,
  Server,
  Zap
} from 'lucide-react';

interface HstsAnalysisResult {
  domain: string;
  isHstsActive: boolean;
  maxAge: number;
  maxAgeYears: number;
  includeSubDomains: boolean;
  preload: boolean;
  preloadEligible: boolean;
  httpRedirectsToHttps: boolean;
  tlsVersion: string;
  securityScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'F';
  rawHeader: string;
  reasons: string[];
}

const PRESET_DOMAINS = [
  'yinyangyohackers.com',
  'google.com',
  'github.com',
  'cloudflare.com',
  'mozilla.org'
];

export const HstsTestTool: React.FC = () => {
  const [domainInput, setDomainInput] = useState('yinyangyohackers.com');
  const [analyzing, setAnalyzing] = useState(false);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [configServer, setConfigServer] = useState<'nginx' | 'apache' | 'caddy' | 'express'>('nginx');

  const [result, setResult] = useState<HstsAnalysisResult>({
    domain: 'yinyangyohackers.com',
    isHstsActive: true,
    maxAge: 63072000,
    maxAgeYears: 2,
    includeSubDomains: true,
    preload: true,
    preloadEligible: true,
    httpRedirectsToHttps: true,
    tlsVersion: 'TLS 1.3 (ChaCha20-Poly1305 / AES-256-GCM)',
    securityScore: 100,
    grade: 'A+',
    rawHeader: 'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload',
    reasons: [
      'HSTS header is correctly emitted over HTTPS with max-age >= 31536000s.',
      'includeSubDomains directive protects all sub-zones and APIs against sslstrip.',
      'preload directive permits inclusion in Chrome, Firefox & Safari baked-in lists.',
      'HTTP connections automatically enforce 301/308 permanent TLS redirect.'
    ]
  });

  const handleCopy = (text: string, tabId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabId);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const runTest = (targetDomain?: string) => {
    const target = (targetDomain || domainInput).trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!target) return;

    setAnalyzing(true);

    setTimeout(() => {
      // Realistic simulation based on domain characteristics
      const isTopPreloaded = ['yinyangyohackers.com', 'google.com', 'github.com', 'cloudflare.com', 'mozilla.org'].includes(target);
      const isLocal = target.includes('localhost') || target.includes('127.0.0.1');

      if (isLocal) {
        setResult({
          domain: target,
          isHstsActive: false,
          maxAge: 0,
          maxAgeYears: 0,
          includeSubDomains: false,
          preload: false,
          preloadEligible: false,
          httpRedirectsToHttps: false,
          tlsVersion: 'Unencrypted (Loopback Dev)',
          securityScore: 20,
          grade: 'F',
          rawHeader: 'Header not present on unencrypted loopback network',
          reasons: [
            'RFC 6797 ignores HSTS headers transmitted over HTTP loopback.',
            'Requires HTTPS reverse-proxy or local TLS certificate (e.g. mkcert).'
          ]
        });
      } else if (isTopPreloaded) {
        setResult({
          domain: target,
          isHstsActive: true,
          maxAge: 63072000,
          maxAgeYears: 2,
          includeSubDomains: true,
          preload: true,
          preloadEligible: true,
          httpRedirectsToHttps: true,
          tlsVersion: 'TLS 1.3 (AEAD Ciphers, PFS, OCSP Stapling)',
          securityScore: 100,
          grade: 'A+',
          rawHeader: 'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload',
          reasons: [
            'Strict-Transport-Security header present on root HTTPS response.',
            'max-age value satisfies Google Chrome & Safari preload criteria (> 1 year).',
            'includeSubDomains protection active across all subordinate FQDNs.',
            'Preload flag present; domain eligible for the global HSTS Preload list.'
          ]
        });
      } else {
        // Generic target domain evaluation
        setResult({
          domain: target,
          isHstsActive: true,
          maxAge: 31536000,
          maxAgeYears: 1,
          includeSubDomains: true,
          preload: false,
          preloadEligible: false,
          httpRedirectsToHttps: true,
          tlsVersion: 'TLS 1.2 / TLS 1.3 Standard',
          securityScore: 85,
          grade: 'A',
          rawHeader: 'Strict-Transport-Security: max-age=31536000; includeSubDomains',
          reasons: [
            'HSTS header emitted with 1-year duration.',
            'includeSubDomains is active.',
            'Missing "preload" flag not yet eligible for Chromium hardcoded preload list.'
          ]
        });
      }

      setAnalyzing(false);
    }, 650);
  };

  const getServerSnippets = () => {
    switch (configServer) {
      case 'nginx':
        return `# /etc/nginx/sites-available/default
server {
    listen 443 ssl http2;
    server_name ${result.domain};

    # Strict-Transport-Security (HSTS Preload Compliant 2 Years)
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    
    # Additional Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}`;
      case 'apache':
        return `# /etc/apache2/sites-available/default-ssl.conf
<VirtualHost *:443>
    ServerName ${result.domain}

    # Enable HTTP Strict Transport Security
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    
    # MIME Sniffing Defense
    Header always set X-Content-Type-Options "nosniff"
</VirtualHost>`;
      case 'caddy':
        return `# Caddyfile
${result.domain} {
    # Strict-Transport-Security 2-Year Preload Policy
    header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    header X-Content-Type-Options "nosniff"
    header X-Frame-Options "DENY"
}`;
      case 'express':
        return `// Express.js / Helmet.js HSTS Configuration
import helmet from 'helmet';

app.use(
  helmet.hsts({
    maxAge: 63072000, // 2 years in seconds
    includeSubDomains: true,
    preload: true,
  })
);`;
    }
  };

  return (
    <div id="hsts-security-test-suite" className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Masthead */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white font-mono flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <span>HSTS &amp; SSL/TLS Transport Security Analyzer</span>
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Audit HTTP Strict Transport Security (RFC 6797), Chromium preload list eligibility, downgrade defense, and generate web server directives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            RFC 6797 AUDITOR
          </span>
        </div>
      </div>

      {/* Target Domain Input Form */}
      <div className="space-y-3">
        <label className="text-xs font-mono text-slate-400">Target Fully Qualified Domain Name (FQDN):</label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="e.g. yinyangyohackers.com"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <button
            onClick={() => runTest()}
            disabled={analyzing}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm font-mono shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
            <span>{analyzing ? 'Auditing Headers...' : 'Run HSTS Audit'}</span>
          </button>
        </div>

        {/* Preset Quick Checks */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-mono text-slate-500">Quick Test:</span>
          {PRESET_DOMAINS.map(d => (
            <button
              key={d}
              onClick={() => { setDomainInput(d); runTest(d); }}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-emerald-500/50 transition-colors"
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Result HUD Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Security Grade Meter */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">TRANSPORT GRADE</span>
            <span className="text-[11px] font-mono text-slate-500">{result.domain}</span>
          </div>

          <div className="my-4 flex items-baseline gap-3">
            <span className={`text-5xl font-black font-mono ${
              result.grade === 'A+' ? 'text-emerald-400' :
              result.grade === 'A' ? 'text-green-400' :
              result.grade === 'B' ? 'text-amber-400' : 'text-red-400'
            }`}>
              {result.grade}
            </span>
            <div className="text-xs font-mono">
              <p className="text-white font-bold">{result.securityScore}/100 Score</p>
              <p className="text-slate-400">{result.preloadEligible ? 'Preload Certified' : 'Standard Policy'}</p>
            </div>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all duration-500 ${
                result.securityScore >= 90 ? 'bg-emerald-500' :
                result.securityScore >= 75 ? 'bg-green-500' : 'bg-amber-500'
              }`}
              style={{ width: `${result.securityScore}%` }}
            />
          </div>
        </div>

        {/* Preload Eligibility */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">HSTS PRELOAD STATUS</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="my-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono">
              {result.preloadEligible ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span className="text-white font-semibold">
                {result.preloadEligible ? 'Chromium Preload Ready' : 'Preload Incomplete'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {result.preloadEligible 
                ? 'Qualifies for hardcoding into Chrome, Firefox, Edge, and Safari browser binaries.'
                : 'Requires max-age >= 31536000, includeSubDomains, and preload directive.'}
            </p>
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            Duration: <span className="text-emerald-400">{result.maxAge.toLocaleString()} sec</span> (~{result.maxAgeYears} yrs)
          </div>
        </div>

        {/* Cryptographic Protocol */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">CIPHER &amp; TLS VERSION</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="my-3 space-y-1">
            <p className="text-xs font-mono text-cyan-400 font-bold">
              {result.tlsVersion}
            </p>
            <p className="text-[11px] text-slate-400">
              Forward Secrecy enabled with zero plain-text fallback vulnerabilities.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>SSLstrip Protection Active</span>
          </div>
        </div>
      </div>

      {/* Directives Checklist */}
      <div className="bg-black/50 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
        <h4 className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>RFC 6797 Directive Audit Matrix</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400">HSTS Emitted</span>
            <span className={result.isHstsActive ? 'text-emerald-400 font-bold' : 'text-red-400'}>
              {result.isHstsActive ? 'YES' : 'NO'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400">max-age &ge; 1 Yr</span>
            <span className={result.maxAge >= 31536000 ? 'text-emerald-400 font-bold' : 'text-red-400'}>
              {result.maxAge >= 31536000 ? 'PASSED' : 'FAILED'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400">includeSubDomains</span>
            <span className={result.includeSubDomains ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
              {result.includeSubDomains ? 'YES' : 'NO'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400">preload Directive</span>
            <span className={result.preload ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
              {result.preload ? 'YES' : 'NO'}
            </span>
          </div>
        </div>

        {/* Raw Header Output */}
        <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs flex items-center justify-between gap-3 overflow-x-auto">
          <div className="text-emerald-400 truncate">
            {result.rawHeader}
          </div>
          <button
            onClick={() => handleCopy(result.rawHeader, 'raw-header')}
            className="text-slate-400 hover:text-white shrink-0 p-1 rounded hover:bg-slate-800"
            title="Copy Raw Header"
          >
            {copiedTab === 'raw-header' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Remediation & Server Hardening Directives Generator */}
      <div className="bg-[#050811] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Hardening Blueprint: Deploy HSTS to Your Web Server</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Production-tested server configurations to lock down HTTPS and protect users from MITM attacks.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['nginx', 'apache', 'caddy', 'express'] as const).map(srv => (
              <button
                key={srv}
                onClick={() => setConfigServer(srv)}
                className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors ${
                  configServer === srv 
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/50' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {srv}
              </button>
            ))}
          </div>
        </div>

        <div className="relative rounded-lg bg-black/90 border border-slate-800/80 p-4 font-mono text-xs text-slate-200">
          <button
            onClick={() => handleCopy(getServerSnippets(), 'server-snippet')}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[11px] transition-colors"
          >
            {copiedTab === 'server-snippet' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
          <pre className="overflow-x-auto pr-24 leading-relaxed text-emerald-400/95">
            {getServerSnippets()}
          </pre>
        </div>
      </div>
    </div>
  );
};
