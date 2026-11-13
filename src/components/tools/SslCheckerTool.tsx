import React, { useState } from 'react';
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
  Clock,
  Key,
  Shield,
  Layers,
  Info
} from 'lucide-react';

interface TlsInspectionData {
  host: string;
  resolvedIp: string;
  protocol: string;
  cipher: {
    name: string;
    standardName: string;
    version: string;
  };
  certificate: {
    subject: {
      commonName: string;
      organization: string;
      country: string;
    };
    issuer: {
      commonName: string;
      organization: string;
      country: string;
    };
    validFrom: string | null;
    validTo: string | null;
    daysRemaining: number;
    isExpired: boolean;
    serialNumber: string;
    fingerprint256: string;
    subjectAlternativeNames: string[];
  };
  validation: {
    authorized: boolean;
    authorizationError: string | null;
  };
  inspectedAt: string;
}

export const SslCheckerTool: React.FC = () => {
  const [domainInput, setDomainInput] = useState('yinyangyohackers.com');
  const [activeTab, setActiveTab] = useState<'live' | 'playbook'>('live');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tlsData, setTlsData] = useState<TlsInspectionData | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const cleanDomain = domainInput
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .replace(/:\d+$/, '')
    .trim()
    .toLowerCase();

  const handleInspect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cleanDomain) {
      setError('Please provide a valid hostname (e.g. example.com).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resp = await fetch(`/api/inspect-tls?host=${encodeURIComponent(cleanDomain)}`);
      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || `HTTP ${resp.status}: Inspection failed`);
      }

      setTlsData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to inspect TLS certificate. Verify the hostname is reachable.');
      setTlsData(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const hostForCommands = cleanDomain || 'example.com';
  const cliCommands = {
    opensslExpiry: `echo | openssl s_client -servername ${hostForCommands} -connect ${hostForCommands}:443 2>/dev/null | openssl x509 -noout -dates -subject -issuer`,
    opensslFull: `openssl s_client -connect ${hostForCommands}:443 -servername ${hostForCommands} -showcerts -tls1_3`,
    nmapCiphers: `nmap --script ssl-enum-ciphers -p 443 ${hostForCommands}`,
    curlHttp3: `curl --http3-only -Iv https://${hostForCommands}`
  };

  return (
    <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl text-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-cyan-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
              SSL / TLS Architecture Inspector
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Live peer certificate validation, cipher negotiation &amp; reproducible terminal diagnostics
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('live')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'live'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Handshake Inspector
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('playbook')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'playbook'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Terminal Playbook
          </button>
        </div>
      </div>

      {/* Target Host Form */}
      <form onSubmit={handleInspect} className="space-y-3">
        <label className="block text-xs font-mono font-medium text-slate-300">
          Target Hostname (Public FQDN)
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="e.g. yinyangyohackers.com, github.com, cloudflare.com"
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
                <span>Negotiating TLS...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Inspect Certificate</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs font-mono flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-rose-200">Handshake Inspection Failed</div>
            <p className="mt-0.5 text-slate-300">{error}</p>
          </div>
        </div>
      )}

      {/* Mode 1: Live Handshake Inspector */}
      {activeTab === 'live' && (
        <div className="space-y-4">
          {!tlsData && !loading && !error && (
            <div className="p-8 text-center bg-[#070b16] border border-slate-800/80 rounded-xl space-y-3">
              <Shield className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300 font-mono">Real-Time TLS Verification Engine</h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Connects directly to public port 443 with SNI to retrieve the authentic X.509 certificate, verify expiration boundaries, evaluate cipher strength, and test SAN routing.
              </p>
              <button
                type="button"
                onClick={() => handleInspect()}
                className="mt-2 text-xs font-mono px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition cursor-pointer"
              >
                Inspect {cleanDomain || 'yinyangyohackers.com'}
              </button>
            </div>
          )}

          {tlsData && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Summary Status Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-[#050811] border border-slate-800 rounded-xl p-3.5 font-mono text-xs space-y-1">
                  <div className="text-slate-400 text-[11px] uppercase">Protocol Version</div>
                  <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{tlsData.protocol}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {tlsData.protocol === 'TLSv1.3' ? 'Modern TLS 1.3 with 0-RTT and forward secrecy' : 'TLS 1.2 with AEAD ciphers'}
                  </p>
                </div>

                <div className="bg-[#050811] border border-slate-800 rounded-xl p-3.5 font-mono text-xs space-y-1">
                  <div className="text-slate-400 text-[11px] uppercase">Cipher Suite</div>
                  <div className="text-cyan-300 font-bold text-xs truncate mt-1" title={tlsData.cipher.name}>
                    {tlsData.cipher.name}
                  </div>
                  <p className="text-[10px] text-slate-400">Authenticated symmetric encryption</p>
                </div>

                <div className="bg-[#050811] border border-slate-800 rounded-xl p-3.5 font-mono text-xs space-y-1">
                  <div className="text-slate-400 text-[11px] uppercase">Certificate Validity</div>
                  <div className={`font-bold text-sm flex items-center gap-1.5 mt-1 ${
                    tlsData.certificate.isExpired 
                      ? 'text-rose-400' 
                      : tlsData.certificate.daysRemaining < 30 
                        ? 'text-amber-400' 
                        : 'text-emerald-400'
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span>
                      {tlsData.certificate.isExpired 
                        ? 'EXPIRED' 
                        : `${tlsData.certificate.daysRemaining} Days Left`}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Expires: {tlsData.certificate.validTo ? new Date(tlsData.certificate.validTo).toLocaleDateString() : 'N/A'}
                  </p>
                </div>

                <div className="bg-[#050811] border border-slate-800 rounded-xl p-3.5 font-mono text-xs space-y-1">
                  <div className="text-slate-400 text-[11px] uppercase">Trust Authorization</div>
                  <div className={`font-bold text-sm flex items-center gap-1.5 mt-1 ${
                    tlsData.validation.authorized ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {tlsData.validation.authorized ? (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Trusted CA</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span>Self-Signed / Untrusted</span>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {tlsData.validation.authorized ? 'Root CA in standard trust store' : tlsData.validation.authorizationError || 'Custom/Untrusted certificate'}
                  </p>
                </div>
              </div>

              {/* Detailed Certificate Dossier */}
              <div className="bg-[#050811] border border-slate-800 rounded-xl p-4 sm:p-5 font-mono text-xs space-y-3">
                <div className="text-slate-200 font-bold uppercase tracking-wider text-xs pb-2 border-b border-slate-800 flex items-center justify-between">
                  <span>X.509 Certificate Dossier</span>
                  <span className="text-[10px] text-slate-400 font-normal">Resolved IP: {tlsData.resolvedIp}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-slate-500 text-[11px] block">Subject Common Name (CN):</span>
                    <span className="text-slate-200 font-bold">{tlsData.certificate.subject.commonName}</span>
                    {tlsData.certificate.subject.organization !== 'Not Specified' && (
                      <span className="text-slate-400 text-[11px] block">Org: {tlsData.certificate.subject.organization}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 text-[11px] block">Issuer / Certificate Authority:</span>
                    <span className="text-emerald-400 font-bold">{tlsData.certificate.issuer.commonName}</span>
                    {tlsData.certificate.issuer.organization && (
                      <span className="text-slate-400 text-[11px] block">Org: {tlsData.certificate.issuer.organization}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 text-[11px] block">Valid From:</span>
                    <span className="text-slate-300">
                      {tlsData.certificate.validFrom ? new Date(tlsData.certificate.validFrom).toUTCString() : 'Unknown'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 text-[11px] block">Valid To:</span>
                    <span className="text-slate-300">
                      {tlsData.certificate.validTo ? new Date(tlsData.certificate.validTo).toUTCString() : 'Unknown'}
                    </span>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <span className="text-slate-500 text-[11px] block">SHA-256 Fingerprint:</span>
                    <div className="flex items-center justify-between bg-black/50 p-2 rounded border border-slate-800 text-[11px] text-cyan-300 font-mono select-all">
                      <span className="truncate">{tlsData.certificate.fingerprint256}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(tlsData.certificate.fingerprint256, 'fp')}
                        className="ml-2 text-slate-400 hover:text-white transition"
                      >
                        {copiedKey === 'fp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {tlsData.certificate.subjectAlternativeNames.length > 0 && (
                    <div className="md:col-span-2 space-y-1.5 pt-1">
                      <span className="text-slate-500 text-[11px] block">
                        Subject Alternative Names (SANs - {tlsData.certificate.subjectAlternativeNames.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tlsData.certificate.subjectAlternativeNames.map((san, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-mono">
                            {san}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Terminal Playbook */}
      {activeTab === 'playbook' && (
        <div className="space-y-4">
          <div className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>OpenSSL &amp; CLI Diagnostic Commands for {cleanDomain || 'target'}</span>
          </div>

          <div className="space-y-3">
            {/* OpenSSL Expiration & Chain */}
            <div className="bg-[#050811] border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-semibold">1. Verify Certificate Expiry &amp; Issuer:</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(cliCommands.opensslExpiry, 'expiry')}
                  className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition text-[11px] cursor-pointer"
                >
                  {copiedKey === 'expiry' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'expiry' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="bg-[#02050c] p-2.5 rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto select-all border border-slate-800">
                {cliCommands.opensslExpiry}
              </pre>
            </div>

            {/* Nmap Cipher Enumeration */}
            <div className="bg-[#050811] border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-semibold">2. Enumerate Active Server Cipher Suites with Nmap:</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(cliCommands.nmapCiphers, 'nmap')}
                  className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition text-[11px] cursor-pointer"
                >
                  {copiedKey === 'nmap' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'nmap' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="bg-[#02050c] p-2.5 rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto select-all border border-slate-800">
                {cliCommands.nmapCiphers}
              </pre>
            </div>

            {/* Full TLS 1.3 Handshake Dump */}
            <div className="bg-[#050811] border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-semibold">3. Inspect Full Handshake, ALPN &amp; Session Tickets:</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(cliCommands.opensslFull, 'full')}
                  className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition text-[11px] cursor-pointer"
                >
                  {copiedKey === 'full' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'full' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="bg-[#02050c] p-2.5 rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto select-all border border-slate-800">
                {cliCommands.opensslFull}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Educational & Audit Disclaimer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px] font-mono text-slate-500">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>
          Educational diagnostic utility. Performs non-invasive TLS handshake inspection via public port 443 with strict SSRF defense. Does not perform penetration testing or replace formal security compliance audits.
        </span>
      </div>
    </div>
  );
};
