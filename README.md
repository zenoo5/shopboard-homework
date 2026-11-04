# Respawn Shop

A digital PC game storefront built with Vite, vanilla TypeScript, HTML, and CSS.
Browse 12 real PC games with locally stored official cover artwork, combine name search and genre filters, sort by price,
and manage a cart saved in localStorage. Prices are in USD. Newsletter sign-up is
a local demo. The catalog has a read-only API; there is no payment processing, email delivery, or game downloads.

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

`index.html` supplies the page shell; `src/style.css` contains the styles.
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

## Products REST API

`GET /api/products` returns JSON with { items, total } and the existing twelve games.
Each item uses title, category_name, and price_cents, plus its ID, developer,
local image, description, and optional featured_image. Unsupported methods return
405 JSON with Allow: GET. The existing
`src/modules/products/products.ts` is the single source of game data and prices;
`api/products.ts` is a Vercel TypeScript Function using Web-standard Request/Response.

Run the frontend and API together (no Vercel account required for this workflow):

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173/ for the application and
http://127.0.0.1:5173/api/products for the JSON response. Keep the terminal open.
On PowerShell, use npm.cmd if npm.ps1 is blocked. Port 5173 must be free; Vite
fails clearly rather than silently selecting another port.

The Vite development adapter invokes the exact same handler used by Vercel. It
serves real HTTP requests, not mock JSON or a browser fallback. The frontend calls
getProducts(), which uses the reusable fetchJson<T>() client with a runtime decoder.
It validates the payload, rejects invalid or duplicate IDs and unsupported genres,
and maps title to name, category_name to category, and cents to dollar prices.
Loading and retry states are shown in the Library. Saved carts are loaded only
after a successful request, so an API failure cannot erase stored game IDs.
The Hero and Featured Game are rendered from the successful response too.

BASE_URL defaults to the same origin in development and production. For a
separately hosted API, set VITE_API_BASE_URL in .env.local (and in the Vercel
project's environment settings), then restart Vite. Use an origin without the
/api/products suffix; that API must allow the frontend origin via CORS. No
variable is needed for the normal same-project setup. Never put secrets in VITE_
variables because they are exposed to browsers.

Run the development checks without generating dist:

```sh
npm run check:dev
```

Tests compile both src and api into ignored .test-build/ output, then cover the
HTTP contract, mapping and validation, network/HTTP/JSON errors, loading, retry,
and existing catalog/cart behavior.

To deploy when ready, import this repository into a Vercel project with its root
at this directory, select the Vite preset, and use Node.js 22.12 or later. The
included vercel.json configures npm run build and dist as Vercel's build output;
Vercel discovers api/products.ts automatically. No database, API key, or separate
backend deployment is required. After deployment, verify
https://YOUR-PROJECT.vercel.app/api/products and open the site's root. Local
verification does not deploy the site. If you prefer Vercel's local platform
emulation, run npx vercel dev --listen 3000 after logging in/linking your project,
then open http://localhost:3000/api/products.

The handler follows [Vercel's Node.js Function documentation](https://vercel.com/docs/functions/runtimes/node-js).

## Course checkpoint: all four states

Product requests use the existing LoadState<Product[]> union. The dedicated
src/modules/products/products.ui.ts render(state) function owns loading, success,
error, and API-empty presentation, reusing the existing card renderer and styling.
The error state's **Try again** button issues a new getProducts() request. An
empty API catalog shows **No games available** and **Check again**, disables the
search/cart controls, and leaves saved carts untouched until real products load.
An empty search/filter result instead shows **No games found** with **Reset filters**;
the API load remains successful and browsing/cart controls remain usable.

For deliberate demonstrations, stop the current server with Ctrl+C and start
one of these commands, then open http://127.0.0.1:5173/:

| State             | Development command                      | Expected behavior                                                                                                                            |
| ----------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Success           | npm run dev                              | The normal API returns the existing twelve games.                                                                                            |
| Loading           | npm run dev -- --mode checkpoint-loading | Each GET waits eight seconds before returning the normal catalog.                                                                            |
| Error and retry   | npm run dev -- --mode checkpoint-error   | The first GET returns HTTP 503; Try again makes another HTTP request and loads the catalog. Restart this mode to repeat the initial failure. |
| Empty API         | npm run dev -- --mode checkpoint-empty   | GET returns HTTP 200 with { items: [], total: 0 }. Check again requests the API again and remains empty in this mode.                        |
| No search matches | npm run dev                              | Search for nothing-matches, then use Reset filters to recover.                                                                               |

These scenarios run only inside Vite's serve-only development adapter. They do
not add browser debug controls, change api/products.ts, or affect the deployed
Vercel endpoint. Production always uses the normal catalog. Stop and restart
with npm run dev to leave a checkpoint mode. All scenarios still exercise the
real HTTP client, response validation, and mapping; no frontend fallback is used.
