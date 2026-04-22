# Spec 70 — Complete Settlement Workspace Build Map (Hub)

**Date:** 22 April 2026
**Session:** 22 (P2)
**Status:** LIVE hub. Per-phase maps in sibling files 70-build-map-{phase}.md; slice index (70-build-map-slices.md) produced after the phase files.
**Related:** spec 68 (synthesis hub) + 68a-g · spec 42 (positioning) · spec 44 (document-as-spine) · spec 67 (profiling) · CLAUDE.md (positioning + visual direction + quality bar).

---

## Purpose

This map is the full picture of what the Complete Settlement Workspace contains, phase by phase, component by component, with every preserved legacy library tagged and every known-unknown traced back to its 68f/g entry. It is the input to Phase C (execution planning + code extraction + deployable slice selection).

**The map is not a prioritisation doc.** Scope decisions (first slice, MLP vs V1.5 vs V2, sprint-level cuts) happen at Phase C kickoff and per-slice engineering setup — not here. The map stays complete so scope decisions can be made against the full surface.

**MLP not MVP.** When scope conversations happen later, they should be framed as "what the *loveable* version requires vs what can iterate post-launch" — not "what's the minimum viable." Matches CLAUDE.md north star.

---

## Tagging conventions

Every component per phase gets one primary tag. Some may carry a secondary annotation (e.g. Anchor + Variant-producing).

| Tag | Meaning | Example |
|---|---|---|
| **Anchor** | New component. Visual design already in Claude AI Design outputs. Extracted at Phase C Step 1. | Sarah's Picture document shell, 5-phase stepper, phase colour system |
| **Derived** | Variant of an Anchor living in a different phase. Same component family, different context. | Our Household Picture = derived from Sarah's Picture shell |
| **Variant** | State-variation of a component within the same surface. | Dashboard first-time-zero / post-connection / mid-phase |
| **Re-use** | Legacy library kept as-is. Exports + public API preserved. | Signal rules engine, Tink client, extraction schemas |
| **Preserve-with-reskin** | Legacy logic kept, UI rebuilt against new design system. | Confirmation-questions logic (spec 22 decision trees) drives new per-section confirmation UI |
| **Known-unknown** | Component or decision not yet locked. Linked to a 68f/g entry. | Task taxonomy category completeness (68g B-11) |

Tag choice is an engineering judgement — re-classify during Phase C if initial assumption breaks.

---

## Preserved legacy inventory

Classification of every file under `src/` against the reuse taxonomy. Re-use = carry across unchanged; Preserve-with-reskin = logic kept, UI rebuilds; Dev-only = tooling moves under `/app/dev/` (spec 71 pattern) with `MODE === 'prod'` gate (spec 72 §7); Discarded = do NOT port. Classification as of session 23 audit against specs 42 / 44 / 65 / 67 / 68 suite / 70. Update when verdict changes or new code is added.

### Bank / Open Banking

| Library | Path | Notes |
|---|---|---|
| Tink API client | `src/lib/bank/tink-client.ts` | Re-use. Stable Tink Link auth integration. |
| Tink transformer | `src/lib/bank/tink-transformer.ts` | Re-use. Tink payload → BankStatementExtraction. |
| Bank data utils | `src/lib/bank/bank-data-utils.ts` | Re-use. Extraction → UI types + demo factory + transaction search. |
| Signal rules (17) | `src/lib/bank/signal-rules/` | Re-use. Session 18 level-2 expansion — stable. |
| Confirmation questions | `src/lib/bank/confirmation-questions.ts` | **Preserve-with-reskin.** Spec 22 decision trees drive question generation; UI rebuilds per 68b. |
| Test scenarios (5) | `src/lib/bank/test-scenarios.ts` | Re-use. Synthetic dev data; also feeds S-F7 scenario picker (spec 71). |
| CSV parser | `src/lib/bank/csv-parser.ts` | Re-use. Monzo / Barclays / Starling CSV → BankStatementExtraction. |
| Ntropy client | `src/lib/bank/ntropy-client.ts` | Re-use. Enrichment oracle positioned after Tink, before signal rules. |
| User corrections | `src/lib/bank/user-corrections.ts` | Re-use. Correction persistence + golden-data bridge (localStorage → Supabase). |
| Bank connect API | `src/app/api/bank/connect/route.ts` | Re-use. Tink Link URL generation. |
| Bank callback API | `src/app/api/bank/callback/route.ts` | Re-use. Tink callback (iframe postMessage + redirect). |

### AI / extraction

