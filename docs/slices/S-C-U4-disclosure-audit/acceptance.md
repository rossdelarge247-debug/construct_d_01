# S-C-U4 · Disclosure-language audit across surfaces — Acceptance criteria

**Slice:** S-C-U4-disclosure-audit
**Spec ref:** `docs/workspace-spec/68g-copy-share-opens.md` §C-U4 (primary) · §C-U5 · §C-U6 (fold-ins) · `docs/workspace-spec/68a-decisions-crosscutting.md` C-U1 (parent positioning lock)
**Phase(s):** Cross-cutting copy-audit pass, precedes Phase C visual extraction and Build Map finalisation
**Status:** Draft · awaiting user review before implementation

---

## Context

Session 22 wires leaked "disclosure-tool" language back across ~14 surfaces despite 68a C-U1 locking *"never 'financial disclosure tool' framing"* as load-bearing positioning (per spec 42 — Decouple is the complete settlement workspace, not a better Form E). This slice runs the surface-by-surface audit spec 68g C-U4 mandates, produces the single copy pattern doc that spec calls for (four sections: replacement vocab, banned words, empty-state verb family, tone templates), and closes C-U4, C-U5, and C-U6 in the 68g open-decisions register. Output feeds Phase C visual extraction and Build Map finalisation — downstream slices that replace the leaked strings in src/ will reference the copy pattern doc as their source of truth.

This slice is **docs-only** by design. No src/ string replacements ship in this slice; the audit catalogues where leaked strings live, and replacement scheduling rolls into later per-surface slices (Build Map input per C-U6 Target). A single discovery path — running grep across docs/workspace-spec/ for the banned-word list — is in scope; grep across src/ is in scope for catalogue coverage (read-only), not for edits.

## Dependencies

- **Upstream slices:** None (this is a cross-cutting copy-audit pass — no prior slice required; precedes S-F1 design-system extraction).
- **Open decisions required:** None — 68a C-U1 (parent positioning) is already locked 🟢. This slice resolves 68g C-U4 🟠 → 🟢 and folds in C-U5 🟠 → 🟢 and C-U6 🟠 → 🟢.
- **Re-use / Preserve-with-reskin paths touched:** None. Any src/ grep is read-only for catalogue purposes. Downstream slices touching those files will use the copy pattern doc produced here.
- **Discarded paths deleted at DoD:** None in this slice (no src/ deletions). Future slices that replace leaked strings will reference this audit.

## MLP framing

The loveable floor for this slice is: **after this slice, no team member (Claude or human) drafting new copy needs to ask "is this word okay to use" or "what's the tone for an error message" — the copy pattern doc answers it, and the surface-by-surface audit shows what's already broken and waiting to be fixed.** Taken together, the AC below should satisfy that. Cuts happen by deferring AC to a later slice (re-slicing), not by shipping lukewarm AC.

---

## AC-1 · Surface-by-surface audit catalogue

- **Outcome:** Every "disclosure-tool" string surfaced in session 22 wires (14 enumerated in spec 68g C-U4 Context lines 15–28) plus any discovered via `grep -ri` across `src/` and `docs/workspace-spec/` for the banned-word set is catalogued in `docs/slices/S-C-U4-disclosure-audit/audit-catalogue.md` with: surface name · current string · location (file path + line if src/, or "session 22 wire / {wire name}" if design-only) · replacement string · rationale (which banned word triggered inclusion · which pattern doc section governs the replacement).
- **Verification:** Open `audit-catalogue.md`; confirm (a) all 14 surfaces from spec 68g C-U4 lines 15–28 appear verbatim in the "current string" column, (b) every row has a non-empty replacement string, (c) every row cites the copy-pattern-doc section governing the replacement, (d) running `grep -riEn "disclos(e|ure)|\byour position\b" src/ docs/workspace-spec/ --include='*.ts' --include='*.tsx' --include='*.md' | grep -v 'audit-catalogue\.md\|copy-patterns\.md\|68g-copy-share-opens\.md'` returns only hits that appear in the catalogue (or are explicitly annotated in-file as historical/quoted spec text, not live copy).
- **In scope:** The 14 surfaces in spec 68g C-U4. New surfaces discovered by grep. "Sharing & Collaboation" [sic] typo at line 27 — corrected to "Sharing & Collaboration" as a catalogued fix. Version chip "V1 Last updated 21/04/2026" noted but cross-referenced to 68b B-V1 (spec says "also conflicts with 68b B-V1 which drops version chips") rather than replaced here.
- **Out of scope:** Actually editing src/ strings (rolls into downstream per-surface slices). Replacing historical references in archived HANDOFF-SESSION-*.md docs (frozen retros — do not retrofit, per slices/README.md maintenance rule). Pre-pivot specs 03–06, 11, 12 (CLAUDE.md rule: do not reference).
- **Opens blocked:** None.
- **Loveable check:** A downstream-slice engineer opening `audit-catalogue.md` should be able to pick one row, find the exact src/ line, apply the replacement without a second judgement call, and know which pattern doc section justifies it. That is delight for the engineer (no re-interpretation) and delight for the user (consistent vocabulary landing across the workspace). Passes.
- **Evidence at wrap:** `audit-catalogue.md` row count · grep verification command output pasted · at-least-one cross-reference to `copy-patterns.md` per row spot-checked.

