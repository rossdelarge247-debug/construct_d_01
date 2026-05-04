#!/bin/bash
# Tests for tests/personas/match-synthetic.sh — pure jq predicate
# evaluator that decides whether a persona's envelope satisfies the
# synthetic-injection expected-finding signature.
#
# Coverage: PASS path (all predicates satisfied) + per-predicate FAIL
# paths (count, label, blocking, category, evidence, remediation) +
# missing-input-file precondition exit-2.

Describe 'match-synthetic.sh'

  # Capture absolute path before setup() cds into the spec's tmpdir.
  MATCH_SCRIPT="$PWD/tests/personas/match-synthetic.sh"

  setup() {
    SPEC_TMP="$(mktemp -d -t match-synthetic-spec.XXXXXX)"
    cd "$SPEC_TMP" || return

    cat > expected.json <<'EOF'
{
  "dimension": "security",
  "fixture_path": "tests/personas/synthetic/security.diff",
  "planted_defect_summary": "x",
  "expected_finding": {
    "label_in": ["issue", "todo"],
    "blocking_in": [true],
    "category_pattern": "(?i)security",
    "evidence_must_contain_any_of": ["dangerouslySetInnerHTML"],
    "remediation_must_contain_any_of": ["sanitize"]
  },
  "min_findings_count": 1
}
EOF
  }

  cleanup() {
    cd / || return
    rm -rf "$SPEC_TMP"
  }

  BeforeEach 'setup'
  AfterEach 'cleanup'

  It 'PASSes when one finding satisfies all predicates'
    cat > envelope.json <<'EOF'
{
  "specialist": "reviewer-security",
  "summary": "x",
  "findings": [
    {
      "label": "issue",
      "blocking": true,
      "category": "security",
      "evidence": "dangerouslySetInnerHTML={{ __html: comment.body }}",
      "remediation": "Sanitize the HTML with DOMPurify before rendering."
    }
  ]
}
EOF
    When call "$MATCH_SCRIPT" envelope.json expected.json
    The output should include 'PASS'
    The status should be success
  End

  It 'FAILs on empty findings (count predicate)'
    cat > envelope.json <<'EOF'
{"specialist":"reviewer-security","summary":"x","findings":[]}
EOF
    When call "$MATCH_SCRIPT" envelope.json expected.json
    The stderr should include 'envelope has 0 finding'
    The status should be failure
  End

  It 'FAILs when finding has wrong label'
    cat > envelope.json <<'EOF'
{
  "specialist": "reviewer-security",
  "summary": "x",
  "findings": [
    {
      "label": "thought",
      "blocking": true,
      "category": "security",
      "evidence": "dangerouslySetInnerHTML",
      "remediation": "sanitize"
    }
  ]
}
EOF
    When call "$MATCH_SCRIPT" envelope.json expected.json
    The stderr should include 'no finding matched'
    The status should be failure
  End

  It 'FAILs when finding has wrong blocking value'
    cat > envelope.json <<'EOF'
{
  "specialist": "reviewer-security",
  "summary": "x",
  "findings": [
    {
      "label": "issue",
      "blocking": false,
      "category": "security",
      "evidence": "dangerouslySetInnerHTML",
      "remediation": "sanitize"
    }
  ]
}
EOF
    When call "$MATCH_SCRIPT" envelope.json expected.json
    The stderr should include 'no finding matched'
    The status should be failure
  End

  It 'FAILs when finding has wrong category'
    cat > envelope.json <<'EOF'
{
  "specialist": "reviewer-security",
  "summary": "x",
  "findings": [
    {
      "label": "issue",
      "blocking": true,
      "category": "naming",
      "evidence": "dangerouslySetInnerHTML",
      "remediation": "sanitize"
    }
  ]
}
EOF
    When call "$MATCH_SCRIPT" envelope.json expected.json
    The stderr should include 'no finding matched'
    The status should be failure
  End

  It 'FAILs when evidence keyword set has no match'
    cat > envelope.json <<'EOF'
{
  "specialist": "reviewer-security",
  "summary": "x",
  "findings": [
    {
      "label": "issue",
      "blocking": true,
      "category": "security",
      "evidence": "some other code without the canonical keyword",
      "remediation": "sanitize"
    }
  ]
}
EOF
    When call "$MATCH_SCRIPT" envelope.json expected.json
    The stderr should include 'no finding matched'
    The status should be failure
  End

  It 'FAILs when remediation keyword set has no match'
    cat > envelope.json <<'EOF'
{
  "specialist": "reviewer-security",
  "summary": "x",
  "findings": [
    {
      "label": "issue",
      "blocking": true,
      "category": "security",
      "evidence": "dangerouslySetInnerHTML",
      "remediation": "do something else entirely"
    }
  ]
}
EOF
    When call "$MATCH_SCRIPT" envelope.json expected.json
    The stderr should include 'no finding matched'
    The status should be failure
  End

  It 'exits 2 when envelope file is missing'
    When call "$MATCH_SCRIPT" /nonexistent/envelope.json expected.json
    The stderr should include 'envelope not found'
    The status should equal 2
  End

  It 'exits 2 when expected file is missing'
    cat > envelope.json <<'EOF'
{"specialist":"reviewer-security","summary":"x","findings":[]}
EOF
    When call "$MATCH_SCRIPT" envelope.json /nonexistent/expected.json
    The stderr should include 'expected not found'
    The status should equal 2
  End
End
