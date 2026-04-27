#!/bin/bash
# S-37-3 — meta-tests for scripts/hooks-checksums.sh.
# Generate / verify roundtrip + drift detection in fixture root.

Describe 'hooks-checksums.sh'
  setup() {
    SPEC_TMP="$(mktemp -d -t hooks-checksums-spec.XXXXXX)"
    mkdir -p "$SPEC_TMP/.claude/hooks"
    mkdir -p "$SPEC_TMP/scripts"
    printf '#!/bin/bash\n' > "$SPEC_TMP/.claude/hooks/foo.sh"
    printf '#!/bin/bash\n' > "$SPEC_TMP/.claude/hooks/bar.sh"
    printf '#!/bin/bash\n' > "$SPEC_TMP/scripts/verify-slice.sh"
    cat > "$SPEC_TMP/.claude/settings.json" <<'JSON'
{"hooks": {"SessionStart": [{}]}}
JSON
  }
  cleanup() {
    rm -rf "$SPEC_TMP"
  }
  BeforeEach 'setup'
  AfterEach 'cleanup'

  It '--generate writes baseline with one entry per artefact'
    When call scripts/hooks-checksums.sh --generate "$SPEC_TMP"
    The status should be success
    The path "$SPEC_TMP/.claude/hooks-checksums.txt" should be exist
    The contents of file "$SPEC_TMP/.claude/hooks-checksums.txt" should include '.claude/hooks/foo.sh'
    The contents of file "$SPEC_TMP/.claude/hooks-checksums.txt" should include '.claude/hooks/bar.sh'
    The contents of file "$SPEC_TMP/.claude/hooks-checksums.txt" should include 'scripts/verify-slice.sh'
    The contents of file "$SPEC_TMP/.claude/hooks-checksums.txt" should include '.claude/settings.json#hooks'
    The stderr should include 'wrote'
  End

  It '--verify passes immediately after --generate'
    scripts/hooks-checksums.sh --generate "$SPEC_TMP" >/dev/null 2>&1
    When call scripts/hooks-checksums.sh --verify "$SPEC_TMP"
    The status should be success
  End

  It '--verify detects drift and emits useful-message on hook modification'
    scripts/hooks-checksums.sh --generate "$SPEC_TMP" >/dev/null 2>&1
    printf '# tampered\n' >> "$SPEC_TMP/.claude/hooks/foo.sh"
    When call scripts/hooks-checksums.sh --verify "$SPEC_TMP"
    The status should be failure
    The stderr should include 'drift detected'
    The stderr should match pattern '*Actionable alternatives*'
  End

  It '--verify with no baseline exits non-zero with actionable message'
    When call scripts/hooks-checksums.sh --verify "$SPEC_TMP"
    The status should be failure
    The stderr should include 'baseline not found'
  End
End
