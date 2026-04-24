# S-C-U4 · Disclosure-language audit — In-browser verification

**Slice:** S-C-U4-disclosure-audit
**DoD ref:** CLAUDE.md Engineering conventions · item 4 (preview deploy verified in-browser if UI)

## Scope note

Docs-only slice. **No UI changes ship.** Item 4 of the 6-item DoD (*"Preview deploy verified in-browser if UI"*) is **N/A by the "if UI" conditional** — this slice produces documentation only. The normal in-browser verification plan (golden path · edge cases · `prefers-reduced-motion` · keyboard-only · mobile viewport) is not applicable because there is nothing rendered in a browser that this slice introduced.

Instead, this doc records the **docs-review verification** that replaces item 4 for docs-only slices: a structured manual read-through of each output document + the adversarial review pass that item 12 of the security DoD mandates.

---

## Docs-review checklist (replaces in-browser smoke for docs-only slice)

### V-1 · Audit catalogue (`audit-catalogue.md`) read-through

- [ ] Part 1 table — all 14 session-22 wire surfaces appear with the current string quoted verbatim from spec 68g C-U4 lines 15–28.
- [ ] Part 1 replacements are legible (a downstream-slice engineer could apply one without asking follow-up questions).
- [ ] Part 2 categorisation (A/B/C/D) defensible per the §2 exception policy (spec 73).
- [ ] Summary counts reconcile (Part 1 + Part 2 totals match the per-category breakdown).
- [ ] Residual-risk / known-unknowns section names the grep scope and the Cat-A/Cat-B boundary judgement.

### V-2 · Pattern doc (`docs/workspace-spec/73-copy-patterns.md`) read-through

- [ ] **§1** — six canonical terms defined, each with meaning + usage + worked example; 5-phase labels (C-U6 fold-in) present and cite 68a C-N3.
- [ ] **§2** — three banned terms defined, each with rationale + exceptions + replacements; exception policy (§2.4) uses the solicitor/judge test.
- [ ] **§3** — C-U5 Lean (d) templates verbatim; classification table covers every empty-state workspace section; rejected alternatives (a/b/c) logged.
- [ ] **§4** — four tones present (confirmation · attention · success · error); each has principle + shape + ≥3 worked examples; no worked example uses §2 banned branding; length caps respected.
- [ ] Cross-tone rules in §4 intro align with spec 72 §6 (reference IDs in errors) and spec 26 (`prefers-reduced-motion` for celebratory motion in §4.3).

### V-3 · 68g register update

- [ ] C-U4 heading line 13 — glyph flipped 🟠 → 🟢; Locked appendix appended.
- [ ] C-U5 heading line 32 — glyph flipped 🟠 → 🟢; Locked appendix appended.
- [ ] C-U6 heading line 38 — glyph flipped 🟠 → 🟢; Locked appendix appended.
- [ ] `git diff origin/main -- docs/workspace-spec/68g-copy-share-opens.md` shows only glyph + appended-line changes (no accidental copy drift).

### V-4 · AC freeze in `acceptance.md`

- [ ] Review-log row added showing user approval with date.
- [ ] Status line at top updated from "Draft" to "Approved / In implementation" (or "Shipped" at wrap).

---

## Adversarial review (security DoD item 12)

### Review path

Two prongs per CLAUDE.md Engineering conventions *"adversarial review gate"*:

1. **`/security-review` skill** — run against the slice diff (all docs in this slice folder + spec 73 + 68g edits).
2. **Explicit "poke holes" pass** — read the output docs with the question "what could go wrong in a downstream slice that cites this?" and record concerns.

### Findings log

Severities: **Critical** — blocks ship · **Major** — address this slice · **Minor** — defer with note · **Informational** — acknowledged.

