'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { addContractEnd, computeStatus, daysBetween } = require('../../src/domain/contract');

test('contract end is start + 1 year - 1 day', () => {
  assert.equal(addContractEnd('2026-06-01'), '2027-05-31');
});

test('leap-day start ends the day before the anniversary', () => {
  assert.equal(addContractEnd('2028-02-29'), '2029-02-28');
});

test('unsupported contract type is rejected', () => {
  assert.throws(() => addContractEnd('2026-06-01', '2y'));
});

test('daysBetween counts whole days', () => {
  assert.equal(daysBetween('2027-03-31', '2027-05-31'), 61);
});

test('status boundaries: 61 days active, 60 days expiring, day after end ended', () => {
  const endDate = '2027-05-31';
  assert.equal(computeStatus({ archivedAt: null, endDate, today: '2027-03-31' }), 'active');
  assert.equal(computeStatus({ archivedAt: null, endDate, today: '2027-04-01' }), 'expiring');
  assert.equal(computeStatus({ archivedAt: null, endDate, today: '2027-05-31' }), 'expiring');
  assert.equal(computeStatus({ archivedAt: null, endDate, today: '2027-06-01' }), 'ended');
});

test('archived overrides every other status', () => {
  assert.equal(
    computeStatus({ archivedAt: '2026-11-24', endDate: '2027-05-31', today: '2026-11-24' }),
    'archived'
  );
});
