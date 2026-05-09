# O8 "What's next" — canvas prompt

**Slice:** `S-PROTO-pre-signup-interview` · category=prototype.
**Screen:** O8 (next-action chooser, exit screen) per `docs/workspace-spec/65-pre-signup-interview-reconciled.md` §"O8 — What's next".
**Audience for canvas tool:** Claude AI Design.
**Style inheritance:** locked O1 canvases at `docs/design-source/pre-signup-interview/o1-stage-router-expressive.html` (primary — full state matrix + animation spec + accessibility notes) and `o1-stage-router-standalone.html` (alt-bg variant). The O1 canon footer reads verbatim: *"O2–O6 reuse this shell with the calmer EXPRESSIVE_BG (lilac → cream, no magenta stop) — the hero treatment is reserved for entry & exit screens."* O8 is the **exit** screen and inherits the full `EXPRESSIVE_HERO` 3-stop gradient. Type scale, colour ramp, header chrome, radio-card pattern, button treatment, motion vocabulary, accessibility checklist all carry forward.

**Pairing.** O8 is the exit twin of O1 — same hero treatment, same single-question radio-card structure, same forward-momentum Continue CTA. Where O1 routes the user *into* the interview by relationship-stage, O8 routes the user *out of* the interview by next-action-intent. The two screens visually bookend the flow.

---

## Paste-ready prompt

Generate a mobile-first canvas (375×667 primary; desktop adaptation secondary) for the **"What's next"** screen of a pre-signup interview. This is screen 8 of an 8-screen flow — the exit screen, immediately after O7 ("Your plan").

**Product context.** Decouple is the complete settlement workspace for separating couples — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. It replaces the £14,561-average-cost solicitor-led journey with an £800-1,100 collaborative alternative. NOT a financial disclosure tool. NOT a Form E alternative. The unique claim is "the only place where both parties build one evidence-backed, shared picture of their complete settlement."

**Audience.** Someone who has just spent 6-9 minutes on the interview AND received their plan on O7. They now know roughly what their settlement journey looks like. They are deciding whether to continue with Decouple, take the plan and leave, go conventional, or pause. **All four are legitimate exits.** The screen must not push toward signup; it must respect the choice.

**Tone.** "A warm hand on a cold day" — compassionate, professional, never patronising. The exit screen is the second moment of payoff (after O7) — the user has been given something, and now is being asked what they want to do next. Agency-preserving language ("you can", "many people choose"). No urgency cues, no scarcity cues, no fear-based framing.

---

## Content (single radio question with 4 options)

**Headline:** "What would you like to do next?"
**Helper text (optional):** "There's no wrong answer. You can come back anytime."

**Options (in order — DO NOT reorder; the first is the conversion path but visual weight is equal):**

1. **Create a free account and start building my picture** — primary path into Decouple (signup → workspace). Brief sub-text: "Free to start; no card needed." Icon: subtle workspace/picture motif consistent with O1 stage iconography.

2. **Download my plan and come back later** — PDF export of the O7 plan, optional email-it-to-me. Sub-text: "We'll keep your answers for 30 days if you want to come back." Icon: download/document motif.

3. **I want to go the conventional route** — exit to helpful curated links (GOV.UK divorce pages, MIAM mediator finder, Resolution member-solicitor finder). Sub-text: "We'll point you to good starting places." Icon: outward-arrow/external motif.

4. **I need to talk to someone first** — exit to support resources (Samaritans, Relate, Family Lives, domestic-abuse helplines if O3 ex-partner-relationship signal warranted). Sub-text: "Here are people who can help." Icon: speech-bubble/support motif.

After selection, Continue CTA routes per option:
- Option 1 → signup flow (handoff to existing auth)
- Option 2 → PDF generation + optional email-capture micro-form
- Option 3 → external-links page (curated; opens new tab per link)
- Option 4 → support-resources page (curated; opens new tab per link)

---

## Three loveability decisions the canvas resolves

Show one treatment per decision, not all three:

