'use strict';

const config = require('./config');
const app = require('./app');
const { migrate } = require('./db/migrate');

const REQUIRED = ['databaseUrl', 'adminUser', 'adminPin', 'sessionSecret'];

(async () => {
  for (const key of REQUIRED) {
    if (!config[key]) throw new Error(`Missing required config: ${key}`);
  }
  await migrate();
  app.listen(config.port, () => console.log(`ILED staff manager listening on :${config.port}`));
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
