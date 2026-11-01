/**
 * RepairRight Promotion & Giveaway Campaign Configuration
 *
 * Implements strict campaign configurations for:
 * 1. Spin-to-reveal-offer promotion
 * 2. Separate Giveaway section
 *
 * Strict policy:
 * - Do NOT invent prizes, discounts, coupon codes, odds, or deadlines.
 * - If verified promotion details and a secure prize-validation service are not configured,
 *   keep the wheel in preview mode and display: "Demo spin — no prize or coupon will be issued."
 * - Keep giveaway inactive until verified campaign details and a real entry-submission backend are configured,
 *   displaying: "No active giveaway yet."
 * - Provide a Preview entry flow that does not collect or submit real entries.
 */

export interface WheelSegment {
  id: string;
  label: string;
  description: string;
  color: string;
}

export interface WheelCampaignConfig {
  campaignName: string;
  isVerifiedConfigured: boolean;
  prizeValidationEndpoint: string | null;
  prizeList: WheelSegment[];
  eligibility: string;
  entryLimits: string;
  expiration: string;
  selectionRules: string;
  previewDisclaimer: string;
}

export interface GiveawayCampaignConfig {
  campaignName: string;
  isBackendConnected: boolean;
  isCampaignDetailsVerified: boolean;
  prize: string;
  eligibility: string;
  entryPeriod: {
    startDate: string;
    endDate: string;
  };
  entryLimits: string;
  winnerSelectionMethod: string;
  winnerSelectionDate: string;
  notificationMethod: string;
  claimDeadline: string;
  officialTerms: string;
  submissionEndpoint: string | null;
}

export interface GiveawayPreviewEntry {
  fullName: string;
  email: string;
  applianceInterest?: string;
  marketingConsent: boolean;
  isSimulatedPreview: true;
}

export interface SpinResult {
  segmentIndex: number;
  segment: WheelSegment;
  isDemo: boolean;
  displayMessage: string;
  couponCodeIssued: null; // Strictly null in preview mode
  prizeConfirmed: false;  // Strictly false without backend validation
}

/**
 * Standard configuration for Spin to reveal an offer.
 * Kept in preview mode until verified details and a prize validation endpoint are supplied.
 */
export const DEFAULT_WHEEL_CONFIG: WheelCampaignConfig = {
  campaignName: 'RepairRight Offer Wheel (Preview Mode)',
  isVerifiedConfigured: false, // Inactive / preview until site owner configures verified promotion
  prizeValidationEndpoint: null,
  prizeList: [
    {
      id: 'seg-1',
      label: 'Demo Slot A',
      description: 'Preview segment — awaiting verified campaign configuration.',
      color: '#70C8F4',
    },
    {
      id: 'seg-2',
      label: 'Demo Slot B',
      description: 'Preview segment — awaiting verified campaign configuration.',
      color: '#FFD331',
    },
    {
      id: 'seg-3',
      label: 'Demo Slot C',
      description: 'Preview segment — awaiting verified campaign configuration.',
      color: '#FF4D8D',
    },
    {
      id: 'seg-4',
      label: 'Demo Slot D',
      description: 'Preview segment — awaiting verified campaign configuration.',
      color: '#8B5CF6',
    },
    {
      id: 'seg-5',
      label: 'Demo Slot E',
      description: 'Preview segment — awaiting verified campaign configuration.',
      color: '#171635',
    },
    {
      id: 'seg-6',
      label: 'Demo Slot F',
      description: 'Preview segment — awaiting verified campaign configuration.',
      color: '#70C8F4',
    },
  ],
  eligibility: 'Unconfigured — Awaits site owner campaign terms and verified eligibility rules.',
  entryLimits: 'Demo spin preview: Unrestricted visual simulation. No real entries or prize claims.',
  expiration: 'Unconfigured — No promotional deadline established.',
  selectionRules: 'Server-side cryptographic prize validation required for active mode.',
  previewDisclaimer: 'Demo spin — no prize or coupon will be issued.',
};

