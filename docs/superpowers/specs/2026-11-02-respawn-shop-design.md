# Respawn Shop design proposal

This file describes the storefront, module boundaries, and accessibility requirements before implementation.

## Purpose and scope

Build a complete gaming equipment storefront for a Fullstack course using Vite, semantic HTML, CSS, and vanilla JavaScript ES modules. Prioritize understandable state management, DOM updates, persistence, and module responsibilities. This is a browser-local shopping demo; payment processing, accounts, and a backend are outside the requested scope.

## Proposed visual direction

Use dark graphite surfaces, electric lime accents, generous spacing, clear typography, and product photography. Include a branded header, hero, catalog controls, responsive product grid, cart dialog, newsletter sign-up demo, and footer. Base styles target phones and use only min-width breakpoints. Avoid animations that conflict with reduced-motion preferences.

## Approaches

- Recommended: a product grid and slide-out native dialog cart, keeping products visible while the customer manages an order. This gives the store a distinct identity and requires careful focus handling.
- Alternative: a light storefront with an inline cart section. This simplifies cart layout but takes more catalog space.

The visual direction is a proposal awaiting the user's approval; neither approach has been selected by the user.

## Module responsibilities

- `index.html`: semantic page structure with one h1 and labeled controls; no hardcoded product cards.
- `src/style.css`: mobile-first presentation, focus states, responsive grid, and reduced-motion handling.
- `src/products.js`: at least 12 products with unique IDs, names, categories, prices, descriptions, and images.
- `src/catalog.js`: pure name searching, category filtering, and sorting on copied arrays.
- `src/cart.js`: cart operations and derived totals; quantities are positive integers and duplicate products share an entry.
- `src/storage.js`: safely load, validate, and save only product IDs and quantities, including unavailable storage and malformed data handling.
- `src/ui.js`: all DOM queries, rendering, and event handling; register delegated catalog and cart handlers once.
- `src/main.js`: coordinate modules and application state without accessing the DOM directly.
- `tests/`: meaningful catalog, cart, persistence, and interaction regression checks.
- `debugging-log.md`: record only actual observed failures, their causes, fixes, and verification.
- `README.md`: explain setup, each file, state flow, and demo limitations for a beginner.
- Tooling configuration: Vite, ESLint, Prettier, husky, and lint-staged scripts.

Preserve existing development rules in `AGENTS.md`. Give each new function a one-line explanation.

## State and behavior

Catalog state contains the search query, category, and sort choice. Updating one preserves the others. Default sorting restores original product order. Cart state contains `{ id, quantity }` entries. Each successful cart action immediately persists and renders the item count, line subtotals, and total. Count means the sum of quantities. Decrementing one removes its entry; removing one entry preserves all others. Clearing resets both totals to zero.

Validate loaded entries against known product IDs and positive safe integer quantities. Discard invalid entries and combine valid duplicate IDs safely. Failed storage access must leave the in-memory store usable. Compute currency totals in cents to avoid floating point artifacts.

## Accessibility

Use header, nav, main, section, article, and footer landmarks, logical headings, a skip link, and appropriate anchor destinations. Buttons perform actions; links navigate. Search, selects, and newsletter fields have explicit labels. Use native email validation for the sign-up demo and explain that it does not send subscriptions to a server.

Every interactive control has a visible focus indicator and keyboard support. Product images have descriptive alt text; decorative imagery has empty alt text. Icon buttons have accessible names that include the relevant product where needed. Product cards must not become nested clickable controls.

Use a native modal dialog for the cart, label it with its heading, provide a close button, support Escape, and return focus to the opener on close. Preserve focus across cart updates, including when an item is removed. Announce cart changes and result counts using restrained live regions. Show useful empty states for both the catalog and cart. Maintain sufficient text contrast and avoid communicating state through color alone.

## Verification

Test combined catalog controls, original-order restoration, repeated adds, decrement-to-removal, independent item removal, clearing, totals, malformed storage, unknown IDs, and failed storage access. Check that repeated filtering never duplicates add listeners. Verify keyboard navigation, dialog focus behavior, labels, empty states, and mobile layout where browser tooling is available. Run the complete test suite, ESLint, formatting checks, and the production build, reporting any unavailable checks accurately.
