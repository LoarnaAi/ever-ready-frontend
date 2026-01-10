-- ============================================================================
-- JOBS TABLE (Root entity)
-- ============================================================================
create table jobs (
  job_id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending',

  -- Step 1: Home size selection
  home_size text not null,
  
  -- Step 3: Packing services
  packing_service text not null default '',
  dismantle_package boolean not null default false,

  -- Business/admin fields
  internal_notes text not null default '',

  -- Optional: link to authenticated user (if using Supabase Auth)
  user_id uuid null references auth.users(id),

  -- Schema versioning and flexible future fields
  schema_version int not null default 1,
  extras jsonb not null default '{}'::jsonb
);

comment on table jobs is 'Root table for home removal job bookings';
comment on column jobs.home_size is 'Selected home size: 1-bedroom, 2-bedrooms, 3-bedrooms, 4-bedrooms';
comment on column jobs.packing_service is 'Selected packing service option (e.g., all-inclusive)';
comment on column jobs.extras is 'JSONB field for future form fields without schema migration';


-- ============================================================================
-- JOB_ADDRESSES TABLE (Collection and delivery addresses)
-- ============================================================================
create table job_addresses (
  job_id uuid not null references jobs(job_id) on delete cascade,
  address_type text not null,

  postcode text not null,
  address text not null,
  floor text not null,
  has_parking boolean not null default false,
  has_lift boolean not null default false,
  has_additional_address boolean not null default false,

  extras jsonb not null default '{}'::jsonb,

  primary key (job_id, address_type)
);

comment on table job_addresses is 'Collection and delivery addresses for each job';
comment on column job_addresses.floor is 'Floor level: ground, 1-5, or 6+';


-- ============================================================================
-- JOB_DATES TABLE (Collection and materials delivery dates)
-- ============================================================================
create table job_dates (
  job_id uuid not null references jobs(job_id) on delete cascade,
  date_type text not null,

  service_at timestamptz not null,
  time_slot text not null,
  interval_type text null,

  extras jsonb not null default '{}'::jsonb,

  primary key (job_id, date_type)
);

comment on table job_dates is 'Scheduled dates for collection and materials delivery';
comment on column job_dates.service_at is 'Date and time of the scheduled service';
comment on column job_dates.time_slot is 'Time slot string (e.g., "9:00 - 15:00")';
comment on column job_dates.interval_type is 'Interval type: 6hours or 2hours';


-- ============================================================================
-- JOB_CONTACT_DETAILS TABLE (Customer contact information)
-- ============================================================================
create table job_contact_details (
  job_id uuid primary key references jobs(job_id) on delete cascade,

  first_name text not null,
  last_name text not null,
  email citext not null,
  country_code text not null,
  phone text not null,

  has_promo_code boolean not null default false,
  promo_code text null,

  sign_up_for_news boolean not null default false,
  agree_to_terms boolean not null default false,

  extras jsonb not null default '{}'::jsonb
);

comment on table job_contact_details is 'Customer contact information for each job';
comment on column job_contact_details.email is 'Customer email';

create index job_contact_details_email_idx on job_contact_details (email);


-- ============================================================================
-- JOB_FURNITURE_ITEMS TABLE (Current and initial furniture lists)
-- ============================================================================
create table job_furniture_items (
  job_id uuid not null references jobs(job_id) on delete cascade,
  list_type text not null,

  item_id text not null,
  name text not null,
  quantity int not null check (quantity >= 0),
  category text null,

  extras jsonb not null default '{}'::jsonb,

  primary key (job_id, list_type, item_id)
);

comment on table job_furniture_items is 'Furniture items for each job (current and initial baseline)';
comment on column job_furniture_items.list_type is 'Either "current" (final selection) or "initial" (prepopulated baseline)';


-- ============================================================================
-- JOB_PACKING_MATERIALS TABLE (Packing materials ordered)
-- ============================================================================
create table job_packing_materials (
  job_id uuid not null references jobs(job_id) on delete cascade,

  material_id text not null,
  name text not null,
  quantity int not null check (quantity >= 0),

  extras jsonb not null default '{}'::jsonb,

  primary key (job_id, material_id)
);

comment on table job_packing_materials is 'Packing materials ordered for each job';


-- ============================================================================
-- JOB_COST_BREAKDOWNS TABLE (Cost calculation snapshot)
-- ============================================================================
create table job_cost_breakdowns (
  job_id uuid primary key references jobs(job_id) on delete cascade,

  base_price numeric(10,2) not null,
  furniture_charge numeric(10,2) not null,
  packing_materials_charge numeric(10,2) not null,
  distance_surcharge numeric(10,2) not null,
  floor_surcharge numeric(10,2) not null,
  total numeric(10,2) not null,

  calculated_at timestamptz not null default now(),
  extras jsonb not null default '{}'::jsonb
);

comment on table job_cost_breakdowns is 'Cost breakdown snapshot for each job';
comment on column job_cost_breakdowns.calculated_at is 'Timestamp when cost was calculated';
