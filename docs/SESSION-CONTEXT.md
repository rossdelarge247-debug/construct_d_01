# Session 16 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Deployment: Vercel — preview deployments per branch, production at `construct-dev.vercel.app`.

## What session 15 accomplished

**V1 public site overhaul, visual unification, and Tier 3 bug fixes. ~1,800 net lines across 32 files.**

### Tier 3 fixes (done first)
- **Tink provider name fix**: `fetchProviderDisplayNames()` resolves UUID → human-readable bank name via Tink providers API. Hardcoded fallback map preserved.
- **Commonly omitted prompts**: App-based banks (Monzo/Revolut/Starling, conditional on what's connected), closed accounts in last 12 months, director's loan account (for Ltd companies). All map to Form E fields, summaries updated.
- **CSV import for dev testing**: `csv-parser.ts` auto-detects Monzo, Barclays, Starling, generic formats. File input in dev chooser panel and TinkModal.

### V1 public site overhaul (bulk of session)
- **4-tier model established**: Orientate (free) → Prepare (£49) → Share & Negotiate (£99) → Finalise (£149)
- **Visual unification**: Entire V1 migrated to V2 design system — one palette, one header (centred), one footer (mega), shadow cards, ink-inversion selection, red-500 buttons. Zero legacy warmth/cream/sage refs remain.
- **Landing page**: New hero ("Financial disclosure, sorted"), 4-phase journey, pain-point solution cards, dual CTAs.
- **Pricing page**: Goldilocks 3-tier with free Orientate callout. Indicative pricing.
- **Features page**: 4-phase layout with feature cards and real copy per phase.
- **Interview restructure**: Finances merged from 4 → 2 screens. New partner awareness question. Readiness matrix cut (redirect). Next-steps replaced by /start/choose (Goldilocks pricing).
- **Login/logout stubs**: Navy "Log in" on V1 header, LogOut icon on V2 title bar.

### Specs written
- **Spec 28**: V1 public site overhaul (tier model, visual unification, interview streamline, data bridge, implementation priority)
- **Spec 29**: V2 personalisation opportunities (V1→V2 matrix, cross-section intelligence, 20-item prioritised backlog, design principles)

### Critical finding at end of session
- **User tested CSV import with real bank data** and the decisioning engine (result-transformer.ts, confirmation-questions.ts) showed significant issues with real-world transactions. This is the **top priority for session 16**.

## Current state of the codebase

**What works end-to-end:**
- V1 public site: landing → features → pricing → interview (situation → pathway → children/home → finances → plan → choose/save)
- V2 workspace: carousel → task list → bank connect → dev chooser (4 personas + CSV import) → reveal → confirmation (7 sections) → spending → financial summary → task list
- Unified visual design across V1 and V2 (one palette, one header, one footer)
- CSV import for real bank data testing (Monzo, Barclays, Starling, generic)
- Tink provider names resolved via API (no more UUIDs)

**What needs urgent attention:**
- **Decisioning engine effectiveness** — real CSV data exposed issues with how transactions are classified, categorised, and turned into confirmation questions. The extraction → question pipeline needs audit and improvement.
- Edit flows: links exist but not wired
- Children section: research done, design pending (user thinking)
- Post-divorce life/needs: not built
- Data bridge: V1 → V2 state not yet wired
- Auth + Supabase: not started

## Session 16 deliverables, priority order

### P0: Decisioning engine audit and improvement
1. **Audit result-transformer.ts with real data** — test with CSV import, identify classification failures
2. **Audit confirmation-questions.ts** — do the right questions fire for real transaction patterns?
3. **Improve keyword matching** — the current keyword lookup may miss common UK transaction descriptions
4. **Test all 4 personas + real CSV** — systematic comparison of what's detected vs what should be
5. **Fix false positives and false negatives** — tune confidence thresholds, expand payee matching

### P1: Core gaps
6. **Data bridge: V1 → V2** — V1 interview answers gate V2 sections (no children = no children section)
7. **Edit/review flow** — wireframe needed
8. **Structured summary export** — plain language summary for mediator/solicitor

### P2: Children & needs sections
9. **Children section** — user designing options, may have wireframes
10. **Post-divorce life / needs** — user designing

### P3: Infrastructure
11. **Auth + Supabase persistence**
12. **Test suite** — Vitest, currently 0 tests

## Negative constraints
1. V1 legacy palette is gone — do not reintroduce warmth/cream/sage colours
2. Red #E5484D is for primary CTAs only — not status, not decoration
3. Shadow-based card separation — no borders on cards
4. Ink inversion for selection states (Habito pattern) — not colour borders
5. Tink uses popup, not iframe
6. Edit flows are placeholder — do not wire up without wireframes
7. Do not reference pre-pivot specs (03-06, 11, 12)

## Key files
```
docs/SESSION-CONTEXT.md                    — START HERE every session
docs/HANDOFF-SESSION-15.md                 — Most recent session retro
docs/workspace-spec/28-v1-public-site-overhaul.md — V1 overhaul spec (tier model, visual, interview)
docs/workspace-spec/29-v2-personalisation-opportunities.md — V2 personalisation backlog
docs/workspace-spec/27-visual-direction-session11.md — Visual direction (now applied everywhere)
docs/workspace-spec/22-confirmation-flow-tree.md — Decision tree spec (audit against real data)
docs/workspace-spec/13-extraction-decision-tree-documents.md — Extraction decision trees
src/lib/ai/result-transformer.ts               — CRITICAL: decision trees + keyword lookup (audit target)
src/lib/bank/confirmation-questions.ts         — CRITICAL: question + summary generation (audit target)
src/lib/bank/csv-parser.ts                    — CSV import (test tool for decisioning audit)
src/lib/bank/bank-data-utils.ts               — Extraction utils + 4 test personas
src/lib/bank/tink-transformer.ts              — Tink → BankStatementExtraction
src/components/workspace/confirmation-flow.tsx  — Q&A (7 sections) + checklist step type
src/app/workspace/page.tsx                     — Flow state machine
src/app/page.tsx                               — Landing page (4-phase model)
src/app/pricing/page.tsx                       — Goldilocks pricing
src/app/features/page.tsx                      — 4-phase feature detail
src/app/start/finances/page.tsx               — Streamlined (priorities+worries, partner awareness)
src/app/start/choose/page.tsx                  — In-flow pricing chooser
src/components/layout/header.tsx               — Unified header (centred, login stub)
src/components/layout/footer.tsx               — Mega footer (3-column)
src/components/ui/button.tsx                   — Red-500 primary, 12px radius
src/components/interview/card-select.tsx       — Ink inversion selection
src/types/interview.ts                         — Interview types (added partner_awareness)
```
