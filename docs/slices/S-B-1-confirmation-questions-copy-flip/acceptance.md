# S-B-1 · confirmation-questions copy-flip — Acceptance criteria

**Slice:** S-B-1-confirmation-questions-copy-flip
**Spec ref:** `docs/workspace-spec/73-copy-patterns.md` §1 (vocabulary) · §2 (banned words inc. §2.4 exception) · §3 (empty-state verb family) · §4.1 (confirmation tone) · `docs/slices/S-C-U4-disclosure-audit/audit-catalogue.md` rows A1–A12
**Phase(s):** Phase 2 (Build) — confirmation-question runtime strings
**Status:** Approved · in implementation

---

## Context

S-B-1 is the second `src/`-touching slice and the first non-foundation slice. It is the first time spec 73 vocabulary transitions from doc to live runtime: 12 Category-A confirmation-question strings in `src/lib/bank/confirmation-questions.ts` (Preserve-with-reskin per CLAUDE.md Key files) are flipped from the banned `disclose` / `disclosure` branding to spec 73 §1 vocabulary (`captured`, `ready to share`) and §3 empty-state pattern (`add`). The same commit also fixes a 4-occurrence file-path typo in `docs/SESSION-CONTEXT.md` that originated in session 28 and propagated through session-29 wrap; the typo names this slice's target file as the wrong path. Slice depends on the audit-catalogue (S-C-U4, shipped session 28); it unblocks the remaining per-file copy-flip slices in the §73 rollout sequence (notably the 4-row `src/lib/recommendations.ts` cluster A17–A20).

## Dependencies

- **Upstream slices:** S-C-U4-disclosure-audit (catalogue authoritative); S-F1-design-tokens shipped but not consumed (no token usage in a logic file).
- **Open decisions required:** none — spec 73 §1, §2, §3, §4 all locked session 28.
- **Re-use / Preserve-with-reskin paths touched:** `src/lib/bank/confirmation-questions.ts` (Preserve-with-reskin per CLAUDE.md Key files).
- **Discarded paths deleted at DoD:** none. No V1 deletion in this slice.

## MLP framing

The loveable floor for this slice is: every accordion label and list-section empty-state in `src/lib/bank/confirmation-questions.ts` reads in spec 73's positive vocabulary — *captured · ready to share · no X to add* — with the underlying legal-process disclosure references (Form E / CETV / DLA) preserved verbatim per §2.4 exception policy. Cuts happen by deferring a row to a follow-up slice (re-slicing), not by accepting a banned-branding string into shipped scope.

---

## AC-1 · §1 captured/share substitutions on accordion + status labels

- **Outcome:** Every audit-catalogue row mapped to spec 73 §1 (captured/share pattern) reads *"X captured, ready to share"* — no occurrences of *"X disclosed, ready for sharing & collaboration"* remain in the file.
- **Verification:** `grep -n "disclosed, ready for sharing & collaboration" src/lib/bank/confirmation-questions.ts` returns zero matches; the corresponding rows return *"captured, ready to share"* (verbatim per spec 73 §1.2 worked example).
- **In scope:** Rows A1 (line 46 type comment), A2 (1250), A6 (1433/1434/1435/1449 — see implementation note), A7 (1474), A9 (1547), and the §1-portion of A3 (1282), A5 (1401 first half), A10 (1637), A11 (1809), A12 (1996).
- **Out of scope:** the §3 empty-state portions of those mixed rows (covered by AC-2); any string outside the audit-catalogue Cat-A list.
- **Opens blocked:** none.
- **Loveable check:** *"Income captured, ready to share"* reads as something a partner would say to a partner — a co-built artefact, not a one-way legal act. Spec 42 pillar 1 (*"shared, not adversarial"*) is audible in the string. Pass.
- **Evidence at wrap:** vitest 30/30 green (`tests/unit/confirmation-questions-copy.test.ts` AC-1 block). 11 substitution sites at lines 46 (type comment), 1250, 1401 §1-portion, 1433–1435, 1449, 1474, 1547, 1637 §1-portion, 1809 §1-portion, 1996 §1-portion. `grep -c "captured" src/lib/bank/confirmation-questions.ts` = 14 (12 from substitutions + 2 pre-existing spec-73-aligned uses outside slice scope).

**Implementation note for A6 (catalogue↔file mismatch).** Audit-catalogue calls 1433–1435/1449 *"accordion labels"*; the live file has these as `facts.push({ label: ... })` template-string entries with a trailing `${valueLabel}` token. Verbatim *"captured, ready to share"* breaks the template: *"Savings account captured, ready to share£5,000"* reads wrong. Resolution: apply the §1.2 *pattern* (drop "disclosed", use "captured"; keep template structure; do not append "ready to share" where the original lacked it). Worked replacement: *"Savings account disclosed${valueLabel}"* → *"Savings account captured${valueLabel}"*. Pattern source: spec 73 §1.2 (*"Income disclosed, ready for sharing & collaboration → Income captured, ready to share"*) interpreted as substitution rule, not literal formula.

## AC-2 · §3 empty-state `add` substitutions on list-section facts