## AC-2 · Copy pattern doc §(a) replacement vocabulary + §(b) banned words

- **Outcome:** `docs/workspace-spec/73-copy-patterns.md` (new spec, next free number) created with two opening sections:
  - **§1 Replacement vocabulary** — defines the six terms named in spec 68g C-U4 decision line 29 (*"picture / shared / build / reconcile / settle / finalise"*) with: canonical meaning · where it's used (nav / CTA / section heading / body) · worked examples (before → after, pulled from the audit catalogue).
  - **§2 Banned words** — lists the three words named in spec 68g C-U4 decision line 29 (*"disclose / disclosure / position"*) plus any additional terms surfaced by the audit (e.g. "Prepare your disclosure" → is "prepare" banned, or only in this context?). Each banned term has: why it's banned (traces to 68a C-U1 + spec 42 positioning) · narrow exceptions if any (e.g. historical reference in retro docs) · the replacement vocabulary term(s) that substitute for it.
  - Fold-in for C-U6: §1 names the canonical 5-phase labels from 68a C-N3 (*Start / Build / Reconcile / Settle / Finalise*) as the nav + section-H2 + stepper vocabulary. Tour-verb labels (*Prepare / Share / Build / Finalise*) explicitly banned from nav surfaces per 68g C-U6 Lean (a).
- **Verification:** Open `73-copy-patterns.md`; confirm §1 contains the six terms from spec 68g C-U4 line 29 verbatim · §2 contains the three banned terms from spec 68g C-U4 line 29 verbatim · the C-U6 5-phase label list appears in §1 with cross-ref to 68a C-N3 · every worked example in §1/§2 maps to a row in `audit-catalogue.md`.
- **In scope:** The six replacement terms. The three banned terms. The C-U6 5-phase nav labels. Tour-verb-label demotion per C-U6.
- **Out of scope:** §(c) empty-state verbs (AC-3). §(d) tone templates (AC-4). C-S5 / C-S6 share-mechanic copy (separate 68g entries, separate slice). Any copy that doesn't trace to a banned-word hit or a 68g C-U4/5/6 decision.
- **Opens blocked:** None — spec has fully locked 68a C-U1 + spec 42 as upstream, and 68g C-U4 decision is unambiguous on the vocabulary list.
- **Loveable check:** Someone drafting a new CTA or nav item can open §1+§2, find the word they want to use, and know in 30 seconds whether it's in-bounds. That is the floor.
- **Evidence at wrap:** Line-count of `73-copy-patterns.md` · diff of §1+§2 added · grep confirmation that the six / three literal terms appear.

## AC-3 · Copy pattern doc §(c) empty-state verb family (resolves C-U5)

- **Outcome:** `docs/workspace-spec/73-copy-patterns.md` §3 "Empty-state verb family" written per spec 68g C-U5 Lean (d) verbatim: *"narrative sections (Children / Home) use 'Tell us about your {topic}'; list sections (Debts / Other assets / Pensions) use 'Add {item}'. Empty-state body stays light: 'Nothing here yet' (per C-U4 audit, not 'Nothing disclosed yet')."* Section includes: the narrative-vs-list classification (which workspace sections fall in each bucket with reasoning), the exact CTA templates, the empty-state body template, rejected alternatives with reasons (options a/b/c from spec 68g C-U5 Options line 34 with why Lean (d) wins).
- **Verification:** `73-copy-patterns.md` §3 contains the two CTA templates from spec 68g C-U5 line 35 verbatim · contains the "Nothing here yet" body template verbatim · every workspace section with an empty state (Children · Home · Debts · Other assets · Pensions · and any additional surfaced by the audit) is classified narrative-or-list with one-sentence reasoning.
- **In scope:** Narrative-vs-list classification for every workspace section with an empty state. CTA templates. Body template. Rejected-alternative log.
- **Out of scope:** Empty-state *visual* treatment (belongs to Phase C visual extraction — 68g-visual-anchors C-V{N}). Error-state copy (AC-4 tone templates).
- **Opens blocked:** None — 68g C-U5 has a clear Lean (d); this slice converts Lean into Locked.
- **Loveable check:** A user hitting an empty Children section sees "Tell us about your children" — warm, declarative, inviting. A user hitting an empty Debts section sees "Add a debt" — direct, action-oriented, no friction. Different registers for different cognitive loads. That is craft.
- **Evidence at wrap:** §3 diff · classification table spot-checked · rejected-alternative block present.

