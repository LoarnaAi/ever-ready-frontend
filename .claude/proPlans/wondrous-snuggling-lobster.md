# Plan: WhatsApp Marketing Template Endpoint

## Overview
Create a new endpoint to send the `enquiry_notification` WhatsApp marketing template with a dynamic button URL.

## Template Details
- **Name:** `enquiry_notification`
- **Type:** Marketing
- **Language:** `en_GB` (English UK)
- **Body:** "Hello There, You have a new enquiry." (static, no parameters)
- **Button URL:** `https://demo.ever-ready.ai/limo/home-removal/job-detail/{{1}}` (dynamic suffix)

## Implementation

### 1. Create New Route File
**File:** `src/app/api/messaging/whatsapp/enquiry-notification/route.ts`

```typescript
// POST handler accepting:
// - busRef: string (business reference for config lookup)
// - recipient: string (to_phone_number)
// - display_job_id: string (dynamic URL parameter)
```

### 2. Create Server Action
**File:** `src/lib/actions/whatsappTemplateActions.ts`

New function `sendEnquiryNotificationTemplateAction`:
- Loads WhatsApp config via existing `loadMessagingConfig`
- Validates phone number using existing pattern
- Builds template payload with button component
- Posts to Meta Graph API

### 3. Template Payload Structure
```json
{
  "messaging_product": "whatsapp",
  "to": "447123456789",
  "type": "template",
  "template": {
    "name": "enquiry_notification",
    "language": {
      "code": "en_GB"
    },
    "components": [
      {
        "type": "button",
        "sub_type": "url",
        "index": "0",
        "parameters": [
          {
            "type": "text",
            "text": "{display_job_id}"
          }
        ]
      }
    ]
  }
}
```

Note: No body component needed since the body has no parameters.

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/app/api/messaging/whatsapp/enquiry-notification/route.ts` | Create |
| `src/lib/actions/whatsappTemplateActions.ts` | Create |

## Request/Response Format

**Request:**
```json
POST /api/messaging/whatsapp/enquiry-notification
{
  "busRef": "LIMO",
  "recipient": "+447123456789",
  "display_job_id": "ABC123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "messageId": "wamid.xxx"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "error description"
}
```

## Verification
1. Run `npm run build` to ensure no TypeScript errors
2. Test with curl:
   ```bash
   curl -X POST http://localhost:3000/api/messaging/whatsapp/enquiry-notification \
     -H "Content-Type: application/json" \
     -d '{"busRef":"LIMO","recipient":"+447123456789","display_job_id":"TEST123"}'
   ```
3. With `MESSAGING_MOCK_MODE=true`, verify logged payload structure
4. With mock mode off (if credentials available), verify message delivery
