# S-PROTO-canvas-fidelity-rebuild · verification

Final-state record assembled at slice ship. Round-by-round multi-agent audit detail belongs in HANDOFF or PR description, not here (per CLAUDE.md §"Engineering conventions" §"Definition of Done" item 1).

## AC-1 · Title bold/italic split

| Verification step | Evidence |
|---|---|
| ScreenShell title renders serif 26px / lh 1.05 / ls -0.02em / fw 600 | `src/app/dev/proto/pre-signup-interview/components/ScreenShell.tsx` L94-100 — `<h1 style={{ font: '600 26px/1.05 ${tokens.font.serif}', letterSpacing: '-0.02em', color: tokens.color.ink }}>`. Asserted by `tests/unit/proto-pre-signup/screen-shell-title.test.tsx` case "renders the h1 with canvas typography" |
| Bold pre-segment at fw 600; accent span italic fw 400 | ScreenShell.tsx L104-108 — `{title.bold}{' '}<span style={{ fontStyle: 'italic', fontWeight: 400 }}>{title.accent}</span>`. h1 inherits fw 600 from base style; accent span overrides to fw 400. Asserted by test case "renders TitleShape.split with bold pre-segment + italic accent + terminal period" |
| Terminal full stop renders when `period: true` in title shape | ScreenShell.tsx L108 — `{title.period ? '.' : ''}`. Asserted by tests "renders TitleShape.split ... + terminal period" and "omits the terminal period when period flag is unset" |
| O2-O6 copy resolvers supply structured TitleShape | `lib/copy/o2.ts` L42 (split: `Your`/`situation`/period), `o3.ts` L31 (plain), `o4.ts` L18 (plain), `o5.ts` L17 (plain), `o6.ts` L31 (plain). All five `O{N}Copy` interfaces declare `heading: TitleShape` (previously `heading: string`). O1/O7/O8 remain as `heading: string` (out of slice scope) — ScreenShell accepts `string \| TitleShape` and normalises strings to `{ kind: 'plain', text }` at L22-24 |

## AC-2 · Sub-question label serif

| Verification step | Evidence |
|---|---|
| SubQuestionCard label: serif / 14px / fw 600 / #1A1A1A / lh 1.2 | `src/app/dev/proto/pre-signup-interview/components/SubQuestionCard.tsx` L26 — `<div style={{ font: '600 14px/1.2 ${tokens.font.serif}', color: tokens.color.ink }}>`. `tokens.color.ink` resolves to `#1A1A1A` per `src/styles/tokens.ts` L19 |
| No sans-serif fallback on label specifically | Diff replaces `${tokens.font.sans}` with `${tokens.font.serif}`; `text.sub` colour replaced with `tokens.color.ink`. Caption span (L30) intentionally retains `tokens.font.mono` per canvas (label vs caption have different roles) |

## AC-3 · Header chrome

| Verification step | Evidence |
|---|---|
| Back-button positioned top-left of header | ScreenShell.tsx L35-79 — header is `flex justify-between` with three children in document order: `<button>Back</button>`, `<ProgressPill>`, right-spacer. The back-button is the first child, rendering at the left edge per `justify-content: space-between` semantics |
| Chevron icon precedes "Back" label | ScreenShell.tsx L60-75 — inline SVG polyline (`7,2 → 3,5.5 → 7,9`) renders as a leftward chevron at 11×11px before the `<span>Back</span>`. Matches canvas `<Arrow dir="left" size={11} />` shape verbatim |
| Header has `borderBottom 1px solid #E5E3DC` divider | ScreenShell.tsx L34-42 — header style includes `borderBottom: '1px solid ${tokens.color.border}'`. `tokens.color.border` resolves to `#E5E3DC` per tokens.ts L24 |
| Treatment applied to all O2-O6 screens via shared ScreenShell | All O2-O6 screen components in `src/.../screens/O{2..6}.tsx` render via `<ScreenShell …>` (verified via grep). Same `<header>` markup applies to every screen pass |
| Back-button is `<button>` element (a11y substitution for canvas `<span>`) | ScreenShell.tsx L44 — `<button type="button">`. Canvas literal at `jsx/o2-frames.jsx` L158 is `<span>Back</span>` wrapped in `<a href="#">`; AC-3 step 6 explicitly authorises the `<button>` substitution for keyboard reachability without ARIA augmentation |
| Back-button minHeight/minWidth ≥ 44px (touch-target a11y) | ScreenShell.tsx L57-58 — `minHeight: 44, minWidth: 44`. Hidden via `visibility: hidden` when `!onBack \|\| step <= 1` (L41, L55), preserving layout slot |

## AC-4 · Step indicator pill geometry

