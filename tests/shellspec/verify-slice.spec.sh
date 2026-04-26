#!/bin/bash
# S-37-1 (RED) — meta-tests for scripts/verify-slice.sh skeleton-mode contract.
# Asserts intended behaviour: file-presence checks + G17 useful-message exit
# + G15 tmp-fixture isolation. Script does not yet exist; deliberate failures
# pushed to CI to capture run-ID per acceptance.md DoD-7 + G13.

Describe 'verify-slice.sh (skeleton-mode contract)'
  setup() {
    SPEC_TMP="$(mktemp -d -t verify-slice-spec.XXXXXX)"
    SLICE_DIR="$SPEC_TMP/slice"
    mkdir -p "$SLICE_DIR"
  }
  cleanup() {
    rm -rf "$SPEC_TMP"
  }
  BeforeEach 'setup'
  AfterEach 'cleanup'

  It 'exits 0 when slice dir contains acceptance.md + security.md + verification.md'
    : > "$SLICE_DIR/acceptance.md"
    : > "$SLICE_DIR/security.md"
    : > "$SLICE_DIR/verification.md"
    When call scripts/verify-slice.sh "$SLICE_DIR"
    The status should be success
  End

  It 'exits non-zero and names acceptance.md when acceptance.md is missing'
    : > "$SLICE_DIR/security.md"
    : > "$SLICE_DIR/verification.md"
    When call scripts/verify-slice.sh "$SLICE_DIR"
    The status should be failure
    The stderr should include 'acceptance.md'
  End

  It 'exits non-zero and names security.md when security.md is missing'
    : > "$SLICE_DIR/acceptance.md"
    : > "$SLICE_DIR/verification.md"
    When call scripts/verify-slice.sh "$SLICE_DIR"
    The status should be failure
    The stderr should include 'security.md'
  End

  It 'exits non-zero and names verification.md when verification.md is missing'
    : > "$SLICE_DIR/acceptance.md"
    : > "$SLICE_DIR/security.md"
    When call scripts/verify-slice.sh "$SLICE_DIR"
    The status should be failure
    The stderr should include 'verification.md'
  End

  It 'emits useful-message on failure: quotes the rule and lists actionable alternatives (G17 read-cap.sh pattern)'
    : > "$SLICE_DIR/security.md"
    : > "$SLICE_DIR/verification.md"
    When call scripts/verify-slice.sh "$SLICE_DIR"
    The status should be failure
    The stderr should match pattern '*Definition of Done*'
    The stderr should match pattern '*Actionable alternatives*'
  End
End
