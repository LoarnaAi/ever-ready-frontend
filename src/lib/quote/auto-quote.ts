/** @format */

/**
 * Auto-quote calculation engine for removal services.
 * Ported from Python auto_quote.py - preserves all business rules exactly.
 *
 * Key features:
 * - Vehicle recommendation (Ford Transit Custom, Ford Transit 350 L3H3, Luton Low Loader)
 * - Dynamic crew sizing based on heavy items, customer assistance, access difficulty
 * - Time estimation with add-ons for parking/lift issues
 * - Zone-based pricing (local, non-local, nationwide)
 */

import {
  VehicleType,
  MoveZone,
  Occupancy,
  VolumeCategory,
  QuoteInputs,
  TimeEstimate,
  PriceBreakdown,
  VehicleRecommendation,
  QuoteResult,
} from './types';
import {
  VEHICLE_CAPACITIES,
  TIME_RULES,
  PRICING_RULES,
  isHourlyPricing,
  isDistancePricing,
} from './constants';

/** Round minutes to nearest half-hour (30-minute increment). */
export function roundToNearestHalfHour(minutes: number): number {
  const hoursRounded = Math.round(minutes / 30) * 0.5;
  return Math.floor(hoursRounded * 60);
}

/** Get maximum capacity for a vehicle type in cubic meters. */
export function getMaxCapacity(vehicleType: VehicleType): number {
  return VEHICLE_CAPACITIES[vehicleType] ?? 25.0;
}

/** Determine move zone based on distance (no M25 boundary check). */
export function getMoveZone(distanceMiles: number | null, localThreshold = 2.0): MoveZone {
  const safeDistance = distanceMiles ?? 0;
  return safeDistance <= localThreshold ? 'local' : 'non_local';
}

/** Determine occupancy level based on volume vs vehicle capacity. */
export function getOccupancy(volume: number, vehicleType: VehicleType): Occupancy {
  const maxCapacity = getMaxCapacity(vehicleType);
  const occupancyRatio = volume / maxCapacity;
  return occupancyRatio < 0.5 ? 'less_than_half' : 'greater_than_or_equal_half';
}

/** Categorize volume for pricing purposes. */
export function getVolumeCategory(volume: number): VolumeCategory {
  if (volume <= 6.2) return 'small';
  if (volume <= 13.19) return 'medium';
  if (volume <= 25) return 'large';
  return 'extra_large';
}

/** Calculate complexity multiplier for pricing. */
export function calculateComplexityFactor(
  volume: number,
  numHeavyItems: number,
  crewSize: number
): number {
  let baseFactor = 1.0;
  if (numHeavyItems > 0) baseFactor += 0.2;
  if (crewSize > 2) baseFactor += 0.15;
  if (volume > 20) baseFactor += 0.1;
  return baseFactor;
}

/**
 * Determine crew size based on vehicle type, item weights, and access conditions.
 */
export function getCrewSize(
  vehicleType: VehicleType,
  numHeavyItems: number,
  customerAssistance = false,
  difficultAccess = false
): number {
  const hasHeavyItems = numHeavyItems > 0;

  if (vehicleType === 'Ford Transit Custom') {
    return 1;
  }

  if (vehicleType === 'Ford Transit 350 L3H3') {
    if (!hasHeavyItems) return 1;
    if (hasHeavyItems && customerAssistance) return 1;
    if (hasHeavyItems && !customerAssistance) return 2;
    if (difficultAccess) return 2;
  }

  if (vehicleType === 'Luton Low Loader') {
    return difficultAccess ? 3 : 2;
  }

  return 2;
}

/**
 * Recommend appropriate vehicle type and crew size based on volume and item weights.
 * Preserves exact priority order from Python implementation.
 */
