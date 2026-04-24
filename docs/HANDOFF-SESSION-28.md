# Session 28 — S-C-U4 disclosure-language audit slice

First slice exercised end-to-end under the session-27 enforcement stack
(hooks + PR template + DoD CI gate). Docs-only by design per 68g C-U4
line 29. Wrap happening in a fresh sub-session on
`claude/session-28-wrap-m7p50` (rebased onto the S-C-U4 tip
`97aaa51`) because a mid-wrap Write truncated silently in the loaded
main session.

## Objective (met)

Close C-U4 by producing (a) the replacement-vocabulary spec Decouple
uses anywhere user-facing, (b) a full audit of every current
occurrence of disclosure-era framing across the session-22 wires and
`src/`, and (c) the slice artefacts the new DoD requires. Downstream
copy flips stay out of scope — they roll into per-surface slices
keyed off the audit catalogue.

## What shipped

**New spec.** `docs/workspace-spec/73-copy-patterns.md` — 344 lines.
- §1 Replacement vocabulary: picture / shared / build / reconcile /
  settle / finalise, plus the 5-phase nav labels. C-U6 folded in as
  §1.7 (consistent with 68g C-U6 Target already pointing at C-U4
  output).
- §2 Banned words: disclose / disclosure / position, with §2.4
  exception policy for legal-process contexts (solicitor/judge test).
- §3 Empty-state verb family: C-U5 Lean-d locked verbatim.
- §4 Tone templates: confirmation / attention / success / error, three
  worked examples each.

**Slice folder.** `docs/slices/S-C-U4-disclosure-audit/` — 5 populated
docs totalling 593 lines.
- `acceptance.md` (94) — AC-1..AC-4 + review log. Review log records
  Amendment 1 (§A1-1..A1-3): workspace-spec scope clarification,
  Minor F-1/F-2/F-3 addressed, Informational F-4/F-5/F-6 deferred.
- `audit-catalogue.md` (177) — 14 session-22 wire surfaces + 45 src/
  hits = 59 raw occurrences → 35 Category-A strings queued for per-
  surface slices. Category-B residuals documented with reasoning.
- `test-plan.md` (153) — T-1..T-5 (vocabulary coverage, banned-word
  scan, empty-state family, tone template application, cross-ref
  integrity). All PASS.
- `security.md` (80) — 13-item checklist. 12 N/A with one-line
  reasoning; item 12 (adversarial) exercised manually, rationale in
  verification.
- `verification.md` (89) — DoD evidence per item, adversarial review
  log, explicit defer rationale for F-4/F-5/F-6.

**Register flips.** `docs/workspace-spec/68g-copy-share-opens.md` —
C-U4, C-U5, C-U6 flipped 🟠 → 🟢 with session-28 Locked appendices
pointing at spec 73 sections.

**Commits (3, on `claude/S-C-U4-disclosure-audit` tip `97aaa51`):**
- `ae7f94b` scaffold slice folder with AC draft (awaiting user review)
- `04cf91c` audit catalogue (AC-1 draft evidence)
- `97aaa51` ship slice — spec 73 + patched slice docs + 68g flips

## 6-item DoD walked

1. **AC met with evidence per AC** — AC-1..AC-4 each reference
   audit-catalogue rows + spec 73 sections. ✓
2. **Tests written and passing** — T-1..T-5 all PASS (doc-tests; no
   code surface this slice). ✓
3. **Adversarial review done; concerns addressed or deferred** — 6
   findings. F-1/F-2/F-3 Minor → Amendment 1. F-4/F-5/F-6
   Informational → explicit defer with reasoning in
   `verification.md`. ✓
4. **Preview deploy verified in-browser** — N/A, docs-only. Flagged
   in verification. ✓
5. **No regression in adjacent slices** — no adjacent slices shipped
   yet; first slice under new stack. ✓
6. **68f/g opens resolved or explicitly deferred** — C-U4/U5/U6 all
   flipped. ✓

13-item security checklist: 12 N/A with one-line reasoning. Item 12
(adversarial) exercised via manual "poke holes" rather than
`/security-review` skill — rationale: docs-only slice, no code diff
for the skill to operate on. Logged in `verification.md`.

## Hook calibration (experiential)

