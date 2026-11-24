'use strict';

const express = require('express');
const config = require('../config');
const { pool } = require('../db/pool');
const repo = require('../repositories/members');
const svc = require('../services/members');
const { toPublicProfile } = require('../services/publicProfile');
const { publicUrl, renderQrSvg } = require('../services/qr');
const { verify } = require('../auth/session');
const { isValidMemberId } = require('../domain/memberId');
const pages = require('../views/pages');
const cards = require('../views/card');

const router = express.Router();
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);

const langOf = (req) => (req.query.lang === 'en' ? 'en' : 'vi');
const isAdmin = (req) => Boolean(verify(req.cookies && req.cookies.iled_session, config.sessionSecret));

async function loadProfile(id) {
  if (!isValidMemberId(id)) return null;
  const view = await svc.getMember(id);
  return view ? toPublicProfile(view) : null;
}

// Page a scanner sees. Counts a scan unless the request comes from a logged-in admin.
router.get('/c/:id', wrap(async (req, res) => {
  const lang = langOf(req);
  res.set('X-Robots-Tag', 'noindex, nofollow');
  const profile = await loadProfile(req.params.id);
  if (!profile) return res.status(404).type('html').send(pages.notFoundPage(lang, req.path));
  if (!isAdmin(req)) await repo.recordScan(pool, profile.id);
  const qr = await renderQrSvg(publicUrl(profile.id));
  return res.type('html').send(pages.publicPage(profile, qr, lang, req.path));
}));

// Phone virtual card.
router.get('/card/:id', wrap(async (req, res) => {
  const lang = langOf(req);
  res.set('X-Robots-Tag', 'noindex, nofollow');
  const profile = await loadProfile(req.params.id);
  if (!profile) return res.status(404).type('html').send(pages.notFoundPage(lang, req.path));
  const qr = await renderQrSvg(publicUrl(profile.id));
  return res.type('html').send(cards.cardPage(profile, qr, lang, req.path));
}));

// QR image of the public link (SVG).
router.get('/c/:id/qr.svg', wrap(async (req, res) => {
  const profile = await loadProfile(req.params.id);
  if (!profile) return res.status(404).json({ error: 'not_found' });
  const qr = await renderQrSvg(publicUrl(profile.id));
  res.set('Cache-Control', 'public, max-age=3600');
  return res.type('image/svg+xml').send(qr);
}));

module.exports = router;
