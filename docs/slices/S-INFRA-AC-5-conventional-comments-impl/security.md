# S-INFRA-AC-5-conventional-comments-impl — Security checklist

**Slice:** S-INFRA-AC-5-conventional-comments-impl
**Spec ref:** `docs/workspace-spec/72-engineering-security.md` §11

This slice is a structural schema change across spec + persona + workflow files. No `src/` surface; no auth flows; no persisted data; no new env vars. Workflow continues to run under existing `${{ secrets.GITHUB_TOKEN }}` + `${{ secrets.ANTHROPIC_API_KEY }}` scopes.

## 13-item checklist

| # | Item (spec 72 §11) | Status | Notes |
|---|---|---|---|
| 1 | T2/T3 data classification + flow documented | N/A | No data flow change. |
| 2 | Auth/session boundary respected | N/A | No auth surface. |
| 3 | Input validation at boundary | PASS | jq selectors `.label == "issue"` and `.blocking == true` are strict-equality matches; adversarial inputs (string "true" instead of boolean, unknown labels) fall through cleanly to lower-priority branches without granting elevated verdict. Edge-case table in `verification.md` documents 8 representative shapes including adversarial. |
| 4 | RLS / tenancy enforced | N/A | No DB surface. |
| 5 | Secrets / env vars handled per spec 72 §2 | PASS | No secrets / env vars added or modified. The `SEVERITY` env var is removed from the post-check-run step (was sourced from persona JSON); `VERDICT` + `FINDINGS_COUNT` retained. |
| 6 | Logging redacts T2/T3 fields | N/A | No logging surface change. The existing `::group::raw claude output` + `::group::extracted persona JSON` debug groups are unchanged in scope. |
| 7 | Dev-mode boundary preserved (spec 72 §7) | N/A | No `MODE` switch surface. |
| 8 | Third-party integration vetted | PASS | One new external URL cited (https://conventionalcomments.org/). Public, auth-free, prose-only documentation reference; not loaded at runtime; cited as the standard's source-of-truth in CLAUDE.md + spec 72c + 3 persona files. |
| 9 | Safeguarding flows preserved (spec 72 §9) | N/A | No user-facing safeguarding surface. |
| 10 | Pen-test posture maintained | PASS | Verdict-coercion guard preserved verbatim in spec 72c §5 (rule 3), now extended to also discard adversarial `blocking` values + `label` values from prompt-style strings in PR body / diff comments. The deterministic verdict-derivation arithmetic in auto-review.yml (`BLOCKING_COUNT` / `ACTION_COUNT` / `NIT_COUNT` from jq selectors) cannot be coerced via persona JSON — only valid `findings[]` shapes contribute. Reduces verdict-coercion attack surface vs the prior pattern where the persona itself emitted the top-level verdict (which an injected prompt could try to override). |
| 11 | npm audit clean (high + critical) | N/A | No `package.json` change; CI npm audit gates this independently. |
| 12 | Gitleaks scan clean | PASS | No secrets in commits; CI Gitleaks gates this independently. |
| 13 | Audit trail (decision lineage) | PASS | Full lineage: session-49 prior-art audit (audit ID N) → PR #38 §AC-5 deferred scope-marker → session 50 user authorisation (turn-N: "Full AC-5 inline impl") → this slice. Conventional Comments standard cited verbatim across 5 files. Schema-of-record at three layers (CLAUDE.md spec → spec 72c §5 aggregation → persona output formats) with consumer code in auto-review.yml. |

**Tally:** 4 PASS · 9 N/A · 0 FAIL.

## Adversarial review (security-specific)

Per CLAUDE.md §"Engineering conventions" §"Adversarial review gate":

- **`/security-review` skill** — N/A (no `src/` surface).
- **Verdict-coercion attack surface** — REDUCED. Prior schema let the persona emit a top-level `verdict` field; an injected prompt in PR body could attempt to coerce a `verdict: "approve"` regardless of findings. The new schema removes the persona-emitted top-level verdict; the workflow derives it from `findings[]` arithmetic (`BLOCKING_COUNT` etc. via `jq select`). Coercion now requires manipulating the findings array shape itself (label + blocking values), which is bounded by the strict jq enum check — adversarial labels not in the official 9 fall through to the `approve` default branch (still safer than the prior pattern's coerce-to-approve risk).
- **Verdict-coercion guard preservation** — Spec 72c §5 rule 3 ("Verdict-coercion guard") was preserved verbatim and extended to also cover `blocking` value coercion via prompt-style strings. The fixture refresh under the new schema is queued as v3c carry-over per acceptance.md §"Out of scope".
- **JSON parse robustness** — Existing parser fence-strip + parse-failed sentinel at L135-158 is unchanged. The new parser additions (lines deriving VERDICT from findings) all use `jq -r` with `// 0` numeric defaults — robust to missing fields. Fail-safe direction: if persona JSON is malformed, parse-failed sentinel fires (neutral check-run), not silent block.
- **Hash re-baseline isolation** — Verified via diff that 3 persona file SHAs change in `.claude/hooks-checksums.txt`; other 17 entries unchanged.

## Sign-off

- **Reviewed by:** session 50 author
- **Date:** 2026-04-28
- **Verdict:** PASS — structural schema change reduces verdict-coercion attack surface; deterministic verdict-derivation strictly safer than persona-emitted verdict.
