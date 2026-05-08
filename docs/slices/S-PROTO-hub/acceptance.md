# S-PROTO-hub · Phase 3 prototype-area hub slice

**Status:** Open · drafted: session 74

**Phase:** 3 (per `docs/SESSION-CONTEXT.md` §"Session 74 priorities" §"Phase 3 sequence" P0)

## Pre-flight

- **Branch:** `claude/S-PROTO-hub` (from session-74 tip; rebased onto `fd16a04` after F4 split)
- **PR target:** `main` per spec 71 §7a single-branch-main
- **Adversarial review budget:** Option A — target ≤300L acceptance.md (verified end of file)
- **Calibration cohort:** First src/ slice post-B+C+D. Plan-architect persona's first review of a real slice (paraphrased: spec 72c §9 frames "first 3 src/ slices" as the retain/drop measurement window; this slice is row 1 of 3).
- **Plan-time review:** Path C manual persona-spawn (harness lacks plan-mode toggle). Plan-architect: 0 findings (approve). Exit-plan-review: 3 suggestions + 1 nitpick — all addressed: F2 paraphrase fix · F3 schema citation · F4 split landed at `fd16a04` · F1 size check at end.

## Authorisation

`docs/SESSION-CONTEXT.md` §"Session 74 priorities" §"Phase 3 sequence" P0 row authorises this slice as Phase 3 inception. Amendment landed in `780fa6c`; row-count alignment in `fd16a04`.

## Scope

**In scope:**

