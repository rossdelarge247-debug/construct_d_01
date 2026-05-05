# S-INFRA-react-hooks-71-sync — verification

## Status

✅ MET (slice ship state).

## AC table

| AC | Description | Status | Evidence |
|---|---|---|---|
| AC-1 | Both lockfiles resolve `eslint-plugin-react-hooks` to 7.1.1 | ✅ MET | `npm update eslint-plugin-react-hooks` bumped `package-lock.json` from 7.0.1 → 7.1.1 (4-line surgical diff: version + resolved + integrity + peer-range). `pnpm-lock.yaml` unchanged (already at 7.1.1). Both lockfiles now agree. `package.json` unchanged (`^7.0.0` transitive range accepts 7.1.1). |
| AC-2 | Dev-tooling files exempt from `react-hooks/immutability` | ✅ MET | `eslint.config.mjs` L40-50 adds scoped rule-override block matching `**/*.dev.tsx` (6 files under `src/app/dev/`); sets `react-hooks/immutability` to `off` for that group only; all other rules unchanged. Production tsx + tests keep the rule active at error severity. |

## Test results

- `npm run lint` — **0 errors / 34 warnings** (was 0/33 pre-PR; +1
  new warning `react-hooks/exhaustive-deps` at
  `page.dev.tsx:473` for `AMOUNT_BUCKETS` dependency, warn-only severity
  per 7.1.x default — non-blocking)
- `npx vitest run` — **319/319 GREEN** (no src/ changes; sanity)
- `npx tsc --noEmit` — clean

## Surface

- `package-lock.json` — +4/-4 (single transitive entry version-bumped)
- `eslint.config.mjs` — +12 lines (scoped rule-override block for
  `**/*.dev.tsx` with rationale comment)
- `docs/slices/S-INFRA-react-hooks-71-sync/acceptance.md` — new (~115 lines)
- `docs/slices/S-INFRA-react-hooks-71-sync/verification.md` — this file

## Sign-off

Slice ships the divergence resolution + the lint-scope adjustment that
unblocks 7.1.1 across dev-tooling files. The divergence had persisted
across four sessions; resolution preserves the dev-tooling shortcut
intent while applying the new immutability rule to all production
code.

The dev workbench mutation refactor (proper fix, would also remove
the lint exclusion) is intentionally deferred per §Out of scope —
the workbench is engineering-tool surface with established mutation
shortcuts; refactoring them is its own slice.

## Status footer

- Created: at slice ship
- AC scope locked at acceptance.md authoring; impl matches AC text
- Sibling slice: `S-INFRA-1-stripe-sdk-pin` (same one-shot lockfile-
  sync pattern, applied to a different transitive dep)
