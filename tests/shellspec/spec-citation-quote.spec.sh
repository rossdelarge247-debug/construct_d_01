#!/bin/bash
# Tests for .claude/hooks/spec-citation-quote.sh — PostToolUse spec-citation gate.
#
# Hook receives `tool_input` JSON via stdin; emits advisory `systemMessage`
# (or exits 2 in enforce mode); always parseable by the harness.

Describe '.claude/hooks/spec-citation-quote.sh'

  HOOK="$PWD/.claude/hooks/spec-citation-quote.sh"

  setup() {
    UNSET_ENFORCE=1
  }
  BeforeEach 'setup'

  It 'exits 0 silently for non-Write/Edit tools'
    Data <<< '{"tool_name":"Read","tool_input":{"file_path":"docs/slices/S-X/acceptance.md"}}'
    When run "$HOOK"
    The status should equal 0
    The stdout should equal ""
  End

  It 'exits 0 silently for paths outside slice/spec scope'
    Data <<< '{"tool_name":"Write","tool_input":{"file_path":"src/lib/foo.ts","content":"per spec 72d touches everything"}}'
    When run "$HOOK"
    The status should equal 0
    The stdout should equal ""
  End

  It 'exits 0 silently for HANDOFF lineage docs (skip-list)'
    Data <<< '{"tool_name":"Write","tool_input":{"file_path":"docs/HANDOFF-SESSION-99.md","content":"per spec 72d says things"}}'
    When run "$HOOK"
    The status should equal 0
    The stdout should equal ""
  End

  It 'exits 0 silently for SESSION-CONTEXT (skip-list)'
    Data <<< '{"tool_name":"Write","tool_input":{"file_path":"docs/SESSION-CONTEXT.md","content":"per spec 72d says things"}}'
    When run "$HOOK"
    The status should equal 0
    The stdout should equal ""
  End

  It 'flags `per spec NN` citation without nearby quote (stub)'
    PAYLOAD='{"tool_name":"Write","tool_input":{"file_path":"docs/slices/S-X/acceptance.md","content":"This claim is per spec 72d, important.\nNo quote follows.\nNot a quote either.\n"}}'
    Data "$PAYLOAD"
    When run "$HOOK"
    The status should equal 0
    The output should include 'spec-citation-quote / stub'
    The output should include 'per spec 72d'
  End

  It 'flags `spec NN §"section"` citation without nearby quote (stub)'
    PAYLOAD='{"tool_name":"Write","tool_input":{"file_path":"docs/workspace-spec/72d-foo.md","content":"This is spec 72d §\"Plan-architect rubric\" affirmation.\nNo quote follows.\n"}}'
    Data "$PAYLOAD"
    When run "$HOOK"
    The status should equal 0
    The output should include 'spec-citation-quote / stub'
    The output should include 'spec 72d'
  End

  It 'passes when blockquote with ≥20 chars satisfies proximity rule'
    PAYLOAD='{"tool_name":"Write","tool_input":{"file_path":"docs/slices/S-X/acceptance.md","content":"This claim is per spec 72d, in detail:\n\n> *\"Plan-architect rubric. The persona reviews against five questions.\"*\n"}}'
    Data "$PAYLOAD"
    When run "$HOOK"
    The status should equal 0
    The stdout should equal ""
  End

  It 'passes when fenced code block with ≥20 chars satisfies proximity rule'
    PAYLOAD='{"tool_name":"Write","tool_input":{"file_path":"docs/slices/S-X/acceptance.md","content":"This claim is per spec 72d, illustrated:\n\n```\nThis is a fenced code block with more than twenty characters of content.\n```\n"}}'
    Data "$PAYLOAD"
    When run "$HOOK"
    The status should equal 0
    The stdout should equal ""
  End

  It 'exits 2 in enforce mode when citation lacks quote'
    PAYLOAD='{"tool_name":"Write","tool_input":{"file_path":"docs/slices/S-X/acceptance.md","content":"This claim is per spec 72d, important.\nNo quote follows.\n"}}'
    Data "$PAYLOAD"
    When run env SPEC_QUOTE_ENFORCE=1 "$HOOK"
    The status should equal 2
    The output should include 'spec-citation-quote / enforce'
  End

  It 'exempts §Status section content from trigger scan'
    PAYLOAD='{"tool_name":"Write","tool_input":{"file_path":"docs/slices/S-X/acceptance.md","content":"# Slice X\n\n## Status\n\nThis claim is per spec 72d but inside §Status; lineage tracking exempt.\nNo quote needed.\n"}}'
    Data "$PAYLOAD"
    When run "$HOOK"
    The status should equal 0
    The stdout should equal ""
  End

  It 'exempts blockquote-line content from trigger scan'
    PAYLOAD='{"tool_name":"Write","tool_input":{"file_path":"docs/slices/S-X/acceptance.md","content":"# Slice X\n\nQuoting the prior failure analysis:\n\n> Citations like \"per spec 65 §The 8 screens\" appeared four times.\n\nThe trigger inside the blockquote does not fire.\n"}}'
    Data "$PAYLOAD"
    When run "$HOOK"
    The status should equal 0
    The stdout should equal ""
  End

  It 'does NOT trigger on `spec NN §<numeric>` form (doc-pointer not claim)'
    PAYLOAD='{"tool_name":"Write","tool_input":{"file_path":"docs/slices/S-X/acceptance.md","content":"This slice amends spec 72d §5 by adding Q6.\nNo quote needed for doc-pointer.\n"}}'
    Data "$PAYLOAD"
    When run "$HOOK"
    The status should equal 0
    The stdout should equal ""
  End

  It 'does NOT trigger on bare `spec NN` form (doc-pointer not claim)'
    PAYLOAD='{"tool_name":"Write","tool_input":{"file_path":"docs/slices/S-X/acceptance.md","content":"This slice amends spec 72d.\nNo quote needed for bare doc reference.\n"}}'
    Data "$PAYLOAD"
    When run "$HOOK"
    The status should equal 0
    The stdout should equal ""
  End

End
