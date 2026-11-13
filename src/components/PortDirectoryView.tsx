import React, { useState, useMemo } from 'react';
import { 
  Network, 
  Search, 
  Copy, 
  Check, 
  Terminal, 
  ShieldAlert, 
  ShieldCheck, 
  Filter, 
  ExternalLink,
  ChevronRight,
  Info,
  Server,
  Lock,
  ArrowRight
} from 'lucide-react';
import { commonPortsData } from '../data/portsData';
import { PortInfo } from '../types';

interface PortDirectoryViewProps {
  onNavigateView?: (view: string, path?: string) => void;
  onOpenTools?: (toolSlug?: string) => void;
}

export const PortDirectoryView: React.FC<PortDirectoryViewProps> = ({
  onNavigateView,
  onOpenTools
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedPort, setExpandedPort] = useState<number | null>(443);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const categories = [
    { id: 'all', label: 'All Ports' },
    { id: 'web', label: 'Web & Transport (80, 443, 8080)' },
    { id: 'remote', label: 'Remote Access (22, 23, 3389)' },
    { id: 'database', label: 'Databases (1433, 3306, 5432, 6379)' },
    { id: 'infrastructure', label: 'Infrastructure & DNS (53, 88, 123, 445)' },
    { id: 'mail', label: 'Mail Services (25, 110, 143, 993, 995)' }
  ];

  const filteredPorts = useMemo(() => {
    return commonPortsData.filter(p => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        p.port.toString().includes(q) ||
        p.service.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.vulnerabilities.toLowerCase().includes(q) ||
        p.hardening.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'web') return [80, 443, 8080, 8443].includes(p.port);
      if (selectedCategory === 'remote') return [22, 23, 3389, 5900].includes(p.port);
      if (selectedCategory === 'database') return [1433, 1521, 3306, 5432, 6379, 27017].includes(p.port);
      if (selectedCategory === 'infrastructure') return [53, 88, 123, 161, 389, 445].includes(p.port);
      if (selectedCategory === 'mail') return [25, 110, 143, 465, 587, 993, 995].includes(p.port);

      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Editorial Header */}
      <div className="bg-[#070b16] border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-4xl space-y-4 relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-emerald-400 font-bold uppercase tracking-wider">
              Programmatic Knowledge Base
            </span>
            <span>&bull;</span>
            <span>TCP/UDP Port Encyclopedia</span>
            <span>&bull;</span>
            <span className="text-slate-300">Updated 2026</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
            Network Ports, Threat Profiles &amp; Hardening Directives
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Search comprehensive transport-layer protocol signatures, known CVE exploit vectors, authorized penetration testing reconnaissance commands, and verified firewall lockdown rules.
          </p>

          {/* Quick Filter Search Bar */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by port number (e.g. 443), service (e.g. SSH), or vulnerability..."
                className="w-full bg-[#050914] border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm font-mono text-slate-200 outline-none transition-colors"
              />
            </div>

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-slate-900 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-mono transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-300 font-bold shadow-sm'
                : 'bg-[#060b18] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
        <span>Displaying {filteredPorts.length} verified network port profiles</span>
        <span className="text-slate-500">RFC &amp; IANA Standards Compliant</span>
      </div>

      {/* Ports Cards Grid */}
      <div className="space-y-4">
        {filteredPorts.map((item) => {
          const isExpanded = expandedPort === item.port;
          const ufwCmd = `sudo ufw allow from 192.168.1.0/24 to any port ${item.port} proto ${item.protocol.toLowerCase().split('/')[0]}`;
          const iptablesCmd = `iptables -A INPUT -p ${item.protocol.toLowerCase().split('/')[0]} --dport ${item.port} -s 192.168.1.0/24 -j ACCEPT`;
          const wiresharkFilter = `${item.protocol.toLowerCase().split('/')[0]}.port == ${item.port}`;

          return (
            <div
              key={item.port}
              className={`rounded-2xl border transition-all bg-[#050813] overflow-hidden ${
                isExpanded ? 'border-emerald-500/60 shadow-xl' : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Card Header (Clickable for Expand/Collapse) */}
              <div
                onClick={() => setExpandedPort(isExpanded ? null : item.port)}
                className="p-5 sm:p-6 cursor-pointer select-none flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="p-3 rounded-xl bg-[#091122] border border-slate-800 text-emerald-400 font-mono font-extrabold text-base sm:text-lg min-w-[70px] text-center shrink-0">
                    :{item.port}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-white text-base">
                        {item.service}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-700 text-cyan-300">
                        {item.protocol}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    {isExpanded ? 'Collapse Directives' : 'Inspect Hardening'}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              </div>

              {/* Expanded Technical Details Panel */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-800/80 space-y-5 animate-in fade-in duration-150">
                  {/* Vulnerabilities & CVE Attack Surface */}
                  <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 text-xs font-sans space-y-2">
                    <div className="flex items-center gap-2 text-red-400 font-mono font-bold uppercase tracking-wider">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Known Vulnerabilities &amp; Attack Vectors</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {item.vulnerabilities}
                    </p>
                  </div>

                  {/* Reconnaissance & Audit Commands */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Authorized Reconnaissance Command (Nmap):</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.reconCommand, `recon-${item.port}`)}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === `recon-${item.port}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === `recon-${item.port}` ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-black/60 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                      <code>{item.reconCommand}</code>
                    </div>
                  </div>

                  {/* Firewall Lockdown Rules (UFW & Iptables) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">UFW Lockdown Rule:</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(ufwCmd, `ufw-${item.port}`)}
                          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer text-[11px]"
                        >
                          {copiedKey === `ufw-${item.port}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === `ufw-${item.port}` ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="p-2.5 rounded-lg bg-black/50 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
                        <code>{ufwCmd}</code>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Wireshark Capture Filter:</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(wiresharkFilter, `ws-${item.port}`)}
                          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer text-[11px]"
                        >
                          {copiedKey === `ws-${item.port}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === `ws-${item.port}` ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="p-2.5 rounded-lg bg-black/50 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                        <code>{wiresharkFilter}</code>
                      </div>
                    </div>
                  </div>

                  {/* Defensive Hardening Guidelines */}
                  <div className="p-4 rounded-xl bg-[#081224] border border-cyan-900/50 space-y-2 text-xs font-sans">
                    <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Defensive Hardening Directives</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      {item.hardening}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
