# HANDOFF — Session 74

**Working branches:** `claude/decouple-session-74-2b1Jx` (session amendments) · `claude/S-PROTO-hub` (slice work) · `claude/decouple-session-74-wrap` (this wrap)
**PRs merged:** #122 (session-73 wrap with mid-PR Vercel-unblock fix bundled) · #123 (S-PROTO-hub Phase 3 P0)

## What happened (in order)

1. **Side-quest: unblock PR #122 (session-73 wrap).** Vercel preview was failing because committed `pnpm-lock.yaml` (last touched session 58) was being autodetected by Vercel CLI 51.6.1 → `--frozen-lockfile` blew up over missing `madge@^8.0.0` (added session 72 P2 PR #119). Fix: deleted stale lockfile + pinned `packageManager: "npm@10.9.7"` to prevent future autodetection drift. Also addressed PR #122's only outstanding auto-review advisory (stale persona-retain scores in §"Locked"). Squash-merged as commit `0497e7f`.

2. **Strategic recalibration: 3-phase post-audit plan restored.** User flagged that SESSION-CONTEXT's session-74 priorities ("first src/ slice post-B+C+D = calibration moment") had compressed away their post-audit deliberation. Their plan was: Phase 1 (logic gaps, complete sessions 70-71) → Phase 2 (Claude AI Design canvases, ongoing) → Phase 3 (`/dev/proto/*` prototypes, starting session 74). Restored explicitly in SESSION-CONTEXT amendment commit `780fa6c`. The "first src/ slice = calibration moment" framing carries over — Phase 3 prototypes ARE src/ slices for plan-architect catch-rate measurement.

3. **Mobile canvas uploaded + relocated.** User dropped `Mobile Screens v2.html` (canvas wrapper, 289L) + `Mobile Screens v2 - Standalone (2).html` (4910L self-contained) at `docs/design-source/` root via GitHub UI. Relocated to `docs/design-source/mobile-screens-v2/` slug folder per CLAUDE.md §"Visual direction" convention.

