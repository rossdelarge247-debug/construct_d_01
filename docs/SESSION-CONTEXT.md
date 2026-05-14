# Session 98 Pre-flight Context Block (carrying session 97 wrap delta)

## Session 97 wrap delta — read this first

Session 97 executed the recommended P1 + P2 paired light opener cleanly. Two PRs shipped sequentially:

**Two PRs merged:**

- **PR #180 (`6f45c37`).** `S-INFRA-npm-audit-cleanup` — `npm audit fix` (non-breaking) to clear the lone HIGH-severity vulnerability in `protobufjs` (transitive, 7 CVEs spanning DoS / code-injection / prototype-pollution). Pure `package-lock.json` diff (15 ins / 15 del); 4 transitive packages bumped within their same minor (`protobufjs` 7.5.5 → 7.5.8 + 3 sub-packages); `package.json` unchanged. Tests 557/557 green; production build green. **The previously-failing `npm audit (high + critical)` CI gate now passes on main going forward.** 3 remaining moderates require `--force` (direct-dep breaking changes to `@anthropic-ai/sdk` + `next`/`postcss`); explicitly deferred to separate slice with feature regression testing. Closes one source of carve-out CI noise.
- **PR #181 (`153540a`).** `docs(audit): reframe F-OUT-01/02 as spec-65/67 conflict; flip F-OUT-03 to shipped`. Five edits to `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` (8 ins / 8 del pure substitution): F-OUT-01 + F-OUT-02 Effect paragraphs rewritten with verbatim spec 65 §O7 L138-148 + spec 67 §Gap 1 L86 quotes + explicit blocked-pending-spec-amendment status; §Status table header `Shipped` → `Status` (now tri-state ✓ / open / blocked); F-OUT-01 + F-OUT-02 rows flipped to `blocked`; F-OUT-03 row updated to `✓` shipped via `S-PROTO-output-reassurance-O7` (`c2e2633` / #178) — that row had been stale since PR #178 missed updating it inline at session 96 ship time. L25 scoping note + L125 footer also updated to reflect the cross-spec design conflict baseline.

