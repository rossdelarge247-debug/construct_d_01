# Canvas-fidelity gate — calibration report

This file persists user feedback about visual-fidelity gaps between the deployed pre-signup-interview prototype (`94007b6` on main) and the canonical canvas designs at `docs/design-source/pre-signup-interview/`. Three purposes:

1. **Durable record** — feedback is preserved through this slice (gate ship) into the rebuild slice. The "I had to spot this manually" failure mode is not allowed to reset between sessions.
2. **AC seed** — each finding below maps to one or more rebuild-slice acceptance criteria via the new "AC-as-canvas-quote" discipline added to CLAUDE.md §"Visual direction".
3. **Gate validation** — the canvas-fidelity persona's first run against current main is expected to surface findings 1-4 below. If it doesn't, the persona is mis-calibrated and the prompt needs revision before the rebuild starts.

## User feedback verbatim

> i also think the fonts are wrong - i look at the design canvas - the 'your situation' the 'your' is bold, and the 'situation' is not bold, but italic, with a full stop afterward
>
> The sub category title fonts e.g. 'relationship', 'Living together' etc look like an arial esque san serif, where as in the design canvas, they mirror the main title serif font.
>
> As for the header. 'back' appears on the left hand top corner with an arrow pointing back - no such thing on the built screen - also there is a bar that shows step 2 of 8, this is missing, the styling is completely wrong. There is also a dividing line indicating the 'header' area. This is non existant. I think we also need to reconcile the look and feel of the header on public pages, but that's a separate activity. This level of detail is probably true of all the screens. Why has this been missed? Do i have to try and spot this for ecverything or can we find a way to precisely recreate the designs?

## Structured findings (with canvas evidence)

### Finding 1 — Title typography: bold/italic split missing

**Canvas (canon):** `docs/design-source/pre-signup-interview/jsx/o2-frames.jsx` L171-172

```jsx
<h2 className="serif mt-2" style={{ fontSize: 26, lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 600 }}>
  Your <span className="italic" style={{ fontWeight: 400 }}>situation</span>.
```

**Current implementation:** `src/app/dev/proto/pre-signup-interview/components/ScreenShell.tsx` L70-79 — single string `{heading}` rendered into `<h1>` with no italic span and no full-stop suffix; size also wrong (24px vs canvas 26px).

**Expected after rebuild:** ScreenShell accepts a structured title shape that supports a bold pre-segment, an italic non-bold accent segment, and an optional terminal full stop. Each screen's copy resolver supplies the segments.

**Severity:** typography category, label `issue`, blocking `false` (visual-fidelity recoverable; flag for fix-not-merge-block).

### Finding 2 — Sub-question label typography: should be serif, currently sans

**Canvas (canon):** `docs/design-source/pre-signup-interview/jsx/o2-frames.jsx` L89

```jsx
<div className="serif" style={{ fontSize: 14, fontWeight: 600, color: INK, lineHeight: 1.2 }}>
```

**Current implementation:** `src/app/dev/proto/pre-signup-interview/components/SubQuestionCard.tsx` L26

```jsx
<div style={{ font: `600 13px/1.3 ${tokens.font.sans}`, color: tokens.color.text.sub }}>
```

**Gap:** sans not serif · 13px not 14px · `text.sub` colour not `INK` · line-height 1.3 not 1.2.

**Expected after rebuild:** `serif 14px 600 INK lh 1.2` per canvas.

**Severity:** typography category, label `issue`, blocking `false`.

### Finding 3 — Header chrome: back-button position + chevron + divider

**Canvas (canon):** `docs/design-source/pre-signup-interview/jsx/o2-frames.jsx` L155-158

```jsx
<div ... style={{ borderBottom: `1px solid ${LINE}` }}>
  <span>Back</span>
```

**Current implementation:** `src/app/dev/proto/pre-signup-interview/components/ScreenShell.tsx` L35-55 — back button is right-side of header (alongside ProgressChip in `space-between` flex); no `borderBottom` divider; no chevron icon.

**Gap:** position wrong (right vs canvas left) · chevron missing · divider missing.

**Expected after rebuild:** top-left back button with chevron + "Back" label, with `borderBottom: 1px solid LINE` divider beneath the top-bar zone.

**Severity:** layout-chrome category, label `issue`, blocking `false`.

### Finding 4 — Step indicator: pill geometry not chip

**Canvas (canon):** `docs/design-source/pre-signup-interview/jsx/o2-frames.jsx` L37-41

```jsx
<div className="relative rounded-full overflow-hidden" style={{ width: 96, height: 3, background: "#E5E3DC" }}>
  <div className="absolute rounded-full" style={{ top: 0, bottom: 0, left: 0, width: `${(current / total) * 100}%`, background: INK }} />
</div>
```

