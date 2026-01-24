# Database Data Model

This folder contains the SQL DDL files for the Ever-Ready home removal booking system.

## Schema Overview

The data model is designed around a central `jobs` table with related child tables for addresses, dates, contact details, furniture items, packing materials, and cost breakdowns. Multi-tenant support is provided via the `business_master` table.

### Key Design Principles

1. **Keyed by `job_id`**: All data is retrieved via the `job_id` UUID
2. **Human-readable Job IDs**: Jobs have a `display_job_id` (e.g., "DEMO-00001") for easy identification
3. **Multi-tenant**: Uses `bus_ref` (4-char business reference) to identify tenants
4. **Scalable**: Each table includes an `extras` JSONB column for future fields without schema migrations
5. **Normalized**: Related data is split into logical tables to avoid duplication
6. **Type-safe**: Uses PostgreSQL enums for constrained values (status, address_type, etc.)

## Files

- `01_extensions_and_types.sql` - PostgreSQL extensions and custom types
- `02_tables.sql` - All table definitions with comments
- `03_indexes.sql` - Performance indexes

## How to Apply

### Option 1: Supabase Dashboard (SQL Editor)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run each file in order (01, 02, 03)

### Option 2: Supabase CLI

```bash
# Apply all migrations
supabase db push

# Or run individual files
psql $DATABASE_URL -f database/datamodels/01_extensions_and_types.sql
psql $DATABASE_URL -f database/datamodels/02_tables.sql
psql $DATABASE_URL -f database/datamodels/03_indexes.sql
```

### Option 3: Direct psql

```bash
psql "postgresql://user:pass@host:5432/dbname" \
  -f database/datamodels/01_extensions_and_types.sql \
  -f database/datamodels/02_tables.sql \
  -f database/datamodels/03_indexes.sql
```

## Tables

### Multi-Tenant Tables

#### `business_master`
Primary table for business/tenant information. Uses a 4-character `bus_ref` as the primary key.

| Column | Description |
|--------|-------------|
| `bus_ref` | 4-char business reference (PK, e.g., "DEMO", "LNDN") |
| `bus_id` | Extended 12-char business identifier |
| `bus_name` | Display name for the business |
| `bus_email` | Contact email |
| `admins` | Array of admin user identifiers |
| `house_number`, `building_name`, `street_name`, `city`, `postcode` | Business address |
| `lat`, `lon` | Geographic coordinates |

#### `job_sequences`
Tracks sequential job ID numbers per business.

| Column | Description |
|--------|-------------|
| `bus_ref` | Business reference (FK to business_master) |
| `next_seq` | Next sequence number to use |

#### `businesses` (Legacy)
Original business table, kept for backward compatibility. New implementations should use `business_master`.

### Job Tables

#### `jobs`
Root table containing job metadata, home size, packing service selection, and admin notes.

| Column | Description |
|--------|-------------|
| `job_id` | UUID primary key |
| `display_job_id` | Human-readable ID (e.g., "DEMO-00001") - auto-generated |
| `bus_ref` | 4-char business reference (FK) |
| `status` | Job status (pending, confirmed, in-progress, completed) |
| `home_size` | Selected home size |

#### `job_addresses`
Collection and delivery addresses (0-2 per job).

#### `job_dates`
Collection and materials delivery dates (0-2 per job).

#### `job_contact_details`
Customer contact information (1 per job).

#### `job_furniture_items`
Furniture items with two list types:
- `current`: Final selected items
- `initial`: Prepopulated baseline items

#### `job_packing_materials`
Packing materials ordered (many per job).

#### `job_cost_breakdowns`
Cost calculation snapshot (0-1 per job).

## Job ID Generation

Jobs are assigned human-readable IDs in the format `{BUS_REF}-{5-digit sequence}`:

```
DEMO-00001
DEMO-00002
LNDN-00001
```

This is handled automatically via:
1. The `get_next_job_id(bus_ref)` function
2. The `trigger_set_display_job_id` trigger on the jobs table

When inserting a job with a `bus_ref`, the `display_job_id` is auto-generated.

## Future Extensibility

Each table has an `extras` JSONB column for adding new fields without schema changes:

```sql
-- Example: Add a new field without migration
update jobs
set extras = extras || '{"special_instructions": "Handle with care"}'::jsonb
where job_id = 'xxx';
```

When a field becomes important for filtering/reporting, promote it to a real column via migration.

## Row Level Security (RLS)

RLS policies are not included in this initial schema. Add them based on your access requirements:

- **Public access by job_id**: Allow anyone with the link to view their job
- **User-based access**: Restrict to authenticated users via `user_id`
- **Business-based access**: Restrict to users in the same business via `bus_ref`
- **Admin access**: Separate admin role with full access

## Next Steps

1. Apply the schema to your Supabase project
2. Generate TypeScript types: `supabase gen types typescript`
3. Add RLS policies based on your security requirements
