/** @format */

// Vehicle types available for removal jobs
export type VehicleType =
  | 'Ford Transit Custom'
  | 'Ford Transit 350 L3H3'
  | 'Luton Low Loader';

// Move zone based on distance
export type MoveZone = 'local' | 'non_local' | 'nation_wide';

// Vehicle occupancy level
export type Occupancy = 'less_than_half' | 'greater_than_or_equal_half';

// Volume category for pricing
export type VolumeCategory = 'small' | 'medium' | 'large' | 'extra_large';

// Input parameters for quote generation
export interface QuoteInputs {
  totalVolume: number;
  numHeavyItems: number;
  customerAssistance: boolean;
  numRooms: number;
  difficultAccess: boolean;
  distanceMiles: number;
  noParking: boolean;
  noLift: boolean;
  drivingMinutes: number;
}

// Time estimation breakdown
export interface TimeEstimate {
  baseHours: number;
  addOnMinutes: number;
  drivingMinutes: number;
  totalHours: number;
  notes: string[];
}

// Pricing breakdown
export interface PriceBreakdown {
  zone: MoveZone;
  rateIsPerMover: boolean;
  crewSize: number;
  totalCost: number;
  notes: string[];
  // Hourly pricing fields (optional for NATION_WIDE)
  hourlyRate: number | null;
  baseHours: number | null;
  extra30minRate: number | null;
  extraHalfHours: number | null;
  baseCost: number | null;
  extraCost: number | null;
  // Distance pricing fields (optional for LOCAL/NON_LOCAL)
  pricePerMile: number | null;
  distanceMiles: number | null;
}

// Vehicle and crew recommendation result
export interface VehicleRecommendation {
  vehicleType: VehicleType;
  crewSize: number;
  minimumHours: string;
  reasoning: string;
}

// Full quote recommendation result
export interface QuoteResult {
  vehicleType: VehicleType;
  crewSize: number;
  reasoning: string;
  timeEstimate: {
    baseHours: number;
    addOnMinutes: number;
    drivingMinutes: number;
    totalHours: number;
    notes: string[];
  };
  pricing: {
    zone: MoveZone;
    rateIsPerMover: boolean;
    totalCost: number;
    pricingNotes: string[];
    hourlyRate?: number;
    baseCost?: number;
    extraCost?: number;
    pricePerMile?: number;
    distanceMiles?: number;
  };
  occupancy: Occupancy;
  volumeCategory: VolumeCategory;
  complexityFactor: number;
  suitableForSingleTrip: boolean;
  totalVolume: number;
  numHeavyItems: number;
}

// Inventory analysis result
export interface InventoryAnalysis {
  totalVolume: number;
  numHeavyItems: number;
  totalItems: number;
  itemBreakdown: {
    itemId: string;
    name: string;
    quantity: number;
    weightKg: number;
    volumeM3: number;
    totalWeight: number;
    totalVolume: number;
    isHeavy: boolean;
  }[];
}

// Removal item from database
export interface RemovalItem {
  item_id: string;
  name: string;
  room: string;
  weight_kg: number;
  volume_m3: number;
  is_active: boolean;
}
