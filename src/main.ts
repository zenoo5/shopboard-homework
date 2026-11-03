// Coordinate catalog state, cart transformations, persistence, and the UI module.
import { products } from './modules/products/products.js';
import type { CatalogState } from './modules/products/catalog.js';
import type { CartAction, CartItem } from './modules/cart/cart.types.js';
import { selectProducts } from './modules/products/catalog.js';
import {
  addItem,
  decreaseItem,
  removeItem,
  clearCart,
  getCartTotals,
  MAX_QUANTITY,
} from './modules/cart/cart.js';
import { loadCart, saveCart } from './modules/storage.js';
import {
  initializeUI,
  renderCatalog,
  renderCart,
  announce,
  showStorageWarning,
} from './modules/ui.js';

let catalogState: CatalogState = {
  search: '',
  category: 'all',
  sort: 'default',
};
let cart: CartItem[] = loadCart(products);

// Render the current cart together with its derived count and subtotal.
function refreshCart(): void {
  renderCart(cart, products, getCartTotals(cart, products));
}

// Merge only the changed catalog controls before rendering matching products.
function handleCatalogChange(changes: Partial<CatalogState>): void {
  catalogState = { ...catalogState, ...changes };
  renderCatalog(selectProducts(products, catalogState), products.length);
}

// Apply one cart action, persist its result, then update all displayed totals.
function handleCartAction(action: CartAction, id = ''): void {
  const product = products.find((entry) => entry.id === id);
  const previousQuantity = cart.find((entry) => entry.id === id)?.quantity ?? 0;
  if (action === 'add' || action === 'increase') {
    cart = addItem(cart, id, products);
  } else if (action === 'decrease') {
    cart = decreaseItem(cart, id);
  } else if (action === 'remove') {
    cart = removeItem(cart, id);
  } else if (action === 'clear') {
    cart = clearCart();
  } else {
    return;
  }

  const persisted = saveCart(cart);
  refreshCart();
  showStorageWarning(!persisted);
  if (action === 'clear') {
    announce('Cart cleared.');
  } else if (
    (action === 'add' || action === 'increase') &&
    previousQuantity === MAX_QUANTITY
  ) {
    announce(`Maximum ${MAX_QUANTITY} of each product per cart.`);
  } else if (product) {
    const quantity = cart.find((entry) => entry.id === id)?.quantity ?? 0;
    announce(
      `${product.name}: ${quantity === 0 ? 'removed from cart' : `${quantity} in cart`}.${persisted ? '' : ' Cart cannot be saved in this browser.'}`,
    );
  }
}

initializeUI(products, {
  onCatalogChange: handleCatalogChange,
  onCartAction: handleCartAction,
});
handleCatalogChange({});
refreshCart();
