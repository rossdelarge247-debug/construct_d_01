# Session 15 Handoff — V1 overhaul, visual unification, decisioning engine flag

**Date:** 14 April 2026
**Branch:** `claude/decouple-v2-financial-disclosure-6jPX0`
**Lines changed:** ~1,800 net across 32 files (2 new spec docs, 1 new page, 1 new utility)

## What happened

### Tier 3 bug fixes (first hour)

1. **Tink provider name fix** — added `fetchProviderDisplayNames()` to tink-client.ts. Calls Tink providers API with `providers:read` scope to resolve `financialInstitutionId` UUIDs to human-readable names. Hardcoded fallback map preserved. Callback route resolves names before transforming.

2. **Commonly omitted prompts** — 3 new question sequences in confirmation-questions.ts:
   - App-based banks: "Do you have Monzo, Revolut, Starling...?" (skips if already connected)
   - Closed accounts: "Closed any accounts in the last 12 months?" (Form E requires)
   - Director's loan: "Do you have a director's loan account?" (shows for Ltd companies only)

3. **CSV import** — new csv-parser.ts. Auto-detects Monzo, Barclays, Starling, generic CSV formats. Parses transactions into BankStatementExtraction with income/payment/spending analysis. File input added to dev chooser panel and TinkModal fallback.

### V1 public site overhaul (bulk of session)

4. **4-tier model** — Orientate (free) → Prepare (£49) → Share & Negotiate (£99) → Finalise (£149). Goldilocks pricing with Share as default.

5. **Visual unification** — migrated ALL V1 components to V2 design system:
   - Header: centred logo, white bg, 64px height, Features/Pricing/Login
   - Footer: 3-column mega (Product, Support, Legal) + bottom bar
   - Button: warmth → red-500, radius 4px → 12px
   - CardSelect: ink inversion (Habito pattern), shadow cards
   - InterviewLayout: cream → off-white, warmth bar → red bar, "N of M" counter
   - Explainer: shadow cards, V2 typography
   - MicroMoment: ink-faint → ink-tertiary

6. **Landing page** — complete rewrite. Hero: "Financial disclosure, sorted." 4-phase journey cards, pain-point solution cards (Open Banking, managed comms, court-ready docs, control), dual CTAs.

7. **Pricing page** — Goldilocks 3-tier layout. Free Orientate callout. Indicative one-off pricing. "Most popular" badge on Share. Green tick feature lists.

8. **Features page** — 4-phase layout with numbered red badges, feature cards per phase, real copy describing product capabilities. Bottom CTA.

9. **Interview restructure**:
   - Finances: 4 screens → 2 (priorities+worries combined, partner awareness new)
   - Readiness matrix: cut entirely → redirect to /start/finances
   - Next-steps: cut entirely → redirect to /start/choose
   - New /start/choose: Goldilocks pricing page at end of interview flow
   - Partner awareness question: "What do you know about your partner's finances?" (strategic bridge to Tier 2)

10. **Colour cleanup** — zero legacy warmth/cream/sage/ink-light/ink-faint references remain in any /start/ page.

### Specs

11. **Spec 28** — V1 public site overhaul plan (tier model, visual unification, interview streamline, data bridge V1→V2, implementation priority)
12. **Spec 29** — V2 personalisation opportunities (section gating, tone adaptation, cross-section intelligence, 20-item P1-P4 backlog, design principles)

## What went well
- Visual unification was systematic and thorough — batch replacements then manual fixes for structural changes
- The 4-tier model feels right — Orientate is genuinely useful free, Share is the obvious default
- Partner awareness question fills a real gap — it's the one thing bank data can't tell us
- Interview went from ~28 screens to ~12, 25 min to ~5 min

## What could improve
- Should have tested the CSV import with real data earlier — the user found decisioning engine issues at the end of the session
- The plan page still references the old confidence matrix data (session.confidence) which won't be populated in the new flow — needs a rethink for how the plan page works without the readiness matrix
- Some V1 pages (route, plan) reference helper functions (getFinancialReactions, calculateTier) that may need updating for the streamlined data model

## Key decisions
- Red-500 for ALL primary CTAs across both V1 and V2 — no more warmth (burnt orange)
- Ink inversion (Habito pattern) for ALL selection states — not colour borders
- 10-domain readiness matrix cut entirely — bank data makes self-reported confidence obsolete
- Partner awareness is the new strategic question — bridges to Tier 2 upsell
- One-off pricing (not subscription) — £49/£99/£149 indicative

## Critical issue for next session
**The decisioning engine needs urgent attention.** The user tested the CSV import with their own real bank data and the result-transformer.ts / confirmation-questions.ts pipeline showed significant issues — transactions not being classified correctly, wrong questions firing, signals being missed. This is the **P0 priority for session 16** before any new features are built.

## Bugs / issues to note
- Plan page references `session.confidence` data that won't exist in the streamlined flow (readiness matrix was cut)
- `calculateTier()` in plan/page.tsx depends on confidence values — needs updating for new flow
- Old readiness and next-steps pages are redirects, not deleted — the components still exist in git history
- Confirmation flow Q&A answers still don't persist mid-flow (only completed confirmations survive reload)
- Edit links throughout all sections still placeholder
- 9-segment progress bar still untested on mobile
