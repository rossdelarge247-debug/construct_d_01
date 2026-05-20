# S-PROTO-help-rail-V4-V5 — Verification

**Category:** prototype.

## Files touched

- `src/app/dev/proto/pre-signup-interview/components/rails/rail-constants.tsx` — additive: `MAGENTA`, `MAGENTA_TINT`, `PILL_GREEN_INK`, `PILL_GREEN_BG`; `ChatIcon`, `PhoneIcon`, `HeartIcon`; `optRowStyle`, `optIconStyle`, `optTitleStyle`, `optMetaStyle`, `optPillStyle`, `optPillGreyStyle`, `founderNoteStyle`, `tabRowStyle`, `tabButtonStyle`, `tabActiveButtonStyle`
- `src/app/dev/proto/pre-signup-interview/components/rails/RailHuman.tsx` — NEW (V4)
- `src/app/dev/proto/pre-signup-interview/components/rails/RailHybrid.tsx` — NEW (V5)
- `src/app/dev/proto/pre-signup-interview/components/rails/RailGlossary.tsx` — Body refactor (extracted `RailGlossaryBody` named export)
- `src/app/dev/proto/pre-signup-interview/components/rails/RailCoach.tsx` — Body refactor (extracted `RailCoachBody`)
- `src/app/dev/proto/pre-signup-interview/components/rails/RailWhy.tsx` — Body refactor (extracted `RailWhyBody`)
- `src/app/dev/proto/pre-signup-interview/components/HelpRailLayout.tsx` — routing: `v4` → `<RailHuman />`, `v5` → `<RailHybrid />`; `RailDeferred` helper removed
- `tests/unit/app/dev/proto/pre-signup-interview/help-rail.test.tsx` — +3 smoke tests (RailHuman + RailHybrid default + RailHybrid tab-switch); 2 amended (v4/v5 positive assertions)

## AC verification

### AC-1 — RailHuman (V4) component

Component renders V4 canvas content faithfully (canvas L1925-1978):

- Eyebrow `Need a person?` (`railEyebrowStyle`) + heading `We're here.` (`railHeadingStyle`) + sub-paragraph
- Three contact-option buttons via `optRowStyle`: Chat with the team (ChatIcon + `Online` pill), Book a 30-min call (PhoneIcon + `Slots open` grey pill), Decouple Listen (HeartIcon in `MAGENTA_TINT` background + `24/7` grey pill)
- Founder note card (`founderNoteStyle`, dashed border) with `A note from Sarah, founder.` + body copy verbatim from canvas
- Safety footer via `monoFooterStyle` with `data-testid="rail-human-safety"`: `IF YOU'RE NOT SAFE · CALL 999 OR REFUGE 0808 2000 247`

**Test evidence:** `tests/unit/app/dev/proto/pre-signup-interview/help-rail.test.tsx` — `RailHuman renders with safety footer + founder note` asserts:
- `getByLabelText('Talk to a human help rail')` → present
- `getByText("We're here.")` → present
- `getByText('Decouple Listen')` → present
- `getByText('A note from Sarah, founder.')` → present
- `getByTestId('rail-human-safety').textContent` matches `/999 OR REFUGE 0808 2000 247/`

### AC-2 — RailHybrid (V5) component per parent-slice D-7

Component owns its outer `<aside style={railContainerStyle}>` and composes the four child rails' `*Body` exports inside a `role="tabpanel"` element with `display: 'contents'` so child `*Body` fragments stack naturally in the rail's flex column. Tab row uses `role="tablist"` + `role="tab"` with `aria-selected` reflecting active state. Tab state via local `useState<TabId>('ask')`.

Tab-to-rail mapping:
- `Ask Decouple` → `<RailCoachBody />`
- `What this means` → `<RailGlossaryBody focused="relationship" />`
- `Why we ask` → `<RailWhyBody />`
- `Human` → `<RailHumanBody />`

**Test evidence:**
- `RailHybrid renders with default Ask Decouple tab active`: initial `aria-selected="true"` on `Ask Decouple` tab; RailCoach text (`Ask anything.`, input placeholder) present
- `RailHybrid tab-switch reveals different rail bodies`: clicking `Human` tab sets its `aria-selected="true"`, exposes the safety footer, and hides `Ask anything.`; clicking `What this means` swaps in RailGlossary's `What this means.` heading and hides the safety footer

### AC-3 — `rail-constants.tsx` additive extensions

Existing exports (`INK`, `SUB`, `MUTE`, `VIOLET`, `LINE`, `PANEL_BG`, `railContainerStyle`, `railEyebrowStyle`, `railHeadingStyle`, `railSubStyle`, `monoFooterStyle`, `SendIcon`, `SparkleIcon`, `LockIcon`) unchanged. New exports added at logical insertion points:

- Colour constants: `MAGENTA` (`#BE185D`, canvas L1645), `MAGENTA_TINT` (`#FCE7F3`), `PILL_GREEN_INK` (`#166534`), `PILL_GREEN_BG` (`#DCFCE7`)
- Icons (canvas `Ico` ports L1659-1673): `ChatIcon`, `PhoneIcon`, `HeartIcon` — line-only `currentColor` SVGs with `size = 16` default
- Style objects: `optRowStyle`, `optIconStyle`, `optTitleStyle`, `optMetaStyle`, `optPillStyle`, `optPillGreyStyle` (option-row primitives); `founderNoteStyle` (dashed-border card); `tabRowStyle`, `tabButtonStyle`, `tabActiveButtonStyle` (V5 tab primitives)

**Evidence:** existing V1/V2/V3 smoke tests pass unchanged (the four `Help Rail components — smoke` tests for V1-V3 stayed green); `tsc --noEmit` clean.

