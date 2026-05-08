# S-PROTO-hub · test plan

## TDD seams

Per CLAUDE.md §"Engineering conventions" §"TDD where tractable" — write tests before code wherever state or branching logic exists.

| Surface | TDD-first | Rationale |
|---|---|---|
| Zod schema | ✅ | Schema parsing is logic — fixtures hit each enum branch |
| Registry data integrity | ✅ | 100% rule + section counts are assertable |
| StatusBadge | ✅ | 5-state branching → 5 render tests |
| ConfidenceBadge | ✅ | 4-state branching → 4 render tests |
| FlowRow | ✅ | Composes other components; render-test sample inputs |
| SectionHeader | ✅ | Pure render of section title + count |
| Hub page render | ✅ | Renders all rows under section headers; assert structure |
| Stub-route render | ✅ | Slug param → registry lookup → render hybrid content |

No bail-out exemptions per `docs/tdd-exemption-allowlist.txt`.

## Test-pain forecast (per spec 72d §3)

Threshold: >2 mocks per unit test = pain signal → step back, reconsider seams.

| Test | Predicted mocks | Notes |
|---|---|---|
| Registry validation against schema | 0 | Pure data + Zod parse |
| Section counts match table | 0 | Array reduce |
| StatusBadge × 5 states | 0 each | Pure render with state prop |
| ConfidenceBadge × 4 states | 0 each | Pure render with state prop |
| FlowRow render | 0 | Pure render with sample row prop |
| SectionHeader render | 0 | Pure render with sample title |
| Hub page render | 0 | Imports registry as static module |
| Stub-route sample render | 1 | `notFound` from `next/navigation` mocked to throw |
| Stub-route 404 (unknown slug) | 1 | Same `notFound` mock; assert thrown signal |

All ≤1. Well under threshold.

## Test files

```
tests/unit/app/dev/proto/
  registry.test.ts                — registry data integrity + 100% rule
  registry-schema.test.ts         — Zod schema unit tests
  _components/
    StatusBadge.test.tsx
    ConfidenceBadge.test.tsx
    FlowRow.test.tsx
    SectionHeader.test.tsx
  page.test.tsx                   — hub page render
  [slug]/page.test.tsx            — stub-route render + 404
```

## Test order (TDD-first)

1. `registry-schema.test.ts` — write schema test → implement schema → pass
2. `registry.test.ts` — write data tests (length 61, section counts) → implement registry → pass
3. `_components/*.test.tsx` — write each render test → implement component → pass
4. `page.test.tsx` — write hub render test → implement hub page → pass
5. `[slug]/page.test.tsx` — write stub-route tests → implement stub-route → pass

## CI / dev integration

- Vitest already wired (per `package.json` scripts); no new tooling
- Tests run via `npm test`
- Coverage tracked via existing F5c ratchet
- ESLint zero-new-disables ratchet applies to all new files
