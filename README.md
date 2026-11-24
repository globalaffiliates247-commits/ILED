# ILED Staff Manager

Backend for managing ILED collaborators: admin API, virtual card and public QR page.
Spec: `ILED Staff Manager - BUILD_SPEC v0.1` in the TAIO ADCADEMY project.

## Run locally

    npm install
    DATABASE_URL=postgres://... ADMIN_USER=admin ADMIN_PIN=123456 SESSION_SECRET=change-me npm start

Tests (no database needed):

    npm test

## Environment

| Name | Purpose |
|---|---|
| DATABASE_URL | PostgreSQL connection string |
| ADMIN_USER, ADMIN_PIN | Super admin login (placeholders until the real values are set) |
| SESSION_SECRET | Signs session cookies |
| PUBLIC_BASE_URL | Base URL encoded in QR codes (added in M2) |
| EXPIRING_DAYS | Days before contract end to show "expiring" (default 60) |
| NODE_ENV | Set to `production` on Render |