| Library | Path | Notes |
|---|---|---|
| Extraction schemas | `src/lib/ai/extraction-schemas.ts` | Re-use. Anthropic structured outputs with `additionalProperties: false`. |
| Result transformer | `src/lib/ai/result-transformer.ts` | Re-use. Spec 13 decision trees + spec 19 keyword lookup. |
| Document analysis | `src/lib/ai/document-analysis.ts` | Re-use. Tier classification (auto / confirm / question / gap); spec 13 grounding. |
| Extraction prompts | `src/lib/ai/extraction-prompts.ts` | Re-use. Document-type prompts (bank / payslip / mortgage / pension / ...); spec 13 + Form E field mapping. |
| Pipeline | `src/lib/ai/pipeline.ts` | Re-use. Two-step Haiku+Sonnet orchestration; no deprecated model IDs. |
| Plan narrative | `src/lib/ai/plan-narrative.ts` | Re-use. Spec 65 O7 interview-output narrative; no V1 baggage. |
| Provider | `src/lib/ai/provider.ts` | Re-use. Claude / Gemini / OpenAI abstraction with task routing. |

### Auth + persistence

| Library | Path | Notes |
|---|---|---|
| Supabase client | `src/lib/supabase/client.ts` | Re-use. Browser client factory; SSR-safe. |
| Supabase middleware | `src/lib/supabase/middleware.ts` | Re-use. Session refresh; auth token management. |
| Supabase server | `src/lib/supabase/server.ts` | Re-use. Server-side client with cookie handling. |
| Workspace store | `src/lib/supabase/workspace-store.ts` | **Preserve-with-reskin.** State persistence valid; data model primes reconciled architecture. Will be wrapped by S-F7 `WorkspaceStore` abstraction (spec 71) as the prod implementation behind `DECOUPLE_AUTH_MODE=prod`. |

### Payments + analytics + documents

| Library | Path | Notes |
|---|---|---|
| Stripe client | `src/lib/stripe/client.ts` | Re-use. Test / live / stub mode detection; safe stub fallback. |
| PostHog analytics | `src/lib/analytics/posthog.ts` | Re-use. Init + event tracking; dev-mode safe. Event allowlist per spec 72 §8. |
| Document processor | `src/lib/documents/processor.ts` | Re-use. Document classification + type mapping. |
| Recommendations | `src/lib/recommendations.ts` | Re-use. Rule-based from interview (spec 65 O1-O6). |

### Types

| Library | Path | Notes |
|---|---|---|
| Hub types | `src/types/hub.ts` | Re-use with pruning. Workspace types (keep); legacy interview types inside (prune — `src/types/interview.ts` is fully Discarded below). |
| Workspace types | `src/types/workspace.ts` | **Preserve-with-reskin.** `FinancialPictureItem` / `DocumentUpload` / `SpendingCategory` valid for Phase 2 Build; ownership / confidence / status enums align to spec 68 trust system; refactor for shared-document model. |
| Type index | `src/types/index.ts` | Re-use. Type export hub. |

### Hooks

| Library | Path | Notes |
|---|---|---|
| `use-count-up` | `src/hooks/use-count-up.ts` | Re-use. Count-up animation; spec 26 compatible. |
| `use-hub` | `src/hooks/use-hub.ts` | Re-use. Hub state machine (configuration / items / lozenges / questions); localStorage persistence. |
| `use-staggered-reveal` | `src/hooks/use-staggered-reveal.ts` | Re-use. Reveal timing utility; spec 26 compatible. |
| `use-interview` | `src/hooks/use-interview.ts` | **Preserve-with-reskin.** Session state machine valid; types need spec-65 refactor. |
| `use-workspace` | `src/hooks/use-workspace.ts` | **Preserve-with-reskin.** Persistence + auto-save sound; type shape ready for reconciled schema. |

### Constants + utilities

| Library | Path | Notes |
|---|---|---|
| Classnames util | `src/utils/cn.ts` | Re-use. `clsx` + `twMerge`; generic. |
| App constants | `src/constants/index.ts` | **Preserve-with-reskin.** `APP_NAME` re-use; `WORKSPACE_PHASES` hardcodes 4-phase old model — update to spec 42 five-phase (Start / Build / Reconcile / Settle / Finalise). |

### UI primitives + layout

