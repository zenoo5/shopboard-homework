// Verify catalog composition, cart invariants, and defensive persistence with real functions.
import test from 'node:test';
import assert from 'node:assert/strict';
import { selectProducts } from '../.test-build/catalog.js';
import {
  addItem,
  decreaseItem,
  removeItem,
  clearCart,
  getCartTotals,
} from '../.test-build/cart.js';
import {
  loadCart,
  saveCart,
  CART_STORAGE_KEY,
} from '../.test-build/storage.js';
import { products } from '../.test-build/products.js';

const sample = [
  { id: 'a', name: 'Alpha Keyboard', category: 'Keyboards', price: 29.99 },
  { id: 'b', name: 'Beta Mouse', category: 'Mice', price: 10.1 },
  { id: 'c', name: 'Gamma Keyboard', category: 'Keyboards', price: 19.5 },
];

// Provide an in-memory Storage substitute without involving a browser.
function memoryStorage(value = null) {
  const values = new Map(value === null ? [] : [[CART_STORAGE_KEY, value]]);
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, entry) => values.set(key, entry),
  };
}

test('catalog contains at least 12 uniquely identified complete products', () => {
  assert.ok(products.length >= 12);
  assert.equal(
    new Set(products.map((product) => product.id)).size,
    products.length,
  );
  for (const product of products) {
    for (const key of ['id', 'name', 'category', 'image', 'description'])
      assert.ok(product[key]);
    assert.ok(product.price > 0);
  }
});

test('1: name search ignores case and surrounding spaces', () => {
  assert.deepEqual(
    selectProducts(sample, { search: ' KEYBOARD ' }).map((p) => p.id),
    ['a', 'c'],
  );
  assert.deepEqual(
    selectProducts(sample, { search: 'keyboard' }),
    selectProducts(sample, { search: 'KEYBOARD' }),
  );
});

test('2: category selection excludes other categories; All includes every product', () => {
  assert.deepEqual(
    selectProducts(sample, { category: 'Mice' }).map((p) => p.id),
    ['b'],
  );
  assert.equal(selectProducts(sample, { category: 'all' }).length, 3);
});

test('3: both price orders work without mutating source and Default restores original order', () => {
  const original = structuredClone(sample);
  assert.deepEqual(
    selectProducts(sample, { sort: 'price-asc' }).map((p) => p.id),
    ['b', 'c', 'a'],
  );
  assert.deepEqual(
    selectProducts(sample, { sort: 'price-desc' }).map((p) => p.id),
    ['a', 'c', 'b'],
  );
  assert.deepEqual(
    selectProducts(sample, { sort: 'default' }).map((p) => p.id),
    ['a', 'b', 'c'],
  );
  assert.deepEqual(sample, original);
});

test('4: search, category, and sorting compose; unmatched search is empty', () => {
  assert.deepEqual(
    selectProducts(sample, {
      search: 'KEY',
      category: 'Keyboards',
      sort: 'price-asc',
    }).map((p) => p.id),
    ['c', 'a'],
  );
  assert.deepEqual(
    selectProducts(sample, {
      search: 'mouse',
      category: 'Keyboards',
      sort: 'price-desc',
    }),
    [],
  );
});

test('5–9: cart operations preserve other entries, count quantities, and calculate exact totals', () => {
  let cart = addItem([], 'a', sample);
  cart = addItem(cart, 'a', sample);
  assert.deepEqual(cart, [{ id: 'a', quantity: 2 }]);
  cart = addItem(cart, 'b', sample);
  assert.deepEqual(getCartTotals(cart, sample), { count: 3, totalCents: 7008 });
  cart = decreaseItem(cart, 'a');
  assert.deepEqual(getCartTotals(cart, sample), { count: 2, totalCents: 4009 });
  cart = decreaseItem(cart, 'a');
  assert.deepEqual(cart, [{ id: 'b', quantity: 1 }]);
  assert.deepEqual(getCartTotals(cart, sample), { count: 1, totalCents: 1010 });
  cart = addItem(cart, 'c', sample);
  cart = removeItem(cart, 'b');
  assert.deepEqual(cart, [{ id: 'c', quantity: 1 }]);
  assert.deepEqual(getCartTotals(cart, sample), { count: 1, totalCents: 1950 });
  cart = clearCart();
  assert.deepEqual(cart, []);
  assert.deepEqual(getCartTotals(cart, sample), { count: 0, totalCents: 0 });
});

test('unknown additions and repeated decreases cannot create invalid quantities', () => {
  assert.deepEqual(addItem([], 'missing', sample), []);
  assert.deepEqual(
    decreaseItem(decreaseItem([{ id: 'a', quantity: 1 }], 'a'), 'a'),
    [],
  );
  const original = [{ id: 'a', quantity: 1 }];
  addItem(original, 'a', sample);
  assert.deepEqual(original, [{ id: 'a', quantity: 1 }]);
});

test('10: storage round-trip restores only IDs and quantities', () => {
  const storage = memoryStorage();
  assert.equal(
    saveCart([{ id: 'a', quantity: 2, name: 'Unnecessary' }], storage),
    true,
  );
  assert.equal(storage.getItem(CART_STORAGE_KEY), '[{"id":"a","quantity":2}]');
  assert.deepEqual(loadCart(sample, storage), [{ id: 'a', quantity: 2 }]);
});

test('storage tolerates missing, malformed, and wrong-shaped data', () => {
  for (const value of [null, 'broken JSON', '{}', 'null', '42', '"hello"']) {
    assert.deepEqual(loadCart(sample, memoryStorage(value)), []);
  }
});

test('storage discards invalid entries and combines duplicate IDs', () => {
  const value = JSON.stringify([
    null,
    {},
    { id: 'unknown', quantity: 1 },
    { id: 'a', quantity: 0 },
    { id: 'a', quantity: -1 },
    { id: 'a', quantity: 1.5 },
    { id: 'a', quantity: '2' },
    { id: 'a', quantity: Number.MAX_SAFE_INTEGER },
    { id: 'a', quantity: 2 },
    { id: 'a', quantity: 3 },
  ]);
  assert.deepEqual(loadCart(sample, memoryStorage(value)), [
    { id: 'a', quantity: 5 },
  ]);
});

test('storage access failures return safe values without throwing', () => {
  const blocked = {
    getItem() {
      throw new Error('Storage blocked');
    },
    setItem() {
      throw new Error('Quota exceeded');
    },
  };
  assert.deepEqual(loadCart(sample, blocked), []);
  assert.equal(saveCart([{ id: 'a', quantity: 1 }], blocked), false);
});
