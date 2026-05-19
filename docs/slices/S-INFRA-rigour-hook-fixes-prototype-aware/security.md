# S-INFRA-rigour-hook-fixes-prototype-aware — Security checklist

**Slice:** S-INFRA-rigour-hook-fixes-prototype-aware
**Spec ref:** `docs/workspace-spec/72-engineering-security.md` §11 (14-item per-slice security checklist)

This slice is infrastructure-only:

- 2 hook-script edits (`.claude/hooks/tdd-first-every-commit.sh` + `.claude/hooks/comment-review.sh`)
- 2 doc edits (spec 76 §2 footnote + CLAUDE.md §"Hard controls" parenthetical)
- 2 new shellspec test files

No `src/` surface; no code paths reaching the running app; no auth flows; no persisted data; no network surface; no third-party integration; no environment variables. Most spec 72 items are therefore N/A.

## 14-item checklist

| # | Item (spec 72 §11) | Status | Notes |
|---|---|---|---|
| 1 | Data classification per AC | N/A | Hook + doc edits; no data flow. |
| 2 | New tables / columns + RLS | N/A | No DB surface. |
| 3 | API routes (Zod + rate limit) | N/A | No API surface. |
| 4 | File upload surfaces | N/A | No upload surface. |
| 5 | New env vars (spec 72 §2 inventory) | N/A | No env var added. |
| 6 | Third-party data flows | N/A | No new integration. |
| 7 | Audit log entries (T3+) | N/A | No T3+ data path. |
| 8 | Error handling (no leaks) | N/A | Hook stderr already documented per source; no new error surface. |
| 9 | Dev/prod boundary (spec 72 §7) | N/A | Hooks run at author-time + commit-time only; no `MODE` switch surface. |
| 10 | Safeguarding impact (T4) | N/A | No safeguarding surface. |
| 11 | Security headers + CSP | N/A | No web surface. |
| 12 | Adversarial review (`/security-review` skill) | PENDING | Persona suite spawns at PR via `auto-review.yml`; `reviewer-security` included. |
| 13 | Dependency audit (`npm audit`) | N/A | No `package.json` change; CI `npm audit` workflow gates independently. |
| 14 | Secrets hygiene (gitleaks clean) | PENDING | No secrets introduced; CI `Gitleaks scan` workflow gates independently — expected GREEN. |

**Tally (at slice ship):** 2 PENDING · 12 N/A · 0 FAIL.

## Adversarial review notes

- **Hook-script tampering surface.** Both edits stay within the existing hook boundary (`.claude/hooks/*.sh`); no new exec surface; no new file-read surface; no expansion of input parsing. The awk regex change is regex-only.
- **Awk regex injection.** The §Status awk filter consumes `CONTENT` from `jq -r '.tool_input.content'` — content is data, not a regex; the awk PROGRAM is hard-coded in the hook source. No injection vector introduced.
- **Path-default regex correctness.** The shared regex `^src/app/dev/proto/[^/[]+/.+\.(ts|tsx)$` excludes parametric routes (`[*]`) via the `[^/[]+` character class. Tested in `tdd-guard.sh` shellspec already; mirroring it preserves the proven behaviour.

## Sign-off

- **Reviewed by:** PENDING (slice author + persona suite at PR)
- **Date:** PENDING
- **Verdict:** PENDING
