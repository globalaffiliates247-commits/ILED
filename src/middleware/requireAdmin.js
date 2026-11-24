'use strict';

const config = require('../config');
const { verify } = require('../auth/session');

module.exports = function requireAdmin(req, res, next) {
  const session = verify(req.cookies && req.cookies.iled_session, config.sessionSecret);
  if (!session) return res.status(401).json({ error: 'unauthorized' });
  req.admin = session.u;
  return next();
};
