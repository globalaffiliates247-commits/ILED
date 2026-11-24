'use strict';

const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const membersRouter = require('./routes/members.api');
const publicRouter = require('./routes/public');
const path = require('path');

const app = express();
app.set('trust proxy', 1); // Render sits behind a proxy
app.use(helmet());
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

app.get('/healthz', (req, res) => res.json({ ok: true }));
app.use('/admin', express.static(path.join(__dirname, 'public', 'admin'), { index: 'index.html', maxAge: 0 }));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets'), { maxAge: '1d' }));
app.use(publicRouter);
app.use('/api/auth', authRouter);
app.use('/api/members', membersRouter);

app.use((req, res) => res.status(404).json({ error: 'not_found' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('error:', err.code || err.message);
  res.status(500).json({ error: 'server_error' });
});

module.exports = app;
