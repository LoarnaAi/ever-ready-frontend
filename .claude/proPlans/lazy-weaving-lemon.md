# Fix Next.js 16 Async Params in Route Handler

## Problem
The Amplify build fails due to a TypeScript error in `src/app/api/postcode-lookup-google-api/[postcode]/route.ts`.

In Next.js 15+, dynamic route handler `params` are now async (`Promise<{ postcode: string }>`) instead of synchronous (`{ postcode: string }`).

## Error
```
Type '{ params: Promise<{ postcode: string; }>; }' is not assignable to type '{ params: { postcode: string; }; }'.
```

## Files to Modify
- `src/app/api/postcode-lookup-google-api/[postcode]/route.ts`

## Changes Required

### 1. Update the GET function signature and await params

**Before:**
```typescript
export async function GET(
    request: NextRequest,
    { params }: { params: { postcode: string } }
) {
    const { postcode } = params
```

**After:**
```typescript
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ postcode: string }> }
) {
    const { postcode } = await params
```

## Verification
1. Run `npm run build` locally to confirm the TypeScript error is resolved
2. Push to trigger Amplify build
