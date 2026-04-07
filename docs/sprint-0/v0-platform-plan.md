# V0 — Platform Foundation Plan

**Purpose:** Establish the technical foundations that every vertical depends on, before building V1.

---

## Why V0 exists

The vertical integration rule says no vertical should feel isolated. V1 needs to write data into structures that V2–V5 will consume. The auth model, permissions model, AI layer, and design system must exist before any vertical is built.

V0 is not a product vertical. It is the platform that makes every product vertical faster, more integrated, and production-grade from day one.

---

## V0 deliverables

### 1. Project initialisation

- Next.js project with TypeScript (strict mode)
- Tailwind CSS configuration
- ESLint + Prettier configuration
- Folder structure with clear module boundaries per vertical
- Environment variable management (.env.local, .env.staging, .env.production)
- Git hooks (pre-commit lint/type-check)

**Folder structure (recommended):**

```
src/
  app/                    # Next.js App Router pages
    (public)/             # Pre-auth public routes
    (authenticated)/      # Post-auth protected routes
    api/                  # API routes
  components/
    ui/                   # Design system primitives
    layout/               # Shell, navigation, layout
    shared/               # Reusable composite components
  lib/
    supabase/             # Supabase client, helpers, types
    ai/                   # AI orchestration layer
    auth/                 # Auth helpers, session management
    permissions/          # Permission checks, role logic
    analytics/            # PostHog integration
    stripe/               # Stripe stub/integration
    pdf/                  # PDF generation utilities
    debug/                # Debug panel, dev tools
  types/                  # Shared TypeScript types
  constants/              # Enums, config values
  hooks/                  # Custom React hooks
  utils/                  # General utilities
content/
  pages/                  # MDX marketing/content pages
  microcopy/              # Separable UI copy
  legal/                  # Stubbed legal pages
docs/                     # Project documentation
  sprint-0/
  v0/
  v1/
supabase/
  migrations/             # Database migrations
  seed/                   # Seed data for dev/testing
tests/
  unit/
  integration/
  e2e/
```

### 2. Supabase configuration

- Supabase project created (dev environment)
- Supabase CLI configured for local development
- Database migrations workflow established

### 3. Core database schema

All 11 core entities, designed for full product scope even though V1 populates a subset.

**Users**
- id (uuid, PK)
- supabase_auth_id (FK to auth.users)
- display_name
- email
- created_at
- updated_at

**Cases (Workspaces)**
- id (uuid, PK)
- owner_id (FK to users)
- title
- status (enum: active, archived, closed)
- created_at
- updated_at

**Participants**
- id (uuid, PK)
- case_id (FK to cases)
- user_id (FK to users, nullable — may not have account)
- role (enum: applicant, respondent, mediator, adviser)
- invite_status (enum: pending, accepted, declined)
- permissions (jsonb)
- created_at

**Proposals**
- id (uuid, PK)
- case_id (FK to cases)
- author_id (FK to participants)
- version (integer)
- parent_proposal_id (FK to proposals, nullable — for counter-proposals)
- status (enum: draft, shared, accepted, disputed, superseded, withdrawn)
- content (jsonb — structured proposal data)
- children_arrangements (jsonb)
- housing_arrangements (jsonb)
- financial_arrangements (jsonb)
- notes (text)
- created_at
- updated_at

**Financial Items**
- id (uuid, PK)
- case_id (FK to cases)
- participant_id (FK to participants)
- category (enum: asset, liability, income, pension, property, obligation, other)
- subcategory (text)
- description (text)
- value_amount (decimal, nullable)
- value_currency (text, default GBP)
- confidence_state (enum: known, estimated, unsure, unknown)
- follow_up_state (enum: fine_for_now, confirm_later, priority_to_confirm, resolved)
- visibility (enum: private, shared, requested, disputed, accepted, archived)
- source_description (text)
- created_at
- updated_at

