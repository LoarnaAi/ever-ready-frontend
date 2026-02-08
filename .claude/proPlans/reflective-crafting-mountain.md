# Auto-Quote Implementation Plan

## Context

The MWV Python project has a mature auto-quote system (`auto_quote.py`, 1110 lines) that calculates removal job quotes based on furniture volume/weight, vehicle selection, crew sizing, time estimation, and pricing zones. We need to port this logic into the Next.js app as a testable API endpoint that reads item data from Supabase and generates quotes.

**Key user decisions:**
- Item volume/weight data → Supabase `removal_items` table
- Zone detection → Distance-only (skip M25 postcode boundary for now)
- Missing form inputs (`customer_assistance`, `difficult_access`) → API accepts but defaults to `false`; form updates later
- Quote timing → Show after Step 4 (addresses), before date scheduling
- Note: `hasParking` and `hasLift` are already collected in Step 4 → maps to `noParking`/`noLift`

---

## Step 1: Create `removal_items` Supabase table + seed data

Create a migration SQL and seed the table with volume/weight data from MWV's CSV (66 items), plus additional items the frontend uses that aren't in the CSV (`coffee-side-table`, `bag`, `suitcase`, `monitor`).

**Table schema:**
```sql
CREATE TABLE removal_items (
  item_id TEXT PRIMARY KEY,        -- matches frontend IDs: "single-bed", "double-king-bed"
  name TEXT NOT NULL,              -- display name: "Single Bed & Mattress"
  room TEXT NOT NULL,              -- category: "Bedrooms", "Living", "Kitchen"
  weight_kg NUMERIC(6,2) NOT NULL, -- weight in kg
  volume_m3 NUMERIC(6,3) NOT NULL, -- volume in cubic meters
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**File:** `sql/create_removal_items.sql` (for manual execution in Supabase dashboard)

**Mapping:** The `item_id` field must match the IDs used in the frontend (`page.tsx` lines 225-274). Items from the CSV that don't have a frontend equivalent get descriptive kebab-case IDs.

---

## Step 2: Add TypeScript types for the quote system

**File:** `src/lib/database.types.ts` — add new types:

```typescript
// DB row type
export interface DbRemovalItem {
  item_id: string;
  name: string;
  room: string;
  weight_kg: number;
  volume_m3: number;
  is_active: boolean;
}

