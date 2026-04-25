# S-B-2 · Recommendations copy-flip — Test plan

**Slice:** S-B-2-recommendations-copy-flip
**AC doc:** `./acceptance.md`
**Framework:** `vitest` (file-content boolean-wrapper assertions via `tests/helpers/source-assertions.ts`) · no Playwright (no UI surface) · no manual visual (no UI surface)

---

## Test inventory

One T-N per AC. All automated. No manual tests in this slice — string substitutions in a logic file have deterministic, file-level evidence.

Test file: `tests/unit/recommendations-copy.test.ts` (12 `it()` cases across 4 `describe` blocks). Helper: `tests/helpers/source-assertions.ts` (lifted this slice from S-B-1's inline pattern per HANDOFF-30 candidate #4 — second use).

## T-1 · references AC-1 (§1 vocabulary substitutions A18 + A19)

- **Given:** spec 73 §1 / §1.1 + audit-catalogue rows A18 (`position` → `foundation`, `disclosure` → `submission`) and A19 (amended this slice — `position` → `picture going into`, `stronger` adjective → `strengthens` verb form).
- **When:** the test reads `src/lib/recommendations.ts` and runs `has`/`lacks` boolean-wrapper assertions for the catalogued before/after substrings.
- **Then:** A18 line 166 contains `'stronger foundation for any negotiation or submission'` and lacks `'stronger position for any negotiation or disclosure'`. A19 line 196 contains `'the more it strengthens your picture going into any discussion or mediation'` and lacks `'the stronger your position in any discussion or mediation'`.
- **Type:** unit (file-content assertion).
- **Automated:** yes (4 `it()` cases under `describe('S-B-2 · AC-1 §1 vocabulary substitutions (A18 + A19)')`).
- **Fixture:** none — source-content read.
- **Evidence:** vitest 4/4 green at commit `c0114a2`.

## T-2 · references AC-2 (§2 exception substitutions A17 boundary + A20)

- **Given:** spec 73 §2.1 ban + §2.4 exception policy + audit-catalogue rows A17 (boundary case — retain `'thorough disclosure'` literal; reframe surrounding narrative) and A20 (Form E submission swap).
- **When:** file-content assertion against the frozen AC text (`'thorough, formal disclosure'` for A17 — chosen reframe; `'organising your Form E submission'` for A20).
- **Then:** A17 line 163 contains `'thorough, formal disclosure'` and lacks the pre-amendment `'is thorough disclosure —'`. A20 line 215 contains `'organising your Form E submission'` and lacks `'organising your disclosure'`.
- **Type:** unit (file-content assertion).
- **Automated:** yes (3 `it()` cases under `describe('S-B-2 · AC-2 §2 exception substitutions (A17 boundary + A20)')`).
- **Fixture:** none.
- **Evidence:** vitest 3/3 green at commit `c0114a2`.

## T-3 · references AC-3 (Cat-B legal-process preserved verbatim)

- **Given:** the single Cat-B baseline at `src/lib/recommendations.ts:60` — the `getFinancialReactions` `'hidden_assets'` trigger message — captured pre-edit as fixture content.
- **When:** post-edit, the test reads `tests/unit/fixtures/recommendations-cat-b-baseline.txt`, calls `has(catBBaseline)` against the source.
- **Then:** the byte-for-byte string is present in source. Failure means the Cat-B line drifted.
- **Type:** unit (file-content assertion against frozen fixture).
- **Automated:** yes (1 `it()` case under `describe('S-B-2 · AC-3 Cat-B legal-process reference preserved verbatim')`).
- **Fixture:** `tests/unit/fixtures/recommendations-cat-b-baseline.txt` — captured pre-edit, single-line frozen reference.
- **Evidence:** vitest 1/1 green at commit `c0114a2` (test passed in RED state too — line 60 untouched throughout the slice).

## T-4 · references AC-4 (§2 banned-word audit clean)

- **Given:** spec 73 §2.1 ban + §2.2 ban + §2.4 exception policy.
- **When:** the test runs (a) `\bposition\b` regex match (case-insensitive) across the full source, and (b) `disclos[a-z]*` regex match across the full source.
- **Then:** (a) zero `position` matches anywhere in the file (full §2.2 ban — no exceptions). (b) exactly 3 `disclos[a-z]*` matches: line 60 (Cat-B `'formal disclosure process'`), line 163 (boundary `'thorough, formal disclosure'`), line 214 (Cat-D code key `'share_and_disclose'`). All three substrings asserted present individually as a defence-in-depth check.
- **Type:** unit (regex gate over full file + content assertion).
- **Automated:** yes (3 `it()` cases under `describe('S-B-2 · AC-4 §2 banned-word audit clean')`).
- **Fixture:** none.
- **Evidence:** vitest 3/3 green at commit `c0114a2`. Note: AC-4's hard-coded count of 3 is intentional — a future addition of legitimate Cat-B legal-process language would fail this test by design, forcing explicit catalogue update before merge.

---

## Fixture + scenario references

- **Cat-B baseline fixture:** `tests/unit/fixtures/recommendations-cat-b-baseline.txt` — net-new, captured at pre-edit time as the AC-3 frozen reference.
- **Bank scenarios:** N/A — no `bank/test-scenarios.ts` interaction in this slice.
- **WorkspaceStore scenarios:** N/A — no store interaction.
- **Dev fixture user:** N/A — no auth path.

## Visual regression placeholder

N/A — no UI surface. The slice changes string literals in a logic library; nothing renders differently to the user until a downstream slice consumes these outputs in a UI component (out of scope here).

## Manual test discipline

No manual tests in this slice. All AC verifiable via file-content assertions or regex gates that vitest can run headlessly. The §2.4 boundary judgment for A17 is a one-time human call captured in acceptance.md AC-2 + the review log; the test verifies the frozen text, not the reasoning.
