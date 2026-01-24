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
  /** Text color for buttons with primary background (for contrast) */
  primaryButtonText: string;
}

export interface BusinessFeatures {
  /** Show Trustpilot badge/reviews */
  showTrustpilot: boolean;
  /** Show newsletter signup checkbox */
  showNewsletterCheckbox: boolean;
  /** Show "Powered by EverReady" footer */
  showPoweredBy: boolean;
}

export interface BusinessLogoConfig {
  /** Path to full/wide logo (local path or URL) */
  logo: string;
  /** Path to square/icon logo (optional, falls back to logo) */
  logoSquare?: string;
  /** Path to favicon (local path) */
  favicon: string;
  /** Alt text for the logo */
  alt: string;
}

export interface BusinessConfig {
  /** 4-char business reference - serves as both DB key and URL slug */
  busRef: string;
  /** Theme configuration */
  theme: BusinessTheme;
  /** Feature flags */
  features: BusinessFeatures;
  /** Optional logo URL (legacy, prefer using logos) */
  logoUrl?: string;
  /** Logo configuration for local images */
  logos?: BusinessLogoConfig;
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
  primaryButtonText: '#ffffff', // white text for orange buttons
};

/**
 * Default feature flags
 */
export const DEFAULT_FEATURES: BusinessFeatures = {
  showTrustpilot: false,
  showNewsletterCheckbox: true,
  showPoweredBy: true,
};
