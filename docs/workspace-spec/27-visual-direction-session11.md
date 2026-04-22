# Visual Direction — Session 11 Design Pass

> **⚠ SUPERSEDED (session 22).** Canonical visual direction is now the Claude AI Design tool outputs from session 22 wire batches. Anchor shortlist in `68g-visual-anchors.md` (C-V1..C-V14). See CLAUDE.md "Visual direction" section for the current framing. The Airbnb / Emma / Habito references below are **no longer reference points** and must not be cited as visual direction for new work.
>
> Parts of this spec that may remain useful as *historical context only*: the principles around "colour is a signal," "shadow over borders," "data speaks," "brevity," and "generous space" happen to align with the Claude AI Design outputs and are already encoded there. Token values (spacing, typography) remain valid only where the Claude AI Design outputs have not superseded them.

---

**Original references (SUPERSEDED):** Airbnb (surfaces, spacing, accent colour), Emma (financial value display, card treatment, content brevity), Habito (Q&A interaction, radio cards, progress bar)
**Originally supersedes:** Spec 18 colour palette and component designs. Spec 18 spacing tokens, typography scale, and animation timings remain valid.

---

## 1. Principles

1. **Colour is a signal, not decoration.** Red = primary action. Black = important. Green = confirmed. Orange = estimated. Everything else is white/grey.
2. **Shadow over borders.** Cards separate from background through elevation, not lines.
3. **Data speaks.** Financial values are the hero element. Labels support, they don't compete.
4. **Brevity.** If it can be said in 4 words, don't use 8. One line of helper text max.
5. **Generous space.** Airbnb-level whitespace. Let content breathe.

---

## 2. Accent Colour — Decouple Red

| Token | Hex | Usage |
|---|---|---|
| `red-500` | #E5484D | Primary CTA buttons, progress bar fill, key interactive moments |
| `red-600` | #CE3E44 | Hover state for primary CTAs |
| `red-50` | #FEF2F2 | Error/destructive backgrounds (not for CTAs) |

**Red is used ONLY for:**
- Primary CTA buttons ("Continue", "Connect your bank", "Done")
- Progress bar fill in confirmation flow
- Logo accent (future)

**Red is NOT used for:**
- Status badges (green/orange own that)
- Headings or text
- Borders or backgrounds (except error states)

---

## 3. Full Colour Palette

### Surfaces
| Token | Hex | Usage |
|---|---|---|
| `white` | #FFFFFF | Cards, panels, modals |
| `off-white` | #F7F8FA | Page background canvas |
| `grey-50` | #F0F1F4 | Disabled zones, empty states |
| `grey-100` | #E2E4E9 | Dividers inside cards, input borders |
| `grey-200` | #C8CCD4 | Secondary borders, inactive elements |

### Text
| Token | Hex | Usage |
|---|---|---|
| `ink` | #1A1D23 | Headings, selected radio states, emphasis |
| `ink-secondary` | #4A4F5C | Body text, descriptions |
| `ink-tertiary` | #7C8291 | Helper text, metadata, timestamps |
| `ink-disabled` | #B0B5BF | Disabled text, placeholders |

### Functional (status only)
| Token | Hex | Usage |
|---|---|---|
| `green-600` | #16A34A | Confirmed badges, tick icons |
| `green-50` | #F0FDF4 | Confirmed badge backgrounds |
| `amber-600` | #D97706 | Estimated badges, attention icons |
| `amber-50` | #FFFBEB | Estimated badge backgrounds |
| `blue-600` | #2563EB | Links and interactive text ONLY |

### Accent
| Token | Hex | Usage |
|---|---|---|
| `red-500` | #E5484D | Primary CTA |
| `red-600` | #CE3E44 | Primary CTA hover |

---

## 4. Layout

### Page structure
| Property | Value | Notes |
|---|---|---|
| Page max-width | **1080px** | Wider than spec 18's 720px — Airbnb-level breathing room |
| Content column (forms/Q&A) | **600px** | Centred within the page — keeps questions readable |
| Content column (task list, summary) | **100%** of page max | Uses full width for cards and lists |
| Page horizontal padding | 24px (desktop), 16px (mobile) | |
| Background | `off-white` #F7F8FA full bleed | |

