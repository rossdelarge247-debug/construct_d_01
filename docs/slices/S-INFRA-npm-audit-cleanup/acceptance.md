# S-INFRA-npm-audit-cleanup · `npm audit fix` for protobufjs HIGH — Acceptance criteria

**Slice:** S-INFRA-npm-audit-cleanup
**Category:** infrastructure
**Spec ref:** `docs/workspace-spec/72-engineering-security.md` §10 "Pen-test readiness checklist" L484 (*"`npm audit` — address high + critical"*) · §11 L528 (*"**Dependency audit.** `npm audit` clean on the slice branch (high + critical); new dependencies justified; licenses checked."*)
**Phase(s):** Infrastructure (no user-visible product surface)
**Status:** In implementation

---

## Context

The `npm-audit` CI gate (`.github/workflows/ci.yml` L190-203, *"Spec 72 §10: fail on high + critical. Medium is advisory."*) has been failing on the HIGH-severity vulnerability in `protobufjs` (transitive; 7 CVEs spanning DoS / code-injection / prototype-pollution). The npm audit hint `fix available via npm audit fix` indicates a non-breaking patch-version bump is available within the same minor — no direct-dep upgrade required. This slice applies that non-breaking fix to clear the gate.

Pre-fix vulnerability tally (`npm audit --omit=dev --audit-level=high` against origin/main lockfile):

| Package | Severity | CVE count | Fix command |
|---|---|---|---|
| `protobufjs` (transitive) | HIGH | 7 | `npm audit fix` (non-breaking) |
| `@protobufjs/utf8` (transitive) | moderate | 1 | `npm audit fix` (non-breaking) |
| `@anthropic-ai/sdk` (direct) | moderate | 1 | `npm audit fix --force` (breaking; deferred) |
| `postcss` via `next` (transitive) | moderate | 1 | `npm audit fix --force` (breaking; deferred) |
| `next` (direct, transitive carrier) | moderate | (carries postcss) | `npm audit fix --force` (breaking; deferred) |

Pre-fix totals: **5 vulnerabilities (4 moderate, 1 HIGH)**. The CI gate fails at `--audit-level=high` — the lone HIGH is the gate-blocker.

Post-fix totals (verified locally on this slice branch): **3 vulnerabilities (3 moderate, 0 HIGH)**. The CI gate threshold is cleared.

## Dependencies

- **Upstream slices:** none (infra-only; orthogonal to product slices in flight)
- **Open decisions required:** none
- **Re-use / Preserve-with-reskin paths touched:** `package-lock.json` (lockfile-only patch-version transitive bumps; `package.json` direct-dep declarations unchanged)
- **Discarded paths deleted at DoD:** none

## MLP framing

The loveable floor: **the `npm-audit` gate stops appearing on every PR as a known-failing check, so reviewers and future-Claude-sessions don't need the "ignore the red, it's pre-existing" footnote to read PR signal.** Removes one durable carve-out from the prototype-iteration CI experience. No user-visible behaviour changes.

---

## AC-1 · HIGH-severity vulnerability cleared from production dependency tree

- **Outcome:** `npm audit --omit=dev --audit-level=high` exits 0 on the slice branch. The npm-audit CI job (`.github/workflows/ci.yml` L190-203) reports `success` on the slice PR.
- **Verification:** `npm audit --omit=dev --audit-level=high` returns *"3 moderate severity vulnerabilities"* (no high, no critical) post-fix, vs *"5 vulnerabilities (4 moderate, 1 high)"* pre-fix. CI check-run conclusion is `success` for the `npm audit (high + critical)` job on the slice PR.
- **In scope:** HIGH and CRITICAL severity vulnerabilities only. Moderate vulnerabilities that incidentally clear via the same `npm audit fix` (e.g. `@protobufjs/utf8`) are a sibling-benefit but not the AC contract.
- **Out of scope:** Moderate vulnerabilities requiring `npm audit fix --force` (breaking changes to `@anthropic-ai/sdk` direct-dep and `next`/`postcss` direct-dep). These need feature regression testing and a separate slice.
- **Opens blocked:** none
- **Loveable check:** The reviewer's PR checks panel reads as a clean signal. Failed checks are real signal, not noise.
- **Evidence at wrap:** `npm audit` pre/post output recorded in verification.md; CI check-run conclusion recorded.

