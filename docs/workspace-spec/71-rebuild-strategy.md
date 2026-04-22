# Spec 71 — Rebuild Strategy + Dev-Mode Foundation

**Date:** 22 April 2026
**Session:** 23 P0-1c
**Status:** LIVE. Execution plan for the rebuild — folder structure, stable-lib preservation, dev-mode pattern (S-F7), staged removal of Discarded tree, migration sequencing.
**Related:** spec 70 Build Map suite (inventory + slice catalogue) · spec 72 engineering security principles · CLAUDE.md key files · `docs/engineering-phase-candidates.md` parked engineering conventions.

---

## Purpose

Convert the Build Map (spec 70) into a concrete rebuild execution plan. Defines: folder structure, what moves / stays / goes, the dev-mode abstraction layer (new slice S-F7), and the sequenced removal of the Discarded tree. This is the spec that makes Phase C ship-ready — slices built against it have a stable place to land and a clear removal path for what they replace.

Preceded by spec 70 (what exists + classification) and spec 72 (security rules that shape the abstractions). Feeds Phase C Step 1 (extract design system + build first slice).

---

## 1. Rebuild shape — decisions recap

Four decisions locked in session 23 P0-1 with the user. Each has a reasoning line in case a future session wants to revisit.

| Decision | Locked value | Reasoning |
|---|---|---|
| **Restructure shape** | Same-repo in-place | Discarded tree replaced by staged slices; preview deploys continuous; linear PR history. Alternatives (parallel `src2/`, new repo) add complexity without buying risk isolation that the slice model already provides. |
| **Folder layout** | Hybrid — phases for routes, concerns for components | Phases map to user journey (`/app/build`, `/app/reconcile`, ...); shared anchors (trust-chip, stepper, document-shell) span all phases so they live in `/components/anchors` not per-phase. Slice-specific flows live under `/components/features/S-XX/`. |
| **Stable-lib paths** | Keep current paths | Zero import-churn; CLAUDE.md + spec 70 inventory stay accurate without rewriting imports across preserved code. Consolidation (e.g. collapse `lib/` into domain folders) is its own slice, not coupled to the rebuild. |
| **Discarded-tree removal** | Staged per slice | Each slice that replaces a surface deletes the old tree as part of its DoD. Preview deploys never fully broken; git blame stays intact per surface. Alternative (big-bang) risks cascading breakage across remaining preserved code. |

**Additional principles carried into this spec:**
- **Dev-mode first-class** — not a hack or special case. Abstraction layer (S-F7) behind which prod + dev implementations sit. Controlled via `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=dev|prod`. Design doc in §4.
- **MLP not MVP** — per CLAUDE.md. Applies per slice at engineering setup; not a rebuild-strategy decision.
- **Security baked in** — spec 72 rules apply from the first commit. Every folder has a data-classification responsibility; every boundary has validation; dev/prod enforcement is multi-layered.

## 2. Target folder structure

End-state after rebuild complete. Slices move paths incrementally; at any point during rebuild some paths are legacy-location and some are new. Spec 70 hub inventory + §5 staged-removal table track current state.

