#!/bin/bash
# Tests for scripts/criterion-2-exception-check.sh — deterministic pre-filter
# for criterion 2 §Exceptions in .claude/agents/slice-reviewer.md.
#
# Test contract: predicate paths from .claude/agents/criterion-2-exceptions.yaml
# entries c (spec-design content) and e (CLAUDE.md session-wrap docs); plus
# pass-through behaviour for (a)/(b)/(d) judgement cases and `none` fallthrough.

Describe 'criterion-2-exception-check.sh'

  It 'classifies docs/HANDOFF-SESSION-{N}.md as exception (e)'
    Data
      #|docs/HANDOFF-SESSION-52.md
    End
    When call scripts/criterion-2-exception-check.sh
    The line 1 of output should include 'docs/HANDOFF-SESSION-52.md'
    The line 1 of output should include $'\te\t'
    The status should be success
  End

  It 'classifies docs/SESSION-CONTEXT.md as exception (e)'
    Data
      #|docs/SESSION-CONTEXT.md
    End
    When call scripts/criterion-2-exception-check.sh
    The line 1 of output should include $'\te\t'
    The status should be success
  End

  It 'classifies docs/workspace-spec/*.md as exception (c)'
    Data
      #|docs/workspace-spec/72c-multi-agent-review-framework.md
    End
    When call scripts/criterion-2-exception-check.sh
    The line 1 of output should include $'\tc\t'
    The status should be success
  End

  It 'classifies nested docs/workspace-spec/**/* as exception (c)'
    Data
      #|docs/workspace-spec/68/68a-decisions-crosscutting.md
    End
    When call scripts/criterion-2-exception-check.sh
    The line 1 of output should include $'\tc\t'
  End

  It 'classifies docs/design-source/<slug>/<file> as exception (c)'
    Data
      #|docs/design-source/welcome-carousel/screen-1a.png
    End
    When call scripts/criterion-2-exception-check.sh
    The line 1 of output should include $'\tc\t'
  End

  It 'passes docs/slices/<id>/acceptance.md through as requires-judgement (exception b candidate)'
    Data
      #|docs/slices/S-INFRA-foo/acceptance.md
    End
    When call scripts/criterion-2-exception-check.sh
    The line 1 of output should include $'\trequires-judgement\t'
  End

  It 'passes docs/slices/<id>/verification.md through as requires-judgement'
    Data
      #|docs/slices/S-INFRA-foo/verification.md
    End
    When call scripts/criterion-2-exception-check.sh
    The line 1 of output should include $'\trequires-judgement\t'
  End

  It 'classifies src/ paths as none'
    Data
      #|src/lib/foo.ts
    End
    When call scripts/criterion-2-exception-check.sh
    The line 1 of output should include $'\tnone\t'
  End

  It 'classifies repo-root README.md as none'
    Data
      #|README.md
    End
    When call scripts/criterion-2-exception-check.sh
    The line 1 of output should include $'\tnone\t'
  End

  It 'does NOT match HANDOFF-SESSION-*.md outside docs/ root (glob anchored)'
    Data
      #|docs/handoffs-archive/HANDOFF-SESSION-12.md
    End
    When call scripts/criterion-2-exception-check.sh
    The line 1 of output should include $'\tnone\t'
  End

  It 'emits one output line per input file (multi-file diff, order preserved)'
    Data
      #|docs/HANDOFF-SESSION-52.md
      #|src/lib/foo.ts
      #|docs/workspace-spec/42-strategic-synthesis.md
    End
    When call scripts/criterion-2-exception-check.sh
    The line 1 of output should include 'docs/HANDOFF-SESSION-52.md'
    The line 1 of output should include $'\te\t'
    The line 2 of output should include 'src/lib/foo.ts'
    The line 2 of output should include $'\tnone\t'
    The line 3 of output should include 'docs/workspace-spec/42-strategic-synthesis.md'
    The line 3 of output should include $'\tc\t'
  End

  It 'skips blank input lines'
    Data
      #|
      #|docs/SESSION-CONTEXT.md
      #|
    End
    When call scripts/criterion-2-exception-check.sh
    The lines of output should equal 1
    The line 1 of output should include $'\te\t'
  End

  It 'emits empty output for empty stdin'
    Data
      #|
    End
    When call scripts/criterion-2-exception-check.sh
    The output should equal ''
    The status should be success
  End

  It 'preserves spaces inside file paths'
    Data
      #|docs/workspace-spec/notes with spaces.md
    End
    When call scripts/criterion-2-exception-check.sh
    The line 1 of output should include 'notes with spaces.md'
    The line 1 of output should include $'\tc\t'
  End

End