### A — Option visual weight
- **A1 Equal weight.** All four radio cards rendered identically — no visual hierarchy, signup is not visually privileged.
- **A2 Subtle primary.** Option 1 has a faint accent-tint border or filled background; options 2-4 are calmer. The accent reads as "this is what most people do" not "you must pick this."
- **A3 Two-tier.** Options 1+2 (engagement paths) on one row; options 3+4 (exits) below a soft divider. Equal weight within each tier.

### B — Plan-recall framing
- **B1 No recall.** Bare radio question; the plan from O7 is not re-shown.
- **B2 Tiny chip.** A small "Your plan is ready" chip at the top with a back-arrow to O7; user knows the plan is saved.
- **B3 Mini-summary card.** A 3-line condensed plan-summary card above the question; reminds the user what they're choosing about.

### C — Empty-state default
- **C1 No default selection.** All radios unchecked; Continue disabled until a choice is made.
- **C2 Pre-selected first option.** Option 1 pre-checked; user can change it. Conversion-friendly but agency-soft.
- **C3 Pre-selected second option.** Option 2 ("Download and come back later") pre-checked — frames Decouple as patient, not pushy. Strong signal that we don't pressure signup.

---

## Style anchors (extend locked O1 style)

- Mobile-first: single column at 375px; thumb-zone Continue CTA.
- Radio cards inherit the O1 pattern: ~64-80px tall, soft rounded corners (~16px), clear hit area, touch-friendly.
- Inactive cards have a calm 1px border in the lilac/grey ramp; selected card uses the locked accent treatment from O1.
- Generous vertical spacing — compassionate, never dense. ~24-32px between cards.
- Type scale + colour ramp + button treatment from O1.
- `EXPRESSIVE_HERO` 3-stop gradient inherited for the entry/exit moment.
- Motion: subtle radio-select micro-animation matches O1's; Continue button reveals on first selection if C1 is chosen.
- Avoid: stock-photo humans, urgency-coloured CTAs, multiple competing CTAs.
- Yes: generous breathing room, calm radio motion, the same warmth as O1.

---

## Negative constraints (verbatim — these break the product)

- **DO NOT** privilege option 1 with copy that pushes signup ("Recommended", "Most people choose this", urgency framing). Visual subtlety is fine; copy pressure is not.
- **DO NOT** hide options 3-4 behind a "more options" disclosure. All four must be visible at the same level on first paint.
- **DO NOT** use scarcity / urgency / fear cues anywhere on the screen.
- **DO NOT** show legal jargon (consent order, decree absolute, MIAM, financial remedy) without inline plain-language gloss.
- **DO NOT** add a secondary "skip" or "exit without choosing" affordance — the four options ARE the exits; a fifth implicit exit weakens the choice.

---

## Bundling requirement (matches o7-canvas-prompt.md v2)

Single self-contained file with all React inlined:

- All JSX in `<script type="text/babel">…</script>` blocks **inside** the single HTML file.
- `<script src="https://unpkg.com/react@…"></script>` for the React runtime is fine — public CDN. **Do NOT** use `<script src="…sandbox-bundler-canvas…">` for component code; those URLs are auth-gated and won't survive export.
- After export, the file must render correctly when opened directly with `file://` (no network beyond public unpkg/jsdelivr).

The o1 canvas at `o1-stage-router-expressive.html` is the bundling reference. Match that pattern.

---

## Output expectation

A single self-contained canvas exporting to standalone HTML, mobile-first 375×667 with desktop adaptation, **all React inlined** per §"Bundling requirement". States to render:

- **Default** — no option selected, Continue CTA in disabled treatment (or hidden if C1 chosen).
- **Selected** — one option active, Continue revealed/enabled, accent treatment matches O1 selected radio-card.
- **Hover (desktop)** + **Focus (keyboard)** — match O1 keyboard-affordance treatment.
- **Mobile** — primary 375×667 layout.

If easy, also include a **post-Continue micro-state** for option 2 (the email-capture micro-form) — single-input + secondary CTA, calm treatment.

Final check before submitting: open the exported HTML in a browser with network disabled after first load. If the layout disappears, the canvas re-introduced the v1 failure mode and is not acceptable.
