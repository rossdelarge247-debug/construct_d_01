# S-INFRA-rigour-v3c-prior-art-amendments-structural — Acceptance criteria

**Slice:** S-INFRA-rigour-v3c-prior-art-amendments-structural
**Spec ref:** session-49 prior-art audit (`docs/HANDOFF-SESSION-49.md` §"Prior-art audit"); deferral declared in `docs/slices/S-INFRA-rigour-v3c-prior-art-amendments-easy/acceptance.md` L109-117 §"Out of scope (P0b-structural — separate slice)"
**Phase(s):** Infra (rigour-pivot programme; v3c structural-simplification)
**Status:** Draft (session 53)

---

## Background

Session-49 prior-art audit (`docs/HANDOFF-SESSION-49.md` L27 verbatim): *"Top 3 simplifications suggested: (H+G) replace hooks-checksums + pre-commit-verify with CODEOWNERS + branch-protection (the audit verdict: we're re-implementing CODEOWNERS); (G) deprecate slice-DoD pre-commit-verify — pre-commit is wrong layer for completeness checks (CI is); (B) reframe arch-smell as prompt rule, not gate — round-counting incentivises gaming."*

The "easy" sibling slice (`S-INFRA-rigour-v3c-prior-art-amendments-easy`, PR #38, merged) shipped 4 citation ACs and explicitly carried these 3 simplifications to a structural slice (per its L111: *"Three simplifications carried to a future slice (`S-INFRA-rigour-v3c-prior-art-amendments-structural`)"*) because each requires explicit design + rollback procedure that doesn't fit a citation-style slice.

This slice ships those three structural simplifications. Net effect: 3 controls collapse to 1 (CODEOWNERS); 1 pre-commit hook removed; 1 numeric-gate replaced with judgement prompt. Rigour-suite surface area shrinks; coverage does not regress (CODEOWNERS + branch-protection is the industry-standard pattern that `hooks-checksums.txt` + `control-change-label.yml` were re-implementing).

## Dependencies

- **Upstream:** PR #38 (`S-INFRA-rigour-v3c-prior-art-amendments-easy`) merged. Required because the deferral-declaration that scopes this slice lives in PR #38's `acceptance.md` L109-117.
- **Status at slice draft (session 53, 4ad8f9f):** Working tree clean; branch `claude/S-INFRA-rigour-v3c-prior-art-amendments-structural` cut fresh from `origin/main` @ `4ad8f9f`.
- **Open decisions required:** none — six P0b-structural design decisions resolved in session-53 conversation (recommendations + rationale shared by author; user accepted all).
- **Re-use / Preserve-with-reskin paths touched:** `CLAUDE.md` (L199 "Hard controls" table edits + §"Engineering conventions" §"Architectural-smell trigger" rewrite); `.claude/hooks/session-start.sh` (remove §"Hooks-checksums drift warning" block); `.claude/settings.json` (remove pre-commit-verify hook registration).
- **Discarded paths deleted at DoD:** `.claude/hooks-checksums.txt`, `scripts/hooks-checksums.sh`, `.github/workflows/control-change-label.yml`, `.claude/hooks/pre-commit-verify.sh`.
- **Created paths:** `.github/CODEOWNERS`, `docs/slices/S-INFRA-rigour-v3c-prior-art-amendments-structural/{acceptance,verification,security}.md`.

## Pre-flight notes

- **Slice size pre-flight.** Estimated ~350L diff (CODEOWNERS create +15L; hooks-checksums.txt remove −19L; hooks-checksums.sh remove ~−50L; control-change-label.yml remove ~−80L; session-start.sh edit −30L; CLAUDE.md edits net ~−50L; pre-commit-verify.sh remove ~−50L; settings.json edit −3L; arch-smell rewrite +5L net; verification.md + security.md additions +100L). Below the 300L per-file adversarial-review threshold; single-PR shippable.
- **TDD-applicable surface.** None — this slice is pure config/control-plane removal. No new logic. CODEOWNERS is declarative; hook removal is deletion. Add slice path to `docs/tdd-exemption-allowlist.txt` under `pure-config:.claude/**` + `pure-config:.github/CODEOWNERS` + `pure-config:scripts/**` (deletions) at impl time.
- **Spec 72b adversarial review budget.** `acceptance.md` <300L; single-spawn Option C inline-content per spec 72b §"Use when". Expected verdict: `request-changes` likely on first pass (control-plane changes attract scrutiny); convergence in ≤2 rounds per CLAUDE.md §"Engineering conventions" §"Architectural-smell trigger" (this slice's own AC-3 rewrite of that rule applies prospectively to itself).
- **Control-change label REQUIRED.** Touches `.claude/hooks/**`, `.claude/settings.json`, `scripts/**`, `.github/workflows/**` — all in current L199 protected-paths regex. PR will need `control-change` label applied (admin-restricted). The slice itself simplifies the control-change machinery; the LAST PR to honour the legacy `control-change-label.yml` workflow.
- **Branch-protection prerequisite (one-time user action).** AC-1 verification depends on `require_code_owner_reviews: true` being enabled on `main`. User runs `gh api -X PATCH ... required_pull_request_reviews.require_code_owner_reviews=true` once before AC-1 verification can pass. Documented in `verification.md` §Pre-flight setup.
- **Architectural-smell awareness** (CLAUDE.md §Engineering conventions, current rule). The CODEOWNERS migration touches multiple files atomically; if adversarial review surfaces clustered findings on `.github/CODEOWNERS` itself, that's signal the path-list scope is wrong (not that the rule is wrong). Pre-empted: AC-1 explicitly enumerates the union-of-both-existing-lists scope per session-53 Q-A2 decision.

## MLP framing

The loveable floor: a future Claude session opens a PR touching `.claude/hooks/session-start.sh`; GitHub's UI shows "Code owner review required from @rossdelarge247-debug" before the merge button activates. No two-checksums-files to keep in sync; no separate `control-change` label workflow to administer; no pre-commit hook firing multi-second `verify-slice.sh` on every WIP commit. The rigour suite gets out of the way until it has something to say.

Cuts happen by re-scoping CODEOWNERS path list smaller (e.g. drop `eslint.config.mjs` from required-review if false-positive rate is high). AC-3's arch-smell rewrite is the smallest change; AC-2 (pre-commit-verify drop) is the simplest; AC-1 (CODEOWNERS migration) is the load-bearing one.

---

## AC-1 · CODEOWNERS migration (audit H+G)

- **Outcome:** A single `.github/CODEOWNERS` file replaces three current controls (`.claude/hooks-checksums.txt` + `scripts/hooks-checksums.sh` + `.github/workflows/control-change-label.yml` + session-start.sh §Hooks-checksums drift warning block). GitHub's branch-protection enforces code-owner review on the union-of-both-existing-lists protected-path scope. Editing protected paths without `@rossdelarge247-debug` review blocks merge.
- **Verification:**
  1. `.github/CODEOWNERS` exists; content per Q-A2 decision (union of L199 regex paths + `hooks-checksums.txt` paths; owner `@rossdelarge247-debug`).
  2. `gh api repos/rossdelarge247-debug/construct_d_01/branches/main/protection --jq '.required_pull_request_reviews.require_code_owner_reviews'` returns `true`. (User enables this setting once via `gh api -X PATCH` per `verification.md` §Pre-flight setup.)
  3. Test PR (synthetic; can be the next session's wrap PR) touching a protected path WITHOUT review attached: GitHub UI shows "Code owner review required" in the Reviewers panel. **Solo-operator caveat:** since user is the sole code-owner AND the PR author (commits made AS user via the agent harness), GitHub's "PR author cannot approve own PR" hard rule means merge requires a conscious admin-bypass click ("Merge without waiting for required review"). The admin-bypass-per-merge IS the rigour gate in solo context — preserves the legacy `control-change` label's "conscious act required" property; does NOT preserve the "different reviewer" property (unrecoverable in solo). Auto-review.yml + slice-reviewer persona is the substantive review gate. See `security.md` item 10 for full caveat.
  4. `.claude/hooks-checksums.txt`, `scripts/hooks-checksums.sh`, `.github/workflows/control-change-label.yml` files removed; `git ls-files` shows none of them.
  5. `.claude/hooks/session-start.sh` no longer emits the §"Hooks-checksums drift warning" section in its turn-0 output (verified by running the hook locally + diff vs current output).
  6. `CLAUDE.md` §"Hard controls (in development)" table: rows "Hooks-checksums drift warning" + "Control-change label requirement" removed; replacement single row "CODEOWNERS code-owner review" added with file ref `.github/CODEOWNERS` + bypass "edit CODEOWNERS path scope under owner-review (self-protected)".
- **In scope:** `.github/CODEOWNERS` create; 4 file removals; 1 hook-script edit (session-start.sh §Hooks-checksums block); CLAUDE.md table edit; rollback procedure documented in `verification.md` §Rollback.
- **Out of scope:**
  - Branch-protection `require_pull_request_reviews` setting itself (already on; only the `require_code_owner_reviews` sub-flag is the new dependency).
  - Migration of any per-hook intent or rationale notes from `hooks-checksums.txt` (none exist; file is bare SHA-256 list).
  - Per-file ownership granularity (e.g. specific scripts under different owners) — single owner suffices per Q-A1.
- **Opens blocked:** none (Q-A1 through Q-A4 resolved in session-53 conversation).
- **Loveable check:** PR-author opens a PR touching `.claude/hooks/session-start.sh`; GitHub's "Reviewers" panel shows "@rossdelarge247-debug — required (code owner)"; merge button disabled until reviewed. No checksums to re-baseline; no label to apply. Yes — meets the floor.
- **Evidence at wrap:** `verification.md` AC-1 row + commit SHA + screenshot (or `gh api` JSON) of branch-protection settings + test PR demonstrating CODEOWNERS gate.
- **Rollback procedure:** `git revert <merge-sha>` restores the four removed files + edits; user runs `gh api -X PATCH ... required_pull_request_reviews.require_code_owner_reviews=false` to disable the new gate. Both steps documented in `verification.md` §Rollback.

## AC-2 · pre-commit-verify deprecation (audit G)

- **Outcome:** `.claude/hooks/pre-commit-verify.sh` is removed; its hook registration in `.claude/settings.json` is removed; CI (`.github/workflows/pr-dod.yml`) remains the sole DoD-completeness gate. Industry-standard pre-commit-for-fast-checks-only pattern (audit recommendation).
- **Verification:**
  1. `.claude/hooks/pre-commit-verify.sh` removed; `git ls-files` shows none.
  2. `.claude/settings.json` no longer contains a `PreToolUse` hook entry pattern-matching `git commit` that invokes `pre-commit-verify.sh` (verified by `jq` query on the file).
  3. `.github/workflows/pr-dod.yml` unchanged — remains the canonical DoD gate (slice-verification-md PR-body reference + 6-item DoD checklist + 13-item security checklist via PR template).
  4. `CLAUDE.md` §"Hard controls (in development)" table: row "Slice-DoD pre-commit" removed; replacement note in §"Hard controls" prose: *"Slice-DoD enforcement is CI-only via `.github/workflows/pr-dod.yml`; no pre-commit hook gates DoD."*
  5. `git commit` on a protected-path edit no longer fires the hook (verified by attempting a commit + observing no hook output).
- **In scope:** hook script removal; settings.json edit; CLAUDE.md table edit; rollback procedure documented in `verification.md` §Rollback.
- **Out of scope:**
  - `.claude/hooks/tdd-first-every-commit.sh` deprecation — separate hook with separate logic (TDD-ordering vs DoD-completeness); the audit didn't call it out. Flagged as a follow-on question for a future slice.
  - `.claude/hooks/pre-push-dod7.sh` — distinct hook (DoD-7 temporal ordering at push time, not commit time); out of scope for this slice.
  - `verify-slice.sh` itself — still invoked by CI via `pr-dod.yml`; not removed.
- **Opens blocked:** none.
- **Loveable check:** PR-author commits a WIP slice; no multi-second pre-commit-verify hook fires. CI catches DoD failures at PR-open time; auto-review picks up structural issues post-push. Fast local commits; authoritative CI. Yes.
- **Evidence at wrap:** `verification.md` AC-2 row + commit SHA + before/after `git commit` output showing hook absence.
- **Rollback procedure:** `git revert <merge-sha>` restores the hook + settings registration. Documented in `verification.md` §Rollback.

## AC-3 · arch-smell trigger reframe (audit B)

- **Outcome:** `CLAUDE.md` §"Engineering conventions" §"Architectural-smell trigger" rewritten from numeric round-count rule (≥3 rounds = trigger) to qualitative judgement prompt (clustered findings = consideration). Cunningham/Fowler-aligned: smell is judgement, not metric. No more round-counting incentive to game.
- **Verification:**
  1. `CLAUDE.md` §"Architectural-smell trigger" no longer contains the literal string "≥3 rounds" or any numeric round-count rule.
  2. Replacement text contains the literal frame: *"clustered findings in a single file ... reviewer's judgement is the gate ... patches feel like interest payment rather than principal"*.
  3. v3b S-6 worked example (auto-review.yml 6-round case) preserved as illustrative narrative — the example still teaches the pattern; the rule itself stops measuring rounds.
  4. No other CLAUDE.md sections reference the old round-count rule (grep `≥3 rounds` returns no matches outside historical handoffs).
  5. Persona files (`.claude/agents/slice-reviewer.md` + others) reference the rule via CLAUDE.md ref only — no embedded copy of the round-count text exists in any persona file (verified by grep). Rewrite of CLAUDE.md propagates transitively.
- **In scope:** single CLAUDE.md §"Architectural-smell trigger" paragraph rewrite (~50L → ~35L). No persona-file edits.
- **Out of scope:**
  - Embedding the new judgement frame directly into specialist personas — deferred to S-8 design conversation (Q4 shared-vs-duplicated content; Q5 dimension boundaries).
  - Updating `docs/slices/S-INFRA-arch-smell-trigger/{acceptance,verification}.md` historical slice docs — per CLAUDE.md §"Surgical changes" forward-only-rename pattern (precedent: PR #38 AC-3 rename §"Forward-only rename").
  - Soft-launch / two-text-versions-side-by-side approaches — full replacement is the simplification.
- **Opens blocked:** none (Q-C1 + Q-C2 resolved in session-53 conversation).
- **Loveable check:** A future reviewer reading the section sees a judgement prompt, not a counter. Won't reach for "let me delay the 3rd round to avoid triggering arch-smell." Cunningham/Fowler-aligned. Yes.
- **Evidence at wrap:** `verification.md` AC-3 row + commit SHA + diff of CLAUDE.md §"Architectural-smell trigger" before/after.
- **Rollback procedure:** `git revert <merge-sha>` restores the round-count rule. Documented in `verification.md` §Rollback.

---

## Out of scope (carried to future slices)

- **`tdd-first-every-commit.sh` deprecation question** — same shape as AC-2 (pre-commit hook gating workflow ordering rather than DoD completeness). Audit didn't explicitly call it out; same logic could apply. Future slice or follow-on question.
- **Specialist-persona embedding of the new arch-smell frame (AC-3)** — part of S-8 design (Q4/Q5).
- **Per-file CODEOWNERS granularity** — if false-positive rate from blanket `scripts/**` or `.github/workflows/**` ownership is high after 3-5 PRs, narrow the path list. Measurement-driven; not prospective.
- **CODEOWNERS team-line migration** — if/when collaborators join. Single-line edit when the time comes.

## References

- Session-49 prior-art audit: `docs/HANDOFF-SESSION-49.md` §"Prior-art audit" (audit findings) + L27 (top-3 simplifications verbatim)
- Audit deferral declaration: `docs/slices/S-INFRA-rigour-v3c-prior-art-amendments-easy/acceptance.md` L109-117 §"Out of scope (P0b-structural — separate slice)"
- Reading list (spec 72c §10): shipped via PR #37 (commit `79014a3`)
- Six P0b-structural design decisions: session-53 conversation (Q-A1 owner = `@rossdelarge247-debug`; Q-A2 paths = union; Q-A3 decommission = full; Q-A4 branch-protection = in-AC; AC-2 = α drop; Q-C1 = full rewrite; Q-C2 = CLAUDE.md only)
- Current L199 protected-paths regex: `.github/workflows/control-change-label.yml` line 51
- Current hooks-checksums baseline: `.claude/hooks-checksums.txt` (19 entries)
- Adversarial review budget: `docs/workspace-spec/72b-adversarial-review-budget.md` §"Use when" (Option C inline-content single-spawn — `acceptance.md` <300L)
- Sibling-slice precedent (citation-style — easier shape): PR #38 `S-INFRA-rigour-v3c-prior-art-amendments-easy/{acceptance,verification}.md`
- CLAUDE.md §"Engineering conventions" §"Architectural-smell trigger" (current text — to be rewritten in AC-3)
- CLAUDE.md §"Hard controls (in development)" table (current state — rows to be removed in AC-1 + AC-2)

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-04-29 | Author (session 53) | Draft | 3 ACs per six session-53 design decisions. AC-1 load-bearing (CODEOWNERS migration); AC-2 + AC-3 smaller cleanup. ~350L diff estimate; single-PR shippable; control-change label required. |
| | User | | AC frozen — implementation may begin |
| | Live auto-review (slice-reviewer persona) | | Forward-pending PR open |

**AC is the contract.** Change requests after freeze roll into re-drafting AC + re-slicing.
