# Home Removal Step Data & Browser Persistence Reference

This note documents how the **home-removal** step data is stored in the browser today, and the
data elements you would likely want to model for end-to-end persistence.

## 1) Where step data lives right now

### A) `/home-removal` route (step 1 → 6)
File: `src/app/home-removal/page.tsx`

This route is **stateful in React** only. Data is passed between steps via props. There is **no
global persistence** in this file beyond component state.

**Key state stored here:**
- `selectedService` (string)
- `currentStep` (number)
- `furnitureQuantities` (`Record<string, number>`)
- `initialFurnitureQuantities` (`Record<string, number>`)
- `selectedDismantlePackage` (boolean)
- `packingMaterialQuantities` (`Record<string, number>`)
- `selectedPackingService` (string)

### B) `/home-removal-page` route (starts at step 2)
File: `src/app/home-removal-page/page.tsx`

This route is a smaller step flow (Step2–Step4). It also stores data only in **local React state**,
not persistent storage.

---

## 2) What is persisted in the browser (localStorage)

Only steps **4–6** persist into `localStorage` today.

### Step 4 — Address details
File: `src/app/home-removal-page/Step4AddressDetails.tsx`

**localStorage keys**
- `step4_collectionAddress`
- `step4_deliveryAddress`

**AddressData shape**
```ts
{
  postcode: string;
  address: string;
  floor: string;
  hasParking: boolean;
  hasLift: boolean;
  hasAdditionalAddress: boolean;
}
```

The data is saved on every field update.

### Step 5 — Date scheduling
File: `src/app/home-removal-page/Step5DateScheduling.tsx`

**localStorage keys**
- `step5_materialsDelivery`
- `step5_collectionDate`

**ScheduleData shape**
```ts
{
  date: Date | null;          // Stored as JSON; rehydrated to Date.
  timeSlot: string;
  intervalType: "6hours" | "2hours";
}
```

The data is saved on each setter call.

### Step 6 — Contact details
File: `src/app/home-removal-page/Step6ContactDetails.tsx`

**localStorage key**
- `step6_contactData`

**ContactData shape**
```ts
{
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  hasPromoCode: boolean;
  promoCode: string;
  signUpForNews: boolean;
  agreeToTerms: boolean;
}
```

The data is saved on every field update.

---

## 3) Full data elements by step (logical model inventory)

Below is a consolidated list of all the data elements you might want to persist at the end.

### Step 1 — Service selection
- `selectedService` (string: service ID such as `1-bedroom`, `2-bedrooms`, `personalised`)

### Step 2 — Furniture inventory selection
- `furnitureQuantities`: `Record<string, number>`
- `initialFurnitureQuantities`: `Record<string, number>` (prepopulated per service)

### Step 3 — Packing options
- `selectedPackingService`: string (e.g., `"all-inclusive"`)
- `packingMaterialQuantities`: `Record<string, number>`
- `selectedDismantlePackage`: boolean

### Step 4 — Addresses
- `collectionAddress`: AddressData
- `deliveryAddress`: AddressData

### Step 5 — Dates
- `materialsDelivery`: ScheduleData
- `collectionDate`: ScheduleData

### Step 6 — Contact
- `contactData`: ContactData

---

## 4) Practical takeaway

- **Only steps 4–6 are persisted** in `localStorage` today.
- **Steps 1–3 are in React state only** and are lost on refresh.

If you want to persist everything “at the end,” you’ll likely want a single model that combines:
1. Service selection
2. Inventory line items
3. Packing selections
4. Addresses
5. Schedule
6. Contact
