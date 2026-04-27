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

# S-38-2 (RED) — full-mode contract: spec 72 §11 13-item checklist presence in security.md.
# Each box (1..13) must appear in security.md as either a heading (## N. Title)
# or a table row (| N | Title | ...). Two-form acceptance per real-slice variation:
# v3a uses table-row form; S-F7-α uses section-heading form. AC-1 (acceptance.md L46):
# "spec 72 §11 13-item checklist presence in security.md".
#
# Tests RED against skeleton-mode (which only checks file-presence, not §11 content).

Describe 'verify-slice.sh (full-mode §11 contract)'
  setup() {
    SPEC_TMP="$(mktemp -d -t verify-slice-spec.XXXXXX)"
    SLICE_DIR="$SPEC_TMP/slice"
    mkdir -p "$SLICE_DIR"
    : > "$SLICE_DIR/acceptance.md"
    : > "$SLICE_DIR/verification.md"
  }
  cleanup() {
    rm -rf "$SPEC_TMP"
  }
  BeforeEach 'setup'
  AfterEach 'cleanup'

  write_table_form_security() {
    {
      printf '# Security\n\n## §11 checklist\n\n'
      printf '| Box | Item | Status | Notes |\n|---|---|---|---|\n'
      for i in 1 2 3 4 5 6 7 8 9 10 11 12 13; do
        printf '| %s | item-%s | n/a | placeholder |\n' "$i" "$i"
      done
    } > "$SLICE_DIR/security.md"
  }

  write_heading_form_security() {
    {
      printf '# Security\n\n'
      for i in 1 2 3 4 5 6 7 8 9 10 11 12 13; do
        printf '## %s. item-%s\n\nplaceholder\n\n' "$i" "$i"
      done
    } > "$SLICE_DIR/security.md"
  }

  It 'exits non-zero when security.md is missing the §11 checklist entirely'
    : > "$SLICE_DIR/security.md"
    When call scripts/verify-slice.sh "$SLICE_DIR"
    The status should be failure
    The stderr should match pattern '*§11*'
  End

  It 'exits 0 when security.md carries all 13 §11 boxes in table-row form (matches v3a slice)'
    write_table_form_security
    When call scripts/verify-slice.sh "$SLICE_DIR"
    The status should be success
  End

  It 'exits 0 when security.md carries all 13 §11 boxes in section-heading form (matches S-F7-α slice)'
    write_heading_form_security
    When call scripts/verify-slice.sh "$SLICE_DIR"
    The status should be success
  End

  It 'exits non-zero and names the missing box when security.md has only 12 of 13 §11 boxes'
    {
      printf '# Security\n\n## §11 checklist\n\n'
      printf '| Box | Item | Status | Notes |\n|---|---|---|---|\n'
      for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
        printf '| %s | item-%s | n/a | placeholder |\n' "$i" "$i"
      done
    } > "$SLICE_DIR/security.md"
    When call scripts/verify-slice.sh "$SLICE_DIR"
    The status should be failure
    The stderr should match pattern '*13*'
  End

  It 'emits useful-message on §11 failure: quotes the rule and lists actionable alternatives (G17 pattern)'
    : > "$SLICE_DIR/security.md"
    When call scripts/verify-slice.sh "$SLICE_DIR"
    The status should be failure
    The stderr should match pattern '*spec 72*'
    The stderr should match pattern '*Actionable alternatives*'
  End
End
