import React, { useState } from 'react';
import { X, ShieldCheck, Cpu, ExternalLink, Bell, Check, AlertCircle } from 'lucide-react';
import { Product } from '../lib/products';

interface ConceptModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ConceptModal: React.FC<ConceptModalProps> = ({ product, onClose }) => {
  const [email, setEmail] = useState('');
  const [notified, setNotified] = useState(false);

  if (!product) return null;

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setNotified(true);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100000000] flex items-center justify-center p-4 bg-[#171635]/60 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="concept-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#171635]/15 p-6 sm:p-7 space-y-5 text-[#171635]">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFD331]/30 text-[#171635] text-[10px] font-extrabold uppercase tracking-wider">
              <span>Prototype Concept</span>
            </div>
            <h2 id="concept-modal-title" className="text-2xl font-bold brand-font text-[#171635]">
              {product.name}
            </h2>
            <p className="text-xs text-[#171635]/70 italic">{product.tagline}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#171635]/10 text-[#171635]/70 transition focus:outline-none focus:ring-2 focus:ring-[#171635]"
            aria-label="Close concept view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Concept Product Visual from approved presentation board */}
        <div className="rounded-2xl overflow-hidden border border-[#171635]/10 bg-[#FCFCFF] p-4 text-center space-y-2">
          {product.imageRef ? (
            <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
              <img
                src={product.imageRef}
                alt={`${product.name} brand showcase presentation`}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171635]/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-white text-xs font-bold drop-shadow">
                  RepairRight Hardware Concept Showcase
                </span>
              </div>
            </div>
          ) : (
            <div className="h-32 bg-[#70C8F4]/20 rounded-xl flex items-center justify-center">
              <Cpu className="w-12 h-12 text-[#171635]" />
            </div>
          )}
          <div className="text-[11px] text-[#171635]/60">
            Source: RepairRight Concept Presentation Board (R&amp;D Hardware Prototype)
          </div>
        </div>

        {/* Strictly required concept notice */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>Not currently available for commercial purchase</span>
          </div>
          <p className="text-[11px] text-amber-900/90 leading-relaxed">
            {product.id === 'sound-sensor-prototype'
              ? 'Prototype concept — diagnostic performance not validated. Sound alone cannot confirm a specific mechanical or electrical fault.'
              : 'Concept product — in active engineering validation. Not commercially manufactured or sold.'}
          </p>
        </div>

        {/* Summary & Details */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#171635]/70">Concept Overview</h3>
          <p className="text-xs sm:text-sm text-[#171635] leading-relaxed">
            {product.summary}
          </p>
          <ul className="space-y-2 text-xs text-[#171635]/80">
            {product.details.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#70C8F4] mt-1.5 shrink-0" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Specifications table */}
        {product.specs && (
          <div className="space-y-2 pt-2 border-t border-[#171635]/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#171635]/70">Target Specifications</h3>
            <div className="bg-[#FCFCFF] rounded-xl border border-[#171635]/10 divide-y divide-[#171635]/5 text-xs">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="p-2.5 flex justify-between">
                  <span className="text-[#171635]/60">{key}</span>
                  <span className="font-semibold text-[#171635]">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notification form */}
        <div className="bg-[#171635] text-white p-4 rounded-2xl space-y-2">
          <h4 className="text-xs font-bold text-[#FFD331] uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" />
            <span>Stay informed on prototype testing</span>
          </h4>
          <p className="text-xs text-[#FCFCFF]/80">
            Leave an email to receive field-test updates when this hardware enters open evaluation.
          </p>
          {!notified ? (
            <form onSubmit={handleNotify} className="flex gap-2 pt-1">
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FFD331]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#FFD331] text-[#171635] font-bold text-xs hover:bg-[#ffe066] transition cursor-pointer"
              >
                Notify me
              </button>
            </form>
          ) : (
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Thank you! We will email you once beta testing opens.</span>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="pt-1 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#171635]/10 hover:bg-[#171635]/15 text-[#171635] font-bold text-xs transition cursor-pointer"
          >
            Close preview
          </button>
        </div>
      </div>
    </div>
  );
};
