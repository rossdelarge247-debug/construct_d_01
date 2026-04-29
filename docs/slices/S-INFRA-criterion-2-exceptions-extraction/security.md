# S-INFRA-criterion-2-exceptions-extraction · Security checklist (per spec 72 §11)

Pure extraction of prose rubric (5 sub-clauses) into structured YAML + a deterministic file-glob pre-filter. New files: `.claude/agents/criterion-2-exceptions.yaml` (94L documentation), `scripts/criterion-2-exception-check.sh` (80L bash, stdin-only path-glob classifier), `tests/shellspec/criterion-2-exception-check.spec.sh` (139L test contract). Edited file: `.claude/agents/slice-reviewer.md` (criterion 2 paragraph; +9/-6 net). No `src/` surface, no auth flows, no DB queries, no UI, no third-party SDK, no network egress.

| # | Item | Status | Note |
|---|---|---|---|
| 1 | Data classification | N/A | No data flows in diff. |
| 2 | Env vars / secrets handling | N/A | Script reads stdin only; no env var access; YAML is static documentation. |
| 3 | Auth / session boundaries | N/A | No auth surface. |
| 4 | RLS coverage | N/A | No DB queries. |
| 5 | Input validation at system boundaries | PASS | Script reads paths from stdin via `IFS= read -r line`; trims trailing whitespace; skips blank lines; classifies via bash extglob/globstar `[[ path == glob ]]` matching (no `eval`, no command-substitution-on-input). Output uses literal-format `printf '%s\t%s\t%s\n' "$path" "$id" "$reason"` — paths are echoed verbatim, never interpreted. Test case 14 covers space-bearing paths. |
| 6 | Logging — no secrets / PII | PASS | Script outputs only `<path>\t<id>\t<reason>` per input line; no input echoing beyond the path itself; no env capture. `set -euo pipefail` ensures errors exit early. |
| 7 | Dev/prod boundary | N/A | Script behaviour identical in all environments; no env-mode branching. YAML is static. |
| 8 | Third-party SDK handling | N/A | Pure bash builtins (`set`, `printf`, `[[`, `read`, `local`, `return`); no `jq`, no curl, no external dependency. |
| 9 | Safeguarding signposting | N/A | No user-facing copy. |
| 10 | Pen-test surface change | NEUTRAL | New attack surface: "what can an attacker do by feeding malicious paths to `criterion-2-exception-check.sh`?" Threat model: (a) attacker-controlled diff path string with shell metacharacters (`;`, `$()`, backticks, `&&`) → script's `[[ ... == glob ]]` matching is non-evaluative; `printf '%s\t...'` emits literal characters; no command-substitution path. (b) Path-traversal-shaped inputs (`../../etc/passwd`) → no filesystem access in the script; classification is path-string-only. (c) Glob-injection via deliberate path crafting → globs are hardcoded in the script (not user-supplied); attacker cannot widen the match set. **Net: NO new pen-test surface.** Documentation extraction; no executable surface widened beyond stdin parsing. |
| 11 | Per-slice security DoD covered | PASS | This checklist is the per-slice DoD. |
| 12 | YAML-as-runtime-config attack surface | NEUTRAL | The new YAML at `.claude/agents/criterion-2-exceptions.yaml` is documentation-only at this slice's ship — neither the persona prompt (which reads the markdown table inline) nor the script (which hardcodes globs) parses the YAML at runtime. Therefore an attacker who modified the YAML would not change runtime behaviour — only documentation. **However:** if a future slice wires the YAML for runtime parsing, the YAML becomes attacker-modifiable input and needs schema validation + path-glob sandboxing. Documented in `acceptance.md` §"Out of scope". |
| 13 | Audit trail | PASS | All changes captured in PR diff + this slice's `acceptance.md` + this file + `verification.md`. Hooks-checksum baseline updated for `slice-reviewer.md` SHA. |

**Net: 3 PASS / 2 NEUTRAL / 8 N/A / 0 FAIL.** No new attack surface; pre-filter is non-evaluative path-string matching only.

## Extraction-vs-inline parity argument

The risk of extraction is "did the YAML + persona table preserve the prose §Exceptions semantics verbatim?" Mitigations:

1. **Verbatim preservation in the persona table.** The `slice-reviewer.md` table cells preserve the full treatment + carve-out + precedent text from the original prose — same emphasis (`**...**`), same backtick code spans, same precedent suffix. Sample-checked (b) and (e) cells against pre-edit prose (lines 13 + 16 in `f423322`-base): same content, no semantic drift.
2. **Letter-id stability.** Existing references elsewhere in `slice-reviewer.md` (lines 133, 152, 157, 180, 190, 195) use `(b)` / `(e)` letter ids. The new table preserves those ids in the first column. Existing §Examples cross-references stay valid.
3. **Script behaviour scope-limited.** The script implements ONLY the deterministic file-glob predicates (ids `c` + `e`). Ids `a` (incidental scaffolding) + `b` (deferred-slice scope-marker, requires reading `STATUS:` header) + `d` (within-PR revert, requires diff-cumulative semantics) pass through as `requires-judgement`. The persona makes the final call on these — preserving the exact judgement surface that pre-extraction prose specified.
4. **14-case shellspec test contract.** Covers each path-glob predicate's positive path + anchored-glob non-match (e.g. `docs/handoffs-archive/HANDOFF-SESSION-12.md` → `none`, ensuring exception (e) doesn't widen to non-`docs/`-root paths) + multi-file order preservation + edge cases (blank lines, empty stdin, space-bearing paths).
5. **Recursive auto-review on this PR.** The persona reads the new criterion 2 §Exceptions table format and reviews this very diff. If the migration introduced a rubric-clarity regression, the persona's findings on the diff would surface it (e.g. mis-classifying the new YAML or new shellspec file as undeclared scope).

Acceptable extraction.
