import type { BusinessTheme } from './types';
import type React from 'react';

/**
 * Calculate relative luminance of a hex color
 * Based on WCAG 2.0 guidelines
 * @returns luminance value between 0 (black) and 1 (white)
 */
export function getRelativeLuminance(hexColor: string): number {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Apply gamma correction
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const rLinear = toLinear(r);
  const gLinear = toLinear(g);
  const bLinear = toLinear(b);

  // Calculate luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Check if a color is considered "light" (would have poor contrast on light backgrounds)
 * @param hexColor - hex color string (with or without #)
 * @param threshold - luminance threshold (default 0.5, higher = more colors considered light)
 */
export function isLightColor(hexColor: string, threshold = 0.5): boolean {
  return getRelativeLuminance(hexColor) > threshold;
}

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
    '--theme-primary-button-text': theme.primaryButtonText,
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

  /** Primary button text color (contrasting to primary background) */
  primaryButtonText: (theme: BusinessTheme): React.CSSProperties => ({
    color: theme.primaryButtonText,
  }),

  /**
   * Primary text with automatic contrast background for light theme colors
   * Adds a dark background when primary color is light (e.g., yellow)
   */
  primaryTextLabel: (theme: BusinessTheme): React.CSSProperties => {
    const needsBackground = isLightColor(theme.primary);
    if (needsBackground) {
      return {
        color: theme.primary,
        backgroundColor: '#1f2937', // gray-800
        padding: '2px 8px',
        borderRadius: '4px',
        display: 'inline-block',
      };
    }
    return {
      color: theme.primary,
    };
  },
};

/**
 * Combine multiple style objects
 */
export function combineStyles(
  ...styles: (React.CSSProperties | undefined)[]
): React.CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean));
}
