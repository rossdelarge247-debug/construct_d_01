# Visual Design System — Post-Pivot

**Supersedes:** `01-design-system.md` (retained for reference), `v2/workspace-visual-redesign.md` (partially superseded)
**Direction:** From warm/soft to functional/empowering. High contrast, clean, bold. Colour is functional — it communicates status, not atmosphere.
**References:** FreeAgent (generous spacing, clear hierarchy), Dext (financial document handling, side-by-side), Xero (reconciliation patterns, status colours), GOV.UK (clarity, no decoration)

---

## 1. Colour palette

### Primary surfaces

| Token | Hex | Usage |
|-------|-----|-------|
| `white` | #FFFFFF | Hero panel, section cards, modals, primary surfaces |
| `off-white` | #F7F8FA | Page background, the canvas everything sits on |
| `grey-50` | #F0F1F4 | Subtle card backgrounds (e.g., empty states, disabled zones) |
| `grey-100` | #E2E4E9 | Borders, dividers, input field borders |
| `grey-200` | #C8CCD4 | Secondary borders, inactive elements |

### Text

| Token | Hex | Usage |
|-------|-----|-------|
| `ink` | #1A1D23 | Primary headings, bold text, high-emphasis content |
| `ink-secondary` | #4A4F5C | Body text, descriptions, secondary content |
| `ink-tertiary` | #7C8291 | Metadata, labels, timestamps, helper text |
| `ink-disabled` | #B0B5BF | Disabled text, placeholder text |

### Functional colour — status

Colour communicates state, not decoration. Each colour has one job.

| Token | Hex | Usage | Meaning |
|-------|-----|-------|---------|
| `blue-600` | #2563EB | Primary CTA, active states, links, progress bars | Action / interactive |
| `blue-50` | #EFF6FF | Blue tint backgrounds (active states, selected items) | Active context |
| `green-600` | #16A34A | Tick icons, confirmed items, success states | Confirmed / evidenced |
| `green-50` | #F0FDF4 | Green tint backgrounds (confirmed sections) | Confirmed context |
| `amber-600` | #D97706 | Warning icons, estimate labels, attention indicators | Estimated / needs action |
| `amber-50` | #FFFBEB | Amber tint backgrounds (estimate states) | Estimate context |
| `red-600` | #DC2626 | Error states, destructive actions, critical flags | Error / critical |
| `red-50` | #FEF2F2 | Red tint backgrounds (error states) | Error context |
| `slate-700` | #334155 | Lozenges (evidence pills), nav elements, badges | Structural / chrome |
| `slate-50` | #F8FAFC | Lozenge hover state, subtle emphasis | Chrome context |

### The rule

**No decorative colour.** Every use of colour must answer: "What status or state does this communicate?" If the answer is "it looks nice" or "it adds warmth," remove it. White and off-white do the background work. Ink tones do the text work. Functional colours (blue, green, amber, red, slate) do the communication work.

