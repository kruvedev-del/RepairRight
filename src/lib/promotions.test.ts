import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_WHEEL_CONFIG,
  DEFAULT_GIVEAWAY_CONFIG,
  evaluateSpin,
  validatePreviewGiveawayEntry,
  WHATSAPP_CONFIG,
} from './promotions';

test('spin wheel defaults to preview mode without verified backend', () => {
  assert.equal(DEFAULT_WHEEL_CONFIG.isVerifiedConfigured, false);
  assert.equal(DEFAULT_WHEEL_CONFIG.prizeValidationEndpoint, null);
  assert.equal(DEFAULT_WHEEL_CONFIG.previewDisclaimer, 'Demo spin — no prize or coupon will be issued.');
});

test('spin evaluation never issues coupon or confirms prize in preview mode', () => {
  const spinResult = evaluateSpin(DEFAULT_WHEEL_CONFIG, 2);
  assert.equal(spinResult.isDemo, true);
  assert.equal(spinResult.couponCodeIssued, null, 'Must NEVER issue real coupon code in preview mode');
  assert.equal(spinResult.prizeConfirmed, false, 'Must NEVER confirm prize won without backend validation');
  assert.equal(spinResult.displayMessage, 'Demo spin — no prize or coupon will be issued.');
});

test('giveaway configuration is inactive until verified details and backend are connected', () => {
  assert.equal(DEFAULT_GIVEAWAY_CONFIG.isBackendConnected, false);
  assert.equal(DEFAULT_GIVEAWAY_CONFIG.isCampaignDetailsVerified, false);
  assert.match(DEFAULT_GIVEAWAY_CONFIG.prize, /unconfigured/i);
  assert.equal(DEFAULT_GIVEAWAY_CONFIG.submissionEndpoint, null);
});

test('giveaway preview entry validates required info and isolates marketing consent', () => {
  // Missing fields fail validation
  const invalid = validatePreviewGiveawayEntry({
    fullName: '',
    email: 'bad-email',
    marketingConsent: false,
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.length >= 2);

  // Valid preview submission
  const valid = validatePreviewGiveawayEntry({
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    applianceInterest: 'Washing Machine',
    marketingConsent: false,
  });
  assert.equal(valid.isValid, true);
  assert.equal(valid.simulatedEntry?.isSimulatedPreview, true);
  assert.equal(valid.simulatedEntry?.marketingConsent, false);

  // Optional marketing consent can be enabled independently
  const withConsent = validatePreviewGiveawayEntry({
    fullName: 'John Smith',
    email: 'john@example.com',
    marketingConsent: true,
  });
  assert.equal(withConsent.isValid, true);
  assert.equal(withConsent.simulatedEntry?.marketingConsent, true);
});

test('whatsapp configuration uses exact required URL and prefilled message', () => {
  assert.equal(WHATSAPP_CONFIG.phoneNumber, '919799495650');
  assert.equal(WHATSAPP_CONFIG.prefilledMessage, 'Hi RepairRight, I need help with an appliance or product.');
  assert.ok(WHATSAPP_CONFIG.url.startsWith('https://wa.me/919799495650'));
  assert.ok(WHATSAPP_CONFIG.url.includes('Hi%20RepairRight%2C%20I%20need%20help%20with%20an%20appliance%20or%20product.'));
});
