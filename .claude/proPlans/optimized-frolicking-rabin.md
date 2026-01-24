# Plan: Enhanced Multi-Tenant Architecture Documentation with Mermaid Diagrams

## Overview
Enhance the existing `docs/business-configs.md` file with comprehensive Mermaid diagrams to provide visual understanding of the multi-tenant business configuration system.

## Key Findings from Exploration

### Current State
- **Configuration Source**: Business configs are **NOT** read from the `businesses` database table
- **Implementation**: Hard-coded TypeScript configs in `src/lib/business/configs/`
- **Registry**: Static in-memory lookup via `config-loader.ts`
- **Routing**: Dynamic `[business]` slug pattern in Next.js App Router
- **Tenants**: Currently supports `demo` and `london-movers`

### Architecture Components
1. **Type System**: `BusinessConfig`, `BusinessTheme`, `BusinessFeatures` in `types.ts`
2. **Config Files**: Individual tenant configs (demo.ts, london-movers.ts)
3. **Config Loader**: Registry and lookup functions in `config-loader.ts`
4. **React Context**: `BusinessProvider` and `useBusinessConfig()` hook
5. **Database Schema**: `businesses` table exists but not queried for configs
6. **Data Linkage**: `jobs.business_id` stores slug (type mismatch with UUID schema)

## Critical Files

### Configuration System
- `src/lib/business/types.ts` - Type definitions
- `src/lib/business/config-loader.ts` - Registry and lookup
- `src/lib/business/configs/demo.ts` - Demo tenant config
- `src/lib/business/configs/london-movers.ts` - London Movers config
- `src/lib/business/BusinessContext.tsx` - React Context provider

### Routing
- `src/app/[business]/home-removal/layout.tsx` - Dynamic route layout
- `src/app/[business]/home-removal/page.tsx` - Main booking page

### Database
- `database/datamodels/02_tables.sql` - Schema definition
- `src/lib/actions/jobActions.ts` - Database operations

## Implementation Plan

### 1. Enhance Documentation Structure
**File**: `docs/business-configs.md`

Add the following Mermaid diagrams in appropriate sections:

#### A. High-Level Architecture Diagram
Location: After "Current Multi-Tenant Flow" section
Purpose: Show how components interact
Type: `graph TB` (top-to-bottom flowchart)
Shows:
- URL → Router → Layout → ConfigLoader → Registry
- Provider → Page → Hook pattern
- Database (exists but not used)

#### B. Request Flow Sequence Diagram
Location: In "Current Multi-Tenant Flow" section
Purpose: Step-by-step request lifecycle
Type: `sequenceDiagram`
Shows:
- User visits URL
- Next.js routing
- Config lookup
- Provider wrapping
- Component rendering

#### C. Entity Relationship Diagram
Location: After "Database Table vs. Current Runtime" section
Purpose: Show database schema relationships
Type: `erDiagram`
Shows:
- `businesses` table structure
- `jobs` table with `business_id` FK
- Related tables (addresses, dates, contact_details, etc.)
- Highlight the type mismatch issue

#### D. Configuration Loading Flow
Location: In "How Different Slugs Scale Tenants Today" section
Purpose: Decision tree for config resolution
Type: `flowchart TD`
Shows:
- Extract slug from URL
- Lookup in registry
- Return 404 if not found
- Wrap in provider if found
- Render themed components

#### E. Component Context Hierarchy
Location: After "Layout validates and provides the config" section
Purpose: Show React component tree
Type: `graph TD`
Shows:
- Layout (Server Component)
- BusinessProvider (Client Component)
- Pages consuming context
- Hook usage pattern

#### F. Adding New Tenant Process
Location: In "Quick Checklist for Adding a New Tenant" section
Purpose: Visual step-by-step guide
Type: `flowchart LR`
Shows:
- Create config file
- Define theme/features
- Register in loader
- Test locally
- Deploy