| Library | Path | Notes |
|---|---|---|
| Exit page | `src/components/ui/exit-page.tsx` | Re-use. Generic exit handler; safeguarding-relevant per spec 72 §9. |
| Button | `src/components/ui/button.tsx` | **Preserve-with-reskin.** Variant logic valid; V1 palette (`#E5484D`, `--color-grey-100`) → new design-system tokens at S-F1. |
| Card | `src/components/ui/card.tsx` | **Preserve-with-reskin.** Wrapper valid; V1 palette (`border-cream-dark`, `bg-surface`) → new tokens. |
| Badge | `src/components/ui/badge.tsx` | **Preserve-with-reskin.** Confidence-badge shell valid; V1 palette tokens. |
| Env banner | `src/components/layout/env-banner.tsx` | **Preserve-with-reskin.** Environment indicator valid; feeds S-F7 dev banner (current mode + scenario + reset). |
| Footer | `src/components/layout/footer.tsx` | **Preserve-with-reskin.** Shell re-usable; align to spec 68a nav at reskin. |
| Header | `src/components/layout/header.tsx` | **Preserve-with-reskin.** Nav valid; V1 palette → new tokens. |

### Hub components

| Library | Path | Notes |
|---|---|---|
| Category selector | `src/components/hub/category-selector.tsx` | Re-use. Form E category taxonomy; no palette coupling. |
| Discovery flow | `src/components/hub/discovery-flow.tsx` | Re-use. Configuration stepper with typed state. |
| Evidence lozenge | `src/components/hub/evidence-lozenge.tsx` | Re-use. Evidence badge UI; spec 68g C-V pattern candidate. |
| Hero panel | `src/components/hub/hero-panel.tsx` | Re-use. Section disclosure + clarification handler. |
| Section cards | `src/components/hub/section-cards.tsx` | Re-use. Section rendering with CountUp integration. |
| Fidelity label | `src/components/hub/fidelity-label.tsx` | **Preserve-with-reskin.** Fidelity levels logic valid; UI needs rebuild. |

### API routes (production)

| Route | Path | Notes |
|---|---|---|
| Document extraction | `src/app/api/documents/extract/route.ts` | Re-use. Two-step pipeline orchestrator; 300s maxDuration for real PDFs. |
| Ntropy enrichment | `src/app/api/ntropy/enrich/route.ts` | Re-use. Proxy keeping API key server-side; free-tier credit guard. |
| Plan generation | `src/app/api/plan/generate/route.ts` | Re-use. Spec 65 O7 interview plan generation. |

### Dev tools (Re-use + Move to `/app/dev/`)

All items move under the `/app/dev/` route group per spec 71 S-F7 dev-mode pattern. Gated by `MODE === 'prod'` notFound per spec 72 §7. Production build: routes return 404, imports tree-shaken from prod bundle.

| Tool | Current path | Target path | Notes |
|---|---|---|---|
| Engine workbench | `src/app/workspace/engine-workbench/page.tsx` | `src/app/dev/engine-workbench/page.tsx` | Re-use. Signal-rule testing against scenarios. |
| Debug panel | `src/components/hub/debug-panel.tsx` | `src/components/dev/debug-panel.tsx` | Re-use. Pipeline diagnostics UI. |
| Tink debug panel | `src/components/hub/tink-debug-panel.tsx` | `src/components/dev/tink-debug-panel.tsx` | Re-use. Tink API diagnostics. |
| Test pipeline API | `src/app/api/test-pipeline/route.ts` | `src/app/dev/api/test-pipeline/route.ts` (or delete at launch) | Re-use. Haiku+Sonnet smoke test. |
| Bank test API | `src/app/api/bank/test/route.ts` | `src/app/dev/api/bank/test/route.ts` | Re-use. Tink sandbox data helper. |
| Health check API | `src/app/api/health/route.ts` | `src/app/api/health/route.ts` (keep — prod monitoring) | Re-use. Prod-facing health endpoint. |

### Discarded (do NOT port)

Superseded by the reconciled framing (specs 42 / 44 / 65 / 67 / 68 / 70). Logic either has no forward path or is captured in preserved libraries above. Do not extend; do not port.

**Marketing pages** — violate spec 42 positioning (frame Decouple as "financial disclosure tool" / "Form E nightmare"):
- `src/app/page.tsx` — landing with 4-phase spec-18 tracker
- `src/app/features/page.tsx` — "Orientate / Prepare / Share / Settle" + "Form E" copy
- `src/app/pricing/page.tsx` — "Prepare / Share-Negotiate / Finalise" tiers + Form E section references

**Legal placeholders** — status: **Preserve-with-reskin** — draft structure retained, legal review required before launch per spec 56 L2:
- `src/app/privacy/page.tsx`
- `src/app/terms/page.tsx`
- `src/app/cookies/page.tsx`

