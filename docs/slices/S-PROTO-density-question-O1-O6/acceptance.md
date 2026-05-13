# S-PROTO-density-question-O1-O6 — Why-we-ask primitive across O1-O6

**Category:** prototype

## What this slice ships

A new shared `<WhyWeAsk/>` primitive at `src/app/dev/proto/pre-signup-interview/components/WhyWeAsk.tsx`, wired into all six question screens O1-O6. Each screen carries its own one- or two-sentence "Why we ask" body explaining the substantive reason the question is being asked.

Closes density-audit finding **F-DEN-01** from `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md`:

> *"V1's interview-step pattern (`docs/v1/v1-wireframes.md` L196-203) includes a dashed-border educational callout under each question explaining WHY the question is being asked. Example for the situation question: 'Why we ask: This helps us show you the right process. Divorce and dissolution have specific legal steps.'"*

The audit flags every question screen as "a bare prompt + options + Continue with no learning-moment context"; this slice restores the educational pattern.

## Design decisions

**Placement: between Hero and the options fieldset.** Renders after the question heading + helper, before the user encounters the choices. Pedagogical flow is: see the question → understand why it matters → make a choice. V1's placement was below options (above CTA); the audit cites V1 only for the educational intent, not the exact location, so we prefer above-options for context-before-choice.

**Visual treatment: soft tinted block, rounded corners, "Why we ask" eyebrow label + body paragraph.** Not V1's dashed-border (dated; doesn't fit the warm-minimal chassis). Subtle contrast against the page background; visually scannable but doesn't compete with the question or options.

**Existing Hero helpers on O4 + O5 (`subStem` / `helper`) stay untouched.** They already function as encouragement-flavoured supplementary text ("This affects how we handle income evidence later." on O4; "There's no wrong answer. Many people don't know everything." on O5). WhyWeAsk adds a separate educational-substance layer with copy that's different from the existing helpers. Out-of-scope to deduplicate or restructure in this slice.

## Acceptance criteria

**AC-1 — `<WhyWeAsk/>` primitive shape.**
- File at `src/app/dev/proto/pre-signup-interview/components/WhyWeAsk.tsx` + sibling `.module.css`.
- Props interface:
  ```ts
  interface WhyWeAskProps {
    body: string;             // The "why" explanation (1-2 sentences)
    className?: string;       // Stagger animation hook
    staggerIndex?: number;
  }
  ```
- Renders: "Why we ask" eyebrow label (fixed copy, small caps sans 10-11px) + body paragraph (13px sans 1.5 line-height).
- Visual container: subtle tinted block, rounded corners ~10px, inner padding ~12-14px.
- No hardcoded colours — uses `tokens.color.*` and `tokens.font.*` exclusively.

**AC-2 — Wiring on all six screens (O1-O6).**
- Each of `screens/O1.tsx`, `O2.tsx`, `O3.tsx`, `O4.tsx`, `O5.tsx`, `O6.tsx` imports `WhyWeAsk` and renders it between the question Hero/heading block and the options fieldset (or its screen-specific equivalent).
- Existing Hero helpers / subStems on O1/O4/O5/O6 stay untouched (out-of-scope per §"Design decisions").

**AC-3 — Per-screen copy lives in each screen's copy resolver.**
- Each `lib/copy/o{1..6}.ts` adds a `whyWeAsk: string` field on its `O{N}Copy` interface and populates it in `getCopy()`.
- Proposed copy:
  - **O1 (stage):** "This shapes the tone and pace of your plan. People who've already decided need next-action language; people exploring need more space to weigh things up."
  - **O2 (situation):** "Civil partnerships, marriages, and cohabiting unions each have their own legal process. Children and housing change what the plan needs to cover."
  - **O3 (ex relationship + safety):** "How things stand between you shapes whether you'll work through this together or apart. We also ask about safety so we can adjust the rest of the conversation."
  - **O4 (employment):** "Salaries, self-employment, and limited-company finances are evidenced differently in settlement. Knowing this early shapes what we'll need to gather."
  - **O5 (partner finances knowledge):** "This isn't about catching you out. The less you know now, the more time we'll need for reconciliation later — it's better to be honest up-front."
  - **O6 (priorities):** "Your plan should reflect what actually matters to you, not a generic best-practice. These priorities decide which recommendations come up first."
