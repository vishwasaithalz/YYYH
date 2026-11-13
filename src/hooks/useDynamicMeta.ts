import { useEffect } from 'react';
import { Article, PrimaryCategory, ActiveSiteView } from '../types';
import { SEO_LANDING_META as SEO_LANDING_PAGES, TOOL_PAGES_META as TOOL_PAGES } from '../data/routeMetaData';

interface MetaOptions {
  siteTitle?: string;
  defaultDescription?: string;
  defaultOgImage?: string;
  activeToolSlug?: string | null;
}

// Helper to strictly clamp page titles to <= 45 characters for search engine compliance
export const clampTitle = (text: string, maxLen = 45): string => {
  if (!text) return 'YinYangYoHackers | Cybersecurity & Defense';
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLen) return cleaned;
  const sliced = cleaned.slice(0, maxLen - 1).trim();
  const lastSpace = sliced.lastIndexOf(' ');
  return (lastSpace > 20 ? sliced.slice(0, lastSpace) : sliced).trim() + '…';
};

// Helper to strictly clamp meta descriptions to <= 145 characters for search engine compliance
export const clampDescription = (text: string, maxLen = 145): string => {
  if (!text) return '';
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLen) return cleaned;
  const sliced = cleaned.slice(0, maxLen - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  return (lastSpace > 90 ? sliced.slice(0, lastSpace) : sliced).trim() + '…';
};

// Clean static paths for categories (prevents dynamic parameters in internal URLs)
export const CATEGORY_CLEAN_PATHS: Record<string, string> = {
  'Cyber Security': '/cybersecurity',
  'Autonomous Systems Hub': '/ai-security',
  'Security Tools': '/tools',
  'Cybersecurity': '/cybersecurity',
  'Autonomous Systems & Productivity': '/ai-security',
  'Blueprint': '/blueprint',
  'Tools & Apps': '/tools'
};

// Targeted SEO descriptions (strictly <= 160 characters) and keyword profiles for categories (titles <= 60 chars)
const CATEGORY_SEO_PROFILES: Record<string, { title: string; description: string; keywords: string; ogImage: string; path: string }> = {
  'Cyber Security': {
    title: 'Cyber Security & Defense | YinYangYo',
    description: clampDescription('Expert penetration testing methodologies, emerging threat analysis, red team offensive playbooks, Active Directory exploits, and network security hardening.'),
    keywords: 'cybersecurity, ethical hacking, penetration testing, red team, offensive security, vulnerability research, active directory exploitation, wireshark, nmap, reverse engineering',
    ogImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    path: '/cybersecurity'
  },
  'Autonomous Systems Hub': {
    title: 'Autonomous Systems & Models | YinYangYo',
    description: clampDescription('Practical blueprints for hosting DeepSeek-R1, Llama-3, and Mistral locally with Ollama, Open WebUI, private GPU clusters, and zero-telemetry workflows.'),
    keywords: 'local compute, autonomous systems, ollama, deepseek r1, llama 3, private LLM, vLLM, open webui, model cybersecurity, prompt injection defense, offline models',
    ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    path: '/ai-security'
  },
  'Security Tools': {
    title: 'Security Tools & Apps | YinYangYo',
    description: clampDescription('In-depth reviews and field benchmarks of open-source ethical hacking tools, WiFi auditing toolkits, cryptographic software, and privacy toolkits.'),
    keywords: 'hacker tools, open source security tools, password hash crackers, subfinder, nmap scripts, flipper zero, wifi auditing, security toolkit, cyber apps',
    ogImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    path: '/tools'
  },
  'Cybersecurity': {
    title: 'Cybersecurity & Defense | YinYangYo',
    description: clampDescription('Expert penetration testing methodologies, emerging threat analysis, red team offensive playbooks, Active Directory exploits, and network security hardening.'),
    keywords: 'cybersecurity, ethical hacking, penetration testing, red team, offensive security, vulnerability research, active directory exploitation, wireshark, nmap, reverse engineering',
    ogImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    path: '/cybersecurity'
  },
  'Autonomous Systems & Productivity': {
    title: 'Autonomous Systems & Models | YinYangYo',
    description: clampDescription('Practical blueprints for hosting DeepSeek-R1, Llama-3, and Mistral locally with Ollama, Open WebUI, private GPU clusters, and zero-telemetry workflows.'),
    keywords: 'local compute, autonomous systems, ollama, deepseek r1, llama 3, private LLM, vLLM, open webui, model cybersecurity, prompt injection defense, offline models',
    ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    path: '/ai-security'
  },
  'Blueprint': {
    title: 'Defensive Blueprints | YinYangYo',
    description: clampDescription('Production-ready sysadmin blueprints, Linux kernel hardening, SSH bastion key setups, UFW firewalls, Docker isolation, and zero-trust infrastructure.'),
    keywords: 'sysadmin blueprint, linux hardening, zero trust architecture, ssh key security, ufw firewall, docker security, server hardening, devsecops, self hosting',
    ogImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    path: '/blueprint'
  },
  'Tools & Apps': {
    title: 'Hacker Tools & Utilities | YinYangYo',
    description: clampDescription('In-depth reviews and field benchmarks of open-source ethical hacking tools, WiFi auditing toolkits, cryptographic software, and privacy toolkits.'),
    keywords: 'hacker tools, open source security tools, password hash crackers, subfinder, nmap scripts, flipper zero, wifi auditing, security toolkit, cyber apps',
    ogImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    path: '/tools'
  }
};

