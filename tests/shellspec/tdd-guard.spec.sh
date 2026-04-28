#!/bin/bash
# v3b AC-6 — meta-tests for .claude/hooks/tdd-guard.sh.
# Per docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md AC-6
# §Verification: 5 fixtures (green-path · red-path · allowlisted ·
# missing-test-file · timeout).
#
# Test seams used (per hook header "Effects behind interfaces"):
#   TDD_GUARD_VITEST_CMD — override vitest invocation with stub script.
#   TDD_GUARD_TIMEOUT    — hard-cap budget seconds.
#   TDD_GUARD_WARN_AT    — soft-warn threshold seconds.
# These let the spec exercise RED/GREEN/timeout without npx + vitest +
# package.json setup. Stubs simulate vitest exit codes deterministically.

Describe 'tdd-guard.sh PreToolUse hook (v3b AC-6)'
  HOOK="$PWD/.claude/hooks/tdd-guard.sh"

  setup() {
    SPEC_TMP="$(mktemp -d -t tdd-guard-spec.XXXXXX)"
    # Repo-relative pathing: hook runs git rev-parse + reads
    # docs/tdd-exemption-allowlist.txt + tests/unit/<...>. Init a tmp git
    # repo with the layout the hook expects.
    (
      cd "$SPEC_TMP" || exit 1
      git init -q -b test-fixture .
      mkdir -p src/lib docs tests/unit/lib
      : > docs/tdd-exemption-allowlist.txt
    )
  }
  cleanup() { rm -rf "$SPEC_TMP"; }
  BeforeEach 'setup'
  AfterEach 'cleanup'

  # Stub generator: writes a fake vitest command at $1 that exits with $2.
  make_stub() {
    cat > "$1" <<EOF
#!/bin/bash
echo "stub-vitest invoked with: \$*"
exit $2
EOF
    chmod +x "$1"
  }

  # Hanging stub: never exits until killed (simulates a hung test).
  make_hang_stub() {
    cat > "$1" <<'EOF'
#!/bin/bash
echo "stub-vitest hanging..."
sleep 3600
EOF
    chmod +x "$1"
  }

  Describe 'fixture (1) — green-path passes through'
    It 'exits 0 silently when vitest stub returns success'
      cd "$SPEC_TMP" || return 1
      : > src/lib/foo.ts
      : > tests/unit/lib/foo.test.ts
      make_stub "$SPEC_TMP/vitest-stub.sh" 0
      INPUT='{"tool_name":"Edit","tool_input":{"file_path":"src/lib/foo.ts"}}'
      When call env TDD_GUARD_VITEST_CMD="$SPEC_TMP/vitest-stub.sh" \
        TDD_GUARD_TIMEOUT=10 TDD_GUARD_WARN_AT=5 \
        bash "$HOOK" <<<"$INPUT"
      The status should be success
    End
  End

  Describe 'fixture (2) — red-path blocks with G17 message'
    It 'exits 2 and emits BLOCKED message when vitest stub returns failure'
      cd "$SPEC_TMP" || return 1
      : > src/lib/foo.ts
      : > tests/unit/lib/foo.test.ts
      make_stub "$SPEC_TMP/vitest-stub.sh" 1
      INPUT='{"tool_name":"Edit","tool_input":{"file_path":"src/lib/foo.ts"}}'
      When call env TDD_GUARD_VITEST_CMD="$SPEC_TMP/vitest-stub.sh" \
        TDD_GUARD_TIMEOUT=10 TDD_GUARD_WARN_AT=5 \
        bash "$HOOK" <<<"$INPUT"
      The status should equal 2
      The stderr should include 'BLOCKED: tdd-guard'
      The stderr should include 'RED test for src/lib/foo.ts'
      The stderr should include 'Actionable alternatives'
    End
  End

  Describe 'fixture (3) — allowlisted path passes through (no vitest invocation)'
    It 'exits 0 when path matches allowlist glob; vitest stub never runs'
      cd "$SPEC_TMP" || return 1
      : > src/lib/legacy.ts
      # Tagged glob (per v3b AC-8 rubric): "category:glob".
      echo "tagged-pure-visual-ui:src/lib/legacy.ts" > docs/tdd-exemption-allowlist.txt
      # Stub that would FAIL if invoked — proves allowlist short-circuits.
      make_stub "$SPEC_TMP/vitest-stub.sh" 1
      INPUT='{"tool_name":"Edit","tool_input":{"file_path":"src/lib/legacy.ts"}}'
      When call env TDD_GUARD_VITEST_CMD="$SPEC_TMP/vitest-stub.sh" \
        TDD_GUARD_TIMEOUT=10 TDD_GUARD_WARN_AT=5 \
        bash "$HOOK" <<<"$INPUT"
      The status should be success
    End
  End

  Describe 'fixture (4) — missing-test-file blocks with distinct message'
    It 'exits 2 with "test file missing" wording (NOT "RED test")'
      cd "$SPEC_TMP" || return 1
      : > src/lib/orphan.ts
      # No tests/unit/lib/orphan.test.ts.
      INPUT='{"tool_name":"Write","tool_input":{"file_path":"src/lib/orphan.ts"}}'
      When call env TDD_GUARD_VITEST_CMD=/bin/false \
        TDD_GUARD_TIMEOUT=10 TDD_GUARD_WARN_AT=5 \
        bash "$HOOK" <<<"$INPUT"
      The status should equal 2
      The stderr should include 'test file missing'
      The stderr should include 'tests/unit/lib/orphan.test.ts'
      The stderr should not include 'RED test'
    End
  End

  Describe 'fixture (5) — timeout fails fail-loud'
    It 'exits 2 and emits "timed out" message when vitest hangs past TIMEOUT_BUDGET'
      cd "$SPEC_TMP" || return 1
      : > src/lib/slow.ts
      : > tests/unit/lib/slow.test.ts
      make_hang_stub "$SPEC_TMP/vitest-hang.sh"
      # 2s budget, 1s warn. Spec resolves in ~3s wall time.
      INPUT='{"tool_name":"Edit","tool_input":{"file_path":"src/lib/slow.ts"}}'
      When call env TDD_GUARD_VITEST_CMD="$SPEC_TMP/vitest-hang.sh" \
        TDD_GUARD_TIMEOUT=2 TDD_GUARD_WARN_AT=1 \
        bash "$HOOK" <<<"$INPUT"
      The status should equal 2
      The stderr should include 'timed out after 2s'
      The stderr should include 'BLOCKED: tdd-guard'
    End
  End

  Describe 'finding (S-5 review): jq-missing → fail-loud (was silent pass)'
    It 'exits 2 with BLOCKED message when jq is not on PATH'
      mkdir -p "$SPEC_TMP/no-jq"
      cp "$(command -v bash)" "$SPEC_TMP/no-jq/" 2>/dev/null
      cp "$(command -v cat)" "$SPEC_TMP/no-jq/" 2>/dev/null
      INPUT='{"tool_name":"Edit","tool_input":{"file_path":"src/lib/foo.ts"}}'
      When call env -i PATH="$SPEC_TMP/no-jq" "$SPEC_TMP/no-jq/bash" "$HOOK" <<<"$INPUT"
      The status should equal 2
      The stderr should include 'BLOCKED: tdd-guard'
      The stderr should include 'jq` not on PATH'
    End
  End

  Describe 'finding (S-5 review): timeout takes down whole process group'
    It 'kills setsid-spawned child processes when vitest stub hangs'
      cd "$SPEC_TMP" || return 1
      : > src/lib/slow.ts
      : > tests/unit/lib/slow.test.ts
      cat > "$SPEC_TMP/vitest-spawner.sh" <<'EOF'
