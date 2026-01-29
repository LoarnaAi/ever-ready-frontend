# Add Shareable Job Detail Links to Notifications

## Overview
Add clickable job detail links to all three notification types: customer booking confirmation emails, admin WhatsApp messages, and admin job report emails. Links will use the format `https://demo.ever-ready.ai/{business}/home-removal/job-detail/{displayJobId}`.

## Implementation Steps

### 1. Create URL Utility Function
**File:** `src/lib/utils/urlUtils.ts` (NEW)

Create a centralized utility to generate job detail URLs:
- Function: `generateJobDetailUrl(busRef, displayJobId, fallbackJobId)`
- Lowercase the busRef (DEMO → demo, LNDN → lndn, LIMO → limo)
- Use displayJobId if available, otherwise fallback to jobId
- Return format: `https://demo.ever-ready.ai/{business}/home-removal/job-detail/{id}`

**Rationale:** DRY principle - single source of truth for URL generation across all notifications.

### 2. Update Customer Booking Confirmation Email
**File:** `src/lib/templates/bookingConfirmationHtml.ts`

Changes:
1. Import `generateJobDetailUrl` from `../utils/urlUtils`
2. Generate URL: `const jobDetailUrl = generateJobDetailUrl(data.busRef, data.displayJobId, data.jobId)`
3. Add button CSS to `<style>` section:
   ```css
   .btn-primary {
     display: inline-block;
     background-color: #f97316;
     color: #ffffff;
     padding: 12px 24px;
     border-radius: 6px;
     text-decoration: none;
     font-weight: bold;
     font-size: 14px;
   }
   ```
4. Add button after the blue note box:
   ```html
   <div style="text-align: center; margin-top: 24px;">
     <a href="${jobDetailUrl}" class="btn-primary">View Your Booking Details</a>
   </div>
   ```

**Visual:** Orange button matching email header, centered between note box and footer.

### 3. Update Admin WhatsApp Messages
**File:** `src/lib/actions/notificationActions.ts`

Changes in `buildAdminWhatsAppMessage()` function (lines 98-109):
1. Import `generateJobDetailUrl` from `../utils/urlUtils`
2. Generate URL: `const jobDetailUrl = generateJobDetailUrl(data.busRef, data.displayJobId, data.jobId)`
3. Add URL to end of message: `message += \`\\n\\nView full details: ${jobDetailUrl}\``

**Visual:** URL appears at end of WhatsApp message with blank line separator, will auto-link in WhatsApp.

### 4. Update Job Report Email
**File:** `src/lib/templates/jobReportHtml.ts`

Changes:
1. Import `generateJobDetailUrl` from `../utils/urlUtils`
2. Update function signature (line 3): Add `busRef: string` parameter
   ```typescript
   export function generateJobReportHtml(job: JobData, business: BusinessMaster, busRef: string): string {
   ```
3. Generate URL after formatTimeSlot helper (around line 16):
   ```typescript
   const jobDetailUrl = generateJobDetailUrl(busRef, job.display_job_id, job.job_id);
   ```
4. Add same button CSS to `<style>` section as customer email
5. Add button in job reference section (after job status badge)

**File:** `src/lib/actions/jobReportActions.ts`

Change line 46 to pass busRef:
```typescript
const htmlBody = generateJobReportHtml(job, business, busRef);
```

## Critical Files
- `src/lib/utils/urlUtils.ts` - **NEW** - URL generation utility
- `src/lib/templates/bookingConfirmationHtml.ts` - Customer email template
- `src/lib/actions/notificationActions.ts` - WhatsApp message builder
- `src/lib/templates/jobReportHtml.ts` - Job report email template
- `src/lib/actions/jobReportActions.ts` - Pass busRef parameter

## Testing & Verification

### Manual Testing
1. **Create a test booking** via the home removal form
2. **Check customer email**:
   - Verify orange "View Your Booking Details" button appears
   - Click button and verify it navigates to correct job detail page
3. **Check admin WhatsApp**:
   - Verify URL appears at bottom of message
   - Click URL and verify it navigates to job detail page
4. **Trigger job report email** (via admin action or test script):
   - Verify "View Full Job Details" button appears
   - Click button and verify navigation

### Test with Multiple Businesses
- Test booking for DEMO business → URL should be `demo.ever-ready.ai/demo/...`
- Test booking for LIMO business → URL should be `demo.ever-ready.ai/limo/...`
- Verify busRef lowercase conversion works correctly

### Test Script
Run existing test script with environment variables:
```bash
set -a; source .env.local; set +a; npx tsx test-job-report.ts
```

### Edge Cases to Verify
- Old jobs without displayJobId (should fallback to UUID jobId)
- All three business types (DEMO, LNDN, LIMO)
- Email rendering in different clients (Gmail, Outlook)
- WhatsApp URL auto-linking on mobile devices

## Technical Notes

### URL Format
- Domain: `https://demo.ever-ready.ai` (hardcoded)
- Route: `/{business}/home-removal/job-detail/{display_job_id}`
- Business slug is lowercase version of busRef
- The job detail page already supports both displayJobId and jobId lookups

### Null Safety
- displayJobId can be null for old jobs
- Function falls back to jobId (UUID)
- Job detail page `getJobAction()` handles both ID formats

### Styling Consistency
- Email button color (#f97316) matches email header
- Inline styles ensure compatibility across email clients
- WhatsApp message uses plain text URL (auto-linked by app)
