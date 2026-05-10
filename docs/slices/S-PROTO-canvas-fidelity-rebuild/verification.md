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
| `prefers-reduced-motion` | N/A | Title-mount animation explicitly out-of-scope per AC-1; no motion introduced in this slice |
| Keyboard-only | Pending | Tab order through back-button · chips · CTA |
| Mobile viewport (375×667) | Pending | Pre-signup Canvas O2 visual fidelity preserved at narrow width |
| Screen-reader | Pending | `aria-label` for step indicator + back-button announced correctly |

## Architectural deferrals

- **Linked-canvas fence delivered empty (orchestrator bug surfaced by gate first live run).** The canvas-fidelity persona on this PR's auto-review reported via `question · missing-element`: *"The `<linked-canvas-NONCE>` fence was delivered empty — canvas file content absent. Cannot verify that cited L-refs exist in the file."* Root cause: `.github/workflows/auto-review.yml` `brief.compose` step has `for CANVAS_PATH in $CANVAS_PATHS` (unquoted), which word-splits on spaces. This slice's `Linked canvas:` path contains spaces (`Pre-signup Canvas - Standalone.html`), so the for-loop iterates over 4 word-fragments, each failing the `[ -f "$CANVAS_PATH" ]` existence check, and the fence stays empty. Fix needed in the workflow (split on newlines or use array assignment); deferred to a separate workflow-fix PR — out of scope for the scaffold-only deliverable. Until fixed, the canvas-fidelity persona on this slice's impl PR will also fire empty unless the workflow is patched OR the canvas filename is space-free.

## Loveability decisions committed

(Filled at slice ship.)

## Status

- 2026-05-10: skeleton authored at slice setup; AC verification recipes scoped pending impl in follow-up session.
