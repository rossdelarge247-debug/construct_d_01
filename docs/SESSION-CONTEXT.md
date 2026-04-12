# Session 9 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.

## Branch Status

**Latest work:** merged to `main`. Session 8 branch: `claude/decouple-v2-workspace-fX7nK`.

| Branch | Status | Action |
|--------|--------|--------|
| `main` | Session 7 work merged (`a73a7f7`) | Up to date |
| `claude/decouple-v2-workspace-fX7nK` | Session 8 specs added | Merge to main at session end |
| Old branches | All superseded | Delete via GitHub UI |

## What Session 8 Accomplished

**P0 delivered:** Bank-first journey redesign — two spec documents:

1. **Spec 20 — Bank-First Journey** (`docs/workspace-spec/20-bank-first-journey.md`):
   - Revised hero panel state machine: bank connect as primary action, upload as secondary
   - New State 1 layout: prominent bank connect card with trust signals, smaller upload zone
   - New State 5: targeted upload for specific gap documents (not generic upload)
   - Config flow amendments: "Connect your bank now" CTA on config summary
   - Lozenge system: new "Connected" and "Gap" states
   - Summary redesign: short, specific gap lists with provider names

2. **Spec 21 — Evidence Model** (`docs/workspace-spec/21-evidence-model.md`):
   - Four-tier evidence strength: Proved / Inferred / Gap / Invisible
   - Complete Form E section mapping (what bank data proves per section)
   - Revised fidelity thresholds: bank connection alone = Draft
   - Gap analysis engine: detection rules, priority ordering, provider-specific messaging
   - Section card evidence indicators: source badges (Bank verified / Document / Estimate / Confirm?)

## Current State: V2 (Prepare)

Everything from session 7 plus:
- **Specs 20-21** define the bank-first journey — ready for implementation
- **No code changes** this session (planning session as intended)
- All previous code still working: AI pipeline, Tink integration, hero panel, section cards

## Session 9 Deliverables (suggested)

### P0 — Implement bank-first hero panel (spec 20)
Refactor `hero-panel.tsx` to implement the new State 1 layout: bank connect card as primary, upload zone as secondary. Add State 5 (targeted gap upload) after bank data review.

### P1 — Evidence source badges on section cards (spec 21)
Add source indicators to `section-cards.tsx`: "Bank verified" for bank-sourced items, gap prompts for missing documents. Update `FinancialItem` type with `evidenceSource` field.

### P2 — Gap analysis engine (spec 21)
Implement gap detection rules in a new `src/lib/gap-analysis.ts`. Compare bank data against Form E requirements, generate specific gap list with provider names.

### P3 — Lozenge system update (spec 20)
Add "Connected" and "Gap" lozenge states. Dynamic lozenge generation from bank data + gap analysis (replacing static config-only lozenges).

### P4 — Spec 14 wizard flows
Wire manual input stubs: `openManualInput`, `openSectionReview`, `addSection`.

## Negative Constraints
1. **Do not use `response_format`** — Anthropic SDK uses `output_config.format`
2. **Do not reference pre-pivot specs (03-06, 11, 12)** — architecture changed
3. **Structured output schemas require `additionalProperties: false` on all objects**
4. **SDK timeout is 90s per call, route maxDuration is 300s** — don't reduce
5. **Never show Form E codes to users** — human-readable labels always
6. **Tink user creation endpoint requires JSON** — not form-encoded
7. **Tink redirect URIs must be whitelisted** — in Tink Console, per domain

## Key Files
```
docs/workspace-spec/20-bank-first-journey.md    — Bank-first journey redesign (NEW)
docs/workspace-spec/21-evidence-model.md        — Evidence model + gap analysis (NEW)
src/lib/ai/pipeline.ts                          — Two-step extraction, output_config
src/lib/ai/result-transformer.ts                — Spec 13 decision trees + keyword lookup
src/hooks/use-hub.ts                            — Hub state, hero panel, bank data pickup
src/components/hub/hero-panel.tsx                — Hero panel (to be refactored per spec 20)
src/components/hub/section-cards.tsx             — Section cards (to add evidence badges)
src/lib/bank/tink-client.ts                     — Tink API client
src/lib/bank/tink-transformer.ts                — Tink → BankStatementExtraction
src/types/hub.ts                                — Types (to add evidenceSource to FinancialItem)
docs/workspace-spec/13-extraction-decision-tree-documents.md
docs/workspace-spec/18-visual-design-system.md
```
