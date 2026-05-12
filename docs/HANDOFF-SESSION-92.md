# Session 92 retro — Phase 3 Batch B full + Batch C partial

## What happened

Session 92 opened with the cross-screen homogenisation programme at "3 of 5 Phase 3 batches landed" (A TopBar + E dead-code + D `<main>` sweep, all session 91). User picked P1 + P2 from kickoff: ship Batch B (Hero) then Batch C (Footer + O7 PlanFooter rebuild). Batch B shipped clean and merged. Batch C primitive + 3 of 7 screens + 7 of 12 tests shipped as a PARTIAL draft PR; resumption deferred to next session when the 1,500-line churn warn surfaced mid-sweep.

**Batch B — Hero harmonisation.** `S-PROTO-batch-B-hero-harmonisation` PR #168 squash-merged as `d49da6e`. Shared `components/Hero.tsx` (73L) + `Hero.module.css` (3L canonical padding wrapper). All 8 screens flip `<h2>` → `<h1>` (F-SM-01 a11y must-fix). 5 H1/H2 sizes (19/21/26/30/38) collapse to canonical 21px serif/1.18/-0.02em/600 (F-TY-01). Eyebrow drops leading-dot decoration on O4/O5/O6/O8 (F-TY-04); collapses to 9.5px sans (F-TY-02/03) — sans-serif chosen at scoping time as the modal value (4 screens) per user confirmation. Canonical Hero padding `16px 20px 12px` + H1 top-margin 8px (F-SP-04/05). `O2.module.css` created (F-CM-01); `.entry` stagger animation + `prefers-reduced-motion` fallback. O8.module.css already had `.entry` so just wired the call-site (F-CM-03). O7 mood-band wrapper preserved around shared Hero — `MobileHero` retains EXPRESSIVE_HERO gradient + radial-spotlight overlay + bespoke Save-as-PDF/Email-it CTAs + "~5 min read · 4 pages" caption (user chose this at scoping time over "universal Hero with background+extras props" or "collapse CTAs entirely"). 9 new Hero unit tests; 6 screen tests updated `level: 2` → `level: 1` to match the new contract. Net +540/-399 lines. `npm test` 514/514. `tsc` clean. Lint 0 errors.

**Batch C — Footer harmonisation + O7 PlanFooter rebuild (PARTIAL).** `S-PROTO-batch-C-footer-harmonisation` draft PR #169 open. Shared `components/Footer.tsx` (67L) + `Footer.module.css` (93L) shipped: `<footer>` semantic landmark; sticky `bottom: 0` + `margin-top: auto`; canonical padding `12px 20px 16px`; cream + light variants (`variant="light"` preserves O8's intentional lighter blur per F-FT-02); caption italic-when-enabled serif / sans-when-disabled (F-FT-06); force-reflow CTA-bounce on `false → true` enabled transition (F-FT-05); optional `secondaryActions` ReactNode slot for the O7 rebuild; `prefers-reduced-motion` fallback. O1 inline-in-body footer markup swapped to `<Footer/>` (trust-band caption preserved as 3-span layout so `getByText('Private until saved')` continues to pass). O2 `function Footer` deleted; canonical chassis swapped in. O3 `function Footer` deleted; 3-state caption (pickToContinue / privacyOptional / bothAnswered) derived inline at the call-site; old setTimeout-based bounce replaced by canonical force-reflow owned by the primitive. 7 of 12 AC-4 unit tests shipped (landmark · CTA + onContinue · disabled-state click suppression · caption role=status · no-caption branch · secondaryActions row · cream/light variant class). Net +500/-207 lines. `npm test` 521/521. `tsc` clean.

