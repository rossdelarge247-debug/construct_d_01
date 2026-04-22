# V2 Decisions Register

**Vertical:** Build Your Picture (Financial Disclosure Workspace)
**Date range:** 7–10 April 2026
**Status:** In progress

This register captures architectural, UX, and technical decisions made during V2 implementation. It complements the Sprint 0 decisions register (`docs/sprint-0/decisions.md`) which covers foundational product decisions.

---

## Architecture decisions

### D1. Single upload zone at page level

**Decision:** One upload zone for all documents, positioned at page level. AI detects document type and routes items to the correct category tab.

**Alternatives considered:**
- Per-category upload zones (upload within each tab)
- Separate upload page with routing afterwards

**Why:** User sketched wireframes showing "one upload slot — system detects type." Reduces cognitive load. The AI should do the classification work, not the user. Aligns with design principle: upload-first, review-by-exception.

**Consequence:** Requires robust document classification. If classification fails, items end up in wrong categories. The `DOC_TYPE_TO_CATEGORY` mapping in `build/page.tsx` is currently basic and needs refinement.

---

### D2. localStorage for V2 state (Supabase deferred)

**Decision:** Workspace state lives in localStorage via `useWorkspace` hook. Supabase persistence deferred until auth upgrade path is built.

**Alternatives considered:**
- Supabase from day one (requires auth upgrade)
- Server-side session storage

**Why:** Anonymous auth is the current model. Wiring Supabase persistence requires the anonymous → authenticated upgrade path, which is V1.5 scope. localStorage lets us build and test the workspace without that dependency.

**Risk:** Data loss if user clears browser data. No cross-device sync. Must be replaced before any real user testing.

---

### D3. Two-tier tab structure

**Decision:** Page-level tabs (Preparation / Summary) + component-level tabs (category tabs within the upload area). Everything stays on one page (`/workspace/build`).

**Alternatives considered:**
- Separate pages per category (`/workspace/build/income`, etc.) — spec 06 describes this pattern
- Single flat tab bar mixing categories and views
- Accordion-based layout

**Why:** Keeps the user on one page while separating working mode (Preparation) from review mode (Summary). User wireframe specified tabs within the upload component area. Reduces navigation and maintains context.

**Spec reference:** `docs/workspace-spec/12-two-tier-tabs.md`

---

### D4. Step-through dialogue (not list dump)

**Decision:** AI analysis results are presented one question at a time in a step-through dialogue. Auto-confirmed items appear first as a batch, then confirms/questions/gaps are walked through individually.

**Alternatives considered:**
- Show all results as a scrollable list
- Show results grouped by tier (all auto, then all confirm, etc.)
- Conversational chat-style interface

**Why:** Reduces overwhelm. One decision at a time aligns with V1 design principle "one thing at a time." Answering auto-advances to the next step, creating flow.

**Known issue:** Auto-advance from auto items to first question required a fix (`47c18ac`). The `useEffect` timing is fragile.

---

### D5. First-time wizard before workspace

**Decision:** Three-step wizard (V1 playback → category scope selection → ready) before showing the full workspace. Persists to localStorage.

**Why:** Configures which disclosure categories are relevant to this user before overwhelming them with all 11 categories. Reduces "Form E shock." Creates a personalised starting point.

---

## AI model decisions

### D6. Haiku 4.5 for PDF analysis (single model)

**Decision:** Use `claude-haiku-4-5-20251001` as the only model for PDF document analysis. It is the only model confirmed working with `type: 'document'` PDF content blocks.

**Journey to this decision (6 commits of model churn):**

