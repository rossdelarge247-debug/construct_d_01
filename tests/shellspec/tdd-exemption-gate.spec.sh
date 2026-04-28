#!/bin/bash
# v3b AC-8 — meta-tests for verify-slice.sh Gate 3b
# (TDD-exemption-allowlist category-tag enforcement).
# Per docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md AC-8
# §Verification: "Test fixture: allowlist with `tagged-pure-visual-ui:
# src/foo.tsx` passes; untagged entry `src/bar.tsx` fails."
#
# AC-text-vs-impl divergence: AC-8 verification cites
# `tagged-pure-visual-ui:src/foo.tsx` as the literal example; impl uses
# `pure-visual-ui:src/foo.tsx` (without "tagged-" prefix) to match the
# verbatim §G L169 source ("Lean: pure-visual UI..." — no "tagged-"
# prefix). The "tagged-" wording in AC-8 is interpreted descriptively
# ("this entry is tagged with a category") rather than as literal
# format. Verification.md AC-8 row records the interpretation.

Describe 'verify-slice.sh Gate 3b — tdd-exemption category-tag enforcement (v3b AC-8)'
  setup() {
    SPEC_TMP="$(mktemp -d -t tdd-exemption-spec.XXXXXX)"
    SLICE_DIR="$SPEC_TMP/slice"
    mkdir -p "$SLICE_DIR" "$SPEC_TMP/docs"
    # Provide the file-presence + §11 satisfiers so Gate 3b is what's
    # exercised, not an earlier gate.
    : > "$SLICE_DIR/acceptance.md"
    : > "$SLICE_DIR/verification.md"
    {
      printf '# Security\n\n## §11 checklist\n\n'
      printf '| Box | Item | Status | Notes |\n|---|---|---|---|\n'
      for i in 1 2 3 4 5 6 7 8 9 10 11 12 13; do
        printf '| %s | item-%s | n/a | placeholder |\n' "$i" "$i"
      done
    } > "$SLICE_DIR/security.md"
  }
  cleanup() { rm -rf "$SPEC_TMP"; }
  BeforeEach 'setup'
  AfterEach 'cleanup'

  # Helper: copy verify-slice.sh into the tmp + symlink the docs/
  # allowlist file for the duration of the test, since Gate 3b reads
  # from a hard-coded relative path.
  install_with_allowlist() {
    local allowlist_content="$1"
    cp scripts/verify-slice.sh "$SPEC_TMP/verify-slice.sh"
    chmod +x "$SPEC_TMP/verify-slice.sh"
    mkdir -p "$SPEC_TMP/docs" "$SPEC_TMP/scripts"
    printf '%s' "$allowlist_content" > "$SPEC_TMP/docs/tdd-exemption-allowlist.txt"
    # Empty no-disable script so Gate 4 is a no-op.
    cat > "$SPEC_TMP/scripts/eslint-no-disable.sh" <<'EOF'
#!/bin/bash
exit 0
EOF
    chmod +x "$SPEC_TMP/scripts/eslint-no-disable.sh"
  }

  Describe 'fixture (a) — tagged entry passes'
    It 'exits 0 when entry is `pure-visual-ui:src/foo.tsx`'
      install_with_allowlist 'pure-visual-ui:src/foo.tsx'
      cd "$SPEC_TMP" || return 1
      When call ./verify-slice.sh slice
      The status should be success
    End

    It 'exits 0 when entry is `pure-rename:src/lib/old.ts`'
      install_with_allowlist 'pure-rename:src/lib/old.ts'
      cd "$SPEC_TMP" || return 1
      When call ./verify-slice.sh slice
      The status should be success
    End

    It 'exits 0 when entry is `pure-config:src/config/paths.ts`'
      install_with_allowlist 'pure-config:src/config/paths.ts'
      cd "$SPEC_TMP" || return 1
      When call ./verify-slice.sh slice
      The status should be success
    End

    It 'exits 0 with comments + blank lines + multiple tagged entries'
      install_with_allowlist '# header comment
pure-visual-ui:src/components/marketing/hero.tsx

pure-rename:src/lib/feature/old.ts
pure-config:src/config/paths.ts  # trailing comment
'
      cd "$SPEC_TMP" || return 1
      When call ./verify-slice.sh slice
      The status should be success
    End
  End

  Describe 'fixture (b) — untagged entry fails-loud'
    It 'exits 1 when entry has no category prefix (`src/bar.tsx`)'
      install_with_allowlist 'src/bar.tsx'
      cd "$SPEC_TMP" || return 1
      When call ./verify-slice.sh slice
      The status should be failure
      The stderr should include 'tdd-exemption-allowlist gate'
      The stderr should include 'src/bar.tsx'
      The stderr should include 'pure-visual-ui'
    End

    It 'exits 1 when category is unknown (`bogus-category:src/foo.tsx`)'
      install_with_allowlist 'bogus-category:src/foo.tsx'
      cd "$SPEC_TMP" || return 1
      When call ./verify-slice.sh slice
      The status should be failure
      The stderr should include 'tdd-exemption-allowlist gate'
      The stderr should include 'bogus-category:src/foo.tsx'
    End

    It 'lists ALL bad entries when multiple are present'
      install_with_allowlist 'pure-visual-ui:src/ok.tsx
src/bad1.ts
bogus:src/bad2.ts
pure-rename:src/ok2.ts'
      cd "$SPEC_TMP" || return 1
      When call ./verify-slice.sh slice
      The status should be failure
      The stderr should include 'src/bad1.ts'
      The stderr should include 'bogus:src/bad2.ts'
    End
  End

  Describe 'edge: empty / missing allowlist'
    It 'exits 0 when allowlist is empty (no entries to validate)'
      install_with_allowlist ''
      cd "$SPEC_TMP" || return 1
      When call ./verify-slice.sh slice
      The status should be success
    End

    It 'exits 0 when allowlist contains only comments + blanks'
      install_with_allowlist '# only header

# trailing comment
'
      cd "$SPEC_TMP" || return 1
      When call ./verify-slice.sh slice
      The status should be success
    End
  End
End
