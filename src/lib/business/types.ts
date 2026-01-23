/**
 * Business configuration types for multi-tenant support
 */

export interface BusinessTheme {
  /** Primary brand color (replaces orange-500) */
  primary: string;
  /** Primary hover state (replaces orange-600) */
  primaryHover: string;
  /** Light variant for backgrounds (replaces orange-50) */
  primaryLight: string;
  /** Border color variant (replaces orange-300) */
  primaryBorder: string;
  /** Secondary brand text color (replaces purple-600) */
  brandText: string;
  /** Ring/focus color */
  primaryRing: string;
}

export interface BusinessFeatures {
  /** Show Trustpilot badge/reviews */
  showTrustpilot: boolean;
  /** Show newsletter signup checkbox */
  showNewsletterCheckbox: boolean;
  /** Show "Powered by EverReady" footer */
  showPoweredBy: boolean;
}

export interface BusinessConfig {
  /** UUID for database reference */
  id: string;
  /** URL path slug (e.g., "acme-removals") */
  slug: string;
  /** Display name for the business */
  name: string;
  /** Theme configuration */
  theme: BusinessTheme;
  /** Feature flags */
  features: BusinessFeatures;
  /** Optional logo URL */
  logoUrl?: string;
  /** Contact email for the business */
  contactEmail?: string;
  /** Contact phone for the business */
  contactPhone?: string;
}

/**
 * Default theme matching the current orange color scheme
 */
export const DEFAULT_THEME: BusinessTheme = {
  primary: '#f97316',      // orange-500
  primaryHover: '#ea580c', // orange-600
  primaryLight: '#fff7ed', // orange-50
  primaryBorder: '#fdba74', // orange-300
  brandText: '#9333ea',    // purple-600
  primaryRing: '#fed7aa',  // orange-200
};

/**
 * Default feature flags
 */
export const DEFAULT_FEATURES: BusinessFeatures = {
  showTrustpilot: true,
  showNewsletterCheckbox: true,
  showPoweredBy: true,
};
