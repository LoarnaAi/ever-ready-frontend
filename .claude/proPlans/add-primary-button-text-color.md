# Add Primary Button Text Color to BusinessConfig

## Problem
The LIMO business theme uses a bright yellow primary color (`#FACC15`), but button text is hardcoded as `text-white`. White text on yellow background has poor contrast and accessibility. We need a configurable `primaryButtonText` property in the theme.

## Proposed Changes

### [types.ts](file:///wsl.localhost/Ubuntu-20.04/home/basal/repos/ever-ready-frontend/src/lib/business/types.ts)

#### Modify `BusinessTheme` interface
Add new property:
```typescript
/** Text color for buttons with primary background */
primaryButtonText: string;
```

#### Update `DEFAULT_THEME` constant
Add default value (white for dark backgrounds):
```typescript
primaryButtonText: '#ffffff',  // white text for orange/dark buttons
```

---

### [limo.ts](file:///wsl.localhost/Ubuntu-20.04/home/basal/repos/ever-ready-frontend/src/lib/business/configs/limo.ts)

Add `primaryButtonText` to LIMO theme:
```typescript
primaryButtonText: '#000000',  // black text for yellow buttons
```

---

### [lndn.ts](file:///wsl.localhost/Ubuntu-20.04/home/basal/repos/ever-ready-frontend/src/lib/business/configs/lndn.ts)

Add `primaryButtonText` to LNDN theme:
```typescript
primaryButtonText: '#ffffff',  // white text for blue buttons
```

---

### [theme-utils.ts](file:///wsl.localhost/Ubuntu-20.04/home/basal/repos/ever-ready-frontend/src/lib/business/theme-utils.ts)

#### Update `getThemeCSSVariables` function
Add CSS variable:
```typescript
'--theme-primary-button-text': theme.primaryButtonText,
```

#### Add new utility in `themedStyles`
```typescript
/** Primary button text color (contrasting to primary background) */
primaryButtonText: (theme: BusinessTheme): React.CSSProperties => ({
  color: theme.primaryButtonText,
}),
```

---

### Component Updates

Replace hardcoded `text-white` with dynamic theme-based text color on primary-background buttons.

#### [page.tsx](file:///wsl.localhost/Ubuntu-20.04/home/basal/repos/ever-ready-frontend/src/app/%5Bbusiness%5D/home-removal/page.tsx)

**Line 588** - Update bedroom count badge:
```diff
- style={selectedService === service.id ? { ...primaryBgStyle, color: 'white' } : ...}
+ style={selectedService === service.id ? { ...primaryBgStyle, color: theme.primaryButtonText } : ...}
```

**Line 608** - Update continue button:
```diff
- className={`... ${!selectedService ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "text-white shadow-lg"}`}
+ className={`... ${!selectedService ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "shadow-lg"}`}
+ style={selectedService ? { ...primaryBgStyle, color: theme.primaryButtonText } : {}}
```

> [!NOTE]
> Other components that use `text-white` on primary backgrounds may also need updating. The changes above cover the main LIMO `/home-removal` page. A follow-up task could audit all buttons across Step components (Step2, Step3, Step4, Step5, Step6) and other business pages.

---

## Verification Plan

### Manual Testing
1. Navigate to `http://localhost:3000/limo/home-removal`
2. Verify yellow buttons have black text
3. Navigate to `http://localhost:3000/demo/home-removal`  
4. Verify orange buttons still have white text
5. Navigate to `http://localhost:3000/lndn/home-removal`
6. Verify blue buttons still have white text

### Lint Check
```bash
npm run lint
```