**Diagnosis trail durably captured in `docs/HANDOFF-SESSION-97.md`** — read for the merge-sequence rationale (#180 first → #181 branch updated via MCP → CI re-ran green → #181 merged; cleaner than admin-bypassing #181), the F-OUT-03 row-staleness finding (PR #178's missed inline §Status update; new recurrence-watch item), the `npm run build` env-var error-message-strips-prefix gotcha, and persona findings (both PRs `success` aggregate; no findings).

**Net diff vs main this session:** ~234 lines impl + 234 lines slice docs (P1) + 8 lines docs (P2) — small surgical session.

## Session 98 priorities — user picks scope

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **Spec 65 amendment scaffold for F-OUT-01 + F-OUT-02** | Medium; needs cross-spec design work on (a) whether pre-signup O7 needs adaptive tier framework at all given spec 67 §Gap 1's routing-not-grading post-signup architecture, (b) what confidence-derivation source spec 67 will eventually use, (c) pre/post-signup vocab autonomy. Multi-session candidate; session 98 likely ships scaffold + AC list. Natural next step after session 97 closed the audit-spec-conflict baseline. | Medium (~45-60 min for scaffold/AC) | No |
| 2 | **Tone audit Phase 1** | Alternative direction. Structural review on O1-O8 copy + visual treatments + emotional calibration vs CLAUDE.md "warm hand on a cold day" + spec 65 per-screen tone notes. Sibling to density/delight audit; different lens. Generates a downstream impl batch. | Light-medium (~30-45 min) | No |
| 3 | **Desktop graceful enhancement** | `docs/design-source/pre-signup-interview/desktop/Desktop Enhanced - Help Rail - Standalone.html`. Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px mobile cap. Mobile chassis fully stable. | Heavy | No |
| 4 | **(Inherited)** spec-citation-quote-check author-time hook | Light | No |
| 5 | **(Inherited)** Comment-review hook CSS-files regex tightening | Light | No |
| 6 | **(Inherited)** Spec 65 amendment for quantitative profiling data | Heavy | No |

**Recommended:** P1 (spec 65 amendment scaffold) as the natural next step — F-OUT-01/02 are now explicitly blocked-pending-spec-amendment per session 97's audit-text amendment; the amendment slice would unblock them. The cross-spec design work is heavy enough that session 98 likely ships only the scaffold + AC list (impl follows in session 99+). Alternative: P2 (tone audit Phase 1) if user wants a fresh-eyes lens rather than continuing the F-OUT loop.

## Scoping-discipline observations carried as recurrence-watch (not yet numbered constraints)

- **AC-impl cross-check at impl-time** (session 90) — applied successfully session 97 on both P1 and P2.
- **Sibling-wrapper diff at impl-time** (session 88) — N/A session 97.
- **Shared-infrastructure audit at refactor-time** (session 87) — N/A session 97.
- **In-PR scope-expansion confirmation gate** (session 87) — applied implicitly; user-confirmed sequential merge sequence.
- **`git push --force` after amend** (session 91) — not triggered session 97.
- **verification.md PARTIAL internal contradiction** (session 93) — N/A session 97.
- **Read-cap accumulation during sweep cycles** (session 93) — not surfaced session 97. Per-turn read budgets stayed well under 300L.
- **Single-lens audit framing** (session 94) — N/A session 97.
- **Pre-existing provenance opportunistic cleanup at paragraph rewrite** (session 94) — applied: comment-review hook flagged "Session 96" in initial Write of P1 acceptance.md; rewritten inline before commit.
- **Audit findings need active-spec cross-reference at audit time** (session 96) — the audit-text amendment IS the corrective slice; not re-fired session 97.
- **Pre-existing CI noise should be queued, not deferred indefinitely** (session 96) — addressed for `npm audit` via PR #180; remains carried for `spec-citation-quote-check`.
- **NEW session 97 — Post-batch §Status sweep should run inline with the slice that ships the finding-impl, not deferred to a docs-only PR.** Surfaced when P2 caught F-OUT-03 row stale (was "open" despite PR #178's session-96 ship). The audit slice's §Status section was designed to be live-updated at each batch ship; PR #178 modified `O7.tsx` + the F-OUT-03 slice docs but missed updating the parent audit-slice's §Status row. P2 caught + corrected as part of its scope. Promotion threshold: a second impl-slice ships an audit-finding without updating the audit-slice §Status row inline.

## Authoritative reading order at session 98 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-97.md` (session 97's retro — two shipped PRs + merge-sequence rationale + F-OUT-03 row-staleness finding + persona findings).
3. `docs/HANDOFF-SESSION-96.md` (session 96's retro — three shipped PRs + cross-spec assessment workflow + recurrence-watch lineage).
4. **For P1 (spec 65 amendment scaffold):** read spec 65 §O7 (L138-148) + spec 67 §Distribution (L14-83) + §Gap 1 (L84-122) + spec 34 §Tier 1-3 (L188-237) + `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` §F-OUT-01 + §F-OUT-02 (now session-97-amended) before drafting amendment scope.
5. **For P2 (tone audit Phase 1):** read `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` in full (density/delight audit precedent), then survey O1-O8 source under `src/app/dev/proto/pre-signup-interview/screens/` (8 files) + the `WhyWeAsk` / `EntryScaffold` / `Reassurance` / `Hero` / `Footer` shared components for copy + visual-treatment surface to lens.

## Session 98 kickoff prompt (paste-ready)

```
Kick off session 98.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Branch convention: harness-suffixed (claude/<scope>-XXXXX) OR
  per-batch sub-branch off latest main.
- Session 97 shipped 2 PRs (#180 npm-audit-cleanup + #181 audit-text
  amendment) + session-97-wrap PR; HANDOFF-97 captures the merge-
  sequence rationale + F-OUT-03 row-staleness recurrence-watch.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch origin main → git checkout -B
  <branch> origin/main.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-97.md.
3. For P1 (spec 65 amendment scaffold): spec 65 §O7 (L138-148) +
   spec 67 §Distribution (L14-83) + §Gap 1 (L84-122) + spec 34
   §Tier 1-3 (L188-237) + density/delight audit §F-OUT-01..02
   (session-97-amended).
4. For P2 (tone audit Phase 1): density/delight audit precedent +
   O1-O8 source screens + shared components.

Confirm priority with user. SESSION-CONTEXT recommends P1 (spec 65
amendment scaffold) as the natural next step after session 97 closed
the audit-spec-conflict baseline. P1 is multi-session; session 98
likely ships scaffold + AC list only. Alternative: P2 (tone audit
Phase 1) as a fresh-lens audit if user prefers a different direction.

Per CLAUDE.md §"Pre-priority spec-gate verification": before treating
priority labelled "per spec X §Y" as authorised, grep that section's
gating IF-clauses verbatim. The amendment work needs especially
careful spec-gate verification since the slice IS the amendment.

Per CLAUDE.md §"AC-impl cross-check at impl-time" (recurrence-watch
session 90): before pushing impl, re-read each AC's verbatim wording
and grep impl for the structural elements named in AC.

Per CLAUDE.md §"Quote, don't paraphrase, when invoking a spec":
amendment text must embed verbatim quotes with file:line refs.

Definition of Done (CLAUDE.md §"Definition of Done", prototype short-
form items 1, 8, 12, 14 from spec 76 §3 — applies to prototype slices;
infrastructure slices get full DoD-14):
- Slice acceptance.md + verification.md
- Tests written + passing (for amendment slices: the test surface
  is the cross-spec citation verifiability)
- Preview-deploy verified across spec 72a 6+1 dimensions (N/A for
  spec amendment slices unless they ship UI surface)
- User feedback received + addressed (or explicitly deferred)
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`. Shared chassis primitives all landed (TopBar / Hero / Footer) + density-entry (EntryScaffold on O1) + density-question (WhyWeAsk on O1-O6) + delight (spec-26 compliance pass) + output-reassurance (Reassurance on O7) all merged to main.

## Branch

Session 98 branch: harness-suffixed off clean main, OR scope-named sub-branch per the per-slice convention (`claude/S-65-amendment-F-OUT-01-02` for P1, `claude/session-98-tone-audit` for P2, etc).

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 97.** Twelve scoping-discipline observations on recurrence-watch (11 carried + 1 new — post-batch-§Status-sweep-inline-with-impl-slice). Promote to numbered constraint if a second session surfaces the same recurrence for the new item.

**Active pre-existing CI failures (carry forward):**
- `spec-citation-quote-check` — fires on newly-added slice docs; gate workflow's comment acknowledges *"Pragmatic scope: gate fires on Added files, not Modified. Pre-existing per-cite citations across the corpus would block every spec-modifying PR otherwise."* Acceptable carry; track for eventual line-level diff filtering improvement.
- ~~`npm audit (high + critical)`~~ — **CLEARED session 97 via PR #180**. No longer a carry.

## Scope ceiling

Session 98 is most likely **P1 (spec 65 amendment scaffold)** alone given the multi-session nature of the cross-spec design work, or **P2 (tone audit Phase 1)** if user picks an alternative direction. Out of scope unless explicitly added: P3 desktop · P4-6 inherited side-quests · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
- All 8 screens (O1-O8) are canvas-as-source on main. Three shared chassis primitives (TopBar + Hero + Footer) + EntryScaffold (O1) + WhyWeAsk (O1-O6) + spec-26 delight compliance + Reassurance (O7) all merged. Density + delight + output-reassurance audit findings closed (8 of 10); F-OUT-01 + F-OUT-02 explicitly blocked pending spec amendment (now durably documented in the audit slice's §F-OUT-01 + §F-OUT-02 Effect paragraphs).
