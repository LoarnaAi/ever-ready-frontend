-- Create job_sequences table for generating sequential job IDs per business
-- Each business has its own sequence counter

CREATE TABLE IF NOT EXISTS job_sequences (
    bus_ref     VARCHAR(4) PRIMARY KEY REFERENCES business_master(bus_ref),
    next_seq    INTEGER NOT NULL DEFAULT 1
);

COMMENT ON TABLE job_sequences IS 'Tracks next job sequence number for each business';
COMMENT ON COLUMN job_sequences.next_seq IS 'Next sequence number to be used (1-based)';

-- Initialize sequences for existing businesses
INSERT INTO job_sequences (bus_ref, next_seq)
SELECT bus_ref, 1 FROM business_master
ON CONFLICT (bus_ref) DO NOTHING;

-- Function to get next job ID for a business
-- Returns format: {BUS_REF}-{5-digit sequence} (e.g., "DEMO-00001")
CREATE OR REPLACE FUNCTION get_next_job_id(p_bus_ref VARCHAR(4))
RETURNS TEXT AS $$
DECLARE
    v_seq INTEGER;
BEGIN
    -- Insert new sequence starting at 2 (since we'll return 1)
    -- Or update existing sequence by incrementing
    INSERT INTO job_sequences (bus_ref, next_seq)
    VALUES (p_bus_ref, 2)
    ON CONFLICT (bus_ref)
    DO UPDATE SET next_seq = job_sequences.next_seq + 1
    RETURNING next_seq - 1 INTO v_seq;

    -- Return formatted job ID: BUS_REF-NNNNN
    RETURN p_bus_ref || '-' || LPAD(v_seq::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_next_job_id IS 'Generates next sequential job ID for a business (e.g., DEMO-00001)';