**Documents (Evidence Items)**
- id (uuid, PK)
- case_id (FK to cases)
- uploaded_by (FK to participants)
- file_name (text)
- file_type (text)
- storage_path (text)
- file_size (bigint)
- classification (text, nullable — AI-assigned)
- classification_confidence (decimal, nullable)
- processing_status (enum: pending, processing, completed, failed)
- visibility (enum: private, shared, requested, disputed, accepted, archived)
- created_at
- updated_at

**Extracted Fields**
- id (uuid, PK)
- document_id (FK to documents)
- financial_item_id (FK to financial_items, nullable)
- field_name (text)
- extracted_value (text)
- confidence (decimal)
- review_status (enum: pending, accepted, corrected, rejected)
- corrected_value (text, nullable)
- reviewed_by (FK to participants, nullable)
- reviewed_at (timestamp, nullable)
- created_at

**Questions (Clarification Items)**
- id (uuid, PK)
- case_id (FK to cases)
- raised_by (FK to participants)
- assigned_to (FK to participants, nullable)
- category (text)
- question_text (text)
- context (text, nullable)
- status (enum: open, in_progress, answered, resolved, deferred)
- priority (enum: low, medium, high)
- answer_text (text, nullable)
- answered_by (FK to participants, nullable)
- answered_at (timestamp, nullable)
- linked_financial_item_id (FK to financial_items, nullable)
- linked_document_id (FK to documents, nullable)
- created_at
- updated_at

**Outputs (Packs)**
- id (uuid, PK)
- case_id (FK to cases)
- generated_by (FK to participants)
- output_type (enum: plan_summary, disclosure_pack, adviser_bundle, consent_order_draft, d81_data, form_a_data, mediation_agenda, unresolved_summary)
- title (text)
- content (jsonb)
- format (enum: json, pdf, html)
- storage_path (text, nullable)
- version (integer)
- created_at

**Timeline Events (Audit Log)**
- id (uuid, PK)
- case_id (FK to cases)
- actor_id (FK to participants, nullable)
- actor_type (enum: user, system, ai)
- event_type (text — e.g. proposal_created, field_extracted, question_raised, document_uploaded, permission_changed, session_logged)
- event_data (jsonb)
- related_entity_type (text, nullable)
- related_entity_id (uuid, nullable)
- created_at

**Permissions**
- id (uuid, PK)
- case_id (FK to cases)
- participant_id (FK to participants)
- resource_type (text — e.g. financial_item, document, proposal)
- resource_id (uuid)
- permission_level (enum: none, view, comment, edit, admin)
- granted_by (FK to participants)
- created_at
- revoked_at (timestamp, nullable)

### 4. Row-level security (RLS)

- RLS policies on all tables from day one
- Users can only access data for cases they participate in
- Role-based access: applicant sees own data + shared; respondent sees shared only; mediator/adviser see what is explicitly granted
- Anonymous sessions scoped to their own case data

### 5. Auth flow

- Supabase anonymous auth on first visit
- Anonymous session linked to case on creation
- Upgrade to authenticated via magic link or Google OAuth
- Anonymous session data automatically linked to new account
- Session persistence and recovery

### 6. Design system foundation

- Tailwind-based component library
- Core primitives: Button, Input, Select, Textarea, Card, Badge, Alert, Modal, Drawer, Tooltip, Progress, Stepper
- Layout components: AppShell, Sidebar, Header, ContentArea, MobileNav
- Confidence state chips (Known, Estimated, Unsure, Unknown)
- Follow-up state badges (Fine for now, Confirm later, Priority to confirm, Resolved)
- Visibility state indicators (Private, Shared, etc.)
- Colour palette: calm, premium, accessible (AA contrast ratios)
- Typography scale: clear hierarchy, readable, modern
- Spacing and sizing tokens
- Dark mode: not required for launch, but tokens should not preclude it
- Motion: subtle, purposeful, never distracting
- Tone: the design system should embody "calm, intelligent, premium"

### 7. App shell

