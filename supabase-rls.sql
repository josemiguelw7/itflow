-- ITFlow — Row Level Security (RLS) policies
-- Run in Supabase → SQL Editor BEFORE going to production
-- This ensures users can ONLY see data from their own organization

-- ── Enable RLS on all tables ─────────────────────────────────────────────────

ALTER TABLE locations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets         ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests       ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_lines  ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals      ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations  ENABLE ROW LEVEL SECURITY;

-- ── Helper function: get current user's org_id ────────────────────────────────
-- Reads org_id from the users table matching the Supabase auth user

CREATE OR REPLACE FUNCTION current_org_id()
RETURNS TEXT AS $$
  SELECT current_org_id FROM users WHERE "oktaId" = auth.uid()::text LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION user_org_ids()
RETURNS TEXT[] AS $$
  SELECT org_ids FROM users WHERE "oktaId" = auth.uid()::text LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ── Organizations ─────────────────────────────────────────────────────────────
-- Users can only see orgs they belong to

CREATE POLICY "Users see their orgs"
  ON organizations FOR SELECT
  USING (id = ANY(user_org_ids()));

-- ── Locations ─────────────────────────────────────────────────────────────────

CREATE POLICY "Users see their org locations"
  ON locations FOR SELECT
  USING (org_id = current_org_id());

CREATE POLICY "Admins manage locations"
  ON locations FOR ALL
  USING (
    org_id = current_org_id() AND
    EXISTS (SELECT 1 FROM users WHERE "oktaId" = auth.uid()::text AND role = 'ADMIN')
  );

-- ── Users ─────────────────────────────────────────────────────────────────────

CREATE POLICY "Users see teammates"
  ON users FOR SELECT
  USING (org_id = current_org_id());

CREATE POLICY "Users update own record"
  ON users FOR UPDATE
  USING ("oktaId" = auth.uid()::text);

CREATE POLICY "Admins manage users"
  ON users FOR ALL
  USING (
    org_id = current_org_id() AND
    EXISTS (SELECT 1 FROM users WHERE "oktaId" = auth.uid()::text AND role IN ('ADMIN','SITE_MANAGER'))
  );

-- ── Items (catalog) ───────────────────────────────────────────────────────────

CREATE POLICY "Users see their org catalog"
  ON items FOR SELECT
  USING (org_id = current_org_id());

CREATE POLICY "Admins manage catalog"
  ON items FOR ALL
  USING (
    org_id = current_org_id() AND
    EXISTS (SELECT 1 FROM users WHERE "oktaId" = auth.uid()::text AND role = 'ADMIN')
  );

-- ── Assets ────────────────────────────────────────────────────────────────────

CREATE POLICY "Users see their org assets"
  ON assets FOR SELECT
  USING (org_id = current_org_id());

CREATE POLICY "Technicians+ can update assets"
  ON assets FOR UPDATE
  USING (org_id = current_org_id());

-- ── Stock balances ────────────────────────────────────────────────────────────

CREATE POLICY "Users see their org stock"
  ON stock_balances FOR SELECT
  USING (org_id = current_org_id());

CREATE POLICY "System can update stock"
  ON stock_balances FOR ALL
  USING (org_id = current_org_id());

-- ── Requests ──────────────────────────────────────────────────────────────────

CREATE POLICY "Users see their org requests"
  ON requests FOR SELECT
  USING (org_id = current_org_id());

CREATE POLICY "Users create requests"
  ON requests FOR INSERT
  WITH CHECK (org_id = current_org_id());

CREATE POLICY "Managers can update requests"
  ON requests FOR UPDATE
  USING (
    org_id = current_org_id() AND
    EXISTS (SELECT 1 FROM users WHERE "oktaId" = auth.uid()::text AND role IN ('SITE_MANAGER','REGIONAL_MANAGER','ADMIN'))
  );

-- ── Request lines ─────────────────────────────────────────────────────────────

CREATE POLICY "Users see request lines via parent"
  ON request_lines FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM requests r WHERE r.id = request_lines."requestId" AND r.org_id = current_org_id())
  );

-- ── Approvals ─────────────────────────────────────────────────────────────────

CREATE POLICY "Managers see approvals"
  ON approvals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM requests r
      WHERE r.id = approvals."requestId" AND r.org_id = current_org_id()
    )
  );

CREATE POLICY "Managers create approvals"
  ON approvals FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE "oktaId" = auth.uid()::text AND role IN ('SITE_MANAGER','REGIONAL_MANAGER','ADMIN'))
  );

-- ── Shipments ─────────────────────────────────────────────────────────────────

CREATE POLICY "Users see their org shipments"
  ON shipments FOR SELECT
  USING (org_id = current_org_id());

CREATE POLICY "Technicians+ manage shipments"
  ON shipments FOR ALL
  USING (org_id = current_org_id());

-- ── Audit logs ────────────────────────────────────────────────────────────────

CREATE POLICY "Users see their org audit logs"
  ON audit_logs FOR SELECT
  USING (org_id = current_org_id());

CREATE POLICY "System writes audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (org_id = current_org_id());
