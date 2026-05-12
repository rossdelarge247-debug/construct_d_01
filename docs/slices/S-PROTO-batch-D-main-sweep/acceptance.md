# S-PROTO-batch-D-main-sweep

**Category:** prototype

Phase 3 Batch D of the homogenisation programme scoped in `docs/slices/S-PROTO-cross-screen-homogenisation-audit/acceptance.md`. Resolves F-SM-03 (`<main>` wrapper missing on O1 and O2).

Pure structural fix — no visual change. O3-O8 already use `<main>` as their screen root; O1 + O2 used `<div className="flex flex-col min-h-screen w-full max-w-[480px] mx-auto pt-6">`. Swap root element from `<div>` to `<main>` (Tailwind classes preserved; layout identical).

Per CLAUDE.md §"Canvas-as-source (prototype default)": no `Linked canvas:`.

## Acceptance criteria

**AC-1: O1 root element swap.**
- `src/app/dev/proto/pre-signup-interview/screens/O1.tsx`:157 opening `<div className="...">` → `<main className="...">`.
- Matching close `</div>` (outermost) → `</main>`.
- Tailwind className preserved verbatim: `flex flex-col min-h-screen w-full max-w-[480px] mx-auto pt-6`.

**AC-2: O2 root element swap.**
- `src/app/dev/proto/pre-signup-interview/screens/O2.tsx`:222 opening `<div className="...">` → `<main className="...">`.
- Matching close `</div>` (outermost) → `</main>`.
- Tailwind className preserved.

**AC-3: Tests pass + typecheck clean.**
- `npx vitest run tests/unit/proto-pre-signup/` → 110/110 pass.
- `npx tsc --noEmit` → clean.

## Out of scope

- TopBar-outside-`<main>` restructure: the shared TopBar wraps in `<header>` (Batch A); inside O1-O8's `<main>`, the `<header>` element's implicit ARIA role degrades from "banner" to "generic". Moving TopBar before `<main>` to recover banner-role is a separate chrome-restructure pass (not scoped here).
- Hero / Footer / Token promotion — Batches B / C / F.

## Pre-flight

Adversarial-review budget: ~30L acceptance.md. Trivial.

Linked canvas: omitted (pure structural fix; no visual surface change).
