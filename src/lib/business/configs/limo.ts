import type { BusinessConfig } from '../types';

/**
 * LIMO business configuration
 * Bright yellow theme for this customer
 * Business name and contact info are stored in business_master table
 */
export const limoConfig: BusinessConfig = {
  busRef: 'LIMO',
  busName: 'Lions Moves Van',
  logoUrl: 'https://lionsmovesvan.com/wp-content/uploads/2025/08/Untitled-design-79.png?1769191250',
  logos: {
    logo: '/images/business/LIMO/logo.png',
    favicon: '/images/business/LIMO/favicon.svg',
    alt: 'Lions Moves',
  },
  theme: {
    primary: '#FACC15',      // yellow-400 (bright yellow)
    primaryHover: '#EAB308', // yellow-500 (darker on hover)
    primaryLight: '#FEFCE8', // yellow-50 (light background)
    primaryBorder: '#FDE047', // yellow-300 (border)
    brandText: '#CA8A04',    // yellow-600 (brand text)
    primaryRing: '#FEF08A',  // yellow-200 (focus ring)
    primaryButtonText: '#000000', // black text for yellow buttons
  },
  features: {
    showTrustpilot: false,
    showNewsletterCheckbox: true,
    showPoweredBy: true,
  },
};
