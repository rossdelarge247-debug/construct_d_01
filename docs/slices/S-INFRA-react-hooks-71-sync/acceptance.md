# S-INFRA-react-hooks-71-sync — acceptance

## Status

In progress. Resolves the lockfile divergence carry-over (P2) by
syncing both lockfiles to `eslint-plugin-react-hooks@7.1.1` and adding
a scoped lint-rule override for the new immutability check on
dev-tooling files.

## Why

`eslint-plugin-react-hooks` is a transitive dep declared as `^7.0.0`
by `eslint-config-next@16.2.2`. Both lockfiles drifted into different
semver-valid resolutions:

- `package-lock.json` — `7.0.1` (npm CI uses this)
- `pnpm-lock.yaml` — `7.1.1` (Vercel auto-detects pnpm-lock first)

The drift is benign for production deploys (Vercel build succeeds at
7.1.1) but breaks deterministic-resolution invariant: the same code
runs against different lint rule sets depending on which package
manager installed dependencies. Carry-over has persisted four
sessions; this slice resolves it.

The 7.1.x release adds `react-hooks/immutability` at error severity.
The rule fires on direct property assignment to objects ("This value
cannot be modified") — including legitimate-shortcut mutations in
`src/app/dev/engine-workbench/page.dev.tsx` (lines 687-688 + 711-712:
in-place state mutation for immediate visual feedback in the engine
workbench).

## Acceptance criteria

### AC-1 — both lockfiles resolve `eslint-plugin-react-hooks` to 7.1.1

`package-lock.json` and `pnpm-lock.yaml` MUST agree at 7.1.1 on the
`node_modules/eslint-plugin-react-hooks` (or pnpm equivalent) entry.
No package.json change required (transitive resolution; `^7.0.0`
range from `eslint-config-next` accepts 7.1.1).

**In scope:**
- `npm update eslint-plugin-react-hooks` to bump npm-lock to 7.1.1
- pnpm-lock unchanged (already at 7.1.1)

**Out of scope:**
- Single-lockfile policy (CLAUDE.md candidate #10; bigger architectural
  decision; deferred indefinitely)
- Broader transitive-dep audit
- Adding a CI guard for future lockfile divergence (separate slice)

### AC-2 — dev-tooling files exempt from `react-hooks/immutability`

`eslint.config.mjs` MUST add a scoped rule override for `**/*.dev.tsx`
disabling `react-hooks/immutability`. Rationale: dev-tooling files
under `src/app/dev/` are workbench / scratch surfaces that use
intentional shortcuts (in-place state mutation for immediate visual
feedback in engineering tools); the rule is oriented at production
code.

**In scope:**
- Single new rule-override block in `eslint.config.mjs` matching
  `**/*.dev.tsx` files
- `react-hooks/immutability` set to `off` for that file group only;
  all other rules from `react-hooks/*` remain active for dev files
- All other tsx files (production + tests) keep `react-hooks/immutability`
  at error severity

**Out of scope:**
- Refactoring the dev workbench mutations to immutable patterns
  (proper fix; ~30-50L; deferred — see §Out of scope below)
- Excluding all `react-hooks/*` rules from `.dev.tsx` (over-broad)
- Excluding `.dev.tsx` from all linting (defeats other rules' value)

## Verification

- `cat node_modules/eslint-plugin-react-hooks/package.json | grep version`
  → `7.1.1`
- `grep -A2 "node_modules/eslint-plugin-react-hooks" package-lock.json`
  → `"version": "7.1.1"`
- `grep "eslint-plugin-react-hooks@" pnpm-lock.yaml` → `7.1.1`
- `npm run lint` → 0 errors / 34 warnings (was 0/33 pre-PR; +1 new
  warning at `react-hooks/exhaustive-deps` in `page.dev.tsx`,
  warn-only at default severity)
- `npx vitest run` → 319/319 GREEN (no src changes; sanity)

## Out of scope (deferred)

- **Refactor dev workbench mutations** to immutable state updates.
  Current sites:
  - `src/app/dev/engine-workbench/page.dev.tsx:687-688` (correction
    save loop body)
  - `src/app/dev/engine-workbench/page.dev.tsx:711-712` (single
    correction handler)

  These mutations rely on the parent `setCsvResult({ ...csvResult })` /
  `setResult({ ...result })` shallow-clone to trigger re-render — but
  the underlying `classifications[]` array element references are
  shared. Proper fix requires building a new classifications array
  with the mutated entry replaced. Out of scope here; would land as
  a follow-up dev-workbench refactor slice.

- **Single-lockfile policy decision** (CLAUDE.md candidate #10).
  Selecting one of npm / pnpm as canonical removes whole class of
  divergence. Bigger architectural decision; deferred.

- **CI guard for lockfile divergence**. A workflow that diffs
  `package-lock.json` vs `pnpm-lock.yaml` for shared-package version
  drift would catch future regressions. ~50-100L. Separate slice.

## Status footer

- Owner: lockfile sync
- Slice extends: S-INFRA-1-stripe-sdk-pin (one-shot Stripe sync; same
  pattern applied to react-hooks)
- DoD checklist applies at slice ship
