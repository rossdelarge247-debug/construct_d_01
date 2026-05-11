# Session 85 retro — rebuild calibration moment + canvas-as-source pivot

## What happened

Session 85 opened on clean main with PR #140 (S-PROTO-canvas-fidelity-rebuild scaffold) already merged. User picked P1 (impl session) per SESSION-CONTEXT recommendation. Two PRs shipped: PR #147 closed the rebuild + calibration cycle; PR #148 pivoted the visual-direction conduct based on what calibration surfaced.

### PR #146 — round-1 impl scaffold

First src/ commit landing the slice's 4 ACs against actual code. Shipped: `TitleShape` discriminated union + ScreenShell title rendering (bold pre-segment + italic non-bold accent + optional full stop) · SubQuestionCard label serif (14px 600 INK lh 1.2) · ScreenShell header chrome (top-left back-button + chevron + `borderBottom 1px solid #E5E3DC` divider) · ProgressChip → ProgressPill (96×3 geometry, INK fill on #E5E3DC). 6 tests covering boundary cases (TitleShape parser/renderer + ProgressPill width-fill including (0, 0) edge).

Auto-review verdict: request-changes (5 findings non-blocking). Findings: prototype-readiness flagged focus-visible JS-state vs CSS pattern · describe-block naming · aria-valuenow guard · aria-hidden visual span; style flagged describe-block naming.

### PR #147 — rounds 2-5 iteration on top of round-1

Round-2 (`7e98a65`): 4 finding fixes — focus-visible inline retained with reasoning (user-confirmed trade-off) + describe rename + aria-valuenow guard + aria-hidden on visual step span. Round-3 (`799d922`): **regression fix.** Round-2's aria-hidden add broke 5 ProgressPill tests that targeted the visual span by text content. Fix: added `data-testid="progress-pill-fill"` selector + updated tests. Auto-review verdict on round-3: approve.

Round-4 (`f4ac49c`): verification.md §Status entry; diagnosed why canvas-fidelity specialist never fired across rounds 1-3 (slice-resolve script needs explicit `Slice references: docs/slices/...` paragraph in PR body, not just acceptance.md `Linked canvas:` field).

Round-5 (`6c5146a`): PR body Slice references line added — unblocks both `pr-dod.yml` AND canvas-fidelity slice-resolve.

**Calibration moment achieved on round-5.** All 4 specialists fired for the first time on actual src/ diff including canvas-fidelity. Verdict: request-changes (4 findings non-blocking):

- `canvas-fidelity · issue · layout-chrome`: chevron SVG `<polyline points='7,2 3,5.5 7,9' />` (angle-bracket `‹`) vs canvas Arrow `<line>` shaft + `<polyline>` arrowhead rotated 180deg (full `←`). AC-3 step 2 uses the word "chevron" but the canvas renders a shaft + arrowhead.
- `canvas-fidelity · issue · typography`: universal `font: '600 26px/1.05'` across O2-O6 vs canvas per-screen variance — O3-O5 Hero at 21/1.18/-0.015em; O6 at 19/1.2/-0.015em. Only o2-frames.jsx L171-172 quoted in AC-1.
- `prototype-readiness · nitpick · interaction-pattern`: focus-visible JS state still present (round-2 fix did not touch ScreenShell.tsx).
- `prototype-readiness · praise · interaction-pattern`: data-testid="progress-pill-fill" selector recognised; round-3 regression fix confirmed.

PR #147 merged at `b023461`. Squash-commit body preserves the round-1 through round-5 narrative.

### Pivot decision — canvas-as-source for prototype, rebuild scoped to Phase C+

The canvas-fidelity findings (chevron vs arrow · per-screen typography variance) confirmed exactly the drift class the gate was built to catch. They also confirmed canvas-as-source would have avoided both by construction — the canvas JSX already has the correct Arrow SVG (`o2-frames.jsx` Arrow component); the per-screen typography variance comes free when each screen's JSX is the page rather than a spec to rebuild against.

The reconciliation overhead (slice-resolve plumbing across multiple rounds · workflow gating · persona iteration · verbatim canvas quoting) proved disproportionate to prototype-phase value where the canvas JSX is already valid React and the user is the sole consumer until production hand-off.

User-clarified at pivot:
- **Header sources for un-authenticated screens:** Pre-signup Canvas Standalone (mobile) + Desktop Help Rail (desktop graceful enhancement). Two-canvas pair for the same surface.
- **Authenticated screens have a separate logged-in header** (already designed) — out of scope for this pivot.
- **Enhanced on-screen capability** (help-rail expansion mechanism from Desktop Help Rail canvas) is important but defer per-instance to user.
- **Mobile-to-desktop responsiveness** not wired in canvases; reconcile at preview-deploy feedback time, not at build time.
- **Feedback loop:** build first, iterate post-deploy. Don't pre-spec visual treatment for prototype-phase screens.

