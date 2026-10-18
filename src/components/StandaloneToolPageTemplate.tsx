import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Copy, 
  Check, 
  Share2, 
  BookOpen, 
  Sparkles,
  Shield,
  Layers,
  ExternalLink
} from 'lucide-react';
import { ToolPageData, ToolPageEducationalSection } from '../data/toolPagesData';
import { ActiveSiteView } from '../types';
import { CidrCalculatorTool } from './tools/CidrCalculatorTool';
import { HashAnalyzerTool } from './tools/HashAnalyzerTool';
import { PasswordEntropyTool } from './tools/PasswordEntropyTool';
import { HttpSecurityHeadersTool } from './tools/HttpSecurityHeadersTool';
import { SslCheckerTool } from './tools/SslCheckerTool';
import { CyberEncoderDecoder } from './tools/CyberEncoderDecoder';
import { AiJailbreakSandbox } from './tools/AiJailbreakSandbox';
import { IpLookupTool } from './tools/IpLookupTool';

export interface StandaloneToolPageTemplateProps {
  toolData: ToolPageData;
  onNavigate: (view: ActiveSiteView, path?: string) => void;
  customToolComponent?: React.ReactNode;
}

/**
 * Standardized Template Component for Standalone Indexable Security Tools.
 * Conforms to the standard architecture:
 * 1. H1 (Title)
 * 2. Tool Description (Short explanation)
 * 3. Interactive Tool Component (Client-side interactive calculator/analyzer)
 * 4. Educational Context Section (Technical breakdown, FAQs, formula, tables)
 * 5. Related Security Links (→ Network Security, → Zero Trust, → Infrastructure Hardening)
 */
