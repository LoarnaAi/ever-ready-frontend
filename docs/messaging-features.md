# Messaging Features Guide

## Overview
The messaging system supports email (Microsoft Graph) and WhatsApp (Meta Graph) for booking confirmations and job report notifications. It is configured per business via environment variables and can run in a mock mode for safe local testing.

## Entry Points

### Server Actions
- `src/lib/actions/emailActions.ts`
  - `sendEmailAction` sends email via Microsoft Graph.
  - `sendBookingConfirmationEmailAction` builds a plain-text confirmation email.
- `src/lib/actions/whatsappActions.ts`
  - `sendWhatsAppAction` sends WhatsApp messages via Meta Graph.
  - `sendBookingConfirmationWhatsAppAction` builds a WhatsApp confirmation message.
- `src/lib/actions/notificationActions.ts`
  - `sendBookingNotificationsAction` sends both email and WhatsApp in parallel.
- `src/lib/actions/jobReportActions.ts`
  - `sendJobReportToAdminsAction` sends job report emails with a PDF attachment.

### API Routes
- `src/app/api/messaging/email/route.ts` accepts `busRef`, `to`, `subject`, `bodyContent`, and optional `bodyType`.
- `src/app/api/messaging/whatsapp/route.ts` accepts `busRef`, `to`, and `message`.

## Configuration
Configuration is resolved per business reference using `src/lib/messaging/config-loader.ts`. Each value can be set globally or overridden per business by prefixing with `MESSAGING_{BUSREF}_`.

### Global Email Settings
- `MESSAGING_EMAIL_ENABLED` = `true|false`
- `MESSAGING_MS_CLIENT_ID`
- `MESSAGING_MS_CLIENT_SECRET`
- `MESSAGING_MS_TENANT_ID`
- `MESSAGING_MS_SENDER_EMAIL`

### Global WhatsApp Settings
- `MESSAGING_WHATSAPP_ENABLED` = `true|false`
- `MESSAGING_WA_PHONE_NUMBER_ID`
- `MESSAGING_WA_ACCESS_TOKEN`

### Per-Business Overrides
- Email: `MESSAGING_{BUSREF}_EMAIL_ENABLED`, `MESSAGING_{BUSREF}_MS_CLIENT_ID`, `MESSAGING_{BUSREF}_MS_CLIENT_SECRET`, `MESSAGING_{BUSREF}_MS_TENANT_ID`, `MESSAGING_{BUSREF}_MS_SENDER_EMAIL`
- WhatsApp: `MESSAGING_{BUSREF}_WHATSAPP_ENABLED`, `MESSAGING_{BUSREF}_WA_PHONE_NUMBER_ID`, `MESSAGING_{BUSREF}_WA_ACCESS_TOKEN`

### Mock Mode
Set `MESSAGING_MOCK_MODE=true` to log outbound requests instead of sending real messages.

## Email Messaging
- Uses Microsoft Graph `sendMail` endpoint.
- Supports `Text` and `HTML` bodies via `SendEmailInput.bodyType`.
- Supports file attachments via `SendEmailInput.attachments` (base64 content).

### Job Report Emails
- Triggered by `sendJobReportToAdminsAction` after job creation.
- Loads job data and business details, builds an HTML email body, and generates a PDF attachment.
- Sends to the business email stored in `business_master.bus_email` via `getBusinessMaster`.

## WhatsApp Messaging
- Uses the WhatsApp Cloud API (Meta Graph).
- `sendWhatsAppAction` validates numbers as 12 digits including a 2-digit country code.
- `sendBookingConfirmationWhatsAppAction` builds a formatted confirmation message.

## Testing
- Use the local API routes under `/api/messaging` while running the dev server.
- Example curl commands are available in `docs/messaging-api.md`.

## Troubleshooting
- Missing config values will return a "not configured" error.
- WhatsApp numbers must be digits only and exactly 12 digits (includes a 2-digit country code).
- Microsoft Graph errors are returned with the HTTP status and body for easier debugging.
