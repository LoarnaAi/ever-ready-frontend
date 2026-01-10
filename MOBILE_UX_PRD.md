# Mobile Responsiveness UX Review - Home Removal Form

## Executive Summary

This PRD documents the mobile responsiveness issues identified in the home-removal form at `/home-removal` and provides an implementation plan to improve the mobile user experience.

**Testing Conditions:**
- Viewport: 375x812 (iPhone X/11 Pro dimensions)
- URL: http://localhost:3002/home-removal
- Form Steps Reviewed: Steps 1-4 (Steps 5-6 require valid address input)

---

# REVISION: Mobile Sidebar Redesign (v2)

---

## User Feedback on Current Implementation

**Problem:** The `MobileBottomSheet` (sticky bottom sheet) approach does not feel right for this UI.

**User Requirements:**
1. Sidebar should be **visible on mobile** (not hidden)
2. Should use **accordion pattern** (like desktop) to stay compact
3. Should be **stacked** in the page flow (not fixed/floating)
4. Should **not take up too much space**

---

## Current Implementation Analysis

### What Was Implemented (v1)
- Desktop sidebar hidden on mobile (`hidden md:flex`)
- `MobileBottomSheet` component added as fixed bottom element
- Peek bar shows summary info, expands on tap
- Navigation buttons stacked for mobile

### Why Bottom Sheet Doesn't Work Here
1. **UI Mismatch**: Bottom sheet feels app-like, not web-form-like
2. **Context Disconnect**: Summary feels separate from the form flow
3. **Overlap Issues**: Can conflict with navigation buttons
4. **Fixed Position**: Feels intrusive for a multi-step form

---

## Proposed Design: Stacked Accordion Sidebar

### Concept
Instead of hiding the sidebar on mobile or using a floating bottom sheet, **stack the sidebar above or below the form content** with all sections collapsed by default. Users can expand any section to see details.

### Visual Layout (Mobile)

```
┌─────────────────────────────┐
│ Step 2 of 6 | Inventory     │  <- Progress bar
├─────────────────────────────┤
│ ▶ Quote Summary             │  <- Collapsed accordion header
│   3 Bedrooms | 60 items     │     (one-line peek info)
├─────────────────────────────┤
│                             │
│   [Form Content Area]       │  <- Main form
│                             │
├─────────────────────────────┤
│ ◀ Back          Continue ▶  │  <- Navigation
└─────────────────────────────┘
```

### When Accordion is Expanded

```
┌─────────────────────────────┐
│ Step 2 of 6 | Inventory     │
├─────────────────────────────┤
│ ▼ Quote Summary             │  <- Expanded
│   ┌─────────────────────┐   │
│   │ ▶ 1. PrePopulated   │   │  <- Nested accordions
│   │ ▶ 2. Additional     │   │     (same as desktop)
│   │ ▶ 3. Services       │   │
│   │ ▶ 4. Move Details   │   │
│   └─────────────────────┘   │
├─────────────────────────────┤
│   [Form Content Area]       │
│   ...                       │
```

---

## Design Specifications

### 1. Mobile Stacked Accordion Component

**Component:** `MobileSidebarAccordion.tsx`

**Behavior:**
- Appears **above** the form content on mobile (<768px)
- Single top-level accordion: "Quote Summary"
- Default state: **collapsed** (shows one-line summary)
- Expanded state: Shows nested accordions (same as desktop sidebar)
- Smooth expand/collapse animation

**Collapsed State Content:**
- Icon (house/box depending on step)
- Service title (e.g., "3 Bedrooms")
- Item count or relevant summary
- Chevron indicator

**Expanded State Content:**
- Same accordion sections as desktop:
  1. PrePopulated Items (expandable)
  2. Additional Items (expandable)
  3. Additional Services (expandable)
  4. Move Details (expandable)
- Rating badge
- Disclaimer text

### 2. Key Styling

```css
/* Container */
- Full width on mobile
- White background with border
- Rounded corners (rounded-lg)
- Margin bottom for spacing from form

/* Collapsed Header */
- Padding: p-4
- Font: text-sm font-semibold
- Display: flex items-center justify-between
- Touch target: min-h-[48px]

/* Expanded Content */
- Max-height with transition
- Padding: px-4 pb-4
- Scrollable if content exceeds viewport
```

### 3. Component Structure

