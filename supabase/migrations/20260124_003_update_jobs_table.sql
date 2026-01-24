-- Update jobs table with bus_ref and display_job_id columns
-- Adds trigger for auto-generating display_job_id on insert

-- Add new columns to jobs table
ALTER TABLE jobs
    ADD COLUMN IF NOT EXISTS bus_ref VARCHAR(4) REFERENCES business_master(bus_ref),
    ADD COLUMN IF NOT EXISTS display_job_id VARCHAR(15) UNIQUE;

-- Create index for filtering jobs by bus_ref
CREATE INDEX IF NOT EXISTS idx_jobs_bus_ref ON jobs(bus_ref);

-- Create index for display_job_id lookups
CREATE INDEX IF NOT EXISTS idx_jobs_display_job_id ON jobs(display_job_id);

COMMENT ON COLUMN jobs.bus_ref IS '4-char business reference code';
COMMENT ON COLUMN jobs.display_job_id IS 'Human-readable job ID (e.g., DEMO-00001)';

-- Trigger function to auto-generate display_job_id
CREATE OR REPLACE FUNCTION set_display_job_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.bus_ref IS NOT NULL AND NEW.display_job_id IS NULL THEN
        NEW.display_job_id := get_next_job_id(NEW.bus_ref);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger (drop first if exists to ensure clean state)
DROP TRIGGER IF EXISTS trigger_set_display_job_id ON jobs;
CREATE TRIGGER trigger_set_display_job_id
    BEFORE INSERT ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION set_display_job_id();

COMMENT ON FUNCTION set_display_job_id IS 'Trigger function to auto-generate display_job_id from bus_ref';
