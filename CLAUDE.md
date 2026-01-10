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

## Architecture

This is a marketing website for EverReady, an AI automation agency. Uses Next.js App Router with file-based routing.

### Directory Structure

- `src/app/` - App Router pages (each folder is a route)
- `src/components/` - Reusable React components
- `src/components/layout/` - Layout components (Header, Footer)
- `public/images/` - Static assets

### Layout Pattern

The root layout (`src/app/layout.tsx`) wraps all pages with:
- Header and Footer components
- Dark theme (`bg-everready-dark`)
- Inter font

### Custom Theme Colors

Defined in `tailwind.config.js`:
- `everready-primary`: #007BFF (Electric Blue)
- `everready-secondary`: #007BFF
- `everready-dark`: #111111 (Dark background)

### Client Components

Components requiring browser APIs or hooks must use `'use client'` directive. Example: `TestimonialSlider.tsx` uses `useState` and `useEffect` for auto-rotating slides.
