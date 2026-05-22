# HANDOFF — Session 116

**Branch:** `claude/S-PROTO-journey-restore` → merged into main as `3b30a06` via PR #222.
**Outcome:** Slice `S-PROTO-journey-restore` shipped end-to-end. All 6 ACs implemented, auto-review approved on round 2, user-merged.

## What happened

### Turn 0 — kickoff verification surfaced rotted facts

The kickoff prompt claimed session 115 had written `HANDOFF-SESSION-115.md` and refreshed `SESSION-CONTEXT.md`. Both untrue. Verified state: session 115 had committed only the slice scaffold `acceptance.md` (118L) on branch `claude/S-PROTO-journey-restore` at `a35fd28` — and stopped. No wrap docs. `SESSION-CONTEXT.md` was still titled "Session 115 Pre-flight Context Block" (from session-114 wrap).

Per CLAUDE.md §"Planning conduct" §"Verify before planning" — checked git state against kickoff's stated facts before treating priorities as authorised. Confirmed PR #221 had merged (HEAD `f2936d5` is the merge commit on origin/main) and `claude/S-PROTO-journey-restore` did exist at the claimed commit. Asked user via `AskUserQuestion` to confirm P1 before resyncing onto the slice branch.

### Implementation (kickoff order, AC-1 → AC-6)

1. **Slice docs first** (`security.md` · `test-plan.md` · `verification.md`) — prototype short-form security checklist, TDD test plan, per-AC evidence skeleton.
2. **AC-1 · Registry refresh** — TDD: extended `registry-schema.test.ts` with `'shell-built'` enum + ordering assertion (RED); applied enum change to `registry-schema.ts` (GREEN); extended `registry.test.ts` with 7-row per-row assertions (RED); applied 7 row updates via atomic Bash patch (GREEN); added `StatusBadge` arm for the new enum value to satisfy `Record<Status, …>` typecheck.
3. **AC-3 · O8 outbound + sign-up shell** — built `src/app/dev/proto/sign-up/page.tsx` shell mirroring faq-trust chrome; added `tests/unit/proto-sign-up/shell.test.tsx` (3 cases); modified `O8.tsx` to use `useRouter().push('/dev/proto/sign-up')` instead of the terminal-clamped `next` step-advance.
4. **AC-2 · Marketing-landing CTAs** — added `Link` import; swapped 2 `<a href="#hash">` to `<Link href="/dev/proto/...">` (Pricing + Start); prepended TODO comment on Sign in `<a>`; added `tests/unit/proto-marketing-landing/start-cta-href.test.tsx` (3 cases).
5. **AC-4 · DoD item 7** — extended PR template with 7th DoD item; added new `registry-update-check` job in `pr-dod.yml` (detects prototype surface page.tsx diffs · requires `registry.ts` in same diff or `no-registry-update` label).
6. **AC-5 · Journey-wiring** — wrote `.claude/hooks/journey-declared.sh` (PostToolUse:Write|Edit advisory · scoped to `docs/slices/S-PROTO-*/acceptance.md` · re-reads disk in Edit mode); registered in `.claude/settings.json`; wrote `tests/shellspec/journey-declared.spec.sh` (9 examples); added CLAUDE.md §"Visual direction" §"Journey wiring" sub-section.
7. **AC-6 · Phase 3 sequence** — inserted new top-level §"Phase 3 sequence" in CLAUDE.md after §"North star" with verbatim quote of `HANDOFF-SESSION-74.md` L80-82 + off-sequence-flagging rule + §Status footer.

### Auto-review

**Round 1 (commit `1ff4a55`)** — `request-changes` verdict, 3 findings:
- `security`: BLOCKING — workflow script-injection via direct interpolation of `${{ toJson(...labels...) }}` into single-quoted shell string. Fixed by moving to `env:` map (matches existing PR_BODY pattern in same file). The existing `slice-verification` job carries the same pattern for its LABELS variable — flagged not-fixed-here (surgical-changes discipline; persona only flagged my new job).
- `style`: non-blocking — `describe('S-PROTO-journey-restore row refresh', …)` carries slice provenance in test description. Renamed to `'recently-shipped prototype surfaces carry refreshed status + lastTouched + links.prototype'`.
- `prototype-readiness`: suggestion (persona self-flagged as no-fix-required) — sign-up shell body exposes dev-path metadata. AC-3 mandates exact text + canvas-porting deferred. Left as-is.

**Round 2 (commit `66f6fe6`)** — `approve` verdict, 2 findings (1 `note` acknowledging prior deferral, 1 `praise` for the rename).

### Merge

User said "merge" → squash-merged to main as `3b30a06`.

## What went well

