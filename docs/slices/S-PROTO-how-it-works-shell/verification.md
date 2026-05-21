# S-PROTO-how-it-works-shell — verification

## Per-AC evidence

**AC-1.** `src/app/dev/proto/how-it-works/page.tsx` exists. L1 `'use client'`; L34 `export default function HowItWorksPage()`. Next.js App Router precedence: literal-slug subroute beats `[slug]` stub.

**AC-2.** L57-71 `<header>` carries `<h1>How it works</h1>` (serif, 40px, semibold, letter-spacing -0.02em) + `<p>` with sub text `"Decouple — the complete picture, end-to-end."`.

**AC-3.** L6-31 `STEPS` const declares 4 entries (`01 Disclose / 02 Reconcile / 03 Settle / 04 Finalise`); L73-110 `<ol>` map renders one `<li>` per step with number + kicker + title + body.

**AC-4.** L45-52 `<nav>` carries `<Link href="/dev/proto">← back to hub</Link>`.

**AC-5.** L113-121 `<footer>` carries the placeholder-note text.

**AC-6.** Grep `grep -E "'#[0-9A-Fa-f]" src/app/dev/proto/how-it-works/page.tsx` returns zero matches. All colour / font / size references go through `tokens.*`.

**AC-7.** `tests/unit/proto-how-it-works/shell.test.tsx` — 4 specs (title · sub · 4 step kickers · back-to-hub link). Run: `npm test -- tests/unit/proto-how-it-works/shell.test.tsx`.

## Preview-deploy verification

Six-dimension rubric per `docs/workspace-spec/72a-preview-deploy-rubric.md`. Shell page = static markup; most dimensions are formal-pass.

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | Pending user-walk | Vercel sandbox unreachable from agent; user to walk `/dev/proto/how-it-works`. |
| Edge cases | N/A | No stateful UI; no edge cases. |
| `prefers-reduced-motion` | N/A | No motion in shell. |
| Keyboard-only | Pending user-walk | Tab order: nav link → step content → footer; all native elements. |
| Mobile viewport | Pending user-walk | `max-w-3xl` constraint; no responsive breakpoints. Note layout concerns for follow-up canvas-port slice. |
| Screen-reader | Pending user-walk | Semantic markup (`<nav>` / `<header>` / `<h1>` / `<h2>` / `<ol>` / `<li>` / `<footer>`). |

## Adversarial review

Shell-only page; no logic surface; no user input; no external calls. Adversarial review waived per AC-3 footnote — concrete review yields no meaningful findings on static markup with token-only styling. Real review fires when canvas content lands in the follow-up slice.

## Status

Shipped after tests pass + commit.
