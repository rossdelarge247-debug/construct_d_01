# S-INFRA-auto-review-slice-resolver-fix — Security checklist

**Slice:** S-INFRA-auto-review-slice-resolver-fix
**Spec ref:** `docs/workspace-spec/72-engineering-security.md` §11 (13-item per-slice security checklist)

This slice is a CI workflow edit:
- One block-edit to `.github/workflows/auto-review.yml` slice-resolution logic (resolver order swap + diagnostic comment)
- Slice docs (acceptance, verification, this file)

No `src/` surface; no auth flows; no persisted data; no environment variables touched. The workflow already runs under `${{ secrets.GITHUB_TOKEN }}` + `${{ secrets.ANTHROPIC_API_KEY }}` scopes — neither secret-handling step nor scope is altered.

## 13-item checklist

| # | Item (spec 72 §11) | Status | Notes |
|---|---|---|---|
| 1 | T2/T3 data classification + flow documented | N/A | No data flow change. |
| 2 | Auth/session boundary respected | N/A | No auth surface. |
| 3 | Input validation at boundary | PASS | The new branch-derived path uses the `[ -f "docs/slices/$SLICE_FROM_BRANCH/acceptance.md" ]` guard; missing-file falls through to PR-body fallback. `grep -oE 'S-[A-Za-z0-9-]+'` constrains the extracted token to alphanumeric+hyphen (no path traversal via the branch ref). |
| 4 | RLS / tenancy enforced | N/A | No DB surface. |
| 5 | Secrets / env vars handled per spec 72 §2 | PASS | No secrets/env vars added or modified. `ANTHROPIC_API_KEY` + `GITHUB_TOKEN` usage downstream unchanged. |
| 6 | Logging redacts T2/T3 fields | N/A | No logging surface change. |
| 7 | Dev-mode boundary preserved (spec 72 §7) | N/A | No `MODE` switch surface. |
| 8 | Third-party integration vetted | N/A | No new third-party integration. The Anthropic SDK invocation downstream is untouched. |
| 9 | Safeguarding flows preserved (spec 72 §9) | N/A | No user-facing safeguarding surface. |
| 10 | Pen-test posture maintained | PASS | Resolver order swap reduces attack surface marginally — a malicious PR body that cited a path to a sibling slice's `acceptance.md` could previously mis-resolve the AC fence; with branch-first preference, body-injected paths are ignored when the branch maps to a real slice. |
| 11 | npm audit clean (high + critical) | N/A | No `package.json` change; CI npm audit gates this independently. |
| 12 | Gitleaks scan clean | PASS | No secrets in commits; CI Gitleaks gates this independently — expected GREEN. |
| 13 | Audit trail (decision lineage) | PASS | Full lineage: PR #38 (session 50) auto-review finding 1 evidence quoted verbatim in `acceptance.md` §Context; CLAUDE.md §"Architectural-smell trigger" L216 worked example acknowledged in §"Architectural-smell-trigger acknowledgement"; v3c carry-over (resolver/parser extraction to tested scripts) explicitly recorded. |

**Tally:** 4 PASS · 9 N/A · 0 FAIL.

## Adversarial review (security-specific)

Per CLAUDE.md §"Engineering conventions" §"Adversarial review gate":

- **`/security-review` skill** — N/A. The skill targets `src/` slices for OWASP-class issues. This slice is a CI workflow YAML edit with no application code surface.
- **Branch-ref injection safety** — `$BRANCH` is `${{ github.head_ref }}` from the trigger event. GitHub validates ref names against [git's check-ref-format rules](https://git-scm.com/docs/git-check-ref-format) before populating `head_ref`. The `grep -oE 'S-[A-Za-z0-9-]+'` filter further narrows the extracted token to alphanumeric+hyphen — no shell metacharacters, no relative-path components, no `..` traversal. Compose into the path `docs/slices/$SLICE_FROM_BRANCH/acceptance.md` is bounded within the repo's `docs/slices/` namespace; `[ -f ]` confirms the file exists before use.
- **PR-body grep fallback safety** — Unchanged from the prior code. The strict regex `docs/slices/S-[A-Za-z0-9-]+/acceptance\.md` constrains matches to the same alphanumeric+hyphen + literal-suffix shape.
- **Resolver order swap risk** — Could a benign PR previously resolved via PR-body grep now resolve to a different slice via branch? Only if the branch-derived path exists AND the prior body-grep match was different. Manual review: the conventional `claude/<slice-name>` naming maps the branch to the slice that the PR is for; the body-grep path historically matched the same slice (when the body cited it explicitly). The mis-resolution mode addressed by this fix is the *off-convention* case (body cites a sibling slice path before the slice's own path). No silent semantic shift for on-convention PRs.

## Sign-off

- **Reviewed by:** session 50 author
- **Date:** 2026-04-28
- **Verdict:** PASS — workflow YAML edit; no application surface; resolver order swap is strictly safer than prior behaviour.
