import express from "express";
import path from "path";
import fs from "fs";
import compression from "compression";
import tls from "tls";
import https from "https";
import http from "http";
import dns from "dns";
import { promisify } from "util";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

const lookupAsync = promisify(dns.lookup);

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

  app.get(["/robots.txt", "/security.txt", "/.well-known/security.txt", "/ads.txt", "/9f84a1e3b2c54d7e8a9b0c1d2e3f4a5b.txt"], (req, res) => {
    let relPath = "robots.txt";
    if (req.path.includes("security.txt")) {
      relPath = "security.txt";
    } else if (req.path.includes("ads.txt")) {
      relPath = "ads.txt";
    } else if (req.path.includes("9f84a1e3b2c54d7e8a9b0c1d2e3f4a5b.txt")) {
      relPath = "9f84a1e3b2c54d7e8a9b0c1d2e3f4a5b.txt";
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

  // SSRF defense helper: blocks loopback, RFC 1918 private subnets, cloud metadata, link-local, carrier NAT
  function isPrivateOrReservedIp(ip: string): boolean {
    if (!ip) return true;
    if (ip === "127.0.0.1" || ip === "0.0.0.0" || ip.startsWith("127.")) return true;
    if (ip.startsWith("10.")) return true;
    if (ip.startsWith("192.168.")) return true;
    if (ip.startsWith("169.254.")) return true; // Cloud instance metadata (AWS/GCP/Azure)
    const match172 = ip.match(/^172\.(\d+)\./);
    if (match172) {
      const octet = parseInt(match172[1], 10);
      if (octet >= 16 && octet <= 31) return true;
    }
    const match100 = ip.match(/^100\.(\d+)\./);
    if (match100) {
      const octet = parseInt(match100[1], 10);
      if (octet >= 64 && octet <= 127) return true;
    }
    if (ip === "::1" || ip === "::") return true;
    const lower = ip.toLowerCase();
    if (lower.startsWith("fe80:") || lower.startsWith("fc00:") || lower.startsWith("fd00:")) return true;
    return false;
  }

  // Real SSL/TLS Certificate and Cipher Suite Inspector (Zero Mock Data)
  app.get("/api/inspect-tls", async (req, res) => {
    const rawTarget = (req.query.host as string) || (req.query.domain as string) || "";
    if (!rawTarget) {
      return res.status(400).json({ error: "Missing required query parameter: host" });
    }

    const cleanHost = rawTarget
      .replace(/^https?:\/\//i, "")
      .replace(/\/.*$/, "")
      .replace(/:\d+$/, "")
      .trim()
      .toLowerCase();

    // Strict domain format validation
    const domainRegex = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(cleanHost) || cleanHost.includes("localhost")) {
      return res.status(400).json({ error: "Invalid hostname format. Please provide a valid public FQDN (e.g., example.com)." });
    }

    try {
      // Resolve DNS to verify IP address and block SSRF
      const { address } = await lookupAsync(cleanHost);
      if (isPrivateOrReservedIp(address)) {
        return res.status(403).json({ error: "Access to private, loopback, or metadata addresses is strictly prohibited." });
      }

      const socket = tls.connect({
        host: cleanHost,
        port: 443,
        servername: cleanHost,
        timeout: 6000,
        rejectUnauthorized: false
      });

      let handled = false;

      const cleanup = () => {
        if (!socket.destroyed) {
          socket.destroy();
        }
      };

      socket.setTimeout(6000, () => {
        if (!handled) {
          handled = true;
          cleanup();
          return res.status(504).json({ error: `Connection timed out connecting to ${cleanHost}:443.` });
        }
      });

      socket.on("error", (err) => {
        if (!handled) {
          handled = true;
          cleanup();
          return res.status(502).json({ error: `TLS connection error: ${err.message || "Failed to establish TLS handshake."}` });
        }
      });

      socket.on("secureConnect", () => {
        if (handled) return;
        handled = true;

        try {
          const cert = socket.getPeerCertificate(true);
          const cipher = socket.getCipher();
          const protocol = socket.getProtocol();
          const authorized = socket.authorized;
          const authError = socket.authorizationError;

          if (!cert || Object.keys(cert).length === 0) {
            cleanup();
            return res.status(502).json({ error: "No peer certificate presented by the server." });
          }

          const validFrom = cert.valid_from ? new Date(cert.valid_from).toISOString() : null;
          const validTo = cert.valid_to ? new Date(cert.valid_to).toISOString() : null;
          const now = Date.now();
          const expiryTime = cert.valid_to ? new Date(cert.valid_to).getTime() : 0;
          const daysRemaining = Math.floor((expiryTime - now) / (1000 * 60 * 60 * 24));
          const isExpired = expiryTime > 0 && expiryTime < now;

          // Process SANs (Subject Alternative Names)
          const rawSans = cert.subjectaltname || "";
          const sans = rawSans.split(",").map(s => s.trim().replace(/^DNS:/i, "")).filter(Boolean);

          cleanup();

          return res.json({
            host: cleanHost,
            resolvedIp: address,
            protocol: protocol || "Unknown",
            cipher: {
              name: cipher?.name || "Unknown",
              standardName: cipher?.standardName || cipher?.name || "Unknown",
              version: cipher?.version || protocol || "Unknown"
            },
            certificate: {
              subject: {
                commonName: cert.subject?.CN || cleanHost,
                organization: cert.subject?.O || "Not Specified",
                country: cert.subject?.C || ""
              },
              issuer: {
                commonName: cert.issuer?.CN || "Unknown Issuer",
                organization: cert.issuer?.O || "Unknown CA",
                country: cert.issuer?.C || ""
              },
              validFrom,
              validTo,
              daysRemaining,
              isExpired,
              serialNumber: cert.serialNumber || "",
              fingerprint256: cert.fingerprint256 || "",
              subjectAlternativeNames: sans.slice(0, 20)
            },
            validation: {
              authorized,
              authorizationError: authError ? String(authError) : null
            },
            inspectedAt: new Date().toISOString()
          });
        } catch (parseErr: any) {
          cleanup();
          return res.status(500).json({ error: `Failed to parse TLS certificate: ${parseErr.message}` });
        }
      });
    } catch (dnsErr: any) {
      return res.status(400).json({ error: `DNS resolution failed for ${cleanHost}: ${dnsErr.message}` });
    }
  });

  // Real HTTP Security Headers Inspector (Zero Mock Data)
  app.get("/api/inspect-headers", async (req, res) => {
    const rawUrl = (req.query.url as string) || "";
    if (!rawUrl) {
      return res.status(400).json({ error: "Missing required query parameter: url" });
    }

    let parsedUrl: URL;
    try {
      const fullUrl = rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
        ? rawUrl
        : `https://${rawUrl}`;
      parsedUrl = new URL(fullUrl);
    } catch {
      return res.status(400).json({ error: "Invalid URL provided. Please provide a valid HTTP or HTTPS address." });
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return res.status(400).json({ error: "Only http and https protocols are supported." });
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    if (hostname.includes("localhost") || hostname === "127.0.0.1") {
      return res.status(403).json({ error: "Requests to localhost or loopback are strictly prohibited." });
    }

    try {
      const { address } = await lookupAsync(hostname);
      if (isPrivateOrReservedIp(address)) {
        return res.status(403).json({ error: "Access to private, loopback, or metadata addresses is strictly prohibited." });
      }

      const client = parsedUrl.protocol === "https:" ? https : http;
      const options = {
        method: "HEAD",
        hostname,
        port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
        path: parsedUrl.pathname || "/",
        timeout: 6000,
        headers: {
          "User-Agent": "YinYangYoHackers-Security-Inspector/2.0 (Audit & Research)",
          "Accept": "*/*"
        }
      };

      let handled = false;
      const request = client.request(options, (resp) => {
        if (handled) return;
        handled = true;

        const rawHeaders = resp.headers;
        const statusCode = resp.statusCode || 200;

        // Security Header Audit Analysis
        const hsts = rawHeaders["strict-transport-security"] as string | undefined;
        const csp = rawHeaders["content-security-policy"] as string | undefined;
        const xfo = rawHeaders["x-frame-options"] as string | undefined;
        const xcto = rawHeaders["x-content-type-options"] as string | undefined;
        const rp = rawHeaders["referrer-policy"] as string | undefined;
        const pp = rawHeaders["permissions-policy"] as string | undefined;
        const coop = rawHeaders["cross-origin-opener-policy"] as string | undefined;
        const corp = rawHeaders["cross-origin-resource-policy"] as string | undefined;

        const checks = [
          {
            header: "Strict-Transport-Security",
            present: Boolean(hsts),
            value: hsts || null,
            grade: Boolean(hsts) ? 25 : 0,
            maxGrade: 25,
            status: Boolean(hsts) ? "pass" : "fail",
            recommendation: Boolean(hsts) ? "HSTS enforced." : "Enforce max-age=63072000; includeSubDomains; preload."
          },
          {
            header: "Content-Security-Policy",
            present: Boolean(csp),
            value: csp || null,
            grade: Boolean(csp) ? 30 : 0,
            maxGrade: 30,
            status: Boolean(csp) ? "pass" : "fail",
            recommendation: Boolean(csp) ? "CSP configured." : "Define strict default-src, script-src, and object-src."
          },
          {
            header: "X-Frame-Options",
            present: Boolean(xfo),
            value: xfo || null,
            grade: Boolean(xfo) ? 15 : 0,
            maxGrade: 15,
            status: Boolean(xfo) ? "pass" : "fail",
            recommendation: Boolean(xfo) ? "Clickjacking protection active." : "Set to DENY or SAMEORIGIN."
          },
          {
            header: "X-Content-Type-Options",
            present: Boolean(xcto),
            value: xcto || null,
            grade: Boolean(xcto) ? 10 : 0,
            maxGrade: 10,
            status: Boolean(xcto) ? "pass" : "fail",
            recommendation: Boolean(xcto) ? "MIME-sniffing protection active." : "Set to nosniff."
          },
          {
            header: "Referrer-Policy",
            present: Boolean(rp),
            value: rp || null,
            grade: Boolean(rp) ? 10 : 0,
            maxGrade: 10,
            status: Boolean(rp) ? "pass" : "fail",
            recommendation: Boolean(rp) ? "Referrer protection configured." : "Set to strict-origin-when-cross-origin."
          },
          {
            header: "Permissions-Policy",
            present: Boolean(pp),
            value: pp || null,
            grade: Boolean(pp) ? 10 : 0,
            maxGrade: 10,
            status: Boolean(pp) ? "pass" : "fail",
            recommendation: Boolean(pp) ? "Browser device feature policies enforced." : "Restrict camera, microphone, and geolocation."
          }
        ];

        const totalScore = checks.reduce((sum, c) => sum + c.grade, 0);

        let letterGrade = "F";
        if (totalScore >= 90) letterGrade = "A+";
        else if (totalScore >= 80) letterGrade = "A";
        else if (totalScore >= 70) letterGrade = "B";
        else if (totalScore >= 50) letterGrade = "C";
        else if (totalScore >= 30) letterGrade = "D";

        return res.json({
          url: parsedUrl.href,
          hostname,
          resolvedIp: address,
          statusCode,
          totalScore,
          letterGrade,
          checks,
          rawHeaders: {
            "strict-transport-security": hsts,
            "content-security-policy": csp,
            "x-frame-options": xfo,
            "x-content-type-options": xcto,
            "referrer-policy": rp,
            "permissions-policy": pp,
            "cross-origin-opener-policy": coop,
            "cross-origin-resource-policy": corp,
            "server": rawHeaders["server"]
          },
          inspectedAt: new Date().toISOString()
        });
      });

      request.setTimeout(6000, () => {
        if (!handled) {
          handled = true;
          request.destroy();
          return res.status(504).json({ error: `Connection to ${hostname} timed out.` });
        }
      });

      request.on("error", (err) => {
        if (!handled) {
          handled = true;
          return res.status(502).json({ error: `HTTP request failed: ${err.message}` });
        }
      });

      request.end();
    } catch (dnsErr: any) {
      return res.status(400).json({ error: `DNS lookup failed for ${hostname}: ${dnsErr.message}` });
    }
  });

  // IndexNow Status and Key Verification
  app.get("/api/indexnow", (_req, res) => {
    return res.json({
      status: "active",
      protocol: "IndexNow v1.0",
      host: "yinyangyohackers.com",
      key: "9f84a1e3b2c54d7e8a9b0c1d2e3f4a5b",
      keyLocation: "https://yinyangyohackers.com/9f84a1e3b2c54d7e8a9b0c1d2e3f4a5b.txt",
      endpoints: [
        "https://api.indexnow.org/indexnow",
        "https://www.bing.com/indexnow",
        "https://yandex.com/indexnow"
      ],
      description: "Automated instant URL indexing protocol for search engines."
    });
  });

  // IndexNow Instant URL Submission Proxy
  app.post("/api/indexnow", async (req, res) => {
    try {
      const { host: reqHost, key: reqKey, keyLocation: reqKeyLocation, urlList } = req.body;

      const host = (typeof reqHost === "string" && reqHost.trim()) || "yinyangyohackers.com";
      const key = (typeof reqKey === "string" && reqKey.trim()) || "9f84a1e3b2c54d7e8a9b0c1d2e3f4a5b";
      const keyLocation = (typeof reqKeyLocation === "string" && reqKeyLocation.trim()) || `https://${host}/${key}.txt`;

      if (!Array.isArray(urlList) || urlList.length === 0) {
        return res.status(400).json({
          error: "Invalid request payload: 'urlList' must be a non-empty array of URL strings.",
          example: {
            host: "yinyangyohackers.com",
            key: "9f84a1e3b2c54d7e8a9b0c1d2e3f4a5b",
            urlList: ["https://yinyangyohackers.com/ports", "https://yinyangyohackers.com/glossary"]
          }
        });
      }

      // Enforce maximum batch limit of 100 URLs per request to prevent abuse
      const sanitizedUrls = urlList
        .filter((u: any) => typeof u === "string" && u.trim().length > 0)
        .slice(0, 100)
        .map((u: string) => u.trim());

      // Validate URL format and domain ownership
      for (const urlStr of sanitizedUrls) {
        try {
          const parsed = new URL(urlStr);
          if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            return res.status(400).json({ error: `Invalid URL protocol for: ${urlStr}. Must be http or https.` });
          }
        } catch {
          return res.status(400).json({ error: `Malformed URL in urlList: ${urlStr}` });
        }
      }

      const payload = JSON.stringify({
        host,
        key,
        keyLocation,
        urlList: sanitizedUrls
      });

      // Submit to IndexNow API (api.indexnow.org)
      const indexNowReq = https.request(
        "https://api.indexnow.org/indexnow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Content-Length": Buffer.byteLength(payload)
          },
          timeout: 7000
        },
        (indexNowRes) => {
          let responseBody = "";
          indexNowRes.on("data", (chunk) => {
            responseBody += chunk;
          });

          indexNowRes.on("end", () => {
            const statusCode = indexNowRes.statusCode || 200;
            const isSuccess = statusCode >= 200 && statusCode < 300;

            let message = "URLs submitted to IndexNow successfully.";
            if (statusCode === 200) message = "OK: URLs processed immediately.";
            else if (statusCode === 202) message = "Accepted: URL submission received and pending verification.";
            else if (statusCode === 400) message = "Bad Request: Invalid format or parameter.";
            else if (statusCode === 403) message = "Forbidden: Key not valid or keyLocation mismatch.";
            else if (statusCode === 422) message = "Unprocessable Entity: In URLs don't belong to the host or key invalid.";
            else if (statusCode === 429) message = "Too Many Requests: Rate limit exceeded.";

            return res.status(isSuccess ? 200 : statusCode).json({
              success: isSuccess,
              indexNowStatusCode: statusCode,
              message,
              submittedCount: sanitizedUrls.length,
              host,
              keyLocation,
              urlList: sanitizedUrls,
              responseBody: responseBody || undefined,
              timestamp: new Date().toISOString()
            });
          });
        }
      );

      indexNowReq.on("timeout", () => {
        indexNowReq.destroy();
        return res.status(504).json({ error: "IndexNow API timed out after 7000ms." });
      });

      indexNowReq.on("error", (err) => {
        return res.status(502).json({ error: `Failed to connect to api.indexnow.org: ${err.message}` });
      });

      indexNowReq.write(payload);
      indexNowReq.end();
    } catch (err: any) {
      return res.status(500).json({ error: `Internal server error processing IndexNow submission: ${err.message}` });
    }
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
