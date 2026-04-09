# Workspace Design Spec — 01: Design System

## Design philosophy

Every element should look intentional, not default. No thin hairline borders. No shy typography. No components that look like they came from a UI kit without customisation. This is a product that says "we've thought about every detail."

---

## Typography

**One font family: Inter.** No serif anywhere in the workspace. Serif was for the V1 interview (intimate, literary). The workspace is operational — clean, modern, confident.

### Scale

| Token | Size | Weight | Tracking | Use |
|-------|------|--------|----------|-----|
| hero | 40-48px | 800 (extrabold) | -0.03em | Financial totals on summary cards |
| h1 | 28-32px | 700 (bold) | -0.02em | Page titles ("Build your picture") |
| h2 | 22-24px | 700 (bold) | -0.02em | Section titles ("Your next step") |
| h3 | 18px | 600 (semibold) | -0.01em | Card titles, category names |
| body | 15px | 400 | 0 | Primary text |
| body-strong | 15px | 600 | 0 | Emphasis within body text |
| small | 13px | 400/500 | 0 | Descriptions, secondary info |
| label | 11px | 700 (bold) | 0.12em | Section headers (uppercase), metadata |
| micro | 10px | 500 | 0.08em | Tertiary info, timestamps |

### Rules

- **No font-medium (500) on headings.** Minimum 600 for any heading level.
- **Tracking tightens as size increases.** Large text gets negative letter-spacing. Small text stays normal or slightly wider.
- **Numbers always use tabular-nums** (monospaced digits for alignment).
- **Hero numbers in the financial summary should be the largest text on any page.**

---

## Colour usage

### Backgrounds

| Surface | Hex | Use |
|---------|-----|-----|
| `cream` | #FAF6F1 | Page background, main content area |
| `cream-dark` | #F0EBE3 | Sidebar background, muted sections, empty card fills |
| `surface` | #FEFDFB | Elevated cards, active content, white-warm |
| `teal-light` | #E0EDED | Information panels, "from your plan" sections |
| `warmth-light` | #F0DDD2 | AI insight panels, recommendation cards |
| `sage-light` | #E4EDE5 | Success/complete sections |
| `amber-light` | #F5ECD4 | Warning/awaiting sections |

### Left-border accents

Every card with meaning gets a left border that signals its status:

| Status | Border colour | Background | Meaning |
|--------|-------------|------------|---------|
| Primary action | `warmth` (#C67D5A) | `surface` | The thing to do next |
| Information | `teal` (#5B8A8A) | `teal-light` | Context, help, "from your plan" |
| Complete | `sage` (#7A9E7E) | `surface` or `sage-light` | Done, confirmed |
| Awaiting | `amber` (#D4A84B) | `amber-light` | Pending external action |
| AI insight | `warmth` (#C67D5A) | `warmth-light` | AI recommendation |
| Neutral | `cream-dark` (#F0EBE3) | `cream-dark` | Not started, no status |

### Accent usage

- `warmth` — primary CTAs, active sidebar item, progress fills, accent borders on priority items
- `teal` — secondary buttons, info panels, future phase indicators, links where warmth would be too strong
- `sage` — success states only
- `amber` — warning/awaiting states only
- `depth` — very selective: maybe the logo, or a dark section if needed. Not the sidebar.

---

## Borders

### Card borders

- **Minimum visible border: 2px.** No 1px borders anywhere in the workspace. If a border exists, it should be visible.
- **Left accent borders: 5px.** Bold enough to be a clear visual signal.
- **Border radius: 12px** on cards, 8px on buttons and inputs, 16px on large panels.
- **Border colour for structural borders: `cream-dark`** (#F0EBE3). Never grey. Always warm.

### Rules

- A card can have BOTH a structural border (2px cream-dark all around) AND a left accent border (5px colour). The accent overrides the left side.
- Cards without meaningful status can use cream-dark border only.
- No borderless floating cards unless they have a strong shadow.

---

## Shadows

- `shadow-sm` — default for cards: `0 1px 3px rgba(45, 41, 38, 0.06)`
- `shadow-md` — hover states, elevated: `0 3px 12px rgba(45, 41, 38, 0.08)`
- `shadow-lg` — modals, popovers: `0 8px 24px rgba(45, 41, 38, 0.12)`

All shadows use our warm ink colour base, never grey or blue.

---

## Buttons

| Variant | Background | Text | Border | Use |
|---------|-----------|------|--------|-----|
| Primary | `warmth` | white | none | Main CTAs — one per section maximum |
| Secondary | `surface` | `ink` | 2px `cream-dark` | Alternative actions, back buttons |
| Ghost | transparent | `ink-light` | none | Tertiary actions, "skip", "cancel" |
| Teal | `teal` | white | none | Secondary emphasis where warmth is already used |

### Button sizing

| Size | Padding | Font size | Min height |
|------|---------|-----------|------------|
| sm | 12px 16px | 13px | 36px |
| md | 14px 24px | 14px | 42px |
| lg | 16px 32px | 16px | 48px |

### Rules

- **One primary button per visible section.** If there are two CTAs, one must be secondary.
- **Buttons should be bold (font-weight 600).**
- **Border radius: 8px** (var(--radius-sm)).
- **Hover: darken background slightly + subtle shadow transition.**
- **Active: scale(0.98) for tactile feedback.**

---

## Cards

### Anatomy of a workspace card

```
┌─────────────────────────────────────────────┐
│ ████ ← 5px left accent border                │
│                                               │
│  LABEL (11px bold uppercase)                  │
│                                               │
│  Title (18px semibold)        Status badge    │
│  Description (13px)                           │
│                                               │
│  [Primary CTA]  [Secondary CTA]              │
│                                               │
└─────────────────────────────────────────────┘
```

### Card padding

- **Standard: 24px** (p-6)
- **Large (hero cards): 32px** (p-8)
- **Compact (within lists): 16px** (p-4)

### Card states

Cards should look DIFFERENT based on state. Not just a badge — the entire card changes:

- **Active/priority:** surface bg, warmth left border, shadow-sm
- **Complete:** surface or sage-light bg, sage left border
- **Awaiting:** amber-light bg, amber left border
- **Empty:** cream-dark bg, no left border, muted text
- **Hover:** lift (-translate-y-1), shadow-md transition

---

## Icons

For now: emoji/text symbols. When we have budget for a proper icon set, switch to Lucide or similar.

Icons should be:
- 20px in the sidebar
- 16px inline with text
- Consistent style (all outlined or all filled, not mixed)

---

## Spacing system

Based on 4px grid:

| Token | Value | Use |
|-------|-------|-----|
| xs | 4px | Tight gaps (between badge and text) |
| sm | 8px | Between related elements |
| md | 16px | Standard gap |
| lg | 24px | Between sections within a card |
| xl | 32px | Between major sections on a page |
| 2xl | 48px | Between page-level sections |

### Rules

- **Section gaps should be visible breathing room.** Minimum 32px between major sections.
- **Cards in a grid: 16px gap.**
- **Inside a card: 24px padding, 16px between internal elements.**
