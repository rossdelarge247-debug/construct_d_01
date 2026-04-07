# Sprint 0 — Decisions Register

**Project:** Calm Separation Workspace
**Working title:** Decouple
**Date:** 2026-04-07

---

## Product summary

Applicant-first digital service for people in England and Wales navigating separation, divorce, child arrangements, and financial disentanglement. Premium, structured, world-class UX product for the messy middle of separation.

**Internal mantra:** Make the hard feel lighter.

---

## Decisions

### 1. Tech stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | Next.js (React) | Deployed on Vercel |
| Backend / API | Next.js API routes + Supabase | Typed, server-side where needed |
| Database | Supabase (PostgreSQL) | Relational, structured source of truth |
| Auth | Supabase Auth | Anonymous → authenticated upgrade (magic link + Google) |
| Object storage | Supabase Storage | Documents, evidence, uploads (V2+) |
| Payments | Stripe | Skeleton in V0, test/stub mode until credentials provided |
| Analytics | PostHog | Event tracking, funnels, session replay |
| AI (primary) | Claude (Anthropic) | Primary provider for high-stakes tasks |
| AI (secondary) | Gemini, OpenAI | Available for cost-optimised or task-specific routing |
| Content | MDX in repo | Separable from components; headless CMS added later when team grows |
| Hosting | Vercel + Supabase cloud | Managed infrastructure |

### 2. Build model

- **Solo founder + AI coding team** as primary build model
- Code must be clean, typed, well-structured, and handoff-ready
- Content/microcopy separated from components so a marketing professional can edit
- Module boundaries per vertical so human devs can orient quickly
- README and architecture docs maintained in repo

### 3. Build process per vertical

1. **Concept phase** — generate 2-3 UX concepts as text, diagrams, flow descriptions, tradeoff analysis
2. **Review phase** — discuss, pressure-test, and agree on the winning approach
3. **Build phase** — implement the agreed concept as production-quality, shippable code

No premature coding. Design first, decide together, then build for real.

### 4. Auth model — ephemeral to authenticated

- **Server-side ephemeral sessions** using Supabase anonymous auth
- User begins without sign-up; anonymous session created server-side
- All V1 inputs persisted against anonymous session token
- On authentication (magic link or Google), anonymous session linked to new account
- Rationale: data resilience in an emotional category, analytics on anonymous journeys, clean upgrade path

### 5. Build sequence

**V0 → V1 → V2 → V3 → V4 → V5**

- **V0** — Platform foundation (schema, auth, permissions, design system, shell, AI layer, debug infrastructure)
- **V1** — Guided entry + option shaping
- **V2** — Financial picture + evidence layer
- **V3** — Structured disclosure, open questions + negotiation tracking
- **V4** — Collaboration, professional roles + mediation modes
- **V5** — Draft outputs, application packs + formalisation prep

Full core schema designed up front in V0, even though V1 only populates a subset.

### 6. AI orchestration

- Provider-agnostic abstraction layer built in V0
- **High-stakes tasks** (summarisation, safeguarding, guidance) → Claude
- **High-volume / lower-stakes** (classification, simple extraction) → Haiku, Gemini Flash, or similar
- **Fallback routing** if primary provider unavailable
- Cost-awareness built into the model selection logic

### 7. V1 data scope

- **Structured input only** — no document upload or analysis
- All data captured via selections, text inputs, and confidence states
- Document/evidence pipeline is entirely a V2 concern
- Rationale: trust violation to ask for document uploads before authentication in this category

### 8. Safeguarding in V1

- **Option B — Structured screening** that actively shapes the route
- Early screening questions in situation snapshot
- Risk signals suppress collaboration language, flag mediation suitability concerns, surface specific resources
- Does not gatekeep but meaningfully adjusts guidance and tone

### 9. "Your Plan" output

- **Both** in-app summary page AND downloadable PDF
- Designed as the primary commercial bridge between V1 (free) and V2+ (premium)
- Must deliver standalone value even if the user stops here
- Must make gaps visible (estimated, unsure, unknown) to create natural motivation to continue
- Must be shareable with solicitors/mediators outside the platform
- Stubs/placeholders for V2 upsell CTAs until commercial model is finalised

### 10. Environments

| Environment | Frontend | Backend |
|-------------|----------|---------|
| Development | Local | Supabase dev project |
| Staging | Vercel preview | Supabase staging project |
| Production | Vercel production | Supabase production project |

### 11. Working title

**Decouple** — may change. No domain purchased yet.

### 12. Debug and developer experience

- **Debug mode** engineered as a first-class concern from V0
- Stripe test/stub mode with clear visual indicator until credentials provided
- Dev-only debug panel: session state, auth status, feature flags, AI call logs, permission states
- Environment banner: unmissable dev/staging/production indicator
- AI dry-run mode for testing flows without live API calls
- All services degradable gracefully with clear error states

### 13. Testing and CI

- Automated tests for core data model, permissions, and critical workflows from day one
- UI: light testing, lean on TypeScript and manual QA initially
- CI via GitHub Actions: lint + type check + core tests on every push
- Tests built as part of implementation, not as a separate phase

### 14. Accessibility

- **WCAG 2.1 AA** compliance targeted from the start
- Built into the design system, not retrofitted
- Keyboard support, screen-reader compatibility, strong contrast, clear focus states, sensible mobile responsiveness

### 15. Mobile stance

- **Responsive web app** — no native mobile apps
- Mobile is a supported viewport, not the primary design target
- No App Store / Play Store plans at launch

### 16. Content management

- **Phase 1 (now):** MDX files in the repo, separable from components
- **Phase 2 (team grows):** Add headless CMS (Sanity or Keystatic) as a visual editing layer
- No WordPress

### 17. Payments and commercial model

- Stripe skeleton wired in V0
- Test mode / stub until credentials are provided
- Clear visual indicator when running in test/stub mode
- Staged commercial model: free core value → premium depth → assisted/expert layer
- Billing principle: help first, save next, pay when the product becomes a deeper working system
- Legal/privacy pages stubbed as placeholders, updated before go-live

### 18. Analytics instrumentation

PostHog tracking planned for:
- Acquisition source
- Onboarding completion
- Route-finder completion
- First proposal completion
- First financial item created (V2)
- First document uploaded (V2)
- First share/invite (V4)
- First export/output generated (V5)
- Conversion to paid
- Drop-off by stage
- Time-to-value

---

## Source documents

1. Founder Pack V3.3 (authoritative strategic foundation)
2. Product Overview (implementation companion)
3. Founder Pack restatement (duplicate of #1, no conflicts)
4. Vertical 1 Strategy (full vertical spec)
5. Vertical 1 Interaction Spec (build-ready brief)
6. Verticals 3, 4, 5 Expanded Strategy
7. Vertical 1 UX Concept Generation Prompt (creative brief)

---

## Next steps

1. Produce V0 platform foundation plan
2. Begin V1 concept phase (3 UX concepts per Doc 7)
3. Review and select winning V1 concept
4. Build V0 foundation
5. Build V1
