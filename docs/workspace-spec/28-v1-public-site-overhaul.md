# V1 Public Site Overhaul — Spec 28

**Purpose:** Unify the free public site (V1) with the paid workspace (V2) into one brand, one design system, one coherent product. Reframe V1 as the free tier ("Orientate") of a 4-tier model.

**Depends on:** Spec 27 (visual direction), current V2 component library.

---

## 1. Tier Model

| Tier | Name | What the user gets | Paywall boundary |
|------|------|-------------------|-----------------|
| Free | **Orientate** | Situation assessment, personalised pathway, AI plan, PDF export | No sign-up needed |
| Tier 1 | **Prepare** | Bank connection, document extraction, confirmation flow, full financial picture, spending analysis | Sign-up + payment |
| Tier 2 | **Share & Negotiate** | Everything in Prepare + invite partner/mediator, controlled access, exchange disclosure, track proposals | Upsell from Prepare |
| Tier 3 | **Finalise** | Everything in Share + consent order prep, D81 structuring, court-ready document pack | Upsell from Share |

**Goldilocks default:** Tier 2. Most users need to share their disclosure — preparation alone isn't enough. Tier 1 should feel like it's missing something. Tier 3 should feel premium but not essential for everyone.

---

## 2. Visual Unification

### Design system: V2 everywhere

| Element | Current V1 | Target |
|---------|-----------|--------|
| Background | `cream` #FAF6F1 | `off-white` #F7F8FA |
| Card style | Border + cream bg | Shadow + white bg, 12px radius |
| Primary CTA | `warmth` (burnt orange) | `red-500` #E5484D (Decouple Red) |
| Selected state | Warmth border highlight | Ink inversion (Habito pattern) |
| Text colours | `ink-light`, `ink-faint` | `ink-secondary`, `ink-tertiary` |
| Border radius | `radius-sm` (4px) / `radius-md` (8px) | `radius-card` (12px) |
| Shadows | None (borders separate) | Shadow-based separation |
| Progress bar | Sage/warmth dots + diamonds | Red bar + "N of M" counter |

### Components to migrate

| V1 Component | Action |
|-------------|--------|
| `CardSelect` | Restyle: shadow cards, ink inversion on select, 12px radius |
| `MultiSelect` | Restyle: same as CardSelect but with checkmarks |
| `Button` (primary) | Change `bg-warmth` → `bg-[#E5484D]` (red-500) |
| `Button` (secondary) | Change cream bg → white bg, shadow border |
| `Explainer` | Restyle: shadow card, collapse chevron |
| `MicroMoment` | Keep tone, update text colour to `ink-tertiary` |
| `InterviewLayout` | Replace with V2 layout pattern (off-white bg, centred content) |
| `ConfidenceRow` | Restyle: shadow card, V2 pill colours |

### Warmth accent preservation

