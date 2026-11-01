import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSubtotal, addToCart, updateQuantity, removeFromCart, createSampleOrder } from './cart';
import { PRODUCTS } from './products';

test('concept products cannot be added to cart', () => {
  const conceptProduct = PRODUCTS.find(p => p.isConcept)!;
  assert.throws(() => {
    addToCart([], conceptProduct, 1);
  }, /cannot add concept product/i);
});

test('orderable products can be added and subtotal calculated accurately', () => {
  const orderable = PRODUCTS.find(p => !p.isConcept)!;
  let cart = addToCart([], orderable, 2);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 2);

  const subtotal = calculateSubtotal(cart);
  assert.equal(subtotal, (orderable.price || 0) * 2);

  cart = addToCart(cart, orderable, 1);
  assert.equal(cart[0].quantity, 3);
});

test('cart quantity updates and removal work cleanly', () => {
  const orderable = PRODUCTS.find(p => !p.isConcept)!;
  let cart = [{ product: orderable, quantity: 2 }];

  cart = updateQuantity(cart, orderable.id, 5);
  assert.equal(cart[0].quantity, 5);

  cart = updateQuantity(cart, orderable.id, 0);
  assert.equal(cart.length, 0);

  cart = [{ product: orderable, quantity: 1 }];
  cart = removeFromCart(cart, orderable.id);
  assert.equal(cart.length, 0);
});

test('createSampleOrder creates clearly marked demo order', () => {
  const order = createSampleOrder();
  assert.equal(order.isDemo, true);
  assert.ok(order.id.startsWith('DEMO-'));
  assert.ok(order.total > 0);
});
