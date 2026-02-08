/** @format */

import { InventoryAnalysis, RemovalItem } from './types';
import { HEAVY_ITEM_THRESHOLD_KG } from './constants';

/**
 * Analyze inventory to determine total volume, heavy item count, and per-item breakdown.
 * Bridges the gap between frontend furniture quantities and the quote engine's volume-based inputs.
 *
 * @param items - Array of { itemId, quantity } from the frontend form
 * @param removalItems - Lookup data from the removal_items table
 * @returns InventoryAnalysis with totals and per-item breakdown
 */
export function analyzeInventory(
  items: { itemId: string; quantity: number }[],
  removalItems: RemovalItem[]
): InventoryAnalysis {
  // Build lookup map for O(1) access
  const itemLookup = new Map<string, RemovalItem>();
  for (const ri of removalItems) {
    itemLookup.set(ri.item_id, ri);
  }

  let totalVolume = 0;
  let numHeavyItems = 0;
  let totalItems = 0;
  const itemBreakdown: InventoryAnalysis['itemBreakdown'] = [];

  for (const { itemId, quantity } of items) {
    if (quantity <= 0) continue;

    const dbItem = itemLookup.get(itemId);
    if (!dbItem) {
      // Item not found in DB - skip but log
      console.warn(`[analyzeInventory] Unknown item_id: "${itemId}" - skipping`);
      continue;
    }

    const itemTotalWeight = dbItem.weight_kg * quantity;
    const itemTotalVolume = dbItem.volume_m3 * quantity;
    const isHeavy = dbItem.weight_kg > HEAVY_ITEM_THRESHOLD_KG;

    totalVolume += itemTotalVolume;
    if (isHeavy) numHeavyItems += quantity;
    totalItems += quantity;

    itemBreakdown.push({
      itemId,
      name: dbItem.name,
      quantity,
      weightKg: dbItem.weight_kg,
      volumeM3: dbItem.volume_m3,
      totalWeight: itemTotalWeight,
      totalVolume: itemTotalVolume,
      isHeavy,
    });
  }

  // Round to avoid floating point issues
  totalVolume = Math.round(totalVolume * 1000) / 1000;

  return {
    totalVolume,
    numHeavyItems,
    totalItems,
    itemBreakdown,
  };
}
