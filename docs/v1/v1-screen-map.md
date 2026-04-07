# V1 Screen Map and State Model

## Screen map

```
PUBLIC PAGES
├── / ........................... Landing page
│   ├── Hero + CTA "Get started"
│   ├── How it works (3-4 steps)
│   ├── Trust signals
│   └── Footer (privacy, terms, cookies links)
├── /features .................. Stub
├── /pricing ................... Stub
├── /privacy ................... Stub
├── /terms ..................... Stub
└── /cookies ................... Stub

GENTLE INTERVIEW (pre-auth, anonymous session)
├── /start ..................... Welcome + reassurance
├── /start/situation ........... Step 1: Your situation + safety screening
├── /start/route ............... Step 2: Your route (personalised process clarity)
├── /start/children ............ Step 3: Children + parenting (conditional)
├── /start/home ................ Step 4: Housing + property (conditional)
├── /start/finances ............ Step 5: Financial aims + concerns
├── /start/confidence .......... Step 6: Knowns / estimates / unknowns
├── /start/plan ................ Step 7: Your Plan (adaptive output) + PDF download
├── /start/next-steps .......... Step 8: Your Next Steps (action roadmap)
├── /start/next ................ Step 9: What comes next (service overview + tiers)
└── /start/save ................ Step 10: Save your workspace (auth conversion)

AUTH
└── /auth/save-workspace ....... Magic link / Google sign-in (modal or inline)

COMPASS WORKSPACE (post-auth)
└── /workspace ................. Persistent workspace
    ├── Journey sidebar (process phases, not interview steps)
    │   ├── ✓ Understand your situation (V1 done)
    │   ├── ● Build the full picture (active phase)
    │   │   ├── Finances
    │   │   ├── Family arrangements
    │   │   ├── Evidence & documents
    │   │   └── Gaps & confirmation
    │   ├── ○ Prepare for disclosure
    │   ├── ○ Share & negotiate
    │   ├── ○ Reach agreement
    │   └── ○ Prepare court documents (Enhanced tier)
    ├── Main area: task list + starting position cards + confidence map
    ├── Plan summary (always accessible)
    └── Active phase tasks and progress
```

## Session state model

```
Session
├── type: anonymous | authenticated
├── session_token (anonymous)
├── user_id (authenticated)
├── case_id
└── created_at

Case
├── id
├── status: in_progress | plan_generated | workspace_active
├── safeguarding_flags: []
├── route_adjustments: []
├── readiness_tier: full | partial | thin | not_ready
├── plan_generated: boolean
├── pdf_generated: boolean
└── created_at
```

## Chapter state model

```
ChapterProgress (per case)
├── situation:  not_started | in_progress | completed | skipped
├── route:      not_started | generated
├── children:   not_started | in_progress | completed | skipped | not_applicable
├── home:       not_started | in_progress | completed | skipped | not_applicable
├── finances:   not_started | in_progress | completed | skipped
└── confidence: not_started | in_progress | completed | skipped
```

## Card state model

```
WorkspaceCard
├── id
├── case_id
├── section: situation | route | children | home | finances | confidence | plan | next_steps
├── card_type: info | aim | concern | arrangement | unknown | summary | action
├── title
├── content (structured)
├── confidence_state: known | estimated | unsure | unknown
├── follow_up_state: fine_for_now | confirm_later | priority_to_confirm | resolved
├── source_chapter
├── editable: boolean
├── created_at
└── updated_at
```

## Safeguarding state model

```
SafeguardingState (per case)
├── risk_signals_detected: boolean
├── flags: [safety_concern | high_conflict | vulnerability_indicator]
├── route_adjustments: [suppress_collaboration | flag_mediation_suitability | surface_resources]
├── resources_surfaced: boolean
└── assessed_at
```

## Plan state model

```
PlanState (per case)
├── readiness_tier: full | partial | thin | not_ready
├── tier_inputs:
│   ├── chapters_completed: number
│   ├── chapters_skipped: number
│   ├── confidence_known_estimated: number
│   ├── confidence_unsure_unknown: number
│   └── core_domains_with_substance: number
├── plan_data: structured JSON
├── plan_generated_at
├── pdf_storage_path
└── last_updated
```

## Component model

### Layout
- `InterviewLayout` — single-column, full-focus for the guided journey
- `WorkspaceLayout` — sidebar route map + main content area (Compass)
- `WorkspaceLayoutMobile` — progress bar top + stacked content

### Interview components
- `WelcomeScreen` — entry point with value proposition
- `InterviewStep` — wrapper for each chapter (progress indicator, back/skip controls)
- `InterviewQuestion` — single question with context and input
- `MicroMoment` — reassurance/acknowledgement message between steps
- `ProgressBar` — subtle progress indicator across the interview

### Input components
- `CardSelector` — visual card-based single/multi select
- `ConfidenceToggle` — Known / Estimated / Unsure / Unknown selector
- `ExpandableExplainer` — "Why we're asking this" progressive disclosure
- `OptionalTextInput` — free text with "skip" affordance
- `SkipButton` — always available, never punitive

### Workspace components
- `RouteMap` — persistent sidebar showing journey progress
- `RouteMapMobile` — collapsed progress bar with drawer
- `WorkspaceCanvas` — card grid/list grouped by section
- `WorkspaceCard` — the core unit with confidence chip and edit
- `CardSection` — groups cards by topic
- `ConfidenceChip` — visual Known/Estimated/Unsure/Unknown indicator
- `FollowUpBadge` — Fine for now / Confirm later / Priority to confirm

### Output components
- `PlanSummary` — generated plan view (adaptive by tier)
- `NextStepsCard` — prioritised action list
- `PdfDownloadButton` — triggers PDF generation
- `SaveWorkspacePrompt` — auth conversion modal

### Route components
- `RouteTimeline` — visual timeline of the user's likely process
- `RouteStage` — individual stage on the timeline with expandable detail
- `RouteExplainer` — expandable context panel (MIAM, mediation, etc.)
