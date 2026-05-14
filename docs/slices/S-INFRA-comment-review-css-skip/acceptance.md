# S-INFRA-comment-review-css-skip

**Category:** infrastructure

Extend the author-time `comment-review.sh` hook skip-list to include `*.css` files (covering `.module.css` per bash glob trailing-extension match). Closes SESSION-CONTEXT P5 inherited side-quest *"Comment-review hook CSS-files regex tightening"*.

## Purpose

The `comment-review.sh` hook protects against six prose-level anti-patterns per CLAUDE.md §"Coding conduct" §"Comments: WHY not WHAT, no temporal provenance" (provenance · finding-ID · sibling-step · lineage · historical-count · emoji). The regexes are tuned for prose comments in markdown narratives + persistent TS/JS code comments + test descriptions.

CSS comments occupy a different genre: structural section markers (`/* === Hero === */`), descriptive labels (`/* fade in */`), or vendor-prefix shims (`/* IE10 fix */`). Phrases that the hook's regexes catch — sibling-step references and lineage tags pointing at consumer components — appear naturally in CSS comment hygiene without carrying the rot-prone meta-narrative the rule targets.

Current skip-list covers `tests/shellspec/**`, `tests/**/fixtures/**`, `tests/personas/synthetic/**`, `docs/HANDOFF-SESSION-*.md`, `docs/SESSION-CONTEXT.md`, structural data formats (`*.json`, `*.yaml`, `*.lock`), and binaries. CSS is missing.

## Interpretation of "regex tightening"

SESSION-CONTEXT P5 wording reads as *"regex tightening"*. Two literal interpretations:

- **A. Regex tightening** — make each anti-pattern regex CSS-comment-aware (e.g., add negative lookbehind/lookahead so matches inside `/* ... */` blocks don't fire while matches in other comment styles still fire).
- **B. Skip-list extension** — treat CSS files as out-of-scope wholesale; regexes never run on them.

This slice ships **B**. Rationale:

- Each anti-pattern regex targets prose-level meta-narrative that doesn't meaningfully appear in CSS (CSS comments are infrastructure, not narrative).
- A is complex (6 regexes each need CSS-comment-aware updates) and risks losing real catches in other genres.
- B is one glob entry + one test case; functionally equivalent outcome for the failure mode (no false positives on CSS).
- Same precedent as existing skip entries for `*.json`/`*.yaml`/`*.lock` — wholesale-skip of file types where the rule doesn't fit.

If the prototype later introduces SCSS/SASS/LESS, that PR extends the skip-list to cover them. Not done speculatively here (per CLAUDE.md §"Coding conduct" §"Simplicity first").

## In scope

- Add `*.css)` case-statement entry to `.claude/hooks/comment-review.sh` skip-list (between `*.lock|*.json|*.yaml|*.yml` and the binary-extensions block).
- Add one shellspec test asserting `.module.css` exits silently even when the body contains a sibling-step false-positive trigger (matching the failure mode the slice addresses).
- Update CLAUDE.md §"Hard controls" §"Author-time comment review" sibling paragraph that documents the skip-list to mention CSS.
- Slice docs (this file + `verification.md`).

## Out of scope

- SCSS / SASS / LESS pre-processor extensions — added when first introduced to the codebase.
- Regex-level CSS-comment-awareness (Approach A above) — see §"Interpretation" for rationale.
- Hook-level scoping changes (matcher / event / advisory shape unchanged).

## Acceptance criteria

**AC-1: `*.css)` glob added to skip-list.**

Insert a new case-statement entry in `.claude/hooks/comment-review.sh` between `*.lock|*.json|*.yaml|*.yml)` and `*.png|*.jpg|...)`. Comment justifies the inclusion. Bash glob `*.css` matches both `foo.css` and `foo.module.css` (trailing-extension semantics).

**AC-2: shellspec test exercises the new skip.**

A new `It 'exits 0 silently for .css files...'` case in `tests/shellspec/comment-review.spec.sh` sends a `Footer.module.css` write whose body contains a sibling-step trigger phrase — a real failure-mode phrase that would otherwise fire the `sibling-step` regex. Asserts status 0 + empty stdout. (The literal trigger phrase lives in the test fixture body, not in this AC, to avoid this slice doc tripping its own regex.)

**AC-3: CLAUDE.md skip-list documentation updated.**

The skip-list paragraph at CLAUDE.md L303 (§"Hard controls" §"Author-time comment review" sibling-row body) gains a new clause for stylesheets covering the rationale verbatim per CLAUDE.md §"Planning conduct" §"Quote, don't paraphrase".

**AC-4: No regression to existing skip-list cases or anti-pattern catches.**

All pre-existing shellspec tests still pass. The hook continues to fire on TS/JS/MD files (no widening of skip-list beyond the new CSS clause). No matcher change; no other regex change.

## References

- `.claude/hooks/comment-review.sh` — hook (edit target)
- `tests/shellspec/comment-review.spec.sh` — test addition target
- CLAUDE.md §"Hard controls" §"Author-time comment review" — documentation update target
- CLAUDE.md §"Coding conduct" §"Comments: WHY not WHAT, no temporal provenance" — the rule the hook enforces (unchanged)
- SESSION-CONTEXT P5 — inherited side-quest origin
