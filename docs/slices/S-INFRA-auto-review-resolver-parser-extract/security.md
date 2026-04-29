# S-INFRA-auto-review-resolver-parser-extract · Security checklist (per spec 72 §11)

Pure extraction of inline shell logic to two tested scripts. No `src/` surface, no auth flows, no DB queries, no UI, no third-party SDK, no permission widening (PR #45 already widened to `pull-requests: write`).

| # | Item | Status | Note |
|---|---|---|---|
| 1 | Data classification | N/A | No data flows. |
| 2 | Env vars / secrets handling | N/A | Scripts take args + stdin only; no env access. |
| 3 | Auth / session boundaries | N/A | No auth surface. |
| 4 | RLS coverage | N/A | No DB queries. |
| 5 | Input validation at system boundaries | PASS | `auto-review-slice-resolve.sh` validates branch-derived path with `[ -f ... ]` guard before output (path-traversal-safe via `grep -oE 'S-[A-Za-z0-9-]+'` allowlist on the regex character class). `auto-review-parse.sh` defensively returns `'{}'` for empty stdin / invalid envelope / malformed result body — 3 explicit failure-mode classes covered by 13 shellspec cases. |
| 6 | Logging — no secrets / PII | PASS | Scripts output only the resolved path / parsed JSON; no env or input echoing. |
| 7 | Dev/prod boundary | N/A | No env-mode branching. |
| 8 | Third-party SDK handling | N/A | jq + grep + bash builtins only. |
| 9 | Safeguarding signposting | N/A | No user-facing copy. |
| 10 | Pen-test surface change | NEUTRAL | New attack surface: "what can an attacker do by crafting a malicious branch name or PR body to mis-route the slice-resolver?" Threat model: (a) branch named `claude/S-../../../etc/passwd` — the regex `S-[A-Za-z0-9-]+` does NOT match `/`, `.`, or path-traversal characters, so the resolver outputs at most `S-` + alphanumerics + `-`. The downstream `[ -f "docs/slices/$SLICE/acceptance.md" ]` check restricts to a fixed parent dir. Path traversal is not possible. (b) PR body grep finds first `docs/slices/S-FOO/acceptance.md` — same regex constraint; output bounded to `docs/slices/<allowed-chars>/acceptance.md`. (c) `auto-review-parse.sh` operates on JSON via jq — no shell-eval surface; even maliciously-crafted persona output is bounded to data, not code. |
| 11 | Per-slice security DoD covered | PASS | This checklist. |
| 12 | Verdict-coercion attack surface (carry-over) | NEUTRAL | Unchanged from PR #41 + PR #46. This slice handles parsing, not verdict derivation. |
| 13 | Audit trail | PASS | All changes captured in PR diff + slice acceptance.md + this file. |

**Net: 4 PASS / 2 NEUTRAL / 7 N/A / 0 FAIL.**

## Extraction-vs-inline parity argument

1. **Resolver:** `auto-review-slice-resolve.sh` preserves `auto-review.yml` lines 64-83 logic byte-for-byte (the `head -1` behaviour, the case-sensitive `S-` prefix, the branch-first preference). 8 shellspec cases cover the realistic scenarios.
2. **Parser:** `auto-review-parse.sh` preserves the 2-stage extract-then-parse logic from lines 138-150, **plus** adds an explicit empty-result guard that fixes a latent edge case (jq returns 0 with empty stdout on empty stdin → inline `||` chain didn't catch → silent empty propagation under `set -euo pipefail`). Test cases 7-9 exercise the fixed behaviour.
3. **Local + CI verification:** `shellspec` reports `21 examples, 0 failures` (this slice) + `109 examples, 0 failures` (full suite, no regression).
4. **Recursive auto-review:** this PR's own auto-review fires using the new scripts; if extraction drifted, the persona would receive a different `slice-ac` fence content (or none) and emit different findings.

Acceptable extraction.
