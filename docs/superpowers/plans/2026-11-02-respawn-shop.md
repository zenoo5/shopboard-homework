# Respawn Shop implementation plan

This file records the implementation sequence and verification evidence for the storefront.

**Goal:** Build the user's complete browser-local storefront without committing or pushing.

**Architecture:** Pure catalog and cart functions, defensive storage, DOM access isolated in ui.js, and coordination in main.js. Use native browser controls and keep dependencies in development tooling only.

**Stack:** JavaScript ES modules, semantic HTML, mobile-first CSS, Vite, Node test runner, jsdom, ESLint, Prettier, Husky, lint-staged.

**Spec:** User requirements and `../specs/2026-11-02-respawn-shop-design.md`; later user instructions take precedence.

## Global constraints

- No TypeScript, frontend frameworks, commits, pushes, or deployment.
- Only ui.js accesses the application DOM.
- Cart persists only IDs and positive integer quantities.
- Do not invent bugs or claim unperformed browser checks passed.
- Preserve personal debugging fields for the student.

## Review focus

- Restored duplicate, unknown, malformed, or unsafe quantities must not corrupt totals.
- Unavailable browser storage must leave the cart usable and explain persistence failure.
- Repeated catalog renders must not duplicate action listeners.
- Cart rerenders must preserve meaningful keyboard focus.
- Empty catalog and cart states must remain usable on small screens.

## Tasks

1. Tooling and core tests: create package/configuration, write catalog/cart/storage behavior tests, and observe missing-feature failures. Implement products and pure functions; run the complete core suite.
2. UI and integration: write jsdom tests for combined controls, repeated filtering and single adds, all cart actions, restoration, empty results, and native dialog integration. Observe missing UI failures, then implement semantic HTML, ui.js and main.js.
3. Presentation: add mobile-first gaming storefront styling and locally served original product illustrations. Keep all focus states visible and motion minimal.
4. Verify: tests, lint, formatting check, production build, HTTP startup, architecture inspection, and browser QA if tools are available. Document actual results and exact manual steps in README; update only genuine debugging findings.

## Execution notes

- Ruling: implement in the supplied workspace without an isolated Git checkout because this is an empty project and the user prohibits commits/pushes. No Git history will be created.
- Ruling: the latest explicit build request is authorization to execute the supplied requirements with the proposed design; no additional design questions are needed.
- Use npm.cmd because PowerShell blocks npm.ps1 on this host.

## Final execution record

- Core logic implemented and 11 tests passing.
- UI, local illustrations, responsive styling, and simulated-DOM regression tests implemented.
- Separate code review found missing test globals and modal announcement routing; both were corrected. The modal regression test was added, but execution remains blocked by missing jsdom.
- Dependency installation is blocked by registry network EACCES; the offline cache lacks required packages. Full tests, ESLint, Prettier, Vite build, and Vite startup were attempted and remain unverified.
- Browser launch failed before application loading due to sandbox GPU process errors. Manual browser checks remain unverified.
- README.md contains the source tree, module interfaces, state flow, acceptance coverage, actual results, and manual checklist.
- debugging-log.md contains actual environment and review findings with personal experience placeholders preserved.
- Automatic approval review rejected removal of temporary diagnostic directories because sandbox approval is disabled. They remain ignored.
- No commits, pushes, Git initialization, or deployment performed.
