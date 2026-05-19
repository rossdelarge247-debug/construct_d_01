# S-INFRA-rigour-hook-fixes-prototype-aware

**Category:** infrastructure (path-default for `.claude/hooks/**`)

## Pre-flight notes

- Adversarial review budget: standard single-pass (acceptance <300L per `docs/workspace-spec/72b-adversarial-review-budget.md`)
- Linked canvas: N/A (no UI surface)
- Control-change label required at PR (hook scripts + spec amendment)
- Persona suite per spec 76 §3 row 4 (Multi-agent specialists / infrastructure column):

  > *"security · correctness · style (control-plane scrutiny)"*

  Maps to `reviewer-security`, `reviewer-correctness`, `reviewer-style`.

## In scope

- `.claude/hooks/tdd-first-every-commit.sh` — add prototype path-default skip
- `.claude/hooks/comment-review.sh` — fix §Status exemption awk regex
- `docs/workspace-spec/76-prototype-mode-rigour.md` §2 — update implementation-list footnote
- `CLAUDE.md` §"Hard controls" gate-table — TDD-first row parenthetical
- `tests/shellspec/` — new spec files exercising both fixes

## Out of scope

- Explicit-override (slice `**Category:**` line) honor at commit-time — requires branch-name → slice-lookup machinery; path-default only at V1
- `tdd-guard.sh` unchanged — per spec 76 §2 L41:

  > *"Implementations sharing this logic include `.claude/hooks/tdd-guard.sh` (path-default-skip)"*
- Other awk regex patterns in `comment-review.sh` (the §Status fix is targeted)

## Acceptance criteria

### AC-1 — `tdd-first-every-commit.sh` honors prototype path-default

The hook auto-exempts `src/` paths matching the prototype path-default pattern. Per spec 76 §2 L33:

> *"`src/app/dev/proto/*/*) category=prototype ;;             # literal-slug subroute`"*

Implementation re-uses `tdd-guard.sh` L85's regex form `^src/app/dev/proto/[^/[]+/.+\.(ts|tsx)$` verbatim to prevent semantic drift between the two hooks.

**Evidence:** `tests/shellspec/tdd-first-every-commit-category_spec.sh` — three scenarios:

1. Staged: prototype-only src/ → exits 0 (no block)
2. Staged: production-only src/ → exits 2 (block)
3. Staged: mixed (prototype + production) → exits 2 — per spec 76 §2 L24:

   > *"For multi-path slices, the most-restrictive applicable category wins (`production` > `prototype` > `infrastructure`)."*

### AC-2 — `comment-review.sh` §Status exemption matches both `## Status` and `## §Status`

The hook's fence-aware awk filter honors the documented `^## §?Status` semantics. Per CLAUDE.md §"Hard controls" §"Comments: WHY not WHAT":

> *"The §Status footer exemption is honoured — content inside `^## §?Status` blocks is excluded from the regex scan."*

Current `/^## §?Status/` ambiguously handles the multi-byte `§` (UTF-8 `0xC2 0xA7`) under POSIX awk; replacement `/^## (§)?Status/` groups the multi-byte character so the `?` quantifier applies to the whole group.

**Evidence:** `tests/shellspec/comment-review-status-exemption_spec.sh` — five scenarios:

1. `## Status` literal header → exemption fires (content below not flagged)
2. `## §Status` literal header → exemption fires
3. `## §Status` inside fenced code block → exemption does NOT fire (fence-aware logic intact)
4. `## Status` inside fenced code block → exemption does NOT fire
5. Content before any `## §?Status` heading → flagged normally (anti-pattern regex still triggers)

### AC-3 — Spec 76 §2 L41 + §6 L84 implementation lists add `tdd-first-every-commit.sh`

Spec 76 §2 L41 and §6 L84 each carry a list of implementing files sharing the path-default-skip logic. Amendment adds `tdd-first-every-commit.sh` to both lists, reflecting that both hooks now honor the path-default.

**Evidence:** Doc diff in PR; one-token additions to two lists.

### AC-4 — CLAUDE.md §"Sweep discipline" implementing-files list adds `tdd-first-every-commit.sh`

The CLAUDE.md §"Slice categories" §"Sweep discipline" paragraph at L281 mirrors spec 76 §6's list of implementing files that must sweep when §3 matrix rules change. Amendment adds `.claude/hooks/tdd-first-every-commit.sh` to the implementing-files list.

**Evidence:** Doc diff in PR; one-token addition.

## Design decisions

- **D-1 — V1 honors path-default only.** Explicit `**Category:**` override (spec 76 §2 step 1) requires the hook to resolve the active slice from branch-name, then read `acceptance.md`. Out of scope for V1; the override-rare case is documented as a known limitation in the §Status footer.
- **D-2 — Awk regex grouping over rewrite.** `/^## (§)?Status/` minimally changes the original `/^## §?Status/` — grouping the multi-byte char preserves the documented semantics with a one-character delta.
- **D-3 — Regex form re-used verbatim across both TDD-related hooks.** `^src/app/dev/proto/[^/[]+/.+\.(ts|tsx)$` is the shared pattern. Two implementations of the same rule diverging is a spec-drift class; identical-regex prevents it.

## §Status

| Date | Event |
|---|---|
| 2026-05-19 | Drafted; AC-1..AC-4 frozen; impl + tests pending |
| 2026-05-19 | AC-4 refined at impl-time: target surface is CLAUDE.md L281 Sweep-discipline paragraph (no gate-table row exists for this hook). AC-3 expanded to also amend spec 76 §6 L84 (sibling sweep-discipline self-reference) per constraint #38 recursive-application. |
