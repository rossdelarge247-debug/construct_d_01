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

  # Per ShellSpec docs: stdin to `When call CMD` cannot be passed via
  # `<<<"$VAR"` — that redirect attaches to ShellSpec's interpreter,
  # not to the called command. Use `Data` (literal) or `Data:expand`
  # (variable-interpolating) blocks. Using Data:expand throughout for
  # variable-driven INPUT.

  Describe 'fixture (1) — green-path passes through'
    It 'exits 0 silently when vitest stub returns success'
      cd "$SPEC_TMP" || return 1
      : > src/lib/foo.ts
      : > tests/unit/lib/foo.test.ts
      make_stub "$SPEC_TMP/vitest-stub.sh" 0
      INPUT='{"tool_name":"Edit","tool_input":{"file_path":"src/lib/foo.ts"}}'
      Data:expand
        #|$INPUT
      End
      When call env TDD_GUARD_VITEST_CMD="$SPEC_TMP/vitest-stub.sh" \
        TDD_GUARD_TIMEOUT=10 TDD_GUARD_WARN_AT=5 \
        bash "$HOOK"
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
      Data:expand
        #|$INPUT
      End
      When call env TDD_GUARD_VITEST_CMD="$SPEC_TMP/vitest-stub.sh" \
        TDD_GUARD_TIMEOUT=10 TDD_GUARD_WARN_AT=5 \
        bash "$HOOK"
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
      echo "pure-visual-ui:src/lib/legacy.ts" > docs/tdd-exemption-allowlist.txt
      # Stub that would FAIL if invoked — proves allowlist short-circuits.
      make_stub "$SPEC_TMP/vitest-stub.sh" 1
      INPUT='{"tool_name":"Edit","tool_input":{"file_path":"src/lib/legacy.ts"}}'
      Data:expand
        #|$INPUT
      End
      When call env TDD_GUARD_VITEST_CMD="$SPEC_TMP/vitest-stub.sh" \
        TDD_GUARD_TIMEOUT=10 TDD_GUARD_WARN_AT=5 \
        bash "$HOOK"
      The status should be success
    End
  End

  Describe 'fixture (4) — missing-test-file blocks with distinct message'
    It 'exits 2 with "test file missing" wording (NOT "RED test")'
      cd "$SPEC_TMP" || return 1
      : > src/lib/orphan.ts
      # No tests/unit/lib/orphan.test.ts.
      INPUT='{"tool_name":"Write","tool_input":{"file_path":"src/lib/orphan.ts"}}'
      Data:expand
        #|$INPUT
      End
      When call env TDD_GUARD_VITEST_CMD=/bin/false \
        TDD_GUARD_TIMEOUT=10 TDD_GUARD_WARN_AT=5 \
        bash "$HOOK"
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
      Data:expand
        #|$INPUT
      End
      When call env TDD_GUARD_VITEST_CMD="$SPEC_TMP/vitest-hang.sh" \
        TDD_GUARD_TIMEOUT=2 TDD_GUARD_WARN_AT=1 \
        bash "$HOOK"
      The status should equal 2
      The stderr should include 'timed out after 2s'
      The stderr should include 'BLOCKED: tdd-guard'
    End
  End

  # Stub generator with output: writes a fake vitest at $1 that emits $3
  # to stdout and exits with $2.
  make_stub_with_output() {
    cat > "$1" <<EOF
#!/bin/bash
cat <<'STUB_OUT'
$3
STUB_OUT
exit $2
EOF
    chmod +x "$1"
  }

  Describe 'fixture (6) — first-creation chicken-and-egg auto-resolves'
    It 'allows Write of non-existent src when vitest emits module-resolve error'
      cd "$SPEC_TMP" || return 1
      # NB: src/lib/newmod.ts intentionally does NOT exist on disk.
      : > tests/unit/lib/newmod.test.ts
      make_stub_with_output "$SPEC_TMP/vitest-stub.sh" 1 \
        'Error: Failed to resolve import "./newmod" from tests/unit/lib/newmod.test.ts. Does the file exist?'
      INPUT='{"tool_name":"Write","tool_input":{"file_path":"src/lib/newmod.ts"}}'
      Data:expand
        #|$INPUT
      End
      When call env TDD_GUARD_VITEST_CMD="$SPEC_TMP/vitest-stub.sh" \
        TDD_GUARD_TIMEOUT=10 TDD_GUARD_WARN_AT=5 \
        bash "$HOOK"
      The status should be success
      The stderr should include 'module-not-found at first-creation'
      The stderr should not include 'BLOCKED'
    End
  End

  Describe 'fixture (7) — Edit on existing src still blocks on RED'
    It 'exits 2 even when vitest emits module-resolve error (Edit semantics demand existing file)'
      cd "$SPEC_TMP" || return 1
      : > src/lib/existing.ts
      : > tests/unit/lib/existing.test.ts
      make_stub_with_output "$SPEC_TMP/vitest-stub.sh" 1 \
        'Error: Failed to resolve import "./existing" from tests/unit/lib/existing.test.ts.'
      INPUT='{"tool_name":"Edit","tool_input":{"file_path":"src/lib/existing.ts"}}'
      Data:expand
        #|$INPUT
      End
      When call env TDD_GUARD_VITEST_CMD="$SPEC_TMP/vitest-stub.sh" \
        TDD_GUARD_TIMEOUT=10 TDD_GUARD_WARN_AT=5 \
        bash "$HOOK"
      The status should equal 2
      The stderr should include 'BLOCKED: tdd-guard'
      The stderr should include 'RED test'
    End
  End

  Describe 'fixture (8) — Write of non-existent src with assertion failure still blocks'
    It 'exits 2 when vitest fails without a module-resolve signal'
      cd "$SPEC_TMP" || return 1
      # NB: src/lib/asserterr.ts intentionally absent.
      : > tests/unit/lib/asserterr.test.ts
      make_stub_with_output "$SPEC_TMP/vitest-stub.sh" 1 \
        'AssertionError: expected 1 to equal 2'
      INPUT='{"tool_name":"Write","tool_input":{"file_path":"src/lib/asserterr.ts"}}'
      Data:expand
        #|$INPUT
      End
      When call env TDD_GUARD_VITEST_CMD="$SPEC_TMP/vitest-stub.sh" \
        TDD_GUARD_TIMEOUT=10 TDD_GUARD_WARN_AT=5 \
        bash "$HOOK"
      The status should equal 2
      The stderr should include 'BLOCKED: tdd-guard'
      The stderr should include 'RED test'
    End
  End

  Describe 'fixture (9) — degraded-runner state passes through with note'
    It 'exits 0 when vitest stub exits 127 (binary not found)'
      cd "$SPEC_TMP" || return 1
      : > src/lib/foo.ts
      : > tests/unit/lib/foo.test.ts
      cat > "$SPEC_TMP/vitest-stub.sh" <<'EOF'
