# S-INFRA-rigour-v3b-subagent-suite — Verification

**Slice:** S-INFRA-rigour-v3b-subagent-suite
**Source:** `docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md`
**Branch:** `claude/audit-v3b-pr24-merge-YUwug`
**Status:** S-3 GREEN (AC-14 only) — 1/15 ACs landed; remaining 14 carry to S-4 onwards per acceptance.md group order (A → B → C → D → E).

S-INFRA-rigour-v3b-subagent-suite is an **infrastructure / process-rigour** slice — extends v3a's controls with adversarial subagents, harness hooks, doc rubrics, and process levers. No user-facing surface. Verification reduces to: meta-tests pass, CI gates GREEN, and per-AC evidence with run-IDs.

---

## Per-AC evidence

Group ordering per acceptance.md L75 + S-3 priority pull-forward (AC-14 first per kickoff §P0):

| AC | Group | Status | Evidence (commit · run-ID) |
|---|---|---|---|
| AC-1 (slice-reviewer persona) | A | PENDING | S-4 onwards. |
| AC-2 (acceptance-gate persona) | A | PENDING | S-4 onwards. |
| AC-3 (ux-polish-reviewer persona) | A | PENDING | S-4 onwards. |
| AC-4 (retain/drop metric) | A | PENDING | S-4 onwards. |
| AC-5 (`.claude/agents/` vs `subagent-prompts/` reconciliation) | A | PENDING | S-4 onwards. |
| AC-6 (`tdd-guard` wrapper hook) | B | PENDING | S-4 onwards. |
| AC-7 (pre-push DoD-7 gate) | B | PENDING | S-4 onwards (load-bearing for H6 RED-tests-first temporal ordering procedural fix). |
| AC-8 (TDD bail-out rubric) | C | PENDING | S-4 onwards. |
| AC-9 (preview-deploy checklist) | C | PENDING | S-4 onwards. |
| AC-10 (adversarial-review budget rubric) | C | PENDING | S-4 onwards. |
| AC-11 (L199 amendment — three protected-path omissions) | D | PENDING | S-4 onwards. |
| AC-12 (`line-count.sh` re-baseline structural fix) | D | PRIORITY-BUMP | S-4 first; 5+ evidence points (sessions 32/40/41/41-fu/42/43). |
| AC-13 (lcov parser shellspec meta-test) | D | PENDING | S-4 onwards. |
| AC-14 (@vitest/coverage-v8 activation) | D | **PASS** | RED `6b61073` · CI run [`25020431032` job `73279289462`](https://github.com/rossdelarge247-debug/construct_d_01/actions/runs/25020431032/job/73279289462) → `failure` on the two new wiring assertions (H6 RED-state observed). GREEN `09e1de5` · CI run pending verification. Evidence detailed below. |
| AC-15 (plan-review default-spawn flip) | E | PENDING | S-4 onwards (measurement protocol; flip-decision after data). |

### AC-14 — `@vitest/coverage-v8` activation (S-3 GREEN)

**Outcome (per acceptance.md L106-110):** v3a's dormant Gate 5 coverage parser (verify-slice.sh L160-) is now active — every CI run on this branch produces `coverage/lcov.info` via @vitest/coverage-v8. Subsequent ACs benefit from active coverage signal on PR diffs.

**Verification artefacts (4 wiring + 1 meta-test):**

1. **package.json devDep** — `@vitest/coverage-v8: ^4.1.3` added at `09e1de5`; matches installed `vitest@4.1.3`. Lockfile churn ~285L (new package + transitive deps; no version bumps to existing deps).
2. **vitest.config.ts** — `reportsDirectory: './coverage'` added explicitly (matches hardcoded path in `scripts/verify-slice.sh:166`). `thresholds.lines: 90` global gate REMOVED (Out-of-scope per AC-14 acceptance text "hitting the 90% floor (data-driven; reflects state of v3a tests + onwards)"; gate-of-record is verify-slice.sh Gate 5 PR-diff-based check).
3. **.github/workflows/ci.yml** — test job runs `npm test -- --coverage`; `actions/upload-artifact@v4` step captures `coverage/` directory (retention 7 days, `if-no-files-found: error` enforces AC-14 sanity floor at the artefact layer).
4. **scripts/verify-slice.sh** — Gate 5 header comment at L160-168 cites v3a AC-6 + L178 + v3b AC-14 activation. Parser logic unchanged (already correct per v3a session-40 commit `95481e5`).
5. **tests/unit/coverage-wiring.test.ts** (RED at `6b61073`) — vitest meta-test asserting `package.json` declares `@vitest/coverage-v8` AND ci.yml invokes `--coverage`. Both assertions RED at RED-commit; GREEN after `09e1de5`.

**Local verification:**
- `npx vitest run tests/unit/coverage-wiring.test.ts` → 2 failed (RED state) at `6b61073`.
- `npx vitest run` (full suite) → 92 passed | 2 failed at `6b61073`; no regression in 13 existing files / 92 existing tests.
- `npm test -- --coverage` (post-GREEN) → exit 0; 94 tests passed; `coverage/lcov.info` 124KB with SF: blocks for all included src/ files.
- Coverage data non-zero per AC-14 sanity floor: Statements 2.16% (88/4069), Lines 2.39% (85/3556), Functions 2.56% (23/897), Branches 1.22% (36/2940).

**CI verification:**
- RED state CI-observed: PR #25 first run on `6b61073` — `Unit + logic tests` job → `failure` (run [`25020431032` job `73279289462`](https://github.com/rossdelarge247-debug/construct_d_01/actions/runs/25020431032/job/73279289462)). All 12 other checks: success.
- GREEN state CI-observed: pending — fill in run-ID + job-ID at slice wrap.

**H6 manual RED-tests-first temporal ordering (per acceptance.md DoD-7):**
- RED `6b61073` pushed at `2026-04-27T21:25Z`; CI `failure` observed at `2026-04-27T21:27:08Z`.
- GREEN `09e1de5` pushed at `2026-04-27T21:30Z` — AFTER CI-observed-failing of RED, satisfying H6 temporal-ordering requirement that v3a session 40 self-flagged as procedurally-gapped (acceptance.md verification.md §"Adversarial review — session 40").
- Procedural gate (v3b AC-7 pre-push hook) will close this dependency once shipped at S-N.

**Three-condition AND for "is-GREEN-impl" per AC-7 (R-5 resolution):**
1. Commit-msg matches `^GREEN:` ✓ (`GREEN: AC-14 — activate @vitest/coverage-v8 (...)`)
2. Prior commit on branch matches `^RED:` ✓ (`6b61073` = `RED: AC-14 — coverage wiring assertions (vitest)`)
3. Diff intersection of RED test paths AND impl paths is non-empty ✓ (RED at `tests/unit/coverage-wiring.test.ts` asserts `package.json` devDeps + `ci.yml --coverage`; GREEN modifies both)

**Doc-attribution carry-over note:** AC-14 (acceptance.md L108) cites "≥90% threshold per spec 72 F6" but `docs/workspace-spec/72-engineering-security.md` has no F6/coverage/90% references. F6 is a v3a-internal acceptance.md framework label (v3a acceptance.md L46 + L51 + L178). Comments in `vitest.config.ts` + `scripts/verify-slice.sh` updated to cite v3a `acceptance.md` directly (canonical source). Surfacing for v3b carry-over consideration; not gating S-3 ship.

---

## Golden path

Infra slice — substituted by **control-plane sanity check**: every gate exposes the spec-named CLI, runs against tmp-isolated fixtures or real-repo state, emits G17-pattern useful-message exits on failure. AC-14 specifically: `npm test -- --coverage` → `coverage/lcov.info` populated → `scripts/verify-slice.sh --full <slice>` Gate 5 reads the lcov + enforces PR-diff threshold.

## Edge cases

| Scenario | Coverage |
|---|---|
| Coverage data absent (e.g. local pre-commit before deps installed) | verify-slice.sh Gate 5 skip-allow path (L167 `if [ -f "$COVERAGE_FILE" ]`) — defensive resilience retained post-activation. |
| Global coverage <90% at activation time (real state ~2%) | `thresholds.lines` removed from vitest config — global gate would block CI. Per-PR-diff gate (Gate 5) is canonical. |
| New src/ lines uncovered ≥10% | Gate 5 fail-loud with file:line citation per acceptance.md L195-202 (existing behaviour, exercised at next AC adding src/). |

## Accessibility · Responsive viewport · Cross-browser

N/A — no UI surface.

## Adversarial review — S-3 (DoD-3, partial)

To be filled in at GREEN review pass. Subagent or `/review` skill output captured here; concerns addressed or deferred with reasoning.

## Sign-off

Per slice-wrap PR (S-3 close — last AC of v3b ships, OR explicit early-ship of S-3 only).
