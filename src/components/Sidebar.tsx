import React from 'react';
import { 
  ShieldCheck, 
  Shield,
  Flame, 
  Tag, 
  Layers, 
  HelpCircle, 
  Cpu, 
  ShieldAlert, 
  Package
} from 'lucide-react';
import { Article, PrimaryCategory, ActiveSiteView } from '../types';
import { HackerBannerAd } from './HackerBannerAd';
import { HACKER_COVERS } from '../utils/hackerImages';

interface SidebarProps {
  articles: Article[];
  currentCategory: PrimaryCategory | 'All';
  onSelectCategory: (category: PrimaryCategory | 'All') => void;
  onSelectArticle: (article: Article) => void;
  onSelectArticleDirect?: (article: Article) => void;
  onSelectView?: (view: ActiveSiteView, path?: string) => void;
  onSelectTag?: (tag: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  articles,
  currentCategory,
  onSelectCategory,
  onSelectArticle,
  onSelectArticleDirect,
  onSelectView,
  onSelectTag
}) => {
  const handleArticleClick = onSelectArticleDirect || onSelectArticle;

  // Primary categories with counts
  const primaryCategories: (PrimaryCategory | 'All')[] = [
    'All',
    'Cyber Security',
    'Autonomous Systems Hub',
    'Security Tools'
  ];

  const getCategoryCount = (cat: PrimaryCategory | 'All') => {
    if (cat === 'All') return articles.length;
    return articles.filter(a => a.category === cat || (cat === 'Autonomous Systems Hub' && (a.category === 'Autonomous Systems Hub' || (a.category as string) === 'Autonomous Systems Hub' || (a.category as string) === 'Autonomous Systems & Productivity'))).length;
  };

  // Extract top tags
  const allTags = Array.from(new Set(articles.flatMap(a => a.tags)));

  // Trending articles sorted by views
  const trendingArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 4);

  return (
    <aside id="main-sidebar" aria-label="Security Intelligence Sidebar" className="w-full space-y-6">
      <h2 className="sr-only">Security Intelligence &amp; Author Dossier</h2>

      {/* 1. Author & Lead Security Research Widget */}
      <div id="widget-author-profile" itemScope itemType="https://schema.org/Person" className="bg-[#090d16] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative shrink-0">
            <picture>
              <source type="image/avif" srcSet="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=112&h=112&auto=format&fit=crop&q=80&fm=avif&cs=strip" />
              <source type="image/webp" srcSet="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=112&h=112&auto=format&fit=crop&q=80&fm=webp&cs=strip" />
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=112&h=112&auto=format&fit=crop&q=80&fm=webp&cs=strip" 
                alt="Vishwas Aithal" 
                itemProp="image"
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = HACKER_COVERS[0]; }}
                className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/60 aspect-square shadow-md"
              />
            </picture>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-black p-0.5 rounded-full" title="Founder & Lead Researcher">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-1.5 font-sans" itemProp="name">
              Vishwas Aithal
            </h3>
            <p className="text-xs sm:text-sm text-emerald-400 font-mono font-medium" itemProp="hasCredential">Cybersecurity Researcher</p>
            <p className="text-xs text-slate-400 font-sans" itemProp="jobTitle">Founder &amp; Technical Author</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 font-sans">
          Independent security researcher and founder of YinYangYoHackers (est. 2013). Authoring practical technical blueprints on penetration testing, zero-trust infrastructure, Linux hardening, and autonomous systems.
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 text-slate-300 font-mono">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Est. 2013 • Active Research</span>
          </div>
          {onSelectView && (
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                onSelectView('about', '/about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-emerald-300 hover:text-emerald-200 font-mono text-xs font-semibold underline decoration-emerald-500/50 hover:decoration-emerald-400 py-1.5 px-2 min-h-[38px] inline-flex items-center cursor-pointer"
            >
              Read Dossier &gt;
            </a>
          )}
        </div>
      </div>

      {/* 2. Autonomous Systems Knowledge Hub Spotlight */}
      <div id="widget-sovereign-ai-spotlight" className="bg-[#090d16] border border-cyan-900/60 rounded-xl p-4 shadow-lg space-y-3">
        <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="text-sm select-none" role="img" aria-label="Autonomous Tools">🤖</span>
            <span>Autonomous Tools &amp; Hub</span>
          </span>
          {onSelectView && (
            <a
              href="/sovereign-hub"
              onClick={(e) => {
                e.preventDefault();
                onSelectView('sovereign-hub', '/sovereign-hub');
              }}
              className="text-xs text-cyan-300 hover:text-cyan-200 font-mono underline py-1.5 px-2 min-h-[38px] inline-flex items-center cursor-pointer"
            >
              Master Hub &gt;
            </a>
          )}
        </h3>

        <div className="space-y-2 text-xs font-mono">
          {[
            { emoji: '🧠', name: 'Sovereign Compute & Model Custody', desc: 'Private on-premise model weights & GPUs', path: '/sovereign-ai', view: 'sovereign-ai' },
            { emoji: '🏠', name: 'Private Local Inference Nodes', desc: '100% offline Ollama & vLLM stack', path: '/private-local-ai', view: 'private-local-ai' },
            { emoji: '🔌', name: 'Air-Gapped Autonomous Systems', desc: 'Physical optical diode isolation', path: '/air-gapped-ai', view: 'air-gapped-ai' },
            { emoji: '🦙', name: 'Secure Ollama Deployment', desc: 'Hardened systemd sandboxing & TLS', path: '/ollama-security', view: 'ollama-security' },
            { emoji: '⚡', name: 'Private vLLM Infrastructure', desc: 'Distributed tensor parallelism guards', path: '/vllm-security', view: 'vllm-security' },
            { emoji: '🛡️', name: 'Local Model Security & Sandboxing', desc: 'SafeTensors & gVisor tool isolation', path: '/local-llm-security', view: 'local-llm-security' },
            { emoji: '🖲️', name: 'Sovereign GPU Cluster Architecture', desc: 'PCIe 5.0, NVLink & local vector vaults', path: '/sovereign-ai-infrastructure', view: 'sovereign-ai-infrastructure' },
            { emoji: '👁️‍🗨️', name: 'Data Privacy & PII Scrubbing', desc: 'Zero retention & GDPR/HIPAA compliance', path: '/ai-data-privacy', view: 'ai-data-privacy' }
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                if (onSelectView) onSelectView(item.view as ActiveSiteView, item.path);
              }}
              className="block w-full text-left p-2.5 min-h-[44px] rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 transition-all group cursor-pointer"
            >
              <div className="font-semibold text-slate-200 group-hover:text-cyan-300 truncate flex items-center gap-1.5">
                <span className="text-sm select-none">{item.emoji}</span>
                <span className="truncate">{item.name}</span>
              </div>
              <div className="text-[11px] text-slate-400 font-sans truncate pl-5">
                {item.desc}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 3. Interactive Tools Spotlight Widget */}
      <div id="widget-tools-spotlight" className="bg-[#090d16] border border-slate-800/80 rounded-xl p-4 shadow-lg space-y-3">
        <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="text-sm select-none" role="img" aria-label="Security Tools">🛠️</span>
            <span>Interactive Security Tools</span>
          </span>
          {onSelectView && (
            <a
              href="/tools"
              onClick={(e) => {
                e.preventDefault();
                onSelectView('tools', '/tools');
              }}
              className="text-xs text-emerald-300 hover:text-emerald-200 font-mono underline py-1.5 px-2 min-h-[38px] inline-flex items-center cursor-pointer"
            >
              All Tools &gt;
            </a>
          )}
        </h3>

        <div className="space-y-2 text-xs font-mono">
          {[
            { emoji: '🌐', name: 'CIDR & Subnet Calculator', desc: 'IPv4/IPv6 ranges & subnet masks', path: '/tools/cidr-calculator' },
            { emoji: '🧬', name: 'Cryptographic Hash Analyzer', desc: 'SHA-256, SHA-512 & MD5 validator', path: '/tools/hash-analyzer' },
            { emoji: '🔐', name: 'Password Entropy Calculator', desc: 'NIST brute-force resistance score', path: '/tools/password-entropy' },
            { emoji: '🛡️', name: 'HTTP Security Headers Tool', desc: 'CSP, HSTS & Permissions policy', path: '/tools/http-security-headers' },
            { emoji: '🔒', name: 'SSL/TLS Certificate Checker', desc: 'Cipher matrix & handshake verify', path: '/tools/ssl-checker' }
          ].map((tool, idx) => (
            <a
              key={idx}
              href={tool.path}
              onClick={(e) => {
                e.preventDefault();
                if (onSelectView) onSelectView('tools', tool.path);
              }}
              className="block w-full text-left p-2.5 min-h-[44px] rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 transition-all group cursor-pointer"
            >
              <div className="font-semibold text-slate-200 group-hover:text-emerald-300 truncate flex items-center gap-1.5">
                <span className="text-sm select-none">{tool.emoji}</span>
                <span className="truncate">{tool.name}</span>
              </div>
              <div className="text-[11px] text-slate-400 font-sans truncate pl-5">
                {tool.desc}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 3. Optimized High-CTR Sidebar 300x250 Banner Ad Slot */}
      <HackerBannerAd 
        placement="sidebar-rectangle" 
        sponsorKey="hackthebox"
        className="my-2"
      />

      {/* 4. Trending / Top Articles Widget */}
      <div id="widget-trending-posts" className="bg-[#090d16] border border-slate-800/80 rounded-xl p-4 shadow-lg">
        <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-400" />
          <span>Top Read Articles</span>
        </h3>
        <div className="space-y-3">
          {trendingArticles.map((article, idx) => (
            <a 
              key={article.id}
              href={`/${article.slug}`}
              aria-label={`Read top security analysis: ${article.title}`}
              onClick={(e) => {
                e.preventDefault();
                handleArticleClick(article);
              }}
              className="flex items-start gap-3 cursor-pointer group p-2 min-h-[44px] rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              <span className="font-mono text-base font-extrabold text-slate-300 group-hover:text-emerald-400 w-5">
                0{idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-100 group-hover:text-emerald-300 line-clamp-2 leading-snug font-sans">
                  {article.title}
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-2">
                  <span>{article.readTime}</span>
                  <span>•</span>
                  <span>{article.views.toLocaleString()} views</span>
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 5. Popular Tags */}
      <div id="widget-labels-cloud" className="bg-[#090d16] border border-slate-800/80 rounded-xl p-4 shadow-lg">
        <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-emerald-400" />
          <span>Popular Topics &amp; Tags</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {allTags.slice(0, 14).map((tag) => (
            <button 
              key={tag}
              type="button"
              onClick={() => onSelectTag && onSelectTag(tag)}
              className="text-xs px-3 py-1.5 min-h-[36px] rounded-lg bg-slate-900 text-slate-200 font-mono border border-slate-700 hover:text-emerald-300 hover:border-emerald-500/60 cursor-pointer transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