aria-label: `Step ${current} of ${total}` (L38).

**Current implementation:** `<ProgressChip step={step} />` — chip component at `src/app/dev/proto/pre-signup-interview/components/ProgressChip.tsx` (26L), a different geometry.

**Gap:** chip not pill · INK fill on `#E5E3DC` not chip-default colours · aria-label format unconfirmed.

**Expected after rebuild:** 96×3px rounded-pill bar with INK fill on `#E5E3DC` ground, fill-width `current/total`. aria-label preserved verbatim.

**Severity:** layout-chrome category, label `issue`, blocking `false`.

### Finding 5 — Public-pages header reconciliation (user-flagged separate activity)

User comment verbatim: *"I think we also need to reconcile the look and feel of the header on public pages, but that's a separate activity."*

**Out of scope** for the canvas-fidelity gate (which targets prototype slices with `Linked canvas:` field). Tracked as a future-add candidate; not blocking PR 2.

## Speculative findings (gate first-run expected to surface, in addition to 1-4)

The persona's first run against current `main` should likely surface these too. If it doesn't, gate is under-tuned. If it surfaces these AND user is happy, gate is well-tuned.

- Eyebrow treatment dimensions (mono violet uppercase letterSpacing + size) vs canvas
- Sub-question card border, padding, border-radius vs canvas plate dimensions
- CTA button typography + dimensions vs canvas
- Inter-section spacing scale vs canvas
- Background gradient stops + dimensions across the 4 BgToggle modes
- Selected-state RadioCard treatment (ink-on-ink vs canvas)

Items not surfaced by gate first-run get added below as gate-refinement targets at this slice's review.

## Mapping to rebuild-slice ACs

When the rebuild slice (`S-PROTO-canvas-fidelity-rebuild`) is scoped, each finding above seeds at least one AC. AC text quotes the canvas verbatim with file:line refs per the new "AC-as-canvas-quote" discipline ratified in this slice's CLAUDE.md updates.

| Finding | Seeds AC for rebuild slice |
|---|---|
| 1 — Title bold/italic split | "ScreenShell renders title with bold pre-segment + italic non-bold accent + optional full stop, per canvas o2-frames.jsx L171-172" |
| 2 — Sub-Q label serif | "SubQuestionCard label uses `serif 14px 600 INK lh 1.2`, per canvas o2-frames.jsx L89" |
| 3 — Header chrome | "ScreenShell header: top-left back-button with chevron, `borderBottom 1px solid LINE` divider, per canvas o2-frames.jsx L155-158" |
| 4 — Step pill | "Step indicator: 96×3px rounded-pill with INK fill on #E5E3DC, fill-width current/total, aria-label `Step X of Y` preserved, per canvas o2-frames.jsx L37-41" |

## Status

- 2026-05-10: created at PR 1 author-time; user feedback verbatim recorded; structured findings 1-4 documented with canvas L-refs; 6 speculative findings prepped for first-run validation.
- 2026-05-10: gate first live run on PR #140 (`S-PROTO-canvas-fidelity-rebuild` scaffold). Canvas-fidelity persona surfaced 3 findings: 1 `praise · typography` confirming AC-as-canvas-quote discipline applied correctly across AC-1 to AC-4 with verbatim L-refs (L941, L990, L1063-1066, L1079-1080) + token decls (INK L4721, LINE L4724) — positive calibration signal that the persona-prompt design generates useful structured input; 1 `note · missing-element` observing the scaffold PR has no `src/` files to compare against the canvas; 1 `question · missing-element` flagging that `<linked-canvas-NONCE>` fence was delivered empty due to an orchestrator bug in `auto-review.yml` brief.compose (`for CANVAS_PATH in $CANVAS_PATHS` word-splits on spaces; this slice's Linked-canvas path is `Pre-signup Canvas - Standalone.html` with 3 spaces). **Findings 1-4 NOT surfaced** because (a) scaffold PR has no `src/` to compare against and (b) even if `src/` existed, the empty fence would have prevented canvas-side comparison. **Speculative findings 1-6 NOT surfaced** for the same reason. **Calibration verdict at first run:** the persona functions correctly on the available signal (sensible praise + sensible diagnostic question identifying the orchestrator bug rather than emitting a false positive); the meaningful test of findings-1-4 detection requires (i) the orchestrator bug fix in `auto-review.yml` AND (ii) the impl PR landing with `src/` changes. Re-evaluation deferred to the impl PR's auto-review verdict; both prerequisites tracked as session-83 P1 priorities.
