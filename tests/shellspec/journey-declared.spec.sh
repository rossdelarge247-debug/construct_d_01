#!/bin/bash

Describe '.claude/hooks/journey-declared.sh'
  HOOK='.claude/hooks/journey-declared.sh'

  envelope_write() {
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
    It 'exits 0 silently for non-Write/Edit tools'
      Data <<< '{"tool_name":"Read","tool_input":{"file_path":"docs/slices/S-PROTO-foo/acceptance.md"}}'
      When run "$HOOK"
      The status should equal 0
      The stdout should equal ""
    End
  End

  Describe 'scope: prototype slice acceptance.md only'
    It 'exits 0 silently for non-PROTO slice acceptance.md'
      Data <<< "$(envelope_write 'docs/slices/S-F1-design-tokens/acceptance.md' '# heading\nno journey field here')"
      When run "$HOOK"
      The status should equal 0
      The stdout should equal ""
    End

    It 'exits 0 silently for non-acceptance.md docs in a PROTO slice'
      Data <<< "$(envelope_write 'docs/slices/S-PROTO-foo/verification.md' 'no journey field here')"
      When run "$HOOK"
      The status should equal 0
      The stdout should equal ""
    End

    It 'exits 0 silently for src/ files'
      Data <<< "$(envelope_write 'src/app/dev/proto/foo/page.tsx' 'no journey field here')"
      When run "$HOOK"
      The status should equal 0
      The stdout should equal ""
    End
  End

  Describe 'field detection'
    It 'exits 0 silently when **Journey:** field is present (Write)'
      present_content=$(printf '# S-PROTO-foo\n\n**Category:** prototype\n**Journey:** inbound from = marketing-landing · outbound to = sign-up\n\n## Why')
      Data <<< "$(envelope_write 'docs/slices/S-PROTO-foo/acceptance.md' "$present_content")"
      When run "$HOOK"
      The status should equal 0
      The stdout should equal ""
    End

    It 'exits 0 silently when **Journey:** orphan declaration is present'
      orphan_content=$(printf '# S-PROTO-foo\n\n**Category:** prototype\n**Journey:** orphan — pending wiring in slice S-PROTO-bar\n\n## Why')
      Data <<< "$(envelope_write 'docs/slices/S-PROTO-foo/acceptance.md' "$orphan_content")"
      When run "$HOOK"
      The status should equal 0
      The stdout should equal ""
    End

    It 'emits advisory when **Journey:** field is absent (Write)'
      absent_content=$(printf '# S-PROTO-foo\n\n**Category:** prototype\n\n## Why\nno journey here')
      Data <<< "$(envelope_write 'docs/slices/S-PROTO-foo/acceptance.md' "$absent_content")"
      When run "$HOOK"
      The status should equal 0
      The stdout should include 'journey-declared'
      The stdout should include 'docs/slices/S-PROTO-foo/acceptance.md'
      The stdout should include 'missing'
    End
  End

  Describe 'Edit-mode: re-read disk when new_string lacks the field'
    setup() {
      mkdir -p docs/slices/S-PROTO-tmp-jdecl-test
    }
    cleanup() {
      rm -rf docs/slices/S-PROTO-tmp-jdecl-test
    }
    BeforeEach 'setup'
    AfterEach 'cleanup'

    It 'exits 0 silently when patch lacks field but file on disk has it'
      printf '# S-PROTO-tmp-jdecl-test\n\n**Category:** prototype\n**Journey:** orphan — test fixture\n\n## Why\nold body\n' > docs/slices/S-PROTO-tmp-jdecl-test/acceptance.md
      Data <<< "$(envelope_edit 'docs/slices/S-PROTO-tmp-jdecl-test/acceptance.md' 'replacement body without journey field')"
      When run "$HOOK"
      The status should equal 0
      The stdout should equal ""
    End

    It 'emits advisory when patch lacks field AND file on disk lacks it'
      printf '# S-PROTO-tmp-jdecl-test\n\n**Category:** prototype\n\n## Why\nold body\n' > docs/slices/S-PROTO-tmp-jdecl-test/acceptance.md
      Data <<< "$(envelope_edit 'docs/slices/S-PROTO-tmp-jdecl-test/acceptance.md' 'replacement body still no field')"
      When run "$HOOK"
      The status should equal 0
      The stdout should include 'journey-declared'
      The stdout should include 'missing'
    End
  End
End
