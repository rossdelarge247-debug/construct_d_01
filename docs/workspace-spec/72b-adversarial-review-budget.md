# 72b — Adversarial-review-gate budget convention

**Status:** locked at v3b S-5 ship (per acceptance.md AC-10).

## Purpose

DoD-3 (CLAUDE.md §"Engineering conventions") requires:

> *"Adversarial review gate (per slice). Before committing any slice or significant change, run one adversarial review pass. Two options: (1) explicit prompt — 'poke holes in this; find edge cases, security issues, regression risks'; (2) `/review` or `/security-review` skill. Output is a list of concerns. Either address or explicitly defer with reasoning. No slice ships without this gate."*

Pre-AC-10, the gate was structurally infeasible for slices whose authoritative source exceeded ~300 lines (the per-turn read-cap enforced by `.claude/hooks/read-cap.sh`): a single-turn reviewer couldn't hold the full source in context. v3a session 40 surfaced this directly — the `/review` of the v3a foundation slice hit the read-cap mid-source and emitted a procedural `request-changes` verdict ("can't see the whole source"). v3b S-2 (`/review` of v3b acceptance.md) hit the same wall.

AC-10 ships two structural options + decision criteria so the gate becomes consistently achievable.

## Decision criteria

Source-of-truth: `wc -l docs/slices/S-XX/acceptance.md` (the canonical AC doc; sibling docs `verification.md` + `audit-findings.md` + `review-findings.md` are derivative).

| Source size | Convention | Rationale |
|---|---|---|
| < 300 lines | Single-turn (status quo) | Fits in one read-cap window; no orchestration overhead. |
| 300–1000 lines | Partition (Option B) | Multi-turn budget creates deferral risk; partition is cheaper. |
| > 1000 lines | Multi-turn budget (Option A) | Partition becomes unwieldy past ~3 sub-spawns; explicit budget envelope is cleaner. |

These are conventions, not rules — slice setup may justify deviation in writing in the slice's `acceptance.md` §DoD section.

## Option A — Multi-turn budget envelope

Reviewer prompt explicitly declares the budget at the top:

> *"Expected 2-3 turns; will surface read-cap deferrals as v3c carry-over rather than blocking the verdict."*

The reviewer reads the source in offset+limit chunks across turns, tracks coverage in working notes, and emits the final verdict in the last turn citing which sections are read-cap-deferred.

**Use when:** source >1000 lines, OR the AC contract is logic-heavy (every line load-bearing).

## Option B — Partition

Main session orchestrates 3 sub-spawns, each receiving a disjoint slice-of-the-source:

- **Sub-spawn 1 (spec-side):** the `acceptance.md` AC table + verification rubric. Output: AC quality findings.
- **Sub-spawn 2 (impl-side):** the slice's source diff (`git diff origin/main...HEAD`). Output: code-level findings.
- **Sub-spawn 3 (git-history-side):** the commit chain on the slice branch (`git log origin/main..HEAD`). Output: commit-msg accuracy + RED-then-GREEN ordering + scope-creep findings.

Main session aggregates, dedupes, and emits the consolidated verdict.

**Use when:** source 300-1000 lines AND the concerns naturally partition (most slices fit this).

## Pre-flight gate at slice setup

When a slice's `acceptance.md` exceeds 300 lines, slice setup (in the slice's `acceptance.md` §DoD or §Pre-flight) MUST note which option applies and the rationale. This forces the decision early, not at adversarial-review-time when the deadline pressure is on.

Pre-flight check (deterministic, runnable):

```bash
size=$(wc -l < docs/slices/S-XX/acceptance.md)
if [ "$size" -gt 300 ]; then
  echo "AC source $size lines — pick Option A or B per spec 72b."
fi
```

Slice template for the §Pre-flight note:

```markdown
## Pre-flight (per spec 72b)

- AC source size: 410 lines (above 300; partition convention applies).
- Adversarial review plan: Option B (partition) — 3 sub-spawns: spec-side / impl-side / git-history-side.
```

## Out of scope (deferred to v3c)

- **Retroactive re-review of v3a using this convention.** v3a is shipped state; deferred per AC-10 §Out of scope.
- **Multi-provider 3rd-agent reviewer (e.g. GPT/Gemini for cross-pollination).** v3c carry-over.
- **Structured-findings JSON Schema** so verdicts are machine-parseable. v3c.
