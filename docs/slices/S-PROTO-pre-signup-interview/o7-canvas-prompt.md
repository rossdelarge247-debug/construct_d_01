# O7 "Your plan" — canvas prompt (v2 — re-issue with inlined React)

**Slice:** `S-PROTO-pre-signup-interview` · category=prototype.
**Screen:** O7 (AI-generated plan output) per `docs/workspace-spec/65-pre-signup-interview-reconciled.md` §"O7 — Your plan (AI generated output)".
**Audience for canvas tool:** Claude AI Design.
**Style inheritance:** locked O1 canvases at `docs/design-source/pre-signup-interview/o1-stage-router-expressive.html` (primary — full state matrix + animation spec + accessibility notes) and `o1-stage-router-standalone.html` (alt-bg variant). The O1 canon footer reads verbatim: *"O2–O6 reuse this shell with the calmer EXPRESSIVE_BG (lilac → cream, no magenta stop) — the hero treatment is reserved for entry & exit screens."* O7 is the **exit** screen and inherits the full `EXPRESSIVE_HERO` 3-stop gradient. Type scale, colour ramp, header chrome, radio-card pattern, button treatment, motion vocabulary, accessibility checklist all carry forward.

**Why v2 re-issue:** the v1 canvas (committed at `docs/design-source/pre-signup-interview/o7-your-plan-expressive.html`) shipped with React in **external `<script type="text/babel" src="…uuid…">` references** that the bundler did not inline. The decoded HTML carries CSS only — no JSX, no layout. Per `scripts/decode-bundler-canvas.sh` and the canvas-decode-check CI gate, decoded sibling presence is required for any `acceptance.md`-cited canvas; the v1 decoded sibling exists but is unusable for refactor reference. v2 must inline all React.

---

## Paste-ready prompt

Generate a mobile-first canvas (375×667 primary; desktop adaptation secondary) for the **"Your plan"** screen of a pre-signup interview. This is screen 7 of an 8-screen flow.

**Product context.** Decouple is the complete settlement workspace for separating couples — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. It replaces the £14,561-average-cost solicitor-led journey with an £800-1,100 collaborative alternative. NOT a financial disclosure tool. NOT a Form E alternative. The unique claim is "the only place where both parties build one evidence-backed, shared picture of their complete settlement."

**Audience.** Someone who has just spent 5-7 minutes answering questions about a painful situation: relationship status, living arrangement, children, ex-partner relationship dynamic + safety, employment complexity, knowledge of partner's finances, what matters / what worries them. Often stressed, often alone, often late at night. They have given a lot; they have received nothing yet. **This screen is the first moment they receive.**

**Tone.** "A warm hand on a cold day" — compassionate, professional, never patronising. No urgency cues, no scarcity cues, no fear-based framing. Agency-preserving language ("you can", "many people choose") not prescriptive ("you must", "you need to"). No legal jargon without plain-language gloss.

---

## Content (7 sub-elements, in order)

1. **Situation summary** — 2-4 sentence plain-language reflection of what they told the interview. Specific, of-them, never generic. Example shape: *"You and your partner have decided to separate. You're married, with two children under 18, and own your home with a mortgage. Things between you are difficult but manageable, and you're both working through this together."*

2. **The divorce journey (visual timeline).** Six stages: filing → disclosure → negotiation → agreement → court → implementation. The strongest visual anchor of the screen. Roadmap feel, not checklist. Plain-language stage names; legal terms in tooltip/secondary text only.

3. **What needs to happen** — plain-language tailored steps. Not generic "get a solicitor" advice. Specific to their answers: if self-employed, business valuation surfaces; if children, parenting plan surfaces; if safety concerns, appropriate framing. 4-6 concrete things.

4. **The conventional path** — costs + timeline + next steps, helpful standalone if the user decides not to use Decouple. Reference data: solicitor-led journey averages £14,561 over 18-24 months. Honest, not scary. The user should be able to take this section away even if they never come back.

5. **How Decouple helps** — soft introduction; time/cost comparison to the conventional path. Don't oversell. Position as "complete settlement workspace" not "financial disclosure tool" (load-bearing framing). Three pillars: shared not adversarial; evidenced not asserted; end-to-end not hand-off.