**Session-locked sub-decisions captured for Batch C resumption (in PR #169 body + acceptance.md):**
- O7 Footer chrome: What's-next (primary) + Download-PDF + Email-link (secondary actions row above primary). Back link removed from sticky (TopBar owns Back).
- O7 Hero CTAs (Save-as-PDF + Email-it-to-me + "~5 min read" caption): stay as mood-band visual statement. NOT deduplicated against Footer CTAs.
- O7 in-flow PlanFooter `<section>`: removed entirely per Phase 2 FT-04 literal. Heading + helper + Find-out-more + pricing links all gone.

## What went well

- **Phase 2 locked decisions stayed honoured under impl.** Both batches inherited the audit's joint-review outcomes cleanly. The only Phase-2 ambiguity surfaced (eyebrow font-family) was caught at scoping time + asked of the user, not silently decided.
- **Read discipline held under 8-screen sweep load.** Read-cap hit twice during O5/O7 inspection where the survey lookups stacked up; both worked-around via grep-based extraction from earlier `awk` outputs rather than re-Reading. The cap is doing its job.
- **TDD-first hook caught the Footer primitive shipping untested.** Initial Batch C commit attempt failed because Footer.tsx had no corresponding test file. Adding the minimal test suite (7 of 12 tests) before committing was the right discipline; the hook prevents partially-untested primitives from sneaking through.
- **AC-impl cross-check at impl-time** (recurrence-watch from session 90) applied at both Batch B impl-time and Batch C scoping-time. Surfaced no AC-breaking gaps. Discipline holding.
- **Wrap-at-warn discipline.** Hit the 1,500 churn warn mid-Batch-C sweep. Rather than push to 2,000 hard-stop (would need ~600 more lines for O4/O5/O6/O7/O8 + remaining tests + verification + preview-walk), checkpointed at the natural break (primitive + 3 swept + minimal tests) and shipped PARTIAL. Cleaner state on resume than half-built work in working memory.

## What could improve

- **Hook-flagged provenance in slice docs.** Reviewer-comment hook flagged `session-91`, `session 91`, `session 92`, and `PR #161` mentions in acceptance.md prose — provenance anti-pattern per CLAUDE.md §"Coding conduct" §"Comments: WHY not WHAT". Fixed both times by rephrasing. Existing Batch A/B/D/E slice docs may have similar drift; review at next sweep if hook starts blocking.
- **Hook-flagged ⏳ emoji in verification.md.** Used the hourglass emoji as a status marker; flagged by the no-emoji rule. Fixed via `(deferred)` text. Worth remembering that status iconography in spec docs has to be text, not emoji.
- **Hook-flagged "used by O7" lineage** in a JSDoc comment in acceptance.md. Same lineage-rot anti-pattern. Fixed by rephrasing.
- **Initial O1 trust-band test broke on the caption shape change.** When the inline `<span>Private until saved</span>` markup moved into the shared Footer's caption slot via a JSX fragment, the test's `getByText('Private until saved')` no longer matched because the text became part of a multi-segment caption. Fix: preserve the 3-span structure inside the caption fragment. Worth noting: when refactoring inline markup into a primitive's slot, watch for text-shape regressions in adjacent tests.
- **Churn calibration drift across the session.** The line-count hook's running total occasionally jumped non-linearly (e.g. `+540/-399 tracked` flipped to `+970/-606` after one edit). Worth a closer look — may be a hook bookkeeping issue or a stale baseline. Not blocking, but the numbers are less trustworthy as a wrap signal than expected.

## Key decisions

- **Batch B eyebrow font-family = sans (modal value).** Phase 2 didn't lock this; modal across the 8 screens was sans (O3/O4/O5/O6 = 4 screens) vs mono (O1/O2/O8 = 3 screens). User picked sans at scoping time. O1/O2/O8 collapse from mono.
- **Batch B O7 mood-band treatment = O7 wraps shared Hero.** O7's `function MobileHero` retains as a wrapper around the canonical `<Hero/>`, preserving the EXPRESSIVE_HERO gradient + radial-spotlight overlay + bespoke CTAs/caption as canvas-distinctive presentation chrome. Alternative considered (universal Hero with `background?` + `extras?` props) rejected to keep the primitive focused on typography. Alternative considered (collapse CTAs entirely + rely on Batch C Footer) rejected to preserve the mood-band visual statement.
- **Batch C O7 Footer composition = What's-next (primary) + Download-PDF + Email-link (secondary).** User chose this over (a) "Download-PDF primary + Email-link secondary, drop What's-next" and (b) "all three primary, stacked". Preserves forward navigation while bringing the PlanFooter CTAs into the canonical chassis. Back link from old sticky chrome dropped (TopBar owns Back per Batch A).
- **Batch C wrap at warn rather than push to hard-stop.** When the 1,500 churn warn surfaced mid-sweep with O4/O5/O6/O7/O8 + tests + verification + walk all remaining, the user chose "Pause + ship what's safe" over pushing past 2,000. PARTIAL PR + clean resumption checklist preferred over half-built local state.

## Bugs found + how fixed

- **TDD-first hook blocked Batch C initial commit.** Footer primitive staged without a corresponding `tests/` file. Hook surfaced cleanly with actionable remediation. Fix: write minimal Footer test suite (7 of 12 AC-4 tests) covering the primary contracts, re-stage, re-commit. The remaining 5 tests deferred to resumption (default-enabled assertion · caption typography branch on enabled · no-secondaryActions branch · CTA focus-visible · CTA-bounce animation on enable transition).
- **O1 trust-band test broke after Footer caption swap.** `getByText('Private until saved')` failed because the inline `<span>Private until saved</span>` from the original O1 footer markup got flattened into a JSX fragment when passed to `<Footer caption={...}/>`. Fix: preserve the 3-span structure inside the caption fragment (`<span>{copy.trustBand.left}</span>{' '}<span>·</span>{' '}<span>{copy.trustBand.right}</span>`). Test passes unchanged; structure intent honoured.
- **Verification.md double-`deferred` after global emoji replace.** Used `replace_all: true` to swap `⏳` → `(deferred)`, then hit a line that already contained `(deferred)` in its text + `⏳` decorator. Resulted in `**AC-4 — Footer test suite: (deferred) deferred.**`. Fix: targeted Edit on the specific double-substring. Minor; lesson: prefer scoped replace over global when the target token can collide.

## Persona findings recorded — N/A this session

No auto-review fan-out occurred for either PR (#168 merged direct per "let's just merge" cadence; #169 still draft). No persona findings to record. Cumulative cohort verdict from prior sessions (retain all 5 personas) carries forward unchanged.

## Next session priorities (for session 93 kickoff)

1. **P1: Resume Batch C** — sweep O4/O5/O6/O8 (mechanical) + rebuild O7 PlanFooter (delete in-flow `<section>` + replace `<PlanFooter/>` with `<Footer ctaLabel="What's next" secondaryActions={<Download-PDF + Email-link>}/>`) + finish 5 remaining AC-4 tests + preview-deploy 6-dim walk + flip PR #169 from draft → ready + merge. Branch already open at `claude/S-PROTO-batch-C-footer-harmonisation`.
2. **P2: Phase 4 — spec pressure-test workstream.** Open `S-PROTO-pre-signup-spec-pressure-test` audit slice once Batch C fully lands. Compare homogenised surface against CLAUDE.md product positioning + spec 65 + `docs/v1/v1-wireframes.md`. User-flagged: *"feels basic"* relative to V1 baseline.
3. **P3: O7 visual-issues enumeration** — surface during Batch C resumption preview-deploy walk (P1 in-flow).
4. **(Deferred)** Desktop graceful enhancement · production-graduation backlog · inherited side-quests (spec-citation-quote-check hook · comment-review §Status exemption · CSS-files regex tightening · spec 65 quantitative profiling amendment).

## Constraints

#1-#41 from prior sessions preserved. **No new numbered constraints surfaced this session.**

Scoping-discipline observations on recurrence-watch (still not yet numbered constraints):

- **AC-impl cross-check at impl-time** (introduced session 90) — applied; discipline holding.
- **Sibling-wrapper diff at impl-time** (carried) — not surfaced.
- **Shared-infrastructure audit at refactor-time + abs-path-import gap** (carried) — not surfaced.
- **In-PR scope-expansion confirmation gate** (carried) — not surfaced.
- **`git push --force` after amend** (logged session 91) — not surfaced.
- **NEW this session — Wrap-at-warn-not-hard-stop.** When the 1,500 churn warn surfaces mid-batch, the right call is to checkpoint as PARTIAL + wrap, not push to 2,000. Cleaner state on resume than half-built work in working memory. Logged for promotion to numbered constraint if a second session surfaces the same incident pattern.
- **NEW this session — Read-cap discipline holding under sustained sweep.** Two hits during 8-screen surveys (Batch B + Batch C). Both worked-around via grep + remembered-from-earlier-survey patterns. The cap is doing its job; no remediation needed.