### Header bar
| Property | Value |
|---|---|
| Height | 64px |
| Background | White with `0 1px 0 #E2E4E9` bottom border |
| Logo | "Decouple" placeholder text, **centred horizontally** |
| Logo style | 20px / 700 / `#1A1D23` (or logo image when available) |
| Left slot | Back arrow or hamburger menu (context-dependent) |
| Right slot | Help link or empty |
| Max-width | Full bleed (not constrained to 1080px) |

### Content areas by screen type
| Screen | Content width | Notes |
|---|---|---|
| Welcome carousel | 600px centred | Card content stays focused |
| Task list | 1080px full | Task cards use available width |
| Confirmation Q&A | 600px centred | One question, readable, generous whitespace |
| Section mini-summary | 600px centred | Consistent with Q&A flow |
| Financial summary | 1080px full | Section cards can breathe |

---

## 5. Typography

Font: **Inter** throughout. No change.

| Element | Size | Weight | Colour | Usage |
|---|---|---|---|---|
| Page heading | 28px | 700 | `ink` | Top-level titles |
| Question text | 22px | 700 | `ink` | Confirmation flow questions (Habito-bold) |
| Section heading | 18px | 600 | `ink` | Card titles, section labels |
| Financial value (hero) | 28–32px | 700 | `ink` | Primary number on a card — the number IS the content |
| Financial value (list) | 16px | 600 | `ink` | Values in list rows |
| Body | 15px | 400 | `ink-secondary` | Descriptions, content |
| Body emphasis | 15px | 600 | `ink` | Key values within body text |
| Helper text | 13px | 400 | `ink-tertiary` | Subtitles below questions, metadata |
| Label/badge | 12px | 500 | contextual | Status tags, form labels |
| Micro | 11px | 500 | contextual | Badge text, smallest labels |

### Financial value formatting
- Primary values: large, bold, `ink` — the number dominates the card
- Pence/decimals: same size but weight 400 (lighter) for visual hierarchy
- Negative values: prefixed with minus, same colour (no red for negative — red is reserved for CTAs)

---

## 6. Cards

