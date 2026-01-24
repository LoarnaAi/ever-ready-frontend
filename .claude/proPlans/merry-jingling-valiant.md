# Business Logo Implementation Plan

## Summary
Add business logo support with local image storage, dynamic favicons per business, and logo placement in 4 UI locations.

## Local Image Structure
```
public/images/business/
├── DEMO/
│   ├── logo.png
│   └── favicon.ico
├── LIMO/
│   ├── logo.png          # Download from existing logoUrl
│   └── favicon.ico
├── LNDN/
│   ├── logo.png
│   └── favicon.ico
└── _default/
    ├── logo.png          # EverReady fallback
    └── favicon.ico
```

---

## Files to Modify/Create

### 1. Type Updates
**File:** `src/lib/business/types.ts`
- Add `BusinessLogoConfig` interface with `logo`, `logoSquare`, `favicon`, `alt` fields
- Add optional `logos?: BusinessLogoConfig` to `BusinessConfig`

### 2. New Logo Utilities
**File (new):** `src/lib/business/logo-utils.ts`
- `getBusinessLogos(config)` - Returns resolved logo paths with fallbacks
- `getFaviconMetadata(config)` - Returns Next.js metadata icons object

### 3. Export Updates
**File:** `src/lib/business/index.ts`
- Export new utilities and types

### 4. Dynamic Favicon
**File:** `src/app/[business]/home-removal/layout.tsx`
- Add `generateMetadata()` function for dynamic favicon per business

### 5. Reusable Logo Component
**File (new):** `src/components/BusinessLogo.tsx`
- Props: `variant` ('full' | 'square'), `width`, `height`, `className`, `priority`
- Uses `useBusinessConfig()` + `getBusinessLogos()`
- Uses Next.js `Image` for local, `img` for external URLs

### 6. Logo Placements

| Location | File | Change |
|----------|------|--------|
| Desktop checkout (Step 6) | `src/app/home-removal-page/Step6ContactDetails.tsx` | Add `<BusinessLogo>` at top of left sidebar (~line 745) |
| Confirmation modal | `src/components/ConfirmationModal.tsx` | Add `<BusinessLogo>` in header section (~line 60) |
| Step progress header | `src/app/home-removal-page/Step*.tsx` (2-6) | Add `<BusinessLogo>` in desktop sidebar |
| Mobile accordion | `src/components/MobileJobDetailsAccordion.tsx` | Add small logo + apply theming |

### 7. Config Updates
**Files:** `src/lib/business/configs/limo.ts`, `demo.ts`, `lndn.ts`
- Add `logos` object pointing to local paths

---

## Implementation Order

1. **Setup image assets**
   - Create folder structure
   - Download LIMO logo, create/obtain DEMO and LNDN logos
   - Generate favicon.ico files from logos

2. **Types & utilities**
   - Update `types.ts` with `BusinessLogoConfig`
   - Create `logo-utils.ts`
   - Update `index.ts` exports

3. **Dynamic favicon**
   - Add `generateMetadata()` to `[business]/home-removal/layout.tsx`

4. **BusinessLogo component**
   - Create component with variant support

5. **Integrate logos**
   - Step6ContactDetails.tsx (desktop checkout)
   - ConfirmationModal.tsx
   - Step2-6 sidebars
   - MobileJobDetailsAccordion.tsx (+ add theming)

6. **Update business configs**
   - Add `logos` object to each config

---

## Verification Steps

1. **Favicon test:**
   - Navigate to `/LIMO/home-removal` - check browser tab shows LIMO favicon
   - Navigate to `/DEMO/home-removal` - check browser tab shows DEMO/default favicon

2. **Logo display test:**
   - Desktop: Verify logo appears in checkout container and step sidebars
   - Mobile: Verify logo appears in MobileJobDetailsAccordion header
   - Submit form: Verify logo appears in ConfirmationModal

3. **Fallback test:**
   - Test with a business that has no custom logo - should show default

4. **Build test:**
   - Run `npm run build` to verify no TypeScript/build errors
