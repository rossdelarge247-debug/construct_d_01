#!/bin/bash
# S-37-5 — meta-tests for .claude/hooks/pre-commit-verify.sh.
# Validates command-matching logic + verify-slice.sh integration.

Describe 'pre-commit-verify.sh'
  HOOK=.claude/hooks/pre-commit-verify.sh

  It 'allows non-git-commit commands (e.g. git status) silently'
    Data '{"tool_input":{"command":"git status"}}'
    When run script "$HOOK"
    The status should equal 0
    The stderr should equal ''
  End

  It 'allows git commit-graph (false-positive guard, not git commit)'
    Data '{"tool_input":{"command":"git commit-graph write"}}'
    When run script "$HOOK"
    The status should equal 0
    The stderr should equal ''
  End

  It 'allows git commit-tree (false-positive guard, not git commit)'
    Data '{"tool_input":{"command":"git commit-tree HEAD^{tree}"}}'
    When run script "$HOOK"
    The status should equal 0
  End

  It 'allows empty stdin (defensive — never crash on bad input)'
    Data ''
    When run script "$HOOK"
    The status should equal 0
  End

  It 'allows git commit when current slice verification passes'
    # Integration: relies on current branch being claude/S-INFRA-rigour-v3a-foundation
    # AND the slice having acceptance.md + security.md + verification.md.
    Data '{"tool_input":{"command":"git commit -m test"}}'
    When run script "$HOOK"
    The status should equal 0
  End

  It 'allows compound commands containing git commit (regex word-boundary)'
    Data '{"tool_input":{"command":"git add foo && git commit -m bar"}}'
    When run script "$HOOK"
    The status should equal 0
  End
End
