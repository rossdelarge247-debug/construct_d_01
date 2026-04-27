# v3b S-1 — Audit findings (carry-over #10 prerequisite)

**Audit date:** 2026-04-27
**Audit branch base:** `claude/audit-v3b-pr24-merge-YUwug` @ `54ce4ec` (= `origin/claude/S-INFRA-rigour-v3a-foundation` @ `54ce4ec`; PR #24 head)
**Audit driver:** `acceptance.md` carry-over item #10 ("AUDIT PREREQUISITE — re-read prior parked-candidates before drafting v3b's full AC table"). One-time exception to "don't proactively read TIER-4 archive" per CLAUDE.md Information tiers.
**Output convention:** one row per source item — `source-path:line | concept | verdict | rationale`. Verdicts: **include** / **collapse-into-{N|letter}** / **drop**.

---

## 1 · Existing v3b carry-over items 1–10

Already inventoried in `acceptance.md` L20–68. Verdicts decide which become v3b ACs.

| # | Source | Concept | Verdict | Rationale |
|---|---|---|---|---|
| 1 | `acceptance.md:22` | Flip plan-review subagent default-spawn (cost/latency measurement) | **include** | Discrete deferred lever from v3a S-37-6; AC-shape is "measure → flip default → record decision". |
| 2 | `acceptance.md:23-26` | Three L199 protected-path omissions (`git-state-verifier.sh`, `eslint-no-disable.sh`, `eslint-baseline-allowlist.txt`) | **include** | Tactical fix; small surface; AC-shape is "amend L199 + path-filter + checksums baseline contains all three". |
| 3 | `acceptance.md:27` | `line-count.sh` session-base re-baseline on branch-resume | **include** | Live-surfaced bug; needs meta-test + fix; collapses HANDOFF-30 hook-calibration items (see §3 below). |
| 4 | `acceptance.md:28` | AC-6 lcov parser ships without shellspec meta-test | **include** | Test gap explicitly elevated by v3a reviewer; v3b adds shellspec fixture (fake-git-history + lcov.info). |
| 5 | `acceptance.md:29` | `@vitest/coverage-v8` dev-dep + `ci.yml --coverage` wiring | **include** | Activation step; without this, AC-6 is dormant. AC-shape is "first v3b commit installs + wires + verifies coverage signal in CI". |
| 6 | `acceptance.md:30` | F6 ".sh ≥ 80% line via shellspec" via kcov | **drop** | Self-deferred to v3c per item text ("v3c may pull in kcov as part of broader tooling rationalisation"). Out of v3b scope. |
| 7 | `acceptance.md:31` | Pre-push gate for DoD-7 temporal ordering | **include** | Live-surfaced procedural gap from v3a session 40; would have caught the S-38-2 RED → S-38-1 GREEN <5min push; squarely an adversarial-subagent-suite gate. |
| 8 | `acceptance.md:32` | Adversarial-review-gate budget convention (DoD-3 single-turn structural infeasibility) | **include** | Process AC; v3b drafts the multi-turn budget envelope or partition convention so DoD-3 is achievable on slices >300 lines authoritative source. |
| 9 | `acceptance.md:34` | Auto-`/review`-on-PR-open as CI status check (real code-quality gate) | **include** | Lands **on top of** the slice-reviewer persona (item B); item B = canonical persona file, item 9 = the workflow that runs it. Both ship. |
| 10 | `acceptance.md:36-68` | AUDIT PREREQUISITE meta-item | **N/A** | This document satisfies it. Resolves on commit. |

## 2 · v3b carry-over #10 named items A–G

Already enumerated at `acceptance.md` L40–52 with source refs to `HANDOFF-SESSION-31.md` § 7 and `engineering-phase-candidates.md` § E + L166 + L169.

| Letter | Source | Concept | Verdict | Rationale |
|---|---|---|---|---|
| A | `HANDOFF-SESSION-31.md:92` (§ 7) | `tdd-guard` PreToolUse hook — gates **behaviour** (test passes), not paperwork | **include** | Strength delta over v3a's discipline-only AC-5 (`tdd-first-every-commit.sh`) is the load-bearing reason carry-over #10 was triggered. Both ship — AC-5 stays (paperwork floor), tdd-guard adds (behaviour gate). |
| B | `engineering-phase-candidates.md:126` (§ E) | `.claude/agents/slice-reviewer.md` adversarial pre-commit persona | **include** | Canonicalised persona file, version-controlled, not subject to ad-hoc prompt drift. Carry-over #9 lands on top of it (workflow runs persona). |
| C | `engineering-phase-candidates.md:127` (§ E) | `.claude/agents/acceptance-gate.md` evidence-judging persona | **include** | Distinct from `verify-slice.sh` — that does file-presence + tooling-runs; this judges whether evidence text actually supports AC claim. Absorbs Loveable-check + AC quantity guidance (see §3). |
| D | `engineering-phase-candidates.md:128` (§ E) | `.claude/agents/ux-polish-reviewer.md` micro-interaction / a11y persona | **include** | Load-bearing for src/ slices from S-F1 onwards. Ships dormant at v3b (no UI surface in infra slice), but committed so first src/ slice can invoke it without a setup turn. AC-shape = "persona file + invocation convention documented; dormant until first src/ slice". |
| E | `engineering-phase-candidates.md:169` (§ G·8) | TDD bail-out criteria documented as rubric | **include** | v3a AC-5 ships allowlist *mechanism* without *criteria*; criteria gap means allowlist accumulates ad-hoc. v3b lands rubric — location TBD by drafter (header of `tdd-exemption-allowlist.txt`, CLAUDE.md "Hard controls" stub, or both). |
| F | `engineering-phase-candidates.md:166` (§ G·5) | Preview-deploy verification checklist (golden path / edge cases / `prefers-reduced-motion` / keyboard-only / mobile viewport / screen-reader) + per-slice recording location | **include** | DoD item 4 names "verified in-browser" without a rubric; without the checklist, "verified" means whatever the engineer felt like checking. Pairs with persona D for src/ slices. AC-shape = "rubric + recording location (lean: `verification.md` § Preview-deploy)". |
| G | `engineering-phase-candidates.md:132` (§ E) | `.claude/agents/` vs `.claude/subagent-prompts/` location reconciliation | **include** | v3a used `.claude/subagent-prompts/exit-plan-review.md` — close but inconsistent with original §E convention. v3b reconciles: either move existing prompt(s) under `.claude/agents/` or formalise the distinction (hook-spawned templates vs review personas). Drafter decides; either resolution is acceptable. |

## 3 · New items found in source audit

Items NOT already in §1 or §2 inventory.

| Source | Concept | Verdict | Rationale |
|---|---|---|---|
| `engineering-phase-candidates.md:86` (§ C) | "Loveable check" mandatory field per AC | **collapse-into-C** | Acceptance-gate persona (item C) judges per-AC evidence; verifying the AC has a Loveable-check field is the same shape of judgment. Avoids a separate gate. |
| `engineering-phase-candidates.md:89` (§ C) | AC quantity guidance (min 3, ideal 5–7, >10 = re-slice) | **collapse-into-C** | Same reasoning — acceptance-gate persona verifies as part of slice-shape judgment. Cheaper than a `verify-slice.sh` extension. |
| `engineering-phase-candidates.md:130` (§ E) | Subagent retain/drop metric ("catches at least one issue per 2-3 slices, retain") | **include** | Meta-AC for the personas being introduced. Without it, personas accumulate without retention discipline; same drift risk that caused this audit in the first place. AC-shape = "after first 3 src/ slices (S-F1 onwards), record per-persona issue-catch count + retain/drop decision in slice handoff". |
| `engineering-phase-candidates.md:167` (§ G·6) | AC doc reviewer policy (user every slice vs first 3-5) | **drop** | Phase C kickoff open question; user-vs-subagent reviewer is a policy decision, not an adversarial-subagent gate. Out of v3b scope; carry on engineering-phase-candidates §G for Phase C kickoff. |
| `engineering-phase-candidates.md:168` (§ G·7) | Definition of "adjacent slices" for DoD regression check | **drop** | Open question; relates to DoD enforcement and slice dependency graph (spec 70), not adversarial-subagent gates. Out of v3b scope. Defer to spec 70 / DoD spec authoring. |
| `HANDOFF-SESSION-32.md:82` (§ candidates #9) | Vitest version-quirk catalog entry | **drop** | Infra-docs item; not an adversarial-subagent gate. Carry on engineering-phase-candidates §G as a tracked candidate. |
| `HANDOFF-SESSION-32.md:83` (§ candidates #10) | Lockfile policy clarification | **drop** | Settled by session-32 commit `4ee5334` (tracked) + session-33 user confirmation. No open work. |
| `HANDOFF-SESSION-32.md:84` (§ candidates #11) | Compile-time-RED documentation pattern | **drop** | Doc-convention item (test-plan + verification text), not a gate. Worth a CLAUDE.md "Engineering conventions" addition once a second occurrence confirms. Out of v3b scope. |
| `HANDOFF-SESSION-32.md:52` (§ improve) | `pnpm install` session-start verify | **drop** | Session-orientation item, candidate for `.claude/hooks/session-start.sh` extension. Not adversarial-subagent. Carry on engineering-phase-candidates §G. |
| `HANDOFF-SESSION-32.md:56` (§ improve) | `verification.md` "consumer-smoke" pattern for non-UI slices | **drop** | Template-variant item (slice-doc template, not gate). Belongs in spec 71/72 update or v3c. Out of v3b scope. |
| `HANDOFF-SESSION-30.md:153` (§ candidates #4) | Boolean-wrapper assertion idiom for file-content tests | **drop** | Test-craft helper module (`tests/helpers/source-assertions.ts`); not a gate. Out of v3b scope. |
| `HANDOFF-SESSION-30.md:66`, `:108` (§ improve, calibration) | `line-count.sh` Edit-vs-net interpretation refinement (parked candidate #5) | **collapse-into-3** | Same hook cluster as carry-over #3 (re-baseline bug). Calibration data is upstream of the fix; merge into one AC for the hook's session-base + delta accounting. |
| `HANDOFF-SESSION-32.md:88` (carry-forward AUX-3) | PWR drift check (HANDOFF-31 origin) | **drop** | UI/component-spec drift, not adversarial-subagent. Out of v3b scope; carry on session retros until first PWR-touching slice. |
| `docs/v2/v2-backlog.md` (grep results) | Items mentioning review/test/hook/agent | **drop** | All matches are UX/product-feature items (review modals, document storage, product test suite) — none in v3b adversarial-subagent scope. No collisions. |

## 4 · Explicit rejections preserved (§F)

Source: `engineering-phase-candidates.md:136-156` (§ F. Rejected — do NOT adopt).

These are documented rejections with stated reasoning. **Flagged here so v3b drafting does NOT accidentally re-introduce them.** Each remains rejected unless evidence changes.

1. **4-phase-per-feature ritual** (Research → Plan → Implement → Validate `.md` per slice) — duplicates spec 70 + slice setup; file sprawl.
2. **"4-Agent Architecture" labelling** (Human Brain / Architect / Executor / Validator) — post-hoc pattern-naming; ritual without enforcement. (Note: §E sub-agent personas A-D-G in §2 above are distinct — those are *prompt files with mechanical enforcement*, not labels.)
3. **Mandatory `plan.md` at repo root** — duplicates `docs/SESSION-CONTEXT.md`.
4. **60% context cap with mid-session clear-and-restart** — breaks our session-continuity model; the 1500/2000-line discipline + `/wrap` is the right shape for our work.
5. **Backlog/project MCP tools** (mcpmarket product-backlog-manager etc.) — spec 70 slice index already serves this role inspectably.
6. **`/snapshot` as a distinct concept from `git`** — `git commit` already is a snapshot; engineering-conventions "snapshot before refactor" rule already captures the discipline.

## 5 · Final v3b AC inclusion list (drafter's input)

The v3b AC table is drafted top-down from this list, NOT bottom-up from carry-over 1–9. Order below is loose grouping, not implementation order.

**A. Subagent personas (canonical prompt files at `.claude/agents/*.md`)**
1. `slice-reviewer.md` (= item B) + workflow that runs it (= carry-over #9 — auto-`/review`-on-PR-open CI status check)
2. `acceptance-gate.md` (= item C; absorbs Loveable-check + AC quantity guidance from §3)
3. `ux-polish-reviewer.md` (= item D; ships dormant at v3b, invocation convention documented)
4. Persona retain/drop metric (= §3 row 3; meta-AC over personas 1-3)
5. `.claude/agents/` vs `.claude/subagent-prompts/` reconciliation (= item G)

**B. Hook-level gates (PreToolUse / pre-push)**
6. `tdd-guard` PreToolUse on Write/Edit to src/ (= item A; gates behaviour, complements v3a's discipline-only AC-5)
7. Pre-push gate for DoD-7 temporal ordering (= carry-over #7)

**C. Doc / convention gates**
8. TDD bail-out criteria as documented rubric (= item E)
9. Preview-deploy verification checklist + per-slice recording location (= item F)
10. Adversarial-review-gate budget convention (= carry-over #8; multi-turn envelope OR partition convention)

**D. Tactical infra (small surface, must-ship)**
11. AC-2 protected-path scope amendment for three L199 omissions (= v3a-side carry-over item #2; not the v3b AC-2 numbered above)
12. `line-count.sh` session-base re-baseline on branch-resume + meta-test (= carry-over #3, absorbs HANDOFF-30 hook-calibration cluster)
13. AC-6 lcov parser shellspec meta-test (= carry-over #4)
14. `@vitest/coverage-v8` dev-dep + `ci.yml --coverage` wiring (= carry-over #5; first v3b commit)

**E. Process levers**
15. Plan-review subagent default-spawn flip after cost/latency measurement (= carry-over #1)

**Total INCLUDE: 15 ACs.** Session-36's "~1500 lines" budget magnitude estimate is plausible for this composition; reviewer should re-validate at AC-table freeze.

## 6 · Drafting protocol confirmation

Per `acceptance.md:62-66`:

1. ✅ Audit complete — this file.
2. ✅ v3b AC table re-drafted top-down from §5 above (acceptance.md @ session 41 commit `517a91b`).
3. **Next:** run `/security-review` and `/review` against the re-drafted `acceptance.md` BEFORE any RED-tests-first impl. (Deferred to session 42 P0 per session-41 wrap.)
4. ✅ This file committed as part of v3b's S-1 commit (`517a91b`); preserved as audit trail.

## 7 · Audit completeness verification (gap-closure pass)

After the initial S-1 audit was committed, the user (correctly) pushed back: "have we reviewed the previous session logs and identified all the thinking that had been lost and brought it back into our planning that had been flagged as being missed before?" Honest answer at the time: no — three audit surfaces had been grep-filtered or skipped entirely. Gap-closure pass executed in same session.

| Source | Initial audit | Gap-closure pass | New items found |
|---|---|---|---|
| `HANDOFF-SESSION-30.md` (195L) | grep-filtered only | full read | **None.** All 5 HANDOFF-29 parked candidates accounted for in HANDOFF-31 status table (lifted / closed / deferred-into-AC-12 cluster). All §"What could improve" + §"Key decisions" + §"Bugs" items are slice-specific, calibration-data (collapses-into-AC-12), or already in CLAUDE.md Planning conduct (verify-before-planning, distrust-own-summaries). |
| `HANDOFF-SESSION-31.md` (113L) | §7 only (item A) | full read | **None.** Candidate #7 = item (A) tdd-guard hook (already inventoried). Candidates #1-#6 all lifted/closed per status table at L77-89. §"What could improve" #1-#4 = TDD-vs-regression-harness honesty (lifted as CLAUDE.md "Don't write file-content assertions for logic slices") · A17 boundary failure mode (niche, not subagent scope) · line-count.sh cluster (= AC-12) · wrap-side count error (= Distrust-own-summaries already in CLAUDE.md). |
| `engineering-phase-candidates.md` §A + §B (L1-71) | unread | full read | **None.** §A "Coding conduct" (Think before coding · Simplicity first · Surgical changes · Goal-driven execution) verified present in CLAUDE.md "Coding conduct" section + 3 additions (Names carry the design · Small single-purpose functions · Effects behind interfaces from session 32). §B "Engineering conventions" (TDD where tractable · Adversarial review gate · Snapshot before refactor · Deterministic over generative · 6-item DoD) verified present in CLAUDE.md "Engineering conventions" section + 2 additions (Don't write file-content assertions for logic slices · AC arithmetic check). |
| `v2-backlog.md` (185L) | grep-filter, skim-dismiss | grep-result table-row inspection | **None.** All 10 grep matches (items 2, 5, 27, 33, 38, 66, 70, 82, 85) are UX/product features (review modals, document storage, product test coverage, side-by-side PDF, safeguarding continuity, bulk upload). Item #70 "Test suite" is product-coverage backlog (write more vitest tests for extraction + state), distinct from v3a/v3b's *control-plane* test gates. None overlap with v3b adversarial-subagent scope. |

**Gap-closure verdict:** all four un-audited surfaces fully reviewed. **No new v3b items surfaced.** The 15-AC table per §5 stands as the full v3b inventory. Drafting protocol step 3 (`/security-review` + `/review`) remains the next gate — its purpose is to catch what manual audit cannot (hostile-prompt resilience, security implications, AC-rubric flaws), not to repeat this content audit.

**Why no items were missed despite the initial gap:** the v3b carry-over #10 named items A-G already pulled the load-bearing concepts from `engineering-phase-candidates.md` §E + L166 + L169 (the densest source). The CLAUDE.md candidate-tracking discipline (HANDOFF-29 → HANDOFF-30 → HANDOFF-31 status table) had already cleaned through HANDOFF-30/31's parked items by session 31's wrap, leaving only the line-count.sh cluster + tdd-guard candidate to carry forward — both of which were already in v3b's inventory. The system's own discipline closed most of the gap before this audit ran.

**Audit trail integrity:** any future drafter reading this file should treat §1-§5 as the canonical inclusion list and §7 as evidence the audit was complete, not selective. If a new candidate surfaces post-S-1, it goes in v3b's `verification.md` carry-over to v3c — not silently into the AC table without an audit-findings.md update.
