'use strict';

// All runtime settings come from environment variables. Nothing secret is stored in code.
const num = (v, fallback) => (v === undefined || v === '' ? fallback : Number(v));
const port = num(process.env.PORT, 3000);

module.exports = {
  port,
  databaseUrl: process.env.DATABASE_URL,
  adminUser: process.env.ADMIN_USER,
  adminPin: process.env.ADMIN_PIN,
  sessionSecret: process.env.SESSION_SECRET,
  publicBaseUrl: process.env.PUBLIC_BASE_URL || `http://localhost:${port}`,
  expiringDays: num(process.env.EXPIRING_DAYS, 60),
  isProd: process.env.NODE_ENV === 'production',
};
