import React, { useState, useEffect } from 'react';
import { Header, TabType } from './components/Header';
import { HomeView } from './components/HomeView';
import { RepairCheckView } from './components/RepairCheckView';
import { ShopView } from './components/ShopView';
import { SpinWheelView } from './components/SpinWheelView';
import { GiveawayView } from './components/GiveawayView';
import { MyAppliancesView, SavedApplianceRecord } from './components/MyAppliancesView';
import { OrdersView } from './components/OrdersView';
import { ConceptModal } from './components/ConceptModal';
import { Footer } from './components/Footer';
import { Product, PRODUCTS } from './lib/products';
import { CartItem, DemoOrder, createSampleOrder } from './lib/cart';
import { RepairCheckResult } from './lib/safety';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [selectedConcept, setSelectedConcept] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('repairright_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Saved Appliances
  const [savedAppliances, setSavedAppliances] = useState<SavedApplianceRecord[]>(() => {
    try {
      const stored = localStorage.getItem('repairright_saved_appliances');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Saved Demo Orders
  const [orders, setOrders] = useState<DemoOrder[]>(() => {
    try {
      const stored = localStorage.getItem('repairright_demo_orders');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('repairright_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('repairright_saved_appliances', JSON.stringify(savedAppliances));
    } catch {}
  }, [savedAppliances]);

  useEffect(() => {
    try {
      localStorage.setItem('repairright_demo_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  // Support ?autostart=1 or ?tab= URL param for testability
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as TabType;
    if (tabParam && ['home', 'repair-check', 'shop', 'promotions', 'giveaway', 'my-appliances', 'orders'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    if (params.get('autostart') === '1' || params.get('demo') === '1') {
      setIsDemoActive(true);
      setActiveTab('repair-check');
    }
  }, []);

  // Handlers
  const handleStartDemo = () => {
    setIsDemoActive(true);
    setActiveTab('repair-check');
  };

  const handleStartRegularCheck = () => {
    setIsDemoActive(false);
    setActiveTab('repair-check');
  };

  const handleSaveToAppliances = (summary: RepairCheckResult, applianceName: string, symptom: string) => {
    const newRecord: SavedApplianceRecord = {
      id: `appliance-${Date.now()}`,
      applianceName,
      symptom,
      savedAt: new Date().toISOString(),
      summaryResult: summary,
    };
    setSavedAppliances(prev => [newRecord, ...prev]);
  };

  const handleDeleteAppliance = (id: string) => {
    setSavedAppliances(prev => prev.filter(a => a.id !== id));
  };

  const handleClearAllAppliances = () => {
    setSavedAppliances([]);
  };

  const handleOrderPlaced = (order: DemoOrder) => {
    setOrders(prev => [order, ...prev]);
  };

  const handleDeleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const handleClearAllOrders = () => {
    setOrders([]);
  };

  const handleTrySampleOrder = () => {
    const sample = createSampleOrder();
    setOrders(prev => [sample, ...prev]);
    setActiveTab('orders');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const conceptProducts = PRODUCTS.filter(p => p.isConcept);

  return (
    <div className="min-h-screen bg-[#FCFCFF] text-[#171635] flex flex-col font-sans selection:bg-[#FFD331] selection:text-[#171635]">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'repair-check') setIsDemoActive(false);
          setActiveTab(tab);
        }}
        cartCount={cartCount}
        openCart={() => setIsCartOpen(true)}
        onStartDemo={handleStartDemo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-2 sm:p-4">
        {activeTab === 'home' && (
          <HomeView
            onStartRepairCheck={handleStartRegularCheck}
            onTryDemo={handleStartDemo}
            onGoToShop={() => setActiveTab('shop')}
            onGoToPromotions={() => setActiveTab('promotions')}
            onGoToGiveaway={() => setActiveTab('giveaway')}
            onViewConcept={(prod) => setSelectedConcept(prod)}
            conceptProducts={conceptProducts}
          />
        )}

        {activeTab === 'repair-check' && (
          <RepairCheckView
            key={isDemoActive ? 'demo' : 'live'}
            initialDemo={isDemoActive}
            onSaveToAppliances={handleSaveToAppliances}
            onGoToShop={() => setActiveTab('shop')}
          />
        )}

        {activeTab === 'shop' && (
          <ShopView
            cart={cart}
            setCart={setCart}
            onOrderPlaced={handleOrderPlaced}
            onViewConcept={(prod) => setSelectedConcept(prod)}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            onGoToOrders={() => setActiveTab('orders')}
          />
        )}

        {activeTab === 'promotions' && (
          <SpinWheelView
            onGoToShop={() => setActiveTab('shop')}
            onGoToRepairCheck={handleStartRegularCheck}
          />
        )}

        {activeTab === 'giveaway' && (
          <GiveawayView
            onGoToShop={() => setActiveTab('shop')}
            onGoToRepairCheck={handleStartRegularCheck}
          />
        )}

        {activeTab === 'my-appliances' && (
          <MyAppliancesView
            savedRecords={savedAppliances}
            onDeleteRecord={handleDeleteAppliance}
            onClearAll={handleClearAllAppliances}
            onStartRepairCheck={handleStartRegularCheck}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersView
            orders={orders}
            onDeleteOrder={handleDeleteOrder}
            onClearAllOrders={handleClearAllOrders}
            onTrySampleOrder={handleTrySampleOrder}
            onGoToShop={() => setActiveTab('shop')}
          />
        )}
      </main>

      {/* Concept Detail Modal */}
      <ConceptModal
        product={selectedConcept}
        onClose={() => setSelectedConcept(null)}
      />

      {/* Footer with WhatsApp Contact, Quick Navigation, and Safety Notice */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
