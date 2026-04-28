#!/bin/bash
# v3b AC-7 — meta-tests for .claude/hooks/pre-push-dod7.sh.
# Per docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md AC-7
# §Verification: 4 fixtures (RED-then-GREEN pending → block · RED-then-RED
# pair → pass-through · GREEN-then-GREEN pair → pass-through · override env
# present → warn-but-pass).
#
# Fixture 2 wording "RED-then-unrelated-commit pair" interpreted as
# RED-then-RED (multi-RED legitimate slice) — the AC literal (d.ii)
# specifies "the next commit msg does NOT match `^RED:`" for the block
# condition; thus next-commit-IS-RED → pass through.
#
# Test seam: DOD7_GH_CMD points the hook at a stub script that returns
# JSON shaped like `gh api .../check-runs` output, deterministic per
# fixture. Avoids real network + auth.

Describe 'pre-push-dod7.sh PreToolUse hook (v3b AC-7)'
  HOOK="$PWD/.claude/hooks/pre-push-dod7.sh"

  setup() {
    SPEC_TMP="$(mktemp -d -t pre-push-dod7-spec.XXXXXX)"
    (
      cd "$SPEC_TMP" || exit 1
      git init -q -b test-fixture .
      git config user.email t@example
      git config user.name t
      git remote add origin https://github.com/test-owner/test-repo.git
    )
  }
  cleanup() { rm -rf "$SPEC_TMP"; }
  BeforeEach 'setup'
  AfterEach 'cleanup'

  # Plumbing-based commit (mirrors git-state-verifier.spec.sh approach):
  # `git commit-tree` skips signing hooks that fail in test fixtures.
  make_commit() {
    local msg="$1"
    local parent_arg=()
    local prev
    # `git rev-parse HEAD` prints "HEAD" to stdout on empty repo before
    # failing — use --verify which prints nothing on failure.
    prev=$(git rev-parse --verify HEAD 2>/dev/null || echo "")
    [ -n "$prev" ] && parent_arg=(-p "$prev")
    local tree
    tree=$(git write-tree)
    local sha
    sha=$(GIT_AUTHOR_NAME=t GIT_AUTHOR_EMAIL=t@example \
      GIT_COMMITTER_NAME=t GIT_COMMITTER_EMAIL=t@example \
      git commit-tree -m "$msg" "${parent_arg[@]}" "$tree")
    git update-ref HEAD "$sha"
  }

  # gh-stub generator: writes a stub at $1 that prints JSON $2.
  make_gh_stub() {
    cat > "$1" <<EOF
#!/bin/bash
# Stub for gh CLI. Prints fixture JSON regardless of args.
cat <<'JSON'
$2
JSON
EOF
    chmod +x "$1"
  }

  Describe 'fixture (1) — RED→GREEN pair, prior-CI-still-pending → block'
    It 'exits 2 with BLOCKED message when check-runs reports in-progress'
      cd "$SPEC_TMP" || return 1
      make_commit "RED: meta-tests for foo (S-N AC-X)"
      make_commit "feat: implement foo"
      # CI returns 1 run, status=in_progress → pending=1 → block.
      make_gh_stub "$SPEC_TMP/gh-stub.sh" '{"total_count":1,"check_runs":[{"status":"in_progress","conclusion":null}]}'
      INPUT='{"tool_input":{"command":"git push origin HEAD"}}'
      When call env DOD7_GH_CMD="$SPEC_TMP/gh-stub.sh" \
        bash "$HOOK" <<<"$INPUT"
      The status should equal 2
      The stderr should include 'BLOCKED: pre-push-dod7'
      The stderr should include 'CI has not yet observed RED state'
      The stderr should include 'DOD7_OVERRIDE=1'
    End

    It 'exits 2 when check-runs reports total_count=0 (no run yet)'
      cd "$SPEC_TMP" || return 1
      make_commit "RED: meta-tests for bar"
      make_commit "feat: implement bar"
      make_gh_stub "$SPEC_TMP/gh-stub.sh" '{"total_count":0,"check_runs":[]}'
      INPUT='{"tool_input":{"command":"git push -u origin HEAD"}}'
      When call env DOD7_GH_CMD="$SPEC_TMP/gh-stub.sh" \
        bash "$HOOK" <<<"$INPUT"
      The status should equal 2
      The stderr should include 'CI total runs: 0'
    End
  End

  Describe 'fixture (2) — RED→RED pair (multi-RED) → pass-through'
    It 'exits 0 silently when both commits start with RED:'
      cd "$SPEC_TMP" || return 1
      make_commit "RED: meta-tests for foo"
      make_commit "RED: more meta-tests for foo edge cases"
      # Stub would BLOCK (in-progress) if invoked — proves short-circuit.
      make_gh_stub "$SPEC_TMP/gh-stub.sh" '{"total_count":0,"check_runs":[]}'
      INPUT='{"tool_input":{"command":"git push origin HEAD"}}'
      When call env DOD7_GH_CMD="$SPEC_TMP/gh-stub.sh" \
        bash "$HOOK" <<<"$INPUT"
      The status should be success
    End
  End

  Describe 'fixture (3) — GREEN→GREEN pair → pass-through'
    It 'exits 0 silently when prior commit does not match ^RED:'
      cd "$SPEC_TMP" || return 1
      make_commit "feat: scaffold foo"
      make_commit "feat: implement foo logic"
      make_gh_stub "$SPEC_TMP/gh-stub.sh" '{"total_count":0,"check_runs":[]}'
      INPUT='{"tool_input":{"command":"git push origin HEAD"}}'
      When call env DOD7_GH_CMD="$SPEC_TMP/gh-stub.sh" \
        bash "$HOOK" <<<"$INPUT"
      The status should be success
    End

    It 'also passes RED→GREEN when CI has completed runs (no pending)'
      cd "$SPEC_TMP" || return 1
      make_commit "RED: meta-tests for foo"
      make_commit "feat: implement foo"
      # 1 run, status=completed, conclusion=failure (the expected RED).
      make_gh_stub "$SPEC_TMP/gh-stub.sh" '{"total_count":1,"check_runs":[{"status":"completed","conclusion":"failure"}]}'
      INPUT='{"tool_input":{"command":"git push origin HEAD"}}'
      When call env DOD7_GH_CMD="$SPEC_TMP/gh-stub.sh" \
        bash "$HOOK" <<<"$INPUT"
      The status should be success
    End
  End

  Describe 'fixture (4) — DOD7_OVERRIDE=1 → warn-but-pass'
    It 'exits 0 with override-acknowledged stderr message'
      cd "$SPEC_TMP" || return 1
      make_commit "RED: meta-tests for foo"
      make_commit "feat: implement foo"
      INPUT='{"tool_input":{"command":"git push origin HEAD"}}'
      When call env DOD7_OVERRIDE=1 \
        bash "$HOOK" <<<"$INPUT"
      The status should be success
      The stderr should include 'DOD7_OVERRIDE=1 set'
      The stderr should include 'Record the reason'
    End
  End

  Describe 'out-of-scope: non-push Bash commands pass through silently'
    It 'exits 0 for git commit'
      INPUT='{"tool_input":{"command":"git commit -m foo"}}'
      When call bash "$HOOK" <<<"$INPUT"
      The status should be success
    End

    It 'exits 0 for unrelated bash commands'
      INPUT='{"tool_input":{"command":"ls -la"}}'
      When call bash "$HOOK" <<<"$INPUT"
      The status should be success
    End
  End

  Describe 'edge case: single-commit branch (no HEAD~1)'
    It 'exits 0 when HEAD~1 does not exist'
      cd "$SPEC_TMP" || return 1
      make_commit "RED: meta-tests for foo"
      INPUT='{"tool_input":{"command":"git push -u origin HEAD"}}'
      When call bash "$HOOK" <<<"$INPUT"
      The status should be success
    End
  End
End