## AC-4 · Copy pattern doc §(d) tone templates (confirmation / attention / success / error)

- **Outcome:** `docs/workspace-spec/73-copy-patterns.md` §4 "Tone templates" written covering all four tones spec 68g C-U4 decision line 29 names (*"confirmation / attention / success / error"*). Each template has: tone principle (one paragraph — what this register does, per CLAUDE.md North Star *"a warm hand on a cold day — compassionate, professional, never patronising"*) · structural shape (headline + body + CTA, length bounds, banned patterns) · three worked examples drawn from the workspace (e.g. confirmation of bank-connect complete · attention callout that Sarah needs to add a missing pension statement · success on consent-order generation · error on failed bank reconnection). Worked examples use the replacement vocabulary from §1 and respect the banned-word list in §2.
- **Verification:** `73-copy-patterns.md` §4 contains all four tone subsections named in spec 68g C-U4 line 29 · each has a tone principle paragraph + structural shape + ≥3 worked examples · no worked example uses any term from §2 banned-word list (grep check).
- **In scope:** The four tones named in spec. Principle · shape · examples for each. The "warm hand on a cold day" framing from CLAUDE.md North Star as the tone anchor.
- **Out of scope:** Notification / email / SMS tone (separate surface, not in spec 68g C-U4). Legal-document tone (consent order, Form E outputs — governed by spec 44 document-as-spine, not this slice). AI-coach voice (68d decisions Settle, separate slice).
- **Opens blocked:** None.
- **Loveable check:** A user gets a real error — "Couldn't reach your bank just now. Give it another go in a minute, and we'll pick up where you left off." vs a generic "Error 500." That one-line difference is the product. Passes.
- **Evidence at wrap:** §4 diff · grep that banned-word list doesn't appear in worked examples · spot-check that four tone subsections present.

## AC-5 · 68g status updates — C-U4, C-U5, C-U6 flipped to 🟢 locked

- **Outcome:** `docs/workspace-spec/68g-copy-share-opens.md` edited so that:
  - C-U4 heading glyph flips 🟠 → 🟢 at line 13 · a one-line "**Locked:** see `docs/workspace-spec/73-copy-patterns.md` + `docs/slices/S-C-U4-disclosure-audit/audit-catalogue.md`. Session 28." appended under the Decision block.
  - C-U5 heading glyph flips 🟠 → 🟢 at line 32 · a one-line "**Locked:** see `docs/workspace-spec/73-copy-patterns.md` §3. Session 28." appended.
  - C-U6 heading glyph flips 🟠 → 🟢 at line 38 · a one-line "**Locked:** see `docs/workspace-spec/73-copy-patterns.md` §1 (5-phase labels per Lean (a)). Session 28." appended.
- **Verification:** `grep -n '🟢 C-U4\|🟢 C-U5\|🟢 C-U6' docs/workspace-spec/68g-copy-share-opens.md` returns three hits · `grep -n 'Locked:' docs/workspace-spec/68g-copy-share-opens.md` shows the three new "Locked:" lines · diff shows only glyph + appended lines, no other copy churn.
- **In scope:** The three glyph flips. The three one-line "Locked" appendices. No other edits to 68g.
- **Out of scope:** C-S5 / C-S6 (share mechanics — different register, different slice). Restructuring 68g (leave existing structure intact — 68g is a register doc; session-28 locks are adjunct notes, not rewrites).
- **Opens blocked:** None.
- **Loveable check:** A future session opening 68g can see at a glance that C-U4/5/6 are done and where the lock lives. Register hygiene. Passes (functional, not delight-seeking — that's fine for a register update).
- **Evidence at wrap:** diff of 68g · grep output confirming three glyph flips + three Locked lines.

---

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-04-24 | Claude (draft) | Pending user review | Drafted from spec 68g §C-U4 verbatim; folds in C-U5 + C-U6 per their Target refs pointing at C-U4 output |
| | User | | AC frozen · implementation may begin |

**AC is the contract.** Change requests after freeze roll into re-drafting AC + re-sliceing, not mid-slice scope shifts.
