# Session 93 retro — Batch C resumption (footer harmonisation, full-slice ship)

## What happened

Session 93 resumed Batch C from session 92's PARTIAL state (PR #169 was open as draft at `9149dcb` with the shared Footer primitive + 3 swept screens + 7 of 12 unit tests). The resumption-checklist in `verification.md` was load-bearing — drove the work order without ambiguity.

**Slice shipped end-to-end** as `c3c5f88` (squash-merged to main):

- **AC-2 (4 of 7 → 7 of 7).** Mechanical sweeps on O4 + O5 + O6 + O8. O4/O5/O6 call-sites already matched the primitive API (per acceptance L72-74); pure deletion + import cleanup (-78L / -78L / -67L respectively, plus useEffect/useRef/Arrow imports dropped where they became orphan). O8 needed a real call-site rewrite (-54L local Footer body, plus `variant="light"` + conditional caption + conditional ctaLabel + `enabled={!!selected}`) — UX change captured: footer now shows BOTH prompt as caption + CTA with disabled state (was either/or).
- **AC-3 (O7 PlanFooter rebuild).** -100L deletion of `function PlanFooter` (in-flow `<section>` + sticky `<div>` + outer fragment). Replacement `<Footer ctaLabel="What's next" secondaryActions={<>DownloadIcon + Download as PDF / MailIcon + Email link</>} />`. Back link dropped (TopBar owns Back per Batch A); Mood-band MobileHero CTAs preserved as canvas-distinctive presentation chrome per acceptance §"Session-locked sub-decisions".
- **AC-4 (7 of 12 → 12 of 12).** 5 deferred tests added: default-enabled assertion · caption-typography branch on enabled · no-secondaryActions branch · CTA focus-receivable · CTA-bounce class on enable transition. Final pattern: 12/12 in `footer.test.tsx`.
- **AC-6 carry.** Two `o7-canvas-as-source.test.tsx` assertions updated for the AC-3 surface change: "Take this with you" h2 lookup dropped + h2 count ≥6 → ≥5; `<section>` count ≥6 → ≥5.
- **verification.md** rewritten to full-state. Drops the PARTIAL marker. Fixes the L41/L43 internal contradiction inherited from session 92's wrap-time drafting. Captures three architectural deferrals: O6 mount-fire animation NOT preserved · per-screen module-CSS `.cta` orphans (defer to Batch F) · `<footer>` banner-role recovery (carried from Batch D).
- **AC-5 (preview-deploy 6+1 walk) deferred** per user-directed "let's just merge" cadence. Rubric table sits in verification.md awaiting the walk. Tracked as a known carry-over.

