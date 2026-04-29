#!/usr/bin/env bash
# criterion-2-exception-check.sh — deterministic pre-filter for criterion 2
# §Exceptions in .claude/agents/slice-reviewer.md.
#
# Reads a list of changed files (one per line) on stdin. For each file, emits
# one tab-separated line on stdout:
#
#   <path>\t<exception-id|none|requires-judgement>\t<reason>
#
# Where <exception-id> is one of `c` (spec-design content) or `e` (CLAUDE.md
# session-wrap docs) — the only deterministic file-glob predicates in
# .claude/agents/criterion-2-exceptions.yaml. Files matching neither glob emit
# `none`. The non-deterministic exceptions ((a) incidental scaffolding, (b)
# deferred-slice scope marker, (d) within-PR revert) emit `requires-judgement`
# for any file path; the LLM persona makes the final call.
#
# Keep these globs in sync with `predicate.paths_in` in
# .claude/agents/criterion-2-exceptions.yaml (ids c + e). Parity-check script
# deferred until first observed drift — see that YAML's head comment.
#
# Test contract: tests/shellspec/criterion-2-exception-check.spec.sh.

set -euo pipefail

# Glob lists are kept verbatim-aligned with the YAML's predicate.paths_in arrays
# for ids c and e. The parity script enforces the alignment.
glob_match() {
  # Usage: glob_match <path> <glob1> [<glob2> ...]
  # Returns 0 if path matches any glob (bash extglob), 1 otherwise.
  local path="$1"; shift
  local glob
  for glob in "$@"; do
    # shellcheck disable=SC2053
    if [[ "$path" == $glob ]]; then
      return 0
    fi
  done
  return 1
}

classify_path() {
  local path="$1"

  # Exception (e): CLAUDE.md-mandated session wrap docs.
  if glob_match "$path" \
      'docs/HANDOFF-SESSION-*.md' \
      'docs/SESSION-CONTEXT.md'; then
    printf '%s\t%s\t%s\n' "$path" 'e' 'matches docs/HANDOFF-SESSION-*.md or docs/SESSION-CONTEXT.md (CLAUDE.md wrap-doc glob)'
    return
  fi

  # Exception (c): spec-design content.
  if glob_match "$path" \
      'docs/workspace-spec/*' \
      'docs/workspace-spec/**' \
      'docs/design-source/*' \
      'docs/design-source/**'; then
    printf '%s\t%s\t%s\n' "$path" 'c' 'matches docs/workspace-spec/** or docs/design-source/** (spec-design glob)'
    return
  fi

  # docs/slices/*/acceptance.md MAY be exception (b) but the predicate's
  # content-confinement check requires LLM judgement; pass through.
  if [[ "$path" == docs/slices/*/acceptance.md ]] \
     || [[ "$path" == docs/slices/*/verification.md ]] \
     || [[ "$path" == docs/slices/*/security.md ]]; then
    printf '%s\t%s\t%s\n' "$path" 'requires-judgement' 'docs/slices/<id>/{acceptance,verification,security}.md — exception (b) candidate; LLM determines'
    return
  fi

  printf '%s\t%s\t%s\n' "$path" 'none' 'no deterministic exception path-glob match'
}

shopt -s extglob globstar nullglob

while IFS= read -r line; do
  # Trim trailing whitespace; skip blank lines.
  line="${line%"${line##*[![:space:]]}"}"
  [[ -z "$line" ]] && continue
  classify_path "$line"
done