6. **Personalised notes** — 2-4 specific call-outs based on their answers. Examples: "Because stability for the children matters most to you, Decouple's parenting-plan tooling does X." "Because you have concerns about your partner being open about their finances, here's how the bank-evidenced approach handles that." "Because you're both self-employed, here's how business income gets surfaced."

7. **Links + CTA** — "Find out more" link → pricing/about; primary CTA continues to O8 ("What's next").

---

## Three loveability decisions the canvas resolves

Show one treatment per decision, not all three:

### A — Personalisation visibility
- **A1 Explicit echoes.** Each major section opens with quoted/italicised reflection of user input ("You said your priority is keeping the family home...").
- **A2 Implicit reflection.** Sections written in plain prose that obviously incorporates user input, no quoting.
- **A3 Hybrid.** Section 1 (situation summary) is explicit echo; sections 2-7 are implicit reflection.

### B — Section disclosure
- **B1 Single scrolling page.** All 7 sections render top-to-bottom.
- **B2 Accordion.** Sections collapse/expand on tap.
- **B3 Hero + scroll.** Sections 1-2 above the fold; sections 3-7 scroll.

### C — Conventional-path framing
- **C1 Neutral comparison table.** Side-by-side rows (cost, timeline, who does the work).
- **C2 Warm reference card.** Conventional path described as "the path most people take" with inline data; Decouple section as the alternative.
- **C3 Headline numbers.** £14,561 vs £800-1,100 framed as the load-bearing fact, one-paragraph each side.

---

## Style anchors (extend locked style)

- Mobile-first: single column at 375px; thumb-zone CTAs.
- Generous vertical spacing — compassionate, never dense.
- Visual timeline is the strongest anchor — lean on iconography or progressive horizontal stages.
- Type scale + colour ramp + button treatment from locked style canvas.
- Motion: subtle, breathing — no flashy transitions on a sensitive moment.
- Avoid: stock-photo humans, generic "happy family" imagery, abstract gradient backgrounds, urgency-coloured CTAs.
- Yes: subtle warmth (rounded corners, soft shadows where the locked style uses them), data-density restraint, breathable type.

---

## Negative constraints (verbatim — these break the product)

- **DO NOT** frame Decouple as "a financial disclosure tool" or "a better Form E". The complete settlement workspace framing is load-bearing.
- **DO NOT** use prescriptive language ("you must", "you need to"). Agency-preserving only.
- **DO NOT** include urgency / scarcity / fear cues.
- **DO NOT** show legal jargon (consent order, decree absolute, MIAM, financial remedy) without inline plain-language gloss.
- **DO NOT** front-load a price comparison; the user is reading this for clarity, not for sales.

---

## Bundling requirement (v2 — fixes the v1 failure mode)

The v1 canvas exported with React mounted via external `<script type="text/babel" src="https://api.claude.com/.../sandbox-bundler-canvas/<uuid>.js"></script>` references. Those URLs are auth-gated; the bundled HTML decodes to inert CSS only. v2 must produce a **single self-contained file** with all React inlined:

- All JSX in `<script type="text/babel">…</script>` blocks **inside** the single HTML file.
- `<script src="https://unpkg.com/react@…"></script>` for the React runtime is fine — the runtime CDN is public and stable. **Do NOT** use `<script src="…sandbox-bundler-canvas…">` for component code.
- After export, the file must render correctly when opened directly with `file://` (no network beyond public unpkg/jsdelivr).

The o1 canvas at `o1-stage-router-expressive.html` is the bundling reference: ~3MB, all React inlined under `<script type="text/babel">`, decodes cleanly via `scripts/decode-bundler-canvas.sh` to a readable `decoded/o1-stage-router-expressive.html` that carries the full layout. v2 of o7 must match that pattern.

---

## Output expectation

A single self-contained canvas exporting to standalone HTML, mobile-first 375×667 with desktop adaptation, **all React inlined** per §"Bundling requirement". At minimum the **ready state** (full plan rendered). If easy, also include a **generating state** (the moment after submitting O6, before the plan resolves) — this is where the "warm hand" feel is tested most.

Final check before submitting: open the exported HTML in a browser with network disabled after first load. If the layout disappears, the canvas re-introduced the v1 failure mode and is not acceptable.
