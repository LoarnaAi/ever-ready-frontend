-- Multi-tenant support migration
-- Adds businesses table and business_id column to jobs

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);

-- Add business_id column to jobs table (nullable for backwards compatibility)
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id);

-- Create index for filtering jobs by business
CREATE INDEX IF NOT EXISTS idx_jobs_business_id ON jobs(business_id);

-- Insert demo business for development/testing
INSERT INTO businesses (id, slug, name, config, is_active)
VALUES (
  'demo-0000-0000-0000-000000000000'::uuid,
  'demo',
  'Demo Removals',
  '{
    "theme": {
      "primary": "#f97316",
      "primaryHover": "#ea580c",
      "primaryLight": "#fff7ed",
      "primaryBorder": "#fdba74",
      "brandText": "#9333ea",
      "primaryRing": "#fed7aa"
    },
    "features": {
      "showTrustpilot": true,
      "showNewsletterCheckbox": true,
      "showPoweredBy": true
    }
  }',
  true
)
ON CONFLICT (slug) DO NOTHING;