Six observations from the first real-world session under the
session-27 enforcement stack. These are experiential notes, not
action items — all below the threshold for touching the hooks
(moratorium on additions holds until S-F1 ships).

**1. `line-count.sh` "this change" counter inconsistent on new-file
Writes.** Structured-prose first Writes over-report:
- `acceptance.md` first Write: hook reported +400, file is 94 lines.
- `73-copy-patterns.md` first Write: hook reported +641, content
  ~99 lines at that point.

Edits report accurately (§2 Edit +52, §3 Edit +79, §4 Edit +114, six
glyph-flip Edits on 68g at +1/+2). Net-negative Writes report
accurately (security.md template overwrite 145→80 = -65). Hypothesis:
on the new-file path, "this change" conflates with cumulative
tracked+untracked churn, skewing session totals upward. Severity:
cosmetic for humans; doesn't block work. Tune later (post-S-F1).

**2. `read-cap.sh` — clean.** Never misfired this session.

**3. `pr-dod.yml` CI gate — un-exercised on the positive path.**
S-C-U4 was docs-only by design, so no `src/`-touching PR to test the
gate against. The docs-only path should not trigger the gate (it
keys on `src/` touches), but that's untested in anger. Confirm at
PR time and in the first src/-touching PR (S-F1).

**4. `/wrap` slash command — Skill-tool invocation did not surface
`wrap-check.sh` stdout.** Had to run the bash script directly to see
the checklist output. Possible output-capture issue in the Skill
harness for bash-backed slash commands. Worked functionally; cosmetic.

**5. SessionStart hook fires 4+ times per session.** Idempotent
preamble, so not a bug — but "SessionStart" nomenclature is a little
misleading; the hook is really "turn-start-with-context-injection".
Not a functional issue; naming nit for a future pass.

**6. NEW pattern — "write-size silent-timeout".** A single `Write`
tool call with ≳250 novel lines of structured prose, following a
long conversation, can silently truncate: the turn ends without the
tool call emitting anything. Observed twice this session — the
350-line `73-copy-patterns.md` mid-slice and a 200-line
`HANDOFF-28` attempt after a 216-line Read + long history. Mitigation
that worked: skeleton Write (~100 lines) + `Edit`-append per section.
5 tool calls instead of 1, deterministic. Root-cause theory: output-
token budget exhausted while serialising a long tool-call `content`
param, exacerbated by long preceding conversation. Not caught by
current hooks. Candidate for a post-S-F1 "long-write advisor" hook
that warns above a novel-line threshold and suggests the skeleton+
Edit pattern. **Parked under the CLAUDE.md-rules/hook moratorium.**

## Key decisions (recorded in slice artefacts)

1. **S-C-U4 ships as docs-only.** 68g C-U4 decision line 29 mandates
   docs output; replacement in `src/` rolls into per-surface slices.
2. **§2.4 exception policy = "solicitor/judge test".** If a legal
   professional can say this sentence in this legal context, the
   banned-word exemption is granted. Operationalised on a case-by-
   case basis for recommendations.ts rows A17–A20 (Cat-A/B boundary)
   — documented in audit-catalogue as residual risk.
3. **Specs under `docs/workspace-spec/` out of audit scope**
   (Amendment 1 §A1-3). If a passage migrates to UI, spec 73 gates
   at extraction time.
4. **C-U6 folded into C-U4** (spec 73 §1.7), consistent with 68g
   C-U6 Target already pointing at C-U4 output. Single source for
   the full replacement vocabulary.
5. **Adversarial review via manual "poke holes"** rather than
   `/security-review` skill. Rationale: docs-only slice, no code diff
   for the skill to operate on. Logged in `verification.md`.
6. **Chunked-Write pattern parked.** Observation #6 above.
   Formalisation deferred under the CLAUDE.md-rules/hook moratorium.
7. **S-F1 unblocked for session 29** — user confirmed both
   prerequisites at end-of-session 28: psychological readiness +
   Claude AI Design source files available.

## What went well

- First full DoD walk landed cleanly. 6 items + 13-item security
  checklist both workable in practice. No part of the gate felt
  bureaucratic; each line surfaced a useful check.
