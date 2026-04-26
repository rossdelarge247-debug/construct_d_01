# S-INFRA-1 · Stripe SDK pin (lockfile sync + apiVersion alignment) — Acceptance criteria

**Slice:** S-INFRA-1-stripe-sdk-pin
**Spec ref:** Carry-forward CLAUDE.md candidate #10 (lockfile policy — partially addressed; full lift deferred); HANDOFF-33 §"What could improve" + HANDOFF-34 §"What could improve" (Stripe API version mismatch tracked since session 33).
**Phase(s):** Infrastructure (no user-visible product surface)
**Status:** Approved · In implementation

---

## Context

Vercel preview deploys have been failing across PRs #20 and #21 with `Type error: Type '"2025-03-31.basil"' is not assignable to type '"2026-04-22.dahlia"'` at `src/lib/stripe/client.ts:25`. Root cause is dual-lockfile divergence: `package-lock.json` pins `stripe@22.0.0` (whose `LatestApiVersion` type accepts `'2025-03-31.basil'`) while `pnpm-lock.yaml` pins `stripe@22.1.0` (whose `LatestApiVersion` type narrowed to only `'2026-04-22.dahlia'`). CI runs `npm ci` so its Type-check job tolerates the literal; Vercel auto-detects pnpm-lock and fails. This slice realigns both lockfiles to the same Stripe SDK version and updates the apiVersion literal to match. The full single-lockfile policy decision (CLAUDE.md candidate #10) is deferred to a future tooling slice.

## Dependencies

- **Upstream slices:** none (infra-only; can ship before or after any product slice)
- **Open decisions required:** none (CLAUDE.md candidate #10 lockfile policy intentionally deferred — out of scope here)
- **Re-use / Preserve-with-reskin paths touched:** `src/lib/stripe/client.ts` (preserve; one-line literal change, no behavioural shift; stub-mode default unchanged)
- **Discarded paths deleted at DoD:** none

## MLP framing

The loveable floor for this slice is: **PR previews deploy green again, so future product PRs aren't dragged through false-positive Vercel red.** Taken together, AC-1 + AC-2 + AC-3 satisfy that. No user-visible behaviour changes.

---

## AC-1 · Lockfiles agree on Stripe SDK version

- **Outcome:** Both `package-lock.json` and `pnpm-lock.yaml` resolve `stripe` to `22.1.0` (or whatever single version satisfies the `package.json` range, but identically across both lockfiles).
- **Verification:** `grep -A 1 '"node_modules/stripe"' package-lock.json` shows `"version": "22.1.0"` AND `grep -A 1 '^  stripe@' pnpm-lock.yaml` shows `stripe@22.1.0:`. No other resolved Stripe version appears in either file.
- **In scope:** Stripe package version pin in both lockfiles. Transitive Stripe deps may shift to whatever 22.1.0 requires.
- **Out of scope:** Single-lockfile adoption (CLAUDE.md candidate #10). Other dependency upgrades. CI workflow changes.
- **Opens blocked:** none
- **Loveable check:** Reviewers and future-Claude-sessions don't have to wonder why CI is green and Vercel is red — both run the same SDK. Honest.
- **Evidence at wrap:** lockfile diffs in PR; grep output recorded in verification.md.

## AC-2 · Stripe apiVersion literal matches installed SDK's typed expectation

- **Outcome:** `src/lib/stripe/client.ts:25` passes `tsc --noEmit` against installed `stripe@22.1.0`.
- **Verification:** `pnpm exec tsc --noEmit` exits 0 with no errors mentioning `stripe/client.ts`. `pnpm build` exits 0 (next build's post-compile typecheck phase passes).
- **In scope:** apiVersion string literal in `src/lib/stripe/client.ts:25`, replaced with `'2026-04-22.dahlia'` (the value Stripe SDK 22.1.0's `LatestApiVersion` type accepts).
- **Out of scope:** Stripe runtime behaviour (file remains in stub mode by default — no credentials, no real API call exercised). Other Stripe-related code (none in this slice).
- **Opens blocked:** none
- **Loveable check:** The type system tells the truth instead of being papered over with a cast. If Stripe ever changes the SDK again, the same diagnostic surfaces and we know to re-pin.
- **Evidence at wrap:** tsc + next-build output recorded in verification.md.

## AC-3 · CI + Vercel both green on the slice PR

- **Outcome:** All 10 GHA check_runs report `success` on the S-INFRA-1 PR head commit AND the Vercel deploy commit-status reports `success`.
- **Verification:** `mcp__github__pull_request_read --method=get_check_runs` returns 10/10 success; `mcp__github__pull_request_read --method=get_status` shows Vercel state `success`. Combined `mergeable_state` is no longer `blocked` for CI/deploy reasons.
- **In scope:** End-to-end green on the slice's own PR.
- **Out of scope:** Re-running PR #21's deploy (separate task at session wrap).
- **Opens blocked:** none
- **Loveable check:** The reviewer sees a clean checks panel instead of a mixed signal. No "ignore the red, it's pre-existing" footnote needed.
- **Evidence at wrap:** check_runs + status JSON snapshots in verification.md.

---

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-04-25 | User | Approved | Option B chosen at kickoff (sync both lockfiles + update apiVersion literal). AC frozen; implementation may begin. |

**AC is the contract.** Change requests after freeze roll into re-drafting AC + re-slicing, not mid-slice scope shifts.
