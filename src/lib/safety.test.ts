import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateSafetyAndGuidance, DEMO_CASE, HAZARD_OPTIONS } from './safety';

test('hazard detection immediately halts ordinary troubleshooting', () => {
  const result = evaluateSafetyAndGuidance({
    appliance: 'Washing machine',
    symptom: 'Smoke coming from back',
    hazardReported: true,
    hazardTypes: ['smoke', 'burning_smell'],
  });

  assert.equal(result.is_hazard, true);
  assert.equal(result.risk_level, 'critical_hazard');
  assert.equal(result.safe_checks.length, 0, 'Must provide ZERO DIY steps when hazard is present');
  assert.match(result.next_step, /keep.*away|contact.*qualified/i);
});

test('demo case returns required washing machine sample without diagnosis', () => {
  const result = evaluateSafetyAndGuidance(DEMO_CASE);

  assert.equal(result.is_hazard, false);
  assert.equal(result.mode, 'demo');
  assert.equal(result.safe_checks.length, 3, 'Must provide at most 3 safe checks');
  assert.match(result.disclaimer, /Illustrative demo—not a diagnosis/i);
  assert.match(result.uncertainty, /not enough to confirm/i);
  assert.equal(result.professional_help_needed, true);
});

test('safe checks never exceed 3 non-invasive items', () => {
  const result = evaluateSafetyAndGuidance({
    appliance: 'Washing machine',
    symptom: 'Loud spin noise',
    hazardReported: false,
  });

  assert.ok(result.safe_checks.length <= 3);
  result.safe_checks.forEach(check => {
    assert.doesNotMatch(check, /\bdisassemble\b|\bopen cabinet\b|\bunscrew\b|\bwiring\b|\bvoltage\b/i);
  });
});

test('hazard options list contains critical electrical and gas indicators', () => {
  const ids = HAZARD_OPTIONS.map(h => h.id);
  assert.ok(ids.includes('smoke'));
  assert.ok(ids.includes('burning_smell'));
  assert.ok(ids.includes('electric_shock'));
  assert.ok(ids.includes('gas_smell'));
});
