'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { cardPage, initials } = require('../../src/views/card');

const profile = {
  id: 'ILED-2026-0001', title: 'Mr.', fullName: 'Lê Minh Hoàng', position: 'Chuyên gia đào tạo và ứng dụng AI',
  startDate: '2026-06-01', endDate: '2027-05-31', collaborating: true, avatarUrl: null,
};
const qr = '<svg xmlns="http://www.w3.org/2000/svg"></svg>';

test('initials use first and last word', () => {
  assert.equal(initials('Lê Minh Hoàng'), 'LH');
  assert.equal(initials('Hiệp'), 'H');
  assert.equal(initials(''), '');
});

test('card shows both faces, QR and the institute address', () => {
  const html = cardPage(profile, qr, 'vi', '/card/ILED-2026-0001');
  assert.ok(html.includes('class="ec-face ec-front"'));
  assert.ok(html.includes('class="ec-face ec-back"'));
  assert.ok(html.includes('<svg xmlns'));
  assert.ok(html.includes('Vincom Center'));
  assert.ok(html.includes('Mặt sau'));
});

test('avatar is used when https, initials otherwise', () => {
  const withPhoto = cardPage({ ...profile, avatarUrl: 'https://img.example.com/a.jpg' }, qr, 'vi', '/card/x');
  assert.ok(withPhoto.includes('<img class="ec-avatar" src="https://img.example.com/a.jpg"'));
  const without = cardPage(profile, qr, 'vi', '/card/x');
  assert.ok(without.includes('ec-initials') && without.includes('>LH<'));
  const unsafe = cardPage({ ...profile, avatarUrl: 'javascript:alert(1)' }, qr, 'vi', '/card/x');
  assert.equal(unsafe.includes('javascript:'), false);
});

test('user-supplied text is escaped', () => {
  const html = cardPage({ ...profile, fullName: '<img src=x onerror=alert(1)>' }, qr, 'vi', '/card/x');
  assert.equal(html.includes('<img src=x'), false);
  assert.ok(html.includes('&lt;img src=x'));
});

test('card shows work email and phone as links, and never notes', () => {
  const html = cardPage({ ...profile, email: 'work@example.com', phone: '0900000000', notes: 'internal note' }, qr, 'vi', '/card/x');
  assert.ok(html.includes('href="mailto:work@example.com"'));
  assert.ok(html.includes('href="tel:0900000000"'));
  assert.equal(html.includes('internal note'), false);
});

test('card omits contact rows when the fields are empty', () => {
  const html = cardPage(profile, qr, 'vi', '/card/x');
  assert.equal(html.includes('mailto:'), false);
  assert.equal(html.includes('tel:'), false);
});

test('english version uses English labels', () => {
  const html = cardPage(profile, qr, 'en', '/card/x');
  assert.ok(html.includes('Back') && html.includes('SOCIALIST REPUBLIC OF VIETNAM'));
});
