/** @format */

"use server";

import { supabase } from "../supabase";
import { BusinessMaster, DbBusinessMaster } from "../database.types";

/**
 * Fetch business master data by busRef
 * @param busRef - 4-char business reference (e.g., "DEMO", "LNDN")
 */
export async function getBusinessMaster(
  busRef: string
): Promise<{ success: boolean; data?: BusinessMaster; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("business_master")
      .select("*")
      .eq("bus_ref", busRef.toUpperCase())
      .single();

    if (error || !data) {
      console.error("Error fetching business master:", error);
      return { success: false, error: error?.message || "Business not found" };
    }

    return {
      success: true,
      data: transformBusinessMaster(data as DbBusinessMaster),
    };
  } catch (error) {
    console.error("Unexpected error fetching business master:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Transform database row to application type
 */
function transformBusinessMaster(row: DbBusinessMaster): BusinessMaster {
  return {
    busRef: row.bus_ref,
    busId: row.bus_id,
    name: row.bus_name,
    email: row.bus_email,
    admins: row.admins,
    address: {
      houseNumber: row.house_number,
      buildingName: row.building_name,
      streetName: row.street_name,
      city: row.city,
      postcode: row.postcode,
    },
    location: {
      lat: row.lat,
      lon: row.lon,
    },
  };
}
