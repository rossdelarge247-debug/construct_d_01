#!/bin/bash
# v3b AC-13 — meta-tests for v3a verify-slice.sh Gate 5 lcov parser.
# Per docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md AC-13
# (carry-over #4 from v3a session 40: parser landed at commit 95481e5
# without a shellspec; v3b ships the missing test).
#
# Path divergence note: AC-13 §Verification literal cites
# `spec/verify-slice/lcov-parser_spec.sh`; repo convention (per existing 9
# specs at tests/shellspec/*.spec.sh) is honoured here. Verification.md
# AC-13 row records the divergence + reasoning.
#
# Per AC-13 §Scope ("tests document not modify"): the awk script under test
# is replicated verbatim from scripts/verify-slice.sh:185-189 rather than
# extracted into a wrapper. Testing-by-replication; if the parser changes,
# this spec must be updated in lockstep — guard against silent drift.
#
# H6 RED-tests-first does NOT apply to AC-13: tests document existing
# behaviour; no GREEN impl commit follows. Spec is GREEN on first run.

Describe 'verify-slice.sh Gate 5 lcov parser (v3a AC-6 / v3b AC-13)'
  fixtures_dir="tests/shellspec/fixtures"

  # Replicates scripts/verify-slice.sh:185-189 awk script verbatim.
  # If you edit the parser there, update this function in lockstep.
  parse_uncovered_lines() {
    local target_file="$1" lcov="$2"
    awk -v target="SF:$target_file" '
      $0==target { in_block=1; next }
      /^end_of_record$/ { in_block=0 }
      in_block && /^DA:[0-9]+,0$/ { sub(/DA:/,""); sub(/,0$/,""); print }
    ' "$lcov" | sort -un
  }

  Describe 'fixture (a) — fully-covered file (lcov-ok.info)'
    It 'reports zero uncovered lines'
      When call parse_uncovered_lines "src/foo.ts" "$fixtures_dir/lcov-ok.info"
      The status should be success
      The output should equal ""
    End
  End

  Describe 'fixture (b) — under-covered file (lcov-under.info)'
    It 'reports the line numbers of DA:N,0 entries inside the matching SF: block'
      When call parse_uncovered_lines "src/foo.ts" "$fixtures_dir/lcov-under.info"
      The status should be success
      The output should equal "2
3"
    End

    It 'does not leak DA entries from a sibling SF: block (src/bar.ts)'
      # Parser must not return src/bar.ts lines when target=src/foo.ts.
      # Documents the in_block flag scoping.
      When call parse_uncovered_lines "src/bar.ts" "$fixtures_dir/lcov-under.info"
      The status should be success
      The output should equal ""
    End
  End

  Describe 'fixture (c) — malformed lcov input (lcov-malformed.info)'
    # AC-13 §Verification expected "fail-loud with parse-error message".
    # Actual parser is silent-tolerant per session-40 implementation
    # (no SF: target match → in_block stays 0 → no DA: lines printed).
    # Per AC-13 §Scope ("tests document not modify"): test asserts
    # actual behaviour and surfaces the divergence in verification.md.
    It 'is silent-tolerant — exits success and reports zero lines'
      When call parse_uncovered_lines "src/foo.ts" "$fixtures_dir/lcov-malformed.info"
      The status should be success
      The output should equal ""
    End
  End

  Describe 'fixture (d) — empty lcov input (lcov-empty.info; dormant gate per F6e)'
    # AC-13 §Verification expected "no-coverage-data warning, exit 0".
    # Actual parser is silent (no warning emitted; awk processes 0 lines).
    # Per AC-13 §Scope: documenting actual behaviour, not modifying it.
    It 'exits success and reports zero lines (no warning emitted)'
      When call parse_uncovered_lines "src/foo.ts" "$fixtures_dir/lcov-empty.info"
      The status should be success
      The output should equal ""
    End
  End
End
