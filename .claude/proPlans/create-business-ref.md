# Plan: Create Business Reference System

## Overview

Restructure the multi-tenant business configuration to separate static theming/features from dynamic business data, and implement a new job ID format that includes the business reference.

## Current State

- **BusinessConfig** (static TypeScript): `id`, `slug`, `name`, `theme`, `features`, `logoUrl`, `contactEmail`, `contactPhone`
- **businesses table**: UUID-based, stores name and config JSONB
- **jobs table**: `job_id` (UUID), `business_id` (UUID FK)
- **Job ID format**: `JOB-{8 chars of UUID}` (e.g., "JOB-A1B2C3D4")

## Target State

- **BusinessConfig** (static): `busRef`, `theme`, `features`, `logoUrl` (busRef is also the URL slug)
- **business_master table**: Business details (name, email, address, etc.)
- **jobs table**: Add `bus_ref` and `display_job_id`
- **Job ID format**: `{BUS_REF}-{5-digit seq}` (e.g., "DEMO-00001", "LNDN-00042")
- **URL format**: `/DEMO/home-removal`, `/LNDN/home-removal` (4-char paths)

---

## Implementation Steps

### Phase 1: Database Schema

#### 1.1 Create `business_master` table

**File**: `supabase/migrations/YYYYMMDD_create_business_master.sql`

```sql
CREATE TABLE business_master (
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

-- Seed initial businesses
INSERT INTO business_master (bus_ref, bus_id, bus_name, bus_email, house_number, street_name, city, postcode, lat, lon)
VALUES
    ('DEMO', 'DEMO-000001', 'Demo Removals', 'demo@example.com', '1', 'Demo Street', 'London', 'E1 1AA', 51.5074, -0.1278),
    ('LNDN', 'LNDN-000001', 'London Movers', 'info@london-movers.example.com', '10', 'Moving Lane', 'London', 'SW1A 1AA', 51.5014, -0.1419);
```

#### 1.2 Create job sequence system

**File**: `supabase/migrations/YYYYMMDD_create_job_sequences.sql`

```sql
-- Sequence table for generating job IDs per business
CREATE TABLE job_sequences (
    bus_ref     VARCHAR(4) PRIMARY KEY REFERENCES business_master(bus_ref),
    next_seq    INTEGER NOT NULL DEFAULT 1
);

-- Initialize sequences
INSERT INTO job_sequences (bus_ref, next_seq)
SELECT bus_ref, 1 FROM business_master;

-- Function to get next job ID
CREATE OR REPLACE FUNCTION get_next_job_id(p_bus_ref VARCHAR(4))
RETURNS TEXT AS $$
DECLARE
    v_seq INTEGER;
BEGIN
    INSERT INTO job_sequences (bus_ref, next_seq)
    VALUES (p_bus_ref, 2)
    ON CONFLICT (bus_ref)
    DO UPDATE SET next_seq = job_sequences.next_seq + 1
    RETURNING next_seq - 1 INTO v_seq;

    RETURN p_bus_ref || '-' || LPAD(v_seq::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;
```

#### 1.3 Update `jobs` table

**File**: `supabase/migrations/YYYYMMDD_update_jobs_table.sql`

```sql
-- Add new columns
ALTER TABLE jobs
    ADD COLUMN IF NOT EXISTS bus_ref VARCHAR(4) REFERENCES business_master(bus_ref),
    ADD COLUMN IF NOT EXISTS display_job_id VARCHAR(15) UNIQUE;

-- Trigger to auto-generate display_job_id
CREATE OR REPLACE FUNCTION set_display_job_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.bus_ref IS NOT NULL AND NEW.display_job_id IS NULL THEN
        NEW.display_job_id := get_next_job_id(NEW.bus_ref);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_display_job_id
    BEFORE INSERT ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION set_display_job_id();
```

---

### Phase 2: TypeScript Types

#### 2.1 Update `BusinessConfig` interface

**File**: `src/lib/business/types.ts`

```typescript
export interface BusinessConfig {
  /** 4-char business reference - serves as both DB key and URL slug */
  busRef: string;
  /** Theme configuration */
  theme: BusinessTheme;
  /** Feature flags */
  features: BusinessFeatures;
  /** Optional logo URL */
  logoUrl?: string;
}
```

Remove: `id`, `slug`, `name`, `contactEmail`, `contactPhone`

#### 2.2 Add `DbBusinessMaster` type

**File**: `src/lib/database.types.ts`

```typescript
export interface DbBusinessMaster {
  bus_ref: string;
  bus_id: string;
  bus_name: string;
  bus_email: string | null;
  admins: string[] | null;
  house_number: string;
  building_name: string | null;
  street_name: string;
  city: string;
  postcode: string;
  lat: number;
  lon: number;
  dt: string;
  dtts: string;
}

export interface BusinessMaster {
  busRef: string;
  busId: string;
  name: string;
  email: string | null;
  admins: string[] | null;
  address: {
    houseNumber: string;
    buildingName: string | null;
    streetName: string;
    city: string;
    postcode: string;
  };
  location: { lat: number; lon: number };
}
```

#### 2.3 Update `DbJob` interface

**File**: `src/lib/database.types.ts`

```typescript
export interface DbJob {
  job_id: string;
  display_job_id: string | null;  // NEW
  bus_ref: string | null;         // NEW
  // ... rest unchanged
}
```

#### 2.4 Update `CreateJobInput`

