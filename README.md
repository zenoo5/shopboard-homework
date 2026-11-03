# Respawn Shop

A digital PC game storefront built with Vite, vanilla TypeScript, HTML, and CSS.
Browse 12 fictional games with original local cover artwork, combine name search and genre filters, sort by price,
and manage a cart saved in localStorage. Prices are in USD. Newsletter sign-up is
a local demo; there is no backend, payment processing, email delivery, or game downloads.

## Setup

Use Node.js 22.12 or later and npm:

```sh
npm ci
npm run dev
```

Open Vite's printed local URL. In PowerShell, use `npm.cmd` if execution policy
blocks `npm.ps1`.

```sh
npm run check         # Types, tests, lint, formatting check, production build
npm run test:core     # Catalog, cart, and storage tests
npm run test:ui       # jsdom integration tests
npm run format       # Apply Prettier formatting
npm run build        # Generate dist/
npm run preview      # Serve the production build
```

## Architecture

`index.html` supplies the page shell; `src/modules/style.css` contains the styles.
`src/main.ts` owns catalog and cart state, coordinating pure operations in
`catalog.ts` and `cart.ts`, persistence in `storage.ts`, and DOM rendering/events
in `ui.ts`. `products.ts` supplies product data; `products.types.ts` and
`cart.types.ts` define shared types. Game covers live in `public/images/games/`; no external artwork service is needed.

Cart storage contains only product IDs and quantities. Loading validates saved
data; totals use integer cents. There are no runtime library dependencies.
Tests use Node's test runner and jsdom against TypeScript compiled into ignored
`.test-build/`. Source imports use `.js` specifiers for NodeNext compatibility.
`test:watch` watches tests and compiled JavaScript; rerun `test:compile` after
editing TypeScript.

## Verification

See `debugging-log.md` for current cleanup checks and attributed historical
findings. ESLint covers JavaScript tests and tooling; strict TypeScript checking
covers the application. Husky runs typecheck and lint-staged before commits.

Tests cover catalog filtering/sorting, cart operations and totals, storage
validation/failures, simulated restart persistence, delegated events, empty-state
reset, and modal announcement routing. Browser appearance, native dialog keyboard
behavior, screen-reader output, and actual browser-refresh persistence remain
unverified by manual browser testing.

Generated builds and local caches are ignored; the dependency lockfile is tracked.

Verified during cleanup on 2026-11-03: `npm run check` passed strict type checking,
all 17 tests (11 core and 6 jsdom), ESLint, Prettier, and the Vite production build.
