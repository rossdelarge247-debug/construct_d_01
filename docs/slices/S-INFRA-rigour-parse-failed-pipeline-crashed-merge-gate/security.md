# S-INFRA-rigour-parse-failed-pipeline-crashed-merge-gate · Security checklist (per spec 72 §11)

Workflow value-flip: two `conclusion: "neutral"` instances change to `conclusion: "failure"` in `.github/workflows/auto-review.yml` (parse-failed verdict mapping + pipeline-crash failure-fallback step). Plus comment-block + comment-body documentation updates and a CLAUDE.md gate-table row update. No new code paths, no new env vars, no new secrets, no `src/` surface.

| # | Item | Status | Note |
|---|---|---|---|
| 1 | Data classification | N/A | No data flows in diff. |
| 2 | Env vars / secrets handling | N/A | `ANTHROPIC_API_KEY` and `GH_TOKEN` access patterns unchanged; secret-missing skip path explicitly preserved as `neutral` (line 290+ untouched). |
| 3 | Auth / session boundaries | N/A | No auth surface. |
| 4 | RLS coverage | N/A | No DB queries. |
| 5 | Input validation at system boundaries | PASS | Persona output validation surface unchanged; the parse-failed sentinel itself is the validation result emitted by `scripts/derive-verdict.sh` (per `docs/slices/S-INFRA-derive-verdict-script-extract/security.md` row 12 — verdict-coercion guard tested by 16-case shellspec). This slice changes only the *consequence* of parse-failed (now `failure` instead of `neutral`); detection logic is unchanged. |
| 6 | Logging — no secrets / PII | PASS | Diagnostic comment body + check-run summary text unchanged structurally (only the framing sentence was edited); workflow log paths unchanged. No new log surfaces. |
| 7 | Dev/prod boundary | N/A | Workflow behaviour identical in all environments; the gating change applies uniformly to all PRs. |
| 8 | Third-party SDK handling | N/A | No new SDK calls; `npx @anthropic-ai/claude-code` invocation pattern unchanged. |
| 9 | Safeguarding signposting | N/A | No user-facing copy. |
| 10 | Pen-test surface change | **NEUTRAL — meaningful** | The merge-gate behavior change IS a pen-test-surface change in the dual sense: (a) **REDUCES** attack surface for an adversarial author trying to merge an unreviewed PR by feeding the persona a prompt-injection that produces malformed JSON — pre-promotion the parse-failed sentinel posted `neutral` and the maintainer could merge regardless; post-promotion the `failure` blocks the merge button until investigated. (b) **NEW** denial-of-service vector: an attacker who can deliberately crash the workflow (e.g. push an enormous PR that times out the Claude API call, or craft input that triggers an `npx` install regression) can prevent the PR from ever reaching `success`. **Mitigation:** re-running the workflow is a one-click escape hatch (preserves owner agency); the failure check is per-commit-SHA so a fixup commit re-evaluates from scratch; if the workflow becomes systematically unstable, a follow-up slice can add an admin-bypass label (deferred per acceptance.md §Out of scope). **Net assessment: the rigour gain (rigour-malfunction = no merge) outweighs the DoS risk** (which is upper-bounded by re-run + fixup), but the DoS surface is real and worth recording. |
| 11 | Per-slice security DoD covered | PASS | This checklist is the per-slice DoD. |
| 12 | Verdict-coercion attack surface (carry-over) | PASS — strengthened | `docs/slices/S-INFRA-derive-verdict-script-extract/security.md` row 12 shipped the verdict-coercion fixture in session 51. With this slice's promotion, the fixture's protective value is materially higher: a successful prompt-injection that coerces the persona output into a malformed shape now BLOCKS the merge instead of advisory-noting it. The 16-case shellspec contract that gates verdict-derivation under adversarial inputs is now load-bearing for the merge-gate. |
| 13 | Audit trail | PASS | All changes captured in PR diff + this slice's `acceptance.md` + this file + `verification.md`. CLAUDE.md L251 update documents the post-promotion semantics for future maintainers. |

**Net: 4 PASS / 1 MEANINGFUL-NEUTRAL / 8 N/A / 0 FAIL.** The pen-test posture is materially stronger overall (rigour-malfunction now gates merge); the new DoS surface is bounded by the re-run escape hatch and worth noting for future operational vigilance.

## Promotion-specific risk analysis

**What goes wrong if the new failure-gate misfires?**

| Misfire mode | Frequency | Mitigation |
|---|---|---|
| Transient Claude API outage | Possible (provider-dependent) | Re-run workflow; failure check superseded by next run's verdict. Same recovery path that already worked at v3b for any flaky workflow. |
| Persona output schema regression (Anthropic SDK upgrade) | Possible at SDK upgrades | `parse-failed` sentinel + 16-case verdict-coercion fixture catch malformed shapes before they cause silent bad merges. The failure-gate exposes the regression; deferring would mask it. |
| Author of fix can't merge their own SDK-upgrade PR because the fix is the trigger | Edge case | The PR's own auto-review runs on the new code path; if the parse-failed sentinel fires *because* the SDK upgrade malforms output, the SDK upgrade fix is the right human-decision moment to escalate. Existing pattern: maintainer can dismiss the auto-review check via repo-admin override (separate from this slice). |
| Fork PRs can't access secret → workflow skips with `neutral` → no review → mergeable anyway | By design | Forks have always been advisory-only; nothing changes here. |
| Workflow YAML syntax error from this slice's edit | Caught by | `python3 -c "import yaml; yaml.safe_load(...)"` in AC-1 verification point 8; recursive auto-review on this PR. |

**Why the secret-missing path explicitly stays `neutral`:** GitHub Actions does not expose repo secrets to fork PRs. If the slice-reviewer skip-on-missing-secret path were promoted to `failure`, every fork PR would post a failure check that the fork author cannot resolve (they can't add secrets to the upstream repo). That would block all fork contributions. The structural exception is intentional and matches GitHub's standard fork-PR security model.
