#!/bin/bash
# Tests for scripts/auto-review-extract-prior.sh — extracts prior-round
# findings JSON from a multi-agent auto-review marker comment body, for
# differential review mode per spec 72c §6.

Describe 'auto-review-extract-prior.sh'
  # Capture absolute path before setup() cds away from the project root.
  EXTRACT_SCRIPT="$PWD/scripts/auto-review-extract-prior.sh"

  setup() {
    SPEC_TMP="$(mktemp -d -t auto-review-extract-prior-spec.XXXXXX)"
    cd "$SPEC_TMP" || return
  }
  cleanup() {
    cd / || return
    rm -rf "$SPEC_TMP"
  }
  BeforeEach 'setup'
  AfterEach 'cleanup'

  It 'emits empty when stdin is empty'
    When call "$EXTRACT_SCRIPT"
    The output should equal ''
    The status should be success
  End

  It 'emits empty when comment body has no prior-findings block'
    When run sh -c "printf '%s' 'just a regular comment\nno marker\n' | $EXTRACT_SCRIPT"
    The output should equal ''
    The status should be success
  End

  It 'emits the JSON envelope when comment has a valid prior-findings block'
    BODY=$(printf '<!-- auto-review-comment:multi-agent -->\n## auto-review\n\n<!-- BEGIN-prior-findings-json -->\n{"head_sha":"abc1234","findings":[{"label":"issue","blocking":true}]}\n<!-- END-prior-findings-json -->\n')
    When run sh -c "printf '%s' '$BODY' | $EXTRACT_SCRIPT"
    The output should include '"head_sha":"abc1234"'
    The output should include '"findings"'
    The status should be success
  End

  It 'emits empty when JSON block is missing head_sha'
    BODY=$(printf '<!-- BEGIN-prior-findings-json -->\n{"findings":[]}\n<!-- END-prior-findings-json -->\n')
    When run sh -c "printf '%s' '$BODY' | $EXTRACT_SCRIPT"
    The output should equal ''
    The status should be success
  End

  It 'emits empty when findings is not an array'
    BODY=$(printf '<!-- BEGIN-prior-findings-json -->\n{"head_sha":"abc","findings":"oops"}\n<!-- END-prior-findings-json -->\n')
    When run sh -c "printf '%s' '$BODY' | $EXTRACT_SCRIPT"
    The output should equal ''
    The status should be success
  End

  It 'emits empty when JSON block is malformed'
    BODY=$(printf '<!-- BEGIN-prior-findings-json -->\nnot valid json\n<!-- END-prior-findings-json -->\n')
    When run sh -c "printf '%s' '$BODY' | $EXTRACT_SCRIPT"
    The output should equal ''
    The status should be success
  End

  It 'preserves JSON content even when it contains the BEGIN marker substring (anchored-pattern guard)'
    BODY=$(printf '<!-- BEGIN-prior-findings-json -->\n{"head_sha":"x","findings":[{"evidence":"a finding quoting <!-- BEGIN-prior-findings-json --> from a meta diff"}]}\n<!-- END-prior-findings-json -->\n')
    When run sh -c "printf '%s' '$BODY' | $EXTRACT_SCRIPT"
    The output should include 'meta diff'
    The output should include '"head_sha":"x"'
    The status should be success
  End

  It 'preserves JSON content containing a bare --> on its own conceptual line (no early exit)'
    # The closing marker is now `<!-- END-prior-findings-json -->`, not bare `-->`,
    # so a finding's evidence containing `-->` (e.g. quoting an HTML-comment fragment
    # in a diff) cannot terminate awk extraction prematurely.
    BODY=$(printf '<!-- BEGIN-prior-findings-json -->\n{"head_sha":"y","findings":[{"evidence":"-->"}]}\n<!-- END-prior-findings-json -->\n')
    When run sh -c "printf '%s' '$BODY' | $EXTRACT_SCRIPT"
    The output should include '"head_sha":"y"'
    The output should include '"-->"'
    The status should be success
  End

  It 'extracts only the first prior-findings block when multiple exist'
    BODY=$(printf '<!-- BEGIN-prior-findings-json -->\n{"head_sha":"first","findings":[]}\n<!-- END-prior-findings-json -->\n<!-- BEGIN-prior-findings-json -->\n{"head_sha":"second","findings":[]}\n<!-- END-prior-findings-json -->\n')
    When run sh -c "printf '%s' '$BODY' | $EXTRACT_SCRIPT"
    The output should include '"head_sha":"first"'
    The output should not include 'second'
    The status should be success
  End
End
