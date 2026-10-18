import { ToolDirectoryItem, ContentCluster } from '../types';

export const contentClustersData: ContentCluster[] = [
  {
    id: 'cluster-ethical-hacking',
    name: 'Ethical Hacking & Web Defense Cluster',
    category: 'Cybersecurity',
    description: 'Foundational offensive testing methodologies, legal boundaries, open-source pentesting tools, and defensive architecture.',
    pillarArticleSlug: 'ethical-hacking-the-complete-beginners-guide',
    supportingArticleSlugs: [
      'how-penetration-testing-methodology-works',
      'best-open-source-cybersecurity-tools',
      'how-to-build-a-legal-hacking-lab',
      'linux-security-hardening-essential-commands',
      'web-reconnaissance-subdomains-port-mapping',
      'phishing-awareness-and-social-engineering-defense',
      'wireshark-packet-analysis-guide-for-beginners',
      'cybersecurity-fundamentals-the-complete-beginners-guide'
    ],
    targetKeywords: [
      'ethical hacking for beginners',
      'how penetration testing works',
      'best open source cybersecurity tools',
      'how to create a cybersecurity lab',
      'free ethical hacking tools for beginners'
    ]
  },
  {
    id: 'cluster-local-ai',
    name: 'Local Compute & Open-Source LLM Cluster',
    category: 'Autonomous Systems & Productivity',
    description: 'Running private neural models locally with Ollama, building private RAG knowledge bases, open-source coding tools, and autonomous security agents.',
    pillarArticleSlug: 'how-to-run-ai-locally-with-ollama',
    supportingArticleSlugs: [
      'best-open-source-ai-coding-tools',
      'build-a-private-local-rag-knowledge-base',
      'open-source-ai-productivity-tools-2026',
      'autonomous-ai-agents-cyber-threat-hunting',
      'privacy-first-ai-note-taking-obsidian',
      'top-open-source-ai-research-assistants',
      'ai-security-a-practical-guide-to-securing-ai-systems'
    ],
    targetKeywords: [
      'open source automated tools that run locally',
      'open source automated coding tools',
      'open source smart productivity tools',
      'privacy-first smart note-taking',
      'open source automated research assistants'
    ]
  },
  {
    id: 'cluster-linux-sysadmin',
    name: 'Linux Hardening & Sysadmin Cluster',
    category: 'Blueprint',
    description: 'Systematic hardening tutorials for Linux servers, SSH key enforcement, UFW rate limiting, Docker containment, and automated encrypted backups.',
    pillarArticleSlug: 'how-to-harden-a-linux-server-full-guide',
    supportingArticleSlugs: [
      'how-to-setup-a-private-wireguard-vpn-on-vps',
      'how-to-block-ads-network-wide-with-pi-hole',
      'how-to-configure-firefox-for-maximum-privacy',
      'automate-encrypted-backups-with-borg-and-rclone',
      'how-to-secure-docker-containers-in-production',
      'troubleshoot-network-connectivity-on-linux-cli'
    ],
    targetKeywords: [
      'how to harden a linux server',
      'how to setup private wireguard vpn',
      'how to block ads network wide pi-hole',
      'how to secure docker containers',
      'Linux security tools for beginners'
    ]
  },
  {
    id: 'cluster-privacy-selfhosted',
    name: 'Privacy & Self-Hosted Tools Cluster',
    category: 'Tools & Apps',
    description: 'Deep reviews and deployment guides for verified open-source password managers, homelab productivity tools, and browser extensions.',
    pillarArticleSlug: 'best-open-source-privacy-tools-2026',
    supportingArticleSlugs: [
      'bitwarden-vs-vaultwarden-which-is-better',
      'top-self-hosted-productivity-apps',
      'top-linux-security-tools-for-sysadmins',
      'essential-browser-extensions-for-privacy',
      'best-free-developer-tools-for-api-and-code-auditing',
      'wireshark-packet-analysis-guide-for-beginners'
    ],
    targetKeywords: [
      'best free privacy tools',
      'best open source alternatives to bitwarden',
      'best self hosted productivity tools',
      'essential browser extensions for privacy',
      'free developer tools for security'
    ]
  }
];