### AC-4 — HelpRailLayout routes V4 + V5 to live components

`HelpRailLayout.tsx` `ActiveRail()` (the variant switcher) now reads:

```tsx
if (variant === 'v4') return <RailHuman />;
if (variant === 'v5') return <RailHybrid />;
```

The `RailDeferred` helper function and its dependent imports (`CSSProperties`, `LINE`, `MUTE`, `railEyebrowStyle`, `railHeadingStyle`, `railSubStyle`) were removed from the file — no remaining consumers.

**Test evidence:** the two `renders deferred placeholder` tests changed to positive assertions:
- `renders RailHuman when variant is v4`: `getByLabelText('Talk to a human help rail')` + `getByText("We're here.")` present
- `renders RailHybrid when variant is v5`: `getByLabelText('Help options rail')` + `getByRole('tab', { name: 'Ask Decouple' })` present

### AC-5 — Tests

Test deltas in `tests/unit/app/dev/proto/pre-signup-interview/help-rail.test.tsx`:

- Added `fireEvent` to existing `@testing-library/react` import
- Added `RailHuman` + `RailHybrid` imports
- Added 3 new `Help Rail components — smoke` tests (RailHuman, RailHybrid default, RailHybrid tab-switch)
- Replaced 2 deferred-placeholder tests in `HelpRailLayout — variant selection` with positive-assertion equivalents

Full test result on this file: 14/14 passing (was 13 before this slice; net +1 from the +3/-0/2-amended pattern... — recount: 4 smoke V1-V3 → 7 smoke (+3); 6 variant selection (the 2 v4/v5 were amended, not added) → 6; 1 URL override → 1; total 14, baseline was 4 + 5 + 1 = 10, so +4 net — wait let me re-count: existing test file pre-slice had 4 smoke + 6 variant + 1 url = 11; this slice adds 3 smoke = 14). Full proto + lib/dev suite: 362/362 passing.

## Definition of Done

1. **All acceptance criteria met, with evidence per AC** — Met. AC-1 through AC-5 evidence above.
2. **Tests written and passing** — Met. 14/14 on the help-rail test file; 362/362 on the proto + lib/dev test surface; `tsc --noEmit` clean; eslint clean on touched files (no new disable comments).
3. **Adversarial review done; concerns addressed or explicitly deferred** — Pending. Auto-review fires at PR open via `.github/workflows/auto-review.yml`; verdict + finding triage to be appended to this section at PR-review time.
4. **Preview deploy verified in-browser if UI** — DEFERRED per the inherited deferral from `docs/slices/S-PROTO-help-rail-desktop-variants/verification.md` §"Preview-deploy verification" (system-wide pass at prototype-journey lock-down). Preview URL surfaces via Vercel comment on PR.
5. **No regression in adjacent slices** — Met. V1/V2/V3 rail smoke tests pass unchanged; full proto + lib/dev suite stays green.
6. **Slice's open 68f/g entries resolved or explicitly deferred** — N/A (this slice opens no 68f/g entries; the V4/V5 deferral note on the parent slice's `verification.md` §"Architectural deferrals" closes via this slice's AC-1 + AC-2 ship).

DoD-14 short-form (prototype category — items 1, 8, 12, 14): see `security.md`. Items 1 + 8 + 12 + 14 cleared.

## Architectural deferrals

- **`opt-row` hover state.** The canvas CSS rule `.opt-row:hover { border-color: var(--ink); }` (canvas L966) is not implemented — inline `style` props don't carry `:hover` pseudo-states without a CSS module migration or React mouseenter/mouseleave wiring. Deferred to the system-wide preview-deploy + a11y pass when the prototype journeys lock down (DoD-4 inherited deferral covers this surface).
- **V5 tab keyboard arrow navigation.** Per the WAI-ARIA authoring practices for tabs, left/right arrow keys should move focus between tab buttons. The current impl supports Tab-key navigation but not arrow-key focus shift. Deferred to the system-wide a11y pass.
- **V4 option-row `onClick` handlers.** The three contact rows render as buttons styled to look interactive but have no click handlers (no booking flow, no chat opener, no telemetry). The variant-comparison evaluation only needs visual fidelity; wiring lands when a variant graduates to a fuller surface.
- **D-2 canvas-literal compact tab content for V5.** Per the slice's design-decisions §D-2 — if V5-live feels overloaded, future iteration may partition V5's tab bodies into compact variants rather than rendering full child rails. Held open for post-deploy team review.

## Preview-deploy verification

Per the inherited deferral — see `docs/slices/S-PROTO-help-rail-desktop-variants/verification.md` §"Preview-deploy verification". Formal 6-dimension rubric exercises (golden path · edge cases · prefers-reduced-motion · keyboard-only · mobile viewport · screen-reader) ship at the system-wide pass once prototype journeys lock down. Preview-deploy URL surfaces via the Vercel comment on PR.

## Spec sources

CLAUDE.md §"Engineering conventions" §"Definition of Done":

> *"A slice ships only when all six are true... Plus the 14-item security checklist in spec 72 §11 (short-form for `category: prototype` slices — see §'Slice categories' + spec 76 §5). No exceptions for `production` or `infrastructure` categories."*

CLAUDE.md §"Slice categories" §"Per-category behaviour summary":

> *"`prototype` — UI/UX rigour preserved (preview-deploy 6-dim runs in full · `reviewer-prototype-readiness` post-PR persona substitutes `reviewer-correctness`); code rigour relaxed (TDD-guard skips · coverage excludes · test-pain audit threshold raises from >2 to >5 mocks · DoD-14 short-form to items 1, 8, 12, 14 only)."*

## Status

Implementation complete; tests green; tsc + lint clean. Awaiting auto-review verdict at PR open.
