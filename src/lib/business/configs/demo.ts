import type { BusinessConfig } from '../types';
import { DEFAULT_THEME, DEFAULT_FEATURES } from '../types';

/**
 * Demo business configuration
 * Matches the current orange theme for backwards compatibility
 * Business name and contact info are stored in business_master table
 */
export const demoConfig: BusinessConfig = {
  busRef: 'DEMO',
  theme: DEFAULT_THEME,
  features: DEFAULT_FEATURES,
};
