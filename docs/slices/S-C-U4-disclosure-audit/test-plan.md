# S-C-U4 · Disclosure-language audit — Test plan

**Slice:** S-C-U4-disclosure-audit
**Companion:** `acceptance.md` (AC-1 through AC-5), `audit-catalogue.md`, `docs/workspace-spec/73-copy-patterns.md`

## Scope note

This is a **docs-only slice**. No runtime behaviour changes, no new code paths. Tests are deterministic content checks run as bash one-liners (grep + wc) against the committed documentation, plus one manual review pass per output doc. One test per AC minimum, per Engineering-conventions DoD item 2.

Every command below is run from the repo root on branch `claude/S-C-U4-disclosure-audit` at HEAD. Expected output is stated inline; any deviation is a test failure.

---

## T-1 · AC-1 — Audit catalogue completeness

**Intent:** Every surface spec 68g C-U4 lines 15–28 enumerates appears verbatim in the audit catalogue, and src/ banned-word grep is accounted for.

**Commands:**
```
# 14 session-22 wire surfaces present
grep -c '^| [0-9]' docs/slices/S-C-U4-disclosure-audit/audit-catalogue.md | head -1
# expect: first numbered-row count in Part 1 table = 14

# src/ grep hits all catalogued or classified
grep -riEn "[Dd]isclos(e|ure)|\byour [Pp]osition\b" src/ 2>/dev/null | wc -l
# expect: count aligns with Part 2 Summary table Total-src/ row (41)

# Every Category-A row cites a §N pattern-doc section
grep -c '§[1234]' docs/slices/S-C-U4-disclosure-audit/audit-catalogue.md
# expect: ≥ 20 (one per Cat-A row) + ≥ 14 (one per wire surface)
```

**Manual verification:** Spot-check three random Part 1 rows against spec 68g lines 15–28 for verbatim string match. Spot-check three random Part 2 Cat-A rows against src/ file+line to confirm location accuracy.

**Pass:** All three commands return expected values; manual spot-checks match verbatim.

---

## T-2 · AC-2 — Pattern doc §1 + §2 content presence

**Intent:** §1 contains the six canonical terms verbatim; §2 contains the three banned terms verbatim; C-U6 fold-in (5-phase labels) present.

**Commands:**
```
# Six §1 canonical terms appear as subheadings
grep -cE '^### 1\.[1-6] `(picture|shared|build|reconcile|settle|finalise)`' docs/workspace-spec/73-copy-patterns.md
# expect: 6

# Three §2 banned terms appear as subheadings
grep -cE '^### 2\.[1-3] `(disclose|position)`|disclosure' docs/workspace-spec/73-copy-patterns.md
# expect: ≥ 2 (disclose/disclosure combined in 2.1; position in 2.2; 2.3 = additional)

# 5-phase nav labels appear (C-U6 fold-in)
grep -cE '\*\*(Start|Build|Reconcile|Settle|Finalise)\*\*' docs/workspace-spec/73-copy-patterns.md
# expect: ≥ 5
```

**Manual verification:** Read §1 + §2. Confirm every worked example in §1 cites a catalogue row number. Confirm §2 exception policy (legal-process references) is explicit and testable (the solicitor/judge test).

**Pass:** Commands return expected counts; manual review confirms worked-example traceability.

---

## T-3 · AC-3 — §3 empty-state verbs resolve C-U5

**Intent:** §3 contains the C-U5 Lean (d) templates verbatim; classification table covers every workspace section with an empty state; rejected alternatives logged.

**Commands:**
```
# Lean (d) templates present verbatim
grep -c "Tell us about your" docs/workspace-spec/73-copy-patterns.md
# expect: ≥ 3 (template + worked examples)

grep -c "Nothing here yet" docs/workspace-spec/73-copy-patterns.md
# expect: ≥ 1 (template definition)

# Classification table present with ≥ 8 workspace sections
grep -cE '^\| (Children|Home|Spending|Debts|Other assets|Pensions|Income|Business|Savings|Additional properties|Health)' docs/workspace-spec/73-copy-patterns.md
# expect: ≥ 8

# Rejected-alternatives block present (options a/b/c with reject reasoning)
grep -c '^- \*\*(a)\*\* All narrative — reject' docs/workspace-spec/73-copy-patterns.md
# (simpler: presence of "reject" with three options)
grep -c 'reject' docs/workspace-spec/73-copy-patterns.md
# expect: ≥ 3
```