#### G. Type Structure Diagram
Location: New section "Type System Overview"
Purpose: Show BusinessConfig interface structure
Type: `classDiagram`
Shows:
- BusinessConfig interface
- BusinessTheme properties
- BusinessFeatures properties
- Relationships

### 2. Add New Sections

#### Section: "Visual Architecture Overview"
- Add high-level architecture diagram
- Brief explanation of components

#### Section: "Type System Overview"
- Add type structure diagram
- Code examples of each config

#### Section: "Common Use Cases"
- Example: Accessing theme in components
- Example: Using feature flags
- Code snippets with explanations

### 3. Enhance Existing Sections

#### "Short Answer" Section
- Keep as-is (clear and direct)
- Add reference to architecture diagram

#### "Current Multi-Tenant Flow" Section
- Add sequence diagram
- Add component hierarchy diagram
- Expand explanations with visual references

#### "Database Table vs. Current Runtime" Section
- Add ER diagram
- Highlight type mismatch visually
- Add note about future migration path

#### "How Different Slugs Scale Tenants Today" Section
- Add configuration loading flow diagram
- Add new tenant process diagram
- Include real code examples

#### "Quick Checklist" Section
- Convert to visual flowchart
- Keep text checklist as well
- Add troubleshooting tips

### 4. Add Code Examples

#### Example 1: Creating a New Tenant Config
```typescript
// src/lib/business/configs/acme-removals.ts
export const acmeRemovalsConfig: BusinessConfig = {
  id: 'acme-removals',
  slug: 'acme-removals',
  name: 'Acme Removals',
  theme: {
    primary: '#10b981',      // green-500
    primaryHover: '#059669', // green-600
    // ... other theme properties
  },
  features: {
    showTrustpilot: true,
    showNewsletterCheckbox: false,
    showPoweredBy: false,
  },
};
```

#### Example 2: Registering in Config Loader
```typescript
// src/lib/business/config-loader.ts
const configRegistry: Record<string, BusinessConfig> = {
  demo: demoConfig,
  'london-movers': londonMoversConfig,
  'acme-removals': acmeRemovalsConfig, // Add new tenant
};
```

#### Example 3: Using Theme in Components
```typescript
// In a page component
const { theme, config } = useBusinessConfig();

return (
  <button
    style={{ backgroundColor: theme.primary }}
    className="px-4 py-2 rounded"
  >
    Book with {config.name}
  </button>
);
```

### 5. Document Type Mismatch Issue

Add dedicated subsection: "Known Issue: business_id Type Mismatch"
- Explain the schema defines UUID
- Current code stores slug string
- Impact on queries and joins
- Recommended fix:
  - Option A: Change jobs.business_id to VARCHAR
  - Option B: Use businesses.id UUID in application
  - Option C: Create mapping table

## Verification Steps

After implementation:
1. Ensure all Mermaid diagrams render correctly in Markdown viewers
2. Verify code examples are accurate and match current codebase
3. Check that all file paths are correct
4. Ensure diagrams align with text descriptions
5. Review flow: should be easy to follow for new developers

## Additional Enhancements

### Optional: Create Separate Files
If `business-configs.md` becomes too long, consider splitting:
- `multi-tenant-architecture.md` - High-level architecture with diagrams
- `business-configs.md` - Quick reference and checklist
- `adding-new-tenant.md` - Step-by-step tutorial

### Optional: Add Migration Guide
Create `docs/database-config-migration.md` for future work:
- Steps to migrate from hard-coded to database-driven configs
- SQL queries to sync existing configs to database
- Application code changes needed
- Performance considerations

## Summary

This plan will transform the existing text-based documentation into a comprehensive, visually-rich guide that:
- Answers the user's question about database usage clearly
- Explains multi-tenant scaling with visual diagrams
- Provides step-by-step guidance for adding tenants
- Documents current limitations and future paths
- Makes the architecture easy to understand for new developers

The enhanced documentation will serve as the authoritative reference for understanding and working with the multi-tenant business configuration system.
