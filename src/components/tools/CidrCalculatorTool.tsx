import React, { useState, useMemo } from 'react';
import { 
  Network, 
  Copy, 
  Check, 
  RotateCcw, 
  Globe, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  ArrowRight,
  Info
} from 'lucide-react';

export const CidrCalculatorTool: React.FC = () => {
  const [protocol, setProtocol] = useState<'ipv4' | 'ipv6'>('ipv4');
  
  // IPv4 States
  const [ipv4Input, setIpv4Input] = useState('192.168.1.100');
  const [cidrPrefix, setCidrPrefix] = useState<number>(24);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // IPv6 States
  const [ipv6Input, setIpv6Input] = useState('2001:0db8:85a3::1');
  const [ipv6Prefix, setIpv6Prefix] = useState<number>(64);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Preset Handlers
  const handlePreset = (ip: string, prefix: number) => {
    setIpv4Input(ip);
    setCidrPrefix(prefix);
    setProtocol('ipv4');
  };

  // Helper: IPv4 parsing & calculations
  const ipv4Calculations = useMemo(() => {
    const cleanIp = ipv4Input.trim();
    const parts = cleanIp.split('.').map(p => parseInt(p, 10));

    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
      return { isValid: false, error: 'Invalid IPv4 address format. Must be four octets (0-255) separated by dots.' };
    }

    const prefix = Math.max(0, Math.min(32, cidrPrefix));
    const ipNum = ((parts[0] << 24) >>> 0) + ((parts[1] << 16) >>> 0) + ((parts[2] << 8) >>> 0) + (parts[3] >>> 0);
    const maskNum = prefix === 0 ? 0 : (((0xFFFFFFFF << (32 - prefix)) >>> 0));
    const wildcardNum = (~maskNum) >>> 0;

    const netNum = (ipNum & maskNum) >>> 0;
    const bcastNum = (netNum | wildcardNum) >>> 0;

    const numToIp = (num: number) => [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join('.');

    const numToBinary = (num: number) => [
      ((num >>> 24) & 255).toString(2).padStart(8, '0'),
      ((num >>> 16) & 255).toString(2).padStart(8, '0'),
      ((num >>> 8) & 255).toString(2).padStart(8, '0'),
      (num & 255).toString(2).padStart(8, '0')
    ].join('.');

    const netIp = numToIp(netNum);
    const bcastIp = prefix >= 31 ? numToIp(netNum) : numToIp(bcastNum);
    const maskIp = numToIp(maskNum);
    const wildcardIp = numToIp(wildcardNum);

    const totalHosts = prefix === 32 ? 1 : Math.pow(2, 32 - prefix);
    const usableHosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : Math.max(0, totalHosts - 2);

    const firstUsableNum = prefix >= 31 ? netNum : netNum + 1;
    const lastUsableNum = prefix >= 31 ? bcastNum : bcastNum - 1;
    const firstUsableIp = numToIp(firstUsableNum);
    const lastUsableIp = numToIp(lastUsableNum);

    // Classification
    let ipClass = 'Class A';
    if (parts[0] >= 128 && parts[0] <= 191) ipClass = 'Class B';
    else if (parts[0] >= 192 && parts[0] <= 223) ipClass = 'Class C';
    else if (parts[0] >= 224 && parts[0] <= 239) ipClass = 'Class D (Multicast)';
    else if (parts[0] >= 240) ipClass = 'Class E (Experimental)';

    // Scope check
    let scope = 'Public Internet';
    if (parts[0] === 10) scope = 'RFC 1918 Private (10.0.0.0/8)';
    else if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) scope = 'RFC 1918 Private (172.16.0.0/12)';
    else if (parts[0] === 192 && parts[1] === 168) scope = 'RFC 1918 Private (192.168.0.0/16)';
    else if (parts[0] === 127) scope = 'RFC 1122 Loopback (127.0.0.0/8)';
    else if (parts[0] === 169 && parts[1] === 254) scope = 'RFC 3927 Link-Local (APIPA)';
    else if (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127) scope = 'RFC 6598 Carrier-Grade NAT (CGNAT)';

    // Subnet splitting preview (divide into 4 subnets if prefix <= 30)
    const childSubnets = [];
    if (prefix <= 30) {
      const childPrefix = prefix + 2;
      const childSize = Math.pow(2, 32 - childPrefix);
      for (let i = 0; i < 4; i++) {
        const cNet = (netNum + (i * childSize)) >>> 0;
        const cBcast = (cNet + childSize - 1) >>> 0;
        childSubnets.push({
          cidr: `${numToIp(cNet)}/${childPrefix}`,
          net: numToIp(cNet),
          first: numToIp(cNet + 1),
          last: numToIp(cBcast - 1),
          hosts: childSize - 2
        });
      }
    }

    return {
      isValid: true,
      cleanIp,
      prefix,
      netIp,
      bcastIp,
      maskIp,
      wildcardIp,
      totalHosts,
      usableHosts,
      firstUsableIp,
      lastUsableIp,
      ipClass,
      scope,
      ipBinary: numToBinary(ipNum),
      maskBinary: numToBinary(maskNum),
      childSubnets
    };
  }, [ipv4Input, cidrPrefix]);

  // Helper: IPv6 parsing & calculations
  const ipv6Calculations = useMemo(() => {
    const raw = ipv6Input.trim();
    if (!raw) return { isValid: false, error: 'Enter an IPv6 address.' };

    const prefix = Math.max(0, Math.min(128, ipv6Prefix));
    let isV6Valid = true;

    // Simple validation test
    try {
      if (!raw.includes(':')) isV6Valid = false;
      const parts = raw.split('::');
      if (parts.length > 2) isV6Valid = false;
    } catch {
      isV6Valid = false;
    }

    if (!isV6Valid) {
      return { isValid: false, error: 'Invalid IPv6 format. Example: 2001:db8:85a3::1 or fe80::1' };
    }

    let scope = 'Global Unicast (2000::/3)';
    if (raw.toLowerCase().startsWith('fe80:')) scope = 'Link-Local (fe80::/10)';
    else if (raw.toLowerCase().startsWith('fc00:') || raw.toLowerCase().startsWith('fd00:')) scope = 'Unique Local Address (ULA: fc00::/7)';
    else if (raw.toLowerCase().startsWith('ff')) scope = 'Multicast (ff00::/8)';
    else if (raw === '::1' || raw === '0:0:0:0:0:0:0:1') scope = 'Loopback (::1/128)';

    const hostBits = 128 - prefix;
    let totalAddressesStr = '1';
    if (hostBits > 0) {
      if (hostBits <= 64) {
        totalAddressesStr = BigInt(Math.pow(2, Math.min(64, hostBits))).toLocaleString() + (hostBits > 64 ? ' (approx)' : '');
      } else {
        totalAddressesStr = `2^${hostBits} (approx. ${(Math.pow(2, hostBits % 64)).toFixed(0)} × 10^${Math.floor(hostBits * 0.30103)})`;
      }
    }

    return {
      isValid: true,
      raw,
      prefix,
      scope,
      totalAddressesStr,
      prefixNotation: `${raw}/${prefix}`
    };
  }, [ipv6Input, ipv6Prefix]);

  return (
    <div className="bg-[#0b101d] border border-cyan-500/20 rounded-xl p-5 sm:p-7 shadow-2xl text-slate-100">
      {/* Header & Protocol Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
              Interactive Subnet Engine
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                RFC Compliant
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Live deterministic calculation of network boundaries, broadcast ranges & masks
            </p>
          </div>
        </div>

        {/* IPv4 vs IPv6 Toggle */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-700/60 rounded-lg">
          <button
            onClick={() => setProtocol('ipv4')}
            className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
              protocol === 'ipv4'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            IPv4 Subnetting
          </button>
          <button
            onClick={() => setProtocol('ipv6')}
            className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
              protocol === 'ipv6'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            IPv6 CIDR (/128)
          </button>
        </div>
      </div>

      {protocol === 'ipv4' ? (
        <div className="mt-6 space-y-6">
          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1 mr-1">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Presets:
            </span>
            <button
              onClick={() => handlePreset('192.168.1.0', 24)}
              className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-400 border border-slate-700 cursor-pointer transition"
            >
              192.168.1.0/24 (Home / Office)
            </button>
            <button
              onClick={() => handlePreset('10.0.0.0', 16)}
              className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-400 border border-slate-700 cursor-pointer transition"
            >
              10.0.0.0/16 (Cloud VPC)
            </button>
            <button
              onClick={() => handlePreset('172.16.50.0', 28)}
              className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-400 border border-slate-700 cursor-pointer transition"
            >
              172.16.50.0/28 (Server Bastion)
            </button>
            <button
              onClick={() => handlePreset('10.254.0.1', 30)}
              className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-400 border border-slate-700 cursor-pointer transition"
            >
              10.254.0.0/30 (P2P WireGuard)
            </button>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-7 space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-300 flex items-center justify-between">
                <span>IPv4 Address or Host</span>
                <span className="text-slate-500">e.g. 192.168.1.100</span>
              </label>
              <input
                type="text"
                value={ipv4Input}
                onChange={(e) => setIpv4Input(e.target.value)}
                placeholder="192.168.1.100"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div className="md:col-span-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono font-medium text-slate-300">
                <span>CIDR Prefix (/{cidrPrefix})</span>
                <span className="text-cyan-400 font-bold">
                  {ipv4Calculations.isValid ? ipv4Calculations.maskIp : ''}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={32}
                  value={cidrPrefix}
                  onChange={(e) => setCidrPrefix(parseInt(e.target.value, 10))}
                  className="flex-1 accent-cyan-400 cursor-pointer"
                />
                <input
                  type="number"
                  min={0}
                  max={32}
                  value={cidrPrefix}
                  onChange={(e) => setCidrPrefix(Math.max(0, Math.min(32, parseInt(e.target.value || '0', 10))))}
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-center text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Results Display */}
          {ipv4Calculations.isValid ? (
            <div className="space-y-5">
              {/* Primary Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Network Address</div>
                  <div className="text-sm sm:text-base font-mono font-bold text-cyan-300 mt-1 flex items-center justify-between">
                    <span>{ipv4Calculations.netIp}/{ipv4Calculations.prefix}</span>
                    <button 
                      onClick={() => copyToClipboard(ipv4Calculations.netIp, 'net')}
                      className="text-slate-500 hover:text-cyan-400 transition"
                    >
                      {copiedKey === 'net' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Usable Hosts</div>
                  <div className="text-sm sm:text-base font-mono font-bold text-emerald-400 mt-1 flex items-center justify-between">
                    <span>{ipv4Calculations.usableHosts.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Total: {ipv4Calculations.totalHosts.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Subnet Mask</div>
                  <div className="text-sm sm:text-base font-mono font-bold text-amber-300 mt-1 flex items-center justify-between">
                    <span>{ipv4Calculations.maskIp}</span>
                    <button 
                      onClick={() => copyToClipboard(ipv4Calculations.maskIp, 'mask')}
                      className="text-slate-500 hover:text-amber-400 transition"
                    >
                      {copiedKey === 'mask' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Broadcast Address</div>
                  <div className="text-sm sm:text-base font-mono font-bold text-indigo-300 mt-1 flex items-center justify-between">
                    <span>{ipv4Calculations.bcastIp}</span>
                    <button 
                      onClick={() => copyToClipboard(ipv4Calculations.bcastIp, 'bcast')}
                      className="text-slate-500 hover:text-indigo-400 transition"
                    >
                      {copiedKey === 'bcast' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Usable Host Range & Scope */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                  <span className="text-slate-400">Usable IP Range:</span>
                  <div className="flex items-center gap-2 font-bold text-cyan-400">
                    <span>{ipv4Calculations.firstUsableIp}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                    <span>{ipv4Calculations.lastUsableIp}</span>
                    <button 
                      onClick={() => copyToClipboard(`${ipv4Calculations.firstUsableIp} to ${ipv4Calculations.lastUsableIp}`, 'range')}
                      className="ml-2 text-slate-500 hover:text-cyan-400 transition"
                    >
                      {copiedKey === 'range' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/60 text-xs font-mono">
                  <div>
                    <span className="text-slate-500">Scope: </span>
                    <span className="text-slate-200 font-semibold">{ipv4Calculations.scope}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Class: </span>
                    <span className="text-slate-200 font-semibold">{ipv4Calculations.ipClass}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Wildcard: </span>
                    <span className="text-slate-200 font-semibold">{ipv4Calculations.wildcardIp}</span>
                  </div>
                </div>
              </div>

              {/* Binary Bit Visualizer */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 font-mono text-xs space-y-2 overflow-x-auto">
                <div className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider flex items-center justify-between">
                  <span>32-Bit Binary Map (Network bits vs Host bits)</span>
                  <span className="text-cyan-400">{ipv4Calculations.prefix} Network Bits / {32 - ipv4Calculations.prefix} Host Bits</span>
                </div>
                <div className="text-slate-300 font-mono text-xs tracking-wider">
                  <span className="text-slate-500 block text-[10px]">IP Binary:</span>
                  <span className="text-cyan-300">{ipv4Calculations.ipBinary}</span>
                </div>
                <div className="text-slate-300 font-mono text-xs tracking-wider">
                  <span className="text-slate-500 block text-[10px]">Mask Binary:</span>
                  <span className="text-emerald-400">{ipv4Calculations.maskBinary}</span>
                </div>
              </div>

              {/* Subnet Division Preview */}
              {ipv4Calculations.childSubnets.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-mono font-medium text-slate-400 flex items-center justify-between">
                    <span>Subnet Division: Split into 4 smaller subnets (/{ipv4Calculations.prefix + 2})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {ipv4Calculations.childSubnets.map((sub, i) => (
                      <div key={i} className="bg-slate-900 border border-slate-800/80 rounded-md p-2.5 font-mono text-xs">
                        <div className="text-cyan-300 font-bold flex items-center justify-between">
                          <span>{sub.cidr}</span>
                          <span className="text-[10px] text-emerald-400">{sub.hosts} hosts</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {sub.first}  to  {sub.last}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-red-950/30 border border-red-500/40 text-red-300 text-xs font-mono">
              ⚠️ {ipv4Calculations.error}
            </div>
          )}
        </div>
      ) : (
        /* IPv6 Section */
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 space-y-1.5">
              <label className="text-xs font-mono font-medium text-slate-300 flex items-center justify-between">
                <span>IPv6 Address</span>
                <span className="text-slate-500">e.g. 2001:db8:85a3::1</span>
              </label>
              <input
                type="text"
                value={ipv6Input}
                onChange={(e) => setIpv6Input(e.target.value)}
                placeholder="2001:0db8:85a3::1"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div className="md:col-span-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono font-medium text-slate-300">
                <span>Prefix Length (/{ipv6Prefix})</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={128}
                  value={ipv6Prefix}
                  onChange={(e) => setIpv6Prefix(parseInt(e.target.value, 10))}
                  className="flex-1 accent-cyan-400 cursor-pointer"
                />
                <input
                  type="number"
                  min={0}
                  max={128}
                  value={ipv6Prefix}
                  onChange={(e) => setIpv6Prefix(Math.max(0, Math.min(128, parseInt(e.target.value || '0', 10))))}
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-center text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {ipv6Calculations.isValid ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">IPv6 CIDR Notation</div>
                <div className="text-sm font-mono font-bold text-cyan-300 mt-1 break-all">
                  {ipv6Calculations.prefixNotation}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">IPv6 Scope</div>
                <div className="text-sm font-mono font-bold text-emerald-400 mt-1">
                  {ipv6Calculations.scope}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Subnet Capacity</div>
                <div className="text-sm font-mono font-bold text-indigo-300 mt-1 break-all">
                  {ipv6Calculations.totalAddressesStr}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-red-950/30 border border-red-500/40 text-red-300 text-xs font-mono">
              ⚠️ {ipv6Calculations.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