// DB row type for job_quote table
export interface DbJobQuote {
  quote_id: number;
  job_id: string;
  total_volume: number;
  num_heavy_items: number;
  customer_assistance: boolean;
  num_rooms: number;
  difficult_access: boolean;
  distance_miles: number;
  no_parking: boolean;
  no_lift: boolean;
  driving_minutes: number;
  vehicle_type: string;
  crew_size: number;
  reasoning: string;
  base_hours: number;
  add_on_minutes: number;
  total_hours: number;
  time_notes: string[];
  zone: string;
  hourly_rate: number | null;
  rate_is_per_mover: boolean;
  base_cost: number | null;
  extra_cost: number | null;
  total_cost: number;
  pricing_notes: string[];
  price_per_mile: number | null;
  occupancy: string;
  volume_category: string;
  complexity_factor: number;
  suitable_for_single_trip: boolean;
  is_active: boolean;
  created_at: string;
}
```

---

## Step 3: Port auto-quote calculation logic to TypeScript

Port the core logic from `auto_quote.py` into a dedicated module.

**File:** `src/lib/quote/auto-quote.ts`

Port these components (preserving all business rules exactly):

| Python | TypeScript |
|--------|-----------|
| `VehicleType` enum | `VehicleType` string union |
| `MoveZone` enum | `MoveZone` string union |
| `Occupancy` enum | `Occupancy` string union |
| `QuoteInputs` dataclass | `QuoteInputs` interface |
| `TimeEstimate` dataclass | `TimeEstimate` interface |
| `PriceBreakdown` dataclass | `PriceBreakdown` interface |
| `TIME_RULES` dict | `TIME_RULES` const object |
| `PRICING_RULES` dict | `PRICING_RULES` const object |
| `recommend_vehicle_and_crew()` | `recommendVehicleAndCrew()` |
| `get_crew_size()` | `getCrewSize()` |
| `estimate_time()` | `estimateTime()` |
| `compute_pricing()` | `computePricing()` |
| `compute_pricing_national()` | `computePricingNational()` |
| `get_move_zone()` | `getMoveZone()` (distance-only, no M25) |
| `get_occupancy()` | `getOccupancy()` |
| `get_volume_category()` | `getVolumeCategory()` |
| `calculate_complexity_factor()` | `calculateComplexityFactor()` |
| `get_max_capacity()` | `getMaxCapacity()` |
| `round_to_nearest_half_hour()` | `roundToNearestHalfHour()` |

**File:** `src/lib/quote/types.ts` — all quote-related TypeScript types/interfaces

**File:** `src/lib/quote/constants.ts` — `TIME_RULES`, `PRICING_RULES`, vehicle capacities

**File:** `src/lib/quote/index.ts` — barrel export

**Key simplification:** `determine_move_zone()` uses distance-only logic (no M25 checker). Two zones: LOCAL (≤2mi) and NON_LOCAL (>2mi). NATION_WIDE support kept in types/constants for future use but not triggered.

---

## Step 4: Create inventory analysis helper

**File:** `src/lib/quote/inventory.ts`

Function `analyzeInventory()`:
- Input: `{ itemId: string; quantity: number }[]` + removal items data from DB
- Looks up each item's weight/volume from the `removal_items` table data
- Calculates:
  - `totalVolume`: sum of (item.volume_m3 × quantity)
  - `numHeavyItems`: count of items where weight_kg > 15
  - `itemAnalysis`: detailed breakdown per item
- Returns `InventoryAnalysis` object

This bridges the gap between frontend furniture quantities and the quote engine's volume-based inputs.

---

## Step 5: Create server action for quote calculation

**File:** `src/lib/actions/quoteActions.ts`

```typescript
export async function calculateQuoteAction(input: {
  busRef: string;
  furnitureItems: { itemId: string; quantity: number }[];
  homeSize: string;              // "1-bedroom", "2-bedrooms", etc.
  distanceMiles?: number;        // default 0 (local)
  drivingMinutes?: number;       // default 0
  noParking?: boolean;           // from address step (inverted hasParking)
  noLift?: boolean;              // from address step (inverted hasLift)
  customerAssistance?: boolean;  // default false (future form field)
  difficultAccess?: boolean;     // default false (future form field)
  jobId?: string;                // optional: if provided, saves quote to DB
}): Promise<QuoteResult>
```

Logic:
1. Fetch `removal_items` from Supabase (cache-friendly, small table)
2. Call `analyzeInventory()` to get totalVolume + numHeavyItems
3. Map `homeSize` to `numRooms` (e.g., "2-bedrooms" → 2)
4. Build `QuoteInputs` with all params (defaults for missing ones)
5. Call `getQuoteRecommendation()` from the ported logic
6. Optionally persist to `job_quote` table if `jobId` provided
7. Return full quote breakdown

---

## Step 6: Create API endpoint

**File:** `src/app/api/quotes/calculate/route.ts`

```
POST /api/quotes/calculate
```

**Request body:**
```json
{
  "busRef": "DEMO",
  "furnitureItems": [
    { "itemId": "single-bed", "quantity": 1 },
    { "itemId": "sofa-2-seater", "quantity": 1 }
  ],
  "homeSize": "1-bedroom",
  "distanceMiles": 3.5,
  "noParking": false,
  "noLift": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "vehicleType": "Ford Transit 350 L3H3",
    "crewSize": 1,
    "reasoning": "1-bed house requires Ford Transit 350",
    "timeEstimate": {
      "baseHours": 1.0,
      "addOnMinutes": 0,
      "drivingMinutes": 0,
      "totalHours": 1.0,
      "notes": ["Base time: 1 hour"]
    },
    "pricing": {
      "zone": "non_local",
      "hourlyRate": 70,
      "rateIsPerMover": false,
      "baseCost": 70,
      "extraCost": 0,
      "totalCost": 70,
      "notes": ["Base: £70 per crew × 1h = £70.00", "Zone: Non Local"]
    },
    "occupancy": "less_than_half",
    "volumeCategory": "small",
    "complexityFactor": 1.0,
    "suitableForSingleTrip": true,
    "totalVolume": 1.30,
    "numHeavyItems": 2
  }
}
```

Follows existing API route patterns (validate → call server action → return NextResponse.json).

---

## Step 7: Integrate into form flow (basic)

After Step 4 (address details) completes, call the quote API and pass the result forward to subsequent steps for display.

**Modify:** `src/app/[business]/home-removal/page.tsx`
- After `handleStep4Continue`, call `calculateQuoteAction` with collected data
- Derive `noParking`/`noLift` from stored address data (`!hasParking`, `!hasLift`)
- Store quote result in state: `const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null)`
- Pass quote result to Step 5 and Step 6 for display

**Modify:** `src/components/home-removal-steps/Step5DateScheduling.tsx` or `Step6ContactDetails.tsx`
- Add a "Your Quote" summary section showing: vehicle type, crew size, estimated time, total cost
- This is a lightweight display-only addition

---

## Files to Create

| File | Purpose |
|------|---------|
| `sql/create_removal_items.sql` | DB migration + seed data |
| `sql/create_job_quote.sql` | Job quote table migration |
| `src/lib/quote/types.ts` | Quote type definitions |
| `src/lib/quote/constants.ts` | TIME_RULES, PRICING_RULES, capacities |
| `src/lib/quote/auto-quote.ts` | Core calculation logic (ported from Python) |
| `src/lib/quote/inventory.ts` | Inventory analysis (volume/weight lookup) |
| `src/lib/quote/index.ts` | Barrel export |
| `src/lib/actions/quoteActions.ts` | Server action for quote calculation |
| `src/app/api/quotes/calculate/route.ts` | API endpoint |

## Files to Modify

| File | Change |
|------|--------|
| `src/lib/database.types.ts` | Add `DbRemovalItem`, `DbJobQuote` types |
| `src/app/[business]/home-removal/page.tsx` | Call quote after Step 4, pass result to later steps |
| Step 5 or Step 6 component | Display quote summary |

---

## Verification

1. **Run SQL** in Supabase dashboard to create tables and seed data
2. **Test API endpoint** via curl:
   ```bash
   curl -X POST http://localhost:3000/api/quotes/calculate \
     -H "Content-Type: application/json" \
     -d '{"busRef":"DEMO","furnitureItems":[{"itemId":"single-bed","quantity":1},{"itemId":"sofa-2-seater","quantity":1}],"homeSize":"1-bedroom","distanceMiles":1.5}'
   ```
3. **Test edge cases**: empty items, 4-bedroom with heavy items, large volume, nationwide distance
4. **Test form flow**: complete Steps 1-4, verify quote appears before Step 5
5. **Cross-reference with MWV**: run same inputs through Python `get_quote_recommendation()` and verify TypeScript produces identical outputs
