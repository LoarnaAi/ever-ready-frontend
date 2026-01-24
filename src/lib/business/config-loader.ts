import type { BusinessConfig } from './types';
import { demoConfig } from './configs/demo';
import { lndnConfig } from './configs/lndn';
import { limoConfig } from './configs/limo';

/**
 * Registry of all business configurations
 * Keyed by busRef (4-char business reference code)
 * Add new customers here
 */
const configRegistry: Record<string, BusinessConfig> = {
  DEMO: demoConfig,
  LNDN: lndnConfig,
  LIMO: limoConfig,
};

/**
 * Get business configuration by busRef
 * @param busRef - 4-char business reference (e.g., "DEMO", "LNDN")
 * @returns BusinessConfig if found, null otherwise
 */
export function getBusinessConfig(busRef: string): BusinessConfig | null {
  // Normalize to uppercase for case-insensitive lookup
  return configRegistry[busRef.toUpperCase()] ?? null;
}

/**
 * Get all registered business references
 * Useful for static generation of routes
 */
export function getAllBusinessRefs(): string[] {
  return Object.keys(configRegistry);
}

/**
 * Check if a business reference exists
 */
export function isValidBusinessRef(busRef: string): boolean {
  return busRef.toUpperCase() in configRegistry;
}

/**
 * Register a new business config at runtime
 * (Primarily for testing purposes)
 */
export function registerBusinessConfig(config: BusinessConfig): void {
  configRegistry[config.busRef] = config;
}
