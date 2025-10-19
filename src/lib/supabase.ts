/** @format */

import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl =
  process.env.SUPABASE_URL || "https://jvzaqzydaxarywfkwexi.supabase.co";
const supabaseKey =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2emFxenlkYXhhcnl3Zmt3ZXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMDgxMzYsImV4cCI6MjA1NjY4NDEzNn0.UL0RQ9Rnii0mdrMwgQUYwz3iJCc5uC_-6LnQ5-8sVeA";

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface RemovalFormData {
  // Step 1: Move Type
  moveType: string;

  // Step 2: Quote Form
  typeOfMove: string;
  movingArea: string;
  preferredDate: string;
  flexibleDates: string;

  // Step 3: Current Home
  currentPostcode: string;
  currentAddress: string;
  currentPropertyType: string;
  currentHasLift: string;
  currentRooms: {
    bedrooms: number;
    homeOffice: number;
    bathrooms: number;
    diningRoom: boolean;
    livingRoom: boolean;
    kitchen: boolean;
    terrace: boolean;
    garage: boolean;
  };

  // Step 4: Moving To
  newPostcode: string;
  newAddress: string;
  newPropertyType: string;
  newHasLift: string;

  // Step 5: Additional Info
  heavyItems: string;
  fragileItems: string;
  additionalServices: string[];
  comment: string;

  // Step 6: Contact Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export async function insertRemovalRecordSupabase(
  formData: RemovalFormData
): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("everreadyai_removals")
      .insert([
        {
          move_type: formData.moveType,
          type_of_move: formData.typeOfMove,
          moving_area: formData.movingArea,
          preferred_date: formData.preferredDate || null,
          flexible_dates: formData.flexibleDates,
          current_postcode: formData.currentPostcode,
          current_address: formData.currentAddress,
          current_property_type: formData.currentPropertyType,
          current_has_lift: formData.currentHasLift,
          current_rooms: formData.currentRooms,
          new_postcode: formData.newPostcode,
          new_address: formData.newAddress,
          new_property_type: formData.newPropertyType,
          new_has_lift: formData.newHasLift,
          heavy_items: formData.heavyItems,
          fragile_items: formData.fragileItems,
          additional_services: formData.additionalServices,
          comment: formData.comment,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insertion error:", error);
      throw error;
    }

    console.log("Successfully inserted record with ID:", data.id);
    return data.id;
  } catch (error) {
    console.error("Database insertion error:", error);
    throw error;
  }
}

// Validation functions
export function validateRemovalFormData(formData: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Required fields validation
  const requiredFields = [
    { field: "moveType", name: "Move Type" },
    { field: "firstName", name: "First Name" },
    { field: "lastName", name: "Last Name" },
    { field: "email", name: "Email" },
  ];

  requiredFields.forEach(({ field, name }) => {
    if (!formData[field] || formData[field].trim() === "") {
      errors.push(`${name} is required`);
    }
  });

  // Email validation
  if (formData.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.push("Invalid email format");
    }
  }

  // Phone validation (optional but if provided, should be valid)
  if (formData.phone && formData.phone.trim() !== "") {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ""))) {
      errors.push("Invalid phone number format");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
