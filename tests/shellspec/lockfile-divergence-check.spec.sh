#!/bin/bash
# Tests for scripts/lockfile-divergence-check.sh — detect version drift
# between package-lock.json and pnpm-lock.yaml for shared packages.

Describe 'lockfile-divergence-check.sh'
  SCRIPT="$PWD/scripts/lockfile-divergence-check.sh"

  setup() {
    SPEC_TMP="$(mktemp -d -t lockfile-div-spec.XXXXXX)"
    cd "$SPEC_TMP" || return
  }
  cleanup() {
    cd / || return
    rm -rf "$SPEC_TMP"
  }
  BeforeEach 'setup'
  AfterEach 'cleanup'

  It 'exits 2 when package-lock.json is missing'
    cat > pnpm-lock.yaml <<'YAML'
packages:
  /foo@1.0.0:
    resolution: { integrity: x }
YAML
    When call "$SCRIPT" "$SPEC_TMP"
    The status should equal 2
    The stderr should include 'package-lock.json missing'
  End

  It 'exits 2 when pnpm-lock.yaml is missing'
    cat > package-lock.json <<'JSON'
{ "packages": { "node_modules/foo": { "version": "1.0.0" } } }
JSON
    When call "$SCRIPT" "$SPEC_TMP"
    The status should equal 2
    The stderr should include 'pnpm-lock.yaml missing'
  End

  It 'passes when shared packages have matching versions'
    cat > package-lock.json <<'JSON'
{
  "packages": {
    "": { "name": "test" },
    "node_modules/foo": { "version": "1.0.0" },
    "node_modules/bar": { "version": "2.5.0" }
  }
}
JSON
    cat > pnpm-lock.yaml <<'YAML'
packages:
  /foo@1.0.0:
    resolution: { integrity: x }
  /bar@2.5.0:
    resolution: { integrity: y }
YAML
    When call "$SCRIPT" "$SPEC_TMP"
    The status should be success
    The output should include 'OK: no lockfile divergence'
  End

  It 'fails when a shared package has divergent versions'
    cat > package-lock.json <<'JSON'
{
  "packages": {
    "": { "name": "test" },
    "node_modules/foo": { "version": "1.0.0" }
  }
}
JSON
    cat > pnpm-lock.yaml <<'YAML'
packages:
  /foo@2.0.0:
    resolution: { integrity: x }
YAML
    When call "$SCRIPT" "$SPEC_TMP"
    The status should be failure
    The stderr should include 'foo: npm=1.0.0 pnpm=2.0.0'
  End

  It 'passes when version sets intersect (multi-version pnpm)'
    cat > package-lock.json <<'JSON'
{
  "packages": {
    "": { "name": "test" },
    "node_modules/foo": { "version": "1.0.0" }
  }
}
JSON
    cat > pnpm-lock.yaml <<'YAML'
packages:
  /foo@1.0.0:
    resolution: { integrity: x }
  /foo@1.5.0:
    resolution: { integrity: y }
YAML
    When call "$SCRIPT" "$SPEC_TMP"
    The status should be success
  End

  It 'ignores packages present in only one lockfile'
    cat > package-lock.json <<'JSON'
{
  "packages": {
    "": { "name": "test" },
    "node_modules/foo": { "version": "1.0.0" },
    "node_modules/onlynpm": { "version": "5.0.0" }
  }
}
JSON
    cat > pnpm-lock.yaml <<'YAML'
packages:
  /foo@1.0.0:
    resolution: { integrity: x }
  /onlypnpm@7.0.0:
    resolution: { integrity: y }
YAML
    When call "$SCRIPT" "$SPEC_TMP"
    The status should be success
  End

  It 'handles scoped package names containing an @ in the name'
    cat > package-lock.json <<'JSON'
{
  "packages": {
    "": { "name": "test" },
    "node_modules/@scope/foo": { "version": "1.0.0" }
  }
}
JSON
    cat > pnpm-lock.yaml <<'YAML'
packages:
  '@scope/foo@2.0.0':
    resolution: { integrity: x }
YAML
    When call "$SCRIPT" "$SPEC_TMP"
    The status should be failure
    The stderr should include '@scope/foo: npm=1.0.0 pnpm=2.0.0'
  End
End
