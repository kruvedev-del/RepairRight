import React from 'react';
import { 
  ArrowRight, 
  Play, 
  ShieldAlert, 
  Sparkles, 
  Volume2, 
  Wrench, 
  CheckCircle, 
  ExternalLink, 
  Package, 
  Gift, 
  MessageCircle,
  Video,
  Info,
  RotateCw,
  Lock
} from 'lucide-react';
import { Product } from '../lib/products';
import { WhatsAppButton } from './WhatsAppButton';

interface HomeViewProps {
  onStartRepairCheck: () => void;
  onTryDemo: () => void;
  onGoToShop: () => void;
  onGoToPromotions: () => void;
  onGoToGiveaway: () => void;
  onViewConcept: (product: Product) => void;
  conceptProducts: Product[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartRepairCheck,
  onTryDemo,
  onGoToShop,
  onGoToPromotions,
  onGoToGiveaway,
  onViewConcept,
  conceptProducts,
}) => {
  return (
    <div className="pb-24 pt-4 px-4 max-w-4xl mx-auto space-y-8">
      {/* Brand Hero Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#171635] via-[#1F1E47] to-[#171635] text-[#FCFCFF] p-6 sm:p-10 shadow-xl border border-[#171635]/20">
        {/* Subtle decorative background blur circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#70C8F4]/15 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#FFD331]/10 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-5">
          {/* Brand Promise Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCFCFF]/10 backdrop-blur-sm border border-[#FCFCFF]/20 text-[#FFD331] text-xs font-bold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[#FFD331] animate-pulse"></span>
            Know your next safe step
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight brand-font leading-[1.15]">
            Appliance trouble? <br />
            <span className="text-[#70C8F4]">Don’t guess</span> with electricity or gas.
          </h1>

          <p className="text-base sm:text-lg text-[#FCFCFF]/90 font-normal leading-relaxed">
            RepairRight helps household appliance owners understand a sensible, cautious next step when something goes wrong. Log your symptoms, screen for hazards, and get an organized summary for your repair pro.
          </p>

          {/* Primary Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onStartRepairCheck}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[#FFD331] hover:bg-[#ffe066] text-[#171635] font-extrabold text-base shadow-lg shadow-[#FFD331]/20 transition transform active:scale-98 focus:outline-none focus:ring-4 focus:ring-[#FFD331]/50 cursor-pointer"
            >
              <span>Start a repair check</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onTryDemo}
              className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-[#FCFCFF]/10 hover:bg-[#FCFCFF]/20 border border-[#FCFCFF]/30 text-[#FCFCFF] font-bold text-base transition active:scale-98 focus:outline-none focus:ring-2 focus:ring-[#FCFCFF]/50 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-[#70C8F4]" />
              <span>Try demo case</span>
            </button>
          </div>

          <div className="text-xs text-[#FCFCFF]/70 flex items-center gap-2 pt-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#70C8F4]"></span>
            <span>No sign-in required &bull; Washing machine noise prototype &bull; Safety-first checks</span>
          </div>
        </div>
      </section>

      {/* Product Video Integration (Preserved with native video controls, never obstructed) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#171635]/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#70C8F4]/20 text-[#171635] text-[11px] font-bold uppercase tracking-wider mb-1.5">
              <Video className="w-3.5 h-3.5 text-[#171635]" />
              <span>RepairRight in Action</span>
            </div>
            <h2 className="text-2xl font-bold brand-font text-[#171635]">
              Product &amp; Sensor Prototype Showcase
            </h2>
            <p className="text-xs sm:text-sm text-[#171635]/70 mt-0.5">
              Watch our concept hardware sensor and see how RepairRight guides household owners step-by-step.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#171635]/5 text-[#171635]/70 border border-[#171635]/10 self-start sm:self-auto">
            Official Video
          </span>
        </div>

        {/* Video Player */}
        <div className="relative rounded-2xl overflow-hidden bg-[#171635] shadow-md border border-[#171635]/20 aspect-video flex items-center justify-center">
          <video
            controls
            preload="metadata"
            className="w-full h-full object-cover"
            src="/assets/aistudio/Product_Video_36f7d0f2.mp4"
            aria-label="RepairRight Product Video Showcase"
          >
            Your browser does not support HTML5 video streaming.
          </video>
        </div>

        <div className="text-[11px] text-[#171635]/60 flex items-center justify-between pt-1">
          <span>Source: RepairRight Product Overview &bull; 1080p demonstration</span>
          <span className="italic">Audio &amp; visual reference for appliance diagnostics</span>
        </div>
      </section>

      {/* Featured Washing Machine Prototype Showcase */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#171635]/10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#FF4D8D]">Interactive Prototype Flow</div>
            <h2 className="text-2xl font-bold brand-font text-[#171635]">Washing Machine Symptom Check</h2>
          </div>
          <button
            onClick={onTryDemo}
            className="self-start sm:self-auto text-xs font-bold px-3 py-1.5 rounded-full bg-[#171635] text-white hover:bg-[#171635]/90 transition"
          >
            Launch demo washing machine
          </button>
        </div>

        <p className="text-sm text-[#171635]/80">
          This prototype focuses on the primary household scenario: diagnosing symptoms for a washing machine (such as loud spin rattling or draining faults) safely without opening chassis covers.
        </p>

        {/* 3 Step safe flow visual */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#FCFCFF] p-4 rounded-2xl border border-[#171635]/10 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#70C8F4]/20 text-[#171635] flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-sm text-[#171635]">Report a problem</h3>
            <p className="text-xs text-[#171635]/70 leading-relaxed">
              Describe unusual noises, shaking, or cycle stops. Brand and model are optional.
            </p>
          </div>

          <div className="bg-[#FCFCFF] p-4 rounded-2xl border border-[#171635]/10 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#FFD331]/30 text-[#171635] flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-sm text-[#171635]">Safety screening</h3>
            <p className="text-xs text-[#171635]/70 leading-relaxed">
              Immediate screening for burning odors, electrical tingling, or smoke halts DIY attempts instantly.
            </p>
          </div>

          <div className="bg-[#FCFCFF] p-4 rounded-2xl border border-[#171635]/10 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#FF4D8D]/15 text-[#171635] flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-sm text-[#171635]">Technician summary</h3>
            <p className="text-xs text-[#171635]/70 leading-relaxed">
              Receive up to 3 non-invasive safe checks and an organized summary to share with your repair professional.
            </p>
          </div>
        </div>
      </section>

      {/* Promotions & Community Feature Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spin-the-Wheel Promotion Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#171635]/10 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#FFD331] transition">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FFD331]/30 text-[#171635]">
                Promotional Feature
              </span>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                Preview Mode
              </span>
            </div>

            <h3 className="text-xl font-bold brand-font text-[#171635]">
              Spin to reveal an offer
            </h3>

            <p className="text-xs text-[#171635]/80 leading-relaxed">
              Test our interactive promotion wheel. Participation is completely optional and never blocks your repair check.
            </p>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-950 font-medium">
              <strong>“Demo spin — no prize or coupon will be issued.”</strong> Real offers require an authenticated validation backend.
            </div>
          </div>

          <button
            type="button"
            onClick={onGoToPromotions}
            className="w-full py-3 px-4 rounded-xl bg-[#171635] hover:bg-[#171635]/90 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Open spin wheel preview</span>
          </button>
        </div>

        {/* Giveaway Section Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#171635]/10 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#70C8F4] transition">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#70C8F4]/20 text-[#171635]">
                Community Program
              </span>
              <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300">
                Inactive
              </span>
            </div>

            <h3 className="text-xl font-bold brand-font text-[#171635]">
              Community Giveaway
            </h3>

            <p className="text-xs text-[#171635]/80 leading-relaxed">
              RepairRight hardware giveaways and appliance care packages.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-[#171635]/80 font-medium">
              <strong>“No active giveaway yet.”</strong> Inspect campaign specifications and preview the simulated entry flow.
            </div>
          </div>

          <button
            type="button"
            onClick={onGoToGiveaway}
            className="w-full py-3 px-4 rounded-xl border border-[#171635]/20 hover:bg-slate-50 text-[#171635] font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>View giveaway &amp; preview entry</span>
          </button>
        </div>
      </section>

      {/* WhatsApp Contact Area (Non-overlapping, clearly placed in contact area) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Direct Support</div>
            <h2 className="text-xl sm:text-2xl font-bold brand-font text-[#171635]">
              Chat with RepairRight on WhatsApp
            </h2>
          </div>
        </div>

        <WhatsAppButton variant="card" showDetails={true} />
      </section>

      {/* Hardware Concept Teaser Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#70C8F4]">R&amp;D Showcase</div>
            <h2 className="text-xl sm:text-2xl font-bold brand-font text-[#171635]">RepairRight Hardware Concepts</h2>
          </div>
          <button
            onClick={onGoToShop}
            className="text-xs font-bold text-[#171635] hover:text-[#70C8F4] flex items-center gap-1"
          >
            Explore shop &bull;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {conceptProducts.map((concept) => (
            <div
              key={concept.id}
              className="bg-white rounded-3xl p-5 border border-[#171635]/10 shadow-sm flex flex-col justify-between hover:border-[#70C8F4] transition space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#171635]/5 text-[#171635]/80 border border-[#171635]/10">
                    Concept prototype
                  </span>
                  <span className="text-[10px] text-amber-700 bg-amber-50 font-semibold px-2 py-0.5 rounded">
                    Not for sale
                  </span>
                </div>
                <h3 className="text-lg font-bold brand-font text-[#171635]">{concept.name}</h3>
                <p className="text-xs font-medium text-[#171635]/60 italic">{concept.tagline}</p>
                <p className="text-xs text-[#171635]/80 line-clamp-2">{concept.summary}</p>
              </div>

              <div className="pt-2 border-t border-[#171635]/5 flex items-center justify-between">
                <span className="text-xs text-[#171635]/60 font-medium">Lab validation status</span>
                <button
                  onClick={() => onViewConcept(concept)}
                  className="px-3.5 py-1.5 rounded-full bg-[#171635] hover:bg-[#171635]/85 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View concept</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Manifesto Banner */}
      <section className="rounded-2xl p-4 sm:p-5 bg-[#FFD331]/20 border border-[#FFD331] flex items-start gap-3 text-[#171635]">
        <ShieldAlert className="w-5 h-5 text-[#171635] shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold">Our Safety Guarantee</p>
          <p className="text-[#171635]/90 leading-relaxed">
            RepairRight will never instruct you to dismantle an appliance, touch high-voltage electrical components, bypass mechanical latches, or work on pressurized lines. If a symptom presents any hazard risk, we halt troubleshooting and direct you to certified technicians.
          </p>
        </div>
      </section>
    </div>
  );
};
