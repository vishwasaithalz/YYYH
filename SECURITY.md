# Security Policy

YinYangYoHackers takes responsible security reporting seriously.

## Scope

This policy covers security issues in this repository and the application maintained from it. It does not grant permission to test the live deployment, infrastructure, or any third-party service.

Only assess systems you own or have explicit written authorisation to test.

## Reporting a vulnerability

**Please do not publish an unpatched vulnerability, credentials, personal data, or exploit instructions in a public issue.**

If GitHub private vulnerability reporting is enabled for this repository, use the repository's **Security → Report a vulnerability** workflow. Otherwise, contact the maintainer through the contact route on the [GitHub profile](https://github.com/vishwasaithalz) and request a private reporting channel.

Include, where safe:

- A concise description and affected component or version.
- The impact and realistic attack scenario.
- Reproduction steps using a local test environment or synthetic data.
- Any suggested mitigation.

Do not access, modify, or download other people's data while validating a report.

## Response expectations

Reports will be reviewed as time and project capacity allow. Please allow reasonable time for investigation and remediation before public disclosure. No fixed response or remediation SLA is currently offered.

## Secrets

Never commit real credentials. Use environment variables and the provided `.env.example` template. If a secret is exposed, revoke or rotate it immediately; removing it from the latest commit alone does not make it safe.
