/** @format */

// Temporary in-memory database for job storage
// This will be replaced with Supabase later

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

export type JobStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed';

export interface JobData {
  job_id: string;
  created_at: string;
  status: JobStatus;

  // Step 1
  homeSize: string;

  // Step 2
  furnitureItems: FurnitureItem[];
  initialFurnitureItems: FurnitureItem[];

  // Step 3
  packingService: string;
  packingMaterials: PackingMaterial[];
  dismantlePackage: boolean;

  // Step 4
  collectionAddress: AddressDetails | null;
  deliveryAddress: AddressDetails | null;

  // Step 5
  collectionDate: DateDetails | null;
  materialsDeliveryDate: DateDetails | null;

  // Step 6
  contact: ContactDetails;

  // Business fields
  internalNotes: string;
  costBreakdown: CostBreakdown | null;
}

// In-memory storage using Map for O(1) lookups
const jobsDb: Map<string, JobData> = new Map();

// Generate a UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Create a new job entry
export type CreateJobInput = Omit<JobData, 'job_id' | 'created_at' | 'status' | 'internalNotes' | 'costBreakdown'>;

export function createJob(data: CreateJobInput): string {
  const job_id = generateUUID();
  const job: JobData = {
    ...data,
    job_id,
    created_at: new Date().toISOString(),
    status: 'pending',
    internalNotes: '',
    costBreakdown: calculateCostBreakdown(data),
  };

  jobsDb.set(job_id, job);
  return job_id;
}

// Get a job by ID
export function getJob(jobId: string): JobData | null {
  return jobsDb.get(jobId) || null;
}

// Get all jobs (for admin/business view)
export function getAllJobs(): JobData[] {
  return Array.from(jobsDb.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

// Update job status
export function updateJobStatus(jobId: string, status: JobStatus): boolean {
  const job = jobsDb.get(jobId);
  if (!job) return false;

  job.status = status;
  jobsDb.set(jobId, job);
  return true;
}

// Update internal notes
export function updateInternalNotes(jobId: string, notes: string): boolean {
  const job = jobsDb.get(jobId);
  if (!job) return false;

  job.internalNotes = notes;
  jobsDb.set(jobId, job);
  return true;
}

// Calculate cost breakdown based on job data
function calculateCostBreakdown(data: CreateJobInput): CostBreakdown {
  // Base price by home size
  const basePrices: { [key: string]: number } = {
    '1-bedroom': 299,
    '2-bedrooms': 449,
    '3-bedrooms': 599,
    '4-bedrooms': 799,
  };

  const basePrice = basePrices[data.homeSize] || 399;

  // Calculate furniture charge (additional items beyond initial)
  let furnitureCharge = 0;
  const initialItemIds = new Set(data.initialFurnitureItems.map(item => item.itemId));
  data.furnitureItems.forEach(item => {
    if (!initialItemIds.has(item.itemId)) {
      // Additional item
      furnitureCharge += item.quantity * 15;
    } else {
      // Check if quantity increased
      const initialItem = data.initialFurnitureItems.find(i => i.itemId === item.itemId);
      if (initialItem && item.quantity > initialItem.quantity) {
        furnitureCharge += (item.quantity - initialItem.quantity) * 10;
      }
    }
  });

  // Packing materials charge
  let packingMaterialsCharge = 0;
  if (data.packingService === 'all-inclusive') {
    packingMaterialsCharge = 99;
  } else {
    const materialPrices: { [key: string]: number } = {
      'small-boxes': 2,
      'large-boxes': 4,
      'wardrobe-boxes': 8,
      'tape': 3,
      'bubble-wrap': 10,
      'paper-pack': 5,
      'stretch-wrap': 8,
    };
    data.packingMaterials.forEach(material => {
      const price = materialPrices[material.materialId] || 5;
      packingMaterialsCharge += material.quantity * price;
    });
  }

  if (data.dismantlePackage) {
    packingMaterialsCharge += 49;
  }

  // Floor surcharge
  let floorSurcharge = 0;
  const collectionFloor = parseInt(data.collectionAddress?.floor || '0');
  const deliveryFloor = parseInt(data.deliveryAddress?.floor || '0');

  if (collectionFloor > 0 && !data.collectionAddress?.hasLift) {
    floorSurcharge += collectionFloor * 15;
  }
  if (deliveryFloor > 0 && !data.deliveryAddress?.hasLift) {
    floorSurcharge += deliveryFloor * 15;
  }

  // Distance surcharge (placeholder - would need actual distance calculation)
  const distanceSurcharge = 0;

  const total = basePrice + furnitureCharge + packingMaterialsCharge + distanceSurcharge + floorSurcharge;

  return {
    basePrice,
    furnitureCharge,
    packingMaterialsCharge,
    distanceSurcharge,
    floorSurcharge,
    total,
  };
}

// Format job ID for display (e.g., JOB-a1b2c3d4)
export function formatJobId(jobId: string): string {
  return `JOB-${jobId.substring(0, 8).toUpperCase()}`;
}

// Get the short job reference from full UUID
export function getShortJobRef(jobId: string): string {
  return jobId.substring(0, 8).toUpperCase();
}
