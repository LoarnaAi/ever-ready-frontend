# Database Data Model

This folder contains the SQL DDL files for the Ever-Ready home removal booking system.

## Schema Overview

The data model is designed around a central `jobs` table with related child tables for addresses, dates, contact details, furniture items, packing materials, and cost breakdowns.

### Key Design Principles

1. **Keyed by `job_id`**: All data is retrieved via the `job_id` UUID
2. **Scalable**: Each table includes an `extras` JSONB column for future fields without schema migrations
3. **Normalized**: Related data is split into logical tables to avoid duplication
4. **Type-safe**: Uses PostgreSQL enums for constrained values (status, address_type, etc.)

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

### `jobs`
Root table containing job metadata, home size, packing service selection, and admin notes.

### `job_addresses`
Collection and delivery addresses (0-2 per job).

### `job_dates`
Collection and materials delivery dates (0-2 per job).

### `job_contact_details`
Customer contact information (1 per job).

### `job_furniture_items`
Furniture items with two list types:
- `current`: Final selected items
- `initial`: Prepopulated baseline items

### `job_packing_materials`
Packing materials ordered (many per job).

### `job_cost_breakdowns`
Cost calculation snapshot (0-1 per job).

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
- **Admin access**: Separate admin role with full access

## Next Steps

1. Apply the schema to your Supabase project
2. Update `src/lib/tempDb.ts` to use Supabase client instead of in-memory Map
3. Add RLS policies based on your security requirements
4. Generate TypeScript types: `supabase gen types typescript`
