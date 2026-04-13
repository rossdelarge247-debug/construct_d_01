# Transitions, Animations & Micro-interactions

**Principle:** Every transition should feel purposeful and polished. Animations communicate state changes, not decoration. The experience should feel like a premium fintech product — Airbnb-level smoothness, not flashy. Speed matters: transitions must be fast enough to not feel sluggish, slow enough to be perceived.

---

## 1. Welcome carousel transitions

**Slide advance (Next click):**
- Current slide content fades out: `opacity 1→0, 200ms ease-out`
- Progress indicator segment fills: `width transition, 300ms ease`
- New slide content fades in: `opacity 0→1, 200ms ease-in`, delayed 50ms after fade-out starts
- Net perceived transition: ~250ms. Feels instant but visible.

**No horizontal slide animation.** Content changes in place. This is a focused onboarding, not a photo gallery.

---

## 2. Task list home → bank connection (hyperfocus transition)

**On [Get started] click:**
1. Task list card contracts vertically: `max-height transition, 400ms ease-out` — the task rows below the bank connect task slide up and fade out
2. Simultaneously, the bank connection content area expands to fill the card: `400ms ease-out`
3. The locked phase labels (Sharing, Finalisation) fade to `opacity: 0.3` over `300ms`
4. Net effect: the page "focuses" on the bank connection, everything else recedes

**On cancel/return:**
- Reverse of above. Locked phases fade back to full opacity. Task rows slide back down.

---

## 3. Bank connection sequence

### Screen dims (3b)
- Dark overlay fades in: `background-color: rgba(0,0,0,0) → rgba(0,0,0,0.6), 300ms ease`
- Bank connection card remains at full opacity but appears to recede behind the overlay

### Tink modal appears (3c)
- Modal slides up from bottom: `transform: translateY(100%) → translateY(0), 400ms cubic-bezier(0.16, 1, 0.3, 1)` (spring-like ease — fast start, gentle settle)
- Alternatively, fade + scale: `opacity 0→1, scale 0.95→1, 300ms ease-out`
- **Choose one, not both.** Slide-up feels more native on mobile. Fade+scale feels more desktop.

### Tink modal dismisses
- Modal slides down or fades out: reverse of appear, `250ms ease-in`
- Overlay fades out: `300ms ease`
- Brief pause (200ms) before reveal begins — creates anticipation

---

## 4. The reveal (3d) — the magic moment

**This sequence must feel alive. Each element appears with intentional timing.**

### "Connected to your bank" heading
- Fades in: `opacity 0→1, 300ms ease-out`
- Progress bar appears beneath: `width 0→10%, 500ms ease`

### Per-account processing block
- "Processing Barclays current account xxxx2392" slides in from left: `transform: translateX(-20px) → translateX(0), opacity 0→1, 300ms ease-out`

### Tick items (the magic)
- Each tick item appears sequentially with staggered delays:
  - Item 1: delay 0ms
  - Item 2: delay 400ms
  - Item 3: delay 600ms
  - Item 4: delay 800ms
  - Item 5: delay 1000ms
  - Item 6: delay 1200ms
- Per-item animation: `opacity 0→1, transform: translateY(8px) → translateY(0), 250ms ease-out`
- The tick (✓) appears first, then the text follows 50ms later
- Financial values in tick items use the count-up animation: number rolls from 0 to final value over `400ms ease-out`
- Progress bar advances smoothly as each item appears

### If multiple accounts
- Second account block appears after first account's items complete
- Brief pause (300ms) between accounts
- Same staggered tick pattern repeats

### Latency fallback messages
- Messages cross-fade: `opacity 1→0 (200ms), swap text, opacity 0→1 (200ms)`
- Transaction count numbers increment in real-time if possible (count-up)

---

## 5. Confirmation flow transitions

### Section transitions (e.g., Income → Property)
1. Current question content fades out: `opacity 1→0, 200ms ease-out`
2. Section label changes (cross-fade): `200ms`
3. Progress stepper advances: filled segment transitions `300ms ease`
4. New question content fades in: `opacity 0→1, 200ms ease-in`
5. If mini-summary was showing, it slides up into the accordion: `max-height → 0, 300ms ease-out, opacity 1→0`

### Question-to-question within a section
- Same as section transition but without the section label change
- Progress stepper does NOT advance (stays within the same section segment)
- Faster: `150ms` fade transitions (feels snappier within a section)

### Radio option selection
- Selected option: background transitions to highlight colour `150ms ease`
- Previously selected option: background returns to default `150ms ease`
- No delay before [Next] becomes active

### [Next] button click
- Brief press feedback: `scale 0.98, 100ms` then release
- Content begins fading immediately — no artificial delay

