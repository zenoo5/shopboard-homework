# Respawn Shop debugging log

This file records actual debugging observations, fixes, and verification for the homework.

## Status

Implementation and TypeScript migration checks have been performed. The actual findings below came from agent investigation and code review, not the student's personal debugging experience. Historical blockers below describe earlier runs; see README.md for current verification results. Manual browser verification remains unperformed.

The entry template below uses the six fields required by the homework.

## Entry template — not an actual debugging record

Copy this template only when investigating an observed issue. Replace each placeholder with evidence; do not invent symptoms, fixes, or passing checks.

Details requiring the student's personal experience must remain `[For you to complete]`. Agent-observed findings may be recorded as explicitly attributed technical evidence, but must not be presented as something the student personally saw or did. The student should complete their own account of AI use; any agent contributions must remain accurately disclosed.

### Issue: [Short description]

- **What I saw:** [For you to complete: what you personally observed]
- **Type:** [Choose runtime / logic / state]
- **How I found it:** [For you to complete: how you personally discovered the bug; separately attribute any agent-observed reproduction steps or failing test]
- **Cause:** [Confirmed cause, or explicitly state that it is not yet confirmed]
- **Fix:** [Actual changes and affected files, followed by verification actually performed and its results; mark unperformed checks as unverified]
- **Did I use AI? For what?:** [For you to complete: describe your actual use of AI; retain any explicitly documented agent contributions and do not imply independent student work when AI performed it]

## Actual agent-observed findings

### Issue: TypeScript migration left untyped functions and outdated test imports

- **What I saw:** [For you to complete.] Agent observation: strict type checking reported implicit parameter types, unsafe DOM access, and required storage arguments; tests could not find renamed JavaScript modules.
- **Type:** runtime
- **How I found it:** [For you to complete.] Agent evidence: ran npm run typecheck and the Node tests, then compared source extensions, parameter declarations, and test imports.
- **Cause:** Renaming files to .ts did not add function contracts or runtime DOM narrowing. Tests still expected source .js files, and npm test referenced Vitest even though it was not installed.
- **Fix:** Typed the source modules and state, validated unknown JSON, checked required HTML elements, and compiled TypeScript into an ignored test-output folder for the existing Node tests. Strict type checking, all 17 tests, ESLint for JavaScript tooling/tests, and the Vite build passed. Real browser checks remain unperformed.
- **Did I use AI? For what?:** [For you to complete.] Agent contribution: diagnosed the migration errors, implemented the type annotations and guards, updated the test scripts, and ran automated verification.

### Issue 1: PowerShell blocked the npm launcher

- **What I saw:** [For you to complete.] Agent observation: `npm --version` failed because PowerShell would not load npm.ps1 under the host's execution policy.
- **Type:** runtime
- **How I found it:** [For you to complete.] Agent evidence: running the initial Node/npm environment checks produced a SecurityError and UnauthorizedAccess message for npm.ps1.
- **Cause:** PowerShell selected the script launcher, which the current execution policy blocks.
- **Fix:** Used `npm.cmd` for subsequent commands without changing the system execution policy. npm commands then executed; dependency installation subsequently encountered the separate network restriction below.
- **Did I use AI? For what?:** [For you to complete.] Agent contribution: identified the launcher error and used the Windows command shim.

### Issue 2: Dependency installation was blocked

- **What I saw:** [For you to complete.] Agent observation: installation failed with EACCES while requesting the npm registry. The full test suite could not import jsdom; ESLint, Prettier, and Vite commands were unavailable.
- **Type:** runtime
- **How I found it:** [For you to complete.] Agent evidence: ran npm installation, retried using a workspace-local cache with no fetch retries, and attempted an offline installation. The offline attempt reported ENOTCACHED for @eslint/js.
- **Cause:** The implementation environment denies the required registry network access, and its cache lacks the project's dependencies. This is an environment blocker, not a demonstrated storefront logic bug.
- **Fix:** Unresolved in this environment. Install dependencies on a machine with registry access, then run the full test, lint, formatting, build, and startup checks. The dependency-free core suite passed; that does not verify the blocked checks.
- **Did I use AI? For what?:** [For you to complete.] Agent contribution: investigated the installation failure, checked the offline cache, and reported which verification remained blocked.

### Issue 3: DOM integration tests lacked ESLint browser globals

- **What I saw:** [For you to complete.] Agent review finding: ui.test.js uses document and localStorage, while the ESLint browser-global configuration originally matched src files only.
- **Type:** logic
- **How I found it:** [For you to complete.] Agent evidence: a separate code review compared the test's global identifiers with eslint.config.js. This was a source-review finding, not an executed ESLint failure.
- **Cause:** The ESLint file pattern omitted the DOM integration test.
- **Fix:** Included tests/ui.test.js in the browser-global configuration. Full ESLint verification remains blocked by dependency installation; no passing lint result is claimed.
- **Did I use AI? For what?:** [For you to complete.] Agent contribution: code review identified the configuration defect and the implementation agent updated the matching files.

### Issue 4: Cart announcements were outside the modal

- **What I saw:** [For you to complete.] Agent review finding: the cart action live region was outside the native dialog, where background content becomes inert while the modal is open. No screen-reader behavior was manually observed.
- **Type:** state
- **How I found it:** [For you to complete.] Agent evidence: source review traced announce() to an element outside #cart-dialog and identified the modal-state accessibility risk.
- **Cause:** Announcement rendering did not account for whether the dialog was open.
- **Fix:** Added a live region inside the cart dialog and routed announcements to the active region according to dialog.open. Added a simulated-DOM regression test. That test and actual screen-reader behavior remain unverified because jsdom installation and browser startup were blocked.
- **Did I use AI? For what?:** [For you to complete.] Agent contribution: reviewed the modal markup, implemented the announcement routing, and wrote the regression test.
