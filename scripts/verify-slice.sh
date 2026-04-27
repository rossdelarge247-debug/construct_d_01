#!/usr/bin/env bash
# verify-slice.sh — slice Definition-of-Done verification workhorse.
#
# S-37-2 SKELETON MODE: file-presence checks only. Verifies every slice
# directory contains the three Definition-of-Done artefacts:
#   - acceptance.md  (rules + AC table)
#   - security.md    (spec 72 §11 evidence)
#   - verification.md (per-AC evidence + run-IDs)
#
# Full-mode impl (lcov coverage parser, ESLint denial check, leak scan,
# spec-72 §11 13-item-checklist presence) lands in S-37-3 (session 38).
#
# Usage: scripts/verify-slice.sh <slice-dir>
# Exit:  0 on all artefacts present, 1 on missing, 2 on usage error.
#
# Per docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md AC-1 +
# G17 useful-message exit pattern (matches .claude/hooks/read-cap.sh).

set -euo pipefail

SLICE_DIR="${1:-}"

if [ -z "$SLICE_DIR" ]; then
  echo "verify-slice.sh: usage: $0 <slice-dir>" >&2
  exit 2
fi

if [ ! -d "$SLICE_DIR" ]; then
  echo "verify-slice.sh: slice directory not found: $SLICE_DIR" >&2
  exit 2
fi

REQUIRED_FILES=(acceptance.md security.md verification.md)
MISSING=()

for f in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$SLICE_DIR/$f" ]; then
    MISSING+=("$f")
  fi
done

if [ "${#MISSING[@]}" -eq 0 ]; then
  exit 0
fi

{
  echo "DENIED: slice ${SLICE_DIR} is missing required Definition of Done artefact(s):"
  echo
  for f in "${MISSING[@]}"; do
    echo "  - $f"
  done
  echo
  echo "  Per docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md AC-1 + DoD:"
  echo "  every slice must carry acceptance.md (rules + AC table) + security.md"
  echo "  (spec 72 §11 evidence) + verification.md (per-AC evidence + run-IDs)."
  echo
  echo "Actionable alternatives:"
  echo "  - Create the missing artefact(s) from docs/slices/_template/ as starting point."
  echo "  - If this slice predates the DoD requirement, document the exemption in"
  echo "    acceptance.md §Pre-AC-1 exempt commits and re-run."
  echo "  - Verify the slice directory path is correct: ${SLICE_DIR}"
} >&2

exit 1
