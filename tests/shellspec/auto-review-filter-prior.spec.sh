#!/bin/bash
# auto-review-filter-prior.sh contract — per-specialist prior-findings filter.
# Spec ref: docs/workspace-spec/72c-multi-agent-review-framework.md §6.

Describe 'scripts/auto-review-filter-prior.sh'
  SCRIPT='scripts/auto-review-filter-prior.sh'

  Describe 'usage'
    It 'fails with no arguments'
      When run "$SCRIPT"
      The status should equal 2
      The stderr should include 'usage'
    End

    It 'rejects an invalid dimension'
      Data <<< '{"head_sha":"abc","findings":[]}'
      When run "$SCRIPT" not-a-dim
      The status should equal 2
      The stderr should include 'invalid dimension'
    End

    It 'rejects malformed input shape'
      Data <<< '{"findings":[]}'
      When run "$SCRIPT" security
      The status should equal 2
      The stderr should include 'must be a JSON object'
    End

    It 'rejects non-JSON input'
      Data <<< 'not json'
      When run "$SCRIPT" security
      The status should equal 2
      The stderr should include 'must be a JSON object'
    End
  End

  Describe 'filtering by seen_by'
    It 'includes a finding whose seen_by contains the dimension'
      Data <<< '{"head_sha":"abc","findings":[{"label":"issue","blocking":true,"category":"security","evidence":"sql","seen_by":["security"]}]}'
      When run "$SCRIPT" security
      The status should equal 0
      The output should include '"seen_by":["security"]'
      The output should include '"head_sha":"abc"'
    End

    It 'excludes a finding whose seen_by does not contain the dimension'
      Data <<< '{"head_sha":"abc","findings":[{"label":"issue","blocking":true,"category":"security","evidence":"sql","seen_by":["security"]}]}'
      When run "$SCRIPT" architecture
      The status should equal 0
      The output should include '"findings":[]'
      The output should include '"head_sha":"abc"'
    End

    It 'includes a cross-dimension finding (multi-element seen_by) for each owning dimension'
      Data <<< '{"head_sha":"abc","findings":[{"label":"issue","blocking":true,"category":"architecture","evidence":"global","seen_by":["architecture","correctness"]}]}'
      When run "$SCRIPT" correctness
      The status should equal 0
      The output should include '"seen_by":["architecture","correctness"]'
    End

    It 'excludes findings with absent seen_by (graceful legacy handling)'
      Data <<< '{"head_sha":"abc","findings":[{"label":"issue","blocking":true,"category":"security","evidence":"legacy"}]}'
      When run "$SCRIPT" security
      The status should equal 0
      The output should include '"findings":[]'
    End

    It 'excludes findings with non-array seen_by'
      Data <<< '{"head_sha":"abc","findings":[{"label":"issue","blocking":true,"category":"security","evidence":"x","seen_by":"security"}]}'
      When run "$SCRIPT" security
      The status should equal 0
      The output should include '"findings":[]'
    End

    It 'preserves head_sha on an empty findings input'
      Data <<< '{"head_sha":"deadbeef","findings":[]}'
      When run "$SCRIPT" style
      The status should equal 0
      The output should include '"head_sha":"deadbeef"'
      The output should include '"findings":[]'
    End

    It 'returns each surviving finding when multiple findings match the dimension'
      Data <<< '{"head_sha":"abc","findings":[{"label":"issue","blocking":true,"category":"security","evidence":"a","seen_by":["security"]},{"label":"nitpick","blocking":false,"category":"style","evidence":"b","seen_by":["style"]},{"label":"issue","blocking":true,"category":"security","evidence":"c","seen_by":["security","architecture"]}]}'
      When run "$SCRIPT" security
      The status should equal 0
      The output should include '"evidence":"a"'
      The output should include '"evidence":"c"'
      The output should not include '"evidence":"b"'
    End
  End
End