export const toolsDirectoryData: ToolDirectoryItem[] = [
  // 1. Security Tools
  {
    id: 'tool-nmap',
    name: 'Nmap (Network Mapper)',
    category: 'Security Tools',
    tagline: 'The world standard for network discovery and vulnerability scanning',
    description: 'Free and open-source utility for network discovery, port scanning, OS detection, and security auditing with the powerful Nmap Scripting Engine (NSE).',
    license: 'GPL-3.0',
    platforms: ['Linux', 'Windows', 'macOS'],
    githubUrl: 'https://github.com/nmap/nmap',
    websiteUrl: 'https://nmap.org',
    stars: '9.8k',
    installCommand: 'sudo apt install nmap',
    pricing: '100% Free & Open Source',
    featured: true,
    reviewArticleSlug: 'best-open-source-cybersecurity-tools'
  },
  {
    id: 'tool-wireshark',
    name: 'Wireshark',
    category: 'Security Tools',
    tagline: 'The world\'s foremost and widely-used network protocol analyzer',
    description: 'Deep packet inspection tool capable of capturing, filtering, and dissecting hundreds of network protocols in real time.',
    license: 'GPL-3.0',
    platforms: ['Linux', 'Windows', 'macOS'],
    githubUrl: 'https://gitlab.com/wireshark/wireshark',
    websiteUrl: 'https://www.wireshark.org',
    stars: '7.5k',
    installCommand: 'sudo apt install wireshark',
    pricing: '100% Free & Open Source',
    featured: true,
    reviewArticleSlug: 'wireshark-packet-analysis-guide-for-beginners'
  },
  {
    id: 'tool-nuclei',
    name: 'Nuclei',
    category: 'Security Tools',
    tagline: 'Fast and customizable vulnerability scanner based on simple YAML DSL',
    description: 'ProjectDiscovery\'s ultra-fast scanner that sends targeted requests based on community-driven templates for discovering security weaknesses and exposures.',
    license: 'MIT',
    platforms: ['Linux', 'Windows', 'macOS'],
    githubUrl: 'https://github.com/projectdiscovery/nuclei',
    websiteUrl: 'https://projectdiscovery.io/nuclei',
    stars: '21.5k',
    installCommand: 'go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest',
    pricing: '100% Free & Open Source',
    reviewArticleSlug: 'how-penetration-testing-methodology-works'
  },
  {
    id: 'tool-sqlmap',
    name: 'SQLmap',
    category: 'Security Tools',
    tagline: 'Automatic SQL injection and database takeover tool',
    description: 'Automates the process of detecting and exploiting SQL injection flaws and taking over database servers.',
    license: 'GPL-3.0',
    platforms: ['Linux', 'Windows', 'macOS'],
    githubUrl: 'https://github.com/sqlmapproject/sqlmap',
    websiteUrl: 'https://sqlmap.org',
    stars: '32k',
    installCommand: 'sudo apt install sqlmap',
    pricing: '100% Free & Open Source',
    reviewArticleSlug: 'best-open-source-cybersecurity-tools'
  },

  // 2. Automated Tools
  {
    id: 'tool-ollama',
    name: 'Ollama',
    category: 'Automated Tools',
    tagline: 'Get up and running with large language models locally',
    description: 'Lightweight, extensible framework for building and running LLMs (Llama 3, Mistral, DeepSeek) locally on CPU and GPU with zero cloud telemetry.',
    license: 'MIT',
    platforms: ['Linux', 'macOS', 'Windows', 'Docker'],
    githubUrl: 'https://github.com/ollama/ollama',
    websiteUrl: 'https://ollama.com',
    stars: '115k',
    installCommand: 'curl -fsSL https://ollama.com/install.sh | sh',
    pricing: '100% Free & Open Source',
    featured: true,
    reviewArticleSlug: 'how-to-run-ai-locally-with-ollama'
  },
  {
    id: 'tool-open-webui',
    name: 'Open WebUI',
    category: 'Automated Tools',
    tagline: 'User-friendly, privacy-first ChatGPT alternative for local LLMs',
    description: 'Self-hosted neural model interface supporting Ollama, document RAG, multiple model comparisons, voice interaction, and granular user permissions.',
    license: 'MIT',
    platforms: ['Docker', 'Linux', 'Web'],
    githubUrl: 'https://github.com/open-webui/open-webui',
    websiteUrl: 'https://openwebui.com',
    stars: '68k',
    installCommand: 'docker run -d -p 3000:8080 -v open-webui:/app/backend/data ghcr.io/open-webui/open-webui:main',
    pricing: '100% Free & Open Source',
    featured: true,
    reviewArticleSlug: 'how-to-run-ai-locally-with-ollama'
  },
  {
    id: 'tool-continue',
    name: 'Continue.dev',
    category: 'Automated Tools',
    tagline: 'The leading open-source automated code assistant for VS Code and JetBrains',
    description: 'Connect any local model (Ollama) or custom API to VS Code and JetBrains for tab-autocomplete, refactoring, and codebase indexing.',
    license: 'Apache-2.0',
    platforms: ['Linux', 'Windows', 'macOS'],
    githubUrl: 'https://github.com/continuedev/continue',
    websiteUrl: 'https://continue.dev',
    stars: '24k',
    pricing: '100% Free & Open Source',
    reviewArticleSlug: 'best-open-source-ai-coding-tools'
  },
  {
    id: 'tool-perplexica',
    name: 'Perplexica',
    category: 'Automated Tools',
    tagline: 'Open-source autonomous search engine alternative to Perplexity',
    description: 'Searches the web via SearXNG and synthesizes citation-backed answers using local LLMs with zero advertising or tracking.',
    license: 'MIT',
    platforms: ['Docker', 'Linux'],
    githubUrl: 'https://github.com/ItzCrazyBlaze/Perplexica',
    websiteUrl: 'https://github.com/ItzCrazyBlaze/Perplexica',
    stars: '18k',
    pricing: '100% Free & Open Source',
    reviewArticleSlug: 'top-open-source-ai-research-assistants'
  },

  // 3. Privacy Tools
  {
    id: 'tool-bitwarden',
    name: 'Bitwarden / Vaultwarden',
    category: 'Privacy Tools',
    tagline: 'Zero-knowledge end-to-end encrypted password manager',
    description: 'Industry standard open-source password manager. Vaultwarden provides an ultra-lightweight Rust implementation for personal self-hosting.',
    license: 'GPL-3.0',
    platforms: ['Linux', 'Windows', 'macOS', 'Android', 'iOS', 'Web', 'Docker'],
    githubUrl: 'https://github.com/dani-garcia/vaultwarden',
    websiteUrl: 'https://bitwarden.com',
    stars: '42k',
    pricing: '100% Free & Open Source',
    featured: true,
    reviewArticleSlug: 'bitwarden-vs-vaultwarden-which-is-better'
  },
  {
    id: 'tool-signal',
    name: 'Signal Messenger',
    category: 'Privacy Tools',
    tagline: 'State-of-the-art end-to-end encrypted private messaging',
    description: 'Zero advertising, zero tracking, zero metadata retention. Protected by the audited open-source Signal Protocol.',
    license: 'GPL-3.0',
    platforms: ['Android', 'iOS', 'Windows', 'macOS', 'Linux'],
    githubUrl: 'https://github.com/signalapp',
    websiteUrl: 'https://signal.org',
    stars: '35k',
    pricing: '100% Free & Open Source',
    featured: true,
    reviewArticleSlug: 'best-open-source-privacy-tools-2026'
  },
  {
    id: 'tool-pihole',
    name: 'Pi-hole',
    category: 'Privacy Tools',
    tagline: 'A black hole for Internet advertisements and trackers',
    description: 'Network-wide DNS sinkhole that shields all your devices (smart TVs, phones, computers) from telemetry and malware domains without installing software on clients.',
    license: 'EUPL-1.2',
    platforms: ['Linux', 'Docker', 'Raspberry Pi'],
    githubUrl: 'https://github.com/pi-hole/pi-hole',
    websiteUrl: 'https://pi-hole.net',
    stars: '48k',
    installCommand: 'curl -sSL https://install.pi-hole.net | bash',
    pricing: '100% Free & Open Source',
    reviewArticleSlug: 'how-to-block-ads-network-wide-with-pi-hole'
  },
  {
    id: 'tool-wireguard',
    name: 'WireGuard',
    category: 'Privacy Tools',
    tagline: 'Extremely simple yet fast and modern VPN protocol',
    description: 'State-of-the-art cryptography VPN that runs directly in the Linux kernel with minimal code surface area and maximum throughput.',
    license: 'GPL-2.0',
    platforms: ['Linux', 'Windows', 'macOS', 'Android', 'iOS'],
    githubUrl: 'https://git.zx2c4.com/wireguard-linux-compat/',
    websiteUrl: 'https://www.wireguard.com',
    stars: '15k',
    pricing: '100% Free & Open Source',
    reviewArticleSlug: 'how-to-setup-a-private-wireguard-vpn-on-vps'
  },

  // 4. Developer Tools
  {
    id: 'tool-bruno',
    name: 'Bruno',
    category: 'Developer Tools',
    tagline: 'Fast and Git-friendly open-source API client',
    description: 'A revolutionary open-source alternative to Postman that saves collections directly into your Git repository as plain text files.',
    license: 'MIT',
    platforms: ['Linux', 'Windows', 'macOS'],
    githubUrl: 'https://github.com/usebruno/bruno',
    websiteUrl: 'https://www.usebruno.com',
    stars: '29k',
    pricing: '100% Free & Open Source',
    featured: true,
    reviewArticleSlug: 'best-free-developer-tools-for-api-and-code-auditing'
  },
  {
    id: 'tool-semgrep',
    name: 'Semgrep',
    category: 'Developer Tools',
    tagline: 'Fast, lightweight static analysis for finding bugs and enforcing security',
    description: 'Open-source SAST tool with simple syntax resembling source code. Finds OWASP Top 10 vulnerabilities, secrets, and logic bugs in CI/CD.',
    license: 'LGPL-2.1',
    platforms: ['Linux', 'macOS', 'Windows'],
    githubUrl: 'https://github.com/semgrep/semgrep',
    websiteUrl: 'https://semgrep.dev',
    stars: '11k',
    installCommand: 'pip install semgrep',
    pricing: '100% Free & Open Source',
    reviewArticleSlug: 'best-free-developer-tools-for-api-and-code-auditing'
  },
  {
    id: 'tool-trivy',
    name: 'Trivy',
    category: 'Developer Tools',
    tagline: 'Comprehensive security scanner for containers, Git repos, and Kubernetes',
    description: 'Finds known vulnerabilities, misconfigurations, exposed secrets, and SBOMs in container images and local file trees.',
    license: 'Apache-2.0',
    platforms: ['Linux', 'macOS', 'Windows'],
    githubUrl: 'https://github.com/aquasecurity/trivy',
    websiteUrl: 'https://trivy.dev',
    stars: '23k',
    installCommand: 'sudo apt install trivy',
    pricing: '100% Free & Open Source',
    reviewArticleSlug: 'how-to-secure-docker-containers-in-production'
  },

  // 5. Productivity & Self-Hosted Applications
  {
    id: 'tool-nextcloud',
    name: 'Nextcloud Hub',
    category: 'Self-Hosted Applications',
    tagline: 'Self-hosted productivity platform and private cloud storage',
    description: '100% open-source alternative to Google Workspace and Microsoft 365, featuring files sync, contacts, calendar, office document editing, and chat.',
    license: 'AGPL-3.0',
    platforms: ['Docker', 'Linux', 'Web'],
    githubUrl: 'https://github.com/nextcloud/server',
    websiteUrl: 'https://nextcloud.com',
    stars: '26k',
    pricing: '100% Free & Open Source',
    featured: true,
    reviewArticleSlug: 'top-self-hosted-productivity-apps'
  },
  {
    id: 'tool-obsidian',
    name: 'Obsidian',
    category: 'Productivity Applications',
    tagline: 'Sharpen your thinking with a private, flexible Markdown second brain',
    description: 'Local-first note-taking app storing plain Markdown on your device with extensible open-source community plugins for local compute and graphing.',
    license: 'Freeware / Open Core',
    platforms: ['Windows', 'macOS', 'Linux', 'Android', 'iOS'],
    websiteUrl: 'https://obsidian.md',
    pricing: '100% Free & Open Source',
    featured: true,
    reviewArticleSlug: 'privacy-first-ai-note-taking-obsidian'
  },
  {
    id: 'tool-vikunja',
    name: 'Vikunja',
    category: 'Self-Hosted Applications',
    tagline: 'The open-source, self-hostable to-do app to organize your life',
    description: 'Modern task management with Kanban boards, Gantt charts, subtasks, deadlines, reminders, and team collaboration.',
    license: 'AGPL-3.0',
    platforms: ['Docker', 'Linux', 'Web'],
    githubUrl: 'https://github.com/go-vikunja/vikunja',
    websiteUrl: 'https://vikunja.io',
    stars: '4.8k',
    pricing: '100% Free & Open Source',
    reviewArticleSlug: 'top-self-hosted-productivity-apps'
  },
  {
    id: 'tool-stirling-pdf',
    name: 'Stirling-PDF',
    category: 'Self-Hosted Applications',
    tagline: 'Powerful, locally hosted web application that does all PDF operations',
    description: '100% local self-hosted replacement for Adobe Acrobat Pro. Split, merge, rotate, convert, OCR, watermark, and encrypt PDFs securely.',
    license: 'GPL-3.0',
    platforms: ['Docker', 'Linux', 'Web'],
    githubUrl: 'https://github.com/Stirling-Tools/Stirling-PDF',
    websiteUrl: 'https://github.com/Stirling-Tools/Stirling-PDF',
    stars: '46k',
    installCommand: 'docker run -d -p 8080:8080 frooodle/s-pdf:latest',
    pricing: '100% Free & Open Source',
    reviewArticleSlug: 'top-self-hosted-productivity-apps'
  },

  // 6. Browser Extensions
  {
    id: 'tool-ublock',
    name: 'uBlock Origin',
    category: 'Browser Extensions',
    tagline: 'An efficient wide-spectrum content blocker for Chromium and Firefox',
    description: 'CPU and memory-efficient content blocker that stops ads, trackers, coin-miners, and popups with advanced dynamic filtering.',
    license: 'GPL-3.0',
    platforms: ['Web', 'Linux', 'Windows', 'macOS'],
    githubUrl: 'https://github.com/gorhill/uBlock',
    websiteUrl: 'https://ublockorigin.com',
    stars: '46k',
    pricing: '100% Free & Open Source',
    featured: true,
    reviewArticleSlug: 'essential-browser-extensions-for-privacy'
  },
  {
    id: 'tool-localcdn',
    name: 'LocalCDN',
    category: 'Browser Extensions',
    tagline: 'Emulates remote content delivery networks to protect privacy',
    description: 'Intercepts requests for common CDN frameworks (jQuery, Bootstrap, Google Fonts) and delivers them from local extension cache to prevent tracking.',
    license: 'MPL-2.0',
    platforms: ['Web'],
    githubUrl: 'https://codeberg.org/nobody/LocalCDN',
    websiteUrl: 'https://www.localcdn.org',
    pricing: '100% Free & Open Source',
    reviewArticleSlug: 'essential-browser-extensions-for-privacy'
  }
];
