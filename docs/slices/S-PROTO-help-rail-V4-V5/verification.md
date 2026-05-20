# S-PROTO-help-rail-V4-V5 — Verification

**Category:** prototype.

Final-state record assembled at slice ship per CLAUDE.md §"Engineering conventions" §"Definition of Done".

## Files touched (placeholder; updated at ship)

- (TBD at impl)

## AC verification

### AC-1 — RailHuman (V4) component

_Pending implementation._

### AC-2 — RailHybrid (V5) component per locked D-7

_Pending implementation._

### AC-3 — `rail-constants.tsx` additive extensions

_Pending implementation._

### AC-4 — HelpRailLayout routes V4 + V5 to live components

_Pending implementation._

### AC-5 — Tests

_Pending implementation._

## Definition of Done

1. **All acceptance criteria met, with evidence per AC** — _pending._
2. **Tests written and passing** — _pending._
3. **Adversarial review done; concerns addressed or explicitly deferred** — _pending._
4. **Preview deploy verified in-browser if UI** — DEFERRED per inherited deferral from the parent slice's `verification.md` §"Preview-deploy verification" (system-wide pass at prototype-journey lock-down).
5. **No regression in adjacent slices** — _pending; smoke check on existing 330/330 proto suite + V1/V2/V3 rail renders._
6. **Slice's open 68f/g entries resolved or explicitly deferred with reasoning in slice wrap** — N/A (this slice doesn't open any 68f/g entries; the V4/V5 deferral entry on the parent slice closes via this slice).

DoD-14 short-form (per CLAUDE.md §"Slice categories" §"Per-category behaviour summary" — prototype category covers items 1, 8, 12, 14 only): see `security.md`.

## Architectural deferrals

_To be populated at ship if any._

## Preview-deploy verification

Per inherited deferral — see `docs/slices/S-PROTO-help-rail-desktop-variants/verification.md` §"Preview-deploy verification". Formal 6-dim rubric exercises (golden path · edge cases · prefers-reduced-motion · keyboard-only · mobile viewport · screen-reader) ship at the system-wide pass once prototype journeys lock down. Preview-deploy URL surfaces via Vercel comment on PR.

## Spec sources

CLAUDE.md §"Engineering conventions" §"Definition of Done":

> *"A slice ships only when all six are true... Plus the 14-item security checklist in spec 72 §11 (short-form for `category: prototype` slices — see §'Slice categories' + spec 76 §5). No exceptions for `production` or `infrastructure` categories."*

## Status

Drafted; implementation pending.
