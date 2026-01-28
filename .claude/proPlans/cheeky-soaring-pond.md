# Plan: Remove Redundant Home Removal Routes

## Summary

Move shared step components to `src/components/home-removal-steps/`, then delete `src/app/home-removal/` and `src/app/home-removal-page/` directories entirely.

---

## Implementation Steps

### Step 1: Create new directory and move files
Create `src/components/home-removal-steps/` and move these files:
- `Step2FurnitureSelection.tsx`
- `Step3PackingService.tsx`
- `Step4AddressDetails.tsx`
- `Step5DateScheduling.tsx`
- `Step6ContactDetails.tsx`
- `furnitureIcons.tsx`

### Step 2: Update internal imports in moved files
Each Step component imports `furnitureIcons` with a relative path (`./furnitureIcons`). This will still work after the move since they'll be in the same directory.

### Step 3: Update imports in [business]/home-removal/page.tsx
Change imports from:
```typescript
import Step2FurnitureSelection from "@/app/home-removal-page/Step2FurnitureSelection";
```
To:
```typescript
import Step2FurnitureSelection from "@/components/home-removal-steps/Step2FurnitureSelection";
```
(Same for Step3, Step4, Step5, Step6)

### Step 4: Delete old directories
- Delete `src/app/home-removal/` (entire directory)
- Delete `src/app/home-removal-page/` (entire directory)

---

## Files Summary

| Action | Path |
|--------|------|
| Move | `src/app/home-removal-page/Step2FurnitureSelection.tsx` → `src/components/home-removal-steps/` |
| Move | `src/app/home-removal-page/Step3PackingService.tsx` → `src/components/home-removal-steps/` |
| Move | `src/app/home-removal-page/Step4AddressDetails.tsx` → `src/components/home-removal-steps/` |
| Move | `src/app/home-removal-page/Step5DateScheduling.tsx` → `src/components/home-removal-steps/` |
| Move | `src/app/home-removal-page/Step6ContactDetails.tsx` → `src/components/home-removal-steps/` |
| Move | `src/app/home-removal-page/furnitureIcons.tsx` → `src/components/home-removal-steps/` |
| Update | `src/app/[business]/home-removal/page.tsx` (update 5 import paths) |
| Delete | `src/app/home-removal/` (entire directory) |
| Delete | `src/app/home-removal-page/` (entire directory) |

---

## Verification

1. Run `npm run build` to verify no import errors
2. Test `http://localhost:3000/DEMO/home-removal` - complete all 6 steps of booking flow
3. Verify step navigation, form inputs, and final submission work correctly
