# S-INFRA-criterion-2-exceptions-extraction · Verification

## Per-AC verification

| AC | Status | Evidence |
|---|---|---|
| AC-1 · §Exceptions extracted to YAML + persona-prompt summary table | PASS | Verification points 1-8 below — YAML valid; 5 entries; persona table + references present; baseline re-baselined. |
| AC-2 · `scripts/criterion-2-exception-check.sh` + shellspec | PASS | Verification points 1-13 below — script behaviour green for each predicate path; local `shellspec tests/shellspec/criterion-2-exception-check.spec.sh` reports `14 examples, 0 failures`; full suite `139 examples, 0 failures`. |

## Verification commands (static — all green at HEAD)

### AC-1

```sh
[ -f .claude/agents/criterion-2-exceptions.yaml ] && echo "exists"             # expect: exists
python3 -c "import yaml; yaml.safe_load(open('.claude/agents/criterion-2-exceptions.yaml'))"   # expect: exit 0
grep -cE "^  - id: [abcde]$" .claude/agents/criterion-2-exceptions.yaml       # expect: 5
grep -cE '^\s+\| \([abcde]\)' .claude/agents/slice-reviewer.md                # expect: 5
grep -c '\.claude/agents/criterion-2-exceptions.yaml' .claude/agents/slice-reviewer.md   # expect: ≥ 1
grep -c 'scripts/criterion-2-exception-check.sh' .claude/agents/slice-reviewer.md        # expect: ≥ 1
grep -c 'criterion 2 exception' .claude/agents/slice-reviewer.md              # expect: ≥ 5 (preserves §Examples references)
scripts/hooks-checksums.sh --verify                                            # expect: exit 0 (baseline matches)
```

### AC-2

```sh
[ -x scripts/criterion-2-exception-check.sh ] && echo "executable"             # expect: executable
head -1 scripts/criterion-2-exception-check.sh                                 # expect: #!/usr/bin/env bash
wc -l scripts/criterion-2-exception-check.sh                                   # expect: ≤ 100 (currently 80)

printf 'docs/HANDOFF-SESSION-52.md\n'                  | scripts/criterion-2-exception-check.sh | grep -q $'\te\t'                && echo "AC-2.4 OK"
printf 'docs/SESSION-CONTEXT.md\n'                     | scripts/criterion-2-exception-check.sh | grep -q $'\te\t'                && echo "AC-2.5 OK"
printf 'docs/workspace-spec/72c-multi-agent-review-framework.md\n' | scripts/criterion-2-exception-check.sh | grep -q $'\tc\t'    && echo "AC-2.6 OK"
printf 'docs/design-source/welcome-carousel/foo.png\n' | scripts/criterion-2-exception-check.sh | grep -q $'\tc\t'                && echo "AC-2.7 OK"
printf 'src/lib/foo.ts\n'                              | scripts/criterion-2-exception-check.sh | grep -q $'\tnone\t'             && echo "AC-2.8 OK"
printf 'docs/slices/S-INFRA-foo/acceptance.md\n'       | scripts/criterion-2-exception-check.sh | grep -q $'\trequires-judgement\t' && echo "AC-2.9 OK"
printf 'docs/handoffs-archive/HANDOFF-SESSION-12.md\n' | scripts/criterion-2-exception-check.sh | grep -q $'\tnone\t'             && echo "AC-2.10 OK"

shellspec tests/shellspec/criterion-2-exception-check.spec.sh                  # expect: 14 examples, 0 failures
shellspec                                                                       # expect: 139 examples, 0 failures
```

## Local shellspec output (recorded at HEAD pre-PR-open)

```
$ shellspec tests/shellspec/criterion-2-exception-check.spec.sh
Running: /usr/bin/bash [bash 5.2.21(1)-release]
..............

Finished in 0.27 seconds (user 0.23 seconds, sys 0.07 seconds)
14 examples, 0 failures

$ shellspec
Running: /usr/bin/bash [bash 5.2.21(1)-release]
...........................................................................................................................................

Finished in 10.96 seconds (user 5.41 seconds, sys 1.81 seconds)
139 examples, 0 failures
```

## Live recursive re-test

This PR's own auto-review fires on `pull_request:opened`. The slice-reviewer persona reads the new criterion 2 §Exceptions table (replacing the prose sub-clauses) and reviews the diff. The diff itself includes:
- New `scripts/criterion-2-exception-check.sh` — `none` glob match (under `scripts/`, not declared in any path-glob exception).
- New `tests/shellspec/criterion-2-exception-check.spec.sh` — `none` glob match.
- New `.claude/agents/criterion-2-exceptions.yaml` — `none` glob match (`.yaml` not under `docs/workspace-spec/` or `docs/design-source/`).
- Edit to `.claude/agents/slice-reviewer.md` — `none` glob match (control-plane file, not a path-glob exception target).
- Edit to `.claude/hooks-checksums.txt` — `none` glob match.
- New slice docs (this file + `acceptance.md`) — `requires-judgement` per the new pre-filter (`docs/slices/<id>/...` candidate for exception (b), but this slice is in-progress with full ACs, not deferred — LLM correctly classifies as in-scope, NOT an (b) exception).

