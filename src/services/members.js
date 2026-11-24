'use strict';

const config = require('../config');
const { pool, withTx } = require('../db/pool');
const repo = require('../repositories/members');
const { addContractEnd, computeStatus, daysBetween, todayVN } = require('../domain/contract');
const { formatMemberId } = require('../domain/memberId');

// API camelCase -> database column names. Undefined keys are ignored; '' becomes null.
const API_TO_DB = {
  title: 'title', fullName: 'full_name', position: 'position', startDate: 'start_date',
  contractType: 'contract_type', field: 'field', email: 'email', phone: 'phone', notes: 'notes',
};

function toDb(input) {
  const out = {};
  for (const [k, v] of Object.entries(input)) {
    if (v === undefined || !API_TO_DB[k]) continue;
    out[API_TO_DB[k]] = v === '' ? null : v;
  }
  return out;
}

// Row -> API view. Status and days left are computed here, not stored.
function toView(row, today = todayVN(), expiringDays = config.expiringDays) {
  const status = computeStatus({ archivedAt: row.archived_at, endDate: row.end_date, today, expiringDays });
  return {
    id: row.id,
    title: row.title,
    fullName: row.full_name,
    position: row.position,
    startDate: row.start_date,
    endDate: row.end_date,
    contractType: row.contract_type,
    field: row.field,
    email: row.email,
    phone: row.phone,
    notes: row.notes,
    attachmentUrl: row.attachment_url,
    attachmentName: row.attachment_name,
    archived: Boolean(row.archived_at),
    status,
    daysLeft: daysBetween(today, row.end_date),
    scanCount: row.scan_count,
    lastScannedAt: row.last_scanned_at,
  };
}

async function listMembers({ tab = 'current', q = '' } = {}) {
  const today = todayVN();
  let items = (await repo.listAll(pool)).map((r) => toView(r, today));
  if (tab === 'archived') {
    items = items.filter((m) => m.archived);
  } else if (tab === 'attention') {
    items = items.filter((m) => !m.archived && (m.status === 'expiring' || m.status === 'ended'));
  } else {
    items = items.filter((m) => !m.archived);
  }
  const needle = String(q).trim().toLowerCase();
  if (needle) {
    items = items.filter((m) =>
      [m.id, m.fullName, m.position, m.title].filter(Boolean).join(' ').toLowerCase().includes(needle));
  }
  return items;
}

async function getMember(id) {
  const row = await repo.findById(pool, id);
  return row ? toView(row) : null;
}

async function createMember(input) {
  const data = toDb(input);
  const contractType = data.contract_type || '1y';
  const row = await withTx(async (db) => {
    const year = Number(data.start_date.slice(0, 4));
    const seq = await repo.nextSeq(db, year);
    return repo.insert(db, {
      id: formatMemberId(year, seq),
      title: data.title ?? null,
      full_name: data.full_name,
      position: data.position ?? null,
      start_date: data.start_date,
      contract_type: contractType,
      end_date: addContractEnd(data.start_date, contractType),
      field: data.field ?? null,
      email: data.email ?? null,
      phone: data.phone ?? null,
      notes: data.notes ?? null,
    });
  });
  return toView(row);
}

async function updateMember(id, input) {
  const patch = toDb(input);
  delete patch.contract_type; // only 1y for now
  const existing = await repo.findById(pool, id);
  if (!existing) return null;
  if (patch.start_date) {
    patch.end_date = addContractEnd(patch.start_date, existing.contract_type);
  }
  const row = await repo.update(pool, id, patch);
  return row ? toView(row) : null;
}

async function setArchived(id, archived) {
  const row = await repo.setArchived(pool, id, archived);
  return row ? toView(row) : null;
}

module.exports = { listMembers, getMember, createMember, updateMember, setArchived, toView };
