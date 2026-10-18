import { PortInfo } from '../types';

export const commonPortsData: PortInfo[] = [
  {
    port: 21,
    protocol: 'TCP',
    service: 'FTP (File Transfer Protocol)',
    description: 'Used for transferring computer files between a client and server on a computer network.',
    vulnerabilities: 'Anonymous login, cleartext credential sniffing, VSFTPD 2.3.4 backdoor, ProFTPD vulnerabilities.',
    reconCommand: 'nmap -p 21 --script ftp-anon,ftp-vuln* <target>',
    hardening: 'Disable anonymous login, enforce FTPS/SFTP over TLS, use chroot jail for users.'
  },
  {
    port: 22,
    protocol: 'TCP',
    service: 'SSH (Secure Shell)',
    description: 'Encrypted network protocol for operating network services securely over an unsecured network.',
    vulnerabilities: 'Weak/default passwords, brute-force attacks, outdated OpenSSH server packages, exposed private keys.',
    reconCommand: 'ssh -v root@<target> / nmap -p 22 --script ssh2-enum-algos,ssh-auth-methods <target>',
    hardening: 'Disable password authentication, enforce public key only, disable root login (PermitRootLogin no), use Fail2ban.'
  },
  {
    port: 23,
    protocol: 'TCP',
    service: 'Telnet',
    description: 'Legacy bidirectional interactive text-oriented communication protocol.',
    vulnerabilities: 'Unencrypted cleartext traffic, credentials transmitted in plain text, easy MITM.',
    reconCommand: 'telnet <target> 23 / nmap -p 23 -sV <target>',
    hardening: 'Disable Telnet completely and migrate to SSH.'
  },
  {
    port: 25,
    protocol: 'TCP',
    service: 'SMTP (Simple Mail Transfer Protocol)',
    description: 'Communication protocol for electronic mail transmission.',
    vulnerabilities: 'Open mail relay, user enumeration via VRFY and EXPN commands, spam injection.',
    reconCommand: 'nc <target> 25 -> VRFY root / nmap -p 25 --script smtp-enum-users <target>',
    hardening: 'Disable VRFY/EXPN, require TLS, enforce SPF, DKIM, DMARC, restrict relays to authenticated users.'
  },
  {
    port: 53,
    protocol: 'TCP/UDP',
    service: 'DNS (Domain Name System)',
    description: 'Hierarchical naming system for computers, services, or other resources.',
    vulnerabilities: 'DNS Zone Transfer (AXFR), DNS Amplification DDoS, cache poisoning, subdomain takeover.',
    reconCommand: 'dig axfr @<target> domain.com / host -t axfr domain.com <target>',
    hardening: 'Restrict zone transfers to authorized secondary nameservers, enable DNSSEC, rate-limit queries.'
  },
  {
    port: 80,
    protocol: 'TCP',
    service: 'HTTP (Hypertext Transfer Protocol)',
    description: 'Foundational protocol used by the World Wide Web.',
    vulnerabilities: 'SQLi, XSS, CSRF, SSRF, File Inclusion (LFI/RFI), directory traversal, unencrypted data.',
    reconCommand: 'curl -I http://<target> / gobuster dir -u http://<target> -w /usr/share/wordlists/dirb/common.txt',
    hardening: 'Enforce automatic redirect to HTTPS (301), set HSTS headers, configure WAF, patch web servers.'
  },
  {
    port: 88,
    protocol: 'TCP/UDP',
    service: 'Kerberos',
    description: 'Computer-network authentication protocol that works on the basis of tickets in Active Directory.',
    vulnerabilities: 'Kerberoasting (TGS hash cracking), AS-REP Roasting, Golden/Silver Ticket forging.',
    reconCommand: 'nmap -p 88 --script krb5-enum-users --script-args krb5-enum-users.realm="DOMAIN.LOCAL" <target>',
    hardening: 'Use 25+ character complex passwords for service accounts (gMSA), enable AES encryption, monitor abnormal TGS requests.'
  },
  {
    port: 110,
    protocol: 'TCP',
    service: 'POP3 (Post Office Protocol v3)',
    description: 'Application-layer Internet standard protocol used by local e-mail clients to retrieve e-mail.',
    vulnerabilities: 'Cleartext authentication, credential sniffing, buffer overflows in legacy daemons.',
    reconCommand: 'nc <target> 110 -> USER admin / PASS password',
    hardening: 'Enforce POP3S (Port 995 with TLS), disable unencrypted POP3.'
  },
  {
    port: 139,
    protocol: 'TCP',
    service: 'NetBIOS-SSN',
    description: 'NetBIOS Session Service for Windows file and printer sharing.',
    vulnerabilities: 'Null session enumeration, NetBIOS name spoofing, SMB relay attacks.',
    reconCommand: 'nbtscan <target>/24 / enum4linux -a <target>',
    hardening: 'Disable NetBIOS over TCP/IP if not needed, isolate legacy network segments.'
  },
  {
    port: 161,
    protocol: 'UDP',
    service: 'SNMP (Simple Network Management Protocol)',
    description: 'Protocol for collecting and organizing information about managed devices on IP networks.',
    vulnerabilities: 'Default community strings (public, private), information disclosure, device reconfiguration.',
    reconCommand: 'snmpwalk -v2c -c public <target> / onesixtyone -c communities.txt <target>',
    hardening: 'Migrate to SNMPv3 with authPriv (encryption & authentication), disable SNMPv1/v2c.'
  },
  {
    port: 389,
    protocol: 'TCP/UDP',
    service: 'LDAP (Lightweight Directory Access Protocol)',
    description: 'Software protocol for enabling anyone to locate data about organizations, individuals, and resources.',
    vulnerabilities: 'LDAP Injection, Anonymous Bind user/group enumeration, BloodHound domain mapping.',
    reconCommand: 'ldapsearch -x -h <target> -s base namingcontexts / bloodhound-python -u user -p pass -d domain.com -ns <target>',
    hardening: 'Require LDAP signing (LDAPS on 636), disable anonymous binds.'
  },
  {
    port: 443,
    protocol: 'TCP',
    service: 'HTTPS (HTTP Secure)',
    description: 'Encrypted HTTP communication over TLS/SSL.',
    vulnerabilities: 'Weak TLS ciphers (SSLv3, TLS 1.0, Heartbleed, ROBOT), application vulnerabilities, expired certs.',
    reconCommand: 'testssl.sh https://<target> / sslscan <target>:443',
    hardening: 'Enforce TLS 1.2/1.3 only, disable weak cipher suites (RC4, 3DES), configure CSP, HSTS, and secure cookies.'
  },
  {
    port: 445,
    protocol: 'TCP',
    service: 'SMB (Server Message Block)',
    description: 'Network communication protocol for sharing files, printers, serial ports, and misc communications.',
    vulnerabilities: 'EternalBlue, SMBGhost compression vulnerability, Null Session file exfiltration, PsExec execution.',
    reconCommand: 'smbclient -L //<target> -N / crackmapexec smb <target> -u "" -p "" --shares',
    hardening: 'Disable SMBv1 completely, enforce SMB Signing, restrict access to trusted internal IP ranges.'
  },
  {
    port: 1433,
    protocol: 'TCP',
    service: 'Microsoft SQL Server (MSSQL)',
    description: 'Relational database management system developed by Microsoft.',
    vulnerabilities: 'SA default password, xp_cmdshell command execution, SQL injection, linked database hopping.',
    reconCommand: 'crackmapexec mssql <target> -u sa -p sa / sqsh -S <target> -U sa',
    hardening: 'Disable SA account or set 30+ char password, disable xp_cmdshell, bind only to localhost.'
  },
  {
    port: 3306,
    protocol: 'TCP',
    service: 'MySQL Database',
    description: 'Open-source relational database management system.',
    vulnerabilities: 'Root with empty password, SQL injection, UDF (User Defined Function) privilege escalation.',
    reconCommand: 'mysql -h <target> -u root -p / nmap -p 3306 --script mysql-empty-password <target>',
    hardening: 'Bind to 127.0.0.1, restrict remote root login, require SSL connections, use principle of least privilege.'
  },
  {
    port: 3389,
    protocol: 'TCP/UDP',
    service: 'RDP (Remote Desktop Protocol)',
    description: 'Proprietary protocol developed by Microsoft for graphic interface connection.',
    vulnerabilities: 'BlueKeep pre-authentication RCE, brute-force attacks, credential stuffing, man-in-the-middle.',
    reconCommand: 'nmap -p 3389 --script rdp-vuln-ms12-020,rdp-enum-encryption <target>',
    hardening: 'Enable Network Level Authentication (NLA), use Multi-Factor Authentication (MFA), place behind VPN.'
  },
  {
    port: 5432,
    protocol: 'TCP',
    service: 'PostgreSQL Database',
    description: 'Enterprise open source relational database.',
    vulnerabilities: 'Trust authentication misconfiguration (pg_hba.conf), RCE via COPY FROM PROGRAM, weak postgres passwords.',
    reconCommand: 'psql -h <target> -U postgres / nmap -p 5432 --script pgsql-databases <target>',
    hardening: 'Enforce scram-sha-256 in pg_hba.conf, bind to localhost, block external firewall ingress.'
  },
  {
    port: 6379,
    protocol: 'TCP',
    service: 'Redis In-Memory Store',
    description: 'In-memory data structure store, used as a database, cache, and message broker.',
    vulnerabilities: 'Unauthenticated access, writing SSH authorized_keys to disk, writing webshells, crontab overwrites.',
    reconCommand: 'redis-cli -h <target> info / redis-cli -h <target> keys "*"',
    hardening: 'Require strong AUTH password, bind to localhost (127.0.0.1), rename dangerous commands (CONFIG, FLUSHALL).'
  },
  {
    port: 8080,
    protocol: 'TCP',
    service: 'HTTP Alternate / Tomcat / Jenkins',
    description: 'Common secondary web application and administration management port.',
    vulnerabilities: 'Tomcat Manager default credentials (tomcat/s3cret), Jenkins unauthenticated script console RCE.',
    reconCommand: 'curl -I http://<target>:8080 / nikto -h http://<target>:8080',
    hardening: 'Change default credentials, restrict administrative endpoints behind VPN/SSO, patch web containers.'
  },
  {
    port: 27017,
    protocol: 'TCP',
    service: 'MongoDB',
    description: 'Source-available cross-platform document-oriented database program.',
    vulnerabilities: 'Default unauthenticated access, NoSQL injection, unauthorized data dump.',
    reconCommand: 'mongosh "mongodb://<target>:27017" / nmap -p 27017 --script mongodb-databases <target>',
    hardening: 'Enable security authorization (security.authorization: enabled), bind to localhost, use TLS.'
  }
];