**Expected outcome:**
- Check-run conclusion: `success` (`approve` derived) — diff is pure refactor with all content declared in this slice's ACs.
- Each diff file traces to AC-1 or AC-2's `In scope` listing; nothing should trigger a scope-creep finding.
- The persona's interpretation of the new table format IS the recursive validation: if the persona can correctly apply the rubric while reading the new structured form, the migration is behaviourally neutral.

If recursive re-test surfaces:
- **Verdict `block` on table-format change** → persona may have misread the new table cells; check finding evidence quotes against table content; if a true regression in rubric clarity, file a follow-up to revert the table to nested prose form.
- **`shellspec` CI check-run fails** → re-run locally with `shellspec tests/shellspec/criterion-2-exception-check.spec.sh`; if green locally, check `.shellspec` config + CI shellspec install version (pinned to 0.28.1).
- **Hooks-checksum drift warning at session-start** → re-run `scripts/hooks-checksums.sh --generate` and commit the updated baseline.

## Diff profile (against `f423322` main)

| File | Net lines | Nature |
|---|---|---|
| `.claude/agents/criterion-2-exceptions.yaml` | +94 | new file (structured source of truth) |
| `scripts/criterion-2-exception-check.sh` | +80 | new file (executable, +x; deterministic pre-filter) |
| `tests/shellspec/criterion-2-exception-check.spec.sh` | +139 | new file (14 test cases) |
| `.claude/agents/slice-reviewer.md` | +9 / -6 net | criterion 2 §Exceptions: prose sub-clauses replaced by 5-row markdown table |
| `.claude/hooks-checksums.txt` | +1 / -1 net | slice-reviewer.md SHA re-baselined |
| `docs/slices/S-INFRA-criterion-2-exceptions-extraction/acceptance.md` | new | this slice's contract |
| `docs/slices/S-INFRA-criterion-2-exceptions-extraction/verification.md` | new | this file |

## Adversarial review pre-flight

Per CLAUDE.md §"Engineering conventions" §"Adversarial review gate": one adversarial pass before commit. Concerns considered:

- **Q: Does the table format lose any rubric content vs the prose form?** A: No — table cells preserve verbatim treatment + carve-out + precedent text. Sample-checked (b) and (e) cells against pre-edit prose: same content, same emphasis (`**...**`), same backtick code spans, same precedent suffix. Persona context-length within ±5%.
- **Q: Could the script's hardcoded globs drift from the YAML's `predicate.paths_in`?** A: Yes if both files are edited independently without cross-checking. Mitigation: YAML head comment documents the alignment convention; parity-check script deferred until first observed drift (per simplicity-first). If drift becomes a maintenance pain point, lift the parity script as a follow-up — it would be ~30L of bash + 2 shellspec cases.
- **Q: Does the new script have an injection surface?** A: Stdin-only input; output is `printf '%s\t%s\t%s\n' "$path" "$id" "$reason"` with literal-format strings; no `eval`, no command-substitution-on-input, no path-as-command interpretation. Path-with-spaces preserved (test case 14). No injection surface.
- **Q: Why does `docs/slices/<id>/{acceptance,verification,security}.md` pass through as `requires-judgement` rather than auto-classify (b)?** A: Exception (b) requires reading the slice's `STATUS:` header AND verifying diff confinement — both content-level checks the LLM is better at than bash regex. Pre-filter intentionally limited to pure-path globs (c, e); content-checks delegated to the persona.
- **Q: Should `.claude/agents/criterion-2-exceptions.yaml` be added to the hooks-checksum baseline (since modifying it could change persona behaviour)?** A: Not in this slice. The YAML is documentation-grade (the persona reads the markdown table, not the YAML; the script doesn't parse the YAML). Modification would be visible in PR review. Tracking expansion can land if the YAML becomes runtime-consumed.

No findings deferred; all concerns either addressed in this slice or explicitly marked Out of scope in `acceptance.md`.

## Definition of Done (per CLAUDE.md §"Engineering conventions" §"Definition of Done")

1. **All ACs met with evidence.** ✅ AC-1 + AC-2 verification points all green at HEAD.
2. **Tests written and passing.** ✅ 14 new shellspec cases; full suite 139 examples, 0 failures.
3. **Adversarial review done; concerns addressed or explicitly deferred.** ✅ See §"Adversarial review pre-flight" above.
4. **Preview deploy verified in-browser if UI.** N/A — no `src/` touched; no UI surface.
5. **No regression in adjacent slices.** ✅ Full shellspec suite green; existing `criterion 2 exception (b)` / `(e)` references in §Examples preserved with letter-id semantics.
6. **Slice's open 68f/g entries resolved or explicitly deferred.** N/A — slice does not touch product surface.

Plus 13-item security checklist (spec 72 §11): N/A for this slice — no auth flow change, no secret handling, no network egress, no PII surface, no RLS path. Stdin-only bash utility + YAML/markdown documentation.
