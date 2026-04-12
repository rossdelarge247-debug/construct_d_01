# Session 8 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.

## Branch Status (start-of-session checklist)

**Canonical branch:** `claude/decouple-v2-workspace-1cX72` at commit `fd237fd` — merge to `main` pending.

| Branch | Status | Action |
|--------|--------|--------|
| `main` | `dc398f9` — session 6 work merged | Merge session 7 branch into main |
| `claude/decouple-v2-workspace-1cX72` | `fd237fd` — session 7 work | Merge to main, then delete |
| `claude/read-session-context-jOy6a` | Merged to main in session 7 | Delete via GitHub UI |
| `claude/new-session-GUZLb` | Superseded | Delete via GitHub UI |
| `claude/review-handoff-docs-ZovbO` | Archived | Delete via GitHub UI |
| `claude/review-handoff-session-4-8Isd9` | Archived | Delete via GitHub UI |

**Session start protocol:**
1. Run `git log --oneline -1 origin/main` to confirm the latest commit on `main`
2. Merge `claude/decouple-v2-workspace-1cX72` into main if not already done
3. Create your session branch from `main`
4. At session end: merge to `main`, record final commit SHA here

## What Session 7 Accomplished

3 deliverables completed + Tink Open Banking integration (partially blocked by config):

1. **Statement deduplication (P0)** — Same account uploaded twice → keep latest balance only. `getAccountKey()` + `mergeItemsDeduped()` in use-hub.ts, applied to all 5 item-merge paths.
2. **Dry-run mock data (P1)** — Extract route returns realistic BankStatementExtraction mock through real transformer when no API key. Full downstream (keyword lookup, aggregation, Q&A, section cards) works for testing.
3. **Tink Open Banking (P2)** — Full server-side infrastructure + UI wiring. Tink Link URL generates successfully. **Blocked on:** redirect URI whitelist in Tink Console (Vercel preview URLs change per deployment — need stable production domain).

## Current State: V2 (Prepare)

- **AI pipeline:** Two-step Haiku→Sonnet. Working on Vercel with real PDFs. ~80s total.
- **Keyword lookup:** 13 categories. Eliminates many unnecessary questions.
- **Payment aggregation:** Groups by normalised payee. Dividend detection.
- **Category selector:** Searchable Form E 3.1 dropdown.
- **Section cards:** Group items by Form E category with totals.
- **Statement dedup:** Same provider+last4 → keep most recent by asAtDate.
- **Dry-run mode:** Realistic mock data through real pipeline when no API key.
- **Open Banking:** Full Tink flow working end-to-end. Sandbox tested. Must use stable production domain for redirect URI.
- **Hero panel:** Shows "Connect your bank" (Open Banking) + drag-drop upload zone.
- **State:** localStorage only. Supabase schema ready but not wired.

## Session 8 Deliverables (suggested)

### P0 — Complete Tink Open Banking testing
Fix the redirect URI configuration: use a stable Vercel production URL or custom domain. Add it to Tink Console. Test the full flow: connect → bank selection → callback → Q&A. May need to reinstate the auth-code flow once the redirect URI works (the no-auth-code flow may not return enough user context).

### P1 — Spec 14 wizard flows
Wire the manual input stubs: `openManualInput`, `openSectionReview`, `addSection`. Start with property, pensions, and debts wizards — these are the sections most likely to need manual input when no document is uploaded.

### P2 — Visual quality pass (spec 18)
Lozenges, drag-drop zone refinement, accessibility review. The Tink debug panel should be hidden by default in production.

### P3 — Cross-document intelligence
Same account across multiple statements. Missing months detection. Requires statement dedup (P0 done) as foundation.

## Testing & Deployment
- **Vercel:** Deployed and working. Real PDFs tested on Vercel Pro (300s timeout).
- **ANTHROPIC_API_KEY:** Configured in Vercel env vars.
- **TINK_CLIENT_ID / TINK_CLIENT_SECRET:** Configured in Vercel env vars. Sandbox credentials valid.
- **Tink redirect URI:** Needs stable URL added to Tink Console. Preview URLs change per deployment.
- **Dry-run mock:** Now uses current BankStatementExtraction schema. Works without API key.

## UX Patterns Established (sessions 6-7)

1. **Progressive disclosure via radio** — "Something else" is always a radio button. Reveals sub-options beneath.
2. **Form E category selector** — Searchable dropdown under "Other". Never submit a dead-end "other" value.
3. **Human-readable labels** — Never show Form E codes to users.
4. **Account display** — "Your [joint] {Provider} {type} ending {last4}". Months as remaining.
5. **Category grouping** — Section cards group by `formECategory` when 2+ items share a category.
6. **Connect or upload** — Hero panel shows both options: Open Banking connect + drag-drop upload.

## Negative Constraints
1. **Do not use `response_format`** — Anthropic SDK uses `output_config.format`
2. **Do not reference pre-pivot specs (03-06, 11, 12)** — architecture changed
3. **Structured output schemas require `additionalProperties: false` on all objects**
4. **SDK timeout is 90s per call, route maxDuration is 300s** — don't reduce
5. **Never show Form E codes to users** — human-readable labels always
6. **Tink user creation endpoint requires JSON** — not form-encoded (all other Tink v1 OAuth endpoints use form-encoded)
7. **Tink redirect URIs must be whitelisted** — in Tink Console, per domain

## Key Files
```
src/lib/ai/pipeline.ts                     — Two-step extraction, output_config
src/lib/ai/extraction-schemas.ts           — Slimmed schemas (facts only, no reasoning)
src/lib/ai/extraction-prompts.ts           — Document-type-specific prompts
src/lib/ai/result-transformer.ts           — Spec 13 decision trees + spec 19 keyword lookup + aggregation
src/app/api/documents/extract/route.ts     — Upload API, 300s maxDuration, dry-run mock
src/hooks/use-hub.ts                       — Hub state, hero panel, item management, dedup, bank data pickup
src/components/hub/hero-panel.tsx           — 8-state hero panel, connect + upload options
src/components/hub/category-selector.tsx   — Searchable Form E 3.1 category dropdown
src/components/hub/section-cards.tsx       — Form E category grouping with totals
src/components/hub/tink-debug-panel.tsx    — Tink debug: credentials test, connect flow, diagnostics
src/lib/bank/tink-client.ts               — Tink API client (OAuth, user management, data fetch)
src/lib/bank/tink-transformer.ts          — Tink transactions → BankStatementExtraction
src/app/api/bank/connect/route.ts         — Generate Tink Link URL
src/app/api/bank/callback/route.ts        — Handle Tink redirect, fetch + transform data
src/app/api/bank/test/route.ts            — Test Tink credentials
src/types/hub.ts                           — FinancialItem with formECategory field
docs/workspace-spec/19-intelligent-categorisation.md — Keyword lookup, aggregation, dropdown spec
docs/workspace-spec/13-extraction-decision-tree-documents.md — Decision trees per document type
docs/HANDOFF-SESSION-7.md                  — Session 7 retro
```
