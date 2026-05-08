# S-INFRA-rigour-v3d-canvas-decode-and-spec-quote-gates — Security review

**Spec reference:** spec 72 §11 (per-slice 14-item checklist).
**Status:** in-progress; full evidence consolidated at slice-wrap PR.

This slice is **infrastructure** category per CLAUDE.md §"Slice categories" §"Per-category behaviour summary":

> *"infrastructure — full production-grade rigour for control-plane changes (hooks · workflows · ESLint config · persona files); the surface that gates the rest of the rig."*

No user data flows, no auth surface, no UI, no T3+ data. Most §11 boxes resolve to **n/a** with rationale below; substantive items concentrate in adversarial review (Box 11), dependency audit (Box 12), and secrets hygiene (Box 14).

---

## §11 14-item checklist

| Box | Item | Verdict | Evidence / rationale |
|---|---|---|---|
| 1 | Data classification per AC | n/a | infra slice — no user data flows |
| 2 | New tables / columns (RLS) | n/a | no DB |
| 3 | API routes (Zod) | n/a | no new API routes |
| 4 | File upload surfaces | n/a | no upload surface |
| 5 | New env vars | PASS | one new optional env var: `SPEC_QUOTE_ENFORCE` (boolean-ish; flips author-time hook from advisory to blocking). Not secret; no `NEXT_PUBLIC_*_KEY|SECRET|TOKEN|PASSWORD|PRIVATE` pattern. Documented in AC-3. |
| 6 | Third-party data flows | PASS | AC-7 synthetic-fixture runner uses `claude -p` (Anthropic API) — same third-party already in use across `auto-review.yml`, `persona-fixtures.yml`, `persona-synthetic-fixtures.yml`. No new vendor; no new data class (synthetic in-repo fixture content + persona prompt only; no user data). DPA already in place per spec 72 §8. |
| 7 | Audit log entries | n/a | no T3+ data read/write |
| 8 | Error handling | PASS | hooks emit only to `stderr` / `additionalContext` JSON; no stack traces; no internals leaked. Decoder script emits diagnostic to stderr on parse failure with file path only (no inner content). |
| 9 | Dev/prod boundary | n/a | infra slice; no dev-mode toggle; no `MODE === 'prod'` gating needed |
| 10 | Safeguarding impact | n/a | no T4 surface; no user-facing copy or flow |
| 11 | Adversarial review | TBD | `/security-review` pass at slice wrap (DoD item 3) on hook + decoder + workflow diffs |
| 12 | Dependency audit | TBD | `npm audit` clean (decoder is pure-Node stdlib; no new npm deps); GitHub Actions dependencies pinned by SHA per existing convention (`actions/checkout@v4` SHA-pin) |
| 13 | Security headers + CSP | n/a | no new external scripts; no new resource origins |
| 14 | Secrets hygiene | TBD | `gitleaks` clean on slice branch; synthetic-fixture content is invented and contains no real-world credentials |

## Threat-model addenda

### AC-1 decoder script

Input: bundled-HTML file path (or stdin via `-`). Output: readable HTML+CSS to sibling `decoded/<file>.html` (or stdout). Threat surface:

- **Path traversal.** Decoder accepts arbitrary input path; output path is computed as `dirname(input)/decoded/basename(input)`. Validated via shellspec test that an input path containing `..` resolves to its real-path before composing the output path.
- **Inner-doc injection.** The bundled-HTML inner doc is JSON-encoded; the decoder JSON-parses then writes to disk. The decoded output is written to a `decoded/` sibling, never overwriting the original; decoder fails-loud if output path already exists unless `--force` is passed.
- **Resource exhaustion.** Bundled-HTML inputs are ≤6MB in current usage (5MB observed). Decoder reads input via `fs.readFileSync`; for a malicious 1GB input, Node would OOM. Acceptable risk for an author-time tool invoked on author-trusted repo content; not a CI-runner attack vector since the CI gate (AC-2) doesn't invoke the decoder, only requires its output sibling.

### AC-3 + AC-4 hook + CI mirror

Input: file path + content (from `tool_input`). Threat surface:

- **Regex DoS.** Trigger regex `per[[:space:]]+spec[[:space:]]+[0-9]+[a-z]?` is bounded; no catastrophic-backtracking patterns. Same for `spec[[:space:]]+[0-9]+[a-z]?[[:space:]]+§"[^"]+"`. Tested in shellspec with a 10KB pathological-content fixture; runtime under 1s.
- **CI mirror file-read.** Workflow reads cited spec files. All spec files are in-repo, version-controlled, and reviewed via the same CODEOWNERS path — no untrusted file read.
- **Workflow injection via PR title / body.** Workflow uses `pull_request` event (not `pull_request_target`); runs against the PR's own branch with no privileged secrets exposed beyond `GITHUB_TOKEN` (read-only by default). No untrusted-input interpolation into shell.

### AC-5 + AC-7 plan-architect persona amendment

- **Persona prompt injection.** Plan-architect persona uses verbatim Option C nonced delimiters per spec 72b §"Scope: session-spawned personas only" via the existing `exit-plan-review.sh` invocation. Q6 amendment doesn't change the framing; the existing nonce-derivation block remains intact.
- **Synthetic-fixture API leakage.** Synthetic-fixture content sent to Anthropic API is in-repo, non-PII, invented prose. No real session content, no canvas content, no spec content goes through the API. Same threat profile as the existing 3 specialist synthetic fixtures.

### AC-2 + AC-6 doc-only changes

No threat surface; pure-text additions to CLAUDE.md + spec 72d §5.

## Sign-off

Per slice-wrap PR. Adversarial review pass per AC + DoD item 3. Box 11 + 12 + 14 evidence captured in `verification.md` at slice ship.
