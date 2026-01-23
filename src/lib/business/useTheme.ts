'use client';

import { useOptionalBusinessConfig } from './BusinessContext';
import { DEFAULT_THEME, DEFAULT_FEATURES } from './types';
import type { BusinessTheme, BusinessFeatures } from './types';

/**
 * Hook to get theme colors with defaults
 * Works both inside and outside BusinessProvider
 */
export function useTheme() {
  const context = useOptionalBusinessConfig();

  const theme: BusinessTheme = context?.theme ?? DEFAULT_THEME;
  const features: BusinessFeatures = context?.config.features ?? DEFAULT_FEATURES;
  const businessName = context?.config.name ?? 'Your Business Name Goes Here';

  return {
    theme,
    features,
    businessName,
    // Style helpers for common patterns
    styles: {
      // Primary button style
      primaryButton: {
        backgroundColor: theme.primary,
        color: 'white',
      } as React.CSSProperties,
      // Primary button hover (use with onMouseEnter/onMouseLeave)
      primaryButtonHover: {
        backgroundColor: theme.primaryHover,
      } as React.CSSProperties,
      // Primary text color
      primaryText: {
        color: theme.primary,
      } as React.CSSProperties,
      // Brand text (for business name)
      brandText: {
        color: theme.brandText,
      } as React.CSSProperties,
      // Light background
      lightBg: {
        backgroundColor: theme.primaryLight,
      } as React.CSSProperties,
      // Primary border
      primaryBorder: {
        borderColor: theme.primary,
      } as React.CSSProperties,
      // Light border
      lightBorder: {
        borderColor: theme.primaryBorder,
      } as React.CSSProperties,
      // Progress bar
      progressBar: {
        backgroundColor: theme.primary,
      } as React.CSSProperties,
      // Progress bar gradient
      progressBarGradient: {
        background: `linear-gradient(to right, ${theme.primary}, ${theme.primaryHover})`,
      } as React.CSSProperties,
      // Selected state (border + light bg)
      selected: {
        borderColor: theme.primary,
        backgroundColor: theme.primaryLight,
      } as React.CSSProperties,
      // Focus ring style (for inputs)
      focusRing: {
        '--tw-ring-color': theme.primary,
        borderColor: theme.primary,
      } as React.CSSProperties,
    },
  };
}

export default useTheme;
