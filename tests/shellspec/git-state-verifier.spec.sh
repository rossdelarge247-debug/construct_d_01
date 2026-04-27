#!/bin/bash
# S-37-6 — meta-tests for scripts/git-state-verifier.sh.
# Per docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md AC-7
# (verify-before-planning sub-script).

Describe 'git-state-verifier.sh'
  # Per G15 + existing spec convention (hooks-checksums.spec.sh, verify-slice.spec.sh):
  # tests that need a real ref / SHA build a tmp git fixture, so behaviour is
  # hermetic across local + CI shallow-detached-HEAD checkouts.
  setup_fixture() {
    export VERIFIER="$PWD/scripts/git-state-verifier.sh"
    export SPEC_TMP="$(mktemp -d -t git-state-verifier-spec.XXXXXX)"
    (
      cd "$SPEC_TMP" || exit 1
      # Use git plumbing (write-tree + commit-tree + update-ref) rather than
      # `git commit`, which triggers the project's commit-signing path and
      # fails in test fixtures without server-side signing access. Plumbing
      # never invokes that path. Honest isolation, not a policy bypass.
      git init -q -b claude/S-INFRA-rigour-v3a-foundation .
      TREE=$(git write-tree)
      COMMIT=$(
        GIT_AUTHOR_NAME=t GIT_AUTHOR_EMAIL=t@example \
        GIT_COMMITTER_NAME=t GIT_COMMITTER_EMAIL=t@example \
        git commit-tree -m bootstrap "$TREE"
      )
      git update-ref HEAD "$COMMIT"
      # Simulate origin/main for the bare-main fallback test.
      git update-ref refs/remotes/origin/main "$COMMIT"
    )
  }
  cleanup_fixture() {
    [ -n "${SPEC_TMP:-}" ] && rm -rf "$SPEC_TMP"
  }
  BeforeEach 'setup_fixture'
  AfterEach 'cleanup_fixture'

  It 'exits 0 on plan with no SHA / branch references'
    Data 'Plan body without any git references whatsoever.'
    When run bash -c 'cd "$SPEC_TMP" && cat | "$VERIFIER"'
    The status should equal 0
    The stderr should equal ''
  End

  It 'exits 0 on plan referencing the current branch + valid SHA'
    When run bash -c '
      cd "$SPEC_TMP" || exit 99
      SHA=$(git rev-parse HEAD)
      printf "Working on claude/S-INFRA-rigour-v3a-foundation. HEAD is %s." "${SHA:0:7}" | "$VERIFIER"
    '
    The status should equal 0
  End

  It 'exits 1 on plan with bogus SHA (deadbeefdeadbeef)'
    Data 'Plan references SHA deadbeefdeadbeef which does not exist.'
    When run bash -c 'cd "$SPEC_TMP" && cat | "$VERIFIER"'
    The status should equal 1
    The stderr should include "deadbeefdeadbeef"
    The stderr should include 'not found in git object store'
  End

  It 'exits 1 on plan with non-resolvable branch'
    Data 'Working on claude/does-not-exist-XXXXX.'
    When run bash -c 'cd "$SPEC_TMP" && cat | "$VERIFIER"'
    The status should equal 1
    The stderr should include 'claude/does-not-exist-XXXXX'
    The stderr should include 'not resolvable'
  End

  It 'allows bare "main" when origin/main exists (fallback for repos without local main)'
    Data 'Behind main 0 commits.'
    When run bash -c 'cd "$SPEC_TMP" && cat | "$VERIFIER"'
    The status should equal 0
  End

  It 'exits 2 on empty stdin (refuses to verify nothing)'
    Data ''
    When run bash -c 'cd "$SPEC_TMP" && cat | "$VERIFIER"'
    The status should equal 2
    The stderr should include 'empty plan'
  End

  It 'reports BOTH bogus SHA AND bogus branch in same plan'
    Data 'Plan references SHA deadbeefdeadbeef and branch claude/never-existed.'
    When run bash -c 'cd "$SPEC_TMP" && cat | "$VERIFIER"'
    The status should equal 1
    The stderr should include 'deadbeefdeadbeef'
    The stderr should include 'claude/never-existed'
  End
End