**Pre-signup interview** — V1 Gentle Interview 4-phase 14-page flow superseded by spec 65 O1-O8:
- `src/app/start/*` (entire subtree — 14 pages + layout)
- `src/components/interview/*` (5 files: card-select, explainer, interview-layout, interview-provider, micro-moment)

**V2 workspace UI** — tied to spec 18 palette + pre-pivot flow:
- `src/components/workspace/*` (32 files, ~7,132 lines)
- `src/app/workspace/{agree, build, disclose, finalise, negotiate}/page.tsx` (see Known-unknowns — provisionally Discarded pending spec 71 resolution)

**Other discarded items:**
- `src/components/hub/title-bar.tsx` — V1 palette + spec 18 menu; replaced by C-V6 dashboard stepper
- `src/types/interview.ts` — V1 session types; replaced by spec 65 shape

Per CLAUDE.md negative constraint: "Do not extend `/src/components/workspace` without the Build Map in place" — with the Build Map in place, the action is **replace**, not extend.

### Known-unknowns (resolve at spec 71)

Items where audit evidence is incomplete or conflicts with CLAUDE.md key files inventory. Flagged for explicit resolution when spec 71 (rebuild strategy) lands.

| Path | Conflict / gap | Resolution pathway |
|---|---|---|
| `src/app/workspace/page.tsx` | CLAUDE.md says Discarded; audit says Preserve-with-reskin (session persistence + view-routing state machine has forward value). | Read file in spec 71 session; adjudicate: keep state-machine as Preserve-with-reskin vs clean rebuild. |
| `src/app/workspace/{build, reconcile, settle, finalise}/page.tsx` | Audit did not deeply sample; provisional mapping to spec 42 five-phase pages uncertain. | Read in spec 71; if placeholders → Re-use shells as new route targets; if V1 content → Discarded. |
| `src/app/workspace/agree/page.tsx` | Audit says Preserve-with-reskin (FuturePhasePage placeholder). Phase 4 = Settle (not "Agree") per spec 42. | Rename route to `/settle` + reskin; logic preserved. |
| `src/app/workspace/layout.tsx` | Audit says Re-use (ToastProvider wrapper). Path changes as `/workspace` restructures. | Move to new phase-routes parent (likely `src/app/(authed)/layout.tsx` per spec 71). |

---

## Audit trail

- **Session 22** (Build Map produced): headline Re-use items (bank + ai libs, engine workbench, hub types) classified. Large middle zone left unclassified.
- **Session 23 audit**: 59 files classified with evidence via Explore agent. Key corrections applied above — marketing pages → Discarded (positioning violation, not Preserve-with-reskin); `hub/*` split (5 Re-use, 1 Preserve-with-reskin, 1 Discarded, 2 Dev-only+Move); `lib/supabase/workspace-store` → Preserve-with-reskin feeding S-F7; majority of `lib/*` → Re-use cleanly; `types/interview.ts` → Discarded.

---

## How to read the map

1. **Start with the phase you're planning work on.** Open `70-build-map-{phase}.md`.
2. **Scan the Component list by tag.** Anchors + Derived + Variants = what needs to be built; Re-use + Preserve-with-reskin = what carries over; Known-unknowns = what must be locked before build.
3. **Check open dependencies.** Each phase file links back to 68f/g entries — resolve those before committing to scope.
4. **For cross-phase / end-to-end perspectives, open the slice index** (`70-build-map-slices.md`) — it lists delivery units that cut through multiple phases.

---

## Index

| File | Phase / scope | Status |
|---|---|---|
| `70-build-map.md` | Hub (this file) | ✅ |
| `70-build-map-start.md` | Phase 1: Start | — |
| `70-build-map-build.md` | Phase 2: Build — Sarah's Picture | — |
| `70-build-map-reconcile.md` | Phase 3: Reconcile — Our Household Picture | — |
| `70-build-map-settle.md` | Phase 4: Settle — Settlement Proposal | — |
| `70-build-map-finalise.md` | Phase 5: Finalise — Generated legal docs + post-submit | — |
| `70-build-map-slices.md` | Slice index (cross-phase delivery units) | — |

---

## Maintenance

When a Known-unknown locks → update the relevant phase file tag and move the entry in 68f/g to 🟢 with a commit reference. When a new component is surfaced during engineering spikes → add to the relevant phase file with appropriate tag. The map is a living spec — it evolves with the build.
