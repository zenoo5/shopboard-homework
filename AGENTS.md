# Respawn Shop contributor instructions

Respawn Shop is a digital PC game storefront built with Vite,
vanilla TypeScript ES modules, semantic HTML, and mobile-first CSS. It has catalog
search, category filtering, price sorting, a persistent cart, and a demo newsletter
form. The catalog is served by a read-only TypeScript Vercel Function at GET /api/products.
There are no runtime library dependencies, databases, or external API services.

## Commands

- `npm ci`: install locked dependencies with Node.js 22.12 or later.
- `npm run dev`: start Vite and the same products API handler together at 127.0.0.1:5173.
- `npm run check:dev`: run typecheck, tests, lint, and formatting without a production build.
- `npm run typecheck`: check strict TypeScript without emitting files.
- `npm test`: compile to ignored `.test-build/` and run Node tests with jsdom.
- `npm run test:core` / `npm run test:ui`: run either test group.
- `npm run lint`: check JavaScript tests and tooling with ESLint.
- `npm run format:check` / `npm run format`: check or apply Prettier formatting.
- `npm run build` / `npm run preview`: build to `dist/` or preview the build.
- `npm run check`: run typecheck, tests, lint, formatting checks, and build.

ESLint does not check TypeScript; strict tsc checks it. The Husky pre-commit hook
runs typecheck then lint-staged. Staged JavaScript gets ESLint fixes and formatting;
TypeScript, HTML, CSS, JSON, Markdown, and SVG files get formatting.

## Structure

- `api/products.ts`: Vercel products endpoint, also served by the local Vite adapter.
- `vite.config.ts`: local HTTP adapter for the same function, without a second server.
- `src/shared/api/client.ts`: validated JSON transport and ApiError handling.
- `src/modules/products/products.api.ts`: API validation and Product mapping.
- `tsconfig.test.json`: compile source and API for the Node test suite.
- `index.html`: semantic page shell and native cart dialog.
- `src/style.css`: all application styles.
- `src/main.ts`: catalog/cart state and module coordination.
- `src/modules/products/products.ts` / `src/modules/products/products.types.ts`: product data and product types.
- `src/modules/products/catalog.ts`: pure search, filter, sort logic, and catalog types.
- `src/modules/cart/cart.ts` / `src/modules/cart/cart.types.ts`: immutable cart operations, totals, and types.
- `src/modules/cart/storage.ts`: validated localStorage loading and saving.
- `src/shared/ui.ts`: application DOM access, rendering, and event handling.
- `public/images/`: illustrations and logo used by the website.
- `tests/core.test.js` / `tests/ui.test.js` / `tests/api.test.js`: logic, DOM, and API tests.
- `scripts/prepare.mjs`: initialize Husky when a Git checkout exists.
- `debugging-log.md`: attributed debugging findings.

## Rules

1. Use semantic HTML and one h1 per page.
2. Use buttons for actions and links with href for navigation.
3. Label every input and use native validation before JavaScript.
4. Write mobile-first CSS with min-width queries only; never use !important.
5. Use === and const by default, let only for reassignment, and never var.
6. Name meaningful numeric constants instead of using magic numbers.
7. Reuse functions and keep application DOM access in ui.ts.
8. Explain every new file and function in one line.
9. Keep strict types and narrow unknown data at runtime. Source imports use .js
   specifiers for NodeNext test output; Vite loads main.ts from index.html.
10. Change only the requested scope. Never invent student debugging experiences.
    Do not track generated output or local caches.