4. **S-PROTO-hub Phase 3 P0 shipped (PR #123).** First src/ slice post-B+C+D. 61-row TS+Zod design-uncertainty registry × 11 sections at `/dev/proto`; hub renderer + dynamic stub-route + 4 reusable components (StatusBadge · ConfidenceBadge · SectionHeader · FlowRow); 71 tests across 9 files (max 1 mock per test). TDD-first across 5 steps (schema → registry → components → hub page → stub-route).

5. **Option A architectural pivot.** Discovered mid-session that user's workflow is Vercel-preview-driven (no local terminal for `npm run dev`) — so `.dev.tsx` infix routes are invisible to them. Renamed `page.dev.tsx` → `page.tsx` (matches `/dev/heroes` pattern); routes now compile in production bundles, accessible at `/dev/proto` on previews. Trade-off: hub URL publicly addressable; pre-launch with no real users + T0 design metadata = acceptable.

6. **Plan-time review via Path C** (manual persona-spawn since harness lacks plan-mode toggle / Shift+Tab). plan-architect: 0 findings → approve. exit-plan-review: 4 findings (3 suggestions + 1 nitpick) all addressed pre-impl (F2 paraphrase fix · F3 schema citation · F4 split applied at `fd16a04` · F1 size verification).

7. **Post-PR auto-review fan-out** caught 9 findings on commit `d06da0a`. K=2 majority verdict was `request-changes` (advisory). 1 finding flagged blocking by `security` specialist (security.md item 9 falsely claimed `.dev.tsx` infix gates routes — actual files are `page.tsx` post-Option-A). All 9 fixed in commit `20a94ca`; aggregate flipped to `success`.

8. **Parking-lot for session 75.** User identified that the rigour stack is calibrated for production code; running prototype slices through the full stack over-rigours them. Recommended approach: slice-category metadata (`category: production | prototype | infrastructure`) read by gates per spec 76 to ship in session 75 (Path B per dialogue). Captured in SESSION-CONTEXT amendment commit `5d4b013`.

## What went well

- **TDD ladder discipline.** 5 commits (one per step) made progress visible + reviewable. Each step green before moving on.
- **Path-C plan-time review** caught real issues (F4 split kept the slice PR clean) without requiring harness plan-mode.
- **Auto-review specialists earned their keep.** 8 of 9 findings were real (security false-claim · 3 ac-gaps · 2 comment hygiene · 2 nitpicks). Plan-architect was silent (0 findings) — ambiguous whether that's appropriate-silence or under-firing on a pure-data slice.
- **F4 split discipline** (separating control-plane fix from src/ slice) avoided PR-scope dilution.
- **User caught the .dev.tsx misalignment** (Vercel preview build error) early; Option A pivot was clean.

## What could improve

- **Slice docs drifted from impl post-rename.** security.md item 9 + acceptance.md AC-3/4/7 + test-plan.md mock description all carried stale `.dev.tsx` / `useParams` references after Option A rename. Caught by auto-review post-PR rather than at the rename commit. Lesson: when applying a refactor that touches multiple slice docs, sweep all docs in the same commit, not piecemeal.
- **Acceptance.md drift on AC-3 ("id displays")** — wrote AC then forgot to render id in FlowRow. Auto-review correctness caught it. Lesson: each AC should map to a render-test assertion at write time, not after.
- **Plan-architect silence on a pure-data slice** is ambiguous calibration data. Slices 2 and 3 of the cohort (`S-PROTO-pre-signup-interview` + `S-PROTO-section-confirm`) will have more behaviour to flag, giving better signal.
- **Session churn ran high (~1500L).** Slice was bigger than typical because of the 61-row registry data file. Future prototype slices probably won't have this much mechanical content.

## Key decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | 3-phase post-audit plan restored as ground truth | User's earlier-session deliberation was load-bearing; SESSION-CONTEXT had compressed it to one-line framing |
| 2 | `S-PROTO-hub` slice all-in-one (registry + renderer + stubs) | User explicitly chose this; mechanical row data doesn't benefit from sub-slicing |
| 3 | Option A: drop `.dev.tsx` infix → `page.tsx` | User's Vercel-preview-driven workflow; `.dev.tsx` excluded routes from prod builds = invisible to user. Trade-off: public URL accepted (T0 metadata, pre-launch) |
| 4 | Path-C manual persona-spawn for plan-time review | Harness lacks plan-mode toggle (Shift+Tab); manual `Agent` invocation with persona-rubric file inputs achieves same calibration data |
| 5 | F4 split (SESSION-CONTEXT amendment as separate commit on session-74 branch) | Per exit-plan-review persona finding; keeps S-PROTO-hub PR purely src/ slice work |
| 6 | Session 75 P0 = prototype-mode rigour spec (BEFORE first prototype slice) | User-confirmed: avoid having `S-PROTO-pre-signup-interview` pay the same rigour-friction tax S-PROTO-hub did |

## New constraints discovered

| # | Constraint | Why it matters |
|---|---|---|
| #37 | **`.dev.tsx` routes invisible to Vercel-preview-only workflows.** Next.js `next.config.ts` excludes `.dev.tsx` from prod builds; preview deploys are prod builds → routes 404. | Affects all Phase 3 prototype slice routing decisions. Default to `page.tsx` for slices the user needs to verify visually. |
| #38 | **Slice doc drift after refactor.** Refactors that change file paths / API surface need a sweep of acceptance.md + verification.md + test-plan.md + security.md in the same commit, or auto-review will catch the drift post-PR. | First experience of this; document the pattern. |

## Persona findings (calibration cohort row 1 of 3 per spec 72c §9)

| Persona | Findings | Real issue main missed (Y/N) | Notes |
|---|---|---|---|
| `plan-architect` (plan-time, Path-C manual) | 0 | N | Pure-data + pure-UI slice; no architectural seams to flag. Ambiguous signal — could be appropriate silence OR under-firing. Slices 2-3 will give more signal. |
| `exit-plan-review` (plan-time, Path-C manual) | 4 (3 suggestions + 1 nitpick) | Y | F2 paraphrase fix + F3 schema citation = real catches that tightened the plan. |
| `reviewer-security` (PR auto-review) | 1 (blocking — security.md item 9 stale) | Y | Caught a false security claim in slice doc. High-value find. |
| `reviewer-correctness` (PR auto-review) | 4 (3 ac-gaps + 1 regression-doc) | Y | All real ac-gaps (id rendering, link clickability wording, mock description, security.md regression). Strong calibration signal. |
| `reviewer-style` (PR auto-review) | 4 (2 commenting + 2 nitpicks) | Y (style commenting hygiene) | Hardcoded counts in comments + AC-N test-description provenance — real CLAUDE.md anti-pattern catches. |

**Interim retain/drop signal:** all 4 PR-time personas earned their keep on slice 1. Plan-architect TBD pending slices 2-3.

## Bugs found + how they were fixed

1. **Vercel preview build failed on PR #122** — root cause stale pnpm-lock.yaml. Fixed: delete file + pin npm in package.json.
2. **`/dev/proto` invisible on Vercel preview** — root cause `.dev.tsx` excluded from prod builds. Fixed: Option A rename (drop infix).
3. **Build broke when user changed `DECOUPLE_AUTH_MODE` to `dev`** — runtime assertion in `.dev.tsx` page modules requires `DECOUPLE_AUTH_MODE === 'prod'` in production builds. Fixed: revert env var; Option A rename made the dev/prod boundary moot for this slice.
4. **9 auto-review findings post-PR** on slice docs / impl drift after Option A rename. Fixed: comprehensive sweep across security.md / acceptance.md / verification.md / test-plan.md / 4 component files / 3 test files in commit `20a94ca`.

## Next session priorities

**P0 (firm — decided session 74):** Ship prototype-mode rigour spec BEFORE next prototype slice. Avoids `S-PROTO-pre-signup-interview` paying same friction tax. ~250-400L authored across spec 76 + CLAUDE.md amendment + new persona file + path-glob exemptions.

**P1 (after P0):** `S-PROTO-pre-signup-interview` — Phase 3 prototype P1 per refreshed Phase 3 sequence. 4-step loop: dialogue → canvas-prompt → absorb → construct.

**P2+:** `S-PROTO-section-confirm` (Build phase confirm pattern) · `S-PROTO-ai-coach` (Settle phase) · `S-PROTO-share-flow` (Reconcile multi-actor).

See SESSION-CONTEXT.md §"Session 75 priorities" for full detail.
