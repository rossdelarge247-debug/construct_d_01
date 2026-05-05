# HANDOFF — Session 65

**Date:** 2026-05-04 → 2026-05-05
**Branch:** `claude/decouple-session-65-lT8VM`
**Wrap state:** 6 commits ahead of main · working tree clean · 73 tests passing
**Slice in progress:** S-M1 marketing landing (path B — all-in-one) — **partial scope shipped; phases 4-8 deferred to session 66**

## What shipped

Six commits on the session branch (none merged to main this session — wrap PR planned at session close):

| # | SHA | Description |
|---|---|---|
| 1 | `acde662` | (cherry-pick) PR #89 upload — `Decouple.zip` (8.7MB design canvas) + `Landing Page - Standalone.html` |
| 2 | `5e1e7aa` | Slug restructure — moved upload into `docs/design-source/marketing-landing/` per CLAUDE.md §Visual direction convention |
| 3 | `afc4f65` | S-M1 slice docs — `acceptance.md` (10 AC + audit reconciliation), `security.md` (T0 Public throughout, 13-item walk), `test-plan.md` (12 tests) |
| 4 | `406e333` | S-M1 phase 1 — atoms (icons.tsx with 11 SVG icons + Wordmark + Eyebrow + SectionHead + PlaceholderTag + CTAPrimary + TrustBand + barrel) — 16 files, 48 tests |
| 5 | `2e83f14` | S-M1 phase 2 — sections (header + picture-band + journey + footer-minimal) — 8 files, 16 tests |
| 6 | `9508a43` | S-M1 phase 3 — HeroEditorial (production default; translates landing/04_hero.jsx incl. HeroComposition with central document spine + 4 orbiting cards + EDITORIAL annotation) + heroes/index.ts (`SELECTED_HERO_VARIANT` + `HERO_VARIANTS` map) — 4 files, 9 tests |

Spec/AC drift items confirmed by user mid-session:
- `/start` route → HTTP 404 native (segment `not-found.tsx` carries the placeholder copy)
- Source Serif 4 acceptable as production substitute for the design's Source Serif Pro reference
- `/dev/heroes` reachable in prod (dev banner is the only marker; spec 72 §9 lockdown deferred to S-F7 follow-up)
- Hero variant naming: slug-driven (`HeroEditorial`) not numeric-prefixed (`Hero01_Editorial`)
- Pre-existing `<link rel="preconnect" href="https://fonts.googleapis.com">` in `layout.tsx` to be removed when fonts migrate to `next/font/google`

## What did NOT ship (deferred to session 66)

| Phase | Surface | Reason |
|---|---|---|
| 4 | `src/app/page.tsx` replacement | Page composition wiring — without this, Vercel preview still shows placeholder + foundation-slice demo grid |
| 5 | `src/app/layout.tsx` font additions | Source Serif 4 + JetBrains Mono via `next/font/google` |
| 5 | `src/app/globals.css` utility classes | `.serif`, `.mono`, `.tabular`, `.label-xs`, `.kbd`, `.cta-primary`, `.sec-in*`, `.skip`, `.placeholder-stripe`, `.hairline` |
| 6 | `src/app/start/page.tsx` + `not-found.tsx` | HTTP 404 placeholder |
| 7 | 8 remaining hero variants (Declarative · Typographic · ProductForward · OutcomeLed · TwoColumn · Empathetic · Atmospheric · Diagrammatic) | Translation from `hero-explore/heroes_a.jsx` + `heroes_b.jsx` |
| 7 | `src/app/dev/heroes/page.tsx` | Comparison gallery rendering all 9 variants stacked |
| 8 | `tests/marketing/colocation.test.ts` | Marketing colocation contract |
| 8 | `verification.md` final-state | Evidence per AC + 6-dim preview-deploy table |

**Critical:** Until phase 4 ships, the Vercel preview at `construct-dev.vercel.app` will continue rendering the prior placeholder + S-F1/F3/F4/F2 demo grid. The "first cohesive Vercel preview" goal needs phases 4 + 5 (~500L combined) before it's user-visible.

## KPI signals

- **Tests:** 73 passing across 14 files (atom + section + hero + barrel coverage). All `npx vitest run tests/unit/components/marketing/` green at wrap.
- **Auto-review:** not yet fired — no PR opened during the session. Will fire on the wrap PR.
- **Cumulative `reviewer-architecture` retain/drop:** still 1/5 from PR #87 (S-F2 first-catch). Session 65 was the planned 2nd formal trigger but no PR opened to fire the gate. Trigger window slips to whenever the S-M1 PR opens.

## Lessons

### Lesson 1 — Initial sizing was wrong; design fidelity exceeded the kickoff estimate

