# Session 8 Handoff

**Date:** 2026-04-13
**Branch:** `claude/decouple-v2-workspace-fX7nK`
**Lines changed:** ~1,800 (docs only, no code changes)
**Type:** Major design/planning session

---

## What happened

Session 8 was the most significant design session yet. Two phases:

**Phase 1: Spec writing** — Produced specs 20-23 covering the bank-first journey redesign, evidence model, confirmation flow tree, and gap analysis.

**Phase 2: Wireframe review** — User shared 30 wireframe screens covering the entire first-time experience from sign-up to populated financial picture. These wireframes introduced a fundamentally new page architecture that replaces the hero panel with a task list home page.

### Documents produced (7 new specs)

| Spec | File | Content |
|------|------|---------|
| 20 | `20-bank-first-journey.md` | Journey redesign: bank connect as primary, upload as secondary |
| 21 | `21-evidence-model.md` | What bank data proves per Form E section, fidelity thresholds |
| 22 | `22-confirmation-flow-tree.md` | Complete decision tree for all 10 Form E sections |
| 23 | `23-post-confirm-gap-summary.md` | Post-confirmation gap analysis: what's proved vs what needs docs |
| 24 | `24-wireframe-spec-part1.md` | Screen-by-screen spec: carousel, task list, bank connection, reveal |
| 25 | `25-wireframe-spec-part2.md` | Screen-by-screen spec: confirmation flow, summaries, financial hub |
| 26 | `26-transitions-animations.md` | Every transition, animation, timing, and micro-interaction |

### CLAUDE.md updated with
- Visual direction: Airbnb colour palette/minimalism + Emma app IxD/forms
- Wireframe fidelity rule: implement as designed, do not reinterpret
- New product rules: "Connect-first", "Show don't ask", "Delight matters"
- Updated key files list with all new specs

---

## Key decisions

1. **Task list replaces hero panel** — The home page is now a three-phase task list (Preparation → Sharing → Finalisation) that starts with one task (connect bank) and grows dynamically. The hero panel's 8-state machine is retired.

2. **Welcome carousel before task list** — 3+ onboarding slides educate before asking. Sets expectations ("80% from bank data alone").

3. **Tink as modal, not redirect** — Bank connection opens Tink Link in an iframe/lightbox overlay. User stays in the app. Requires switching from redirect to drop-in integration mode.

4. **Progressive reveal is the magic moment** — After bank connection, findings appear one by one with staggered animations (screen 3d). This is the centrepiece of the experience.

5. **Section-by-section confirmation within task list** — The Q&A flow is embedded in the task list frame, not a separate flow. Completed sections collapse into an accordion. Each section ends with a mini-summary + gap messages.

6. **Financial summary is a sub-page** — Reached from the task list via "View financial summary". The task list IS the home page.

7. **Source badges on financial summary** — Green "Bank connection" for bank-verified data, orange "Self disclosed" for estimates. Every item shows its evidence source.

8. **Three-session build plan** — Session 9: foundation (types, carousel, task list, bank connection). Session 10: confirmation flow + financial summary. Session 11: dynamic task list + visual polish.

9. **Visual direction set** — Airbnb colour palette and minimalism. Emma app forms and IxD patterns. Spec 18 partially superseded.

---

## What went well

- The wireframe review process worked well — batched screenshots with annotations, studied and noted before synthesis
- The decision to split specs into focused files (journey, evidence, flow tree, wireframe part 1, wireframe part 2, transitions) keeps each readable
- The wireframes faithfully implement the "confirm, don't discover" concept from the earlier specs — the design conversation built on the spec work rather than starting over

## What could improve

- The session was very long — the spec writing + wireframe review + spec encoding was a lot for one session
- Some wireframe screens appear twice with the same annotation (2c-b and 2c-c are identical) — could consolidate
- The section label on the debt question wireframe says "Pension" — likely a wireframe labelling error, noted in the spec

## Wireframes pending from user

- Spending categorisation dialogue (urgent — blocks session 10)
- Spending and debt panels on financial summary
- Children picture flow
- Needs after separation flow
- Share & collaborate screens
- Visual design pass (Airbnb + Emma direction)
