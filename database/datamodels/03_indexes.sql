-- Performance indexes for common queries

-- ============================================================================
-- BUSINESS_MASTER INDEXES
-- ============================================================================
-- Index for bus_id lookups
create unique index business_master_bus_id_idx on business_master (bus_id);


-- ============================================================================
-- JOBS INDEXES
-- ============================================================================
-- Index for filtering/sorting jobs by status and creation date
create index jobs_status_created_at_idx on jobs (status, created_at desc);

-- Index for filtering jobs by user (if using Supabase Auth)
create index jobs_user_id_idx on jobs (user_id) where user_id is not null;

-- Index for filtering jobs by business (legacy)
create index jobs_business_id_idx on jobs (business_id) where business_id is not null;

-- Index for filtering jobs by bus_ref
create index jobs_bus_ref_idx on jobs (bus_ref) where bus_ref is not null;

-- Index for display_job_id lookups
create index jobs_display_job_id_idx on jobs (display_job_id) where display_job_id is not null;


-- ============================================================================
-- LEGACY BUSINESSES INDEXES
-- ============================================================================
-- Index for fast business slug lookups
create index businesses_slug_idx on businesses (slug);


-- ============================================================================
-- JOB_ADDRESSES INDEXES
-- ============================================================================
-- Index for searching by postcode (useful for distance calculations)
create index job_addresses_postcode_idx on job_addresses (postcode);


-- ============================================================================
-- JOB_DATES INDEXES
-- ============================================================================
-- Index for date-based queries
create index job_dates_service_at_idx on job_dates (service_at);


-- ============================================================================
-- GIN INDEXES ON EXTRAS JSONB COLUMNS
-- ============================================================================
-- GIN index on extras JSONB columns for flexible querying
create index jobs_extras_idx on jobs using gin (extras);
create index job_addresses_extras_idx on job_addresses using gin (extras);
create index job_dates_extras_idx on job_dates using gin (extras);
create index job_contact_details_extras_idx on job_contact_details using gin (extras);
create index job_furniture_items_extras_idx on job_furniture_items using gin (extras);
create index job_packing_materials_extras_idx on job_packing_materials using gin (extras);
create index job_cost_breakdowns_extras_idx on job_cost_breakdowns using gin (extras);
