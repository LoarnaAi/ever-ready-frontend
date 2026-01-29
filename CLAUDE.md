# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run dev      # Start development server (Next.js on localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

For `tsx` scripts that rely on `.env.local`, source env vars first:

```bash
set -a; source .env.local; set +a; npx tsx test-job-report.ts
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Font**: Inter (via next/font/google)
- **Database**: Supabase (PostgreSQL)
- **Maps**: Google Maps JavaScript API
- **Icons**: lucide-react

## Architecture

This is a multi-service web application featuring:
- **EverReady AI Automation**: Marketing pages for AI automation agency services
- **Removal Services**: Booking system for home and waste removal services with:
  - Multi-step forms for furniture selection and packing services
  - Google Maps address autocomplete
  - Supabase backend for job storage and management
  - Database-driven pricing and inventory

Uses Next.js App Router with file-based routing and Supabase for backend operations.

## Documentation

Reference docs are stored in `docs/`. Multi-tenant configuration details are documented in `docs/business-configs.md`. Messaging API curl examples live in `docs/messaging-api.md`. Messaging feature instructions live in `docs/messaging-features.md`.

### Recent Implementation Updates

**Multi-Tenant Architecture:**
- Refactored to use 4-character business references (`busRef`: DEMO, LNDN, LIMO) as primary identifier
- Created `business_master` table for dynamic business data
- Added `display_job_id` (human-readable format: `DEMO-00001`) alongside internal UUID `job_id`

**Business Configurations:**
- New LIMO tenant with bright yellow theme (#FACC15)
- Added configurable `primaryButtonText` for button contrast on colored backgrounds
- Business logos support with local image storage (`public/images/business/{BUSREF}/`)
- Dynamic favicons per business

**Messaging System:**
- Email notifications (Microsoft Graph API)
- WhatsApp messages (Facebook Graph API)
- Customer booking confirmations with clickable job detail links
- Admin job reports with PDF attachments
- WhatsApp marketing template endpoint for enquiry notifications

**Routing & Navigation:**
- Job detail pages use display_job_id in URLs (e.g., `/demo/home-removal/job-detail/DEMO-00001`)
- Consolidated home removal step components to `src/components/home-removal-steps/`
- Fixed Next.js 15+ async params in dynamic routes

### Directory Structure

- `src/app/` - App Router pages (each folder is a route)
  - Main routes: `/` (home), `/services`, `/contact`
  - Removal service routes: `/home-removal`, `/home-removal-page`, `/removal`, `/waste-removal`
  - Legal pages: `/privacy-policy`, `/terms-and-conditions`
- `src/components/` - Reusable React components
  - `AddressAutocomplete.tsx` - Google Maps address input
  - `ConfirmationModal.tsx` - Booking confirmation modal
  - `TestimonialSlider.tsx` - Auto-rotating testimonials
  - `MobileBottomSheet.tsx` - Mobile UI component
  - `MobileJobDetailsAccordion.tsx` - Mobile job details display
- `src/components/layout/` - Layout components (Header, Footer)
- `src/components/home-removal-steps/` - Home removal form steps (Step2-Step6) and icons
- `src/lib/` - Backend integration and utilities
  - `supabase.ts` - Supabase client initialization
  - `database.types.ts` - TypeScript types for database schema
  - `actions/` - Server actions (jobs, email, WhatsApp, job reports)
  - `business/` - Multi-tenant config system
    - `types.ts` - BusinessConfig, BusinessTheme, BusinessFeatures interfaces
    - `config-loader.ts` - Registry and lookup functions
    - `configs/` - Individual tenant configs (demo.ts, lndn.ts, limo.ts)
    - `BusinessContext.tsx` - React Context provider
    - `logo-utils.ts` - Logo resolution and favicon metadata
    - `theme-utils.ts` - CSS variable injection and styled utilities
  - `messaging/` - Email and WhatsApp configuration
    - `types.ts` - EmailConfig, WhatsAppConfig, messaging interfaces
    - `config-loader.ts` - Multi-tenant messaging config resolution
  - `templates/` - Email HTML templates (bookingConfirmation, jobReport)
  - `pdf/` - Job report PDF generation (JobReportPdf component)
  - `utils/` - Utility functions (jobUtils, urlUtils, etc.)
- `public/images/` - Static assets
  - `business/` - Per-business logos and favicons
- `docs/` - External documentation
  - `business-configs.md` - Multi-tenant configuration guide

### Layout Pattern

The root layout (`src/app/layout.tsx`) wraps all pages with:
- Header and Footer components
- Dark theme (`bg-everready-dark`)
- Inter font

### Custom Theme Colors

Defined in `tailwind.config.js`:
- `everready-primary`: #007BFF (Electric Blue)
- `everready-secondary`: #007BFF (Electric Blue)
- `everready-dark`: #111111 (Dark background)
- `yellow-500`: #EAB308 (Used for removal service pages)

### Client Components

Components requiring browser APIs or hooks must use `'use client'` directive. Example: `TestimonialSlider.tsx` uses `useState` and `useEffect` for auto-rotating slides.

### Backend Integration

- **Supabase**: PostgreSQL database for storing removal service jobs, furniture items, and packing materials
- **Server Actions**: Located in `src/lib/actions/` for database operations (e.g., `createJobAction`)
- **Database Types**: Auto-generated TypeScript types in `src/lib/database.types.ts`
- **Google Maps**: Address autocomplete functionality via `@googlemaps/js-api-loader`

### Next.js 15+ Breaking Change
Route handler `params` are now async. Use `{ params }: { params: Promise<{ id: string }> }` and `await params` instead of accessing params directly.

### Key Features

1. **Multi-step Booking Forms**: For home and waste removal services with real-time pricing
2. **Address Autocomplete**: Google Maps integration for accurate location input
3. **Dynamic Pricing**: Database-driven pricing for furniture items and packing materials
4. **Mobile Responsive**: Custom mobile components (BottomSheet, Accordion) for better UX
5. **Multi-Tenant Support**:
   - Business reference system (4-char codes: DEMO, LNDN, LIMO)
   - Per-business theming and configuration
   - Isolated messaging settings
   - Business-specific logos and favicons
6. **Job Management**:
   - Human-readable job IDs (LIMO-00001 format)
   - Display and detailed job tracking pages
   - Sequential numbering per business
7. **Messaging System**:
   - Customer booking confirmations via email
   - Admin notifications (email with PDF report, WhatsApp)
   - Marketing templates for enquiry notifications
   - Multi-tenant messaging config support


## Browser Debugging Note
Assume that the npm run command is already executed and the server is running.
If you need to launch Chrome for antigravity with remote debugging enabled, use this command:
```bash
DISPLAY=:0 google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug-session --no-first-run --no-default-browser-check {{URL}} > /dev/null 2>&1 &
Note: iOS input zoom is avoided by setting mobile input/select font size to 16px (e.g., `text-[16px] sm:text-sm`).