// View-specific SEO mapping (all titles strictly <= 45 characters, descriptions strictly <= 160 characters)
const VIEW_SEO_PROFILES: Record<string, { 
  title: string; 
  description: string; 
  keywords: string; 
  primaryKeyword?: string;
  searchIntent?: string;
  path: string;
  ogImage?: string;
  breadcrumbName: string;
}> = {
  'cybersecurity': {
    title: 'Cybersecurity Services | YinYangYo',
    description: clampDescription('Professional cybersecurity services: zero-trust network architecture, defensive infrastructure hardening, threat intelligence, and continuous cloud defense.'),
    keywords: 'cybersecurity services, zero trust architecture, defensive cybersecurity, cloud infrastructure hardening, threat intelligence, cyber defense',
    primaryKeyword: 'cybersecurity services',
    searchIntent: 'Commercial Investigation / Service Evaluation',
    path: '/cybersecurity',
    ogImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Cybersecurity Services'
  },
  'ethical-hacking': {
    title: 'Ethical Hacking Services | YinYangYo',
    description: clampDescription('Authorized ethical hacking services, full-scope red teaming, adversary simulation, and white-hat vulnerability assessments for modern digital operations.'),
    keywords: 'ethical hacking services, white hat hacking services, adversary simulation, red team services, offensive security audit, vulnerability assessment',
    primaryKeyword: 'ethical hacking services',
    searchIntent: 'Adversarial Simulation & Red Teaming',
    path: '/ethical-hacking',
    ogImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Ethical Hacking Services'
  },
  'penetration-testing': {
    title: 'Penetration Testing | YinYangYo',
    description: clampDescription('Comprehensive penetration testing services: web application, network infrastructure, API, and cloud security assessments mapped to OWASP & SOC 2.'),
    keywords: 'penetration testing services, web app penetration testing, network pentesting, api security assessment, cloud penetration test, soc 2 pentest',
    primaryKeyword: 'penetration testing services',
    searchIntent: 'Compliance & Technical Verification',
    path: '/penetration-testing',
    ogImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Penetration Testing Services'
  },
  'ai-security': {
    title: 'Model Security & Defense | YinYangYo',
    description: clampDescription('Enterprise model cybersecurity: LLM red-teaming, prompt injection defense, adversarial robustness testing, RAG pipeline protection, and model security audits.'),
    keywords: 'model cybersecurity, LLM security hardening, adversarial prompt injection defense, RAG pipeline security, OWASP top 10 for LLM, adversarial red teaming',
    primaryKeyword: 'Model cybersecurity',
    searchIntent: 'Technical Model Threat Hardening',
    path: '/ai-security',
    ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Machine Defense & Security'
  },
  'sovereign-ai': {
    title: 'Autonomous Systems & Modelss | YinYangYo',
    description: clampDescription('Autonomous Systems engineering: private on-premise LLM execution, zero-telemetry hardware clustering, air-gapped model inference, and data governance.'),
    keywords: 'autonomous systems, private on premise LLM, air gapped local compute deployment, zero telemetry local compute, deepseek local setup, enterprise private compute',
    primaryKeyword: 'autonomous systems',
    searchIntent: 'Architectural & Operational Sovereignty',
    path: '/sovereign-ai',
    ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Autonomous Systems'
  },
  'sovereign-hub': {
    title: 'Autonomous Systems Knowledge Hub | YinYangYo',
    description: clampDescription('Authoritative Autonomous Systems Knowledge Hub: 9 engineering blueprints for private on-premise compute, air-gapped systems, secure Ollama, private vLLM, and local LLM defense.'),
    keywords: 'autonomous systems knowledge hub, private local compute, air-gapped systems, secure ollama deployment, private vllm infrastructure, local llm security, autonomous systems architecture, data privacy',
    primaryKeyword: 'autonomous systems knowledge hub',
    searchIntent: 'Autonomous Systems Architectural Hub',
    path: '/sovereign-hub',
    ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Autonomous Systems Hub'
  },
  'private-local-ai': {
    title: 'Private Local Model Inference | YinYangYo',
    description: clampDescription('Run foundation intelligence 100% locally with Ollama, vLLM, and Open WebUI. Zero external network egress, self-hosted RAG, and private GPU VRAM tuning.'),
    keywords: 'private local compute, local LLM inference, ollama open webui, private model deployment, zero egress local models, self-hosted RAG',
    primaryKeyword: 'private local compute',
    searchIntent: 'Private local compute',
    path: '/private-local-ai',
    ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Private Local Compute'
  },
  'air-gapped-ai': {
    title: 'Air-Gapped Systems & Isolation | YinYangYo',
    description: clampDescription('Physically isolated compute hardware, unidirectional optical data diodes, and SCIF-grade models with zero RF leakage and signed weights custody.'),
    keywords: 'air-gapped systems, optical data diode models, isolated LLM deployment, SCIF isolated hardware, offline intelligence',
    primaryKeyword: 'air-gapped systems',
    searchIntent: 'Air-gapped compute',
    path: '/air-gapped-ai',
    ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Air-Gapped Systems'
  },
  'ollama-security': {
    title: 'Secure Ollama Deployment | YinYangYo',
    description: clampDescription('Harden enterprise Ollama daemons, bind to localhost, enforce mTLS reverse proxies, and sandbox Modelfile execution against remote code execution.'),
    keywords: 'secure ollama deployment, ollama hardening, ollama host localhost, ollama mtls proxy, modelfile security',
    primaryKeyword: 'secure Ollama deployment',
    searchIntent: 'Secure Ollama deployment',
    path: '/ollama-security',
    ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Secure Ollama Deployment'
  },
  'vllm-security': {
    title: 'Private vLLM Infrastructure | YinYangYo',
    description: clampDescription('High-throughput cluster security, distributed tensor parallelism, and PagedAttention guards for private high-concurrency vLLM deployments.'),
    keywords: 'private vLLM infrastructure, vLLM cluster security, tensor parallelism mTLS, pagedattention DoS defense, distributed vLLM',
    primaryKeyword: 'private vLLM infrastructure',
    searchIntent: 'Private vLLM infrastructure',
    path: '/vllm-security',
    ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Private vLLM Infrastructure'
  },
  'local-llm-security': {
    title: 'Local LLM Security & Sandboxing | YinYangYo',
    description: clampDescription('Defend local LLMs against arbitrary code execution via pickled weights, autonomous tool-calling exploitation, system prompt exfiltration, and context poisoning.'),
    keywords: 'local LLM security, safetensors vs pickle, prompt injection mitigation, local tool execution sandbox, model weight audit',
    primaryKeyword: 'local LLM security',
    searchIntent: 'Local LLM security',
    path: '/local-llm-security',
    ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Local LLM Security'
  },
  'sovereign-ai-infrastructure': {
    title: 'Sovereign Systems Infrastructure | YinYangYo',
    description: clampDescription('Multi-GPU PCIe Gen 5 lane topologies, NVLink interconnects, and local NVMe vector vaults for high-throughput zero-telemetry compute nodes.'),
    keywords: 'autonomous systems infrastructure, autonomous systems architecture, multi-GPU topology, PCIe lane distribution, NVLink compute cluster, local vector database hardware',
    primaryKeyword: 'autonomous systems architecture',
    searchIntent: 'Autonomous Systems architecture',
    path: '/sovereign-ai-infrastructure',
    ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Sovereign Systems Infrastructure'
  },
  'ai-data-privacy': {
    title: 'Data Privacy & PII Scrubbing | YinYangYo',
    description: clampDescription('Pre-inference PII scrubbing, zero data retention pipelines, and GDPR/HIPAA compliance for enterprise on-premise compute deployments.'),
    keywords: 'data privacy, data privacy & sanitization, PII sanitization models, zero data retention pipeline, GDPR model compliance, HIPAA private LLM',
    primaryKeyword: 'data privacy & sanitization',
    searchIntent: 'data privacy',
    path: '/ai-data-privacy',
    ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Data Privacy & Sanitization'
  },
  'security-research': {
    title: 'Cyber Research & Exploits | YinYangYo',
    description: clampDescription('Independent cybersecurity research: critical vulnerability analysis, adversary mechanics, kernel security teardowns, and audited ethical hacking tools.'),
    keywords: 'cybersecurity research, critical vulnerability research, exploit teardowns, threat intelligence analysis, independent security research',
    primaryKeyword: 'cybersecurity research',
    searchIntent: 'Independent Vulnerability Intelligence',
    path: '/security-research',
    ogImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Cybersecurity Research'
  },
  'about': {
    title: 'About Us | YinYangYoHackers',
    description: clampDescription('YinYangYoHackers company expertise founded in 2013 by Vishwas Aithal. Discover our computational pillars: defensive Yin, offensive Yang, and sovereign Yo.'),
    keywords: 'YinYangYoHackers company expertise, Vishwas Aithal, cybersecurity company profile, security research team credentials, zero trust company',
    primaryKeyword: 'YinYangYoHackers / company expertise',
    searchIntent: 'Company Profile & Organizational Authority',
    path: '/about',
    ogImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Company Expertise'
  },
  'services': {
    title: 'Technical Advisory & Scope | YinYangYo',
    description: clampDescription('Technical advisory scope, prerequisites, and explicit limitations for zero-trust hardening, sovereign AI enclaves, and infrastructure reviews.'),
    keywords: 'security advisory, technical advisory scope, zero trust review, sovereign AI audit, infrastructure hardening',
    primaryKeyword: 'security advisory scope',
    searchIntent: 'Advisory Scope & Requirements',
    path: '/services',
    ogImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Technical Advisory'
  },
  'contact': {
    title: 'Consultation | YinYangYo',
    description: clampDescription('Request a cybersecurity consultation, security assessment, or submit encrypted vulnerability disclosures via secure PGP dispatch channels.'),
    keywords: 'cybersecurity consultation, security consultation request, book ethical hacking assessment, encrypted dispatch, vulnerability disclosure',
    primaryKeyword: 'cybersecurity consultation',
    searchIntent: 'Transactional / Consultation Inquiry',
    path: '/contact',
    ogImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Cybersecurity Consultation'
  },
  '404': {
    title: '404 Not Found | YinYangYo',
    description: clampDescription('The requested cybersecurity guide, ethical hacking blueprint, or tool could not be located. Access our complete security directory, tools suite, and sitemap.'),
    keywords: '404 error, page not found, cybersecurity archives, ethical hacking tutorials, security tools',
    path: '/404',
    breadcrumbName: 'Not Found'
  },
  'tools': {
    title: 'Tools Suite | YinYangYo',
    description: clampDescription('Interactive open-source cybersecurity tools suite: Hash identifier, subnet CIDR calculator, password entropy auditor, and security headers analyzer.'),
    keywords: 'cybersecurity tools, penetration testing tools, hash identifier, subnet CIDR calculator, password entropy audit, security headers',
    path: '/tools',
    breadcrumbName: 'Tools Suite'
  },
  'ctf': {
    title: 'Capture The Flag CTF Arena | YinYangYoHackers',
    description: clampDescription('Hands-on CTF challenges testing cryptography, web exploitation, reverse engineering, and defensive forensics.'),
    keywords: 'CTF challenges, ethical hacking puzzles, capture the flag, cyber cryptography, web exploitation practice',
    path: '/ctf',
    breadcrumbName: 'CTF Arena'
  },
  'clusters': {
    title: 'Cybersecurity & Systems Knowledge Graph | YinYangYo',
    description: clampDescription('Interactive topic cluster visualization mapping penetration testing roadmaps, local compute pipelines, and defensive architectures.'),
    keywords: 'cybersecurity topic clusters, knowledge graph, ethical hacking roadmap, semantic security clusters',
    path: '/clusters',
    breadcrumbName: 'Topic Clusters'
  },
  'technology': {
    title: 'Technology Architecture | YinYangYo',
    description: clampDescription('Practical technology architecture, homelab infrastructure, self-hosted cloud bastions, open-source devops tools, and enterprise computing blueprints.'),
    keywords: 'open source technology, homelab blueprints, self-hosted infrastructure, proxmox ve, wireguard mesh vpn, zfs storage, devsecops',
    primaryKeyword: 'open source technology architecture',
    searchIntent: 'Technical Model Threat Hardening',
    path: '/technology',
    ogImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Technology Architecture'
  },
  'privacy': {
    title: 'Privacy Policy | YinYangYoHackers',
    description: clampDescription('Official Privacy Policy of YinYangYoHackers: zero client surveillance, minimal telemetry, GDPR compliance, and sovereign data retention standards.'),
    keywords: 'privacy policy, zero surveillance, GDPR compliance, data retention, cyber privacy standards, sovereign data',
    primaryKeyword: 'privacy policy',
    searchIntent: 'Compliance & Legal Verification',
    path: '/privacy',
    ogImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Privacy Policy'
  },
  'terms': {
    title: 'Terms of Service | YinYangYoHackers',
    description: clampDescription('Terms of Service and legal agreements for accessing YinYangYoHackers cybersecurity research, ethical hacking publications, and interactive security tools.'),
    keywords: 'terms of service, legal agreements, ethical hacking usage terms, security research disclaimer, site terms',
    primaryKeyword: 'terms of service',
    searchIntent: 'Compliance & Legal Verification',
    path: '/terms',
    ogImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Terms of Service'
  },
  'roadmap': {
    title: 'Content Roadmap | YinYangYoHackers',
    description: clampDescription('Strategic cybersecurity and autonomous systems research roadmap: deep dive into upcoming ethical hacking pillars, autonomous systems deployment guides, and red team blueprints.'),
    keywords: 'cybersecurity roadmap, ethical hacking curriculum, model security research roadmap, content architecture, publication pipeline',
    primaryKeyword: 'cybersecurity content roadmap',
    searchIntent: 'Navigational & Educational Roadmap',
    path: '/roadmap',
    ogImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Content Roadmap'
  },
  'cheatsheets': {
    title: 'Interactive Cheatsheets | YinYangYo',
    description: clampDescription('Interactive ethical hacking and sysadmin cheatsheets: Nmap syntax, Linux kernel hardening, Wireshark display filters, and Active Directory attack vectors.'),
    keywords: 'ethical hacking cheatsheet, nmap cheatsheet, linux hardening commands, wireshark filters, active directory attacks, security reference',
    primaryKeyword: 'ethical hacking cheatsheet',
    searchIntent: 'Practical / Reference Guide',
    path: '/cheatsheets',
    ogImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Interactive Cheatsheets'
  },
  'disclaimer': {
    title: 'Ethical Hacking Disclaimer | YinYangYoHackers',
    description: clampDescription('Official ethical hacking code of conduct, responsible vulnerability disclosure guidelines, educational compliance, and defensive cyber directives.'),
    keywords: 'ethical hacking disclaimer, responsible disclosure, cyber law compliance, white hat policy, terms of security research',
    path: '/disclaimer',
    breadcrumbName: 'Legal Disclaimer'
  },
  'ports': {
    title: 'Port Directory & Recon Rules | YinYangYo',
    description: clampDescription('Authoritative cybersecurity port encyclopedia: TCP and UDP port lookup, service protocols, CVE vulnerabilities, Nmap recon commands, and UFW firewall rules.'),
    keywords: 'port directory, TCP ports, UDP ports, nmap port scan, common ports, ufw firewall rules, wireshark capture filter, well known ports',
    primaryKeyword: 'cybersecurity port directory',
    searchIntent: 'Technical Reference / Port Analysis',
    path: '/ports',
    ogImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Port Directory'
  },
  'glossary': {
    title: 'Cybersecurity Glossary | YinYangYo',
    description: clampDescription('Definitive cybersecurity and Sovereign AI glossary: authoritative definitions covering Zero-Trust, ASLR, eBPF, Air-Gap, Prompt Injection, and Kerberoasting.'),
    keywords: 'cybersecurity glossary, ethical hacking terms, zero trust definition, aslr, ebpf, prompt injection, sovereign ai terms, cyber dictionary',
    primaryKeyword: 'cybersecurity glossary',
    searchIntent: 'Educational / Terminology Reference',
    path: '/glossary',
    ogImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    breadcrumbName: 'Glossary'
  }
};

