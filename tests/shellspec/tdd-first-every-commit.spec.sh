#!/bin/bash
# S-38-3 (RED) — meta-tests for .claude/hooks/tdd-first-every-commit.sh.
# Per AC-5 (acceptance.md L50): PreToolUse:Bash gate on `git commit` that
# blocks staged src/** changes lacking corresponding tests/** changes (or an
# exemption-allowlist match). Tests RED until S-38-3-GREEN lands the impl.

Describe 'tdd-first-every-commit.sh'
  HOOK="./.claude/hooks/tdd-first-every-commit.sh"

  setup() {
    SPEC_TMP="$(mktemp -d -t tdd-first-spec.XXXXXX)"
    REPO="$SPEC_TMP/repo"
    mkdir -p "$REPO/src/lib" "$REPO/tests/unit" "$REPO/docs"
    git -C "$REPO" -c init.defaultBranch=main init -q
    git -C "$REPO" -c user.email=t@t -c user.name=t commit -q --allow-empty -m init
    : > "$REPO/docs/tdd-exemption-allowlist.txt"
  }
  cleanup() {
    rm -rf "$SPEC_TMP"
  }
  BeforeEach 'setup'
  AfterEach 'cleanup'

  # The hook reads PreToolUse JSON from stdin: { tool_input: { command: "..." } }.
  invoke_hook() {
    local cmd="$1"
    ( cd "$REPO" && printf '{"tool_input":{"command":"%s"}}' "$cmd" \
      | bash "$OLDPWD/$HOOK" )
  }

  It 'exits 0 on non-`git commit` Bash invocations (e.g. git commit-tree)'
    OLDPWD="$(pwd)" When call invoke_hook 'git commit-tree -m foo HEAD'
    The status should be success
  End

  It 'exits 0 when staged diff has no src/ paths (docs-only commit)'
    : > "$REPO/docs/note.md"
    git -C "$REPO" add docs/note.md
    OLDPWD="$(pwd)" When call invoke_hook 'git commit -m "docs"'
    The status should be success
  End

  It 'exits 0 when staged diff has src/ AND tests/ paths'
    printf 'export const x = 1\n' > "$REPO/src/lib/x.ts"
    printf 'test\n' > "$REPO/tests/unit/x.test.ts"
    git -C "$REPO" add src/lib/x.ts tests/unit/x.test.ts
    OLDPWD="$(pwd)" When call invoke_hook 'git commit -m "feat"'
    The status should be success
  End

  It 'exits non-zero when staged diff has src/ paths but no tests/ paths'
    printf 'export const x = 1\n' > "$REPO/src/lib/x.ts"
    git -C "$REPO" add src/lib/x.ts
    OLDPWD="$(pwd)" When call invoke_hook 'git commit -m "feat"'
    The status should be failure
    The stderr should match pattern '*TDD-first*'
    The stderr should match pattern '*src/lib/x.ts*'
  End

  It 'exits 0 when src/ path matches a glob in docs/tdd-exemption-allowlist.txt'
    printf 'src/**/*.css\n' > "$REPO/docs/tdd-exemption-allowlist.txt"
    printf 'body { color: red }\n' > "$REPO/src/lib/x.css"
    git -C "$REPO" add docs/tdd-exemption-allowlist.txt src/lib/x.css
    OLDPWD="$(pwd)" When call invoke_hook 'git commit -m "visual"'
    The status should be success
  End

  It 'emits useful-message on block: quotes the rule + lists actionable alternatives (G17)'
    printf 'export const x = 1\n' > "$REPO/src/lib/x.ts"
    git -C "$REPO" add src/lib/x.ts
    OLDPWD="$(pwd)" When call invoke_hook 'git commit -m "feat"'
    The status should be failure
    The stderr should match pattern '*acceptance.md AC-5*'
    The stderr should match pattern '*Actionable alternatives*'
  End
End
