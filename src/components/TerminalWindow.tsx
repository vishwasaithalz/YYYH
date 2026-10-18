import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  X, 
  Minus, 
  Maximize2, 
  Minimize2, 
  ExternalLink, 
  Send, 
  Trash2, 
  HelpCircle, 
  Layers, 
  Sparkles,
  Shield,
  Search,
  BookOpen,
  Cpu
} from 'lucide-react';
import { Article, PrimaryCategory, ActiveSiteView, ThemeMode } from '../types';

interface TerminalWindowProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  currentCategory: PrimaryCategory | 'All';
  onSelectCategory: (category: PrimaryCategory | 'All') => void;
  onSelectArticle: (article: Article) => void;
  onSelectView: (view: ActiveSiteView) => void;
  onSearchChange: (query: string) => void;
  onToggleTheme: (theme: ThemeMode) => void;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  isOpen,
  onClose,
  articles,
  currentCategory,
  onSelectCategory,
  onSelectArticle,
  onSelectView,
  onSearchChange,
  onToggleTheme
}) => {
  const [activeTab, setActiveTab] = useState<'shell' | 'sysinfo'>('shell');
  const [isMaximized, setIsMaximized] = useState(false);
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState<string[]>([
    '═══════════════════════════════════════════════════════════════════════',
    '  YYYH TERMINAL OS v4.2.0-STABLE [x86_64-linux-gnu]',
    '  Type "help" for command matrix, "search <term>" to query posts.',
    '═══════════════════════════════════════════════════════════════════════'
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, cliHistory, activeTab]);

  if (!isOpen) return null;

  const executeCommand = (cmdText: string) => {
    const raw = cmdText.trim();
    if (!raw) return;

    const parts = raw.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    const fullArgStr = args.join(' ');

    const newLogs = [...cliHistory, `visitor@yyyh-terminal:~$ ${raw}`];

    switch (command) {
      case 'help':
      case '?':
        newLogs.push(
          '───────────────────────────────────────────────────────────────',
          '  COMMAND REFERENCE MANUAL',
          '───────────────────────────────────────────────────────────────',
          '  help                  List all available terminal commands',
          '  search <keyword>      Search articles and blueprints',
          '  cat <id|slug>         Read full research article in reader',
          '  ls [category]         List all published posts in category',
          '  category <name>       Switch section: Cyber, Autonomous, Blueprint, Tools, All',
          '  view <page>           Switch view: blog, about, disclaimer, contact',
          '  theme <dark|matrix|midnight> Change UI theme',
          '  clear                 Flush terminal display buffer',
          '  neofetch / sysinfo    Inspect system & kernel specs',
          '  status                System integrity telemetry',
          '  exit / close          Close terminal window'
        );
        break;

      case 'clear':
      case 'cls':
        setCliHistory([]);
        setCliInput('');
        return;

      case 'search':
      case 'grep':
      case 'find':
        if (!fullArgStr) {
          newLogs.push('[-] Syntax error: Missing search query. Example: search ollama');
        } else {
          onSearchChange(fullArgStr);
          onSelectView('blog');
          newLogs.push(`[+] Filtering index for query: "${fullArgStr}"`);
          const matches = articles.filter(a => 
            a.title.toLowerCase().includes(fullArgStr.toLowerCase()) ||
            a.tags.some(t => t.toLowerCase().includes(fullArgStr.toLowerCase()))
          );
          if (matches.length === 0) {
            newLogs.push(`[-] No matches found.`);
          } else {
            newLogs.push(`[+] Found ${matches.length} matching entries:`);
            matches.slice(0, 5).forEach(m => {
              newLogs.push(`    • [${m.id}] ${m.title} (${m.category})`);
            });
          }
        }
        break;

      case 'cat':
      case 'open':
      case 'read':
        if (!fullArgStr) {
          newLogs.push('[-] Usage: cat <article_id_or_slug>');
        } else {
          const match = articles.find(a => 
            a.id.toLowerCase() === fullArgStr.toLowerCase() || 
            a.slug.toLowerCase() === fullArgStr.toLowerCase() ||
            a.title.toLowerCase().includes(fullArgStr.toLowerCase())
          );
          if (match) {
            onSelectArticle(match);
            newLogs.push(`[+] Opening document: "${match.title}"`);
          } else {
            newLogs.push(`[-] Error: Document "${fullArgStr}" not found in index.`);
          }
        }
        break;

      case 'ls':
      case 'dir':
        newLogs.push(`[+] Total Indexed Articles: ${articles.length}`);
        articles.slice(0, 8).forEach(a => {
          newLogs.push(`  -rw-r--r-- 1 vishwas_aithal yyyh [${a.id}] ${a.title.slice(0, 48)}... (${a.category})`);
        });
        if (articles.length > 8) {
          newLogs.push(`  ... and ${articles.length - 8} more articles. Use "search <term>" to query.`);
        }
        break;

      case 'category':
      case 'cd':
        if (!fullArgStr || fullArgStr.toLowerCase() === 'all') {
          onSelectCategory('All');
          onSelectView('blog');
          newLogs.push('[+] Category set to: All');
        } else {
          const target = fullArgStr.toLowerCase();
          if (target.includes('cyber')) {
            onSelectCategory('Cyber Security');
            onSelectView('blog');
            newLogs.push('[+] Switched category to: Cyber Security');
          } else if (target.includes('ai') || target.includes('sovereign')) {
            onSelectCategory('Autonomous Systems Hub');
            onSelectView('blog');
            newLogs.push('[+] Switched category to: Autonomous Systems Hub');
          } else if (target.includes('tool') || target.includes('app')) {
            onSelectCategory('Security Tools');
            onSelectView('blog');
            newLogs.push('[+] Switched category to: Security Tools');
          } else {
            newLogs.push(`[-] Unknown category "${fullArgStr}". Options: "All", "Cyber Security", "Autonomous Systems Hub", "Security Tools"`);
          }
        }
        break;

      case 'view':
      case 'page':
        if (['blog', 'about', 'disclaimer', 'contact'].includes(fullArgStr.toLowerCase())) {
          onSelectView(fullArgStr.toLowerCase() as ActiveSiteView);
          newLogs.push(`[+] Switched active view to: "${fullArgStr}"`);
        } else {
          newLogs.push('[-] Usage: view <blog|about|disclaimer|contact>');
        }
        break;

      case 'theme':
        if (['dark', 'cyber-dark', 'cyber'].includes(fullArgStr)) {
          onToggleTheme('cyber-dark');
          newLogs.push('[+] Active theme: Cyber Dark');
        } else if (['matrix', 'matrix-green', 'green'].includes(fullArgStr)) {
          onToggleTheme('matrix-green');
          newLogs.push('[+] Active theme: Matrix Green');
        } else if (['midnight', 'midnight-blue', 'blue'].includes(fullArgStr)) {
          onToggleTheme('midnight-blue');
          newLogs.push('[+] Active theme: Midnight Blue');
        } else {
          newLogs.push('[-] Options: theme dark | theme matrix | theme midnight');
        }
        break;

      case 'neofetch':
      case 'sysinfo':
      case 'uname':
        newLogs.push(
          '   ██╗   ██╗██╗   ██╗██╗   ██╗██╗  ██╗   vishwas_aithal@yyyh-lab',
          '   ╚██╗ ██╔╝╚██╗ ██╔╝╚██╗ ██╔╝██║  ██║   ────────────────',
          '    ╚████╔╝  ╚████╔╝  ╚████╔╝ ███████║   OS: YYYH Hardened Linux v6.8',
          '     ╚██╔╝    ╚██╔╝    ╚██╔╝  ██╔══██║   Kernel: 6.8.0-yyyh-hardened-amd64',
          '      ██║      ██║      ██║   ██║  ██║   Uptime: 99.98% High Availability',
          '      ╚═╝      ╚═╝      ╚═╝   ╚═╝  ╚═╝   Shell: YYYH-BASH 5.2.21',
          '                                         Enc: AES-256-GCM / WireGuard',
          '                                         Arch: x86_64 / Zero-Trust Active'
        );
        break;

      case 'status':
      case 'defcon':
        newLogs.push(
          '[+] SYSTEM INTEGRITY: ZERO-TRUST VERIFIED',
          '    Threat Vector Mitigations: ACTIVE',
          '    Local LLM Guardrails: ENFORCED',
          '    DNS Sinkhole Sink: PI-HOLE 100% OPERATIONAL',
          '    Brute-Force Rate Limiter: 0 Banned Subnets'
        );
        break;

      case 'exit':
      case 'quit':
      case 'close':
        onClose();
        return;

      default:
        newLogs.push(`[-] Command not found: "${command}". Type "help" for manual.`);
        break;
    }

    setCliHistory(newLogs);
    setCliInput('');
  };

  const handleOpenInNewWindow = () => {
    const w = window.open('', '_blank', 'width=800,height=600');
    if (w) {
      w.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Terminal // YinYangYoHackers</title>
          <style>
            body { background: #030712; color: #10b981; font-family: monospace; padding: 20px; margin: 0; line-height: 1.5; font-size: 13px; }
            h1 { font-size: 16px; border-bottom: 1px solid #1e293b; padding-bottom: 8px; color: #f8fafc; }
            pre { white-space: pre-wrap; word-break: break-word; }
          </style>
        </head>
        <body>
          <h2>YinYangYoHackers Terminal Window</h2>
          <pre>${cliHistory.join('\n')}</pre>
        </body>
        </html>
      `);
      w.document.close();
    }
  };

  return (
    <div className={`fixed z-50 transition-all duration-200 ${
      isMaximized 
        ? 'inset-2 sm:inset-4 flex flex-col' 
        : 'bottom-4 right-4 w-[95vw] sm:w-[620px] max-h-[85vh] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.9)]'
    }`}>
      <div className="bg-[#050811] border border-emerald-500/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col flex-1 border-t-2 border-t-emerald-400">
        
        {/* Terminal Window Titlebar */}
        <div className="bg-[#090d16] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            {/* Window Traffic Lights */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center text-black font-bold text-[8px] transition-colors"
                title="Close Window"
              />
              <button 
                onClick={() => setIsMaximized(false)}
                className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-black font-bold text-[8px] transition-colors"
                title="Minimize / Reset Size"
              />
              <button 
                onClick={() => setIsMaximized(prev => !prev)}
                className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-black font-bold text-[8px] transition-colors"
                title="Maximize Window"
              />
            </div>

            {/* Window Tabs */}
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => setActiveTab('shell')}
                className={`px-2.5 py-1 rounded-md font-mono text-xs flex items-center gap-1.5 transition-colors ${
                  activeTab === 'shell' 
                    ? 'bg-slate-800 text-emerald-400 font-bold border border-slate-700' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TerminalIcon className="w-3 h-3" />
                <span>bash ~</span>
              </button>

              <button
                onClick={() => setActiveTab('sysinfo')}
                className={`px-2.5 py-1 rounded-md font-mono text-xs flex items-center gap-1.5 transition-colors ${
                  activeTab === 'sysinfo' 
                    ? 'bg-slate-800 text-purple-400 font-bold border border-slate-700' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-3 h-3" />
                <span>sysinfo</span>
              </button>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 text-slate-400">
            <button
              onClick={handleOpenInNewWindow}
              className="p-1 hover:text-emerald-400 text-slate-400 transition-colors"
              title="Open Terminal in New Window"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsMaximized(prev => !prev)}
              className="p-1 hover:text-white transition-colors"
              title={isMaximized ? "Restore Window" : "Maximize Window"}
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:text-red-400 transition-colors"
              title="Close Terminal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Body: 1. SHELL TAB */}
        {activeTab === 'shell' && (
          <div className="flex flex-col flex-1 bg-[#02050e] min-h-[300px] max-h-[500px] overflow-hidden">
            {/* Quick Helper Command Buttons */}
            <div className="bg-[#070c18] px-3 py-1.5 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono shrink-0">
              <span className="text-slate-500 uppercase tracking-wider text-[10px]">Shortcuts:</span>
              <button
                onClick={() => executeCommand('help')}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              >
                help
              </button>
              <button
                onClick={() => executeCommand('ls')}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              >
                ls
              </button>
              <button
                onClick={() => executeCommand('search ollama')}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              >
                search ollama
              </button>
              <button
                onClick={() => executeCommand('category Cyber')}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              >
                cat: Cyber
              </button>
              <button
                onClick={() => executeCommand('neofetch')}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              >
                neofetch
              </button>
              <button
                onClick={() => executeCommand('clear')}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 ml-auto"
              >
                clear
              </button>
            </div>

            {/* Scrollable Logs Output */}
            <div className="flex-1 p-3 sm:p-4 font-mono text-xs text-emerald-400 overflow-y-auto space-y-1 select-text leading-relaxed">
              {cliHistory.map((line, idx) => (
                <div 
                  key={idx} 
                  className={
                    line.startsWith('visitor@') 
                      ? 'text-white font-bold' 
                      : line.startsWith('[+]') 
                        ? 'text-cyan-300' 
                        : line.startsWith('[-]') 
                          ? 'text-red-400' 
                          : 'text-emerald-400/90'
                  }
                >
                  {line}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>

            {/* Interactive Shell Prompt Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                executeCommand(cliInput);
              }}
              className="bg-[#090d16] border-t border-slate-800 p-2 sm:p-2.5 flex items-center gap-2"
            >
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 shrink-0">
                <span>visitor@yyyh:~$</span>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
                placeholder="type command (e.g. 'help', 'search ollama', 'cat 1')..."
                className="flex-1 bg-transparent text-xs font-mono text-white placeholder-slate-600 focus:outline-none"
              />
              <button
                type="submit"
                className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                title="Execute Command"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Tab Body: 2. SYSINFO TAB */}
        {activeTab === 'sysinfo' && (
          <div className="p-4 bg-[#02050e] font-mono text-xs space-y-3 overflow-y-auto max-h-[420px]">
            <div className="p-3 rounded-lg bg-[#070c18] border border-slate-800 space-y-2">
              <div className="text-purple-400 font-bold">Hardened Node Diagnostics</div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div>Environment: <span className="text-emerald-400">Production Linux</span></div>
                <div>Runtime: <span className="text-emerald-400">Node v20.x + React 18</span></div>
                <div>Total Published Posts: <span className="text-emerald-400">{articles.length}</span></div>
                <div>Active Section: <span className="text-emerald-400">{currentCategory}</span></div>
                <div>Defense Rating: <span className="text-emerald-400">A+ Zero-Trust</span></div>
                <div>Status: <span className="text-emerald-400">All Systems Nominal</span></div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
