Branch Archive — created 2026-04-12
==================================

These files preserve the unmerged work from stale branches before deletion.
Both branches diverged from commit 2fc0a2f (2026-04-10 07:44) and were
never merged into main.

Files
-----
review-handoff-docs-full-diff.patch     — Full patch (41 files, ~9583 insertions)
review-handoff-docs-commit-log.txt      — 24 commits, Apr 10 08:03 → Apr 11 16:05
review-handoff-docs-file-summary.txt    — File-level stat summary

review-handoff-session-4-full-diff.patch — Full patch (6 files, ~486 insertions)
review-handoff-session-4-commit-log.txt  — 3 commits (docs audit, archived specs)

Key files with significant diffs vs main
-----------------------------------------
src/lib/ai/result-transformer.ts  — 541 diff lines (older version, pre-Session 5 fixes)
src/lib/ai/extraction-schemas.ts  — 294 diff lines
src/lib/ai/pipeline.ts            — 79 diff lines
src/types/hub.ts                  — 13 diff lines

To apply a patch later:  git apply --check docs/archive/<file>.patch
To inspect:              git apply --stat docs/archive/<file>.patch
