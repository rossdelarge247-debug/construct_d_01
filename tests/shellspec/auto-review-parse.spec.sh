#!/bin/bash
# Tests for scripts/auto-review-parse.sh — extracts persona JSON from
# claude -p --output-format=json envelope; falls back to '{}' sentinel
# on any parse failure.
#
# Test contract: 3 failure-mode classes (missing/empty .result;
# malformed result body; invalid envelope) all funnel to '{}', plus
# success cases (plain JSON; fence-wrapped JSON; .text/.content fallback).

Describe 'auto-review-parse.sh'

  # Success cases

  It 'extracts plain JSON from .result field'
    Data
      #|{"result":"{\"summary\":\"x\",\"findings\":[]}"}
    End
    When call scripts/auto-review-parse.sh
    The output should equal '{"summary":"x","findings":[]}'
    The status should be success
  End

  It 'strips markdown fences from fence-wrapped .result'
    # Model quirk: claude sometimes wraps JSON in ```json...``` fences
    # despite output-format=json. The grep-strip handles this.
    Data
      #|{"result":"```json\n{\"summary\":\"x\",\"findings\":[]}\n```"}
    End
    When call scripts/auto-review-parse.sh
    The output should equal '{"summary":"x","findings":[]}'
    The status should be success
  End

  It 'strips fences with leading whitespace'
    Data
      #|{"result":"  ```json\n{\"a\":1}\n  ```"}
    End
    When call scripts/auto-review-parse.sh
    The output should equal '{"a":1}'
    The status should be success
  End

  It 'falls back to .text field when .result missing'
    Data
      #|{"text":"{\"a\":1}"}
    End
    When call scripts/auto-review-parse.sh
    The output should equal '{"a":1}'
    The status should be success
  End

  It 'falls back to .content field when both .result and .text missing'
    Data
      #|{"content":"{\"a\":1}"}
    End
    When call scripts/auto-review-parse.sh
    The output should equal '{"a":1}'
    The status should be success
  End

  It 'compacts pretty-printed JSON in .result via jq -c'
    Data
      #|{"result":"{\n  \"summary\": \"x\",\n  \"findings\": []\n}"}
    End
    When call scripts/auto-review-parse.sh
    The output should equal '{"summary":"x","findings":[]}'
    The status should be success
  End

  # Failure-mode class 1: missing/empty .result

  It 'returns {} for empty object envelope (no result/text/content keys)'
    Data
      #|{}
    End
    When call scripts/auto-review-parse.sh
    The output should equal '{}'
    The status should be success
  End

  It 'returns {} for envelope with empty .result string'
    Data
      #|{"result":""}
    End
    When call scripts/auto-review-parse.sh
    The output should equal '{}'
    The status should be success
  End

  It 'returns {} for empty stdin (no envelope at all)'
    Data ''
    When call scripts/auto-review-parse.sh
    The output should equal '{}'
    The status should be success
  End

  # Failure-mode class 2: malformed result body

  It 'returns {} when .result contains non-JSON garbage'
    Data
      #|{"result":"not-json{{{"}
    End
    When call scripts/auto-review-parse.sh
    The output should equal '{}'
    The status should be success
  End

  It 'returns {} when .result contains incomplete JSON'
    Data
      #|{"result":"{\"summary\": \"x\","}
    End
    When call scripts/auto-review-parse.sh
    The output should equal '{}'
    The status should be success
  End

  # Failure-mode class 3: invalid envelope

  It 'returns {} for invalid JSON envelope'
    Data
      #|not json at all
    End
    When call scripts/auto-review-parse.sh
    The output should equal '{}'
    The status should be success
  End

  It 'returns {} for envelope that is a JSON array (not object)'
    Data
      #|["not", "an", "envelope"]
    End
    When call scripts/auto-review-parse.sh
    The output should equal '{}'
    The status should be success
  End

End
