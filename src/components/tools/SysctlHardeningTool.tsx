import React, { useState, useMemo } from 'react';
import { 
  Server, 
  ShieldCheck, 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  Sliders, 
  Terminal, 
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';

interface SysctlRule {
  id: string;
  category: 'network' | 'memory' | 'filesystem';
  key: string;
  recommendedValue: string;
  defaultValue: string;
  description: string;
  securityImpact: string;
  cveDefense: string;
  enabledByDefault: boolean;
}

const SYSCTL_RULES: SysctlRule[] = [
  // 1. Network Stack Rules
  {
    id: 'tcp_syncookies',
    category: 'network',
    key: 'net.ipv4.tcp_syncookies',
    recommendedValue: '1',
    defaultValue: '1',
    description: 'Enables stateless SYN flood defense via cryptographic sequence numbers when the SYN queue overflows.',
    securityImpact: 'Protects servers from denial of service (DoS) connection exhaustion attacks.',
    cveDefense: 'TCP SYN Flooding (RFC 4987)',
    enabledByDefault: true
  },
  {
    id: 'conf_all_rp_filter',
    category: 'network',
    key: 'net.ipv4.conf.all.rp_filter',
    recommendedValue: '1',
    defaultValue: '0',
    description: 'Enables strict reverse path filtering to verify source IP routability (RFC 3704).',
    securityImpact: 'Drops spoofed packets originating from unroutable internal or external IP ranges.',
    cveDefense: 'IP Address Spoofing & Reflection DoS',
    enabledByDefault: true
  },
  {
    id: 'conf_default_rp_filter',
    category: 'network',
    key: 'net.ipv4.conf.default.rp_filter',
    recommendedValue: '1',
    defaultValue: '0',
    description: 'Enforces reverse path filtering on all newly created virtual and physical network interfaces.',
    securityImpact: 'Ensures Docker and WireGuard interfaces automatically inherit anti-spoofing policies.',
    cveDefense: 'Interface Spoofing',
    enabledByDefault: true
  },
  {
    id: 'accept_redirects_all',
    category: 'network',
    key: 'net.ipv4.conf.all.accept_redirects',
    recommendedValue: '0',
    defaultValue: '1',
    description: 'Disables acceptance of ICMP redirect packets from gateways.',
    securityImpact: 'Thwarts man-in-the-middle (MITM) routing table tampering by rogue devices on local networks.',
    cveDefense: 'ICMP Redirect Route Poisoning',
    enabledByDefault: true
  },
  {
    id: 'send_redirects_all',
    category: 'network',
    key: 'net.ipv4.conf.all.send_redirects',
    recommendedValue: '0',
    defaultValue: '1',
    description: 'Disables sending ICMP redirects unless acting as a dedicated network router.',
    securityImpact: 'Prevents router masquerading and accidental route leakage.',
    cveDefense: 'Rogue Gateway Spoofing',
    enabledByDefault: true
  },
  {
    id: 'accept_source_route',
    category: 'network',
    key: 'net.ipv4.conf.all.accept_source_route',
    recommendedValue: '0',
    defaultValue: '0',
    description: 'Drops IP packets with source routing options enabled.',
    securityImpact: 'Prevents adversaries from dictating the network transit path of packets to bypass firewalls.',
    cveDefense: 'Source-Routed Path Traversal',
    enabledByDefault: true
  },
  {
    id: 'icmp_echo_ignore_broadcasts',
    category: 'network',
    key: 'net.ipv4.icmp_echo_ignore_broadcasts',
    recommendedValue: '1',
    defaultValue: '1',
    description: 'Ignores ICMP echo requests sent to broadcast and multicast addresses.',
    securityImpact: 'Prevents the host from being co-opted into Smurf amplification DDoS attacks.',
    cveDefense: 'Smurf DDoS Amplification',
    enabledByDefault: true
  },
  {
    id: 'tcp_rfc1337',
    category: 'network',
    key: 'net.ipv4.tcp_rfc1337',
    recommendedValue: '1',
    defaultValue: '0',
    description: 'Implements TIME-WAIT assassination protection outlined in RFC 1337.',
    securityImpact: 'Prevents rogue RST packets from prematurely tearing down sockets in TIME-WAIT state.',
    cveDefense: 'TIME-WAIT Socket Injection',
    enabledByDefault: true
  },

  // 2. Memory Space & Kernel Defense
  {
    id: 'randomize_va_space',
    category: 'memory',
    key: 'kernel.randomize_va_space',
    recommendedValue: '2',
    defaultValue: '2',
    description: 'Enforces full Address Space Layout Randomization (ASLR) across stack, mmap, and heap structures.',
    securityImpact: 'Significantly raises difficulty of buffer overflow exploits and Return-Oriented Programming (ROP).',
    cveDefense: 'Memory Corruption & ROP Exploitation',
    enabledByDefault: true
  },
  {
    id: 'kptr_restrict',
    category: 'memory',
    key: 'kernel.kptr_restrict',
    recommendedValue: '2',
    defaultValue: '0',
    description: 'Hides all kernel memory pointers in /proc/kallsyms and dmesg from unprivileged users.',
    securityImpact: 'Prevents local privilege escalation exploits from locating kernel function addresses.',
    cveDefense: 'Local Kernel Address Leaks',
    enabledByDefault: true
  },
  {
    id: 'dmesg_restrict',
    category: 'memory',
    key: 'kernel.dmesg_restrict',
    recommendedValue: '1',
    defaultValue: '0',
    description: 'Restricts kernel ring buffer (dmesg) inspection exclusively to root users (CAP_SYSLOG).',
    securityImpact: 'Blocks unprivileged users from reading hardware addresses, crash dumps, and credential traces.',
    cveDefense: 'Information Disclosure & Reconnaissance',
    enabledByDefault: true
  },
  {
    id: 'unprivileged_bpf_disabled',
    category: 'memory',
    key: 'kernel.unprivileged_bpf_disabled',
    recommendedValue: '1',
    defaultValue: '0',
    description: 'Restricts loading eBPF programs strictly to processes with CAP_BPF or CAP_SYS_ADMIN.',
    securityImpact: 'Thwarts side-channel speculative execution attacks (Spectre/Meltdown variants) via eBPF.',
    cveDefense: 'eBPF Side-Channel Exploits (Spectre v2)',
    enabledByDefault: true
  },

  // 3. File System Protection
  {
    id: 'protected_symlinks',
    category: 'filesystem',
    key: 'fs.protected_symlinks',
    recommendedValue: '1',
    defaultValue: '1',
    description: 'Disallows following symlinks in sticky world-writable directories (e.g. /tmp) unless owned by follower.',
    securityImpact: 'Prevents symlink race-condition file overwrite and privilege escalation attacks.',
    cveDefense: 'TOCTOU Symlink Arbitrary File Write',
    enabledByDefault: true
  },
  {
    id: 'protected_hardlinks',
    category: 'filesystem',
    key: 'fs.protected_hardlinks',
    recommendedValue: '1',
    defaultValue: '1',
    description: 'Disallows creating hardlinks to files that the user does not own or have write access to.',
    securityImpact: 'Prevents unauthorized users from pinning sensitive files or bypassing permission audits.',
    cveDefense: 'Hardlink Privilege Escalation',
    enabledByDefault: true
  },
  {
    id: 'protected_fifos',
    category: 'filesystem',
    key: 'fs.protected_fifos',
    recommendedValue: '2',
    defaultValue: '0',
    description: 'Restricts opening FIFOs or regular files in sticky directories by non-owners.',
    securityImpact: 'Blocks data injection attacks via spoofed named pipes in shared directories.',
    cveDefense: 'FIFO Pipe Spoofing in /tmp',
    enabledByDefault: true
  },
  {
    id: 'suid_dumpable',
    category: 'filesystem',
    key: 'fs.suid_dumpable',
    recommendedValue: '0',
    defaultValue: '0',
    description: 'Prevents core dumps from setuid binary processes.',
    securityImpact: 'Blocks extraction of cryptographic private keys or sensitive memory from crashed privileged programs.',
    cveDefense: 'SUID Memory Core Dump Leaks',
    enabledByDefault: true
  }
];

export const SysctlHardeningTool: React.FC = () => {
  const [enabledRules, setEnabledRules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    SYSCTL_RULES.forEach(r => { initial[r.id] = r.enabledByDefault; });
    return initial;
  });

  const [activeCategory, setActiveCategory] = useState<'all' | 'network' | 'memory' | 'filesystem'>('all');
  const [copiedConf, setCopiedConf] = useState(false);
  const [copiedApplyCmd, setCopiedApplyCmd] = useState(false);

  // Toggle rule
  const toggleRule = (id: string) => {
    setEnabledRules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Preset Handlers
  const applyPreset = (preset: 'maximum' | 'balanced' | 'reset') => {
    const updated: Record<string, boolean> = {};
    if (preset === 'maximum') {
      SYSCTL_RULES.forEach(r => { updated[r.id] = true; });
    } else if (preset === 'balanced') {
      SYSCTL_RULES.forEach(r => { updated[r.id] = r.enabledByDefault; });
    } else {
      SYSCTL_RULES.forEach(r => { updated[r.id] = false; });
    }
    setEnabledRules(updated);
  };

  // Filtered Rules
  const displayedRules = useMemo(() => {
    if (activeCategory === 'all') return SYSCTL_RULES;
    return SYSCTL_RULES.filter(r => r.category === activeCategory);
  }, [activeCategory]);

  // Security Hardening Score
  const securityScore = useMemo(() => {
    const enabledCount = Object.values(enabledRules).filter(Boolean).length;
    return Math.round((enabledCount / SYSCTL_RULES.length) * 100);
  }, [enabledRules]);

  // Generated /etc/sysctl.d/99-security.conf content
  const generatedConfig = useMemo(() => {
    const lines: string[] = [
      '# ====================================================================',
      '# YinYangYoHackers Production Linux Kernel Hardening Profile',
      '# Deployment Path: /etc/sysctl.d/99-security.conf',
      '# Generated on: ' + new Date().toISOString().split('T')[0],
      '# Hardening Score: ' + securityScore + '% Compliance',
      '# ====================================================================',
      ''
    ];

    const categories: Array<{ key: 'network' | 'memory' | 'filesystem'; label: string }> = [
      { key: 'network', label: '1. Network Stack & Anti-Spoofing Protections' },
      { key: 'memory', label: '2. Kernel Memory & Address Space Hardening' },
      { key: 'filesystem', label: '3. Filesystem & Pointer Isolation' }
    ];

    categories.forEach(cat => {
      const catRules = SYSCTL_RULES.filter(r => r.category === cat.key && enabledRules[r.id]);
      if (catRules.length > 0) {
        lines.push('# ' + cat.label);
        catRules.forEach(r => {
          lines.push('# ' + r.description);
          lines.push(r.key + ' = ' + r.recommendedValue);
        });
        lines.push('');
      }
    });

    lines.push('# EOF');
    return lines.join('\n');
  }, [enabledRules, securityScore]);

  const copyConfig = () => {
    navigator.clipboard.writeText(generatedConfig);
    setCopiedConf(true);
    setTimeout(() => setCopiedConf(false), 2000);
  };

  const copyApplyCommand = () => {
    const cmd = 'sudo sysctl --system';
    navigator.clipboard.writeText(cmd);
    setCopiedApplyCmd(true);
    setTimeout(() => setCopiedApplyCmd(false), 2000);
  };

  const downloadConfig = () => {
    const blob = new Blob([generatedConfig], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '99-security.conf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#070b16] border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg sm:text-xl font-bold font-mono text-white">
                Linux Kernel Sysctl Hardening Switchboard
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Configure host kernel defenses, prevent local privilege escalation, and generate hardened configs for Debian, Ubuntu, RHEL, and Arch.
            </p>
          </div>

          {/* Hardening Score Meter */}
          <div className="flex items-center gap-3 bg-[#0a1224] p-3 rounded-xl border border-slate-800 shrink-0">
            <div className="text-right">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Hardening Level</div>
              <div className={`text-lg font-mono font-bold ${
                securityScore >= 80 ? 'text-emerald-400' : securityScore >= 50 ? 'text-cyan-400' : 'text-amber-400'
              }`}>
                {securityScore}% Verified
              </div>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm ${
              securityScore >= 80 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-900 text-slate-300 border border-slate-700'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Category Filters & Presets */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 bg-[#050914] p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                activeCategory === 'all' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Directives ({SYSCTL_RULES.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('network')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                activeCategory === 'network' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Network Stack
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('memory')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                activeCategory === 'memory' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Memory &amp; ASLR
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('filesystem')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                activeCategory === 'filesystem' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Filesystem
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 hidden sm:inline">Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset('maximum')}
              className="px-2.5 py-1 text-xs font-mono rounded bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 transition-colors cursor-pointer"
            >
              Maximum Security
            </button>
            <button
              type="button"
              onClick={() => applyPreset('balanced')}
              className="px-2.5 py-1 text-xs font-mono rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
            >
              Balanced Production
            </button>
            <button
              type="button"
              onClick={() => applyPreset('reset')}
              className="px-2.5 py-1 text-xs font-mono rounded bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Switchboard Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Directives List */}
        <div className="lg:col-span-2 space-y-3">
          {displayedRules.map((rule) => {
            const isEnabled = enabledRules[rule.id] || false;
            return (
              <div
                key={rule.id}
                onClick={() => toggleRule(rule.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start justify-between gap-4 ${
                  isEnabled
                    ? 'bg-[#060e1d] border-emerald-500/50 shadow-sm'
                    : 'bg-[#040812] border-slate-800/80 hover:border-slate-700 opacity-70'
                }`}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="text-xs font-mono font-bold text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {rule.key} = {rule.recommendedValue}
                    </code>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">
                      Defends: {rule.cveDefense}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {rule.description}
                  </p>

                  <div className="text-[11px] font-sans text-slate-400 flex items-center gap-1.5 pt-0.5">
                    <Info className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>{rule.securityImpact}</span>
                  </div>
                </div>

                {/* Toggle switch visual */}
                <div className="shrink-0 pt-1">
                  <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    isEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
                  }`}>
                    <div className="bg-slate-950 w-4 h-4 rounded-full shadow-md" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Generated Configuration Output */}
        <div className="space-y-4">
          <div className="bg-[#050914] border border-slate-800 rounded-2xl p-5 space-y-4 sticky top-24 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                /etc/sysctl.d/99-security.conf
              </span>
              <span className="text-[10px] font-mono text-slate-500">Ready to Deploy</span>
            </div>

            {/* Code Box */}
            <div className="p-3 rounded-xl bg-black/70 border border-slate-800 text-xs font-mono text-emerald-300 max-h-96 overflow-y-auto leading-relaxed">
              <pre className="whitespace-pre-wrap">{generatedConfig}</pre>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyConfig}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  {copiedConf ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedConf ? 'Config Copied' : 'Copy Config'}</span>
                </button>

                <button
                  type="button"
                  onClick={downloadConfig}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center cursor-pointer"
                  title="Download 99-security.conf"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              {/* Instant Apply Snippet */}
              <button
                type="button"
                onClick={copyApplyCommand}
                className="w-full py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="text-slate-400">Apply command:</span>
                <span className="text-cyan-300 font-bold">sudo sysctl --system</span>
                {copiedApplyCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
