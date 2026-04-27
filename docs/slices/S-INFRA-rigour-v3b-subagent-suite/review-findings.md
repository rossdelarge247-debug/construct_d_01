# S-INFRA-rigour-v3b-subagent-suite — `/review` findings

**Spec reference:** `acceptance.md` "Drafting protocol" — `/security-review` + `/review` against the redrafted `acceptance.md` BEFORE any RED-tests-first impl.
**Diff scope:** `origin/main..HEAD` = 4 commits, docs-only (`HANDOFF-SESSION-41.md`, `SESSION-CONTEXT.md`, `acceptance.md`, `audit-findings.md`).
**Reviewers run:** `/security-review` (zero findings — see `security.md`) + `/review` (this doc).
**Status:** S-2 — findings captured; resolution log below.

## Overview

PR ships v3b S-1: docs-only — `audit-findings.md` (audit trail) + `acceptance.md` redrafted top-down to 15 ACs grouped A–E, plus session-41 retro and updated `SESSION-CONTEXT`. This review is the v3b S-2 prerequisite gate before any RED-tests-first impl per the slice's own drafting protocol.

## Verdict vocabulary

Per CLAUDE.md "Hard controls > Verdict vocabulary": `approve` / `nit-only` / `request-changes` / `block`. Severity: `architectural` / `logic` / `style` / `none`.

## Findings