Kickoff sized S-M1 as **M (~300-500L)**. Reality after the design source was decoded: **L+ (~2200L for the all-in-one path)**. The kickoff drew its estimate from spec 42's positioning text (a few short sections); the Claude AI Design canvas ships 9 production-ready page modules + 9 hero variants — substantially more surface than spec 42 alone listed.

Mitigation: the slice was scope-cut mid-execution from "9 hero variants in one PR" to "1 production hero (Editorial) + extensible map shape; 8 variants defer to S-M1.0a follow-up". The map (`HERO_VARIANTS` in `heroes/index.ts`) is forward-extensible — additional keys land without breaking consumers.

Forward action: when a new src/ slice's design source is committed via PR, decode it before AC-freeze and re-estimate. The kickoff line-count estimate is unreliable when the design canvas is the ground truth.

### Lesson 2 — TDD-guard requires a working test runner; node_modules was absent at session start

First impl attempts at `src/components/marketing/atoms/{icons,eyebrow,section-head,placeholder-tag}.tsx` were blocked by `tdd-guard` with `npm error npx canceled due to missing packages` — `vitest@4.1.5` wasn't installed because `node_modules/` was empty (fresh sandbox).

Mitigation: ran `npm install --no-audit --no-fund` (27s, 523 packages); then re-attempted writes. TDD-guard's "first-creation auto-resolve" only resolves when the test runner can EXECUTE; if vitest can't be invoked, every src write blocks regardless of test-file existence.

Forward action (potential session-66 P-pick): consider a SessionStart hook addition that runs `npm install` if `node_modules/` is empty — would avoid the per-session friction. Or document the requirement explicitly in the kickoff template's "first action" list.

### Lesson 3 — Comment-review hook surfaced provenance rot in slice doc draft

`docs/slices/S-M1-marketing/acceptance.md` initial draft included "Reviewer-architecture trigger: 2nd formal trigger post PR #87 first-catch ... If silent → drop verdict justified at 1/6." in §Pre-flight. Stub-mode hook flagged "PR #87" as provenance — per CLAUDE.md L215-222 "PR / session / slice provenance ... rot fast; live in PR description".

Mitigation: stripped the §Pre-flight retain/drop tracking block; verdict-tracking belongs in HANDOFF (this doc) and PR descriptions. The slice doc kept only durable AC content + §Status footer.

Pattern: stub-mode comment-review continues to catch the four regex-tractable anti-patterns at write-time. WHAT-narration in test descriptions remains a stub-mode blind spot — would surface only with `COMMENT_REVIEW_SPAWN=1` live mode (carry-over P5).

### Lesson 4 — Path B (all-in-one) was over-ambitious for a single session; partial-ship is the honest landing

User explicitly chose path B (production landing + 9 hero variants + dev gallery) over path A (sequential S-M1 then S-M1.1). Session budget couldn't carry the full L+ scope to completion. Honest landing: ship phases 1-3 to the branch (foundation + production hero), defer phases 4-8 (page wiring + remaining variants + dev gallery + verification) to session 66.

This isn't a path-A regression — the foundation is built per path B's plan; the variant-set surface stays open for session 66 to fill in. Slice docs (`acceptance.md` AC-2 + AC-3) still describe the all-in-one target; verification deferral is documented in §Status when the slice ships.

Forward action: when path-B-style scope clearly exceeds one session's budget at AC-freeze time, propose path A explicitly even if user's first-pass preference was B. Or split into S-M1a (this session's scope) + S-M1b (next session's scope) at AC-freeze rather than ship-time.

### Lesson 5 — Session-start budget arithmetic should account for `npm install` first-run overhead

The line-count tracker fires at 1000L (soft) / 1500L (warn) / 2000L (stop). Session 65 hit 1500L warn after Phase 2 sections committed; 1723L after Phase 3 hero. Phase 4 page wiring would have pushed past 2000L stop.

The npm install + initial discovery turns + design-source decode + slice doc drafting consumed substantial early budget before any code shipped. Consider front-loading the cheap stuff (verification + design decode) into a separate session if the slice is L+ — keeps the implementation session purely focused on code + tests.

## Persona findings recorded

Auto-review on PR #90 fired at PR-open and returned **`parse-failed`** verdict (`degraded mode — security,architecture,correctness,style specialist(s) inconclusive (envelope missing or unparseable)`). Per CLAUDE.md verdict mapping `parse-failed` is a rigour-malfunction path that gates the merge → admin-bypass squash-merge applied per Constraint #25 (CODEOWNERS solo-operator).

**Diagnosed cause (high-confidence hypothesis, unverified):** PR diff included `docs/design-source/marketing-landing/Landing Page - Standalone.html` — a 2.1MB file with one line at **2,119,733 characters** (the Claude AI Design bundler embeds the entire React template as a base64+JSON-escaped string on a single line). All 4 specialists hit the same failure pattern (rather than 1-2 random API flakes), pointing at common-input issue. **Session 66 P0 includes a reproducibility check + likely path-ignore fix** for `docs/design-source/**`.

