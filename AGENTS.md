# Repository Guidelines
Note: iOS input zoom is avoided by setting mobile input/select font size to 16px (e.g., `text-[16px] sm:text-sm`).

## Project Structure & Module Organization
- `src/app/` contains Next.js App Router routes; each folder (e.g., `src/app/home-removal/`) maps to a URL and typically includes `page.tsx` and optional `layout.tsx`.
- `src/components/` holds reusable UI components (PascalCase filenames like `TestimonialSlider.tsx`). Layout-specific components live in `src/components/layout/`.
- `src/lib/` is for shared utilities and client helpers.
- `public/images/` contains static assets used by the marketing pages.

## Build, Test, and Development Commands
- `npm run dev` starts the Next.js dev server (default: http://localhost:3000).
- `npm run build` creates a production build.
- `npm run start` serves the production build locally.
- `npm run lint` runs Next.js ESLint checks.
- For `tsx` scripts that rely on `.env.local`, source env vars first:
  - `set -a; source .env.local; set +a; npx tsx test-job-report.ts`

## Coding Style & Naming Conventions
- TypeScript + React (Next.js 16 App Router).
- Use 2-space indentation in TS/TSX as existing files do.
- **Next.js 15+ Breaking Change**: Route handler `params` are now async. Use `{ params }: { params: Promise<{ id: string }> }` and `await params` instead of accessing params directly.
- Components use PascalCase filenames and exported names (e.g., `AddressAutocomplete.tsx`).
- Routes use kebab-case folder names under `src/app/` (e.g., `terms-and-conditions`).
- Add `'use client'` at the top of components that use hooks or browser-only APIs.
- Styling is Tailwind CSS; keep class ordering consistent with existing files and use the project theme in `tailwind.config.js`.
- **Business References**: Always use `busRef` (4-char uppercase) when referring to businesses in code; never use slug or id.
- **Job ID Naming**: Use `displayJobId` (camelCase) for human-readable format; `jobId` for internal UUID.

## Testing Guidelines
- No dedicated test runner or test directory is present yet. For changes, rely on `npm run lint` and manual verification in `npm run dev`.
- If you introduce tests later, place them alongside components or under a new `__tests__/` folder and update this guide.

## Commit & Pull Request Guidelines
- Recent commit history shows short, descriptive messages (sometimes prefixed like `feature:`). Follow that pattern and keep messages imperative and focused (e.g., "Add mandatory fields").
- PRs should include: a brief summary, testing notes (commands run), and screenshots for UI changes. Link related issues if applicable.

## Architecture Notes
- This is a marketing site for EverReady built with Next.js App Router and Tailwind CSS. The root layout (`src/app/layout.tsx`) applies the site-wide shell.
- Messaging features include email (Microsoft Graph) and WhatsApp (Meta Graph) notifications plus job report emails with PDF attachments.

## Documentation
- Project docs live under `docs/`.
- Multi-tenant business config overview: `docs/business-configs.md`.
- Messaging API curl examples: `docs/messaging-api.md`.
- Messaging features guide: `docs/messaging-features.md`.

## /init Tenant Onboarding

### Database Setup
1. **Create business_master entry** via direct SQL:
   - Set `bus_ref` (4-char code: DEMO, LNDN, LIMO)
   - Store business name, email, admins list, address, coordinates
   - Initialize sequence in `job_sequences` table

### Configuration
1. Create `src/lib/business/configs/{busref-lowercase}.ts`:
   - Export `BusinessConfig` with `busRef`, `theme`, `features`, `logos`
   - Define color palette (primary, hover, light, border, brand text, ring)
   - Set feature flags (showTrustpilot, showNewsletterCheckbox, etc.)

2. Update `src/lib/business/config-loader.ts`:
   - Register new config in `configRegistry`

### Assets
1. Create folder `public/images/business/{BUSREF}/`:
   - Add `logo.png` (full horizontal logo)
   - Add `favicon.ico` (brand icon)

2. Update config with logo paths:
   - `logos.logo`: Full logo path
   - `logos.logoSquare`: Square variant (optional)
   - `logos.favicon`: Favicon path

### Messaging (Optional)
- Add to `.env.local` for business-specific overrides (email/WhatsApp configs)
- Add business admins to `business_master.admins[]` to receive job reports

### Verification
- Run `npm run lint` and `npm run build`
- Test at `http://localhost:3000/{busref}/home-removal` (lowercase)
- Verify theme colors, logo display, and feature flags work

## Multi-Tenant Architecture

The application uses a 4-character business reference (`busRef`) system:
- **URL Pattern**: `/[busref]/home-removal` (e.g., `/demo/home-removal`, `/limo/home-removal`)
- **Config Lookup**: Statically loaded from `src/lib/business/configs/{busref}.ts`
- **Database Link**: Jobs store `bus_ref` to reference `business_master` for admin details
- **Job IDs**: Human-readable format `BUSREF-NNNNN` (e.g., `DEMO-00001`) with fallback to UUID for legacy jobs

### Database Tables
- **business_master**: Stores business details (name, email, admins, address)
- **job_sequences**: Per-business sequential counter for display_job_id generation
- **jobs**: Includes `bus_ref` (VARCHAR) and `display_job_id` (VARCHAR, unique)

### Theming System
Each business config defines a `BusinessTheme`:
- Primary colors: `primary`, `primaryHover`, `primaryLight`, `primaryBorder`, `brandText`, `primaryRing`
- Button text: `primaryButtonText` (for contrast on colored backgrounds)
- All colors sync to CSS variables via `--theme-*` pattern

## Messaging System

### Email (Microsoft Graph API)
- **Config**: `MESSAGING_MS_CLIENT_ID`, `MESSAGING_MS_CLIENT_SECRET`, `MESSAGING_MS_TENANT_ID`, `MESSAGING_MS_SENDER_EMAIL`
- **Multi-tenant**: Per-business overrides via `MESSAGING_{BUSREF}_*` env vars
- **Features**: Plain text and HTML body types, attachment support for PDFs

### WhatsApp (Facebook Graph API)
- **Config**: `MESSAGING_WA_PHONE_NUMBER_ID`, `MESSAGING_WA_ACCESS_TOKEN`
- **Phone Format**: 12 digits with 2-digit country code (e.g., `447123456789`)
- **Features**: Text messages and marketing templates

### Notifications Triggered by Job Creation
1. **Customer Email**: Booking confirmation with clickable "View Your Booking Details" link
2. **Admin WhatsApp**: Job summary with view link (if enabled)
3. **Admin Email**: Full job report with PDF attachment to all admins in `business_master.admins[]`

### Marketing Templates
- **enquiry_notification**: WhatsApp template with dynamic job detail URL button

## Browser Debugging Note
Assume that the npm run command is already executed and the server is running.
If you need to launch Chrome for antigravity with remote debugging enabled, use this command:
```bash
DISPLAY=:0 google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug-session --no-first-run --no-default-browser-check {{URL}} > /dev/null 2>&1 &
