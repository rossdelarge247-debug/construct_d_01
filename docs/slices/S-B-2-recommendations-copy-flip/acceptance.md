# S-B-2 · Recommendations copy-flip — Acceptance criteria

**Slice:** S-B-2-recommendations-copy-flip
**Spec ref:** `docs/workspace-spec/73-copy-patterns.md` §1 (vocabulary), §2.1 + §2.2 (banned words), §2.4 (exception policy) · `docs/slices/S-C-U4-disclosure-audit/audit-catalogue.md` rows A17–A20 (lines 82–85)
**Phase:** Phase 2 (Build) — recommendation surfaces consumed by hub / discovery flows
**Status:** Approved (frozen 2026-04-25)

---

## Context

Second of the per-surface copy-flip slices that operationalise spec 73 vocabulary into shipping `src/`. Targets the four catalogued Cat-A rows (A17–A20) in `src/lib/recommendations.ts` — the recommendation-generation logic that produces `Recommendation` and `FinancialReaction` objects consumed by hub UI. Smaller surface than S-B-1 (4 rows vs 12) but harder per-row: A17 is the §2.4 exception-policy boundary case — "thorough disclosure" is a legal-process reference that **stays** while the surrounding narrative gets a one-word anchor (`'formal'`) so the legal register is unambiguous. A18 + A19 are clean §1 / §1.1 substitutions. A20 swaps a branded `'disclosure'` for the legal-form-name `'Form E submission'` per §2 exception.

Third `src/`-touching slice in Phase C (sequence S-F1 → S-B-1 → S-B-2). Re-uses the boolean-wrapper test idiom from S-B-1, lifted this slice to `tests/helpers/source-assertions.ts` per HANDOFF-30 candidate #4 (second use justifies extraction).

## Dependencies

- **Upstream slices:** S-C-U4 (audit catalogue · merged session 28) · S-F1 (no token consumption — pure-text slice) · S-B-1 (test-helper pattern · merged session 30).
- **Open decisions required:** none — A17–A20 dispositions catalogued at S-C-U4 lines 82–85; §2.4 exception policy locked session 28.
- **Re-use / Preserve-with-reskin paths touched:** `src/lib/recommendations.ts` (Re-use logic per spec 70 hub).
- **Discarded paths deleted at DoD:** none — pure-text slice.

## MLP framing

The loveable floor: every user-facing recommendation string in `src/lib/recommendations.ts` either (a) reads as the shared, evidence-backed picture-building register that spec 42 demands, or (b) names the underlying legal mechanism in language a solicitor or judge would actually use. No remaining branded `disclosure` or `position` framing. AC-1 + AC-2 deliver the four flips; AC-3 protects the Cat-B baseline; AC-4 is the audit-clean gate.

---

## AC-1 · §1 vocabulary substitutions (A18 + A19)

- **Outcome:** Two §1 / §1.1 substitutions land verbatim per audit-catalogue rows A18 and A19. After-state strings present in source; before-state strings absent.
- **Verification:**
  - A18 (`:166`): source contains `'stronger foundation for any negotiation or submission'`; source does **not** contain `'stronger position for any negotiation or disclosure'`.
  - A19 (`:196`): source contains `'stronger your picture going into any discussion or mediation'`; source does **not** contain `'stronger your position in any discussion or mediation'`.
  - Boolean-wrapper tests via `tests/helpers/source-assertions.ts`.
- **In scope:** The two complete catalogued substring replacements in `src/lib/recommendations.ts`.
- **Out of scope:** Other `position` / `disclosure` lines in adjacent files (their own slices); `serviceLink: 'share_and_disclose'` at `:214` (Cat-D code key per §2.4 condition 4 — leave alone).
- **Opens blocked:** none.
- **Loveable check:** "Stronger foundation" lands as supportive ("we built something solid together") rather than adversarial ("you are positioned against them"). "Stronger picture going into" reframes children-arrangements detail as something Sarah carries with her, not a stance she takes.
- **Evidence at wrap:** vitest run in PR description; line refs.

## AC-2 · §2 exception substitutions (A17 boundary + A20)

