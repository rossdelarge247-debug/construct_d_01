#!/bin/bash
# Tests for scripts/spawn-multi-reviewer.sh — multi-agent persona suite
# aggregator. Verifies AC-1 verifications 2 + 3 + 5 of slice
# S-INFRA-persona-suite-v2-multi-agent. (AC-1 verification 4 — workflow
# skip behaviour when ANTHROPIC_API_KEY is absent — is workflow-level,
# not aggregator-level; the aggregate subcommand has no API-key
# awareness. That verification is exercised at session-55 impl PR's
# auto-review.yml workflow tests.)
#
# Each test sets up a temporary envelopes directory with mock specialist
# outputs, invokes `aggregate <dir>`, and asserts on the unified output
# JSON. Mock envelopes use the persona output shape `{specialist,
# summary, findings[]}` per spec 72c §5.

Describe 'spawn-multi-reviewer.sh aggregate'

  setup() {
    SHELLSPEC_TMPBASE="$(mktemp -d)"
  }
  cleanup() {
    [ -n "${SHELLSPEC_TMPBASE:-}" ] && rm -rf "$SHELLSPEC_TMPBASE"
  }
  BeforeEach 'setup'
  AfterEach 'cleanup'

  write_envelope() {
    local spec="$1" body="$2"
    printf '%s' "$body" > "$SHELLSPEC_TMPBASE/$spec.json"
  }

  # Empty / clean-output mocks per specialist
  EMPTY_FINDINGS_SECURITY='{"specialist":"reviewer-security","summary":"clean","findings":[]}'
  EMPTY_FINDINGS_ARCH='{"specialist":"reviewer-architecture","summary":"clean","findings":[]}'
  EMPTY_FINDINGS_CORRECT='{"specialist":"reviewer-correctness","summary":"clean","findings":[]}'
  EMPTY_FINDINGS_STYLE='{"specialist":"reviewer-style","summary":"clean","findings":[]}'

  It 'returns approve for all-clean envelopes (4 specialists, 0 findings)'
    write_envelope security "$EMPTY_FINDINGS_SECURITY"
    write_envelope architecture "$EMPTY_FINDINGS_ARCH"
    write_envelope correctness "$EMPTY_FINDINGS_CORRECT"
    write_envelope style "$EMPTY_FINDINGS_STYLE"
    When call scripts/spawn-multi-reviewer.sh aggregate "$SHELLSPEC_TMPBASE"
    The output should include '"verdict": "approve"'
    The output should include '"would_have_been_k2": "approve"'
    The output should include '"would_have_been_k3": "approve"'
    The output should not include '"degraded"'
    The status should be success
  End

  It 'returns block at k=1 with shadow downgrade at k=2/k=3 (AC-1 verification 2)'
    # Per spec 72c §5: at k=1 any blocking finding produces block; at k=2
    # only 1 specialist flagged (seen_by length 1) so vote count < 2 →
    # downgrades to action tier (still 0 votes there because action filter
    # excludes blocking findings) → approve.
    # Per-finding schema: {label, blocking, category, evidence, remediation}
    # — no per-finding summary (top-level summary is the persona's review
    # summary; evidence is the dedup hash field per spec 72c §5 rule 2).
    write_envelope security "$EMPTY_FINDINGS_SECURITY"
    write_envelope architecture '{"specialist":"reviewer-architecture","summary":"hidden state","findings":[{"label":"issue","blocking":true,"category":"hidden-effect","evidence":"const T = Date.now()","remediation":"inject Clock interface"}]}'
    write_envelope correctness '{"specialist":"reviewer-correctness","summary":"sub","findings":[{"label":"suggestion","blocking":false,"category":"spec-citation","evidence":"per spec X","remediation":"quote it"}]}'
    write_envelope style '{"specialist":"reviewer-style","summary":"nit","findings":[{"label":"nitpick","blocking":false,"category":"naming","evidence":"data: any","remediation":"rename"}]}'
    When call scripts/spawn-multi-reviewer.sh aggregate "$SHELLSPEC_TMPBASE"
    The output should include '"verdict": "block"'
    The output should include '"would_have_been_k2": "approve"'
    The output should include '"would_have_been_k3": "approve"'
    The status should be success
  End

  It 'dedupes cross-specialist findings via SHA-256-equivalent hash and counts seen_by length as votes (AC-1 verification 5)'
    # Spec 72c §5 rule 2: identical-hash findings merge into one entry
    # with seen_by[] union; the deduped finding contributes len(seen_by)
    # votes toward the verdict tier. Hash field is evidence (not summary)
    # per spec 72c §5 rule 2 — personas don't emit per-finding summary.
    # With 2 specialists flagging the same blocking finding, at k=2
    # BLOCKING_VOTES=2 ≥ 2 → block stays. At k=3, 2 < 3 → falls to
    # approve (action tier excludes blocking).
    write_envelope security '{"specialist":"reviewer-security","summary":"x","findings":[{"label":"issue","blocking":true,"category":"security","evidence":"req.query.id","remediation":"validate at boundary"}]}'
    write_envelope correctness '{"specialist":"reviewer-correctness","summary":"x","findings":[{"label":"issue","blocking":true,"category":"security","evidence":"req.query.id","remediation":"validate at boundary"}]}'
    write_envelope architecture "$EMPTY_FINDINGS_ARCH"
    write_envelope style "$EMPTY_FINDINGS_STYLE"
    When call scripts/spawn-multi-reviewer.sh aggregate "$SHELLSPEC_TMPBASE"
    The output should include '"verdict": "block"'
    The output should include '"would_have_been_k2": "block"'
    The output should include '"would_have_been_k3": "approve"'
    The status should be success
    # Single deduped finding entry (not 2): identical evidence + label
    # + category. seen_by[] has both specialists; jq's `unique` filter
    # ensures no duplicate "correctness" entries by construction.
    The output should include '"req.query.id"'
    The output should include '"correctness"'
    The output should include '"security"'
  End

  It 'enters degraded mode when one specialist envelope is missing (AC-1 verification 3)'
    # Per spec 72c §3 session-54 amendment: specialist timeout/failure →
    # degraded mode; remaining specialists' findings aggregated normally;
    # timed-out dimension marked `inconclusive` in aggregator output;
    # NO fallback to single-agent recursive (slice-reviewer.md retired
    # per AC-5).
    write_envelope security "$EMPTY_FINDINGS_SECURITY"
    write_envelope architecture "$EMPTY_FINDINGS_ARCH"
    write_envelope style "$EMPTY_FINDINGS_STYLE"
    # correctness.json deliberately missing
    When call scripts/spawn-multi-reviewer.sh aggregate "$SHELLSPEC_TMPBASE"
    The output should include '"degraded": true'
    The output should include '"correctness"'
    The output should include '"verdict": "approve"'
    The status should be success
  End

  It 'returns parse-failed verdict when ALL specialist envelopes are missing'
    # Empty directory: 0 specialist signal → parse-failed sentinel.
    # Distinct from approve (which requires at least one specialist
    # actually returning empty findings).
    When call scripts/spawn-multi-reviewer.sh aggregate "$SHELLSPEC_TMPBASE"
    The output should include '"verdict": "parse-failed"'
    The output should include '"degraded": true'
    The output should include '"security"'
    The output should include '"architecture"'
    The output should include '"correctness"'
    The output should include '"style"'
    The status should be success
  End

  It 'classifies parse-failed sentinel ({}) and malformed JSON envelopes as inconclusive'
    # auto-review-parse.sh emits {} sentinel when persona output is
    # unparseable; aggregate must treat that as a missing/inconclusive
    # envelope rather than an approve. Same path for non-JSON garbage.
    write_envelope security '{}'
    write_envelope architecture "$EMPTY_FINDINGS_ARCH"
    write_envelope correctness 'not valid json'
    write_envelope style "$EMPTY_FINDINGS_STYLE"
    When call scripts/spawn-multi-reviewer.sh aggregate "$SHELLSPEC_TMPBASE"
    The output should include '"degraded": true'
    The output should include '"security"'
    The output should include '"correctness"'
    The output should include '"verdict": "approve"'
    The status should be success
  End

  It 'rejects unknown subcommand with exit 2'
    When call scripts/spawn-multi-reviewer.sh bogus
    The status should equal 2
    The stderr should include 'usage:'
  End

  It 'rejects aggregate without a directory argument'
    When call scripts/spawn-multi-reviewer.sh aggregate
    The status should equal 2
    The stderr should include 'usage:'
  End

  It 'rejects aggregate when directory does not exist'
    When call scripts/spawn-multi-reviewer.sh aggregate /nonexistent/sm-tmp-bogus-xyz
    The status should equal 2
    The stderr should include 'directory not found'
  End

End
