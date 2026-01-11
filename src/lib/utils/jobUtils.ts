/** @format */

// Format job ID for display (e.g., JOB-A1B2C3D4)
export function formatJobId(jobId: string): string {
  return `JOB-${jobId.substring(0, 8).toUpperCase()}`;
}

// Get the short job reference from full UUID
export function getShortJobRef(jobId: string): string {
  return jobId.substring(0, 8).toUpperCase();
}