| Verification step | Evidence |
|---|---|
| Step indicator renders as horizontal pill (not chip) | `src/app/dev/proto/pre-signup-interview/components/ProgressPill.tsx` L22-39 — outer `<span>` styled as 96×3 rounded rectangle (no padding, no border, no chip-style bubble). Asserted indirectly by tests on aria-label format + fill width |
| Outer dimensions: 96 × 3px | ProgressPill.tsx L29-30 — `width: 96, height: 3` |
| Outer background `#E5E3DC`; inner fill `#1A1A1A` | ProgressPill.tsx L33 (outer `background: tokens.color.border` = `#E5E3DC`) and L43 (inner `background: tokens.color.ink` = `#1A1A1A`) |
| `aria-label` exact format: `Step ${current} of ${total}` | ProgressPill.tsx L20 — `aria-label={'Step ${step} of ${total}'}`. Asserted by tests "exposes the canvas-canon aria-label" + "defaults total to TOTAL_STEPS (8)" |
| Fill width `(current/total)*100%`, clamped to [0, 100] and NaN-safe on (0, 0) boundary | ProgressPill.tsx L12 — `const fillWidth = total > 0 ? Math.max(0, Math.min(100, (step / total) * 100)) : 0`. Asserted by 5 test cases: 50% at (4,8), 0% on (0,0) boundary, 0% on (0,8), 100% cap on (10,8), 0% clamp on (-1,8) |
| `ProgressChip.tsx` renamed/replaced with `ProgressPill.tsx` | `git status` confirms `D ProgressChip.tsx` and `A ProgressPill.tsx`. ScreenShell import swapped from `./ProgressChip` to `./ProgressPill` (L4) |

## Preview-deploy verification (spec 72a 6-dim rubric)

Verification scheduled at PR open against the Vercel preview build. Each cell becomes Done with a screenshot reference once the preview deploys.

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | Pending post-PR-open | O2-O6 walk-through at `/<preview>/dev/proto/pre-signup-interview` — verify TitleShape rendering on O2 (italic split + period), plain titles on O3-O6, ProgressPill geometry at each step, back-button chrome |
| Edge cases | Pending post-PR-open | Long-text titles (O3 "How would you describe things between you?") at 26px / lh 1.05 — confirm no awkward wrapping; step=1 with onBack undefined renders invisible back-button slot (layout stable); step=8 fills ProgressPill 100% |
| `prefers-reduced-motion` | N/A | Title-mount animation explicitly out-of-scope per AC-1; no motion introduced in this slice. ProgressPill fill is static (no transition). Back-button has no hover/focus animations beyond browser defaults |
| Keyboard-only | Pending post-PR-open | Tab order: back-button (when visible) → chips → CTA. Back-button `tabIndex={-1}` when hidden ensures it skips. Enter/Space activates back-button |
| Mobile viewport (375×667) | Pending post-PR-open | Pre-signup Canvas O2 visual fidelity preserved at narrow width. ProgressPill 96px fits comfortably in mid-header zone alongside 44×44 back-button + 36px right-spacer (total ~176px; viewport 375px) |
| Screen-reader | Pending post-PR-open | `aria-label="Step X of Y"` announced for ProgressPill; back-button `aria-label="Back to previous step"` when visible, `aria-hidden="true"` when not. Italic accent span has no ARIA contribution (inline text node) |

## Architectural deferrals

- **Linked-canvas fence delivered empty (orchestrator bug surfaced by gate first live run) — RESOLVED.** The canvas-fidelity persona on this PR's first auto-review reported via `question · missing-element`: *"The `<linked-canvas-NONCE>` fence was delivered empty — canvas file content absent."* Root cause: `.github/workflows/auto-review.yml` `brief.compose` step had `for CANVAS_PATH in $CANVAS_PATHS` (unquoted), which word-split on spaces. Resolution landed across two workflow PRs and one slice update:
  - **`auto-review.yml` `brief.compose` step** now parses `Linked canvas:` as a comma-separated list (`IFS=',' read -ra CANVAS_PATH_ARRAY <<< "$CANVAS_PATHS"`), preserving whitespace within each path entry.
  - **`auto-review.yml` specialist-invocation step** captures `claude -p` exit code via `|| CLAUDE_EXIT=$?` and emits a `::warning::` annotation when non-zero, so a transient API failure (rate limit, request-too-large) surfaces in-log instead of silently leaving an empty stream. The diagnostic group runs unconditionally; parser tolerates empty stdin via the `{}` sentinel; aggregator marks the dim inconclusive and reports a degraded-mode warning (matches the specialist-failure response described in spec 72c §3 architecture overview).
  - **Slice's `Linked canvas:` field** swapped from the 10.8MB combined `Pre-signup Canvas - Standalone.html` to comma-separated per-screen JSX source files (`jsx/o{2..6}-frames.jsx`, ~91KB total), so the persona receives canon content within Anthropic API per-request limits. AC L-refs re-quoted at JSX line numbers; cross-screen pattern repeats noted for AC-3 + AC-4.