```jsx
// MobileSidebarAccordion.tsx
<div className="md:hidden w-full bg-white border border-gray-200 rounded-lg mb-4">
  {/* Main Accordion Header */}
  <button
    onClick={toggleMain}
    className="w-full p-4 flex items-center justify-between min-h-[48px]"
  >
    <div className="flex items-center gap-3">
      <Icon />
      <span className="font-semibold">{serviceName}</span>
      <span className="text-gray-500">|</span>
      <span className="text-gray-600">{summaryText}</span>
    </div>
    <ChevronIcon rotated={isExpanded} />
  </button>

  {/* Expandable Content */}
  <div className={`overflow-hidden transition-all ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>
    <div className="px-4 pb-4 border-t border-gray-100">
      {/* Nested accordions - same as desktop */}
      <NestedAccordion title="1. PrePopulated Items" />
      <NestedAccordion title="2. Additional Items" />
      <NestedAccordion title="3. Additional Services" />
      <NestedAccordion title="4. Move Details" />
    </div>
  </div>
</div>
```

### 4. Layout Structure Change

**Current (with bottom sheet):**
```jsx
<div className="flex flex-col md:flex-row">
  <aside className="hidden md:flex">...</aside>  // Hidden on mobile
  <main>...</main>
</div>
<MobileBottomSheet />  // Fixed at bottom
```

**Proposed (with stacked accordion):**
```jsx
<div className="flex flex-col md:flex-row">
  {/* Mobile: Stacked accordion at top */}
  <MobileSidebarAccordion className="md:hidden" />

  {/* Desktop: Normal sidebar */}
  <aside className="hidden md:flex">...</aside>

  <main>...</main>
