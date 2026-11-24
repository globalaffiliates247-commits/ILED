'use strict';

// ILED ID format: ILED-YYYY-NNNN (sequence per start year).
const ID_PATTERN = /^ILED-(\d{4})-(\d{4})$/;

function formatMemberId(year, seq) {
  return `ILED-${year}-${String(seq).padStart(4, '0')}`;
}

function parseMemberId(id) {
  const m = ID_PATTERN.exec(id);
  return m ? { year: Number(m[1]), seq: Number(m[2]) } : null;
}

function isValidMemberId(id) {
  return ID_PATTERN.test(id);
}

module.exports = { formatMemberId, parseMemberId, isValidMemberId };
