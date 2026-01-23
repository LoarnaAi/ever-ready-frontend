# Repository Guidelines

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

## Coding Style & Naming Conventions
- TypeScript + React (Next.js 14 App Router).
- Use 2-space indentation in TS/TSX as existing files do.
- Components use PascalCase filenames and exported names (e.g., `AddressAutocomplete.tsx`).
- Routes use kebab-case folder names under `src/app/` (e.g., `terms-and-conditions`).
- Add `'use client'` at the top of components that use hooks or browser-only APIs.
- Styling is Tailwind CSS; keep class ordering consistent with existing files and use the project theme in `tailwind.config.js`.

## Testing Guidelines
- No dedicated test runner or test directory is present yet. For changes, rely on `npm run lint` and manual verification in `npm run dev`.
- If you introduce tests later, place them alongside components or under a new `__tests__/` folder and update this guide.

## Commit & Pull Request Guidelines
- Recent commit history shows short, descriptive messages (sometimes prefixed like `feature:`). Follow that pattern and keep messages imperative and focused (e.g., "Add mandatory fields").
- PRs should include: a brief summary, testing notes (commands run), and screenshots for UI changes. Link related issues if applicable.

## Architecture Notes
- This is a marketing site for EverReady built with Next.js App Router and Tailwind CSS. The root layout (`src/app/layout.tsx`) applies the site-wide shell.
