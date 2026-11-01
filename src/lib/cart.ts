import { Product, PRODUCTS } from './products';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DemoOrder {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  date: string;
  isDemo: true;
  recipientName: string;
  deliveryCity: string;
}

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const price = item.product.price ?? 0;
    return sum + price * item.quantity;
  }, 0);
}

export function addToCart(currentItems: CartItem[], product: Product, quantity: number = 1): CartItem[] {
  // STRICT: Concept products cannot be added to cart
  if (product.isConcept) {
    throw new Error(`Cannot add concept product "${product.name}" to cart. Concept products are view-only.`);
  }

  const existingIndex = currentItems.findIndex(i => i.product.id === product.id);
  if (existingIndex >= 0) {
    const updated = [...currentItems];
    updated[existingIndex] = {
      ...updated[existingIndex],
      quantity: updated[existingIndex].quantity + quantity,
    };
    return updated;
  }

  return [...currentItems, { product, quantity }];
}

export function updateQuantity(currentItems: CartItem[], productId: string, quantity: number): CartItem[] {
  if (quantity <= 0) {
    return currentItems.filter(i => i.product.id !== productId);
  }
  return currentItems.map(item => {
    if (item.product.id === productId) {
      return { ...item, quantity };
    }
    return item;
  });
}

export function removeFromCart(currentItems: CartItem[], productId: string): CartItem[] {
  return currentItems.filter(i => i.product.id !== productId);
}

export function createSampleOrder(): DemoOrder {
  const padProduct = PRODUCTS.find(p => p.id === 'isolation-pads-4pack') || PRODUCTS[2];
  const items: CartItem[] = [{ product: padProduct, quantity: 1 }];
  const subtotal = padProduct.price ?? 18.50;
  const shipping = 0; // Free demo shipping
  const tax = +(subtotal * 0.0825).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  return {
    id: `DEMO-${Math.floor(100000 + Math.random() * 900000)}`,
    items,
    subtotal,
    shipping,
    tax,
    total,
    date: new Date().toISOString(),
    isDemo: true,
    recipientName: 'Alex Morgan (Demo Recipient)',
    deliveryCity: 'Austin, TX (Sample address)',
  };
}