The `warmth` palette (#C67D5A) may survive **only** for:
- Educational/empathetic helper text backgrounds (Explainer, MicroMoment containers)
- NOT for buttons, selection states, or structural elements

---

## 3. Header & Footer Unification

### Header (all pages)

| Property | Value |
|----------|-------|
| Height | 64px |
| Background | White with `0 1px 0 #E2E4E9` bottom border |
| Logo | "Decouple" centred, 18px/700/ink |
| Left slot | Hamburger (workspace) or empty (public pages) |
| Right slot (public) | Features, Pricing links + "Log in" button (ink bg, white text, 12px radius) |
| Right slot (workspace) | Bell + Cog + Logout icons |
| Max-width | Full bleed |

### Footer (all pages)

Use the mega footer on all pages. Column content adapts:

| Context | Columns |
|---------|---------|
| Public pages | How it works, About, Legal, Support |
| Workspace | Support (populated), Preparation, Sharing, Finalisation (placeholders) |
| Bottom bar | Privacy · Terms · Cookies · "Your information is private and encrypted" · © Decouple 2026 |

---

## 4. Interview Flow Streamline

### Current: ~28 screens, 10-25 minutes
### Target: ~12 screens, ~5 minutes

### Phase 1: Your Situation (7 screens → 7 screens, ~2 min)

Keep all 7 sub-questions. They're fast, low-friction, and critical for personalisation + safety detection.

**Changes:**
- Add inline "How many?" follow-up when `has_children = true` (saves a separate screen later)
- Restyle all cards to V2 visual system
- Faster transitions between sub-steps (150ms, not 500ms)

### Phase 2: Your Pathway (1 screen, keep as-is)

The personalised journey map is excellent. No changes to content.

**Changes:**
- Restyle to V2 visual system (shadow cards, red progress dots, V2 typography)
- Reframe "How we help" boxes to reference tier names: "This is part of **Prepare**" etc.

### Phase 3: Your Starting Position (4 + 10 screens → 2 screens, ~1 min)

**Cut entirely:**
- 10-domain readiness matrix (bank data makes it obsolete)
- `combined_awareness` question (we're about to show them)
- `reflection` step (fold reactions into plan output)
- Numeric value inputs (bank data provides these)

**Replace with:**

**Screen 1 — "What matters to you?"**
One screen, two groups:

| Group | Options |
|-------|---------|
| Priorities | Fair split · Keep the home · Pension protection · Children's stability · Clean break · Ongoing support |
| Worries | Not enough to live on · Hidden assets · Pension loss · Mortgage affordability · Process cost |

Multi-select both groups. Keep conditional Explainers (pensions, clean break, hidden assets).

**Screen 2 — "What do you know about your partner's finances?"**
NEW question. This is the one thing bank data can't tell us.

| Option | V2 impact |
|--------|-----------|
| I have a good idea | Lower emphasis on Tier 2 upsell |
| I know some things | Moderate Tier 2 value messaging |
| Very little | Strong Tier 2 value: "Invite your partner to share their side" |
| I suspect they're hiding things | Hidden assets worry pathway + strong Tier 2 messaging |

### Phase 4: Your Plan (1 screen, enhance)

- AI-generated assessment (keep)
- Simplified confidence indicator (just self vs partner awareness, not 10 domains)
- PDF download CTA (free tier output)
- Tier service value boxes framed by phase name

### Phase 5: Choose Your Path (replaces next-steps)

**Cut entirely:**
- 5-phase journey breakdown (redundant with pathway)
- 2-tier placeholder cards

**Replace with:**

Goldilocks pricing presentation. 3 cards, Tier 2 highlighted:

```
┌─────────────────┐  ┌─────────────────────┐  ┌──────────────────┐
│   Prepare        │  │  Share & Negotiate   │  │    Finalise       │
│                  │  │  ★ MOST POPULAR      │  │                  │
│ Bank connection  │  │  Everything in       │  │  Everything in   │
│ Auto extraction  │  │  Prepare, plus:      │  │  Share, plus:    │
│ Full financial   │  │                      │  │                  │
│ picture          │  │  Invite partner/     │  │  Consent order   │
│ Spending         │  │  mediator            │  │  prep            │
│ analysis         │  │  Exchange disclosure │  │  D81 statement   │
│                  │  │  Track proposals     │  │  Court-ready     │
│                  │  │  Mediation prep      │  │  document pack   │
│                  │  │                      │  │                  │
│  [Get started]   │  │  [Get started]       │  │  [Get started]   │
└─────────────────┘  └─────────────────────┘  └──────────────────┘
```

Below: "Your free plan is yours to keep. Upgrade whenever you're ready."

---

## 5. Data Bridge: V1 → V2

When a user upgrades from free to paid, their V1 answers pre-seed V2:

| V1 answer | V2 behaviour |
|-----------|-------------|
| `has_children = false` | No children spending category. No child benefit questions. No childcare in spending. No children section in task list. |
| `has_children = true, count = N` | Children spending active. Child benefit cross-check calibrated for N children. Flag if childcare missing. |
| `property_status = 'rent'` | Property confirmation asks about rental, not mortgage/equity. No "family home" language. |
| `property_status = 'own_jointly'` | Property confirmation leads with mortgage detection. |
| `relationship_quality = 'safety_concerns'` | Extra safety messaging in sharing features. Option to share via solicitor only. |
| `financial_control_concerns = true` | Extra guidance on independent financial access. Privacy-safe session handling. |
| `worries includes 'hidden_assets'` | Post-confirmation: "Based on your concerns, here are signals we'd check..." |
| `process_status = 'formally_underway'` | Skip introductory content in task list. |
| `partner_awareness = 'very_little'` | Emphasise Tier 2 value: partner invitation. |
| `partner_awareness = 'hiding'` | Trigger hidden assets pathway in confirmation flow. |

### Implementation

- V1 state stored in `sessionStorage` (current) or `localStorage` (if user saves)
- On workspace entry: read V1 state, merge into workspace initialisation
- V1 answers become read-only config that gates V2 sections

---

## 6. Landing Page Copy

**Updated in this session.** The landing page now anchors to the 4-phase model:

1. Hero: "Financial disclosure, sorted." + "The 28-page Form E nightmare ends here."
2. Four steps: Orientate (free) → Prepare → Share & Negotiate → Finalise
3. Pain point cards: Open Banking, managed comms, court-ready docs, control
4. Final CTA: "Start with a free plan. Upgrade when it makes sense."

**Tone:** Brief, empowering, supportive. No legalese, no fear. Problems acknowledged, solutions concrete.

---

## 7. Site Map (target state)

```
/ ........................... Landing page (4-phase, CTAs)
/features ................... Feature detail page (real content, by phase)
/pricing .................... Pricing page (mirrors /start/choose)

/start ...................... Interview welcome
/start/situation ............ Step 1: 7 situation questions
/start/pathway .............. Step 2: personalised journey
/start/position ............. Step 3: priorities + partner awareness
/start/plan ................. Step 4: AI plan + PDF
/start/choose ............... Step 5: Goldilocks pricing

/workspace .................. V2 workspace (paid tiers)
/workspace/... .............. All workspace sub-routes

/privacy .................... Privacy policy
/terms ...................... Terms of service
/cookies .................... Cookie policy
```

---

## 8. Implementation Priority

| # | Task | Effort | Impact |
|---|------|--------|--------|
| 1 | Visual unification: restyle all V1 components to V2 design system | Medium | High — removes "two products" feel |
| 2 | Header + footer unification | Small | High — instant brand consistency |
| 3 | Interview streamline: cut readiness matrix, add partner awareness | Medium | High — 5 min not 25 min |
| 4 | Data bridge: V1 → V2 state merge | Small | High — personalisation payoff |
| 5 | Pricing page: real Goldilocks layout | Small | Medium — conversion |
| 6 | Features page: real content by phase | Medium | Medium — SEO + trust |
| 7 | PDF export for free plan | Medium | Medium — free tier value |
