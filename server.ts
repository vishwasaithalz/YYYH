import express from "express";
import path from "path";
import fs from "fs";
import compression from "compression";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// In-memory summary cache to minimize LLM calls as much as possible
const summaryCache = new Map<string, string>();

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Completely disable and permanently strip X-Powered-By header
  app.disable("x-powered-by");
  app.set("x-powered-by", false);

  // Global response headers middleware for performance, security & complete suppression of X-Powered-By
  app.use((_req, res, next) => {
    res.removeHeader("X-Powered-By");
    res.removeHeader("x-powered-by");

    const origSetHeader = res.setHeader.bind(res);
    res.setHeader = function(field: string, val: any) {
      if (typeof field === "string" && field.toLowerCase() === "x-powered-by") {
        return this;
      }
      return origSetHeader(field, val);
    };

    const origWriteHead = res.writeHead.bind(res);
    res.writeHead = function(statusCode: number, ...args: any[]) {
      res.removeHeader("X-Powered-By");
      res.removeHeader("x-powered-by");
      return origWriteHead(statusCode, ...args);
    };

    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Content-Security-Policy", "default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval'; img-src 'self' https: data: blob:; font-src 'self' https: data:; connect-src 'self' https: wss:;");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    next();
  });

  // 2. Compressed HTML & static content transfer server middleware (Gzip / Deflate)
  // Improves Time-to-First-Byte (TTFB) and Largest Contentful Paint (LCP) across all network speeds
  app.use(compression({
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
    threshold: 0, // Compress all text, HTML, and script transfers
    level: 6,     // Optimal speed-to-compression ratio
  }));

  // 301 Canonical Domain & URL Normalization Redirects
  app.use((req, res, next) => {
    const host = (req.headers["x-forwarded-host"] as string) || req.headers.host || "";
    // 301 redirect www.yinyangyohackers.com -> yinyangyohackers.com (Single canonical version of domain)
    if (host.toLowerCase().startsWith("www.yinyangyohackers.com")) {
      return res.redirect(301, `https://yinyangyohackers.com${req.originalUrl}`);
    }
    next();
  });

  // Crawl Directives & Machine-Readable Sitemaps/Feeds
  // Content-Type header should be text/plain or text/plain; charset=utf-8 for text files
  app.use((req, res, next) => {
    if (req.path.endsWith('.txt')) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    }
    next();
  });

  app.get("/sitemap.xml", (_req, res) => {
    const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.sendFile(sitemapPath);
  });

  // Agentic Resource Discovery (ARD) AI Catalog Manifest
  app.get(["/.well-known/ai-catalog.json", "/ai-catalog.json"], (_req, res) => {
    const catalogPath = path.join(process.cwd(), "public", ".well-known", "ai-catalog.json");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.sendFile(catalogPath);
  });

  app.get(["/robots.txt", "/security.txt", "/.well-known/security.txt", "/ads.txt"], (req, res) => {
    let relPath = "robots.txt";
    if (req.path.includes("security.txt")) {
      relPath = "security.txt";
    } else if (req.path.includes("ads.txt")) {
      relPath = "ads.txt";
    }
    const txtPath = path.join(process.cwd(), "public", relPath);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.sendFile(txtPath);
  });

  app.get(["/feed.xml", "/rss.xml"], (req, res) => {
    const fileName = req.path.includes("rss") ? "rss.xml" : "feed.xml";
    const filePath = path.join(process.cwd(), "public", fileName);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.sendFile(filePath);
  });

  // Explicit Favicon & Web Manifest delivery with strict MIME types and caching
  app.get(["/favicon.ico", "/favicon.svg", "/favicon-16x16.png", "/favicon-32x32.png", "/apple-touch-icon.png", "/site.webmanifest"], (req, res) => {
    const cleanFile = req.path.replace(/^\//, "");
    const assetPath = path.join(process.cwd(), "public", cleanFile);
    if (cleanFile.endsWith(".ico")) {
      res.setHeader("Content-Type", "image/x-icon");
    } else if (cleanFile.endsWith(".svg")) {
      res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    } else if (cleanFile.endsWith(".png")) {
      res.setHeader("Content-Type", "image/png");
    } else if (cleanFile.endsWith(".webmanifest")) {
      res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
    }
    res.setHeader("Cache-Control", "public, max-age=604800, immutable");
    res.sendFile(assetPath);
  });

  // Blogger Theme XML Export & Direct Download
  app.get(["/blogger-theme.xml", "/blogger-theme"], (req, res) => {
    const themePath = path.join(process.cwd(), "public", "blogger-theme.xml");
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    if (req.query.download === "1" || req.path === "/blogger-theme") {
      res.setHeader("Content-Disposition", 'attachment; filename="yinyangyohackers-blogger-theme.xml"');
    }
    res.sendFile(themePath);
  });

  // Blogger Posts Atom XML Export (59 Articles Ready to Import)
  app.get(["/blogger-posts.xml", "/blogger-posts"], (req, res) => {
    const postsPath = path.join(process.cwd(), "public", "blogger-posts.xml");
    res.setHeader("Content-Type", "application/atom+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    if (req.query.download === "1" || req.path === "/blogger-posts") {
      res.setHeader("Content-Disposition", 'attachment; filename="yinyangyohackers-blogger-posts.xml"');
    }
    res.sendFile(postsPath);
  });

  app.use(express.json({ limit: "5mb" }));

  // API Route: Executive Summary powered by Gemini (Cached & Token-Minimized)
  app.post("/api/summarize-article", async (req, res) => {
    try {
      const { title, category, summary, content, tags } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Article title is required." });
      }

      // Check in-memory cache to prevent redundant LLM invocations
      const cacheKey = title.trim().toLowerCase();
      if (summaryCache.has(cacheKey)) {
        return res.json({ summary: summaryCache.get(cacheKey), isFallback: false, cached: true });
      }

      const ai = getAIClient();
      if (!ai) {
        // Deterministic fallback summary if GEMINI_API_KEY is not yet populated
        const fallbackText = `### ⚡ Executive Overview\n${summary || title}\n\n### 🎯 Key Threat & Architecture Vectors\n* **Category**: ${category || 'Cybersecurity'}\n* **Key Focus**: ${Array.isArray(tags) && tags.length > 0 ? tags.join(', ') : 'Infrastructure hardening, adversarial analysis, zero-trust'}\n* **Architecture**: Production-tested blueprints designed for sovereign defense and verifiable security.\n\n### 🛡️ Actionable Engineering Takeaways\n* Review step-by-step terminal commands and configurations provided in the guide.\n* Verify baseline permissions, audit logs, and firewall configurations in a test environment.\n* Test failover scenarios and ensure offline or air-gapped recovery pathways.\n\n*(Note: Configure GEMINI_API_KEY in your AI Studio settings for live Gemini AI synthesis)*`;
        summaryCache.set(cacheKey, fallbackText);
        return res.json({ summary: fallbackText, isFallback: true });
      }

      // Highly condensed content excerpt (max 1500 chars) to minimize input tokens
      const cleanText = typeof content === "string"
        ? content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 1500)
        : (summary || title).slice(0, 500);

      const prompt = `You are a Principal Cybersecurity Analyst for YinYangYoHackers.
Generate an executive summary of this security article in clean Markdown:
Title: ${title}
Category: ${category || "Cybersecurity"}
Content: ${cleanText}

Format strictly:
### ⚡ Executive Overview
(2 crisp sentences on thesis and risk)

### 🎯 Key Threat & Architecture Vectors
* (Vector 1: exploit mechanism)
* (Vector 2: architectural exposure)

### 🛡️ Actionable Engineering Takeaways
* (Action 1: immediate verification step)
* (Action 2: defensive hardening rule)`;

      let responseText: string | null = null;
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            maxOutputTokens: 300,
            temperature: 0.2
          }
        });
        responseText = response.text || null;
      } catch (geminiErr: any) {
        console.warn("Primary gemini-2.5-flash error, falling back...", geminiErr?.message);
        try {
          const fallbackResp = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
            config: {
              maxOutputTokens: 250,
              temperature: 0.2
            }
          });
          responseText = fallbackResp.text || null;
        } catch (secondaryErr: any) {
          console.warn("Secondary model fallback failed:", secondaryErr?.message);
        }
      }

      if (responseText) {
        summaryCache.set(cacheKey, responseText);
        return res.json({ summary: responseText, isFallback: false });
      }

      // Deterministic synthesis if upstream AI service is unavailable
      const offlineText = `### ⚡ Executive Overview\n${summary || title}\n\n### 🎯 Key Threat & Architecture Vectors\n* **Primary Vector**: Exploitation or architectural exposure documented in "${title}".\n* **Category Focus**: ${category || "Defensive Architecture"} security primitives and threat surface verification.\n\n### 🛡️ Actionable Engineering Takeaways\n* Implement baseline configuration checks and audit active endpoints.\n* Enforce least-privilege credentials and test in isolated staging.`;
      summaryCache.set(cacheKey, offlineText);
      return res.json({ summary: offlineText, isFallback: true });
    } catch (error: any) {
      console.error("Gemini summary error:", error);
      return res.status(500).json({
        error: error?.message || "Failed to generate summary with Gemini API."
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "YinYangYoHackers API" });
  });

  // Dedicated custom 404 error page endpoint (responds with HTTP 404 status)
  app.get(["/404", "/404.html"], (_req, res) => {
    res.status(404);
    const prod404 = path.join(process.cwd(), "dist", "404.html");
    const public404 = path.join(process.cwd(), "public", "404.html");
    res.sendFile(process.env.NODE_ENV === "production" ? prod404 : public404);
  });

  // API 404 Fallback
  app.all("/api/*", (_req, res) => {
    res.status(404).json({ error: "Endpoint not found", status: 404 });
  });

  function minifyHtml(rawHtml: string): string {
    return rawHtml
      .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n\s*\n/g, '\n');
  }

  // Vite middleware in dev or static files in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, {
      index: false,
      maxAge: "1y",
      etag: true,
      lastModified: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "public, max-age=300, must-revalidate");
        } else if (filePath.endsWith(".txt")) {
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.setHeader("Cache-Control", "public, max-age=86400");
        } else if (filePath.endsWith(".map")) {
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else if (filePath.match(/\.(js|css|woff2|woff|svg|png|jpg|jpeg|webp|ico|xml|json)$/)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      }
    }));
    app.get("*", (req, res) => {
      res.setHeader("Cache-Control", "public, max-age=300, must-revalidate");
      try {
        const indexPath = path.join(distPath, "index.html");
        if (fs.existsSync(indexPath)) {
          const rawHost = ((req.headers["x-forwarded-host"] as string) || req.headers.host || "yinyangyohackers.ai.studio").split(",")[0].trim();
          const host = rawHost.replace(/^www\./i, "");
          // Strictly enforce HTTPS as the preferred canonical protocol even if requested via HTTP
          const origin = `https://${host}`;
          const cleanPath = req.path.replace(/\/$/, '') || '/';
          const currentUrl = `${origin}${cleanPath === '/' ? '/' : cleanPath}`;

          let html = fs.readFileSync(indexPath, "utf-8");
          html = html.replace(/<link rel="canonical" href="[^"]*"/g, `<link rel="canonical" href="${currentUrl}"`);
          html = html.replace(/<link rel="alternate" hreflang="en" href="[^"]*"/g, `<link rel="alternate" hreflang="en" href="${currentUrl}"`);
          html = html.replace(/<link rel="alternate" hreflang="x-default" href="[^"]*"/g, `<link rel="alternate" hreflang="x-default" href="${currentUrl}"`);
          html = html.replace(/<link rel="sitemap"([^>]*?)href="[^"]*"/g, `<link rel="sitemap"$1href="https://yinyangyohackers.ai.studio/sitemap.xml"`);
          html = html.replace(/<link rel="alternate"([^>]*?)href="\/([^"]*)"/g, `<link rel="alternate"$1href="${origin}/$2"`);
          html = html.replace(/<link rel="alternate"([^>]*?)href="https?:\/\/yinyangyohackers\.(com|ai\.studio)\/([^"]*)"/g, `<link rel="alternate"$1href="${origin}/$3"`);
          html = html.replace(/<meta property="og:url" content="[^"]*"/g, `<meta property="og:url" content="${currentUrl}"`);
          // Transform any bundled stylesheet links into non-blocking preload links
          html = html.replace(
            /<link rel="stylesheet"([^>]*?)href="(\/assets\/[^"]+\.css)"([^>]*)>/g,
            `<link rel="preload" as="style"$1href="$2"$3 onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet"$1href="$2"$3></noscript>`
          );

          const minified = minifyHtml(html);
          res.setHeader("Link", `<${currentUrl}>; rel="canonical"`);
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          return res.send(minified);
        }
      } catch (e) {
        console.error("Error serving index.html:", e);
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
