# Session 88 retro — O3 merge + O4 canvas-as-source ship

## What happened

Session 88 opened on the harness branch `claude/canvas-source-migrations-FTew3` off main `602bd8b` (which carried the session-87 wrap PR #154). User's directive at kickoff: ship the four remaining A1-style chip-card screens (O3 → O4 → O5 → O6) one per slice, following the established AC-6 cross-screen chassis pattern.

**Two PRs shipped to main in sequence:**

**PR #155 — `S-PROTO-o3-canvas-as-source · impl (AC-1..AC-4) (#155)` — squash-merged to main as `67f28dd`.** Carried over from the prior session: scope + impl + 3 auto-review rounds already complete; this session closed out the merge after user pre-flight thumbs-up. Single squash commit on top of `602bd8b`.

**PR #156 — `S-PROTO-o4-canvas-as-source · impl (AC-1..AC-4) (#156)` — squash-merged to main as `d954b6c`.** Five commits across three auto-review rounds plus one user-flagged visual regression.

- **`4328ab7` — slice impl (AC-1..AC-4).** Canvas `ResolvedFrame` at `docs/design-source/pre-signup-interview/o4-employment-complexity-expressive.html` L125-220 adapted via 5-step pattern. `O4.tsx` page IS the canvas: shared `BrandBar` + bespoke `TopBar` (Back + `ProgressPill`) + Hero (eyebrow "Money" with INDIGO 5×5 dot + serif H2 + helper sub-stem) + native `<fieldset aria-labelledby="o4-emp-legend">` with 4 `<input type="radio" name="o4-self-employment">` styled as chip-cards (the `'no'` option emphasised per canvas C3 treatment: padV 18 vs 14, fontS 15 vs 14, soft box-shadow when unselected) + cream-blur Footer chassis with 2-state caption + dark pill CTA. `O4.module.css` ships entry stagger + chip-card transitions + emphasis variant + reduced-motion fallback. State rename: `SelfEmployment` union `'neither'` → `'no'` to match canvas `OPTIONS_FULL[0].key` (per `jsx/o4-frames.jsx` L99); touch sites `lib/types.ts` + `lib/build-plan.ts:67`. 9 unit tests.
- **`878fe31` — round-1 auto-review response.** Auto-review verdict `nit-only` (4 actionable findings + 1 spec/impl gap I caught). Five fixes: (a) `indigo: '#4F46E5'` promoted to `tokens.color.accent.indigo` design token across `tokens.ts` + `globals.css` + `TOKEN_NAMES` parity test (count 75 → 76); (b) `O4Copy.eyebrow.accent` union narrowed from `'indigo'|'violet'|'magenta'` to literal `'indigo'` (dead Hero ternary branches removed); (c) duplicate `O4Copy.question` field dropped, `copy.heading` flows to the `sr-only` legend; (d) stray `className={styles.footer}` removed (no selector existed); (e) redundant `aria-hidden="true"` on TopBar Arrow removed (Arrow sets it internally per `components/Arrow.tsx:24`). Plus AC-4 "Chip-card selected" bullet amended in `acceptance.md` — dropped the "dot-fill 120ms" phrase that didn't match canvas L99 transition list (`background, border-color, padding` only; inner dot is conditional-rendered). Verdict on `878fe31`: `approve` with 4 advisory findings.
- **`04a1f57` — visual regression fix from user pre-flight.** User eyeball on the round-2 Vercel preview: *"if this is 04 - it doesn't look right.. there's a lot off with it, notably now has a white background. How has this happened?"* Root cause: my `<main>` wrapper had `background: '#FFFFFF'` which overrode the page-level `BackgroundShell mode="expressive"` gradient (`--ds-color-surface-gradient-expressive` painted at `src/app/dev/proto/pre-signup-interview/page.tsx:44`). O1/O2/O3's `<main>` wrappers don't set a background — they inherit the page shell's gradient. Mine deviated by setting white. Three-line fix: drop the background, add `width: '100%'`, add `paddingTop: 24`, align `minHeight` to `'100vh'` (was `'100dvh'` — minor sibling-deviation too). My initial diagnosis was wider ("dropped EXPRESSIVE_BG on all four screens") which was wrong — verified by greping `src/app/dev/proto/pre-signup-interview/` for the gradient: only O4 forced white. Caught + corrected before pushing more.
- **`16410a4` — verification.md statuses → Pass + DoD-14 short-form ticked** (items 1, 8, 12, 14 per spec 76 §3 short-form for prototype category).
- **`4297700` — round-3 nit response: `padV` → `verticalPad` rename** per CLAUDE.md §"Names carry the design" (axis was implicit). Other round-3 nit (`100vh` → `100dvh`) declined for cross-screen parity with O1-O3; mobile-viewport sweep is a future cleanup slice if pursued.

**Auto-review trajectory.** Round-1 `nit-only` (4 findings, 0 blocking) → round-2 `approve` (4 findings, 0 blocking) → round-3 `nit-only` (4 findings, 0 blocking) → round-4 `approve` on `4297700` (final). Three `approve` verdicts in the trajectory; `block` never reached.

**Webhook subscription managed the iteration loop end-to-end** — same pattern as session 87. Subscribe on PR open, react to each `<github-webhook-activity>` event, unsubscribe automatic on merge.

## What went well

- **Pattern instantiation pace.** O3 close-out + full O4 cycle (scope → impl → 3 auto-review rounds → visual fix → ship) in one session. Cross-screen chassis from session 87 AC-6 (shared `Arrow` + `BrandBar` + `ProgressPill` + cream-blur footer) made the impl mostly mechanical — only the canvas-specific bits (chip-card emphasis variant, single-fieldset vs O3's two, eyebrow accent colour) needed fresh thought.
- **State rename was minimal scope-creep.** `SelfEmployment 'neither' → 'no'` touched 4 sites cleanly (types.ts, build-plan.ts, o4.ts, O4.tsx). No tests referenced the old literal. Same low-risk pattern as session 87's `Stage` rename.
- **Auto-review caught the AC-4 spec gap.** The "dot-fill 120ms" claim in my initial AC-4 didn't match canvas L99 transition list (`background, border-color, padding` only; no dot transition). Reviewer flagged it as `ac-gap`. Amending the AC rather than adding a non-canvas transition was the right move — canvas-fidelity wins for prototype category.
- **Token promotion was the right call over inline hex.** Round-1 reviewer asked: "Confirm whether tokens.color.accent.indigo exists; if it does, replace '#4F46E5' with that token reference to close the AC-2 Step 1 gap." Adding indigo to `tokens.color.accent` (3 surgical edits + globals.css + parity test) cost 4 lines net and closed the spec/impl gap cleanly. Token system intent preserved.
- **User-flagged regression diagnosed accurately on the second attempt.** Initial diagnosis ("dropped EXPRESSIVE_BG on all 4 screens; need a sweep") was wrong; user pushed back ("01-03 are acceptable... what have we changed?"). Re-investigation via `grep -n "background\|maxWidth\|<main"` across O1-O4 surfaced the actual root cause: only O4 forced white. One-line fix, three-line `<main>` style alignment to O3 exactly.

## What could improve

- **Initial visual-regression diagnosis was wider than the evidence supported.** When the user flagged white background, my first instinct was to extrapolate a systemic issue ("I systematically dropped EXPRESSIVE_BG on O1-O4") and propose a multi-screen sweep. The user correctly pushed back; the actual scope was one screen and one line. Lesson: when a user observation contradicts my mental model, verify the contradiction against live source before proposing scope. The grep that surfaced the root cause was 5 seconds of work; I should have run it before forming the wider hypothesis.
- **`<main>` style divergence from O1-O3 was a self-inflicted regression.** Writing O4.tsx from scratch (vs cloning O3.tsx's main wrapper), I added `background: '#FFFFFF'` without checking what siblings did. Sibling-parity for shared chrome patterns is the same lesson as session 87's `ScreenShell` Back-button regression — when implementing a screen that's structurally a sibling of an established pattern, diff your wrapper against the sibling's wrapper before pushing. Two-session pattern; promote to a numbered constraint if it recurs in O5.
- **AC drafting precision on motion specs.** AC-4 "dot-fill 120ms" was aspirational rather than canvas-derived. The canvas's transition list at L99 is concrete: `background 120ms ease-out, border-color 120ms ease-out, padding 160ms ease-out`. AC text should quote canvas transition lists verbatim (per CLAUDE.md §"AC-as-canvas-quote" discipline already applied for layout claims — extend the same to motion claims).
- **Mid-session SessionStart resets cleared the line-count visibility.** I told the user "I can't give an exact line count" mid-wrap-decision. The hook resets are expected at process boundaries, but the conversation-level cumulative isn't surfaced anywhere. Lesson is more about the hook's design than my behaviour, but worth noting: the wrap-decision moment is exactly when an accurate cumulative would help — currently I judge by feel.

## Key decisions

- **Visual regression scoped to O4 only, not a sweep.** Verified via grep that O1/O2/O3 don't set `<main>` background. The "drop EXPRESSIVE_BG sweep" hypothesis was wrong; no cleanup slice needed for O1-O3.
- **`100vh` (not `100dvh`) on O4 `<main>`** to match O3 exactly. dvh is technically better for mobile address-bar handling but cross-screen parity wins for prototype category. If dvh is wanted across the flow, it's a future sweep slice not an O4-only concern.
- **`indigo` promoted to a proper design token** rather than inlined in O4.tsx. Reviewer-prompted; token system intent preserved (cross-canvas colour vocabulary lives in `tokens.color.accent`).
- **`O4Copy.eyebrow.accent` narrowed to literal `'indigo'`** per CLAUDE.md "no speculative abstractions". Each screen owns its copy type; if future screens use violet/magenta they'll have their own narrowed union. No shared cross-screen accent type abstraction.
- **`O4Copy.question` field dropped; legend uses `copy.heading`.** Per "Simplicity first" — the heading IS the question; duplication was dead state.
- **AC-4 spec amended to match canvas** rather than impl rewritten to match AC. Canvas-fidelity wins.

## Bugs found + how fixed

- **`<main>` background overrode page-level expressive gradient.** Root cause: `background: '#FFFFFF'` line I added to O4.tsx `<main>` style. Page shell at `page.tsx:44` paints the expressive gradient; sibling screens (O1/O2/O3) don't set background and let it show through. Fix: drop the line, add `width: '100%'` + `paddingTop: 24`, switch `'100dvh'` → `'100vh'` for sibling parity. Single commit `04a1f57`.
- **AC-4 "dot-fill 120ms" claim didn't match canvas transition list.** Canvas L99 covers `background, border-color, padding` only; the inner radio dot is conditional-rendered with no CSS transition. Fix: amended AC-4 in `acceptance.md` to drop the dot-fill claim and explicitly state "the dot itself has no CSS transition — the canvas transition list at L99 covers `background, border-color, padding` only." Round-1 amendment in `878fe31`.
- **`indigo: '#4F46E5'` inline hex didn't match AC-2 Step 1's "tokens.color.accent.indigo" claim.** Initial impl declared `indigo` as a screen-local constant. Fix: added `indigo: '#4F46E5'` to `tokens.color.accent` + `--ds-color-accent-indigo` to `globals.css` + the TS type union + `TOKEN_NAMES` array (count 75 → 76); O4.tsx now uses `tokens.color.accent.indigo`. AC-2 Step 1 evidence now matches impl.
- **`SelfEmployment` union `'neither'` didn't match canvas `OPTIONS_FULL[0].key = "no"`.** Initial state shape pre-dated the canvas-as-source migration. Fix: renamed union literal across `lib/types.ts` + `lib/build-plan.ts:67` (the only logic site comparing the value).
- **TopBar Arrow had redundant `aria-hidden="true"` prop** when `Arrow.tsx:24` sets it internally. Removed in round-1.
- **`O4.tsx` Footer div had `className={styles.footer}` referencing an undefined selector** (no `.footer` rule in `O4.module.css`). Removed in round-1; all Footer styles were inline anyway.
- **`padV` variable name had implicit axis convention.** Reviewer flagged via CLAUDE.md "Names carry the design". Renamed to `verticalPad` (2 refs) in `4297700`.

## Persona findings recorded — post-cohort baseline

PR #156 is the second `src/` slice shipped post-cohort (session 87 already landed the retain/drop verdict: all 5 personas retained). Tracking findings against the baseline:

- **`reviewer-security.md`**: silent across 3 rounds (UI prototype, no new data inputs, no auth-touching code, no third-party deps). Same pattern as session 87. Retention rationale (calibration preservation when production graduation widens the surface) still holds.
- **`reviewer-style.md`**: round-1 surfaced 2 findings (accent union over-broad, `question` field duplicates `heading`) — both addressed in `878fe31`. Round-3 surfaced 1 finding (`padV` naming) — addressed in `4297700`. Three findings across three rounds; useful, non-pedantic.
- **`reviewer-prototype-readiness.md`**: round-1 surfaced 5 substantive findings (stray `styles.footer`, redundant aria-hidden, indigo token gap, AC-4 dot-fill gap, dot conditional-render note) — 4 addressed, 1 declined with reasoning. Round-2 surfaced 4 advisory (1 carry-over question on Arrow defaults, 2 praise items, 1 dot-transition restatement). Round-3 surfaced 1 actionable nit (`padV` rename) + 1 declined nit (`100vh` → `100dvh` cross-screen parity). High signal-to-noise; the AC-4 catch was especially valuable (spec/impl alignment gap I would have missed otherwise).
- **`reviewer-canvas-fidelity.md`**: dormant (correctly — no `Linked canvas:` field, canvas-as-source default policy).
- **`reviewer-correctness.md`**: N/A (substituted by `prototype-readiness` per category).

**Cumulative cohort verdict:** retain decision from session 87 holds. Both `style` and `prototype-readiness` continue catching real issues at a rate that justifies their slot.

## Next session priorities (for session 89 kickoff in SESSION-CONTEXT.md)

1. **P1: Continue canvas-as-source migration of O5 + O6.** Both are A1-style chip-card layouts per session-86 retro framing — same template as O3 + O4. Each ships as its own slice. Frame sources: `docs/design-source/pre-signup-interview/o5-partner-finances-expressive.html` + `o6-what-matters-to-you-expressive.html`. Decode if not yet decoded (`scripts/decode-bundler-canvas.sh`). Per CLAUDE.md §"Pre-priority canvas-fidelity verification", verify decoded sibling exists before any visual-fidelity work.
2. **P2: Continue canvas-as-source migration of O7 + O8** (different visual shapes per session 87's framing — "your plan" + "what's next"). Lower batch synergy with O5/O6; warrant separate slice consideration at scope-time.
3. **(Deferred per constraint #41)** Desktop-enhanced graceful enhancement — `docs/design-source/pre-signup-interview/desktop/Desktop Enhanced - Help Rail - Standalone.html`. Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px mobile cap. Unblocks once all 8 screens shipped.
4. **(Production graduation backlog)** items recorded across `verification.md` §"Architectural deferrals" across slices: AC-1 sticky CTA mechanism (true `position: sticky` + safe-area-inset + shorter-than-667 viewport hardening) · 44×44 touch target on `ScreenShell` Back (negative-margin or invisible hit-area extender) · `100dvh` vs `100vh` sweep across screens for mobile-address-bar handling. Bundle into a single production-graduation pass when the pre-signup flow exits `/dev/proto/`.
5. **(Inherited)** spec-citation-quote-check author-time hook · comment-review §Status exemption fix · spec 65 amendment for quantitative profiling data — all still parked.

## Constraints

#1-#41 from prior sessions preserved. **No new numbered constraints surfaced this session.**

One scoping-discipline observation joins session 87's two as recurrence-watch (still not yet numbered constraints):

- **Sibling-wrapper diff at impl-time** — when implementing a screen that's structurally a sibling of an established pattern (O4 is a sibling of O3), diff your top-level wrapper (`<main>` style) against the sibling's wrapper before pushing. Session 87 hit this with `ScreenShell` Back button (44×44 dropped at refactor); session 88 hit it with O4 `<main>` background (white forced over expressive gradient). Two-session recurrence; promote to a numbered constraint if it surfaces again in O5/O6.

The two session-87 scoping-discipline observations (shared-infrastructure audit at refactor-time + in-PR scope-expansion confirmation gate) remain on watch.
