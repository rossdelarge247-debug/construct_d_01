# Session 5 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.
Branch: `claude/review-handoff-docs-ZovbO`

## Core Principles
- "Quality first, rigour always" — no shortcuts, design before code
- Upload-first, review-by-exception — AI does 90%, user confirms via 3-5 taps
- Every question maps to Form E — if it doesn't fill a disclosure field, don't ask
- Diagnose before fixing — read Vercel logs before changing code
- Fidelity is a continuum: Sketch → Draft → Evidenced → Locked (not binary done/not-done)
- 3 phases (Prepare/Resolve/Formalise), concurrent not sequential

## Current Vertical: V2 (Prepare)
- **Architecture:** Hub page + hero panel (8-state machine). NOT tabs/sidebar (that was pre-pivot)
- **AI pipeline:** Two-step: Haiku reads PDF → Sonnet analyses text with structured outputs. 7 doc types
- **Pipeline 504s on Vercel** — undiagnosed blocker. Models work (health check confirms). Logs not checked
- **Confidence thresholds:** auto ≥0.95, clarify 0.80-0.95, flag <0.80
- **Hub components built:** title-bar, hero-panel, discovery-flow, section-cards, evidence-lozenge, fidelity-label
- **State:** localStorage only. Supabase schema ready but not wired
- **Zero visual testing done** — components untested in browser

## Latest Spec Delta / Gotchas
- Active specs are **13-18** (post-pivot). Specs 03, 04, 05, 05b, 11, 12 are **superseded**
- `pipeline.ts` has `[Pipeline]` console.log breadcrumbs at every step — read Vercel logs
- Models: `claude-haiku-4-5-20251001` + `claude-sonnet-4-6` (plain IDs, no date suffix — date-suffixed 404)
- SDK timeout: 45s per call. Route `maxDuration=120`. Vercel Pro allows 300s
- `use-hub.ts` has 3 TODO stubs: `openManualInput`, `openSectionReview`, `addSection`
- Spec 14 wizards (manual input flows) not yet built
- Session 3 retro: 5 deploy cycles wasted guessing model IDs. Health check was added as afterthought, not first

## Negative Constraints
1. **Do not change model IDs without reading Vercel function logs first** — Session 3 proved this wastes time
2. **Do not build new features until the 504 is resolved and pipeline tested end-to-end in browser**
3. **Do not reference pre-pivot specs (03-06, 11, 12) for new work** — the architecture changed fundamentally

## Session Discipline
- **Track lines of code changed.** After every file edit, maintain a running count of net lines added/modified this session
- **At ~1,500 lines changed, flag it.** Say: "Approaching session scope limit (~1,500 lines). Recommend wrapping up soon."
- **At ~2,000 lines, stop writing code.** Commit, push, and generate the next session's context block (same format as this document). Quality degrades past this point — better to hand off clean than push through degraded
- **Before generating the handoff:** commit all work, update `docs/HANDOFF-SESSION-{N}.md` with retro (what went well, what went wrong, what's unfinished), then write `docs/SESSION-CONTEXT.md` for the next session

## Session 5 Deliverables
1. Read Vercel function logs for `/api/documents/extract` — find the `[Pipeline]` breadcrumb where it dies
2. Test Step 1 (Haiku PDF) and Step 2 (Sonnet structured outputs) in isolation
3. Apply one targeted fix based on evidence
4. Start dev server, test full flow in browser: discovery → upload → hero panel → section cards
5. Begin visual quality pass per spec 18

## Key Files
```
src/lib/ai/pipeline.ts                     — Two-step extraction, 45s timeouts
src/app/api/documents/extract/route.ts     — API entry, 120s maxDuration
src/app/api/health/route.ts                — Model availability checker
src/hooks/use-hub.ts                       — Hub state, hero panel state machine
src/types/hub.ts                           — Full type system
docs/HANDOFF-SESSION-3.md                  — Session 3 retro + 504 analysis
docs/README.md                             — Doc index + reading order
docs/workspace-spec/16-hero-panel-flow.md  — Core interaction spec
```
