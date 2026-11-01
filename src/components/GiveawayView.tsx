import React, { useState } from 'react';
import { 
  Gift, 
  AlertCircle, 
  Info, 
  Lock, 
  Check, 
  ShieldCheck, 
  Mail, 
  User, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle,
  Clock,
  Calendar,
  FileText
} from 'lucide-react';
import { 
  DEFAULT_GIVEAWAY_CONFIG, 
  GiveawayCampaignConfig, 
  validatePreviewGiveawayEntry, 
  GiveawayPreviewEntry 
} from '../lib/promotions';

interface GiveawayViewProps {
  onGoToRepairCheck: () => void;
  onGoToShop: () => void;
}

export const GiveawayView: React.FC<GiveawayViewProps> = ({
  onGoToRepairCheck,
  onGoToShop,
}) => {
  const [config, setConfig] = useState<GiveawayCampaignConfig>(DEFAULT_GIVEAWAY_CONFIG);
  const [isPreviewFlowOpen, setIsPreviewFlowOpen] = useState<boolean>(false);
  const [showConfigDetails, setShowConfigDetails] = useState<boolean>(false);

  // Preview form states
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [applianceInterest, setApplianceInterest] = useState<string>('Washing Machine');
  const [marketingConsent, setMarketingConsent] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [simulatedReceipt, setSimulatedReceipt] = useState<GiveawayPreviewEntry | null>(null);

  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validatePreviewGiveawayEntry({
      fullName,
      email,
      applianceInterest,
      marketingConsent,
    });

    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setErrors([]);
    setSimulatedReceipt(result.simulatedEntry);
  };

  const handleResetPreview = () => {
    setFullName('');
    setEmail('');
    setMarketingConsent(false);
    setErrors([]);
    setSimulatedReceipt(null);
  };

  return (
    <div className="pb-28 pt-2 px-4 max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#171635]/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#70C8F4]/20 text-[#171635] text-xs font-bold uppercase tracking-wider mb-2">
              <Gift className="w-3.5 h-3.5" />
              <span>Official Community Program</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold brand-font text-[#171635]">
              Giveaway
            </h1>
            <p className="text-xs sm:text-sm text-[#171635]/70 mt-1">
              RepairRight community appliance care and maintenance hardware giveaways.
            </p>
          </div>
          <div className="self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>Currently Inactive</span>
            </span>
          </div>
        </div>

        {/* Required Prominent Notice: No active giveaway yet */}
        <div 
          className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-300 text-[#171635] space-y-2 shadow-sm"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-slate-700 shrink-0" />
            <h2 className="text-lg font-extrabold brand-font text-[#171635]">
              “No active giveaway yet.”
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#171635]/80 leading-relaxed">
            There are currently no active giveaways or sweepstakes running. Verified campaign details (prize, eligibility rules, entry period, and official terms) and an authenticated entry backend have not been configured. We do not announce fake winners or collect entries when inactive.
          </p>
        </div>
      </section>

      {/* Preview Entry Flow Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#171635]/10 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold brand-font text-[#171635]">
              Preview Entry Flow
            </h2>
            <p className="text-xs text-[#171635]/70 mt-0.5">
              Explore how giveaway entries will be collected once verified campaign details and a secure backend are connected.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsPreviewFlowOpen(prev => !prev);
              if (simulatedReceipt) handleResetPreview();
            }}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#171635] hover:bg-[#171635]/90 text-white font-bold text-xs transition cursor-pointer"
          >
            {isPreviewFlowOpen ? 'Close preview form' : 'Open preview entry form'}
          </button>
        </div>

        {isPreviewFlowOpen && (
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FCFCFF] border border-[#171635]/15 space-y-5 animate-in fade-in">
            {/* Clear Preview Notice */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Simulated Flow — No real entries are collected or stored</span>
              </span>
              <p className="text-[11px] text-amber-900/90 leading-relaxed">
                This test form showcases our minimal data collection standards. No database write occurs.
              </p>
            </div>

            {!simulatedReceipt ? (
              <form onSubmit={handlePreviewSubmit} className="space-y-4">
                {errors.length > 0 && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs space-y-1">
                    {errors.map((err, i) => (
                      <p key={i}>&bull; {err}</p>
                    ))}
                  </div>
                )}

                {/* 1. Necessary Information: Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#171635] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#70C8F4]" />
                    <span>Full Name</span>
                    <span className="text-[11px] text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Miller"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#171635]/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#171635]"
                  />
                  <p className="text-[10px] text-[#171635]/60">
                    Used solely to verify legal identity if selected in an official drawing.
                  </p>
                </div>

                {/* 2. Necessary Information: Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#171635] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#70C8F4]" />
                    <span>Email Address</span>
                    <span className="text-[11px] text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. jordan.miller@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#171635]/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#171635]"
                  />
                  <p className="text-[10px] text-[#171635]/60">
                    Used solely to notify the winner if drawn under official campaign rules.
                  </p>
                </div>

                {/* 3. Optional Appliance Interest */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#171635]">
                    Household Appliance You Most Rely On (Optional)
                  </label>
                  <select
                    value={applianceInterest}
                    onChange={(e) => setApplianceInterest(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#171635]/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#171635] bg-white"
                  >
                    <option value="Washing Machine">Washing Machine</option>
                    <option value="Refrigerator">Refrigerator</option>
                    <option value="Dishwasher">Dishwasher</option>
                    <option value="Clothes Dryer">Clothes Dryer</option>
                  </select>
                </div>

                {/* 4. Strict Requirement: Optional marketing consent separate */}
                <div className="p-3.5 rounded-xl bg-white border border-[#171635]/15 space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="mt-0.5 text-[#171635] focus:ring-[#171635]"
                    />
                    <div className="text-xs text-[#171635]/90 leading-snug">
                      <span className="font-bold">Optional: </span>
                      Receive RepairRight product announcements and appliance maintenance guides.
                      <span className="block text-[11px] text-[#171635]/60 mt-0.5">
                        (Separate consent — this is NOT required to enter the giveaway).
                      </span>
                    </div>
                  </label>
                </div>

                {/* Strict Requirement: No automatic WhatsApp messages */}
                <div className="flex items-center gap-2 text-[11px] text-[#171635]/70 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Privacy commitment: Entrants are <strong>never automatically messaged on WhatsApp</strong> or added to bulk marketing groups.
                  </span>
                </div>

                {/* Submit button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#171635] hover:bg-[#171635]/90 text-white font-extrabold text-xs transition cursor-pointer"
                  >
                    Simulate entry submission (Preview)
                  </button>
                </div>
              </form>
            ) : (
              /* Simulated Receipt */
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900">
                      Preview Entry Simulation Complete
                    </h4>
                    <p className="text-[11px] text-emerald-800">
                      Demonstration only — no database record was stored.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-xs space-y-1.5 text-[#171635]">
                  <div className="flex justify-between">
                    <span className="text-[#171635]/60">Simulated Name:</span>
                    <span className="font-semibold">{simulatedReceipt.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#171635]/60">Simulated Email:</span>
                    <span className="font-semibold">{simulatedReceipt.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#171635]/60">Marketing Consent:</span>
                    <span className="font-semibold">
                      {simulatedReceipt.marketingConsent ? 'Granted (Optional)' : 'Declined (Entry still valid)'}
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={handleResetPreview}
                    className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                  >
                    Reset preview form
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Campaign Configuration Specifications */}
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
              Site Owner Campaign Configuration Schema
            </span>
          </div>
          <div className="text-xs font-bold text-[#70C8F4] flex items-center gap-1">
            <span>{showConfigDetails ? 'Hide schema' : 'Inspect schema'}</span>
            {showConfigDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showConfigDetails && (
          <div className="pt-2 border-t border-[#171635]/10 space-y-3.5 text-xs text-[#171635]/80 animate-in fade-in">
            <p className="leading-relaxed">
              Before activating a live giveaway, the site owner must supply verified parameters and connect an authenticated database endpoint. RepairRight strictly prohibits inventing dates or prizes.
            </p>

            <div className="bg-[#FCFCFF] rounded-2xl border border-[#171635]/10 divide-y divide-[#171635]/10">
              <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-bold text-[#171635]">Prize:</span>
                <span>{config.prize}</span>
              </div>
              <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-bold text-[#171635]">Eligibility:</span>
                <span>{config.eligibility}</span>
              </div>
              <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-bold text-[#171635]">Entry Period:</span>
                <span>Start: {config.entryPeriod.startDate} &bull; End: {config.entryPeriod.endDate}</span>
              </div>
              <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-bold text-[#171635]">Entry Limits:</span>
                <span>{config.entryLimits}</span>
              </div>
              <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-bold text-[#171635]">Winner Selection:</span>
                <span>{config.winnerSelectionMethod} &bull; Date: {config.winnerSelectionDate}</span>
              </div>
              <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-bold text-[#171635]">Notification Method:</span>
                <span>{config.notificationMethod}</span>
              </div>
              <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-bold text-[#171635]">Claim Deadline:</span>
                <span>{config.claimDeadline}</span>
              </div>
              <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-bold text-[#171635]">Official Terms:</span>
                <span>{config.officialTerms}</span>
              </div>
              <div className="p-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-bold text-[#171635]">Secure Backend Endpoint:</span>
                <span className="font-mono text-[11px] text-red-700">None connected (Required before accepting real entries)</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