</div>
// No MobileBottomSheet
```

---

## Files to Modify

| File | Action | Changes |
|------|--------|---------|
| `src/components/MobileSidebarAccordion.tsx` | CREATE | New stacked accordion component |
| `src/components/MobileBottomSheet.tsx` | DELETE | Remove unused component |
| `src/app/home-removal/page.tsx` | MODIFY | Replace MobileBottomSheet with MobileSidebarAccordion |
| `src/app/home-removal-page/Step2FurnitureSelection.tsx` | MODIFY | Same replacement |
| `src/app/home-removal-page/Step3PackingService.tsx` | MODIFY | Same replacement |
| `src/app/home-removal-page/Step4AddressDetails.tsx` | MODIFY | Same replacement |
| `src/app/home-removal-page/Step5DateScheduling.tsx` | MODIFY | Same replacement |
| `src/app/home-removal-page/Step6ContactDetails.tsx` | MODIFY | Same replacement |

---

## Comparison: Bottom Sheet vs Stacked Accordion

| Aspect | Bottom Sheet (v1) | Stacked Accordion (v2) |
|--------|-------------------|------------------------|
| Position | Fixed at bottom | In-flow, stacked above form |
| Visibility | Always visible (peek bar) | Collapsed by default |
| Space usage | Takes 72px fixed | Flexible (~56px collapsed) |
| UI feel | App-like | Web form-like |
| Context | Feels separate | Feels part of the flow |
| Navigation conflict | Potential overlap | None |
| Implementation | Complex (fixed positioning) | Simpler (normal flow) |

---

## Design Decisions (User Confirmed)

| Decision | Choice |
|----------|--------|
| **Accordion Position** | Above form content |
| **Summary Text** | Service + count (e.g., "3 Bedrooms \| 60 items") |
| **Default State** | All nested sections collapsed |

---

## Implementation Steps

### Step 1: Create MobileSidebarAccordion Component
Create `src/components/MobileSidebarAccordion.tsx`:
- Accept props: `serviceName`, `summaryText`, `children` (for nested content)
- Implement main accordion with collapsed/expanded state
- Position: Above form content, only visible on mobile (`md:hidden`)
- Collapsed header shows: Icon + Service name + "|" + item count + chevron

### Step 2: Update Step Components
For each step file (page.tsx, Step2-6):
1. Remove `MobileBottomSheet` import and usage
2. Add `MobileSidebarAccordion` import
3. Place accordion **above** the form content container
4. Pass the same nested accordion content as desktop sidebar

### Step 3: Remove MobileBottomSheet
- Delete `src/components/MobileBottomSheet.tsx`
- Remove spacer divs (`h-20`) that were added for bottom sheet

### Step 4: Adjust Layout
- Keep `hidden md:flex` on desktop sidebar (no change)
- Ensure mobile accordion appears in document flow above form

---

## Verification Plan

1. Test at 375x812 viewport
2. Verify accordion expands/collapses smoothly
3. Verify nested accordions work correctly
4. Verify form content is not pushed off-screen when expanded
5. Test scrolling behavior with long content
6. Verify touch targets are at least 44px

---

## Original Issues Identified (Reference)

### 1. Two-Column Layout Not Collapsing on Mobile

**Severity: High**

**Current Behavior:** The form uses `flex flex-col lg:flex-row` which should stack columns on mobile, but at 375px viewport, both the left summary panel and right form content appear side-by-side, making content cramped and difficult to interact with.

**Expected Behavior:** On mobile viewports (<640px), the layout should stack vertically with the form content first, followed by the summary panel.

**Affected Files:**
- `src/app/home-removal/page.tsx` (Step 1 layout)
- `src/app/home-removal-page/Step2FurnitureSelection.tsx`
- `src/app/home-removal-page/Step3PackingService.tsx`
- `src/app/home-removal-page/Step4AddressDetails.tsx`
- `src/app/home-removal-page/Step5DateScheduling.tsx`
- `src/app/home-removal-page/Step6ContactDetails.tsx`

---

### 2. Sidebar Summary Panel Width Issues

**Severity: High**

**Current Behavior:** The left sidebar uses `w-full lg:w-96` but appears to still constrain width inappropriately on mobile, causing the two-column appearance.

**Recommendation:**
- Add explicit `md:` breakpoint handling
- Consider hiding summary on mobile or making it collapsible

---

### 3. Touch Targets Too Small

**Severity: High**

**Current Behavior:** Multiple interactive elements have touch targets below the recommended 44x44px minimum:
- Checkbox controls (~20px)
- Quantity increment/decrement buttons (~24px)
- "Select" buttons on bedroom cards
- Inventory list items

**Recommendations:**
- Increase checkbox hit area to minimum 44x44px
- Increase quantity control buttons to 44x44px minimum
- Add more padding to list items for easier tapping

---

### 4. Text Size Too Small on Mobile

**Severity: Medium**

**Current Behavior:** Body text uses `text-sm sm:text-base` which renders at 14px on mobile. Combined with the cramped layout, this makes content hard to read.

**Recommendations:**
- Use `text-base` as mobile default for body text
- Increase heading sizes on mobile
- Ensure minimum 16px for form inputs to prevent iOS zoom

---

### 5. Form Input Labels Positioning

**Severity: Medium**

**Current Behavior:** In Step 4 (Addresses), labels like "Search Street Name or Address" and "Floor" are positioned beside inputs.

**Expected Behavior:** On mobile, labels should stack above inputs for better readability and easier form completion.

---

### 6. Navigation Button Placement

**Severity: Medium**

**Current Behavior:** "Back" and "Continue" buttons are positioned at opposite ends of the form, with small tap targets.

**Recommendations:**
- Make buttons full-width stacked on mobile
- Increase button height to 48px minimum
- Consider sticky footer for navigation buttons

---

### 7. Bedroom Selection Cards Layout

**Severity: Medium**

**Current Behavior:** 2x2 grid layout with relatively small cards.

**Recommendations:**
- Single column layout on mobile (<640px)
- Larger card sizes with bigger icons
- Increased touch target for "Select" buttons

---

### 8. Inventory List Items

**Severity: Medium**

**Current Behavior:**
- Items in the inventory list (Step 2) are compact
- Quantity controls (+/-) are small
- Category headers are cramped

**Recommendations:**
- Increase row height to 48px minimum
- Larger quantity control buttons (44x44px)
- Better visual separation between categories

---

### 9. Packing Materials Grid (Step 3)

**Severity: Medium**

**Current Behavior:** 2-column grid for packing materials cards is cramped on mobile.

**Recommendations:**
- Single column layout on mobile
- Full-width cards with larger "Add" buttons

---

### 10. Progress Bar Visibility

**Severity: Low**

**Current Behavior:** Progress bar is functional but could be more prominent on mobile.

**Recommendations:**
- Add step labels below progress bar on mobile
- Consider sticky header with progress indicator

---

## Success Criteria

1. All form steps render correctly on 375px viewport
2. No horizontal scrolling required
3. All touch targets meet 44x44px minimum
4. Text is readable without zooming (16px minimum for inputs)
5. Forms can be completed easily with thumb navigation
6. Consistent experience across all 6 steps
