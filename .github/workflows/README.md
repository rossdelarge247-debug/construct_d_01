# CI workflows

Source of truth for the CI gates named in:
- `docs/workspace-spec/71-rebuild-strategy.md` §7 Phase C.0 (ops setup)
- `docs/workspace-spec/72-engineering-security.md` §2 (env-var rules) + §7 (dev/prod boundary) + §10 (pen-test readiness)

---

## Workflows

### `ci.yml` — Main CI

Runs on PRs + push to `main` / `phase-c` / `phase-c/**`.

| Job | Gate | Spec ref |
|---|---|---|
| `lint` | `npm run lint` (eslint) | CLAUDE.md Engineering conventions |
| `typecheck` | `npm run typecheck` (tsc --noEmit) | CLAUDE.md Engineering conventions |
| `test` | `npm test` (vitest run) | CLAUDE.md Engineering conventions + per-slice DoD item 2 |
| `build` | `next build` with `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod` | Spec 71 §4 + spec 72 §7 |
| `env-var-regex-ban` | Fail if any `NEXT_PUBLIC_*_(KEY\|SECRET\|TOKEN\|PASSWORD\|PRIVATE)` name found | Spec 72 §2 hard rule 2 |
| `dev-mode-leak` | Post-build grep for `@dev.decouple.local`, `decouple:dev:*`, `dev-session`, `dev-store`, `dev-auth-gate`, scenario IDs | Spec 72 §7 items 2-3 |
| `npm-audit` | `npm audit --omit=dev --audit-level=high` — fail on high + critical | Spec 72 §10 pre-pen-test checklist |

### `gitleaks.yml` — Secrets scan

Runs on PRs (diff) + push to `main` / `phase-c` (full history). Uses `gitleaks/gitleaks-action@v2`.

Spec ref: spec 72 §2 hard rule 5.

---

## Concurrency

`ci.yml` cancels in-progress runs on the same ref when a new push arrives. Prevents stale Preview deploys from consuming CI minutes.

---

## Not yet wired (require downstream code)

These gates are named in spec 72 but depend on code that hasn't shipped yet. Add in the slice that brings them into scope.

| Gate | Blocked on | Land with |
|---|---|---|
| `/dev/*` returns 404 in prod build — Playwright integration test | S-F7 (dev-mode abstraction) + Playwright setup | S-F7 slice |
| Security-headers smoke test against preview deploy | Preview URL + next.config.ts headers set | Phase C.0 ops follow-up or S-F1 |
| CSP-violation console check across smoke-test surfaces | Preview URL + Playwright | S-F1 / S-F7 slice |
| SSL Labs / Mozilla Observatory / securityheaders.com external scans | Production deploy at cutover | Pre-launch readiness (spec 72 §10) |
| Pre-commit `gitleaks` hook (not just CI-side) | `husky` or equivalent repo hook setup | Phase C.0 follow-up |
| Tests coverage gate | Coverage tool choice (vitest c8 / istanbul) | After first 3-5 slices ship and baseline exists |
| Visual regression against Claude AI Design source | Tool choice (Playwright screenshots / Chromatic / Storybook) per `docs/engineering-phase-candidates.md` §G.2 | Phase C.0 follow-up |

---

## Env / secrets required in GitHub

Set these once at repo settings → Secrets and variables → Actions.

| Name | Required | Why | Source |
|---|---|---|---|
| `GITLEAKS_LICENSE` | No (solo-author); yes for GitHub orgs >1 user | Gitleaks action licence | https://gitleaks.io/products.html |

Production env vars (Supabase keys, Anthropic, Stripe, Tink, etc.) are configured in **Vercel**, not GitHub Actions, per spec 72 §2. CI does not need them — it runs `next build` without T3+ data access.

---

## Branch protection recommendation (manual, in GitHub settings)

Not enforced by workflow files but part of Phase C.0 ops setup:

- `main` — require PR review, require CI checks (`lint`, `typecheck`, `test`, `build`, `env-var-regex-ban`, `dev-mode-leak`, `npm-audit`, `gitleaks`) to pass, disallow direct push. Keeps main frozen during Phase C per spec 71 §7a.
- `phase-c` — same protections except allow fast-forward merges from `phase-c/*` slice branches. Integration branch; no direct pushes.
- `phase-c/**` — no extra protection; individual slice branches are author-managed.

---

## Troubleshooting

### `npm ci` fails

Lockfile conflict or Node version mismatch. Workflow uses Node 20 LTS. If package.json or package-lock.json has drifted, run `npm install` locally and commit the regenerated lockfile.

### `build` job fails on missing `NEXT_PUBLIC_DECOUPLE_AUTH_MODE`

Expected once S-F7 lands — the runtime assertion at `src/lib/auth/index.ts` throws if `NODE_ENV=production` and the mode var is not `prod`. CI already sets `prod`; check the env block of the `build` job.

### `env-var-regex-ban` false positive

If a real secret-like name got flagged but is legitimately server-side (no `NEXT_PUBLIC_` prefix), re-check — the regex only matches `NEXT_PUBLIC_*_(KEY|SECRET|TOKEN|PASSWORD|PRIVATE)`. If it's matching a comment or documentation, exclude the specific path in the grep command rather than weakening the regex.

### `dev-mode-leak` false positive

If S-F7 lands and a string leaks legitimately (e.g. a user-facing string happens to contain `sarah-connected`), adjust the check to grep only the bundled JS + sourcemaps, not metadata files. Don't relax the rule — tighten the scope.

### `npm-audit` fails on transitive dep with no fix

Per spec 72 §10: address or risk-accept with reasoning. If truly no fix exists, add to an allowlist with a dated review line (`npm-audit-allowlist.json` or similar — introduce when first needed).

### `gitleaks` flags a false positive

Add a `.gitleaksignore` file at repo root listing the specific commit SHA + path. Never add `--no-verify` or disable the workflow.
