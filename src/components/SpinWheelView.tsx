import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Info, 
  ShieldAlert, 
  HelpCircle, 
  Lock, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';
import { 
  DEFAULT_WHEEL_CONFIG, 
  WheelCampaignConfig, 
  SpinResult, 
  evaluateSpin 
} from '../lib/promotions';

interface SpinWheelViewProps {
  onGoToShop: () => void;
  onGoToRepairCheck: () => void;
}

export const SpinWheelView: React.FC<SpinWheelViewProps> = ({
  onGoToShop,
  onGoToRepairCheck,
}) => {
  const [config, setConfig] = useState<WheelCampaignConfig>(DEFAULT_WHEEL_CONFIG);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [spinCount, setSpinCount] = useState<number>(0);
  const [showConfigDetails, setShowConfigDetails] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Check user system preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const segments = config.prizeList;
  const numSegments = segments.length;
  const segmentAngle = 360 / numSegments;

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSpinResult(null);

    // Pick a target segment index
    const targetIdx = Math.floor(Math.random() * numSegments);
    const evaluated = evaluateSpin(config, targetIdx);

    // Calculate rotation: 5 full turns (1800 deg) + angle for target
    // The pointer is at top (0 deg / 270 deg depending on orientation).
    // Let pointer be at top (0 deg). To land on segment i:
    // angle = 360 - (targetIdx * segmentAngle + segmentAngle / 2)
    const extraTurns = 5 * 360;
    const targetAngle = 360 - (targetIdx * segmentAngle + segmentAngle / 2);
    const newTotalRotation = rotationDegrees + extraTurns + targetAngle;

    if (prefersReducedMotion) {
      // Reduced motion: skip animation instantly
      setRotationDegrees(newTotalRotation);
      setSpinResult(evaluated);
      setSpinCount(prev => prev + 1);
      setIsSpinning(false);
      return;
    }

    setRotationDegrees(newTotalRotation);

    // Animation lasts 3.5 seconds
    setTimeout(() => {
      setSpinResult(evaluated);
      setSpinCount(prev => prev + 1);
      setIsSpinning(false);
    }, 3500);
  };

  return (
    <div className="pb-28 pt-2 px-4 max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#171635]/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD331]/30 text-[#171635] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Promotional Showcase</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold brand-font text-[#171635]">
              Spin to reveal an offer
            </h1>
            <p className="text-xs sm:text-sm text-[#171635]/70 mt-1">
              Test our interactive promotion wheel. Participation is completely optional and never blocks your appliance repair check.
            </p>
          </div>
          <div className="self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Preview Mode Active</span>
            </span>
          </div>
        </div>

        {/* Required Prominent Banner: Demo spin — no prize or coupon will be issued */}
        <div 
          className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs sm:text-sm font-bold flex items-start gap-3 shadow-sm"
          role="status"
          aria-live="polite"
        >
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-extrabold text-[#171635]">
              “Demo spin — no prize or coupon will be issued.”
            </p>
            <p className="text-xs text-amber-900/90 font-normal leading-relaxed">
              This promotion feature is in preview mode because verified campaign details and a secure server-side prize-validation service are not yet connected. No real coupons or discounts are awarded.
            </p>
          </div>
        </div>
      </section>

      {/* Main Wheel Interaction Area */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#171635]/10 shadow-sm flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Interactive SVG Wheel Canvas */}
        <div className="relative flex flex-col items-center shrink-0">
          {/* Top Pointer */}
          <div 
            className="absolute -top-3 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-[#171635] drop-shadow-md"
            aria-hidden="true"
          />

          {/* Wheel Container */}
          <div 
            className="w-72 h-72 sm:w-80 sm:h-80 rounded-full p-2 bg-[#171635] shadow-xl relative flex items-center justify-center"
            style={{
              boxShadow: '0 10px 25px -5px rgba(23, 22, 53, 0.25)',
            }}
          >
            <div
              className="w-full h-full rounded-full overflow-hidden transition-transform duration-[3500ms]"
              style={{
                transform: `rotate(${rotationDegrees}deg)`,
                transitionTimingFunction: prefersReducedMotion ? 'none' : 'cubic-bezier(0.15, 0.85, 0.35, 1.0)',
              }}
              role="img"
              aria-label="Promotional spin wheel with 6 preview offer segments"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {segments.map((seg, i) => {
                  const startAngle = i * segmentAngle;
                  const endAngle = (i + 1) * segmentAngle;
                  
                  // Convert polar to cartesian (center at 50, 50, radius 50)
                  const rad1 = ((startAngle - 90) * Math.PI) / 180;
                  const rad2 = ((endAngle - 90) * Math.PI) / 180;
                  const x1 = 50 + 50 * Math.cos(rad1);
                  const y1 = 50 + 50 * Math.sin(rad1);
                  const x2 = 50 + 50 * Math.cos(rad2);
                  const y2 = 50 + 50 * Math.sin(rad2);

                  const midRad = (((startAngle + endAngle) / 2 - 90) * Math.PI) / 180;
                  const textX = 50 + 32 * Math.cos(midRad);
                  const textY = 50 + 32 * Math.sin(midRad);
                  const textRotation = (startAngle + endAngle) / 2;

                  return (
                    <g key={seg.id}>
                      <path
                        d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                        fill={seg.color}
                        stroke="#171635"
                        strokeWidth="1"
                      />
                      {/* Segment text */}
                      <text
                        x={textX}
                        y={textY}
                        fill={seg.color === '#171635' ? '#FCFCFF' : '#171635'}
                        fontSize="3.8"
                        fontWeight="800"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                      >
                        {seg.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Center Hub with RepairRight mark */}
            <div className="absolute z-10 w-16 h-16 rounded-full bg-[#FCFCFF] border-4 border-[#171635] shadow-md flex items-center justify-center">
              <span className="text-[10px] font-extrabold text-[#171635] brand-font uppercase text-center leading-tight">
                Demo<br />Spin
              </span>
            </div>
          </div>

          {/* Accessibility Indicator for reduced motion */}
          {prefersReducedMotion && (
            <span className="text-[11px] text-[#171635]/60 mt-2">
              (Reduced motion enabled: spins resolve instantaneously)
            </span>
          )}
        </div>

        {/* Spin Controls & Result Panel */}
        <div className="flex-1 w-full max-w-md space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold brand-font text-[#171635]">
              Experience the Wheel Flow
            </h2>
            <p className="text-xs text-[#171635]/70 leading-relaxed">
              Click the button below to test the wheel rotation. In preview mode, all selections result strictly in the demo disclaimer.
            </p>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            disabled={isSpinning}
            onClick={handleSpin}
            className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md transition transform active:scale-98 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD331]/50 cursor-pointer ${
              isSpinning
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-[#FFD331] hover:bg-[#ffe066] text-[#171635]'
            }`}
            aria-label="Spin to reveal an offer (demo simulation)"
          >
            <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Wheel spinning...' : 'Spin to reveal offer (Demo)'}</span>
          </button>

          {/* Result Card when spin completes */}
          {spinResult && (
            <div 
              className="p-5 rounded-2xl bg-[#FCFCFF] border-2 border-amber-300 space-y-3 animate-in fade-in"
              role="alert"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Wheel Landed on: {spinResult.segment.label}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 text-amber-950 border border-amber-200 font-extrabold text-xs sm:text-sm">
                “{spinResult.displayMessage}”
              </div>

              <p className="text-xs text-[#171635]/80 leading-relaxed">
                As required by promotional fairness standards, browser-only random number generators cannot validate genuine coupons or prizes. Real prizes require an authenticated backend promotion system.
              </p>

              <div className="pt-1 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className="px-3.5 py-2 rounded-xl bg-[#171635] text-white font-bold text-xs hover:bg-[#171635]/90 transition"
                >
                  Spin again (Demo)
                </button>
                <button
                  type="button"
                  onClick={onGoToShop}
                  className="px-3.5 py-2 rounded-xl border border-[#171635]/20 text-[#171635] font-bold text-xs hover:bg-slate-50 transition"
                >
                  Browse shop accessories
                </button>
              </div>
            </div>
          )}

          {/* Reassurance notes */}
          <div className="text-[11px] text-[#171635]/60 space-y-1 pt-1">
            <p>&bull; No purchase or credit card required to participate.</p>
            <p>&bull; Will not block or alter your appliance repair check.</p>
          </div>
        </div>
      </section>

      {/* Campaign Configuration Details Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#171635]/10 shadow-sm space-y-4">
        <button
          type="button"
          onClick={() => setShowConfigDetails(prev => !prev)}
          className="w-full flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#171635] rounded-xl p-1"
          aria-expanded={showConfigDetails}
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#70C8F4]" />
            <span className="text-sm font-bold text-[#171635]">
              Campaign Configuration &amp; Activation Requirements
            </span>
          </div>
          <div className="text-xs font-bold text-[#70C8F4] flex items-center gap-1">
            <span>{showConfigDetails ? 'Hide parameters' : 'View parameters'}</span>
            {showConfigDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showConfigDetails && (
          <div className="pt-2 border-t border-[#171635]/10 space-y-3.5 text-xs text-[#171635]/80 animate-in fade-in">
            <p className="leading-relaxed">
              RepairRight follows transparent promotion disclosure. The table below represents the campaign parameters that must be officially established before this wheel can leave preview mode.
            </p>

            <div className="bg-[#FCFCFF] rounded-2xl border border-[#171635]/10 divide-y divide-[#171635]/10">
              <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-bold text-[#171635]">Campaign Status:</span>
                <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded self-start sm:self-auto">
                  Preview Mode (Unverified)
                </span>
              </div>
              <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-bold text-[#171635]">Prize List &amp; Offer Details:</span>
                <span>6 sample preview slots (No real discounts or prizes invented)</span>
              </div>
              <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-bold text-[#171635]">Eligibility:</span>
                <span>{config.eligibility}</span>
              </div>
              <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-bold text-[#171635]">Entry Limits:</span>
                <span>{config.entryLimits}</span>
              </div>
              <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-bold text-[#171635]">Expiration:</span>
                <span>{config.expiration}</span>
              </div>
              <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-bold text-[#171635]">Selection Rules &amp; Odds:</span>
                <span>{config.selectionRules}</span>
              </div>
              <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-bold text-[#171635]">Backend Prize Validator:</span>
                <span className="font-mono text-[11px] text-red-700">None connected (Required for active mode)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-[#171635]/70 leading-relaxed">
              <strong>Site Owner Note:</strong> To issue real prizes or discount coupon codes, connect a secure validation endpoint that uses signed cryptographic tokens to authenticate entries and verify prize inventory.
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