export function recommendVehicleAndCrew(
  volume: number,
  numHeavyItems = 0,
  customerAssistance = false,
  numRooms = 0,
  difficultAccess = false
): VehicleRecommendation {
  const hasHeavyItems = numHeavyItems > 0;
  const heavySuffix = numHeavyItems > 1 ? 's' : '';

  // Priority 1: Luton Low Loader for 2+ bedroom properties (always)
  if (numRooms >= 2) {
    const vehicleType: VehicleType = 'Luton Low Loader';
    const crewSize = getCrewSize(vehicleType, numHeavyItems, customerAssistance, difficultAccess);
    return {
      vehicleType,
      crewSize,
      minimumHours: '2 Hours (2 - 4 Hours)',
      reasoning:
        `${numRooms}-bed house requires Luton Low Loader` +
        (hasHeavyItems ? ` with ${numHeavyItems} heavy item${heavySuffix}` : ''),
    };
  }

  // Priority 2: Ford Transit Custom for studios with no heavy items (regardless of volume)
  if (numRooms === 0 && (!hasHeavyItems || customerAssistance)) {
    const vehicleType: VehicleType = 'Ford Transit Custom';
    const crewSize = getCrewSize(vehicleType, numHeavyItems, customerAssistance, difficultAccess);
    return {
      vehicleType,
      crewSize,
      minimumHours: '1 Hour',
      reasoning:
        'Studio flat, suitable for Ford Transit Custom' +
        (hasHeavyItems && customerAssistance
          ? ` with customer assistance for ${numHeavyItems} heavy item${heavySuffix}`
          : ''),
    };
  }

  // Priority 3: Volume check for large studios - use Luton if volume > 13.19m³
  if (numRooms === 0 && volume > 13.19) {
    const vehicleType: VehicleType = 'Luton Low Loader';
    const crewSize = getCrewSize(vehicleType, numHeavyItems, customerAssistance, difficultAccess);
    return {
      vehicleType,
      crewSize,
      minimumHours: '2 Hours (2 - 4 Hours)',
      reasoning:
        `Studio flat with large volume (${volume}m³) requires Luton Low Loader` +
        (hasHeavyItems ? ` with ${numHeavyItems} heavy item${heavySuffix}` : ''),
    };
  }

  // Priority 4: Ford Transit 350 for studios with heavy items (no customer assistance)
  if (numRooms === 0 && hasHeavyItems && !customerAssistance) {
    const vehicleType: VehicleType = 'Ford Transit 350 L3H3';
    const crewSize = getCrewSize(vehicleType, numHeavyItems, customerAssistance, difficultAccess);
    return {
      vehicleType,
      crewSize,
      minimumHours: '1 Hour (1-2)',
      reasoning: `Studio flat but ${numHeavyItems} heavy item${heavySuffix} require Ford Transit 350`,
    };
  }

  // Priority 5: Ford Transit 350 for 1-bedroom properties
  if (numRooms === 1) {
    const vehicleType: VehicleType = 'Ford Transit 350 L3H3';
    const crewSize = getCrewSize(vehicleType, numHeavyItems, customerAssistance, difficultAccess);
    return {
      vehicleType,
      crewSize,
      minimumHours: '1 Hour (1-2)',
      reasoning:
        '1-bed house requires Ford Transit 350' +
        (hasHeavyItems ? ` with ${numHeavyItems} heavy item${heavySuffix}` : ''),
    };
  }

  // Priority 6: Volume-based selection for edge cases
  if (volume >= 18) {
    const vehicleType: VehicleType = 'Luton Low Loader';
    const crewSize = getCrewSize(vehicleType, numHeavyItems, customerAssistance, difficultAccess);
    return {
      vehicleType,
      crewSize,
      minimumHours: '2 Hours (2 - 4 Hours)',
      reasoning:
        `Large volume (${volume}m³) requires Luton Low Loader` +
        (hasHeavyItems
          ? ` with ${numHeavyItems} heavy item${heavySuffix}`
          : ' for standard items'),
    };
  }

  if (volume > 13.19) {
    const vehicleType: VehicleType = 'Luton Low Loader';
    const crewSize = getCrewSize(vehicleType, numHeavyItems, customerAssistance, difficultAccess);
    return {
      vehicleType,
      crewSize,
      minimumHours: '2 Hours (2 - 4 Hours)',
      reasoning: `Volume (${volume}m³) exceeds Ford Transit 350 capacity, requires Luton Low Loader`,
    };
  }

  // Default fallback: Ford Transit 350 for medium volumes
  const vehicleType: VehicleType = 'Ford Transit 350 L3H3';
  const crewSize = getCrewSize(vehicleType, numHeavyItems, customerAssistance, difficultAccess);
  return {
    vehicleType,
    crewSize,
    minimumHours: '1 Hour (1-2)',
    reasoning:
      `Medium volume (${volume}m³) requires Ford Transit 350` +
      (hasHeavyItems
        ? ` with ${numHeavyItems} heavy item${heavySuffix}`
        : ' for light items'),
  };
}

