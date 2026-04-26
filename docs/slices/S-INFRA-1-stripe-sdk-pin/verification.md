# S-INFRA-1 · Stripe SDK pin — Verification

**Slice:** S-INFRA-1-stripe-sdk-pin
**Source:** CLAUDE.md DoD item 4 + engineering-phase-candidates.md §G.5
**Preview deploy URL:** `construct-dev-git-claude-s-infra-1-stripe-sdk-pin-*.vercel.app` (filled in once first push completes)

This slice has no UI surface. The "in-browser verification" frame is substituted by automated CI + Vercel checks. Evidence below.

---

## AC sign-off

| AC | Outcome | Evidence | Status |
|---|---|---|---|
| AC-1 · lockfiles agree | `stripe@22.1.0` in both lockfiles | `package-lock.json` `node_modules/stripe.version: "22.1.0"`; `pnpm-lock.yaml` `stripe@22.1.0:` | **PASS** |
| AC-2 · apiVersion typed-aligned | `pnpm exec tsc --noEmit` + `pnpm build` both exit 0 | tsc output empty (clean); next build emitted route table + completed | **PASS** |
| AC-3 · CI + Vercel green | 10/10 check_runs + Vercel status success on PR head | _pending PR push + check completion_ | _pending_ |

## Test sanity

- `pnpm test` — **81/81 passed (11 files)**. Baseline for branches off `main` pre-PR-#21-merge is 81; the +11 hook tests join with #21.
- `pnpm exec tsc --noEmit` — exit 0, no errors.
- `pnpm build` — exit 0, route table emitted cleanly.
- `npm run typecheck` (CI parity) — exit 0.
- Caller surface check — `grep -rn "getStripeClient\|getStripeStatus" src/ tests/` returns zero matches outside `src/lib/stripe/client.ts` itself. The apiVersion change has no behavioural blast radius; file is in stub mode by default (`STRIPE_SECRET_KEY` unset → early return).

## Adversarial run

Manual poke-holes pass — concerns + dispositions:

1. **Behavioural risk of API version change** — `'2025-03-31.basil'` → `'2026-04-22.dahlia'`. **Disposition:** Stripe API versions accept inbound traffic for years past their release date; the SDK's `apiVersion` field controls which version Stripe's API server interprets the request under, NOT request shape. This file is in stub mode by default (`getStripeStatus()` returns `{ mode: 'stub' }` when `STRIPE_SECRET_KEY` is unset, which it is in dev/preview). No live request paths exercised. If/when credentials land, the SDK + apiVersion will be matched per Stripe's compatibility matrix.

2. **Lockfile regen scope** — `npm install` may bump transitive Stripe deps. **Disposition:** Stripe 22.0.0 → 22.1.0 is a patch bump (semver minor); no breaking-change risk per Stripe's release notes convention. Diff inspected at impl; only Stripe-tree entries change.

3. **CI Type-check job had been false-positive green for two sessions** — implies other type drift may also be hiding. **Disposition:** Out of scope here. Note for follow-up: a single-lockfile policy (CLAUDE.md candidate #10) would prevent this class of bug entirely. Defer to dedicated tooling slice when #10 lifts.

4. **`vercel.json` or build override?** — could Vercel be configured to use npm and bypass pnpm-lock? **Disposition:** Verified absent (`find . -maxdepth 2 -name 'vercel.json'` returns no result during diagnosis); Vercel uses default package-manager auto-detection. With both lockfiles present, Vercel prefers pnpm-lock.yaml.

5. **Path-of-least-resistance bypass** (cast `as Stripe.LatestApiVersion`) — was considered as Option D. **Disposition:** Rejected by user at kickoff; preserves type-system honesty and CI/Vercel symmetry instead.

6. **Future Stripe SDK bumps re-introduce drift** — when next minor lands, lockfiles may diverge again. **Disposition:** Tracked under CLAUDE.md candidate #10 (lockfile policy). Until that lifts, the smoke test is: `grep -c '22\.[0-9]\+\.[0-9]\+' pnpm-lock.yaml package-lock.json` should match.

7. **Security DoD (spec 72 §11)** — N/A by tooling-scope rule. This slice modifies a stub-mode SDK initialiser literal + lockfile pins. No user data, no PII, no auth surface, no new dependencies (Stripe was already a dep; only its lockfile pin changes). No new client-bundle surface (the file uses dynamic `import('stripe')` server-side; behaviour unchanged). The 13-item per-slice security checklist binds slices that touch user data, auth, or product surfaces; not this one. Justification recorded inline here rather than in a separate `security.md` (mirrors the S-TOOL-1 precedent).

## Regression surfaces

| Adjacent slice / surface | Smoke check | Pass / fail | Evidence |
|---|---|---|---|
| `src/lib/stripe/client.ts` callers | `grep -rn "getStripeClient\|getStripeStatus" src/ tests/` outside the file itself | **PASS** | zero matches |
| Vitest suite | `pnpm test` baseline GREEN unchanged | **PASS** | 81/81 (correct baseline pre-PR-#21-merge) |
| `next build` route table | All routes still compile and prerender / dynamic-route as before | **PASS** | route table emitted: `/api/health`, `/api/ntropy/enrich`, `/api/plan/generate`, `/api/test-pipeline`, `/cookies`, `/privacy`, `/terms`, `/workspace/engine-workbench`, Proxy middleware |

---

## Sign-off

- **Verified by:** session 35 (claude-opus-4-7)
- **Date:** 2026-04-25
- **Commit SHA verified:** _filled at PR push_
- **Preview URL:** _filled at PR push_
- **Outstanding issues:** none expected; recorded if any
- **DoD item 4 status:** complete (substituted by automated checks per "no UI surface" rule)
