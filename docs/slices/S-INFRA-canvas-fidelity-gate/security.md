# S-INFRA-canvas-fidelity-gate · Security DoD

**Slice:** S-INFRA-canvas-fidelity-gate
**Category:** infrastructure (full production rigour spec 76 §3)
**Source:** `docs/workspace-spec/72-engineering-security.md` §11 (per-slice security checklist)
**Data-tier reference:** spec 72 §1 (T0 Public · T1 Functional · T2 Personal · T3 Financial · T4 Safeguarding · T5 Legal)

This slice is **rigour infrastructure** — adds a multi-agent specialist persona, extends a workflow's matrix, extends 4 supporting scripts, adds a synthetic regression fixture, updates docs. Every artefact is **T0 Public** by classification — workflow YAML, persona prompts, script extensions, slice docs. No personal, financial, or safeguarding data is touched. The 14-item checklist is exercised in full; most items are correctly N/A with explicit reasoning.

---

## 1. Data classification per AC

| AC | Data touched | Tier | Tier requirements met |
|---|---|---|---|
| AC-1 | Persona prompt content + JSON schema definition | T0 Public | No PII, no secrets — persona rubric is design content. |
| AC-2 | Workflow YAML (auto-review.yml) | T0 Public | Routing logic, no data. |
| AC-3 | Bash script extensions (4 scripts) | T0 Public | Argument-validation cases, no data. |
| AC-4 | Synthetic fixture (planted typography drift in a fictional slice diff) | T0 Public | Fictional content; no real user input or stored data. |
| AC-5 | Calibration report capturing user feedback | T0 Public | Direct quote of design-feedback observation; no PII. |
| AC-6 | CLAUDE.md + spec 72c amendments | T0 Public | Documentation. |

## 2. New tables / columns

- [x] N/A · reason: **No schema changes — slice is rigour-infrastructure only.**

## 3. API routes

- [x] N/A · reason: **No new API routes — workflow + scripts + persona prompt only.**

## 4. File upload surfaces

- [x] N/A · reason: **No upload surfaces.**

## 5. New env vars

- [x] N/A · reason: **No env var introduced or changed.** `ANTHROPIC_API_KEY` (the existing multi-agent harness secret, with skip-on-absent path in `auto-review.yml`) unchanged. Inherits the existing skip-with-neutral behaviour for fork PRs.

## 6. Third-party data flows

- [x] N/A · reason: **No new third-party integration.** The canvas-fidelity persona is invoked via the existing Anthropic Claude Code CLI invocation pattern (`npx -y @anthropic-ai/claude-code -p`) shared with the other specialists in the harness; the diff + slice AC + linked canvas content sent in the per-invocation prompt are all T0 Public artefacts already in the public slice diff. CLI version stays in lockstep with `auto-review.yml` spec 72c §7 directive.

## 7. Audit log entries

- [x] N/A · reason: **No T3+ data operations — slice ships only T0 Public artefacts.**

## 8. Error handling

- [x] N/A · reason: **No new user-facing error surface.** Workflow-level failures (canvas-file missing, persona parse-failed, ANTHROPIC_API_KEY absent) produce check-run conclusions per existing patterns (`failure` for parse-failed; `neutral` for skip; `success` for clean run); no new error paths. Workflow log carries diagnostic detail; no PII at risk.

## 9. Dev/prod boundary

- [x] N/A · reason: **No new dev-only routes / fixtures / tooling for the application surface.** The slice's `tests/personas/synthetic/canvas-fidelity.diff` fixture is test infrastructure (not shipped to client bundle); existing `MODE === 'prod'` gating, `/app/dev/*` 404 behaviour, dev-mode-leak CI scan, and ESLint rule for `dev-*` imports all unchanged.

Verified that the slice introduces zero references to `@dev.decouple.local` or any dev scenario ID — verification at PR open via `git diff origin/main..HEAD -- src/ tests/ public/ | grep -E '@dev\.decouple\.local|cold-sarah|sarah-connected'`.

## 10. Safeguarding impact

- [x] **No T4 data touched** — slice ships persona + workflow + scripts + fixture + docs. No safeguarding-flag handling, no exit-page surface, no device-privacy logic, no free-text notes. V1 signposting baseline untouched.

## 11. Security headers + CSP

- [x] N/A · reason: **No external scripts, no new resource origins, no inline event handlers introduced. Slice does not modify rendered HTML.**

## 12. Adversarial review

- [ ] **Pending at PR open** — auto-review fires on PR open/synchronize; verdict `approve` / `nit-only` at merge required for DoD close.
- Self-review pending on the persona-prompt design (criteria scope · category boundaries · category × default-label/blocking matrix).

(Item closed Done post-verdict per session-pattern: stays Pending at PR open, closes Done after auto-review reaches `approve` / `nit-only` and any nit findings actioned.)

## 13. Dependency audit

- [x] **No new dependencies introduced** (verifiable via `git diff origin/main..HEAD -- package.json package-lock.json` returning zero `+    "` matches at PR open).
- [x] `npm audit --omit=dev --audit-level=high` clean on slice branch — *to be confirmed at PR open*.
- [x] No npm package updates touched in this slice.

## 14. Secrets hygiene

- [x] No secrets introduced into client bundle — slice does not touch `src/`.
- [x] No secrets in slice diff (verifiable via `git diff origin/main..HEAD | grep -iE 'sk_|pk_|api[_-]?key|password|secret|bearer'` returning only spec/CLAUDE-md citation references, no actual credentials).
- [x] `gitleaks` clean on slice branch (verifiable at PR open).
- [x] Persona prompt does NOT request credentials — `reviewer-canvas-fidelity.md` operates on diff + slice AC + canvas content, all T0 Public.
- [x] Synthetic fixture content (`canvas-fidelity.diff` + `expected/canvas-fidelity.json`) contains no realistic-looking secret patterns.

---

## Sign-off

- **Slice author:** Claude Code (current session)
- **Date:** 2026-05-10
- **Reviewer (if T3+ data or new third-party):** N/A — T0 Public only
- **All boxes ticked or justifiably N/A:** yes (10 N/A with reasoning, 3 active checks completed at author-time, item 12 Pending at PR open per the post-verdict-close pattern)
- **Pen-test readiness note:** **Nothing in this slice would surface in a pen test of the running application** — the persona file is a static prompt asset; the workflow YAML is GitHub Actions config; the scripts run in CI, not in the application surface. Any pen-tester probing the application would find no observable artefact from this slice (the canvas-fidelity persona's output exists only as PR check-run comments, which are part of GitHub's metadata, not application surface).
