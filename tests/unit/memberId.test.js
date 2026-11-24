'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { formatMemberId, parseMemberId, isValidMemberId } = require('../../src/domain/memberId');

test('formats ILED IDs with 4-digit sequence', () => {
  assert.equal(formatMemberId(2026, 1), 'ILED-2026-0001');
  assert.equal(formatMemberId(2026, 1234), 'ILED-2026-1234');
});

test('parses and validates IDs', () => {
  assert.deepEqual(parseMemberId('ILED-2026-0012'), { year: 2026, seq: 12 });
  assert.equal(parseMemberId('ILED-26-1'), null);
  assert.equal(isValidMemberId('ILED-2026-0001'), true);
  assert.equal(isValidMemberId('../etc'), false);
});
