// Own all DOM access, accessible rendering, and one-time delegated event listeners.
import { CENTS_PER_DOLLAR, MAX_QUANTITY } from './cart/cart.js';
import type { Product } from './products/products.types.js';
import type { CartAction, CartItem, CartTotals } from './cart/cart.types.js';
import type { CatalogState, PriceSort } from './products/catalog.js';

interface UICallbacks {
  onCatalogChange: (changes: Partial<CatalogState>) => void;
  onCartAction: (action: CartAction, id?: string) => void;
}

// Find a required element of the expected HTML tag, or explain the missing markup.
function getElement<Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  selector: string,
): HTMLElementTagNameMap[Tag] {
  const element = document.querySelector<HTMLElementTagNameMap[Tag]>(
    tag + selector,
  );
  if (element === null)
    throw new Error('Missing required element: ' + tag + selector);
  return element;
}

// Validate action strings from HTML data attributes before passing them to state logic.
function isCartAction(value: string | undefined): value is CartAction {
  return (
    value === 'add' ||
    value === 'increase' ||
    value === 'decrease' ||
    value === 'remove' ||
    value === 'clear'
  );
}

// Accept only the three sorting options supported by the catalog.
function isPriceSort(value: string): value is PriceSort {
  return value === 'default' || value === 'price-asc' || value === 'price-desc';
}

const initializedDocuments = new WeakSet<Document>();
const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// Escape text before placing product data into an HTML template.
function escapeHTML(value: string | undefined): string {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        character
      ] ?? character,
  );
}

// Format an integer number of cents consistently everywhere in the interface.
function formatMoney(cents: number): string {
  return currency.format(cents / CENTS_PER_DOLLAR);
}

// Show matching product cards and an accessible empty state when none match.
export function renderCatalog(
  products: Product[],
  totalProducts: number,
): void {
  getElement('div', '#product-grid').innerHTML = products
    .map(
      (product) => `
    <article class="product-card" data-product-id="${escapeHTML(product.id)}">
      <div class="product-image ${escapeHTML(product.color)}">${product.badge ? `<span class="product-badge">${escapeHTML(product.badge)}</span>` : ''}<img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)} — ${escapeHTML(product.category.toLowerCase())} game cover" loading="lazy" width="400" height="280" /></div>
      <div class="product-details"><p class="product-category">${escapeHTML(product.category)} &middot; PC &middot; Digital edition</p><div class="product-title-row"><h3>${escapeHTML(product.name)}</h3><span>${formatMoney(Math.round(product.price * CENTS_PER_DOLLAR))}</span></div><p class="product-description">${escapeHTML(product.description)}</p><button class="add-button" type="button" data-action="add" data-id="${escapeHTML(product.id)}" aria-label="Add ${escapeHTML(product.name)} to cart"><span>Add to cart</span><span aria-hidden="true">+</span></button></div>
    </article>`,
    )
    .join('');
  getElement('p', '#results-count').textContent =
    `Showing ${products.length} of ${totalProducts} games`;
  getElement('div', '#catalog-empty').hidden = products.length !== 0;
}

// Render cart entries and totals while keeping keyboard focus on a useful control.
export function renderCart(
  cart: CartItem[],
  products: Product[],
  totals: CartTotals,
): void {
  const container = getElement('div', '#cart-items');
  const active = document.activeElement;
  const restoreFocus = container.contains(active);
  const activeId =
    active instanceof HTMLElement ? active.dataset.id : undefined;
  const activeAction =
    active instanceof HTMLElement ? active.dataset.action : undefined;
  container.innerHTML =
    cart.length === 0
      ? '<div class="empty-state cart-empty"><span class="empty-symbol" aria-hidden="true">＋</span><h3>Your next adventure awaits.</h3><p>Your cart is empty. Find a game you’ll love.</p></div>'
      : cart
          .map((item) => {
            const product = products.find((entry) => entry.id === item.id);
            if (!product) return '';
            const name = escapeHTML(product.name);
            const id = escapeHTML(item.id);
            return `<article class="cart-item"><div class="cart-image ${escapeHTML(product.color)}"><img src="${escapeHTML(product.image)}" alt="${name} game cover" width="100" height="85" /></div><div class="cart-item-info"><h3>${name}</h3><p>${formatMoney(Math.round(product.price * CENTS_PER_DOLLAR))} each</p><div class="quantity-control"><button type="button" data-action="decrease" data-id="${id}" aria-label="Decrease ${name} quantity">−</button><span aria-label="Quantity ${item.quantity}">${item.quantity}</span><button type="button" data-action="increase" data-id="${id}" aria-label="Increase ${name} quantity" ${item.quantity >= MAX_QUANTITY ? 'disabled' : ''}>+</button></div></div><div class="cart-item-end"><strong>${formatMoney(Math.round(product.price * CENTS_PER_DOLLAR) * item.quantity)}</strong><button class="text-button" type="button" data-action="remove" data-id="${id}" aria-label="Remove ${name} from cart">Remove</button></div></article>`;
          })
          .join('');
  getElement('span', '#cart-count').textContent = String(totals.count);
  getElement('button', '#open-cart').setAttribute(
    'aria-label',
    `Open cart, ${totals.count} ${totals.count === 1 ? 'item' : 'items'}`,
  );
  getElement('p', '#cart-summary').textContent =
    `${totals.count} ${totals.count === 1 ? 'item' : 'items'} in your cart`;
  getElement('strong', '#cart-total').textContent = formatMoney(
    totals.totalCents,
  );
  getElement('button', '#clear-cart').disabled = cart.length === 0;
  if (restoreFocus) {
    const replacement = [...container.querySelectorAll('button')].find(
      (button) =>
        button.dataset.id === activeId &&
        button.dataset.action === activeAction &&
        !button.disabled,
    );
    (
      replacement ??
      container.querySelector('button') ??
      getElement('button', '#continue-shopping')
    ).focus();
  }
}

