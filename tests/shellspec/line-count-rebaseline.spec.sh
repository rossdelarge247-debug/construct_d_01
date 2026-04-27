#!/bin/bash
# AC-12 — meta-tests for .claude/hooks/session-start.sh re-baseline guard.
# Per docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md AC-12
# ("line-count.sh session-base re-baseline on branch-resume + meta-test").
#
# Spec (literal): "The 'absent-only' guard at session-start.sh:27-28 is
# relaxed to 'absent OR HEAD-mismatched-by->=200 lines (cumulative
# `git diff --shortstat` insertions+deletions between cached base SHA
# and current HEAD; threshold 200 = generous absorption of normal
# session churn, tight enough to catch cross-branch hops). Rebaselining
# is once-per-hop: every checkout to a different branch SHA triggers
# rebaseline at the next hook fire; same-branch reset (no SHA change)
# does not."
#
# Fixture pattern modelled on tests/shellspec/git-state-verifier.spec.sh:
# real tmp git repo built with plumbing (write-tree + commit-tree +
# update-ref) so signing path is avoided + behaviour is hermetic.

Describe 'session-start.sh re-baseline guard (AC-12)'
  setup_fixture() {
    export HOOK="$PWD/.claude/hooks/session-start.sh"
    export FIXTURE_TMP="$(mktemp -d -t session-start-rebase.XXXXXX)"
    export TEST_SESSION_ID="ac12-$$-$RANDOM"
    export BASE_FILE="/tmp/claude-base-${TEST_SESSION_ID}.txt"
    (
      cd "$FIXTURE_TMP" || exit 1
      git init -q -b main .

      # C1 — empty bootstrap (the "stale orphan" SHA).
      TREE_EMPTY=$(git write-tree)
      C1=$(
        GIT_AUTHOR_NAME=t GIT_AUTHOR_EMAIL=t@example \
        GIT_COMMITTER_NAME=t GIT_COMMITTER_EMAIL=t@example \
        git commit-tree -m c1-orphan "$TREE_EMPTY"
      )

      # C2 — 250-line file on top of C1 (the "canonical" tip).
      # `git diff --shortstat C1 C2` yields "1 file changed, 250 insertions(+)" → 250 ≥ 200.
      seq 1 250 > big.txt
      git add big.txt
      TREE_BIG=$(git write-tree)
      C2=$(
        GIT_AUTHOR_NAME=t GIT_AUTHOR_EMAIL=t@example \
        GIT_COMMITTER_NAME=t GIT_COMMITTER_EMAIL=t@example \
        git commit-tree -m c2-canonical -p "$C1" "$TREE_BIG"
      )

      # C3 — small (10-line) addition on top of C2 (the "<200 sub-threshold" tip).
      # `git diff --shortstat C2 C3` yields "1 file changed, 10 insertions(+)" → 10 < 200.
      seq 1 10 > small.txt
      git add small.txt
      TREE_SMALL=$(git write-tree)
      C3=$(
        GIT_AUTHOR_NAME=t GIT_AUTHOR_EMAIL=t@example \
        GIT_COMMITTER_NAME=t GIT_COMMITTER_EMAIL=t@example \
        git commit-tree -m c3-small -p "$C2" "$TREE_SMALL"
      )

      # Working tree on C2 (the "canonical resync landing").
      git update-ref refs/heads/main "$C2"
      git update-ref HEAD "$C2"
      git checkout-index -fa

      # Persist SHAs for tests to read.
      printf '%s\n' "$C1" > .c1-sha
      printf '%s\n' "$C2" > .c2-sha
      printf '%s\n' "$C3" > .c3-sha
    )
  }

  cleanup_fixture() {
    [ -n "${FIXTURE_TMP:-}" ] && rm -rf "$FIXTURE_TMP"
    [ -n "${BASE_FILE:-}" ] && rm -f "$BASE_FILE"
  }

  BeforeEach 'setup_fixture'
  AfterEach 'cleanup_fixture'

  # Fixture 1 (spec literal): "harness-orphan landing → canonical resync via
  # documented recipe → next Edit on tracked file reports authored-only delta".
  # Operationalised: cached base = orphan SHA, HEAD on canonical (250-line diff
  # ≥ N=200) → re-baseline expected.
  It 'rebaselines when cached base differs from HEAD by >=200 lines (orphan-canonical hop)'
    When run bash -c '
      cd "$FIXTURE_TMP" || exit 99
      C1=$(cat .c1-sha)
      printf "%s\n" "$C1" > "$BASE_FILE"
      printf "{\"session_id\":\"%s\"}" "$TEST_SESSION_ID" | "$HOOK" >/dev/null
      EXPECTED=$(git rev-parse HEAD)
      ACTUAL=$(cat "$BASE_FILE")
      [ "$EXPECTED" = "$ACTUAL" ]
    '
    The status should equal 0
  End

  # Fixture 2 (spec literal): "same-branch reset (no SHA change) → no rebaseline".
  It 'does NOT rebaseline when cached base equals current HEAD (same-SHA noop)'
    When run bash -c '
      cd "$FIXTURE_TMP" || exit 99
      HEAD_SHA=$(git rev-parse HEAD)
      printf "%s\n" "$HEAD_SHA" > "$BASE_FILE"
      printf "{\"session_id\":\"%s\"}" "$TEST_SESSION_ID" | "$HOOK" >/dev/null
      ACTUAL=$(cat "$BASE_FILE")
      [ "$HEAD_SHA" = "$ACTUAL" ]
    '
    The status should equal 0
  End

  # Threshold edge case: cached base differs from HEAD but cumulative diff < 200.
  # Spec literal: "absent OR HEAD-mismatched-by->=200 lines" — sub-threshold
  # mismatches MUST NOT trigger rebaseline (otherwise normal session churn
  # would spuriously rewrite the base).
  It 'does NOT rebaseline when cumulative diff is below threshold (<200 lines)'
    When run bash -c '
      cd "$FIXTURE_TMP" || exit 99
      C2=$(cat .c2-sha)
      C3=$(cat .c3-sha)
      # Move HEAD to C3 (10-line diff vs C2).
      git update-ref HEAD "$C3"
      git checkout-index -fa
      # Cache base = C2.
      printf "%s\n" "$C2" > "$BASE_FILE"
      printf "{\"session_id\":\"%s\"}" "$TEST_SESSION_ID" | "$HOOK" >/dev/null
      ACTUAL=$(cat "$BASE_FILE")
      # Below-threshold mismatch must NOT trigger rebaseline.
      [ "$C2" = "$ACTUAL" ]
    '
    The status should equal 0
  End

  # Original contract (preservation): file-absent path still writes current HEAD.
  It 'writes current HEAD when base file is absent (preserves original contract)'
    When run bash -c '
      cd "$FIXTURE_TMP" || exit 99
      rm -f "$BASE_FILE"
      printf "{\"session_id\":\"%s\"}" "$TEST_SESSION_ID" | "$HOOK" >/dev/null
      [ -f "$BASE_FILE" ] || exit 1
      EXPECTED=$(git rev-parse HEAD)
      ACTUAL=$(cat "$BASE_FILE")
      [ "$EXPECTED" = "$ACTUAL" ]
    '
    The status should equal 0
  End

  # Fixture 3 (spec literal): "multi-branch hop → rebaseline once per hop".
  # Operationalised: first hook fire after a ≥200-line hop rewrites base; the
  # immediately-following fire (no further hop) is a no-op because cached
  # base == HEAD.
  It 'rebaselines once per hop (subsequent same-SHA fires are no-ops)'
    When run bash -c '
      cd "$FIXTURE_TMP" || exit 99
      C1=$(cat .c1-sha)
      printf "%s\n" "$C1" > "$BASE_FILE"
      # Hop 1: stale base (C1) → HEAD (C2, 250 lines diff). Expect rebaseline.
      printf "{\"session_id\":\"%s\"}" "$TEST_SESSION_ID" | "$HOOK" >/dev/null
      AFTER_HOP1=$(cat "$BASE_FILE")
      [ "$AFTER_HOP1" = "$(git rev-parse HEAD)" ] || exit 1
      # Hop 2: hook fires again, no checkout in between. Diff = 0. No rebaseline.
      printf "{\"session_id\":\"%s\"}" "$TEST_SESSION_ID" | "$HOOK" >/dev/null
      AFTER_HOP2=$(cat "$BASE_FILE")
      [ "$AFTER_HOP1" = "$AFTER_HOP2" ] || exit 2
    '
    The status should equal 0
  End
End
