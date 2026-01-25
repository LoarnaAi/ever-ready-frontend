# Plan: Email & WhatsApp Messaging Integration

## Overview
Add email (Microsoft Graph API) and WhatsApp (Facebook Graph API) messaging to send booking confirmations after job creation in the home removal flow.

## Requirements Summary
- **Architecture**: Both Server Actions AND API routes
- **WhatsApp**: Send text messages only (simple)
- **Integration**: Home Removal booking flow
- **Notifications**: Both email AND WhatsApp after booking
- **Multi-tenant**: Per-business configuration support

---

## Files to Create

### 1. Types (`src/lib/messaging/types.ts`)
```typescript
export interface EmailConfig {
  enabled: boolean;
  clientId: string;
  clientSecret: string;
  tenantId: string;
  senderEmail: string;
}

export interface WhatsAppConfig {
  enabled: boolean;
  phoneNumberId: string;
  accessToken: string;
}

export interface MessagingConfig {
  email?: EmailConfig;
  whatsapp?: WhatsAppConfig;
}

export interface SendEmailInput {
  to: string;
  subject: string;
  body: string;
  bodyType?: 'Text' | 'HTML';
}

export interface SendWhatsAppInput {
  to: string;
  message: string;
}

export interface MessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface BookingConfirmationData {
  jobId: string;
  displayJobId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  countryCode: string;
  homeSize: string;
  collectionDate?: string;
  collectionAddress?: string;
  deliveryAddress?: string;
  busRef: string;
}
```

### 2. Config Loader (`src/lib/messaging/config-loader.ts`)
- Multi-tenant support via environment variables
- Business-specific vars: `MESSAGING_{BUSREF}_*`
- Falls back to default vars: `MESSAGING_*`

### 3. Server Actions

| File | Functions |
|------|-----------|
| `src/lib/actions/emailActions.ts` | `sendEmailAction()`, `sendBookingConfirmationEmailAction()` |
| `src/lib/actions/whatsappActions.ts` | `sendWhatsAppAction()`, `sendBookingConfirmationWhatsAppAction()` |
| `src/lib/actions/notificationActions.ts` | `sendBookingNotificationsAction()` - sends both in parallel |

### 4. API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/messaging/email` | POST | Send email (external access) |
| `/api/messaging/whatsapp` | POST | Send WhatsApp (external access) |

---

## Environment Variables (add to `.env.local`)

```bash
# Default Microsoft Graph (Email)
MESSAGING_EMAIL_ENABLED=true
MESSAGING_MS_CLIENT_ID=your-azure-app-client-id
MESSAGING_MS_CLIENT_SECRET=your-azure-app-client-secret
MESSAGING_MS_TENANT_ID=your-azure-tenant-id
MESSAGING_MS_SENDER_EMAIL=admin@ever-ready.ai

# Default WhatsApp (Facebook Graph)
MESSAGING_WHATSAPP_ENABLED=true
MESSAGING_WA_PHONE_NUMBER_ID=your-whatsapp-phone-number-id
MESSAGING_WA_ACCESS_TOKEN=your-whatsapp-access-token

# Business-specific overrides (optional)
# MESSAGING_LNDN_EMAIL_ENABLED=true
# MESSAGING_LNDN_MS_CLIENT_ID=...
```

---

## Integration Point

**File**: `src/app/home-removal/page.tsx`
**Location**: `handleStep6Submit` function (line 386-390)

After `createJobAction` succeeds, add notification call:

```typescript
if (result.success && result.jobId) {
  setSubmittedJobId(result.jobId);
  setDisplayJobId(result.displayJobId || null);
  setShowConfirmationModal(true);

  // ADD: Send notifications (fire-and-forget)
  const notificationData: BookingConfirmationData = {
    jobId: result.jobId,
    displayJobId: result.displayJobId || null,
    customerName: `${contactData.firstName} ${contactData.lastName}`,
    customerEmail: contactData.email,
    customerPhone: contactData.phone,
    countryCode: contactData.countryCode,
    homeSize: selectedService,
    collectionDate: savedData.collectionDate?.date,
    collectionAddress: savedData.collectionAddress?.address,
    deliveryAddress: savedData.deliveryAddress?.address,
    busRef: 'DEMO',
  };

  sendBookingNotificationsAction(notificationData)
    .then((r) => {
      if (!r.email.success) console.warn('Email failed:', r.email.error);
      if (!r.whatsapp.success) console.warn('WhatsApp failed:', r.whatsapp.error);
    })
    .catch(console.error);
}
```

---

## File Structure Summary

```
src/
├── lib/
│   ├── messaging/
│   │   ├── types.ts              # Messaging types
│   │   ├── config-loader.ts      # Multi-tenant config
│   │   └── index.ts              # Exports
│   └── actions/
│       ├── emailActions.ts       # Email server actions
│       ├── whatsappActions.ts    # WhatsApp server actions
│       └── notificationActions.ts # Combined notifications
└── app/
    └── api/
        └── messaging/
            ├── email/route.ts    # Email API endpoint
            └── whatsapp/route.ts # WhatsApp API endpoint
```

---

## Key Implementation Details

### Email (Microsoft Graph)
1. **Format**: Plain text with company branding/logo
2. Get access token via OAuth2 client credentials flow
3. POST to `https://graph.microsoft.com/v1.0/users/{senderEmail}/sendMail`
4. Returns 202 on success

### WhatsApp (Facebook Graph)
1. **Phone Format**: 12 digits including 2-digit country code (e.g., `447123456789`)
2. **Validation**: Validate phone number format before sending
3. POST to `https://graph.facebook.com/v18.0/{phoneNumberId}/messages`
4. Payload: `{ messaging_product: 'whatsapp', to: phone, type: 'text', text: { body } }`
5. Returns message ID on success

### Business Reference
- `busRef` is determined when job is completed (from confirmation modal)
- Passed through notification data

### Error Handling
- Notifications are fire-and-forget (don't block booking)
- Email and WhatsApp failures are independent
- All errors logged but not surfaced to user
- No rate limiting or retry logic

### Mock Mode
- Add `MESSAGING_MOCK_MODE=true` for testing without real credentials
- Logs messages instead of sending to external APIs

---

## Verification

### Manual Testing
```bash
# Test email API

curl -X POST http://localhost:3000/api/messaging/email \
    -H "Content-Type: application/json" \
    -d '{"busRef":"DEMO","to":"lohith.uvce@gmail.com","subject":"Test","bodyContent":"Hello"}'

curl -X POST http://localhost:3000/api/messaging/email \
    -H "Content-Type: application/json" \
    -d '{"busRef":"DEMO","to":"lohith.uvce@gmail.com","subject":"HTML
  Test","bodyType":"Html","bodyContent":"<h1>Hello</h1><p>This is <strong>HTML</strong>.</
  p>"}'

# Test WhatsApp API

curl -X POST http://localhost:3000/api/messaging/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"busRef":"DEMO","to":"+447123456789","message":"Test message"}'
```

### Integration Test
1. Set up valid credentials in `.env.local`
2. Complete a home removal booking flow
3. Verify email and WhatsApp received

---

## Critical Files to Modify

| File | Change |
|------|--------|
| `src/app/home-removal/page.tsx:386-390` | Add notification call after job creation |
| `.env.local` | Add messaging environment variables |
