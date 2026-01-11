/** @format */

"use server";

import { supabase } from "../supabase";
import {
  CreateJobInput,
  JobData,
  JobStatus,
  AddressDetails,
  DateDetails,
  ContactDetails,
  FurnitureItem,
  PackingMaterial,
  CostBreakdown,
  DbJobAddress,
  DbJobDate,
  DbJobContactDetails,
  DbJobFurnitureItem,
  DbJobPackingMaterial,
  DbJobCostBreakdown,
} from "../database.types";

// Create a new job with all related data
export async function createJobAction(
  data: CreateJobInput
): Promise<{ success: boolean; jobId?: string; error?: string }> {
  try {
    // 1. Insert the main job record
    const { data: jobData, error: jobError } = await supabase
      .from("jobs")
      .insert({
        home_size: data.homeSize,
        packing_service: data.packingService || "",
        dismantle_package: data.dismantlePackage,
        status: "pending",
        internal_notes: "",
      })
      .select("job_id")
      .single();

    if (jobError) {
      console.error("Error creating job:", jobError);
      return { success: false, error: jobError.message };
    }

    const jobId = jobData.job_id;

    // 2. Insert addresses
    const addressInserts = [];
    if (data.collectionAddress) {
      addressInserts.push({
        job_id: jobId,
        address_type: "collection",
        postcode: data.collectionAddress.postcode,
        address: data.collectionAddress.address,
        floor: data.collectionAddress.floor,
        has_parking: data.collectionAddress.hasParking,
        has_lift: data.collectionAddress.hasLift,
        has_additional_address: data.collectionAddress.hasAdditionalAddress || false,
      });
    }
    if (data.deliveryAddress) {
      addressInserts.push({
        job_id: jobId,
        address_type: "delivery",
        postcode: data.deliveryAddress.postcode,
        address: data.deliveryAddress.address,
        floor: data.deliveryAddress.floor,
        has_parking: data.deliveryAddress.hasParking,
        has_lift: data.deliveryAddress.hasLift,
        has_additional_address: data.deliveryAddress.hasAdditionalAddress || false,
      });
    }

    if (addressInserts.length > 0) {
      const { error: addressError } = await supabase
        .from("job_addresses")
        .insert(addressInserts);

      if (addressError) {
        console.error("Error inserting addresses:", addressError);
        // Continue - non-critical
      }
    }

    // 3. Insert dates
    const dateInserts = [];
    if (data.collectionDate) {
      dateInserts.push({
        job_id: jobId,
        date_type: "collection",
        service_at: data.collectionDate.date,
        time_slot: data.collectionDate.timeSlot,
        interval_type: data.collectionDate.intervalType || null,
      });
    }
    if (data.materialsDeliveryDate) {
      dateInserts.push({
        job_id: jobId,
        date_type: "materials_delivery",
        service_at: data.materialsDeliveryDate.date,
        time_slot: data.materialsDeliveryDate.timeSlot,
        interval_type: data.materialsDeliveryDate.intervalType || null,
      });
    }

    if (dateInserts.length > 0) {
      const { error: dateError } = await supabase
        .from("job_dates")
        .insert(dateInserts);

      if (dateError) {
        console.error("Error inserting dates:", dateError);
        // Continue - non-critical
      }
    }

    // 4. Insert contact details
    const { error: contactError } = await supabase
      .from("job_contact_details")
      .insert({
        job_id: jobId,
        first_name: data.contact.firstName,
        last_name: data.contact.lastName,
        email: data.contact.email,
        country_code: data.contact.countryCode,
        phone: data.contact.phone,
        has_promo_code: data.contact.hasPromoCode,
        promo_code: data.contact.promoCode || null,
        sign_up_for_news: data.contact.signUpForNews,
        agree_to_terms: data.contact.agreeToTerms,
      });

    if (contactError) {
      console.error("Error inserting contact details:", contactError);
      // Continue - non-critical
    }

    // 5. Insert furniture items (current)
    if (data.furnitureItems.length > 0) {
      const furnitureInserts = data.furnitureItems.map((item) => ({
        job_id: jobId,
        list_type: "current",
        item_id: item.itemId,
        name: item.name,
        quantity: item.quantity,
        category: item.category || null,
      }));

      const { error: furnitureError } = await supabase
        .from("job_furniture_items")
        .insert(furnitureInserts);

      if (furnitureError) {
        console.error("Error inserting furniture items:", furnitureError);
      }
    }

    // 6. Insert initial furniture items
    if (data.initialFurnitureItems.length > 0) {
      const initialFurnitureInserts = data.initialFurnitureItems.map((item) => ({
        job_id: jobId,
        list_type: "initial",
        item_id: item.itemId,
        name: item.name,
        quantity: item.quantity,
        category: item.category || null,
      }));

      const { error: initialFurnitureError } = await supabase
        .from("job_furniture_items")
        .insert(initialFurnitureInserts);

      if (initialFurnitureError) {
        console.error("Error inserting initial furniture items:", initialFurnitureError);
      }
    }

    // 7. Insert packing materials
    if (data.packingMaterials.length > 0) {
      const packingInserts = data.packingMaterials.map((material) => ({
        job_id: jobId,
        material_id: material.materialId,
        name: material.name,
        quantity: material.quantity,
      }));

      const { error: packingError } = await supabase
        .from("job_packing_materials")
        .insert(packingInserts);

      if (packingError) {
        console.error("Error inserting packing materials:", packingError);
      }
    }

    return { success: true, jobId };
  } catch (error) {
    console.error("Unexpected error creating job:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Fetch a job by ID with all related data
export async function getJobAction(
  jobId: string
): Promise<{ success: boolean; data?: JobData; error?: string }> {
  try {
    // 1. Fetch the main job record
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("*")
      .eq("job_id", jobId)
      .single();

    if (jobError || !job) {
      return { success: false, error: "Job not found" };
    }

    // 2. Fetch addresses
    const { data: addresses } = await supabase
      .from("job_addresses")
      .select("*")
      .eq("job_id", jobId);

    // 3. Fetch dates
    const { data: dates } = await supabase
      .from("job_dates")
      .select("*")
      .eq("job_id", jobId);

    // 4. Fetch contact details
    const { data: contact } = await supabase
      .from("job_contact_details")
      .select("*")
      .eq("job_id", jobId)
      .single();

    // 5. Fetch furniture items
    const { data: furnitureItems } = await supabase
      .from("job_furniture_items")
      .select("*")
      .eq("job_id", jobId);

    // 6. Fetch packing materials
    const { data: packingMaterials } = await supabase
      .from("job_packing_materials")
      .select("*")
      .eq("job_id", jobId);

    // 7. Fetch cost breakdown
    const { data: costBreakdown } = await supabase
      .from("job_cost_breakdowns")
      .select("*")
      .eq("job_id", jobId)
      .single();

    // Transform to application data structure
    const collectionAddress = transformAddress(
      addresses?.find((a: DbJobAddress) => a.address_type === "collection")
    );
    const deliveryAddress = transformAddress(
      addresses?.find((a: DbJobAddress) => a.address_type === "delivery")
    );

    const collectionDate = transformDate(
      dates?.find((d: DbJobDate) => d.date_type === "collection")
    );
    const materialsDeliveryDate = transformDate(
      dates?.find((d: DbJobDate) => d.date_type === "materials_delivery")
    );

    const currentFurniture = (furnitureItems || [])
      .filter((f: DbJobFurnitureItem) => f.list_type === "current")
      .map(transformFurnitureItem);

    const initialFurniture = (furnitureItems || [])
      .filter((f: DbJobFurnitureItem) => f.list_type === "initial")
      .map(transformFurnitureItem);

    const transformedPackingMaterials = (packingMaterials || []).map(
      transformPackingMaterial
    );

    const jobData: JobData = {
      job_id: job.job_id,
      created_at: job.created_at,
      status: job.status as JobStatus,
      homeSize: job.home_size,
      furnitureItems: currentFurniture,
      initialFurnitureItems: initialFurniture,
      packingService: job.packing_service,
      packingMaterials: transformedPackingMaterials,
      dismantlePackage: job.dismantle_package,
      collectionAddress,
      deliveryAddress,
      collectionDate,
      materialsDeliveryDate,
      contact: transformContact(contact),
      internalNotes: job.internal_notes,
      costBreakdown: transformCostBreakdown(costBreakdown),
    };

    return { success: true, data: jobData };
  } catch (error) {
    console.error("Error fetching job:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Update job status
export async function updateJobStatusAction(
  jobId: string,
  status: JobStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("jobs")
      .update({ status })
      .eq("job_id", jobId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Update internal notes
export async function updateInternalNotesAction(
  jobId: string,
  notes: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("jobs")
      .update({ internal_notes: notes })
      .eq("job_id", jobId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Helper functions to transform database rows to application types
function transformAddress(row?: DbJobAddress): AddressDetails | null {
  if (!row) return null;
  return {
    postcode: row.postcode,
    address: row.address,
    floor: row.floor,
    hasParking: row.has_parking,
    hasLift: row.has_lift,
    hasAdditionalAddress: row.has_additional_address,
  };
}

function transformDate(row?: DbJobDate): DateDetails | null {
  if (!row) return null;
  return {
    date: row.service_at,
    timeSlot: row.time_slot,
    intervalType: row.interval_type || undefined,
  };
}

function transformContact(row?: DbJobContactDetails | null): ContactDetails {
  if (!row) {
    return {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "",
      phone: "",
      hasPromoCode: false,
      promoCode: "",
      signUpForNews: false,
      agreeToTerms: false,
    };
  }
  return {
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    countryCode: row.country_code,
    phone: row.phone,
    hasPromoCode: row.has_promo_code,
    promoCode: row.promo_code || "",
    signUpForNews: row.sign_up_for_news,
    agreeToTerms: row.agree_to_terms,
  };
}

function transformFurnitureItem(row: DbJobFurnitureItem): FurnitureItem {
  return {
    itemId: row.item_id,
    name: row.name,
    quantity: row.quantity,
    category: row.category || undefined,
  };
}

function transformPackingMaterial(row: DbJobPackingMaterial): PackingMaterial {
  return {
    materialId: row.material_id,
    name: row.name,
    quantity: row.quantity,
  };
}

function transformCostBreakdown(row?: DbJobCostBreakdown | null): CostBreakdown | null {
  if (!row) return null;
  return {
    basePrice: Number(row.base_price),
    furnitureCharge: Number(row.furniture_charge),
    packingMaterialsCharge: Number(row.packing_materials_charge),
    distanceSurcharge: Number(row.distance_surcharge),
    floorSurcharge: Number(row.floor_surcharge),
    total: Number(row.total),
  };
}

