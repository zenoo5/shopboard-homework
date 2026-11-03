# Respawn Shop

A gaming accessories storefront built with semantic HTML, mobile-first CSS, and vanilla TypeScript ES modules compiled to JavaScript. This file explains setup, architecture, tests, and actual verification results.

The store contains 12 original demo products across five categories. Local SVG illustrations and the logo are original assets; variants share family illustrations. All prices are USD. This browser-local homework demo does not process payments, create orders, or send newsletter subscriptions.

## Start locally

Use Node.js 22.12 or later and npm. From the project directory:

```sh
npm install
npm run dev
```

Open Vite's printed Local URL, normally `http://127.0.0.1:5173`. Serve the application over HTTP; do not open index.html directly. If PowerShell blocks npm.ps1, use `npm.cmd` instead of `npm`, or use Command Prompt. Changing the system execution policy is unnecessary.

```sh
npm test               # All core and simulated-DOM tests
npm run test:core      # Compile and run catalog/cart/storage tests
npm run test:ui        # jsdom integration tests
npm run lint          # ESLint
npm run format        # Prettier: update formatting
npm run format:check  # Prettier: check formatting
npm run build         # Vite production output in dist/
npm run preview       # Serve the production build
npm run typecheck     # Strict TypeScript checks without emitting files
npm run check         # Types, tests, lint, formatting check, and build
```

Run `npm run format` and then `npm run check` after installing dependencies. Installation generates package-lock.json and node_modules; the build generates dist.

## Complete source structure

```text
respawn-shop/
├── index.html                 Semantic page, controls, and native cart dialog
├── package.json               Scripts and development dependencies
├── eslint.config.js           Recommended checks and project lint rules
├── .prettierrc.json            Formatting preferences
├── .prettierignore             Generated files excluded from formatting
├── .gitignore                 Generated files excluded from version control
├── .husky/pre-commit           Run lint-staged before a future commit
├── scripts/prepare.mjs         Activate hooks only inside a Git checkout
├── src/
│   ├── main.ts                 State and module coordination
│   ├── products.ts             Twelve products in original display order
│   ├── catalog.ts              Pure search, category filtering, and sorting
│   ├── cart.ts                 Immutable operations and derived totals
│   ├── storage.ts              Validate and persist IDs and quantities
│   ├── ui.ts                   All application DOM access and event handling
│   └── style.css               Mobile-first styles and keyboard focus states
├── public/images/
│   ├── respawn.svg             Original logo
│   ├── keyboard.svg            Phantom family illustration
│   ├── mouse.svg               Pulse family illustration
│   ├── headset.svg             Nova family illustration
│   ├── controller.svg          Nexus family illustration
│   ├── deskmat.svg             Orbit family illustration
│   └── microphone.svg          Beacon family illustration
├── tests/
│   ├── core.test.js            Catalog, cart, and storage unit tests
│   └── ui.test.js              Real HTML and application wiring in jsdom
├── docs/superpowers/
│   ├── specs/2026-11-02-respawn-shop-design.md
│   └── plans/2026-11-02-respawn-shop.md
├── AGENTS.md                   Conventions and optional rules to personalize
├── debugging-log.md            Actual findings in the homework format
└── README.md                   Setup, explanation, and verification report
```

## Imports, exports, and state flow

| Module      | Exports                                                                                            | Consumers                                                        |
| ----------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| products.ts | `products`                                                                                         | main.ts supplies data to logic and UI                            |
| catalog.ts  | `selectProducts`                                                                                   | main.ts supplies original products and catalog state             |
| cart.ts     | `addItem`, `decreaseItem`, `removeItem`, `clearCart`, `getCartTotals`, quantity/currency constants | main.ts applies operations; storage.ts and ui.ts reuse constants |
| storage.ts  | `loadCart`, `saveCart`, `CART_STORAGE_KEY`                                                         | main.ts restores startup data and saves after actions            |
| ui.ts       | `initializeUI`, `renderCatalog`, `renderCart`, `announce`, `showStorageWarning`                    | main.ts supplies data and action callbacks                       |
| main.ts     | No exports; application entry point                                                                | index.html loads it as a module                                  |

main.ts owns `{ search, category, sort }` and the cart array. ui.ts calls a callback with just the changed control. main.ts merges it into current catalog state, calls selectProducts, and sends matching products back to ui.ts. Filtering creates a new array before sorting, so Default always restores original product order.

For a cart click, ui.ts reports an action and ID. main.ts calls the appropriate cart function, persists the resulting state, derives totals, and asks ui.ts to render. One delegated listener on the product grid and one on cart entries handle dynamic buttons. Rendering never attaches listeners. initializeUI also prevents duplicate initialization on the same document.

Only ui.ts accesses the application DOM. Tests access their simulated document to check the interface, but are not loaded into the storefront. There are no runtime library dependencies.

## Cart and persistence

Cart entries contain only `{ id, quantity }`, for example `{ id: 'phantom-k75', quantity: 2 }`. Names, images, and prices come from products.ts. Cart operations return new arrays. Repeated adds update one entry; decreasing quantity 1 removes it. Count is the sum of quantities. Prices are converted to integer cents before multiplication and addition, then formatted in ui.ts.

