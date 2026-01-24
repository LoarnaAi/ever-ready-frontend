import type { BusinessConfig } from '../types';

/**
 * London Movers business configuration
 * Blue theme for this customer
 * Business name and contact info are stored in business_master table
 */
export const lndnConfig: BusinessConfig = {
  busRef: 'LNDN',
  theme: {
    primary: '#2563eb',      // blue-600
    primaryHover: '#1d4ed8', // blue-700
    primaryLight: '#eff6ff', // blue-50
    primaryBorder: '#93c5fd', // blue-300
    brandText: '#7c3aed',    // violet-600
    primaryRing: '#bfdbfe',  // blue-200
  },
  features: {
    showTrustpilot: true,
    showNewsletterCheckbox: true,
    showPoweredBy: true,
  },
};
