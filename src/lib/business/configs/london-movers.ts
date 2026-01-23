import type { BusinessConfig } from '../types';

/**
 * London Movers business configuration
 * Example of a customer with a blue theme
 */
export const londonMoversConfig: BusinessConfig = {
  id: 'london-movers-001',
  slug: 'london-movers',
  name: 'London Movers',
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
  contactEmail: 'info@london-movers.example.com',
  contactPhone: '+44 20 1234 5678',
};
