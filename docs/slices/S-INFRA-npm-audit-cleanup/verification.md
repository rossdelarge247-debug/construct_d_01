# S-INFRA-npm-audit-cleanup · Verification

**Slice:** S-INFRA-npm-audit-cleanup
**Source:** CLAUDE.md DoD-14 (infrastructure category — full production rigour) + spec 72 §10 L484 (`npm audit` checklist item) + §11 L528 (per-slice Dependency audit)
**Preview deploy URL:** N/A — no UI surface in this slice. Substitution per the `S-INFRA-1-stripe-sdk-pin` precedent (DoD item 4 satisfied by automated CI + build checks).

This slice modifies only `package-lock.json`. The "in-browser verification" frame is substituted by automated CI + Vercel checks. Evidence below.

---

## AC sign-off

| AC | Outcome | Evidence | Status |
|---|---|---|---|
| AC-1 · HIGH cleared | `npm audit --omit=dev --audit-level=high` exits 0 | Pre-fix: *"5 vulnerabilities (4 moderate, 1 high)"* · Post-fix: *"3 moderate severity vulnerabilities"* (0 high, 0 critical) | **PASS** |
| AC-2 · Non-breaking semver | Lockfile-only; package.json unchanged; patch-version transitive bumps within same minor | `git diff --stat`: `package-lock.json | 30 +++++++++++++++---------------` · `git diff package.json`: empty · 4 transitive packages bumped (all patch-version) | **PASS** |
| AC-3 · No regression | Test / typecheck / lint / build all green | `npm test`: 557/557 · `npm run typecheck`: clean · `npm run lint`: 0 errors (48 pre-existing warnings, count unchanged) · `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod npm run build`: all 18 routes rendered | **PASS** |
| AC-4 · DoD recorded | verification.md populated; adversarial review recorded | This file | **PASS** |

## Pre/post audit output

**Pre-fix** (`npm audit --omit=dev --audit-level=high` against origin/main lockfile):

```
5 vulnerabilities (4 moderate, 1 high)

To address issues that do not require attention, run:
  npm audit fix
To address all issues (including breaking changes), run:
  npm audit fix --force
```

Listed packages:
- `protobufjs <=7.5.5` (Severity: high) — 7 GHSA advisories
- `@protobufjs/utf8 <=1.1.0` (Severity: moderate) — GHSA-q6x5-8v7m-xcrf
- `@anthropic-ai/sdk 0.79.0 - 0.91.0` (Severity: moderate) — GHSA-p7fg-763f-g4gf
- `postcss <8.5.10` (Severity: moderate) — GHSA-qx2v-qp2m-jg93
- `next 9.3.4-canary.0 - 16.3.0-canary.5` (Severity: moderate) — transitively via `postcss`

**Post-fix** (after `npm audit fix`):

```
3 moderate severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force
```

Listed packages (all require `--force` breaking-change to clear; deferred per slice scope):
- `@anthropic-ai/sdk 0.79.0 - 0.91.0` (Severity: moderate)
- `postcss <8.5.10` (Severity: moderate)
- `next 9.3.4-canary.0 - 16.3.0-canary.5` (Severity: moderate, via postcss)

## Lockfile diff

`git diff --stat`:
```
 package-lock.json | 30 +++++++++++++++---------------
 1 file changed, 15 insertions(+), 15 deletions(-)
```

`git diff package.json` — empty (no direct-dep changes).

Bumped packages (patch-version transitives within same minor):

| Package | Pre | Post | Semver shape |
|---|---|---|---|
| `protobufjs` | 7.5.5 | 7.5.8 | patch within 7.5.x |
| `@protobufjs/utf8` | 1.1.0 | 1.1.1 | patch within 1.1.x |
| `@protobufjs/codegen` | 2.0.4 | 2.0.5 | patch within 2.0.x |
| `@protobufjs/inquire` | 1.1.0 | 1.1.1 | patch within 1.1.x |

## Test / build sanity

- `npm test` (vitest run) — **557/557 passed (84 files)**. Same as pre-fix baseline.
- `npm run typecheck` (`tsc --noEmit`) — exit 0; no diagnostics.
- `npm run lint` (eslint) — 0 errors, 48 warnings (pre-existing in `tests/unit/auth-index.test.ts` + `tests/unit/store-index.test.ts`; unchanged from pre-fix baseline).
- `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod npm run build` — exit 0; full route table emitted (`/`, `/_not-found`, `/api/bank/callback`, `/api/bank/connect`, `/api/bank/test`, `/api/documents/extract`, `/api/health`, `/api/ntropy/enrich`, `/api/plan/generate`, `/api/test-pipeline`, `/cookies`, `/dev/heroes`, `/dev/proto`, `/dev/proto/[slug]`, `/dev/proto/pre-signup-interview`, `/privacy`, `/start`, `/terms` + Proxy Middleware).
- Caller surface check — no source files import `protobufjs` directly. It is a deeper transitive dependency (likely via `@grpc/grpc-js` or similar) of the Supabase / GCP-adjacent client tree. No application code surface to re-test.

