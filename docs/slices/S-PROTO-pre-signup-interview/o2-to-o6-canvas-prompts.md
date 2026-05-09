# O2-O6 canvas prompts (5 paste-ready blocks)

**Slice:** `S-PROTO-pre-signup-interview` · category=prototype.
**Screens:** O2-O6 per `docs/workspace-spec/65-pre-signup-interview-reconciled.md` §"The 8 screens".
**Audience for canvas tool:** Claude AI Design.
**Output target:** one self-contained HTML file per screen, uploaded to `docs/design-source/pre-signup-interview/o{N}-{slug}-expressive.html`.

## Shared style inheritance (verbatim across all 5 prompts)

Locked O1 canvases at `docs/design-source/pre-signup-interview/o1-stage-router-expressive.html` (primary — full state matrix + animation spec + accessibility notes) and `o1-stage-router-standalone.html` (alt-bg variant). The O1 canon footer reads verbatim: *"O2–O6 reuse this shell with the calmer EXPRESSIVE_BG (lilac → cream, no magenta stop) — the hero treatment is reserved for entry & exit screens."*

**O2-O6 inherit:** type scale · colour ramp · header chrome · radio-card pattern · button treatment · motion vocabulary · accessibility checklist. **What's different:** the calmer `EXPRESSIVE_BG` (no magenta stop) — these are mid-flow screens, not entry/exit moments.

## Shared bundling requirement (verbatim across all 5 prompts)

Single self-contained file with all React inlined:

- All JSX in `<script type="text/babel">…</script>` blocks inside the single HTML file.
- `<script src="https://unpkg.com/react@…"></script>` for the React runtime is fine — public CDN.
- Do NOT use `<script src="…sandbox-bundler-canvas…">` for component code.
- After export, the file must render correctly when opened directly with `file://` (no network beyond public unpkg/jsdelivr).
- The o1 canvas at `o1-stage-router-expressive.html` is the bundling reference.

## Shared product framing (verbatim across all 5 prompts)

Decouple is the complete settlement workspace for separating couples. NOT a financial disclosure tool. The unique claim is "the only place where both parties build one evidence-backed, shared picture." Tone: "a warm hand on a cold day" — compassionate, professional, never patronising. Agency-preserving language ("you can", "many people choose"); no urgency / scarcity / fear cues. Mobile-first 375×667 primary, desktop adaptation secondary. The audience is mid-interview at this point — they have committed enough to keep going, and the screen should feel like progress, not interrogation.

---

## O2 — Your situation

**Paste this into Claude AI Design.**

Generate a mobile-first canvas for screen 2 of an 8-screen pre-signup interview. This is the first content-bearing screen after the stage router — the user has chosen their relationship stage and is now telling us about their situation. Calmer `EXPRESSIVE_BG` (lilac → cream, no magenta stop). Style inherits O1.

**Content (4 sub-questions on one screen; all radio groups; fast):**

- **Relationship:** Married · Civil partnership · Cohabiting · Other
- **Living together:** Yes · No · Complicated
- **Children under 18:** No · Yes (with reveal: "How many?" — 1 / 2 / 3 / 4+)
- **Your home:** Own with mortgage · Own outright · Rent · Other

Headline: "Your situation" — neutral, factual. No helper text needed; the sub-question labels are the helper text.

**Three loveability decisions the canvas resolves (show one treatment per decision):**

- **A — Sub-question grouping.** A1: 4 cards stacked, each card carrying one sub-question + its radio group. A2: paired (Relationship + Living-together) as a "household status" card and (Children + Home) as a "dependents + housing" card — 2 cards total. A3: single tall card with 4 internal subsections divided by hairlines.
- **B — Children "yes" reveal.** B1: inline reveal — number-of-children radios appear under the "Yes" option once selected. B2: separate row that's always visible but greyed-out until "Yes" is chosen. B3: micro-modal sheet that slides up from below.
- **C — Continue affordance.** C1: enabled only when all 4 sub-questions answered; disabled state visible. C2: enabled after first answer, but with progress indicator showing X of 4 answered. C3: enabled always; surfaces a soft "you've left some questions unanswered, that's OK" message if user advances early.

**Negative constraints:** Do NOT add tooltips that explain why we ask. Do NOT add a "rather not say" option to any group. Do NOT add visual emphasis to any one answer.

**Output expectation.** Single self-contained HTML file (per shared bundling requirement). States: default · partially-answered · complete · keyboard focus. File should open at `file://` with no network beyond public CDN React.

---

## O3 — Your ex and safety

**Paste this into Claude AI Design.**

