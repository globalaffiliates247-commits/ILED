'use strict';

const crypto = require('crypto');
const express = require('express');
const rateLimit = require('express-rate-limit');
const config = require('../config');
const { createSession, TTL_MS } = require('../auth/session');

const router = express.Router();

// Only failed attempts count: 5 wrong tries per IP per 15 minutes.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'too_many_attempts' },
});

// Compare hashes so the comparison time does not depend on input length.
const digest = (s) => crypto.createHash('sha256').update(String(s)).digest();
const same = (a, b) => crypto.timingSafeEqual(digest(a), digest(b));

router.post('/login', loginLimiter, (req, res) => {
  const { username = '', pin = '' } = req.body || {};
  const ok = same(username, config.adminUser) && same(pin, config.adminPin);
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' });
  const token = createSession(config.adminUser, config.sessionSecret);
  res.cookie('iled_session', token, {
    httpOnly: true,
    secure: config.isProd,
    sameSite: 'lax',
    maxAge: TTL_MS,
  });
  return res.json({ ok: true });
});

router.post('/logout', (req, res) => {
  res.clearCookie('iled_session');
  res.json({ ok: true });
});

module.exports = router;
