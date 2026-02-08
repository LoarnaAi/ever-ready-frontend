/** @format */

'use server';

import { supabase } from '../supabase';
import { analyzeInventory, getQuoteRecommendation } from '../quote';
import type { QuoteResult, RemovalItem } from '../quote';

interface CalculateQuoteInput {
  busRef: string;
  furnitureItems: { itemId: string; quantity: number }[];
  homeSize: string;
  distanceMiles?: number;
  drivingMinutes?: number;
  noParking?: boolean;
  noLift?: boolean;
  customerAssistance?: boolean;
  difficultAccess?: boolean;
  jobId?: string;
}

interface CalculateQuoteResponse {
  success: boolean;
  data?: QuoteResult;
  error?: string;
}

/** Map homeSize string to numRooms integer */
function homeSizeToNumRooms(homeSize: string): number {
  const mapping: Record<string, number> = {
    'studio': 0,
    'mini-move': 0,
    '1-bedroom': 1,
    '2-bedrooms': 2,
    '3-bedrooms': 3,
    '4-bedrooms': 4,
  };
  return mapping[homeSize] ?? 0;
}

/** Fetch active removal items from Supabase */
async function fetchRemovalItems(): Promise<RemovalItem[]> {
  const { data, error } = await supabase
    .from('removal_items')
    .select('item_id, name, room, weight_kg, volume_m3, is_active')
    .eq('is_active', true);

  if (error) {
    throw new Error(`Failed to fetch removal items: ${error.message}`);
  }

  return (data ?? []) as RemovalItem[];
}

/** Persist quote result to job_quote table */
async function saveQuoteToDb(jobId: string, inputs: CalculateQuoteInput, result: QuoteResult) {
  const { error } = await supabase.from('job_quote').insert({
    job_id: jobId,
    total_volume: result.totalVolume,
    num_heavy_items: result.numHeavyItems,
    customer_assistance: inputs.customerAssistance ?? false,
    num_rooms: homeSizeToNumRooms(inputs.homeSize),
    difficult_access: inputs.difficultAccess ?? false,
    distance_miles: inputs.distanceMiles ?? 0,
    no_parking: inputs.noParking ?? false,
    no_lift: inputs.noLift ?? false,
    driving_minutes: inputs.drivingMinutes ?? 0,
    vehicle_type: result.vehicleType,
    crew_size: result.crewSize,
    reasoning: result.reasoning,
    base_hours: result.timeEstimate.baseHours,
    add_on_minutes: result.timeEstimate.addOnMinutes,
    total_hours: result.timeEstimate.totalHours,
    time_notes: result.timeEstimate.notes,
    zone: result.pricing.zone,
    hourly_rate: result.pricing.hourlyRate ?? null,
    rate_is_per_mover: result.pricing.rateIsPerMover,
    base_cost: result.pricing.baseCost ?? null,
    extra_cost: result.pricing.extraCost ?? null,
    total_cost: result.pricing.totalCost,
    pricing_notes: result.pricing.pricingNotes,
    price_per_mile: result.pricing.pricePerMile ?? null,
    occupancy: result.occupancy,
    volume_category: result.volumeCategory,
    complexity_factor: result.complexityFactor,
    suitable_for_single_trip: result.suitableForSingleTrip,
  });

  if (error) {
    console.error('[saveQuoteToDb] Failed to save quote:', error.message);
  }
}

/**
 * Calculate a removal quote based on furniture items and move details.
 * Fetches item data from Supabase, analyzes inventory, and runs the quote engine.
 */
export async function calculateQuoteAction(
  input: CalculateQuoteInput
): Promise<CalculateQuoteResponse> {
  try {
    // 1. Fetch removal items from Supabase
    const removalItems = await fetchRemovalItems();

    // 2. Analyze inventory to get totalVolume + numHeavyItems
    const inventory = analyzeInventory(input.furnitureItems, removalItems);

    // 3. Map homeSize to numRooms
    const numRooms = homeSizeToNumRooms(input.homeSize);

    // 4. Build QuoteInputs and run quote engine
    const quoteResult = getQuoteRecommendation({
      totalVolume: inventory.totalVolume,
      numHeavyItems: inventory.numHeavyItems,
      customerAssistance: input.customerAssistance ?? false,
      numRooms,
      difficultAccess: input.difficultAccess ?? false,
      distanceMiles: input.distanceMiles ?? 0,
      noParking: input.noParking ?? false,
      noLift: input.noLift ?? false,
      drivingMinutes: input.drivingMinutes ?? 0,
    });

    // 5. Optionally persist to DB
    if (input.jobId) {
      await saveQuoteToDb(input.jobId, input, quoteResult);
    }

    return { success: true, data: quoteResult };
  } catch (error) {
    console.error('[calculateQuoteAction] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error calculating quote',
    };
  }
}
