# Documentation Index

**Product:** Calm Separation Workspace (working title: Decouple)
**Last updated:** 10 April 2026

---

## Start here

| Document | Purpose |
|----------|---------|
| **[`HANDOFF-SESSION-3.md`](./HANDOFF-SESSION-3.md)** | **Read this first.** Session 3 handoff — pipeline 504 blocker, retro, remaining backlog. |
| [`HANDOFF-SESSION-2.md`](./HANDOFF-SESSION-2.md) | Session 2 handoff — design pivot, hub architecture, AI pipeline rebuild. |
| [`HANDOFF.md`](./HANDOFF.md) | Original handoff document — V2 build state as of 10 April. |

---

## Reading order

For a new session or contributor, read in this order:

### 1. Context and strategy (30 min)

| # | Document | What you'll learn |
|---|----------|-------------------|
| 1 | [`sprint-0/decisions.md`](./sprint-0/decisions.md) | Foundational product decisions, tech stack, build model, release strategy |
| 2 | [`v1/v1-desk-research.md`](./v1/v1-desk-research.md) | The problem space: real user pain, official guidance gaps, practitioner findings, safeguarding |
| 3 | [`v1/v1-research-implications.md`](./v1/v1-research-implications.md) | How research changed the design — safety, screening, content |
| 4 | [`v2/v2-vertical-assessment.md`](./v2/v2-vertical-assessment.md) | V2 scope: Form E mapping, document checklist, pain points, user stories |
| 5 | [`v2/v2-desk-research-form-e.md`](./v2/v2-desk-research-form-e.md) | Form E in practice: section-by-section detail, D81, court reform, real user pain from forums |
| 6 | [`v2/v2-desk-research-pensions-assets.md`](./v2/v2-desk-research-pensions-assets.md) | Pensions (CETV, PODE, DB vs DC, state pension), property, crypto, overseas, inheritance, self-employment |
| 7 | [`v2/v2-desk-research-technology.md`](./v2/v2-desk-research-technology.md) | AI extraction benchmarks, Open Banking, competitors (Armalytix, Splitifi, LEAP), regulatory landscape |
| 8 | [`v2/v2-research-implications.md`](./v2/v2-research-implications.md) | How V2 research changes the design, priorities, and build sequence |

### 2. Design direction (20 min)

| # | Document | What you'll learn |
|---|----------|-------------------|
| 9 | [`v1/v1-visual-design.md`](./v1/v1-visual-design.md) | Design thesis ("warm hand on a cold day"), palette, typography |
| 10 | [`v2/v2-concept.md`](./v2/v2-concept.md) | The Guided Picture Builder — three layers, priority flow, user scenarios |
| 11 | [`v2/workspace-visual-redesign.md`](./v2/workspace-visual-redesign.md) | Bold 2026 direction — layout, colour zones, typography hierarchy |
| 12 | [`v2/v2-decisions.md`](./v2/v2-decisions.md) | Architecture and UX decisions made during V2 build |

### 3. Build specs — current (post-pivot)

These are the active build specs following the V2 design pivot. Read in order.

| # | Document | What it specifies |
|---|----------|-------------------|
| 13 | **[`v2/v2-design-pivot.md`](./v2/v2-design-pivot.md)** | **Read first**: The design pivot — new IA, 3 phases, hub + hero panel, visual direction |
| 14 | **[`workspace-spec/15-discovery-configuration-flow.md`](./workspace-spec/15-discovery-configuration-flow.md)** | **First-time experience**: Discovery dialogue, 10 screens, personalisation logic |
| 15 | **[`workspace-spec/16-hero-panel-flow.md`](./workspace-spec/16-hero-panel-flow.md)** | **Core interaction**: Upload → processing → Q&A → summary state machine |
| 16 | **[`workspace-spec/17-hub-page-states.md`](./workspace-spec/17-hub-page-states.md)** | **Hub page**: Section cards, fidelity labels, all page states |
| 17 | **[`workspace-spec/13-extraction-decision-tree-documents.md`](./workspace-spec/13-extraction-decision-tree-documents.md)** | **AI logic**: What to extract per document type, questions, Form E mapping |
| 18 | **[`workspace-spec/14-extraction-decision-tree-wizard.md`](./workspace-spec/14-extraction-decision-tree-wizard.md)** | **Wizard logic**: Manual input flows per section, question sequences |

### 3b. Build specs — reference (pre-pivot, partially superseded)

These specs preceded the design pivot. Some concepts carry forward; see `v2-design-pivot.md` for supersession details.

