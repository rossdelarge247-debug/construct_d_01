#!/bin/bash
# S-37-6 — meta-tests for scripts/git-state-verifier.sh.
# Per docs/slices/S-INFRA-rigour-v3a-foundation/acceptance.md AC-7
# (verify-before-planning sub-script).

Describe 'git-state-verifier.sh'
  VERIFIER=scripts/git-state-verifier.sh

  It 'exits 0 on plan with no SHA / branch references'
    Data 'Plan body without any git references whatsoever.'
    When run script "$VERIFIER"
    The status should equal 0
    The stderr should equal ''
  End

  It 'exits 0 on plan referencing the current branch + valid SHA'
    Data 'Working on claude/S-INFRA-rigour-v3a-foundation. HEAD is 60bede1.'
    When run script "$VERIFIER"
    The status should equal 0
  End

  It 'exits 1 on plan with bogus SHA (deadbeefdeadbeef)'
    Data 'Plan references SHA deadbeefdeadbeef which does not exist.'
    When run script "$VERIFIER"
    The status should equal 1
    The stderr should include "deadbeefdeadbeef"
    The stderr should include 'not found in git object store'
  End

  It 'exits 1 on plan with non-resolvable branch'
    Data 'Working on claude/does-not-exist-XXXXX.'
    When run script "$VERIFIER"
    The status should equal 1
    The stderr should include 'claude/does-not-exist-XXXXX'
    The stderr should include 'not resolvable'
  End

  It 'allows bare "main" when origin/main exists (fallback for repos without local main)'
    Data 'Behind main 0 commits.'
    When run script "$VERIFIER"
    The status should equal 0
  End

  It 'exits 2 on empty stdin (refuses to verify nothing)'
    Data ''
    When run script "$VERIFIER"
    The status should equal 2
    The stderr should include 'empty plan'
  End

  It 'reports BOTH bogus SHA AND bogus branch in same plan'
    Data 'Plan references SHA deadbeefdeadbeef and branch claude/never-existed.'
    When run script "$VERIFIER"
    The status should equal 1
    The stderr should include 'deadbeefdeadbeef'
    The stderr should include 'claude/never-existed'
  End
End
