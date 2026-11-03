# Respawn Shop contributor instructions

Respawn Shop is a browser-local gaming accessories storefront built with Vite,
vanilla TypeScript ES modules, semantic HTML, and mobile-first CSS. It has catalog
search, category filtering, price sorting, a persistent cart, and a demo newsletter
form. There are no runtime library dependencies or backend services.

## Commands

- `npm ci`: install locked dependencies with Node.js 22.12 or later.
- `npm run dev`: start Vite locally.
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

- `index.html`: semantic page shell and native cart dialog.
- `src/style.css`: all application styles.
- `src/main.ts`: catalog/cart state and module coordination.
- `src/products.ts` / `src/products.types.ts`: product data and product types.
- `src/catalog.ts`: pure search, filter, sort logic, and catalog types.
- `src/cart.ts` / `src/cart.types.ts`: immutable cart operations, totals, and types.
- `src/storage.ts`: validated localStorage loading and saving.
- `src/ui.ts`: application DOM access, rendering, and event handling.
- `public/images/`: illustrations and logo used by the website.
- `tests/core.test.js` / `tests/ui.test.js`: logic and simulated DOM tests.
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
