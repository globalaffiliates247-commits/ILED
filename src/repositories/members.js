'use strict';

// SQL only. Callers pass either the pool or a transaction client as `db`.
const UPDATABLE = ['title', 'full_name', 'position', 'start_date', 'end_date', 'field', 'email', 'phone', 'notes', 'attachment_url', 'attachment_name'];

async function nextSeq(db, year) {
  const { rows } = await db.query(
    `INSERT INTO id_sequences (year, last_value) VALUES ($1, 1)
     ON CONFLICT (year) DO UPDATE SET last_value = id_sequences.last_value + 1
     RETURNING last_value`,
    [year]
  );
  return rows[0].last_value;
}

async function insert(db, r) {
  const { rows } = await db.query(
    `INSERT INTO members (id, title, full_name, position, start_date, contract_type, end_date, field, email, phone, notes, attachment_url, attachment_name)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING *`,
    [r.id, r.title, r.full_name, r.position, r.start_date, r.contract_type, r.end_date,
      r.field, r.email, r.phone, r.notes, r.attachment_url, r.attachment_name]
  );
  return rows[0];
}

async function findById(db, id) {
  const { rows } = await db.query('SELECT * FROM members WHERE id = $1', [id]);
  return rows[0] || null;
}

async function listAll(db) {
  const { rows } = await db.query('SELECT * FROM members ORDER BY full_name');
  return rows;
}

async function update(db, id, fields) {
  const keys = Object.keys(fields).filter((k) => UPDATABLE.includes(k));
  if (keys.length === 0) return findById(db, id);
  const sets = keys.map((k, i) => `${k} = $${i + 2}`);
  const values = keys.map((k) => fields[k]);
  const { rows } = await db.query(
    `UPDATE members SET ${sets.join(', ')}, updated_at = now() WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
  return rows[0] || null;
}

async function setArchived(db, id, archived) {
  const { rows } = await db.query(
    `UPDATE members
        SET archived_at = CASE WHEN $2::boolean THEN now() ELSE NULL END, updated_at = now()
      WHERE id = $1
      RETURNING *`,
    [id, archived]
  );
  return rows[0] || null;
}

async function recordScan(db, id) {
  await db.query(
    'UPDATE members SET scan_count = scan_count + 1, last_scanned_at = now() WHERE id = $1',
    [id]
  );
}

module.exports = { nextSeq, insert, findById, listAll, update, setArchived, recordScan };
