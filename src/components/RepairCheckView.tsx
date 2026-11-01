import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Download, 
  HelpCircle, 
  Mic, 
  Paperclip, 
  RotateCcw, 
  ShieldAlert, 
  Sparkles, 
  Volume2, 
  Wrench, 
  BookmarkPlus, 
  Check, 
  Info,
  Flame,
  Zap,
  Droplets,
  AlertOctagon
} from 'lucide-react';
import { 
  RepairCheckInput, 
  RepairCheckResult, 
  HAZARD_OPTIONS, 
  DEMO_CASE, 
  evaluateSafetyAndGuidance 
} from '../lib/safety';

interface RepairCheckViewProps {
  onSaveToAppliances: (summary: RepairCheckResult, applianceName: string, symptom: string) => void;
  onGoToShop: () => void;
  initialDemo?: boolean;
}

const APPLIANCES = [
  { id: 'washing_machine', name: 'Washing Machine', featured: true, icon: '🫧' },
  { id: 'refrigerator', name: 'Refrigerator', featured: false, icon: '❄️' },
  { id: 'dishwasher', name: 'Dishwasher', featured: false, icon: '🍽️' },
  { id: 'dryer', name: 'Clothes Dryer', featured: false, icon: '♨️' },
];

const WASHING_MACHINE_SYMPTOMS = [
  { id: 'unusual_noise', label: 'Unusual noise during a cycle (rattling, grinding, or squealing)', defaultChecked: true },
  { id: 'not_spinning', label: 'Not spinning or clothes remain soaking wet' },
  { id: 'not_draining', label: 'Not draining water / standing pool in tub' },
  { id: 'leaking', label: 'Water leaking onto the floor' },
  { id: 'error_code', label: 'Error code flashing on the control display' },
  { id: 'wont_start', label: 'Will not power on or won’t start cycle' },
  { id: 'other', label: 'Other issue (describe below)' },
];

