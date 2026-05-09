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

Describe 'scripts/decode-bundler-canvas.sh — manifest substitution'

  setup() {
    TMPDIR_TEST="$(mktemp -d)"
    cp tests/shellspec/fixtures/decode-bundler-canvas/manifest-bundled.html \
       "$TMPDIR_TEST/canvas.html"
  }
  cleanup() {
    [ -n "${TMPDIR_TEST:-}" ] && rm -rf "$TMPDIR_TEST"
  }
  BeforeEach 'setup'
  AfterEach 'cleanup'

  It 'inlines text/babel script body from UUID-referenced manifest entry'
    When call scripts/decode-bundler-canvas.sh "$TMPDIR_TEST/canvas.html"
    The status should be success
    The stderr should include 'decoded → '
    The contents of file "$TMPDIR_TEST/decoded/canvas.html" should include 'inline-babel-marker'
    The contents of file "$TMPDIR_TEST/decoded/canvas.html" should include '<script type="text/babel">'
    The contents of file "$TMPDIR_TEST/decoded/canvas.html" should not include '11111111-1111-4111-8111-111111111111'
  End

  It 'replaces non-script UUIDs (font) with self-contained data: URLs'
    When call scripts/decode-bundler-canvas.sh "$TMPDIR_TEST/canvas.html"
    The status should be success
    The stderr should include 'decoded → '
    The contents of file "$TMPDIR_TEST/decoded/canvas.html" should include 'data:font/woff2;base64,'
    The contents of file "$TMPDIR_TEST/decoded/canvas.html" should not include '22222222-2222-4222-8222-222222222222'
  End

  It 'preserves template body around substituted UUIDs'
    When call scripts/decode-bundler-canvas.sh "$TMPDIR_TEST/canvas.html"
    The status should be success
    The stderr should include 'decoded → '
    The contents of file "$TMPDIR_TEST/decoded/canvas.html" should include 'manifest-test-marker'
    The contents of file "$TMPDIR_TEST/decoded/canvas.html" should include '@font-face'
  End

  It 'decompresses gzipped manifest entries via base64 → gunzip pipeline'
    BABEL_UUID='33333333-3333-4333-8333-333333333333'
    BABEL_GZIP_B64=$(printf '%s' 'console.log("compressed-marker");' | gzip | base64 -w0)
    cat > "$TMPDIR_TEST/compressed.html" <<EOF
<!DOCTYPE html>
<html><body>
<script type="__bundler/manifest">{"${BABEL_UUID}":{"mime":"text/javascript","compressed":true,"data":"${BABEL_GZIP_B64}"}}</script>
<script type="__bundler/template">"<html><body><script type=\"text/babel\" src=\"${BABEL_UUID}\"><\/script></body></html>"</script>
</body></html>
EOF
    When call scripts/decode-bundler-canvas.sh "$TMPDIR_TEST/compressed.html"
    The status should be success
    The stderr should include 'decoded → '
    The contents of file "$TMPDIR_TEST/decoded/compressed.html" should include 'compressed-marker'
    The contents of file "$TMPDIR_TEST/decoded/compressed.html" should not include '33333333-3333-4333-8333-333333333333'
  End

  It 'leaves output untouched when manifest carries no UUID-keyed entries'
    cp tests/shellspec/fixtures/decode-bundler-canvas/minimal-bundled.html \
       "$TMPDIR_TEST/no-uuids.html"
    When call scripts/decode-bundler-canvas.sh "$TMPDIR_TEST/no-uuids.html"
    The status should be success
    The stderr should include 'decoded → '
    The contents of file "$TMPDIR_TEST/decoded/no-uuids.html" should include 'Decoded inner doc'
    The contents of file "$TMPDIR_TEST/decoded/no-uuids.html" should include 'bg-blue-500'
  End

End