- Navigation structure (Home, Start here, Your plan, Financial picture, Evidence, Open questions, Shared space, Documents, Support)
- Responsive layout (desktop sidebar, mobile bottom nav or drawer)
- Environment banner (dev/staging/production)
- Loading states, empty states, error states as first-class patterns
- Auth-aware routing (public vs. authenticated areas)

### 8. AI orchestration layer

- Provider-agnostic interface: `generateCompletion(task, input, options)`
- Provider routing by task type (configurable mapping)
- Supported providers: Claude (Anthropic), Gemini (Google), OpenAI
- Model selection per task (e.g. claude-sonnet for summarisation, haiku for classification)
- Dry-run mode for dev/testing (logs prompt + mock response)
- Response caching where appropriate
- Error handling, retry logic, fallback routing
- Cost logging per call (model, tokens, estimated cost)
- Structured output parsing (JSON mode where supported)

### 9. Stripe stub

- Stripe client library installed
- Test/stub mode by default (no real credentials required)
- Clear visual indicator: "Payment system: test mode" in debug panel
- Environment variable toggle: `STRIPE_MODE=test|live`
- When no Stripe keys configured: graceful stub with logged events
- Basic types/interfaces for future subscription and one-time payment flows

### 10. PostHog integration

- PostHog JS SDK installed
- Event tracking helper functions
- Page view tracking
- Custom event tracking (aligned to instrumentation plan)
- User identification on auth upgrade (anonymous → authenticated)
- Feature flags client (for future use)
- Dev mode: events logged to console, not sent to PostHog

### 11. Debug infrastructure

- Debug panel component (dev/staging only, hidden in production)
  - Current session state (anonymous/authenticated, session ID, case ID)
  - Auth status and user details
  - Feature flags
  - AI call log (recent prompts, responses, costs)
  - Permission state for current case
  - Event log (recent timeline events)
- Environment banner (always visible in dev/staging)
- Console logging helpers with consistent formatting
- Error boundary components with dev-friendly error display

### 12. PDF generation

- Server-side PDF generation capability (for "Your Plan" download)
- Template-based approach (structured data → formatted PDF)
- Branded header/footer
- Accessible, clean layout
- Stub template ready for V1 to populate

### 13. Testing foundation

- Vitest configured for unit/integration tests
- Playwright configured for e2e tests (can defer e2e to V1)
- Test utilities: mock Supabase client, mock AI provider, test factories for core entities
- CI pipeline: lint → type-check → unit tests on every push
- Core schema tests: verify RLS policies, permission logic

### 14. Stubbed legal pages

- `/privacy` — placeholder privacy policy
- `/terms` — placeholder terms of service
- `/cookies` — placeholder cookie policy
- All marked clearly as drafts requiring legal review before go-live

### 15. Content structure

- MDX files for marketing/public pages
- Microcopy constants file for in-app copy (separable, editable)
- Legal page stubs as MDX

---

## V0 definition of done

- [ ] Next.js project runs locally with TypeScript strict mode
- [ ] Supabase dev project connected, migrations applied
- [ ] All 11 core entity tables created with RLS policies
- [ ] Anonymous auth flow works (visit → anonymous session → data persists)
- [ ] Auth upgrade flow works (anonymous → magic link → data linked)
- [ ] Design system primitives rendered in a component catalogue page
- [ ] App shell with navigation renders responsively
- [ ] AI orchestration layer callable with dry-run mode
- [ ] PostHog integration logs events in dev mode
- [ ] Stripe stub mode active with debug indicator
- [ ] Debug panel visible in dev environment
- [ ] PDF generation produces a test output
- [ ] CI pipeline passes (lint + types + unit tests)
- [ ] Legal page stubs accessible
- [ ] Environment banner shows correctly per environment
- [ ] README documents setup, architecture, and local dev instructions

---

## What V0 does NOT include

- Any V1 guided journey UI or logic
- Any V1 content or microcopy
- Marketing pages or landing page
- Real Stripe credentials or payment flows
- Document upload or processing
- AI prompts for specific verticals
- Real PostHog project (dev mode only)

V0 is the foundation. V1 is the first product.
