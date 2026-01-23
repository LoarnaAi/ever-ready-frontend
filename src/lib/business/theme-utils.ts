import type { BusinessTheme } from './types';
import type React from 'react';

/**
 * Generate CSS custom properties from a business theme
 * Can be applied to a container element to cascade theme colors
 */
export function getThemeCSSVariables(theme: BusinessTheme): React.CSSProperties {
  return {
    '--theme-primary': theme.primary,
    '--theme-primary-hover': theme.primaryHover,
    '--theme-primary-light': theme.primaryLight,
    '--theme-primary-border': theme.primaryBorder,
    '--theme-brand-text': theme.brandText,
    '--theme-primary-ring': theme.primaryRing,
  } as React.CSSProperties;
}

/**
 * Utility to create className + style for themed elements
 * Replaces hardcoded Tailwind color classes with dynamic styles
 */
export const themedStyles = {
  /** Primary background (replaces bg-orange-500) */
  primaryBg: (theme: BusinessTheme): React.CSSProperties => ({
    backgroundColor: theme.primary,
  }),

  /** Primary background with hover (replaces bg-orange-500 hover:bg-orange-600) */
  primaryBgHover: (theme: BusinessTheme): React.CSSProperties => ({
    backgroundColor: theme.primary,
    // Note: hover states need to be handled via onMouseEnter/onMouseLeave or CSS variables
  }),

  /** Primary text color (replaces text-orange-500) */
  primaryText: (theme: BusinessTheme): React.CSSProperties => ({
    color: theme.primary,
  }),

  /** Primary border (replaces border-orange-500) */
  primaryBorder: (theme: BusinessTheme): React.CSSProperties => ({
    borderColor: theme.primary,
  }),

  /** Light border (replaces border-orange-300) */
  lightBorder: (theme: BusinessTheme): React.CSSProperties => ({
    borderColor: theme.primaryBorder,
  }),

  /** Light background (replaces bg-orange-50) */
  lightBg: (theme: BusinessTheme): React.CSSProperties => ({
    backgroundColor: theme.primaryLight,
  }),

  /** Brand text (replaces text-purple-600) */
  brandText: (theme: BusinessTheme): React.CSSProperties => ({
    color: theme.brandText,
  }),

  /** Ring/focus color (replaces ring-orange-200) */
  primaryRing: (theme: BusinessTheme): React.CSSProperties => ({
    // Ring needs special handling with box-shadow
    boxShadow: `0 0 0 3px ${theme.primaryRing}`,
  }),
};

/**
 * Combine multiple style objects
 */
export function combineStyles(
  ...styles: (React.CSSProperties | undefined)[]
): React.CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean));
}
