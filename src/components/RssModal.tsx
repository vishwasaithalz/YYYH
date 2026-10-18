import React, { useState } from 'react';
import { 
  Rss, 
  X, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Code2, 
  Radio, 
  Sparkles,
  Layers
} from 'lucide-react';
import { Article } from '../types';
import { generateRssXml, downloadRssFeed } from '../utils/rssGenerator';

interface RssModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
}

export const RssModal: React.FC<RssModalProps> = ({
  isOpen,
  onClose,
  articles
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'subscribe' | 'preview'>('subscribe');

  if (!isOpen) return null;

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yinyangyohackers.com';
  const rssUrl = `${originUrl}/rss.xml`;
  const rssXmlContent = generateRssXml(articles, originUrl);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(rssUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const readers = [
    {
      name: 'Feedly',
      url: `https://feedly.com/i/subscription/feed/${encodeURIComponent(rssUrl)}`,
      badge: 'Web & Mobile'
    },
    {
      name: 'Inoreader',
      url: `https://www.inoreader.com/?add_feed=${encodeURIComponent(rssUrl)}`,
      badge: 'Power Reader'
    },
    {
      name: 'NewsBlur',
      url: `https://www.newsblur.com/?url=${encodeURIComponent(rssUrl)}`,
      badge: 'Open Source'
    }
  ];

  return (
    <div 
      id="rss-subscription-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#090d16] border border-emerald-800/80 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.2)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-[#050811] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-500/20 border border-orange-500/50 flex items-center justify-center text-orange-400">
              <Rss className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <span>RSS Feed &amp; Live Syndication</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-normal">
                  v2.0 Validated
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Subscribe in your favorite RSS reader to receive zero-day disclosures and systems blueprints.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Nav */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-[#070b14] text-xs font-mono">
          <button
            onClick={() => setActiveTab('subscribe')}
            className={`pb-3 px-2 border-b-2 font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'subscribe'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Subscribe &amp; Quick Readers</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-3 px-2 border-b-2 font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'preview'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Live XML Preview ({articles.length} Posts)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm font-sans">
          {activeTab === 'subscribe' ? (
            <>
              {/* RSS Feed URL Box */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Feed Endpoint URL:</span>
                  <span className="text-emerald-400 text-[11px] font-normal">Auto-Updated &bull; 100% Real-Time</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#040711] border border-slate-700/90 rounded-xl px-3.5 py-2.5 font-mono text-xs text-emerald-300 truncate select-all">
                    {rssUrl}
                  </div>
                  <button
                    onClick={handleCopyUrl}
                    className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied URL!' : 'Copy URL'}</span>
                  </button>
                </div>
              </div>

              {/* One-click Reader Launchers */}
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>1-Click Add to Feed Readers:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {readers.map(reader => (
                    <a
                      key={reader.name}
                      href={reader.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-[#050811] hover:bg-slate-900 border border-slate-800 hover:border-emerald-600/70 rounded-xl transition-all flex flex-col justify-between group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white font-mono text-sm group-hover:text-emerald-400 transition-colors">
                          {reader.name}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {reader.badge}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Native Download & Desktop Apps */}
              <div className="p-4 bg-[#050811] border border-slate-800/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-xs font-mono text-white">Download Standalone XML File</span>
                  </div>
                  <button
                    onClick={() => downloadRssFeed(articles, 'yinyangyohackers-rss.xml')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .xml</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Compatible with NetNewsWire, Thunderbird, Reeder, Fluent Reader, miniflux, and custom Python/Node automation pipelines.
                </p>
              </div>
            </>
          ) : (
            /* Live XML Preview */
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Total Items in Feed: {articles.length} posts</span>
                <button
                  onClick={() => downloadRssFeed(articles, 'rss.xml')}
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Download XML</span>
                </button>
              </div>
              <pre className="p-4 bg-[#03060f] border border-slate-800 rounded-xl text-[11px] font-mono text-emerald-400/90 max-h-[380px] overflow-auto whitespace-pre-wrap break-all leading-relaxed select-all">
                {rssXmlContent}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#050811] px-6 py-3.5 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Includes full plaintext content &amp; CDATA HTML</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