// Announce each cart action without moving focus away from the current control.
export function announce(message: string): void {
  const modalOpen = getElement('dialog', '#cart-dialog').open;
  getElement('p', '#action-status').textContent = modalOpen ? '' : message;
  getElement('p', '#cart-action-status').textContent = modalOpen ? message : '';
}

// Explain when the current cart cannot persist across refreshes.
export function showStorageWarning(blocked: boolean): void {
  getElement('p', '#storage-status').textContent = blocked
    ? 'Browser storage is unavailable. Your cart works for this session but may not survive a refresh.'
    : '';
}

// Populate categories and attach controls exactly once per page document.
export function initializeUI(
  products: Product[],
  { onCatalogChange, onCartAction }: UICallbacks,
): void {
  if (initializedDocuments.has(document)) return;
  initializedDocuments.add(document);
  const category = getElement('select', '#category');
  for (const name of new Set(products.map((product) => product.category))) {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    category.append(option);
  }
  getElement('form', '#catalog-controls').addEventListener('submit', (event) =>
    event.preventDefault(),
  );
  const search = getElement('input', '#search');
  search.addEventListener('input', () =>
    onCatalogChange({ search: search.value }),
  );
  category.addEventListener('change', () => {
    const selectedCategory = products.find(
      (product) => product.category === category.value,
    )?.category;
    onCatalogChange({ category: selectedCategory ?? 'all' });
  });
  const sort = getElement('select', '#sort');
  sort.addEventListener('change', () => {
    if (isPriceSort(sort.value)) onCatalogChange({ sort: sort.value });
  });
  getElement('button', '#reset-filters').addEventListener('click', () => {
    getElement('form', '#catalog-controls').reset();
    onCatalogChange({ search: '', category: 'all', sort: 'default' });
    getElement('input', '#search').focus();
  });

  // Route a single delegated product or cart button click to the coordinator.
  function handleAction(event: Event): void {
    if (
      !(event.target instanceof Element) ||
      !(event.currentTarget instanceof HTMLElement)
    )
      return;
    const button = event.target.closest('button[data-action]');
    if (
      button instanceof HTMLButtonElement &&
      event.currentTarget.contains(button) &&
      isCartAction(button.dataset.action)
    ) {
      onCartAction(button.dataset.action, button.dataset.id);
    }
  }
  getElement('div', '#product-grid').addEventListener('click', handleAction);
  getElement('div', '#cart-items').addEventListener('click', handleAction);
  getElement('button', '#clear-cart').addEventListener('click', () =>
    onCartAction('clear'),
  );

  const dialog = getElement('dialog', '#cart-dialog');
  let opener: HTMLElement | null = null;
  getElement('button', '#open-cart').addEventListener('click', () => {
    opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    dialog.showModal();
    getElement('button', '#close-cart').focus();
  });
  // Close the native modal; its close event handles returning keyboard focus.
  function closeCart(): void {
    dialog.close();
  }
  getElement('button', '#close-cart').addEventListener('click', closeCart);
  getElement('button', '#continue-shopping').addEventListener(
    'click',
    closeCart,
  );
  dialog.addEventListener('close', () =>
    (opener ?? getElement('button', '#open-cart')).focus(),
  );
  const newsletterForm = getElement('form', '#newsletter-form');
  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    getElement('p', '#newsletter-status').textContent =
      'You’re on the demo list! No email was sent or saved.';
    newsletterForm.reset();
  });
}