**Retroactive review spawned via `Agent` tool** against a clean diff (`git diff 9c751f0..origin/main -- ':(exclude)docs/design-source/**' ':(exclude)docs/HANDOFF*' ':(exclude)docs/SESSION-CONTEXT.md'` = 99KB, 32 files, 2365L). 3 of 4 specialists returned with findings (style specialist's notification did not surface in this session; outcome TBC).

### Aggregate verdict (k=2 default)

`request-changes` — 1 specialist (architect) voted `blocking: true` on the AC-8 token deviation; below k=2 quorum → derived verdict is `request-changes` (advisory; merge-button-equivalent: neutral). 0 blocking-by-quorum, multiple non-blocking real findings worth addressing.

### Per-specialist findings

| Persona | Findings | Real catches main convo missed |
|---|---|---|
| `reviewer-architecture` | 6 (1 `issue/blocking` AC-8 token bypass on phase colours; 1 `thought` on repeated module-level token aliases; 1 `note` on missing top-level marketing/index.ts; 1 `thought` on editorial.tsx 351L data-vs-rendering split candidate; 2 `praise` on hexagonal-seam cleanliness + Ic factory) | Y · 1 substantive catch (AC-8 token bypass; same hex values are exposed as `--ds-color-phase-*` tokens — design-system seam violated). Locks **RETAIN** at 2/6 cumulative (≈ 1-per-3 cadence meets bar). |
| `reviewer-correctness` | 13 (7 `issue/non-blocking` + 3 `suggestion` + 1 `nitpick` + 1 `praise` + 1 `thought`) | Y · 6+ catches: (1) AC-8 token deviation in journey + editorial (matches architect); (2) **NEW vs architect** — TrustBand `#166534` Check + `#D6D3CC` separators hardcoded; (3) **NEW** — Wordmark `#111` (3 places) is DARKER than `--ds-color-ink` `#1A1A1A`, not even a token-match; (4) **internal slice-doc contradiction** — `security.md` §8 says `/start` returns HTTP 200, AC-4 says HTTP 404; mid-session AC-4 revision wasn't propagated; (5) editorial test "renders editorial composition signature" only asserts `The Settlement` + 4 area names, missing §1/§2/§3/§4 prefixes + 4 distinct orbit-card DOM nodes; (6) editorial test "trust band signals" only asserts FCA-regulated, missing read-only + free-until-signup; (7) `ChildrenIcon` exported (defensible — avoids React.Children) but AC §15 still says `Children`. |
| `reviewer-security` | 6 (1 `suggestion/non-blocking` + 4 `note` + 1 `praise`) | Y · T0 Public verified (zero `dangerouslySetInnerHTML`/`process.env`/`@/lib/auth`/`fetch()`/`eval()`/`useState`/`useEffect`/`onClick` across 32 files; secrets sweep clean; no package.json changes; all `href` values internal). 1 forward-flag: `CTAPrimary.href` accepts arbitrary strings; if a future caller passes user-controlled data, `javascript:` scheme would not be blocked at component layer. Out of scope for T0 / S-M1; defer to slice that adds CMS-driven CTAs. |
| `reviewer-style` | TBC — agent launched async; completion notification did not surface in this session. Carry to session 66 P0 first action: re-spawn or check via `gh run view` artefacts. | TBC |

### Cumulative retain/drop signal (through session 65)

- **`reviewer-style`: STRONG retain** unchanged at 5/5 (this session's run TBC; pending re-spawn). Prior catches: PR #74 + #80 + #83 + #85 + #87.
- **`reviewer-correctness`: STRONG retain** advances to **6/6** — substantive AC-vs-impl catches consistent across slices.
- **`reviewer-security`: MODERATE retain** at **2/6** — 1 substantive blocking finding (PR #85 CLI injection) + today's URL-prop forward-flag (non-blocking T0 advisory). Pattern continues: heavy non-action on T0-Public surfaces; meaningful catches on real surface-area slices.
- **`reviewer-architecture`: RETAIN LOCKED** at **2/6** ≈ 1-per-3 cadence meets the CLAUDE.md retention bar ("at least one issue the main conversation missed per 2-3 slices"). PR #87 first-catch (page-wrapper scope-creep / `bodyAs` solution) + this session's AC-8 token-bypass blocking finding. The architect's catch was the load-bearing question for the trigger window; **drop verdict NOT justified**. Persona stays in `.claude/agents/`.

### Carry-overs to session 66 P0

Three actionable concerns surfaced by retroactive review that ship as session 66 P0 fix-up before phase 4-5 wiring begins:

1. **AC-8 token deviation fix (~30L)** — replace hex literals with `var(--ds-color-*)` references in 4 files: `journey.tsx` `PHASE` const (build/reconcile/settle/finalise — start has no S-F1 token, marketing-scoped inline OK), `editorial.tsx` AREAS + ORBIT_CARDS accent fields, `trust-band.tsx` Check colour + separator dot, `wordmark.tsx` `#111` × 3 (decide whether `#111` is a deliberate brand-mark shade vs token drift).
2. **Slice-doc reconciliation (~5L)** — `security.md` §8 update HTTP 200 → HTTP 404 to match AC-4 + acceptance.md §15 add `Children → ChildrenIcon (renamed to avoid React.Children collision)` clarification.
3. **Test additions (~30L)** — editorial.test.tsx: assert §1/§2/§3/§4 prefixes + 4 orbit-card DOM nodes (e.g. `data-orbit-card="true"` for stable querying); add the 2 missing TrustBand-integration assertions (read-only + free-until-signup).

Plus: auto-review path-ignore for `docs/design-source/**` (~10L workflow change) — quick reproducibility check first (open a tiny PR to confirm parse-failed doesn't recur).

## Branch state at session-65 wrap

- **Wrap branch:** `claude/decouple-session-65-lT8VM`
- **`main` tip:** `9c751f0` (unchanged from session-64 wrap)
- **Open PRs at wrap:** wrap PR opens after this commit. PR #89 (`rossdelarge247-debug-patch-2`) remains open — superseded by the session-65 branch which incorporates its files at the slug location; safe to close once session-65's PR squash-merges.
- **Live rigour gates** unchanged from session-64. Multi-agent auto-review at k=2 default + differential mode + per-specialist filter + TDD-guard (recurred this session — required `npm install` before unblocking) + parser schema validation + author-time comment review + plan-review default-spawn + synthetic-deliberate-injection per-persona regression detection.

## Next-session priority recommendations

S-M1 partial — phases 4-8 are what stands between the branch and "first cohesive Vercel preview". Recommended ordering:

| Priority | Pick | Why | Sizing |
|---|---|---|---|
| 🥇 P1 | **S-M1 phase 4-5** (page composition + layout fonts + globals.css utility classes) | Wires the foundation onto `src/app/page.tsx`. After this lands, the Vercel preview shows the cohesive landing. | M-L (~500L) |
| P2 | **S-M1 phase 6** (`/start` placeholder + not-found) | HTTP 404 native per AC-4 revision; CTAs from landing now have a destination | S (~80L) |
| P3 | **S-M1 phase 8** (verification.md final-state evidence per AC + 6-dim rubric) | Required for slice DoD #1; opens the door to PR #N S-M1 squash-merge | S-M (~100L) |
| P4 | **S-M1.0a** — 8 remaining hero variants (Declarative · Typographic · ProductForward · OutcomeLed · TwoColumn · Empathetic · Atmospheric · Diagrammatic) + `/dev/heroes` gallery | Path B's full surface; defers neatly because `HERO_VARIANTS` map is forward-extensible | L (~700L) |
| P5 | **TDD-guard auto-allow extension** (carry-over from session 64 P2) | `TDD_GUARD_REDGREEN_OVERRIDE=1` env hatch + lint-fix-refactor case detection. Sextuple-confirmed bash-heredoc/sed/awk escape across sessions 61-64. Would also potentially fix the `npm install`-not-run blocker if the env hatch covers degraded runner state. | S (~10-15L) |
| P6 | **Lockfile divergence fix** (carry-over from session 64 P3) | `eslint-plugin-react-hooks@7.0.1` (npm) vs `7.1.1` (pnpm); investigate why S-INFRA-1 dual-lockfile guard didn't catch | S-M |

**Cohesive-product trajectory** (re-cadenced after session-65 partial-ship):
- 1 session to first cohesive entry-point (P1 lands → real landing visible on Vercel preview)
- 4-6 sessions to user-testable Build phase end-to-end
- 10-13 sessions to all 5 phases minimally populated
- 18+ sessions to production-grade

**Persona retain/drop monitoring carries over** — `reviewer-architecture` cumulative 1/5 (PR #87 first-catch). Session 66 (S-M1 completion PR) is the next formal trigger. Architect-catch on a real architectural concern → retain at 2/6 (≈ 1-per-3 cadence). Silent → formal drop verdict justified at 1/6.

## Carryover open items

- PR #89 still open at wrap (`rossdelarge247-debug-patch-2`) — superseded by session-65 branch via cherry-pick + slug move. Close in favour of session-65 PR squash-merge.
- AC-4 + T-4 revisions for HTTP 404 `/start` are committed in `afc4f65`; impl pending session 66 P2.
- `Source Serif 4` (vs design's `Source Serif Pro`) — accepted as production substitute; documented in §What shipped above.