Generate a mobile-first canvas for screen 3 of an 8-screen pre-signup interview. Calmer `EXPRESSIVE_BG`. Style inherits O1. **This is the most sensitive screen of the interview — the safety question is woven naturally, not flagged with red icons or alerts.**

**Content (1 main question + 1 short follow-up):**

- **Headline:** "How would you describe things between you and your ex?"
  - Amicable — we want to sort this out together
  - Difficult — but manageable
  - High conflict — communication is very hard
  - I have safety concerns
- **Below the radio group, a smaller question:** "Is this device private to you?" — Yes · Not sure

If the user picks "I have safety concerns" OR "Not sure" on device privacy, **silently set a flag**. Do NOT pop a modal, do NOT change visual treatment of the screen, do NOT show a banner. The flag affects later flow (not this canvas).

**Three loveability decisions the canvas resolves:**

- **A — Safety-option treatment.** A1: identical visual weight to other 3 options. A2: subtle warmer-tone soft-pink wash on just that card (no icon, no exclamation). A3: rendered with a tiny lock-icon at the right edge — discoverable but not alarming.
- **B — Device-privacy framing.** B1: two-line caption above the Yes/Not-sure radios: "Some people read these screens with a partner nearby. We want to know whether you have privacy here." B2: single line: "Is this device private to you?" — no preamble. B3: question framed as "Is now a good time to keep going?" — softer.
- **C — Continue gating.** C1: requires both questions answered. C2: requires only the first question; device-privacy answer is optional. C3: device-privacy comes BEFORE the relationship question.

**Negative constraints:** Do NOT use red, do NOT use alert iconography (warning triangle, exclamation marks), do NOT push any specific answer. Do NOT show "If you're in immediate danger, call 999" — that comes later in safety-flag flow, not on this canvas.

**Output expectation.** Single self-contained HTML file. States: default · safety-option-selected · device-privacy-not-sure-selected · complete. File at `file://` with no network beyond public CDN.

---

## O4 — Employment complexity

**Paste this into Claude AI Design.**

Generate a mobile-first canvas for screen 4 of an 8-screen pre-signup interview. Calmer `EXPRESSIVE_BG`. Style inherits O1.

**Content (1 question, 4 options):**

- **Headline:** "Are either of you self-employed or a company director?"
- **Helper text:** "This affects how we handle income evidence later."
- Options:
  - No — both employed or not working
  - Yes — I am
  - Yes — my ex is
  - Yes — we both are

**Three loveability decisions the canvas resolves:**

- **A — Helper-text treatment.** A1: small caption below headline. A2: small "?" icon next to headline that reveals helper text on tap/hover. A3: helper text expanded inline only after first option is selected (progressive disclosure).
- **B — Plain-language rewording.** B1: "self-employed or a company director" verbatim. B2: simpler — "Does either of you work for yourself, or run a limited company?" B3: split into two micro-questions — "Self-employed?" and "Director of a limited company?" with combined logic.
- **C — Empty-state default.** C1: nothing pre-selected. C2: "No" pre-selected (most common case). C3: nothing pre-selected, but the "No" option is in a slightly larger card to ease the most common path.

