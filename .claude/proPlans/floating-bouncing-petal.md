# Plan: Add LIMO Business Configuration

## Overview
Add a new business configuration for 'LIMO' with a bright yellow theme (#FACC15).

## Files to Modify

### 1. Create: `src/lib/business/configs/limo.ts`

New config file following the existing `lndn.ts` pattern:

```typescript
import type { BusinessConfig } from '../types';

export const limoConfig: BusinessConfig = {
  busRef: 'LIMO',
  theme: {
    primary: '#FACC15',      // yellow-400 (bright yellow)
    primaryHover: '#EAB308', // yellow-500 (darker on hover)
    primaryLight: '#FEFCE8', // yellow-50 (light background)
    primaryBorder: '#FDE047', // yellow-300 (border)
    brandText: '#CA8A04',    // yellow-600 (brand text)
    primaryRing: '#FEF08A',  // yellow-200 (focus ring)
  },
  features: {
    showTrustpilot: true,
    showNewsletterCheckbox: true,
    showPoweredBy: true,
  },
};
```

### 2. Modify: `src/lib/business/config-loader.ts`

Add import and register in the config registry:

```typescript
import { limoConfig } from './configs/limo';

const configRegistry: Record<string, BusinessConfig> = {
  DEMO: demoConfig,
  LNDN: lndnConfig,
  LIMO: limoConfig,  // Add this line
};
```

## Verification

1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3000/limo/home-removal`
3. Verify the form displays with yellow theme colors
4. Check buttons, borders, and interactive elements use the yellow palette