1. `653ca08` — Started with Haiku to fit Vercel Hobby 10s timeout
2. `888494c` — Tried fallback chain: Sonnet 4.6 → Sonnet 4.5 → 3.5 Sonnet → Haiku
3. `6e76b15` — Attempted "smart dry-run" + model upgrade to Sonnet
4. `ef8427d` — Attempted Sonnet model for richer analysis
5. `edf1788` — Sonnet model ID timing out, switched back to Haiku with improved prompt
6. `e466ddf` — Tried correct Sonnet model ID + longer timeout
7. `50af9a7` — **Final decision:** Haiku 4.5 is the only model that works with PDF `type: 'document'`

**Consequence:** Extraction quality is limited by Haiku's capabilities. Shallow extraction, potential hallucination, basic questions. The planned upgrade path is two-step: Haiku reads PDF text → Sonnet analyses the extracted text (avoiding the `type: 'document'` limitation).

---

### D7. Anti-hallucination prompt rules

**Decision:** Strict prompt rules added: "ONLY extract values EXPLICITLY STATED in the document", source_description must reference specific location, never invent or estimate.

**Why:** Haiku hallucinated a £13k asset not present in the uploaded document. In financial disclosure, invented values are worse than missing values — they could mislead users into inaccurate court filings.

**Status:** Rules added to prompt but not yet verified with a stronger model. The two-step Sonnet approach should provide better instruction-following.

---

### D8. Single-call PDF analysis (not three-stage pipeline)

**Decision:** Send base64 PDF directly to Claude in a single call. The model reads AND analyses in one pass, returning structured JSON.

**Alternatives considered:**
- Three-stage pipeline: classify → extract text → analyse (original approach in `processor.ts`)
- Two-step: Haiku reads PDF → Sonnet analyses text (planned upgrade)

**Why:** Reduces latency (one API call vs three). Simpler error handling. The original three-stage pipeline in `processor.ts` is now superseded by `document-analysis.ts`.

**Consequence:** Locked to models that support `type: 'document'` PDF content blocks. Currently only Haiku 4.5.

---

### D9. Truncated JSON repair strategy

**Decision:** Three-tier fallback for handling truncated AI JSON responses: (1) parse as-is, (2) repair by closing open brackets, (3) extract partial items array.

**Why:** If AI generates more than `max_tokens` (set to 4096, later 8192) of JSON, the response gets cut off mid-object. Rather than losing all data, attempt to salvage what was returned.

**Risk:** This is a workaround. Correct fix is either streaming, larger `max_tokens`, or chunked analysis for complex documents.

---

## Visual design decisions

### D10. Inter only (no serif/Lora)

**Decision:** Use Inter font throughout. No Lora or other serif fonts.

**Alternatives considered:** `workspace-visual-redesign.md` originally specified Lora for phase titles and section headings (32–40px, weight 600).

**Why:** Inter at bold/extrabold weights achieves confident heading presence without introducing a second font. Simpler CSS, faster load, consistent voice. The "warm hand" feeling comes from colour and spacing, not serif typography.

---

### D11. Bold 2026 aesthetic

**Decision:** 2px card borders, bold/extrabold typography, warm colour blocks, thick accent borders. Not thin, not clinical, not 2018.

**Trigger:** User feedback on initial build: "doesn't look finished", "basic", "not leaning into world-class UX."

**Implementation:** 32-instance batch fix from `font-medium` to `font-bold/font-semibold`. All borders upgraded to `border-[var(--border-card)]` (2px). Colour zones per card status (sage for complete, amber for awaiting, warmth for attention).

---

### D12. Sparkle processing animation (not spinner)

**Decision:** Twinkling dots animation during AI processing, not a progress bar or spinner. "Magic wand feel."

**Known issue:** User feedback: "no magical sparkling that I could see." Animation may be too subtle. Needs revisiting — larger dots, higher contrast, or a different approach (shimmer gradient, animated SVG constellation).

---

## UX decisions

### D13. Four-tier confidence model with evidence grounding

**Decision:** Items have confidence tiers (auto ≥0.9, confirm 0.7–0.9, question <0.7, gap) combined with evidence states (Known + document, Known + no document, Estimated, Unknown).

