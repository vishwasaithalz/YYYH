import { Article } from '../types';

/**
 * Escapes XML special characters
 */
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Formats date into RFC 822 / UTC format for RSS 2.0
 */
function formatRfc822Date(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return new Date().toUTCString();
    }
    return d.toUTCString();
  } catch {
    return new Date().toUTCString();
  }
}

/**
 * Builds HTML representation of article body for RSS <content:encoded>
 */
function buildArticleContentHtml(article: Article, originUrl: string): string {
  if (article.rawHtml && article.rawHtml.length > 50) {
    return article.rawHtml;
  }

  let html = '';
  if (article.coverImage?.src) {
    html += `<p><img src="${article.coverImage.src}" alt="${escapeXml(article.coverImage.alt || article.title)}" style="max-width: 100%; height: auto; border-radius: 8px;" /></p>\n`;
  }

  if (article.subtitle) {
    html += `<p><strong><em>${escapeXml(article.subtitle)}</em></strong></p>\n`;
  }

  if (article.intro && article.intro.length > 0) {
    article.intro.forEach(p => {
      html += `<p>${escapeXml(p)}</p>\n`;
    });
  }

  if (article.sections && article.sections.length > 0) {
    article.sections.forEach(sec => {
      if (sec.heading) {
        html += `<h3>${escapeXml(sec.heading)}</h3>\n`;
      }
      if (sec.body && Array.isArray(sec.body)) {
        sec.body.forEach(bp => {
          html += `<p>${escapeXml(bp)}</p>\n`;
        });
      }
      if (sec.codeBlock?.code) {
        html += `<pre><code>${escapeXml(sec.codeBlock.code)}</code></pre>\n`;
      }
      if (sec.callout?.text) {
        html += `<blockquote><p>${escapeXml(sec.callout.text)}</p></blockquote>\n`;
      }
    });
  }

  html += `<hr />\n<p>Originally published on <a href="${originUrl}/#${article.slug}">YinYangYoHackers</a> by ${escapeXml(article.author?.name || 'YinYangYoHackers Research Staff')}.</p>`;

  return html;
}

/**
 * Generates valid RSS 2.0 XML feed string from an array of articles
 */
export function generateRssXml(
  articles: Article[],
  siteUrl: string = 'https://yinyangyohackers.com'
): string {
  const currentYear = new Date().getFullYear();
  const buildDate = new Date().toUTCString();

  const itemsXml = articles
    .map(article => {
      const articleUrl = `${siteUrl}/#${article.slug}`;
      const pubDate = formatRfc822Date(article.date);
      const authorEmail = 'contact@yinyangyohackers.ai.studio (YinYangYoHackers Research Staff)';
      const description = article.seo?.metaDescription || article.summary || article.subtitle || '';
      const contentHtml = buildArticleContentHtml(article, siteUrl);

      const categoryTags = [
        article.category,
        article.subcategory,
        ...(article.tags || [])
      ].filter(Boolean);

      const categoriesXml = categoryTags
        .map(cat => `      <category><![CDATA[${cat}]]></category>`)
        .join('\n');

      return `    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${authorEmail}</author>
${categoriesXml}
      <description><![CDATA[${description}]]></description>
      <content:encoded><![CDATA[${contentHtml}]]></content:encoded>
      ${article.coverImage?.src ? `<enclosure url="${article.coverImage.src}" type="image/jpeg" length="0" />` : ''}
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>YinYangYoHackers: Cybersecurity Research, Autonomous Systems &amp; OpenSource Tools</title>
    <link>${siteUrl}</link>
    <description>Founded in 2013 by YinYangYoHackers Research Staff, YinYangYoHackers fuses three core computational pillars: Yin (defensive zero trust hardening), Yang (adversarial red teaming and penetration testing), and Yo (autonomous systems tech and open source computing freedom). We deliver battle tested Cybersecurity Research, private on-premise compute pipelines, and audited OpenSource Tools.</description>
    <language>en-us</language>
    <copyright>© 2013 to ${currentYear} YinYangYoHackers. Founded by YinYangYoHackers Research Staff.</copyright>
    <managingEditor>contact@yinyangyohackers.ai.studio (YinYangYoHackers Security Lab)</managingEditor>
    <webMaster>contact@yinyangyohackers.ai.studio (YinYangYoHackers Web Operations)</webMaster>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <generator>YinYangYoHackers Custom RSS Engine</generator>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteUrl}/favicon.ico</url>
      <title>YinYangYoHackers</title>
      <link>${siteUrl}</link>
    </image>
${itemsXml}
  </channel>
</rss>`;
}

/**
 * Triggers browser download of generated rss.xml
 */
export function downloadRssFeed(articles: Article[], filename = 'rss.xml'): void {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://yinyangyohackers.com';
  const xml = generateRssXml(articles, origin);
  const blob = new Blob([xml], { type: 'application/rss+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
