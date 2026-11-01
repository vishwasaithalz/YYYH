<!--
  YinYangYoHackers
  A clean, maintainable home for the project's code, research and legacy archive.
-->

<div align="center">

# YIN · YANG · YO

### Security research. Practical tools. Open computing.

**An independent project exploring defensive security, responsible adversarial testing, and useful open-source technology.**

[![Repository](https://img.shields.io/badge/status-active%20development-8b5cf6?style=flat-square)](https://github.com/vishwasaithalz/YYYH)
[![Built with TypeScript](https://img.shields.io/badge/TypeScript-project-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Frontend](https://img.shields.io/badge/UI-React-61DAFB?style=flat-square&logo=react&logoColor=111827)](https://react.dev/)
[![Build](https://img.shields.io/badge/build-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)

**[Live project](https://yyyh-phi.vercel.app) · [Source](https://github.com/vishwasaithalz/YYYH) · [Maintainer](https://github.com/vishwasaithalz)**

</div>

---

## The idea

YinYangYoHackers (YYYH) is a long-running independent technology project whose roots go back to **2013**. It brings together security learning, practical engineering, and the freedom to understand and improve the systems we use.

The project is organised around three complementary ideas:

| Pillar | Focus | What it means |
|---|---|---|
| **YIN** | Defensive security | Hardening, privacy, resilience, and safer defaults |
| **YANG** | Responsible security testing | Understanding weaknesses in systems you own or are authorised to assess |
| **YO** | Open computing | Useful tools, automation, experimentation, and accessible knowledge |

The goal is not noise or security theatre. It is practical work, documented clearly.

## What lives here

- **Web application** — the current TypeScript and React application.
- **Research and learning** — security and technology articles, notes, and explainers.
- **Legacy content archive** — a structured record of material from the project's earlier publishing history.
- **Engineering notes** — implementation logs, content inventory, and SEO planning.
- **Experiments** — small tools and integrations developed as the project evolves.

> This repository is a work in progress. A listed topic or planned capability should not be interpreted as a claim that a production-ready tool or formal security audit already exists.

## Technology

| Layer | Current project components |
|---|---|
| Application | React 19, TypeScript |
| Build tooling | Vite 6, esbuild |
| Server | Node.js, Express |
| Styling and UI | Tailwind CSS, Motion, Lucide |
| AI integration | Google GenAI SDK, used through server-side application code |
| Compression | Express compression and Vite build tooling |

Versions and scripts are defined in [package.json](./package.json). The project uses a Bun lockfile.

## Run locally

### Requirements

- Node.js (use a current supported LTS release where possible)
- Bun, to keep dependency installation aligned with the committed lockfile

### Setup

```bash
git clone https://github.com/vishwasaithalz/YYYH.git
cd YYYH
bun install
```

Create a local environment file from the example:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Fill in only the environment variables required for the features you intend to run. Never commit your real `.env` file or API keys.

### Development and checks

```bash
bun run dev
bun run lint
bun run build
bun run start
```

Check the scripts in [package.json](./package.json) before running them. The production start command expects a successful build first.

## Project map

```text
.
├── assets/                  # Project assets
├── public/                  # Static files served by the application
├── scripts/                 # Project scripts
├── src/                     # Frontend application
├── .env.example             # Environment variable template
├── CONTENT_MANIFEST.md      # Legacy content inventory
├── IMPLEMENTATION_LOG.md    # Engineering change notes
├── SEO_IMPLEMENTATION_PLAN.md
├── server.ts                # Server entry point
├── package.json             # Scripts and dependencies
└── vite.config.ts            # Vite configuration
```

## Working principles

1. **Authorisation first.** Test only systems you own or have explicit permission to assess.
2. **Privacy by default.** Keep credentials server-side, use environment variables, and collect only what a feature genuinely needs.
3. **Evidence over claims.** Document what was built, how it was tested, and what remains incomplete.
4. **Preserve useful history.** Improve and organise legacy material rather than erasing the project's roots.
5. **Keep it maintainable.** Prefer understandable code, reproducible setup, and focused changes.

## Roadmap

- [ ] Complete a repository and dependency hygiene review.
- [ ] Document application architecture and required environment variables.
- [ ] Verify the production build and deployment configuration.
- [ ] Review accessibility, mobile behaviour, performance, and error states.
- [ ] Continue organising and improving the legacy content archive.
- [ ] Publish clear documentation for each tool before calling it production-ready.

## Security

Please read [SECURITY.md](./SECURITY.md) before reporting a vulnerability. Do not include secrets, personal data, or exploit details in public issues.

## Contributing

Small, focused, well-explained contributions are welcome. Start with [CONTRIBUTING.md](./CONTRIBUTING.md), describe the problem, and include steps to reproduce and test your change.

---

<div align="center">

**YIN for resilience · YANG for understanding · YO for building**

*Independent project. Evolving in public, one verifiable improvement at a time.*

</div>
