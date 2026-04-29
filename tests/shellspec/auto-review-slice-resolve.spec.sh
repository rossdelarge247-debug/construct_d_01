#!/bin/bash
# Tests for scripts/auto-review-slice-resolve.sh — slice acceptance.md
# path resolution from BRANCH + PR_BODY.
#
# Test contract: PR #38 (session 50) false-positive + PR #39 fix —
# branch-derived path preferred over PR-body grep.

Describe 'auto-review-slice-resolve.sh'
  setup() {
    SPEC_TMP="$(mktemp -d -t auto-review-resolve-spec.XXXXXX)"
    REPO="$SPEC_TMP"
    mkdir -p "$REPO/docs/slices/S-FOO" "$REPO/docs/slices/S-BAR"
    : > "$REPO/docs/slices/S-FOO/acceptance.md"
    : > "$REPO/docs/slices/S-BAR/acceptance.md"
    cd "$REPO" || return
  }
  cleanup() {
    cd / || return
    rm -rf "$SPEC_TMP"
  }
  BeforeEach 'setup'
  AfterEach 'cleanup'

  # Branch-derived path (preferred when slice file exists)

  It 'returns branch-derived path when slice exists on disk'
    When call /home/user/construct_d_01/scripts/auto-review-slice-resolve.sh "claude/S-FOO" ""
    The output should equal 'docs/slices/S-FOO/acceptance.md'
    The status should be success
  End

  It 'returns branch-derived path when slice exists, even if PR body cites another slice (PR #38 false-positive class)'
    # PR #38 (session 50) cited S-F7-alpha-contracts-dev-mode in body
    # but branch was claude/S-INFRA-rigour-v3c-prior-art-amendments-easy.
    # Branch-derived must win.
    When call /home/user/construct_d_01/scripts/auto-review-slice-resolve.sh "claude/S-FOO" "see docs/slices/S-BAR/acceptance.md for details"
    The output should equal 'docs/slices/S-FOO/acceptance.md'
    The status should be success
  End

  # PR-body fallback (when branch resolution misses)

  It 'falls back to PR body when branch-derived slice file is missing'
    When call /home/user/construct_d_01/scripts/auto-review-slice-resolve.sh "claude/S-NONEXISTENT" "see docs/slices/S-BAR/acceptance.md for details"
    The output should equal 'docs/slices/S-BAR/acceptance.md'
    The status should be success
  End

  It 'falls back to PR body when branch has no S-* token'
    When call /home/user/construct_d_01/scripts/auto-review-slice-resolve.sh "claude/feature-rename-no-slice-token" "see docs/slices/S-BAR/acceptance.md"
    The output should equal 'docs/slices/S-BAR/acceptance.md'
    The status should be success
  End

  It 'extracts first slice path from PR body when multiple are cited'
    When call /home/user/construct_d_01/scripts/auto-review-slice-resolve.sh "claude/feature" "first: docs/slices/S-FOO/acceptance.md, then docs/slices/S-BAR/acceptance.md"
    The output should equal 'docs/slices/S-FOO/acceptance.md'
    The status should be success
  End

  # Empty / no-resolution cases

  It 'returns empty string when both branch resolution and PR body miss'
    When call /home/user/construct_d_01/scripts/auto-review-slice-resolve.sh "claude/feature-no-token" "no slice paths in body"
    The output should equal ''
    The status should be success
  End

  It 'returns empty string when both inputs are empty'
    When call /home/user/construct_d_01/scripts/auto-review-slice-resolve.sh "" ""
    The output should equal ''
    The status should be success
  End

  # Edge cases

  It 'handles branch with lower-case s prefix as no-match (case-sensitive S-* token regex)'
    # PR-body fallback fires because lowercase s- doesn't match the
    # uppercase grep pattern; PR body is empty here so output empty.
    When call /home/user/construct_d_01/scripts/auto-review-slice-resolve.sh "claude/s-typo-lowercase" ""
    The output should equal ''
    The status should be success
  End

End
