#!/bin/bash
# tdd-first-every-commit.sh — PreToolUse:Bash gate on `git commit`.
#
# Per docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md AC-5 (L50):
# "staged diff must touch tests/ OR match a pure-rename / pure-config /
# pure-visual exemption pattern; blocks otherwise. Every commit, not just
# first."
#
# Scope: src/** changes only. Other paths (docs/, scripts/, .claude/, etc.)
# are out-of-scope for this gate — control-plane changes are governed by
# AC-2 (hooks-checksums + label workflow), not AC-5.
#
# Logic:
#   1. Match `git commit` (precisely; reject git commit-tree etc.).
#   2. Read staged paths via `git diff --cached --name-only`.
#   3. Partition into src/** and non-src.
#   4. Filter src/** through docs/tdd-exemption-allowlist.txt globs.
#   5. If non-exempt src/** present AND no tests/** → block.

set -uo pipefail

INPUT=$(cat || true)
COMMAND=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null || echo "")

if ! [[ "$COMMAND" =~ (^|[[:space:]])git[[:space:]]+commit($|[[:space:]]) ]]; then
  exit 0
fi

ALLOWLIST_FILE="docs/tdd-exemption-allowlist.txt"
ALLOWLIST=()
if [ -f "$ALLOWLIST_FILE" ]; then
  while IFS= read -r line; do
    line="${line%%#*}"
    line="${line#"${line%%[![:space:]]*}"}"
    line="${line%"${line##*[![:space:]]}"}"
    [ -n "$line" ] && ALLOWLIST+=("$line")
  done < "$ALLOWLIST_FILE"
fi

STAGED=$(git diff --cached --name-only 2>/dev/null || true)
[ -z "$STAGED" ] && exit 0

HAS_TESTS=0
NON_EXEMPT_SRC=()

while IFS= read -r path; do
  [ -z "$path" ] && continue
  case "$path" in
    src/*)
      EXEMPT=0
      for pat in "${ALLOWLIST[@]}"; do
        # shellcheck disable=SC2254  # intentional glob match
        case "$path" in
          $pat) EXEMPT=1; break ;;
        esac
      done
      [ "$EXEMPT" -eq 0 ] && NON_EXEMPT_SRC+=("$path")
      ;;
    tests/*)
      HAS_TESTS=1
      ;;
  esac
done <<< "$STAGED"

[ "${#NON_EXEMPT_SRC[@]}" -eq 0 ] && exit 0
[ "$HAS_TESTS" -eq 1 ] && exit 0

{
  echo "BLOCKED: TDD-first gate — src/ changes staged without corresponding tests/ changes."
  echo
  echo "  Non-exempt src/ paths in staged diff:"
  for p in "${NON_EXEMPT_SRC[@]}"; do echo "    - $p"; done
  echo
  echo "  Per docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md AC-5 (L50)"
  echo "  + CLAUDE.md Engineering conventions: TDD where tractable. Write the test"
  echo "  first, then the code to pass it."
  echo
  echo "Actionable alternatives:"
  echo "  - Add tests covering the staged src/ changes and re-stage."
  echo "  - For genuine exemptions (pure-rename / pure-config / pure-visual), add"
  echo "    the file path-glob to docs/tdd-exemption-allowlist.txt and ship in a"
  echo "    PR carrying 'control-change'."
} >&2
exit 2