- **Outcome:** Every audit-catalogue row mapped to spec 73 §3 (list-section empty-state pattern) uses the *"No X to add"* / *"X to add"* phrasing — no occurrences of *"No X to disclose"* / *"X to disclose"* remain in the file.
- **Verification:** `grep -nE "no .* to disclose|to disclose" src/lib/bank/confirmation-questions.ts` returns zero matches outside the 5 Cat-B legal-process lines listed in AC-3.
- **In scope:** Rows A4 (1288, 1303, 1304), A8 (1492, 1499, 1514), and the §3-portion of A3 (1282), A5 (1401 second half), A10 (1629), A11 (1801), A12 (1954).
- **Out of scope:** §1 captured/share portions of those mixed rows (covered by AC-1).
- **Opens blocked:** none.
- **Loveable check:** *"No property to add"* invites the user forward; *"No property to disclose"* sounds like absence-of-evidence in a legal proceeding. The flip is the entire point of spec 73 §3. Pass.
- **Evidence at wrap:** vitest 30/30 green (AC-2 block). 11 substitution sites at lines 1282, 1288, 1303, 1304, 1401 §3-portion, 1492, 1499, 1514, 1629, 1801, 1954. Banned-pattern regex `(?:no )?[a-z()]+ to disclose` returns zero matches.

## AC-3 · Cat-B legal-process references preserved verbatim

- **Outcome:** The 5 legal-process `disclos*` references in the file (Form E / CETV / DLA mechanics) remain byte-identical pre→post. No over-correction.
- **Verification:** `git diff main -- src/lib/bank/confirmation-questions.ts` shows no change at lines 642, 667, 827, 1532, 1740. The "starting position" Cat-B lines 1328 and 1422 (separate §2.2 boundary) also remain unchanged.
- **In scope:** Lines 642 (small accounts must be disclosed), 667 (Form E requires disclosure of recently closed accounts), 827 (CETV required for financial disclosure), 1532 (CETV required for disclosure), 1740 (DLA must be disclosed). Plus 1328 / 1422 ("starting position").
- **Out of scope:** any line not on the audit-catalogue Cat-A list. If implementation surfaces new flips, capture as audit-catalogue amendment per kickoff scope ceiling — do not silently expand.
- **Opens blocked:** none.
- **Loveable check:** the user reading *"A CETV is required for financial disclosure"* is being told what the legal system literally requires. Replacing "disclosure" here with brand vocabulary would mislead the user about the legal mechanism. §2.4 exception: passes the solicitor / judge test ("could a solicitor say this exact sentence?" — yes). Pass.
- **Evidence at wrap:** vitest AC-3 test green pre+post substitution batch. `git diff main -- src/lib/bank/confirmation-questions.ts` shows zero hunks at lines 642, 667, 827, 1328, 1422, 1532, 1740. Cat-B baseline fixture md5: `6ae2b0f218c663dfefab0b3912013ed2`.

## AC-4 · §2 banned-word audit clean

- **Outcome:** Post-edit, every remaining `disclos*` occurrence in the file traces to a §2.4 exception (legal-process reference). No branded use survives.
- **Verification:** `grep -n "disclos" src/lib/bank/confirmation-questions.ts | wc -l` returns exactly 5; the matching line numbers are 642, 667, 827, 1532, 1740 (the AC-3 set). Each is audited against §2.4 — quoted spec / legal-process — and pinned in the test as a Cat-B-permitted line.
- **In scope:** the entire file (gate covers the whole substitution surface).
- **Out of scope:** banned-word checks on other files (those belong to the per-file slices that follow this one).
- **Opens blocked:** none.
- **Loveable check:** the audit gate is what makes the slice trustworthy — every shipped string has been weighed against §2.4. Pass.
- **Evidence at wrap:** vitest AC-4 test green. `grep -c "disclos" src/lib/bank/confirmation-questions.ts` = 5. Cross-validated against Cat-B fixture in test T-4: every remaining `disclos*` line matches a Cat-B baseline line.

## AC-5 · `docs/SESSION-CONTEXT.md` typo correction (4 occurrences)

- **Outcome:** All 4 occurrences of `src/lib/ai/recommendations.ts` in the wrong-context (S-B-1 target) lines of `docs/SESSION-CONTEXT.md` are corrected to `src/lib/bank/confirmation-questions.ts`. Shipped in the same commit as AC-1/AC-2 src edits, so the typo never carries past S-B-1 wrap.
- **Verification:** `grep -n "src/lib/ai/recommendations.ts" docs/SESSION-CONTEXT.md` returns zero matches; `grep -n "src/lib/bank/confirmation-questions.ts" docs/SESSION-CONTEXT.md` returns at least 4 matches at the corrected line positions (lines 45, 64, 232, 235 pre-edit — line numbers may shift by edit composition).
- **In scope:** lines 45, 64, 232, 235 of `docs/SESSION-CONTEXT.md` as identified by pre-edit grep. Each names this slice's target file.
- **Out of scope:** any other path-correction; any rewrite of surrounding prose; any edit to `docs/HANDOFF-SESSION-29.md` (historical-audit-trail per spec 73 §2.4 condition 3 — retain the typo as session-29 evidence; it'll be flagged in HANDOFF-30).
- **Opens blocked:** none.
- **Loveable check:** N/A user-facing — internal-doc consistency item. Discipline check: passes — typo fixed in the same commit it was discovered in, no carryover.
- **Evidence at wrap:** vitest AC-5 tests (2/2) green. Pre-edit `grep -c "src/lib/ai/recommendations.ts" docs/SESSION-CONTEXT.md` = 4. Post-edit: 0 wrong-path occurrences; 4 corrected-path occurrences. Shipped same commit as AC-1/AC-2 src edits per AC-5 In-scope rule.

---

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-04-25 | User | Pending | AC-1..AC-5 drafted; awaiting explicit freeze before src/ edit |
| 2026-04-25 | User | **Frozen** | AC frozen ("ok") — implementation may begin · Cat-B baseline fixture capture is the next step |

**AC is the contract.** Change requests after freeze roll into re-drafting AC + re-slicing, not mid-slice scope shifts.
