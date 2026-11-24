'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { toPublicProfile } = require('../../src/services/publicProfile');

const view = {
  id: 'ILED-2026-0001', title: 'Mr.', fullName: 'Lê Minh Hoàng', position: 'Chuyên gia',
  startDate: '2026-06-01', endDate: '2027-05-31', status: 'active', archived: false,
  email: 'secret@example.com', phone: '0900000000', notes: 'internal', attachmentUrl: 'https://x',
  scanCount: 3, lastScannedAt: null,
};

test('public profile exposes only whitelisted fields', () => {
  const p = toPublicProfile(view);
  assert.deepEqual(Object.keys(p).sort(),
    ['avatarUrl', 'collaborating', 'email', 'endDate', 'fullName', 'id', 'phone', 'position', 'startDate', 'title']);
  assert.equal(JSON.stringify(p).includes('internal'), false);
  assert.equal(JSON.stringify(p).includes('https://x'), false);
  assert.equal(p.email, 'secret@example.com');
});

test('collaborating is false when ended or archived', () => {
  assert.equal(toPublicProfile({ ...view, status: 'ended' }).collaborating, false);
  assert.equal(toPublicProfile({ ...view, archived: true, status: 'archived' }).collaborating, false);
  assert.equal(toPublicProfile({ ...view, status: 'expiring' }).collaborating, true);
});