- **Per-screen typography variance vs AC-1 verbatim treatment — deferred to canvas-fidelity verdict.** Canvas inspection during impl prep surfaced that `jsx/o3-frames.jsx` + `jsx/o5-frames.jsx` use `fontSize: 21, lineHeight: 1.18, letterSpacing: -0.015em` for the screen title, while `jsx/o2-frames.jsx` L171-172 uses `26 / 1.05 / -0.02em` (the values AC-1 quotes). The impl applies the AC-1 verbatim treatment universally (Path A — literal AC compliance), accepting that O3 + O5 may diverge from their canvas typography. If the canvas-fidelity persona flags this on the impl PR, the resolution path is to add an optional `titleScale?: 'expressive' | 'compact'` prop on ScreenShell with the 21/1.18 variant under a follow-up slice. Recorded here per CLAUDE.md §"Engineering conventions" §"Test-pain audit" pattern (explicit defer with reasoning).

## Loveability decisions committed

- **Universal `26px / 1.05 / -0.02em / fw 600` title typography across O2-O6.** AC-1 quotes only `jsx/o2-frames.jsx` L171-172; canvas inspection (above) flagged O3/O5 use a smaller variant. Universal-26px is the AC-verbatim path; per-screen typography variants deferred to canvas-fidelity verdict (see Architectural deferrals).
- **`heading: string | TitleShape` on ScreenShell (backward-compatible widening).** O1/O7/O8 are out of slice scope and continue to supply `heading: string`. ScreenShell normalises strings to `{ kind: 'plain', text }` at L22-24, so neither caller layer breaks. O2-O6 explicitly supply `TitleShape` per AC-1 step 5.
- **Back-button hidden via `visibility: hidden` rather than conditional render.** When `!onBack || step <= 1`, the back-button stays in the document with `visibility: hidden`, `aria-hidden="true"`, `tabIndex={-1}`. Preserves header layout (no layout shift between step 1 and step 2+) and matches the canvas's always-present back-element pattern while satisfying a11y semantics on step 1.
- **Back-button as `<button>` (a11y substitute for canvas `<span>`).** Canvas literal at `jsx/o2-frames.jsx` L158 is `<span>Back</span>` inside `<a href="#">` (visual placeholder). The rebuild uses `<button type="button">` to be keyboard-activatable without ARIA augmentation, per AC-3 step 6's explicit substitution.
- **Inline SVG chevron rather than separate Arrow component.** Canvas has `<Arrow dir="left" size={11} />` — a chart-style icon component from the canvas's local context. The rebuild inlines a 4-point polyline at 11×11 (`7,2 → 3,5.5 → 7,9`) within ScreenShell. Avoids creating a new icon component for one consumer (per CLAUDE.md §"Coding conduct" §"Simplicity first" — no speculative abstractions).
- **ProgressPill renders both the visual `Step X / Y` slash label AND the 96×3 pill.** Canvas L36-42 includes both: a text label (`<span>Step {current} / {total}</span>`) and the pill bar. AC-4 verification only mentions the pill, but the canvas verbatim has both — rebuild matches verbatim for visual fidelity.
- **`role="progressbar"` + `aria-valuenow/valuemin/valuemax/label` on ProgressPill outer.** Matches canvas L34-38 verbatim. `aria-valuemin={1}` (not 0) follows the canvas; expects consumers to supply `step >= 1` for steady-state. Boundary case `step=0` clamps fill to 0% but leaves `aria-valuenow={0}` (out-of-range) — non-blocking edge that only triggers in test fixtures, not real usage.

## Status

- 2026-05-10: skeleton authored at slice setup; AC verification recipes scoped pending impl in follow-up session.
- 2026-05-10: architectural deferral resolved — `Linked canvas:` field updated to comma-separated per-screen JSX source files (`jsx/o{2..6}-frames.jsx`); AC L-refs re-quoted at JSX line numbers. `auto-review.yml` workflow updates landed alongside (comma-separator parsing in `brief.compose`; exit-code capture + `::warning::` annotation in the specialist invocation) make the canvas-fidelity persona observable and tolerant of transient `claude -p` failures.
- 2026-05-11: impl PR opened with src/ changes against the 4 calibration findings. ScreenShell + ProgressPill + SubQuestionCard + O2-O6 copy resolvers all carry verbatim canvas references. Unit tests in `tests/unit/proto-pre-signup/{progress-pill,screen-shell-title}.test.tsx` (13 cases across the two files). Preview-deploy 6-dim verification pending Vercel preview build.
- 2026-05-11 (rounds 2+3 of impl PR): rounds 2+3 auto-review verdicts approve. Round-2 addressed 4 round-1 findings (focus-visible inline · describe-rename · aria-valuenow guard · aria-hidden on visual span); round-3 fixed a self-regression where the round-2 `aria-hidden` add broke 5 ProgressPill fill-selector tests (resolution: `data-testid="progress-pill-fill"`). Canvas-fidelity specialist absent in rounds 1-3 — slice-resolve fallback mis-resolved due to a meta-irony: the round-2 PR-body diagnostic prose explaining the slice-resolve bug contained the literal nonexistent `docs/slices/S-PROTO-canvas-fidelity-impl-DKIMp/acceptance.md` path string, which `scripts/auto-review-slice-resolve.sh`'s `grep -oE … | head -1` then matched first. Round-4 PR-body amended to use prose-only diagnosis (no literal nonexistent paths); a more durable script-side fix would filter the body grep to only paths whose files exist on disk — deferred to a separate workflow-hardening PR.
