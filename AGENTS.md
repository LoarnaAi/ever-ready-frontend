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
- Gather tenant details (business name, brand colors, logo, service areas, contact info) and confirm copy for hero/services/FAQ sections.
- Create a new route folder under `src/app/` using a kebab-case slug for the tenant and scaffold `page.tsx` (and `layout.tsx` if it needs custom meta).
- Add tenant-specific assets in `public/images/` and reference them from the new page using the established marketing components.
- Wire any tenant-specific constants or helpers in `src/lib/` and keep styling aligned with `tailwind.config.js` theme tokens.
- Run `npm run lint`, then review the page locally with `npm run dev` before handoff.

## Browser Debugging Note
Assume that the npm run command is already executed and the server is running.
If you need to launch Chrome for antigravity with remote debugging enabled, use this command:
```bash
DISPLAY=:0 google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug-session --no-first-run --no-default-browser-check {{URL}} > /dev/null 2>&1 &
