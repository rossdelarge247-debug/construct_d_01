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

[FILL]

## 5. Staged discard-tree removal

[FILL]

## 6. Known-unknowns from spec 70 — resolved

[FILL]

## 7. Migration sequencing

[FILL]

## 8. S-F7 slice card (for spec 70 slice index)

[FILL]

---

## Maintenance

When a slice ships a folder-structure move, update this spec's §2 to reflect the new reality (mark as applied with date). When a Discarded tree is removed, tick it off §5. When a Known-unknown is resolved during implementation, move it from §6 into the appropriate section with the resolution note.