```
src/
  app/
    (marketing)/                    # public unauthed — landing, features, pricing, legal
      page.tsx                      # new landing, spec 42 positioning
      features/page.tsx             # new
      pricing/page.tsx              # new
      privacy/page.tsx              # Preserve-with-reskin shell + legal review
      terms/page.tsx                # Preserve-with-reskin shell + legal review
      cookies/page.tsx              # Preserve-with-reskin shell + legal review
    (authed)/                       # all user-gated routes
      layout.tsx                    # auth gate + ToastProvider + env-banner
      start/                        # pre-signup interview — spec 65 O1-O8 (NOT pre-auth; runs public with per-screen auth prompt on completion)
      dashboard/                    # workspace home — S-B3
      build/                        # Phase 2 — Sarah's Picture document + confirmation loops + evidence upload
      reconcile/                    # Phase 3 — Our Household Picture + conflict resolution
      settle/                       # Phase 4 — Settlement Proposal + negotiation + signature
      finalise/                     # Phase 5 — Legal doc generation + pre-flight + submit + tracker
    dev/                            # MODE === 'prod' → notFound; see §4 + spec 72 §7
      layout.tsx                    # gate
      engine-workbench/page.tsx     # moved from /workspace/engine-workbench
      scenarios/page.tsx            # S-F7 scenario picker
      state-inspector/page.tsx      # S-F7 dev-store viewer
      reset/page.tsx                # S-F7 state wipe
      api/                          # dev-only API routes
        test-pipeline/route.ts      # moved from /api/test-pipeline
        bank/test/route.ts          # moved from /api/bank/test
    api/                            # prod API routes — unchanged paths
      bank/
        connect/route.ts            # Re-use unchanged
        callback/route.ts           # Re-use unchanged
      documents/extract/route.ts    # Re-use unchanged
      ntropy/enrich/route.ts        # Re-use unchanged
      plan/generate/route.ts        # Re-use unchanged
      auth/panic-exit/route.ts      # NEW — spec 72 §9 exit-this-page session invalidation
      health/route.ts               # Re-use unchanged (prod monitoring)
    globals.css                     # reset for new design system
    layout.tsx                      # root layout, minimal
  components/
    design-system/                  # S-F1 — tokens + primitives
      tokens/                       # CSS custom properties — phase colours, typography, shadows, spacing
      primitives/                   # button, card, chip, input, badge — rebuilt against tokens
      index.ts
    anchors/                        # C-V1..C-V14 — shared across phases
      phase-stepper/                # C-V6
      trust-chip/                   # C-T1 locked
      document-shell/               # S-F2 — the three-column shell
      coach-card/                   # S-F5
      task-row/                     # C-V8
      bank-picker/                  # C-V10
      trust-band/                   # C-V11
      locked-section/               # C-V12
      welcome-carousel/             # C-V2
      keyboard-affordance/          # C-V4
      (etc. per spec 68g)
    documents/                      # document renderers — use document-shell anchor
      sarahs-picture/
      household-picture/            # derived from sarahs-picture
      settlement-proposal/          # derived
      legal-docs/                   # consent order, D81, Form P, summary
    features/                       # slice-specific flows that don't repeat
      S-O1-primary-onboarding/
      S-B1-bank-connection/
      S-B2-sarahs-picture/
      ...                           # per slice-index (spec 70-build-map-slices.md)
    layout/                         # framework-level chrome
      header.tsx                    # Preserve-with-reskin
      footer.tsx                    # Preserve-with-reskin
      env-banner.tsx                # Preserve-with-reskin — powers dev-mode surface
      exit-page.tsx                 # Re-use (was ui/exit-page)
    dev/                            # dev-only components (moved from hub/)
      debug-panel.tsx               # moved
      tink-debug-panel.tsx          # moved
      scenario-picker.tsx           # NEW (S-F7)
      state-inspector.tsx           # NEW (S-F7)
  lib/
    auth/                           # NEW — S-F7 abstraction layer
      index.ts                      # public API — MODE, getSession, getAuthGate
      session.types.ts              # Session interface
      dev-session.ts                # dev impl — fixture user, localStorage-backed
      supabase-session.ts           # prod impl — wraps lib/supabase/*
      auth-gate.ts                  # requireUser + redirectIfAuthed
    store/                          # NEW — S-F7 WorkspaceStore abstraction
      index.ts
      workspace-store.types.ts
      dev-store.ts                  # localStorage versioned key, scenario loader
      supabase-store.ts             # wraps lib/supabase/workspace-store.ts
    ai/                             # Re-use — paths unchanged
    analytics/                      # Re-use — paths unchanged
    bank/                           # Re-use — paths unchanged
    documents/                      # Re-use — paths unchanged
    recommendations.ts              # Re-use
    stripe/                         # Re-use — paths unchanged
    supabase/                       # Re-use — paths unchanged (wrapped by auth/ + store/)
  hooks/                            # paths unchanged; prune Discarded per spec 70 inventory
  types/                            # paths unchanged; prune Discarded per spec 70 inventory
  constants/                        # paths unchanged; update WORKSPACE_PHASES to spec 42 five-phase
  utils/                            # paths unchanged
```

**Rationale per new grouping:**