- **Verify-before-planning held.** Kickoff had stale claims about HANDOFF-115 existing; ground-truth check via `git ls-remote` + `git diff --stat main..origin/journey-restore` caught it pre-impl. No wasted work.
- **TDD-guard `OVERRIDE=1` for multi-symbol RED→GREEN transits.** The hook normally blocks src edits when corresponding tests are RED. For natural TDD steps (write failing test → make src GREEN), the override env-var is documented as the intended hatch ("multi-symbol rewrites that transit a RED state between"). Used via Bash + python sub for atomic multi-row registry updates; verified GREEN post-application. Pattern worked cleanly.
- **Auto-review round-2-to-approve in one push.** Both fixes mechanical; 0 follow-up findings.
- **`registry-update-check` workflow passed its own first run on the very PR that introduced it.** AC-4 ate its own dogfood — the slice both adds the gate and updates the registry, so the gate exercises the new path on its first PR.

## What could improve

- **Filename convention drift in AC text.** `acceptance.md` AC-5 named the spec file `journey-declared_spec.sh` (underscore). Repo convention is `.spec.sh` (dot — every other entry under `tests/shellspec/`). Caught at shellspec runtime (file pattern mismatch); renamed to `.spec.sh`. Worth a CLAUDE.md sweep at slice-scoping time: prefer naming-by-precedent over naming-from-memory.
- **AC-3 had to deviate from "Next.js `Link`" literal text.** Footer's CTA is button-based; wrapping `<button>` in `<a>` (which `Link` does) produces invalid HTML. Used `router.push` instead — equivalent Next.js navigation primitive. Flagged in verification.md AC-3 §Impl note. Cost: minor narrative drag in verification.md. Avoidable if AC-3 had named "Next.js navigation" generically rather than the `Link` primitive specifically.
- **Comment-review hook fired on multiple false positives** in this slice's docs/CLAUDE.md edits (emoji used for UI rendering not comments; "SESSION-74" used as a literal filename citation required by AC-6; "slice S-X" used as the literal placeholder in the convention example). Each is advisory-only so didn't gate, but the noise-to-signal felt high. Worth refining the hook's skip-list for §Visual-direction-style spec text or for filename-citation patterns. New observation, recurrence-watch.
- **Self-violation of the discipline I just shipped (caught by user post-wrap).** AC-6 enshrined the rule "any off-sequence Phase 3 work must be flagged in `SESSION-CONTEXT.md`'s session priorities table with an explicit `OFF-SEQUENCE because X` note." My first wrap doc's priorities table (1) listed only `S-PROTO-section-confirm` as on-sequence — omitting `S-PROTO-ai-coach` (Settle, P2) and `S-PROTO-share-flow` (Reconcile, P3) which HANDOFF-74 L82 names verbatim — and (2) did NOT flag priorities #2-#8 as off-sequence despite all of them being off-sequence work. User caught it ("is the work flow we previously agreed being honoured in the list of upcoming priorities?"). Amended in same wrap PR before merge. **Prevention shipped same wrap PR (T1 + T2):** new CLAUDE.md §"Apply your own deltas first" rule + `.claude/hooks/wrap-check.sh` self-delta-audit step that fires when `git diff origin/main...HEAD` (or working tree vs HEAD) shows changes to `CLAUDE.md` / `docs/workspace-spec/`. Escalation: on 2nd recurrence under the new rule, escalate to T3 (per-rule author-time hook) or T4 (adversarial review subagent pass on wrap docs). The meta-failure mode (codifying a rule then immediately violating it in the same wrap) is severe enough to warrant the prevention-shipped-same-PR pattern.

## Key decisions made

1. **Use `router.push` instead of `<Link>` in O8** (AC-3 deviation). Justified in verification.md AC-3 §Impl note + PR description.
2. **Single-job registry-update-check in `pr-dod.yml`** (vs adding a step to the existing slice-verification job). Separation of concerns; matches the file's existing "one job per gate" pattern.
3. **Hook re-reads disk in Edit mode** so a slice can keep the field declared elsewhere in the file while edits target a different region. Avoids false positives on local edits.
4. **Did NOT also fix the pre-existing `slice-verification` job's LABELS shell-interpolation** even though it has the same vulnerability pattern auto-review flagged on mine. Surgical-changes discipline; flagged as carry-over for a follow-up slice.
5. **Did NOT change the sign-up shell body copy** despite prototype-readiness flagging it. AC-3 mandates the exact text; persona itself said no fix required; deferred to canvas-porting slice.

## Bugs found + how they were fixed

