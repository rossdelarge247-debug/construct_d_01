# PR #30 — golden-replay seed (v3b S-8 AC-4)

This fixture pins the session-47 single-agent recursive baseline as the v3b multi-agent suite's golden-PR replay seed. Per spec 72c §7 + AC-4 verification 6: **seed is 1 PR at v3b ship**; first 3 src/ slices add data points; promptfoo precedent's 5-10 PR target reached at v3c.

## Source

- **PR**: rossdelarge247-debug/construct_d_01#30 (S-INFRA-rigour-v3b-subagent-suite v3b S-6)
- **Merged commit on main**: see PR #30's merge commit in `git log`
- **Recorded round transcript**: `docs/slices/S-INFRA-rigour-v3b-subagent-suite/verification.md` §"Round 1" through §"Round 9"
- **Single-agent baseline**: 9 rounds × 14 cumulative actionable findings, final verdict `approve`

## Fixture files

- `prior-findings.json` — JSON array of the 14 cumulative actionable findings recorded in the session-47 transcript, normalised to the v3b Conventional Comments envelope shape (`{label, blocking, category, evidence, remediation}`). Provenance for each finding is recorded in `_round` and `_session_47_persona_dimension` fields (underscore-prefixed = metadata, not consumed by the aggregator's dedup hash).
- `prior-verdict.json` — `{"verdict": "approve", "rounds": 9, "findings_count": 14, "shadow_k2_at_round_9": "approve"}`. The session-47 baseline didn't have shadow-k=N reporting (single-agent); the `shadow_k2_at_round_9` field is reconstructed from "what k=2 quorum WOULD have produced if the 14 findings had been distributed across 4 specialists at session-47 specialist-partition" — included as a calibration hint, not an authoritative replay assertion.
- `diff.patch` — captures the structural shape of PR #30's diff (file list + key change patterns) rather than the full byte-level patch. The full diff is `git show <PR-30-merge-sha>` against the canonical SHA recorded above. The fixture's purpose is to anchor the **finding-to-evidence mapping** for replay assertions, not to byte-replay the diff.

## Replay assertions (per `tests/personas/run-replay.sh`)

At v3b ship, the replay is **deterministic aggregator-only**:
1. Load `prior-findings.json` and partition the 14 findings across 4 synthetic specialist envelopes per the v3b spec 72c §4 dimension mapping (security/architecture/correctness/style).
2. Invoke `scripts/spawn-multi-reviewer.sh aggregate <synthetic-envelopes-dir>` and assert: the aggregated verdict at `k=1` matches `prior-verdict.json.verdict`; finding count is exactly the input count (14); per-specialist `seen_by[]` overlap with `prior-findings.json` is ≥50% (i.e. the dimension partitioning is stable).
3. Invoke `scripts/spawn-multi-reviewer.sh aggregate ... --differential --prior-findings prior-findings.json` and assert: `was_in_prior` is `true` for all 14 findings; `prior_findings_resolved` is `[]`; `token_metrics.resolved_count == 0`; `token_metrics.new_count == 0`.

This tests **aggregator stability against known inputs**, not persona-side drift. Persona drift detection (live re-invocation of specialists against `diff.patch`) ships at v3c per spec 72c §9 — it requires API budget per replay run + addresses a different failure mode (persona-prompt regression vs aggregator-logic regression).

## Honest framing

- v3b seed: 1 PR (PR #30). Below the promptfoo precedent of 5-10 PRs (spec 72c §10 L187).
- Pass tolerance: **strict** at this seed — verdict tier exactly matches; finding count exactly matches input. Tolerance widens to ±1 finding count and ≥50% specialist overlap as the seed grows past 1 PR + the aggregator's edge-case behaviour calibrates against more data points.
- The replay does NOT invoke `claude -p` at v3b ship. Live persona drift detection is deferred to v3c per spec 72c §9.

## Adding new replay seeds

When src/ slices ship multi-agent auto-review verdicts, append the round-N final state to a new `tests/personas/golden/<pr-id>/` directory using the same shape. Update `tests/personas/run-replay.sh`'s discovery loop to pick up the new seed. No CI workflow change required (path-filter already covers `tests/personas/golden/**`).
