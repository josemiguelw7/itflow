-- ITFlow — Multi-tenancy migration
-- Run this in Supabase → SQL Editor BEFORE building the UI

-- ── Organizations table ───────────────────────────────────────────────────

CREATE TABLE organizations (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  is_demo     BOOLEAN NOT NULL DEFAULT false,
  logo_url    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Add org_id to every table ─────────────────────────────────────────────

ALTER TABLE locations     ADD COLUMN org_id TEXT REFERENCES organizations(id);
ALTER TABLE users         ADD COLUMN org_id TEXT REFERENCES organizations(id);
ALTER TABLE items         ADD COLUMN org_id TEXT REFERENCES organizations(id);
ALTER TABLE assets        ADD COLUMN org_id TEXT REFERENCES organizations(id);
ALTER TABLE stock_balances ADD COLUMN org_id TEXT REFERENCES organizations(id);
ALTER TABLE requests      ADD COLUMN org_id TEXT REFERENCES organizations(id);
ALTER TABLE shipments     ADD COLUMN org_id TEXT REFERENCES organizations(id);
ALTER TABLE audit_logs    ADD COLUMN org_id TEXT REFERENCES organizations(id);

-- ── Indexes for fast org-scoped queries ───────────────────────────────────

CREATE INDEX idx_locations_org      ON locations(org_id);
CREATE INDEX idx_users_org          ON users(org_id);
CREATE INDEX idx_items_org          ON items(org_id);
CREATE INDEX idx_assets_org         ON assets(org_id);
CREATE INDEX idx_stock_org          ON stock_balances(org_id);
CREATE INDEX idx_requests_org       ON requests(org_id);
CREATE INDEX idx_shipments_org      ON shipments(org_id);
CREATE INDEX idx_audit_org          ON audit_logs(org_id);

-- ── Seed two orgs ─────────────────────────────────────────────────────────

INSERT INTO organizations (id, name, slug, is_demo) VALUES
  ('org_demo', 'Demo Environment', 'demo', true),
  ('org_prod', 'Production',       'prod', false);

-- ── Assign all existing seed data to Demo org ────────────────────────────

UPDATE locations      SET org_id = 'org_demo';
UPDATE users          SET org_id = 'org_demo';
UPDATE items          SET org_id = 'org_demo';
UPDATE assets         SET org_id = 'org_demo';
UPDATE stock_balances SET org_id = 'org_demo';

-- ── Add org_id to users table for org membership ─────────────────────────

ALTER TABLE users ADD COLUMN current_org_id TEXT REFERENCES organizations(id);
ALTER TABLE users ADD COLUMN org_ids TEXT[] DEFAULT '{}';
ALTER TABLE users ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN tour_steps_seen TEXT[] DEFAULT '{}';

UPDATE users SET current_org_id = 'org_demo', org_ids = ARRAY['org_demo', 'org_prod'];
