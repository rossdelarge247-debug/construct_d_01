# S-PROTO-safeguarding-signposting

**Category:** prototype
**Journey:** inbound from = welcome-tour (safety-flagged users) · outbound to = moment-1-ack (or completion-stub)

## Context

Spec 67 §"Gap 12: Safeguarding and privacy" L813-845 specifies a dedicated signposting screen shown before Moment 1 for users who flagged `relationship_quality = safety_concerns` OR `device_private = not_sure` during pre-signup. The screen is honest about what Decouple is and isn't, lists crisis helplines, and offers three exit paths.

The universal baseline (spec 67 L802-809) also specifies a GOV.UK-pattern "Exit this page" quick-escape component on every screen. This slice implements both: the dedicated signposting screen AND the exit-this-page pattern as a reusable component.

## Acceptance criteria

**AC-1: Signposting screen renders spec 67 L815-845 copy.**
The page shows the title "Before we go further — something important", the honest framing paragraph about what Decouple is and isn't, and the closing "What would you like to do?" prompt. Copy is verbatim from spec 67 L818-840:

> "You told us there are safety concerns. We want to be honest about where we fit.
>
> Decouple helps separating couples build a complete settlement — finances, children, housing, and the path through to a legal agreement. It's not a domestic abuse service. For what you might be facing right now, these services are built for exactly that:"

**AC-2: Crisis helplines listed with contact details.**
Six organisations displayed per spec 67 L827-833:
- Women's Aid — 0808 2000 247 (24/7)
- National Domestic Abuse Helpline — 0808 2000 247 (24/7)
- Men's Advice Line — 0808 8010 327
- Refuge — refuge.org.uk
- Surviving Economic Abuse — survivingeconomicabuse.org
- Samaritans — 116 123 (24/7)

Plus the emergency line: "If you're in immediate danger, call 999."

Each phone number is a clickable `tel:` link. Each URL is a clickable `https://` link. All links open in new tabs (external) with `rel="noopener noreferrer"`.

**AC-3: Three CTAs per spec 67 L842-844.**
- "Continue — I'm safe to" — primary action, navigates to Moment 1 (or completion-stub in prototype)
- "Exit to a safe site now" — redirects to BBC News (`https://www.bbc.co.uk/news`) per spec 67 L803
- "Show me more support services" — expands an additional resources section (in prototype: scrolls to an expanded list or shows inline)

**AC-4: Exit-this-page quick-escape component.**
Per spec 67 L803: GOV.UK "Exit this page" component positioned top-right of the screen. Activates on click OR keyboard shortcut (Shift+Shift+Shift triple-press per GOV.UK pattern). Redirects to BBC News. Component is extracted as a reusable `_components/ExitThisPage.tsx` for use on other prototype screens.

**AC-5: Reassurance paragraph after helplines.**
Per spec 67 L836-840:
> "Decouple can still help once you're safe — building your picture privately, preparing the financial side, planning how to move forward. Come back when the time is right."

**AC-6: Registry updated.**
`registry.ts` row for `safeguarding-signposting` updated: status `spec-only` → `prototype-built`, confidence `medium` → `high`, openQuestions cleared.

## Out of scope

- Coercive control detection (spec 47 Levels 1-3) — V1.5 backlog per spec 67 L858
- Mediator-routing as share default — V1.5 backlog
- Adaptive pacing based on safety flags — V1.5 backlog
- Discreet mode setup flow — separate slice
- Backend persistence of safety flags — prototype is static data only