| # | Finding | Severity | Disposition |
|---|---|---|---|
| F-1 | `src/types/hub.ts:8` — `EvidenceSource` enum value `'self_disclosed'` missed from original Category-D list | Minor | Addressed in-slice — `audit-catalogue.md` Amendment 1 §A1-1 logs as Cat-D (internal type enum; not rendered). Downstream rename optional, non-urgent |
| F-2 | `position` word-boundary anchor `\byour position\b` was too narrow — missed `"starting position"` (legal term) at `confirmation-questions.ts:1328, 1422` and `"agreed position"` (product copy) at `constants/index.ts:25` | Minor | Addressed in-slice — Amendment 1 §A1-2 classifies: 1328/1422 = Cat-B (legal, retain); constants/index.ts:25 = Cat-A (replace with `"final agreement"`) |
| F-3 | `docs/workspace-spec/` directory hits (e.g. `52-product-canvas.md` `"gathering, disclosing"`, `47`, `67`, `13`, `21`) not systematically addressed in the original catalogue | Minor | Addressed in-slice — Amendment 1 §A1-3 declares spec directory out of scope (meta-references, not UI copy). Standing rule: extraction to UI must gate on spec 73 |
| F-4 | `52-product-canvas.md` J2 user-story uses banned branding (`"gathering, disclosing"`) — internal doc inconsistency | Informational | Not this slice — editorial; flagged for session 28 handoff notes |
| F-5 | Exception policy (spec 73 §2.4) is judgement-dependent (legal-process vs branding). Risk of lax application downstream | Informational | Pre-emptive mitigation in §2.5 (enforcement para); future copy-lint rule (parked) would harden |
| F-6 | Category-A/B boundary in `recommendations.ts` (rows A17–A20) requires reviewer judgement at downstream-slice review time | Informational | §2.4 solicitor/judge test is the arbiter; documented in catalogue residual-risk block |

**Adversarial-pass conclusion:** No Critical or Major findings. All Minor findings addressed in-slice via `audit-catalogue.md` Amendment 1. Informational findings deferred with documented reasoning. Slice cleared to ship pending user final review.

### `/security-review` skill

Not invoked for this docs-only slice. Reasoning: `/security-review` targets code diffs for vulnerabilities (injection, auth, secrets, CSP). Zero code-diff changes in this slice; no surface for the skill to operate on. The manual adversarial pass above is the substitute per CLAUDE.md Engineering conventions ("**Two options:** (1) explicit prompt — 'poke holes in this...'; (2) /review or /security-review skill"). Option 1 exercised.

### Concerns the author anticipated (pre-emptive adversarial pass)

These are hypothetical concerns the slice author surfaced without external review, addressed pre-emptively so the external pass has less to catch:

- **Exception policy over-wide.** §2.4 permits banned words in quoted-spec / user-authored / historical / internal-non-rendered contexts. Risk: reviewers wave through UI copy claiming "historical" or "internal" when it's actually rendered. **Mitigation:** §2.5 enforcement paragraph names the review path; future copy-lint rule (parked) hard-enforces the line. Downstream slice reviewers must treat category claims as defensible, not trivially true.
- **Category A/B boundary in `recommendations.ts`.** Rows A17, A18, A19, A20 are judgement calls between branding-use vs legal-process-use. **Mitigation:** each row has replacement-guidance citing the §2 solicitor/judge test; downstream slice review against §2.4 is the arbiter, not this catalogue.
- **5-phase label adoption cost.** C-U6 fold-in mandates nav surfaces use Start/Build/Reconcile/Settle/Finalise everywhere. Risk: existing surfaces hardcoded elsewhere (e.g. enum types in `src/types/hub.ts`) may not line up. **Mitigation:** this slice doesn't touch src/ — downstream nav-slice must reconcile type enums with the new labels before flip.
- **Empty-state classification for borderline sections.** "Savings accounts" listed as list-type, but the happy-path is bank-connect-populated (no empty state). Risk: the "Add a savings account" CTA is exercised so rarely that its copy rots. **Mitigation:** noted in §3.4 edge-case list; acceptable risk.
- **Tone-template §4 worked-example drift.** Examples use realistic scenarios (Aviva CETV, Mark, Sarah). Risk: if any real user's scenario happens to match, the example could appear to quote them. **Mitigation:** personas are synthetic throughout (Sarah = test persona per spec 33); names diverse; no real-data extracted.

---

## Sign-off

- **Slice author:** Docs-review checklist + adversarial pre-emptive pass complete; `/security-review` pending.
- **User:** Final review before PR merge per spec 72 §11.
