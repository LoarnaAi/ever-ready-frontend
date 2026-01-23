import type { BusinessConfig } from '../types';
import { DEFAULT_THEME, DEFAULT_FEATURES } from '../types';

/**
 * Demo business configuration
 * Matches the current orange theme for backwards compatibility
 */
export const demoConfig: BusinessConfig = {
  id: 'demo-000-000-000',
  slug: 'demo',
  name: 'Your Business Name Goes Here',
  theme: DEFAULT_THEME,
  features: DEFAULT_FEATURES,
};
