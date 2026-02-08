-- Create job_quote table for persisting auto-quote results
-- Links to jobs table via job_id

CREATE TABLE IF NOT EXISTS job_quote (
  quote_id SERIAL PRIMARY KEY,
  job_id UUID REFERENCES jobs(job_id) ON DELETE CASCADE,
  total_volume NUMERIC(8,3) NOT NULL,
  num_heavy_items INTEGER NOT NULL DEFAULT 0,
  customer_assistance BOOLEAN NOT NULL DEFAULT FALSE,
  num_rooms INTEGER NOT NULL DEFAULT 0,
  difficult_access BOOLEAN NOT NULL DEFAULT FALSE,
  distance_miles NUMERIC(8,2) NOT NULL DEFAULT 0,
  no_parking BOOLEAN NOT NULL DEFAULT FALSE,
  no_lift BOOLEAN NOT NULL DEFAULT FALSE,
  driving_minutes INTEGER NOT NULL DEFAULT 0,
  vehicle_type TEXT NOT NULL,
  crew_size INTEGER NOT NULL,
  reasoning TEXT NOT NULL,
  base_hours NUMERIC(4,1) NOT NULL,
  add_on_minutes INTEGER NOT NULL DEFAULT 0,
  total_hours NUMERIC(4,1) NOT NULL,
  time_notes TEXT[] NOT NULL DEFAULT '{}',
  zone TEXT NOT NULL,
  hourly_rate NUMERIC(8,2),
  rate_is_per_mover BOOLEAN NOT NULL DEFAULT FALSE,
  base_cost NUMERIC(8,2),
  extra_cost NUMERIC(8,2),
  total_cost NUMERIC(8,2) NOT NULL,
  pricing_notes TEXT[] NOT NULL DEFAULT '{}',
  price_per_mile NUMERIC(6,2),
  occupancy TEXT NOT NULL,
  volume_category TEXT NOT NULL,
  complexity_factor NUMERIC(4,2) NOT NULL DEFAULT 1.0,
  suitable_for_single_trip BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups by job
CREATE INDEX IF NOT EXISTS idx_job_quote_job_id ON job_quote(job_id);
