import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Terminal, 
  Network, 
  Copy, 
  Check, 
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

export type HandshakeProtocol = 'tcp' | 'tls13' | 'dns' | 'synflood';

interface PacketStep {
  stepNumber: number;
  direction: 'client_to_server' | 'server_to_client';
  label: string;
  summary: string;
  flags?: string[];
  protocol: string;
  bytes: number;
  wiresharkFilter: string;
  headerFields: { key: string; value: string }[];
  explanation: string;
}

const PROTOCOL_SCENARIOS: Record<HandshakeProtocol, {
  name: string;
  tag: string;
  description: string;
  clientLabel: string;
  serverLabel: string;
  steps: PacketStep[];
}> = {
  tcp: {
    name: 'TCP 3-Way Handshake',
    tag: 'Transport Layer (Layer 4)',
    description: 'RFC 793 synchronization flow establishing a reliable bidirectional TCP connection.',
    clientLabel: 'Client (192.168.1.50:54321)',
    serverLabel: 'Server (198.51.100.2:443)',
    steps: [
      {
        stepNumber: 1,
        direction: 'client_to_server',
        label: '[SYN] Synchronization Request',
        summary: 'Client initiates connection by proposing an Initial Sequence Number (ISN).',
        flags: ['SYN'],
        protocol: 'TCP',
        bytes: 60,
        wiresharkFilter: 'tcp.flags.syn == 1 && tcp.flags.ack == 0',
        headerFields: [
          { key: 'Source Port', value: '54321 (Ephemeral)' },
          { key: 'Destination Port', value: '443 (HTTPS)' },
          { key: 'Seq Number', value: '1000 (Random ISN)' },
          { key: 'Ack Number', value: '0' },
          { key: 'Window Size', value: '64240 bytes' },
          { key: 'MSS Option', value: '1460 bytes' }
        ],
        explanation: 'Client creates a transmission control block (TCB) in SYN_SENT state and sends a SYN packet to reserve a sequence space.'
      },
      {
        stepNumber: 2,
        direction: 'server_to_client',
        label: '[SYN, ACK] Acknowledgment & Sync',
        summary: 'Server acknowledges client ISN and transmits its own initial sequence number.',
        flags: ['SYN', 'ACK'],
        protocol: 'TCP',
        bytes: 60,
        wiresharkFilter: 'tcp.flags.syn == 1 && tcp.flags.ack == 1',
        headerFields: [
          { key: 'Source Port', value: '443 (HTTPS)' },
          { key: 'Destination Port', value: '54321' },
          { key: 'Seq Number', value: '5000 (Server ISN)' },
          { key: 'Ack Number', value: '1001 (Client ISN + 1)' },
          { key: 'Window Size', value: '65535 bytes' },
          { key: 'TCP State', value: 'SYN_RECEIVED' }
        ],
        explanation: 'Server allocates SYN queue resources, increments client sequence by 1 to acknowledge, and proposes its own sequence number.'
      },
      {
        stepNumber: 3,
        direction: 'client_to_server',
        label: '[ACK] Final Handshake Confirmation',
        summary: 'Client acknowledges server ISN. Full duplex socket transitions to ESTABLISHED state.',
        flags: ['ACK'],
        protocol: 'TCP',
        bytes: 52,
        wiresharkFilter: 'tcp.flags.syn == 0 && tcp.flags.ack == 1',
        headerFields: [
          { key: 'Source Port', value: '54321' },
          { key: 'Destination Port', value: '443' },
          { key: 'Seq Number', value: '1001' },
          { key: 'Ack Number', value: '5001 (Server ISN + 1)' },
          { key: 'TCP State', value: 'ESTABLISHED' },
          { key: 'Socket Status', value: 'Ready for TLS ClientHello' }
        ],
        explanation: 'The TCP handshake is now complete. Both endpoints have synchronized sequence counters and payload transmission begins.'
      }
    ]
  },
  tls13: {
    name: 'TLS 1.3 1-RTT Handshake',
    tag: 'Cryptographic Transport (RFC 8446)',
    description: 'Zero-round-trip capable TLS 1.3 key exchange providing forward secrecy and authenticated encryption.',
    clientLabel: 'Browser Client',
    serverLabel: 'Hardened HTTPS Gateway',
    steps: [
      {
        stepNumber: 1,
        direction: 'client_to_server',
        label: 'ClientHello & KeyShare (ECDH x25519)',
        summary: 'Client offers cipher suites, supported extensions, and immediately sends an ephemeral public key share.',
        flags: ['TLSv1.3', 'ClientHello'],
        protocol: 'TLS 1.3',
        bytes: 512,
        wiresharkFilter: 'tls.handshake.type == 1',
        headerFields: [
          { key: 'TLS Version', value: 'TLS 1.3 (0x0304)' },
          { key: 'Cipher Suites', value: 'TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256' },
          { key: 'Key Share Group', value: 'x25519 (ECDH)' },
          { key: 'SNI Extension', value: 'yinyangyohackers.ai.studio' },
          { key: 'ALPN Extension', value: 'h2, http/1.1' }
        ],
        explanation: 'Unlike TLS 1.2 which required 2 round-trips, TLS 1.3 sends key material on the very first packet, cutting latency by 50%.'
      },
      {
        stepNumber: 2,
        direction: 'server_to_client',
        label: 'ServerHello, EncryptedExtensions & Finished',
        summary: 'Server selects cipher suite, returns server key share, sends certificate chain, and issues handshake Finished MAC.',
        flags: ['TLSv1.3', 'ServerHello', 'Finished'],
        protocol: 'TLS 1.3',
        bytes: 1420,
        wiresharkFilter: 'tls.handshake.type == 2',
        headerFields: [
          { key: 'Selected Cipher', value: 'TLS_AES_256_GCM_SHA384' },
          { key: 'Server Key Share', value: 'x25519 Public Key' },
          { key: 'Certificate Status', value: 'Verified X.509 RSA/ECDSA Chain' },
          { key: 'Encryption State', value: 'Payload encrypted via AES-256-GCM' },
          { key: 'Traffic Key', value: 'Derived from HKDF-Extract & HKDF-Expand' }
        ],
        explanation: 'Both sides calculate the shared premaster secret locally via Diffie-Hellman. All subsequent communication is cryptographically sealed.'
      },
      {
        stepNumber: 3,
        direction: 'client_to_server',
        label: 'Encrypted Application Data [HTTP/2 GET]',
        summary: 'Client verifies server signature and immediately transmits HTTP request inside AES-GCM encrypted tunnel.',
        flags: ['EncryptedApplicationData'],
        protocol: 'TLS 1.3 / HTTP2',
        bytes: 384,
        wiresharkFilter: 'tls.app_data',
        headerFields: [
          { key: 'Stream ID', value: '1' },
          { key: 'Method', value: 'GET / HTTP/2' },
          { key: 'Integrity Tag', value: '16-byte Poly1305/GCM Authentication Tag' },
          { key: 'Session Security', value: 'Perfect Forward Secrecy (PFS)' }
        ],
        explanation: 'Zero plaintext leaks. Handshake completes in just 1 RTT before application data streams across the verified tunnel.'
      }
    ]
  },
  dns: {
    name: 'DNSSEC Recursive Query & Response',
    tag: 'Domain Name System (RFC 4034)',
    description: 'Cryptographically authenticated UDP DNS resolution with cryptographic RRSIG validation.',
    clientLabel: 'Local Resolver / Stub',
    serverLabel: 'Authoritative Nameserver',
    steps: [
      {
        stepNumber: 1,
        direction: 'client_to_server',
        label: 'DNS Standard Query (IN A + DO bit)',
        summary: 'Client queries IPv4 record with DNSSEC OK (DO) flag set to request cryptographic signature validation.',
        flags: ['Standard Query', 'DO=1'],
        protocol: 'DNS / UDP',
        bytes: 78,
        wiresharkFilter: 'dns.flags.response == 0',
        headerFields: [
          { key: 'Transaction ID', value: '0x84f2 (Random)' },
          { key: 'Question Name', value: 'yinyangyohackers.ai.studio' },
          { key: 'Query Type', value: 'A (IPv4 Host Address)' },
          { key: 'EDNS0 Buffer', value: '4096 bytes' },
          { key: 'DNSSEC OK', value: 'True (Accept RRSIG / NSEC3)' }
        ],
        explanation: 'Stub resolver transmits randomized transaction ID and source port to thwart DNS cache poisoning attacks (Kaminsky vector).'
      },
      {
        stepNumber: 2,
        direction: 'server_to_client',
        label: 'DNS Response + RRSIG Cryptographic Signature',
        summary: 'Nameserver answers with IPv4 addresses and signs records with private zone-signing key (ZSK).',
        flags: ['Response', 'Authoritative', 'DNSSEC Verified'],
        protocol: 'DNS / UDP',
        bytes: 468,
        wiresharkFilter: 'dns.flags.response == 1 && dns.rrsig',
        headerFields: [
          { key: 'Resolved IP', value: '198.51.100.2 (A Record)' },
          { key: 'TTL', value: '300 seconds' },
          { key: 'RRSIG Algorithm', value: 'ED25519 (Algorithm 15)' },
          { key: 'Key Tag', value: '38192' },
          { key: 'Signature Validation', value: 'VALID (Chain of Trust anchored to ICANN Root .)' }
        ],
        explanation: 'Resolver verifies signature against the parent DS record in the TLD zone, guaranteeing zero DNS spoofing or ISP redirection.'
      }
    ]
  },
  synflood: {
    name: 'SYN Flood Attack & Defensive SYN Cookies',
    tag: 'Defensive Hardening (RFC 4987)',
    description: 'Adversarial half-open connection exhaustion thwarted by kernel stateless cryptographic SYN cookies.',
    clientLabel: 'Adversary Botnet IP (Spoofed)',
    serverLabel: 'Hardened Linux Bastion',
    steps: [
      {
        stepNumber: 1,
        direction: 'client_to_server',
        label: '[SYN] High-Rate Spoofed Connection Flood',
        summary: 'Adversary floods thousands of SYN packets with forged source addresses without intending to send final ACKs.',
        flags: ['SYN', 'Spoofed IP'],
        protocol: 'Adversarial TCP',
        bytes: 60,
        wiresharkFilter: 'tcp.flags.syn == 1 && tcp.analysis.retransmission',
        headerFields: [
          { key: 'Attack Type', value: 'TCP SYN Queue Resource Exhaustion' },
          { key: 'Packet Rate', value: '180,000 packets/second' },
          { key: 'Source Addresses', value: 'Randomized Unroutable Bogons' },
          { key: 'Adversary Intent', value: 'Fill server backlog to deny legitimate users' }
        ],
        explanation: 'Standard unhardened servers allocate 256 bytes per half-open socket, crashing memory or dropping legitimate connections.'
      },
      {
        stepNumber: 2,
        direction: 'server_to_client',
        label: '[SYN, ACK] Stateless Cryptographic SYN Cookie Response',
        summary: 'Linux kernel sysctl net.ipv4.tcp_syncookies encodes connection state inside the Sequence number without allocating memory.',
        flags: ['SYN', 'ACK', 'SYN Cookie'],
        protocol: 'Linux Kernel 6.x',
        bytes: 60,
        wiresharkFilter: 'tcp.flags.syn == 1 && tcp.flags.ack == 1',
        headerFields: [
          { key: 'Defense Action', value: 'SYN Queue bypass active' },
          { key: 'Memory Allocated', value: '0 bytes (Stateless defense)' },
          { key: 'Sequence Number', value: 'Hash(Secret, IP, Port, Timestamp)' },
          { key: 'Kernel Status', value: 'sysctl net.ipv4.tcp_syncookies = 1' }
        ],
        explanation: 'The server stays 100% responsive under attack. Only clients that reply with a valid ACK reconstructing the cookie get socket allocation.'
      }
    ]
  }
};

