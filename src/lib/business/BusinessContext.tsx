'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { BusinessConfig, BusinessTheme } from './types';
import { DEFAULT_THEME, DEFAULT_FEATURES } from './types';

interface BusinessContextValue {
  config: BusinessConfig;
  theme: BusinessTheme;
  /** Get inline style object for primary background */
  getPrimaryBgStyle: () => React.CSSProperties;
  /** Get inline style object for primary text */
  getPrimaryTextStyle: () => React.CSSProperties;
  /** Get inline style object for primary border */
  getPrimaryBorderStyle: () => React.CSSProperties;
  /** Get inline style object for light background */
  getLightBgStyle: () => React.CSSProperties;
  /** Get inline style object for brand text */
  getBrandTextStyle: () => React.CSSProperties;
}

const BusinessContext = createContext<BusinessContextValue | null>(null);

/**
 * Default demo business config matching current theme
 * Business name and contact info are stored in business_master table
 */
export const DEMO_CONFIG: BusinessConfig = {
  busRef: 'DEMO',
  busName: 'Demo Removals',
  theme: DEFAULT_THEME,
  features: DEFAULT_FEATURES,
};

interface BusinessProviderProps {
  config: BusinessConfig;
  children: React.ReactNode;
}

export function BusinessProvider({ config, children }: BusinessProviderProps) {
  const value = useMemo<BusinessContextValue>(() => {
    const theme = config.theme;

    return {
      config,
      theme,
      getPrimaryBgStyle: () => ({ backgroundColor: theme.primary }),
      getPrimaryTextStyle: () => ({ color: theme.primary }),
      getPrimaryBorderStyle: () => ({ borderColor: theme.primaryBorder }),
      getLightBgStyle: () => ({ backgroundColor: theme.primaryLight }),
      getBrandTextStyle: () => ({ color: theme.brandText }),
    };
  }, [config]);

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
}

/**
 * Hook to access business configuration
 * @throws Error if used outside BusinessProvider
 */
export function useBusinessConfig(): BusinessContextValue {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusinessConfig must be used within a BusinessProvider');
  }
  return context;
}

/**
 * Hook to safely access business configuration (returns null if not in provider)
 */
export function useOptionalBusinessConfig(): BusinessContextValue | null {
  return useContext(BusinessContext);
}
