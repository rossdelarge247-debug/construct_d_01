#!/bin/bash
# Tests for scripts/spec-citation-quote-check.sh — AC-4 CI mirror.

Describe 'scripts/spec-citation-quote-check.sh'

  setup() {
    TMP="$(mktemp -d)"
    SCRIPT="$PWD/scripts/spec-citation-quote-check.sh"
    GLOB="$TMP/docs/slices/S-*/*.md $TMP/docs/workspace-spec/*.md"
    mkdir -p "$TMP/docs/workspace-spec" "$TMP/docs/slices"
  }
  cleanup() {
    [ -n "${TMP:-}" ] && rm -rf "$TMP"
  }
  BeforeEach 'setup'
  AfterEach 'cleanup'

  write_spec() {
    local id="$1" body="$2"
    printf '%s' "$body" > "$TMP/docs/workspace-spec/${id}-foo.md"
  }
  write_slice_doc() {
    local name="$1" file="$2" body="$3"
    mkdir -p "$TMP/docs/slices/S-$name"
    printf '%s' "$body" > "$TMP/docs/slices/S-$name/$file"
    return 0
  }

  It 'passes when slice cites real spec + matching quote'
    write_spec "72d" "# Spec 72d

The plan-architect rubric covers five questions about seams and effects."
    write_slice_doc "TEST-A" "acceptance.md" \
      "## Authorisation

This claim is per spec 72d, in detail:

> *\"covers five questions about seams and effects\"*

The quote substring matches normalised spec content."
    When run env BASE_DIR="$TMP" "$SCRIPT" "$TMP/docs/slices/S-*/*.md" "$TMP/docs/workspace-spec/*.md"
    The status should be success
  End

  It 'fails when slice cites real spec but quote is fabricated'
    write_spec "72d" "# Spec 72d

The plan-architect rubric covers five questions about seams and effects."
    write_slice_doc "TEST-B" "acceptance.md" \
      "## Authorisation

This claim is per spec 72d, in detail:

> *\"this exact text definitely is not in the cited spec at all\"*

Quote does not match spec content."
    When run env BASE_DIR="$TMP" "$SCRIPT" "$TMP/docs/slices/S-*/*.md" "$TMP/docs/workspace-spec/*.md"
    The status should be failure
    The stderr should include 'not found in cited spec'
  End

  It 'passes when whitespace differs between local quote and spec text'
    write_spec "72d" "# Spec 72d

Plan-architect rubric covers five
questions about seams and effects."
    write_slice_doc "TEST-C" "acceptance.md" \
      "## Authorisation

Per spec 72d, on the rubric:

> *\"covers five questions about seams and effects\"*

Whitespace differences should be normalised."
    When run env BASE_DIR="$TMP" "$SCRIPT" "$TMP/docs/slices/S-*/*.md" "$TMP/docs/workspace-spec/*.md"
    The status should be success
  End

  It 'fails when cited spec has no matching file'
    write_slice_doc "TEST-D" "acceptance.md" \
      "## Authorisation

Per spec 99z (does not exist):

> *\"this is a quote of arbitrary text from a fake spec section\"*

Spec file should not resolve."
    When run env BASE_DIR="$TMP" "$SCRIPT" "$TMP/docs/slices/S-*/*.md" "$TMP/docs/workspace-spec/*.md"
    The status should be failure
    The stderr should include 'no file'
  End

  It 'fails when citation has no proximity quote'
    write_spec "72d" "# Spec 72d
Some content here for the spec body."
    write_slice_doc "TEST-E" "acceptance.md" \
      "## Authorisation

Per spec 72d, the rule is important.

But there is no quote following it.

Just more prose."
    When run env BASE_DIR="$TMP" "$SCRIPT" "$TMP/docs/slices/S-*/*.md" "$TMP/docs/workspace-spec/*.md"
    The status should be failure
    The stderr should include 'no proximity quote'
  End

  It 'exempts §Status section content'
    write_spec "72d" "# Spec 72d
Body."
    write_slice_doc "TEST-F" "acceptance.md" \
      "# S-X

## Status

Authoring per spec 72d this round; no quote needed inside §Status."
    When run env BASE_DIR="$TMP" "$SCRIPT" "$TMP/docs/slices/S-*/*.md" "$TMP/docs/workspace-spec/*.md"
    The status should be success
  End

  It 'exempts blockquote-line content from trigger scan'
    write_spec "72d" "# Spec 72d
Body."
    write_slice_doc "TEST-G" "acceptance.md" \
      "# S-X

Quoting prior failure analysis:

> Specs were never read; citations like 'per spec 65 §X' appeared.

The trigger inside the blockquote does not fire."
    When run env BASE_DIR="$TMP" "$SCRIPT" "$TMP/docs/slices/S-*/*.md" "$TMP/docs/workspace-spec/*.md"
    The status should be success
  End

  It 'does NOT trigger on numeric-section doc-pointer (spec NN §N)'
    write_spec "72d" "# Spec 72d
Body."
    write_slice_doc "TEST-H" "acceptance.md" \
      "## Scope

This slice amends spec 72d §5 by adding Q6.

No quote needed for doc-pointer."
    When run env BASE_DIR="$TMP" "$SCRIPT" "$TMP/docs/slices/S-*/*.md" "$TMP/docs/workspace-spec/*.md"
    The status should be success
  End

End
