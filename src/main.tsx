import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Synchronize canonical, alternate, and sitemap links with the HTTPS origin (without triggering client-side redirect loops)
if (typeof window !== 'undefined') {
  try {
    const origin = window.location.origin.replace(/^http:\/\//i, 'https://');
    const cleanPath = (window.location.pathname === '/index.html' ? '/' : window.location.pathname.replace(/\/$/, '')) || '/';
    const currentUrl = origin + (cleanPath === '/' ? '/' : cleanPath);

    const can = document.getElementById('canonical-url-tag');
    if (can) can.setAttribute('href', currentUrl);

    const altEn = document.getElementById('alternate-en-tag');
    if (altEn) altEn.setAttribute('href', currentUrl);

    const altDef = document.getElementById('alternate-default-tag');
    if (altDef) altDef.setAttribute('href', currentUrl);

    const altRss = document.getElementById('rss-alternate-tag') || document.getElementById('alternate-rss-tag');
    if (altRss) altRss.setAttribute('href', `${origin}/rss.xml`);

    const altAtom = document.getElementById('atom-alternate-tag') || document.getElementById('alternate-atom-tag');
    if (altAtom) altAtom.setAttribute('href', `${origin}/feed.xml`);

    const altLlms = document.getElementById('llms-alternate-tag') || document.getElementById('alternate-llms-tag');
    if (altLlms) altLlms.setAttribute('href', `${origin}/llms.txt`);

    const sitemapTag = document.getElementById('sitemap-link-tag') || document.getElementById('sitemap-url-tag');
    if (sitemapTag) sitemapTag.setAttribute('href', 'https://yinyangyohackers.ai.studio/sitemap.xml');

    const og = document.getElementById('og-url-tag');
    if (og) og.setAttribute('content', currentUrl);
  } catch {
    // ignore
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