**Why:** Aligns with V1 confidence model but adds evidence grounding. In financial disclosure, the difference between "I know this" and "I have a document proving this" is legally significant.

---

### D14. Provider abstraction for AI routing

**Decision:** `lib/ai/provider.ts` abstracts AI providers with task-type routing and dry-run mode.

**Why:** Supports Claude/Gemini/OpenAI routing by task type. Enables smart dry-run (only activates when no API key AND flag is set). Makes model switching possible without touching calling code.

---

### D15. Design before code (P0 priority)

**Decision (10 April 2026):** The analysis flow needs more design thinking before further implementation. Code was written before the interaction design was sufficiently specified.

**What triggered this:** Real AI output revealed that the specs (09, 10b, 11) were written before seeing actual extraction results. The gap between specified UX and actual AI behaviour is too large. Specifically: data combination logic, assumption heuristics, dialogue interaction design, data presentation hierarchy, cross-field intelligence, and document-type-specific flows all need wireframes before more code.

**Action:** Produce detailed wireframes and interaction specs before building further. Update existing specs based on observed AI behaviour.

---

### D16. Transaction enrichment: build on Tink first, Bud as upgrade path

**Decision (14 April 2026):** Build the spending panel using Tink's existing PFM categories. Design the data layer with optional enrichment fields (logo, subcategory, regularity) so Bud or Tink Enrichment can be slotted in later without UI changes.

**Alternatives considered:**
- Integrate Bud immediately for richer categorisation (210+ categories, merchant logos, regularity detection)
- Build custom AI-based transaction categorisation using Claude

**Why:**
- We already get PFM categories + merchant names from Tink's `/data/v2/transactions` endpoint — enough for MVP spending panel
- Bud pricing is opaque (contact sales) — premature vendor commitment before we have users
- Adding another API dependency risks slowing session 13 delivery
- Bud's integration format accepts Tink transactions directly — easy to add later

**What Bud would add (if needed later):**
- 210+ categories at 3 levels of granularity (vs Tink's ~50)
- Merchant logos (SVG) and clean display names (76%+ coverage)
- Recurring payment detection with predicted dates
- >98% categorisation accuracy
- <5ms per transaction

**Validation step:** Check Tink Console to see if Data Enrichment and Merchant Information products are already enabled. If so, we may get logos and richer categories from Tink's `/enrichment/v1/transactions-by-ids` endpoint at no extra cost.

**Risk:** If Tink's basic categories prove too coarse for the spending panel UX, we'll need to evaluate Bud or Tink Enrichment mid-build. Mitigation: type the transaction interface with optional fields now.

---

### D17. Tink enrichment API not yet utilised

**Decision (14 April 2026):** Our current Tink integration only calls `/data/v2/transactions` (basic PFM categories). Tink has a dedicated enrichment API (`/enrichment/v1/transactions-by-ids`) and a Merchant Information product that we are not using.

**Action required:**
1. Check Tink Console → Products → verify which products are enabled
2. If Data Enrichment is enabled, add a test call to validate what additional fields we get
3. If Merchant Information is enabled, we may already have access to logos and clean names
4. Scope is currently `accounts:read,transactions:read` — enrichment may require additional scopes

**Consequence:** We may be leaving free enrichment on the table. This should be checked before building the spending panel.

---

## Decisions deferred

| Decision | Deferred to | Reason |
|----------|------------|--------|
| Supabase persistence | V1.5 / auth upgrade | Requires anonymous → authenticated path |
| Open banking (Armalytix) | Post-V2 launch | Partnership dependency |
| PDF side-by-side review | V2 P2 | Needs document storage first |
| Cross-document intelligence | V2 P2+ | Each document currently analysed in isolation |
| Domain-aware AI questioning (spec 11) | V2 P2+ | 8-domain mapping specified but not in prompt |
| Test suite | Ongoing | Vitest installed, zero tests written |
