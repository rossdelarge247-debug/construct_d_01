# S-PROTO-batch-D-main-sweep — verification

## Per-AC evidence

**AC-1 — O1 root element swap.**
- Opening tag changed at `src/app/dev/proto/pre-signup-interview/screens/O1.tsx:157`: `<div className="..."` → `<main className="..."`.
- Closing tag changed at file tail: `</div>` → `</main>` (outermost only; inner `</div>` elements preserved).
- Tailwind className unchanged: `flex flex-col min-h-screen w-full max-w-[480px] mx-auto pt-6`.

**AC-2 — O2 root element swap.**
- Opening tag changed at `src/app/dev/proto/pre-signup-interview/screens/O2.tsx:222`: `<div className="..."` → `<main className="..."`.
- Closing tag changed at file tail: `</div>` → `</main>`.

**AC-3 — Tests pass + typecheck clean.**
- `npx vitest run tests/unit/proto-pre-signup/` → 110/110 pass across 12 test files.
- `npx tsc --noEmit` → clean.

## Architectural deferrals

- **Banner-role recovery for TopBar**: with TopBar's `<header>` nested inside `<main>`, its ARIA role is "generic" not "banner". Recovering banner-role requires moving TopBar before `<main>` across all 8 screens — a chrome-restructure deferred to a follow-up pass.

## DoD-prototype-short-form

1. ACs met ✓.
2. Tests passing ✓.
3. Adversarial review: pending PR-open multi-agent fan-out.
4. Preview-deploy: no visual surface change; trivially passes.
