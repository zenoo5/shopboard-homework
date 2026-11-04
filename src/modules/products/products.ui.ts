// Render the four product request states while reusing the existing catalog and controls.
import type { LoadState, Product } from './products.types.js';
import { getElement, renderCatalog } from '../../shared/ui.js';

// Connect both recovery buttons to the same actual API request callback.
export function initialize(onRetry: () => void): void {
  getElement('button', '#retry-products').addEventListener('click', onRetry);
  getElement('button', '#reload-products').addEventListener('click', onRetry);
}

// Keep API-empty, failed requests, and empty search results visually distinct.
export function render(state: LoadState<Product[]>): void {
  if (state.status === 'success' && state.data.length === 0) {
    render({ status: 'empty' });
    return;
  }
  const busy = state.status === 'loading';
  const available = state.status === 'success';
  const status = getElement('p', '#products-request-status');
  const grid = getElement('div', '#product-grid');
  status.hidden = !busy;
  status.textContent = busy ? 'Loading games…' : '';
  getElement('div', '#products-request-error').hidden =
    state.status !== 'error';
  getElement('p', '#products-request-message').textContent = '';
  getElement('div', '#products-api-empty').hidden = state.status !== 'empty';
  getElement('div', '#catalog-empty').hidden = true;
  getElement('button', '#retry-products').disabled = busy;
  getElement('button', '#reload-products').disabled = busy;
  grid.setAttribute('aria-busy', String(busy));
  if (!available) {
    grid.replaceChildren();
    getElement('p', '#results-count').textContent = '';
  }
  for (const control of getElement(
    'form',
    '#catalog-controls',
  ).querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>(
    'input, select, button',
  )) {
    control.disabled = !available;
  }
  getElement('button', '#open-cart').disabled = !available;
  switch (state.status) {
    case 'loading':
      break;
    case 'success':
      renderCatalog(state.data, state.data.length);
      break;
    case 'error':
      getElement('p', '#products-request-message').textContent = state.message;
      break;
    case 'empty':
      getElement('p', '#results-count').textContent = '0 games available';
      break;
    default: {
      const unreachable: never = state;
      throw new Error('Unsupported product state: ' + String(unreachable));
    }
  }
}