The named per-product quantity limit is 999. Storage ignores missing IDs and invalid quantities, merges duplicate IDs within that limit, and catches malformed JSON and unavailable storage. Data uses the versioned localStorage key `respawn-shop-cart-v1`. Every operation saves IDs and quantities only. Failed writes leave the session usable and show a persistence warning. Another tab's changes are restored on refresh; live cross-tab synchronization is outside this project's scope.

## Actual verification results

Current migration verification on 2026-11-02:

- Strict TypeScript checking passed without explicit any types, type assertions, or non-null assertions.
- All 17 tests passed: 11 core tests and 6 simulated-DOM integration tests.
- ESLint passed for the JavaScript tests and tooling. TypeScript source is checked by tsc; installing a TypeScript ESLint parser was attempted but blocked by registry network EACCES. TypeScript-specific ESLint checks remain unavailable. The pre-commit hook runs typecheck, and lint-staged includes TypeScript formatting.
- Vite production build passed. A successful build does not replace strict type checking.
- Prettier formatting verification passed for every matched file.
- Vite started successfully and returned HTTP 200 for the page, main.ts, and the migrated module imports. The test server was stopped after verification.
- Manual browser Console, native dialog keyboard behavior, screen-reader announcements, responsive appearance, and actual browser-refresh persistence remain unverified. jsdom tests do not establish those results.
- No commits or pushes were made.

## TypeScript migration decisions

- Product and cart interfaces describe the existing data. Cart entries remain IDs plus quantities; totals are derived separately.
- CatalogState names search/category/sort fields, PriceSort restricts sorting to three choices, and Partial<CatalogState> allows changing just one control.
- Function parameter and return types let TypeScript infer callback values. No any, as casts, or non-null assertions are needed.
- Storage parameters are optional. Parsed JSON is unknown until object fields and quantities pass runtime checks.
- UI callbacks are typed. A shared getElement helper combines an actual HTML tag and selector, checks for a missing element, and returns the corresponding DOM type. Event targets are narrowed with instanceof before using element-specific properties.
- npm test compiles sources into ignored .test-build/ and runs the existing Node tests against emitted JavaScript. No extra test framework is required. Source imports retain .js specifiers for NodeNext output; index.html points to main.ts for Vite.
- test:watch observes tests and generated JavaScript. After changing TypeScript, rerun test:compile in another terminal, or simply run npm test again.
- The old verify.cjs targets a different application's dist/app.js and is not part of these tests. It has not been rewritten as part of this migration.

## Acceptance criteria coverage

| #   | Criterion                                          | Automated evidence                                              | Remaining verification            |
| --- | -------------------------------------------------- | --------------------------------------------------------------- | --------------------------------- |
| 1   | Case-insensitive name search                       | Core test passed for upper/lowercase and whitespace             | Browser typing                    |
| 2   | Category filtering                                 | Core test passed for a category and All                         | Browser select                    |
| 3   | Ascending, descending, Default; no source mutation | Core test passed for both orders and original-order restoration | Browser controls                  |
| 4   | Combined search, category, sort                    | Core and UI tests passed                                        | Browser flow                      |
| 5   | Repeated add gives one entry, quantity 2           | Core and UI tests passed                                        | Browser check                     |
| 6   | Decreasing 1 removes entry                         | Core test passed, including repeated decreases                  | Browser check                     |
| 7   | Remove preserves other entries                     | Core test passed                                                | Browser check                     |
| 8   | Clear resets cart, count, and total                | Core test passed                                                | Browser check                     |
| 9   | Count and totals after operations                  | Core assertions passed across operations                        | Browser check                     |
| 10  | Persistence after refresh                          | Storage round-trip and simulated restart passed                 | Actual browser reload             |
| 11  | Single add after repeated filtering                | Integration regression test passed                              | Browser click                     |
| 12  | No Console JavaScript errors                       | Syntax checks passed; these do not prove a clean Console        | Browser Console through all flows |

## Manual browser checklist

1. Start Vite and open its Local URL with the Console visible. Confirm 12 products and their images load.
2. Search `PHANTOM`, then `phantom`; both show the same two keyboards. Choose Keyboards, both price sorts, then Default. Default should show K75 before Mini. Changing one control preserves the others.
3. Search for an unmatched phrase. Confirm the empty state and Reset filters restores all 12 products and default controls.
4. Repeatedly change controls, then click Add once. Count increases by exactly one. Add the same product again; its single cart entry has quantity 2.
5. Add another product. Increase/decrease, remove one, and confirm the other remains. Decrease quantity 1 and confirm removal. Clear and confirm count and subtotal are zero.
6. Add two Phantom K75 keyboards and one Pulse Wireless mouse. Count is 3 and subtotal $329.97. Reload and confirm those entries and totals remain.
7. Replace `respawn-shop-cart-v1` with malformed JSON in browser storage tools, then reload; the application still works with an empty cart. If supported, block storage and confirm cart actions still work with a persistence warning.
8. Use the keyboard: follow the skip link, adjust controls, add products, open the cart, tab through its controls, close with Escape, and confirm focus returns to Cart. Remove a focused entry and confirm focus remains useful in the dialog. Inspect labels, image alt text, and live-region announcements with accessibility tools.
9. Test at 320px, 390px, 768px, and 1440px widths and 200% zoom. Confirm readable content, no horizontal overflow, visible focus, and reachable cart controls.
10. Check native email validation and the local-only sign-up message. Confirm there are no uncaught JavaScript Console errors throughout the flow.

Record only real findings in debugging-log.md. Personal debugging experiences remain yours to complete.
