// Own all DOM access, accessible rendering, and one-time delegated event listeners.
import { CENTS_PER_DOLLAR, MAX_QUANTITY } from '../modules/cart/cart.js';
import type { Product } from '../modules/products/products.types.js';
import type {
  CartAction,
  CartItem,
  CartTotals,
} from '../modules/cart/cart.types.js';
import type { CatalogState, PriceSort } from '../modules/products/catalog.js';

interface UICallbacks {
  onCatalogChange: (changes: Partial<CatalogState>) => void;
  onCartAction: (action: CartAction, id?: string) => void;
}

// Find a required element of the expected HTML tag, or explain the missing markup.
export function getElement<Tag extends keyof HTMLElementTagNameMap>(
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
      <div class="product-image"><img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)} game cover" loading="lazy" width="600" height="900" /></div>
      <div class="product-details"><p class="product-category">${escapeHTML(product.category)}</p><div class="product-title-row"><h3>${escapeHTML(product.name)}</h3><span>${formatMoney(Math.round(product.price * CENTS_PER_DOLLAR))}</span></div><button class="add-button" type="button" data-action="add" data-id="${escapeHTML(product.id)}" aria-label="Add ${escapeHTML(product.name)} to cart"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg></button></div>
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

// Compose hero covers and a featured purchase from existing catalog data.
function renderHighlights(products: Product[]): void {
  const heroIds = [
    'god-of-war-2018',
    'cyberpunk-2077',
    'elden-ring',
    'hogwarts-legacy',
    'red-dead-redemption-2',
  ];
  getElement('div', '#hero-covers').innerHTML = heroIds
    .map((id) => {
      const game = products.find((product) => product.id === id);
      if (!game) return '';
      return `<a class="hero-card" href="#catalog" aria-label="Browse games including ${escapeHTML(game.name)}"><img src="${escapeHTML(game.image)}" alt="" width="600" height="900" fetchpriority="high" /><span>${escapeHTML(game.category)}</span><strong>${escapeHTML(game.name)}</strong></a>`;
    })
    .join('');
  const featured = products.find((product) => product.id === 'cyberpunk-2077');
  if (!featured) return;
  getElement('div', '#featured-game').innerHTML =
    `<img class="featured-image" src="${escapeHTML(featured.featuredImage ?? featured.image)}" alt="${escapeHTML(featured.name)} promotional artwork" width="1920" height="620" /><div class="featured-details"><div><p class="product-category">${escapeHTML(featured.category)}</p><h3>${escapeHTML(featured.name)}</h3></div><span class="featured-price">${formatMoney(Math.round(featured.price * CENTS_PER_DOLLAR))}<small>Demo USD</small></span><button class="button button-lime" type="button" data-action="add" data-id="${escapeHTML(featured.id)}" aria-label="Add ${escapeHTML(featured.name)} to cart">Add to cart <span aria-hidden="true">+</span></button></div>`;
}

// Populate categories and attach controls exactly once per page document.
export function initializeUI(
  products: Product[],
  { onCatalogChange, onCartAction }: UICallbacks,
): void {
  if (initializedDocuments.has(document)) return;
  initializedDocuments.add(document);
  renderHighlights(products);
  // Mark the current navigation destination for sighted and assistive-technology users.
  function updateNavigation(): void {
    const destination =
      document.defaultView?.location.hash === '#catalog' ? '#catalog' : '#home';
    for (const link of document.querySelectorAll<HTMLAnchorElement>(
      '.navigation a.nav-link',
    )) {
      if (link.getAttribute('href') === destination)
        link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  document.defaultView?.addEventListener('hashchange', updateNavigation);
  updateNavigation();
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
  const filterToggle = getElement('button', '#filter-toggle');
  const filterPanel = getElement('div', '#filter-panel');
  const controls = getElement('form', '#catalog-controls');
  // Keep filter visibility and the disclosure button's accessible state in sync.
  function setFiltersOpen(open: boolean, restoreFocus = false): void {
    filterPanel.hidden = !open;
    filterToggle.setAttribute('aria-expanded', String(open));
    if (restoreFocus) filterToggle.focus();
  }
  // Indicate a selected genre or price order even while its panel is closed.
  function updateFilterIndicator(): void {
    getElement('span', '#filter-indicator').hidden =
      category.value === 'all' && sort.value === 'default';
  }
  category.addEventListener('change', updateFilterIndicator);
  sort.addEventListener('change', updateFilterIndicator);
  filterToggle.addEventListener('click', () =>
    setFiltersOpen(filterPanel.hasAttribute('hidden')),
  );
  getElement('button', '#close-filters').addEventListener('click', () =>
    setFiltersOpen(false, true),
  );
  controls.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !filterPanel.hidden) {
      event.preventDefault();
      setFiltersOpen(false, true);
    }
  });
  document.addEventListener('click', (event) => {
    if (event.target instanceof Element && !controls.contains(event.target)) {
      const focusInside = filterPanel.contains(document.activeElement);
      setFiltersOpen(false, focusInside);
    }
  });
  document.addEventListener('focusin', (event) => {
    if (event.target instanceof Element && !controls.contains(event.target))
      setFiltersOpen(false);
  });
  // Reset all combined catalog controls using the existing coordinator callback.
  function resetFilters(): void {
    controls.reset();
    onCatalogChange({ search: '', category: 'all', sort: 'default' });
    updateFilterIndicator();
    setFiltersOpen(false);
    search.focus();
  }
  getElement('button', '#reset-filters').addEventListener(
    'click',
    resetFilters,
  );
  getElement('button', '#reset-panel-filters').addEventListener(
    'click',
    resetFilters,
  );

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
  getElement('div', '#featured-game').addEventListener('click', handleAction);
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
