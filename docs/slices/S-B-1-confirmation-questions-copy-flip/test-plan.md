# S-B-1 · confirmation-questions copy-flip — Test plan

**Slice:** S-B-1-confirmation-questions-copy-flip
**AC doc:** `./acceptance.md`
**Framework:** `vitest` (unit on string outputs + file-content gates) · no Playwright (no UI surface) · no manual visual (no UI surface)

---

## Test inventory

One test per AC. All automated. No manual tests in this slice — string substitutions in a logic file have deterministic, file-level evidence.

## T-1 · references AC-1 (§1 captured/share substitutions)

- **Given:** the substitution rules from spec 73 §1 + audit-catalogue rows A1, A2, A6, A7, A9, and the §1-portion of A3/A5/A10/A11/A12.
- **When:** the test reads `src/lib/bank/confirmation-questions.ts` (file-content read) and asserts each row's expected post-edit string at the row's expected line band.
- **Then:** every accordion-label and status-bearing facts.label entry mapped by AC-1 reads *"X captured, ready to share"* (verbatim) or — for A6 — *"X captured${valueLabel}"* (template-preserving).
- **Type:** unit (file-content assertion).
- **Automated:** yes.
- **Fixture:** none — assertions are against the file source.
- **Evidence at wrap:** vitest output + commit SHA.

**Optional secondary path:** if the decision-tree functions can be invoked with synthetic inputs (Sarah scenario from `src/lib/bank/test-scenarios.ts`) and the output object's `accordionLabel` / `facts[].label` strings inspected directly, that's preferred over file-content read. Decision deferred to implementation; AC-1 outcome is content correctness regardless of vector.

## T-2 · references AC-2 (§3 empty-state `add` substitutions)

- **Given:** spec 73 §3 list-section empty-state pattern + audit-catalogue rows A4, A8, and the §3-portion of A3/A5/A10/A11/A12.
- **When:** file-content assertion at each row's line band.
- **Then:** every list-section empty-state entry reads *"No X to add"* or *"X to add"*; no *"to disclose"* fragments survive outside the AC-3 Cat-B set.
- **Type:** unit (file-content assertion).
- **Automated:** yes.
- **Fixture:** none.
- **Evidence at wrap:** vitest output.

## T-3 · references AC-3 (Cat-B legal-process preserved)

- **Given:** the 5 Cat-B `disclos*` lines (642, 667, 827, 1532, 1740) and 2 Cat-B "starting position" lines (1328, 1422), captured pre-edit as fixture content.
- **When:** post-edit, the test reads the same line numbers (or matched-by-content if line-number drift occurred from upstream insertions in the same commit).
- **Then:** every Cat-B line is byte-identical pre→post.
- **Type:** unit (file-content assertion against frozen fixture).
- **Automated:** yes.
- **Fixture:** `tests/unit/fixtures/confirmation-questions-cat-b-baseline.txt` — captured pre-edit, frozen as the assertion target.
- **Evidence at wrap:** vitest output + diff (zero hunks at fixture lines).

## T-4 · references AC-4 (§2 banned-word audit gate)

- **Given:** spec 73 §2 ban + §2.4 exception policy.
- **When:** the test runs `grep -n "disclos" src/lib/bank/confirmation-questions.ts` (or the in-process equivalent — file-read + regex match).
- **Then:** exactly 5 matches return; the matching line numbers are the AC-3 set (642, 667, 827, 1532, 1740). Any other match fails the test with the offending line printed.
- **Type:** unit (regex gate over full file).
- **Automated:** yes.
- **Fixture:** none.
- **Evidence at wrap:** vitest output showing 5/5.

## T-5 · references AC-5 (SESSION-CONTEXT.md typo fix)

- **Given:** pre-edit, `grep "src/lib/ai/recommendations.ts" docs/SESSION-CONTEXT.md` returns 4 matches.
- **When:** the test runs the same grep post-edit.
- **Then:** zero matches; and `grep "src/lib/bank/confirmation-questions.ts" docs/SESSION-CONTEXT.md` returns at least 4 matches.
- **Type:** unit (file-content assertion).
- **Automated:** yes.
- **Fixture:** none.
- **Evidence at wrap:** vitest output + pre/post grep counts.

---

## Fixture + scenario references

- **Bank scenarios:** `src/lib/bank/test-scenarios.ts` available if T-1's secondary path (functional invocation) is taken; otherwise unused — file-content assertions don't need scenarios.
- **WorkspaceStore scenarios:** N/A — no store interaction in this slice.
- **Dev fixture user:** N/A — no auth path.
- **Cat-B baseline fixture:** `tests/unit/fixtures/confirmation-questions-cat-b-baseline.txt` — net-new, captured at pre-edit time as the AC-3 frozen reference.

## Visual regression placeholder

N/A — no UI surface. The slice changes string literals in a logic library; nothing renders differently to the user until a downstream slice consumes these outputs in a UI component (out of scope here).

## Manual test discipline

No manual tests in this slice. All AC verifiable via file-content assertions or grep gates that vitest can run headlessly. If implementation reveals an unforeseen branch that requires manual confirmation, capture as a deferral with reason in `verification.md` Adversarial-run section.