- Two-sentence structure follows V1's pattern: HOW it shapes the plan + WHY it matters substantively.

**AC-4 — F-DEN-01 evidence inverted across all six screens.**
- The audit's literal-phrase grep on screens (was zero) is unchanged by impl because the phrase now lives in the shared primitive rather than inline in each screen — that's the architectural improvement, not a regression.
- Structural evidence: `grep -nE "<WhyWeAsk" src/app/dev/proto/pre-signup-interview/screens/O[1-6].tsx` returns ≥6 matches (was zero pre-impl).
- Phrase evidence: `grep -nE "Why we ask" src/app/dev/proto/pre-signup-interview/components/WhyWeAsk.tsx` returns ≥1 match (the fixed eyebrow label in the primitive).
- Render evidence: `tests/unit/proto-pre-signup/why-we-ask.test.tsx` `renders the fixed "Why we ask" eyebrow label` assertion confirms the eyebrow text mounts in the DOM, and `<WhyWeAsk/>` is imported + rendered in each of O1-O6 (per AC-2).

**AC-5 — No regression on adjacent slices.**
- All existing vitest tests pass (baseline 534/534 on main; P2 should land 534 + new WhyWeAsk tests; if P1 merges first, baseline becomes 542).
- O7 + O8 untouched (no WhyWeAsk wiring — those are output screens, not question screens).
- Existing per-screen tests (`o1-canvas-as-source.test.tsx`, `o2-canvas-as-source.test.tsx`, etc.) continue passing — WhyWeAsk insertion doesn't break their assertions.

**AC-6 — Preview-deploy 6+1 walk passes O1-O6.**
- Spec 72a 6-dim rubric on the Vercel preview for the slice's PR: golden path · edge cases · `prefers-reduced-motion` · keyboard-only · 375×667 mobile · screen-reader. Plus +1 visual diff (N/A per spec 72a §"Out of scope").
- Walked specifically: each of O1-O6 renders WhyWeAsk correctly + does not regress chassis behaviour.

## In scope

- `src/app/dev/proto/pre-signup-interview/components/WhyWeAsk.tsx` (new)
- `src/app/dev/proto/pre-signup-interview/components/WhyWeAsk.module.css` (new)
- `src/app/dev/proto/pre-signup-interview/screens/O{1..6}.tsx` (6 wirings)
- `src/app/dev/proto/pre-signup-interview/lib/copy/o{1..6}.ts` (6 copy resolver extensions)
- `tests/unit/proto-pre-signup/why-we-ask.test.tsx` (new — unit tests for the primitive)

## Out of scope

- O7 + O8 (output / what's-next screens; no question to explain).
- Restructuring existing Hero `helper` / `subStem` content on O4/O5/O6 to deduplicate against WhyWeAsk (deferred — different concern, different scope).
- WhyWeAsk on follow-up sub-questions within a screen (e.g. O3's privacy question, O2's relationship + children + housing sub-prompts). This slice ships one WhyWeAsk per screen, positioned with the main heading.
- F-DEN-02..04 (already shipped in S-PROTO-density-entry-O1).
- F-DEL-01..03, F-OUT-01..03 (separate Phase 3 slices).

## References

- `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` §F-DEN-01 — audit finding driving this slice.
- `docs/v1/v1-wireframes.md` L196-208 — V1 dashed-border callout pattern (intent source; not the visual treatment).
- `docs/workspace-spec/65-pre-signup-interview-reconciled.md` §O1..§O6 — question text + branching purpose.
- `CLAUDE.md` §"North star" (analyst-by-your-side framing — bare prompts read more like a form than an analyst conversation).
- `docs/workspace-spec/72a-preview-deploy-rubric.md` — 6+1 rubric for AC-6.

## Definition of Done (prototype short-form per spec 76 §3)

- [ ] Item 1: acceptance.md + verification.md present and accurate
- [ ] Item 8: tests written + passing (unit; integration where applicable)
- [ ] Item 12: preview-deploy 6+1 walk evidenced in verification.md
- [ ] Item 14: user feedback received + addressed (or explicitly deferred)
- [ ] Security checklist short-form (items 1, 8, 12, 14 from spec 72 §11)
