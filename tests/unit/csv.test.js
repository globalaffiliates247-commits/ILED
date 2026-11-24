'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { toCsv, cell } = require('../../src/domain/csv');

test('plain values are not quoted', () => {
  assert.equal(cell('Lê Minh Hoàng'), 'Lê Minh Hoàng');
});

test('values with commas, quotes or newlines are quoted and quotes doubled', () => {
  assert.equal(cell('a, b'), '"a, b"');
  assert.equal(cell('say "hi"'), '"say ""hi"""');
  assert.equal(cell('line1\nline2'), '"line1\nline2"');
});

test('formula-like values are neutralised', () => {
  assert.equal(cell('=HYPERLINK("x")'), '"\'=HYPERLINK(""x"")"');
  assert.equal(cell('+84 900'), '"\'+84 900"');
  assert.equal(cell('-1'), '"\'-1"');
  assert.equal(cell('@sum'), '"\'@sum"');
});

test('null and undefined become empty cells, booleans become text', () => {
  assert.equal(cell(null), '');
  assert.equal(cell(undefined), '');
  assert.equal(cell(false), 'false');
});

test('toCsv writes BOM, header, rows in column order', () => {
  const out = toCsv([{ id: 'ILED-2026-0001', fullName: 'Lê Minh Hoàng', archived: false }], ['id', 'fullName', 'archived']);
  assert.equal(out, '﻿id,fullName,archived\r\nILED-2026-0001,Lê Minh Hoàng,false\r\n');
});
