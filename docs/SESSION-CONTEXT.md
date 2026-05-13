# SESSION CONTEXT — for the next session start

## Session 95 wrap delta — read this first

Session 95 executed Phase 3 of the density/delight audit (shipped session 94). **Six of seven** audit findings landed across three slices:

| PR | Slice | Status | Closes |
|---|---|---|---|
| #173 | S-PROTO-density-entry-O1 — EntryScaffold on O1 | ✅ merged | F-DEN-02 + F-DEN-03 + F-DEN-04 |
| #174 | S-PROTO-density-question-O1-O6 — WhyWeAsk across O1-O6 | ✅ merged | F-DEN-01 |
| #175 | S-PROTO-delight-spec26-compliance — 3 F-DEL findings | 🟢 open | F-DEL-01 + F-DEL-02 + F-DEL-03 |

Detailed retro in `docs/HANDOFF-SESSION-95.md`.

**Remaining from the audit:** F-OUT-01 + F-OUT-02 + F-OUT-03 (plan output gaps on O7). Per audit L118: *"Batch (output): F-OUT-01 + F-OUT-02 + F-OUT-03 likely ship together as an O7 adaptivity + confidence + reassurance pass."*

## Session 96 priorities — user picks scope

Suggested in rough priority order; user re-orders as they see fit.

1. **Walk PR #175 in the browser** + populate the 6+1 rubric in `verification.md` → merge.
2. **Flip audit-slice rows F-DEN-01..04 + F-DEL-01..03 to IMPLEMENTED** with refs to merged PRs. Small docs-only PR; closes audit loop.
3. **F-OUT-01..03 (plan output gaps)** — the last batch from the density audit. Per audit L118: O7 adaptivity + confidence + reassurance pass. Most substantive remaining scope; O7.tsx is ~640 lines so this slice carries weight.
4. **Tone audit Phase 1** (alternative direction) — next audit lens. Structural review on O1-O8 copy + visual treatments + emotional calibration. Sibling to the density/delight audit but a different concern.
5. **Reset local main early**: `git fetch origin main && git checkout -B main origin/main` before any new work. Local `main` is 50 commits diverged from origin from older session work.

## Authoritative reading order at session 96 start

1. `docs/HANDOFF-SESSION-95.md` — what happened, what shipped, what's open.
2. `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` §F-OUT-01..03 (~25 lines) — if picking priority #3.
3. `docs/workspace-spec/26-transitions-animations.md` §5 (L85-110, ~25 lines) — already wired for delight; revisit only if walking #175 surfaces compliance gaps.
4. `docs/v1/v1-wireframes.md` L40-56 (Tier 1/2/3/4 adaptive output framework) + L267-298 (per-domain confidence + reassurance) — if picking priority #3.

## Session 96 kickoff prompt (paste-ready)

```
Continue from session 95. Read docs/SESSION-CONTEXT.md and
docs/HANDOFF-SESSION-95.md first. Verify branch state:
local main may be 50 commits diverged from origin/main —
git fetch && git checkout -B main origin/main to resync.

Then decide on scope per the session 96 priorities. PR #175
(delight spec-26 compliance) is open for review and needs
a browser walk + 6+1 rubric population. Density/delight audit
F-OUT-01..03 remain as the last unshipped batch.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order, court submission, and post-order implementation. Three positioning pillars per spec 42: shared, evidenced, end-to-end. Tagline: "Decouple — the complete picture."

## Stack

- Next.js 15 (app router), React 19, TypeScript strict
- Tailwind 4 + CSS modules
- Vercel preview deploys per branch; production at `construct-dev.vercel.app`
- Tink for bank connections (creds in Vercel env)
- Anthropic SDK for AI extraction (structured outputs)

## Branch

Session 96 will open its own branch from origin/main per harness convention. Last session's wrap branch: `claude/session-95-wrap`. P3's branch (open PR): `claude/S-PROTO-delight-spec26-compliance`.

## Negative constraints (preserve)

- **Don't add features beyond what the task requires** (CLAUDE.md §Doing tasks).
- **Don't write comments that narrate WHAT** — only WHY when non-obvious (CLAUDE.md §"Coding conduct" §"Comments: WHY not WHAT").
- **Don't reference pre-pivot specs (03-06, 11, 12)** — architecture changed. Active specs are 13+ with the 65-series + 70-series as primary.
- **Don't use `npm audit` or `spec-citation-quote-check` failures as a merge blocker** — both are pre-existing failures unrelated to PR content; admin-bypass is the agreed workflow for prototype slices.

## Scope ceiling

This is **prototype work** under `src/app/dev/proto/pre-signup-interview/**`. Prototype rigour relaxes coverage + TDD-guard + DoD short-form per spec 76 §3. UI/UX rigour remains at production calibration (6+1 walk + prototype-readiness persona). Production graduation to `src/app/**` (outside the proto namespace) is a separate decision — not in scope this session.

## Current pre-signup prototype URL

Production: `construct-dev.vercel.app/dev/proto/pre-signup-interview` (post-merge of #173 + #174 — EntryScaffold + WhyWeAsk live; delight transitions arrive once #175 merges).

PR #175 preview: see the latest Vercel comment on https://github.com/rossdelarge247-debug/construct_d_01/pull/175.
