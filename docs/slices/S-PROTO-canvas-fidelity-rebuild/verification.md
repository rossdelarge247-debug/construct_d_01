# S-PROTO-canvas-fidelity-rebuild · verification

Final-state record assembled at slice ship. Round-by-round multi-agent audit detail belongs in HANDOFF or PR description, not here (per CLAUDE.md §"Engineering conventions" §"Definition of Done" item 1).

## AC-1 · Title bold/italic split

| Verification step | Evidence (filled at slice ship) |
|---|---|
| ScreenShell title renders serif 26px / lh 1.05 / ls -0.02em / fw 600 | Pending |
| Bold pre-segment at fw 600; accent span italic fw 400 | Pending |
| Terminal full stop renders when `period: true` in title shape | Pending |
| O2-O6 copy resolvers supply structured TitleShape | Pending |

## AC-2 · Sub-question label serif

| Verification step | Evidence |
|---|---|
| SubQuestionCard label: serif / 14px / fw 600 / #1A1A1A / lh 1.2 | Pending |
| No sans-serif fallback on label specifically | Pending |

## AC-3 · Header chrome

| Verification step | Evidence |
|---|---|
| Back-button positioned top-left of header | Pending |
| Chevron icon precedes "Back" label | Pending |
| Header has `borderBottom 1px solid #E5E3DC` divider | Pending |
| Treatment applied to all O2-O6 screens via shared ScreenShell | Pending |

## AC-4 · Step indicator pill geometry

| Verification step | Evidence |
|---|---|
| Step indicator renders as horizontal pill (not chip) | Pending |
| Outer dimensions: 96 × 3px | Pending |
| Outer background `#E5E3DC`; inner fill `#1A1A1A` | Pending |
| `aria-label` exact format: `Step ${current} of ${total}` | Pending |
| `ProgressChip.tsx` renamed/replaced with `ProgressPill.tsx` | Pending |

## Preview-deploy verification (spec 72a 6-dim rubric)

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | Pending | Vercel preview URL · O2-O6 walk-through |
| Edge cases | Pending | Long-text title overflow · keyboard navigation through chips |
| `prefers-reduced-motion` | Pending | Title transition disabled when set |
| Keyboard-only | Pending | Tab order through back-button · chips · CTA |
| Mobile viewport (375×667) | Pending | Pre-signup Canvas O2 visual fidelity preserved at narrow width |
| Screen-reader | Pending | `aria-label` for step indicator + back-button announced correctly |

## Architectural deferrals

(None at scaffold time. Filled at slice ship if the canvas-fidelity gate's first live run surfaces deferred-with-reasoning items.)

## Loveability decisions committed

(Filled at slice ship.)

## Status

- 2026-05-10: skeleton authored at slice setup; AC verification recipes scoped pending impl in follow-up session.
