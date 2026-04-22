# Spec 57 — Flow Map 1: Public Site, Sign Up, Orientation

**Date:** 17 April 2026
**Purpose:** Complete flow and screen inventory for the public-facing and sign-up experience. All entry points, forks, and routes into the product. Feeds AI flow visualisation.

---

## Entry points

| Entry | Source | Lands on |
|---|---|---|
| Direct URL / brand search | organic | Landing page |
| SEO (guides, content) | organic | Content article → CTA to landing |
| Mumsnet / Reddit referral | organic | Landing page |
| Partner referral (mediator/solicitor) | partnership | Landing page with partner parameter |
| Invitation link from ex | in-product | Invitation landing page (not signed up yet) |

---

## Screen 1.1 — Landing page (homepage)

**State:** Not signed in, first visit
**Sections visible:**
- Hero (value prop + CTA)
- How it works (4 steps)
- Cost comparison (vs solicitor)
- Trust signals (3 cards)
- Pricing
- FAQ
- Footer

**Actions:**
- [Get started — free] → 1.2 Sign up
- [How it works] → scroll to section OR 1.6 How it works page
- [Pricing] → scroll OR 1.7 Pricing page
- [Sign in] → 1.3 Sign in
- FAQ accordion → inline expansion
- Footer links → Privacy / Terms / Help pages

**Fork:** Invited user from email link → 1.4 Invitation landing (different experience)

---

## Screen 1.2 — Sign up

**Actions:**
- [Continue with Google] → Google OAuth → 2.1 Orientation
- Email input → [Send magic link] → 1.2a "Check your email"
- [Sign in] link → 1.3 Sign in

**Fork:** Already have account → 1.3 Sign in

---

## Screen 1.2a — Magic link sent

**Actions:**
- Wait for email → click link → auth → 2.1 Orientation
- [Resend link]
- [Use different email]

---

## Screen 1.3 — Sign in

**Actions:**
- [Continue with Google] → resume their session
- Email → [Send link] → 1.3a
- [Create account] → 1.2 Sign up

**Fork after sign in:**
- Returning user with existing case → Their current screen / workspace home
- Returning user — case complete → Archive view
- Returning user — abandoned case → "Welcome back" continuation prompt

---

## Screen 1.4 — Invitation landing (from ex)

**State:** Not signed up yet, arrived via invite email
**Content:** Personalised — "Sarah has shared her financial picture with you"

**Actions:**
- [Create account to view] → 1.2 Sign up (with invitation context preserved)
- [Sign in] → 1.3 (with invitation context)
- [Decline or learn more] → 1.4a Information page

---

## Screen 1.4a — Information for invited party

**Content:** "What is this? What will I see? What are my options?"

**Actions:**
- [I understand, let's get started] → 1.2 Sign up
- [Not now, I'll come back later]
- [I'd rather not use this] → Records the decline, notifies Sarah (neutrally)

**Fork:** After sign-up, invited users route to 3B.1 "View Sarah's picture first" (different onboarding path than cold users)

---

## Screen 1.5 — Static content pages (SEO/trust)

Pages that may exist:
- 1.5a How it works (detailed)
- 1.5b Pricing (detailed)
- 1.5c About Decouple
- 1.5d Privacy policy
- 1.5e Terms of service
- 1.5f FAQ (full)
- 1.5g Blog/guides
- 1.5h Help centre
- 1.5i Safeguarding and safety resources (Women's Aid, etc.)

All link back to 1.1 Landing or 1.2 Sign up.

---

## Orientation Flow (post sign-up, first time)

### Screen 2.1 — Welcome + wellbeing check

**Question:** "First things first — how are you doing?"

**Answers:**
- I'm managing — let's get started → 2.2 Stage router
- I'm finding this really hard → 2.1a Support resources + gentler pacing flag
- I need safety support right now → 2.1b Immediate safety resources

---

### Screen 2.1a — Gentler pacing acknowledgement

**Content:** "We'll take this at your pace. You can stop any time."

**Actions:**
- [Continue] → 2.2 Stage router (with "gentle pacing" flag set)
- [Exit for now]

---

### Screen 2.1b — Safety resources

**Content:** Women's Aid, Men's Advice Line, National DV Helpline, discreet use options

**Actions:**
- [Contact Women's Aid] → external link
- [Talk to someone now — Samaritans] → external
- [Use Decouple discreetly] → 2.1c Discreet mode setup
- [I'm safe, continue] → 2.2 Stage router

---

### Screen 2.1c — Discreet mode setup (optional)

**Actions:**
- Alternative app display name
- Hide from browser history option
- Quick-exit button explanation
- → 2.2 Stage router (with "discreet mode" flag)

---

### Screen 2.2 — Stage router (where are you?)

**Question:** "Before we start, tell us where you are."

**Answers:**
| Answer | Routes to |
|---|---|
| We've decided to separate | 3.1 Profiling (full journey) |
| I'm thinking about separating | 2.3 Exploration mode |
| We're already in the process | 2.4 Import existing |
| We've agreed everything | 2.5 Fast-track to Phase 5 |

---

### Screen 2.3 — Exploration mode

**Content:** "Let's give you a rough picture, no commitment. You can go back any time."

**Path:** Lighter profiling → optional bank connection → financial snapshot (private, never shared)

**Actions:**
- [Build a rough picture] → 3.1 Profiling (light variant)
- [Show me how divorce works financially] → 2.3a Education content
- [Back]

---

### Screen 2.4 — Import existing disclosure

**Content:** "Have a Form E or existing documents? Upload them and we'll structure your picture."

**Actions:**
- [Upload Form E PDF] → 2.4a Parse + review
- [Upload bank statements] → 2.4b Classify
- [Start fresh instead] → 3.1 Profiling

---

### Screen 2.5 — Fast-track: already agreed

**Content:** "Enter your agreed terms and we'll generate the consent order and D81."

**Path:** Skip Phases 1-4, go direct to a structured agreement input form → Phase 5 generation

**Actions:**
- [Continue] → 2.5a Structured agreement input
- [Actually, we haven't agreed everything] → 3.1 Profiling

---

## Forks summary

This flow has 4 main routes emerging from 2.2 Stage router:
1. **Full journey** (decided couples) → Profiling → Bank → Build → Share → Negotiate → Finalise
2. **Exploration** (thinking about it) → Light profiling → Private snapshot
3. **Import** (already in process) → Parse existing → Current state
4. **Fast-track** (agreed) → Straight to Phase 5 generation

Plus the **invited path** (from 1.4) bypasses orientation and goes directly to viewing their ex's picture.

---

## Total screens in this phase: ~18

Ready to use as flow visualisation input. Each screen has clear actions and routes. Forks and conditional flows are explicit.
