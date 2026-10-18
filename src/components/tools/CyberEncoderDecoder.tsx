import React, { useState, useMemo } from 'react';
import { 
  Binary, 
  Copy, 
  Check, 
  RotateCw, 
  ArrowRightLeft, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Trash2, 
  FileCode, 
  Terminal, 
  Globe, 
  Hash, 
  HelpCircle,
  Zap
} from 'lucide-react';

export const CyberEncoderDecoder: React.FC = () => {
  // Active Mode: 'all-in-one' (live multi-encoding view), 'decoder' (reverse decoding), 'pipeline' (multi-layer chaining)
  const [activeSubMode, setActiveSubMode] = useState<'all-in-one' | 'decoder' | 'pipeline'>('all-in-one');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Input for All-in-one Encoder
  const [encoderInput, setEncoderInput] = useState('Hello, Cyber World! YYYH@2026');
  const [rotShift, setRotShift] = useState(13);

  // Decoder state
  const [decoderInput, setDecoderInput] = useState('SGVsbG8sIEN5YmVyIFdvcmxkISBZWVlIQDIwMjY=');
  const [decoderFormat, setDecoderFormat] = useState<'auto' | 'base64' | 'hex' | 'binary' | 'url' | 'rot13' | 'html'>('auto');

  // Pipeline state (chaining multiple layers)
  const [pipelineInput, setPipelineInput] = useState('admin_session_payload=1337');
  const [pipelineSteps, setPipelineSteps] = useState<('base64' | 'hex' | 'url' | 'rot13' | 'binary')[]>([
    'rot13',
    'base64',
    'url'
  ]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Helper conversion functions
  const toBase64 = (str: string) => {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch {
      return '[Encoding Error]';
    }
  };

  const toUrlSafeBase64 = (str: string) => {
    try {
      return btoa(unescape(encodeURIComponent(str)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    } catch {
      return '[Encoding Error]';
    }
  };

  const toHex = (str: string, separator = ' ') => {
    try {
      const bytes = new TextEncoder().encode(str);
      return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(separator);
    } catch {
      return '[Hex Error]';
    }
  };

  const toSlashHex = (str: string) => {
    try {
      const bytes = new TextEncoder().encode(str);
      return Array.from(bytes).map(b => '\\x' + b.toString(16).padStart(2, '0')).join('');
    } catch {
      return '[Hex Error]';
    }
  };

  const toBinary8Bit = (str: string) => {
    try {
      const bytes = new TextEncoder().encode(str);
      return Array.from(bytes).map(b => b.toString(2).padStart(8, '0')).join(' ');
    } catch {
      return '[Binary Error]';
    }
  };

  const toUrlEncode = (str: string) => {
    try {
      return encodeURIComponent(str);
    } catch {
      return '[URL Encode Error]';
    }
  };

  const toFullPercentEncode = (str: string) => {
    try {
      const bytes = new TextEncoder().encode(str);
      return Array.from(bytes).map(b => '%' + b.toString(16).padStart(2, '0')).join('');
    } catch {
      return '[Percent Encode Error]';
    }
  };

  const toRotN = (str: string, shift: number) => {
    return str.replace(/[a-zA-Z]/g, (c) => {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
    });
  };

  const toHtmlEntities = (str: string) => {
    return Array.from(str).map(c => `&#${c.charCodeAt(0)};`).join('');
  };

  const toAsciiDecimals = (str: string) => {
    const bytes = new TextEncoder().encode(str);
    return Array.from(bytes).join(' ');
  };

  // Decode helper
  const decodeString = (input: string, format: string) => {
    const trimmed = input.trim();
    if (!trimmed) return { result: '', detected: 'Empty' };

    let effectiveFormat = format;
    if (format === 'auto') {
      // Auto detection heuristics
      if (/^[01\s]{8,}$/.test(trimmed) && trimmed.replace(/\s/g, '').length % 8 === 0) {
        effectiveFormat = 'binary';
      } else if (/^([0-9a-fA-F]{2}[\s:,]?)+$/.test(trimmed) && !trimmed.includes(' ')) {
        effectiveFormat = 'hex';
      } else if (/^([0-9a-fA-F]{2}\s)+[0-9a-fA-F]{2}$/.test(trimmed)) {
        effectiveFormat = 'hex';
      } else if (/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(trimmed) && trimmed.length % 4 === 0) {
        effectiveFormat = 'base64';
      } else if (trimmed.includes('%')) {
        effectiveFormat = 'url';
      } else if (trimmed.startsWith('&#')) {
        effectiveFormat = 'html';
      } else {
        effectiveFormat = 'rot13';
      }
    }

    try {
      switch (effectiveFormat) {
        case 'base64': {
          const decoded = decodeURIComponent(escape(atob(trimmed)));
          return { result: decoded, detected: 'Base64 (Standard)' };
        }
        case 'hex': {
          const cleanHex = trimmed.replace(/[^0-9a-fA-F]/g, '');
          const bytes = [];
          for (let i = 0; i < cleanHex.length; i += 2) {
            bytes.push(parseInt(cleanHex.substr(i, 2), 16));
          }
          const decoded = new TextDecoder().decode(new Uint8Array(bytes));
          return { result: decoded, detected: 'Hexadecimal' };
        }
        case 'binary': {
          const cleanBin = trimmed.replace(/\s+/g, '');
          const bytes = [];
          for (let i = 0; i < cleanBin.length; i += 8) {
            bytes.push(parseInt(cleanBin.substr(i, 8), 2));
          }
          const decoded = new TextDecoder().decode(new Uint8Array(bytes));
          return { result: decoded, detected: 'Binary (8-Bit)' };
        }
        case 'url': {
          const decoded = decodeURIComponent(trimmed);
          return { result: decoded, detected: 'URL / Percent Encoded' };
        }
        case 'rot13': {
          const decoded = toRotN(trimmed, 13);
          return { result: decoded, detected: 'ROT13 Substitution' };
        }
        case 'html': {
          const doc = new DOMParser().parseFromString(trimmed, 'text/html');
          return { result: doc.body.textContent || '', detected: 'HTML Entities' };
        }
        default:
          return { result: 'Unknown format', detected: 'Unknown' };
      }
    } catch (e: any) {
      return { result: `[Decoding Failed: Invalid format structure ${e.message}]`, detected: effectiveFormat };
    }
  };

  // Pipeline computation
  const pipelineResult = useMemo(() => {
    let current = pipelineInput;
    const history: { step: string; output: string }[] = [];

    for (const step of pipelineSteps) {
      switch (step) {
        case 'base64':
          current = toBase64(current);
          history.push({ step: 'Base64 Encode', output: current });
          break;
        case 'hex':
          current = toHex(current, '');
          history.push({ step: 'Hex Continuous', output: current });
          break;
        case 'binary':
          current = toBinary8Bit(current);
          history.push({ step: 'Binary 8-Bit', output: current });
          break;
        case 'url':
          current = toUrlEncode(current);
          history.push({ step: 'URL Percent Encode', output: current });
          break;
        case 'rot13':
          current = toRotN(current, 13);
          history.push({ step: 'ROT13 Caesar Shift', output: current });
          break;
      }
    }

    return { final: current, history };
  }, [pipelineInput, pipelineSteps]);

  // Decode result calculation
  const decodedData = useMemo(() => {
    return decodeString(decoderInput, decoderFormat);
  }, [decoderInput, decoderFormat]);

  return (
    <div id="multi-layer-cyber-encoder" className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Masthead */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white font-mono flex items-center gap-2">
            <Binary className="w-5 h-5 text-purple-400" />
            <span>Multi-Layer Cyber Encoder &amp; Decoder</span>
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Perform instant Base64, Hexadecimal, Binary 8-bit, URL Encoding, and ROT13 substitutions in real-time.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-[#050811] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubMode('all-in-one')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeSubMode === 'all-in-one'
                ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Multi-Encoder
          </button>
          <button
            onClick={() => setActiveSubMode('decoder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeSubMode === 'decoder'
                ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Universal Decoder
          </button>
          <button
            onClick={() => setActiveSubMode('pipeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeSubMode === 'pipeline'
                ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Layer Chainer
          </button>
        </div>
      </div>

      {/* 1. All-In-One Real-Time Multi-Encoder View */}
      {activeSubMode === 'all-in-one' && (
        <div className="space-y-6">
          {/* Input text box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-purple-400" />
                <span>Plaintext / Payload Input:</span>
              </label>
              <span className="text-slate-500">
                {encoderInput.length} chars • {new TextEncoder().encode(encoderInput).length} bytes
              </span>
            </div>

            <textarea
              rows={3}
              value={encoderInput}
              onChange={(e) => setEncoderInput(e.target.value)}
              placeholder="Enter text, shell commands, or payloads..."
              className="w-full px-4 py-3 bg-[#050811] border border-slate-700/80 rounded-xl text-sm font-mono text-purple-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />

            {/* Quick Test Payloads */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-mono text-slate-500">Payload Samples:</span>
              {[
                { name: 'XSS Cookie', val: '<script>alert(document.cookie)</script>' },
                { name: 'SQLi Bypass', val: "admin' UNION SELECT null, username, password FROM users--" },
                { name: 'Bash Shadow', val: 'cat /etc/shadow | base64' },
                { name: 'JSON Token', val: '{"user":"admin","role":"root","auth":true}' }
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setEncoderInput(p.val)}
                  className="px-2.5 py-1 rounded bg-[#050811] hover:bg-slate-800 text-[11px] font-mono text-slate-400 hover:text-white border border-slate-800 transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Real-Time Converted Representations Grid */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Instant Multi-Format Encodings</span>
              <span className="text-[10px] text-emerald-400 font-mono">Live Sync</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Base64 Standard */}
              <div className="bg-[#050811] border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    Base64 (RFC 4648)
                  </span>
                  <button
                    onClick={() => copyToClipboard(toBase64(encoderInput), 'b64')}
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    {copiedKey === 'b64' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'b64' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-slate-200 bg-[#090d16] p-2.5 rounded-lg border border-slate-800/80 break-all select-all max-h-24 overflow-y-auto">
                  {toBase64(encoderInput)}
                </div>
              </div>

              {/* 2. Hexadecimal (Spaced Bytes) */}
              <div className="bg-[#050811] border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    Hexadecimal (Spaced Bytes)
                  </span>
                  <button
                    onClick={() => copyToClipboard(toHex(encoderInput, ' '), 'hex')}
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    {copiedKey === 'hex' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'hex' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-amber-200/90 bg-[#090d16] p-2.5 rounded-lg border border-slate-800/80 break-all select-all max-h-24 overflow-y-auto">
                  {toHex(encoderInput, ' ')}
                </div>
              </div>

              {/* 3. Binary 8-Bit */}
              <div className="bg-[#050811] border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Binary 8-Bit Format
                  </span>
                  <button
                    onClick={() => copyToClipboard(toBinary8Bit(encoderInput), 'bin')}
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    {copiedKey === 'bin' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'bin' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-[11px] text-emerald-300 bg-[#090d16] p-2.5 rounded-lg border border-slate-800/80 break-all select-all max-h-24 overflow-y-auto">
                  {toBinary8Bit(encoderInput)}
                </div>
              </div>

              {/* 4. URL / Percent Encoded */}
              <div className="bg-[#050811] border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    URL Percent Encoding
                  </span>
                  <button
                    onClick={() => copyToClipboard(toUrlEncode(encoderInput), 'url')}
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    {copiedKey === 'url' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'url' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-indigo-200 bg-[#090d16] p-2.5 rounded-lg border border-slate-800/80 break-all select-all max-h-24 overflow-y-auto">
                  {toUrlEncode(encoderInput)}
                </div>
              </div>

              {/* 5. ROT13 & Caesar Shift */}
              <div className="bg-[#050811] border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-pink-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                      ROT{rotShift} Substitution
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="25"
                      value={rotShift}
                      onChange={(e) => setRotShift(Number(e.target.value))}
                      className="w-16 h-1.5 accent-pink-500 bg-slate-800 rounded cursor-pointer"
                      title={`Caesar Shift: +${rotShift}`}
                    />
                    <button
                      onClick={() => copyToClipboard(toRotN(encoderInput, rotShift), 'rot')}
                      className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      {copiedKey === 'rot' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'rot' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
                <div className="font-mono text-xs text-pink-200 bg-[#090d16] p-2.5 rounded-lg border border-slate-800/80 break-all select-all max-h-24 overflow-y-auto">
                  {toRotN(encoderInput, rotShift)}
                </div>
              </div>

              {/* 6. Shellcode \x Hex Bytes */}
              <div className="bg-[#050811] border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    Shellcode Escaped (\x Hex)
                  </span>
                  <button
                    onClick={() => copyToClipboard(toSlashHex(encoderInput), 'slashhex')}
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    {copiedKey === 'slashhex' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'slashhex' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-rose-200/90 bg-[#090d16] p-2.5 rounded-lg border border-slate-800/80 break-all select-all max-h-24 overflow-y-auto">
                  {toSlashHex(encoderInput)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Universal Decoder View */}
      {activeSubMode === 'decoder' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
                <span>Paste Ciphertext or Encoded String:</span>
              </label>

              {/* Format dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Source Format:</span>
                <select
                  value={decoderFormat}
                  onChange={(e: any) => setDecoderFormat(e.target.value)}
                  className="bg-[#050811] text-xs text-cyan-400 border border-slate-700 rounded px-2.5 py-1 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="auto">Auto Detect Format</option>
                  <option value="base64">Base64 (Standard)</option>
                  <option value="hex">Hexadecimal (0x / Spaced)</option>
                  <option value="binary">Binary (8-bit bytes)</option>
                  <option value="url">URL Percent Encoded</option>
                  <option value="rot13">ROT13 Substitution</option>
                  <option value="html">HTML Entities</option>
                </select>
              </div>
            </div>

            <textarea
              rows={3}
              value={decoderInput}
              onChange={(e) => setDecoderInput(e.target.value)}
              placeholder="Paste Base64, Hex bytes, Binary, URL encoded string..."
              className="w-full px-4 py-3 bg-[#050811] border border-slate-700/80 rounded-xl text-sm font-mono text-cyan-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          {/* Decoded Result */}
          <div className="bg-[#050811] border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Decoded Plaintext Output
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Detected: {decodedData.detected}
                </span>
              </div>

              <button
                onClick={() => copyToClipboard(decodedData.result, 'decoded')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-semibold transition-colors"
              >
                {copiedKey === 'decoded' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'decoded' ? 'Copied' : 'Copy Result'}</span>
              </button>
            </div>

            <div className="font-mono text-sm text-slate-100 bg-[#090d16] p-4 rounded-xl border border-slate-800/80 break-all select-all min-h-[80px]">
              {decodedData.result || <span className="text-slate-500 italic">No input to decode.</span>}
            </div>
          </div>
        </div>
      )}

      {/* 3. Multi-Layer Chaining Pipeline View */}
      {activeSubMode === 'pipeline' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Base Input String:</span>
              </label>
              <span className="text-slate-500">Chaining {pipelineSteps.length} transformation layers</span>
            </div>

            <input
              type="text"
              value={pipelineInput}
              onChange={(e) => setPipelineInput(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#050811] border border-slate-700/80 rounded-xl text-sm font-mono text-emerald-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-bold transition-all"
            />
          </div>

          {/* Transformation Sequence Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Transformation Pipeline Sequence
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPipelineSteps([...pipelineSteps, 'base64'])}
                  className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  + Add Base64
                </button>
                <button
                  onClick={() => setPipelineSteps([...pipelineSteps, 'hex'])}
                  className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  + Add Hex
                </button>
                <button
                  onClick={() => setPipelineSteps([...pipelineSteps, 'url'])}
                  className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  + Add URL Encode
                </button>
                <button
                  onClick={() => setPipelineSteps([])}
                  className="text-[11px] font-mono px-2.5 py-1 rounded bg-red-950/60 text-red-400 border border-red-800/40 hover:bg-red-900 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Sequence Steps */}
            <div className="space-y-3">
              {pipelineResult.history.map((h, idx) => (
                <div key={idx} className="bg-[#050811] border border-slate-800 rounded-xl p-3.5 space-y-1.5 relative">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-emerald-400 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      {h.step}
                    </span>
                    <button
                      onClick={() => setPipelineSteps(pipelineSteps.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="Remove step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="font-mono text-xs text-slate-300 bg-[#090d16] p-2.5 rounded-lg border border-slate-800/80 break-all select-all">
                    {h.output}
                  </div>
                </div>
              ))}
            </div>

            {/* Final Chained Output */}
            <div className="bg-gradient-to-r from-emerald-950/40 to-[#050811] border border-emerald-800/60 rounded-xl p-4 space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Final Multi-Layer Encoded Output
                </span>
                <button
                  onClick={() => copyToClipboard(pipelineResult.final, 'final-pipe')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                >
                  {copiedKey === 'final-pipe' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'final-pipe' ? 'Copied!' : 'Copy Final'}</span>
                </button>
              </div>
              <div className="font-mono text-xs text-emerald-200 bg-[#090d16] p-3 rounded-lg border border-emerald-900/50 break-all select-all font-bold">
                {pipelineResult.final}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
