#!/bin/bash

Describe 'scripts/validate-finding-envelope.sh'
  SCRIPT='scripts/validate-finding-envelope.sh'
  VALID_ENVELOPE='{"specialist":"reviewer-security","summary":"clean","findings":[{"label":"issue","blocking":true,"category":"security","evidence":"sql injection in route","remediation":"parameterise"}]}'

  Describe 'happy path'
    It 'accepts a valid envelope with one finding'
      Data <<< "$VALID_ENVELOPE"
      When run "$SCRIPT"
      The status should equal 0
    End

    It 'accepts a valid envelope with empty findings'
      Data <<< '{"specialist":"reviewer-style","summary":"clean diff; no style findings","findings":[]}'
      When run "$SCRIPT"
      The status should equal 0
    End

    It 'accepts the reviewer-architecture specialist value'
      Data <<< '{"specialist":"reviewer-architecture","summary":"x","findings":[]}'
      When run "$SCRIPT"
      The status should equal 0
    End

    It 'accepts the reviewer-correctness specialist value'
      Data <<< '{"specialist":"reviewer-correctness","summary":"x","findings":[]}'
      When run "$SCRIPT"
      The status should equal 0
    End
  End

  Describe 'root-level invalid inputs'
    It 'rejects non-JSON input'
      Data <<< 'not json'
      When run "$SCRIPT"
      The status should equal 1
      The stderr should include 'not valid JSON'
    End

    It 'rejects a non-object root (array)'
      Data <<< '[]'
      When run "$SCRIPT"
      The status should equal 1
      The stderr should include 'must be a JSON object'
    End

    It 'rejects missing required root keys'
      Data <<< '{"specialist":"reviewer-security","summary":"x"}'
      When run "$SCRIPT"
      The status should equal 1
      The stderr should include 'root keys must be exactly'
    End

    It 'rejects additional root keys'
      Data <<< '{"specialist":"reviewer-security","summary":"x","findings":[],"verdict":"approve"}'
      When run "$SCRIPT"
      The status should equal 1
      The stderr should include 'no additional properties'
    End

    It 'rejects an invalid specialist enum value'
      Data <<< '{"specialist":"reviewer-ux","summary":"x","findings":[]}'
      When run "$SCRIPT"
      The status should equal 1
      The stderr should include 'specialist must be one of'
    End

    It 'rejects an empty summary string'
      Data <<< '{"specialist":"reviewer-security","summary":"","findings":[]}'
      When run "$SCRIPT"
      The status should equal 1
      The stderr should include 'summary must be a non-empty string'
    End

    It 'rejects findings that is not an array'
      Data <<< '{"specialist":"reviewer-security","summary":"x","findings":"none"}'
      When run "$SCRIPT"
      The status should equal 1
      The stderr should include 'findings must be an array'
    End
  End

  Describe 'finding-level invalid inputs'
    It 'rejects a finding with an invalid label enum value'
      Data <<< '{"specialist":"reviewer-security","summary":"x","findings":[{"label":"warning","blocking":true,"category":"x","evidence":"y","remediation":"z"}]}'
      When run "$SCRIPT"
      The status should equal 1
      The stderr should include 'Conventional Comments value'
    End

    It 'rejects a finding with blocking as string instead of boolean'
      Data <<< '{"specialist":"reviewer-security","summary":"x","findings":[{"label":"issue","blocking":"true","category":"x","evidence":"y","remediation":"z"}]}'
      When run "$SCRIPT"
      The status should equal 1
      The stderr should include 'invalid shape'
    End

    It 'rejects a finding with empty category string'
      Data <<< '{"specialist":"reviewer-security","summary":"x","findings":[{"label":"issue","blocking":true,"category":"","evidence":"y","remediation":"z"}]}'
      When run "$SCRIPT"
      The status should equal 1
      The stderr should include 'invalid shape'
    End

    It 'rejects a finding missing the remediation key'
      Data <<< '{"specialist":"reviewer-security","summary":"x","findings":[{"label":"issue","blocking":true,"category":"x","evidence":"y"}]}'
      When run "$SCRIPT"
      The status should equal 1
      The stderr should include 'invalid shape'
    End

    It 'rejects a finding with additional properties'
      Data <<< '{"specialist":"reviewer-security","summary":"x","findings":[{"label":"issue","blocking":true,"category":"x","evidence":"y","remediation":"z","severity":"high"}]}'
      When run "$SCRIPT"
      The status should equal 1
      The stderr should include 'invalid shape'
    End

    It 'accepts each Conventional Comments label value'
      Data <<< '{"specialist":"reviewer-style","summary":"x","findings":[{"label":"praise","blocking":false,"category":"x","evidence":"y","remediation":"z"},{"label":"nitpick","blocking":false,"category":"x","evidence":"y","remediation":"z"},{"label":"suggestion","blocking":false,"category":"x","evidence":"y","remediation":"z"},{"label":"issue","blocking":true,"category":"x","evidence":"y","remediation":"z"},{"label":"todo","blocking":true,"category":"x","evidence":"y","remediation":"z"},{"label":"question","blocking":false,"category":"x","evidence":"y","remediation":"z"},{"label":"thought","blocking":false,"category":"x","evidence":"y","remediation":"z"},{"label":"chore","blocking":false,"category":"x","evidence":"y","remediation":"z"},{"label":"note","blocking":false,"category":"x","evidence":"y","remediation":"z"}]}'
      When run "$SCRIPT"
      The status should equal 0
    End
  End
End
