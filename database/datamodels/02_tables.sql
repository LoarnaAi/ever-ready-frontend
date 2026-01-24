-- ============================================================================
-- BUSINESSES TABLE (Legacy - kept for backward compatibility)
-- ============================================================================
create table businesses (
  id uuid primary key default gen_random_uuid(),
  slug varchar(100) unique not null,
  name varchar(255) not null,
  config jsonb not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table businesses is 'Legacy tenant businesses table (use business_master for new implementations)';
comment on column businesses.slug is 'Unique business slug used in URLs and lookups';
comment on column businesses.config is 'Business configuration JSON (theme, feature flags, etc.)';

-- Insert demo business for development/testing
insert into businesses (id, slug, name, config, is_active)
values (
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
on conflict (slug) do nothing;


-- ============================================================================
-- BUSINESS_MASTER TABLE (New primary business/tenant table)
-- ============================================================================
create table business_master (
  bus_ref         varchar(4) primary key,
  bus_id          varchar(12) unique not null,
  bus_name        text not null,
  bus_email       text null,
  admins          text[] null,
  house_number    text not null,
  building_name   text null,
  street_name     text not null,
  city            text not null,
  postcode        text not null,
  lat             float not null,
  lon             float not null,
  dt              date not null default current_date,
  dtts            timestamp with time zone not null default now()
);

comment on table business_master is 'Master table for business/tenant information';
comment on column business_master.bus_ref is 'Primary key - 4-char business reference code (e.g., DEMO, LNDN)';
comment on column business_master.bus_id is 'Extended business identifier (up to 12 chars)';
comment on column business_master.bus_name is 'Display name for the business';
comment on column business_master.bus_email is 'Contact email for the business';
comment on column business_master.admins is 'Array of admin user identifiers';

-- Seed initial businesses
insert into business_master (bus_ref, bus_id, bus_name, bus_email, house_number, street_name, city, postcode, lat, lon)
values
  ('DEMO', 'DEMO-000001', 'Demo Removals', 'demo@example.com', '1', 'Demo Street', 'London', 'E1 1AA', 51.5074, -0.1278),
  ('LNDN', 'LNDN-000001', 'London Movers', 'info@london-movers.example.com', '10', 'Moving Lane', 'London', 'SW1A 1AA', 51.5014, -0.1419)
on conflict (bus_ref) do nothing;

-- Seed initial businesses
insert into business_master (bus_ref, bus_id, bus_name, bus_email, admins, house_number, street_name, city, postcode, lat, lon)
values
  ('LIMO', 'LIMO-000001', 'Lions Moves Van', 'Removals@lionsmoves.co.uk',Array['447936432077'], '1', 'Limo Street', 'London', 'E1 1AA', 51.5074, -0.1278),
  ('LNDN', 'LNDN-000001', 'London Movers', 'info@london-movers.example.com',Array['447936432077'], '10', 'Moving Lane', 'London', 'SW1A 1AA', 51.5014, -0.1419)
on conflict (bus_ref) do nothing;

-- ============================================================================
-- JOB_SEQUENCES TABLE (Sequential job ID generation per business)
-- ============================================================================
create table job_sequences (
  bus_ref     varchar(4) primary key references business_master(bus_ref),
  next_seq    integer not null default 1
);

comment on table job_sequences is 'Tracks next job sequence number for each business';
comment on column job_sequences.next_seq is 'Next sequence number to be used (1-based)';

-- Initialize sequences for seeded businesses
insert into job_sequences (bus_ref, next_seq)
select bus_ref, 1 from business_master
on conflict (bus_ref) do nothing;

-- Function to get next job ID for a business
-- Returns format: {BUS_REF}-{5-digit sequence} (e.g., "DEMO-00001")
create or replace function get_next_job_id(p_bus_ref varchar(4))
returns text as $$
declare
  v_seq integer;
begin
  -- Insert new sequence starting at 2 (since we'll return 1)
  -- Or update existing sequence by incrementing
  insert into job_sequences (bus_ref, next_seq)
  values (p_bus_ref, 2)
  on conflict (bus_ref)
  do update set next_seq = job_sequences.next_seq + 1
  returning next_seq - 1 into v_seq;

  -- Return formatted job ID: BUS_REF-NNNNN
  return p_bus_ref || '-' || lpad(v_seq::text, 5, '0');
end;
$$ language plpgsql;

comment on function get_next_job_id is 'Generates next sequential job ID for a business (e.g., DEMO-00001)';


-- ============================================================================
-- JOBS TABLE (Root entity)
-- ============================================================================
create table jobs (
  job_id uuid primary key default gen_random_uuid(),
  display_job_id varchar(15) unique,
  bus_ref varchar(4) references business_master(bus_ref),
  created_at timestamptz not null default now(),
  status text not null default 'pending',

  -- Legacy multi-tenant support (nullable for backwards compatibility)
  business_id uuid null references businesses(id),

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
comment on column jobs.display_job_id is 'Human-readable job ID (e.g., DEMO-00001)';
comment on column jobs.bus_ref is '4-char business reference code';
comment on column jobs.business_id is 'Legacy owning business for multi-tenant support';
comment on column jobs.home_size is 'Selected home size: 1-bedroom, 2-bedrooms, 3-bedrooms, 4-bedrooms';
comment on column jobs.packing_service is 'Selected packing service option (e.g., all-inclusive)';
comment on column jobs.extras is 'JSONB field for future form fields without schema migration';

-- Trigger function to auto-generate display_job_id
create or replace function set_display_job_id()
returns trigger as $$
begin
  if new.bus_ref is not null and new.display_job_id is null then
    new.display_job_id := get_next_job_id(new.bus_ref);
  end if;
  return new;
end;
$$ language plpgsql;

comment on function set_display_job_id is 'Trigger function to auto-generate display_job_id from bus_ref';

-- Create trigger for auto-generating display_job_id
create trigger trigger_set_display_job_id
  before insert on jobs
  for each row
  execute function set_display_job_id();


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
