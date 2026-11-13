export interface GlossaryEntry {
  term: string;
  category: 'Defensive' | 'Offensive' | 'Sovereign AI' | 'Networking' | 'Cryptography';
  definition: string;
  technicalContext: string;
  relatedArticleSlug?: string;
  cveReference?: string;
}

export const cybersecurityGlossary: GlossaryEntry[] = [
  {
    term: 'Air-Gap',
    category: 'Defensive',
    definition: 'A security measure that isolates a computer, network, or server physically from any external network, including the public internet.',
    technicalContext: 'Critical for high-security enclaves, industrial SCADA systems, private cryptographic key vaults, and local Sovereign AI compute nodes.',
    relatedArticleSlug: 'sovereign-ai-local-compute-playbook-2026'
  },
  {
    term: 'ASLR (Address Space Layout Randomization)',
    category: 'Defensive',
    definition: 'A memory-protection defense that randomizes the address space positions of key data areas such as stack, heap, and libraries.',
    technicalContext: 'Prevents adversaries from reliably predicting target memory offsets during buffer overflow and Return-Oriented Programming (ROP) exploits.',
    relatedArticleSlug: 'linux-kernel-hardening-sysctl-security-blueprint'
  },
  {
    term: 'eBPF (Extended Berkeley Packet Filter)',
    category: 'Networking',
    definition: 'A revolutionary kernel technology that allows executing sandboxed programs in the Linux kernel without changing kernel source code or loading modules.',
    technicalContext: 'Powers modern observability, high-performance packet filtering (XDP), runtime security auditing, and DDoS defense at wire speed.',
    relatedArticleSlug: 'linux-kernel-hardening-sysctl-security-blueprint'
  },
  {
    term: 'Zero-Trust Architecture',
    category: 'Defensive',
    definition: 'A cybersecurity framework built on the principle of never trust, always verify, eliminating default trust from any user or device.',
    technicalContext: 'Requires continuous authentication, strict micro-segmentation, mutual TLS (mTLS), and least-privilege role-based access control.',
    relatedArticleSlug: 'zero-trust-network-architecture-blueprint'
  },
  {
    term: 'Kerberoasting',
    category: 'Offensive',
    definition: 'A post-exploitation attack technique targeting Active Directory Service Principal Names (SPNs) to extract Kerberos TGS tickets for offline brute-force cracking.',
    technicalContext: 'Exploits service accounts that use weak passwords. Mitigated by using Group Managed Service Accounts (gMSA) and AES-256 Kerberos encryption.',
    relatedArticleSlug: 'active-directory-penetration-testing-guide'
  },
  {
    term: 'Pass-the-Hash (PtH)',
    category: 'Offensive',
    definition: 'A credential-theft technique where an adversary uses an extracted password hash rather than plaintext password to authenticate to remote hosts over NTLM or SMB.',
    technicalContext: 'Disables NTLMv1, enforces Kerberos, limits local admin password reuse with LAPS, and enables Windows Defender Credential Guard to mitigate.',
    relatedArticleSlug: 'active-directory-penetration-testing-guide'
  },
  {
    term: 'Prompt Injection',
    category: 'Sovereign AI',
    definition: 'An adversarial machine learning exploit where untrusted inputs alter the intended instructions or system constraints of a Large Language Model.',
    technicalContext: 'Can lead to unauthorized data exfiltration, system prompt leaks, and indirect tool execution. Mitigated by strict token boundaries and input sanitization.',
    relatedArticleSlug: 'ai-model-extraction-and-prompt-injection-defense'
  },
  {
    term: 'Sovereign AI',
    category: 'Sovereign AI',
    definition: 'Deploying machine learning models entirely on on-premise, private infrastructure with zero external telemetry, cloud dependency, or third-party data transmission.',
    technicalContext: 'Utilizes local inference frameworks like Ollama and vLLM on air-gapped GPU servers to comply with GDPR, HIPAA, and national security data sovereignty mandates.',
    relatedArticleSlug: 'sovereign-ai-local-compute-playbook-2026'
  },
  {
    term: 'mTLS (Mutual TLS)',
    category: 'Cryptography',
    definition: 'Two-way cryptographic authentication where both client and server verify each other X.509 digital certificates before initiating encrypted data transfer.',
    technicalContext: 'Fundamental building block of Zero-Trust microservice meshes (e.g. SPIFFE/SPIRE, Envoy) preventing unauthorized service-to-service communication.',
    relatedArticleSlug: 'zero-trust-network-architecture-blueprint'
  },
  {
    term: 'SYN Flood',
    category: 'Networking',
    definition: 'A classic Denial of Service (DoS) attack where an attacker rapidly transmits TCP SYN requests with forged IP addresses to exhaust server connection state tables.',
    technicalContext: 'Mitigated at the kernel layer using stateless SYN cookies (net.ipv4.tcp_syncookies = 1) and hardware firewall connection rate limits.',
    relatedArticleSlug: 'linux-kernel-hardening-sysctl-security-blueprint'
  },
  {
    term: 'DNSSEC (DNS Security Extensions)',
    category: 'Networking',
    definition: 'A suite of extension specifications providing DNS clients cryptographic origin authentication, data integrity, and authenticated denial of existence.',
    technicalContext: 'Employs public key cryptography (RRSIG, DNSKEY, DS records) to prevent DNS cache poisoning and malicious man-in-the-middle redirections.',
    relatedArticleSlug: 'wireshark-network-forensics-and-packet-analysis'
  },
  {
    term: 'CIDR (Classless Inter-Domain Routing)',
    category: 'Networking',
    definition: 'A method for allocating IP addresses and IP routing that replaces traditional Class A, B, and C networks with flexible prefix masks (e.g. /24).',
    technicalContext: 'Crucial for network subnetting, routing aggregation, VPC isolation, and perimeter firewall rule definitions.',
    relatedArticleSlug: 'cidr-subnet-calculator-guide'
  },
  {
    term: 'Shannon Entropy',
    category: 'Cryptography',
    definition: 'A mathematical measure of the uncertainty or randomness contained in a sequence of data, measured in bits per character.',
    technicalContext: 'Used in password strength validation (NIST SP 800-63B) and malware detection to identify encrypted payloads or packed executable code.',
    relatedArticleSlug: 'password-entropy-estimator-guide'
  },
  {
    term: 'Rootless Container',
    category: 'Defensive',
    definition: 'Running container engines (Docker, Podman) and application containers inside a user namespace without requiring host root privileges.',
    technicalContext: 'Even if an attacker breaches the container and escapes the container runtime, they only gain privileges of an unprivileged UID on the host.',
    relatedArticleSlug: 'docker-container-security-hardening'
  },
  {
    term: 'Google Dorking (OSINT)',
    category: 'Offensive',
    definition: 'Using advanced search engine operators to uncover indexed sensitive files, exposed credentials, configuration backups, and unauthenticated web portals.',
    technicalContext: 'A key passive reconnaissance technique used by ethical hackers to discover security oversights without sending direct packets to target infrastructure.',
    relatedArticleSlug: 'google-dorks-explained-100-search-operators-for-ethical-security-research'
  }
];
