import { computeMD5 } from '../src/utils/md5';

// 1. MD5 RFC 1321 Standard Test Vectors
console.log('--- TEST SUITE: Cryptographic & Systems Math ---');

const md5Vectors = [
  { input: '', expected: 'd41d8cd98f00b204e9800998ecf8427e' },
  { input: 'a', expected: '0cc175b9c0f1b6a831c399e269772661' },
  { input: 'abc', expected: '900150983cd24fb0d6963f7d28e17f72' },
  { input: 'message digest', expected: 'f96b697d7cb7938d525a2f31aaf161d0' },
  { input: 'abcdefghijklmnopqrstuvwxyz', expected: 'c3fcd3d76192e4007dfb496cca67e13b' }
];

let failedTests = 0;

for (const v of md5Vectors) {
  const result = computeMD5(v.input);
  if (result === v.expected) {
    console.log(`[PASS] MD5("${v.input}") === ${result}`);
  } else {
    console.error(`[FAIL] MD5("${v.input}") expected ${v.expected}, got ${result}`);
    failedTests++;
  }
}

// 2. CIDR / Subnet Math Tests
function calculateIpv4Subnet(prefix: number) {
  const total = Math.pow(2, 32 - prefix);
  const usable = prefix === 32 ? 1 : prefix === 31 ? 2 : Math.max(0, total - 2);
  const maskBits = prefix === 0 ? 0 : (((0xFFFFFFFF << (32 - prefix)) >>> 0));
  const mask = [
    (maskBits >>> 24) & 255,
    (maskBits >>> 16) & 255,
    (maskBits >>> 8) & 255,
    maskBits & 255
  ].join('.');
  return { total, usable, mask };
}

const cidrTests = [
  { prefix: 24, expectedTotal: 256, expectedUsable: 254, expectedMask: '255.255.255.0' },
  { prefix: 30, expectedTotal: 4, expectedUsable: 2, expectedMask: '255.255.255.252' },
  { prefix: 32, expectedTotal: 1, expectedUsable: 1, expectedMask: '255.255.255.255' },
  { prefix: 16, expectedTotal: 65536, expectedUsable: 65534, expectedMask: '255.255.0.0' }
];

for (const t of cidrTests) {
  const r = calculateIpv4Subnet(t.prefix);
  if (r.total === t.expectedTotal && r.usable === t.expectedUsable && r.mask === t.expectedMask) {
    console.log(`[PASS] CIDR /${t.prefix}: total=${r.total}, usable=${r.usable}, mask=${r.mask}`);
  } else {
    console.error(`[FAIL] CIDR /${t.prefix} mismatch:`, r);
    failedTests++;
  }
}

