# S-INFRA-rigour-v3c-prior-art-amendments-structural — Security checklist

**Slice:** S-INFRA-rigour-v3c-prior-art-amendments-structural
**Spec ref:** `docs/workspace-spec/72-engineering-security.md` §11 (13-item per-slice security checklist)

This slice is control-plane-only:
- Adds `.github/CODEOWNERS` (replaces 3 controls with industry-standard pattern)
- Removes `.claude/hooks/pre-commit-verify.sh`, `.claude/hooks-checksums.txt`, `scripts/hooks-checksums.sh`, `.github/workflows/control-change-label.yml`
- Edits `CLAUDE.md` §"Hard controls" table + §"Engineering conventions" §"Architectural-smell trigger"
- Edits `.claude/hooks/session-start.sh` (removes Hooks-checksums drift warning block)
- Edits `.claude/settings.json` (removes pre-commit-verify hook registration)

No `src/` surface; no code paths; no auth flows; no persisted data; no network surface; no third-party integration; no environment variables. Most spec 72 items are therefore N/A.

The slice is security-relevant because it changes the control-change-protection mechanism — three home-grown controls collapse to one CODEOWNERS file backed by GitHub's branch-protection. **Coverage does not regress** when the branch-protection setting `require_code_owner_reviews` is enabled (per AC-1 verification step 2). If that setting is NOT enabled at merge time, the slice ships in disabled state — coverage is then strictly weaker than before. The Pre-flight setup step in `verification.md` is the load-bearing guard against this.

## 13-item checklist

| # | Item (spec 72 §11) | Status | Notes |
|---|---|---|---|
| 1 | T2/T3 data classification + flow documented | N/A | No data flow — control-plane-only slice. |
| 2 | Auth/session boundary respected | N/A | No app-auth surface touched. The CODEOWNERS gate uses GitHub's own auth (repo-collaborator + branch-protection), not app-side auth. |
| 3 | Input validation at boundary | N/A | No app input surface. CODEOWNERS file format is GitHub-validated (invalid syntax → GitHub UI warning + non-enforcement; documented behaviour). |
| 4 | RLS / tenancy enforced | N/A | No DB surface. |
| 5 | Secrets / env vars handled per spec 72 §2 | N/A | No secrets / env vars touched. CODEOWNERS file contains GitHub usernames only (public; equivalent to git author lines). |
| 6 | Logging redacts T2/T3 fields | N/A | No logging surface. |
| 7 | Dev-mode boundary preserved (spec 72 §7) | N/A | No `MODE` switch surface; no `/app/dev/*` paths touched. |
| 8 | Third-party integration vetted | N/A | No new external integrations. CODEOWNERS is a GitHub-native feature (no third-party); branch-protection is a GitHub-native setting (no third-party). |
| 9 | Safeguarding flows preserved (spec 72 §9) | N/A | No user-facing safeguarding surface. |
| 10 | Pen-test posture maintained | PASS | **Net: improved.** Reduces attack surface (one config file vs three controls + workflow + hook script + checksums file). The control-change-label workflow could be bypassed by a maintainer applying their own label; CODEOWNERS + branch-protection cannot be self-approved (GitHub enforces "approver != author" by default with the required-reviewers setting). Branch-protection itself is admin-restricted; CODEOWNERS file is self-protected via the `.github/CODEOWNERS` line in CODEOWNERS. |
| 11 | npm audit clean (high + critical) | N/A | No `package.json` change; CI `npm audit` workflow gates this independently. |
| 12 | Gitleaks scan clean | PASS | No secrets in commits; CI `Gitleaks scan` workflow gates this independently — expected GREEN. |
| 13 | Audit trail (decision lineage) | PASS | Full lineage: session-49 prior-art audit (`docs/HANDOFF-SESSION-49.md` §"Prior-art audit" — research subagent #2 scanned 15 controls A-O against industry prior art; verdict at L27 verbatim: *"replace hooks-checksums + pre-commit-verify with CODEOWNERS + branch-protection (the audit verdict: we're re-implementing CODEOWNERS); deprecate slice-DoD pre-commit-verify — pre-commit is wrong layer for completeness checks (CI is); reframe arch-smell as prompt rule, not gate — round-counting incentivises gaming"*). Deferral declaration: PR #38 sibling slice's acceptance.md §"Out of scope (P0b-structural — separate slice)" L109-117. Six design decisions resolved in session-53 conversation (Q-A1 through Q-C2). Each removed control's rollback procedure documented in `verification.md` §AC-1/2/3 evidence + slice-level §Rollback. |

**Tally:** 2 PASS · 11 N/A · 0 FAIL.

## Adversarial review (security-specific)

Per CLAUDE.md §"Engineering conventions" §"Adversarial review gate":

- **`/security-review` skill** — N/A. The skill targets `src/` slices for OWASP-class issues. This slice has no code surface, no input handling, no data flow.
- **Coverage-regression check** — verified at AC-1 verification step 2 (`gh api` confirms `require_code_owner_reviews: true`). If the setting is not on, this slice DOES regress coverage; the verification gate prevents AC-1 from passing in that state.
- **Self-approval bypass** — CODEOWNERS + branch-protection enforces approver ≠ author by default (GitHub UI). The legacy `control-change-label.yml` could be bypassed by a maintainer self-applying the label. Net: stricter.
- **CODEOWNERS file tamper** — the `.github/CODEOWNERS` line in CODEOWNERS itself protects the file (any edit to CODEOWNERS requires owner review). Same self-protection pattern as the legacy hooks-checksums-of-itself.
- **Atomic-removal-vs-enforcement-gap** — legacy controls are removed in the SAME PR that adds CODEOWNERS. There is no window where neither is enforced. PR-level atomicity, not commit-level (commits within the PR could exist temporarily without one or the other, but the merge to main is atomic).
- **Pre-commit hook removal (AC-2)** — `pre-commit-verify.sh` is informational at the local-machine layer; CI (`pr-dod.yml`) is the authoritative gate. Removing the hook does not remove the gate. Pen-test posture: unchanged (CI gate is the audit-able layer).
- **Arch-smell rule rewrite (AC-3)** — qualitative judgement vs numeric trigger. No security-relevant change. The rule guides reviewer behaviour; it doesn't gate anything.

## Sign-off

- **Reviewed by:** session 53 author (pre-impl draft)
- **Date:** 2026-04-29
- **Verdict:** PASS — control-plane simplification with net-improved pen-test posture. Coverage non-regression depends on AC-1 verification step 2 (branch-protection setting enabled).
