# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run dev      # Start development server (Next.js on localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
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

Reference docs are stored in `docs/`. Multi-tenant configuration details are documented in `docs/business-configs.md`. Messaging API curl examples live in `docs/messaging-api.md`.

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
- `src/lib/` - Backend integration and utilities
  - `supabase.ts` - Supabase client initialization
  - `database.types.ts` - TypeScript types for database schema
  - `tempDb.ts` - Temporary database utilities
  - `actions/` - Server actions for database operations
  - `utils/` - Utility functions
- `src/removal-page/` - Components specific to removal service pages
- `src/waste-removal-page/` - Components specific to waste removal pages
- `public/images/` - Static assets

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

### Key Features

1. **Multi-step Booking Forms**: For home and waste removal services with real-time pricing
2. **Address Autocomplete**: Google Maps integration for accurate location input
3. **Dynamic Pricing**: Database-driven pricing for furniture items and packing materials
4. **Mobile Responsive**: Custom mobile components (BottomSheet, Accordion) for better UX


## Browser Debugging Note
Assume that the npm run command is already executed and the server is running.
If you need to launch Chrome for antigravity with remote debugging enabled, use this command:
```bash
DISPLAY=:0 google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug-session --no-first-run --no-default-browser-check {{URL}} > /dev/null 2>&1 &