| Property | Value |
|---|---|
| Background | White `#FFFFFF` |
| Border | **None** — shadow separates |
| Border radius | **12px** (up from spec 18's 6px) |
| Shadow (rest) | `0 1px 3px rgba(0,0,0,0.08)` |
| Shadow (hover) | `0 2px 8px rgba(0,0,0,0.12)` |
| Internal padding | 24px all sides |
| Gap between cards | 16px |

### Hero panel (primary content area)
| Property | Value |
|---|---|
| Background | White |
| Border radius | 16px |
| Shadow | `0 2px 8px rgba(0,0,0,0.08)` (slightly more prominent) |
| Internal padding | 32px |
| Gap to content below | 32px |

---

## 7. Buttons

### Primary CTA
| Property | Value |
|---|---|
| Background | `red-500` #E5484D |
| Text | White, 15px / 600 |
| Border radius | 12px |
| Padding | 14px 24px |
| Width | Full-width on mobile, auto on desktop (min 200px) |
| Hover | `red-600` #CE3E44 |
| Disabled | `#E5484D` at 40% opacity |
| Transition | background 150ms ease |

### Secondary
| Property | Value |
|---|---|
| Background | White |
| Border | 1px `grey-100` #E2E4E9 |
| Text | `ink` #1A1D23, 15px / 600 |
| Border radius | 12px |
| Hover | Background `grey-50` #F0F1F4 |

### Ghost / text link
| Property | Value |
|---|---|
| Text | `blue-600` #2563EB, 13px or 15px |
| Decoration | Underlined |
| Hover | `blue-600` at 80% opacity |

---

## 8. Confirmation Flow — Q&A Pattern

### Radio option cards (Habito-inspired)
| Property | Unselected | Selected |
|---|---|---|
| Background | White | `ink` #1A1D23 |
| Border | 1px `grey-100` #E2E4E9 | 1px `ink` #1A1D23 |
| Text | `ink` #1A1D23, 15px / 500 | White, 15px / 600 |
| Radio circle | 20px, `grey-200` border, white fill | 20px, white border, white filled dot |
| Border radius | 12px | 12px |
| Padding | 16px 20px | 16px 20px |
| Gap between options | 8px | 8px |
| Transition | background 200ms ease, color 200ms ease | |

### Selection + submit flow
1. User taps option → immediate black inversion (strong feedback)
2. If simple answer: red "Continue" button activates below
3. If "Other" / needs follow-up: additional field slides in (200ms ease) below the selected option, "Continue" stays disabled until field is complete
4. User taps "Continue" → advances to next question

### Progressive disclosure
- Additional fields (text input, dropdown, number input) slide in below the selected radio card
- Animation: height auto with 200ms ease, opacity 0→1
- The revealed field sits inside the selected card's visual group (indented or nested)
- "Continue" button remains disabled until all revealed fields have valid input

### Progress indicator
| Property | Value |
|---|---|
| Style | Step counter "N of M" above a thick bar |
| Bar height | 6px |
| Bar radius | 3px (half height) |
| Track colour | `grey-100` #E2E4E9 |
| Fill colour | `red-500` #E5484D |
| Fill transition | width 300ms ease |
| Counter text | 13px / 600 / `ink` |

---

## 9. Financial Summary — Value Display

### Section cards
- Card title (18px/600) top-left
- Primary value (28px/700) prominent — the number dominates
- Source badge: small pill (green "Bank confirmed" or orange "Your estimate")
- Detail rows: icon + label (left) + value (right-aligned) — scannable column
- [Edit] link: ghost style, bottom-right

### Source badges
| Type | Background | Text colour | Text |
|---|---|---|---|
| Confirmed | `green-50` | `green-600` | "Bank confirmed" |
| Estimated | `amber-50` | `amber-600` | "Your estimate" |

Badge: 12px/500, 4px 10px padding, border-radius 6px.

---

## 10. Spacing Rhythm

| Gap | Value | Between |
|---|---|---|
| Inside cards | 24px | Content to card edge |
| Hero panel inside | 32px | Content to panel edge |
| Between cards | 16px | Stacked cards |
| Between sections | 32px | Major content blocks |
| Question → helper text | 8px | Question and its subtitle |
| Helper text → options | 20px | Subtitle to first radio card |
| Between radio options | 8px | Stacked option cards |
| Options → Continue button | 24px | Last option to CTA |
| Header → content | 32px | Below header bar |

---

## 11. Animations

All timings from spec 18/26 remain valid:

| Animation | Duration | Easing |
|---|---|---|
| Content fade (between questions) | 200ms | ease |
| Progress bar fill | 300ms | ease |
| Value count-up | 600ms | ease-out |
| Card hover shadow | 150ms | ease |
| Radio selection inversion | 200ms | ease |
| Progressive disclosure (field reveal) | 200ms | ease |
| Opacity fade (section dimming) | 400ms | ease-out |

All animations respect `prefers-reduced-motion: reduce`.

---

## 12. What Changed from Spec 18

| Property | Spec 18 | Session 11 | Reason |
|---|---|---|---|
| Card border-radius | 6px | 12px | Airbnb/Emma softness |
| Card separation | 1px border | Shadow-based | Modern, cleaner |
| Primary CTA colour | `ink` #1A1D23 | `red-500` #E5484D | Airbnb accent pattern — warmth + urgency |
| Page max-width | 720px | 1080px | Wider, more Airbnb-like breathing room |
| Header | Left-aligned title | Centred logo + 64px height | Brand presence |
| Radio buttons | Standard enhanced | Full-width card with black inversion | Habito pattern |
| Progress bar | 4px, ink fill | 6px, red fill, step counter | Bolder, more confident |
| Question text size | 20px | 22px | More Habito-bold presence |
| Blue buttons | Used for secondary CTAs | Blue for links only | Cleaner hierarchy |

---

## 13. Don'ts

- Don't use red for status/error — it's the brand action colour. Use amber for warnings, red-50 backgrounds with body text for actual errors.
- Don't add borders to cards — shadow does the work.
- Don't use blue for buttons — blue is for text links only.
- Don't use colour for decoration — every colour must communicate status.
- Don't write long helper text — one line, 13px, `ink-tertiary`.
- Don't narrate what's visible — if the value is showing, the value IS the explanation.