- Audit-catalogue-first approach paid off — raw inventory (14 wire
  surfaces + 45 src/ hits) produced a clean downstream slice queue
  (35 Cat-A rows) without guesswork.
- Adversarial review surfaced real ambiguities (F-1/F-2/F-3)
  addressed before ship, not after. Amendment 1 is small and
  targeted.
- Skeleton + Edit-append fallback is now a proven pattern for long
  prose documents. Used it twice; worked both times.

## What could improve

- **Process deviation on AC freeze.** AC was approved by user
  informally ("pure docs. yes. feels right") before implementation,
  but formally frozen in `acceptance.md` review log *after*
  implementation had begun. Minor deviation from
  `docs/slices/README.md` workflow step 3. Note, not block — but the
  formal freeze should precede the first commit next slice.
- **Kickoff/brief-rot caught late.** The session-28-wrap-m7p50
  kickoff described artefacts on a branch the harness hadn't fetched
  (`claude/S-C-U4-disclosure-audit`). Local `git branch -a` missed
  it because the fetch config is narrow; `git ls-remote origin` was
  the probe that confirmed. Lesson: when a kickoff's branch claim
  disagrees with `git branch -a`, check `git ls-remote` before
  concluding the work doesn't exist. Amending CLAUDE.md Planning
  conduct would violate the moratorium — capturing here instead.
- **Mid-wrap silent Write truncation forced a sub-session.** Worked
  around cleanly by splitting the wrap into this fresh session, but
  costs a turn-budget round-trip. The long-write advisor hook
  (observation #6) is the durable fix, parked for post-S-F1.

## Open loops (for session 29)

- **Per-surface copy-flip slices.** 35 Cat-A rows in
  `docs/slices/S-C-U4-disclosure-audit/audit-catalogue.md`. Cluster
  candidates visible: e.g. 12 rows in `src/lib/ai/
  recommendations.ts`. These are the downstream consumers of spec
  73 and a natural P1 companion to S-F1.
- **Residual Cat-A/B boundary on `recommendations.ts` A17–A20.**
  Resolve case-by-case via §2.4 at extraction time; documented as
  residual risk, not a blocker.
- **pr-dod.yml positive-path verification.** Gate is un-exercised
  on `src/`-touching PRs. First real exercise lands with S-F1.
- **Hook calibration observations (1-6 above).** No action required
  pre-S-F1; revisit after first engineering slice ships to see which
  reproduce and which were session-specific.

## Session 29 priorities (headline)

**P0 — S-F1 design system tokens.** Unblocked at end of session 28.
Claude AI Design source files confirmed available. Branch off main
per spec 71 §7a single-branch-main (likely
`claude/S-F1-design-tokens`). First `src/`-touching slice; exercises
the DoD CI gate end-to-end for the first time.

**P1 — First downstream copy-flip slice.** Candidate:
`S-B-1-confirmation-questions-copy-flip` — 12 clustered Cat-A rows in
`src/lib/ai/recommendations.ts` per the audit catalogue. Ships spec
73 vocabulary into live code. Can run parallel-or-after S-F1
depending on user priority.

**P2 — Continued hook-calibration observation.** First src/-touching
slice (S-F1) is the canary for the six hook observations above.
Watch for which reproduce.

## Session-final totals

- **Commits on branch (pre-wrap):** 3 (`ae7f94b`, `04cf91c`,
  `97aaa51`).
- **Session churn:** dominated by docs. Spec 73 = 344 new lines;
  slice folder = 593 new lines across 5 files; 68g flips = ~6 small
  edits. No `src/` touches.
- **Hooks triggered in anger:** `line-count.sh` on every Write/Edit
  (see observation #1); `read-cap.sh` clean; `/wrap` invoked via
  slash-command (see observation #4); `pr-dod.yml` N/A (docs-only).
- **CLAUDE.md delta:** none this session. Moratorium honoured.
- **Branches touched:** `claude/S-C-U4-disclosure-audit` (slice,
  pushed, 3 commits). Wrap extends onto
  `claude/session-28-wrap-m7p50` (tracking origin/S-C-U4-… locally;
  pushes to `origin/claude/session-28-wrap-m7p50` per the session
  branch mandate).
- **PRs opened:** none. Per kickoff: no PR unless user explicitly
  asks.
