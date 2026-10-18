import { CTFChallenge } from '../types';

export const ctfChallengesData: CTFChallenge[] = [
  {
    id: 'ctf-1',
    title: 'Warmup: The Encoded Secret',
    category: 'Cryptography',
    difficulty: 'Easy',
    points: 100,
    description: 'A rogue process leaked a suspicious encoded payload in the server log.',
    scenario: 'During a live forensic audit, you intercepted this base64 string: `WVlZSHtiYXNlNjRfZGVjb2RpbmdfaXNfZWFzeV9wZWFzeX0=`',
    clue: 'Decode the string using our built-in Base64 decoder tool.',
    hints: [
      'Look at the trailing `=` sign it is standard base64 encoding.',
      'Paste it into the YinYangYoHackers Tools > Base64 Decoder.'
    ],
    flag: 'YYYH{base64_decoding_is_easy_peasy}'
  },
  {
    id: 'ctf-2',
    title: 'Web Exploit: SQL Injection Auth Bypass',
    category: 'Web',
    difficulty: 'Medium',
    points: 250,
    description: 'An ancient authentication query checks: `SELECT * FROM users WHERE username=\'$user\' AND password=\'$pass\'`',
    scenario: 'What is the classic 7-character username injection payload that always evaluates to TRUE and ignores password verification?',
    clue: 'Enter the canonical payload (Format: `\' OR 1=1--` or similar). Look at our SQL Injection cheat sheet.',
    hints: [
      'The single quote closes the username string literal.',
      'OR 1=1 makes the condition always true.',
      'Two dashes comment out the remaining password clause.'
    ],
    flag: "' OR 1=1--"
  },
  {
    id: 'ctf-3',
    title: 'Network Analysis: Secret Port of DNS',
    category: 'Network',
    difficulty: 'Easy',
    points: 150,
    description: 'What standard port number and default transport protocol does the Domain Name System (DNS) use?',
    scenario: 'Submit in the exact format: `YYYH{port_protocol}` (e.g. `YYYH{80_TCP}`).',
    clue: 'Check our Common Ports reference tool for DNS.',
    hints: [
      'DNS primarily uses UDP for standard queries.',
      'The port number is fifty-three.'
    ],
    flag: 'YYYH{53_UDP}'
  },
  {
    id: 'ctf-4',
    title: 'Cryptography: The Caesar 13 Shift (ROT13)',
    category: 'Cryptography',
    difficulty: 'Medium',
    points: 200,
    description: 'The hacker left an obfuscated flag encoded with standard ROT13 cipher: `LLLUt{ebg13_plcure_vf_irel_pynffvp}`',
    scenario: 'Shift each alphabetic letter by 13 positions to reveal the true flag.',
    clue: 'L shifted by 13 becomes Y. U becomes H.',
    hints: [
      'Applying ROT13 twice restores original plaintext.',
      'e becomes r, b becomes o, g becomes t.'
    ],
    flag: 'YYYH{rot13_cipher_is_very_classic}'
  },
  {
    id: 'ctf-5',
    title: 'Linux PrivEsc: The Dangerous Permission Bit',
    category: 'Forensics',
    difficulty: 'Hard',
    points: 300,
    description: 'What is the exact 4-letter acronym for the Linux file permission bit that runs an executable with the permissions of the file owner?',
    scenario: 'Submit the flag in format `YYYH{BIT_NAME}` (e.g. `YYYH{SUID}`).',
    clue: 'It is commonly checked via `find / -perm -u=s`.',
    hints: [
      'Set User ID on execution.',
      'Abbreviated as SUID.'
    ],
    flag: 'YYYH{SUID}'
  }
];
