/** @format */

import { VehicleType, MoveZone } from './types';

// Vehicle maximum capacities in cubic meters
export const VEHICLE_CAPACITIES: Record<VehicleType, number> = {
  'Ford Transit Custom': 6.2,
  'Ford Transit 350 L3H3': 13.19,
  'Luton Low Loader': 25.0,
};

// Time rules: base hours by vehicle type and crew size
// For Luton, base hours depend on occupancy (lt_half vs gte_half)
export const TIME_RULES: Record<
  VehicleType,
  Record<number, { baseHours?: number; baseHoursLtHalf?: number; baseHoursGteHalf?: number }>
> = {
  'Ford Transit Custom': {
    1: { baseHours: 1.0 },
  },
  'Ford Transit 350 L3H3': {
    1: { baseHours: 1.0 },
    2: { baseHours: 1.0 },
  },
  'Luton Low Loader': {
    2: { baseHoursLtHalf: 2.0, baseHoursGteHalf: 3.0 },
    3: { baseHoursLtHalf: 2.0, baseHoursGteHalf: 3.0 },
  },
};

// Pricing rules by vehicle type, crew size, and zone
interface HourlyPricingRule {
  hourlyRate: number;
  extra30minRate: number;
  rateIsPerMover: boolean;
}

interface DistancePricingRule {
  pricePerMile: number;
  rateIsPerMover: boolean;
}

type PricingRule = HourlyPricingRule | DistancePricingRule;

export const PRICING_RULES: Record<
  VehicleType,
  Record<number, Partial<Record<MoveZone, PricingRule>>>
> = {
  'Ford Transit Custom': {
    1: {
      local: { hourlyRate: 45, extra30minRate: 19, rateIsPerMover: true },
      non_local: { hourlyRate: 50, extra30minRate: 22, rateIsPerMover: true },
      nation_wide: { pricePerMile: 1.70, rateIsPerMover: false },
    },
  },
  'Ford Transit 350 L3H3': {
    1: {
      local: { hourlyRate: 70, extra30minRate: 32.50, rateIsPerMover: false },
      non_local: { hourlyRate: 70, extra30minRate: 32.50, rateIsPerMover: false },
      nation_wide: { pricePerMile: 1.85, rateIsPerMover: false },
    },
    2: {
      local: { hourlyRate: 85, extra30minRate: 38, rateIsPerMover: false },
      non_local: { hourlyRate: 85, extra30minRate: 38, rateIsPerMover: false },
      nation_wide: { pricePerMile: 2.85, rateIsPerMover: false },
    },
  },
  'Luton Low Loader': {
    1: {
      nation_wide: { pricePerMile: 2.00, rateIsPerMover: false },
    },
    2: {
      local: { hourlyRate: 95, extra30minRate: 42, rateIsPerMover: false },
      non_local: { hourlyRate: 95, extra30minRate: 42, rateIsPerMover: false },
      nation_wide: { pricePerMile: 3.00, rateIsPerMover: false },
    },
    3: {
      local: { hourlyRate: 115, extra30minRate: 52.50, rateIsPerMover: false },
      non_local: { hourlyRate: 115, extra30minRate: 52.50, rateIsPerMover: false },
      nation_wide: { pricePerMile: 4.00, rateIsPerMover: false },
    },
  },
};

// Helper type guard for hourly pricing
export function isHourlyPricing(rule: PricingRule): rule is HourlyPricingRule {
  return 'hourlyRate' in rule;
}

// Helper type guard for distance pricing
export function isDistancePricing(rule: PricingRule): rule is DistancePricingRule {
  return 'pricePerMile' in rule;
}

// Heavy item threshold in kg
export const HEAVY_ITEM_THRESHOLD_KG = 15;
