/** @format */

import type { BusinessConfig, BusinessLogoConfig } from './types';

/**
 * Default logo configuration (EverReady fallback)
 */
const DEFAULT_LOGOS: BusinessLogoConfig = {
  logo: '/images/business/_default/logo.svg',
  logoSquare: '/images/business/_default/favicon.svg',
  favicon: '/images/business/_default/favicon.svg',
  alt: 'EverReady',
};

/**
 * Resolved logo paths with all fallbacks applied
 */
export interface ResolvedLogos {
  /** Full/wide logo path */
  logo: string;
  /** Square/icon logo path */
  logoSquare: string;
  /** Favicon path */
  favicon: string;
  /** Alt text */
  alt: string;
  /** Whether using external URL (legacy logoUrl) */
  isExternal: boolean;
}

/**
 * Get resolved logo paths for a business config with appropriate fallbacks
 * Priority: config.logos > config.logoUrl > default logos
 */
export function getBusinessLogos(config: BusinessConfig | null): ResolvedLogos {
  // No config - use defaults
  if (!config) {
    return {
      ...DEFAULT_LOGOS,
      logoSquare: DEFAULT_LOGOS.logoSquare || DEFAULT_LOGOS.logo,
      isExternal: false,
    };
  }

  // Use logos config if available
  if (config.logos) {
    return {
      logo: config.logos.logo,
      logoSquare: config.logos.logoSquare || config.logos.logo,
      favicon: config.logos.favicon,
      alt: config.logos.alt,
      isExternal: config.logos.logo.startsWith('http'),
    };
  }

  // Legacy logoUrl support - treat as external
  if (config.logoUrl) {
    return {
      logo: config.logoUrl,
      logoSquare: config.logoUrl,
      favicon: DEFAULT_LOGOS.favicon, // No favicon for legacy, use default
      alt: config.busRef,
      isExternal: true,
    };
  }

  // Fall back to defaults
  return {
    ...DEFAULT_LOGOS,
    logoSquare: DEFAULT_LOGOS.logoSquare || DEFAULT_LOGOS.logo,
    alt: config.busRef || DEFAULT_LOGOS.alt,
    isExternal: false,
  };
}

/**
 * Get Next.js metadata icons object for dynamic favicon
 */
export function getFaviconMetadata(config: BusinessConfig | null): {
  icon: string;
  shortcut: string;
  apple: string;
} {
  const logos = getBusinessLogos(config);
  return {
    icon: logos.favicon,
    shortcut: logos.favicon,
    apple: logos.favicon,
  };
}
