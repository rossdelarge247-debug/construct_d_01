#!/bin/bash
# S-37-4 — meta-tests for scripts/eslint-no-disable.sh.
# Diff-based: PRs adding eslint-disable outside allowlist must fail.

Describe 'eslint-no-disable.sh'
  setup() {
    SPEC_TMP="$(mktemp -d -t eslint-nodisable-spec.XXXXXX)"
    REPO="$SPEC_TMP"
    git -C "$REPO" init -q
    git -C "$REPO" config user.email test@test
    git -C "$REPO" config user.name test
    git -C "$REPO" config commit.gpgsign false
    mkdir -p "$REPO/docs" "$REPO/src"
    : > "$REPO/docs/eslint-baseline-allowlist.txt"
    printf 'const x = 1;\n' > "$REPO/src/foo.ts"
    git -C "$REPO" add -A
    git -C "$REPO" commit -qm base
    git -C "$REPO" branch -M main
    git -C "$REPO" checkout -qb feature 2>/dev/null
  }
  cleanup() {
    rm -rf "$SPEC_TMP"
  }
  BeforeEach 'setup'
  AfterEach 'cleanup'

  It 'passes when diff adds no eslint-disable directives'
    printf 'const y = 2;\n' > "$REPO/src/bar.ts"
    git -C "$REPO" add -A
    git -C "$REPO" commit -qm "no disable"
    When call scripts/eslint-no-disable.sh main "$REPO"
    The status should be success
  End

  It 'fails when diff adds eslint-disable in a file outside allowlist'
    cat > "$REPO/src/foo.ts" <<'TS'
// eslint-disable-next-line no-console
const x = 1;
TS
    git -C "$REPO" add -A
    git -C "$REPO" commit -qm "with disable"
    When call scripts/eslint-no-disable.sh main "$REPO"
    The status should be failure
    The stderr should include 'eslint-disable'
    The stderr should match pattern '*Actionable alternatives*'
  End

  It 'passes when eslint-disable is added in an allowlisted path-glob'
    printf 'src/foo.ts\n' >> "$REPO/docs/eslint-baseline-allowlist.txt"
    cat > "$REPO/src/foo.ts" <<'TS'
// eslint-disable-next-line no-console
const x = 1;
TS
    git -C "$REPO" add -A
    git -C "$REPO" commit -qm "disable in allowlisted file"
    When call scripts/eslint-no-disable.sh main "$REPO"
    The status should be success
  End

  It 'exits non-zero with actionable message when allowlist file missing'
    rm "$REPO/docs/eslint-baseline-allowlist.txt"
    git -C "$REPO" add -A
    git -C "$REPO" commit -qm "remove allowlist"
    When call scripts/eslint-no-disable.sh main "$REPO"
    The status should be failure
    The stderr should include 'allowlist not found'
  End
End
