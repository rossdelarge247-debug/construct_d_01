# S-F7-β · Dev surface routes + env banner reskin + fixture library — Acceptance criteria

**Slice:** S-F7-beta-dev-surface
**Spec ref:** `docs/workspace-spec/71-rebuild-strategy.md` §4 (Dev-mode pattern) + §8 (S-F7 slice card) · `docs/workspace-spec/70-build-map-slices.md` S-F7 card · `docs/workspace-spec/72-engineering-security.md` §3 + §7 (dev/prod boundary)
**Phase(s):** Foundation (Phase C Step 1 set) — unblocks all post-auth slices
**Status:** Approved · AC frozen 2026-04-26 · implementation may begin

---

## Context

S-F7-α (PR #20, merged on `main` at `5d38f6d`) shipped the persistence + auth backend contracts: `lib/auth/{dev-auth-gate,dev-session,index,types}.ts` + `lib/store/{dev-store,index,scenario-loader,types}.ts` + 2 fixture scenarios (`cold-sarah`, `sarah-mid-build`). β layers the **frontend dev surface** on top: 5 routes under `/app/dev/`, env banner reskin, scenario picker UI, state inspector UI, engine-workbench relocation, and 6 more fixture scenarios to complete the spec-71 §4 fixture library of 8. β also bundles the CLAUDE.md candidate #14 lift (`origin/HEAD set` in session-start.sh) since lift trigger fires this session.

Quote, spec 71 §4 line 246-256: "All gated by `MODE === 'prod'` notFound at layout level (spec 72 §7)" — non-negotiable. Quote, spec 71 §4 line 268: "Each scenario = deterministic state snapshot. Picking a scenario = `reset + load scenario JSON into dev store + reload`."

## Dependencies

- **Upstream slices:** **S-F1** (design tokens — Depends-on per spec 70 S-F7 card line 81); **S-F7-α** (auth + store contracts — already on main as of PR #20).
- **Open decisions required:** none currently parked under 68f/g for S-F7. Spec 71 §4 "Opens" lists storage-schema-versioning + scenario-JSON-format + dev-only-API-convention — all non-blocking-this-slice (decisions can lock during impl per first concrete need).
- **Re-use / Preserve-with-reskin paths touched:** `src/components/layout/env-banner.tsx` (Preserve-with-reskin per spec 71 §4 line 260); `src/lib/bank/test-scenarios.ts` (Re-use per spec 71 §4 line 283 — feeds bank portions of new fixture scenarios, no duplication).
- **Discarded paths deleted at DoD:** `src/app/workspace/engine-workbench/page.tsx` (moved to `src/app/dev/engine-workbench/page.tsx`; old path removed per spec 71 §4 line 256 "Moved from").

## MLP framing

The loveable floor for this slice is: **A future-Claude or human dev opens a preview deploy, sees the dev banner with the current scenario, picks a different scenario from the dropdown, and the workspace re-populates against that fixture without writing code.** That floor unblocks every downstream slice's in-browser verification. Taken together, AC-1 + AC-2 + AC-5 + AC-6 satisfy the floor. AC-3 (state inspector) + AC-4 (engine-workbench move) + AC-7 (#14 lift) are bundled in scope but cleanly cuttable to a follow-up slice if mid-impl scope stress emerges; cuts happen by deferring to S-F7-γ, not by shipping lukewarm AC.

---

<!-- AC bodies -->

## AC-1 · Dev route group with `MODE==='prod'` notFound gating

- **Outcome:** A `/app/dev/` route group exists with a shared layout that returns `notFound()` whenever `MODE === 'prod'` (verified at runtime per spec 72 §7). `/dev` itself renders a dashboard listing the linked tools (scenarios · state-inspector · reset · engine-workbench), the current mode chip, and the current scenario name pulled from dev-store.
- **Verification:** Local `pnpm dev` with `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=dev`: GET `/dev` returns 200 with the dashboard. Local `pnpm build && pnpm start` with `NEXT_PUBLIC_DECOUPLE_AUTH_MODE=prod`: GET `/dev` returns 404. Existing CI "Dev-mode leak scan (spec 72 §7)" check passes.
- **In scope:** `src/app/dev/layout.tsx` with the prod-notFound gate; `src/app/dev/page.tsx` (dashboard); shared dev-UI primitives if needed (one-off, kept under `src/components/dev/`).
- **Out of scope:** Real-Supabase auth check inside the layout (β stays in dev mode by design; prod path is a notFound bookend, not an auth flow).
- **Opens blocked:** none.
- **Loveable check:** Dev opens `/dev` in preview, sees a clean dashboard with their current state visible — not a wall of debug noise. The dashboard is the dev's homepage.
- **Evidence at wrap:** preview-deploy URL screenshots at `/dev` (dev mode) + `/dev` returning 404 (prod build); CI dev-mode-leak check passing.

## AC-2 · Scenario picker UI + reset mechanism

- **Outcome:** `/dev/scenarios` lists all 8 fixture scenarios with names, one-line descriptions, and a "Load this scenario" CTA. Loading triggers: confirm dialog → wipe `decouple:dev:*` localStorage keys → invoke `scenarioLoader.load(scenarioId)` → reload at `/dev`. `/dev/reset` separately offers wipe-without-load (confirm → wipe → redirect to `/dev`).
- **Verification:** Manual: pick `sarah-mid-build` → confirm → workspace re-renders against that fixture; localStorage shows `decouple:dev:store:v1` populated with the scenario JSON. Reset: localStorage `decouple:dev:*` keys all gone after wipe; redirected to `/dev`. Vitest: `scenarioLoader.load(id)` round-trips for all 8 IDs (extends existing α tests).
- **In scope:** `src/components/dev/scenario-picker.tsx`; `src/app/dev/scenarios/page.tsx`; `src/app/dev/reset/page.tsx`; reuse of α's `scenarioLoader` from `lib/store/scenario-loader.ts` (no duplication).
- **Out of scope:** Mid-flow scenario switching with state-merge (β's contract is "wipe-then-load"; merge semantics are a future slice).
- **Opens blocked:** none. (Scenario JSON format remains "open" per spec 71 §4 line 285 but locks pragmatically here as "whatever shape α + β scenarios share.")
- **Loveable check:** Scenario picker reads like a chooser, not a debug panel. Each scenario has a name + 1-line story (e.g. "Sarah, build complete, sharing pending"). Switching feels instant.
- **Evidence at wrap:** screen-recording of pick → reload → workspace populated; vitest output for loader.

## AC-3 · State inspector UI (read + edit + save)

- **Outcome:** `/dev/state-inspector` renders the current dev-store contents as JSON (pretty-printed, monospace) with an "Edit" affordance that opens a textarea, validates JSON.parse on save, and writes the parsed object back to the dev store. Reload reflects the edit.
- **Verification:** Manual: load `sarah-mid-build` → state-inspector shows the populated JSON → edit a single field (e.g. flip a confirmation flag) → save → reload `/workspace` (or another route consuming the store) → change visible. Invalid JSON on save: shows inline validation error, does not write.
- **In scope:** `src/components/dev/state-inspector.tsx`; `src/app/dev/state-inspector/page.tsx`. Read + edit + save-back via the dev-store interface from α; no schema validation beyond `JSON.parse`.
- **Out of scope:** Schema-validated edits (Zod / typed schema enforcement is a later refinement); diffs against snapshot; per-field edit UI. β ships raw JSON edit only.
- **Opens blocked:** none.
- **Loveable check:** Dev hits a debug invariant, opens state-inspector, sees what the store actually holds, fixes one value, refresh — back to flow. No console digging.
- **Evidence at wrap:** screen-recording of edit → save → reload → state changed.
- **Cut path (if scope stress):** ship read-only inspector in β; edit + save deferred to S-F7-γ. AC-3a/3b split if cut.

## AC-4 · Engine workbench relocated to `/dev/engine-workbench`

- **Outcome:** `/dev/engine-workbench` renders the existing engine-workbench experience (signal-rule testing) under the dev route group's notFound-on-prod gate. Old `/workspace/engine-workbench` route is removed.
- **Verification:** Local dev: GET `/dev/engine-workbench` shows the workbench; the existing engine-workbench feature behaviour is unchanged (signal rules still testable). Local prod build: GET `/dev/engine-workbench` returns 404; GET `/workspace/engine-workbench` returns 404. CI dev-mode-leak scan passes.
- **In scope:** `src/app/dev/engine-workbench/page.tsx`; deletion of `src/app/workspace/engine-workbench/page.tsx` (per spec 71 §5 staged-removal — the file is "Discarded paths deleted at DoD" for this slice). Adjust any internal links pointing at the old path.
- **Out of scope:** Refactoring engine-workbench internals; UI reskin (β preserves existing behaviour and visual treatment, only relocates).
- **Opens blocked:** none.
- **Loveable check:** Devs find engine-workbench under `/dev/*` where it belongs, alongside the other tools. No surprising splits.
- **Evidence at wrap:** old-path-404 + new-path-200 verification; one-line entry in `docs/workspace-spec/70-build-map.md` "discarded" inventory updated.
- **Cut path (if scope stress):** β keeps the move *symlinked* (re-export from old path → notFound at new) and the actual deletion drops to S-F7-γ. Discouraged — the move is mechanical.

## AC-5 · Env banner reskin (Preserve-with-reskin)

- **Outcome:** `src/components/layout/env-banner.tsx` reskinned per spec 71 §4 line 258-266: persistent dev-mode surface with mode chip (DEV / PROD), current scenario name + switcher dropdown, reset button. `MODE === 'prod'` → returns `null` unconditionally. Rendered inside `(authed)` layout — banner hidden on marketing routes regardless of mode. Uses S-F1 design tokens (no inline colours).
- **Verification:** Local dev: every authed route shows the banner; clicking the dropdown reveals all 8 scenarios; selecting routes through the same flow as `/dev/scenarios`. Local prod: banner returns null on every route. Marketing route (e.g. `/`) in dev mode: no banner. S-F1 token check: `grep -n '#[0-9a-f]\{3,8\}' src/components/layout/env-banner.tsx` returns no inline-colour matches; all colours come from S-F1 tokens.
- **In scope:** Reskin of the existing `env-banner.tsx` (Preserve-with-reskin per spec 71 §4 line 260); integration into `(authed)` layout if not already there.
- **Out of scope:** New banner variants; user-preference dismissal; banner on marketing routes (intentional negative).
- **Opens blocked:** none.
- **Loveable check:** Banner reads as orienting (where am I, what scenario, can I reset) — not as scolding ("YOU ARE IN DEV MODE!!"). Compact, hand-on-shoulder tone.
- **Evidence at wrap:** screenshots at three viewport widths (mobile 375 / tablet 768 / desktop 1440); colour-token grep output.

## AC-6 · Six new fixture scenarios complete the library

- **Outcome:** Six new JSON files added under `src/lib/store/scenarios/`: `sarah-connected.json`, `sarah-complete.json`, `sarah-shared-mark-invited.json`, `sarah-reconcile-in-progress.json`, `sarah-settle.json`, `sarah-finalise.json`. Each is a deterministic state snapshot covering the corresponding stage per spec 71 §4 line 272-279. The `scenarioLoader` from α handles all 8 without modification (or with only an additive enum extension).
- **Verification:** `ls src/lib/store/scenarios/` shows 8 JSON files. Each loads cleanly via `scenarioLoader.load(id)` (vitest case per scenario). `/dev/scenarios` lists all 8. Loading any of the 6 new ones hydrates the dev store with no parse errors and no missing keys; the workspace renders without crashing on every loaded scenario (smoke check).
- **In scope:** 6 JSON files; minimal extension of `scenarioLoader.SCENARIO_IDS` (or equivalent) if α used a closed enum. Bank-data portions reuse `src/lib/bank/test-scenarios.ts` per spec 71 §4 line 283 (no duplication).
- **Out of scope:** "Realistic" fixtures with full pixel-perfect data (β fixtures aim for *deterministic + load-without-crash + spec-71-stage-name accurate*; richer fixtures land per slice as those slices need them).
- **Opens blocked:** Scenario-JSON-format open from spec 71 §4 line 285 — locks pragmatically as "the shape α + β share" (formal spec entry deferred to S-F7-γ if needed).
- **Loveable check:** Future slice author opens `/dev/scenarios`, sees the state they need ("oh, sarah-reconcile-in-progress has the joint doc loaded"), picks it, builds against it. No fixture-authoring tax per slice.
- **Evidence at wrap:** vitest output (8 loader cases pass); screenshot of `/dev/scenarios` showing all 8.

## AC-7 · CLAUDE.md candidate #14 lift bundled

- **Outcome:** `.claude/hooks/session-start.sh` patched to set `origin/HEAD` defensively before any command that depends on it: `git remote set-head origin main 2>/dev/null || true` near the top of the script (after shebang + `set -euo pipefail`). CLAUDE.md §"Planning conduct" gets a new bullet under §"Read discipline" (or the closest sibling section) capturing the rule. Hook tests in `tests/unit/hooks-session-start.test.ts` extended with one test asserting the patch is present and idempotent.
- **Verification:** `grep -n 'remote set-head' .claude/hooks/session-start.sh` finds the line; `pnpm test tests/unit/hooks-session-start.test.ts` passes (8 → 9 tests, +1). CLAUDE.md diff shows the new bullet under Planning conduct § with no other changes.
- **In scope:** ~5-line patch to `session-start.sh`; ~3-line CLAUDE.md bullet; one new vitest test extending the existing fixture pattern.
- **Out of scope:** Other CLAUDE.md candidate lifts (#3 / #13 re-evaluation belongs to Path E). No reshape of the existing session-start.sh logic.
- **Opens blocked:** none.
- **Loveable check:** Future Claude doesn't get the `fatal: ambiguous argument 'origin/HEAD...'` error from `/security-review` etc. The hook quietly fixes it, the rule's documented at Tier 1, and the test prevents regression.
- **Evidence at wrap:** grep + test output; CLAUDE.md diff snippet.

---

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-04-26 | session 35 (claude-opus-4-7) | Drafted | 7 ACs covering routes + picker + inspector + workbench-move + banner + 6 scenarios + #14 lift. AC-3 + AC-4 carry cut paths to S-F7-γ if mid-impl scope stress emerges. |
| 2026-04-26 | User | **Frozen** | All 7 ACs frozen as-drafted. Implementation may begin. |

**AC is the contract.** Change requests after freeze roll into re-drafting AC + re-slicing, not mid-slice scope shifts.
