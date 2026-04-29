# S-INFRA-AC-5-examples-migration · Verification

## AC-1 · §Example JSON output blocks migrated to Conv Comments schema

| AC | Status | Evidence |
|---|---|---|
| AC-1 | PASS | Verification points 1-8 below all green pre-PR-open. Point 9 (live recursive re-test) gated on this PR's auto-review run. |

### Verification commands (static)

```sh
# 1-2: no remaining verdict/severity in §Examples
grep -c '"verdict":' .claude/agents/slice-reviewer.md .claude/agents/acceptance-gate.md .claude/agents/ux-polish-reviewer.md
# expect: 0 per file
grep -c '"severity":' .claude/agents/slice-reviewer.md .claude/agents/acceptance-gate.md .claude/agents/ux-polish-reviewer.md
# expect: 0 per file

# 3: summary fields present in §Examples + §Output format
grep -c '"summary":' .claude/agents/slice-reviewer.md  # expect ≥ 6 (5 examples + 1 schema)
grep -c '"summary":' .claude/agents/acceptance-gate.md  # expect ≥ 3 (2 examples + 1 schema)
grep -c '"summary":' .claude/agents/ux-polish-reviewer.md  # expect ≥ 3 (2 examples + 1 schema)

# 4: label fields present in non-empty-findings examples
grep -c '"label":' .claude/agents/slice-reviewer.md  # expect ≥ 3

# 5-6: deferred-migration disclaimer removed
grep -c "Note on §Examples below" .claude/agents/slice-reviewer.md .claude/agents/acceptance-gate.md .claude/agents/ux-polish-reviewer.md
# expect: 0 per file
grep -c "S-INFRA-AC-5 §Out of scope" .claude/agents/slice-reviewer.md .claude/agents/acceptance-gate.md .claude/agents/ux-polish-reviewer.md
# expect: 0 per file

# 7: clean checksums baseline
bash scripts/hooks-checksums.sh --verify  # expect: exit 0

# 8: file size ≤ 300 (Option C)
wc -l .claude/agents/slice-reviewer.md  # expect ≤ 300
```

### Live re-test (recursive)

This PR's own auto-review fires on `pull_request:opened` against `main`. The slice-reviewer persona reads its own (now-migrated) §Examples + the §Output format and emits a finding-shape JSON for this very diff.

Expected check-run conclusion: `success` (`approve`) — diff is purely §Examples-block edits + §Note removal + slice-docs creation; no scope-creep, no AC-gap, no security surface.

If recursive re-test surfaces `parse-failed`, that signals a regression in the workflow's verdict-derivation arithmetic introduced by PR #41. Remediation: queue verdict-derivation script extraction (P3 carry-over) sooner.

## DoD per CLAUDE.md §Engineering conventions

- [x] **AC met with evidence** — verification points 1-8 (static); point 9 (live) recursive on this PR.
- [N/A] **Tests written + passing** — Per CLAUDE.md §"Don't write file-content assertions for logic slices" — this slice is pure-prose pedagogical migration with no logic surface. Static grep evidence is appropriate.
- [x] **Adversarial review done** — Pre-PR-open author reasoning over 9 Example→schema mappings: each non-empty-findings finding's `label` + `blocking` derived from the persona's deterministic label-assignment table (no judgement-call mappings). Empty-findings examples (Examples 2/3/5 of slice-reviewer; Example 2 of ux-polish; not applicable to acceptance-gate) just gain `summary` field; no `findings[]` shape change.
- [N/A] **Preview deploy verified in-browser** — No UI surface.
- [x] **No regression in adjacent slices** — `git diff origin/main` shows only the 3 persona files + `.claude/hooks-checksums.txt` re-baseline + slice docs. No workflow files, no other personas, no spec files touched.
- [x] **Slice's open 68f/g entries resolved or deferred** — none blocked.

## Preview-deploy verification

N/A — no UI surface.