### PR #148 — CLAUDE.md rule change

CLAUDE.md §"Visual direction" rewritten:

- New phase-scoping intro distinguishing the two patterns
- New `### Canvas-as-source (prototype default)` subsection with 5-step light adapt pattern (tokenise hardcoded colours · replace placeholder data · wire state · Next.js wrapping · inline-or-adapt canvas helpers) + slice convention (no `Linked canvas:` field for prototype) + cross-canvas reconciliation deferred-to-user paragraph + escape hatches (when canvas-as-source isn't enough)
- Existing § content scoped to `### Preserve-and-rebuild (Phase C+ production)`; AC-as-canvas-quote + Linked canvas: field convention marked Phase-C+ (with prototype opt-in possible)

No code or infrastructure changes. The canvas-fidelity gate's conditional mechanism (fires only when `**Linked canvas:**` is present in `acceptance.md`) already supports both patterns; the policy moves prototype slices to field-absent by default.

Auto-review verdict on PR #148: clean ✅ approve. 3 default specialists fanned out (security, correctness, style); canvas-fidelity correctly stayed dormant — the docs-only diff has no `Linked canvas:` field, and the PR is itself a worked example of the new convention.

PR #148 merged at `43dbf27`.

## What went well

- **Round-5 calibration moment achieved + landed durably.** The canvas-fidelity gate fired on actual src/ diff for the first time, surfaced the expected drift class (chevron-vs-arrow + per-screen typography variance), and confirmed both the gate's value AND the rebuild pattern's overhead trade-off. Both lessons landed in the same artifact.
- **Auto-review specialists caught the right things across rounds.** Round-1's 5 findings (focus-visible · describe rename · aria-valuenow · aria-hidden · data-testid) were all useful. Round-3's data-testid regression was caught by the persona's selector-stability check, not by main conversation.
- **CLAUDE.md rewrite kept rebuild infrastructure intact.** Canvas-fidelity persona stays in the rig + workflow logic unchanged + AC-as-canvas-quote stays the rule for Phase C+. Pivot is scope-additive, not destructive. The mechanism already supported the new pattern.
- **Comment-review hook caught provenance anti-patterns in CLAUDE.md edits.** "session 85+", "Session 22 framing", "PR #147 retro" each flagged advisory → rephrased timelessly before push.

## What could improve

- **Earlier pattern recognition would have saved rounds.** Persona findings on round-5 (typography variance, chevron-vs-arrow) pointed to the same overall lesson: rebuilding from spec is harder than starting from the canvas. Recognising this 2-3 rounds earlier could have triggered the pivot proposal before round-5.
- **The "build first, iterate post-deploy" framing wasn't visible until user surfaced it.** Main conversation treated the rebuild as "lock the spec, then implement". Should have asked earlier whether feedback should be pre-spec or post-build.
- **PR body slice-reference format requirement was undocumented.** pr-dod.yml passed across rounds 1-3 because acceptance ref was present in some form, but slice-resolve script (canvas-fidelity prerequisite) needs the specific `Slice references: docs/slices/...` paragraph. Documenting the dual-format requirement clearer in the slice-resolve script's failure messages would help future slices.

## Key decisions

- **Squash-merge PR #147 with detailed body.** Preserves the round-1 through round-5 narrative in a single main-commit; consistent with session-84 pattern.
- **CLAUDE.md change goes as its own PR (#148), not bundled with the pilot.** Separate concerns. The rule change is durable conduct doc; the pilot is a new slice in src/. Allows the rule to land before the pilot demonstrates it.
- **Canvas-fidelity gate retained, not removed.** Conditional firing on `Linked canvas:` field presence is already the right mechanism for the new policy. Phase C+ work still benefits; prototype work skips by default.
- **Cross-canvas reconciliation (variant + responsive) deferred to per-instance user decision.** Not encoded as a build-time rule. Variant + responsive raise per-screen at scoping time.
- **Skip wrap-time spec 76 update.** Spec 76 §3 matrix's "canvas-fidelity additive/conditional" framing already supports the new policy; CLAUDE.md change is the load-bearing piece. Spec 76 clarification can land in a follow-up doc PR.
- **No squash-with-amend on the calibration-finding deferrals.** The 4 round-5 findings are non-blocking and the user-confirmed pivot means they don't need addressing in this slice — they're examples of drift that canvas-as-source would have avoided. Captured durably here for the next session.

## Bugs found + how fixed

- **focus-visible JS state vs CSS** (auto-review · interaction-pattern · nitpick across rounds 2 and 5) — chose to retain JS-state pattern with reasoning recorded; user-confirmed trade-off. Surfaced again on round-5 (same finding repeated) — canvas-as-source would naturally collapse this distinction (canvas inline styles use real `:focus-visible` CSS already).
- **describe-block naming** (auto-review · style · nitpick) — round-2 rename.
- **aria-valuenow guard** (auto-review · correctness · issue) — round-2 added defensive bounds check.
- **aria-hidden on visual step span** (auto-review · style · issue) — round-2 added `aria-hidden` to prevent screen-reader double-read; **regression: broke 5 ProgressPill tests** because they targeted the visual span by text content. Fixed in round-3 by adding `data-testid="progress-pill-fill"` selector + updating tests.
- **canvas-fidelity miss across rounds 1-3** — slice-resolve needs a `Linked canvas:` field in acceptance.md AND a `Slice references: docs/slices/...` paragraph in PR body. PR #147's body had slice ref but in the wrong format (table cell, not body paragraph). Round-5 added explicit slice-reference paragraph; round-5 was first to fire all 4 specialists. Diagnosed and recorded in round-4 verification.md §Status entry.

## Persona findings recorded

PR #147 shipped to src/ (rounds 2-5 are an iteration on a single PR). Per the persona-retain/drop metric ("retain if ≥1 caught issue per 2-3 slices"):

- **canvas-fidelity**: fired round-5 for first time on src/ diff; surfaced 2 issues (chevron-vs-arrow, typography variance) — both genuinely missed by main conversation. **Retain.** (First fire qualifies; the formal metric needs ≥3 slices, so tracking continues at the next prototype slice with canvas opt-in or any Phase C+ slice.)
- **prototype-readiness**: surfaced findings across rounds 1-5 (focus-visible · describe rename · aria-valuenow · aria-hidden + data-testid regression on round-3 confirmation · focus-visible again on round-5). 3 caught by persona pre-push; 2 caught after main-conversation pushed. **Retain.**
- **correctness**: silent across rounds 2-5. Acceptable — PR was UI prototype work, less surface for correctness flags. PR #148 same. **Retain.**
- **style**: round-1 caught describe-block naming; round-5 silent. **Retain.**
- **security**: silent across all rounds. No security surface in either prototype slice or docs PR. **Retain.**

PR #148 was docs-only, no slice. Canvas-fidelity correctly stayed dormant (no `Linked canvas:` field). 3 default specialists ran clean.

## Next session priorities (for session 86 kickoff in SESSION-CONTEXT.md)

1. **Pilot canvas-as-source on a chosen screen.** First src/ slice demonstrating the new pattern. User to confirm screen: O1 stage router (recommended — entry screen + introduces new header), O7 your plan, or refactored O2 with new header. Build under `src/app/dev/proto/pre-signup-interview/screens/`. Apply 5-step adapt per CLAUDE.md §"Canvas-as-source (prototype default)". Header source: session-81 Pre-signup Canvas Standalone (mobile, for un-authenticated screens). Preview-deploy → user feedback → iterate. No `Linked canvas:` field in acceptance.md; canvas-fidelity stays dormant.
2. **(Optional) Spec 76 §3 matrix clarification.** Add explicit note that prototype-default is `Linked canvas:`-field-absent. Spec 72c §4 (canvas-fidelity dimension) similarly. Small doc PR; not blocking the pilot.
3. **(Deferred) Cross-canvas reconciliation conversation.** Variant (Pre-signup Standalone mobile vs Desktop Help Rail) + responsiveness (mobile→desktop intermediate breakpoints) — user explicitly deferred to per-instance scoping. Raise when scoping a screen where it matters.
4. **(Inherited) Spec 65 amendment to capture quantitative profiling data.** Still parked.
5. **(Inherited) spec-citation-quote-check author-time hook.** Mirror `.claude/hooks/comment-review.sh` pattern. Small standalone PR.
6. **(Inherited) Comment-review hook §Status exemption fix.** Investigate + repair the §Status block exemption for "session X" provenance in `## Status` sections.

## Constraints

#1-#39 from prior sessions preserved. **New session 85:**

- **#40 — No preserve-and-rebuild rigour for prototype-phase screens.** Use canvas-as-source per CLAUDE.md §"Visual direction" §"Canvas-as-source (prototype default)". Canvas-fidelity gate stays dormant on prototype slices by default (`Linked canvas:` field absent in `acceptance.md`). Phase C+ production work continues to use preserve-and-rebuild with the gate active. Locking the rule in CLAUDE.md avoids re-litigating it per slice; the empirics (PR #147 round-5 calibration findings + reconciliation overhead) are durably captured here.
- **#41 — Cross-canvas reconciliation (variant + responsive) deferred to per-instance user decision.** Not a build-time rule. Variant = which canvas wins for a screen (e.g., Pre-signup Standalone mobile vs Desktop Help Rail). Responsive = mobile→desktop intermediate breakpoints not wired in canvases. Raise per-screen at scoping time, not in advance.
