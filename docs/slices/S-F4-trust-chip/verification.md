# S-F4 · Trust taxonomy + trust chip — Verification

**Slice:** S-F4-trust-chip
**AC doc:** `./acceptance.md`
**Test plan:** `./test-plan.md`
**Security DoD:** `./security.md`

---

## DoD evidence per AC

| AC | Outcome | Evidence |
|---|---|---|
| AC-1 | `<TrustChip>` component renders all 6 levels with C-T1 + C-T2 LOCKED conformance | `src/components/trust/TrustChip.tsx` (40L); 8 vitest cases in `tests/unit/components/trust/TrustChip.test.tsx` pass; computed-style asserts amber chip → `--ds-color-trust-self-declared` family, green → `--ds-color-trust-bank-evidenced` family; 4 OPEN levels carry no trust tokens. |
| AC-2 | Trust taxonomy types + constants (C-T2 LOCKED) | `src/components/trust/types.ts` (7L; `TrustLevel` 6-value union) + `src/components/trust/levels.ts` (16L; `TRUST_LEVELS` frozen array, `DEFAULT_LEVEL = 'self-declared'`, `humaniseLevel` helper); 6 vitest cases in `tests/unit/components/trust/levels.test.ts` pass. |
| AC-3 | Two locked visual treatments match wire evidence | `tests/unit/components/trust/parity.test.ts` reads `docs/workspace-spec/68f-open-decisions-register.md` at runtime; 5 cases pass — wire-evidence callouts for "Estimated" + "Barclays Bank" / "Verified from Barclays" + four-OPEN-levels listing + colour/label pattern all assert against spec source. |
| AC-4 | Aggregate test commands pass | `npx vitest run` → 26 test files / 162 tests pass; `npx tsc --noEmit` → exit 0; `npm run lint` → 0 errors / 34 pre-existing warnings; `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod npm run build` → 16 routes generated (placeholder landing builds with new component). S-F1 token-parity test extended for 4 new trust tokens (count 65 → 69; new explicit assertion that the 4 trust-LOCKED tokens are present). |
| AC-5 | Slice documentation complete | `docs/slices/S-F4-trust-chip/{acceptance,security,test-plan,verification}.md` present + populated (no template placeholders); 68g register entry created at `docs/workspace-spec/68g-visual-anchors.md` for new C-T1 (🟠 with annotation: pattern + 2 of 6 visual treatments LOCKED via S-F4; 4 OPEN per-level treatments pending Phase C anchor extraction). |

## Six-DoD-item gate (CLAUDE.md §Engineering conventions)

1. **All ACs met with evidence per AC** — see table above. ✅
2. **Tests written + passing** — 5 new test files (`tests/unit/components/trust/{levels,types,TrustChip,parity,index}.test.{ts,tsx}`) + 1 new test in `tests/unit/app/page.test.tsx` (S-F4 demo block); all 162 tests pass. ✅
3. **Adversarial review done** — manual pre-PR pass surfaced + addressed; multi-agent auto-review fires on `pull_request:opened` per `.github/workflows/auto-review.yml`. ✅
4. **Preview deploy verified in-browser** — Vercel preview URL post-PR open (placeholder landing renders all 6 chips); spec 72a 6-dimension rubric below. *(Post-PR fill at preview URL availability.)*
5. **No regression in adjacent slices** — S-F1 token parity passes (count expanded from 65 to 69); S-F3 phase-nav tests untouched + green; S-F7-α auth/store tests untouched + green. ✅
6. **Open 68f/g entries resolved or deferred** — 68g C-T1 created with annotation (4 OPEN per-level treatments deferred to Phase C anchor extraction with reasoning); 68f C-T1 status unchanged (referenced not resolved). ✅

Plus 13-item security checklist exercised in `./security.md` — most N/A for foundation-component slice (no API routes, no T3+ data, no third-party flows); each N/A carries explicit reasoning per spec 72 §11 exemption pattern.

## Preview-deploy 6-dimension rubric (spec 72a)

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | Pending preview URL | All 6 chips render in demo block on placeholder landing; amber + green chips computed-style spot-check resolves to trust tokens. |
| Edge cases | Covered | `sourceLabel` prop override tested (e.g. `Verified from Barclays xxxx2323`); default-label resolution tested for self-declared (`Estimated`) + bank-evidenced (`Bank` if no source) + 4 OPEN levels (humanised level name). |
| `prefers-reduced-motion` | N/A | Component has no animations or transitions. |
| Keyboard-only | N/A | Chip is non-interactive (no focus handlers, no click handlers). |
| Mobile viewport (375×667) | Pending preview URL | Demo block uses `flex flex-wrap items-center gap-[var(--ds-space-8)]` — chips wrap on narrow viewports; spot-check at preview. |
| Screen-reader | Covered | `aria-label="Trust: {humanised level} — {label}"` present on every chip; test asserts presence for each of 6 levels. |

## In-scope additions noted post-review

The following file movement was not declared in `acceptance.md` or this verification document at AC freeze. Recording here for the audit trail per criterion-2 exception (a) — incidental scaffolding for the new `tests/unit/components/trust/` hierarchy:

- **Test rename:** `tests/unit/tokens.test.ts` → `tests/unit/styles/tokens.test.ts`. Reason: aligns with `tdd-guard.sh` deterministic test-path mapping (`src/styles/tokens.ts` → `tests/unit/styles/tokens.test.ts` per L102-L104). Without this rename, future edits to `src/styles/tokens.ts` would block on "test file missing for src/styles/tokens.ts". Git auto-detected the rename — history preserved.

## Auto-review verdict + findings

Round 1 verdict (k=2 quorum): 🟡 request-changes — 8 findings (1 blocking-but-quorum-demoted, 6 non-blocking issues, 1 nitpick). All actionable findings addressed in round 2; nitpick (rename should be separate chore commit) skipped with reasoning in PR comment.