#!/bin/bash
# Spawns a sentinel child whose presence we can detect after timeout.
sleep 3600 &
echo "$!" > "$1.child-pid"
sleep 3600
EOF
      chmod +x "$SPEC_TMP/vitest-spawner.sh"
      INPUT='{"tool_name":"Edit","tool_input":{"file_path":"src/lib/slow.ts"}}'
      When call env TDD_GUARD_VITEST_CMD="$SPEC_TMP/vitest-spawner.sh" \
        TDD_GUARD_TIMEOUT=2 TDD_GUARD_WARN_AT=1 \
        bash "$HOOK" <<<"$INPUT"
      The status should equal 2
      The stderr should include 'timed out after 2s'
      # Brief grace for SIGKILL propagation, then assert child is gone.
      Skip if 'setsid not available — group-kill path unreachable' \
        [ ! -x "$(command -v setsid)" ]
      sleep 1
      child_pid=$(cat tests/unit/lib/slow.test.ts.child-pid 2>/dev/null || echo "")
      if [ -n "$child_pid" ] && kill -0 "$child_pid" 2>/dev/null; then
        kill -9 "$child_pid" 2>/dev/null
        echo "ASSERT FAIL: child $child_pid survived group kill" >&2
        false
      else
        true
      fi
    End
  End

  Describe 'out-of-scope: non-src/ paths pass through silently'
    It 'exits 0 for docs/ paths regardless of test-file presence'
      cd "$SPEC_TMP" || return 1
      INPUT='{"tool_name":"Edit","tool_input":{"file_path":"docs/anything.md"}}'
      When call bash "$HOOK" <<<"$INPUT"
      The status should be success
    End

    It 'exits 0 for non-Write/Edit tool calls'
      cd "$SPEC_TMP" || return 1
      INPUT='{"tool_name":"Bash","tool_input":{"command":"ls"}}'
      When call bash "$HOOK" <<<"$INPUT"
      The status should be success
    End
  End
End
