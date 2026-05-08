-- ITFlow — Full Schema
-- Paste this into Supabase → SQL Editor → Run

-- ── Enums ────────────────────────────────────

CREATE TYPE "UserRole" AS ENUM ('TECHNICIAN', 'SITE_MANAGER', 'REGIONAL_MANAGER', 'ADMIN');
CREATE TYPE "ItemType" AS ENUM ('SERIALIZED', 'QUANTITY');
CREATE TYPE "AssetStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'IN_TRANSIT', 'PENDING_WIPE', 'READY', 'DAMAGED', 'ASSIGNED_OUT_OF_IT', 'RETIRED');
CREATE TYPE "AssetCondition" AS ENUM ('NEW', 'GOOD', 'FAIR', 'POOR');
CREATE TYPE "RequestStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'RESERVED', 'SHIPPED', 'RECEIVED', 'CANCELLED', 'COMPLETED');
CREATE TYPE "RequestPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');
CREATE TYPE "ApprovalDecision" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "ShipmentStatus" AS ENUM ('PREPARING', 'SHIPPED', 'IN_TRANSIT', 'EXCEPTION', 'DELIVERED', 'RECEIVED');

-- ── Tables ───────────────────────────────────

CREATE TABLE locations (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name        TEXT NOT NULL,
  code        TEXT NOT NULL UNIQUE,
  address     TEXT,
  timezone    TEXT NOT NULL DEFAULT 'America/Chicago',
  active      BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "oktaId"     TEXT NOT NULL UNIQUE,
  email        TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  role         "UserRole" NOT NULL DEFAULT 'TECHNICIAN',
  "locationId" TEXT NOT NULL REFERENCES locations(id),
  active       BOOLEAN NOT NULL DEFAULT true,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE items (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name        TEXT NOT NULL,
  description TEXT,
  category    TEXT NOT NULL,
  type        "ItemType" NOT NULL,
  make        TEXT,
  model       TEXT,
  "imageUrl"  TEXT,
  active      BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE assets (
  id             TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "assetTag"     TEXT NOT NULL UNIQUE,
  "serialNumber" TEXT NOT NULL UNIQUE,
  "itemId"       TEXT NOT NULL REFERENCES items(id),
  "locationId"   TEXT NOT NULL REFERENCES locations(id),
  status         "AssetStatus" NOT NULL DEFAULT 'AVAILABLE',
  condition      "AssetCondition" NOT NULL DEFAULT 'GOOD',
  notes          TEXT,
  "purchasedAt"  TIMESTAMPTZ,
  "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE stock_balances (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "itemId"     TEXT NOT NULL REFERENCES items(id),
  "locationId" TEXT NOT NULL REFERENCES locations(id),
  total        INT NOT NULL DEFAULT 0,
  available    INT NOT NULL DEFAULT 0,
  reserved     INT NOT NULL DEFAULT 0,
  "inTransit"  INT NOT NULL DEFAULT 0,
  "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE ("itemId", "locationId")
);

CREATE TABLE requests (
  id                      TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "requesterId"           TEXT NOT NULL REFERENCES users(id),
  "sourceLocationId"      TEXT REFERENCES locations(id),
  "destinationLocationId" TEXT NOT NULL REFERENCES locations(id),
  status                  "RequestStatus" NOT NULL DEFAULT 'SUBMITTED',
  priority                "RequestPriority" NOT NULL DEFAULT 'NORMAL',
  "neededByDate"          TIMESTAMPTZ,
  "jiraIssueKey"          TEXT,
  notes                   TEXT,
  "createdAt"             TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE request_lines (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "requestId" TEXT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  "itemId"    TEXT NOT NULL REFERENCES items(id),
  "assetId"   TEXT REFERENCES assets(id),
  quantity    INT NOT NULL DEFAULT 1
);

CREATE TABLE approvals (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "requestId"  TEXT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  "approverId" TEXT NOT NULL REFERENCES users(id),
  decision     "ApprovalDecision" NOT NULL DEFAULT 'PENDING',
  notes        TEXT,
  "decidedAt"  TIMESTAMPTZ,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE shipments (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "requestId"       TEXT REFERENCES requests(id),
  "originId"        TEXT NOT NULL REFERENCES locations(id),
  "destinationId"   TEXT NOT NULL REFERENCES locations(id),
  status            "ShipmentStatus" NOT NULL DEFAULT 'PREPARING',
  carrier           TEXT,
  "trackingNumber"  TEXT,
  "shippedAt"       TIMESTAMPTZ,
  "estimatedArrival" TIMESTAMPTZ,
  "receivedAt"      TIMESTAMPTZ,
  "receiverNotes"   TEXT,
  "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId"     TEXT,
  action       TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId"   TEXT NOT NULL,
  before       JSONB,
  after        JSONB,
  meta         JSONB,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Indexes ──────────────────────────────────

CREATE INDEX idx_audit_entity ON audit_logs ("entityType", "entityId");
CREATE INDEX idx_audit_user   ON audit_logs ("userId");
CREATE INDEX idx_audit_time   ON audit_logs ("createdAt");

-- ── Seed Data ────────────────────────────────

INSERT INTO locations (id, name, code, address, timezone) VALUES
  ('loc_atx', 'Austin HQ',  'ATX', '1234 Congress Ave, Austin TX 78701',         'America/Chicago'),
  ('loc_chi', 'Chicago',    'CHI', '111 W Wacker Dr, Chicago IL 60601',           'America/Chicago'),
  ('loc_sea', 'Seattle',    'SEA', '400 Broad St, Seattle WA 98109',              'America/Los_Angeles'),
  ('loc_den', 'Denver',     'DEN', '1700 Lincoln St, Denver CO 80203',            'America/Denver'),
  ('loc_nyc', 'New York',   'NYC', '1 World Trade Center, New York NY 10007',     'America/New_York'),
  ('loc_mia', 'Miami',      'MIA', '200 S Biscayne Blvd, Miami FL 33131',         'America/New_York'),
  ('loc_bos', 'Boston',     'BOS', '100 Federal St, Boston MA 02110',             'America/New_York'),
  ('loc_sfo', 'San Francisco', 'SFO', '1 Market St, San Francisco CA 94105',      'America/Los_Angeles');

INSERT INTO items (id, name, description, category, type, make, model) VALUES
  ('item_mbp14',      'MacBook Pro 14"',      'M3 Pro, 18GB RAM, 512GB SSD',    'Laptop',    'SERIALIZED', 'Apple', 'MacBook Pro 14" M3 Pro'),
  ('item_dell5540',   'Dell Latitude 5540',   'i7, 16GB RAM, 256GB SSD',        'Laptop',    'SERIALIZED', 'Dell',  'Latitude 5540'),
  ('item_iphone15pro','iPhone 15 Pro',        '256GB, Unlocked',                'Phone',     'SERIALIZED', 'Apple', 'iPhone 15 Pro'),
  ('item_magickb',    'Apple Magic Keyboard', 'Touch ID, US English',           'Accessory', 'QUANTITY',   'Apple', 'Magic Keyboard'),
  ('item_usbc96w',    'USB-C Charger 96W',    'USB-C Power Adapter',            'Accessory', 'QUANTITY',   'Apple', '96W USB-C');

INSERT INTO assets ("assetTag", "serialNumber", "itemId", "locationId", status, condition) VALUES
  ('ATX-MBP-001', 'C02XK1ABMD6N',  'item_mbp14',       'loc_atx', 'AVAILABLE',    'GOOD'),
  ('ATX-MBP-002', 'C02XK1ABMD7N',  'item_mbp14',       'loc_atx', 'AVAILABLE',    'NEW'),
  ('CHI-DELL-001', 'DLAT5540CHI01', 'item_dell5540',    'loc_chi', 'AVAILABLE',    'GOOD'),
  ('ATX-IPH-001', 'F2LXK9ABCDEF',  'item_iphone15pro', 'loc_atx', 'PENDING_WIPE', 'GOOD'),
  ('DEN-MBP-001', 'C02XK1ABDEN1',  'item_mbp14',       'loc_den', 'RESERVED',     'FAIR');

INSERT INTO stock_balances ("itemId", "locationId", total, available, reserved, "inTransit") VALUES
  ('item_magickb', 'loc_atx', 42, 34, 4, 4),
  ('item_usbc96w', 'loc_atx', 28, 20, 6, 2),
  ('item_magickb', 'loc_chi', 15, 12, 3, 0),
  ('item_usbc96w', 'loc_den',  4,  2, 2, 0);