export const RepairCheckView: React.FC<RepairCheckViewProps> = ({
  onSaveToAppliances,
  onGoToShop,
  initialDemo = false,
}) => {
  // Wizard steps: 1 = Appliance & Issue, 2 = Safety Check, 3 = Optional Media, 4 = Summary Result
  const [step, setStep] = useState<number>(initialDemo ? 4 : 1);
  const [isDemoCase, setIsDemoCase] = useState<boolean>(initialDemo);

  // Form states
  const [selectedAppliance, setSelectedAppliance] = useState<string>('Washing Machine');
  const [selectedSymptom, setSelectedSymptom] = useState<string>('Unusual noise during a cycle');
  const [symptomDetail, setSymptomDetail] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [model, setModel] = useState<string>('');

  // Step 2: Hazard checklist
  const [selectedHazards, setSelectedHazards] = useState<string[]>([]);
  const [noHazardsConfirmed, setNoHazardsConfirmed] = useState<boolean>(false);

  // Step 3: Media & Consent
  const [photoAttached, setPhotoAttached] = useState<boolean>(false);
  const [audioAttached, setAudioAttached] = useState<boolean>(false);
  const [audioFileName, setAudioFileName] = useState<string>('');
  const [consentGiven, setConsentGiven] = useState<boolean>(true);

  // Step 4: Result state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<RepairCheckResult | null>(() => {
    if (initialDemo) {
      return evaluateSafetyAndGuidance(DEMO_CASE);
    }
    return null;
  });
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Toggle hazard selection
  const handleToggleHazard = (id: string) => {
    setNoHazardsConfirmed(false);
    setSelectedHazards(prev => 
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const handleConfirmNoHazards = () => {
    setSelectedHazards([]);
    setNoHazardsConfirmed(true);
  };

  // Launch Demo Case
  const handleLoadDemo = () => {
    setIsDemoCase(true);
    setSelectedAppliance(DEMO_CASE.appliance);
    setSelectedSymptom(DEMO_CASE.symptom);
    setSymptomDetail(DEMO_CASE.symptomDescription || '');
    setBrand(DEMO_CASE.brand || '');
    setModel(DEMO_CASE.model || '');
    setSelectedHazards([]);
    setNoHazardsConfirmed(true);
    setAudioAttached(false);
    setPhotoAttached(false);

    setIsLoading(true);
    setTimeout(() => {
      setResult(evaluateSafetyAndGuidance(DEMO_CASE));
      setIsLoading(false);
      setStep(4);
    }, 300);
  };

  // Submit repair check evaluation
  const handleSubmitEvaluation = async () => {
    const input: RepairCheckInput = {
      appliance: selectedAppliance,
      symptom: selectedSymptom,
      symptomDescription: symptomDetail,
      brand: brand.trim(),
      model: model.trim(),
      hazardReported: selectedHazards.length > 0,
      hazardTypes: selectedHazards,
      hasMedia: photoAttached || audioAttached,
      audioAttached,
      consentGiven,
      isDemo: isDemoCase,
    };

    setIsLoading(true);
    try {
      const response = await fetch('/api/repair-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data: RepairCheckResult = await response.json();
      setResult(data);
    } catch (err) {
      console.warn('API error, evaluating locally via safe rules engine', err);
      // Clean fallback
      const localFallback = evaluateSafetyAndGuidance(input);
      setResult(localFallback);
    } finally {
      setIsLoading(false);
      setStep(4);
    }
  };

  // Reset wizard
  const handleRestart = () => {
    setStep(1);
    setIsDemoCase(false);
    setSelectedAppliance('Washing Machine');
    setSelectedSymptom('Unusual noise during a cycle');
    setSymptomDetail('');
    setBrand('');
    setModel('');
    setSelectedHazards([]);
    setNoHazardsConfirmed(false);
    setPhotoAttached(false);
    setAudioAttached(false);
    setAudioFileName('');
    setResult(null);
    setIsSaved(false);
  };

  // Copy shareable summary text to clipboard
  const handleCopySummary = () => {
    if (!result) return;
    const text = `REPAIRRIGHT SAFE STEP SUMMARY
Appliance: ${selectedAppliance}
Symptom: ${selectedSymptom}
Brand/Model: ${brand || 'Unknown'} / ${model || 'Unknown'}
Hazard status: ${result.is_hazard ? 'CRITICAL HAZARD DETECTED - NO DIY' : 'No immediate hazard reported'}

WHAT YOU REPORTED:
${result.summary}

SAFE EXTERNAL CHECKS:
${result.safe_checks.length > 0 ? result.safe_checks.map((c, i) => `${i + 1}. ${c}`).join('\n') : 'None (DIY stopped for safety)'}

WHAT WE CANNOT CONFIRM:
${result.uncertainty}

RECOMMENDED NEXT SAFE STEP:
${result.next_step}

Disclaimer: ${result.disclaimer}
Generated via RepairRight (Know your next safe step).`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Save to "My Appliances"
  const handleSave = () => {
    if (!result) return;
    onSaveToAppliances(result, selectedAppliance, selectedSymptom);
    setIsSaved(true);
  };

  return (
    <div className="pb-28 pt-2 px-4 max-w-3xl mx-auto space-y-6">
      {/* Wizard Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#171635]/10 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-[#171635]/70 mb-2">
          <span>Step {step} of 4: {
            step === 1 ? 'Appliance & Issue' :
            step === 2 ? 'Safety Check' :
            step === 3 ? 'Optional Media' : 'Safe Step Summary'
          }</span>
          <div className="flex items-center gap-2">
            {!isDemoCase && (
              <button
                onClick={handleLoadDemo}
                className="text-xs text-[#171635] font-semibold underline hover:text-[#70C8F4]"
              >
                Load demo washing machine
              </button>
            )}
            {isDemoCase && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#FFD331] text-[#171635] font-bold">
                Demo Mode
              </span>
            )}
          </div>
        </div>

        {/* 4-segment visual progress indicator */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'bg-[#171635]'
                  : s < step
                  ? 'bg-[#70C8F4]'
                  : 'bg-[#171635]/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ================= STEP 1: APPLIANCE & ISSUE ================= */}
      {step === 1 && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#171635]/10 shadow-sm space-y-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#70C8F4]">Step 1</div>
            <h2 className="text-2xl font-bold brand-font text-[#171635]">Select appliance and symptom</h2>
            <p className="text-sm text-[#171635]/70 mt-1">
              For this prototype, washing machines are featured. Choose your appliance and what you notice.
            </p>
          </div>

          {/* Appliance Selection Cards */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#171635] uppercase tracking-wider">
              Household Appliance
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {APPLIANCES.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => setSelectedAppliance(app.name)}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    selectedAppliance === app.name
                      ? 'border-[#171635] bg-[#171635] text-white shadow-md'
                      : 'border-[#171635]/15 bg-white text-[#171635] hover:border-[#171635]/30'
                  }`}
                >
                  <span className="text-2xl mb-1">{app.icon}</span>
                  <div>
                    <div className="text-xs font-bold leading-tight">{app.name}</div>
                    {app.featured && (
                      <span className={`text-[10px] font-semibold block mt-0.5 ${
                        selectedAppliance === app.name ? 'text-[#FFD331]' : 'text-[#70C8F4]'
                      }`}>
                        Featured
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Washing Machine Symptom Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#171635] uppercase tracking-wider">
              Primary Symptom
            </label>
            <div className="space-y-2">
              {WASHING_MACHINE_SYMPTOMS.map((sym) => (
                <label
                  key={sym.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                    selectedSymptom === sym.label
                      ? 'border-[#171635] bg-[#FCFCFF] ring-2 ring-[#171635]/10'
                      : 'border-[#171635]/15 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="symptom"
                    checked={selectedSymptom === sym.label}
                    onChange={() => setSelectedSymptom(sym.label)}
                    className="mt-0.5 text-[#171635] focus:ring-[#171635]"
                  />
                  <span className="text-sm font-medium text-[#171635] leading-snug">
                    {sym.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Optional Details */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#171635] flex items-center justify-between">
              <span>Additional description (Optional)</span>
              <span className="text-[11px] text-[#171635]/50 font-normal">e.g. happens during high-speed spin</span>
            </label>
            <textarea
              value={symptomDetail}
              onChange={(e) => setSymptomDetail(e.target.value)}
              placeholder="E.g., It makes a rhythmic banging or squealing sound during the spin cycle when it reaches top speed."
              className="w-full p-3 rounded-xl border border-[#171635]/20 focus:outline-none focus:ring-2 focus:ring-[#171635] text-sm"
              rows={2}
            />
          </div>

          {/* Optional Brand & Model */}
          <div className="bg-[#FCFCFF] p-4 rounded-2xl border border-[#171635]/10 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#171635]">
              <Info className="w-4 h-4 text-[#70C8F4]" />
              <span>Appliance Brand &amp; Model (Optional)</span>
            </div>
            <p className="text-xs text-[#171635]/70">
              Only enter if readily visible on your door frame or serial sticker. Leave blank if unknown.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#171635]/70 mb-1">Brand (optional)</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Whirlpool, Bosch, LG"
                  className="w-full p-2.5 rounded-lg border border-[#171635]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#171635]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#171635]/70 mb-1">Model (optional)</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. WTW5000DW"
                  className="w-full p-2.5 rounded-lg border border-[#171635]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#171635]"
                />
              </div>
            </div>
          </div>

          {/* Next Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-3.5 rounded-xl bg-[#171635] text-white font-bold text-sm hover:bg-[#171635]/90 transition flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Safety Check</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* ================= STEP 2: SAFETY CHECK ================= */}
      {step === 2 && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#171635]/10 shadow-sm space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFD331]/30 text-[#171635] flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-[#171635]" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#FFD331]">Critical step</div>
              <h2 className="text-2xl font-bold brand-font text-[#171635]">Safety Screening</h2>
              <p className="text-sm text-[#171635]/80 mt-1">
                Before proceeding with any checks, verify that your appliance does not present an immediate physical or electrical hazard.
              </p>
            </div>
          </div>

          {/* Hazard Selection List */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#171635] uppercase tracking-wider">
              Do any of the following apply to your appliance right now?
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {HAZARD_OPTIONS.map((hazard) => {
                const isChecked = selectedHazards.includes(hazard.id);
                return (
                  <button
                    key={hazard.id}
                    type="button"
                    onClick={() => handleToggleHazard(hazard.id)}
                    className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer ${
                      isChecked
                        ? 'border-[#FF4D8D] bg-[#FF4D8D]/10 text-[#171635] font-semibold'
                        : 'border-[#171635]/15 bg-white text-[#171635]/90 hover:border-[#171635]/30'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                      isChecked ? 'bg-[#FF4D8D] border-[#FF4D8D] text-white' : 'border-[#171635]/30'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs sm:text-sm">{hazard.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Clear No Hazards button */}
            <button
              type="button"
              onClick={handleConfirmNoHazards}
              className={`w-full p-3.5 rounded-xl border text-center font-bold text-sm transition cursor-pointer ${
                noHazardsConfirmed && selectedHazards.length === 0
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                  : 'border-[#171635]/15 bg-[#FCFCFF] text-[#171635] hover:bg-slate-50'
              }`}
            >
              ✓ None of these apply — No smoke, burning smell, or electrical hazards
            </button>
          </div>

          {/* IF HAZARD IS REPORTED: IMMEDIATE STOP DIRECTIVE */}
          {selectedHazards.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#FF4D8D]/15 border-2 border-[#FF4D8D] text-[#171635] space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-[#FF4D8D] font-extrabold text-base">
                <AlertOctagon className="w-6 h-6 shrink-0" />
                <span>STOP — IMMEDIATE HAZARD DETECTED</span>
              </div>
              <p className="text-sm font-semibold">
                Because you reported a hazard ({selectedHazards.join(', ')}), all ordinary troubleshooting has been stopped for your safety.
              </p>
              <ul className="text-xs space-y-1.5 list-disc list-inside text-[#171635]/90">
                <li><strong>Do NOT open or touch the appliance.</strong></li>
                <li><strong>Do NOT attempt to run further cycles or press buttons.</strong></li>
                <li>Keep away and ensure children and pets do not approach the unit.</li>
                <li>If safe to do so from your main breaker, disconnect power to the outlet.</li>
                <li>Contact a licensed emergency technician or local emergency service immediately.</li>
              </ul>
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleSubmitEvaluation}
                  className="px-4 py-2.5 rounded-xl bg-[#171635] text-white font-bold text-xs"
                >
                  Generate Safety Protocol Summary
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedHazards([])}
                  className="text-xs text-[#171635]/70 underline"
                >
                  Re-evaluate hazards
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-3 rounded-xl border border-[#171635]/20 text-[#171635] font-bold text-xs hover:bg-[#171635]/5 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {selectedHazards.length === 0 && (
              <button
                type="button"
                disabled={!noHazardsConfirmed}
                onClick={() => setStep(3)}
                className={`px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer transition ${
                  noHazardsConfirmed
                    ? 'bg-[#171635] text-white hover:bg-[#171635]/90'
                    : 'bg-[#171635]/20 text-[#171635]/50 cursor-not-allowed'
                }`}
              >
                <span>Continue to Optional Media</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>
      )}

      {/* ================= STEP 3: OPTIONAL MEDIA ================= */}
      {step === 3 && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#171635]/10 shadow-sm space-y-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#70C8F4]">Step 3</div>
            <h2 className="text-2xl font-bold brand-font text-[#171635]">Optional media for your technician</h2>
            <p className="text-sm text-[#171635]/80 mt-1">
              You can optionally attach a short audio clip or photo. This media is included in your shareable summary card so your repair pro can hear or inspect the problem.
            </p>
          </div>

          {/* Strict Audio analysis disclaimer as required by user prompt */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
              <Volume2 className="w-4 h-4 text-amber-800" />
              <span>For technician reference only</span>
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              Diagnostic performance is not validated. <strong>RepairRight never implies that automated software can diagnose a fault from sound alone.</strong> Audio clips serve solely to assist your qualified technician.
            </p>
          </div>

          {/* Media Attach Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Audio Attach Card */}
            <div className={`p-4 rounded-2xl border transition ${
              audioAttached ? 'border-[#171635] bg-[#70C8F4]/10' : 'border-[#171635]/15 bg-[#FCFCFF]'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#171635] flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-[#70C8F4]" />
                  <span>Audio recording</span>
                </span>
                {audioAttached && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#171635] text-white">
                    Attached
                  </span>
                )}
              </div>
              <p className="text-xs text-[#171635]/70 mb-3">
                Simulate or attach an audio clip of the cycle noise.
              </p>
              {!audioAttached ? (
                <button
                  type="button"
                  onClick={() => {
                    setAudioAttached(true);
                    setAudioFileName('washer_spin_noise_sample.m4a');
                  }}
                  className="w-full py-2.5 rounded-xl border border-[#171635]/20 bg-white hover:bg-slate-50 text-xs font-bold text-[#171635] cursor-pointer"
                >
                  + Attach sample audio clip
                </button>
              ) : (
                <div className="flex items-center justify-between text-xs text-[#171635] bg-white p-2 rounded-lg border border-[#171635]/10">
                  <span className="font-mono text-[11px] truncate">{audioFileName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAudioAttached(false);
                      setAudioFileName('');
                    }}
                    className="text-[#FF4D8D] font-bold ml-2 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Photo Attach Card */}
            <div className={`p-4 rounded-2xl border transition ${
              photoAttached ? 'border-[#171635] bg-[#70C8F4]/10' : 'border-[#171635]/15 bg-[#FCFCFF]'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#171635] flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-[#70C8F4]" />
                  <span>Appliance photo</span>
                </span>
                {photoAttached && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#171635] text-white">
                    Attached
                  </span>
                )}
              </div>
              <p className="text-xs text-[#171635]/70 mb-3">
                Attach a picture of the model sticker or drum seal.
              </p>
              {!photoAttached ? (
                <button
                  type="button"
                  onClick={() => setPhotoAttached(true)}
                  className="w-full py-2.5 rounded-xl border border-[#171635]/20 bg-white hover:bg-slate-50 text-xs font-bold text-[#171635] cursor-pointer"
                >
                  + Attach appliance photo
                </button>
              ) : (
                <div className="flex items-center justify-between text-xs text-[#171635] bg-white p-2 rounded-lg border border-[#171635]/10">
                  <span className="text-[11px] font-medium">washer_front_seal.jpg</span>
                  <button
                    type="button"
                    onClick={() => setPhotoAttached(false)}
                    className="text-[#FF4D8D] font-bold ml-2 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Explicit User Consent for AI Analysis */}
          <div className="p-4 rounded-2xl bg-[#FCFCFF] border border-[#171635]/10 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-0.5 text-[#171635] focus:ring-[#171635]"
              />
              <span className="text-xs text-[#171635]/90 leading-snug">
                I agree to submit my reported symptoms and media metadata to produce cautious, structured safe steps. User inputs are not silently recorded or sold.
              </span>
            </label>
          </div>

          {/* Navigation */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-3 rounded-xl border border-[#171635]/20 text-[#171635] font-bold text-xs hover:bg-[#171635]/5 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              disabled={isLoading || !consentGiven}
              onClick={handleSubmitEvaluation}
              className={`px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer transition ${
                consentGiven && !isLoading
                  ? 'bg-[#171635] text-white hover:bg-[#171635]/90'
                  : 'bg-[#171635]/20 text-[#171635]/50 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Organizing safe checks...</span>
                </>
              ) : (
                <>
                  <span>Generate Safe Summary</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </section>
      )}

      {/* ================= STEP 4: REPAIR SUMMARY ================= */}
      {step === 4 && result && (
        <section className="space-y-6">
          {/* Top Banner & Mode indicator */}
          <div className="bg-white rounded-3xl p-6 border border-[#171635]/10 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#171635]/10">
              <div>
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-1.5 ${
                  result.is_hazard 
                    ? 'bg-[#FF4D8D] text-white' 
                    : isDemoCase 
                    ? 'bg-[#FFD331] text-[#171635]' 
                    : 'bg-[#70C8F4]/20 text-[#171635]'
                }`}>
                  {result.is_hazard ? 'Immediate Hazard Protocol' : isDemoCase ? 'Illustrative Demo — Not a diagnosis' : 'Safe Step Summary'}
                </span>
                <h2 className="text-2xl font-bold brand-font text-[#171635]">
                  {result.is_hazard ? 'Safety Intervention Required' : 'Your Appliance Guidance'}
                </h2>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-3.5 py-1.5 rounded-xl border border-[#171635]/20 hover:bg-[#171635]/5 text-xs font-bold text-[#171635] flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start over</span>
                </button>
              </div>
            </div>

            {/* Structured 5 sections mandated by user brief */}
            <div className="space-y-5">
              {/* 1. WHAT YOU TOLD US */}
              <div className="bg-[#FCFCFF] p-4 rounded-2xl border border-[#171635]/10 space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#171635]/70 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#70C8F4]" />
                  <span>What you told us</span>
                </h3>
                <p className="text-sm font-medium text-[#171635] leading-relaxed">
                  {result.summary}
                </p>
                {audioAttached && (
                  <div className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md inline-block font-medium">
                    Audio recording attached: <strong>For technician reference only.</strong>
                  </div>
                )}
              </div>

              {/* 2. WHAT WE CAN SAFELY SUGGEST */}
              {!result.is_hazard ? (
                <div className="bg-white p-4 rounded-2xl border border-[#171635]/10 space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#171635]/70 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-[#171635]" />
                      <span>What we can safely suggest (Non-invasive safe checks)</span>
                    </span>
                    <span className="text-[10px] text-[#171635]/60 font-semibold lowercase">
                      {result.safe_checks.length} checks maximum
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {result.safe_checks.map((check, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#FCFCFF] border border-[#171635]/5">
                        <div className="w-6 h-6 rounded-full bg-[#FFD331]/30 text-[#171635] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-xs sm:text-sm text-[#171635] leading-relaxed font-normal">
                          {check}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#171635]/60 italic pt-1">
                    Rule: Never open appliance cabinets, touch wiring, or bypass latches. Always unplug before checking the drum.
                  </p>
                </div>
              ) : (
                <div className="bg-[#FF4D8D]/10 p-4 rounded-2xl border border-[#FF4D8D]/30 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF4D8D]">
                    Safe checks: Suspended
                  </h3>
                  <p className="text-xs text-[#171635]">
                    No DIY checks or instructions are provided because an active hazard was identified.
                  </p>
                </div>
              )}

              {/* 3. WHAT WE CAN'T CONFIRM */}
              <div className="bg-[#FCFCFF] p-4 rounded-2xl border border-[#171635]/10 space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#171635]/70 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>What we can’t confirm</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#171635]/80 leading-relaxed">
                  {result.uncertainty}
                </p>
              </div>

              {/* 4. RECOMMENDED NEXT STEP */}
              <div className="bg-[#171635] text-white p-5 rounded-2xl space-y-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FFD331]"></div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFD331]">
                    Recommended next step
                  </h3>
                </div>
                <p className="text-sm font-semibold leading-relaxed">
                  {result.next_step}
                </p>
                {result.professional_help_needed && (
                  <p className="text-xs text-[#FCFCFF]/80 pt-1 border-t border-white/10">
                    * Technician assistance recommended: RepairRight is not a substitute for hands-on certified electrical diagnostics.
                  </p>
                )}
              </div>

              {/* 5. SHARE THIS SUMMARY */}
              <div className="p-4 rounded-2xl bg-[#70C8F4]/10 border border-[#70C8F4]/30 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#171635] flex items-center gap-1.5">
                  <Copy className="w-3.5 h-3.5 text-[#171635]" />
                  <span>Share this summary with your repair professional</span>
                </h3>
                <p className="text-xs text-[#171635]/80">
                  Show this card to your local technician so they understand exactly what you observed and what external checks you verified.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="px-4 py-2.5 rounded-xl bg-[#171635] hover:bg-[#171635]/90 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#FFD331]" />
                        <span>Summary copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy summary text</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={isSaved}
                    onClick={handleSave}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      isSaved
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-[#171635]/20 bg-white text-[#171635] hover:bg-slate-50'
                    }`}
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>{isSaved ? 'Saved to My Appliances' : 'Save to My Appliances'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onGoToShop}
                    className="px-4 py-2.5 rounded-xl bg-[#FFD331] hover:bg-[#ffe066] text-[#171635] font-extrabold text-xs transition cursor-pointer ml-auto"
                  >
                    Explore anti-vibration pads &rarr;
                  </button>
                </div>
              </div>

              {/* Disclaimer footer */}
              <div className="text-[11px] text-[#171635]/50 leading-relaxed text-center">
                {result.disclaimer}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