## AC-2 · Non-breaking semver — lockfile-only changes

- **Outcome:** `git diff --stat` against origin/main shows only `package-lock.json` modified. `git diff package.json` produces empty output. All bumped packages are patch-version (third segment) transitive resolutions within the same minor version.
- **Verification:** `git diff --stat` output recorded in verification.md. Bumped-package table lists each transitive change with pre/post version pair and confirms semver-patch shape.
- **In scope:** Lockfile-only diff per `npm audit fix` (non-breaking) recommendation.
- **Out of scope:** Direct-dep version range changes in `package.json` (require breaking-change review; deferred). Other transitive packages outside the audit-fix recommendation set.
- **Opens blocked:** none
- **Loveable check:** Semver contract is honoured. Reviewers can read the diff in 30 seconds and confirm the change is scope-bounded to dependency hygiene.
- **Evidence at wrap:** `git diff --stat` + bumped-package table in verification.md.

## AC-3 · No regression in existing test suite, typecheck, lint, or production build

- **Outcome:** `npm test` reports 557/557 passing (matches pre-fix baseline). `npm run typecheck` exits 0. `npm run lint` reports 0 errors (48 pre-existing warnings carry, count unchanged). `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod npm run build` completes with all routes rendered.
- **Verification:** Command outputs recorded in verification.md.
- **In scope:** Existing test/typecheck/lint/build coverage as regression evidence. The dependency tree's runtime surface is covered by the existing 557-test vitest suite + production build's route-collection step.
- **Out of scope:** New tests for the lockfile-only change. There is no logic-under-test introduced — the work is dependency-tree hygiene; the regression evidence is the unchanged behaviour of the existing surface against the bumped tree.
- **Opens blocked:** none
- **Loveable check:** The existing test contract holds; the build still emits the same routes; no surprise.
- **Evidence at wrap:** `npm test` / `npm run typecheck` / `npm run lint` / `npm run build` output excerpts in verification.md.

## AC-4 · Slice DoD + spec 72 dependency-audit framing recorded

- **Outcome:** verification.md AC sign-off table populated; adversarial review pass recorded; spec 72 §10+§11 dependency-audit framing addressed (HIGH cleared; moderates deferred with reasoning).
- **Verification:** verification.md file present at `docs/slices/S-INFRA-npm-audit-cleanup/verification.md` with all sections populated.
- **In scope:** verification.md content per the infrastructure category's full DoD-14 expectation (with no-UI-surface substitution rule for DoD item 4 per the `S-INFRA-1-stripe-sdk-pin` precedent).
- **Out of scope:** spec amendment work on spec 72 §10 (the gate itself stays as-is; the slice clears the failing condition).
- **Opens blocked:** none
- **Loveable check:** Future sessions can read this slice and know exactly what was changed, why, and what was deferred — no carve-out lineage to reconstruct from `git log`.
- **Evidence at wrap:** verification.md sections complete; this acceptance.md frozen.

---

## In scope

- `package-lock.json` updates from `npm audit fix` (non-breaking only)
- `docs/slices/S-INFRA-npm-audit-cleanup/{acceptance,verification}.md`

## Out of scope

- `--force` breaking-change upgrades (`@anthropic-ai/sdk`, `postcss` via `next`) — separate slice candidate; risk profile differs (direct-dep major-version bumps require feature regression testing)
- Other pre-existing CI failures (`spec-citation-quote-check`) — separate carry, tracked under SESSION-CONTEXT §"Active pre-existing CI failures"
- Spec 72 §10 pen-test readiness work beyond the `npm audit` checklist item — production-graduation gate, not prototype iteration

## References

- `.github/workflows/ci.yml` L190-203 (npm-audit gate def)
- `docs/workspace-spec/72-engineering-security.md` §10 L427 (pen-test readiness checklist) + L484 (`npm audit` line) + §11 L528 (per-slice Dependency audit)
- `docs/HANDOFF-SESSION-96.md` §"What could improve" + §"What happened" §"User question on npm audit gate"
- `docs/SESSION-CONTEXT.md` L23 (P1 priority) + L124 (active CI failures carry)
- `docs/slices/S-INFRA-1-stripe-sdk-pin/` (precedent infra-only lockfile slice structure)
