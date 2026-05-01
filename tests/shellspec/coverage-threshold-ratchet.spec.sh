#!/bin/bash
# Tests for scripts/coverage-threshold-ratchet.sh — origin/main-anchored
# ratchet on vitest.config.ts coverage thresholds.

Describe 'coverage-threshold-ratchet.sh'
  SCRIPT="$PWD/scripts/coverage-threshold-ratchet.sh"

  setup() {
    SPEC_TMP="$(mktemp -d -t coverage-ratchet-spec.XXXXXX)"
    REPO="$SPEC_TMP/repo"
    mkdir -p "$REPO"
    cd "$REPO" || return
    git init -q -b main
    git config user.email t@t
    git config user.name t
    git config commit.gpgsign false
  }
  cleanup() {
    cd / || return
    rm -rf "$SPEC_TMP"
  }
  BeforeEach 'setup'
  AfterEach 'cleanup'

  write_config() {
    cat > "$REPO/vitest.config.ts" <<EOF
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
$1
    }
  }
})
EOF
  }

  It 'passes when no thresholds exist on either side'
    write_config ''
    git add . && git commit -qm "no thresholds"
    git checkout -q -b feature
    When call "$SCRIPT" main "$REPO"
    The status should be success
  End

  It 'passes when threshold is raised'
    write_config '      thresholds: { lines: 80 }'
    git add . && git commit -qm "lines 80"
    git checkout -q -b feature
    write_config '      thresholds: { lines: 90 }'
    git add . && git commit -qm "raise to 90"
    When call "$SCRIPT" main "$REPO"
    The status should be success
  End

  It 'fails when threshold is lowered'
    write_config '      thresholds: { lines: 90 }'
    git add . && git commit -qm "lines 90"
    git checkout -q -b feature
    write_config '      thresholds: { lines: 80 }'
    git add . && git commit -qm "lower to 80"
    When call "$SCRIPT" main "$REPO"
    The status should be failure
    The stderr should include 'lines: HEAD=80'
  End

  It 'fails when an existing threshold is removed (treated as 0)'
    write_config '      thresholds: { lines: 90 }'
    git add . && git commit -qm "lines 90"
    git checkout -q -b feature
    write_config ''
    git add . && git commit -qm "remove thresholds block"
    When call "$SCRIPT" main "$REPO"
    The status should be failure
    The stderr should include 'lines: HEAD=0'
  End

  It 'passes when a threshold is added (origin/main absent treated as 0)'
    write_config ''
    git add . && git commit -qm "no thresholds"
    git checkout -q -b feature
    write_config '      thresholds: { lines: 90 }'
    git add . && git commit -qm "add lines 90"
    When call "$SCRIPT" main "$REPO"
    The status should be success
  End

  It 'compares each key independently when multiple thresholds are set'
    write_config '      thresholds: { lines: 90, branches: 80, functions: 75, statements: 85 }'
    git add . && git commit -qm "four thresholds"
    git checkout -q -b feature
    write_config '      thresholds: { lines: 95, branches: 70, functions: 75, statements: 85 }'
    git add . && git commit -qm "raise lines, lower branches"
    When call "$SCRIPT" main "$REPO"
    The status should be failure
    The stderr should include 'branches: HEAD=70'
    The stderr should not include 'lines:'
  End
End