/**
 * Standard configuration for the Giveaway section.
 * Kept inactive until verified campaign details and backend are configured.
 */
export const DEFAULT_GIVEAWAY_CONFIG: GiveawayCampaignConfig = {
  campaignName: 'Community Appliance Care Giveaway',
  isBackendConnected: false,
  isCampaignDetailsVerified: false,
  prize: 'Unconfigured — Awaiting official verified prize announcement by site owner.',
  eligibility: 'Unconfigured — Must be specified in official terms before activation.',
  entryPeriod: {
    startDate: 'Unannounced',
    endDate: 'Unannounced',
  },
  entryLimits: 'Unconfigured — Awaits verified entry policy (e.g. 1 per verified household).',
  winnerSelectionMethod: 'Audited random draw upon verified campaign activation.',
  winnerSelectionDate: 'Unannounced',
  notificationMethod: 'Direct email to winner (No automatic WhatsApp messaging).',
  claimDeadline: 'To be specified in official campaign terms.',
  officialTerms: 'Official rules, eligibility criteria, and claim verification procedures will be published here upon live campaign activation.',
  submissionEndpoint: null,
};

/**
 * Evaluates a wheel spin safely.
 * When in preview mode, it never issues a coupon or confirms a prize.
 */
export function evaluateSpin(
  config: WheelCampaignConfig,
  targetIndex?: number
): SpinResult {
  const segmentCount = config.prizeList.length;
  const index = typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex < segmentCount
    ? targetIndex
    : Math.floor(Math.random() * segmentCount);

  const segment = config.prizeList[index];

  // If not verified or no validation endpoint, ALWAYS return demo result
  if (!config.isVerifiedConfigured || !config.prizeValidationEndpoint) {
    return {
      segmentIndex: index,
      segment,
      isDemo: true,
      displayMessage: 'Demo spin — no prize or coupon will be issued.',
      couponCodeIssued: null,
      prizeConfirmed: false,
    };
  }

  // Live promotion logic would only execute if server confirmed it
  return {
    segmentIndex: index,
    segment,
    isDemo: true,
    displayMessage: 'Demo spin — no prize or coupon will be issued.',
    couponCodeIssued: null,
    prizeConfirmed: false,
  };
}

/**
 * Validates preview entry submission for giveaway.
 * Ensures strict separation of optional marketing consent and verifies simulated status.
 */
export function validatePreviewGiveawayEntry(entry: {
  fullName: string;
  email: string;
  applianceInterest?: string;
  marketingConsent: boolean;
}): { isValid: boolean; errors: string[]; simulatedEntry: GiveawayPreviewEntry | null } {
  const errors: string[] = [];

  if (!entry.fullName || entry.fullName.trim().length < 2) {
    errors.push('Please enter your full name for winner notification.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!entry.email || !emailRegex.test(entry.email.trim())) {
    errors.push('Please enter a valid email address.');
  }

  if (errors.length > 0) {
    return { isValid: false, errors, simulatedEntry: null };
  }

  return {
    isValid: true,
    errors: [],
    simulatedEntry: {
      fullName: entry.fullName.trim(),
      email: entry.email.trim().toLowerCase(),
      applianceInterest: entry.applianceInterest?.trim() || undefined,
      marketingConsent: Boolean(entry.marketingConsent),
      isSimulatedPreview: true,
    },
  };
}

/**
 * WhatsApp Contact configuration constants
 */
export const WHATSAPP_CONFIG = {
  phoneNumber: '919799495650',
  prefilledMessage: 'Hi RepairRight, I need help with an appliance or product.',
  get url() {
    return `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(this.prefilledMessage)}`;
  },
  disclaimer: 'Opens WhatsApp or WhatsApp Web with your inquiry pre-filled. You choose whether to send. Not an automated bot.',
};