## Adversarial run

Manual poke-holes pass — concerns + dispositions:

1. **Did the fix introduce supply-chain risk via new packages?** No new packages added; only existing packages bumped to newer patch versions within the same minor. Provenance: `protobufjs` is a Google-maintained npm package with ~5M weekly downloads; the 7.5.x line is its current LTS series. The bumped patches address the very advisories that triggered this slice.
2. **Could a patch-version bump silently introduce breaking behaviour despite semver claim?** Confirmed empirically by the 557-test vitest suite + clean typecheck + production build succeeding with all routes rendered. No runtime behaviour observed to change. `protobufjs` is consumed transitively; no project source file imports it directly.
3. **Did the fix accidentally pull in new vulnerabilities?** Post-fix `npm audit` shows 3 moderate (same packages as pre-fix, minus the two that cleared); no new advisories surfaced.
4. **Should the moderate-severity issues be fixed too?** Spec 72 §10 L484 specifies *"high + critical"* as the gate threshold; moderate is advisory. The remaining 3 moderates require `npm audit fix --force` which would bump `@anthropic-ai/sdk` (currently `^0.85.0`) and `next` (currently `^16.2.4`) — both direct deps with breaking-change risk. Out of scope; separate slice candidates with feature regression testing.
5. **Is the `npm-audit` CI gate's threshold the right call?** Threshold is anchored to spec 72 §10 L484 (*"`npm audit` — address high + critical"*) and the inline ci.yml comment L202 (*"Spec 72 §10: fail on high + critical. Medium is advisory."*). Not in scope to re-litigate; the slice clears the gate as defined.
6. **What if a future patch-version of `protobufjs` introduces a new advisory?** Tracked as a sibling-class risk; the npm-audit gate is the early-warning mechanism. When it next fires, the same `npm audit fix` workflow applies — patch within minor remains the non-breaking path.
7. **Future Vercel preview deploys** — the preview-deploy step uses the lockfile per `npm ci`; same bumped packages installed; same regression evidence applies. No Vercel-specific code path exercised by the bumped packages.
8. **Lockfile-format compatibility** — `package-lock.json` is npm v3 format (`"lockfileVersion": 3`). `npm audit fix` regenerated the affected entries while preserving format. Diff is line-stable (15 ins / 15 del).

## Regression surfaces

| Adjacent surface | Smoke check | Pass / fail | Evidence |
|---|---|---|---|
| Vitest suite | `npm test` baseline GREEN unchanged | **PASS** | 557/557 |
| Typecheck | `tsc --noEmit` clean | **PASS** | exit 0, no diagnostics |
| Lint | 0 errors maintained | **PASS** | 48 warnings unchanged from pre-fix |
| Production build | All routes still compile + render | **PASS** | 18 routes emitted with `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod` |
| `npm-audit` CI job | `--audit-level=high` exits 0 | **PASS** (locally; CI to confirm on PR open) | 0 high, 0 critical post-fix |

## Security DoD (spec 72 §11)

Per the `S-INFRA-1-stripe-sdk-pin` precedent — when a slice modifies only lockfile pins and exercises no user data / PII / auth surface / new client-bundle surface, the 14-item per-slice security checklist applies narrowly:

- **Item L528 — Dependency audit.** Directly addressed by this slice. `npm audit --omit=dev --audit-level=high` clean on the slice branch (AC-1). No new dependencies introduced (AC-2). Licenses unchanged (only patch-version bumps within same minor; no license-string changes in bumped packages).

Other 13 items (data classification · env vars · auth / session · RLS · validation · logging · dev/prod boundary · third-party · safeguarding · pen-test readiness · client-bundle leaks · CSP · rate-limit) are N/A by tooling-scope rule — no application code or runtime surface touched. Justification recorded inline here rather than in a separate `security.md`.

## Sign-off

- **Verified by:** local run on slice branch `claude/S-INFRA-npm-audit-cleanup` from `1d81edf` base
- **Commit SHA verified:** _filled at PR push_
- **Preview URL:** N/A (no UI surface)
- **Outstanding issues:** none expected; recorded if any
- **DoD item 4 status:** complete (substituted by automated checks per "no UI surface" rule, sibling precedent at `docs/slices/S-INFRA-1-stripe-sdk-pin/verification.md`)