**Negative constraints:** Do NOT explain WHY we ask in detail (it's a one-line helper, not a paragraph). Do NOT use accountancy/tax jargon (PAYE, IR35, Schedule D). Do NOT show "this will take longer if Yes" — that's discouraging.

**Output expectation.** Single self-contained HTML file. States: default · option-selected · keyboard focus. File at `file://` with no network beyond public CDN.

---

## O5 — What you know about your partner's finances

**Paste this into Claude AI Design.**

Generate a mobile-first canvas for screen 5 of an 8-screen pre-signup interview. Calmer `EXPRESSIVE_BG`. Style inherits O1. **This screen asks something sensitive — how much the user knows about their partner's money. It must NOT feel like an accusation or a fishing expedition.**

**Content (1 question, 4 options):**

- **Headline:** "How much do you know about your partner's financial situation?"
- **Helper text:** "There's no wrong answer. Many people don't know everything."
- Options:
  - I have a good idea of everything
  - I know some things but not all
  - Very little — they managed the money
  - I suspect they may be hiding things

The fourth option "I suspect they may be hiding things" gates a hidden-assets pathway in the plan output. Sensitive.

**Three loveability decisions the canvas resolves:**

- **A — Suspicion-option treatment.** A1: identical visual weight to other 3. A2: subtle de-emphasis — slightly muted text colour or smaller helper caption underneath ("we'll show you what to look for if so"). A3: separated below a hairline divider, framed as "If you have concerns…".
- **B — Helper-text framing.** B1: "There's no wrong answer. Many people don't know everything." B2: "This helps us know how much support you'll need with disclosure." B3: no helper text — let the question stand on its own.
- **C — Order of options.** C1: spec-65 order verbatim (good idea / some things / very little / suspect hiding). C2: most-knowing to least-knowing, with "suspect hiding" as a separate row below. C3: reversed — "very little" first, "good idea" last (lowers the bar; less judgemental).

**Negative constraints:** Do NOT use the word "controlling", "abuse", or "victim" anywhere on this screen. Do NOT add a "I don't want to answer this" affordance — the four options span the spectrum. Do NOT show the impact on plan length or pricing — that's gating, not motivation.

**Output expectation.** Single self-contained HTML file. States: default · option-selected (especially the suspicion option, to verify treatment) · keyboard focus. File at `file://` with no network beyond public CDN.

---

## O6 — What matters to you

**Paste this into Claude AI Design.**

Generate a mobile-first canvas for screen 6 of an 8-screen pre-signup interview. Calmer `EXPRESSIVE_BG`. Style inherits O1. This is the last input screen before O7 (the AI-generated plan). Two multi-select groups, capped at 3 each.

**Content (2 multi-select groups, max 3 each):**

- **Group 1 — "What's most important to you right now?"** (pick up to 3)
  - A fair split of everything
  - Keeping the family home
  - Protecting my pension
  - Stability for the children
  - A clean break — no ongoing ties
  - Getting this done quickly
  - Keeping costs low
  - Ongoing financial support
- **Group 2 — "What worries you most?"** (pick up to 3)
  - Not having enough to live on
  - Hidden assets or dishonesty
  - Losing my pension
  - Not being able to afford the mortgage alone
  - The cost of the process itself
  - The emotional toll
  - My ex not cooperating
  - Not knowing what's fair

**Three loveability decisions the canvas resolves:**

- **A — Group separation.** A1: two cards stacked, each with its own headline and chip group. A2: one card with internal hairline + headline switch. A3: tabbed — group 1 is active first; tab to group 2 once 1+ chip selected (forces sequencing).
- **B — Cap-feedback treatment.** B1: when 3 are selected, remaining unselected chips are visually disabled (opacity 0.3 + cursor:not-allowed). B2: a small "(3 of 3 selected)" caption appears above the group; chips remain visually active but tap on a 4th de-selects the oldest. B3: a calm "you can pick up to 3 — drop one to add another" hint appears beneath the group when the user reaches the cap.
- **C — Empty-state guidance.** C1: a one-line caption above each group: "Pick up to 3" — no other guidance. C2: above each group, a 2-line caption acknowledging the difficulty: "These can be hard to pick — go with what feels true today, you can change them later." C3: no caption; the "(0 of 3)" counter sits inline beside the headline and updates as chips are selected.

**Negative constraints:** Do NOT add an "Other" or "Tell us more" free-text field — this is a chip pick, not an essay. Do NOT add minimum-1 enforcement on either group (a user might genuinely have no priorities yet, and forcing a pick is interrogative). Do NOT order the chips alphabetically — the spec-65 order is psychologically calibrated; preserve it.

**Output expectation.** Single self-contained HTML file. States: default (both empty) · 1-2 chips selected per group · 3 chips selected per group (cap state) · complete (3+3). File at `file://` with no network beyond public CDN.

---

## After Claude AI Design exports each canvas

For each generated canvas:

1. Save it to `docs/design-source/pre-signup-interview/o{N}-{slug}-expressive.html` — naming pattern: `o2-your-situation-expressive.html`, `o3-ex-and-safety-expressive.html`, `o4-employment-complexity-expressive.html`, `o5-partner-finances-expressive.html`, `o6-what-matters-expressive.html`.
2. Run `bash scripts/decode-bundler-canvas.sh docs/design-source/pre-signup-interview/o{N}-{slug}-expressive.html` to produce the readable decoded sibling at `docs/design-source/pre-signup-interview/decoded/o{N}-{slug}-expressive.html`.
3. Confirm the decoded sibling is layout-bearing: `wc -l decoded/o{N}-…html` ≥ 1000L AND `grep -aEc '<div' decoded/o{N}-…html` ≥ 50 AND `grep -aEc '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' decoded/o{N}-…html` = 0. If any check fails, the canvas re-introduced the v1 failure mode and must be regenerated.
4. Once all 6 (O2-O6 + O8) decode cleanly, the src/ refactor can begin against the full canvas set (O1 hero · O2-O6 calmer · O7 hero · O8 hero).