- **`app/(marketing)`** route group — public unauthed routes share a layout with no auth gate; phase routes live under `(authed)` with auth gate. Route groups add zero URL segments, just isolate layouts cleanly.
- **`app/(authed)`** — every route under this group gets the auth-gate check + ToastProvider + dev-mode env-banner. Dashboard, phase routes, pre-signup-interview all sit here (even though `/start` is public-facing, it writes to the workspace store at completion, so it's gated the same way via a softer "create account or continue as dev" pattern per S-F7 + S-O1 handoff).
- **`app/dev/`** — single top-level namespace for all dev-only tooling. One place to check when verifying dev/prod boundary. Gated at layout level via `MODE === 'prod'` notFound (spec 72 §7).
- **`components/design-system/`** — tokens + primitives together (spec 18 style but new palette). First thing Phase C extracts (S-F1).
- **`components/anchors/`** — the C-V1..C-V14 shortlist. Shared across phases. Each anchor = its own folder with component + styles + stories/tests.
- **`components/documents/`** — document renderers are derivation-heavy (Sarah's Picture → Our Household Picture → Settlement Proposal). Shared `document-shell/` anchor referenced; per-document wrappers live here.
- **`components/features/S-XX-name/`** — slice-specific flows that don't repeat across phases (e.g. bank connection wizard, proposal counter-cycling). Named by slice ID for traceability back to spec 70 slice catalogue.
- **`lib/auth/`** + **`lib/store/`** — new abstraction layer. S-F7 slice builds this. Everything else consumes; nothing else talks to `lib/supabase/*` directly.

## 3. Stable-lib preservation

All Re-use items in spec 70 hub (§ Bank / AI / Auth+persistence / Payments+analytics+documents / Types / Hooks / Constants+utilities) keep their current paths. No rename, no move, no refactor inside the rebuild.

**Rule:** if a file is tagged Re-use in spec 70, its import path is identical before and after Phase C completes. Slices that consume Re-use libs use the current import path; those paths don't change as an artefact of the rebuild.

**Exceptions (explicit moves):**

Only these files move during rebuild. Every move is tracked here + in spec 70 hub dev-tools table.

| From | To | Slice that does the move | Reason |
|---|---|---|---|
| `src/app/workspace/engine-workbench/page.tsx` | `src/app/dev/engine-workbench/page.tsx` | S-F7 | Dev-only namespace consolidation |
| `src/components/hub/debug-panel.tsx` | `src/components/dev/debug-panel.tsx` | S-F7 | Dev-only namespace consolidation |
| `src/components/hub/tink-debug-panel.tsx` | `src/components/dev/tink-debug-panel.tsx` | S-F7 | Dev-only namespace consolidation |
| `src/app/api/test-pipeline/route.ts` | `src/app/dev/api/test-pipeline/route.ts` | S-F7 | Dev-only namespace consolidation (or delete at launch if truly unused) |
| `src/app/api/bank/test/route.ts` | `src/app/dev/api/bank/test/route.ts` | S-F7 | Dev-only namespace consolidation |
| `src/components/ui/exit-page.tsx` | `src/components/layout/exit-page.tsx` | S-X2 | Exit-this-page is universal chrome, belongs with layout, not UI primitives |

**Preserve-with-reskin handling:** these files keep their paths during the rebuild. The reskin happens inside the file (token swaps, component updates) not via path move. File-level Preserve-with-reskin examples: `components/ui/{button, card, badge}` consume new design-system tokens; `components/layout/{header, footer, env-banner}` align to spec 68a + power dev banner.

**Pruning inside preserved files:** `src/types/hub.ts` is Re-use but contains legacy interview types that prune out — same file, smaller contents. Done during S-F7 (types cleanup happens as the auth/store abstractions land). `src/constants/index.ts` updates `WORKSPACE_PHASES` from 4-phase to spec 42 five-phase — same file, updated values. Done during S-F3 (phase nav slice, which is the first consumer of the constant).

**Import-path stability is a test:** any PR that changes a Re-use file's path without being called out in the table above should fail review. The table is the canonical list of moves.

## 4. Dev-mode pattern — S-F7 slice

Dev mode is a **first-class implementation behind a real interface**, not a special case sprinkled through the code. Same domain code paths run in dev and prod; only the implementation behind the interface swaps. Hexagonal-architecture style. Boundary enforcement is multi-layered per spec 72 §7.

### Three abstractions

**Session** — who the user is.
```ts
interface UserSession {
  id: string;
  email: string;
  role: 'participant' | 'admin' | 'support';
  twoFactorVerified: boolean;
  createdAt: Date;
  lastActiveAt: Date;
  deviceFingerprint: string;
}
```

**WorkspaceStore** — where user-scoped state lives.
```ts
interface WorkspaceStore {
  read<T>(userId: string, scope: string): Promise<T | null>;
  write<T>(userId: string, scope: string, data: T): Promise<void>;
  subscribe<T>(userId: string, scope: string, callback: (data: T) => void): () => void;
  // reset() is dev-only — real account deletion is a separate DSAR-compliant flow (slice TBD)
}
```

**AuthGate** — route guards.
```ts
interface AuthGate {
  requireUser(): Promise<UserSession>;       // throws → redirect to /start if no session
  redirectIfAuthed(to: string): Promise<void>; // for unauthed-only routes (landing, signup)
  currentSession(): Promise<UserSession | null>; // non-throwing check
}
```

### Switch mechanism

Single env var: `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=dev|prod`. Read once at module init in `src/lib/auth/index.ts`:

```ts
// src/lib/auth/index.ts
export const MODE: 'dev' | 'prod' =
  process.env.NEXT_PUBLIC_DECOUPLE_AUTH_MODE === 'prod' ? 'prod' : 'dev';

// Runtime assertion — spec 72 §7
if (process.env.NODE_ENV === 'production' && MODE !== 'prod') {
  throw new Error('DECOUPLE_AUTH_MODE must be "prod" in production build');
}

export const getSession = MODE === 'prod' ? supabaseSession : devSession;
export const getAuthGate = MODE === 'prod' ? supabaseAuthGate : devAuthGate;
```

And symmetric in `src/lib/store/index.ts`:
```ts
import { MODE } from '@/lib/auth';
export const getStore = MODE === 'prod' ? supabaseStore : devStore;
```

All slice code consumes `import { getSession, getAuthGate, getStore } from '@/lib/auth'` (or `'@/lib/store'`). Never touches Supabase directly, never touches the env var directly. ESLint rule enforces (spec 72 §7).

### Dev implementation details

**`dev-session.ts`** — returns a fixture user based on current scenario. Fixture users have synthetic emails on `@dev.decouple.local` domain (spec 72 §7 fixture isolation). `twoFactorVerified: true` by default (dev bypass). State lives in `localStorage` under `decouple:dev:session:v1`.

**`dev-store.ts`** — reads/writes to `localStorage` under versioned key pattern `decouple:dev:store:v1:{userId}:{scope}`. Subscribe uses `storage` event (cross-tab) + custom event dispatch (same-tab). Graceful degradation if localStorage unavailable (log warning, continue in-memory; dev-only behaviour).

**`dev-auth-gate.ts`** — always returns the current fixture session; `redirectIfAuthed` is a no-op in dev (we want to see pages regardless).

### Dev surface routes (under `/app/dev/`)

All gated by `MODE === 'prod'` notFound at layout level (spec 72 §7):

| Route | Purpose |
|---|---|
| `/dev` | Dashboard — links to tools below + current-mode + current-scenario |
| `/dev/scenarios` | Scenario picker — select fixture state; reload reloads with chosen scenario applied |
| `/dev/state-inspector` | Current dev store contents as JSON + edit affordance + save-back |
| `/dev/reset` | Confirm + wipe `decouple:dev:*` localStorage keys + redirect to `/dev` |
| `/dev/engine-workbench` | Moved from `/workspace/engine-workbench` — signal-rule testing |

### Dev banner (env-banner reskin)

`src/components/layout/env-banner.tsx` (Preserve-with-reskin) becomes the persistent dev-mode surface:
- Current mode chip (DEV / PROD)
- Current scenario name + switcher dropdown
- Reset button (wipes + reloads)
- `MODE === 'prod'` → returns `null` unconditionally

Rendered inside `(authed)` layout (banner hidden on marketing routes regardless of mode). In dev preview deploys, every page shows the banner.

### Fixture scenario library (initial 8)

JSON fixtures under `src/lib/store/scenarios/*.json` + a loader in `scenario-loader.ts`:

1. **`cold-sarah`** — blank workspace, no bank, no data
2. **`sarah-connected`** — bank connected, extractions loaded, confirmations not started
3. **`sarah-mid-build`** — confirmations ~50% complete, some estimates, some evidence
4. **`sarah-complete`** — build complete, Sarah's Picture ready to share
5. **`sarah-shared-mark-invited`** — shared, Mark invited but not signed in
6. **`sarah-reconcile-in-progress`** — both built, joint doc, conflicts pending
7. **`sarah-settle`** — settlement proposal in progress
8. **`sarah-finalise`** — ready for consent order generation

Each scenario = deterministic state snapshot. Picking a scenario = `reset + load scenario JSON into dev store + reload`. Scenarios cover the states a slice needs to be testable end-to-end.

Existing `src/lib/bank/test-scenarios.ts` (Re-use) feeds the bank portions of the scenarios — no duplication.

### Public → authed handoff in dev mode

Pre-signup interview (`/start`, spec 65 O1-O8) runs in both modes. In prod: interview output → signup → Supabase workspace store. In dev: interview output → dev store under fixture user → skip-signup link → dashboard loads that user.

Same code path, same state model, different backend. When real auth ships: flip env var, real signup writes to Supabase, dashboard reads from Supabase. No route logic changes. No form logic changes.

### Real-Supabase migration playbook (parked open)

When we flip to `DECOUPLE_AUTH_MODE=prod` for the first real launch environment:
1. Supabase project provisioned with RLS policies (spec 72 §4) — all tables, all policies
2. Schema migration applied (tables matching WorkspaceStore scopes)
3. Env vars set in Vercel Production scope (spec 72 §2)
4. CI gate enabled to block merges that re-introduce dev-mode leaks (spec 72 §7)
5. Migration spec produced (not this session) covering: schema versioning, data backfill if any, rollback plan, smoke tests, first-user onboarding to prod

That migration is a slice of its own (likely S-F8 or similar, sequenced after first-real-launch readiness). Not in scope for session 23.

## 5. Staged discard-tree removal

Each slice that replaces a surface deletes the old tree as part of its DoD. No big-bang removal. Deletions are audited — a slice's wrap doc lists the paths it removed, and spec 70 hub inventory flips the removed rows from Discarded to removed (retained for audit trail).

**Removal sequence table:**

| Slice | Surfaces replaced | Paths deleted as part of slice DoD |
|---|---|---|
| S-F7 | engine-workbench moved; debug panels moved | (no deletions — only moves; see §3 move table) |
| S-O1 | pre-signup interview (V1 Gentle Interview) | `src/app/start/*` (14 pages) · `src/components/interview/*` (5 files) |
| Marketing rewrite (part of S-F1 or a dedicated slice) | landing + features + pricing pages | `src/app/page.tsx` · `src/app/features/page.tsx` · `src/app/pricing/page.tsx` (replaced in place) |
| S-B1 | bank connection flow | `src/components/workspace/bank-connection-flow.tsx` |
| S-B2 | Sarah's Picture — financial summary + first-time wizard + hub title-bar + build route | `src/components/workspace/{financial-summary-page, financial-summary, first-time-wizard, manual-entry-modal, document-review-modal, category-tabs, category-content, page-tabs, summary-tab, section-mini-summary, readiness-bar, progress-stepper}.tsx` · `src/components/hub/title-bar.tsx` · `src/app/workspace/build/page.tsx` |
| S-B3 | dashboard — task list home + welcome carousel | `src/components/workspace/{welcome-carousel, task-list-home}.tsx` |
| S-B4 | confirmation loop | `src/components/workspace/confirmation-flow.tsx` |
| S-B5 | spending journey (5 files) | `src/components/workspace/{spending-flow, spending-estimates, spending-categorise, spending-fork, spending-search}.tsx` |
| S-B6 | evidence upload | `src/components/workspace/{document-upload, extraction-review}.tsx` |
| S-B7 | share action + orchestrator no-longer-needed | `src/app/workspace/page.tsx` · `src/app/workspace/{agree, build, disclose, finalise, negotiate, layout}.tsx` · `src/components/workspace/workspace-layout.tsx` |
| End of Phase C.3 cleanup | any remaining Discarded components | `src/components/workspace/*` remaining (ai-analysis, cetv-tracker, document-checklist, future-phase-page, mega-footer, modal, toast, page-tabs remnants, extraction-review remnants) — delete in a dedicated cleanup PR after confirming no imports remain |
| S-F3 constants update | 4-phase WORKSPACE_PHASES | (not a deletion — update `src/constants/index.ts` to spec 42 five-phase in place) |
| S-F7 types cleanup | V1 interview types | `src/types/interview.ts` delete · `src/types/hub.ts` prune legacy interview types |

**Staged removal verification (part of slice DoD):**
- Before deleting: `grep -r "from '@/components/workspace/<file>'" src/` across repo → zero hits
- Preview deploy green on slice branch pre-merge
- Preview deploy green on main post-merge
- Spec 70 hub inventory updated in same PR

**What if a slice finds it needs something from a Discarded file?** Evidence that the Discarded classification was wrong. Pause, re-classify in spec 70 hub with new evidence, then proceed. Don't copy-paste out of Discarded files — that leaks V1 palette or obsolete patterns. Better to extract the pattern as a design doc and rebuild.

## 6. Known-unknowns from spec 70 — resolved

Four Known-unknowns were flagged in spec 70 hub. Each resolved in session 23 via targeted file inspection. Recording the resolution here so the hub can be updated on the next edit + future sessions don't re-litigate.

| Path | Resolution | Evidence |
|---|---|---|
| `src/app/workspace/page.tsx` | **Discarded.** CLAUDE.md was correct; audit was over-generous. | File imports 7 items from Discarded `components/workspace/*` tree (welcome-carousel, task-list-home, bank-connection-flow, confirmation-flow, financial-summary-page, spending-flow, mega-footer) plus `components/hub/title-bar` (also Discarded). The state-machine pattern (PersistedState + loadPersistedState + savePersistedState + safe-resting-screen logic on reload) is genuinely valuable — captured at **design level** in S-F7 WorkspaceStore (§4 above). Logic survives; code does not port. Deletion happens in S-B7 per §5. |
| `src/app/workspace/layout.tsx` | **Discarded.** | 5-line file — `<ToastProvider>{children}</ToastProvider>` wrapping Discarded toast component. Toast pattern rebuilds naturally as a design-system primitive during S-F1. Not worth porting. |
| `src/app/workspace/{agree, build, disclose, finalise, negotiate}/page.tsx` | **All Discarded.** | `agree` uses FuturePhasePage (Discarded) with disclosure-framing content. `build` imports ~10 Discarded components + V1 palette (`bg-cream-dark`, `bg-warmth`, `bg-sage`) in READINESS_MILESTONES. `disclose` uses "Form E equivalent" + "disclosure-ready format" (positioning violation). `finalise` lists "£60 consent order" (stale fee — current is £53/593) and references "Form A" + "disclosure pack". `negotiate` has decent copy but imports Discarded FuturePhasePage. All replaced by new phase routes under `/app/(authed)/{build, reconcile, settle, finalise}` per §2. |
| `src/app/workspace/agree/page.tsx` path-change note | Rename resolved — Phase 4 is **Settle** per spec 42 (not "Agree"). | The route + content are both Discarded anyway, so rename is moot. New Phase 4 code lives at `/app/(authed)/settle/` fresh. Audit's "rename" recommendation superseded. |

**Pattern preserved, not code:**
The `workspace/page.tsx` state machine taught us that:
- Session-level workspace state must survive page reload (sessionStorage fallback when no backend)
- Mid-flow screens should not be "restorable on reload" — reload should land on a safe resting screen
- Persistence is versioned (`STORAGE_KEY` pattern)
- Degradation is silent (storage full or unavailable → in-memory only)

All four points carry into S-F7 WorkspaceStore behaviour by design, not by code port. Dev-store and Supabase-store both implement this shape; slice-level code consuming the store inherits it.

**Spec 70 hub update required:** the Known-unknowns section will flip to this resolution when the hub is next edited (likely during S-F7 or session 24).

## 7. Migration sequencing

Four-phase sequence from current state to end state. Each "Phase" here = a Phase-C sub-period (not a product phase per spec 42 — those are Start/Build/Reconcile/Settle/Finalise). Naming: **C.0 / C.1 / C.2 / C.3 / C.4**.

### Phase C.0 — Ops setup (not slice work)

Pre-slice infrastructure. Done once, then enables all slice work.

- Vercel env vars configured per spec 72 §2 (secrets scoped per environment; `DECOUPLE_AUTH_MODE` fixed `=prod` in Production; `=dev` allowed in Preview + Development)
- Main-branch CI gates wired: lint, typecheck, build, `npm audit`, `gitleaks`, security-headers smoke test, dev-mode-leak production-build scan (spec 72 §7)
- Supabase project provisioned with RLS enabled on all tables from day one (spec 72 §4)
- Preview deploy URL convention + smoke-test checklist per slice (part of DoD)
- `docs/slices/` directory created with template (acceptance.md + test-plan.md + security.md + verification.md per spec 72 §11)

### Phase C.1 — Foundation slices

No user-facing impact yet. These unlock everything else. Run as a single work-arc; merge to main incrementally but not separately promoted to users.

| Order | Slice | Why this order |
|---|---|---|
| 1 | **S-F1** design system (tokens + primitives) | Everything else renders through these. First real deliverable of Phase C per spec 70 hub. |
| 2 | **S-F7** dev/prod abstraction + `/app/dev/*` | Unlocks slice-building without auth shipping. Depends on S-F1 for env-banner + dev-UI primitives. |
| 3 | **S-F3** phase nav (stepper + journey map) | First cross-phase anchor. Used by dashboard + every phase page. |
| 4 | **S-F2** document shell | The shape every document renders into (Sarah's Picture, Our Household Picture, Settlement Proposal). |
| 5 | **S-F4** trust chip | Every evidence-carrying item needs this. |
| 6 | **S-F6** task row + task taxonomy | Dashboard + in-doc needs-your-attention all render through it. |

S-F5 (AI coach pattern) deferred — not on critical path to first user-facing slice. Added when Settle/Reconcile slices need it.

**Exit criterion for C.1:** Foundation primitives + abstractions exist; `/dev/*` dashboard loads a scenario; a placeholder page rendering a document shell with phase stepper + trust chip + task row works end-to-end. No Discarded tree removed yet (removals come with the slices that replace).

### Phase C.2 — Public surfaces + onboarding (locked session 23 P0-2)

First user-visible work after foundation. Two slices delivered together so the end-to-end public journey is coherent. Neither ships alone to Preview in a usable state.

| Order | Slice | Scope |
|---|---|---|
| 1 | **S-M1** marketing rewrite | `/`, `/features`, `/pricing` rebuilt against Claude AI Design outputs + spec 42 positioning. Legal placeholders (`/privacy`, `/terms`, `/cookies`) stay Preserve-with-reskin shells pending legal review (spec 56 L2). |
| 2 | **S-O1** primary onboarding | Welcome carousel (C-V2) + stepper (C-V3) + phase demo cards (C-V5) + trust band (C-V11) + spec 65 O1-O8 interview (8 screens, tone-branching, safeguarding-woven) + plan output (O7-O8 via `plan-narrative.ts` Re-use) + Moment 2 pre-bank profiling (spec 67 handoff) + signup gate at completion. |

**S-O1 MLP scope (loveable floor, not minimum viable):** all 8 O1-O8 screens ship (they're the coherent flow; not cuttable). Simpler plan narrative first (skip deep branching), iterate v1.1. Phase demo cards static first, interactive v1.1. Moment 2 covers only the profiling questions strictly needed to enter Build — extended Moment 2 questions defer to v1.1.

**Exit criterion for C.2:** A fresh browser can land on `/`, navigate features/pricing, click through to `/start`, complete O1-O8 interview, see plan output, hit signup gate. Dev mode allows the signup gate to handoff to `/dashboard` via fixture user. Full-path smoke test green in integration Preview.

### Phase C.3 — First post-auth slice + Build phase

First slice once users can land + sign up + be authed. **S-B1 + thin S-B4 taster** locked at session 23 P0-2 as the Phase C.3 entry.

| Order | Slice | Scope note |
|---|---|---|
| 1 | **S-B1 + S-B4-thin** | Bank picker grid (C-V10) + Tink Link → callback → extraction render → one (1) section confirmation loop (e.g. Income: "We found £3,218/month from ACME, confirm or correct?") with spec 22 decision tree logic (Preserve-with-reskin) + spec 67 Moment 3 profiling for that section + trust chip upgrade on confirm. **Deferred:** remaining sections, multi-section handling, evidence upload, correction history. |
| 2 | **S-B2** Sarah's Picture | Load-bearing. Downstream depends on it. |
| 3 | **S-B3** dashboard | Post-connection + post-build state rendering. |
| 4 | **S-B4** full — remaining sections | Children, Housing, Pensions, Spending, Debts, Other-assets — each section's spec 22 tree + spec 67 Moment 3 profiling. May split into per-section sub-slices. |
| 5 | **S-B5** spending journey (estimates → bank-evidenced) | Outgoings section, detailed flow. |
| 6 | **S-B6** evidence upload | Per-section inline upload + trust-level bump to document-evidenced. |
| 7 | **S-B7** share action | Triggers reconcile; last in Build phase; removes `/workspace/*` discarded tree per §5. |

**After S-B7:** the `/app/workspace/*` discarded tree is fully removed. At this point the codebase has no V2-era route surface left.

### Phase C.4 — Reconcile / Settle / Finalise phases

Each phase = its own build period. Reconcile first (unblocked by S-B7 share), then Settle (unblocked by R-1 joint-doc versioning + some of Reconcile complete), then Finalise.

Cross-cutting slices (S-X1 escape-hatch export, S-X2 exit-this-page) land alongside the phase slices that first need them — not upfront.

### Critical path to first real-user ship

```
C.0 setup
  → C.1 foundation (6 slices: S-F1 → S-F7 → S-F3 → S-F2 → S-F4 → S-F6)
  → C.2 public + onboarding (S-M1 + S-O1)
  → C.3 first post-auth slice (S-B1 + S-B4-thin)
  → C.3 Build remainder (S-B2 → S-B3 → S-B4-full → S-B5 → S-B6 → S-B7)
  → C.4 Reconcile / Settle / Finalise
  → cutover: fast-forward main ← phase-c, single production deploy
```

Each arrow = "ready for next step" once prior slice ships to integration Preview with green smoke test + DoD met.

**Launch-readiness dependencies** (spec 56) run in parallel (legal template commissions, SRA consultation, insurance quotes, DPIA, pen-test scheduling) — not blocking slice work. Engineering is one workstream of several on the critical path to real-user launch.

## §7a · Deployment model — Phase-C-freeze topology (locked session 23 P0-2)

Production (`construct-dev.vercel.app`) stays on current V1 state throughout Phase C. No prod redeploys during rebuild. Final cutover = deliberate single atomic switch.

**Three testable surfaces during Phase C:**

| URL | What it shows | Source branch | Environment |
|---|---|---|---|
| `construct-dev.vercel.app` (prod) | V1 as it is today — **frozen** | `main` (pinned / unchanged) | `DECOUPLE_AUTH_MODE=prod`, real Supabase (once provisioned) |
| `construct-dev-git-phase-c-*.vercel.app` | Rolling rebuild state (integration Preview) | `phase-c` (long-lived integration branch) | `DECOUPLE_AUTH_MODE=dev`, dev-store, scenario picker |
| `construct-dev-git-<slice-branch>-*.vercel.app` | Single slice under test, isolated | `claude/phase-c-s-{xx}-*` per slice | `DECOUPLE_AUTH_MODE=dev` |

**Branch flow:**
1. `phase-c` branch created from `main` at freeze-start
2. Slice branches branch from `phase-c` → work → Preview URL updates on push
3. Slice DoD met (spec 72 §11 checklist) → merge slice → `phase-c` → integration Preview updates
4. `main` stays frozen during entire Phase C
5. Cutover: fast-forward `main` ← `phase-c`, single prod deploy, atomic switch

**Hotfix protocol:** if a security patch or urgent bug fix must land on `main` during Phase C (dependabot critical, user-breaking prod bug), cherry-pick same-day into `phase-c` so branches don't diverge. Low risk given V1 is stable, but document the protocol.

**Env scoping (reuses spec 72 §2):**
- Vercel Production env → `DECOUPLE_AUTH_MODE=prod` fixed, CI gate enforces
- Vercel Preview env → `DECOUPLE_AUTH_MODE=dev` default, all new rebuild work exercises dev abstractions
- Vercel Development (local CLI) → `DECOUPLE_AUTH_MODE=dev`

**Why freeze vs rolling-prod:**
- Real users on current prod are uninterrupted during the rebuild period
- No patchwork user experience (V1 marketing + new workspace) mid-rebuild
- Clean atomic cutover with single rollback path if cutover goes wrong
- Integration Preview always reflects "what prod will be at cutover"
- Per-slice Previews enable targeted testing without affecting prod

**Cutover checklist** (produced later — not this session): DPIA in place · pen-test passed · legal review of generated docs · real Supabase provisioned with RLS · beta users onboarded through integration Preview · go/no-go decision documented.

## 8. S-F7 slice card (for spec 70 slice index)

Copy this card into `docs/workspace-spec/70-build-map-slices.md` under the Foundation slices section (after S-F6). Slice count increases from 31 → 32.

```markdown
### S-F7 · Persistence + auth abstraction (dev/prod modes)

- **Phases:** All
- **Value:** Domain code reads/writes sessions + workspace state via interfaces (Session, WorkspaceStore, AuthGate). Dev mode runs end-to-end against `localStorage` fixtures — no signup, no Supabase. Prod mode flips to Supabase via `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod` env var. Same domain code paths, different implementation. Engineering can build + test slices without auth shipping; real auth swaps in cleanly later.
- **Key components:**
  - `lib/auth/` — Session interface + dev-session (fixture user) + supabase-session + AuthGate
  - `lib/store/` — WorkspaceStore interface + dev-store (localStorage) + supabase-store (wraps existing `lib/supabase/workspace-store.ts`)
  - `/app/dev/` route group — dashboard, scenario picker, state inspector, reset, moved engine-workbench
  - `components/dev/` — scenario-picker, state-inspector, (moved hub debug panels)
  - Env banner reskin (Preserve-with-reskin) — mode chip + scenario dropdown + reset
  - Build-time + runtime assertions enforcing `MODE === 'prod'` in production build (spec 72 §7)
  - CI gate testing production build for dev-mode leaks (routes / imports / email domains / localStorage keys)
  - Fixture scenario library — 8 initial scenarios covering cold through finalise states
- **Depends on:** S-F1 (design system for dev-banner reskin + dev-UI primitives)
- **Opens:**
  - Storage schema versioning convention (`decouple:dev:store:v1` → v2 migration pattern)
  - Real-Supabase migration playbook (separate spec when we ship first real-auth deploy)
  - Scenario JSON format + loader pattern
  - Dev-only API route convention (`/app/dev/api/*`)
- **Security:** spec 72 §3 (Session pattern) + §7 (Dev/prod boundary enforcement, multi-layer). Fixture user emails on `@dev.decouple.local` reserved domain; production signup allowlist rejects this domain.
```

**Placement in slice dependency graph:** S-F7 sits in the Foundation block. S-F1 (design system) comes before S-F7 (dev banner + UI uses primitives). S-F7 is a hard prerequisite for any slice that reads/writes user state — which is S-O1 (primary onboarding), S-B1 (bank connection), S-B2 (Sarah's Picture), and all downstream. S-F7 is therefore in the Phase C Step 1 set alongside S-F1.

**Recommended Phase C Step 1 set (foundation + first enabler):**
`S-F1 (design system) → S-F7 (dev/prod abstraction) → S-F3 (phase nav) → S-F2 (document shell) → S-F4 (trust chip) → S-F6 (task row + task taxonomy)` → ready for first user-facing slice.

S-F5 (AI coach pattern) can come later — it's not on the critical path to the first user-visible deliverable.

---

## Maintenance

When a slice ships a folder-structure move, update this spec's §2 to reflect the new reality (mark as applied with date). When a Discarded tree is removed, tick it off §5. When a Known-unknown is resolved during implementation, move it from §6 into the appropriate section with the resolution note.
