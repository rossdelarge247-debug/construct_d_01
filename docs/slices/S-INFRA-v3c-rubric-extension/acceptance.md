# S-INFRA-v3c-rubric-extension — Acceptance criteria

**Slice:** S-INFRA-v3c-rubric-extension
**Spec ref:** `.claude/agents/slice-reviewer.md` criterion 2 (AC alignment — scope-creep); session-48 recursive-self-application dataset (3 rounds in 30min on doc-only PRs); SESSION-CONTEXT L94 + L105 + L179
**Phase(s):** Infra (rigour-pivot programme; v3c P0 carve-out — early lift from deferred v3c slice)
**Status:** Draft

---

## Context

Session 48 shipped the v3b persona suite (PR #30) and exercised it on three non-S-6 PRs: PR #32 (sibling slice), PR #33 (S-8 setup), PR #34 (v3c stub). Three rounds of live persona findings in ~30 minutes:

- **Round 1 (PR #33):** real scope-creep on the v3c stub commit `54b7c66` modifying a different slice's contract document. The gate worked correctly on its first non-S-6 invocation.
- **Round 2 (PR #33 post-revert):** persona-block on doc-only spec content. Likely rubric-mismatch on spec-design diff profile (no real scope-creep remained).
- **Round 3 (PR #34):** persona-block on deferred-slice scope-marker update. The slice (`S-INFRA-rigour-v3c-quality-and-rewrite`) carries `STATUS: deferred — full AC draft lands when this slice begins`, so no ACs were frozen against which to gate scope-creep — yet the rubric flagged it as undeclared scope (`architectural`).

Both rounds 2 and 3 were false positives from the rubric's perspective: criterion 2's "undeclared scope = `architectural`" rule applied to diff profiles where AC In-scope listings are not the right reference frame (specs precede ACs that reference them; deferred slices have no frozen ACs yet). Session-48 §Architectural-smell-trigger applied recursively → step back, record, do not patch round 4 → ship the rubric extension as a v3c carve-out before any further auto-review invocations.

**Three new exception categories** (from kickoff verbatim):
- (a) deferred-slice scope-marker update
- (b) spec-design content review
- (c) revert commits within an open PR

## Dependencies

- **Upstream:** v3b S-6 persona suite (PR #30) on main as of `792b73e`. Auto-review.yml LIVE; slice-reviewer.md in `.claude/hooks-checksums.txt` L18.
- **Open decisions required:** none — three categories scope-confirmed by user in session-49 turn-0 pre-flight Q2.
- **Re-use / Preserve-with-reskin paths touched:** `.claude/agents/slice-reviewer.md` (rubric file) + `.claude/hooks-checksums.txt` (re-baseline).
- **Discarded paths deleted at DoD:** none.

## Pre-flight notes

- **AC count.** Single AC. Single-concern: extend slice-reviewer.md criterion 2 with three new exceptions and demonstrate via §Example 3. Splitting into 3 ACs (one per exception) would manufacture surface for surface's sake — see CLAUDE.md §Coding conduct "Simplicity first" + §"Surgical changes". Sibling-slice precedent: `S-INFRA-arch-smell-trigger` shipped as 1 AC for a verbatim paragraph addition.
- **Adversarial review budget (per spec 72b).** acceptance.md `<300L`; persona file post-edit `<300L` (179L; under Option C threshold). Single review session per spec 72b §Use when. Live auto-review (slice-reviewer persona, AC-1 of v3b) fires on PR open — the rubric extension is expected to PASS on this very PR (a doc-only change to `.claude/agents/` + `.claude/hooks-checksums.txt` + `docs/slices/`; no `src/`).
- **Control-change label** required: `.claude/agents/slice-reviewer.md` is L199-protected (its SHA is in `.claude/hooks-checksums.txt`). PR will fail `control-change-label.yml` until the label is applied by an admin (per v3a AC-2 rollback procedure precedent and PR #30 + PR #32 + PR #33 + PR #34 path).
- **Hooks-checksums re-baseline** committed alongside the persona edit: `6242a9a2...` (new) replaces `2e8f3c7e...` (old) at L18 of the baseline file. Delta: 1 line. Per AC-2 hooks-checksums drift rule. (Intermediate SHA `2c4ef2e5...` was a transient between the initial rubric edit and the adversarial-review fix-up edits A1/B1/C1; final SHA recorded here.)
- **TDD exemption.** Doc-only addition; tdd-exemption-allowlist.txt entry not required (allowlist scopes `src/**.{ts,tsx}` only per AC-6 tdd-guard scope).
- **Hook expectations:** pre-commit-verify GREEN; tdd-first-every-commit skip-allow; tdd-guard skip-allow; pre-push-dod7 skip-allow; auto-review.yml fires on PR open and exercises the new exceptions on its own diff (recursive self-application — the persona file is reviewing a change to itself, mirroring session-47's S-6 9-round pattern but expected to converge in 1 round per the new exception (c) covering the spec-design + deferred-slice diff profile of this PR's slice docs).

## MLP framing

The loveable floor: a future PR opening with a doc-only diff (CLAUDE.md edit, spec content, deferred-slice scope-marker update, or in-PR revert commit) does not get false-positive `block` from the slice-reviewer persona. Session-48's three-round pattern does not repeat. The session-48 dataset (3 false-positive rounds) is preserved in the §Context above as the regression baseline; v3c retain/drop measurement at S-F1 onwards uses both the session-47 9-round single-agent baseline and this session-48 false-positive dataset as input.

---

## AC-1 · slice-reviewer.md criterion 2 §Exceptions extended with three new categories + §Example 3 deferred-slice case

- **Outcome:** `.claude/agents/slice-reviewer.md` criterion 2 contains four numbered exception sub-clauses (a) Incidental scaffolding [unchanged in substance, restructured from prose] (b) Deferred-slice scope-marker update (c) Spec-design content (d) Revert commits within the same open PR. §Example invocations contains a new Example 3 demonstrating exception (b) on a synthetic deferred-slice diff modelled on PR #34. Hooks-checksums.txt is re-baselined.
- **Verification:**
  1. `grep -nc "Deferred-slice scope-marker update" .claude/agents/slice-reviewer.md` returns `1` (in criterion 2 sub-clause b).
  2. `grep -nc "Spec-design content" .claude/agents/slice-reviewer.md` returns `1` (in criterion 2 sub-clause c).
  3. `grep -nc "Revert commits within the same open PR" .claude/agents/slice-reviewer.md` returns `1` (in criterion 2 sub-clause d).
  4. `grep -nc "Example 3 — deferred-slice scope-marker update" .claude/agents/slice-reviewer.md` returns `1`.
  5. `grep -E "^\s+a\. " .claude/agents/slice-reviewer.md | head -1` returns the Incidental-scaffolding line, confirming the existing exception is preserved as sub-clause (a).
  6. `bash scripts/hooks-checksums.sh --verify` exits 0 (clean baseline; 20 entries; new SHA `6242a9a25e8bb40e32bc52ab0425d9f243d7825f6b7bb1e886afcee86d64d990` for `.claude/agents/slice-reviewer.md`).
  7. Persona file `wc -l` ≤300 (Option C threshold): post-edit 179L.
- **In scope:**
  - Restructure criterion 2's existing single `**Exception:**` line into a numbered list of four sub-clauses (a/b/c/d).
  - Three new exception sub-clauses with rationale + carry-over reference (session-48 PR #33/#34 false-positive dataset).
  - One new §Example 3 (synthetic diff modelled on PR #34's deferred-slice scope-marker update; expected `approve`).
  - Renumber the prior §Example 3 (security finding) to §Example 4.
  - Re-baseline `.claude/hooks-checksums.txt` (slice-reviewer.md SHA changes).
  - Slice docs (this file + `verification.md`).
- **Out of scope:**
  - New finding categories in the JSON output schema's `category` enum (the three exceptions refine when scope-creep should NOT fire; they don't add new finding types).
  - Modifications to the other personas (`acceptance-gate.md`, `ux-polish-reviewer.md`) — their rubrics don't currently exhibit the same false-positive pattern; defer until S-F1 measurement.
  - Spec 72c §4 specialist-persona partition cross-ref synchronised edit — when multi-agent v2 specialist files (`reviewer-coding-conduct.md`, `reviewer-simplicity.md`) are written under spec 72c §4 they must inherit the criterion 2 §Exceptions sub-clauses (a-d) from this rubric. **Spec 72c §4 itself does not currently cite slice-reviewer.md as the source-of-truth for these exceptions** — adding that cross-ref is deferred to the v3c quality-and-rewrite slice (which lands the multi-agent v2 impl) per session-48 §Architectural-smell-trigger lesson "build-then-measure → cheaper than measure-then-build." Surfaced by adversarial review §Concern F (finding F1, logic-severity, deferred with reasoning).
  - Verdict-coercion fixture / Stryker mutation testing on personas — v3c carry-overs per spec 72c §9.
  - CLAUDE.md §"Hard controls (in development)" rewrite to consolidate this exception list — v3c full slice scope.
- **Opens blocked:** none.
- **Loveable check:** A future doc-only / deferred-slice / spec-design / revert-commit PR opens; auto-review fires once; verdict `approve` or `nit-only`. Session-48's 3-round false-positive pattern does not recur. Yes — meets the floor.
- **Evidence at wrap:** `verification.md` AC-1 row + commit SHA of the slice-reviewer.md edit + hooks-checksums.txt re-baseline + control-change label applied confirmation.

---

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-04-28 | Author (session 49) | Draft | Single AC; three exception categories scope-confirmed at session-49 turn-0 pre-flight Q2 (verbatim per kickoff). |
| | User | | AC frozen — implementation may begin |
| | Live auto-review (slice-reviewer persona) | | Fires on PR open; **recursive self-application** — the persona reviews its own rubric extension. Expected verdict: `approve` or `nit-only` (the new exceptions cover this PR's own diff profile: deferred-slice-adjacent + spec-design-adjacent + control-plane re-baseline). |

**AC is the contract.** Change requests after freeze roll into re-drafting AC + re-slicing, not mid-slice scope shifts.
