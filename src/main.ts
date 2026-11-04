// Coordinate catalog state, cart transformations, persistence, and the UI module.
import { getProducts } from './modules/products/products.api.js';
import type { LoadState, Product } from './modules/products/products.types.js';
import {
  initialize as initializeProductsUI,
  render,
} from './modules/products/products.ui.js';
import { ApiError } from './shared/api/client.js';
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
import { loadCart, saveCart } from './modules/cart/storage.js';
import {
  initializeUI,
  renderCatalog,
  renderCart,
  announce,
  showStorageWarning,
} from './shared/ui.js';

let catalogState: CatalogState = {
  search: '',
  category: 'all',
  sort: 'default',
};
let productState: LoadState<Product[]> = { status: 'loading' };
let cart: CartItem[] = [];

// Render the current cart together with its derived count and subtotal.
function refreshCart(): void {
  const products = productState.status === 'success' ? productState.data : [];
  renderCart(cart, products, getCartTotals(cart, products));
}

// Merge only the changed catalog controls before rendering matching products.
function handleCatalogChange(changes: Partial<CatalogState>): void {
  if (productState.status !== 'success') return;
  const products = productState.data;
  catalogState = { ...catalogState, ...changes };
  renderCatalog(selectProducts(products, catalogState), products.length);
}

// Apply one cart action, persist its result, then update all displayed totals.
function handleCartAction(action: CartAction, id = ''): void {
  if (productState.status !== 'success') return;
  const products = productState.data;
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

// Fetch before restoring saved carts so failed or empty responses cannot discard stored IDs.
async function loadProducts(): Promise<void> {
  productState = { status: 'loading' };
  render(productState);
  try {
    const products = await getProducts();
    if (products.length === 0) {
      productState = { status: 'empty' };
      render(productState);
      return;
    }
    productState = { status: 'success', data: products };
    cart = loadCart(products);
    initializeUI(products, {
      onCatalogChange: handleCatalogChange,
      onCartAction: handleCartAction,
    });
    render(productState);
    refreshCart();
  } catch (error: unknown) {
    const message =
      error instanceof ApiError ? error.message : 'Please try again.';
    productState = {
      status: 'error',
      message: 'Unable to load games. ' + message,
    };
    render(productState);
  }
}

initializeProductsUI(() => {
  if (productState.status !== 'loading') void loadProducts();
});
export const ready: Promise<void> = loadProducts();
