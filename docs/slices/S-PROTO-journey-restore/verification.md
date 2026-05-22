# S-PROTO-journey-restore — verification

## Per-AC evidence

**AC-1 · Registry refresh.** ✓

- `src/app/dev/proto/registry-schema.ts` L20: `'shell-built'` added to `statusSchema` between `'canvas-drafted'` and `'prototype-built'`. Position verified by `registry-schema.test.ts` ordering assertion (`shellIdx === canvasIdx + 1 && protoIdx === shellIdx + 1`).
- `src/app/dev/proto/registry.ts`: six rows updated — `marketing-landing` → `prototype-built`, `how-it-works` → `shell-built`, `pricing` → `shell-built`, `faq-trust` → `shell-built`, `welcome-tour` → `prototype-built`, `hub-day-7-state-f` → `prototype-built`. All carry `lastTouched: { session: 115, date: '2026-05-22' }` + `links.prototype` (and `links.slice` for `hub-day-7-state-f`).
- `tests/unit/app/dev/proto/registry-schema.test.ts`: existing "all 5 values" test extended to 6, ordering test added → 20/20 pass.
- `tests/unit/app/dev/proto/registry.test.ts`: 7 new per-row assertions (6 from AC-1 + 1 sign-up from AC-3) → 13/13 pass.
- `src/app/dev/proto/_components/StatusBadge.tsx` L7: `'shell-built': { emoji: '🔵', label: 'shell built' }` arm added to satisfy `Record<Status, …>` typecheck. No visual regression elsewhere (`tsc --noEmit` clean; 99/99 proto tests pass).

**AC-2 · Marketing-landing CTAs wired.** ✓

- `src/app/dev/proto/marketing-landing/page.tsx`: `import Link from 'next/link';` added; top-nav `Pricing` `<a href="#pricing">` → `<Link href="/dev/proto/pricing">`; top-nav `Start` `<a href="#start">` → `<Link href="/dev/proto/pre-signup-interview">`; top-nav `Sign in` kept as `<a href="#signin">` with prepended TODO comment per AC-2 literal text.
- All other `#hash` anchors preserved (verified by `start-cta-href.test.tsx` asserting Sign in still `#signin`, plus faq-accordion smoke remains GREEN).
- `tests/unit/proto-marketing-landing/start-cta-href.test.tsx` → 3/3 pass.
- `tests/unit/proto-marketing-landing/faq-accordion.test.tsx` (existing) → 4/4 pass — no regression.

**AC-3 · Pre-signup-interview O8 outbound + sign-up shell stub.** ✓ *(impl note)*

- `src/app/dev/proto/sign-up/page.tsx` new shell — H1 "Sign up", canvas-pending body, back-link `<Link href="/dev/proto">← Back to registry</Link>`; mirrors `faq-trust/page.tsx` chrome.
- `src/app/dev/proto/pre-signup-interview/screens/O8.tsx`: `import { useRouter } from 'next/navigation'`; `const router = useRouter()`; `onContinue={() => router.push('/dev/proto/sign-up')}` replaces the prior `onContinue={next}` (which was a no-op clamped at `SCREEN_COUNT`).
- **Impl note (AC-3 deviation):** AC-3 reads "Final O8 'Continue' CTA … (Next.js `Link`)". Footer's CTA is button-based; wrapping a `<button>` in `<Link>` produces invalid HTML (`<a><button>` nesting). Used `router.push` — equivalent Next.js navigation primitive (no full reload, same UX). Footer chrome preserved; single-file change scope. Flagging here rather than silently deviating.
- `src/app/dev/proto/registry.ts` `sign-up` row updated to `status: 'shell-built'`, `lastTouched.session: 115`, `links.prototype: 'src/app/dev/proto/sign-up/'`.
- `tests/unit/proto-sign-up/shell.test.tsx` → 3/3 pass.
- `tests/unit/proto-pre-signup/o8-canvas-as-source.test.tsx` extended with `vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))` → 10/10 pass (was failing post-router-introduction with "invariant expected app router to be mounted").

**AC-4 · DoD item 7 — registry-update gate.** ✓

