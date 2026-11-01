export interface RepairCheckInput {
  appliance: string;
  symptom: string;
  symptomDescription?: string;
  brand?: string;
  model?: string;
  hazardReported: boolean;
  hazardTypes?: string[];
  hasMedia?: boolean;
  audioAttached?: boolean;
  consentGiven?: boolean;
  isDemo?: boolean;
}

export interface RepairCheckResult {
  is_hazard: boolean;
  summary: string;
  safe_checks: string[];
  uncertainty: string;
  risk_level: 'critical_hazard' | 'medium' | 'low';
  next_step: string;
  professional_help_needed: boolean;
  disclaimer: string;
  mode: 'ai_assisted' | 'rules_engine' | 'demo';
  timestamp: string;
}

export const HAZARD_OPTIONS = [
  { id: 'smoke', label: 'Smoke or scorch marks' },
  { id: 'burning_smell', label: 'Burning smell or plastic odor' },
  { id: 'electric_shock', label: 'Electric shock or tingling touch' },
  { id: 'exposed_wiring', label: 'Exposed wiring or sparking' },
  { id: 'gas_smell', label: 'Gas smell or hissed pressure' },
  { id: 'major_water_leak', label: 'Water leaking near electric outlets/cords' },
];

export const DEMO_CASE: RepairCheckInput = {
  appliance: 'Washing machine',
  symptom: 'Unusual noise during a cycle',
  symptomDescription: 'Rhythmic thumping and squeaking sound during the spin phase.',
  brand: '',
  model: '',
  hazardReported: false,
  hazardTypes: [],
  hasMedia: false,
  audioAttached: false,
  consentGiven: true,
  isDemo: true,
};

export function evaluateSafetyAndGuidance(input: RepairCheckInput): RepairCheckResult {
  const timestamp = new Date().toISOString();

  // HAZARD CHECK FIRST
  if (input.hazardReported || (input.hazardTypes && input.hazardTypes.length > 0)) {
    const hazardList = input.hazardTypes && input.hazardTypes.length > 0 
      ? input.hazardTypes.join(', ')
      : 'reported immediate hazard';
    
    return {
      is_hazard: true,
      summary: `Immediate hazard reported (${hazardList}). All ordinary troubleshooting has been stopped for your personal safety.`,
      safe_checks: [], // STRICT: Provide NO repair instructions
      uncertainty: 'Do not attempt to test, diagnose, or troubleshoot this appliance.',
      risk_level: 'critical_hazard',
      next_step: 'Do NOT touch or open the appliance. If safe to do so from a distance or main breaker, cut power. Immediately keep all occupants away and contact a qualified licensed technician or your local emergency service.',
      professional_help_needed: true,
      disclaimer: 'CRITICAL SAFETY DIRECTIVE: When electrical, fire, gas, or severe hazard signs are present, DIY inspection is dangerous.',
      mode: input.isDemo ? 'demo' : 'rules_engine',
      timestamp,
    };
  }

  // DEMO CASE
  if (input.isDemo) {
    return {
      is_hazard: false,
      summary: 'You reported an unusual noise from your washing machine during a cycle. Brand and model were not specified, and no audio recording was provided.',
      safe_checks: [
        'Check leveling: Gently push opposing top corners of the washer while stationary. If it rocks, adjust the threaded rubber feet until completely stable on a solid floor.',
        'Check drum seal gap: With power OFF and drum empty, slowly spin the inner stainless drum by hand to check for trapped coins, hairpins, or bra underwires caught in the front rubber door bellows.',
        'Verify load balance: Overloading or washing a single bulky water-absorbing item (like a heavy bath mat) causes uneven centrifugal force and loud thumping.'
      ],
      uncertainty: 'This information is not enough to confirm a specific mechanical or electrical fault. Noise can stem from innocent load imbalances or deeper issues like tub bearings, shock absorbers, or pump impeller debris.',
      risk_level: 'low',
      next_step: 'Perform the 3 safe checks above with the unit stationary and powered off. If the sound continues or you are unsure, share this summary with a qualified technician before running further wash loads.',
      professional_help_needed: true,
      disclaimer: 'Illustrative demo—not a diagnosis. RepairRight never provides invasive internal repair steps.',
      mode: 'demo',
      timestamp,
    };
  }

  // STANDARD WASHING MACHINE & APPLIANCE SAFE GUIDANCE
  const brandText = input.brand ? `Brand: ${input.brand}. ` : 'Brand: unverified. ';
  const modelText = input.model ? `Model: ${input.model}. ` : '';
  const mediaNote = input.audioAttached 
    ? 'Audio was attached (labeled for technician reference only; sound alone is not diagnostic).' 
    : 'No audio attached.';

  const safeChecks: string[] = [];

  const symLower = (input.symptom + ' ' + (input.symptomDescription || '')).toLowerCase();

  if (symLower.includes('noise') || symLower.includes('sound') || symLower.includes('vibrat')) {
    safeChecks.push('Leveling check: Verify all 4 leveling feet rest firmly on the ground with locknuts tightened.');
    safeChecks.push('Drum foreign object check: Spin empty drum gently by hand with machine unplugged to listen for coins or underwires in the rubber seal lip.');
    safeChecks.push('Load inspection: Ensure wash loads are distributed evenly; do not wash a single heavy towel alone.');
  } else if (symLower.includes('drain') || symLower.includes('water') || symLower.includes('pump')) {
    safeChecks.push('Check external drain hose: Inspect the rear discharge hose for external kinks, tight bends, or crushing against the wall.');
    safeChecks.push('Inspect accessible coin trap filter: If your model has a front lower clean-out door, place a shallow tray and check for hair/coins per owner manual.');
    safeChecks.push('Verify household standpipe: Ensure the standpipe drain is not clogged or sealed airtight preventing siphon relief.');
  } else if (symLower.includes('start') || symLower.includes('power')) {
    safeChecks.push('External outlet check: Test the wall receptacle with a known working lamp to confirm the circuit breaker has not tripped.');
    safeChecks.push('Door latch engagement: Ensure the door or lid clicks firmly into the mechanical interlock; wipe any lint off the catch.');
    safeChecks.push('Child lock indicator: Check the display panel to verify Child Lock / Control Lock has not been inadvertently engaged.');
  } else {
    safeChecks.push('Power cycle reset: Safely unplug the appliance or switch its wall socket off for 5 minutes, then reconnect.');
    safeChecks.push('Visual clearance check: Verify nothing is pressing against external hoses, cords, or cabinet panels.');
    safeChecks.push('Leveling & balance check: Ensure the unit is on a firm, flat surface and not rocking.');
  }

  // Ensure maximum of 3 safe checks
  const trimmedChecks = safeChecks.slice(0, 3);

  return {
    is_hazard: false,
    summary: `Appliance: ${input.appliance}. Symptom reported: "${input.symptom}". ${brandText}${modelText}${mediaNote}`,
    safe_checks: trimmedChecks,
    uncertainty: 'We cannot confirm internal component faults without hands-on testing by a certified technician. Do not dismantle the appliance cabinet or probe electrical components.',
    risk_level: 'low',
    next_step: 'Carry out only the safe external checks listed above. If the condition persists, do not run further cycles and share this organized summary with your repair professional.',
    professional_help_needed: true,
    disclaimer: 'Know your next safe step: RepairRight organizes your reported details to assist dialogue with qualified professionals. Never open appliances or contact high-voltage wiring.',
    mode: 'rules_engine',
    timestamp,
  };
}
