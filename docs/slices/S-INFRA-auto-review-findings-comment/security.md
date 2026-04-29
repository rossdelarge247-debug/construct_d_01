# S-INFRA-auto-review-findings-comment · Security checklist (per spec 72 §11)

Workflow YAML edit adding PR-comment posting to `auto-review.yml`. Permissions widened: `pull-requests: read` → `pull-requests: write` (scoped to this workflow run's `GITHUB_TOKEN` only). No `src/` surface, no auth flows, no DB queries, no UI.

| # | Item | Status | Note |
|---|---|---|---|
| 1 | Data classification | N/A | No data flows in diff. |
| 2 | Env vars / secrets handling | PASS | Workflow already uses `secrets.ANTHROPIC_API_KEY` + `secrets.GITHUB_TOKEN`; no new secrets. The new comment-posting step uses the same `GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` env var pattern as the existing check-run posting steps. |
| 3 | Auth / session boundaries | PASS | The widened `pull-requests: write` permission is scoped to the GITHUB_TOKEN issued for THIS workflow run on THIS PR. Does not grant any token persistence; does not expand bot-account permissions globally. Per [GitHub Actions permissions docs](https://docs.github.com/en/actions/using-jobs/assigning-permissions-to-jobs): "permissions are scoped to the GITHUB_TOKEN for the duration of the job." |
| 4 | RLS coverage | N/A | No DB queries. |
| 5 | Input validation at system boundaries | PASS | Persona-emitted JSON (the "input" to the comment-rendering step) is parsed via `jq` with `// ""` and `// false` defaults guarding null/missing fields. `gsub` patterns escape `\|` (markdown table cell separator) and `\n` (line break) in evidence/remediation fields so a maliciously-crafted persona output cannot break out of the table cell or inject GitHub markdown. The persona output itself is bounded by the upstream `head -c 60000` truncation in the existing review-step (line 190 of pre-edit auto-review.yml). |
| 6 | Logging — no secrets / PII | PASS | New step's `set -euo pipefail` + non-error path emits no log lines containing tokens. Existing `::group::raw claude output` log group already redacts no secrets (raw persona output is review prose, not auth context). |
| 7 | Dev/prod boundary | N/A | Workflow runs only on `pull_request` events; no env-mode branching. |
| 8 | Third-party SDK handling | N/A | Uses `gh` CLI (vendored on ubuntu-latest runner) + `jq` (system-installed); no new third-party SDK. |
| 9 | Safeguarding signposting | N/A | No user-facing copy in diff. |
| 10 | Pen-test surface change | NEUTRAL | The new attack surface is "what can an attacker do by getting the slice-reviewer persona to emit specific findings JSON?" Threat model: (a) prompt-injection in PR diff content → persona emits attacker-controlled JSON → comment renders attacker text. Mitigation: comment is bot-authored not author-impersonating; markdown is GitHub-flavoured (no `<script>` execution); evidence/remediation cells are escaped against `\|` table-break + `\n` cell-overflow. (b) marker-string spoofing → an attacker-authored real human comment containing `<!-- auto-review-comment:slice-reviewer -->` would cause subsequent auto-review runs to PATCH the human comment instead of posting fresh. Mitigation gap: marker-spoofing is theoretically possible but limited to PR authors with comment-write permission already; net impact is auto-review's comment-update is hijacked, not new attack surface (the attacker already had write access to the PR). Acceptable at v3b informational gate; promotion to authored-by-bot-only filter is a v3c follow-up if surfaced. |
| 11 | Per-slice security DoD covered | PASS | This checklist is the per-slice DoD. |
| 12 | Verdict-coercion attack surface (carry-over from PR #41 + PR #44) | NEUTRAL | This slice does NOT change the verdict-derivation logic — same `BLOCKING_COUNT` / `ACTION_COUNT` / `NIT_COUNT` arithmetic from PR #41 (lines 175-187). Comment rendering is downstream of verdict derivation; cannot influence the verdict that gets derived. |
| 13 | Audit trail | PASS | All changes captured in PR diff + slice acceptance.md + this file. The workflow run log records the find-or-edit gh-api calls. |

**Net: 5 PASS / 2 NEUTRAL / 6 N/A / 0 FAIL.**

## Permissions widening — explicit threat model

`permissions.pull-requests: read` → `pull-requests: write` is the load-bearing change. Threat model:

- **What it grants:** the GITHUB_TOKEN issued for THIS auto-review workflow run can POST/PATCH/DELETE PR comments (and review comments, labels, milestones — full PR write surface) on the PR that triggered the run.
- **Scope boundary:** GitHub Actions GITHUB_TOKEN is scoped to the repository + the lifetime of the workflow run. It does NOT carry over to other workflows; does NOT expand the `github-actions[bot]` user's global permissions; does NOT grant cross-repo access.
- **Risk:** if an attacker controls the workflow's shell execution (e.g. via prompt-injection causing the persona to emit malicious shell metacharacters that escape `jq -n --arg body`), they could use the elevated `pull-requests: write` token to delete arbitrary PR comments / labels on the same PR. Mitigation: `jq -n --arg body "$BODY"` constructs the JSON payload via jq's strict argument handling — `$BODY` cannot escape its string context to inject additional fields. The shell variable `$BODY` itself is built from `printf` with explicit `%s` placeholders and persona-output that's been jq-parsed (with `// ""` guards), so attacker-controlled persona output is constrained to the body text — not to other API parameters.
- **Pre-existing parity:** the existing `checks: write` permission (already in the workflow) carries the same class of risk; this slice extends the same model to the `pull-requests` scope. Net: incremental, not categorical, expansion of the workflow's already-elevated state.

Acceptable at v3b informational gate. Documented for v3c review.