- Registry at `src/app/dev/proto/registry.ts` enumerating 61 site flows × 11 sections
- Zod schema at `src/app/dev/proto/registry-schema.ts` for compile + runtime validation
- Hub renderer at `src/app/dev/proto/page.tsx` (matches `/dev/heroes` pattern — compiles in production bundles, accessible on Vercel preview / production. Option A rename applied because user's workflow is Vercel-preview-driven; no local terminal for `npm run dev`.)
- Stub-route renderer at `src/app/dev/proto/[slug]/page.tsx` for status > `not-started` entries
- Components at `src/app/dev/proto/_components/`: StatusBadge · ConfidenceBadge · FlowRow · SectionHeader
- Vitest tests covering registry-Zod-validation + each component render + each page render

**Out of scope:**

- Real prototype routes for individual entries (P1 `S-PROTO-pre-signup-interview`, P2 `S-PROTO-section-confirm`, etc.)
- Mutation of registry from outside (read-only this slice)
- Persistence (registry static)
- Authentication / authorization (dev-mode-only routes; no user data)

## Schema (registry row shape)

Authoritative schema per `docs/SESSION-CONTEXT.md` §"Hub registry schema" (commit `780fa6c`). Per-row fields:

```ts
type RegistryRow = {
  id: string;             // kebab-case slug, unique
  title: string;
  section:
    | 'pre-auth-public'
    | 'auth-boundary'
    | 'post-signup-onboarding'
    | 'bank-connect'
    | 'hub'
    | 'build'
    | 'reconcile'
    | 'settle'
    | 'finalise'
    | 'cross-cutting'
    | 'dev-tools';
  status: 'not-started' | 'spec-only' | 'canvas-drafted' | 'prototype-built' | 'shipped';
  confidence: 'high' | 'medium' | 'low' | 'low-blocked';
  owner: 'user' | 'claude' | 'both';
  tags: string[];
  openQuestions: string[];  // ≤5
  lastTouched: { session: number; date: string };
  links: {
    spec?: string;
    canvas?: string;
    prototype?: string;
    slice?: string;
  };
};
```

Zod schema validates this at runtime; `z.infer` provides the TS type.

## Acceptance criteria

### AC-1 · Registry shipped — 61 rows × 11 sections

`src/app/dev/proto/registry.ts` exports `const registry: RegistryRow[]` containing 61 rows. Per-section counts:

| Section | Rows |
|---|---|
| `pre-auth-public` | 8 |
| `auth-boundary` | 3 |
| `post-signup-onboarding` | 4 |
| `bank-connect` | 5 |
| `hub` | 5 |
| `build` | 10 |
| `reconcile` | 5 |
| `settle` | 5 |
| `finalise` | 5 |
| `cross-cutting` | 5 |
| `dev-tools` | 6 |
| **Total** | **61** |

### AC-2 · Zod schema validates every row

`src/app/dev/proto/registry-schema.ts` exports a Zod schema matching the type definition above. A test asserts `schema.parse(row)` succeeds for every row. Schema runs at module load; throws on first failure.

### AC-3 · Hub page renders all 61 rows under 11 section headers

`src/app/dev/proto/page.tsx` renders the registry on a single dev-mode page. Section headers group rows in the order in AC-1. Each row displays: id · title · status badge · confidence badge · owner · tags · top open question · last-touched session.

Compiles in production bundles (no `.dev.tsx` infix; Option A); matches `/dev/heroes` pattern. Hub accessible at `/dev/proto` on preview + production deploys.

### AC-4 · Stub-route renders for status > `not-started` entries with hybrid content

`src/app/dev/proto/[slug]/page.tsx` is a dynamic route:

- Slug matches a registry row whose status ≠ `not-started` → stub page with: title + status badge + confidence badge + ALL open questions (full list) + displayed paths to spec/canvas/prototype/slice (whichever fields populated; rendered as `<code>` text for reference — values are internal repo paths, not navigable as web URLs)
- Slug doesn't match any row → 404 via Next.js `notFound()`

Zero design content (no marketing copy, no UI mockups, no fake screen shells).

### AC-5 · Components consume only S-F1 design tokens

Four components at `src/app/dev/proto/_components/` use only `--ds-*` tokens from S-F1 (PR #23, session 29).

Verification (asserted by test): grep over `_components/*.tsx` finds zero hex colours (`#[0-9a-fA-F]{3,8}`), zero `rgb()`/`rgba()`, zero raw `px` for spacing.

### AC-6 · 100% rule asserted (Σ rows = 61)

Test asserts:

- `registry.length === 61`
- For each `section` enum value: row count matches AC-1 table cell

Per CLAUDE.md §"Engineering conventions" §"100% rule".

### AC-7 · Tests pass with test-pain ≤1 mock per test

| Test | Mocks |
|---|---|
| Registry Zod-validation | 0 |
| Section counts match AC-1 table | 0 |
| StatusBadge × 5 states | 0 |
| ConfidenceBadge × 4 states | 0 |
| FlowRow render | 0 |
| SectionHeader render | 0 |
| Hub page render | 0 |
| Stub-route sample render | 1 (`notFound`) |
| Stub-route 404 | 1 (`notFound`) |

All ≤1. Under spec 72d §3 >2-mock pain threshold.

### AC-8 · Preview-deploy verification per spec 72a 6-dim rubric

`docs/slices/S-PROTO-hub/verification.md` §"Preview-deploy verification" records evidence for each dim: golden path · edge cases · `prefers-reduced-motion` · keyboard-only · mobile viewport (375×667) · screen-reader.

## Architectural seams (plan-architect Q1-5 — addressed in plan)

- **Q1 (seams):** registry pure data; hub + stub-route pure UI; no effects
- **Q2 (hidden effects):** none — no module-level mutable state, no hidden IO
- **Q3 (coupling):** none — slice contained to `src/app/dev/proto/`; no `src/lib/**` imports, no external services
- **Q4 (test-pain):** ≤1 mock per test
- **Q5 (hexagonal invariants):** all 5 spec-71-§4 / spec-72d-§4 fitness rules N/A by construction

## Spec citations

- `docs/SESSION-CONTEXT.md` §"Session 74 priorities" §"Phase 3 sequence" P0 (`780fa6c`/`fd16a04`) + §"Hub registry schema" (`780fa6c`)
- `docs/workspace-spec/72c-multi-agent-review-framework.md` §9 — calibration cohort framing (paraphrased)
- `docs/workspace-spec/72d-architecture-review-additions.md` §3 + §4 + §5
- `docs/workspace-spec/72a-preview-deploy-rubric.md` — DoD-4 rubric
- `docs/workspace-spec/72b-adversarial-review-budget.md` — Option A
- `docs/workspace-spec/71-rebuild-strategy.md` §4 + §7a
- `docs/slices/S-F1-design-tokens/acceptance.md` (PR #23) — token contract
- `CLAUDE.md` §"Engineering conventions" §"DoD" + §"100% rule"

## Status

- Open · planning complete (Path-C dual-persona reviewed; 4 findings addressed pre-impl)
- Implementation: pending TDD-first
