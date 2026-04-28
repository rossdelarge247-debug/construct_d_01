# 72a — Preview-deploy verification rubric

**Status:** locked at v3b S-5 ship (per acceptance.md AC-9). Active from S-F1 onwards. v3a/v3b are infra-only — no `src/` UI surface — so the rubric is dormant until the first UI slice.

## Purpose

DoD item 4 (CLAUDE.md §"Engineering conventions") requires:

> *"Preview deploy verified in-browser if UI (golden path + edge cases + prefers-reduced-motion)"*

Pre-AC-9 reading of "verified" was whatever the engineer felt like checking. AC-9 ships the exact six-dimension contract so "verified" gains a meaningful contract — and pairs with the AC-3 `ux-polish-reviewer.md` persona, which reviews this section in `verification.md` for evidence quality.

## The six dimensions

Per `docs/engineering-phase-candidates.md` §G L166 (5 dimensions) plus AC-9 §Verification (which adds *screen-reader* as a 6th):

1. **Golden path** — the primary user journey through the slice's UI surface, exercised end-to-end on the preview-deploy URL.
2. **Edge cases** — slice-specific boundary states (empty state · max-length input · failure state · loading state · concurrent-action state). The slice author enumerates the relevant ones in AC text; this dimension verifies each behaves per spec.
3. **`prefers-reduced-motion`** — every animation/transition has the specified reduced-motion fallback (per spec 26). Test in DevTools `Emulate CSS media feature prefers-reduced-motion: reduce`.
4. **Keyboard-only** — every interactive control is reachable + operable without a mouse. Tab order is sensible. Focus state is visible. No keyboard-trap.
5. **Mobile viewport** — slice renders + functions on a 375×667 viewport (iPhone SE baseline). Touch targets ≥44×44 CSS px. No horizontal scroll on 320px width.
6. **Screen-reader** — primary controls announce meaningful labels; landmarks are present (`<main>`, `<nav>`, etc.); `aria-live` regions fire for state changes; tested with VoiceOver (macOS) or NVDA (Windows). At minimum, the slice author runs through the golden path with the screen reader on and confirms each step is announced.

## Per-slice recording protocol

Each slice's `docs/slices/S-XX/verification.md` MUST include a `## Preview-deploy verification` section before the slice ships. One row per dimension; cells:

- **Status:** `Pass` / `Fail` / `N/A` (with reasoning if N/A — e.g. slice has no animations → `prefers-reduced-motion` is N/A).
- **Evidence:** brief description (≤2 sentences) — what was tested + what was observed. Optional screenshot link if relevant.

Template (copy-paste into slice verification.md):

```markdown
## Preview-deploy verification (per spec 72a)

| Dimension | Status | Evidence |
|---|---|---|
| Golden path                 | Pass / Fail / N/A | … |
| Edge cases                  | Pass / Fail / N/A | … |
| `prefers-reduced-motion`    | Pass / Fail / N/A | … |
| Keyboard-only               | Pass / Fail / N/A | … |
| Mobile viewport (375×667)   | Pass / Fail / N/A | … |
| Screen-reader (VoiceOver/NVDA) | Pass / Fail / N/A | … |
```

## Pairing with AC-3 `ux-polish-reviewer`

Per AC-3 (acceptance.md L34-38), the persona's invocation convention is "spawn during slice-completion for any AC whose `In scope` mentions UI surface." The persona reviews this `## Preview-deploy verification` section against the six dimensions. The acceptance-gate persona (AC-2) cross-checks that each row's evidence cell actually supports the claimed Status — flags `Pass` rows with empty evidence cells.

## Out of scope (deferred to v3c / Phase C kickoff)

- **Visual-regression tooling decision.** Playwright vs Chromatic vs Storybook (per engineering-phase-candidates §G·2). Until that lands, dimension 1 (golden path) + 2 (edge cases) are manual-in-browser.
- **CI-side enforcement.** This rubric is currently author-discipline + persona-review. Server-side check (e.g. `verify-slice.sh` Gate 8: `verification.md` must contain the §Preview-deploy heading for any slice that touched `src/app/` or `src/components/`) is a v3c candidate.
- **Test-fixture for the AC-2 persona** verifying a `Pass`-without-evidence row fails — deferred to AC-2 ship per AC-9 §Out of scope (AC-9 here ships the rubric + template; the persona-side test fixture lands when the persona itself ships).
