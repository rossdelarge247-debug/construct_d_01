# S-INFRA-synthetic-fixtures · Security checklist (per spec 72 §11)

Synthetic-deliberate-injection per-persona regression detection. New surface:
4 unified-diff fixtures (each ~16-25L) carrying planted defects, 4 expected-
finding signature JSONs, 2 bash scripts (`run-synthetic.sh` orchestrator at
~100L; `match-synthetic.sh` pure matcher at ~60L), 1 CI workflow at ~55L. No
`src/` touches; no auth flows; no DB queries; no UI; runtime-only invocation
of the pinned Anthropic Claude Code CLI (`@anthropic-ai/claude-code@2.1.126`).

| # | Item | Status | Note |
|---|---|---|---|
| 1 | Data classification | N/A | Fixtures contain synthesised placeholder defects (no real PII or secrets). Persona files are repo-committed (public source). Brief composition concatenates persona body + nonce + fixture content into a temp file deleted on script exit. |
| 2 | Env vars / secrets handling | PASS | `ANTHROPIC_API_KEY` consumed via `secrets.ANTHROPIC_API_KEY` → workflow `env:` block → process env. Never logged; never echoed; never written to disk. Runner short-circuits to skip-with-neutral-exit on unset. |
| 3 | Auth / session boundaries | N/A | No auth surface. |
| 4 | RLS coverage | N/A | No DB queries. |
| 5 | Input validation at system boundaries | PASS | Runner validates persona / fixture / expected files exist before any `claude -p` invocation; missing inputs produce explicit FAIL with diagnostic, not a confusing API error. Matcher validates JSON inputs via `jq` (malformed JSON → jq parse error → exit 2). |
| 6 | Logging — no secrets / PII | PASS | Runner emits status + dimension names + matcher diagnostics to stderr; no API key echoing; brief content (which contains the persona prompt) is NOT logged. Failure diagnostics include the actual envelope (which is the persona's output, not its input — no secret risk). |
| 7 | Dev/prod boundary | N/A | Harness is CI/local-only; not bundled into any production code path. |
| 8 | Third-party SDK handling | PASS | `@anthropic-ai/claude-code` CLI pinned at `2.1.126` in lockstep with `.github/workflows/auto-review.yml`. `npx -y` fetches over registry HTTPS at run time; CI-only execution; checksum integrity carried by npm registry. `jq` + `openssl` + bash builtins are system-installed on ubuntu-latest runner. |
| 9 | Safeguarding signposting | N/A | No user-facing copy. |
| 10 | Pen-test surface change | **NEW (NEUTRAL)** | Synthetic fixtures themselves are exhibits of anti-patterns (XSS via `dangerouslySetInnerHTML` in `security.diff`; inline SQL string concatenation in `architecture.diff`). **Mitigation:** fixtures are NEVER applied to a working tree (`git apply` is not invoked anywhere in the harness); they are read as plain text and fed as fenced evidence to `claude -p` stdin. No code path executes the planted defects. Comment-review hook skip-list at `.claude/hooks/comment-review.sh` excludes `tests/personas/synthetic/*` so that the deliberate anti-pattern content does not trip write-time author hooks. |
| 11 | Per-slice security DoD covered | PASS | This checklist is the per-slice DoD. |
| 12 | Verdict-coercion attack surface | **PASS — inherited** | Synthetic fixture content could attempt prompt-injection (e.g., `</pr-diff-NONCE>` in fixture text trying to break out of fence). **Mitigation:** per-invocation 16-byte hex nonce derived via `openssl rand -hex 16` (or `/dev/urandom` fallback) makes fence-breakout content not collide with the actual fence boundary; persona files already carry the verdict-coercion guard per spec 72c §5 rule 3. Synthetic harness reuses the existing guard via the same persona file body — no additional surface. |
| 13 | Audit trail | PASS | All changes captured in PR diff + slice `acceptance.md` + this file + `verification.md` final-state record. Workflow log captures each run's stdout/stderr; fixture content is plain text in repo. |

**Net: 7 PASS / 1 NEW-SURFACE-NEUTRAL / 5 N/A / 0 FAIL.**

## Threat model — synthetic fixtures as attack surface

The new fixtures contain deliberately-planted defects. The relevant threat
question: *"can the fixture content reach a context where it is executed
rather than text-evaluated?"*

1. **`security.diff`** carries an unsanitised `dangerouslySetInnerHTML` line.
   The diff is read by `cat` into a brief and piped to `claude -p` stdin. It
   is never applied via `git apply`, never imported, never compiled. The
   target string (`comment.body`) does not exist in the codebase as a real
   identifier. **Not exploitable.**
2. **`architecture.diff`** carries an inline SQL `UPDATE users SET status =
   '${next}'` template-literal. Same reasoning: text-only evidence; never
   executed; the `pg.Pool` import does not become a real import. **Not
   exploitable.**
3. **`correctness.diff`** carries a logic bug in pagination math. Not a
   security defect at all; included for completeness of the 4-partition.
4. **`style.diff`** carries a doc comment with PR/round/session provenance
   (the rotting-lineage anti-pattern). Not security-relevant.

The only path where fixture content reaches an executor is the LLM itself,
which evaluates the diff against its persona rubric and emits a JSON envelope.
That is the intended use; the LLM does not execute the diff content as code.

## Out-of-scope risks (acknowledged)

- **Fixture content drift** — if a future contributor edits a fixture to
  insert a real exploit (e.g., a working RCE payload masquerading as a
  planted defect), there is no automated guard. **Mitigation:** CODEOWNERS
  protects `tests/personas/**` (verified via existing CODEOWNERS file);
  every fixture edit requires code-owner review per the solo-operator
  admin-bypass discipline.
- **`claude -p` CLI version drift** — if `auto-review.yml` bumps its CLI pin
  but `run-synthetic.sh` does not, synthetic-injection signal becomes
  incomparable to production review. **Mitigation:** AC-3 declares the
  lockstep requirement; reviewer-architecture should flag any single-side
  bump. Future v3c slice could add a CI check that grep-asserts the two
  versions match.