/**
 * useDynamicMeta Dynamically updates document title, meta tags,
 * OpenGraph, Twitter Card, and Schema.org JSON-LD structured data
 * based on current article, category, or active view for optimal search engine indexing.
 */
export const useDynamicMeta = (
  article: Article | null,
  currentCategory: PrimaryCategory | 'All' = 'All',
  activeView: ActiveSiteView = 'blog',
  options: MetaOptions = {}
) => {
  const {
    siteTitle = 'Autonomous Cybersecurity & Ethical Hacking | YinYangYoHackers',
    defaultDescription = 'Autonomous Cybersecurity & Ethical Hacking platform founded by YinYangYoHackers Research Staff. Autonomous red teaming, zero-trust infrastructure & autonomous systems tools.',
    defaultOgImage = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80'
  } = options;

  useEffect(() => {
    // Helper function to update or create a <meta> tag
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      if (attrVal === 'description') {
        // Enforce strict single meta description rule: remove any duplicate or Dublin Core description
        const allDescriptions = document.querySelectorAll('meta[name="description"], meta[name="DC.description"]');
        if (allDescriptions.length > 1) {
          for (let i = 1; i < allDescriptions.length; i++) {
            allDescriptions[i].remove();
          }
        }
      }
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to update or create a <link> tag (e.g. canonical)
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Helper to update or create hreflang & alternate <link> tags with strictly absolute HTTPS URLs
    const setHreflangTags = (canonicalUrl: string) => {
      const rawOrigin = typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://yinyangyohackers.ai.studio';
      const origin = rawOrigin.replace(/^http:\/\//i, 'https://');
      const httpsCanonical = canonicalUrl.replace(/^http:\/\//i, 'https://');

      const updateOrAddHreflang = (lang: string, href: string) => {
        let element = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);
        if (!element) {
          element = document.createElement('link');
          element.setAttribute('rel', 'alternate');
          element.setAttribute('hreflang', lang);
          document.head.appendChild(element);
        }
        element.setAttribute('href', href);
      };
      updateOrAddHreflang('en', httpsCanonical);
      updateOrAddHreflang('x-default', httpsCanonical);

      // Ensure <link rel="sitemap"> is present and explicitly set to https://yinyangyohackers.ai.studio/sitemap.xml
      let sitemapEl = document.querySelector('link[rel="sitemap"]');
      if (!sitemapEl) {
        sitemapEl = document.createElement('link');
        sitemapEl.setAttribute('rel', 'sitemap');
        sitemapEl.setAttribute('type', 'application/xml');
        sitemapEl.setAttribute('title', 'Sitemap');
        document.head.appendChild(sitemapEl);
      }
      sitemapEl.setAttribute('href', 'https://yinyangyohackers.ai.studio/sitemap.xml');

      // Ensure all <link rel="alternate"> tags use absolute HTTPS URLs (never relative or http paths)
      document.querySelectorAll('link[rel="alternate"]').forEach((linkEl) => {
        const href = linkEl.getAttribute('href');
        if (href && href.startsWith('/')) {
          linkEl.setAttribute('href', `${origin}${href}`);
        } else if (href && href.startsWith('http://')) {
          linkEl.setAttribute('href', href.replace(/^http:\/\//i, 'https://'));
        }
      });
    };

    // Helper to inject or update JSON-LD Schema.org structured data
    const setJsonLdSchema = (schemaObject: Record<string, any>) => {
      let script = document.getElementById('yyyh-schema-ldjson') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = 'yyyh-schema-ldjson';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schemaObject);
    };

    // Canonical Base URL dynamically resolves to the active HTTPS origin to ensure self-referential HTTPS canonical tags
    const rawOriginUrl = typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://yinyangyohackers.ai.studio';
    const originUrl = rawOriginUrl.replace(/^http:\/\//i, 'https://');
    const CANONICAL_DOMAIN = originUrl;

    // Helper for URL canonicalization: strips tracking query params (utm_*, gclid, fbclid, ref, etc.) and enforces HTTPS
    const getCanonicalUrl = (pathWithHash: string) => {
      const cleanPath = pathWithHash.replace(/\?(utm_[^&]+|fbclid=[^&]+|gclid=[^&]+|ref=[^&]+)&?/gi, '').replace(/[?&]$/, '');
      const normalizedPath = cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath;
      return `${originUrl}${normalizedPath === '/' ? '/' : normalizedPath}`;
    };

    // Google Analytics 4 page_view tracker
    const trackGaPageView = (pagePath: string, pageTitle: string) => {
      try {
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'page_view', {
            page_title: pageTitle,
            page_location: `${originUrl}${pagePath}`,
            page_path: pagePath
          });
        }
      } catch {
        // Fail-safe silently ignore if ad-blocker or offline
      }
    };

    // 1. Case A: Single Article Reader View
    if (article) {
      const rawTitle = article.title;
      const pageTitle = clampTitle(rawTitle.includes('YinYangYo') ? rawTitle : `${rawTitle} | YinYangYoHackers`, 60);
      document.title = pageTitle;

      const metaDesc = clampDescription(article.seo?.metaDescription || article.summary, 145);
      setMetaTag('name', 'description', metaDesc);

      const primaryKey = article.seo?.primaryKeyword || (article.tags && article.tags[0]) || article.subcategory || 'cybersecurity';
      const keywords = [
        primaryKey,
        ...(article.seo?.secondaryKeywords || []),
        ...article.tags,
        'ethical hacking',
        'cybersecurity',
        article.category
      ].filter(Boolean).join(', ');

      setMetaTag('name', 'keywords', keywords);
      setMetaTag('name', 'primary-keyword', primaryKey);
      setMetaTag('name', 'author', article.author?.name || 'YinYangYoHackers Research Staff');
      setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
      setMetaTag('http-equiv', 'X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      setMetaTag('name', 'X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

      // OpenGraph Tags
      const articleImage = article.coverImage?.src || defaultOgImage;
      const articleUrl = `${CANONICAL_DOMAIN}/${article.slug}`;

      setMetaTag('property', 'og:title', pageTitle);
      setMetaTag('property', 'og:description', metaDesc);
      setMetaTag('property', 'og:type', 'article');
      setMetaTag('property', 'og:url', articleUrl);
      setMetaTag('property', 'og:image', articleImage);
      setMetaTag('property', 'og:site_name', 'YinYangYoHackers');
      setMetaTag('property', 'article:published_time', article.date);
      setMetaTag('property', 'article:author', article.author?.name || 'YinYangYoHackers Research Staff');
      setMetaTag('property', 'article:section', article.category);
      if (article.tags && article.tags.length > 0) {
        setMetaTag('property', 'article:tag', article.tags.join(', '));
      }

      // Twitter / X Card
      setMetaTag('name', 'twitter:card', 'summary_large_image');
      setMetaTag('name', 'twitter:title', pageTitle);
      setMetaTag('name', 'twitter:description', metaDesc);
      setMetaTag('name', 'twitter:image', articleImage);
      setMetaTag('name', 'twitter:creator', '@research_analyst');

      const canonicalUrl = articleUrl;
      setLinkTag('canonical', canonicalUrl);
      setHreflangTags(canonicalUrl);
      trackGaPageView(`/${article.slug}`, pageTitle);

      // TechArticle / Article Schema + Breadcrumb + Organization Graph
      setJsonLdSchema({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${CANONICAL_DOMAIN}/#organization`,
            'name': 'YinYangYoHackers',
            'url': CANONICAL_DOMAIN,
            'logo': {
              '@type': 'ImageObject',
              'url': `${CANONICAL_DOMAIN}/favicon.ico`,
              'caption': 'YinYangYoHackers'
            },
            'founder': {
              '@type': 'Person',
              'name': 'YinYangYoHackers Research Staff',
              'jobTitle': 'Founder & Lead Cybersecurity Researcher'
            },
            'foundingDate': '2013'
          },
          {
            '@type': 'WebSite',
            '@id': `${CANONICAL_DOMAIN}/#website`,
            'url': CANONICAL_DOMAIN,
            'name': 'YinYangYoHackers',
            'description': 'Autonomous Cybersecurity & Ethical Hacking',
            'publisher': { '@type': 'Organization', '@id': `${CANONICAL_DOMAIN}/#organization` }
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${canonicalUrl}#breadcrumb`,
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': CANONICAL_DOMAIN
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': article.category,
                'item': `${CANONICAL_DOMAIN}${CATEGORY_CLEAN_PATHS[article.category] || '/cybersecurity'}`
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': article.title,
                'item': canonicalUrl
              }
            ]
          },
          {
            '@type': 'TechArticle',
            '@id': `${canonicalUrl}#article`,
            'headline': article.title,
            'description': clampDescription(metaDesc, 160),
            'image': articleImage,
            'datePublished': article.date,
            'dateModified': article.updatedDate || article.date,
            'author': {
              '@type': 'Person',
              'name': article.author?.name || 'YinYangYoHackers Research Staff',
              'jobTitle': 'Cybersecurity Instructor & Researcher'
            },
            'publisher': { '@type': 'Organization', '@id': `${CANONICAL_DOMAIN}/#organization` },
            'mainEntityOfPage': {
              '@type': 'WebPage',
              '@id': canonicalUrl
            },
            'articleSection': article.category,
            'keywords': keywords
          },
          ...(article.faqs && article.faqs.length > 0 ? [{
            '@type': 'FAQPage',
            '@id': `${canonicalUrl}#faq`,
            'mainEntity': article.faqs.map(faq => ({
              '@type': 'Question',
              'name': faq.question,
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': faq.answer
              }
            }))
          }] : [])
        ]
      });

      return;
    }

    // Case Tool: Dedicated Standalone Indexable Security Tool Page
    if (options.activeToolSlug && TOOL_PAGES[options.activeToolSlug]) {
      const tool = TOOL_PAGES[options.activeToolSlug];
      const pageTitle = tool.title;
      document.title = pageTitle;

      setMetaTag('name', 'description', tool.metaDescription);
      const keywords = [tool.primaryKeyword, ...tool.secondaryKeywords, 'security tool', 'calculator', 'cybersecurity'].join(', ');
      setMetaTag('name', 'keywords', keywords);
      setMetaTag('name', 'primary-keyword', tool.primaryKeyword);
      setMetaTag('name', 'author', 'YinYangYoHackers Research Staff');
      setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large');
      setMetaTag('http-equiv', 'X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      setMetaTag('name', 'X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

      const toolCanonicalUrl = `${CANONICAL_DOMAIN}${tool.path}`;
      setMetaTag('property', 'og:title', pageTitle);
      setMetaTag('property', 'og:description', tool.metaDescription);
      setMetaTag('property', 'og:type', 'website');
      setMetaTag('property', 'og:url', toolCanonicalUrl);
      setMetaTag('property', 'og:image', defaultOgImage);
      setMetaTag('property', 'og:site_name', 'YinYangYoHackers');

      setMetaTag('name', 'twitter:card', 'summary_large_image');
      setMetaTag('name', 'twitter:title', pageTitle);
      setMetaTag('name', 'twitter:description', tool.metaDescription);
      setMetaTag('name', 'twitter:image', defaultOgImage);

      setLinkTag('canonical', toolCanonicalUrl);
      setHreflangTags(toolCanonicalUrl);
      trackGaPageView(tool.path, pageTitle);

      setJsonLdSchema({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${CANONICAL_DOMAIN}/#organization`,
            'name': 'YinYangYoHackers',
            'url': CANONICAL_DOMAIN,
            'logo': {
              '@type': 'ImageObject',
              'url': `${CANONICAL_DOMAIN}/favicon.ico`,
              'caption': 'YinYangYoHackers'
            },
            'founder': {
              '@type': 'Person',
              'name': 'YinYangYoHackers Research Staff',
              'jobTitle': 'Founder & Lead Cybersecurity Researcher'
            }
          },
          {
            '@type': 'WebSite',
            '@id': `${CANONICAL_DOMAIN}/#website`,
            'url': CANONICAL_DOMAIN,
            'name': 'YinYangYoHackers',
            'publisher': { '@type': 'Organization', '@id': `${CANONICAL_DOMAIN}/#organization` }
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${toolCanonicalUrl}#breadcrumb`,
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': CANONICAL_DOMAIN
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Tools Suite',
                'item': `${CANONICAL_DOMAIN}/tools`
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': tool.h1,
                'item': toolCanonicalUrl
              }
            ]
          },
          {
            '@type': 'WebApplication',
            '@id': `${toolCanonicalUrl}#software`,
            'name': tool.h1,
            'description': tool.shortExplanation,
            'url': toolCanonicalUrl,
            'applicationCategory': 'SecurityApplication',
            'operatingSystem': 'Any / Web Browser',
            'browserRequirements': 'Requires JavaScript. Requires HTML5.',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'USD'
            },
            'publisher': { '@type': 'Organization', '@id': `${CANONICAL_DOMAIN}/#organization` }
          }
        ]
      });

      return;
    }

    // 2. Case B: Specific Sub-View / Dedicated SEO Landing Page
    if (activeView !== 'blog' && (VIEW_SEO_PROFILES[activeView] || SEO_LANDING_PAGES[activeView])) {
      const landingData = SEO_LANDING_PAGES[activeView];
      const viewMeta = VIEW_SEO_PROFILES[activeView] || {
        title: landingData ? landingData.title : `${activeView} | YinYangYo`,
        description: landingData ? clampDescription(landingData.metaDescription) : '',
        keywords: landingData ? [landingData.primaryKeyword, ...landingData.secondaryKeywords].join(', ') : '',
        primaryKeyword: landingData ? landingData.primaryKeyword : activeView,
        searchIntent: landingData ? landingData.searchIntent : '',
        path: landingData ? landingData.path : `/${activeView}`,
        ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        breadcrumbName: landingData ? landingData.h1 : activeView
      };
      document.title = viewMeta.title;

      setMetaTag('name', 'description', viewMeta.description);
      setMetaTag('name', 'keywords', viewMeta.keywords);
      setMetaTag('name', 'primary-keyword', viewMeta.primaryKeyword);
      setMetaTag('name', 'author', 'YinYangYoHackers Research Staff');
      if (activeView === '404') {
        setMetaTag('name', 'robots', 'noindex, nofollow');
        setMetaTag('http-equiv', 'X-Robots-Tag', 'noindex, nofollow');
        setMetaTag('name', 'X-Robots-Tag', 'noindex, nofollow');
      } else {
        setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large');
        setMetaTag('http-equiv', 'X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
        setMetaTag('name', 'X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      }

      const pageCanonicalUrl = `${CANONICAL_DOMAIN}${viewMeta.path}`;

      setMetaTag('property', 'og:title', viewMeta.title);
      setMetaTag('property', 'og:description', viewMeta.description);
      setMetaTag('property', 'og:type', 'website');
      setMetaTag('property', 'og:url', pageCanonicalUrl);
      setMetaTag('property', 'og:image', viewMeta.ogImage || defaultOgImage);
      setMetaTag('property', 'og:site_name', 'YinYangYoHackers');

      // Twitter / X Card
      setMetaTag('name', 'twitter:card', 'summary_large_image');
      setMetaTag('name', 'twitter:title', viewMeta.title);
      setMetaTag('name', 'twitter:description', viewMeta.description);
      setMetaTag('name', 'twitter:image', viewMeta.ogImage || defaultOgImage);

      setLinkTag('canonical', pageCanonicalUrl);
      setHreflangTags(pageCanonicalUrl);
      trackGaPageView(viewMeta.path, viewMeta.title);

      const isLandingPage = Boolean(SEO_LANDING_PAGES[activeView]);

      const graphItems: any[] = [
        {
          '@type': 'Organization',
          '@id': `${CANONICAL_DOMAIN}/#organization`,
          'name': 'YinYangYoHackers',
          'url': CANONICAL_DOMAIN,
          'logo': {
            '@type': 'ImageObject',
            'url': `${CANONICAL_DOMAIN}/favicon.ico`,
            'caption': 'YinYangYoHackers'
          },
          'founder': {
            '@type': 'Person',
            'name': 'YinYangYoHackers Research Staff',
            'jobTitle': 'Founder & Lead Cybersecurity Researcher'
          },
          'foundingDate': '2013'
        },
        {
          '@type': 'WebSite',
          '@id': `${CANONICAL_DOMAIN}/#website`,
          'url': CANONICAL_DOMAIN,
          'name': 'YinYangYoHackers',
          'description': 'Autonomous Cybersecurity & Ethical Hacking',
          'publisher': { '@type': 'Organization', '@id': `${CANONICAL_DOMAIN}/#organization` }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${pageCanonicalUrl}#breadcrumb`,
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': CANONICAL_DOMAIN
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': viewMeta.breadcrumbName,
              'item': pageCanonicalUrl
            }
          ]
        },
        {
          '@type': 'WebPage',
          '@id': `${pageCanonicalUrl}#webpage`,
          'name': viewMeta.title,
          'description': viewMeta.description,
          'url': pageCanonicalUrl,
          'publisher': { '@type': 'Organization', '@id': `${CANONICAL_DOMAIN}/#organization` }
        }
      ];

      // Add specialized Schema.org types for rich result snippets
      if (activeView === 'tools') {
        graphItems.push({
          '@type': 'WebApplication',
          '@id': `${pageCanonicalUrl}#webapp`,
          'name': 'YinYangYoHackers Cybersecurity Tools Suite',
          'applicationCategory': 'SecurityApplication',
          'operatingSystem': 'Any (Web Browser)',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
          },
          'description': viewMeta.description
        });
      } else if (activeView === 'ctf') {
        graphItems.push({
          '@type': 'WebApplication',
          '@id': `${pageCanonicalUrl}#webapp`,
          'name': 'YinYangYoHackers Capture The Flag Arena',
          'applicationCategory': 'EducationalGame',
          'operatingSystem': 'Any (Web Browser)',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
          },
          'description': viewMeta.description
        });
      } else if (activeView === 'roadmap') {
        graphItems.push({
          '@type': 'CollectionPage',
          '@id': `${pageCanonicalUrl}#collection`,
          'name': 'Cybersecurity & Autonomous Systems Research Roadmap',
          'description': viewMeta.description
        });
      } else if (activeView === 'cheatsheets') {
        graphItems.push({
          '@type': 'TechArticle',
          '@id': `${pageCanonicalUrl}#cheatsheet`,
          'headline': viewMeta.title,
          'description': viewMeta.description,
          'author': {
            '@type': 'Person',
            'name': 'YinYangYoHackers Research Staff'
          }
        });
      }

      // Add Service schema for commercial/audit landing pages
      if (isLandingPage && viewMeta.primaryKeyword) {
        graphItems.push({
          '@type': 'Service',
          '@id': `${pageCanonicalUrl}#service`,
          'name': viewMeta.title,
          'serviceType': viewMeta.primaryKeyword,
          'description': viewMeta.description,
          'provider': { '@type': 'Organization', '@id': `${CANONICAL_DOMAIN}/#organization` },
          'areaServed': 'Worldwide'
        });
      }

      // Add FAQPage schema if FAQs exist
      if (landingData && landingData.faqs && landingData.faqs.length > 0) {
        graphItems.push({
          '@type': 'FAQPage',
          '@id': `${pageCanonicalUrl}#faq`,
          'mainEntity': landingData.faqs.map(faq => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': faq.answer
            }
          }))
        });
      }

      setJsonLdSchema({
        '@context': 'https://schema.org',
        '@graph': graphItems
      });

      return;
    }

    // 3. Case C: Category Filtered View
    if (currentCategory !== 'All' && CATEGORY_SEO_PROFILES[currentCategory]) {
      const catMeta = CATEGORY_SEO_PROFILES[currentCategory];
      const pageTitle = clampTitle(catMeta.title, 60);
      document.title = pageTitle;

      setMetaTag('name', 'description', catMeta.description);
      setMetaTag('name', 'keywords', catMeta.keywords);
      const catPrimaryKey = currentCategory === 'Cyber Security' ? 'cybersecurity' : currentCategory === 'Autonomous Systems Hub' ? 'autonomous systems' : 'security tools';
      setMetaTag('name', 'primary-keyword', catPrimaryKey);
      setMetaTag('name', 'author', 'YinYangYoHackers Research Staff');
      setMetaTag('name', 'robots', 'index, follow');
      setMetaTag('http-equiv', 'X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      setMetaTag('name', 'X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

      const catUrl = `${CANONICAL_DOMAIN}${catMeta.path}`;

      setMetaTag('property', 'og:title', pageTitle);
      setMetaTag('property', 'og:description', catMeta.description);
      setMetaTag('property', 'og:type', 'website');
      setMetaTag('property', 'og:url', catUrl);
      setMetaTag('property', 'og:image', catMeta.ogImage || defaultOgImage);
      setMetaTag('property', 'og:site_name', 'YinYangYoHackers');

      setMetaTag('name', 'twitter:card', 'summary_large_image');
      setMetaTag('name', 'twitter:title', pageTitle);
      setMetaTag('name', 'twitter:description', catMeta.description);
      setMetaTag('name', 'twitter:image', catMeta.ogImage || defaultOgImage);

      setLinkTag('canonical', catUrl);
      setHreflangTags(catUrl);
      trackGaPageView(catMeta.path, pageTitle);

      setJsonLdSchema({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${CANONICAL_DOMAIN}/#organization`,
            'name': 'YinYangYoHackers',
            'url': CANONICAL_DOMAIN
          },
          {
            '@type': 'CollectionPage',
            'name': pageTitle,
            'description': catMeta.description,
            'url': catUrl,
            'about': {
              '@type': 'Thing',
              'name': currentCategory
            }
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': CANONICAL_DOMAIN
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': currentCategory,
                'item': catUrl
              }
            ]
          }
        ]
      });

      return;
    }

    // 4. Case D: Default Home Page
    const homeTitle = 'YinYangYoHackers | Cybersecurity Research, Penetration Testing & Zero-Trust Hardening';
    document.title = homeTitle;
    const clampedDefaultDesc = clampDescription(defaultDescription, 145);
    setMetaTag('name', 'description', clampedDefaultDesc);
    setMetaTag('name', 'keywords', 'Autonomous Cybersecurity, ethical hacking, autonomous systems, cybersecurity research, penetration testing, zero trust hardening, local compute, deepseek r1, YinYangYoHackers Research Staff');
    setMetaTag('name', 'primary-keyword', 'Cybersecurity, Ethical Hacking');
    setMetaTag('name', 'author', 'YinYangYoHackers Research Staff');
    setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large');
    setMetaTag('http-equiv', 'X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('name', 'X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    setMetaTag('property', 'og:title', homeTitle);
    setMetaTag('property', 'og:description', clampedDefaultDesc);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:url', `${CANONICAL_DOMAIN}/`);
    setMetaTag('property', 'og:image', defaultOgImage);
    setMetaTag('property', 'og:site_name', 'YinYangYoHackers');

    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', homeTitle);
    setMetaTag('name', 'twitter:description', clampedDefaultDesc);
    setMetaTag('name', 'twitter:image', defaultOgImage);

    const canonicalUrl = `${CANONICAL_DOMAIN}/`;
    setLinkTag('canonical', canonicalUrl);
    setHreflangTags(canonicalUrl);
    trackGaPageView('/', homeTitle);

    // Site-wide Organization, WebSite & Breadcrumb Schema
    setJsonLdSchema({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${CANONICAL_DOMAIN}/#organization`,
          'name': 'YinYangYoHackers',
          'alternateName': 'YinYangYo Hackers',
          'url': CANONICAL_DOMAIN,
          'logo': {
            '@type': 'ImageObject',
            'url': `${CANONICAL_DOMAIN}/favicon.ico`,
            'caption': 'YinYangYoHackers'
          },
          'founder': {
            '@type': 'Person',
            'name': 'YinYangYoHackers Research Staff',
            'jobTitle': 'Founder & Lead Cybersecurity Researcher'
          },
          'foundingDate': '2013',
          'description': 'Cybersecurity research, sovereign private infrastructure, and audited ethical hacking tools founded by YinYangYoHackers Research Staff.'
        },
        {
          '@type': 'WebSite',
          '@id': `${CANONICAL_DOMAIN}/#website`,
          'url': CANONICAL_DOMAIN,
          'name': 'YinYangYoHackers',
          'description': 'Autonomous Cybersecurity & Ethical Hacking',
          'publisher': { '@type': 'Organization', '@id': `${CANONICAL_DOMAIN}/#organization` },
          'potentialAction': {
            '@type': 'SearchAction',
            'target': {
              '@type': 'EntryPoint',
              'urlTemplate': `${CANONICAL_DOMAIN}/?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${CANONICAL_DOMAIN}/#breadcrumb`,
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': `${CANONICAL_DOMAIN}/`
            }
          ]
        }
      ]
    });
  }, [article, currentCategory, activeView, siteTitle, defaultDescription, defaultOgImage]);
};
