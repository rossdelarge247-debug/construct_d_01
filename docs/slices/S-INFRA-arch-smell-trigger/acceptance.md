# S-INFRA-arch-smell-trigger — Acceptance criteria

**Slice:** S-INFRA-arch-smell-trigger
**Spec ref:** CLAUDE.md §Engineering conventions (sibling to §Adversarial review gate); session-47 round-8 worked example (commit `5295364` add → `31ebc51` revert)
**Phase(s):** Infra (rigour-pivot programme; v3b S-7 sibling)
**Status:** Draft

---

## Context

Session 47's v3b S-6 PR #30 ran 9 rounds of live recursive auto-review. Rounds 2-6 all surfaced findings clustered in `.github/workflows/auto-review.yml` because parsing + diagnostic + check-run posting + skip + failure-fallback were inline in one file with no test surface. The session-47 retro identified this as an architectural-smell pattern: ≥3 fix-up rounds clustered in one file ⇒ step-back-review the abstraction, don't patch round 4.

The trigger paragraph was added to CLAUDE.md mid-PR-30 (commit `5295364`); round 8 itself flagged it as scope-creep — the meta-rule was not in S-6's AC list — and it was reverted in `31ebc51`. This sibling slice ships the paragraph cleanly with proper acceptance.md scoping, and is itself a worked example of the rule (step-back from PR-30's mid-PR addition to a properly-scoped sibling slice).

Verbatim text source: `git show 31ebc51 -- CLAUDE.md` (the reverting commit's diff).

## Dependencies

- **Upstream:** PR #30 (v3b S-6 persona suite) and PR #31 (session-47 wrap) merged. Verified at session-48 turn 0: HEAD `1e1f113` = origin/main.
- **Open decisions required:** none.
- **Re-use / Preserve-with-reskin paths touched:** none — pure prose insertion in a top-level conduct file.
- **Discarded paths deleted at DoD:** none.

## Pre-flight notes

- **AC count deviation.** Single AC vs the `_template/acceptance.md` "minimum 3 AC" guide. Justified: the change is one verbatim paragraph addition in one file. Splitting into 3 ACs would manufacture surface for surface's sake — see CLAUDE.md §Coding conduct → "Simplicity first" and §"Surgical changes". Recorded here as the explicit deviation.
- **Adversarial review budget (per spec 72b).** acceptance.md `<300L`; single review session per spec 72b §Use when. Live auto-review (slice-reviewer persona, AC-1 of v3b) is **forward-pending PR #30 merge** — auto-review.yml is not on `origin/main` until PR #30 lands. Once PR #30 merges and PR #32 syncs onto the new main, the next push triggers auto-review on this PR.
- **TDD exemption.** Doc-only addition; tdd-exemption-allowlist.txt entry not required (allowlist scopes `src/**.{ts,tsx}` only per AC-6 tdd-guard scope; CLAUDE.md edit doesn't trigger tdd-guard).
- **Hook expectations** (per HANDOFF-47 L74 evidence on similar prose work): pre-commit-verify GREEN; tdd-first-every-commit skip-allow; tdd-guard skip-allow; pre-push-dod7 skip-allow (commit msg won't begin `RED:`); auto-review.yml fires on PR open.
- **Branch-protection note.** Per session-48 pre-flight Q4: user is toggling auto-review check from required → informational in repo settings during this session, matching v3b AC-1 §Out of scope ("informational at v3b ship; auto-blocking deferred to v3c"). PR may transiently show blocked state if BP toggle hasn't landed by PR-open time.

## MLP framing

The loveable floor: a future Claude session reading CLAUDE.md §Engineering conventions sees the smell-trigger rule next to the §Adversarial review gate it supplements, with a worked example precise enough that recurrence is recognisable in real-time (i.e. another 6-round patching session on a single file gets caught at round 3 — the cheaper-move-is-split-the-file move is in the rule itself).

---

## AC-1 · §Architectural-smell trigger paragraph in CLAUDE.md §Engineering conventions

- **Outcome:** CLAUDE.md §Engineering conventions contains the verbatim §Architectural-smell trigger paragraph as the third paragraph of that section, between **§Adversarial review gate** and **§Snapshot before refactor**.
- **Verification:**
  1. `grep -n "Architectural-smell trigger" CLAUDE.md` returns exactly one hit, in §Engineering conventions.
  2. Paragraph text matches the `5295364` insertion (recovered from `git show 31ebc51 -- CLAUDE.md` revert diff) byte-for-byte — verbatim from session-47 round-8 source.
  3. Paragraph position: appears between the line beginning `**Adversarial review gate (per slice).**` and the line beginning `**Snapshot before refactor.**`, separated by single blank lines on each side.
- **In scope:** The 4-sentence prose paragraph (rule + rationale + worked example) verbatim in CLAUDE.md §Engineering conventions.
- **Out of scope:**
  - Test-time enforcement (CI gate that fails PRs with ≥3 fix-up commits to the same file) — v3c carry-over per HANDOFF-47 L91.
  - Multi-agent persona suite v2 — separate slice `S-INFRA-persona-suite-v2-multi-agent` (v3b S-8 stretch).
  - Refactor of `.github/workflows/auto-review.yml` (extract parsing to `scripts/auto-review-parse.sh` with shellspec) — out of scope for this sibling; tracked as v3c carry-over candidate.
- **Opens blocked:** none.
- **Loveable check:** A future Claude session catches a forming round-3 patch loop because the rule lives next to the §Adversarial review gate where the conduct is already wired in. Yes — meets the floor.
- **Evidence at wrap:** verification.md AC-1 row + commit SHA of the CLAUDE.md edit.

---

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-04-28 | Author (session 48) | Draft | Single AC; rationale in §Pre-flight notes |
| | User | | AC frozen — implementation may begin |
| | Live auto-review (slice-reviewer persona) | | Fires on PR open |

**AC is the contract.** Change requests after freeze roll into re-drafting AC + re-slicing, not mid-slice scope shifts.
