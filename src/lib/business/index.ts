// Types
export type { BusinessConfig, BusinessTheme, BusinessFeatures, BusinessLogoConfig } from './types';
export { DEFAULT_THEME, DEFAULT_FEATURES } from './types';

// Logo utilities
export { getBusinessLogos, getFaviconMetadata } from './logo-utils';
export type { ResolvedLogos } from './logo-utils';

// Context
export {
  BusinessProvider,
  useBusinessConfig,
  useOptionalBusinessConfig,
  DEMO_CONFIG,
} from './BusinessContext';

// Config loader
export {
  getBusinessConfig,
  getAllBusinessRefs,
  isValidBusinessRef,
  registerBusinessConfig,
} from './config-loader';

// Theme utilities
export {
  getThemeCSSVariables,
  themedStyles,
  combineStyles,
} from './theme-utils';

// Theme hook (works outside BusinessProvider with defaults)
export { useTheme } from './useTheme';