/**
 * Estimate time required for the move including base time, add-ons, and driving time.
 */
export function estimateTime(
  inputs: QuoteInputs,
  vehicleType: VehicleType,
  crewSize: number,
  drivingMinutes = 0
): TimeEstimate {
  const drivingMinutesRounded = roundToNearestHalfHour(drivingMinutes);
  const timeRule = TIME_RULES[vehicleType][crewSize];
  const notes: string[] = [];

  // Determine base hours
  let baseHours: number;
  if (vehicleType === 'Luton Low Loader') {
    const occupancy = getOccupancy(inputs.totalVolume, vehicleType);
    if (occupancy === 'less_than_half') {
      baseHours = timeRule.baseHoursLtHalf!;
      notes.push('Base time: 2 hours (volume < 50% capacity)');
    } else {
      baseHours = timeRule.baseHoursGteHalf!;
      notes.push('Base time: 3 hours (volume ≥ 50% capacity)');
    }
  } else {
    baseHours = timeRule.baseHours!;
    notes.push(`Base time: ${baseHours} hour${baseHours !== 1 ? 's' : ''}`);
  }

  // Calculate add-ons
  let addOnMinutes = 0;
  if (inputs.noParking) {
    addOnMinutes += 30;
    notes.push('Add-on: +30 mins (no parking)');
  }
  if (inputs.noLift) {
    addOnMinutes += 30;
    notes.push('Add-on: +30 mins (no lift)');
  }

  // Add driving time note if present
  if (drivingMinutesRounded > 0) {
    notes.push(`Driving time: ${drivingMinutesRounded} mins`);
  }

  // Include driving time in total calculation
  const totalHours = baseHours + addOnMinutes / 60.0 + drivingMinutesRounded / 60.0;

  return {
    baseHours,
    addOnMinutes,
    drivingMinutes: drivingMinutesRounded,
    totalHours,
    notes,
  };
}

/**
 * Compute pricing breakdown based on vehicle, crew, zone, and time (hourly pricing).
 */
export function computePricing(
  vehicleType: VehicleType,
  crewSize: number,
  zone: MoveZone,
  time: TimeEstimate
): PriceBreakdown {
  const pricingRule = PRICING_RULES[vehicleType][crewSize][zone]!;

  if (!isHourlyPricing(pricingRule)) {
    throw new Error(`Expected hourly pricing for zone ${zone}`);
  }

  const { hourlyRate, extra30minRate, rateIsPerMover } = pricingRule;

  // Calculate base cost
  let baseCost = hourlyRate * time.baseHours;
  if (rateIsPerMover) baseCost *= crewSize;

  // Calculate extra time cost (only add-ons, not driving time)
  const extraMinutes = time.addOnMinutes;
  const extraHalfHours = extraMinutes > 0 ? Math.ceil(extraMinutes / 30) : 0;

  let extraCost = extraHalfHours * extra30minRate;
  if (rateIsPerMover) extraCost *= crewSize;

  const totalCost = baseCost + extraCost;

  // Generate notes
  const notes: string[] = [];
  const rateDesc = rateIsPerMover ? `per mover (×${crewSize})` : 'per crew';
  notes.push(`Base: £${hourlyRate} ${rateDesc} × ${time.baseHours}h = £${baseCost.toFixed(2)}`);

  if (extraHalfHours > 0) {
    notes.push(
      `Extra: £${extra30minRate} ${rateDesc} × ${extraHalfHours} × 30min = £${extraCost.toFixed(2)}`
    );
  }

  notes.push(`Zone: ${zone.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`);

  return {
    zone,
    hourlyRate,
    rateIsPerMover,
    crewSize,
    baseHours: time.baseHours,
    extra30minRate,
    extraHalfHours,
    baseCost,
    extraCost,
    totalCost,
    notes,
    pricePerMile: null,
    distanceMiles: null,
  };
}