**Tests + typecheck both clean post-merge:** 526/526 across 79 files (+5 from session 92's 521); typecheck clean.

**Two commits on the PR branch then squash-merged:** `7aa28ae` (O4/O5/O6 sweep) → `424ef22` (O8 + O7 rebuild + 5 tests + verification full-state). Final merge SHA `c3c5f88`.

## What went well

- **Resumption-checklist discipline.** verification.md §"Resumption checklist" listed the 7 steps in order; followed end-to-end without need to re-derive scope. The PARTIAL pattern from session 92 + checklist made resumption near-mechanical.
- **AC-2 sweep efficiency.** O4/O5/O6 grep-then-Edit was tight: grep located function boundaries + import usage, single Edit deleted the function, second Edit cleaned imports. ~3-4 minutes per screen including read.
- **Vitest test failures caught + fixed mid-cycle.** After AC-3 deletion, 2 failures in `o7-canvas-as-source.test.tsx` (h2 lookup + section count) surfaced immediately on `npm test` — direct consequence of AC-3 surface change; updates were minimal + correct.
- **Comment-review stub hook caught a real anti-pattern.** When writing the new verification.md, the §Slice status paragraph included "PR #169 ships..." — the hook flagged it as provenance per CLAUDE.md §"Coding conduct" §"Comments: WHY not WHAT, no temporal provenance". Fixed pre-commit. This is the value the hook is designed to deliver — caught at author-time, not at PR-review time.

## What could improve

- **Read-cap accumulation during sweep cycles.** Multiple turns hit the 300L combined read cap mid-flight (e.g., reading O5 slice 183L after already reading acceptance 176L + verification 70L = 313L total; one read denied on O6's first attempt). Pattern: slice-context reads (primitive 67 + acceptance 176 + verification 70 ≈ 313) eat the whole budget before any screen reads land. Mitigation candidates: (a) acceptance.md authors include line-range hints next to each AC sweep target so screen reads can be tightly scoped; (b) read primitive + verification first, defer acceptance re-read until impl-time per-AC; (c) grep-first + only-read-the-function-window habit (mostly applied; tighten further next time).
- **verification.md PARTIAL drafting bug.** L41 said "7 tests shipped, 521/521 pass"; L43 said "not yet created". Caught at full-state rewrite. The bug is the result of authoring verification.md while in wrap-mode under churn pressure — earlier paragraphs reflect post-impl state, later paragraphs reflect a copy-paste glitch from drafting. Recurrence-watch (not yet numbered constraint): PARTIAL verification.md should be walked end-to-end once before commit. If a third PARTIAL-shipment shows similar internal contradiction, promote to numbered constraint with explicit "walk-end-to-end-pre-commit" rule.

## Key decisions

- **O6 always-on mount-fire animation NOT preserved** — canonical per Phase 2 F-FT-05 is transition-driven force-reflow; O6 is statically enabled (no false → true transition) so no animation fires on mount. Reintroduction would require an `animateOnMount` opt-in prop on the shared primitive — explicitly out of scope for Batch C; documented as architectural deferral in verification.md §"Architectural deferrals".
- **Per-screen module-CSS `.cta` orphans retained.** Local Footer deletions leave `.cta` / `.cta:focus-visible` / `.ctaEnabled` orphan in O4/O5/O6 module CSS. Surgical-change discipline says don't delete adjacent dead code; cleanup deferred to Batch F (production graduation) per acceptance L161.
- **O7 mood-band Hero CTAs NOT deduplicated against Footer secondaryActions.** Both Hero (Save-as-PDF + Email-it-to-me + "~5 min read · 4 pages" caption) AND Footer (Download as PDF + Email link) ship. Hero CTAs are presentation chrome (mood-band aesthetic); Footer CTAs are functional sticky chrome. Per acceptance §"Session-locked sub-decisions".
- **AC-5 preview-deploy walk deferred** at merge time per user-directed "let's just merge" cadence. The 6+1 rubric table in verification.md awaits the walk; tracked as known carry-over for the next session.

## Scoping-discipline observations on recurrence-watch

Carrying from prior sessions + adding session-93 observations:

- **AC-impl cross-check at impl-time** (introduced session 90) — applied session 93 without deviation. Discipline holding.
- **Sibling-wrapper diff at impl-time** (carried session 88) — not surfaced session 93.
- **Shared-infrastructure audit at refactor-time** (carried session 87) — not surfaced session 93.
- **In-PR scope-expansion confirmation gate** (carried session 87) — not surfaced session 93.
- **`git push --force` after amend** (carried session 91) — NOT triggered session 93. Single occurrence at session 91; promote to numbered constraint if a second session surfaces a similar incident.
- **NEW session 93 — verification.md PARTIAL internal contradiction.** Single occurrence (L41/L43 from session 92's wrap). Promotion threshold: third PARTIAL-shipment with similar drafting bug.
- **NEW session 93 — read-cap accumulation during sweep cycles.** Single occurrence (multiple denials within one slice's sweep work). Mitigation candidates listed in §"What could improve". Promotion threshold: a second slice's sweep work blocked or significantly slowed by read-cap budget management.

## Next session (94) priorities

| # | Priority | Effort |
|---|---|---|
| 1 | **Phase 4 spec pressure-test workstream** (formerly P3 session 92; now unblocked with Batch C landed). Open new scope-only audit slice comparing the homogenised 8-screen surface against CLAUDE.md §"Product positioning" + §"North star" + §"Product rules" + `docs/workspace-spec/65-pre-signup-interview-reconciled.md` + `docs/v1/v1-wireframes.md`. Same workflow as session 91: scope-only-audit → joint-review → batch-impl. | Heavy |
| 2 | **AC-5 preview-deploy 6+1 walk for Batch C** (deferred carry-over). Walk all 8 screens on the merged main's Vercel preview (golden path · edge cases · prefers-reduced-motion · keyboard-only · 375×667 · screen reader · visual diff). Update verification.md table. | Light |
| 3 | **Desktop graceful enhancement** (was P5 session 92). `docs/design-source/pre-signup-interview/desktop/Desktop Enhanced - Help Rail - Standalone.html`. Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px mobile cap. Mobile chassis stable post-Batches A/B/C/D. | Heavy |
| 4 | **Production graduation backlog** (was P6 session 92). Bundle when pre-signup exits `/dev/proto/`: Batch F (token promotion + colour centralisation + tap-targets + dvh + sticky-CTA hardening + banner-role recovery + per-screen module-CSS `.cta` orphan cleanup). | Heavy |
| 5 | **(Inherited)** spec-citation-quote-check author-time hook (was P7 session 92). | Light |
| 6 | **(Inherited)** Comment-review hook §Status exemption fix (was P8 session 92). | Light |
| 7 | **(Inherited)** Comment-review hook CSS-files regex tightening (was P9 session 92). | Light |
| 8 | **(Inherited)** Spec 65 amendment for quantitative profiling data (was P10 session 92). | Heavy |

**Recommended sequence:** P2 (preview-deploy walk — closes Batch C DoD) → P1 (Phase 4 audit) → P3+ as time allows.

## Session 93 ledger

- Branch worked: `claude/S-PROTO-batch-C-footer-harmonisation` (continuing PR #169 from session 92).
- Commits added this session: `7aa28ae` (O4/O5/O6 sweep) + `424ef22` (O8 + O7 rebuild + 5 tests + verification full-state).
- Merged: PR #169 squash → `c3c5f88` on main.
- Closed: PR #170 (session-92 wrap) — content rolled into the session-93 wrap PR (HANDOFF-92 + HANDOFF-93 + new SESSION-CONTEXT bundled together).