---

## 6. Mini-summary appearance

### Summary slides into view
1. Question area content fades out: `200ms ease-out`
2. Summary content slides up from below: `transform: translateY(20px) → translateY(0), opacity 0→1, 300ms ease-out`
3. Tick items within summary stagger in (same pattern as reveal):
   - Each item: `opacity 0→1, translateY(4px) → translateY(0), 200ms ease-out`
   - Stagger delay: 150ms between items
4. Info boxes (gap messages) appear last, slight delay: `opacity 0→1, 250ms ease-out, delay 100ms after parent tick`

### Accordion expansion (bank connection row)
- Chevron rotates: `transform: rotate(0deg) → rotate(180deg), 200ms ease`
- New sub-tab slides down from the bank connection row: `max-height 0 → auto, 300ms ease-out, opacity 0→1`
- Sub-tab text: "✓ [Section] disclosed, ready for sharing & collaboration"

### Accordion collapse (moving to next section)
- Sub-tabs slide up: `max-height → 0, 250ms ease-in, opacity 1→0`
- Chevron rotates back: `200ms ease`
- Net effect: completed sections tuck away, current section gets full focus

### [This looks correct] click
- Summary card briefly pulses: `scale 1→1.005→1, 200ms` (subtle confirmation)
- Content transitions to next section or final summary

---

## 7. Final summary (2i)

### Full accordion expansion
- All completed sub-tabs expand simultaneously with staggered delays:
  - Tab 1: delay 0ms
  - Tab 2: delay 80ms
  - Tab 3: delay 160ms
  - etc.
- Each: `max-height 0→auto, 300ms ease-out, opacity 0→1`
- Creates a "waterfall" effect as the completed sections cascade into view

### Progress bar completion
- Final segment fills: `300ms ease`
- Brief celebration moment: progress bar color may briefly flash or pulse (subtle, 1 cycle)

### "This is great progress" heading
- Appears after accordion finishes expanding: `opacity 0→1, 300ms, delay 200ms`

---

## 8. Financial summary hub (3a)

### Page entry
- "< Back to your dashboard" appears with page transition: `opacity 0→1, 200ms`
- Section cards stagger in from top to bottom:
  - Card 1: delay 0ms
  - Card 2: delay 100ms
  - Card 3: delay 200ms
  - etc.
- Per-card: `opacity 0→1, translateY(12px) → translateY(0), 300ms ease-out`

### Source badges
- Badges appear with their parent item (no separate animation)
- Green badges (bank connection) and orange badges (self disclosed) use their respective colours as background with white or dark text — exact colours TBD in visual design phase

### + Add buttons
- On hover: subtle background colour change `150ms ease`
- On click: reveals an inline form or navigates to the appropriate flow

---

## 9. Post-connection task list (2j)

### Page entry (from financial summary back to dashboard)
- Task list sections stagger in:
  - Preparation: delay 0ms
  - Sharing: delay 150ms
  - Finalisation: delay 300ms
- Per-section: `opacity 0→1, 200ms ease-out`

### Task completion
- When a task is completed, tick appears: `scale 0→1, 200ms cubic-bezier(0.34, 1.56, 0.64, 1)` (bouncy overshoot)
- Task text may transition to a muted colour: `color transition, 200ms`

### New task appearing
- When the system adds a new task (e.g., after discovering a gap): `opacity 0→1, translateY(-8px) → translateY(0), 300ms ease-out`
- A brief highlight pulse on the new task: `background flash, 600ms` then settle

---

## 10. General principles

### Timing budget
| Transition type | Duration | Easing |
|----------------|----------|--------|
| Micro (button press, hover) | 100-150ms | ease |
| Content swap (fade in/out) | 200ms | ease-out / ease-in |
| Structural (accordion, card) | 300ms | ease-out |
| Showcase (reveal ticks, stagger) | 250ms per item | ease-out |
| Progress bar | 300-500ms | ease |
| Modal appear | 300-400ms | cubic-bezier(0.16, 1, 0.3, 1) |

### Never
- Never use transitions longer than 600ms (except the reveal sequence which is intentionally paced)
- Never animate layout shifts that cause content to jump — use transforms and opacity only
- Never use bounce/spring on financial data (values, balances) — reserve playfulness for UI chrome
- Never auto-advance the user — every major transition waits for a user action

### Always
- Always use `will-change` or `transform: translateZ(0)` on animated elements for GPU acceleration
- Always provide `prefers-reduced-motion` fallbacks — instant transitions, no stagger delays
- Always ensure animations don't block interaction — the user can click [Next] before animations complete