// 3. SSRF Defense Filter Tests
function isPrivateOrReservedIp(ip: string): boolean {
  if (!ip) return true;
  if (ip === "127.0.0.1" || ip === "0.0.0.0" || ip.startsWith("127.")) return true;
  if (ip.startsWith("10.")) return true;
  if (ip.startsWith("192.168.")) return true;
  if (ip.startsWith("169.254.")) return true;
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

const ssrfTests = [
  { ip: '127.0.0.1', shouldBlock: true },
  { ip: '127.0.0.53', shouldBlock: true },
  { ip: '10.0.1.15', shouldBlock: true },
  { ip: '192.168.1.1', shouldBlock: true },
  { ip: '172.16.5.10', shouldBlock: true },
  { ip: '172.31.255.254', shouldBlock: true },
  { ip: '169.254.169.254', shouldBlock: true }, // AWS / GCP metadata
  { ip: '::1', shouldBlock: true },
  { ip: '8.8.8.8', shouldBlock: false }, // Google DNS (public)
  { ip: '1.1.1.1', shouldBlock: false }, // Cloudflare DNS (public)
  { ip: '142.250.190.46', shouldBlock: false } // Public Google web IP
];

for (const s of ssrfTests) {
  const blocked = isPrivateOrReservedIp(s.ip);
  if (blocked === s.shouldBlock) {
    console.log(`[PASS] SSRF check for IP ${s.ip}: ${blocked ? 'BLOCKED' : 'ALLOWED'}`);
  } else {
    console.error(`[FAIL] SSRF check for IP ${s.ip} expected blocked=${s.shouldBlock}, got ${blocked}`);
    failedTests++;
  }
}

// 4. Shannon Entropy Tests
function calculateShannonEntropy(str: string): number {
  if (!str) return 0;
  let pool = 0;
  if (/[a-z]/.test(str)) pool += 26;
  if (/[A-Z]/.test(str)) pool += 26;
  if (/[0-9]/.test(str)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(str)) pool += 33;
  return Math.round(str.length * Math.log2(pool));
}

const entropyTests = [
  { str: 'password', minExpected: 35, maxExpected: 45 },
  { str: 'P@ssw0rd123!', minExpected: 70, maxExpected: 90 },
  { str: 'S0v3r3!gn_N3tw0rk#2026', minExpected: 130, maxExpected: 160 }
];

for (const e of entropyTests) {
  const ent = calculateShannonEntropy(e.str);
  if (ent >= e.minExpected && ent <= e.maxExpected) {
    console.log(`[PASS] Entropy("${e.str}") = ${ent} bits (within ${e.minExpected}-${e.maxExpected})`);
  } else {
    console.error(`[FAIL] Entropy("${e.str}") = ${ent} bits out of range`);
    failedTests++;
  }
}

// 5. Automated Semantic Link Generator Tests
import { parseSemanticLinksInParagraph, getContextualSemanticGraph } from '../src/utils/semanticLinkEngine';
import { allArticles } from '../src/data/articlesData';

console.log('--- TEST SUITE: Semantic Link Generator & Graph ---');

const sampleText = "To ensure security, administrators must deploy a Zero Trust architecture and configure kernel sysctl parameters.";

// Test A: Semantic link injection and phrase extraction
const setA = new Set<string>();
const segmentsA = parseSemanticLinksInParagraph(
  sampleText,
  'non-existent-id',
  'non-existent-slug',
  setA,
  1
);

const linkSegA = segmentsA.find(s => s.type === 'link');
if (linkSegA && linkSegA.target && setA.size === 1) {
  console.log(`[PASS] Semantic link successfully injected for keyword "${linkSegA.content}" -> slug "${linkSegA.target.slug}"`);
} else {
  console.error('[FAIL] Expected semantic link to be injected in sampleText');
  failedTests++;
}

// Test B: Self-linking prevention
const setB = new Set<string>();
const selfSlug = 'zero-trust-network-architecture-blueprint';
const selfArticle = allArticles.find(a => a.slug === selfSlug);
const selfId = selfArticle ? selfArticle.id : 'cyber-3';

const segmentsB = parseSemanticLinksInParagraph(
  "Deploying a Zero Trust architecture requires strict identity checks.",
  selfId,
  selfSlug,
  setB,
  1
);

const linkSegB = segmentsB.find(s => s.type === 'link' && s.target?.slug === selfSlug);
if (!linkSegB) {
  console.log('[PASS] Self-linking prevention verified: current article slug was NOT linked to itself');
} else {
  console.error('[FAIL] Self-link occurred when scanning own article content');
  failedTests++;
}

// Test C: Contextual Semantic Graph generator
if (allArticles.length > 0) {
  const testArticle = allArticles[0];
  const graph = getContextualSemanticGraph(testArticle, 3);
  if (Array.isArray(graph) && graph.length > 0 && graph.every(g => g.article && g.article.id !== testArticle.id)) {
    console.log(`[PASS] Contextual Semantic Graph generated ${graph.length} correlated blueprints for "${testArticle.title.slice(0, 30)}..."`);
  } else {
    console.error('[FAIL] Contextual Semantic Graph failed to return valid relations');
    failedTests++;
  }
}

// 6. related-content-injector in src/utils/contentProcessor.ts Tests
import { relatedContentInjector, processArticleContent } from '../src/utils/contentProcessor';

console.log('--- TEST SUITE: relatedContentInjector & contentProcessor ---');

// Test 6A: Inject 'Zero-Trust' link
const textZeroTrust = "Modern cybersecurity mandates adopting Zero-Trust principles across every cloud service.";
const resultZeroTrust = relatedContentInjector(textZeroTrust);
if (resultZeroTrust.includes('<a href="/zero-trust-network-architecture-blueprint"') && resultZeroTrust.includes('Zero-Trust</a>')) {
  console.log('[PASS] relatedContentInjector injected hyperlink for "Zero-Trust" -> /zero-trust-network-architecture-blueprint');
} else {
  console.error('[FAIL] relatedContentInjector failed on "Zero-Trust":', resultZeroTrust);
  failedTests++;
}

// Test 6B: Inject 'Penetration Testing' link
const textPentest = "Teams should conduct periodic Penetration Testing to discover attack surfaces.";
const resultPentest = relatedContentInjector(textPentest);
if (resultPentest.includes('<a href="/how-penetration-testing-methodology-works"') && resultPentest.includes('Penetration Testing</a>')) {
  console.log('[PASS] relatedContentInjector injected hyperlink for "Penetration Testing" -> /how-penetration-testing-methodology-works');
} else {
  console.error('[FAIL] relatedContentInjector failed on "Penetration Testing":', resultPentest);
  failedTests++;
}

// Test 6C: Inject 'Local LLM' link
const textLocalLLM = "Deploying a Local LLM ensures model weights and chat prompts remain confidential.";
const resultLocalLLM = relatedContentInjector(textLocalLLM);
if (resultLocalLLM.includes('<a href="/sovereign-ai-local-compute-playbook-2026"') && resultLocalLLM.includes('Local LLM</a>')) {
  console.log('[PASS] relatedContentInjector injected hyperlink for "Local LLM" -> /sovereign-ai-local-compute-playbook-2026');
} else {
  console.error('[FAIL] relatedContentInjector failed on "Local LLM":', resultLocalLLM);
  failedTests++;
}

// Test 6D: Self-linking avoidance
const selfTestText = "In this Zero-Trust guide we explore Zero-Trust perimeters.";
const resultSelf = relatedContentInjector(selfTestText, {
  currentArticleSlug: 'zero-trust-network-architecture-blueprint'
});
if (!resultSelf.includes('<a href="/zero-trust-network-architecture-blueprint"')) {
  console.log('[PASS] relatedContentInjector correctly avoided self-linking to current article');
} else {
  console.error('[FAIL] relatedContentInjector linked to itself when currentArticleSlug matched');
  failedTests++;
}

// Test 6E: Full Article processing
if (allArticles.length > 0) {
  const dummyArticle = {
    ...allArticles[0],
    intro: ["Penetration Testing helps assess defenses.", "Using a Local LLM protects company secrets."],
    sections: [
      {
        id: "sec-1",
        heading: "Zero-Trust Foundations",
        body: ["Implementing Zero-Trust requires verifying every identity."]
      }
    ]
  };
  const processed = processArticleContent(dummyArticle);
  const introHasLink = processed.intro[0].includes('<a href=');
  const sectionHasLink = processed.sections[0].body[0].includes('<a href=');
  if (introHasLink && sectionHasLink) {
    console.log('[PASS] processArticleContent successfully processed intro and section body paragraphs');
  } else {
    console.error('[FAIL] processArticleContent failed to inject links across article structure');
    failedTests++;
  }
}

console.log('--- TEST RESULTS ---');
if (failedTests === 0) {
  console.log('ALL TESTS PASSED SUCCESSFULLY (0 errors)');
  process.exit(0);
} else {
  console.error(`TESTS FAILED: ${failedTests} failure(s) detected.`);
  process.exit(1);
}
