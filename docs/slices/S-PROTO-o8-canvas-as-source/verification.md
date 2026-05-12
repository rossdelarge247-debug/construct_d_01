# Verification — S-PROTO-o8-canvas-as-source

## AC status

| AC | Status | Evidence |
|---|---|---|
| AC-1 Page chassis + TopBar | Pending | `src/app/dev/proto/pre-signup-interview/screens/O8.tsx` — legacy 29L stub replaced; `<main>` matches sibling pattern; BrandBar at top; bespoke TopBar with Back + StepRail (step 8 / 8 full bar) + 36px right spacer + bottom border. |
| AC-2 PlanRecall chip (B2) | Pending | `O8.tsx` `PlanRecall` component rendered between TopBar and Hero: pill `<a>` with violet-soft mini-check badge + "Your plan is ready" + MUTE divider + "← back to plan" affordance. |
| AC-3 Hero | Pending | `O8.tsx` `Hero` component: magenta-dot eyebrow "What's next · take it from here" + serif H2 "What would you like to do next?" + sub-helper "There's no wrong answer. You can come back anytime." |
| AC-4 4 OptionCards (A1) | Pending | `O8.tsx` `<fieldset>` with 4 native `<input type="radio" name="o8-next-step">` styled as cards. Each card: icon (line-weight 1.6, viewBox 24×24, from inlined IconWorkspace/IconDownload/IconExternal/IconSupport) + serif fontWeight-600 title + SUB 12px sub + circular radio indicator. A1 equal-weight treatment — all 4 cards visually identical until selected. |
| AC-5 Footer (sticky CTA) | Pending | `O8.tsx` sticky cream-blur footer matches O5/O6 chassis. Single dark pill CTA. Label reflects selected option's `cta` (default "Continue" with no selection — C1 no-default). `useProto().next` wired (no-op at step 8 cap). |
| AC-6 Motion + a11y + reduced-motion | Pending | `O8.module.css` declares `.entry` stagger via `--stagger-index` + card transitions 120ms ease-out + reduced-motion fallback (suppress stagger; suppress card transitions). Semantic markup: `<fieldset>`, native radios, sr-only legend, `<h1>` for screen title, `<button>` CTA, `<a>` for Back / PlanRecall. |

## Tests

| Test | Status | Path |
|---|---|---|
| Renders TopBar with Back + Step 8/8 indicator | Pending | `src/app/dev/proto/pre-signup-interview/__tests__` → `tests/unit/proto-pre-signup/o8-canvas-as-source.test.tsx` |
| Renders PlanRecall B2 chip with "Your plan is ready" affordance | Pending | `o8-canvas-as-source.test.tsx` |
| Renders Hero eyebrow + serif H2 + helper | Pending | `o8-canvas-as-source.test.tsx` |
| Renders 4 OptionCards with native radio role + sr-only legend | Pending | `o8-canvas-as-source.test.tsx` |
| Selecting an option updates aria-pressed/aria-checked + reflects CTA label | Pending | `o8-canvas-as-source.test.tsx` |
| CTA label defaults to "Continue" with nothing selected (C1) | Pending | `o8-canvas-as-source.test.tsx` |
| Decorative SVGs hidden from screen readers (aria-hidden=true) | Pending | `o8-canvas-as-source.test.tsx` |

## Preview-deploy verification (spec 72a 6+1 rubric)

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | Pending | Vercel preview URL on PR — navigate O1→O7→O8; observe terminal step-8 indicator + 4 equal-weight option cards + sticky CTA that updates label on selection. |
| Edge cases | Pending | Refresh on step 8 retains C1 no-default-selection state; cycling radios via keyboard arrow keys; CTA label transitions cleanly between option states. |
| prefers-reduced-motion | Pending | Devtools rendering panel → emulate `prefers-reduced-motion: reduce`. Card entry stagger replaced with instant reveal; card-selection transitions removed (instant background + border swap). |
| Keyboard-only | Pending | Tab order: Back → PlanRecall chip → first OptionCard (then arrow keys cycle) → Footer CTA. Focus-visible ring visible at each stop. |
| Mobile viewport (375×667) | Pending | Devtools device-emulation iPhone-SE-class. Content fits at 375 wide; sticky CTA bottom-anchored within viewport; 4 cards stack vertically without overflow. |
| Screen reader | Pending | VoiceOver / NVDA pass: announces step 8/8 progressbar + sr-only legend "What would you like to do next?" + each card title/sub + radio state + CTA label updates. |

## DoD-14 short-form (prototype category — items 1, 8, 12, 14 from spec 76 §3)

- [ ] **1. All ACs met** with verification.md evidence per AC
- [ ] **8. Unit/integration tests** written + passing (card render · selection state · CTA label transitions · a11y)
- [ ] **12. Preview-deploy verified** across the spec 72a 6+1 dimensions
- [ ] **14. User feedback** received + addressed (or explicitly deferred to the cross-screen homogenisation pass)

## Architectural deferrals

- **Post-continue Option 2 ("Email + come back later") footer variant** (canvas L543-651): alternate state showing an email-capture form after the user picks `download`. Out of scope for v1 — adds form-validation surface.
- **Functional routing** for all 4 exit CTAs (signup flow · PDF generation + email · external-links page · support-resources page). Prototype-only visual treatment; routing wires at production graduation.
- **44×44 touch target** on TopBar Back link AND on PlanRecall chip: inherits from sibling O1-O7 deferral; production-graduation pass.
- **Canvas-local token promotion** for VIOLET_SOFT, MAGENTA_SOFT, etc.: used inline; promotion to `tokens.color.*` deferred to a follow-up token-sweep slice once a second screen references the same value.
- **Cross-screen homogenisation** of TopBar/Hero/Footer/colour treatments across O1-O8: explicitly deferred to a dedicated homogenisation slice that runs after O8 ships (the full 8-screen surface needs to exist before harmonisation has a target).

## Status

Scope pending; implementation pending; auto-review fan-out (3 specialists) on PR open; user pre-flight after Vercel preview ready.