/**
 * Compute nationwide pricing based on distance in miles.
 */
export function computePricingNational(
  vehicleType: VehicleType,
  crewSize: number,
  distanceMiles: number | null
): PriceBreakdown {
  const pricingRule = PRICING_RULES[vehicleType][crewSize]['nation_wide']!;

  if (!isDistancePricing(pricingRule)) {
    throw new Error('Expected distance pricing for nation_wide zone');
  }

  const { pricePerMile, rateIsPerMover } = pricingRule;
  const safeDistance = distanceMiles ?? 0;
  const totalCost = safeDistance * pricePerMile;

  const notes: string[] = [];
  notes.push(
    `Nationwide pricing: £${pricePerMile}/mile × ${safeDistance} miles = £${totalCost.toFixed(2)}`
  );
  notes.push('Zone: Nation Wide');

  return {
    zone: 'nation_wide',
    rateIsPerMover,
    crewSize,
    totalCost,
    notes,
    pricePerMile,
    distanceMiles: safeDistance,
    hourlyRate: null,
    baseHours: null,
    extra30minRate: null,
    extraHalfHours: null,
    baseCost: null,
    extraCost: null,
  };
}

/**
 * Main function to get vehicle and crew recommendation with time and pricing.
 * This is the primary entry point for the auto-quote system.
 */
export function getQuoteRecommendation(inputs: QuoteInputs): QuoteResult {
  const distanceMiles = inputs.distanceMiles ?? 0;

  // Get vehicle and crew recommendation
  const recommendation = recommendVehicleAndCrew(
    inputs.totalVolume,
    inputs.numHeavyItems,
    inputs.customerAssistance,
    inputs.numRooms,
    inputs.difficultAccess
  );

  const { vehicleType, crewSize } = recommendation;

  // Determine zone and occupancy (distance-only, no M25)
  const zone = getMoveZone(distanceMiles);
  const occupancy = getOccupancy(inputs.totalVolume, vehicleType);

  // Estimate time
  const timeEstimate = estimateTime(inputs, vehicleType, crewSize, inputs.drivingMinutes);

  // Compute pricing based on zone
  let priceBreakdown: PriceBreakdown;
  if (zone === 'nation_wide') {
    priceBreakdown = computePricingNational(vehicleType, crewSize, distanceMiles);
  } else {
    priceBreakdown = computePricing(vehicleType, crewSize, zone, timeEstimate);
  }

  // Build pricing dictionary based on zone type
  const pricing: QuoteResult['pricing'] = {
    zone,
    rateIsPerMover: priceBreakdown.rateIsPerMover,
    totalCost: priceBreakdown.totalCost,
    pricingNotes: priceBreakdown.notes,
  };

  if (zone === 'nation_wide') {
    pricing.pricePerMile = priceBreakdown.pricePerMile ?? undefined;
    pricing.distanceMiles = priceBreakdown.distanceMiles ?? undefined;
  } else {
    pricing.hourlyRate = priceBreakdown.hourlyRate ?? undefined;
    pricing.baseCost = priceBreakdown.baseCost ?? undefined;
    pricing.extraCost = priceBreakdown.extraCost ?? undefined;
  }

  // Enhance reasoning with zone information
  const enhancedReasoning = `${recommendation.reasoning} | Zone: ${zone.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())} | MoveZone: ${zone.toUpperCase().replace(' ', '_')}`;

  return {
    vehicleType,
    crewSize,
    reasoning: enhancedReasoning,
    timeEstimate: {
      baseHours: timeEstimate.baseHours,
      addOnMinutes: timeEstimate.addOnMinutes,
      drivingMinutes: timeEstimate.drivingMinutes,
      totalHours: timeEstimate.totalHours,
      notes: timeEstimate.notes,
    },
    pricing,
    occupancy,
    volumeCategory: getVolumeCategory(inputs.totalVolume),
    complexityFactor: calculateComplexityFactor(inputs.totalVolume, inputs.numHeavyItems, crewSize),
    suitableForSingleTrip: inputs.totalVolume <= getMaxCapacity(vehicleType),
    totalVolume: inputs.totalVolume,
    numHeavyItems: inputs.numHeavyItems,
  };
}
