# Session 82 Pre-flight Context Block (carrying session 81 wrap delta + post-merge tail)

## Session 81 wrap delta — read this first

Session 81 shipped `S-INFRA-canvas-fidelity-gate` as PR #137, merged to main at `ecbdf9d`. The slice introduces a 4th specialist persona (`reviewer-canvas-fidelity`) for the multi-agent auto-review harness — fires conditionally on `prototype` slices declaring a `**Linked canvas:**` field — plus AC-as-canvas-quote discipline + 5 new bundled-HTML canvases decoded into readable siblings + path-traversal guard on canvas-path reads + 4 P6 supporting-script extensions + synthetic regression fixture.

**Delivery summary:**

- Persona file `.claude/agents/reviewer-canvas-fidelity.md` — 6 categories, default-label/blocking matrix, conditional invocation
- `auto-review.yml` — `Linked canvas:` field detection + 4-dim matrix routing for prototype-with-canvas slices + per-canvas brief composition + workspace-containment guard on canvas reads (`realpath -m` + `case "$WORKSPACE"/*)`)
- 4 P6 scripts accept `canvas-fidelity` dimension: `spawn-multi-reviewer.sh` · `preflight-review.sh` · `validate-finding-envelope.sh` · `auto-review-filter-prior.sh`
- Synthetic-deliberate-injection fixture: `tests/personas/synthetic/canvas-fidelity.{diff,canvas}` + `expected/canvas-fidelity.json` + workflow path-filter extended
- CLAUDE.md §"Visual direction" AC-as-canvas-quote rule + `Linked canvas:` field convention; §"Hard controls" canvas-fidelity row
- Spec 72c §4 personas table extended to 5 rows; §7 synthetic-fixtures section extended
- Slice docs: `acceptance.md` · `verification.md` · `security.md` · `test-plan.md` · `calibration-report.md`
- 5 new bundled-HTML canvases decoded under `docs/design-source/`: `Pre-signup Canvas` (5133L) · `Desktop Help Rail` (2235L) · `Mobile Screens v2` (5233L) · `Landing Page` (2026L) · `Welcome Tour` (1497L)

**PR #137 final state:**
- Merged at `ecbdf9d` via squash merge to main; CODEOWNERS solo-operator admin-bypass gate cleared
- 27/27 CI checks green/neutral on merge SHA `135d9da`
- Auto-review verdict: `request-changes` (informational at v3b ship) — 5 advisory findings, 0 blocking. Findings carried over to session 82 as a single cleanup PR (P3 below)
- Specialist retain/drop signal: **retain all 3** (`security` · `correctness` · `style`) — each surfaced ≥1 actionable finding the main conversation missed; canvas-fidelity persona's first real exercise is the rebuild slice's prototype PR

Read `docs/HANDOFF-SESSION-81.md` for the full retro including the post-wrap CI tail (path-traversal fix in `135d9da`).

## Session 82 priorities — user picks scope

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **Inspect decoded canvases + scope rebuild slice** | Read decoded canvases to map: which screens does each cover · does `Pre-signup Canvas` supersede the per-screen canvases at `pre-signup-interview/jsx/o{2-6}-frames.jsx` · does `Mobile Screens v2` cover mobile + desktop · is the Help Rail a separate component or built into the desktop layout · what does Welcome Tour add. Output: rebuild slice's `Linked canvas:` field + draft AC list per AC-as-canvas-quote. | Medium (read-heavy; ~100L of slice scaffolding output) | No |
| 2 | **Open rebuild slice PR (gate's first live run)** | Branch off main; ship rebuild slice with `Linked canvas:` declared; canvas-fidelity gate fires for the first time = calibration evidence captured in PR's auto-review verdict. | Heavy (~400-600L impl + slice docs) | Yes — depends on P1 |
| 3 | **5 deferred-finding cleanup PR** | Single small PR addressing the 5 advisory findings deferred at PR #137 ship: #1 + #4 comment trims in `auto-review.yml` + `tests/personas/run-synthetic.sh` · #2 `preflight-review.sh` aggregator arg-order fix (1L) · #6 + #7 verbatim-quote audit on slice doc spec-refs (~30L). | Light (~50L total) | No — could fold into start-of-session warm-up before P1 |
| 4 | **Decide on `Decouple.zip` unpacking** | The `marketing-landing/Decouple.zip` carries 17 sub-canvases including Master Components (design system) + Decisions Log (rationale). Decision deferred — leave packed unless rebuild scope expands beyond pre-signup. | Light if needed | No |

**Recommended sequence:** P3 (~30 min cleanup warm-up) → P1 (read-heavy, prep for P2) → P2 (the heavy slice). P4 folds in opportunistically.

## Authoritative reading order at session 82 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-81.md` (last session's retro including post-wrap CI tail).
3. `docs/slices/S-INFRA-canvas-fidelity-gate/calibration-report.md` (durable record of user feedback feeding the rebuild AC list).
4. **Decoded canvases** (when scoping rebuild slice): grep first for `<title>`, `<h1>`, `<h2>` to map structure; targeted reads only (each canvas 1500-5200L; full reads exceed 300L cap).

## Session 82 kickoff prompt (paste-ready)

```
Kick off session 82.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state (current branch +
  HEAD vs origin/main + ahead/behind + tree state).
- Branch convention: harness-suffixed (claude/<scope>-XXXXX). PR #137
  is merged at ecbdf9d on main; session 82 starts from clean main.
  If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch origin main → git checkout -B
  <branch> origin/main.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-81.md.
3. docs/slices/S-INFRA-canvas-fidelity-gate/calibration-report.md.

Confirm priority with user. SESSION-CONTEXT recommends sequence
P3 (cleanup warm-up) → P1 (canvas inspection) → P2 (rebuild slice
ship). User may pick different scope.

Definition of Done for the chosen priority:
- All ACs met with evidence per AC in verification.md.
- Tests written + passing where tractable.
- Auto-review verdict: approve / nit-only on the new PR.
- Preview-deploy verified in-browser if UI work.
- security.md item 12 stays Pending at PR open; closes Done
  post-verdict.

If P2 (rebuild slice) is the pick: this is the first PR where the
canvas-fidelity gate fires live. Treat the gate's findings as
calibration data for the persona's category × default-label/blocking
matrix. Surprises are expected on first run; tune the persona
prompt before merge if false-positive rate is high.

If P3 (deferred-finding cleanup) is the pick: see HANDOFF-81 §"Post-
wrap addendum" for the 5 specific findings. Single PR; ~50L total.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind via CSS variables · S-F1 token system at `src/styles/tokens.ts` (75 entries) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`.

## Branch

Session 82 branch: harness-suffixed off clean main (`ecbdf9d`). PR #137 merged; session 81 working branch deletable.

## Negative constraints (preserve)

#1-#39 from prior sessions. No new constraints session 81.

## Scope ceiling

Session 82 is most likely P3 (cleanup) + P1 (canvas inspection) + start of P2 (rebuild scoping then begin AC drafting). Out of scope unless explicitly added: the public-pages nav-bar reconciliation (separate concern flagged session 81 turn 3) · `Decouple.zip` unpacking · spec 65 amendments to capture quantitative profiling data.

## Current pre-signup prototype URL

- Production (after session-80 squash deployed): `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
