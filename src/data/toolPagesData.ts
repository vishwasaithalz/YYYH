export interface ToolPageEducationalSection {
  title: string;
  content: string[];
  codeSnippet?: string;
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface ToolPageData {
  slug: string;
  path: string;
  h1: string;
  shortExplanation: string;
  componentKey: string;
  title: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  educationalContent: {
    sections: ToolPageEducationalSection[];
  };
  relatedLinks: {
    label: string;
    path: string;
    description: string;
  }[];
}

export const TOOL_PAGES: Record<string, ToolPageData> = {
  'cidr-calculator': {
    slug: 'cidr-calculator',
    path: '/tools/cidr-calculator',
    h1: 'Free CIDR Calculator & Subnet Calculator',
    shortExplanation: 'Calculate IPv4 and IPv6 network ranges, usable addresses, subnet masks, and CIDR notation directly in your browser.',
    componentKey: 'CidrCalculatorTool',
    title: 'Free CIDR Calculator & Subnet Calculator | YinYangYo',
    metaDescription: 'Calculate IPv4 and IPv6 network ranges, usable addresses, subnet masks, and CIDR notation directly in your browser. Free zero-telemetry networking tool.',
    primaryKeyword: 'CIDR calculator',
    secondaryKeywords: ['subnet calculator', 'IPv4 subnetting', 'CIDR notation', 'network range calculator', 'wildcard mask'],
    searchIntent: 'Technical Utility / Network Engineering',
    educationalContent: {
      sections: [
        {
          title: 'What is CIDR?',
          content: [
            'Classless Inter-Domain Routing (CIDR, pronounced "cider") was introduced in 1993 (RFC 1519) to replace the rigid, wasteful classful network architecture (Class A, B, and C).',
            'In classful networking, an organization needing 300 IP addresses was forced to lease an entire Class B block with 65,536 addresses, rapidly exhausting the 32-bit IPv4 address space. CIDR allows variable-length subnet masking (VLSM), enabling network administrators to carve address allocations to the exact size required.',
            'CIDR notation expresses an IP address followed by a forward slash and a decimal number indicating the count of consecutive leading 1-bits in the subnet mask (e.g., 192.168.1.0/24).'
          ]
        },
        {
          title: 'How Does Subnetting Work?',
          content: [
            'Subnetting divides a larger contiguous IP network into two or more smaller, isolated sub-networks. This improves routing efficiency, enhances security isolation, and limits the blast radius of broadcast storms.',
            'An IPv4 address consists of 32 binary bits divided into two distinct components: the Network ID (identifying the specific network segment) and the Host ID (identifying the specific device interface). The Subnet Mask determines where the boundary between network and host bits falls.',
            'To compute the number of usable host IP addresses on any IPv4 subnet with prefix length /N, use the formula: Usable Hosts = 2^(32 - N) - 2. Two addresses are reserved by RFC standards: the Network ID (all host bits = 0) and the Broadcast Address (all host bits = 1).'
          ],
          codeSnippet: `# Calculate usable hosts for a /24 subnet:
Total Addresses = 2^(32 - 24) = 2^8 = 256
Reserved: 192.168.1.0 (Network) and 192.168.1.255 (Broadcast)
Usable Hosts   = 256 - 2 = 254 (192.168.1.1 through 192.168.1.254)`
        },
        {
          title: 'CIDR Examples & Subnet Reference Table',
          content: [
            'The following reference table outlines the most common CIDR prefixes utilized in cloud VPCs, corporate LANs, and point-to-point links:'
          ],
          table: {
            headers: ['CIDR Prefix', 'Subnet Mask', 'Total Addresses', 'Usable Hosts', 'Common Production Use Case'],
            rows: [
              ['/32', '255.255.255.255', '1', '1', 'Single host routing / Loopback interface'],
              ['/30', '255.255.255.252', '4', '2', 'Point-to-point router links & WireGuard tunnels'],
              ['/29', '255.255.255.248', '8', '6', 'Small public IP block from ISP / HA firewall cluster'],
              ['/28', '255.255.255.240', '16', '14', 'DMZ server enclave / Bastion microsegment'],
              ['/27', '255.255.255.224', '32', '30', 'Kubernetes node cluster subnet'],
              ['/24', '255.255.255.0', '256', '254', 'Standard branch office LAN / Docker bridge network'],
              ['/20', '255.255.240.0', '4,096', '4,094', 'Corporate enterprise campus VLAN'],
              ['/16', '255.255.0.0', '65,536', '65,534', 'Cloud VPC (AWS, Azure, GCP virtual private network)'],
              ['/8', '255.0.0.0', '16,777,216', '16,777,214', 'Enterprise RFC 1918 supernet (10.0.0.0/8)']
            ]
          }
        },
        {
          title: 'IPv4 vs IPv6 Subnetting Architecture',
          content: [
            'IPv4 utilizes a 32-bit address space, yielding approximately 4.29 billion total theoretical addresses. In contrast, IPv6 features a 128-bit address space (2^128, or ~3.4 × 10^38 addresses), completely eliminating the need for NAT (Network Address Translation).',
            'In IPv6, the standard end-user allocation from an ISP is typically a /48 or /56 prefix. The standard single subnet size in IPv6 is always /64 (comprising 64 network bits and 64 interface identifier bits). A single /64 subnet contains 18,446,744,073,709,551,616 unique addresses, more than the entire IPv4 Internet combined.',
            'IPv6 eliminates broadcast addressing entirely, replacing it with efficient multicast groups (e.g., ff02::1 for all nodes on link).'
          ]
        }
      ]
    },
    relatedLinks: [
      { label: 'Network Security', path: '/cybersecurity', description: 'Zero-trust network architecture, packet analysis & IDS/IPS' },
      { label: 'Zero Trust', path: '/sovereign-ai-infrastructure', description: 'Zero-trust infrastructure and isolated network segmentation' },
      { label: 'Infrastructure Hardening', path: '/technology', description: 'Linux kernel sysctl network hardening & nftables firewall guides' },
      { label: 'Air-Gapped Systems', path: '/air-gapped-ai', description: 'Completely isolated on-premise compute with zero external network egress' }
    ]
  },

  'hash-analyzer': {
    slug: 'hash-analyzer',
    path: '/tools/hash-analyzer',
    h1: 'Free Hash Analyzer, Identifier & Checksum Validator',
    shortExplanation: 'Generate, inspect, identify, and verify SHA-256, SHA-512, SHA-384, SHA-1, and MD5 cryptographic hashes directly in your browser.',
    componentKey: 'HashAnalyzerTool',
    title: 'Free Hash Analyzer & Checksum Validator | YinYangYo',
    metaDescription: 'Generate and verify SHA-256, SHA-512, MD5, and bcrypt hashes. Free zero-telemetry cryptographic hash analyzer and checksum validator.',
    primaryKeyword: 'hash analyzer',
    secondaryKeywords: ['checksum validator', 'hash identifier', 'SHA256 generator', 'MD5 verifier', 'cryptographic hash tool'],
    searchIntent: 'Cryptographic Verification / Security Utility',
    educationalContent: {
      sections: [
        {
          title: 'What is a Cryptographic Hash Function?',
          content: [
            'A cryptographic hash function is a deterministic mathematical algorithm that maps arbitrary-length digital input data (a password, a string, or an ISO disk image) to a fixed-size bit string known as a digest, hash, or checksum.',
            'Cryptographic hash functions must satisfy three fundamental security properties:',
            '1. Pre-image Resistance (One-Way): Given a hash digest h, it must be computationally infeasible to reconstruct the original input x such that hash(x) = h.',
            '2. Second Pre-image Resistance (Weak Collision Resistance): Given an input x, it must be infeasible to find a different input y such that hash(x) = hash(y).',
            '3. Collision Resistance (Strong Collision Resistance): It must be infeasible to find ANY two distinct inputs x and y that produce the exact same hash output.'
          ]
        },
        {
          title: 'How Does Hash Analysis & Identification Work?',
          content: [
            'Security analysts frequently encounter raw hashes during incident response, malware forensics, and penetration testing. Hashes can be identified by inspecting their character length, character set (hexadecimal vs base64), and standardized cryptographic prefixes.',
            'For example, a 32-character hexadecimal string is typically MD5 or NTLM. A 64-character hexadecimal string is SHA-256 or BLAKE2s. Hashes prefixed with $2y$ or $2a$ are bcrypt hashes, while $argon2id$ represents the modern memory-hard Argon2 standard.'
          ]
        },
        {
          title: 'Cryptographic Checksum vs Password Hashing',
          content: [
            'A critical distinction in cybersecurity is between fast checksum hashes and slow, memory-hard password hashes.',
            'Fast Hashes (SHA-256, SHA-512, BLAKE3): Designed for rapid file verification and data integrity. They process gigabytes per second on modern hardware. Because they are so fast, using raw SHA-256 for user passwords is dangerous, adversaries can test billions of guesses per second on a single GPU.',
            'Slow Key Derivation Functions (Argon2id, bcrypt, PBKDF2): Designed specifically for password authentication. They incorporate configurable work factors (computational rounds) and memory-hardness to deliberately slow down brute-force and ASIC/GPU attacks.'
          ],
          codeSnippet: `# Linux Terminal: Verify file integrity with SHA-256
sha256sum ubuntu-24.04-live-server-amd64.iso

# Compare against publisher checksum automatically
echo "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  target.bin" | sha256sum -c -`
        },
        {
          title: 'Hash Algorithm Security Comparison',
          content: [
            'The following comparison highlights why modern systems have phased out legacy algorithms:'
          ],
          table: {
            headers: ['Algorithm', 'Digest Size', 'Collision Status', 'Primary Vulnerability', 'Current Industry Recommendation'],
            rows: [
              ['MD5', '128 bits', 'BROKEN', 'Flame malware used MD5 collisions to forge code signatures', 'Never use. Replace with SHA-256 or BLAKE3.'],
              ['SHA-1', '160 bits', 'BROKEN', 'Google SHAttered attack (2017) demonstrated practical collision', 'Deprecated. Prohibited in TLS and git signing.'],
              ['SHA-256', '256 bits', 'SECURE', 'Length extension attacks (mitigated by HMAC-SHA256)', 'Current global standard for certificates & checksums.'],
              ['SHA-512', '512 bits', 'SECURE', 'No known practical attacks. High quantum security margin.', 'Recommended for long-term archival integrity.'],
              ['Argon2id', 'Configurable', 'SECURE', 'Winner of Password Hashing Competition (PHC)', 'Best-practice standard for password storage.']
            ]
          }
        }
      ]
    },
    relatedLinks: [
      { label: 'Network Security', path: '/cybersecurity', description: 'Zero-trust network architecture, packet analysis & IDS/IPS' },
      { label: 'Zero Trust', path: '/sovereign-ai-infrastructure', description: 'Zero-trust infrastructure and isolated network segmentation' },
      { label: 'Infrastructure Hardening', path: '/technology', description: 'Linux kernel sysctl network hardening & nftables firewall guides' },
      { label: 'Model Security', path: '/ai-security', description: 'Protect neural models, weights custody & cryptographic model signing' }
    ]
  },

  'password-entropy': {
    slug: 'password-entropy',
    path: '/tools/password-entropy',
    h1: 'Free Password Entropy & Crack Time Calculator',
    shortExplanation: 'Calculate Shannon password entropy in bits, total search space, and estimated cracking time across consumer GPUs and supercomputer clusters.',
    componentKey: 'PasswordEntropyTool',
    title: 'Free Password Entropy & Crack Time Calculator | YinYangYo',
    metaDescription: 'Calculate Shannon password entropy in bits, brute-force cracking time, and NIST SP 800-63B compliance directly in your browser.',
    primaryKeyword: 'password entropy calculator',
    secondaryKeywords: ['crack time calculator', 'password strength tester', 'Shannon entropy', 'NIST password guidelines', 'brute force calculator'],
    searchIntent: 'Authentication Security / Cryptographic Utility',
    educationalContent: {
      sections: [
        {
          title: 'What is Password Entropy?',
          content: [
            'Password entropy is a mathematical measurement of a password\'s unpredictability and randomness, quantified in binary bits (Shannon entropy).',
            'Every bit of entropy doubles the number of guesses an attacker must attempt to exhaust the search space. A password with 60 bits of entropy requires 2^60 (approximately 1.15 quintillion) operations to test every combination in the worst-case scenario.',
            'The formula for calculating the Shannon entropy of an independently randomized character string is: Entropy (bits) = Length × log2(Pool Size), where Pool Size represents the number of possible characters (e.g., 26 for lowercase, 62 for alphanumeric, 95 for full printable ASCII).'
          ]
        },
        {
          title: 'How Does Password Cracking Work in Reality?',
          content: [
            'Attackers rarely guess character-by-character from left to right. Modern password cracking relies on high-speed hardware and intelligent heuristics:',
            '1. Dictionary Attacks: Testing lists of billions of breached passwords (such as RockYou2024) within seconds.',
            '2. Rule-Based Mutation: Using tools like Hashcat to mutate common words with common substitutions (e.g., replacing "a" with "@", capitalizing the first letter, appending "2024!").',
            '3. Mask Attacks: Testing structural templates, such as [Upper][Lower][Lower][Lower][Digit][Digit][Symbol].',
            '4. Pure Exhaustive Brute-Force: Used when passwords are long, random, or passphrases with no detectable pattern.'
          ],
          codeSnippet: `# Calculate brute force search space:
Character Pool (R) = 26 (lower) + 26 (upper) + 10 (digits) + 33 (symbols) = 95
Length (L)         = 16 characters
Combinations       = 95^16 ≈ 4.4 × 10^31 combinations
Entropy            = 16 × log2(95) ≈ 105.1 bits`
        },
        {
          title: 'NIST SP 800-63B Guidelines vs Outdated Rules',
          content: [
            'For over two decades, organizations enforced arbitrary complexity rules (requiring one uppercase, one digit, one symbol, and forced 90-day password expiration). NIST Special Publication 800-63B officially deprecated these practices after research proved they lead to predictable, weaker passwords (like "Spring2024!").',
            'Modern NIST SP 800-63B recommendations emphasize:',
            '• Minimum Length over Arbitrary Complexity: Length provides exponential entropy growth. A 4-word passphrase like "correct-horse-battery-staple" provides ~60-80 bits of entropy and is easy to memorize.',
            '• Eliminate Periodic Expiration: Frequent forced resets cause users to make minimal incrementations rather than creating strong passwords.',
            '• Check Against Breached Dictionaries: Deny passwords that appear in known breach compilations.',
            '• Multi-Factor Authentication (MFA): Enforce FIDO2 / WebAuthn hardware security keys to render password theft harmless.'
          ]
        },
        {
          title: 'Entropy Benchmarks & Cracking Times',
          content: [
            'The following table illustrates estimated time to crack across different entropy tiers at 100 billion guesses per second (8x modern GPU rig):'
          ],
          table: {
            headers: ['Entropy Tier', 'Bits of Entropy', 'Search Space (Combinations)', 'Crack Time at 100B/sec', 'Security Verdict'],
            rows: [
              ['Very Weak', '< 28 bits', '< 2.6 × 10^8', 'Under 0.003 seconds', 'Trivially cracked instantly.'],
              ['Weak', '28 to 35 bits', '2.6 × 10^8 to 3.4 × 10^10', 'Under 1 second', 'Unacceptable for any production account.'],
              ['Moderate', '36 to 59 bits', '6.8 × 10^10 to 5.7 × 10^17', 'Seconds to several months', 'Vulnerable to targeted offline GPU attacks.'],
              ['Strong', '60 to 79 bits', '1.1 × 10^18 to 6.0 × 10^23', 'Hundreds to thousands of years', 'Secure against current commodity GPU farms.'],
              ['Very Strong', '80 to 127 bits', '1.2 × 10^24 to 1.7 × 10^38', 'Millions of years', 'Enterprise-grade protection.'],
              ['Military / Quantum', '128+ bits', '> 3.4 × 10^38', 'Trillions of centuries', 'Resistant to classical and quantum brute-force.']
            ]
          }
        }
      ]
    },
    relatedLinks: [
      { label: 'Network Security', path: '/cybersecurity', description: 'Zero-trust network architecture, packet analysis & IDS/IPS' },
      { label: 'Zero Trust', path: '/sovereign-ai-infrastructure', description: 'Zero-trust infrastructure and isolated network segmentation' },
      { label: 'Infrastructure Hardening', path: '/technology', description: 'Linux kernel sysctl network hardening & nftables firewall guides' },
      { label: 'Hash Analyzer', path: '/tools/hash-analyzer', description: 'Inspect cryptographic checksums, bcrypt, Argon2 & SHA-256' }
    ]
  },

  'http-security-headers': {
    slug: 'http-security-headers',
    path: '/tools/http-security-headers',
    h1: 'Free HTTP Security Headers Analyzer & Config Generator',
    shortExplanation: 'Analyze and generate hardened HTTP response headers for Nginx, Apache, Caddy, Cloudflare, and Express to mitigate XSS, Clickjacking, and MIME sniffing.',
    componentKey: 'HttpSecurityHeadersTool',
    title: 'Free HTTP Security Headers Generator | YinYangYo',
    metaDescription: 'Generate hardened HTTP response headers (HSTS, CSP, X-Frame-Options) for Nginx, Apache, and Cloudflare. Free zero-telemetry cybersecurity tool.',
    primaryKeyword: 'HTTP security headers generator',
    secondaryKeywords: ['HSTS generator', 'CSP builder', 'content security policy', 'X-Frame-Options', 'security headers test'],
    searchIntent: 'DevSecOps / Web Hardening Utility',
    educationalContent: {
      sections: [
        {
          title: 'What are HTTP Security Headers?',
          content: [
            'HTTP security headers are HTTP response headers returned by web servers and reverse proxies that instruct web browsers on how to handle website content and enforce strict client-side security policies.',
            'Without security headers, modern browsers operate in permissive legacy modes, leaving users vulnerable to Cross-Site Scripting (XSS), Clickjacking (UI redressing), packet sniffing on unencrypted Wi-Fi, and side-channel data leakage.'
          ]
        },
        {
          title: 'Essential Security Headers Explained',
          content: [
            '1. Strict-Transport-Security (HSTS): Enforces HTTPS connections and prevents SSL stripping attacks. The includeSubDomains directive secures all child domains, while preload submits your domain to Google Chrome\'s hardcoded browser preload list.',
            '2. Content-Security-Policy (CSP): A powerful defense-in-depth header restricting the origins from which scripts, styles, images, and fonts can load. Mitigates XSS and data exfiltration.',
            '3. X-Frame-Options: Restricts whether your website can be rendered inside an <iframe> or <object>. Setting this to DENY eliminates Clickjacking attacks entirely.',
            '4. X-Content-Type-Options: Set to nosniff to prevent browsers from MIME-type sniffing executable files disguised as images or plain text.',
            '5. Referrer-Policy: Prevents sensitive path or token information in URLs from being leaked to third-party analytics or external links.',
            '6. Permissions-Policy: Disables powerful browser APIs (such as geolocation, camera, microphone, and USB devices) unless explicitly authorized.'
          ],
          codeSnippet: `# Hardened Nginx HTTP Security Headers Configuration
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; frame-ancestors 'none'; base-uri 'self';" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;`
        },
        {
          title: 'How Content-Security-Policy (CSP) Neutralizes XSS',
          content: [
            'Stored and reflected Cross-Site Scripting (XSS) occurs when an attacker injects malicious JavaScript into a web application. If a browser executes that injected script, the attacker can steal session cookies, capture keystrokes, or issue unauthorized transactions.',
            'With a strict Content-Security-Policy, the browser refuses to execute any inline script (<script>alert(1)</script>) or load code from unapproved domains, rendering the injection harmless even if the backend application failed to sanitize the input.'
          ]
        }
      ]
    },
    relatedLinks: [
      { label: 'Network Security', path: '/cybersecurity', description: 'Zero-trust network architecture, packet analysis & IDS/IPS' },
      { label: 'Zero Trust', path: '/sovereign-ai-infrastructure', description: 'Zero-trust infrastructure and isolated network segmentation' },
      { label: 'Infrastructure Hardening', path: '/technology', description: 'Linux kernel sysctl network hardening & nftables firewall guides' },
      { label: 'SSL Checker', path: '/tools/ssl-checker', description: 'Audit TLS 1.3 cipher suites and certificate chains' }
    ]
  },

  'ssl-checker': {
    slug: 'ssl-checker',
    path: '/tools/ssl-checker',
    h1: 'Free SSL / TLS Certificate & Cipher Suite Inspector',
    shortExplanation: 'Audit SSL/TLS certificate validity, protocol versions (TLS 1.3/1.2), forward secrecy cipher suites, and generate OpenSSL CLI diagnostic commands.',
    componentKey: 'SslCheckerTool',
    title: 'Free SSL / TLS Certificate Inspector | YinYangYo',
    metaDescription: 'Audit SSL/TLS certificates, verify TLS 1.3 cipher suites, check certificate expiration, and generate OpenSSL commands directly in your browser.',
    primaryKeyword: 'SSL certificate checker',
    secondaryKeywords: ['TLS cipher suite auditor', 'OpenSSL command generator', 'TLS 1.3 inspector', 'certificate expiry check', 'forward secrecy test'],
    searchIntent: 'Infrastructure Diagnostics / Cryptographic Audit',
    educationalContent: {
      sections: [
        {
          title: 'What is SSL/TLS Certificate Verification?',
          content: [
            'Transport Layer Security (TLS): the successor to the deprecated Secure Sockets Layer (SSL): provides confidentiality, data integrity, and mutual authentication for web traffic.',
            'When a client connects to an HTTPS server, it validates the server\'s digital certificate against trusted Certificate Authorities (CAs) installed in the operating system root store. The certificate proves that the domain owner possesses the private key corresponding to the public key presented during the handshake.'
          ]
        },
        {
          title: 'TLS 1.2 vs TLS 1.3: Architectural Evolution',
          content: [
            'TLS 1.3 (RFC 8446) represented the largest architectural overhaul in cryptographic transport history:',
            '• 1-RTT Handshake: Reduced connection latency from two round-trip times (2-RTT) to a single round-trip (1-RTT), with optional 0-RTT session resumption.',
            '• Removed Obsolete Cryptography: Permanently excised insecure primitives including MD5, SHA-1, RC4, DES, 3DES, static RSA key exchange, and custom Diffie-Hellman groups.',
            '• Mandatory Perfect Forward Secrecy (PFS): Requires ephemeral key exchanges (ECDHE or DHE). If a server\'s private master key is compromised in the future, past recorded encrypted traffic cannot be decrypted.',
            '• Encrypted Handshake: All handshake messages following the ServerHello are encrypted, preventing eavesdroppers from observing certificate Subject Alternative Names (SAN).'
          ],
          codeSnippet: `# Audit active server cipher suites using OpenSSL
openssl s_client -connect yinyangyohackers.com:443 -servername yinyangyohackers.com -tls1_3

# Check certificate expiration and issuer details
echo | openssl s_client -servername yinyangyohackers.com -connect yinyangyohackers.com:443 2>/dev/null | openssl x509 -noout -dates -issuer -subject`
        },
        {
          title: 'Key TLS Security Benchmarks',
          content: [
            'A modern, hardened TLS deployment must satisfy the following criteria:',
            '1. Disable Legacy Protocols: Disable SSL 2.0, SSL 3.0, TLS 1.0, and TLS 1.1 completely.',
            '2. Restrict to AEAD Ciphers: Prioritize authenticated encryption algorithms such as AES-256-GCM, AES-128-GCM, and CHACHA20-POLY1305.',
            '3. Enable OCSP Stapling: The web server periodically queries the CA for revocation status and staples the timestamped cryptographic proof to the TLS handshake, eliminating client DNS leakage to third-party CA servers.',
            '4. Implement HSTS with Preload: Enforce strict HTTPS redirection and submit the domain to the browser preload list.'
          ]
        }
      ]
    },
    relatedLinks: [
      { label: 'Network Security', path: '/cybersecurity', description: 'Zero-trust network architecture, packet analysis & IDS/IPS' },
      { label: 'Zero Trust', path: '/sovereign-ai-infrastructure', description: 'Zero-trust infrastructure and isolated network segmentation' },
      { label: 'Infrastructure Hardening', path: '/technology', description: 'Linux kernel sysctl network hardening & nftables firewall guides' },
      { label: 'Security Headers', path: '/tools/http-security-headers', description: 'Configure HSTS, CSP and strict browser security headers' }
    ]
  }
};
