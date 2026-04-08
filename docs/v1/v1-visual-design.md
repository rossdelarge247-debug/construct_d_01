# Visual Design Direction

## Design thesis

Every competitor in this space defaults to clinical blues and teals. They design for "calm" and land on "cold." People going through separation feel isolated, scared, and overwhelmed. They need warmth, not clinical distance.

Our visual design should feel like walking into a beautifully designed, warm room — not a hospital, not a law office, not a startup landing page. Professional but profoundly human.

**"A warm hand on a cold day."**

---

## Colour palette

### Core

| Token | Hex | Usage |
|-------|-----|-------|
| `cream` | `#FAF6F1` | Primary background — warm, never pure white |
| `cream-dark` | `#F0EBE3` | Secondary background, cards, subtle sections |
| `ink` | `#2D2926` | Primary text — warm charcoal, never pure black |
| `ink-light` | `#6B6560` | Secondary text, descriptions, metadata |
| `ink-faint` | `#A39E99` | Tertiary text, placeholders, disabled states |

### Accent

| Token | Hex | Usage |
|-------|-----|-------|
| `warmth` | `#C67D5A` | Primary accent — buttons, links, active states. Warm terracotta/coral. |
| `warmth-light` | `#F0DDD2` | Accent backgrounds, light highlights |
| `warmth-dark` | `#A8623F` | Hover states, emphasis |
| `sage` | `#7A9E7E` | Success, positive, confirmed, Known confidence state |
| `sage-light` | `#E4EDE5` | Success backgrounds |
| `sage-dark` | `#5C7E60` | Success emphasis |
| `depth` | `#3D4F5F` | Depth, gravitas, navigation, headings when needed |
| `depth-light` | `#E8ECF0` | Subtle borders, dividers |
| `soft` | `#C2B5C7` | Gentle highlights, Unsure confidence state |
| `soft-light` | `#EDE8EF` | Soft backgrounds |

### Confidence states

| State | Colour | Token |
|-------|--------|-------|
| Known | Sage | `sage` / `sage-light` |
| Estimated | Warm amber | `#D4A84B` / `#F5ECD4` |
| Unsure | Soft lavender | `soft` / `soft-light` |
| Unknown | Muted grey | `ink-faint` / `#EDECEA` |

### Rules

- **NO pure white (`#FFFFFF`) anywhere** — always `cream` or `cream-dark`
- **NO pure black (`#000000`) anywhere** — always `ink` or `depth`
- **NO teal, no blue as primary** — this is how we look different from every competitor

---

## Typography

### Heading: Serif

**Lora** (Google Font, free) — warm, readable serif with gentle curves. Used for:
- Page titles
- Section headings
- Pull quotes and key messages
- The plan summary

A serif heading is distinctive in this category — every competitor uses sans-serif. Serif says: literate, human, companion, not startup.

### Body: Sans-serif

**Inter** (Google Font, free) — clean, legible, calm. Used for:
- Body text
- Labels, inputs, buttons
- Navigation
- Data and metadata

### Scale

| Level | Font | Size | Weight | Line height |
|-------|------|------|--------|-------------|
| Display | Lora | 3rem (48px) | 500 | 1.1 |
| H1 | Lora | 2.25rem (36px) | 500 | 1.2 |
| H2 | Lora | 1.5rem (24px) | 500 | 1.3 |
| H3 | Lora | 1.25rem (20px) | 600 | 1.4 |
| Body | Inter | 1rem (16px) | 400 | 1.6 |
| Body small | Inter | 0.875rem (14px) | 400 | 1.5 |
| Caption | Inter | 0.75rem (12px) | 500 | 1.4 |
| Button | Inter | 0.875rem (14px) | 500 | 1 |

---

## Spacing

**Generous. Always.** The user is cognitively impaired by stress. They need visual rest.

- Minimum padding inside components: 16px
- Section spacing: 64px–96px minimum
- One idea per viewport where possible
- Cards: 24px–32px internal padding
- Between form fields: 24px minimum

---

## Shape

- **Border radius**: 12px for cards, 8px for buttons and inputs, 9999px for badges/chips
- **Rounded everywhere** — no sharp corners. Reduces visual tension.
- **Shadows**: Subtle, warm. Use `0 1px 3px rgba(45, 41, 38, 0.08)` not grey/blue shadows.

---

## Interaction

- **Transitions**: 200ms ease, gentle. Nothing snaps.
- **Hover states**: Subtle warmth shift, not dramatic colour change.
- **Focus rings**: `warmth` colour, 2px offset. Visible, warm.
- **Loading states**: Patient, never urgent. Gentle fade or pulse.

---

## Positioning vs competitors

| Them | Us |
|------|----|
| Teal/blue (clinical calm) | Terracotta/cream (warm calm) |
| Sans-serif everything | Serif headings (literate, human) |
| Pure white backgrounds | Warm cream (#FAF6F1) |
| Stock photography | Clean, warm, typography-led |
| Dense information | Generous breathing space |
| Startup landing page feel | Companion/guide feel |
| Conversion-optimised | Safety-first design |

---

## What this means in practice

The landing page hero should feel like a deep breath — warm background, generous space, serif heading, one clear message. Not a marketing funnel.

The interview steps should feel like a calm, private conversation — one question at a time, warm tones, gentle transitions, reassuring microcopy.

The workspace should feel like a well-organised, warm study — not a dashboard, not a spreadsheet. A place you'd want to sit and work through difficult things.

Every pixel should prove the promise: **Make the hard feel lighter.**
