'use strict';

const { Pool, types } = require('pg');
const config = require('../config');

// Keep DATE columns as 'YYYY-MM-DD' strings (avoids timezone shifts).
types.setTypeParser(1082, (v) => v);

const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.isProd ? { rejectUnauthorized: false } : false,
});

// Run fn inside a transaction; commits on success, rolls back on error.
async function withTx(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, withTx };
