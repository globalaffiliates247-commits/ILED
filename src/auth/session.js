'use strict';

// Signed session token: base64url(payload) + '.' + HMAC-SHA256. No server-side session store.
const crypto = require('crypto');

const TTL_MS = 8 * 60 * 60 * 1000;

function sign(payload, secret) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function createSession(user, secret) {
  return sign({ u: user, exp: Date.now() + TTL_MS }, secret);
}

function verify(token, secret) {
  if (!token || !secret || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
  return payload.exp > Date.now() ? payload : null;
}

module.exports = { createSession, verify, TTL_MS };
