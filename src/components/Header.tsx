import React from 'react';
import { Logo } from './Logo';
import { ShoppingCart, ShieldCheck, Home, Wrench, Package, Cpu, Sparkles, Gift } from 'lucide-react';

export type TabType = 'home' | 'repair-check' | 'shop' | 'promotions' | 'giveaway' | 'my-appliances' | 'orders';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  cartCount: number;
  openCart: () => void;
  onStartDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  onStartDemo,
}) => {
  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FCFCFF]/95 backdrop-blur-md border-b border-[#171635]/10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setActiveTab('home')}
            className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171635] rounded-lg p-1 transition"
            aria-label="RepairRight Home"
          >
            <Logo size="md" />
          </button>

          {/* Desktop Nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition ${
                activeTab === 'home'
                  ? 'bg-[#171635] text-[#FCFCFF]'
                  : 'text-[#171635]/80 hover:bg-[#171635]/5'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('repair-check')}
              className={`px-3 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition ${
                activeTab === 'repair-check'
                  ? 'bg-[#171635] text-[#FCFCFF]'
                  : 'text-[#171635]/80 hover:bg-[#171635]/5'
              }`}
            >
              Repair check
            </button>
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-3 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition ${
                activeTab === 'shop'
                  ? 'bg-[#171635] text-[#FCFCFF]'
                  : 'text-[#171635]/80 hover:bg-[#171635]/5'
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => setActiveTab('promotions')}
              className={`px-3 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'promotions'
                  ? 'bg-[#171635] text-[#FCFCFF]'
                  : 'text-[#171635]/80 hover:bg-[#171635]/5'
              }`}
            >
              <span>Spin offer</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FFD331]/30 text-[#171635] font-bold">
                Demo
              </span>
            </button>
            <button
              onClick={() => setActiveTab('giveaway')}
              className={`px-3 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'giveaway'
                  ? 'bg-[#171635] text-[#FCFCFF]'
                  : 'text-[#171635]/80 hover:bg-[#171635]/5'
              }`}
            >
              <span>Giveaway</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-bold">
                Inactive
              </span>
            </button>
            <button
              onClick={() => setActiveTab('my-appliances')}
              className={`px-3 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition ${
                activeTab === 'my-appliances'
                  ? 'bg-[#171635] text-[#FCFCFF]'
                  : 'text-[#171635]/80 hover:bg-[#171635]/5'
              }`}
            >
              My appliances
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition ${
                activeTab === 'orders'
                  ? 'bg-[#171635] text-[#FCFCFF]'
                  : 'text-[#171635]/80 hover:bg-[#171635]/5'
              }`}
            >
              Orders
            </button>
          </nav>

          {/* Right Action: Demo Trigger & Cart */}
          <div className="flex items-center gap-2">
            <button
              onClick={onStartDemo}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-[#FFD331]/30 hover:bg-[#FFD331]/50 text-[#171635] border border-[#FFD331] transition"
              title="Open sample washing machine noise case"
            >
              <span className="w-2 h-2 rounded-full bg-[#171635]"></span>
              Try demo
            </button>

            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full text-[#171635] hover:bg-[#171635]/5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171635]"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#FF4D8D] text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Thumb friendly) */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FCFCFF]/98 backdrop-blur-md border-t border-[#171635]/10 px-1 py-1.5 shadow-lg flex items-center justify-around"
        aria-label="Mobile Navigation"
      >
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition ${
            activeTab === 'home' ? 'text-[#171635] font-bold' : 'text-[#171635]/60 font-medium'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('repair-check')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition ${
            activeTab === 'repair-check' ? 'text-[#171635] font-bold' : 'text-[#171635]/60 font-medium'
          }`}
        >
          <Wrench className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Check</span>
        </button>

        <button
          onClick={() => setActiveTab('shop')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition ${
            activeTab === 'shop' ? 'text-[#171635] font-bold' : 'text-[#171635]/60 font-medium'
          }`}
        >
          <div className="relative">
            <ShoppingCart className="w-4 h-4 mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#FF4D8D] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Shop</span>
        </button>

        <button
          onClick={() => setActiveTab('promotions')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition ${
            activeTab === 'promotions' ? 'text-[#171635] font-bold' : 'text-[#171635]/60 font-medium'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5 text-[#FFD331]" />
          <span className="text-[10px]">Spin</span>
        </button>

        <button
          onClick={() => setActiveTab('giveaway')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition ${
            activeTab === 'giveaway' ? 'text-[#171635] font-bold' : 'text-[#171635]/60 font-medium'
          }`}
        >
          <Gift className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Giveaway</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition ${
            activeTab === 'orders' ? 'text-[#171635] font-bold' : 'text-[#171635]/60 font-medium'
          }`}
        >
          <Package className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Orders</span>
        </button>
      </nav>
    </>
  );
};
