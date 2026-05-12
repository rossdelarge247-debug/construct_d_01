# Session 89 retro — O5 + O6 canvas-as-source ships (2 PRs, 4 review rounds total)

## What happened

Session 89 opened on the harness branch `claude/session-setup-fePHr` off main `63ba023` (session-88 wrap commit). User confirmed P1 scope (O5 + O6 sequential slices) at turn 1. Both shipped to main by session end.

**Two PRs squash-merged to main:**

**PR #158 — `S-PROTO-o5-canvas-as-source · impl (AC-1..AC-4) (#158)` — squash-merged to main as `0d94459`.** Four commits across three auto-review rounds plus one user-driven variant switch.

- `a0f30e4` — initial impl (A1+B1+C1 per user pick at scoping). State rename `PartnerAwareness 'good-idea/some-things/very-little/hiding' → 'full/some/little/suspect'` to match canvas `OPT_*.key`. 10 unit tests.
- `8d0a953` — auto-review round-1 response. Verdict `request-changes` (8 findings). 3 on-PR fixes (Hero `accent` prop now consumed via `colors[eyebrow.accent]`; AC-1 footer-chassis amendment to match cross-screen chassis values vs canvas verbatim; AC-3 dropped `id` from radio-attr requirement). 3 deferrals documented (`aria-labelledby` redundancy; CTA touch-target floor; unmapped hex literals). 2 praise items.
- `bf8208d` — auto-review round-2 response. Verdict `approve` with 2 nits (1 praise). Renamed local `colors.line` → `colors.border` (4 sites; matches the token's own name per "Names carry the design"). AC-4 staggerIndex text amended from over-specified "0/1/2 + 3" to "1/2/3 (primary) + 4 (secondary)" — describes impl reality where Hero is `--stagger-index: 0`.
- `d213506` — variant switch A1 → A3 after user preview pre-flight. User direction verbatim: *"i suspect they might be hiding something isnt separated by a thin line"* + clarification *"doent c2 have that in canvas"*. After confirming canvas C2+A1 has only a gap and that the line + framing header live in A3 only, user picked the full A3 treatment from a 3-option clarification. Impl now mirrors canvas `FormBody` A3 branch + `ord.kind === "split"`: 20px gap + 1px `borderTop` divider in `colors.border` + 12px gap + 11px serif-italic *"If you have concerns…"* header in `colors.sub` + 8px gap before the suspect chip-card. 11 unit tests (added the A3-separator test).
- Auto-review round-3 verdict on the variant switch: `approve` with 2 praise findings — both confirming the prior round-1 / round-2 fixes still resolved + the new A3 treatment matches canvas L281-L298.

**PR #159 — `S-PROTO-o6-canvas-as-source · impl (AC-1..AC-4) (#159)` — squash-merged to main as `dcf3786`.** Two commits across one auto-review round.

- `eb9d9ed` — initial impl (A1+B1+C1 per user pick at scoping). O6 is structurally distinct from O3-O5 — multi-select chip grid (not radio group), two semantic groups (priorities + worries, 8 chips each from spec-65 calibrated order), cap=3 per group, CTA always enabled, CTA label "Build my plan". No state rename needed: existing `Priority` + `Worry` union literals in `lib/types.ts` already matched canvas option keys (verified via grep at scoping). 11 unit tests.
- `f27b617` — auto-review round-1 response. Verdict `request-changes` (5 findings, all non-blocking). All 5 addressed on-PR: (a) `.chip` `opacity: 1 !important` under reduced-motion was overriding the inline `opacity: 0.3` for disabled chips — scoped opacity-override to `.entry` only; (b) chip touch-targets ~29px deferred entry added to `verification.md`; (c) local `const next` shadow inside `togglePriority`/`toggleWorry` over the `useProto().next` navigation function — renamed to `const updated`; (d) test helper `chip()` → `getChip()` (verb naming); (e) CSS transition `background-color` → `background` to match AC-4 canvas-verbatim quote (canvas L153 uses shorthand).
- Auto-review round-2 verdict: **`approve` with 0 findings** — cleanest possible round.

User confirmed merge on the round-2 approve verdict without requesting a preview pre-flight (vs O5 where pre-flight surfaced the A3 switch).

## What went well

- **Canvas-as-source pattern instantiation accelerated post-O5.** O6 shipped in 1 review round vs O5's 3, even though O6 is structurally more complex (multi-select chip grid vs radio group). The cross-screen chassis from session 87 AC-6 + sibling-wrapper diff discipline from session 88 prevented the regression class that delayed O5 round-1.
- **The plan-vs-spec discipline caught a kickoff paraphrase that didn't survive verification.** SESSION-CONTEXT line: *"Both are A1-style chip-card layouts (same template as O3 + O4)"*. Reality: O6 is a multi-select chip grid with cap=3 per group, not a radio-group chip-card layout. Surfaced this to the user before sinking impl time; user picked all baselines (A1+B1+C1) + continue-this-session after seeing the actual scope.
- **The variant-switch flow on O5 (A1 → A3 mid-PR) worked cleanly.** User feedback on the preview triggered a re-scope; presented 3-option clarification with literal canvas-line references for each path; user picked A3; impl + acceptance.md + verification.md + tests all updated atomically in one commit. The in-PR scope-expansion confirmation gate (recurrence-watch from session 87) covered it: user-direction verbatim quoted in §"User-feedback iterations".
- **Auto-review trajectory on O6 was unusually short.** 1 round → approve(0). The 5 round-1 findings were all genuinely small (the opacity-override bug being the highest-value catch). After session 87's persona retain/drop verdict, the personas keep earning their slot — the round-1 catch on `const next` shadowing the navigation function was the kind of latent foot-gun a human reviewer would have missed in a same-day pass.
- **Token reuse from existing surface.** `tokens.color.accent.magenta` was already present at `tokens.ts:45` from a prior session. No `TOKEN_NAMES` parity churn needed for O6 (in contrast to O4's indigo addition in session 88).

## What could improve

- **SESSION-CONTEXT paraphrase rot was a real planning hazard.** The "both are A1-style chip-card layouts" line was a summary from session-86 retro that didn't match canvas reality for O6. The shipped HANDOFF-89 below corrects it: O5 was a radio-group chip-card (which the paraphrase did fit); O6 is a multi-select chip grid (which it did not). Future SESSION-CONTEXT framing for chip-card screens should distinguish radio-group vs multi-select at the line-item level rather than lumping them.
- **The reviewer-comment hook stub flagged "round 120" repeatedly as a false positive.** Cause: regex matching "round" inside "back**ground** 120ms" (CSS transition lines). The hook is advisory exit-0 so non-blocking, but the noise builds across rounds. A word-boundary in the regex would eliminate this class of false positive without weakening real provenance detection. Tractable side-quest for a future session.
- **The post-squash-merge branch reset required a force-push diagnostic loop.** First attempt `--force-with-lease` rejected as "stale info" because the remote branch had been auto-deleted by GitHub's squash-merge cleanup. Required a `fetch claude/session-setup-fePHr` (which surfaced "fatal: couldn't find remote ref"), then a plain `git push -u origin` to recreate. This is now a known sequence — could be folded into a `/post-merge-sync` helper.
- **Visual pre-flight habit on O6 was skipped.** User chose "merge now" without preview pre-flight. O5's pre-flight surfaced the A3 separator switch — a meaningful improvement that wouldn't have been caught by auto-review alone. For O6 the auto-review was 0-findings clean, so the bar for "merge without pre-flight" was higher, but the precedent is: pre-flight reliably surfaces user-experience details automation misses.

## Key decisions

- **Variant pick A1+B1+C1 for O6 (multi-select chip grid).** All baselines: stacked cards · disabled-at-cap · terse empty state. Per user confirmation at scoping after presented with 9-variant matrix.
- **Variant switch A1 → A3 mid-PR for O5.** User-driven via preview pre-flight feedback. The "i suspect" suspect-option row needed visible separation that A1+C2 didn't provide (canvas comment: *"C2 in A1/A2 — still sits 'below' but without a heavy header"*). A3 lifts the divider + *"If you have concerns…"* italic header.
- **No state rename for O6.** `Priority` + `Worry` union literals in `lib/types.ts` already matched canvas option keys verbatim. Verified via `grep -rnE` at scoping; saved a sweep that wasn't needed.
- **Canvas L153 transition shorthand wins over CSS longhand.** AC-4 quoted canvas as `background 120ms ease-out` (shorthand). Initial impl used `background-color 120ms ease-out` (longhand). Round-1 reviewer flagged the mismatch. Aligning to canvas-verbatim was the right call — canvas-fidelity wins for prototype category.
- **Chip touch-targets deferred to production-graduation pass alongside CTA.** ~29px chip height is below the 44×44 floor. Deferral entry added to `verification.md` so the gap is tracked, not silent.
- **Branch-state diagnosis post-merge.** Force-push-with-lease failed due to remote branch auto-deletion; plain push recreated. Documented in §"What could improve" as a recurring sequence.

## Bugs found + how fixed

- **O5 `<main>` background regression that I introduced in the initial impl** — caught at user pre-flight on session 88 (the `04a1f57` fix in HANDOFF-88) — no recurrence this session, but the sibling-wrapper diff discipline that emerged from it caught its near-cousin in O6's CSS module:
- **O6 `.chip` `opacity: 1 !important` overrode the inline `opacity: 0.3` for disabled chips under `prefers-reduced-motion`.** Round-1 reviewer flagged. Fix: scoped `opacity: 1 !important` to `.entry` only (where it cancels the `opacity: 0` initial keyframe state). `.chip` keeps `animation: none / transition: none / transform: none` but loses the opacity override. Single CSS-module rule split.
- **O6 `const next` shadowed `useProto().next` navigation function.** Latent foot-gun (no actual call inside the toggle function, but trivially broken if a future edit adds `next()` after the local `const next`). Round-1 reviewer flagged. Fix: renamed local to `const updated` in both `togglePriority` + `toggleWorry`.
- **O5 AC-1 footer-chassis citation deviated from impl.** AC-1 quoted canvas verbatim (`rgba(255,255,255,0.6)` + `blur(10px)`) but impl used cross-screen chassis values (`rgba(245,245,244,0.85)` + `blur(8px)`). Round-1 reviewer flagged ac-gap. Fix: amended AC-1 to cite the chassis pattern (which O3/O4/O5 all share) rather than canvas verbatim. Cross-screen chassis intentionally diverged from canvas at session 87 ship.
- **O5 AC-3 listed `id` as required on radio inputs but impl + O4 sibling don't have it.** The wrapping-label pattern provides implicit association. Round-1 reviewer flagged. Fix: dropped `id` from AC-3 text.
- **O6 CSS module `background-color` instead of canvas-verbatim `background`.** Round-1 reviewer flagged ac-gap. Fix: changed to shorthand `background 120ms ease-out`.

## Persona findings recorded — post-cohort tracking

PR #158 + PR #159 are the third and fourth `src/` slices shipped post-cohort (sessions 87 + 88 already landed the retain/drop verdict: all 5 personas retained). Continuing to track.

- **`reviewer-security.md`**: silent across all 5 rounds (PR #158 × 3 + PR #159 × 2). Same pattern as prior `src/` slices — no auth surface, no new data inputs, no third-party deps. Retention rationale (calibration preservation when production graduation widens the surface) still holds.
- **`reviewer-style.md`**: PR #158 round-1 surfaced 1 finding (`eyebrow.accent` carries no runtime meaning) — addressed via consume. PR #158 round-2 surfaced 1 finding (`colors.line` alias) — addressed via rename. PR #158 round-3 surfaced 0 findings. PR #159 round-1 surfaced 2 findings (both useful: `const next` shadow + `chip()` noun-named helper) — both addressed. Strong signal-to-noise.
- **`reviewer-prototype-readiness.md`**: PR #158 round-1 surfaced 5 findings (4 addressed, 1 declined with reasoning). PR #158 round-2 surfaced 1 (declined `100vh` for cross-screen parity — wait, that was session 88's O4; for O5 the round-2 was 1 ac-gap addressed). PR #158 round-3 surfaced 0 findings. PR #159 round-1 surfaced 3 findings (a11y-visual opacity override; mobile-viewport chip touch-target; ac-gap CSS shorthand) — all addressed. The a11y-visual catch was especially valuable (reduced-motion opacity override is the kind of bug only a careful reviewer would find).
- **`reviewer-canvas-fidelity.md`**: dormant on both PRs (correctly — neither has `Linked canvas:` field, canvas-as-source default policy).
- **`reviewer-correctness.md`**: N/A (substituted by `prototype-readiness` per category for prototype slices).

**Cumulative cohort verdict:** retain decision from session 87 holds across sessions 88 + 89. Both `style` and `prototype-readiness` continue catching real issues at a rate that justifies their slot. The a11y-visual catch on O6 round-1 raised the rolling signal-quality bar.

## Next session priorities (for session 90 kickoff in SESSION-CONTEXT.md)

1. **P1: Continue canvas-as-source migration of O7 + O8.** Frame sources: `docs/design-source/pre-signup-interview/o7-your-plan-expressive.html` + `o8-whats-next-expressive.html`. **Important scoping context:** O7 alone has 4 JSX files (`o7-page.jsx`, `o7-components.jsx`, `o7-plan-page.jsx`, `o7-plan-components.jsx`) suggesting it's substantially larger than O6 (which is itself larger than O5). O7 may warrant its own slice + session; O8 may need a separate slice. Decision per scoping at session 90 turn 1.
2. **(Deferred per constraint #41)** Desktop-enhanced graceful enhancement — `docs/design-source/pre-signup-interview/desktop/Desktop Enhanced - Help Rail - Standalone.html`. Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px mobile cap. Unblocks once all 8 screens shipped (O1 + O2 + O3 + O4 + O5 + O6 done; O7 + O8 remaining).
3. **(Production graduation backlog)** items recorded across `verification.md §"Architectural deferrals"` across slices: AC-1 sticky CTA mechanism · 44×44 touch target on Back · 44×44 chip touch-targets (NEW from O6) · `100dvh` vs `100vh` sweep across screens for mobile-address-bar handling · unmapped hex literals tokenisation (`#FFFFFF` chip bg / `#C9C5BD` outer-dot border / `#EAE7DF` disabled chip border / `#A8A29E` disabled chip text / `rgba(245,245,244,0.85)` footer backdrop) · `aria-labelledby` redundancy sweep on fieldset/legend (O4+O5). Bundle into a single production-graduation pass when the pre-signup flow exits `/dev/proto/`.
4. **(Inherited)** spec-citation-quote-check author-time hook · comment-review §Status exemption fix · spec 65 amendment for quantitative profiling data. **NEW:** comment-review hook `round \d+` regex false-positive on "background 120ms" (session-89 observation, see §"What could improve").
5. **(Inherited)** Sibling-pattern tokenisation slice — `tokens.color.text.faint` doesn't exist; `#A8A29E` inlined in O6 disabled chip text. Would map atomically across O3-O6 chassis at production graduation.

## Constraints

#1-#41 from prior sessions preserved. **No new numbered constraints surfaced this session.**

The three scoping-discipline observations from sessions 87 + 88 (sibling-wrapper diff at impl-time; shared-infrastructure audit at refactor-time; in-PR scope-expansion confirmation gate) all stayed clean this session. The variant switch on O5 exercised the in-PR scope-expansion gate cleanly (user-direction verbatim, atomic doc update). The sibling-wrapper diff held on both slices' `<main>` wrappers (verified pre-push for both). Continue carrying as recurrence-watch, not yet numbered constraints — but their utility was demonstrated cleanly across both slices this session.
