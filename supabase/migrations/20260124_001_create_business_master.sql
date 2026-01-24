-- Create business_master table for storing business/tenant information
-- This table uses bus_ref (4-char code) as primary key instead of UUID

CREATE TABLE IF NOT EXISTS business_master (
    bus_ref         VARCHAR(4) PRIMARY KEY,
    bus_id          VARCHAR(12) UNIQUE NOT NULL,
    bus_name        TEXT NOT NULL,
    bus_email       TEXT NULL,
    admins          TEXT[] NULL,
    house_number    TEXT NOT NULL,
    building_name   TEXT NULL,
    street_name     TEXT NOT NULL,
    city            TEXT NOT NULL,
    postcode        TEXT NOT NULL,
    lat             FLOAT NOT NULL,
    lon             FLOAT NOT NULL,
    dt              DATE NOT NULL DEFAULT CURRENT_DATE,
    dtts            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for bus_id lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_business_master_bus_id ON business_master(bus_id);

COMMENT ON TABLE business_master IS 'Master table for business/tenant information';
COMMENT ON COLUMN business_master.bus_ref IS 'Primary key - 4-char business reference code (e.g., DEMO, LNDN)';
COMMENT ON COLUMN business_master.bus_id IS 'Extended business identifier (up to 12 chars)';
COMMENT ON COLUMN business_master.bus_name IS 'Display name for the business';
COMMENT ON COLUMN business_master.bus_email IS 'Contact email for the business';
COMMENT ON COLUMN business_master.admins IS 'Array of admin user identifiers';

-- Seed initial businesses
INSERT INTO business_master (bus_ref, bus_id, bus_name, bus_email, house_number, street_name, city, postcode, lat, lon)
VALUES
    ('DEMO', 'DEMO-000001', 'Demo Removals', 'demo@example.com', '1', 'Demo Street', 'London', 'E1 1AA', 51.5074, -0.1278),
    ('LNDN', 'LNDN-000001', 'London Movers', 'info@london-movers.example.com', '10', 'Moving Lane', 'London', 'SW1A 1AA', 51.5014, -0.1419)
ON CONFLICT (bus_ref) DO NOTHING;

-- select * from business_master;