import React, { useState } from 'react';
import { Package, Trash2, ExternalLink, Sparkles, CheckCircle2, Clock, AlertCircle, ShoppingBag } from 'lucide-react';
import { DemoOrder } from '../lib/cart';

interface OrdersViewProps {
  orders: DemoOrder[];
  onDeleteOrder: (id: string) => void;
  onClearAllOrders: () => void;
  onTrySampleOrder: () => void;
  onGoToShop: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onDeleteOrder,
  onClearAllOrders,
  onTrySampleOrder,
  onGoToShop,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<DemoOrder | null>(null);

  return (
    <div className="pb-28 pt-2 px-4 max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#171635]/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#70C8F4]/20 text-[#171635] text-xs font-bold uppercase tracking-wider mb-2">
              <Package className="w-3.5 h-3.5" />
              <span>Simulated Orders</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold brand-font text-[#171635]">
              Order History (Demo Mode)
            </h1>
            <p className="text-xs sm:text-sm text-[#171635]/70 mt-1">
              Review prototype orders placed in this session.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {orders.length > 0 && (
              <button
                onClick={onClearAllOrders}
                className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition cursor-pointer"
              >
                Clear demo orders
              </button>
            )}
            <button
              onClick={onTrySampleOrder}
              className="px-4 py-2.5 rounded-2xl bg-[#FFD331] hover:bg-[#ffe066] text-[#171635] font-extrabold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Try sample order</span>
            </button>
          </div>
        </div>

        {/* Mandatory Demo Ordering Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>Prototype Demonstration: No purchase has been made</span>
          </div>
          <p className="text-[11px] text-amber-900/90 leading-relaxed">
            No real payment was taken and no physical delivery is scheduled. This demonstrates the customer ordering loop without requiring a live payment processor.
          </p>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-[#171635]/10 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#FCFCFF] border border-[#171635]/15 text-[#171635] flex items-center justify-center mx-auto text-2xl">
            📦
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold brand-font text-[#171635]">No orders placed yet</h3>
            <p className="text-xs sm:text-sm text-[#171635]/60 max-w-sm mx-auto">
              You can test the checkout workflow without entering real card details.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={onTrySampleOrder}
              className="px-5 py-2.5 rounded-xl bg-[#FFD331] text-[#171635] font-extrabold text-xs shadow-sm hover:bg-[#ffe066] transition cursor-pointer"
            >
              Try sample order
            </button>
            <button
              onClick={onGoToShop}
              className="px-5 py-2.5 rounded-xl border border-[#171635]/20 text-[#171635] font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
            >
              Browse shop
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-[#171635]/10 shadow-sm space-y-4 hover:border-[#70C8F4] transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#171635]/5">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#171635]">Order #{ord.id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                    Demo Order (Prototype)
                  </span>
                </div>
                <span className="text-xs text-[#171635]/50">
                  {new Date(ord.date).toLocaleDateString()} &bull; {new Date(ord.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Items summary */}
              <div className="space-y-2">
                {ord.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-[#171635] font-medium">
                      {item.quantity}× {item.product.name}
                    </span>
                    <span className="text-[#171635]/70 font-mono">
                      ${((item.product.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Destination & Total */}
              <div className="bg-[#FCFCFF] p-3.5 rounded-2xl border border-[#171635]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-[#171635]/60 block text-[11px]">Recipient / Destination:</span>
                  <span className="font-semibold text-[#171635]">{ord.recipientName} &bull; {ord.deliveryCity}</span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[#171635]/60 block text-[11px]">Simulated Total:</span>
                  <span className="font-extrabold text-sm text-[#171635]">${ord.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Footer action */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Simulated Delivery: 3–5 business days</span>
                </span>
                <button
                  type="button"
                  onClick={() => onDeleteOrder(ord.id)}
                  className="p-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1 transition"
                  title="Delete demo order"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
