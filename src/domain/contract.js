'use strict';

// Contract rules: pure functions, no I/O. Dates are 'YYYY-MM-DD' strings.

const DEFAULT_EXPIRING_DAYS = 60;
const pad = (n) => String(n).padStart(2, '0');

function toISO(d) {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

function parseISO(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) throw new Error(`Invalid date: ${s}`);
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  if (toISO(d) !== s) throw new Error(`Invalid date: ${s}`);
  return d;
}

// Contract end = start + 1 year - 1 day (e.g. 2026-06-01 -> 2027-05-31).
function addContractEnd(startISO, contractType = '1y') {
  if (contractType !== '1y') throw new Error(`Unsupported contract type: ${contractType}`);
  const d = parseISO(startISO);
  d.setUTCFullYear(d.getUTCFullYear() + 1);
  d.setUTCDate(d.getUTCDate() - 1);
  return toISO(d);
}

// Whole days from `fromISO` to `toISOStr` (positive when the target is later).
function daysBetween(fromISO, toISOStr) {
  return Math.round((parseISO(toISOStr) - parseISO(fromISO)) / 86400000);
}

// Status is computed on read, never stored.
function computeStatus({ archivedAt, endDate, today, expiringDays = DEFAULT_EXPIRING_DAYS }) {
  if (archivedAt) return 'archived';
  const left = daysBetween(today, endDate);
  if (left < 0) return 'ended';
  if (left <= expiringDays) return 'expiring';
  return 'active';
}

// Today's date in Vietnam time, as 'YYYY-MM-DD'.
function todayVN(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
}

module.exports = { addContractEnd, daysBetween, computeStatus, todayVN, toISO, parseISO };
