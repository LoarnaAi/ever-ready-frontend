/** @format */

// Database types matching the Supabase schema from 02_tables.sql

export type JobStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed';

export type AddressType = 'collection' | 'delivery';

export type DateType = 'collection' | 'materials_delivery';

export type FurnitureListType = 'current' | 'initial';

// Database row types
export interface DbBusiness {
  id: string;
  slug: string;
  name: string;
  config: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
}

export interface DbJob {
  job_id: string;
  created_at: string;
  status: string;
  home_size: string;
  packing_service: string;
  dismantle_package: boolean;
  internal_notes: string;
  user_id: string | null;
  business_id: string | null;
  schema_version: number;
  extras: Record<string, unknown>;
}

export interface DbJobAddress {
  job_id: string;
  address_type: AddressType;
  postcode: string;
  address: string;
  floor: string;
  has_parking: boolean;
  has_lift: boolean;
  has_additional_address: boolean;
  extras: Record<string, unknown>;
}

export interface DbJobDate {
  job_id: string;
  date_type: DateType;
  service_at: string;
  time_slot: string;
  interval_type: string | null;
  extras: Record<string, unknown>;
}

export interface DbJobContactDetails {
  job_id: string;
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  phone: string;
  has_promo_code: boolean;
  promo_code: string | null;
  sign_up_for_news: boolean;
  agree_to_terms: boolean;
  extras: Record<string, unknown>;
}

export interface DbJobFurnitureItem {
  job_id: string;
  list_type: FurnitureListType;
  item_id: string;
  name: string;
  quantity: number;
  category: string | null;
  extras: Record<string, unknown>;
}

export interface DbJobPackingMaterial {
  job_id: string;
  material_id: string;
  name: string;
  quantity: number;
  extras: Record<string, unknown>;
}

export interface DbJobCostBreakdown {
  job_id: string;
  base_price: number;
  furniture_charge: number;
  packing_materials_charge: number;
  distance_surcharge: number;
  floor_surcharge: number;
  total: number;
  calculated_at: string;
  extras: Record<string, unknown>;
}

// Application-level types (matching tempDb.ts interface for compatibility)
export interface AddressDetails {
  postcode: string;
  address: string;
  floor: string;
  hasParking: boolean;
  hasLift: boolean;
  hasAdditionalAddress?: boolean;
}

export interface DateDetails {
  date: string;
  timeSlot: string;
  intervalType?: string;
}

export interface ContactDetails {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  hasPromoCode: boolean;
  promoCode: string;
  signUpForNews: boolean;
  agreeToTerms: boolean;
}

export interface FurnitureItem {
  itemId: string;
  name: string;
  quantity: number;
  category?: string;
}

export interface PackingMaterial {
  materialId: string;
  name: string;
  quantity: number;
}

export interface CostBreakdown {
  basePrice: number;
  furnitureCharge: number;
  packingMaterialsCharge: number;
  distanceSurcharge: number;
  floorSurcharge: number;
  total: number;
}

// Full job data structure for application use
export interface JobData {
  job_id: string;
  created_at: string;
  status: JobStatus;
  homeSize: string;
  furnitureItems: FurnitureItem[];
  initialFurnitureItems: FurnitureItem[];
  packingService: string;
  packingMaterials: PackingMaterial[];
  dismantlePackage: boolean;
  collectionAddress: AddressDetails | null;
  deliveryAddress: AddressDetails | null;
  collectionDate: DateDetails | null;
  materialsDeliveryDate: DateDetails | null;
  contact: ContactDetails;
  internalNotes: string;
  costBreakdown: CostBreakdown | null;
  businessId: string | null;
}

// Input type for creating a job (excludes auto-generated fields)
export type CreateJobInput = Omit<JobData, 'job_id' | 'created_at' | 'status' | 'internalNotes' | 'costBreakdown' | 'businessId'> & {
  businessId?: string | null;
};
