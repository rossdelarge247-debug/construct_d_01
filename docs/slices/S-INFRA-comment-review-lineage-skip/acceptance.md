# S-INFRA-comment-review-lineage-skip — acceptance

## Status

In progress. Resolves the recurring stub-mode false-positive in
`.claude/hooks/comment-review.sh` where the hook flags `session-N` /
`PR #` / `round-N` references in `docs/HANDOFF-SESSION-*.md` and
`docs/SESSION-CONTEXT.md` — files where the references are the doc's
reason for existing (rolling-window narrative tracking).

## Why

CLAUDE.md §"Comments: WHY not WHAT, no temporal provenance" catalogues
comment anti-patterns explicitly scoped to "persistent comments or
test descriptions":

> - **PR / session / slice provenance** in persistent comments or
>   test descriptions ("PR #56 round 7", "session-56 amendment",
>   "slice S-F1 AC-3") — rot fast; live in PR description.

`docs/HANDOFF-SESSION-N.md` (per-session retro) and
`docs/SESSION-CONTEXT.md` (rolling-window context) are neither code
comments nor test descriptions. Their content IS lineage tracking by
design. The hook's stub-mode regex at `comment-review.sh` L101-102
matches the references anyway, producing a recurring false positive
on every session-wrap and SESSION-CONTEXT refresh.

The `S-INFRA-reviewer-comment` slice already established the carve-out
principle ("Spec §Status footers ARE the right place for lineage
tracking; lineage IS the section's purpose"). This slice extends the
carve-out to two file paths whose entire purpose is lineage tracking.

P4-path-B framing: this is the *durable fix* for the false positive,
chosen over the kickoff's path-A trial of `COMMENT_REVIEW_SPAWN=1`.
Path A required user-provisioned `ANTHROPIC_API_KEY` + the persona to
distinguish lineage-purpose files from production code; path B
suppresses the false positive at the hook entry-point so neither mode
fires on these files.

## Acceptance criteria

### AC-1 — `comment-review.sh` skips `docs/HANDOFF-SESSION-*.md`

When the file path under PostToolUse:Write|Edit matches the glob
`docs/HANDOFF-SESSION-*.md`, the hook MUST exit 0 silently before
either stub-mode regex check or live-mode persona spawn.

**In scope:**
- New case-statement entry in the path skip-list (matches the
  existing patterns' shape: `path-glob) exit 0 ;;`)
- Glob anchored to `docs/` prefix (avoids matching arbitrary
  `HANDOFF-SESSION-*.md` files placed elsewhere)
- Comment block above the new entries explaining the lineage-purpose
  carve-out

**Out of scope:**
- Skipping individual slice `verification.md` / `acceptance.md`
  files (those have §Status footers as legitimate-lineage zones but
  also body content where the catalogue applies; can't blanket-skip)
- Skipping `docs/v2/v2-backlog.md` and other rolling-state docs
  (separate decision; not flagged as recurring-false-positive in the
  carry-over)

### AC-2 — `comment-review.sh` skips `docs/SESSION-CONTEXT.md`

When the file path under PostToolUse:Write|Edit matches the literal
path `docs/SESSION-CONTEXT.md`, the hook MUST exit 0 silently.

**In scope:**
- Literal path match (single-file pattern, no glob needed)
- Same comment-block rationale shared with AC-1

**Out of scope:**
- Anything else.

## Verification

2 new shellspec fixtures in
`tests/shellspec/comment-review.spec.sh`, mirroring the existing
`path skip-list` block:

- **Fixture (HANDOFF):** `docs/HANDOFF-SESSION-67.md` write with body
  containing `session 67 P1a round 2: 5 findings addressed` → hook
  exits 0 with empty stdout
- **Fixture (SESSION-CONTEXT):** `docs/SESSION-CONTEXT.md` write
  with body containing `session 67 wrap: PR #98 merged at 59a39b4`
  → hook exits 0 with empty stdout

Plus existing 17 fixtures remain GREEN.

## Status footer

- Owner: comment-review hook author
- Slice extends: `S-INFRA-reviewer-comment` (skip-list pattern; same
  principle of carving lineage-purpose contexts out of the catalogue)
- DoD checklist applies at slice ship