#!/bin/bash
echo "sh: 1: vitest: not found" >&2
exit 127
EOF
      chmod +x "$SPEC_TMP/vitest-stub.sh"
      INPUT='{"tool_name":"Edit","tool_input":{"file_path":"src/lib/foo.ts"}}'
      Data:expand
        #|$INPUT
      End
      When call env TDD_GUARD_VITEST_CMD="$SPEC_TMP/vitest-stub.sh" \
        TDD_GUARD_TIMEOUT=10 TDD_GUARD_WARN_AT=5 \
        bash "$HOOK"
      The status should be success
      The stderr should include 'vitest not installed'
      The stderr should not include 'BLOCKED'
    End
  End

  Describe 'fixture (10) — TDD_GUARD_REDGREEN_OVERRIDE=1 allows RED'
    It 'exits 0 when override env var is set, even with RED test'
      cd "$SPEC_TMP" || return 1
      : > src/lib/foo.ts
      : > tests/unit/lib/foo.test.ts
      make_stub "$SPEC_TMP/vitest-stub.sh" 1
      INPUT='{"tool_name":"Edit","tool_input":{"file_path":"src/lib/foo.ts"}}'
      Data:expand
        #|$INPUT
      End
      When call env TDD_GUARD_VITEST_CMD="$SPEC_TMP/vitest-stub.sh" \
        TDD_GUARD_TIMEOUT=10 TDD_GUARD_WARN_AT=5 \
        TDD_GUARD_REDGREEN_OVERRIDE=1 \
        bash "$HOOK"
      The status should be success
      The stderr should include 'TDD_GUARD_REDGREEN_OVERRIDE=1'
      The stderr should not include 'BLOCKED'
    End
  End

  Describe 'fixture (11) — TDD_GUARD_REDGREEN_OVERRIDE=0 still blocks RED'
    It 'exits 2 when override is set to non-1 value (defensive: only "1" bypasses)'
      cd "$SPEC_TMP" || return 1
      : > src/lib/foo.ts
      : > tests/unit/lib/foo.test.ts
      make_stub "$SPEC_TMP/vitest-stub.sh" 1
      INPUT='{"tool_name":"Edit","tool_input":{"file_path":"src/lib/foo.ts"}}'
      Data:expand
        #|$INPUT
      End
      When call env TDD_GUARD_VITEST_CMD="$SPEC_TMP/vitest-stub.sh" \
        TDD_GUARD_TIMEOUT=10 TDD_GUARD_WARN_AT=5 \
        TDD_GUARD_REDGREEN_OVERRIDE=0 \
        bash "$HOOK"
      The status should equal 2
      The stderr should include 'BLOCKED: tdd-guard'
    End
  End

  Describe 'out-of-scope: non-src/ paths pass through silently'
    It 'exits 0 for docs/ paths regardless of test-file presence'
      cd "$SPEC_TMP" || return 1
      INPUT='{"tool_name":"Edit","tool_input":{"file_path":"docs/anything.md"}}'
      Data:expand
        #|$INPUT
      End
      When call bash "$HOOK"
      The status should be success
    End

    It 'exits 0 for non-Write/Edit tool calls'
      cd "$SPEC_TMP" || return 1
      INPUT='{"tool_name":"Bash","tool_input":{"command":"ls"}}'
      Data:expand
        #|$INPUT
      End
      When call bash "$HOOK"
      The status should be success
    End
  End

  Describe 'spec 76 §2 — prototype-mode path-default skip (F-PA3)'
    It 'exits 0 for src/app/dev/proto/<literal-slug>/page.tsx (skip)'
      cd "$SPEC_TMP" || return 1
      mkdir -p src/app/dev/proto/foo
      : > src/app/dev/proto/foo/page.tsx
      # Stub that would FAIL if invoked — proves prototype-skip short-circuits.
      make_stub "$SPEC_TMP/vitest-stub.sh" 1
      INPUT='{"tool_name":"Edit","tool_input":{"file_path":"src/app/dev/proto/foo/page.tsx"}}'
      Data:expand
        #|$INPUT
      End
      When call env TDD_GUARD_VITEST_CMD="$SPEC_TMP/vitest-stub.sh" \
        TDD_GUARD_TIMEOUT=10 TDD_GUARD_WARN_AT=5 \
        bash "$HOOK"
      The status should be success
    End

    It 'enforces (status 2 missing-test) for src/app/dev/proto/[slug]/page.tsx (parametric route)'
      cd "$SPEC_TMP" || return 1
      mkdir -p 'src/app/dev/proto/[slug]'
      : > 'src/app/dev/proto/[slug]/page.tsx'
      INPUT='{"tool_name":"Write","tool_input":{"file_path":"src/app/dev/proto/[slug]/page.tsx"}}'
      Data:expand
        #|$INPUT
      End
      When call env TDD_GUARD_VITEST_CMD=/bin/false \
        TDD_GUARD_TIMEOUT=10 TDD_GUARD_WARN_AT=5 \
        bash "$HOOK"
      The status should equal 2
      The stderr should include 'test file missing'
    End

    It 'enforces (status 2 missing-test) for src/app/dev/proto/page.tsx (hub itself)'
      cd "$SPEC_TMP" || return 1
      mkdir -p src/app/dev/proto
      : > src/app/dev/proto/page.tsx
      INPUT='{"tool_name":"Write","tool_input":{"file_path":"src/app/dev/proto/page.tsx"}}'
      Data:expand
        #|$INPUT
      End
      When call env TDD_GUARD_VITEST_CMD=/bin/false \
        TDD_GUARD_TIMEOUT=10 TDD_GUARD_WARN_AT=5 \
        bash "$HOOK"
      The status should equal 2
      The stderr should include 'test file missing'
    End
  End
End
