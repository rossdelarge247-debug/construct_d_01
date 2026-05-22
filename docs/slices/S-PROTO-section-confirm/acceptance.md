# S-PROTO-section-confirm

**Category:** prototype
**Journey:** inbound from = registry-hub (`/dev/proto`) · outbound to = registry-hub (back-link); the canvas `Save & continue` / `Add to expenses` CTAs are demo-only no-ops in prototype mode — they would advance the user through Build phase in production.

## Why

Phase 3 sequence per CLAUDE.md §"Phase 3 sequence" (quoting `HANDOFF-SESSION-74.md` L80-82 verbatim):

> *"P2+: `S-PROTO-section-confirm` (Build phase confirm pattern) · `S-PROTO-ai-coach` (Settle phase) · `S-PROTO-share-flow` (Reconcile multi-actor)."*

Session 116 closed `S-PROTO-journey-restore` (PR #222 → `3b30a06`), restoring sequence discipline. Session 117 ships the next on-sequence slice: the Build-phase per-section confirmation pattern.

Per `docs/workspace-spec/68b-decisions-build.md` B-E2 + B-D3 + the `70-build-map-build.md` L34 Anchor tagging *"Confirmation Q&A pattern (confirm-or-correct) | 68b B-E2 · spec 22 · G7-4 pattern mirror | Ask-don't-assume per bank signal"*, the confirm-pattern is the user's primary interaction inside Sarah's Picture sections — surfacing when the AI has inferred something from bank signal but needs the user to verify or correct.

The canvas at `docs/design-source/mobile-screens-v2/decoded/Mobile Screens v2 - Standalone.html` embodies the pattern as 6 form screens (L3022-3531: `M_Form_Categorise`, `M_Form_ConfirmRecurring`, `M_Form_ManualEntry`, `M_Form_Duplicate`, `M_Form_Split`, `M_Form_BalanceCheck`). Each is the same shape: anchor transaction row + question + radio choices (with AI-suggested recommendation) + AI margin card explaining the inference + Save/Skip footer.

These 6 forms map 1:1 to registry rows L55-60 (`bank-rec-categorise` etc.) — already `canvas-drafted` separate rows. Registry row L54 `per-section-confirm` is the abstract pattern these forms embody.

This slice ports **2 of the 6 forms** (`Categorise` + `ConfirmRecurring`) as the pattern foundation, extracts the shared canvas components for reuse, and lets the remaining 4 forms become discrete follow-up slices that re-use the foundation rather than re-implementing it.

## Acceptance criteria

### AC-1 · Two confirm-form routes + hub index page ported from canvas

Three new pages under `src/app/dev/proto/section-confirm/`:

| Route | Source canvas | Canvas function |
|---|---|---|
| `/dev/proto/section-confirm/` | hub index (new) | parent listing both demo routes + back-link to `/dev/proto` |
| `/dev/proto/section-confirm/categorise/` | `Mobile Screens v2 - Standalone.html` L3092-3145 | `window.M_Form_Categorise` |
| `/dev/proto/section-confirm/confirm-recurring/` | `Mobile Screens v2 - Standalone.html` L3150-3219 | `window.M_Form_ConfirmRecurring` |

Per CLAUDE.md §"Visual direction" §"Canvas-as-source" 5-step adapt:

1. **Tokenise hardcoded colours.** Canvas-top constants (`INK`, `SUB`, `MUTE`, `LINE`, `BG`, `PAPER`) → `tokens.color.*` refs where mapping exists; canvas AI colour constants (`AI_TOK.PURPLE`, `PURPLE_TINT`, `PURPLE_DEEP`) → page-local `const`s for now (matched in AC-2 component extraction).
2. **Replace placeholder data.** Canvas literals (`"Aviva Life Insurance"`, `"£1,250.00"`, `"Octopus Energy"`, `"£178/mo avg"`) preserved verbatim — they're the demo content.
3. **Wire state.** `React.useState` from canvas preserved. Each form has its own radio-selection state. No central store.
4. **Add Next.js wrapping.** `'use client'` directive on each page; default-exported React component.
5. **Inline canvas-local helpers OR adapt.** Helpers `FormTop`, `TxnRow`, `RadioRow`, `AIMarginCard`, `BackArrow`, `SectionLabel`, `SparkGlyph` extracted to shared components per AC-2.

Each form page renders inside an iPhone-style device frame matching the canvas's `PhoneStage` — same width (≈375px viewport), same chrome.

The hub index lists both demo routes with one-line descriptions sourced from the canvas comment block at L3022-3034 verbatim:

- *"Categorise a transaction (joint life insurance? salary? household?)"*
- *"Confirm a recurring payment as a fixed expense"*

### AC-2 · Shared canvas components extracted to co-located `_components/`

Six components extracted to `src/app/dev/proto/section-confirm/_components/`:

| Component | Source | Purpose |
|---|---|---|
| `FormTop.tsx` | Canvas L3037-3042 | TopBar with BackArrow + title + step indicator |
| `TxnRow.tsx` | Canvas L3045-3056 | Anchor transaction row (logo · merchant · amount) |
| `RadioRow.tsx` | Canvas L3058-3087 | Selection row with optional `AI suggests` badge |
| `AIMarginCard.tsx` | Canvas L2334-onwards (port the shape; not the full ~150L) | AI rationale card with title + body + citation + comments + activity |
| `BackArrow.tsx` | Canvas L1421-onwards | Small back chevron SVG |
| `SectionLabel.tsx` | Canvas L1366-onwards | Uppercase eyebrow label |
| `SparkGlyph.tsx` | Canvas L2287-onwards | The 4-point AI spark/sparkle SVG used in the `AI suggests` badge |

All components are `'use client'` React (no hooks in `_components/` files unless the component is stateful — only `RadioRow` is). Props strictly typed via TypeScript interfaces. No `any`.

Each component sits next to others as the existing `src/app/dev/proto/section-confirm/_components/` layer (mirroring `src/app/dev/proto/_components/` for the registry hub but separate to avoid scope-creep across the proto namespace).

### AC-3 · Token alias additions for canvas AI colours

Canvas uses `AI_TOK.PURPLE = '#6D5BD0'`, `AI_TOK.PURPLE_TINT = 'rgba(109,91,208,0.06)'`, `AI_TOK.PURPLE_DEEP` (deeper magenta-purple for the `AI suggests` text colour).

Page-local constants approach (matching `src/app/dev/proto/post-connect-dashboard/page.tsx` precedent for canvas-as-source ports):

- Define `AI_PURPLE`, `AI_PURPLE_TINT`, `AI_PURPLE_DEEP` at the top of `_components/AIMarginCard.tsx` + `_components/RadioRow.tsx` + `_components/SparkGlyph.tsx`.
- No additions to `src/styles/tokens.ts` this slice — a unified AI colour token cluster lands when a Phase C+ slice with cross-cutting AI surfaces consolidates them.

The values match canvas literal hex; verbatim citation in `verification.md`.

### AC-4 · Registry rows L54 + L55 + L56 updated

In `src/app/dev/proto/registry.ts`:

| Row id | Status change | `links` |
|---|---|---|
| `per-section-confirm` (L54) | `spec-only → prototype-built` | `prototype: 'src/app/dev/proto/section-confirm/'` · `canvas: 'docs/design-source/mobile-screens-v2/'` · `slice: 'docs/slices/S-PROTO-section-confirm/'` |
| `bank-rec-categorise` (L55) | `canvas-drafted → prototype-built` | `prototype: 'src/app/dev/proto/section-confirm/categorise/'` (canvas link retained) |
| `bank-rec-confirm-recurring` (L56) | `canvas-drafted → prototype-built` | `prototype: 'src/app/dev/proto/section-confirm/confirm-recurring/'` (canvas link retained) |

All three rows: `lastTouched: { session: 117, date: '2026-05-22' }`.

Confidence levels unchanged. Tags retained except `per-section-confirm`'s `high-uncertainty` tag drops (uncertainty resolved at AC-freeze via the canvas-port path decision).

Open question on `per-section-confirm` row drops from `['8 sections × multi-state — canvas-first vs prototype?']` to empty (or replaced with `'Lock final adapt-rules for state-icon TOC in Sarah\'s Picture container slice?'` — defers the state-icon question to the upcoming `your-picture-private` slice where it belongs).

The 4 remaining `bank-rec-*` rows (L57-60: ManualEntry / Duplicate / Split / BalanceCheck) stay `canvas-drafted` — explicit out-of-scope per §Out-of-scope below.

## Out of scope

- The remaining 4 confirm forms (ManualEntry / Duplicate / Split / BalanceCheck) at canvas L3225-3531 — follow-up slices each.
- Sarah's Picture document container (registry L62 `your-picture-private`) — separate slice; this slice's forms render standalone, not embedded in the §-numbered document.
- The 8-section × multi-state TOC pattern from 68b B-D2 — also belongs to the `your-picture-private` slice.
- AI margin card's full feature surface (comments thread, activity feed expand/collapse, reasoning expand/collapse) — port the visual shape; interaction depth deferred.
- Token-system consolidation for AI colours — page-local constants this slice; cross-cutting consolidation deferred.
- Real bank-data integration — all canvas literals (Aviva, Halifax, Octopus, £1,250, £178) preserved as demo content.
- Save/Continue button wiring — buttons are visible per canvas, click is no-op in prototype.
- Holistic a11y sweep (carried from sessions 111-115 per SESSION-CONTEXT).

## References

- `docs/workspace-spec/68b-decisions-build.md` B-D1..B-E4 (Sarah's Picture document shape + per-section edit locked decisions)
- `docs/workspace-spec/70-build-map-build.md` L30, L31, L34, L82 (Anchor + Preserve-with-reskin tagging for the confirm pattern)
- `docs/design-source/mobile-screens-v2/decoded/Mobile Screens v2 - Standalone.html` L3022-3220 (the 2 forms in scope; L3225-3531 the 4 out-of-scope forms)
- `src/app/dev/proto/registry.ts` L54-56 (3 rows updated)
- CLAUDE.md §"Visual direction" §"Canvas-as-source" (the 5-step adapt rule + journey-declared convention)
- CLAUDE.md §"Phase 3 sequence" (the post-audit sequence anchoring this slice)
- `src/app/dev/proto/post-connect-dashboard/page.tsx` (recent canvas-as-source port precedent for page-local AI colour constants)
- `docs/slices/S-PROTO-journey-restore/acceptance.md` (recent slice template + DoD item 7 origin)

## Pre-flight notes

- Slice acceptance.md size: ≤300L target per CLAUDE.md §"Adversarial review gate" — this slice fits a single 3-dimension review spawn (security · correctness · style).
- The `per-section-confirm` registry row's stated open question conflated two surfaces (the 8 ES2 sections + the confirm-or-correct interaction). The canvas survey clarified the split: this slice ports the confirm-pattern only; the 8-sections × state-icons surface belongs to a future `your-picture-private` slice.
- Test-pain audit. Spec 72d §3 verbatim: *"If any unit test in a slice requires more than 2 mock setups for collaborators, step back and reconsider seams before continuing implementation."* For `category: prototype` the threshold raises to `>5` per spec 76 §3. Smoke tests for the form routes need zero mocks (canvas is static React state). RadioRow stateful test needs zero mocks. Threshold not approached.
