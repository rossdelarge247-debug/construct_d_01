#!/bin/bash
# Tests for scripts/canvas-decode-check.sh — AC-2 CI gate.
# Per docs/slices/S-INFRA-rigour-v3d-canvas-decode-and-spec-quote-gates/test-plan.md AC-2.

Describe 'scripts/canvas-decode-check.sh'

  setup() {
    TMP="$(mktemp -d)"
    SCRIPT="$PWD/scripts/canvas-decode-check.sh"
    GLOB="$TMP/docs/slices/S-*/acceptance.md"
  }
  cleanup() {
    [ -n "${TMP:-}" ] && rm -rf "$TMP"
  }
  BeforeEach 'setup'
  AfterEach 'cleanup'

  # Helper: write a slice fixture under $TMP. $1=slice-name, $2=acceptance-content,
  # $3=verification-content (may be empty). Creates docs/slices/S-$1/{acceptance,verification}.md.
  write_slice() {
    local name="$1" acc="$2" ver="${3:-}"
    mkdir -p "$TMP/docs/slices/S-$name"
    printf '%s' "$acc" > "$TMP/docs/slices/S-$name/acceptance.md"
    if [ -n "$ver" ]; then
      printf '%s' "$ver" > "$TMP/docs/slices/S-$name/verification.md"
    fi
    return 0
  }

  # Helper: write a synthetic bundled canvas at $1=slug, $2=basename. Optional $3=decoded-content.
  write_canvas() {
    local slug="$1" base="$2" decoded="${3:-}"
    mkdir -p "$TMP/docs/design-source/$slug"
    printf '<html><head><script type="__bundler/template">"<!DOCTYPE html><body>real</body>"</script></head></html>' \
      > "$TMP/docs/design-source/$slug/$base"
    if [ -n "$decoded" ]; then
      mkdir -p "$TMP/docs/design-source/$slug/decoded"
      printf '%s' "$decoded" > "$TMP/docs/design-source/$slug/decoded/$base"
    fi
  }

  It 'passes when slice cites bundled canvas + sibling decoded exists'
    write_slice "TEST-pass-decoded" \
      'AC-1 cites docs/design-source/test-slug/file.html for visual fidelity.'
    write_canvas "test-slug" "file.html" "<html>decoded</html>"
    When run "$SCRIPT" "$GLOB" "$TMP"
    The status should be success
  End

  It 'fails when slice cites bundled canvas + no decoded sibling + no waiver'
    write_slice "TEST-fail-no-decoded" \
      'AC-1 cites docs/design-source/test-slug/file.html for visual fidelity.'
    write_canvas "test-slug" "file.html"
    When run "$SCRIPT" "$GLOB" "$TMP"
    The status should be failure
    The stderr should include 'no decoded sibling'
    The stderr should include 'docs/design-source/test-slug/file.html'
  End

  It 'passes when slice cites bundled canvas + no decoded BUT verification.md has waiver'
    write_slice "TEST-pass-waiver" \
      'AC-1 cites docs/design-source/test-slug/file.html for visual fidelity.' \
      '## Waivers
- canvas-decode-waiver: docs/design-source/test-slug/file.html — canvas lives on a sibling branch'
    write_canvas "test-slug" "file.html"
    When run "$SCRIPT" "$GLOB" "$TMP"
    The status should be success
  End

  It 'skips canvas references that point to files absent from the tree'
    write_slice "TEST-skip-missing" \
      'AC-1 cites docs/design-source/missing-slug/missing-file.html for visual fidelity.'
    # No write_canvas call — file does not exist.
    When run "$SCRIPT" "$GLOB" "$TMP"
    The status should be success
  End

  It 'skips canvas references when the file is not bundled-format'
    write_slice "TEST-skip-non-bundled" \
      'AC-1 cites docs/design-source/test-slug/file.html for visual fidelity.'
    mkdir -p "$TMP/docs/design-source/test-slug"
    printf '<html><body>regular HTML, no bundler template</body></html>' \
      > "$TMP/docs/design-source/test-slug/file.html"
    When run "$SCRIPT" "$GLOB" "$TMP"
    The status should be success
  End

  It 'reports each violation across multiple slices'
    write_slice "TEST-multi-1" \
      'AC-1 cites docs/design-source/slug-a/a.html for visual fidelity.'
    write_slice "TEST-multi-2" \
      'AC-2 cites docs/design-source/slug-b/b.html for visual fidelity.'
    write_canvas "slug-a" "a.html"
    write_canvas "slug-b" "b.html"
    When run "$SCRIPT" "$GLOB" "$TMP"
    The status should be failure
    The stderr should include '2 violation'
    The stderr should include 'slug-a/a.html'
    The stderr should include 'slug-b/b.html'
  End

End
