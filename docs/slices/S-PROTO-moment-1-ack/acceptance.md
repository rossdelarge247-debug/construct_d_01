# S-PROTO-moment-1-ack

**Category:** prototype
**Journey:** inbound from = welcome-tour (standard) / safeguarding-signposting (flagged) · outbound to = moment-2-profiling (or completion-stub)

## Context

Spec 67 §"Gap 1: Data bridge from pre-signup — RESOLVED" L86 defines Moment 1 as: "Moment 1 (immediate post-signup) acknowledges what we already know. Post-signup profiling skips what's answered and goes direct to follow-ups based on pre-signup state."

The screen recaps pre-signup answers as a bullet list, confirms the user's situation, and transitions to Moment 2 profiling. For safety-flagged users, it includes a discreet-mode setup prompt.

## Acceptance criteria

**AC-1: Recap screen renders spec 67 L108-121 copy pattern.**
The page shows a greeting and a bullet list summarising what was collected during pre-signup. Verbatim pattern from spec 67 L109-116:

> "Based on what you told us:
>
>  - Separating, 2 children
>  - Own with a mortgage
>  - You're employed, your ex is self-employed
>  - You know some things about their finances
>
>  Let's go deeper so we can build your picture accurately."

Prototype uses Sarah's scenario data (the default dev-mode persona).

**AC-2: Safety-flag branch renders per spec 67 L100-101 + L118.**
When safety flags are active, the screen shows an additional message per spec 67 L118:

> "[If safety flag:] Setting up your account safely first..."

Plus per spec 67 L100-101:
- `relationship_quality = safety_concerns` → offers discreet mode setup + specialist resources
- `device_private = not_sure` → explains quick-exit feature, offers discreet mode

Prototype toggles between standard and flagged states via a dev-mode switch.

**AC-3: Continue CTA.**
A single primary "Continue" button navigates to the next step (Moment 2 profiling or completion-stub in prototype).

**AC-4: Exit this page component present for flagged state.**
Reuses `ExitThisPage` component from `safeguarding-signposting/_components/` when safety flags are active.

**AC-5: Registry updated.**
`registry.ts` row for `moment-1-ack` updated: status `spec-only` → `prototype-built`, confidence `low-blocked` → `medium`, openQuestions cleared.

## Out of scope

- Real pre-signup state bridge (requires auth + store) — prototype uses static scenario data
- Discreet mode implementation — prototype shows the offer, not the setup flow
- Adaptive Moment 2 routing based on pre-signup answers — future slice