- **`useRouter` invariant on O8 tests** — adding `useRouter()` to `O8.tsx` broke 10 of the existing `o8-canvas-as-source.test.tsx` cases ("invariant expected app router to be mounted"). Fix: added `vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))` at the top of the test file. Found a precedent in `tests/unit/app/dev/proto/[slug]/page.test.tsx`.
- **Shellspec field-detection RED on first run** — regex `^\*\*Journey:\*\*` failed when test fixtures used `\n` literal in single-quoted strings (jq received the backslash-n, not a newline). Fixed by wrapping fixtures in `$(printf '...\n...')` so newlines materialise before jq sees them. Pattern stolen from `comment-review.spec.sh` L183-207.
- **AC-5's literal filename `_spec.sh`** — shellspec rejected the file with `cannot be executed because it does not match the pattern '*.spec.sh'`. Fix: rename + update test-plan.md to match repo convention.

## Persona findings recorded (per CLAUDE.md §"Persona retain/drop metric")

| Persona | Findings count (round 1 + 2) | Summary | Issue the main conversation missed? |
|---|---|---|---|
| `reviewer-security` | 1 (round 1) | BLOCKING script-injection via direct `${{ toJson(...labels...) }}` interpolation in shell string. | Y — I copied the existing pattern from the same file's slice-verification job without auditing it for the same vulnerability class. |
| `reviewer-style` | 1 (round 1) | Non-blocking commenting: slice name in `describe(…)` test description (provenance-rot risk). | Y — applied CLAUDE.md §"Comments: WHY not WHAT" to code comments but not to test descriptions during TDD. |
| `reviewer-prototype-readiness` | 2 (1 round 1 + 1 round 2 note + 1 round 2 praise; net 1 new) | Round 1 suggestion: sign-up body exposes dev-path metadata (persona self-flagged no-fix-required). Round 2 note + praise reflect deferral acceptance + rename appreciation. | Mixed — main flagged the body text as canvas-pending placeholder per AC; persona's spotting it as a future-slice concern is additive but not a miss. |

## Next session priorities

**Recommended P1: `S-PROTO-section-confirm` (§6 Build phase confirm pattern).** Back on Phase 3 sequence per the AC-6 anchor + HANDOFF-74 L80-82 verbatim. After three off-sequence sessions (112-114) and this session's restoration slice, the next on-sequence surface per the original plan.

**On-sequence (HANDOFF-74 L80-82 verbatim):**

| # | Priority | Phase | Scope | Effort | Blocked? |
|---|---|---|---|---|---|
| 1 | **`S-PROTO-section-confirm`** | §6 Build | Build phase confirm pattern — next slice in Phase 3 sequence. Registry row L54 `per-section-confirm` is `spec-only` / `confidence: low` / `tags: high-uncertainty`. Open Q: "8 sections × multi-state — canvas-first vs prototype?" | Medium-Large | No |
| 2 | **`S-PROTO-ai-coach`** | §8 Settle | Settle phase AI coach. Registry row L74 is `spec-only` / `tags: ai-dependent, high-uncertainty`. Open Q: "Invocation pattern + conversational scope?" | Large | Soft-blocked on section-confirm shape |
| 3 | **`S-PROTO-share-flow`** | §7 Reconcile | Multi-actor share flow. Registry row L69 is `spec-only` / `tags: multi-actor, high-uncertainty`. Open Q: "Invite mechanics + real-time-vs-async?" | Large | Soft-blocked on Build state |

**Off-sequence (each carries `OFF-SEQUENCE because X` rationale per CLAUDE.md §"Phase 3 sequence" rule):**

| # | Priority | OFF-SEQUENCE rationale | Effort |
|---|---|---|---|
| 4 | **Mobile responsive marketing-landing** | OFF-SEQUENCE because opportunistic — answers registry row L19 open Q on the shipped marketing port | Medium |
| 5 | **Promote pre-auth-public shells to full canvases** | OFF-SEQUENCE because canvas-port readiness — 3 routes now `shell-built` per AC-1 with canvases extant | Small-Medium per route |
| 6 | **Sign-up canvas port** | OFF-SEQUENCE because dependency-of-AC-3 — addresses prototype-readiness persona's round-1 copy-clarity finding | Medium |
| 7 | **Welcome-tour migrate to SignedInHeader** | OFF-SEQUENCE because scope-add-on — surfaced in PR #221 prior session | Small |
| 8 | **A11y holistic pass (deferred from sessions 111-115)** | OFF-SEQUENCE because cross-cutting infrastructure — not surface-progression | Medium-Large |
| 9 | **`slice-verification` LABELS injection fix** | OFF-SEQUENCE because CI-infrastructure carry-over from this slice's auto-review round 1 | Tiny |

## §Status

Shipped session 116; PR #222 merged as `3b30a06`. Slice `S-PROTO-journey-restore` complete. Branch `claude/S-PROTO-journey-restore` can be deleted post-merge.
