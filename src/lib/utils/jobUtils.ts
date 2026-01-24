/** @format */

/**
 * Format job ID for display
 * New format: Uses display_job_id directly (e.g., "DEMO-00001")
 * Legacy format: Falls back to "JOB-{8 chars of UUID}" for old jobs
 *
 * @param jobId - The internal UUID job ID
 * @param displayJobId - The human-readable job ID (e.g., "DEMO-00001")
 */
export function formatJobId(jobId: string, displayJobId?: string | null): string {
  // If we have the new display_job_id format, use it directly
  if (displayJobId) {
    return displayJobId;
  }

  // Legacy fallback for old UUID-based job IDs
  if (jobId && jobId.includes('-') && jobId.length > 10) {
    // Looks like a UUID, use old format
    return `JOB-${jobId.substring(0, 8).toUpperCase()}`;
  }

  // Already formatted or unknown format, return as-is
  return jobId;
}

/**
 * Parse a display job ID to extract bus_ref and sequence
 * @param displayJobId - The display job ID (e.g., "DEMO-00001")
 * @returns Object with busRef and sequence, or null if invalid format
 */
export function parseDisplayJobId(displayJobId: string): { busRef: string; sequence: number } | null {
  const match = displayJobId.match(/^([A-Z]{4})-(\d{5})$/);
  if (!match) return null;

  return {
    busRef: match[1],
    sequence: parseInt(match[2], 10),
  };
}

/**
 * Get the short job reference
 * For new format: returns the display_job_id directly
 * For legacy: returns first 8 chars of UUID in uppercase
 */
export function getShortJobRef(jobId: string, displayJobId?: string | null): string {
  if (displayJobId) {
    return displayJobId;
  }
  return jobId.substring(0, 8).toUpperCase();
}
