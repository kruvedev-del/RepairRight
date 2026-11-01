import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Package, 
  Truck, 
  CreditCard, 
  Info, 
  AlertCircle,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { Product, PRODUCTS } from '../lib/products';
import { CartItem, DemoOrder, calculateSubtotal, addToCart, updateQuantity, removeFromCart, createSampleOrder } from '../lib/cart';

interface ShopViewProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onOrderPlaced: (order: DemoOrder) => void;
  onViewConcept: (product: Product) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  onGoToOrders: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  cart,
  setCart,
  onOrderPlaced,
  onViewConcept,
  isCartOpen,
  setIsCartOpen,
  onGoToOrders,
}) => {
  const [filter, setFilter] = useState<'all' | 'orderable' | 'concepts'>('all');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<DemoOrder | null>(null);

  // Demo checkout form state
  const [recipientName, setRecipientName] = useState('Alex Morgan');
  const [addressLine, setAddressLine] = useState('123 Safe Step Lane');
  const [city, setCity] = useState('Austin');
  const [stateCode, setStateCode] = useState('TX');
  const [postalCode, setPostalCode] = useState('78701');
  const [contactEmail, setContactEmail] = useState('alex.morgan@example.com');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected product detail modal
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  const subtotal = calculateSubtotal(cart);
  const shipping = cart.length > 0 ? 0 : 0; // Free demo shipping
  const tax = +(subtotal * 0.0825).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  // Add orderable product to cart
  const handleAddToCart = (product: Product) => {
    try {
      const updated = addToCart(cart, product, 1);
      setCart(updated);
      setIsCartOpen(true);
    } catch (e: any) {
      alert(e.message);
    }
  };

  // 1-Click "Try Sample Order" as instructed by prompt
  const handleTrySampleOrder = () => {
    const sample = createSampleOrder();
    setCart(sample.items);
    setRecipientName(sample.recipientName);
    setAddressLine('123 Safe Step Lane');
    setCity('Austin');
    setStateCode('TX');
    setPostalCode('78701');
    setContactEmail('alex.morgan@example.com');
    setCheckoutStep('checkout');
    setIsCartOpen(true);
  };

  // Complete Demo Order
  const handlePlaceDemoOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const order: DemoOrder = {
        id: `DEMO-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [...cart],
        subtotal,
        shipping,
        tax,
        total,
        date: new Date().toISOString(),
        isDemo: true,
        recipientName: recipientName.trim() || 'Demo Recipient',
        deliveryCity: `${city}, ${stateCode}`,
      };

      onOrderPlaced(order);
      setLastPlacedOrder(order);
      setCart([]);
      setIsSubmitting(false);
      setCheckoutStep('confirmed');
    }, 600);
  };

  // Filtered products list
  const filteredProducts = PRODUCTS.filter((p) => {
    if (filter === 'orderable') return !p.isConcept;
    if (filter === 'concepts') return p.isConcept;
    return true;
  });

  return (
    <div className="pb-28 pt-2 px-4 max-w-5xl mx-auto space-y-8">
      {/* Shop Header Banner */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#171635]/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#70C8F4]/20 text-[#171635] text-xs font-bold uppercase tracking-wider mb-2">
              <Package className="w-3.5 h-3.5" />
              <span>RepairRight Product Catalog</span>
            </div>
            <h1 className="text-3xl font-extrabold brand-font text-[#171635]">
              Shop &amp; Prototype Showcase
            </h1>
            <p className="text-sm text-[#171635]/80 max-w-2xl mt-1">
              Browse verified anti-vibration accessories available in our prototype store, alongside upcoming hardware concepts currently in laboratory evaluation.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleTrySampleOrder}
              className="px-4 py-2.5 rounded-2xl bg-[#FFD331] hover:bg-[#ffe066] text-[#171635] font-extrabold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#171635]" />
              <span>Try sample order</span>
            </button>

            {cart.length > 0 && (
              <button
                onClick={() => {
                  setCheckoutStep('cart');
                  setIsCartOpen(true);
                }}
                className="px-4 py-2.5 rounded-2xl bg-[#171635] text-white font-bold text-xs hover:bg-[#171635]/90 transition flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>View cart ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
              </button>
            )}
          </div>
        </div>

        {/* Demo store transparency notice */}
        <div className="p-3.5 rounded-2xl bg-[#FCFCFF] border border-[#171635]/10 text-xs text-[#171635]/80 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#70C8F4] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#171635]">Demo Ordering Policy: </span>
            This prototype demonstrates the end-to-end checkout experience without collecting payment card details or charging money. Concept items (TankGuard Mini &amp; Sound Sensor) are view-only concepts.
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#171635]/10 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
              filter === 'all'
                ? 'bg-[#171635] text-white'
                : 'bg-white text-[#171635]/70 hover:bg-[#171635]/5 border border-[#171635]/10'
            }`}
          >
            All Products ({PRODUCTS.length})
          </button>
          <button
            onClick={() => setFilter('orderable')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
              filter === 'orderable'
                ? 'bg-[#171635] text-white'
                : 'bg-white text-[#171635]/70 hover:bg-[#171635]/5 border border-[#171635]/10'
            }`}
          >
            Available in Demo Store ({PRODUCTS.filter(p => !p.isConcept).length})
          </button>
          <button
            onClick={() => setFilter('concepts')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
              filter === 'concepts'
                ? 'bg-[#171635] text-white'
                : 'bg-white text-[#171635]/70 hover:bg-[#171635]/5 border border-[#171635]/10'
            }`}
          >
            Concept Hardware ({PRODUCTS.filter(p => p.isConcept).length})
          </button>
        </div>
      </section>

      {/* Product Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            className={`bg-white rounded-3xl p-6 border transition flex flex-col justify-between shadow-sm hover:shadow-md ${
              product.isConcept ? 'border-[#171635]/15' : 'border-[#171635]/10'
            }`}
          >
            <div className="space-y-4">
              {/* Product Badge & Category */}
              <div className="flex items-start justify-between gap-2">
                <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${
                  product.isConcept
                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                }`}>
                  {product.statusBadge}
                </span>

                {product.price !== undefined ? (
                  <span className="text-xl font-extrabold text-[#171635] brand-font">
                    ${product.price.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-xs text-[#171635]/60 font-semibold italic">
                    Concept R&amp;D
                  </span>
                )}
              </div>

              {/* Title & Tagline */}
              <div>
                <h2 className="text-xl font-bold brand-font text-[#171635]">{product.name}</h2>
                <p className="text-xs font-medium text-[#171635]/70 italic mt-0.5">{product.tagline}</p>
              </div>

              {/* Summary Description */}
              <p className="text-xs sm:text-sm text-[#171635]/80 leading-relaxed">
                {product.summary}
              </p>

              {/* Verified Product Metadata */}
              <div className="bg-[#FCFCFF] p-3.5 rounded-2xl border border-[#171635]/10 text-xs space-y-1.5">
                {product.stockStatus && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#171635]/60">Stock status:</span>
                    <span className="font-semibold text-[#171635] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {product.stockStatus}
                    </span>
                  </div>
                )}
                {product.deliveryInfo && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#171635]/60">Delivery:</span>
                    <span className="font-medium text-[#171635]">{product.deliveryInfo}</span>
                  </div>
                )}
                {product.orderProcessingMethod && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#171635]/60">Processing:</span>
                    <span className="font-medium text-[#171635]">{product.orderProcessingMethod}</span>
                  </div>
                )}
                {product.isConcept && (
                  <div className="text-[11px] text-amber-900 font-medium">
                    Diagnostic performance unvalidated. Displayed from RepairRight presentation board.
                  </div>
                )}
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-5 mt-4 border-t border-[#171635]/10 flex items-center justify-between gap-3">
              {product.isConcept ? (
                /* Concept products strictly offer "View concept", not "Add to cart" */
                <button
                  type="button"
                  onClick={() => onViewConcept(product)}
                  className="w-full py-3 rounded-2xl bg-[#171635] hover:bg-[#171635]/90 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>View concept details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              ) : (
                /* Orderable items offer "Add to cart" */
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className="w-full py-3 rounded-2xl bg-[#FFD331] hover:bg-[#ffe066] text-[#171635] font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to cart &bull; ${product.price?.toFixed(2)}</span>
                </button>
              )}
            </div>
          </article>
        ))}
      </section>

      {/* ================= CART & CHECKOUT MODAL / DRAWER ================= */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 z-[100000000] flex items-center justify-center p-4 bg-[#171635]/60 backdrop-blur-sm animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#171635]/15 p-6 sm:p-7 space-y-6 text-[#171635]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#171635]/10">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#171635]" />
                <h2 className="text-xl font-bold brand-font">
                  {checkoutStep === 'cart' && 'Your Cart'}
                  {checkoutStep === 'checkout' && 'Demo Checkout'}
                  {checkoutStep === 'confirmed' && 'Order Confirmed'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCheckoutStep('cart');
                }}
                className="text-xs font-bold px-3 py-1.5 rounded-full hover:bg-slate-100 text-[#171635]/70"
              >
                Close
              </button>
            </div>

            {/* MANDATORY PROMPT BANNER */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Demo only — no purchase will be made. No payment credentials collected.</span>
            </div>

            {/* ================= CART VIEW ================= */}
            {checkoutStep === 'cart' && (
              <div className="space-y-5">
                {cart.length === 0 ? (
                  <div className="text-center py-8 space-y-3">
                    <p className="text-sm text-[#171635]/70">Your cart is currently empty.</p>
                    <button
                      onClick={handleTrySampleOrder}
                      className="px-4 py-2 rounded-xl bg-[#FFD331] text-[#171635] text-xs font-bold"
                    >
                      Load sample item to test checkout
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-[#171635]/10 max-h-60 overflow-y-auto pr-1">
                      {cart.map((item) => (
                        <div key={item.product.id} className="py-3 flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-[#171635] truncate">{item.product.name}</h4>
                            <p className="text-[11px] text-[#171635]/60">${item.product.price?.toFixed(2)} each</p>
                          </div>

                          {/* Stepper */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setCart(updateQuantity(cart, item.product.id, item.quantity - 1))}
                              className="w-6 h-6 rounded-lg border border-[#171635]/20 flex items-center justify-center text-xs font-bold hover:bg-slate-100"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => setCart(updateQuantity(cart, item.product.id, item.quantity + 1))}
                              className="w-6 h-6 rounded-lg border border-[#171635]/20 flex items-center justify-center text-xs font-bold hover:bg-slate-100"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                            <button
                              onClick={() => setCart(removeFromCart(cart, item.product.id))}
                              className="p-1 text-[#FF4D8D] hover:bg-red-50 rounded"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-xs font-bold text-[#171635] w-14 text-right">
                            ${((item.product.price || 0) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="bg-[#FCFCFF] p-4 rounded-2xl border border-[#171635]/10 space-y-1.5 text-xs">
                      <div className="flex justify-between text-[#171635]/70">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[#171635]/70">
                        <span>Demo Shipping:</span>
                        <span className="text-emerald-700 font-semibold">Free (Prototype)</span>
                      </div>
                      <div className="flex justify-between text-[#171635]/70">
                        <span>Estimated Tax (Simulated 8.25%):</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-sm text-[#171635] pt-2 border-t border-[#171635]/10">
                        <span>Total (Demo):</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={handleTrySampleOrder}
                        className="text-xs font-bold text-[#171635] underline hover:text-[#70C8F4]"
                      >
                        Try sample order
                      </button>
                      <button
                        onClick={() => setCheckoutStep('checkout')}
                        className="ml-auto px-6 py-3 rounded-xl bg-[#171635] hover:bg-[#171635]/90 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Proceed to Demo Checkout</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ================= CHECKOUT VIEW ================= */}
            {checkoutStep === 'checkout' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCheckoutStep('cart')}
                    className="text-xs text-[#171635] font-bold flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back to cart</span>
                  </button>
                  <span className="text-xs text-[#171635]/60 font-semibold">Total: ${total.toFixed(2)}</span>
                </div>

                {/* Delivery Information fields */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#171635]">Demo Shipping Address</label>
                    <button
                      type="button"
                      onClick={() => {
                        setRecipientName('Alex Morgan (Demo Recipient)');
                        setAddressLine('123 Safe Step Lane');
                        setCity('Austin');
                        setStateCode('TX');
                        setPostalCode('78701');
                      }}
                      className="text-[11px] text-[#70C8F4] font-bold hover:underline"
                    >
                      Pre-fill sample data
                    </button>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Recipient full name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#171635]/20 text-xs focus:outline-none focus:ring-2 focus:ring-[#171635]"
                    />
                    <input
                      type="text"
                      placeholder="Street address"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#171635]/20 text-xs focus:outline-none focus:ring-2 focus:ring-[#171635]"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="p-2.5 rounded-lg border border-[#171635]/20 text-xs focus:outline-none focus:ring-2 focus:ring-[#171635]"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={stateCode}
                        onChange={(e) => setStateCode(e.target.value)}
                        className="p-2.5 rounded-lg border border-[#171635]/20 text-xs focus:outline-none focus:ring-2 focus:ring-[#171635]"
                      />
                      <input
                        type="text"
                        placeholder="Zip"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="p-2.5 rounded-lg border border-[#171635]/20 text-xs focus:outline-none focus:ring-2 focus:ring-[#171635]"
                      />
                    </div>
                  </div>
                </div>

                {/* Secure Payment Preview (Explicitly no raw card collection!) */}
                <div className="bg-[#FCFCFF] p-4 rounded-2xl border border-[#171635]/15 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#171635]">
                    <CreditCard className="w-4 h-4 text-[#70C8F4]" />
                    <span>Payment Processing (Simulation Mode)</span>
                  </div>
                  <p className="text-[11px] text-[#171635]/70 leading-relaxed">
                    No real payment credentials are required. RepairRight never collects or stores raw credit card or UPI info without an active certified payment provider.
                  </p>
                  <div className="p-2.5 rounded-xl bg-white border border-[#171635]/10 text-xs font-mono text-[#171635]/80 flex items-center justify-between">
                    <span>Payment Provider:</span>
                    <span className="font-bold text-[#171635]">Demo Sandbox (No Charge)</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePlaceDemoOrder}
                  className="w-full py-3.5 rounded-xl bg-[#171635] hover:bg-[#171635]/90 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Processing simulated order...</span>
                    </>
                  ) : (
                    <span>Authorize Demo Order &bull; ${total.toFixed(2)}</span>
                  )}
                </button>
              </div>
            )}

            {/* ================= ORDER CONFIRMED VIEW ================= */}
            {checkoutStep === 'confirmed' && lastPlacedOrder && (
              <div className="space-y-4 text-center py-2 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                    Demo Order Confirmed (Simulated)
                  </span>
                  <h3 className="text-xl font-bold brand-font text-[#171635]">
                    Order #{lastPlacedOrder.id}
                  </h3>
                  <p className="text-xs text-[#171635]/70">
                    No purchase was made and no card was charged. Saved to your prototype order history.
                  </p>
                </div>

                <div className="bg-[#FCFCFF] p-4 rounded-2xl border border-[#171635]/10 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#171635]/60">Recipient:</span>
                    <span className="font-semibold text-[#171635]">{lastPlacedOrder.recipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#171635]/60">Destination:</span>
                    <span className="font-semibold text-[#171635]">{lastPlacedOrder.deliveryCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#171635]/60">Total authorized:</span>
                    <span className="font-bold text-[#171635]">${lastPlacedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#171635]/60">Estimated delivery:</span>
                    <span className="text-emerald-700 font-medium">3–5 business days (Simulated)</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      onGoToOrders();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#171635] text-white font-bold text-xs hover:bg-[#171635]/90 transition cursor-pointer"
                  >
                    View in Orders tab
                  </button>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setCheckoutStep('cart');
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-[#171635]/20 text-[#171635] font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                  >
                    Continue browsing
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