**File**: `src/lib/database.types.ts`

Change `businessId` to `busRef`:
```typescript
export type CreateJobInput = Omit<...> & {
  busRef?: string | null;  // Changed from businessId
};
```

---

### Phase 3: Config Files

#### 3.1 Update `demo.ts`

**File**: `src/lib/business/configs/demo.ts`

```typescript
export const demoConfig: BusinessConfig = {
  busRef: 'DEMO',
  theme: DEFAULT_THEME,
  features: DEFAULT_FEATURES,
};
```

#### 3.2 Rename `london-movers.ts` to `lndn.ts`

**File**: `src/lib/business/configs/lndn.ts`

```typescript
export const lndnConfig: BusinessConfig = {
  busRef: 'LNDN',
  theme: { /* existing theme */ },
  features: { /* existing features */ },
};
```

**Note**: URL changes from `/london-movers/home-removal` to `/LNDN/home-removal`

---

### Phase 4: Server Actions

#### 4.1 Create `businessActions.ts`

**File**: `src/lib/actions/businessActions.ts` (NEW)

```typescript
"use server";

export async function getBusinessMaster(busRef: string): Promise<{
  success: boolean;
  data?: BusinessMaster;
  error?: string;
}> {
  // Fetch from business_master table by bus_ref
}
```

#### 4.2 Update `jobActions.ts`

**File**: `src/lib/actions/jobActions.ts`

Update `createJobAction`:
- Change `business_id: data.businessId` to `bus_ref: data.busRef`
- Select `display_job_id` in return
- Return both `jobId` (UUID) and `displayJobId` (DEMO-00001)

```typescript
export async function createJobAction(data: CreateJobInput): Promise<{
  success: boolean;
  jobId?: string;
  displayJobId?: string;  // NEW
  error?: string;
}> {
  const { data: jobData, error } = await supabase
    .from("jobs")
    .insert({
      // ...
      bus_ref: data.busRef,  // Changed
    })
    .select("job_id, display_job_id")  // Updated
    .single();

  return {
    success: true,
    jobId: jobData.job_id,
    displayJobId: jobData.display_job_id  // NEW
  };
}
```

Update `getJobAction`:
- Return `displayJobId` in `JobData`

---

### Phase 5: UI Updates

#### 5.1 Update `jobUtils.ts`

**File**: `src/lib/utils/jobUtils.ts`

```typescript
export function formatJobId(jobId: string, displayJobId?: string | null): string {
  if (displayJobId) return displayJobId;
  // Legacy fallback for old UUID-based IDs
  return `JOB-${jobId.substring(0, 8).toUpperCase()}`;
}
```

#### 5.2 Update form submission

**File**: `src/app/[business]/home-removal/page.tsx`

```typescript
const result = await createJobAction({
  // ...
  busRef: config.busRef,  // Changed from businessId: config.slug
});

if (result.success && result.displayJobId) {
  setSubmittedJobId(result.displayJobId);
}
```

#### 5.3 Update confirmation modal and job pages

Update components to use `displayJobId` when available:
- `src/components/ConfirmationModal.tsx`
- `src/app/[business]/home-removal/job-summary/[job_id]/page.tsx`
- `src/app/[business]/home-removal/job-detail/[job_id]/page.tsx`

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/lib/business/types.ts` | Remove `id`, `slug`, `name`, `contactEmail`, `contactPhone`; add `busRef` |
| `src/lib/business/configs/demo.ts` | Use new `busRef` field only |
| `src/lib/business/configs/london-movers.ts` | Rename to `lndn.ts`, use `busRef: 'LNDN'` |
| `src/lib/business/config-loader.ts` | Update registry to use 4-char busRef as key |
| `src/lib/database.types.ts` | Add `DbBusinessMaster`, `BusinessMaster`; update `DbJob`, `CreateJobInput` |
| `src/lib/actions/jobActions.ts` | Use `bus_ref`, return `displayJobId` |
| `src/lib/actions/businessActions.ts` | NEW: fetch business_master data |
| `src/lib/utils/jobUtils.ts` | Update `formatJobId` to handle new format |
| `src/app/[business]/home-removal/page.tsx` | Use `busRef` in job creation |
| `src/components/ConfirmationModal.tsx` | Display `displayJobId` |

## New Files

| File | Purpose |
|------|---------|
| `supabase/migrations/YYYYMMDD_create_business_master.sql` | Create business_master table |
| `supabase/migrations/YYYYMMDD_create_job_sequences.sql` | Job sequence system |
| `supabase/migrations/YYYYMMDD_update_jobs_table.sql` | Add bus_ref and display_job_id to jobs |
| `src/lib/actions/businessActions.ts` | Server actions for business_master |

---

## Verification

1. **Database**: Run migrations locally, verify tables created
2. **Job Creation**: Create a job, verify `display_job_id` is generated (e.g., "DEMO-00001")
3. **Job Display**: Confirm job ID shows as "DEMO-00001" in confirmation modal and job pages
4. **Sequential IDs**: Create multiple jobs, verify sequence increments correctly
5. **Multi-tenant**: Test with different businesses (DEMO, LNDN), verify separate sequences
6. **Legacy Support**: Old jobs without `display_job_id` still display with fallback format

---

## Rollback Plan

- Keep `business_id` column on jobs table for backward compatibility during transition
- Legacy `formatJobId` handles old UUID-based job IDs
- Can disable trigger if issues arise
