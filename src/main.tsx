import {StrictMode, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {SpeedInsights} from '@vercel/speed-insights/react';
import {Analytics} from '@vercel/analytics/react';
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

// Consent is checked on every outgoing event, not only on component mount.
// The provider SDK may leave an injected script running after React unmounts.
function hasUsageAnalyticsConsent(): boolean {
  try {
    return typeof window !== 'undefined' && window.localStorage.getItem('yyyh_usage_analytics_v1') === 'enabled';
  } catch {
    return false;
  }
}

function filterMetricsByConsent<T>(event: T): T | null {
  return hasUsageAnalyticsConsent() ? event : null;
}

// Neither SDK mounts until consent, and previously mounted SDKs are
// prevented from sending subsequent events when consent is withdrawn.
function PrivacyGatedSpeedInsights() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const update = () => {
      try {
        setEnabled(hasUsageAnalyticsConsent());
      } catch {
        setEnabled(false);
      }
    };
    update();
    window.addEventListener('yyyh-privacy-updated', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('yyyh-privacy-updated', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return enabled ? <><SpeedInsights beforeSend={filterMetricsByConsent} /><Analytics beforeSend={filterMetricsByConsent} /></> : null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <PrivacyGatedSpeedInsights />
  </StrictMode>,
);
