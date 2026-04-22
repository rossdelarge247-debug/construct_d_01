# {S-XX · slice name} — Test plan

**Slice:** S-XX-{slug}
**AC doc:** `./acceptance.md`
**Framework:** `vitest` (unit + logic) · Playwright (integration / E2E — confirmed at Phase C kickoff) · manual + preview-deploy in-browser for visual

---

## Test inventory

One test per AC minimum. Manual tests allowed but flagged; the slice author executes them against the preview deploy before declaring DoD item 4 complete.

## T-1 · references AC-1

- **Given:** {initial state — user role, data seeded, feature flags, scenario from `src/lib/bank/test-scenarios.ts` if bank-flow}
- **When:** {action — user interaction, API call, event}
- **Then:** {observable outcome exactly matching AC-1 verification}
- **Type:** unit · integration · E2E · visual regression · manual
- **Automated:** yes / no
- **If manual:** reason (e.g. visual-only, accessibility sweep, Tink-sandbox round-trip)
- **Fixture:** {test scenario ID or synthetic data source}
- **Evidence at wrap:** {test output / screenshot / URL — filled during implementation}

## T-2 · references AC-2

- **Given:**
- **When:**
- **Then:**
- **Type:**
- **Automated:**
- **Fixture:**
- **Evidence at wrap:**

## T-3 · references AC-3

- **Given:**
- **When:**
- **Then:**
- **Type:**
- **Automated:**
- **Fixture:**
- **Evidence at wrap:**

{add T-N as AC set grows}

---

## Fixture + scenario references

- **Bank scenarios:** `src/lib/bank/test-scenarios.ts` (5 synthetic profiles). Extend only when a new AC strictly requires a new shape — don't duplicate existing scenarios.
- **WorkspaceStore scenarios (S-F7 onwards):** `src/lib/store/scenarios/*.json` (cold-sarah, sarah-connected, sarah-mid-build, sarah-complete, sarah-shared-mark-invited, sarah-reconcile-in-progress, sarah-settle, sarah-finalise).
- **Dev fixture user:** `@dev.decouple.local` synthetic email, per spec 72 §7 fixture isolation.
- **No real user data in fixtures ever.** T3+ tier data (bank, financial) must be synthetic.

## Visual regression placeholder

Until a tool is picked (Playwright screenshots / Chromatic / Storybook), visual verification = manual in-browser check against Claude AI Design source. Tool decision tracked at `docs/engineering-phase-candidates.md` §G.2.

## Manual test discipline

If a test is manual, the slice author must:
1. Run it against the preview deploy before declaring DoD item 4 complete
2. Record evidence (screenshot / short screen recording / reference-ID) in the test's `Evidence at wrap` line
3. Capture the build/commit SHA verified against

Untested surfaces are not shipped.
