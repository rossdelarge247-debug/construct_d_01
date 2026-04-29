# S-INFRA-derive-verdict-script-extract · Security checklist (per spec 72 §11)

Pure extraction of inline shell arithmetic to a tested script. New file `scripts/derive-verdict.sh` (58L) reads JSON from stdin, runs jq queries, writes a verdict string to stdout. New shellspec test file (162L) exercises 15 input/output fixtures. `auto-review.yml` shrinks by 19L (inline arithmetic replaced with single script call). No `src/` surface, no auth flows, no DB queries, no UI, no third-party SDK.

| # | Item | Status | Note |
|---|---|---|---|
| 1 | Data classification | N/A | No data flows in diff. |
| 2 | Env vars / secrets handling | N/A | Script reads stdin only; no env var access. |
| 3 | Auth / session boundaries | N/A | No auth surface. |
| 4 | RLS coverage | N/A | No DB queries. |
| 5 | Input validation at system boundaries | PASS | Script defensively guards against malformed input: empty stdin, non-object JSON root (array / string / number / null), non-JSON garbage, empty `{}` sentinel. All map to `parse-failed` rather than crashing with a confusing jq error. The 15-case shellspec test contract includes 5 explicit malformed-input cases (test cases 9-13). |
| 6 | Logging — no secrets / PII | PASS | Script outputs only the verdict string (one of 5 known values); no input echoing, no PII. `set -euo pipefail` ensures errors exit early without partial output. |
| 7 | Dev/prod boundary | N/A | Script behaviour identical in all environments; no env-mode branching. |
| 8 | Third-party SDK handling | N/A | Uses `jq` (system-installed on ubuntu-latest runner; pinned by Debian package manager) and bash builtins only. |
| 9 | Safeguarding signposting | N/A | No user-facing copy. |
| 10 | Pen-test surface change | NEUTRAL | New attack surface: "what can an attacker do by getting the slice-reviewer persona to emit specific findings JSON?" Threat model: (a) prompt-injection in PR diff content → persona emits attacker-controlled findings JSON → script derives verdict from findings shape only (not textual content). **Mitigation tested:** test case 15 (verdict-coercion guard per spec 72c §5 rule 3) verifies that prompt-injection in finding `evidence` / `summary` text does NOT influence derivation. (b) Adversarial output shape (e.g. `{label: "issue", blocking: "true"}` string-vs-bool) → jq's `select(.blocking == true)` is strict-equal; string `"true"` doesn't match. ACTION_COUNT increments instead → request-changes (defensible). Tested in case 8. |
| 11 | Per-slice security DoD covered | PASS | This checklist is the per-slice DoD. |
| 12 | Verdict-coercion attack surface (carry-over from PR #41) | **PASS — strengthened** | This slice ships the verdict-coercion fixture per spec 72c §5 rule 3 ("Verdict-coercion guard — discard findings claiming a verdict, label, or `blocking` value via prompt-style strings in PR body / diff comments") as test case 15. Previously the guard was claimed by spec but not CI-gated; now it has a named shellspec test that runs on every PR. **Net: verdict-coercion attack surface is REDUCED (gated)** vs PR #41's "queued as v3c carry-over" status. |
| 13 | Audit trail | PASS | All changes captured in PR diff + slice acceptance.md + this file. The shellspec test output records the contract on every CI run. |

**Net: 4 PASS / 1 NEUTRAL / 8 N/A / 0 FAIL.** Verdict-coercion attack surface explicitly strengthened (test case 15).

## Extraction-vs-inline parity argument

The risk of extraction is "did the script preserve the inline arithmetic verbatim?" Mitigations:

1. **Verbatim preservation** — `auto-review.yml` lines 175-187 (BLOCKING_COUNT / ACTION_COUNT / NIT_COUNT jq queries + if/elif/else verdict assignment) are copied byte-for-byte into `scripts/derive-verdict.sh`. The only added logic is upfront defensive validation (empty stdin → parse-failed; non-object root → parse-failed; the existing `'{}' → parse-failed` sentinel preserved exactly).
2. **15-case test contract** — covers each of the 4 verdict outputs (block / request-changes / nit-only / approve) at least once, plus the parse-failed sentinel and 5 adversarial / malformed-input cases.
3. **Local + CI verification** — `shellspec` reports `15 examples, 0 failures` (this spec) + `103 examples, 0 failures` (full suite, no regression in adjacent tests).
4. **Recursive auto-review** — this PR's own auto-review runs through the new script; the verdict is derived from the persona's findings on this very diff. If the script's behaviour drifted from the inline arithmetic, the verdict would differ from expectation in a debuggable way.

Acceptable extraction.