- **Outcome:** A17 retains the literal substring `'thorough disclosure'` (§2.4 boundary case) with the surrounding narrative reframed by adding `'formal'` so the legal-process register is unambiguous; A20 swaps the branded `'disclosure'` noun for `'Form E submission'` (§2 exception — Form E is the legal name).
- **Verification:**
  - A17 (`:163`): source contains `'thorough, formal disclosure'`; source does **not** contain the original `'is thorough disclosure —'` (without `'formal'`).
  - A20 (`:215`): source contains `'organising your Form E submission'`; source does **not** contain `'organising your disclosure'`.
  - Boolean-wrapper tests via `tests/helpers/source-assertions.ts`.
- **In scope:** The two complete catalogued substring replacements; A17's one-word `'formal'` insertion (the lightest reframe that anchors the §2.4 solicitor/judge test unambiguously).
- **Out of scope:** Wholesale rewrite of A17's surrounding paragraph; deletion of the literal `'disclosure'` from A17 (forbidden — disposition mandates retention).
- **Opens blocked:** none.
- **Loveable check:** A17's "thorough, formal disclosure" reads as the protection mechanism Sarah needs (legal-process register), not as a brand directive. A20's "Form E submission" tells Sarah exactly what's being organised — the literal court form, no ambiguity.
- **Evidence at wrap:** vitest run in PR description; line refs.

## AC-3 · Cat-B legal-process reference preserved verbatim

- **Outcome:** The single Cat-B baseline at `src/lib/recommendations.ts:60` ships verbatim — exact byte sequence preserved from pre-slice main. Audit-catalogue line 103 is the canonical reference.
- **Verification:**
  - Source contains the verbatim string `'The formal disclosure process requires both parties to declare everything under a legal oath. If information is deliberately hidden, there are serious legal consequences — including court orders and contempt proceedings.'`.
  - Implemented as a baseline-fixture test (S-B-1 pattern): the exact string is asserted as a single substring. Failure means the Cat-B line drifted.
- **In scope:** Single-line preservation invariant.
- **Out of scope:** Any edit to line 60.
- **Opens blocked:** none.
- **Loveable check:** Sarah's hidden-assets reaction continues to surface the legal protection in the precise terms a solicitor would use. No drift, no softening.
- **Evidence at wrap:** baseline-fixture test passes; git diff confirms `:60` untouched.

## AC-4 · §2 banned-word audit clean

- **Outcome:** Post-slice, `src/lib/recommendations.ts` contains zero branded usages of `'position'` (full §2.2 ban — no exceptions) and only the catalogued legal-process / boundary / Cat-D usages of `'disclos*'`.
- **Verification:**
  - Word-boundary regex `\bposition\b` matches **zero** times in the source (case-insensitive).
  - Regex `disclos[a-z]*` matches exactly three locations:
    1. `:60` — Cat-B legal-process (`'formal disclosure process'`)
    2. `:163` — §2.4 boundary (`'thorough, formal disclosure'`, after AC-2)
    3. `:214` — Cat-D code key (`'share_and_disclose'`, allowed per §2.4 condition 4)
  - Implemented as a `containsString` / `notContainsString` audit assertion plus a regex match-count assertion in the test file.
- **In scope:** Source-content invariant covering the whole `src/lib/recommendations.ts` file post-slice.
- **Out of scope:** Adjacent files (S-B-1 already covered `confirmation-questions.ts`; downstream slices cover the rest).
- **Opens blocked:** none.
- **Loveable check:** No regression vector — if a future edit tries to reintroduce `'position'` or a branded `'disclosure'`, the audit-clean test fails before merge.
- **Evidence at wrap:** vitest assertion passes in PR description.

---

## Review log

- **2026-04-25 · AC freeze:** Frozen as drafted. A17 reframe shape: one-word `'formal'` insertion (lightest viable reframe; echoes Cat-B line 60 phrasing).
- **{date} · Tests RED:** {filled when failing-tests commit lands}
- **{date} · Tests GREEN:** {filled when implementation commit lands}
- **{date} · Adversarial pass:** {filled at adversarial review}
- **{date} · Security checklist:** {filled at §13 sweep}
- **{date} · DoD walked:** {filled at PR-open}
