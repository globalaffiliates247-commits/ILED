CREATE TABLE IF NOT EXISTS id_sequences (
  year        INTEGER PRIMARY KEY,
  last_value  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS members (
  id               TEXT PRIMARY KEY,
  title            TEXT,
  full_name        TEXT NOT NULL,
  position         TEXT,
  start_date       DATE NOT NULL,
  contract_type    TEXT NOT NULL DEFAULT '1y',
  end_date         DATE NOT NULL,
  field            TEXT CHECK (field IN ('law', 'edu')),
  email            TEXT,
  phone            TEXT,
  notes            TEXT,
  attachment_url   TEXT,
  attachment_name  TEXT,
  archived_at      TIMESTAMPTZ,
  scan_count       INTEGER NOT NULL DEFAULT 0,
  last_scanned_at  TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
