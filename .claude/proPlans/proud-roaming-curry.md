# Plan: Email Job Report as PDF/HTML After Submission

## Summary

After a job is submitted via the removal form, send an HTML email with a PDF attachment of the job report to all business admins (from `BusinessMaster.admins[]`).

---

## Implementation Steps

### Step 1: Install PDF Library

```bash
npm install @react-pdf/renderer
```

Using `@react-pdf/renderer` for server-side PDF generation from React components (no headless browser required).

---

### Step 2: Add Attachment Support to Email Types

**File:** `src/lib/messaging/types.ts`

Add new interface and update `SendEmailInput`:

```typescript
export interface EmailAttachment {
    filename: string;
    content: string;       // Base64 encoded
    contentType: string;   // e.g., 'application/pdf'
}

export interface SendEmailInput {
    to: string;
    subject: string;
    body: string;
    bodyType?: 'Text' | 'HTML';
    attachments?: EmailAttachment[];  // NEW
}
```

---

### Step 3: Update Email Action for Attachments

**File:** `src/lib/actions/emailActions.ts`

Modify the Microsoft Graph API request to include attachments:

```typescript
body: JSON.stringify({
    message: {
        subject: input.subject,
        body: {
            contentType: input.bodyType || 'Text',
            content: input.body,
        },
        toRecipients: [{ emailAddress: { address: input.to } }],
        // NEW: Add attachments
        attachments: input.attachments?.map(att => ({
            '@odata.type': '#microsoft.graph.fileAttachment',
            name: att.filename,
            contentType: att.contentType,
            contentBytes: att.content,
        })) || [],
    },
}),
```

---

### Step 4: Create PDF Component

**New File:** `src/lib/pdf/JobReportPdf.tsx`

React component using `@react-pdf/renderer` that mirrors the job summary page layout:
- Header with job ID and status badge
- Service details (home size, item count)
- Furniture items grid
- Packing services (conditional)
- Addresses (collection/delivery)
- Schedule
- Contact information
- Footer with business name

**New File:** `src/lib/pdf/styles.ts`

StyleSheet definitions for the PDF document.

---

### Step 5: Create HTML Email Template

**New File:** `src/lib/templates/jobReportHtml.ts`

Function `generateJobReportHtml(job, business)` that returns styled HTML email with:
- Header banner with "New Booking Received"
- Job reference and status
- Service details summary
- Customer contact info
- Addresses
- Note that full details are in PDF attachment
- Footer with business name

Uses inline CSS for email client compatibility.

---

### Step 6: Create Job Report Action

**New File:** `src/lib/actions/jobReportActions.ts`

```typescript
export async function sendJobReportToAdminsAction(
    jobId: string,
    busRef: string
): Promise<JobReportResult>
```

Flow:
1. Fetch job data via `getJobAction(jobId)`
2. Fetch business data via `getBusinessMaster(busRef)` to get admins list
3. Generate PDF using `renderToBuffer(<JobReportPdf job={job} />)`
4. Generate HTML email body
5. Send to each admin email in parallel with HTML body + PDF attachment
6. Return success/failure status with sent list and errors

---

### Step 7: Integrate into Form Submission

**File:** `src/app/[business]/home-removal/page.tsx`

In `handleStep6Submit`, after successful job creation:

```typescript
if (result.success && result.jobId) {
    // Existing code...

    // NEW: Send admin job report with PDF
    sendJobReportToAdminsAction(result.jobId, config.busRef)
        .then((r) => {
            if (r.success) console.log('Job report sent to:', r.sentTo);
            if (r.errors.length > 0) console.warn('Job report errors:', r.errors);
        })
        .catch(console.error);
}
```

Also update `src/app/home-removal/page.tsx` if applicable.

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/lib/pdf/JobReportPdf.tsx` | PDF document component |
| `src/lib/pdf/styles.ts` | PDF stylesheet |
| `src/lib/templates/jobReportHtml.ts` | HTML email template |
| `src/lib/actions/jobReportActions.ts` | Main action to generate and send |

## Files to Modify

| File | Changes |
|------|---------|
| `src/lib/messaging/types.ts` | Add `EmailAttachment` interface |
| `src/lib/actions/emailActions.ts` | Add attachment support to Graph API call |
| `src/app/[business]/home-removal/page.tsx` | Call `sendJobReportToAdminsAction` after job creation |

---

## Error Handling

- **No admins configured:** Return error, log warning
- **PDF generation fails:** Log error, optionally send HTML-only email
- **Email fails for one admin:** Continue sending to others, collect errors
- **Job/Business not found:** Return early with descriptive error

---

## Verification

1. **Manual Test:**
   - Submit a job via the form
   - Verify admin emails receive the HTML email with PDF attachment
   - Open PDF and verify all job details are correct

2. **Mock Mode Test:**
   - Set `MESSAGING_MOCK_MODE=true`
   - Submit job and verify console logs show email would be sent

3. **PDF Preview (optional):**
   - Create temporary API route to render PDF for visual inspection during development