export const StandaloneToolPageTemplate: React.FC<StandaloneToolPageTemplateProps> = ({
  toolData,
  onNavigate,
  customToolComponent
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSnippetIdx, setCopiedSnippetIdx] = useState<number | null>(null);

  const handleShare = () => {
    const url = window.location.origin + toolData.path;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopySnippet = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetIdx(idx);
    setTimeout(() => setCopiedSnippetIdx(null), 2000);
  };

  // Resolve interactive tool component by key or fallback to custom
  const renderInteractiveTool = () => {
    if (customToolComponent) return customToolComponent;
    
    switch (toolData.componentKey) {
      case 'CidrCalculatorTool':
        return <CidrCalculatorTool />;
      case 'HashAnalyzerTool':
        return <HashAnalyzerTool />;
      case 'PasswordEntropyTool':
        return <PasswordEntropyTool />;
      case 'HttpSecurityHeadersTool':
        return <HttpSecurityHeadersTool />;
      case 'SslCheckerTool':
        return <SslCheckerTool />;
      case 'CyberEncoderDecoder':
        return <CyberEncoderDecoder />;
      case 'AiJailbreakSandbox':
        return <AiJailbreakSandbox />;
      case 'IpLookupTool':
        return <IpLookupTool />;
      default:
        return <CidrCalculatorTool />;
    }
  };

  return (
    <article 
      className="space-y-8 animate-fadeIn max-w-5xl mx-auto"
      itemScope 
      itemType="https://schema.org/WebApplication"
    >
      {/* 1. Breadcrumbs & Top Quick Navigation */}
      <nav aria-label="Breadcrumb Navigation" className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-300">
        <div className="flex items-center gap-2.5 flex-wrap">
          <a 
            href="/"
            onClick={(e) => { e.preventDefault(); onNavigate('blog', '/'); }}
            className="hover:text-cyan-400 transition cursor-pointer py-2.5 px-2 min-h-[48px] inline-flex items-center"
          >
            Home
          </a>
          <span className="text-slate-500">/</span>
          <a 
            href="/tools"
            onClick={(e) => { e.preventDefault(); onNavigate('tools', '/tools'); }}
            className="hover:text-cyan-400 transition cursor-pointer py-2.5 px-2 min-h-[48px] inline-flex items-center"
          >
            Tools
          </a>
          <span className="text-slate-500">/</span>
          <span className="text-cyan-400 font-semibold py-2.5 px-2 min-h-[48px] inline-flex items-center">{toolData.slug}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShare}
            className="px-3.5 py-2.5 min-h-[48px] rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white flex items-center gap-1.5 transition text-xs font-mono cursor-pointer"
            title="Copy indexable URL to clipboard"
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">URL Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Tool</span>
              </>
            )}
          </button>
          <a
            href="/tools"
            onClick={(e) => { e.preventDefault(); onNavigate('tools', '/tools'); }}
            className="px-3.5 py-2.5 min-h-[48px] rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white flex items-center gap-1.5 transition text-xs font-mono cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Tools</span>
          </a>
        </div>
      </nav>

      {/* 2. Primary Hero Header: H1 and Tool Description */}
      <header className="space-y-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold">
            Indexable Security Tool
          </span>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
            Zero Telemetry • Client-Side Engine
          </span>
        </div>

        {/* H1 Heading */}
        <h1 
          itemProp="name"
          className="text-2xl sm:text-4xl font-extrabold font-mono text-white tracking-tight"
        >
          {toolData.h1}
        </h1>

        {/* Short Tool Description */}
        <p 
          itemProp="description"
          className="text-sm sm:text-base text-slate-300 font-mono max-w-4xl leading-relaxed"
        >
          {toolData.shortExplanation}
        </p>
      </header>

      {/* 3. Interactive Tool Component */}
      <section aria-label="Interactive Tool Engine" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Interactive Calculator &amp; Analyzer</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            RFC / NIST Compliant
          </span>
        </div>

        {/* The Actual Tool */}
        <div className="bg-[#050811] rounded-2xl border border-slate-800 p-1 sm:p-2 shadow-2xl">
          {renderInteractiveTool()}
        </div>
      </section>

      {/* 4. Educational Context Section */}
      <section aria-label="Educational Context" className="space-y-8 pt-8 border-t border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Educational Reference &amp; Technical Context</span>
        </div>

        <div className="space-y-6">
          {toolData.educationalContent.sections.map((section: ToolPageEducationalSection, idx: number) => (
            <div 
              key={idx} 
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-5 sm:p-7 space-y-4 shadow-sm"
            >
              <h2 className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
                <span className="text-cyan-400 text-sm">#</span>
                {section.title}
              </h2>

              <div className="space-y-3 text-slate-300 text-sm font-sans leading-relaxed">
                {section.content.map((p, pIdx) => (
                  <p key={pIdx} className="text-slate-300 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              {/* Optional Code Snippet */}
              {section.codeSnippet && (
                <div className="relative mt-3">
                  <pre className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-normal">
                    {section.codeSnippet}
                  </pre>
                  <button
                    onClick={() => handleCopySnippet(section.codeSnippet!, idx)}
                    className="absolute top-3 right-3 text-xs font-mono px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedSnippetIdx === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[11px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Optional Reference Table */}
              {section.table && (
                <div className="overflow-x-auto mt-4 rounded-lg border border-slate-800">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                      <tr>
                        {section.table.headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-3 font-semibold uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                      {section.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-900/40 transition">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className={`p-3 ${cIdx === 0 ? 'font-bold text-cyan-300' : 'text-slate-300'}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Related Security Links */}
      <section 
        aria-label="Related Security Links"
        className="bg-gradient-to-br from-slate-950 via-[#0a0f1d] to-slate-950 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4 shadow-lg"
      >
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold font-mono text-white flex items-center gap-2">
            <span>Related Security Links &amp; Architectural Portals</span>
          </h3>
          <p className="text-xs font-mono text-slate-400">
            Explore zero-trust infrastructure, network defense playbooks, and sovereign compute architectures:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {toolData.relatedLinks.map((link, i) => (
            <a
              key={i}
              href={link.path}
              onClick={(e) => {
                e.preventDefault();
                const cleanView = link.path.replace(/^\//, '') as ActiveSiteView;
                onNavigate(cleanView, link.path);
              }}
              className="group text-left p-4 min-h-[48px] rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/80 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="text-sm font-mono font-bold text-cyan-300 group-hover:text-cyan-200 flex items-center justify-between">
                  <span>→ {link.label}</span>
                  <ArrowRight className="w-4 h-4 text-cyan-500 transform group-hover:translate-x-1 transition shrink-0 ml-1" />
                </div>
                <p className="text-xs text-slate-300 font-sans mt-1.5 leading-snug">
                  {link.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </article>
  );
};