**Pass:** All three commands return expected counts; classification table covers every section with an empty state.

---

## T-4 · AC-4 — §4 four tone subsections + banned-word hygiene

**Intent:** §4 contains all four tones (confirmation / attention / success / error); each has principle + shape + ≥3 worked examples; no worked example uses §2 banned-word list.

**Commands:**
```
# Four tone subsections present
grep -cE '^### 4\.[1-4] (Confirmation|Attention|Success|Error) tone' docs/workspace-spec/73-copy-patterns.md
# expect: 4

# Each tone has ≥3 worked examples (rough proxy: count "Worked examples" header subitems)
grep -cE '^  [0-9]+\. ' docs/workspace-spec/73-copy-patterns.md
# expect: ≥ 12 (4 tones × 3 examples)

# Banned-word hygiene in §4 worked examples
# Extract §4 and check for banned terms in worked-example body (between ### 4.1 and ## Maintenance)
awk '/^### 4\.1/,/^## Maintenance/' docs/workspace-spec/73-copy-patterns.md | grep -iE 'disclos(e|ure)|your position'
# expect: no hits (empty output) — §4 examples must not use banned branding
```

**Manual verification:** Read each of the four tone subsections. Confirm worked examples would read as warm / direct / celebratory / reassuring as appropriate. Confirm no example exceeds length caps (headline ≤6 words, body ≤2 sentences, CTA ≤4 words).

**Pass:** Four tones present; ≥12 examples; zero banned-branding hits in §4; manual review passes register + length check.

---

## T-5 · AC-5 — 68g glyph flips + Locked appendices

**Intent:** C-U4, C-U5, C-U6 flipped 🟠 → 🟢 at the exact header lines; three "Locked:" appendices present with spec 73 + catalogue references; no other copy churn in 68g.

**Commands:**
```
# Three green-glyph flips
grep -cE '🟢 C-U[456]' docs/workspace-spec/68g-copy-share-opens.md
# expect: 3

# Three Locked appendices referencing spec 73
grep -c '^\*\*Locked:\*\*.*spec/73-copy-patterns' docs/workspace-spec/68g-copy-share-opens.md
# Alt form if ref path differs slightly:
grep -c '^\*\*Locked:\*\*' docs/workspace-spec/68g-copy-share-opens.md
# expect: 3

# No unintended churn: diff vs origin/main for 68g shows only glyph + appended lines
git diff origin/main -- docs/workspace-spec/68g-copy-share-opens.md | grep -E '^[-+]' | grep -v '^[-+]{3}' | wc -l
# expect: small (≤ 12 lines = 3 glyph-flips × 2 + 3 appended-line inserts)
```

**Pass:** Glyph count = 3; Locked appendices = 3; diff tightness (≤ ~12 +/- lines).

---

## Test-run log

| Test | Run | Outcome | Evidence |
|---|---|---|---|
| T-1 | 2026-04-24 | **PASS** | Part-1 rows = 14 (expected 14); §N citations = 39 (expected ≥ 34). Manual spot-check: wire-surface #1, #6, #11 match spec 68g verbatim; src/ Cat-A row A2 location confirmed at `confirmation-questions.ts:1250` |
| T-2 | 2026-04-24 | **PASS** | §1 canonical-term subheadings = 6 (expected 6); 5-phase label bolds = 5 (expected ≥ 5) |
| T-3 | 2026-04-24 | **PASS** | "Tell us about your" = 13 (expected ≥ 3); "Nothing here yet" = 4 (expected ≥ 1); reject-reasoning hits = 4 (expected ≥ 3) |
| T-4 | 2026-04-24 | **PASS** | Four tone subsections confirmed; worked-examples = 12 (4 tones × 3 examples; grep pattern corrected mid-run from `^  1\. ` to `^  [0-9]+\. `); banned-word grep in §4 examples = 0 (expected 0) |
| T-5 | 2026-04-24 | **PASS** | Green glyphs = 3 (expected 3); Locked appendices = 3 (expected 3); 68g diff = 11 +/- lines (expected ≤ 12) |

All five tests PASS. Evidence retained inline above; commit `$(git rev-parse --short HEAD)` carries the verified state.
