'use strict';

const express = require('express');
const requireAdmin = require('../middleware/requireAdmin');
const svc = require('../services/members');
const { createSchema, updateSchema } = require('../validation/members');
const { isValidMemberId } = require('../domain/memberId');
const { toCsv } = require('../domain/csv');

const EXPORT_COLUMNS = ['id', 'title', 'fullName', 'position', 'field', 'startDate', 'endDate',
  'status', 'daysLeft', 'email', 'phone', 'archived', 'scanCount', 'attachmentUrl', 'notes'];

const router = express.Router();
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);
const invalidId = (res) => res.status(400).json({ error: 'invalid_id' });
const notFound = (res) => res.status(404).json({ error: 'not_found' });

router.use(requireAdmin);

router.get('/', wrap(async (req, res) => {
  res.json(await svc.listMembers({ tab: req.query.tab, q: req.query.q }));
}));

router.post('/', wrap(async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid', details: parsed.error.flatten() });
  return res.status(201).json(await svc.createMember(parsed.data));
}));

// CSV export (all members by default). Declared before /:id so 'export.csv' is not read as an ID.
router.get('/export.csv', wrap(async (req, res) => {
  const rows = await svc.listMembers({ tab: req.query.tab || 'all' });
  const today = new Date().toISOString().slice(0, 10);
  res.set({
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="iled-members-${today}.csv"`,
  });
  res.send(toCsv(rows, EXPORT_COLUMNS));
}));

router.get('/:id', wrap(async (req, res) => {
  if (!isValidMemberId(req.params.id)) return invalidId(res);
  const member = await svc.getMember(req.params.id);
  return member ? res.json(member) : notFound(res);
}));

router.patch('/:id', wrap(async (req, res) => {
  if (!isValidMemberId(req.params.id)) return invalidId(res);
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid', details: parsed.error.flatten() });
  const member = await svc.updateMember(req.params.id, parsed.data);
  return member ? res.json(member) : notFound(res);
}));

router.post('/:id/archive', wrap(async (req, res) => {
  if (!isValidMemberId(req.params.id)) return invalidId(res);
  const member = await svc.setArchived(req.params.id, true);
  return member ? res.json(member) : notFound(res);
}));

router.post('/:id/restore', wrap(async (req, res) => {
  if (!isValidMemberId(req.params.id)) return invalidId(res);
  const member = await svc.setArchived(req.params.id, false);
  return member ? res.json(member) : notFound(res);
}));

module.exports = router;
