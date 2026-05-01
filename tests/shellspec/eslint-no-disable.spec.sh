#!/bin/bash
# Tests for scripts/eslint-no-disable.sh — origin/main-anchored ratchet on
# eslint-disable directive count per F5c (docs/slices/S-INFRA-rigour-v3a-
# foundation/acceptance.md.review-v1.json L46).

Describe 'eslint-no-disable.sh'
  SCRIPT="$PWD/scripts/eslint-no-disable.sh"

  setup() {
    SPEC_TMP="$(mktemp -d -t eslint-nodisable-spec.XXXXXX)"
    REPO="$SPEC_TMP/repo"
    mkdir -p "$REPO/src"
    cd "$REPO" || return
    git init -q -b main
    git config user.email t@t
    git config user.name t
    git config commit.gpgsign false
    printf 'export const a = 1\n' > src/foo.ts
    git add . && git commit -qm "initial"
    git checkout -q -b feature
  }
  cleanup() {
    cd / || return
    rm -rf "$SPEC_TMP"
  }
  BeforeEach 'setup'
  AfterEach 'cleanup'

  It 'passes when feature branch adds no eslint-disable directives'
    printf 'export const b = 2\n' > src/bar.ts
    git add . && git commit -qm "no disable"
    When call "$SCRIPT" main "$REPO"
    The status should be success
  End

  It 'fails when feature branch adds a new eslint-disable directive'
    printf '// eslint-disable-next-line no-console\nconsole.log(1)\n' > src/foo.ts
    git add . && git commit -qm "add disable"
    When call "$SCRIPT" main "$REPO"
    The status should be failure
    The stderr should include 'count regression'
    The stderr should include 'eslint-disable'
  End

  It 'reports the file path of the new disable in the failure message'
    printf '// eslint-disable-next-line no-console\nconsole.log(1)\n' > src/bar.ts
    git add . && git commit -qm "add disable in new file"
    When call "$SCRIPT" main "$REPO"
    The status should be failure
    The stderr should include 'src/bar.ts'
  End

  It 'fails when net count goes up even with one removal balanced by two additions'
    printf '// eslint-disable-next-line a\n// eslint-disable-next-line b\nx\n' > src/foo.ts
    git add . && git commit -qm "two disables on feature initially"
    git checkout -q main
    git merge -q --ff-only feature
    git checkout -q -b feature2
    printf '// eslint-disable-next-line a\n// eslint-disable-next-line c\n// eslint-disable-next-line d\nx\n' > src/foo.ts
    git add . && git commit -qm "remove b, add c+d (net +1)"
    When call "$SCRIPT" main "$REPO"
    The status should be failure
    The stderr should include 'count regression'
  End

  It 'passes when feature branch reduces the disable count'
    printf '// eslint-disable-next-line a\n// eslint-disable-next-line b\nx\n' > src/foo.ts
    git add . && git commit -qm "two disables"
    git checkout -q main
    git merge -q --ff-only feature
    git checkout -q -b feature2
    printf '// eslint-disable-next-line a\nx\n' > src/foo.ts
    git add . && git commit -qm "drop one disable"
    When call "$SCRIPT" main "$REPO"
    The status should be success
  End
End
