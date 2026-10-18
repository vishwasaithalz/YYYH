import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items, className = '' }) => {
  // Generate JSON-LD Schema.org BreadcrumbList for search engine rich snippets
  const schemaBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href || (typeof window !== 'undefined' ? window.location.href : 'https://yinyangyohackers.com/')
    }))
  };

  return (
    <nav 
      aria-label="Breadcrumb Navigation" 
      itemScope 
      itemType="https://schema.org/BreadcrumbList"
      className={`w-full py-2 px-3.5 bg-[#070b14] border border-slate-800 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-2.5 overflow-x-auto scrollbar-none ${className}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumbs) }}
      />
      
      {items.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 select-none" aria-hidden="true" />
            )}

            <div 
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
              className="flex items-center gap-1.5 shrink-0"
            >
              <span itemProp="position" className="hidden">{index + 1}</span>

              {item.onClick ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  itemProp="item"
                  className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-3 min-h-[48px] min-w-[48px] rounded-md hover:text-emerald-300 transition-colors cursor-pointer ${
                    isLast || item.active ? 'text-emerald-300 font-semibold' : 'text-slate-200'
                  }`}
                >
                  {isFirst && <Home className="w-3.5 h-3.5 text-emerald-400" />}
                  <span itemProp="name">{item.label}</span>
                </button>
              ) : item.href ? (
                <a
                  href={item.href}
                  itemProp="item"
                  className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-3 min-h-[48px] min-w-[48px] rounded-md hover:text-emerald-300 transition-colors cursor-pointer ${
                    isLast || item.active ? 'text-emerald-300 font-semibold' : 'text-slate-200'
                  }`}
                >
                  {isFirst && <Home className="w-3.5 h-3.5 text-emerald-400" />}
                  <span itemProp="name">{item.label}</span>
                </a>
              ) : (
                <span 
                  itemProp="name" 
                  className={`inline-flex items-center gap-1.5 py-2.5 px-3 min-h-[48px] ${
                    isLast || item.active ? 'text-slate-100 font-bold' : 'text-slate-300'
                  }`}
                >
                  {isFirst && <Home className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{item.label}</span>
                </span>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </nav>
  );
};