| # | Document | Status |
|---|----------|--------|
| — | [`workspace-spec/01-design-system.md`](./workspace-spec/01-design-system.md) | Typography/spacing still relevant, visual direction updating |
| — | [`workspace-spec/02-page-map.md`](./workspace-spec/02-page-map.md) | URL hierarchy needs updating for new IA |
| — | ~~[`workspace-spec/03-sidebar-navigation.md`](./workspace-spec/03-sidebar-navigation.md)~~ | **Superseded** — sidebar replaced by hamburger + left nav |
| — | ~~[`workspace-spec/04-workspace-home.md`](./workspace-spec/04-workspace-home.md)~~ | **Superseded** — replaced by hub page (spec 17) |
| — | ~~[`workspace-spec/05-build-your-picture.md`](./workspace-spec/05-build-your-picture.md)~~ | **Superseded** — original layout |
| — | ~~[`workspace-spec/05b-build-your-picture-revised.md`](./workspace-spec/05b-build-your-picture-revised.md)~~ | **Superseded** — two-tier tabs replaced by hub + hero panel |
| — | [`workspace-spec/06-category-detail.md`](./workspace-spec/06-category-detail.md) | Concept partially relevant — per-section review handled differently now |
| — | [`workspace-spec/07-future-phases.md`](./workspace-spec/07-future-phases.md) | Placeholder approach still valid, phase count changed (5→3) |
| — | [`workspace-spec/08-interaction-patterns.md`](./workspace-spec/08-interaction-patterns.md) | Modal/navigation principles still relevant |
| — | [`workspace-spec/09-upload-review-flow.md`](./workspace-spec/09-upload-review-flow.md) | Upload concept validated; implementation via hero panel now |
| — | [`workspace-spec/10-ai-analysis-flow.md`](./workspace-spec/10-ai-analysis-flow.md) | AI analysis concept still valid |
| — | [`workspace-spec/10b-ai-tiered-questions.md`](./workspace-spec/10b-ai-tiered-questions.md) | Tiered confidence model expressed through hero panel states |
| — | ~~[`workspace-spec/11-ai-question-mapping.md`](./workspace-spec/11-ai-question-mapping.md)~~ | **Superseded** by specs 13 and 14 (decision trees) |
| — | ~~[`workspace-spec/12-two-tier-tabs.md`](./workspace-spec/12-two-tier-tabs.md)~~ | **Superseded** — tabs removed in pivot |

### 4. V1 reference (if working on V1 or understanding the interview)

| Document | Purpose |
|----------|---------|
| [`v1/v1-concept-decision.md`](./v1/v1-concept-decision.md) | Why hybrid approach (interview + workspace) |
| [`v1/v1-flow-spec.md`](./v1/v1-flow-spec.md) | Step-by-step interview specification |
| [`v1/v1-adaptive-output.md`](./v1/v1-adaptive-output.md) | How output scales based on completion |
| [`v1/v1-wireframes.md`](./v1/v1-wireframes.md) | Mermaid flowcharts of user journey |
| [`v1/v1-screen-map.md`](./v1/v1-screen-map.md) | All V1 URLs and page hierarchy |
| [`v1/v1-workspace-iterated.md`](./v1/v1-workspace-iterated.md) | Iterated workspace concept with 8 design principles |
| [`v1/v1-vertical-assessment.md`](./v1/v1-vertical-assessment.md) | V1 planning and scope assessment |

### 5. Service-level context

| Document | Purpose |
|----------|---------|
| [`v2/service-problem-space.md`](./v2/service-problem-space.md) | As-is journey and pain points (V2–V5 scope) |
| [`sprint-0/v0-platform-plan.md`](./sprint-0/v0-platform-plan.md) | V0 technical foundation plan |

---

## Historical / superseded documents

These are retained for context but should not be used as current specifications:

| Document | Superseded by | Why |
|----------|--------------|-----|
| [`v2/V2-HANDOFF.md`](./v2/V2-HANDOFF.md) | [`HANDOFF.md`](./HANDOFF.md) | Earlier handoff (9 April) with some inaccuracies vs current state |
| [`workspace-spec/05-build-your-picture.md`](./workspace-spec/05-build-your-picture.md) | [`workspace-spec/05b-build-your-picture-revised.md`](./workspace-spec/05b-build-your-picture-revised.md) | Original layout replaced by two-tier tab architecture |

---

## Principles

These principles run through every document and every design decision:

1. **Quality first, rigour always** — no shortcuts, no MVPs, no "good enough for now"
2. **Design before code** — concept → review → build. No premature implementation
3. **"A warm hand on a cold day"** — compassionate, professional, never patronising, never clinical
4. **Upload-first, review-by-exception** — system does work, user confirms
5. **One thing at a time** — reduce cognitive load at every step
6. **Safeguarding is not an add-on** — woven into every interaction
7. **The appearance of magic** — technology-maximised, complexity hidden, elegance visible
