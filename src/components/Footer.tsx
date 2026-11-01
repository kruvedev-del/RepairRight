import React from 'react';
import { Logo } from './Logo';
import { WhatsAppButton } from './WhatsAppButton';
import { MessageCircle, ShieldAlert, Sparkles, Gift, Wrench, ShoppingBag, HardDrive, Package, ArrowUpRight } from 'lucide-react';
import { TabType } from './Header';
import { WHATSAPP_CONFIG } from '../lib/promotions';

interface FooterProps {
  setActiveTab: (tab: TabType) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-[#171635] text-[#FCFCFF] pt-12 pb-24 md:pb-12 border-t border-white/10 mt-auto">
      <div className="max-w-5xl mx-auto px-4 space-y-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <Logo size="md" light={true} />
            <p className="text-xs text-[#FCFCFF]/80 leading-relaxed">
              Household appliance symptom checks, cautious guidance, and hardware prototype accessories. Know your next safe step before calling a repair pro.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-[#FFD331] border border-white/15">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD331]"></span>
                Safety-First Guidance
              </span>
            </div>
          </div>

          {/* Quick Navigation Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#FFD331]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#FCFCFF]/80">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('home')}
                  className="hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('repair-check')}
                  className="hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Repair check</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('shop')}
                  className="hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Shop accessories</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('promotions')}
                  className="hover:text-white transition flex items-center gap-1.5 cursor-pointer text-[#70C8F4]"
                >
                  <span>Spin to reveal an offer</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white">Preview</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('giveaway')}
                  className="hover:text-white transition flex items-center gap-1.5 cursor-pointer text-[#70C8F4]"
                >
                  <span>Giveaway</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white">Inactive</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('my-appliances')}
                  className="hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>My appliances</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Demo orders</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Direct WhatsApp & Contact Area Col */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#FFD331]">
              Contact &amp; WhatsApp Support
            </h4>
            <p className="text-xs text-[#FCFCFF]/80 leading-relaxed">
              Have questions about appliance noises, vibration dampeners, or prototype testing? Connect directly with our team.
            </p>

            {/* Direct WhatsApp Button in Footer */}
            <div className="pt-1 space-y-2">
              <WhatsAppButton variant="footer" showDetails={true} />
            </div>

            <div className="pt-2 text-[11px] text-[#FCFCFF]/60 space-y-1">
              <p>&bull; Direct phone: +91 97994 95650</p>
              <p>&bull; General inquiries: contact@repairright.app</p>
            </div>
          </div>
        </div>

        {/* Safety & Compliance Manifesto */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#FCFCFF]/70">
          <div className="flex items-start gap-2.5 max-w-2xl">
            <ShieldAlert className="w-4 h-4 text-[#FFD331] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Safety Notice: </strong> 
              RepairRight organizes appliance symptom details to assist dialogue with certified repair professionals. Never open appliance cabinets, probe high-voltage wiring, or bypass safety locks. When electrical, fire, or gas hazard signs exist, immediately keep occupants away and contact emergency services.
            </p>
          </div>
          <div className="text-[11px] text-[#FCFCFF]/50 shrink-0">
            &copy; {new Date().getFullYear()} RepairRight. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
