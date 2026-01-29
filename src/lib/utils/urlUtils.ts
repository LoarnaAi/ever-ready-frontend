/**
 * Generates a shareable job detail URL for notifications
 * @param busRef - Business reference code (e.g., 'DEMO', 'LNDN', 'LIMO')
 * @param displayJobId - Human-readable job ID (e.g., 'DEM-20250129-001')
 * @param fallbackJobId - UUID job ID to use if displayJobId is null
 * @returns Full URL to job detail page
 */
export function generateJobDetailUrl(
  busRef: string,
  displayJobId: string | null,
  fallbackJobId: string
): string {
  const businessSlug = busRef.toLowerCase();
  const jobId = displayJobId || fallbackJobId;
  return `https://demo.ever-ready.ai/${businessSlug}/home-removal/job-detail/${jobId}`;
}