export const PacketTracerVisualizer: React.FC = () => {
  const [selectedProto, setSelectedProto] = useState<HandshakeProtocol>('tcp');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copiedFilter, setCopiedFilter] = useState(false);

  const scenario = PROTOCOL_SCENARIOS[selectedProto];
  const totalSteps = scenario.steps.length;
  const activeStepData = scenario.steps[currentStep] || scenario.steps[0];

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2400);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalSteps]);

  const handleSelectProto = (proto: HandshakeProtocol) => {
    setSelectedProto(proto);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const copyWiresharkFilter = (filter: string) => {
    navigator.clipboard.writeText(filter);
    setCopiedFilter(true);
    setTimeout(() => setCopiedFilter(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Selector */}
      <div className="bg-[#070b16] border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg sm:text-xl font-bold font-mono text-white">
                Interactive Packet Tracer &amp; Handshake Inspector
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Visualize Layer 4 and Layer 7 protocol handshakes, cryptographic key exchanges, and defense state transitions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500 uppercase">
              Offline Simulation
            </span>
          </div>
        </div>

        {/* Protocol Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {(Object.keys(PROTOCOL_SCENARIOS) as HandshakeProtocol[]).map((protoKey) => {
            const proto = PROTOCOL_SCENARIOS[protoKey];
            const isSelected = selectedProto === protoKey;
            return (
              <button
                key={protoKey}
                type="button"
                onClick={() => handleSelectProto(protoKey)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500/80 text-white shadow-sm'
                    : 'bg-[#050914] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-mono font-bold">{proto.name}</div>
                <div className="text-[10px] text-slate-500 truncate mt-1">{proto.tag}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-[#050914] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Playback Controls & Progress Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#091122] p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 min-h-[40px] rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Play Flow'}</span>
            </button>

            <button
              type="button"
              onClick={() => { setCurrentStep(0); setIsPlaying(false); }}
              className="p-2 min-h-[40px] min-w-[40px] rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors flex items-center justify-center cursor-pointer"
              title="Reset flow to step 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 font-mono text-xs text-slate-400">
              <button
                type="button"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                className="p-1.5 rounded bg-slate-900 border border-slate-800 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2">Step {currentStep + 1} of {totalSteps}</span>
              <button
                type="button"
                disabled={currentStep === totalSteps - 1}
                onClick={() => setCurrentStep(prev => Math.min(totalSteps - 1, prev + 1))}
                className="p-1.5 rounded bg-slate-900 border border-slate-800 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="font-mono text-xs text-slate-400 flex items-center gap-2">
            <span className="text-emerald-400 font-bold">{scenario.name}</span>
            <span>&bull;</span>
            <span>{activeStepData.protocol} ({activeStepData.bytes} bytes)</span>
          </div>
        </div>

        {/* Visual Network Wire (Client <-> Server) */}
        <div className="relative py-8 px-4 sm:px-8 bg-[#03060f] border border-slate-800/80 rounded-xl overflow-hidden">
          {/* Wire line */}
          <div className="absolute top-1/2 left-16 right-16 h-0.5 bg-slate-800 -translate-y-1/2" />

          <div className="relative z-10 flex items-center justify-between">
            {/* Client Node */}
            <div className="text-center space-y-2 w-36 sm:w-48">
              <div className="p-3.5 mx-auto w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 flex items-center justify-center shadow-lg">
                <Terminal className="w-6 h-6" />
              </div>
              <div className="font-mono text-xs font-bold text-white truncate">{scenario.clientLabel}</div>
              <div className="text-[10px] font-mono text-cyan-400">ENDPOINT_ORIGIN</div>
            </div>

            {/* Packet In-Flight Animation */}
            <div className="flex-1 px-4 relative">
              <div className={`p-3 rounded-xl border text-center transition-all duration-300 shadow-xl ${
                activeStepData.direction === 'client_to_server'
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 translate-x-2'
                  : 'bg-cyan-950/90 border-cyan-500 text-cyan-200 -translate-x-2'
              }`}>
                <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold">
                  {activeStepData.direction === 'client_to_server' ? (
                    <>
                      <span>{activeStepData.label}</span>
                      <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 rotate-180" />
                      <span>{activeStepData.label}</span>
                    </>
                  )}
                </div>

                {activeStepData.flags && (
                  <div className="flex items-center justify-center gap-1.5 mt-2 flex-wrap">
                    {activeStepData.flags.map((flag, fIdx) => (
                      <span key={fIdx} className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-700 text-slate-300">
                        {flag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Server Node */}
            <div className="text-center space-y-2 w-36 sm:w-48">
              <div className="p-3.5 mx-auto w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="font-mono text-xs font-bold text-white truncate">{scenario.serverLabel}</div>
              <div className="text-[10px] font-mono text-emerald-400">GATEWAY_TARGET</div>
            </div>
          </div>
        </div>

        {/* Packet Header & Payload Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Header Fields */}
          <div className="space-y-3 p-5 rounded-xl bg-[#080d1a] border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Packet Header Fields
              </span>
              <span className="text-[10px] font-mono text-slate-500">{activeStepData.bytes} bytes total</span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              {activeStepData.headerFields.map((field, idx) => (
                <div key={idx} className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">{field.key}:</span>
                  <span className="text-emerald-300 font-semibold text-right max-w-[220px] truncate">{field.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Analysis & Wireshark Filter */}
          <div className="space-y-4 p-5 rounded-xl bg-[#080d1a] border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <Info className="w-3.5 h-3.5 text-emerald-400" />
                Technical Analysis &amp; Security Impact
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {activeStepData.explanation}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Wireshark / tcpdump Display Filter:</span>
                <button
                  type="button"
                  onClick={() => copyWiresharkFilter(activeStepData.wiresharkFilter)}
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  {copiedFilter ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFilter ? 'Copied' : 'Copy Filter'}</span>
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                <code>{activeStepData.wiresharkFilter}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
