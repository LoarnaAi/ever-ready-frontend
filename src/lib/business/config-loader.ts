import type { BusinessConfig } from './types';
import { demoConfig } from './configs/demo';
import { londonMoversConfig } from './configs/london-movers';

/**
 * Registry of all business configurations
 * Add new customers here
 */
const configRegistry: Record<string, BusinessConfig> = {
  demo: demoConfig,
  'london-movers': londonMoversConfig,
};

/**
 * Get business configuration by slug
 * @param slug - URL path slug (e.g., "demo", "acme-removals")
 * @returns BusinessConfig if found, null otherwise
 */
export function getBusinessConfig(slug: string): BusinessConfig | null {
  return configRegistry[slug] ?? null;
}

/**
 * Get all registered business slugs
 * Useful for static generation of routes
 */
export function getAllBusinessSlugs(): string[] {
  return Object.keys(configRegistry);
}

/**
 * Check if a business slug exists
 */
export function isValidBusinessSlug(slug: string): boolean {
  return slug in configRegistry;
}

/**
 * Register a new business config at runtime
 * (Primarily for testing purposes)
 */
export function registerBusinessConfig(config: BusinessConfig): void {
  configRegistry[config.slug] = config;
}