| ID | File:line | Dim | Severity | Verdict | Description | Recommended action |
|---|---|---|---|---|---|---|
| R-1 | acceptance.md:24 | 1 spec-quote | logic | request-changes | AC-1 invokes "G23 vocabulary" + "CLAUDE.md Coding-conduct rubric" without literal quote of either source. CLAUDE.md Planning-conduct rule: *"Any claim of the form 'per spec X' or 'matches X exactly' must include the literal sentence from the spec in the same breath."* | Inline-quote the four-verdict line from CLAUDE.md "Hard controls > Verdict vocabulary" into AC-1's Verification cell. |
| R-2 | acceptance.md:30 | 1 spec-quote | style | nit-only | AC-2 cites `engineering-phase-candidates L86` + `L89` for Loveable-check + 3–10 AC-quantity rule by line number only — no literal text. | Add literal §C lines in parentheses after the line-ref. |
| R-3 | acceptance.md:48 | 1 spec-quote | style | nit-only | AC-5 says "verbatim §E L132 reference" but doesn't reproduce the L132 line. The very rule it invokes ("verbatim") is broken in the AC that invokes it. | Quote §E L132 inline. |
| R-4 | acceptance.md:56 | 4 testability | logic | request-changes | AC-6 says budget cap "≤90s soft, fail-loud" — "soft" is undefined (warn? extend? abort with code 0?). RED-test cannot pin behaviour. Path-mapping convention also ambiguous for `.tsx` vs `.test.tsx`. | Define soft-vs-hard timeout semantics (e.g. "warn at 60s, abort fail-loud at 90s"); pin path-mapping rewrite rule. |
| R-5 | acceptance.md:62 | 4 testability | logic | request-changes | AC-7 offers three example commit-message regex patterns (`RED:` / `S-NN-N RED part` / `failing meta-tests`) without committing to which is *the* canonical match. Also "next commit's pattern suggests GREEN impl" is heuristic, not testable. | Pin one regex (or named-set); replace "suggests" with deterministic check. |
| R-6 | acceptance.md:82 | 4 testability | logic | request-changes | AC-10 thresholds (`<300` / `300-1000` / `>1000`) lack a measurement source — line-count of which artefact? `acceptance.md` only? Sum of slice docs? Spec-72-§11 inclusive? | Specify which artefact(s) feed the line-sum and the exact `wc -l` invocation. |
| R-7 | acceptance.md:96 | 4 testability | logic | request-changes | AC-12 "absent OR HEAD-mismatched-by->=Nlines" leaves N undefined. Threshold is the load-bearing parameter. "Multi-branch hop → rebaseline once" — once per hop or once per session? | Pin N (e.g. `N=200`); clarify once-per-hop semantics. |
| R-8 | acceptance.md:108 | 4 testability | logic | request-changes | AC-14 pins coverage threshold to "≥80% per spec 72 F6c" but v3a `acceptance.md` L178 says ".ts ≥90% via vitest (per F6)". Sibling-spec contradiction; cannot write a test until the number is settled. | Reconcile: AC-14 raises to 90% (matches v3a F6) OR v3a L178 amended (likely structurally out-of-scope for v3b). Quote canonical value. |
| R-9 | acceptance.md:116 | 4 testability | style | nit-only | AC-15 decision criteria use AND-thresholds (median <30s AND p95 <60s AND tokens <5000) — what if 2 of 3 pass? Spec silent on partial-pass. | Add explicit handling (recommend: any failure → maintain opt-in). |
| R-10 | acceptance.md:125 | 5 DoD parity | logic | request-changes | "Inherit v3a's 12-item DoD verbatim (L170-186)" — but CLAUDE.md "Engineering conventions" specifies a 6-item slice DoD. v3a expanded to 12; v3b inherits 12 + adds DoD-13 = 13. The 6/12/13 reconciliation isn't surfaced; reader will miss the implicit override. | Add one-line note that v3a expanded the CLAUDE.md 6-item floor to 12; v3b inherits the expansion + adds DoD-13. |
| R-11 | acceptance.md:152 | 8 carry-over hygiene | none | nit-only | "Carry-over from v3b (to v3c)" placeholder empty. Fine for S-1; format-test at S-2 wrap. | No edit now; flag at S-2 wrap. |
| R-12 | audit-findings.md:96 | 3 consistency | logic | request-changes | §5 row 11 says "= carry-over #2" — but this is the v3a-side numbering, not v3b's AC numbering. Easy to misread. | Disambiguate: "(= v3a carry-over item #2)". |
| R-13 | acceptance.md:10 | 7 audit-trail integrity | none | approve | "AC-1 through AC-15 below are drafted top-down from `audit-findings.md` §5" — verified: §5 lists 15 items grouped A(5) + B(2) + C(3) + D(4) + E(1) = 15; acceptance.md groups match exactly. Σ-check passes. | None. |
| R-14 | acceptance.md:127 | 1 spec-quote | style | nit-only | DoD-13 is a new rule introduced by v3b without a source quote. | Either accept as v3b-original (cite "v3b-introduced") or add to audit-findings.md as a new-source row. |
| R-15 | SESSION-CONTEXT.md:62-65 | 10 cross-doc rot | none | approve | "v3b S-1 committed at `517a91b`" consistent with `acceptance.md` L10 + `audit-findings.md` §5. No rot. | None. |
| R-16 | HANDOFF-SESSION-41.md:5 | 10 cross-doc rot | none | approve | HANDOFF "1 commit ahead of v3a-foundation tip" + SESSION-CONTEXT L70-76 "3-commit replay onto main" both consistent given session-42 follow-up captured in SESSION-CONTEXT only. | None. |
| R-17 | scope | 9 doc-only sanity | none | approve | `git diff --name-only` confirms 4 docs touched, zero `.ts/.tsx/.js/.sh/.yml`. | None. |

## Overall verdict

**Initial:** `request-changes` — seven logic-severity findings (R-1, R-4, R-5, R-6, R-7, R-8, R-10, R-12) hit dimensions 1 (spec-quote), 3 (consistency), 4 (testability), 5 (DoD parity). None architectural; R-8 (coverage-threshold contradiction) and R-10 (DoD count drift) load-bearing. RED-tests cannot be written against AC-6/7/10/12/14 until ambiguity is pinned. Address before AC freeze + S-3 RED impl.

