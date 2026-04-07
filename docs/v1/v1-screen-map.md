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
├── /start/situation ........... Chapter 1: Your situation + safety screening
├── /start/route ............... Chapter 2: Your route (personalised process clarity)
├── /start/children ............ Chapter 3: Children + parenting (conditional)
├── /start/home ................ Chapter 4: Housing + property (conditional)
├── /start/finances ............ Chapter 5: Financial aims + concerns
├── /start/confidence .......... Chapter 6: Knowns / estimates / unknowns
├── /start/plan ................ Your Plan (adaptive output) + PDF download
└── /start/next-steps .......... Your Next Steps + save workspace prompt

AUTH
└── /auth/save-workspace ....... Magic link / Google sign-in (modal or page)

COMPASS WORKSPACE (post-auth)
└── /workspace ................. Persistent workspace
    ├── Route map sidebar (V1 done, V2+ ahead)
    ├── Workspace cards by section
    ├── Plan summary card
    ├── Next steps card
    └── V2 entry CTA
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
