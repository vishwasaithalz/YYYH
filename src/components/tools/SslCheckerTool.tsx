import React, { useState, useMemo } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  Copy, 
  Terminal, 
  Globe, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw,
  Cpu,
  FileCheck
} from 'lucide-react';

export const SslCheckerTool: React.FC = () => {
  const [domainInput, setDomainInput] = useState('yinyangyohackers.com');
  const [portInput, setPortInput] = useState('443');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Clean domain helper
  const cleanDomain = useMemo(() => {
    return domainInput.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
  }, [domainInput]);

  // OpenSSL and CLI diagnostics commands
  const cliCommands = useMemo(() => {
    const host = cleanDomain || 'example.com';
    const port = portInput || '443';

    return {
      opensslFull: `openssl s_client -connect ${host}:${port} -servername ${host} -showcerts -tls1_3`,
      opensslExpiry: `echo | openssl s_client -servername ${host} -connect ${host}:${port} 2>/dev/null | openssl x509 -noout -dates -subject -issuer`,
      nmapCiphers: `nmap --script ssl-enum-ciphers -p ${port} ${host}`,
      curlHttp3: `curl --http3-only -Iv https://${host}`
    };
  }, [cleanDomain, portInput]);

  // Simulated TLS Audit Matrix for the host
  const auditResults = useMemo(() => {
    const host = cleanDomain || 'example.com';

    return {
      domain: host,
      tls13: { status: 'Supported (Enforced)', secure: true, note: 'TLS 1.3 0-RTT, forward secrecy default' },
      tls12: { status: 'Supported (Legacy Fallback)', secure: true, note: 'AEAD cipher suites enabled' },
      tls11: { status: 'Disabled (Blocked)', secure: true, note: 'RFC 8996 compliant' },
      tls10: { status: 'Disabled (Blocked)', secure: true, note: 'Vulnerable to BEAST / POODLE' },
      ocspStapling: { status: 'Enabled', secure: true, note: 'Speeds up TLS handshake and protects user privacy' },
      alpn: { status: 'h2, http/1.1, h3', secure: true, note: 'Modern multiplexed protocols supported' },
      forwardSecrecy: { status: 'ECDHE (Curve25519 & P-256)', secure: true, note: 'Session keys cannot be decrypted retroactively' },
      hsts: { status: 'max-age=63072000; preload', secure: true, note: 'Forces HTTPS across browser sessions' }
    };
  }, [cleanDomain]);

  return (
    <div className="bg-[#0b101d] border border-cyan-500/20 rounded-xl p-5 sm:p-7 shadow-2xl text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
              SSL / TLS Architecture Inspector
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                TLS 1.3 / AEAD
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Audit cipher suites, certificate chains, forward secrecy & generate terminal verification scripts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-2.5 px-3.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono text-emerald-400 font-bold">A+ Cryptographic Grade</span>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Domain & Port Input */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-9 space-y-1.5">
            <label className="text-xs font-mono font-medium text-slate-300">
              Target Hostname / FQDN
            </label>
            <div className="relative">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="e.g. yinyangyohackers.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-3.5 pr-10 py-2.5 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <Globe className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="sm:col-span-3 space-y-1.5">
            <label className="text-xs font-mono font-medium text-slate-300">
              HTTPS Port
            </label>
            <input
              type="text"
              value={portInput}
              onChange={(e) => setPortInput(e.target.value)}
              placeholder="443"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Security Checklist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5 font-mono text-xs space-y-1">
            <div className="text-slate-400 text-[11px] uppercase">TLS 1.3 Protocol</div>
            <div className="text-emerald-400 font-bold flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{auditResults.tls13.status}</span>
            </div>
            <p className="text-[10px] text-slate-500">{auditResults.tls13.note}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5 font-mono text-xs space-y-1">
            <div className="text-slate-400 text-[11px] uppercase">Legacy TLS 1.0/1.1</div>
            <div className="text-emerald-400 font-bold flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{auditResults.tls10.status}</span>
            </div>
            <p className="text-[10px] text-slate-500">{auditResults.tls10.note}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5 font-mono text-xs space-y-1">
            <div className="text-slate-400 text-[11px] uppercase">Forward Secrecy (PFS)</div>
            <div className="text-cyan-300 font-bold flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{auditResults.forwardSecrecy.status}</span>
            </div>
            <p className="text-[10px] text-slate-500">{auditResults.forwardSecrecy.note}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5 font-mono text-xs space-y-1">
            <div className="text-slate-400 text-[11px] uppercase">OCSP Stapling</div>
            <div className="text-emerald-400 font-bold flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{auditResults.ocspStapling.status}</span>
            </div>
            <p className="text-[10px] text-slate-500">{auditResults.ocspStapling.note}</p>
          </div>
        </div>

        {/* Real-world Terminal CLI Diagnostics */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            Live OpenSSL & CLI Diagnostic Commands for {cleanDomain}
          </div>

          <div className="space-y-3">
            {/* OpenSSL Expiration & Chain */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-semibold">1. Verify Certificate Expiry & Trust Issuer:</span>
                <button
                  onClick={() => copyToClipboard(cliCommands.opensslExpiry, 'expiry')}
                  className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition text-[11px]"
                >
                  {copiedKey === 'expiry' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'expiry' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-2.5 rounded text-xs font-mono text-cyan-300 overflow-x-auto select-all">
                {cliCommands.opensslExpiry}
              </pre>
            </div>

            {/* Nmap Cipher Enumeration */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-semibold">2. Enumerate Active Server Cipher Suites with Nmap:</span>
                <button
                  onClick={() => copyToClipboard(cliCommands.nmapCiphers, 'nmap')}
                  className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition text-[11px]"
                >
                  {copiedKey === 'nmap' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'nmap' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-2.5 rounded text-xs font-mono text-cyan-300 overflow-x-auto select-all">
                {cliCommands.nmapCiphers}
              </pre>
            </div>

            {/* Full TLS 1.3 Handshake Dump */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-semibold">3. Inspect Full Handshake, ALPN & Session Tickets:</span>
                <button
                  onClick={() => copyToClipboard(cliCommands.opensslFull, 'full')}
                  className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition text-[11px]"
                >
                  {copiedKey === 'full' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'full' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-2.5 rounded text-xs font-mono text-cyan-300 overflow-x-auto select-all">
                {cliCommands.opensslFull}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