**Post-resolution:** `approve` — all 11 in-scope findings (R-1, R-2, R-3, R-4, R-5, R-6, R-7, R-8, R-10, R-12, R-14) addressed in this S-2 commit per the resolution log; verified by re-review pass against the edited line ranges. R-9 + R-11 deferred with reasoning; R-13/15/16/17 approved unchanged. AC freeze unblocked; S-3 (`@vitest/coverage-v8` activation as first v3b commit per AC-14) ready to begin.

## Out-of-scope / deferrable

- Subagent default-spawn flip mechanics (R-9 partial-pass criterion) — measurement protocol absorbs this at AC-15 instrumentation; S-2 minimum is to acknowledge the gap.
- DoD-13 "reviewer of the reviewer" persona-recursion concrete invocation pattern — implementation detail; defer to S-3+.
- v3a F6/F6c coverage threshold reconciliation (R-8) — if v3a is now merged on main, the canonical number lives there; v3b should match, not invent. Touching v3a `acceptance.md` is structurally out of scope for v3b.

## Resolution log

User accepted all 5 recommended defaults for the load-bearing logic findings (R-4 timeout, R-5 regex, R-6 line-count source, R-7 N threshold, R-8 coverage threshold). All edits land in this S-2 commit.

| ID | Resolution | Commit |
|---|---|---|
| R-1 | **addressed** — AC-1 Verification cell now inlines the four-verdict literal quote from CLAUDE.md "Hard controls > Verdict vocabulary". | this S-2 commit |
| R-2 | **addressed** — AC-2 inlines engineering-phase-candidates L86 (Loveable check) + L89 (3–10 AC quantity) verbatim. | this S-2 commit |
| R-3 | **addressed** — AC-5 inlines engineering-phase-candidates §E L132 verbatim. | this S-2 commit |
| R-4 | **addressed** — AC-6 timeout pinned: warn on stderr at 60s, abort fail-loud at 90s. Path-mapping pinned to deterministic rewrite rule `src/<path>.{ts,tsx}` → `tests/unit/<path>.test.{ts,tsx}`. | this S-2 commit |
| R-5 | **addressed** — AC-7 canonical regex pinned to `^RED:` (case-sensitive, single pattern). "Suggests GREEN impl" replaced with deterministic three-condition AND check. | this S-2 commit |
| R-6 | **addressed** — AC-10 thresholds pinned to `wc -l docs/slices/S-*/acceptance.md` only (canonical source-of-truth; sibling docs derivative). Pre-flight gate aligned. | this S-2 commit |
| R-7 | **addressed** — AC-12 N=200 (cumulative `git diff --shortstat` insertions+deletions). Once-per-hop semantics clarified: every checkout-to-different-branch SHA triggers rebaseline; same-branch reset does not. | this S-2 commit |
| R-8 | **addressed** — AC-14 coverage threshold raised from ≥80% to ≥90% per spec 72 F6 (matches v3a `acceptance.md` L178; v3b inherits v3a's coverage floor; does not regress). | this S-2 commit |
| R-9 | **deferred** to AC-15 instrumentation (S-N) — partial-pass criterion absorbs at measurement time. Recommended default at flip time: any failure → maintain opt-in. | (deferred) |
| R-10 | **addressed** — Definition of Done section surfaces the 6→12→13 count history; CLAUDE.md 6-item baseline noted as floor not ceiling. | this S-2 commit |
| R-11 | **deferred** to S-2 wrap — empty Carry-over placeholder format-tests at S-2 wrap (any deferred items above land there). | (deferred to wrap) |
| R-12 | **addressed** — audit-findings.md §5 row 11 disambiguated: "(= v3a-side carry-over item #2; not the v3b AC-2 numbered above)". | this S-2 commit |
| R-13 | **approved** — Σ-check (5+2+3+4+1 = 15) passes. | — |
| R-14 | **addressed** — DoD-13 tagged "(v3b-introduced — no v3a precedent; reviewer-of-the-reviewer)". | this S-2 commit |
| R-15 | **approved** — no cross-doc rot. | — |
| R-16 | **approved** — no cross-doc rot. | — |
| R-17 | **approved** — doc-only diff confirmed. | — |
