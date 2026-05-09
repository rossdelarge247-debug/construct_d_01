#!/bin/bash
# Tests for scripts/decode-bundler-canvas.sh — bundled-HTML canvas decoder.
#
# The decoder is a pure transform: input file path or stdin → output to
# sibling decoded/ dir or stdout. Tests cover the trigger forms, error
# paths, and output-existence guard.

Describe 'scripts/decode-bundler-canvas.sh'

  setup() {
    TMPDIR_TEST="$(mktemp -d)"
    cp tests/shellspec/fixtures/decode-bundler-canvas/minimal-bundled.html \
       "$TMPDIR_TEST/canvas.html"
  }
  cleanup() {
    [ -n "${TMPDIR_TEST:-}" ] && rm -rf "$TMPDIR_TEST"
  }
  BeforeEach 'setup'
  AfterEach 'cleanup'

  It 'decodes synthetic fixture and writes to sibling decoded/ dir'
    When call scripts/decode-bundler-canvas.sh "$TMPDIR_TEST/canvas.html"
    The status should be success
    The stderr should include 'decoded → '
    The path "$TMPDIR_TEST/decoded/canvas.html" should be exist
  End

  It 'decoded output contains the inner-doc markup, not the loader shell'
    When call scripts/decode-bundler-canvas.sh "$TMPDIR_TEST/canvas.html"
    The status should be success
    The stderr should include 'decoded → '
    The contents of file "$TMPDIR_TEST/decoded/canvas.html" should include 'Decoded inner doc'
    The contents of file "$TMPDIR_TEST/decoded/canvas.html" should include 'bg-blue-500'
    The contents of file "$TMPDIR_TEST/decoded/canvas.html" should not include '__bundler_loading'
  End

  It 'reads stdin when input is - and writes to stdout'
    When call sh -c "scripts/decode-bundler-canvas.sh - < $TMPDIR_TEST/canvas.html"
    The status should be success
    The output should include 'Decoded inner doc'
    The output should include 'bg-blue-500'
  End

  It 'writes to stdout when --stdout is passed'
    When call scripts/decode-bundler-canvas.sh "$TMPDIR_TEST/canvas.html" --stdout
    The status should be success
    The output should include 'Decoded inner doc'
    The path "$TMPDIR_TEST/decoded/canvas.html" should not be exist
  End

  It 'fails loud when input file does not exist'
    When call scripts/decode-bundler-canvas.sh "$TMPDIR_TEST/missing.html"
    The status should be failure
    The stderr should include 'input not found'
  End

  It 'fails loud when input lacks __bundler/template script tag'
    printf '<html><body>no template here</body></html>' > "$TMPDIR_TEST/notemplate.html"
    When call scripts/decode-bundler-canvas.sh "$TMPDIR_TEST/notemplate.html"
    The status should be failure
    The stderr should include 'no <script type="__bundler/template">'
  End

  It 'fails loud on malformed JSON inside template'
    printf '%s' '<html><body><script type="__bundler/template">not_valid_json{</script></body></html>' \
      > "$TMPDIR_TEST/badjson.html"
    When call scripts/decode-bundler-canvas.sh "$TMPDIR_TEST/badjson.html"
    The status should be failure
    The stderr should include 'failed to JSON-parse'
    The path "$TMPDIR_TEST/decoded/badjson.html" should not be exist
  End

  It 'refuses to overwrite existing output without --force'
    scripts/decode-bundler-canvas.sh "$TMPDIR_TEST/canvas.html" >/dev/null 2>&1
    When call scripts/decode-bundler-canvas.sh "$TMPDIR_TEST/canvas.html"
    The status should be failure
    The stderr should include 'output exists at'
  End

  It 'overwrites existing output with --force'
    scripts/decode-bundler-canvas.sh "$TMPDIR_TEST/canvas.html" >/dev/null 2>&1
    When call scripts/decode-bundler-canvas.sh "$TMPDIR_TEST/canvas.html" --force
    The status should be success
    The stderr should include 'decoded → '
    The path "$TMPDIR_TEST/decoded/canvas.html" should be exist
  End

  It 'rejects unknown args'
    When call scripts/decode-bundler-canvas.sh "$TMPDIR_TEST/canvas.html" --unknown-flag
    The status should equal 2
    The stderr should include 'unknown arg'
  End

  It 'usage on no args, exit 2'
    When call scripts/decode-bundler-canvas.sh
    The status should equal 2
    The stderr should include 'usage:'
  End

End
