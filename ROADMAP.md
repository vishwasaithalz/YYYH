# Repository roadmap

This document tracks project-level work. It is intentionally conservative: items are not marked complete until they have been implemented and verified.

## Phase 1 · Foundation

- [ ] Review tracked files for accidental secrets and sensitive data.
- [ ] Confirm environment variable names, required values, and server/client boundaries.
- [ ] Verify clean dependency installation and production build.
- [ ] Review source-map and build-output handling for production.
- [ ] Document deployment and rollback procedure.
- [ ] Add automated checks for linting and builds.

## Phase 2 · Product quality

- [ ] Test responsive layouts across mobile, tablet, and desktop.
- [ ] Review keyboard navigation, focus states, and contrast.
- [ ] Add useful loading, empty, and error states.
- [ ] Review page metadata, canonical URLs, and structured data.
- [ ] Measure real performance before making optimisation claims.

## Phase 3 · Content preservation

- [ ] Validate the legacy content manifest against the source archive.
- [ ] Preserve canonical URLs and redirects where applicable.
- [ ] Review duplicate, outdated, and broken content.
- [ ] Add editorial review and source attribution to research content.

## Phase 4 · Release readiness

- [ ] Document known limitations and supported environments.
- [ ] Review third-party dependencies and licences.
- [ ] Verify security reporting instructions.
- [ ] Publish a release only after the relevant checks pass.

## Out of scope

- Testing third-party systems without explicit authorisation.
- Publishing secrets, private data, or unverified security claims.
- Presenting planned features as completed functionality.
