# S-INFRA-comment-review-lineage-skip — verification

## Status

✅ MET (slice ship state).

## AC table

| AC | Description | Status | Evidence |
|---|---|---|---|
| AC-1 | `comment-review.sh` skips `docs/HANDOFF-SESSION-*.md` | ✅ MET | `.claude/hooks/comment-review.sh` L78 adds `docs/HANDOFF-SESSION-*.md) exit 0 ;;` to the path skip-list case statement, after the existing `tests/personas/synthetic/*` entry; preceded by a comment block (L70-77) explaining the lineage-purpose carve-out. Verified by the new HANDOFF fixture in the `path skip-list` describe block. |
| AC-2 | `comment-review.sh` skips `docs/SESSION-CONTEXT.md` | ✅ MET | `.claude/hooks/comment-review.sh` L79 adds `docs/SESSION-CONTEXT.md) exit 0 ;;` (literal path; single-file pattern) directly after the AC-1 entry. Verified by the new SESSION-CONTEXT fixture. |

## Test results

- `shellspec tests/shellspec/comment-review.spec.sh` — **19/19 GREEN**
  (was 17/17 pre-PR; +2 from new fixtures)

## Surface

- `.claude/hooks/comment-review.sh` — +9 lines (2 new case entries
  + 6-line rationale comment block + 1 blank line spacer)
- `tests/shellspec/comment-review.spec.sh` — +14 lines (2 new
  fixtures in the `path skip-list` describe block)
- `docs/slices/S-INFRA-comment-review-lineage-skip/acceptance.md`
  — new (~95 lines)
- `docs/slices/S-INFRA-comment-review-lineage-skip/verification.md`
  — this file

## Sign-off

Slice ships the skip-list extension. Both stub mode (default) and
live mode (`COMMENT_REVIEW_SPAWN=1`) are unaffected by the change
for files outside the new patterns; both modes now silently no-op on
HANDOFF + SESSION-CONTEXT writes.

The kickoff's path-A trial of `COMMENT_REVIEW_SPAWN=1` (live mode
expected to distinguish lineage-purpose files from production code)
remains available for users who provision local `ANTHROPIC_API_KEY`,
but is no longer required to suppress this specific false positive.

## Status footer

- Created: at slice ship
- AC scope locked at acceptance.md authoring; impl matches AC text
- Sibling slice: `S-INFRA-reviewer-comment` (established the
  catalogue + carve-out principle this slice extends)
