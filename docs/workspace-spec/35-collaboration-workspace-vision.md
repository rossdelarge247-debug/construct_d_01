# Spec 35 — Collaboration Workspace: Vision & Architecture

**Date:** 15 April 2026
**Status:** Design ideation — ready for wireframing
**Depends on:** V2 disclosure engine (sessions 16-18), desk research (v2/desk-research-collaboration-*)

## The threshold moment

The product stops being a disclosure tool and becomes a resolution tool at one specific moment: **when the second person joins and sees the first person's financial picture.** Everything before that is single-player. Everything after is multiplayer.

## The two-space model

Not four permission layers. Two spaces.

```
┌─ My workspace ──────────────────┐
│ My disclosure, my notes          │
│ My solicitor's comments          │
│ My draft proposals (before send) │
│                                  │
│ Only I control who sees this     │
└──────────────────────────────────┘
         │
         │ I choose to share →
         ▼
┌─ The shared space ──────────────┐
│ Both parties' disclosed data     │
│ Proposals and counter-proposals  │
│ Item-level discussions           │
│ Mediator comments (if invited)   │
│ The agreement as it forms        │
│                                  │
│ Both parties see everything here │
└──────────────────────────────────┘
         ▲
         │ They choose to share →
         │
┌─ Their workspace ───────────────┐
│ (You never see this)             │
└──────────────────────────────────┘
```

**The solicitor** is a guest in your workspace — like sharing a Google Doc with "can comment" access. No special product role needed.

**The mediator** is a participant in the shared space — both parties invited them. They can see and comment on shared items. No special dashboard.

**For V3, ship the two-space model only.** Mediator access to private workspaces (caucus sessions) is a V4 feature.

## Five core features

### 1. The Financial Picture (shared, live, evidenced)
Both parties' financial data in one structured view. Builds progressively — your data first, theirs appears alongside. Auto-matching where both declared the same item. Discrepancies surfaced gently. Every number links to source evidence.

### 2. The Proposal (structured, reasoned, diffable)
System pre-populates from the financial picture. User adjusts with real-time impact calculation. Reasoning required per item. Counter-proposals show only what changed. Deliberate "review before send" moment.

### 3. The Playbook Engine (data-driven reasoning context)
The disclosed financial data becomes an active playbook that drives proposal logic. Inspired by Juro's insight that playbooks shouldn't be static documents but active decision engines embedded in workflows.

**How it works:** When a user builds or reviews a proposal, the system generates reasoning context alongside each item — not advice, but arithmetic + precedent context derived from the disclosed data:

- "Your combined income disparity is 3:1 — spousal maintenance is typically considered in this scenario"
- "Your pension CETV is £180k vs their £12k — pension sharing is common where disparity exceeds £50k"
- "You have primary care of 2 children — courts typically consider this when dividing property"
- "This proposal gives you 72% of net assets — the typical court range for your circumstances is 55-65%"

The V2 signal rules, decision trees, and Form E mappings ARE the playbook. In V3 they don't just drive disclosure — they drive informed negotiation.

**The reasoning split:**
- **Human reasoning** (required per item): "I need the house for stability for the children"
- **System context** (auto-generated, visible to both): property value, mortgage, equity, what the overall split looks like, how it compares to the equal division baseline
- Both visible together on every proposal item. This makes proposals evidence-based, not positional.

### 4. The Progress Board (what's agreed, what's not)
Reframes the emotional experience: "78% agreed, gap is £8,400." Items move from disputed to agreed. Monetary gap shrinks visibly. Persistent — always visible as context.

### 5. The Timeline (the story of what happened)
Every share, view, query, response, proposal, agreement. Timestamps and read receipts. Makes stalling visible. Useful for mediators, solicitors, and courts. Replaces the email thread.

## Five UX patterns (from Juro contract negotiation + our design)

| Pattern | Description | Application |
|---|---|---|
| **Version pipeline** | Horizontal stage navigation, always visible | Disclosure → Combined → Proposal v1 → Counter v1 → Agreed |
| **Internal/external split** | Private workspace vs shared space | My workspace (notes, solicitor) vs shared space (negotiation) |
| **Item-level redlining** | Accept or counter individual items, not whole proposals | Per-item accept/counter on financial items with threaded discussion |
| **Threaded comments on items** | Discussion attached to specific items | "Why is the savings figure £8k?" with evidence links |
| **Deliberate send** | Review-before-send for all outbound communication | Preview what they'll see, confirm, then send |

Plus patterns Juro doesn't need but divorce does:

| Pattern | Why |
|---|---|
| **Progress board** | Emotional reframing — convergence is visible |
| **Evidence linking** | Each number ties to bank data — trust through transparency |
| **Scenario modelling** (V4) | Real-time "if you adjust this, here's the impact" |
| **Escalation path** | "Get help from a mediator" when the tool reaches its limits |

## The user spectrum

| Segment | % | Primary experience | Key feature |
|---|---|---|---|
| **Already aligned** | 25% | Quick: disclose → propose → accept → done | Proposal builder (one round) |
| **Need a nudge** | 35% | 2-4 rounds of proposals, progress board keeps momentum | Progress board + item-level redlining |
| **High conflict** | 25% | Financial picture (evidence reduces arguments) → escalate to human | Evidence linking + escalation path |
| **Won't engage** | 15% | Timeline documents non-engagement for court | Timeline (accountability trail) |

## The mediator question

Most of what mediators do today is administrative (data gathering, scenario arithmetic). The product handles this. The product CANNOT hold emotional space when two humans can't be in a room without escalating.

**V3 model:** Build for the 60% (already aligned + need a nudge) who can self-serve. Route the 25% high-conflict to human support. Document the 15% non-engagement for court.

**The refactored mediator role:** Not eliminated — transformed from "6-hour administrator" to "1-hour expert on the hard bits." The mediator is a surgeon, not a GP.
