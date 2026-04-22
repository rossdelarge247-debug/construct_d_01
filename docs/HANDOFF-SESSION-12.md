# Session 12 Handoff — Decision Tree Fidelity + Tink Fix

**Date:** 2026-04-14
**Branch:** `claude/decouple-v2-financial-disclosure-8BLB4`
**Lines changed:** ~1,200 net (8 files)
**Deployment:** Vercel at `construct-dev.vercel.app`

## What happened

Session 12 focused on two areas: fixing Tink bank connection (which hadn't worked since the modal was introduced) and a comprehensive fidelity pass across all 5 confirmation flow sections.

### Tink fix (4 commits, 3 debugging iterations)

The Tink modal was broken since session 9 introduced the iframe approach. Three issues were found and resolved:

1. **`external_user_id` auto-creation broken** — Tink's `/api/v1/oauth/authorization-grant` no longer auto-creates users from `external_user_id` (returns 404). Switched to explicit `createUser()` + `authorization-grant` with `user_id`.

2. **`REQUEST_FAILED_FETCH_EXISTING_USER`** — Even with explicit user creation, the delegate grant and standard authorization grant both produced auth codes that Tink Link couldn't resolve. Root cause was unclear but likely a Tink API version issue.

3. **`INVALID_STATE_EMBED_NOT_ALLOWED`** — The real blocker. Tink explicitly blocks iframe embedding. Switched from iframe to popup window (`window.open()`), and from auth-code mode to client_id-only mode (Tink Link creates its own temporary user). This combination works.

**Final working flow:** `POST /api/bank/connect` returns a Tink Link URL with just `client_id` + `redirect_uri`. Frontend opens it in a popup. Callback page detects `window.opener`, posts results via `postMessage`, and closes itself.

### Decision tree fidelity pass (5 commits)

Each section was analysed with the user using a structured approach: need-to-know → signal → inference → ladder → cross-section impacts. Scenarios were mapped from primary (~60% of users) through edge cases (~2%). Each section was then pressure-tested for gaps before implementation.

**Property:** 9 steps (was 4). Government schemes (Help to Buy equity loan, shared ownership % + housing association rent, Right to Buy), 4 equity calculation paths, negative equity handling, who lives there (me/partner/both/neither), property status (family home/on market/under offer/rented out), expanded no-signal path (5 housing situations).

**Income:** Multiple employer detection, HMRC benefits auto-confirmed (no question needed), DWP 6-way classification, self-employed business structure follow-up, retired pension status follow-up, "employed elsewhere" take-home estimate, 6 no-income paths (was 4), unclassified income classification.

**Accounts:** Joint account detection on connected accounts, investment platform pattern-matching (14 platforms), crypto exchange detection (8 exchanges), top 3 transfer classification (was 1), premium bonds in catch-all, balance estimates for undisclosed accounts.

**Pensions:** DB vs DC distinction (critical for valuation), CETV status + education + timeline, multiple pension handling with count, already drawing path, "not sure" help text, 6 no-signal options (was 2).

**Debts:** Credit card provider detection (14 providers) with outstanding balance + sole/joint, BNPL detection (6 providers), overdraft detection, loan purpose (home/car/consolidation/business — affects matrimonial classification), car finance type (PCP/HP/lease — HP means car is asset), student loan type (SLC vs private — SLC often excluded from settlement), tax debts, informal debts.

### Infrastructure change

Extended `showWhen` on `ConfirmationStep` to support `value: string | string[]`, enabling steps that show for multiple answer values (e.g., property follow-ups that appear for both "yes" mortgage and "yes outright" no-signal answers).

## What went well

- **Structured planning approach** — mapping scenarios before coding prevented rework. The "need-to-know → signal → inference → ladder → cross-section" framework was effective.
- **Pressure testing** — catching gaps like sole/joint on debts, Help to Buy equity calculations, DB vs DC pensions before they became bugs.
- **Tink debugging** — systematic error surfacing (added debug line to modal) led to clear diagnosis at each step.
- **Cross-section thinking** — documenting how answers in one section affect questions in others (e.g., rental income in Income → must own rental property in Property).

## What could improve

- **Tink took 4 commits** — should have checked Tink's iframe policy first rather than debugging the auth flow. The `INVALID_STATE_EMBED_NOT_ALLOWED` error would have appeared immediately if we'd tried client_id-only mode in an iframe first.
- **Cross-section impacts are documented but not implemented** — the decision trees note that e.g. "dividends → triggers Business section" but the code doesn't actually cross-reference answers between sections yet. The `generateSectionSteps` function signature would need `priorAnswers` parameter.
- **No runtime testing** — changes are type-checked but not tested in the browser during this session. The new branching paths need walkthrough testing.

## Key decisions

1. **Popup over iframe for Tink** — Tink blocks iframe embedding. Popup with `window.open()` + `postMessage` is the right approach. Client_id-only mode (no auth code) simplifies the flow.

2. **`showWhen` array values** — Extended to support `string[]` so one step can appear for multiple prior answers. Backward-compatible with existing `string` values.

3. **Auto-confirm pattern** — HMRC benefits, credit card payments, BNPL, and overdraft are auto-confirmed (type: `confirmation_message`) rather than asked as questions. Show, don't ask.

4. **Debt purpose matters** — Loan purpose (home improvements vs holiday) affects whether the debt is "matrimonial" or not. Car finance type (HP vs PCP) determines whether the car is an asset. These distinctions are important for settlement.

5. **DB vs DC pensions** — This distinction is critical for valuation and was missing. DB (final salary) pensions often have much higher CETVs relative to contributions.

## Bugs found and fixed

1. **Tink iframe blocked** — `INVALID_STATE_EMBED_NOT_ALLOWED`. Fixed by switching to popup.
2. **Tink auth code flow broken** — `external_user_id` auto-creation no longer works. Fixed by using client_id-only mode.
3. **Developer placeholder visible to users** — "Open Banking is not configured" message shown in modal. Fixed with clean "Try the experience" prompt.
4. **Financial summary `property-joint` check** — Was checking `=== 'yes'`, updated to match new `'joint_partner'` value.
5. **Task list `property-own` reference** — Was referencing non-existent answer ID. Updated to new `property-no-signal` values.
