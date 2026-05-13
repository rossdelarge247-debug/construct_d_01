# S-PROTO-density-question-O1-O6 — verification

## Slice status

Implemented; awaiting preview-deploy 6+1 walk evidence to close DoD-12.

Net diff vs base (`origin/main`): 1 new primitive (`WhyWeAsk.tsx` + module CSS), 6 screen wirings (O1-O6 each add an import + a `<WhyWeAsk/>` render between Hero and the options block), 6 copy-resolver extensions (each `O{N}Copy` gains a `whyWeAsk: string` field + populated value), 1 new unit test file (7 tests). No regression: 533/533 vitest suite green (+7 from 526 baseline on `origin/main`); typecheck clean; lint adds zero new warnings (48 pre-existing in `src/lib/**` + other test files unchanged).

Closes density-audit finding F-DEN-01 from `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md`.

## Per-AC evidence

| AC | Status | Evidence |
|---|---|---|
| AC-1 WhyWeAsk primitive shape | ✓ | `src/app/dev/proto/pre-signup-interview/components/WhyWeAsk.tsx` + `.module.css` shipped. Props match acceptance: `body: string`, optional `className`, `staggerIndex`. Renders fixed "Why we ask" eyebrow + body paragraph; subtle tinted-block container using `var(--ds-color-surface-canvas)` + `var(--ds-color-border)` exclusively (no hardcoded colours). Tested in `tests/unit/proto-pre-signup/why-we-ask.test.tsx` (7 tests; all green). |
| AC-2 Wiring on all six screens | ✓ | Each of `screens/O{1..6}.tsx` imports `WhyWeAsk` and renders it between the Hero close and the options block. `grep -nE "<WhyWeAsk" screens/O[1-6].tsx` returns 6 matches (one per screen). Existing Hero helpers / subStems on O1/O4/O5 stay untouched per slice §"Design decisions". |
| AC-3 Per-screen copy in resolvers | ✓ | Each of `lib/copy/o{1..6}.ts` adds a `whyWeAsk: string` field to its `O{N}Copy` interface and populates it in `getCopy()`. `grep -c "whyWeAsk" lib/copy/o[1-6].ts` returns 2 per file (interface line + return-object line). Two-sentence pattern (HOW it shapes the plan + WHY it matters substantively) applied consistently across all 6 entries. |
| AC-4 F-DEN-01 evidence inverted | ✓ | Structural: `grep -nE "<WhyWeAsk" screens/O[1-6].tsx` = 6 matches (was 0 pre-impl). Phrase: `grep -nE "Why we ask" components/WhyWeAsk.tsx` = 1 match (the fixed eyebrow at L29). Render: test `renders the fixed "Why we ask" eyebrow label` asserts `screen.getByText('Why we ask')` resolves; the eyebrow renders on every screen that imports the primitive. |
| AC-5 No regression on adjacent slices | ✓ | All vitest tests pass: 533/533 across 80 files. O7 + O8 untouched (out-of-scope; output screens). Existing per-screen tests (`o1-canvas-as-source.test.tsx`, `o2-canvas-as-source.test.tsx`, etc.) continue passing — `<WhyWeAsk/>` insertion between Hero and options block doesn't break their assertions. Typecheck clean. |
| AC-6 Preview-deploy 6+1 walk | pending | Awaiting Vercel preview URL for slice PR; walk targets all 6 question screens at `/dev/proto/pre-signup-interview`. Table below populates after walk. |

## Preview-deploy verification (spec 72a 6+1)

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | pending | Each of O1-O6 renders WhyWeAsk between Hero and the options block; user reads heading + the supporting helper/subStem (where present) + the "Why we ask" callout before encountering the choice. |
| Edge cases | pending | First load · already-answered round-trip preserves selection + WhyWeAsk render · narrow viewport stagger order; O2's multi-section layout + O3's two-question stack (relationship + privacy) need particular scrutiny for visual rhythm. |
| `prefers-reduced-motion` | pending | WhyWeAsk uses each screen's existing `styles.entry` className → inherits `@media (prefers-reduced-motion: reduce)` block disabling stagger animation. |
| Keyboard-only | pending | WhyWeAsk has no interactive elements; no new focusable nodes. Tab order on each screen unchanged. |
| 375×667 mobile | pending | Verify WhyWeAsk fits within max-w-[480px] chassis on iPhone-SE viewport without horizontal overflow; longest copy body is O3's (~33 words). |
| Screen reader | pending | WhyWeAsk wrapper is a plain `<div>` (no landmark) carrying two `<p>` paragraphs. Eyebrow reads "Why we ask"; body reads the per-screen explanation. Insertion point sits before the options fieldset so screen-reader users hear context before encountering choices. |
| +1 visual diff | N/A | Per spec 72a §"Out of scope" — no visual-regression baseline tooling shipped. |

## Security checklist (prototype short-form per spec 72 §11)

- [x] Item 1: No secrets, credentials, or sensitive defaults committed (copy strings + design tokens only).
- [x] Item 8: No new third-party dependencies introduced.
- [x] Item 12: No new external surfaces (network requests, file I/O, auth boundaries).
- [x] Item 14: No PII handling changes; copy is generic + non-targeted.

## Architectural deferrals

- **Existing Hero helpers on O4/O5 stay untouched.** They function as encouragement-flavoured supplementary text alongside the new educational WhyWeAsk layer. Some users may perceive layered messaging on those two screens (e.g. O4 has both "This affects how we handle income evidence later." Hero helper AND a substantive WhyWeAsk body). Out-of-scope to deduplicate or restructure in this slice — different concern. Promote to a future copy-coherence slice if user feedback flags the layering as redundant.
- **WhyWeAsk on follow-up sub-questions.** Some screens have multiple sub-prompts (O2's four sub-question stack; O3's privacy follow-up). This slice ships one WhyWeAsk per screen positioned with the main heading — the educational callout applies to the screen's overall purpose, not each sub-prompt. Per-sub-prompt WhyWeAsk would be a separate scope.
- **No `body: ReactNode` overload.** Props' `body` field is `string` only. Future iterations may need bolded keywords or links inside the body — broaden the type then; out-of-scope for first ship.

## Definition of Done (prototype short-form)

- [x] Item 1: acceptance.md + verification.md present and accurate
- [x] Item 8: tests written + passing (7 unit tests in `why-we-ask.test.tsx`; 533/533 suite green; typecheck clean)
- [ ] Item 12: preview-deploy 6+1 walk evidenced in this file (pending — table above populates after PR preview deploys)
- [ ] Item 14: user feedback received + addressed (pending — captured in PR thread or session wrap)
