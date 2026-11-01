# Contributing

Thanks for considering a contribution to YinYangYoHackers.

The project values practical improvements, clear documentation, safe experimentation, and maintainable code.

## Before you start

1. Check existing issues and discussions to avoid duplicating work.
2. For substantial changes, open an issue first to discuss the proposed approach.
3. Keep contributions focused. Prefer one concern per pull request.
4. Never include API keys, passwords, personal data, private URLs, or production credentials.

## Local setup

Requirements: Node.js and Bun.

```bash
git clone https://github.com/vishwasaithalz/YYYH.git
cd YYYH
bun install
```

Create a local environment file using the committed example and add only the values needed for your work:

```powershell
Copy-Item .env.example .env
```

Do not commit `.env`.

## Quality checks

Before submitting a change, run the checks relevant to it:

```bash
bun run lint
bun run build
```

If a check cannot be run, say so in the pull request rather than implying it passed.

## Pull request checklist

- [ ] The change has a clear purpose and limited scope.
- [ ] Existing behaviour is preserved unless the change intentionally alters it.
- [ ] No secrets or private data are included.
- [ ] Documentation is updated where needed.
- [ ] Lint/build checks were run, or limitations are stated.
- [ ] Screenshots or reproduction steps are included for visible UI changes.

## Security and responsible use

Security-related contributions must be limited to systems the contributor owns or is explicitly authorised to test. Do not submit malware, credential theft, destructive payloads, stealth/persistence mechanisms, or instructions intended to compromise third-party systems.

## Communication

Be respectful, specific, and constructive. Explain the problem, the proposed solution, and how someone else can verify the result.
