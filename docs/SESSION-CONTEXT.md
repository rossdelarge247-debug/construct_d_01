# Session 7 Context Block

Product: **Decouple** — financial disclosure workspace for UK divorce (Form E replacement).
Stack: Next.js 16.2, React 19, TypeScript, Tailwind 4, Supabase, Claude AI, Vercel Pro.

## Branch Status (start-of-session checklist)

**Canonical branch:** `claude/read-session-context-jOy6a` at commit `8142ff8` — merge to `main` pending.

| Branch | Status | Action |
|--------|--------|--------|
| `main` | `9d884b6` — behind session 6 work | Merge session 6 branch into main |
| `claude/read-session-context-jOy6a` | `8142ff8` — session 6 work | Merge to main, then delete |
| `claude/new-session-GUZLb` | Same as old `main` | Delete via GitHub UI |
| `claude/project-planning-sprint-zero-odNO5` | Superseded | Delete via GitHub UI |
| `claude/review-handoff-docs-ZovbO` | Archived in `docs/archive/` | Delete via GitHub UI |
| `claude/review-handoff-session-4-8Isd9` | Archived in `docs/archive/` | Delete via GitHub UI |

**Session start protocol:**
1. Run `git log --oneline -1 origin/main` to confirm the latest commit on `main`
2. Run `git branch -r` to see all remote branches
3. Create your session branch from `main` (or rebase onto it)
4. At session end: merge to `main`, record final commit SHA here, mark old branches for deletion

## What Session 6 Accomplished

All 4 core deliverables completed + 5 UX refinements from live testing:

1. **Keyword lookup table** — 13 categories, auto-confirms common payees (therapy→Healthcare, DVLA→Vehicle costs, Netflix→Subscriptions)
2. **Payment aggregation** — groups multiple payments to same payee, dividend detection for company disclosure
3. **Answered questions → financial items** — ID-based matching + answer-driven item creation with proper section routing
4. **Progressive category dropdown** — searchable Form E 3.1 categories, replaces generic radio buttons
5. **Form E category grouping** — section cards group items by Form E budget category with totals
6. **Income question redesign** — "Dividends from my own company" / "Salary from my own company" distinguished from generic self-employment
7. **Progressive disclosure standardised** — "Something else" is a radio button that reveals sub-options
8. **Account display humanised** — "Your Barclays current account ending 8598", "11 months remaining for full disclosure"
9. **Overdraft routing** — account always in Accounts, overdraft additionally in Debts

## Current State: V2 (Prepare)

- **AI pipeline:** Two-step Haiku→Sonnet with structured outputs. Working on Vercel with real PDFs. ~80s total.
- **Keyword lookup:** 13 categories, runs before generic questions. Eliminates many unnecessary questions.
- **Payment aggregation:** Groups payments by normalised payee name. Dividend detection for company disclosure.
- **Category selector:** Searchable Form E 3.1 dropdown, used as progressive disclosure under "Something else" radio.
- **Section cards:** Now group items by Form E category with totals as headers. `formECategory` field on `FinancialItem`.
- **Question → item flow:** Answering a clarification question now reliably creates a financial item in the correct section.
- **Open Banking:** Not yet integrated. Tink deferred to backlog. Keyword/aggregation layer is ready for it.
- **State:** localStorage only. Supabase schema ready but not wired.

## Session 7 Deliverables (suggested)

### P0 — Most recent statement deduplication
When multiple statements are uploaded for the same account (same provider + last4), only the most recent closing balance should appear. Compare `asAtDate` and deduplicate in `use-hub.ts`.

### P1 — Update dry-run mock data
The dry-run mock in `provider.ts` uses the old pre-pipeline schema shape (items/gaps/spending). Update it to match the current `BankStatementExtraction` shape so features can be tested without an API key.

### P2 — Tink Open Banking integration
Connect bank accounts via Tink Link. Fetch 12 months of enriched transactions. Map Tink categories → Form E items using the keyword/categorisation layer.
- Prerequisites: Tink sandbox env vars (`TINK_CLIENT_ID`, `TINK_CLIENT_SECRET`)
- New files: `src/app/api/bank/connect/route.ts`, `callback/route.ts`, `src/lib/bank/tink-transformer.ts`

### P3 — Other items from backlog
- Spec 14 wizard flows (manual input for property, pensions, debts)
- Wire `openManualInput`, `openSectionReview`, `addSection` stubs
- Visual quality pass (spec 18)

## Testing & Deployment
- **Vercel:** Deployed and working. Real PDFs tested on Vercel Pro (300s timeout).
- **ANTHROPIC_API_KEY:** Configured in Vercel env vars. Real AI pipeline works — no need for dry-run mode.
- **Dry-run mock:** Uses the old pre-pipeline schema shape. Not useful for testing post-pipeline features. Always test with real API key.
- **Test approach:** Push branch → Vercel auto-deploys → test in browser with real PDFs.

## UX Patterns Established (session 6)

These patterns should be followed consistently in future work:

1. **Progressive disclosure via radio** — "Something else" is always a radio button in the same group. Selecting it reveals sub-options beneath. Selecting another radio collapses the disclosure. Never use a separate toggle button.
2. **Form E category selector** — when "Other" is selected on any question, reveal the searchable Form E category dropdown. Don't submit a dead-end "other" value.
3. **Human-readable labels** — never show Form E section codes to users. Use descriptive labels ("Vehicle costs — monthly spending", not "Form E 3.1").
4. **Account display** — "Your [joint] {Provider} {type} ending {last4}". Months framed as remaining ("11 months remaining"), not provided.
5. **Category grouping** — section cards group items by `formECategory` when 2+ items share a category. Show category total as header, individual items nested within.

## Negative Constraints
1. **Do not use `response_format`** — Anthropic SDK uses `output_config.format`
2. **Do not reference pre-pivot specs (03-06, 11, 12)** — architecture changed
3. **Structured output schemas require `additionalProperties: false` on all objects**
4. **SDK timeout is 90s per call, route maxDuration is 300s** — don't reduce these
5. **Tink env vars:** `TINK_CLIENT_ID`, `TINK_CLIENT_SECRET` — check these exist before building Tink routes
6. **Never show Form E codes to users** — use human-readable labels always

## Session Discipline
- Track lines of code changed. Flag at ~1,500, stop at ~2,000
- Before generating handoff: commit all work, write `docs/HANDOFF-SESSION-{N}.md`
- Then write `docs/SESSION-CONTEXT.md` for the next session

## Key Files
```
src/lib/ai/pipeline.ts                     — Two-step extraction, output_config
src/lib/ai/extraction-schemas.ts           — Slimmed schemas (facts only, no reasoning)
src/lib/ai/extraction-prompts.ts           — Document-type-specific prompts
src/lib/ai/result-transformer.ts           — Spec 13 decision trees + spec 19 keyword lookup + aggregation
src/app/api/documents/extract/route.ts     — Upload API, 300s maxDuration
src/hooks/use-hub.ts                       — Hub state, hero panel, item management, answer→item creation
src/components/hub/hero-panel.tsx           — 8-state hero panel, progressive disclosure pattern
src/components/hub/category-selector.tsx   — Searchable Form E 3.1 category dropdown
src/components/hub/section-cards.tsx       — Form E category grouping with totals
src/types/hub.ts                           — FinancialItem with formECategory field
docs/workspace-spec/19-intelligent-categorisation.md — Keyword lookup, aggregation, dropdown spec
docs/workspace-spec/13-extraction-decision-tree-documents.md — Decision trees per document type
docs/HANDOFF-SESSION-6.md                  — Session 6 retro
```