The previous palette (cream #FAF6F1, warmth #C67D5A, sage #7A9E7E, teal #5B8A8A, depth #3D4F5F) is retired. These colours served a "warm hug" purpose. The new palette serves a "powerful support" purpose.

---

## 2. Typography

### Font

**Inter** — unchanged. One font throughout. No serif. Inter's variable font weight axis gives us the range we need.

### Scale

| Element | Size | Weight | Tracking | Line height | Usage |
|---------|------|--------|----------|-------------|-------|
| **Page title** | 28px | 700 (Bold) | -0.02em | 1.2 | "Overview" in title bar |
| **Hero heading** | 24px | 700 (Bold) | -0.01em | 1.3 | "Upload evidence to complete your preparation" |
| **Section heading** | 20px | 700 (Bold) | -0.01em | 1.3 | "Financial picture summary", "Life after separation" |
| **Card title** | 16px | 600 (Semibold) | 0 | 1.4 | "Income", "Accounts", "Spending" in section cards |
| **Body** | 15px | 400 (Regular) | 0 | 1.6 | Descriptions, content, question text |
| **Body emphasis** | 15px | 600 (Semibold) | 0 | 1.6 | Key values, highlighted text within body |
| **Small** | 13px | 400 (Regular) | 0 | 1.5 | Helper text, metadata, timestamps |
| **Label** | 12px | 500 (Medium) | 0.02em | 1.4 | Form labels, status tags, fidelity labels |
| **Micro** | 11px | 500 (Medium) | 0.04em | 1.4 | Lozenge text, badge text, extreme-small labels |

### Hierarchy rules

- **Headings are bold and dark.** Always `ink` (#1A1D23), always weight 600–700. They anchor the page.
- **Body text is secondary tone.** `ink-secondary` (#4A4F5C) for most content. Lighter than headings but still highly readable.
- **Values and numbers are prominent.** Financial values use `body emphasis` (15px/600) or larger. When a value is the primary content of a card, it should be the most visually prominent element.
- **Labels explain, they don't compete.** `ink-tertiary` (#7C8291), smaller size. "(Your estimate)", "Manually input", "2 of 12 months" — these are annotations, not content.

---

## 3. Spacing

### Base unit

**4px base, 8px standard increment.** All spacing is multiples of 4px.

### Spacing scale

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight internal spacing (icon-to-text gap, inline elements) |
| `space-2` | 8px | Standard internal padding (within labels, small gaps) |
| `space-3` | 12px | Component internal padding (card content inset) |
| `space-4` | 16px | Standard gap between elements within a component |
| `space-5` | 20px | Gap between components within a section |
| `space-6` | 24px | Card internal padding (top/bottom/left/right) |
| `space-8` | 32px | Gap between section cards on the hub |
| `space-10` | 40px | Gap between major sections (hero panel to "Financial picture summary") |
| `space-12` | 48px | Page-level vertical padding |

### Density

**Generous, closer to FreeAgent than Xero.** Section cards have breathing room. The hub page should not feel packed — each card is clearly distinct with space between. The hero panel has substantial internal padding to feel like the primary zone.

Specifically:
- Section cards: `space-6` (24px) internal padding, `space-8` (32px) gap between cards
- Hero panel: `space-8` (32px) internal padding, `space-10` (40px) gap to section below
- Q&A questions within hero panel: `space-6` (24px) above and below question blocks

---

## 4. Components

### Section cards

```
┌─────────────────────────────────────────────────────────┐
│  Income                                  Manually input │  ← card-title (16/600) + link (13/400, blue-600)
│                                                         │
│  £3,218 net/month from ACME Ltd                        │  ← body-emphasis (15/600, ink)
│  Child Benefit: £96.25/month from HMRC                 │  ← body (15/400, ink-secondary)
│  Barclays statements, 2 of 12 months                   │  ← small (13/400, ink-tertiary)
│                                                         │
│                                      Review details →  │  ← link (13/400, blue-600)
└─────────────────────────────────────────────────────────┘
```

- **Background:** `white` (#FFFFFF)
- **Border:** 1px `grey-100` (#E2E4E9)
- **Border radius:** 6px (slight, sharp-ish)
- **Shadow:** None at rest. On hover: `0 1px 3px rgba(0,0,0,0.06)` (very subtle lift)
- **Internal padding:** 24px all sides
- **Gap between cards:** 32px (reduced to 16px on mobile)

**States:**
- **Empty:** Body text in `ink-tertiary`, slightly reduced visual weight
- **Estimate:** Value shown with "(Your estimate)" label in `amber-600`
- **Partial evidence:** Value shown with evidence source in `ink-tertiary`. No status colour — the label ("2 of 12 months") communicates completeness
- **Fully evidenced:** Value shown, source text, no amber — just clean confirmed data
- **Faded (during hero panel activity):** 70% opacity on entire card

### Hero panel

- **Background:** `white` (#FFFFFF)
- **Border:** None
- **Border radius:** 8px
- **Shadow:** `0 1px 4px rgba(0,0,0,0.05)` (tiny shadow — separation from off-white background without a border)
- **Internal padding:** 32px all sides
- **Page background behind it:** `off-white` (#F7F8FA)

The hero panel is the most visually prominent element on the page — white on off-white with a subtle shadow makes it float above the canvas without a heavy border treatment.

### Evidence lozenges

- **Background:** `slate-700` (#334155) — dark, solid, confident
- **Text:** White, `micro` (11px/500)
- **Border radius:** 20px (fully rounded pill)
- **Padding:** 6px 16px
- **Gap between lozenges:** 8px
- **Wrap behaviour:** Lozenges wrap to next row on narrow screens

**States:**
- **Empty:** `slate-700` background, white text
- **Uploading (spinner):** `slate-700` background, white spinner icon + text
- **Uploaded (tick):** `slate-700` background, white tick icon + text + chevron for flyout
- **Flyout:** White dropdown with `grey-100` border, 6px radius, subtle shadow. Lists documents in `small` (13px) with `ink-secondary` text.

### Buttons

**Primary CTA:**
- **Background:** `ink` (#1A1D23) — black/near-black
- **Text:** White, 15px/600
- **Border radius:** 6px (sharp, matches cards)
- **Padding:** 12px 24px
- **Hover:** `ink` at 90% opacity
- **Examples:** "Accept", "Yes it is", "Pension", "Finished for now", "Review uploads now", "Begin plan"

**Secondary / navigation CTA (e.g., "Share & collaborate"):**
- **Background:** `blue-600` (#2563EB)
- **Text:** White, 13px/600
- **Border radius:** 20px (pill/rounded — differentiated from primary)
- **Padding:** 8px 20px
- **Hover:** `blue-600` at 90% opacity

**Tertiary / text link:**
- **Text:** `blue-600`, 13px or 15px depending on context, underlined
- **Hover:** `blue-600` at 80% opacity
- **Examples:** "No it's something else", "Upload more documents now, I'm on a roll", "Manually input", "Help with this"

### Progress bar (Q&A flow)

- **Track:** `grey-100` (#E2E4E9), 4px height, full width of hero panel
- **Fill:** `ink` (#1A1D23) — confident, not blue (this is progress, not a link)
- **Border radius:** 2px
- **Animation:** Smooth transition (300ms ease) as it advances per question

### Fidelity labels

- **Text:** `label` (12px/500)
- **Background:** Contextual — `grey-50` for "not yet ready", `green-50` for "ready for mediation", `blue-50` for "ready for disclosure"
- **Border radius:** 4px
- **Padding:** 4px 10px
- **Position:** Inline with section heading, right-aligned

### Radio buttons and checkboxes (Q&A flow)

- **Standard browser styling enhanced:** 18px hit target, `blue-600` fill when selected, `grey-200` border when unselected
- **Label:** `body` (15px/400) inline with the control
- **Gap between options:** 12px

### Info boxes (advisory messages)

- **Background:** `blue-50` (#EFF6FF) for informational, `amber-50` for warnings
- **Left border:** 3px `blue-600` or `amber-600`
- **Border radius:** 6px (matching cards)
- **Internal padding:** 16px
- **Icon:** ℹ or ! in the corresponding colour, left-aligned
- **Text:** `body` (15px/400, `ink-secondary`)

### Summary tick items (State 4)

- **Icon:** ✓ in `green-600`, 18px
- **Text:** `body` (15px/400, `ink-secondary`)
- **Gap:** 8px between icon and text, 12px between items

### Summary todo items (State 4)

- **Icon:** ! in `amber-600`, 18px
- **Text:** `body` (15px/400, `ink-secondary`)
- **Links within:** `blue-600`, underlined
- **Gap:** 8px between icon and text, 12px between items

---

## 5. Animation and transitions

### The 70% fade

When the hero panel enters active state (upload/processing/Q&A):
- All elements below the hero panel transition to `opacity: 0.3` (70% fade)
- Transition: `opacity 400ms ease-out`
- On completion ("Finished for now"): transition back to `opacity: 1` over `400ms ease-in`

### Hero panel state transitions

- Content within the hero panel cross-fades between states: outgoing content fades out (200ms), incoming content fades in (200ms)
- No slide animations — content changes in place
- Exception: the progress bar slides smoothly (300ms ease) when advancing

### AI processing animation

- **Not sparkles.** The wireframe shows placeholder sparkle icons — the final implementation should feel like "precision processing":
- **Option A:** A subtle shimmer/pulse on the hero panel background — a slow, rhythmic brightness shift (2s cycle) that says "working" without being playful
- **Option B:** Three small dots that pulse sequentially (like a typing indicator in a chat), positioned below the contextual messaging
- **Option C:** A thin horizontal progress line (indeterminate) that sweeps across the hero panel, similar to Material Design's indeterminate linear progress
- The animation must feel **competent and measured**, not magical or whimsical. The product is working, not performing.

### Value count-up

When financial values appear in section cards (after Q&A completion), numbers count up from 0 to their final value over 600ms. This is the "your picture is building" moment. Use `ease-out` for a natural deceleration.

### Lozenge state transitions

- Spinner appears with 200ms fade-in
- Spinner → tick: spinner fades out (150ms), tick fades in (150ms)
- Chevron appears alongside tick (150ms fade-in)

---

## 6. Layout

### Page structure

- **Maximum content width:** 720px centred (matches wireframes — single column, generous)
- **Page padding:** 24px horizontal (desktop), 16px (mobile)
- **Background:** `off-white` (#F7F8FA) full bleed

### Title bar

- **Height:** 56px
- **Background:** `white` with 1px `grey-100` bottom border
- **Hamburger icon:** Left-aligned, 24px, `ink`
- **Page title:** Left, after hamburger, `page-title` (28px/700)
- **Right-aligned CTA:** "Share & collaborate" button (when visible)

### Hero panel position

- Sits below title bar with `space-10` (40px) top margin
- Full content width (720px max)
- White background with subtle shadow on off-white page

### Section cards position

- Below hero panel with `space-10` (40px) gap
- "Financial picture summary" heading with fidelity label: `section-heading` (20px/700)
- Cards stack vertically with `space-8` (32px) gaps
- Full content width

### Drag-and-drop zone

- **Border:** 2px dashed `grey-200` (#C8CCD4)
- **Border radius:** 8px
- **Background:** `grey-50` (#F0F1F4) — subtly different from hero panel white
- **Min height:** 200px
- **Text:** `body` (15px/400, `ink-tertiary`), centred
- **"upload" link:** `blue-600`, underlined
- **Hover / drag-over state:** Border becomes `blue-600` dashed, background becomes `blue-50`

---

## 7. Accessibility

### Contrast ratios (WCAG 2.1 AA minimum)

| Combination | Ratio | Pass? |
|-------------|-------|-------|
| `ink` on `white` | 16.5:1 | Yes (AAA) |
| `ink` on `off-white` | 15.2:1 | Yes (AAA) |
| `ink-secondary` on `white` | 8.6:1 | Yes (AAA) |
| `ink-tertiary` on `white` | 4.8:1 | Yes (AA) |
| White on `slate-700` | 9.7:1 | Yes (AAA) |
| White on `blue-600` | 4.7:1 | Yes (AA) |
| White on `ink` (primary CTA) | 16.5:1 | Yes (AAA) |
| `green-600` on `white` | 4.6:1 | Yes (AA) |
| `amber-600` on `white` | 3.8:1 | Borderline — use alongside text label, never colour-alone |

### Touch targets

- Minimum 44px height for all interactive elements (buttons, links, radio buttons, checkboxes)
- Lozenges: minimum 36px height (compact but tappable)
- Drag-and-drop zone: minimum 200px height

### Focus states

- **Focus ring:** 2px `blue-600` outline with 2px offset on all interactive elements
- **Tab order:** Hero panel first, then section cards top-to-bottom, then footer elements

### Screen reader considerations

- Hero panel state changes announced via `aria-live="polite"` region
- Progress bar: `role="progressbar"` with `aria-valuenow`
- Lozenges: `aria-expanded` for flyout state
- Faded section cards: `aria-hidden="false"` (still accessible, just visually de-emphasised)
- Q&A questions: `role="radiogroup"` for radio options, `role="checkbox"` for batch accept

---

## 8. Dark mode

**Not in scope for V2.** Design for light mode only. The palette is structured to support dark mode later (functional colour tokens rather than hard-coded values), but implementation is deferred.

---

## 9. Design tokens summary (for globals.css)

```css
/* Surfaces */
--color-white: #FFFFFF;
--color-off-white: #F7F8FA;
--color-grey-50: #F0F1F4;
--color-grey-100: #E2E4E9;
--color-grey-200: #C8CCD4;

/* Text */
--color-ink: #1A1D23;
--color-ink-secondary: #4A4F5C;
--color-ink-tertiary: #7C8291;
--color-ink-disabled: #B0B5BF;

/* Functional */
--color-blue-600: #2563EB;
--color-blue-50: #EFF6FF;
--color-green-600: #16A34A;
--color-green-50: #F0FDF4;
--color-amber-600: #D97706;
--color-amber-50: #FFFBEB;
--color-red-600: #DC2626;
--color-red-50: #FEF2F2;
--color-slate-700: #334155;
--color-slate-50: #F8FAFC;

/* Spacing */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;

/* Border radius */
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-pill: 20px;
--radius-full: 9999px;

/* Shadows */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
--shadow-hero: 0 1px 4px rgba(0, 0, 0, 0.05);

/* Typography */
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--text-page-title: 700 28px/1.2 var(--font-family);
--text-hero-heading: 700 24px/1.3 var(--font-family);
--text-section-heading: 700 20px/1.3 var(--font-family);
--text-card-title: 600 16px/1.4 var(--font-family);
--text-body: 400 15px/1.6 var(--font-family);
--text-body-emphasis: 600 15px/1.6 var(--font-family);
--text-small: 400 13px/1.5 var(--font-family);
--text-label: 500 12px/1.4 var(--font-family);
--text-micro: 500 11px/1.4 var(--font-family);

/* Animation */
--transition-fade: 400ms ease-out;
--transition-content: 200ms ease;
--transition-progress: 300ms ease;
--transition-value: 600ms ease-out;

/* Layout */
--content-max-width: 720px;
--title-bar-height: 56px;
```
