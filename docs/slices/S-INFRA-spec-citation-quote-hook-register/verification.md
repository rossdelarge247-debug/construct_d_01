# S-INFRA-spec-citation-quote-hook-register — verification

## Slice status

Implemented. Single-line config change to `.claude/settings.json` registering the existing `.claude/hooks/spec-citation-quote.sh` hook in the `PostToolUse:Write|Edit` chain (third entry after `line-count.sh` + `comment-review.sh`).

Net diff: `.claude/settings.json` +6/-1 lines (entry insertion); 2 new slice docs.

## Per-AC evidence

| AC | Status | Evidence |
|---|---|---|
| AC-1 Hook registered in settings.json | ✓ | `jq '.hooks.PostToolUse[0].hooks[] \| .command' .claude/settings.json` lists three commands in order: `line-count.sh` · `comment-review.sh` · `spec-citation-quote.sh`. Matcher `Write\|Edit` matches the hook's self-documented event scope at `.claude/hooks/spec-citation-quote.sh` L2. Timeout `30` matches `comment-review.sh` peer (comparable regex-scan + proximity-window check). |
| AC-2 JSON valid | ✓ | `jq -e . .claude/settings.json` returns exit 0. |
| AC-3 Existing shellspec tests pass | ✓ (CI-gated) | `tests/shellspec/spec-citation-quote.spec.sh` continues to gate hook behaviour on the `shellspec` CI job (`.github/workflows/shellspec.yml`). No new fixture needed for registration-only change. |
| AC-4 No regression to existing PostToolUse hooks | ✓ | Insertion is additive; matcher unchanged; order of `line-count.sh` + `comment-review.sh` unchanged. The harness runs each hook in the array sequentially; adding a third entry doesn't affect the first two. |

## Security checklist (spec 72 §11 — 14 items; infrastructure category, full form)

- [x] Item 1: No secrets, credentials, or sensitive defaults committed (config change only; hook script already on main).
- [x] Item 2: No new env-var reads at runtime introduced. Hook script already checks `SPEC_QUOTE_ENFORCE` per its self-documented opt-in mode flag; that path is unchanged.
- [x] Item 3: No new auth/session boundaries crossed. Hook runs in the Claude Code harness's hook subprocess sandbox; no network, no fs writes outside transcript reporting.
- [x] Item 4: No new RLS or DB-level access introduced. Hook is local-only; no DB.
- [x] Item 5: No new input-validation surface. Hook input is harness-supplied stdin (`tool_name` + `tool_input.{file_path,content,new_string}`), already validated by the existing comment-review.sh sibling pattern.
- [x] Item 6: No new logging-of-sensitive-data risk. Hook emits `systemMessage` with file path + truncated 80-char citation match; no secrets surface in advisories.
- [x] Item 7: No dev/prod boundary crossed. Hook is dev-environment-only (Claude Code harness).
- [x] Item 8: No new third-party dependencies introduced (hook uses `bash` + `jq` + `grep` + `sed`; all present in CI image; matches existing sibling-hook pattern).
- [x] Item 9: No new safeguarding surface introduced.
- [x] Item 10: No new pen-test surface introduced (registration of an existing local hook does not change attackable surface).
- [x] Item 11: Per-slice security review walked (this row).
- [x] Item 12: No new external interfaces (network requests, file I/O, auth boundaries). Hook reads stdin + writes stdout.
- [x] Item 13: No PR-template / DoD-template changes needed for this slice (slice-DoD enforcement is CI-only via pr-dod.yml; config change to .claude/ is non-src/ and exempt).
- [x] Item 14: No PII handling changes; the hook scans markdown content of slice docs + workspace specs, never user data.

## Architectural deferrals

- **Live-mode default flip (`SPEC_QUOTE_ENFORCE=1`).** Stays opt-in at slice ship per hook's self-documented stub-mode default. A future calibration slice can flip the default after a few weeks of stub-mode hit-rate data — same pattern as how `comment-review.sh` started stub and never flipped (proven sufficient as advisory).
- **CI workflow modified-file gate-widening.** Workflow at `.github/workflows/spec-citation-quote.yml` L48 carries the comment: *"Pragmatic scope: gate fires on Added (`A`) files, not Modified (`M`). Pre-existing per-cite citations across the corpus would block every spec-modifying PR otherwise. Future improvement: line-level diff filtering for modified files."* Out of scope here; tracked as a future improvement in that workflow's inline comment.
- **Pairing with `comment-review` hook into a single "author-time discipline" hook.** Two hooks doing regex-scan-on-write feels like a candidate for consolidation, but their patterns + advisories are distinct enough (commenting-anti-patterns vs spec-citation discipline) that merging would create coupling without clear payoff. Kept separate; called out for any future review.

## Definition of Done (infrastructure, full form)

- [x] Item 1: AC met with evidence — this file's per-AC table.
- [x] Item 2: Tests written + passing — existing shellspec tests gate hook behaviour; no new test needed for config-only registration.
- [x] Item 3: Adversarial review done — single-line config edit; surfaces above (JSON validity, hook execution ordering, security checklist). No concerns.
- [N/A] Item 4: Preview deploy verified in-browser — no UI change; this slice is `.claude/`-only.
- [x] Item 5: No regression in adjacent slices — existing two `PostToolUse:Write|Edit` hooks unchanged in matcher, order, command, or timeout.
- [N/A] Item 6: Slice's open 68f/g entries — no 68f/g entries for this infra slice.