- `.github/PULL_REQUEST_TEMPLATE.md` L27: 7th DoD item added with the verbatim AC-4 text.
- `.github/workflows/pr-dod.yml`: new job `registry-update-check` (separate from the existing `slice-verification` job) added. Detects surface page.tsx changes via `git diff --name-only base head | grep -E '^src/app/dev/proto/[^/]+/page\.tsx$' | grep -v '\[slug\]' | grep -v '_components'`. Pass if `src/app/dev/proto/registry.ts` is in the diff OR the PR carries the `no-registry-update` label. Failure message cites CLAUDE.md §"Engineering conventions" §"Definition of Done" item 7 + lists the two fix paths.

**AC-5 · `**Journey:**` field convention + author-time hook.** ✓ *(filename note)*

- `CLAUDE.md` L416-432 new sub-section §"Journey wiring" inside §"Visual direction": convention statement + verbatim field-format block + orphan declaration form + detection regex + enforcement note.
- `.claude/hooks/journey-declared.sh` (61L · executable · jq + grep): PostToolUse:Write|Edit on `docs/slices/S-PROTO-*/acceptance.md` only; checks the Write/Edit content's `new_string` for the regex `^\*\*Journey:\*\*[[:space:]]+`; for Edits, also re-reads disk to handle the case where the field already exists outside the patch window. Emits structured advisory (`systemMessage` + `hookSpecificOutput.additionalContext`) when absent; exits 0 always.
- `.claude/settings.json` L29-33: hook registered alongside `line-count`, `comment-review`, `spec-citation-quote` under PostToolUse:Write|Edit.
- `tests/shellspec/journey-declared.spec.sh` (renamed from acceptance.md's literal `_spec.sh` → repo's `.spec.sh` convention; matches `comment-review.spec.sh` precedent): 9 examples covering tool-name early-exit (1), scope (3), field detection (3), Edit-mode disk re-read (2). All pass under shellspec 0.28.1.
- This slice's own `acceptance.md` L4 carries `**Journey:** infrastructure-meta — …` (sentinel; satisfies the convention reflexively).

**AC-6 · Phase 3 sequence anchored in CLAUDE.md.** ✓

- `CLAUDE.md` L26-36 new top-level §"Phase 3 sequence" inserted after §"North star" + before §"Session startup":
  - Block-quote of `docs/HANDOFF-SESSION-74.md` L80-82 (the "P1 (after P0): S-PROTO-pre-signup-interview" + "P2+: section-confirm · ai-coach · share-flow" sequence).
  - Rule: any off-sequence Phase 3 work must be flagged in `SESSION-CONTEXT.md`'s session priorities table with an explicit `OFF-SEQUENCE because X` note.
  - §Status footer at L36 notes sessions 112-114 ran off-sequence (marketing-landing, welcome-tour, dashboard ports); session 115 restores discipline via this slice; next planned is `S-PROTO-section-confirm` (§6 Build).

## Preview-deploy verification

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | Pending user-walk | Three surfaces user-walkable: `/dev/proto/marketing-landing` (Pricing + Start CTAs click through), `/dev/proto/pre-signup-interview` (O8 Continue → /sign-up), `/dev/proto/sign-up` (new shell). Sandbox can't reach Vercel preview. |
| Edge cases | N/A | Static href changes + shell page; no stateful UI introduced. |
| `prefers-reduced-motion` | N/A | No motion introduced. |
| Keyboard-only | Pending user-walk | Three new links: AC-2 nav (2), AC-3 O8 CTA + shell back-link (2). Tab order inherits surrounding shell. |
| Mobile viewport | Pending user-walk | No new layout chrome; shell mirrors faq-trust constraints. |
| Screen-reader | Pending user-walk | Sign-up shell uses `<h1>` + `<p>` + `<nav>`/`<Link>` semantic landmarks per faq-trust precedent. |

## Adversarial review

Surface-by-surface adversarial review in `security.md`. No concerns surfaced; no deferrals.

## Status

All 6 ACs implemented + tests pass locally (99/99 proto suite, 9/9 shellspec, `tsc --noEmit` clean). Pending: preview-deploy walk + PR open + CI green + reviewer + merge.
