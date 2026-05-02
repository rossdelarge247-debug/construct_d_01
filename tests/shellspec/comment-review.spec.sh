#!/bin/bash

Describe '.claude/hooks/comment-review.sh'
  HOOK='.claude/hooks/comment-review.sh'

  envelope_write() {
    # $1 = file_path, $2 = content (single-line; embed \n as literal in caller)
    jq -n --arg fp "$1" --arg c "$2" '{
      tool_name: "Write",
      tool_input: { file_path: $fp, content: $c }
    }'
  }

  envelope_edit() {
    jq -n --arg fp "$1" --arg ns "$2" '{
      tool_name: "Edit",
      tool_input: { file_path: $fp, new_string: $ns }
    }'
  }

  Describe 'tool-name early-exit'
    It 'exits 0 silently for Read tool'
      Data <<< '{"tool_name":"Read","tool_input":{"file_path":"src/foo.ts"}}'
      When run "$HOOK"
      The status should equal 0
      The stdout should equal ""
    End

    It 'exits 0 silently for Bash tool'
      Data <<< '{"tool_name":"Bash","tool_input":{"command":"ls"}}'
      When run "$HOOK"
      The status should equal 0
      The stdout should equal ""
    End
  End

  Describe 'path skip-list'
    It 'exits 0 silently for .claude/agents/ writes'
      Data <<< "$(envelope_write '.claude/agents/some-persona.md' 'PR #56 round 7 example')"
      When run "$HOOK"
      The status should equal 0
      The stdout should equal ""
    End

    It 'exits 0 silently for tests/shellspec/ writes'
      Data <<< "$(envelope_write 'tests/shellspec/foo.spec.sh' 'session-56 amendment fixture')"
      When run "$HOOK"
      The status should equal 0
      The stdout should equal ""
    End

    It 'exits 0 silently for .json files'
      Data <<< "$(envelope_write 'package.json' 'irrelevant body PR #99')"
      When run "$HOOK"
      The status should equal 0
      The stdout should equal ""
    End

    It 'exits 0 silently for .lock files'
      Data <<< "$(envelope_write 'package-lock.json' 'PR #99')"
      When run "$HOOK"
      The status should equal 0
      The stdout should equal ""
    End
  End

  Describe 'happy path — no anti-pattern'
    It 'exits 0 with no systemMessage on clean diff'
      Data <<< "$(envelope_write 'src/foo.ts' 'export function add(a: number, b: number) { return a + b; }')"
      When run "$HOOK"
      The status should equal 0
      The stdout should equal ""
    End

    It 'exits 0 silently for empty content'
      Data <<< "$(envelope_write 'src/foo.ts' '')"
      When run "$HOOK"
      The status should equal 0
      The stdout should equal ""
    End
  End

  Describe 'stub-mode anti-pattern detection'
    It 'flags PR-number provenance'
      Data <<< "$(envelope_write 'src/foo.ts' '// PR #56 round 7 follow-up')"
      When run "$HOOK"
      The status should equal 0
      The stdout should include "provenance"
    End

    It 'flags session-N provenance'
      Data <<< "$(envelope_write 'src/foo.ts' '// session-56 amendment to derive-verdict')"
      When run "$HOOK"
      The status should equal 0
      The stdout should include "provenance"
    End

    It 'flags slice-name provenance'
      Data <<< "$(envelope_write 'src/foo.ts' '// slice S-F1 AC-3 token parity check')"
      When run "$HOOK"
      The status should equal 0
      The stdout should include "provenance"
    End

    It 'flags sibling-step references'
      Data <<< "$(envelope_write 'src/foo.ts' '// Mirrors the aggregate fallback above')"
      When run "$HOOK"
      The status should equal 0
      The stdout should include "sibling-step"
    End

    It 'flags code lineage'
      Data <<< "$(envelope_write 'src/foo.ts' '// added for the consent-order flow; handles issue #123')"
      When run "$HOOK"
      The status should equal 0
      The stdout should include "lineage"
    End

    It 'flags historical-count narration'
      Data <<< "$(envelope_write 'src/foo.ts' '// 14 findings actioned across rounds 1-9')"
      When run "$HOOK"
      The status should equal 0
      The stdout should include "historical-count"
    End

    It 'detects on Edit tool new_string'
      Data <<< "$(envelope_edit 'src/foo.ts' '+ // PR #99 fix')"
      When run "$HOOK"
      The status should equal 0
      The stdout should include "provenance"
    End
  End
End
